/**
 * Discord RPC Client via IPC (no external npm dependency)
 * Connects to Discord desktop client via named pipe / unix socket
 * and sends rich presence activities.
 *
 * Protocol reference: https://discord.com/developers/docs/topics/rpc
 */

import * as net from "net";
import * as os from "os";
import { PresenceActivity } from "./types";

const OPCode = {
  HANDSHAKE: 0,
  FRAME: 1,
  CLOSE: 2,
  PING: 3,
  PONG: 4,
} as const;

type OPCode = (typeof OPCode)[keyof typeof OPCode];

interface IPCMessage {
  cmd?: string;
  evt?: string;
  nonce?: string;
  data?: unknown;
  args?: unknown;
}

function encodePacket(op: number, data: IPCMessage): Buffer {
  const json = JSON.stringify(data);
  const buf = Buffer.alloc(8 + Buffer.byteLength(json));
  buf.writeUInt32LE(op, 0);
  buf.writeUInt32LE(Buffer.byteLength(json), 4);
  buf.write(json, 8, "utf8");
  return buf;
}

function getPipePath(id: number): string {
  if (process.platform === "win32") {
    return `\\\\?\\pipe\\discord-ipc-${id}`;
  }
  const snap = process.env.SNAP_USER_DATA;
  const xdg = process.env.XDG_RUNTIME_DIR;
  const tmp = process.env.TMPDIR ?? process.env.TMP ?? process.env.TEMP ?? "/tmp";
  const prefix = snap ?? xdg ?? tmp;
  return `${prefix}/discord-ipc-${id}`;
}

export class DiscordIPCClient {
  private socket: net.Socket | null = null;
  private clientId: string;
  private connected = false;
  private pid: number;
  private _nonceCounter = 0;
  private _readBuffer = Buffer.alloc(0);
  private _onConnectCallbacks: Array<() => void> = [];
  private _onErrorCallbacks: Array<(err: Error) => void> = [];
  private _onDisconnectCallbacks: Array<() => void> = [];
  private _debug: boolean;

  constructor(clientId: string, debug = false) {
    this.clientId = clientId;
    this.pid = process.pid;
    this._debug = debug;
  }

  private log(...args: unknown[]) {
    if (this._debug) console.log("[RichPresence IPC]", ...args);
  }

  private nonce(): string {
    return `rp-${Date.now()}-${this._nonceCounter++}`;
  }

  onConnect(cb: () => void) { this._onConnectCallbacks.push(cb); }
  onError(cb: (err: Error) => void) { this._onErrorCallbacks.push(cb); }
  onDisconnect(cb: () => void) { this._onDisconnectCallbacks.push(cb); }

  isConnected(): boolean { return this.connected; }

