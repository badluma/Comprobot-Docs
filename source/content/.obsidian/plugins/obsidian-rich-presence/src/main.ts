import {
  App,
  Plugin,
  TFile,
  Notice,
  normalizePath,
  WorkspaceLeaf,
} from "obsidian";
import { DiscordIPCClient } from "./discord-ipc";
import { loadVaultConfig, watchConfigFile, createDefaultConfigFile } from "./config-loader";
import { resolveVariables, getFileTypeIcon, VariableContext } from "./variables";
import { RichPresenceSettingTab } from "./settings-tab";
import {
  PluginSettings,
  DEFAULT_SETTINGS,
  RichPresenceVaultConfig,
  PresenceActivity,
} from "./types";

export default class RichPresencePlugin extends Plugin {
  settings!: PluginSettings;
  ipcClient: DiscordIPCClient | null = null;

  private vaultConfig: RichPresenceVaultConfig = {};
  private sessionStart = Date.now();
  private fileOpenTime = Date.now();
  private lastActivity = 0;
  private lastActivityHash = "";
  private updateTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private statusBarItem: HTMLElement | null = null;
  private unwatchConfig: (() => void) | null = null;
  private lastInteraction = Date.now();
  private isIdle = false;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new RichPresenceSettingTab(this.app, this));

    // Status bar
    this.statusBarItem = this.addStatusBarItem();
    this.updateStatusBar();

    // Track user activity for idle detection
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

    // Track file opens
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.fileOpenTime = Date.now();
        this.lastActivityHash = ""; // force update
        this.updatePresence();
      })
    );

    // Load vault config & watch for changes
    await this.reloadVaultConfig();
    this.unwatchConfig = watchConfigFile(
      this.app,
      this.settings.configFileName,
      async () => {
        await this.reloadVaultConfig();
        this.updatePresence();
      }
    );

    // Watch vault file changes for file count updates
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleUpdate())
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleUpdate())
    );
    this.registerEvent(
      this.app.vault.on("rename", () => this.scheduleUpdate())
    );

    // Connect to Discord
    this.connectDiscord();

    // Start update loop
    this.startUpdateLoop();

    // Commands
    this.addCommand({
      id: "reconnect",
      name: "Reconnect to Discord",
      callback: () => this.reconnect(),
    });

    this.addCommand({
      id: "disconnect",
      name: "Disconnect from Discord",
      callback: () => this.disconnect(),
    });

    this.addCommand({
      id: "update-presence",
      name: "Update rich presence now",
      callback: () => {
        this.lastActivityHash = "";
        this.updatePresence();
        new Notice("Rich presence updated!");
      },
    });

    this.addCommand({
      id: "create-config",
      name: "Create default config file (rich-presence.json)",
      callback: async () => {
        await this.createDefaultConfig();
        new Notice("✅ Created rich-presence.json in vault root!");
      },
    });

    this.addCommand({
      id: "toggle-privacy",
      name: "Toggle privacy mode",
      callback: async () => {
        const current = this.vaultConfig.privacyMode?.enabled ?? false;
        this.settings.globalDefaults.privacyMode = {
          ...this.settings.globalDefaults.privacyMode!,
          enabled: !current,
        };
        await this.saveSettings();
        await this.reloadVaultConfig();
        this.lastActivityHash = "";
        this.updatePresence();
        new Notice(`Privacy mode ${!current ? "enabled" : "disabled"}`);
      },
    });
  }

  onunload() {
    this.stopUpdateLoop();
    this.unwatchConfig?.();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ipcClient?.clearActivity().catch(() => {});
    this.ipcClient?.disconnect();
    this.ipcClient = null;
  }

  // ────────────────────────────────────────────────────────────
  // Discord Connection
  // ────────────────────────────────────────────────────────────

  private async connectDiscord() {
    if (this.ipcClient?.isConnected()) return;

    try {
      this.ipcClient = new DiscordIPCClient(
        this.settings.clientId,
        this.settings.debugLogging
      );

      this.ipcClient.onConnect(() => {
        this.updateStatusBar();
        if (this.settings.showNoticeOnConnect) {
          new Notice("🎮 Rich Presence: Connected to Discord!");
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

  private scheduleReconnect(delayMs = 30_000) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectDiscord();
    }, delayMs);
  }

  async reconnect() {
    this.ipcClient?.disconnect();
    this.ipcClient = null;
    await this.connectDiscord();
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ipcClient?.clearActivity().catch(() => {});
    this.ipcClient?.disconnect();
    this.ipcClient = null;
    this.updateStatusBar();
    new Notice("Rich Presence disconnected.");
  }

  // ────────────────────────────────────────────────────────────
  // Update Loop
  // ────────────────────────────────────────────────────────────

  private startUpdateLoop() {
    const intervalMs = Math.max(15, this.vaultConfig.updateInterval ?? 15) * 1000;
    this.updateTimer = setInterval(() => {
      this.checkIdle();
      this.updatePresence();
    }, intervalMs);
  }

  private stopUpdateLoop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  private scheduleUpdate() {
    this.lastActivityHash = "";
    // Debounce
    setTimeout(() => this.updatePresence(), 500);
  }

  private checkIdle() {
    const idleSettings = this.vaultConfig.idleSettings;
    if (!idleSettings?.enabled) return;

    const idleMs = (idleSettings.timeoutMinutes ?? 10) * 60 * 1000;
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
    if (!this.ipcClient?.isConnected()) return;
    if (!(this.vaultConfig.enabled ?? true)) {
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

  private async buildActivity(): Promise<PresenceActivity> {
    const cfg = this.vaultConfig;
    const file = this.app.workspace.getActiveFile();
    const privacy = cfg.privacyMode;

    const ctx: VariableContext = {
      app: this.app,
      file,
      vaultConfig: cfg,
      sessionStart: this.sessionStart,
      fileOpenTime: this.fileOpenTime,
      isIdle: this.isIdle,
    };

    // Apply privacy
    const safeCtx = this.applyPrivacy(ctx, privacy);

    const activity: PresenceActivity = {};

    // Idle mode
    if (this.isIdle && cfg.idleSettings?.enabled) {
      const idle = cfg.idleSettings;
      activity.details = resolveVariables(idle.idleDetails ?? "Idle", safeCtx);
      activity.state = resolveVariables(idle.idleState ?? "💤 Away", safeCtx);
    } else {
      const display = cfg.display ?? {};
      if (display.details) activity.details = resolveVariables(display.details, safeCtx);
      if (display.state) activity.state = resolveVariables(display.state, safeCtx);
    }

    // Large icon
    const largeKey = await this.resolveIconKey(cfg.largeIcon, ctx);
    if (largeKey) {
      activity.largeImageKey = largeKey;
      if (cfg.display?.largeImageText) {
        activity.largeImageText = resolveVariables(cfg.display.largeImageText, safeCtx);
      }
    }

    // Small icon — check file type icons first
    const fileTypeIcon = getFileTypeIcon(file, cfg);
    let smallKey = fileTypeIcon ? fileTypeIcon : await this.resolveIconKey(cfg.smallIcon, ctx);
    if (smallKey) {
      activity.smallImageKey = smallKey;
      if (cfg.display?.smallImageText) {
        activity.smallImageText = resolveVariables(cfg.display.smallImageText, safeCtx);
      }
    }

    // Timestamps
    const ts = cfg.timestamps;
    if (ts?.enabled && ts.mode !== "off") {
      if (ts.mode === "session") {
        activity.startTimestamp = this.sessionStart;
      } else if (ts.mode === "file") {
        activity.startTimestamp = this.fileOpenTime;
      }
    }

    // Buttons
    const buttons = (cfg.buttons ?? [])
      .filter((b) => b.enabled && b.label && b.url)
      .slice(0, 2)
      .map((b) => ({ label: b.label, url: b.url }));
    if (buttons.length > 0) activity.buttons = buttons;

    return activity;
  }

  private applyPrivacy(ctx: VariableContext, privacy: RichPresenceVaultConfig["privacyMode"]): VariableContext {
    if (!privacy?.enabled) return ctx;

    const safeCtx = { ...ctx };
    if (privacy.hideFileName && ctx.file) {
      // Replace file with a dummy
      safeCtx.file = {
        ...ctx.file,
        name: privacy.hiddenFileName ?? "a secret file",
        basename: (privacy.hiddenFileName ?? "a secret file").replace(/\.[^.]+$/, ""),
      } as TFile;
    }
    if (privacy.hideVaultName) {
      // We monkey-patch the vault.getName for variable resolution
      const originalVault = ctx.app.vault;
      safeCtx.app = {
        ...ctx.app,
        vault: new Proxy(originalVault, {
          get(target, prop) {
            if (prop === "getName") {
              return () => privacy.hiddenVaultName ?? "a private vault";
            }
            const val = (target as any)[prop];
            return typeof val === "function" ? val.bind(target) : val;
          },
        }),
      } as App;
    }
    return safeCtx;
  }

  private async resolveIconKey(
    iconCfg: RichPresenceVaultConfig["largeIcon"] | RichPresenceVaultConfig["smallIcon"],
    ctx: VariableContext
  ): Promise<string | null> {
    if (!iconCfg) return null;

    const type = iconCfg.type;

    if (type === "url" && iconCfg.url) return iconCfg.url;

    if (type === "key" && iconCfg.key) return iconCfg.key;

    if (type === "asset" && iconCfg.assetPath) {
      // For Discord, we can't send a local file path directly.
      // We return the path as a local file:// URI which works when Discord
      // is on the same machine (supported in newer Discord versions for local assets).
      const adapter = this.app.vault.adapter as any;
      const basePath: string = adapter.getBasePath?.() ?? "";
      const fullPath = `${basePath}/${normalizePath(iconCfg.assetPath)}`;
      // Return as file URL
      return `file://${fullPath.replace(/\\/g, "/")}`;
    }

    return null;
  }

  // ────────────────────────────────────────────────────────────
  // Config
  // ────────────────────────────────────────────────────────────

  async reloadVaultConfig() {
    this.vaultConfig = await loadVaultConfig(this.app, this.settings);

    // Restart update loop with potentially new interval
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
    if (!this.statusBarItem) return;

    if (!this.settings.showStatusBarItem) {
      this.statusBarItem.style.display = "none";
      return;
    }

    this.statusBarItem.style.display = "";

    if (this.ipcClient?.isConnected()) {
      this.statusBarItem.setText("🎮 RP: Connected");
      this.statusBarItem.title = "Rich Presence: Connected to Discord. Click to disconnect.";
    } else {
      this.statusBarItem.setText("🎮 RP: Offline");
      this.statusBarItem.title = "Rich Presence: Not connected to Discord. Click to reconnect.";
    }

    this.statusBarItem.onclick = () => {
      if (this.ipcClient?.isConnected()) {
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
}
