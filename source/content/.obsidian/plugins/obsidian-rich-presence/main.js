var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => RichPresencePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/discord-ipc.ts
var net = __toESM(require("net"));
var OPCode = {
  HANDSHAKE: 0,
  FRAME: 1,
  CLOSE: 2,
  PING: 3,
  PONG: 4
};
function encodePacket(op, data) {
  const json = JSON.stringify(data);
  const buf = Buffer.alloc(8 + Buffer.byteLength(json));
  buf.writeUInt32LE(op, 0);
  buf.writeUInt32LE(Buffer.byteLength(json), 4);
  buf.write(json, 8, "utf8");
  return buf;
}
function getPipePath(id) {
  var _a, _b, _c, _d;
  if (process.platform === "win32") {
    return `\\\\?\\pipe\\discord-ipc-${id}`;
  }
  const snap = process.env.SNAP_USER_DATA;
  const xdg = process.env.XDG_RUNTIME_DIR;
  const tmp = (_c = (_b = (_a = process.env.TMPDIR) != null ? _a : process.env.TMP) != null ? _b : process.env.TEMP) != null ? _c : "/tmp";
  const prefix = (_d = snap != null ? snap : xdg) != null ? _d : tmp;
  return `${prefix}/discord-ipc-${id}`;
}
var DiscordIPCClient = class {
  constructor(clientId, debug = false) {
    this.socket = null;
    this.connected = false;
    this._nonceCounter = 0;
    this._readBuffer = Buffer.alloc(0);
    this._onConnectCallbacks = [];
    this._onErrorCallbacks = [];
    this._onDisconnectCallbacks = [];
    this.clientId = clientId;
    this.pid = process.pid;
    this._debug = debug;
  }
  log(...args) {
    if (this._debug) console.log("[RichPresence IPC]", ...args);
  }
  nonce() {
    return `rp-${Date.now()}-${this._nonceCounter++}`;
  }
  onConnect(cb) {
    this._onConnectCallbacks.push(cb);
  }
  onError(cb) {
    this._onErrorCallbacks.push(cb);
  }
  onDisconnect(cb) {
    this._onDisconnectCallbacks.push(cb);
  }
  isConnected() {
    return this.connected;
  }
  async connect() {
    for (let i = 0; i < 10; i++) {
      try {
        await this._tryConnect(i);
        return;
      } catch (e) {
      }
    }
    throw new Error("Could not connect to Discord IPC. Is Discord running?");
  }
  _tryConnect(pipeId) {
    return new Promise((resolve, reject) => {
      const path = getPipePath(pipeId);
      const socket = net.createConnection(path);
      const onError = (err) => {
        socket.destroy();
        reject(err);
      };
      socket.once("error", onError);
      socket.once("connect", () => {
        socket.removeListener("error", onError);
        this.socket = socket;
        this._setupSocket();
        socket.write(
          encodePacket(OPCode.HANDSHAKE, {
            v: 1,
            client_id: this.clientId
          })
        );
        const readyTimeout = setTimeout(() => {
          reject(new Error("Discord handshake timeout"));
        }, 5e3);
        const readyHandler = (msg) => {
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
        socket.__rpcReadyHandler = readyHandler;
        resolve = () => {
        };
        reject = () => {
        };
      });
    });
  }
  _setupSocket() {
    if (!this.socket) return;
    this.socket.on("data", (chunk) => {
      this._readBuffer = Buffer.concat([this._readBuffer, chunk]);
      this._processBuffer();
    });
    this.socket.on("close", () => {
      this.connected = false;
      this.socket = null;
      this.log("Disconnected from Discord");
      this._onDisconnectCallbacks.forEach((cb) => cb());
    });
    this.socket.on("error", (err) => {
      this.log("Socket error:", err.message);
      this._onErrorCallbacks.forEach((cb) => cb(err));
    });
  }
  _processBuffer() {
    var _a;
    while (this._readBuffer.length >= 8) {
      const op = this._readBuffer.readUInt32LE(0);
      const len = this._readBuffer.readUInt32LE(4);
      if (this._readBuffer.length < 8 + len) break;
      const json = this._readBuffer.slice(8, 8 + len).toString("utf8");
      this._readBuffer = this._readBuffer.slice(8 + len);
      try {
        const msg = JSON.parse(json);
        this.log("Received:", op, msg.cmd, msg.evt);
        const readyHandler = (_a = this.socket) == null ? void 0 : _a.__rpcReadyHandler;
        if (readyHandler) {
          readyHandler(msg);
          if (msg.evt === "READY") {
            delete this.socket.__rpcReadyHandler;
          }
        }
      } catch (e) {
        this.log("Failed to parse message:", e);
      }
    }
  }
  async setActivity(activity) {
    if (!this.connected || !this.socket) {
      throw new Error("Not connected to Discord");
    }
    const args = {
      pid: this.pid,
      activity: this._buildActivity(activity)
    };
    const msg = {
      cmd: "SET_ACTIVITY",
      args,
      nonce: this.nonce()
    };
    this.log("Setting activity:", JSON.stringify(args.activity, null, 2));
    this.socket.write(encodePacket(OPCode.FRAME, msg));
  }
  async clearActivity() {
    if (!this.connected || !this.socket) return;
    const msg = {
      cmd: "SET_ACTIVITY",
      args: { pid: this.pid, activity: null },
      nonce: this.nonce()
    };
    this.socket.write(encodePacket(OPCode.FRAME, msg));
  }
  _buildActivity(activity) {
    const a = {};
    if (activity.details) a.details = activity.details.slice(0, 128);
    if (activity.state) a.state = activity.state.slice(0, 128);
    if (activity.startTimestamp || activity.endTimestamp) {
      const ts = {};
      if (activity.startTimestamp) ts.start = Math.floor(activity.startTimestamp / 1e3);
      if (activity.endTimestamp) ts.end = Math.floor(activity.endTimestamp / 1e3);
      a.timestamps = ts;
    }
    if (activity.largeImageKey || activity.largeImageText) {
      const assets = {};
      if (activity.largeImageKey) assets.large_image = activity.largeImageKey;
      if (activity.largeImageText) assets.large_text = activity.largeImageText.slice(0, 128);
      if (activity.smallImageKey) assets.small_image = activity.smallImageKey;
      if (activity.smallImageText) assets.small_text = activity.smallImageText.slice(0, 128);
      a.assets = assets;
    }
    if (activity.buttons && activity.buttons.length > 0) {
      a.buttons = activity.buttons.filter((b) => b.label && b.url).slice(0, 2).map((b) => ({ label: b.label.slice(0, 32), url: b.url }));
    }
    a.instance = false;
    return a;
  }
  disconnect() {
    if (this.socket) {
      try {
        this.socket.write(encodePacket(OPCode.CLOSE, {}));
        this.socket.destroy();
      } catch (e) {
      }
      this.socket = null;
    }
    this.connected = false;
  }
};

// src/config-loader.ts
var import_obsidian = require("obsidian");
async function loadVaultConfig(app, settings) {
  var _a;
  const configPath = (0, import_obsidian.normalizePath)(settings.configFileName);
  const file = app.vault.getAbstractFileByPath(configPath);
  let vaultConfig = {};
  if (file instanceof import_obsidian.TFile) {
    try {
      const raw = await app.vault.read(file);
      const parsed = JSON.parse(stripCommentKeys(raw));
      vaultConfig = parsed;
    } catch (e) {
      console.error("[RichPresence] Failed to parse rich-presence.json:", e);
    }
  }
  const vaultName = app.vault.getName();
  const vaultOverride = (_a = settings.vaultOverrides[vaultName]) != null ? _a : {};
  return deepMerge(
    deepMerge(settings.globalDefaults, vaultConfig),
    vaultOverride
  );
}
function stripCommentKeys(json) {
  return json.replace(/"_[^"]*"\s*:\s*(?:"[^"]*"|\d+|true|false|null)\s*,?\s*/g, "");
}
function deepMerge(base, override) {
  const result = { ...base };
  for (const key in override) {
    const val = override[key];
    if (val === void 0 || val === null) continue;
    if (typeof val === "object" && !Array.isArray(val) && typeof result[key] === "object" && result[key] !== null && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
}
function watchConfigFile(app, configFileName, onChange) {
  const handler = app.vault.on("modify", (file) => {
    if (file.path === (0, import_obsidian.normalizePath)(configFileName)) {
      onChange();
    }
  });
  return () => {
    app.vault.offref(handler);
  };
}
async function createDefaultConfigFile(app, configFileName) {
  const configPath = (0, import_obsidian.normalizePath)(configFileName);
  const existing = app.vault.getAbstractFileByPath(configPath);
  if (!existing) {
    const defaultContent = JSON.stringify(DEFAULT_JSON_CONFIG, null, 2);
    await app.vault.create(configPath, defaultContent);
  }
}
var DEFAULT_JSON_CONFIG = {
  "_comment": "Rich Presence configuration. Place at vault root as rich-presence.json",
  "_docs": "Available variables: {file_name}, {file_name_ext}, {file_path}, {file_ext}, {vault_name}, {vault_path}, {file_count}, {note_count}, {folder}, {time}, {date}, {session_time}, {file_time}, {custom.KEY}",
  "enabled": true,
  "display": {
    "details": "\u{1F4DD} {file_name}",
    "state": "\u{1F5C2}\uFE0F {vault_name}  \xB7  {note_count} notes",
    "largeImageText": "Obsidian \u2014 {vault_name}",
    "smallImageText": "{vault_name}"
  },
  "largeIcon": {
    "_comment": "type: 'url' for external image, 'asset' for file in vault, 'key' for Discord app asset",
    "type": "url",
    "url": "https://obsidian.md/images/obsidian-logo-gradient.png",
    "assetPath": ".rich-presence/app-icon.png",
    "key": "obsidian"
  },
  "smallIcon": {
    "_comment": "Small icon shown bottom-right of large icon. Use for per-project branding.",
    "type": "",
    "url": "",
    "assetPath": ".rich-presence/vault-icon.png",
    "key": "",
    "fallbackEmoji": "\u{1F4D3}"
  },
  "timestamps": {
    "enabled": true,
    "mode": "session"
  },
  "buttons": [
    {
      "enabled": false,
      "label": "My Notes",
      "url": "https://example.com"
    },
    {
      "enabled": false,
      "label": "My GitHub",
      "url": "https://github.com"
    }
  ],
  "privacyMode": {
    "enabled": false,
    "hideFileName": false,
    "hideVaultName": false,
    "hiddenFileName": "a secret file...",
    "hiddenVaultName": "a private vault"
  },
  "variables": {
    "_comment": "Define custom variables accessible as {custom.KEY}",
    "project": "My Project",
    "status": "Writing"
  },
  "fileTypeIcons": {
    "_comment": "Map file extensions to icon URLs or Discord asset keys for small icon",
    "md": "",
    "canvas": "",
    "pdf": "",
    "png": "",
    "jpg": ""
  },
  "idleSettings": {
    "enabled": true,
    "timeoutMinutes": 10,
    "idleState": "\u{1F4A4} Away",
    "idleDetails": "Idle \u2014 {vault_name}"
  },
  "updateInterval": 15
};

// src/variables.ts
function resolveVariables(template, ctx) {
  var _a, _b, _c, _d, _e, _f;
  if (!template) return "";
  const { app, file, vaultConfig, sessionStart, fileOpenTime } = ctx;
  const vault = app.vault;
  const now = Date.now();
  const allFiles = vault.getFiles();
  const noteFiles = allFiles.filter((f) => f.extension === "md");
  const dateObj = new Date(now);
  const pad = (n) => String(n).padStart(2, "0");
  const timeStr = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
  function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1e3);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor(totalSec % 3600 / 60);
    if (hours > 0) return `${hours}h ${pad(mins)}m`;
    return `${mins}m`;
  }
  const builtins = {
    file_name: file ? file.basename : "No file open",
    file_name_ext: file ? file.name : "No file open",
    file_path: file ? file.path : "",
    file_ext: file ? file.extension : "",
    vault_name: vault.getName(),
    vault_path: (_c = (_b = (_a = vault.adapter).getBasePath) == null ? void 0 : _b.call(_a)) != null ? _c : "",
    file_count: String(allFiles.length),
    note_count: String(noteFiles.length),
    folder: file ? (_e = (_d = file.parent) == null ? void 0 : _d.name) != null ? _e : "/" : "",
    time: timeStr,
    date: dateStr,
    session_time: formatDuration(now - sessionStart),
    file_time: fileOpenTime ? formatDuration(now - fileOpenTime) : "0m"
  };
  const customVars = (_f = vaultConfig.variables) != null ? _f : {};
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    var _a2;
    key = key.trim();
    if (key.startsWith("custom.")) {
      const customKey = key.slice(7);
      return (_a2 = customVars[customKey]) != null ? _a2 : match;
    }
    if (key in builtins) return builtins[key];
    return match;
  });
}
function getFileTypeIcon(file, vaultConfig) {
  var _a, _b;
  if (!file) return null;
  const ext = file.extension.toLowerCase();
  const map = (_a = vaultConfig.fileTypeIcons) != null ? _a : {};
  return (_b = map[ext]) != null ? _b : null;
}