  async connect(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      try {
        await this._tryConnect(i);
        return;
      } catch {
        // try next pipe id
      }
    }
    throw new Error("Could not connect to Discord IPC. Is Discord running?");
  }

  private _tryConnect(pipeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = getPipePath(pipeId);
      const socket = net.createConnection(path);

      const onError = (err: Error) => {
        socket.destroy();
        reject(err);
      };

      socket.once("error", onError);

      socket.once("connect", () => {
        socket.removeListener("error", onError);
        this.socket = socket;
        this._setupSocket();

        // Send handshake
        socket.write(
          encodePacket(OPCode.HANDSHAKE, {
            v: 1,
            client_id: this.clientId,
          } as any)
        );

        // Wait for READY event
        const readyTimeout = setTimeout(() => {
          reject(new Error("Discord handshake timeout"));
        }, 5000);

        const readyHandler = (msg: IPCMessage) => {
          if (msg.evt === "READY") {
            clearTimeout(readyTimeout);
            this.connected = true;
            this.log("Connected to Discord RPC");
            this._onConnectCallbacks.forEach((cb) => cb());
            resolve();
          } else if (msg.evt === "ERROR") {
            clearTimeout(readyTimeout);
            reject(new Error("Discord RPC error during handshake"));
          }
        };

        (socket as any).__rpcReadyHandler = readyHandler;
        resolve = () => {}; // prevent double resolve
        reject = () => {};
      });
    });
  }

  private _setupSocket() {
    if (!this.socket) return;

    this.socket.on("data", (chunk: Buffer) => {
      this._readBuffer = Buffer.concat([this._readBuffer, chunk]);
      this._processBuffer();
    });

    this.socket.on("close", () => {
      this.connected = false;
      this.socket = null;
      this.log("Disconnected from Discord");
      this._onDisconnectCallbacks.forEach((cb) => cb());
    });

    this.socket.on("error", (err: Error) => {
      this.log("Socket error:", err.message);
      this._onErrorCallbacks.forEach((cb) => cb(err));
    });
  }

  private _processBuffer() {
    while (this._readBuffer.length >= 8) {
      const op = this._readBuffer.readUInt32LE(0);
      const len = this._readBuffer.readUInt32LE(4);

      if (this._readBuffer.length < 8 + len) break;

      const json = this._readBuffer.slice(8, 8 + len).toString("utf8");
      this._readBuffer = this._readBuffer.slice(8 + len);

      try {
        const msg: IPCMessage = JSON.parse(json);
        this.log("Received:", op, msg.cmd, msg.evt);

        // Fire ready handler if attached
        const readyHandler = (this.socket as any)?.__rpcReadyHandler;
        if (readyHandler) {
          readyHandler(msg);
          if (msg.evt === "READY") {
            delete (this.socket as any).__rpcReadyHandler;
          }
        }
      } catch (e) {
        this.log("Failed to parse message:", e);
      }
    }
  }

  async setActivity(activity: PresenceActivity): Promise<void> {
    if (!this.connected || !this.socket) {
      throw new Error("Not connected to Discord");
    }

    const args: Record<string, unknown> = {
      pid: this.pid,
      activity: this._buildActivity(activity),
    };

    const msg: IPCMessage = {
      cmd: "SET_ACTIVITY",
      args,
      nonce: this.nonce(),
    };

    this.log("Setting activity:", JSON.stringify(args.activity, null, 2));
    this.socket.write(encodePacket(OPCode.FRAME, msg));
  }

  async clearActivity(): Promise<void> {
    if (!this.connected || !this.socket) return;
    const msg: IPCMessage = {
      cmd: "SET_ACTIVITY",
      args: { pid: this.pid, activity: null },
      nonce: this.nonce(),
    };
    this.socket.write(encodePacket(OPCode.FRAME, msg));
  }

  private _buildActivity(activity: PresenceActivity): Record<string, unknown> {
    const a: Record<string, unknown> = {};

    if (activity.details) a.details = activity.details.slice(0, 128);
    if (activity.state) a.state = activity.state.slice(0, 128);

    if (activity.startTimestamp || activity.endTimestamp) {
      const ts: Record<string, number> = {};
      if (activity.startTimestamp) ts.start = Math.floor(activity.startTimestamp / 1000);
      if (activity.endTimestamp) ts.end = Math.floor(activity.endTimestamp / 1000);
      a.timestamps = ts;
    }

    if (activity.largeImageKey || activity.largeImageText) {
      const assets: Record<string, string> = {};
      if (activity.largeImageKey) assets.large_image = activity.largeImageKey;
      if (activity.largeImageText) assets.large_text = activity.largeImageText.slice(0, 128);
      if (activity.smallImageKey) assets.small_image = activity.smallImageKey;
      if (activity.smallImageText) assets.small_text = activity.smallImageText.slice(0, 128);
      a.assets = assets;
    }

    if (activity.buttons && activity.buttons.length > 0) {
      a.buttons = activity.buttons
        .filter((b) => b.label && b.url)
        .slice(0, 2)
        .map((b) => ({ label: b.label.slice(0, 32), url: b.url }));
    }

    a.instance = false;

    return a;
  }

  disconnect() {
    if (this.socket) {
      try {
        this.socket.write(encodePacket(OPCode.CLOSE, {}));
        this.socket.destroy();
      } catch {}
      this.socket = null;
    }
    this.connected = false;
  }
}