// src/settings-tab.ts
var import_obsidian2 = require("obsidian");
var RichPresenceSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    var _a, _b, _c, _d, _e;
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "\u26A1 Rich Presence" });
    containerEl.createEl("p", {
      text: "Show your Obsidian activity on Discord with full customization. Configure text, icons, and more via rich-presence.json in your vault root.",
      cls: "setting-item-description"
    });
    containerEl.createEl("h2", { text: "Connection" });
    new import_obsidian2.Setting(containerEl).setName("Discord Application Client ID").setDesc(
      createFragment((f) => {
        f.appendText("Your Discord Application's Client ID. Create one at ");
        f.createEl("a", {
          text: "discord.com/developers/applications",
          href: "https://discord.com/developers/applications"
        });
        f.appendText(". This is required for Rich Presence to work.");
      })
    ).addText(
      (text) => text.setPlaceholder("1234567890123456789").setValue(this.plugin.settings.clientId).onChange(async (value) => {
        this.plugin.settings.clientId = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Connection status").setDesc(((_a = this.plugin.ipcClient) == null ? void 0 : _a.isConnected()) ? "\u2705 Connected to Discord" : "\u274C Not connected to Discord").addButton(
      (btn) => btn.setButtonText("Reconnect").setCta().onClick(async () => {
        await this.plugin.reconnect();
        this.display();
      })
    ).addButton(
      (btn) => btn.setButtonText("Disconnect").onClick(() => {
        this.plugin.disconnect();
        this.display();
      })
    );
    containerEl.createEl("h2", { text: "Configuration File" });
    new import_obsidian2.Setting(containerEl).setName("Config file name").setDesc(
      "The name of the JSON config file inside your vault root. Default: rich-presence.json"
    ).addText(
      (text) => text.setPlaceholder("rich-presence.json").setValue(this.plugin.settings.configFileName).onChange(async (value) => {
        this.plugin.settings.configFileName = value.trim() || "rich-presence.json";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Create default config file").setDesc(
      "Creates a rich-presence.json in your vault root with all available options documented."
    ).addButton(
      (btn) => btn.setButtonText("Create file").onClick(async () => {
        await this.plugin.createDefaultConfig();
        new import_obsidian2.Notice("\u2705 Created rich-presence.json in vault root!");
      })
    ).addButton(
      (btn) => btn.setButtonText("Open file").onClick(async () => {
        const file = this.app.vault.getAbstractFileByPath(
          this.plugin.settings.configFileName
        );
        if (file) {
          this.app.workspace.openLinkText(
            this.plugin.settings.configFileName,
            "",
            true
          );
        } else {
          new import_obsidian2.Notice("Config file not found. Create it first.");
        }
      })
    );
    containerEl.createEl("h2", { text: "Available Variables" });
    const varTable = containerEl.createEl("table", { cls: "rp-var-table" });
    varTable.style.width = "100%";
    varTable.style.borderCollapse = "collapse";
    varTable.style.fontSize = "12px";
    const vars = [
      ["{file_name}", "Active file name (no extension)"],
      ["{file_name_ext}", "Active file name with extension"],
      ["{file_path}", "Full path from vault root"],
      ["{file_ext}", "File extension (e.g. md, canvas)"],
      ["{vault_name}", "Vault name"],
      ["{vault_path}", "Absolute path to vault on disk"],
      ["{file_count}", "Total file count in vault"],
      ["{note_count}", "Markdown note count"],
      ["{folder}", "Parent folder of active file"],
      ["{time}", "Current time (HH:MM)"],
      ["{date}", "Current date (YYYY-MM-DD)"],
      ["{session_time}", "Time since Obsidian opened"],
      ["{file_time}", "Time since current file opened"],
      ["{custom.KEY}", "Your custom variable from variables block"]
    ];
    const thead = varTable.createEl("thead");
    const headerRow = thead.createEl("tr");
    headerRow.createEl("th", { text: "Variable" }).style.textAlign = "left";
    headerRow.createEl("th", { text: "Description" }).style.textAlign = "left";
    const tbody = varTable.createEl("tbody");
    vars.forEach(([varName, desc], i) => {
      const row = tbody.createEl("tr");
      row.style.background = i % 2 === 0 ? "var(--background-secondary)" : "";
      const tdVar = row.createEl("td", { text: varName });
      tdVar.style.fontFamily = "var(--font-monospace)";
      tdVar.style.padding = "4px 8px";
      tdVar.style.color = "var(--color-accent)";
      const tdDesc = row.createEl("td", { text: desc });
      tdDesc.style.padding = "4px 8px";
    });
    containerEl.createEl("h2", { text: "Global Defaults" });
    containerEl.createEl("p", {
      text: "These defaults are used when no rich-presence.json is found, or to fill in missing values. Per-vault JSON config overrides these.",
      cls: "setting-item-description"
    });
    new import_obsidian2.Setting(containerEl).setName("Details text").setDesc("Top line of the rich presence (supports variables)").addText(
      (text) => {
        var _a2, _b2;
        return text.setPlaceholder("\u{1F4DD} {file_name}").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.display) == null ? void 0 : _a2.details) != null ? _b2 : "").onChange(async (value) => {
          this.plugin.settings.globalDefaults.display = {
            ...this.plugin.settings.globalDefaults.display,
            details: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian2.Setting(containerEl).setName("State text").setDesc("Second line of the rich presence (supports variables)").addText(
      (text) => {
        var _a2, _b2;
        return text.setPlaceholder("\u{1F5C2}\uFE0F {vault_name}").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.display) == null ? void 0 : _a2.state) != null ? _b2 : "").onChange(async (value) => {
          this.plugin.settings.globalDefaults.display = {
            ...this.plugin.settings.globalDefaults.display,
            state: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian2.Setting(containerEl).setName("Large icon tooltip").setDesc("Hover text for the large icon (supports variables)").addText(
      (text) => {
        var _a2, _b2;
        return text.setPlaceholder("Obsidian \u2014 {vault_name}").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.display) == null ? void 0 : _a2.largeImageText) != null ? _b2 : "").onChange(async (value) => {
          this.plugin.settings.globalDefaults.display = {
            ...this.plugin.settings.globalDefaults.display,
            largeImageText: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian2.Setting(containerEl).setName("Small icon tooltip").setDesc("Hover text for the small icon (supports variables)").addText(
      (text) => {
        var _a2, _b2;
        return text.setPlaceholder("{vault_name}").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.display) == null ? void 0 : _a2.smallImageText) != null ? _b2 : "").onChange(async (value) => {
          this.plugin.settings.globalDefaults.display = {
            ...this.plugin.settings.globalDefaults.display,
            smallImageText: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    containerEl.createEl("h3", { text: "Large Icon (App Icon)" });
    new import_obsidian2.Setting(containerEl).setName("Large icon type").setDesc("How to provide the large icon image").addDropdown(
      (dd) => {
        var _a2, _b2;
        return dd.addOption("key", "Discord Asset Key").addOption("url", "External URL").addOption("asset", "File in Vault").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.largeIcon) == null ? void 0 : _a2.type) != null ? _b2 : "key").onChange(async (value) => {
          this.plugin.settings.globalDefaults.largeIcon = {
            ...this.plugin.settings.globalDefaults.largeIcon,
            type: value
          };
          await this.plugin.saveSettings();
          this.display();
        });
      }
    );
    const largeIconType = (_c = (_b = this.plugin.settings.globalDefaults.largeIcon) == null ? void 0 : _b.type) != null ? _c : "key";
    if (largeIconType === "url") {
      new import_obsidian2.Setting(containerEl).setName("Large icon URL").setDesc("Direct URL to an image (PNG/JPG/GIF, max 1024px)").addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder("https://example.com/icon.png").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.largeIcon) == null ? void 0 : _a2.url) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.largeIcon = {
              ...this.plugin.settings.globalDefaults.largeIcon,
              url: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    } else if (largeIconType === "asset") {
      new import_obsidian2.Setting(containerEl).setName("Large icon vault path").setDesc("Path to an image file inside your vault (e.g. .rich-presence/app-icon.png)").addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder(".rich-presence/app-icon.png").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.largeIcon) == null ? void 0 : _a2.assetPath) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.largeIcon = {
              ...this.plugin.settings.globalDefaults.largeIcon,
              assetPath: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    } else {
      new import_obsidian2.Setting(containerEl).setName("Discord asset key").setDesc(
        createFragment((f) => {
          f.appendText("The asset key name from your ");
          f.createEl("a", {
            text: "Discord Application",
            href: "https://discord.com/developers/applications"
          });
          f.appendText(" Rich Presence assets. Upload images there first.");
        })
      ).addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder("obsidian").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.largeIcon) == null ? void 0 : _a2.key) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.largeIcon = {
              ...this.plugin.settings.globalDefaults.largeIcon,
              key: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    }
    containerEl.createEl("h3", { text: "Small Icon (Project Icon)" });
    new import_obsidian2.Setting(containerEl).setName("Small icon type").setDesc("How to provide the small overlay icon (leave blank to hide)").addDropdown(
      (dd) => {
        var _a2, _b2;
        return dd.addOption("", "None (hidden)").addOption("key", "Discord Asset Key").addOption("url", "External URL").addOption("asset", "File in Vault").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.smallIcon) == null ? void 0 : _a2.type) != null ? _b2 : "").onChange(async (value) => {
          this.plugin.settings.globalDefaults.smallIcon = {
            ...this.plugin.settings.globalDefaults.smallIcon,
            type: value
          };
          await this.plugin.saveSettings();
          this.display();
        });
      }
    );
    const smallIconType = (_e = (_d = this.plugin.settings.globalDefaults.smallIcon) == null ? void 0 : _d.type) != null ? _e : "";
    if (smallIconType === "url") {
      new import_obsidian2.Setting(containerEl).setName("Small icon URL").addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder("https://example.com/project-icon.png").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.smallIcon) == null ? void 0 : _a2.url) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.smallIcon = {
              ...this.plugin.settings.globalDefaults.smallIcon,
              url: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    } else if (smallIconType === "asset") {
      new import_obsidian2.Setting(containerEl).setName("Small icon vault path").addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder(".rich-presence/vault-icon.png").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.smallIcon) == null ? void 0 : _a2.assetPath) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.smallIcon = {
              ...this.plugin.settings.globalDefaults.smallIcon,
              assetPath: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    } else if (smallIconType === "key") {
      new import_obsidian2.Setting(containerEl).setName("Small icon Discord asset key").addText(
        (text) => {
          var _a2, _b2;
          return text.setPlaceholder("my-project-icon").setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.smallIcon) == null ? void 0 : _a2.key) != null ? _b2 : "").onChange(async (value) => {
            this.plugin.settings.globalDefaults.smallIcon = {
              ...this.plugin.settings.globalDefaults.smallIcon,
              key: value
            };
            await this.plugin.saveSettings();
          });
        }
      );
    }
    containerEl.createEl("h2", { text: "Privacy" });
    new import_obsidian2.Setting(containerEl).setName("Privacy mode").setDesc("Hide sensitive information from your rich presence").addToggle(
      (toggle) => {
        var _a2, _b2;
        return toggle.setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.privacyMode) == null ? void 0 : _a2.enabled) != null ? _b2 : false).onChange(async (value) => {
          this.plugin.settings.globalDefaults.privacyMode = {
            ...this.plugin.settings.globalDefaults.privacyMode,
            enabled: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian2.Setting(containerEl).setName("Hide file name").addToggle(
      (toggle) => {
        var _a2, _b2;
        return toggle.setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.privacyMode) == null ? void 0 : _a2.hideFileName) != null ? _b2 : false).onChange(async (value) => {
          this.plugin.settings.globalDefaults.privacyMode = {
            ...this.plugin.settings.globalDefaults.privacyMode,
            hideFileName: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    new import_obsidian2.Setting(containerEl).setName("Hide vault name").addToggle(
      (toggle) => {
        var _a2, _b2;
        return toggle.setValue((_b2 = (_a2 = this.plugin.settings.globalDefaults.privacyMode) == null ? void 0 : _a2.hideVaultName) != null ? _b2 : false).onChange(async (value) => {
          this.plugin.settings.globalDefaults.privacyMode = {
            ...this.plugin.settings.globalDefaults.privacyMode,
            hideVaultName: value
          };
          await this.plugin.saveSettings();
        });
      }
    );
    containerEl.createEl("h2", { text: "Miscellaneous" });
    new import_obsidian2.Setting(containerEl).setName("Show status bar item").setDesc("Show connection status in Obsidian's status bar").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showStatusBarItem).onChange(async (value) => {
        this.plugin.settings.showStatusBarItem = value;
        await this.plugin.saveSettings();
        this.plugin.updateStatusBar();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Show notice on connect").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNoticeOnConnect).onChange(async (value) => {
        this.plugin.settings.showNoticeOnConnect = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Debug logging").setDesc("Log IPC messages to browser console for debugging").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.debugLogging).onChange(async (value) => {
        this.plugin.settings.debugLogging = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Force update presence").setDesc("Manually refresh the rich presence right now").addButton(
      (btn) => btn.setButtonText("Update now").setCta().onClick(() => {
        this.plugin.updatePresence();
        new import_obsidian2.Notice("Rich presence updated!");
      })
    );
    containerEl.createEl("p", {
      text: "\u{1F4A1} Tip: Put a rich-presence.json in your vault root to configure everything per-vault, including per-file-type icons.",
      cls: "setting-item-description"
    });
    containerEl.createEl("p", {
      text: "\u{1F4C1} For vault-specific icons, create a .rich-presence/ folder in your vault and add PNG images there.",
      cls: "setting-item-description"
    });
  }
};

// src/types.ts
var DEFAULT_SETTINGS = {
  clientId: "1234567890123456789",
  globalDefaults: {
    enabled: true,
    display: {
      details: "\u{1F4DD} {file_name}",
      state: "\u{1F5C2}\uFE0F {vault_name}  \xB7  {file_count} notes",
      largeImageText: "Obsidian \u2014 {vault_name}",
      smallImageText: "{vault_name}"
    },
    largeIcon: {
      type: "key",
      key: "obsidian",
      url: "https://obsidian.md/images/obsidian-logo-gradient.png",
      assetPath: ""
    },
    smallIcon: {
      type: "",
      url: "",
      assetPath: ".rich-presence/vault-icon.png",
      key: "",
      fallbackEmoji: "\u{1F4D3}"
    },
    timestamps: {
      enabled: true,
      mode: "session"
    },
    buttons: [
      { enabled: false, label: "Visit my notes", url: "" },
      { enabled: false, label: "My GitHub", url: "" }
    ],
    privacyMode: {
      enabled: false,
      hideFileName: false,
      hideVaultName: false,
      hiddenFileName: "a secret file...",
      hiddenVaultName: "a private vault"
    },
    variables: {},
    fileTypeIcons: {},
    idleSettings: {
      enabled: true,
      timeoutMinutes: 10,
      idleState: "\u{1F4A4} Away",
      idleDetails: "Idle"
    },
    updateInterval: 15
  },
  vaultOverrides: {},
  showStatusBarItem: true,
  showNoticeOnConnect: true,
  debugLogging: false,
  configFileName: "rich-presence.json"
};

// src/main.ts
var RichPresencePlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.ipcClient = null;
    this.vaultConfig = {};
    this.sessionStart = Date.now();
    this.fileOpenTime = Date.now();
    this.lastActivity = 0;
    this.lastActivityHash = "";
    this.updateTimer = null;
    this.reconnectTimer = null;
    this.statusBarItem = null;
    this.unwatchConfig = null;
    this.lastInteraction = Date.now();
    this.isIdle = false;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new RichPresenceSettingTab(this.app, this));
    this.statusBarItem = this.addStatusBarItem();
    this.updateStatusBar();
    this.registerDomEvent(document, "keydown", () => {
      this.lastInteraction = Date.now();
      if (this.isIdle) {
        this.isIdle = false;
        this.updatePresence();
      }
    });
    this.registerDomEvent(document, "mousedown", () => {
      this.lastInteraction = Date.now();
      if (this.isIdle) {
        this.isIdle = false;
        this.updatePresence();
      }
    });
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.fileOpenTime = Date.now();
        this.lastActivityHash = "";
        this.updatePresence();
      })
    );
    await this.reloadVaultConfig();
    this.unwatchConfig = watchConfigFile(
      this.app,
      this.settings.configFileName,
      async () => {
        await this.reloadVaultConfig();
        this.updatePresence();
      }
    );
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleUpdate())
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleUpdate())
    );
    this.registerEvent(
      this.app.vault.on("rename", () => this.scheduleUpdate())
    );
    this.connectDiscord();
    this.startUpdateLoop();
    this.addCommand({
      id: "reconnect",
      name: "Reconnect to Discord",
      callback: () => this.reconnect()
    });
    this.addCommand({
      id: "disconnect",
      name: "Disconnect from Discord",
      callback: () => this.disconnect()
    });
    this.addCommand({
      id: "update-presence",
      name: "Update rich presence now",
      callback: () => {
        this.lastActivityHash = "";
        this.updatePresence();
        new import_obsidian3.Notice("Rich presence updated!");
      }
    });
    this.addCommand({
      id: "create-config",
      name: "Create default config file (rich-presence.json)",
      callback: async () => {
        await this.createDefaultConfig();
        new import_obsidian3.Notice("\u2705 Created rich-presence.json in vault root!");
      }
    });
    this.addCommand({
      id: "toggle-privacy",
      name: "Toggle privacy mode",
      callback: async () => {
        var _a, _b;
        const current = (_b = (_a = this.vaultConfig.privacyMode) == null ? void 0 : _a.enabled) != null ? _b : false;
        this.settings.globalDefaults.privacyMode = {
          ...this.settings.globalDefaults.privacyMode,
          enabled: !current
        };
        await this.saveSettings();
        await this.reloadVaultConfig();
        this.lastActivityHash = "";
        this.updatePresence();
        new import_obsidian3.Notice(`Privacy mode ${!current ? "enabled" : "disabled"}`);
      }
    });
  }
  onunload() {
    var _a, _b, _c;
    this.stopUpdateLoop();
    (_a = this.unwatchConfig) == null ? void 0 : _a.call(this);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    (_b = this.ipcClient) == null ? void 0 : _b.clearActivity().catch(() => {
    });
    (_c = this.ipcClient) == null ? void 0 : _c.disconnect();
    this.ipcClient = null;
  }
  // ────────────────────────────────────────────────────────────
  // Discord Connection
  // ────────────────────────────────────────────────────────────
  async connectDiscord() {
    var _a;
    if ((_a = this.ipcClient) == null ? void 0 : _a.isConnected()) return;
    try {
      this.ipcClient = new DiscordIPCClient(
        this.settings.clientId,
        this.settings.debugLogging
      );
      this.ipcClient.onConnect(() => {
        this.updateStatusBar();
        if (this.settings.showNoticeOnConnect) {
          new import_obsidian3.Notice("\u{1F3AE} Rich Presence: Connected to Discord!");
        }
        this.lastActivityHash = "";
        this.updatePresence();
      });
      this.ipcClient.onDisconnect(() => {
        this.updateStatusBar();
        this.scheduleReconnect();
      });
      this.ipcClient.onError((err) => {
        if (this.settings.debugLogging) {
          console.error("[RichPresence] IPC Error:", err);
        }
      });
      await this.ipcClient.connect();
    } catch (err) {
      if (this.settings.debugLogging) {
        console.warn("[RichPresence] Could not connect to Discord:", err);
      }
      this.updateStatusBar();
      this.scheduleReconnect();
    }
  }
  scheduleReconnect(delayMs = 3e4) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectDiscord();
    }, delayMs);
  }
  async reconnect() {
    var _a;
    (_a = this.ipcClient) == null ? void 0 : _a.disconnect();
    this.ipcClient = null;
    await this.connectDiscord();
  }
  disconnect() {
    var _a, _b;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    (_a = this.ipcClient) == null ? void 0 : _a.clearActivity().catch(() => {
    });
    (_b = this.ipcClient) == null ? void 0 : _b.disconnect();
    this.ipcClient = null;
    this.updateStatusBar();
    new import_obsidian3.Notice("Rich Presence disconnected.");
  }
  // ────────────────────────────────────────────────────────────
  // Update Loop
  // ────────────────────────────────────────────────────────────
  startUpdateLoop() {
    var _a;
    const intervalMs = Math.max(15, (_a = this.vaultConfig.updateInterval) != null ? _a : 15) * 1e3;
    this.updateTimer = setInterval(() => {
      this.checkIdle();
      this.updatePresence();
    }, intervalMs);
  }
  stopUpdateLoop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
  scheduleUpdate() {
    this.lastActivityHash = "";
    setTimeout(() => this.updatePresence(), 500);
  }
  checkIdle() {
    var _a;
    const idleSettings = this.vaultConfig.idleSettings;
    if (!(idleSettings == null ? void 0 : idleSettings.enabled)) return;
    const idleMs = ((_a = idleSettings.timeoutMinutes) != null ? _a : 10) * 60 * 1e3;
    const wasIdle = this.isIdle;
    this.isIdle = Date.now() - this.lastInteraction > idleMs;
    if (this.isIdle !== wasIdle) {
      this.lastActivityHash = "";
    }
  }
  // ────────────────────────────────────────────────────────────
  // Presence Building
  // ────────────────────────────────────────────────────────────
  async updatePresence() {
    var _a, _b;
    if (!((_a = this.ipcClient) == null ? void 0 : _a.isConnected())) return;
    if (!((_b = this.vaultConfig.enabled) != null ? _b : true)) {
      await this.ipcClient.clearActivity();
      return;
    }
    const activity = await this.buildActivity();
    const hash = JSON.stringify(activity);
    if (hash === this.lastActivityHash) return;
    this.lastActivityHash = hash;
    try {
      await this.ipcClient.setActivity(activity);
    } catch (err) {
      if (this.settings.debugLogging) {
        console.error("[RichPresence] Failed to set activity:", err);
      }
    }
  }
  async buildActivity() {
    var _a, _b, _c, _d, _e, _f, _g;
    const cfg = this.vaultConfig;
    const file = this.app.workspace.getActiveFile();
    const privacy = cfg.privacyMode;
    const ctx = {
      app: this.app,
      file,
      vaultConfig: cfg,
      sessionStart: this.sessionStart,
      fileOpenTime: this.fileOpenTime,
      isIdle: this.isIdle
    };
    const safeCtx = this.applyPrivacy(ctx, privacy);
    const activity = {};
    if (this.isIdle && ((_a = cfg.idleSettings) == null ? void 0 : _a.enabled)) {
      const idle = cfg.idleSettings;
      activity.details = resolveVariables((_b = idle.idleDetails) != null ? _b : "Idle", safeCtx);
      activity.state = resolveVariables((_c = idle.idleState) != null ? _c : "\u{1F4A4} Away", safeCtx);
    } else {
      const display = (_d = cfg.display) != null ? _d : {};
      if (display.details) activity.details = resolveVariables(display.details, safeCtx);
      if (display.state) activity.state = resolveVariables(display.state, safeCtx);
    }
    const largeKey = await this.resolveIconKey(cfg.largeIcon, ctx);
    if (largeKey) {
      activity.largeImageKey = largeKey;
      if ((_e = cfg.display) == null ? void 0 : _e.largeImageText) {
        activity.largeImageText = resolveVariables(cfg.display.largeImageText, safeCtx);
      }
    }
    const fileTypeIcon = getFileTypeIcon(file, cfg);
    let smallKey = fileTypeIcon ? fileTypeIcon : await this.resolveIconKey(cfg.smallIcon, ctx);
    if (smallKey) {
      activity.smallImageKey = smallKey;
      if ((_f = cfg.display) == null ? void 0 : _f.smallImageText) {
        activity.smallImageText = resolveVariables(cfg.display.smallImageText, safeCtx);
      }
    }
    const ts = cfg.timestamps;
    if ((ts == null ? void 0 : ts.enabled) && ts.mode !== "off") {
      if (ts.mode === "session") {
        activity.startTimestamp = this.sessionStart;
      } else if (ts.mode === "file") {
        activity.startTimestamp = this.fileOpenTime;
      }
    }
    const buttons = ((_g = cfg.buttons) != null ? _g : []).filter((b) => b.enabled && b.label && b.url).slice(0, 2).map((b) => ({ label: b.label, url: b.url }));
    if (buttons.length > 0) activity.buttons = buttons;
    return activity;
  }
  applyPrivacy(ctx, privacy) {
    var _a, _b;
    if (!(privacy == null ? void 0 : privacy.enabled)) return ctx;
    const safeCtx = { ...ctx };
    if (privacy.hideFileName && ctx.file) {
      safeCtx.file = {
        ...ctx.file,
        name: (_a = privacy.hiddenFileName) != null ? _a : "a secret file",
        basename: ((_b = privacy.hiddenFileName) != null ? _b : "a secret file").replace(/\.[^.]+$/, "")
      };
    }
    if (privacy.hideVaultName) {
      const originalVault = ctx.app.vault;
      safeCtx.app = {
        ...ctx.app,
        vault: new Proxy(originalVault, {
          get(target, prop) {
            if (prop === "getName") {
              return () => {
                var _a2;
                return (_a2 = privacy.hiddenVaultName) != null ? _a2 : "a private vault";
              };
            }
            const val = target[prop];
            return typeof val === "function" ? val.bind(target) : val;
          }
        })
      };
    }
    return safeCtx;
  }
  async resolveIconKey(iconCfg, ctx) {
    var _a, _b;
    if (!iconCfg) return null;
    const type = iconCfg.type;
    if (type === "url" && iconCfg.url) return iconCfg.url;
    if (type === "key" && iconCfg.key) return iconCfg.key;
    if (type === "asset" && iconCfg.assetPath) {
      const adapter = this.app.vault.adapter;
      const basePath = (_b = (_a = adapter.getBasePath) == null ? void 0 : _a.call(adapter)) != null ? _b : "";
      const fullPath = `${basePath}/${(0, import_obsidian3.normalizePath)(iconCfg.assetPath)}`;
      return `file://${fullPath.replace(/\\/g, "/")}`;
    }
    return null;
  }
  // ────────────────────────────────────────────────────────────
  // Config
  // ────────────────────────────────────────────────────────────
  async reloadVaultConfig() {
    this.vaultConfig = await loadVaultConfig(this.app, this.settings);
    this.stopUpdateLoop();
    this.startUpdateLoop();
  }
  async createDefaultConfig() {
    await createDefaultConfigFile(this.app, this.settings.configFileName);
  }
  // ────────────────────────────────────────────────────────────
  // Status Bar
  // ────────────────────────────────────────────────────────────
  updateStatusBar() {
    var _a;
    if (!this.statusBarItem) return;
    if (!this.settings.showStatusBarItem) {
      this.statusBarItem.style.display = "none";
      return;
    }
    this.statusBarItem.style.display = "";
    if ((_a = this.ipcClient) == null ? void 0 : _a.isConnected()) {
      this.statusBarItem.setText("\u{1F3AE} RP: Connected");
      this.statusBarItem.title = "Rich Presence: Connected to Discord. Click to disconnect.";
    } else {
      this.statusBarItem.setText("\u{1F3AE} RP: Offline");
      this.statusBarItem.title = "Rich Presence: Not connected to Discord. Click to reconnect.";
    }
    this.statusBarItem.onclick = () => {
      var _a2;
      if ((_a2 = this.ipcClient) == null ? void 0 : _a2.isConnected()) {
        this.disconnect();
      } else {
        this.reconnect();
      }
    };
    this.statusBarItem.style.cursor = "pointer";
  }
  // ────────────────────────────────────────────────────────────
  // Settings
  // ────────────────────────────────────────────────────────────
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    await this.reloadVaultConfig();
    this.lastActivityHash = "";
    this.updatePresence();
  }
};
