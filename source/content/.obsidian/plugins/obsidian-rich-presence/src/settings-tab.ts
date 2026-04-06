import { App, PluginSettingTab, Setting, TextComponent, Notice, ButtonComponent } from "obsidian";
import RichPresencePlugin from "./main";
import { PluginSettings } from "./types";

export class RichPresenceSettingTab extends PluginSettingTab {
  plugin: RichPresencePlugin;

  constructor(app: App, plugin: RichPresencePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // Header
    containerEl.createEl("h1", { text: "⚡ Rich Presence" });
    containerEl.createEl("p", {
      text: "Show your Obsidian activity on Discord with full customization. Configure text, icons, and more via rich-presence.json in your vault root.",
      cls: "setting-item-description",
    });

    // ── Connection ─────────────────────────────────────────
    containerEl.createEl("h2", { text: "Connection" });

    new Setting(containerEl)
      .setName("Discord Application Client ID")
      .setDesc(
        createFragment((f) => {
          f.appendText("Your Discord Application's Client ID. Create one at ");
          f.createEl("a", {
            text: "discord.com/developers/applications",
            href: "https://discord.com/developers/applications",
          });
          f.appendText(". This is required for Rich Presence to work.");
        })
      )
      .addText((text) =>
        text
          .setPlaceholder("1234567890123456789")
          .setValue(this.plugin.settings.clientId)
          .onChange(async (value) => {
            this.plugin.settings.clientId = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Connection status")
      .setDesc(this.plugin.ipcClient?.isConnected() ? "✅ Connected to Discord" : "❌ Not connected to Discord")
      .addButton((btn) =>
        btn
          .setButtonText("Reconnect")
          .setCta()
          .onClick(async () => {
            await this.plugin.reconnect();
            this.display();
          })
      )
      .addButton((btn) =>
        btn
          .setButtonText("Disconnect")
          .onClick(() => {
            this.plugin.disconnect();
            this.display();
          })
      );

    // ── Config File ────────────────────────────────────────
    containerEl.createEl("h2", { text: "Configuration File" });

    new Setting(containerEl)
      .setName("Config file name")
      .setDesc(
        "The name of the JSON config file inside your vault root. Default: rich-presence.json"
      )
      .addText((text) =>
        text
          .setPlaceholder("rich-presence.json")
          .setValue(this.plugin.settings.configFileName)
          .onChange(async (value) => {
            this.plugin.settings.configFileName = value.trim() || "rich-presence.json";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Create default config file")
      .setDesc(
        "Creates a rich-presence.json in your vault root with all available options documented."
      )
      .addButton((btn) =>
        btn
          .setButtonText("Create file")
          .onClick(async () => {
            await this.plugin.createDefaultConfig();
            new Notice("✅ Created rich-presence.json in vault root!");
          })
      )
      .addButton((btn) =>
        btn
          .setButtonText("Open file")
          .onClick(async () => {
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
              new Notice("Config file not found. Create it first.");
            }
          })
      );

    // ── Available Variables Reference ─────────────────────
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
      ["{custom.KEY}", "Your custom variable from variables block"],
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

    // ── Global Defaults ────────────────────────────────────
    containerEl.createEl("h2", { text: "Global Defaults" });
    containerEl.createEl("p", {
      text: "These defaults are used when no rich-presence.json is found, or to fill in missing values. Per-vault JSON config overrides these.",
      cls: "setting-item-description",
    });

    new Setting(containerEl)
      .setName("Details text")
      .setDesc("Top line of the rich presence (supports variables)")
      .addText((text) =>
        text
          .setPlaceholder("📝 {file_name}")
          .setValue(this.plugin.settings.globalDefaults.display?.details ?? "")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.display = {
              ...this.plugin.settings.globalDefaults.display,
              details: value,
            };
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("State text")
      .setDesc("Second line of the rich presence (supports variables)")
      .addText((text) =>
        text
          .setPlaceholder("🗂️ {vault_name}")
          .setValue(this.plugin.settings.globalDefaults.display?.state ?? "")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.display = {
              ...this.plugin.settings.globalDefaults.display,
              state: value,
            };
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Large icon tooltip")
      .setDesc("Hover text for the large icon (supports variables)")
      .addText((text) =>
        text
          .setPlaceholder("Obsidian — {vault_name}")
          .setValue(this.plugin.settings.globalDefaults.display?.largeImageText ?? "")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.display = {
              ...this.plugin.settings.globalDefaults.display,
              largeImageText: value,
            };
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Small icon tooltip")
      .setDesc("Hover text for the small icon (supports variables)")
      .addText((text) =>
        text
          .setPlaceholder("{vault_name}")
          .setValue(this.plugin.settings.globalDefaults.display?.smallImageText ?? "")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.display = {
              ...this.plugin.settings.globalDefaults.display,
              smallImageText: value,
            };
            await this.plugin.saveSettings();
          })
      );

    // ── Large Icon ─────────────────────────────────────────
    containerEl.createEl("h3", { text: "Large Icon (App Icon)" });

    new Setting(containerEl)
      .setName("Large icon type")
      .setDesc("How to provide the large icon image")
      .addDropdown((dd) =>
        dd
          .addOption("key", "Discord Asset Key")
          .addOption("url", "External URL")
          .addOption("asset", "File in Vault")
          .setValue(this.plugin.settings.globalDefaults.largeIcon?.type ?? "key")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.largeIcon = {
              ...this.plugin.settings.globalDefaults.largeIcon,
              type: value as any,
            };
            await this.plugin.saveSettings();
            this.display();
          })
      );

    const largeIconType = this.plugin.settings.globalDefaults.largeIcon?.type ?? "key";

    if (largeIconType === "url") {
      new Setting(containerEl)
        .setName("Large icon URL")
        .setDesc("Direct URL to an image (PNG/JPG/GIF, max 1024px)")
        .addText((text) =>
          text
            .setPlaceholder("https://example.com/icon.png")
            .setValue(this.plugin.settings.globalDefaults.largeIcon?.url ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.largeIcon = {
                ...this.plugin.settings.globalDefaults.largeIcon,
                url: value,
              };
              await this.plugin.saveSettings();
            })
        );
    } else if (largeIconType === "asset") {
      new Setting(containerEl)
        .setName("Large icon vault path")
        .setDesc("Path to an image file inside your vault (e.g. .rich-presence/app-icon.png)")
        .addText((text) =>
          text
            .setPlaceholder(".rich-presence/app-icon.png")
            .setValue(this.plugin.settings.globalDefaults.largeIcon?.assetPath ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.largeIcon = {
                ...this.plugin.settings.globalDefaults.largeIcon,
                assetPath: value,
              };
              await this.plugin.saveSettings();
            })
        );
    } else {
      new Setting(containerEl)
        .setName("Discord asset key")
        .setDesc(
          createFragment((f) => {
            f.appendText("The asset key name from your ");
            f.createEl("a", {
              text: "Discord Application",
              href: "https://discord.com/developers/applications",
            });
            f.appendText(" Rich Presence assets. Upload images there first.");
          })
        )
        .addText((text) =>
          text
            .setPlaceholder("obsidian")
            .setValue(this.plugin.settings.globalDefaults.largeIcon?.key ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.largeIcon = {
                ...this.plugin.settings.globalDefaults.largeIcon,
                key: value,
              };
              await this.plugin.saveSettings();
            })
        );
    }

    // ── Small Icon ─────────────────────────────────────────
    containerEl.createEl("h3", { text: "Small Icon (Project Icon)" });

    new Setting(containerEl)
      .setName("Small icon type")
      .setDesc("How to provide the small overlay icon (leave blank to hide)")
      .addDropdown((dd) =>
        dd
          .addOption("", "None (hidden)")
          .addOption("key", "Discord Asset Key")
          .addOption("url", "External URL")
          .addOption("asset", "File in Vault")
          .setValue(this.plugin.settings.globalDefaults.smallIcon?.type ?? "")
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.smallIcon = {
              ...this.plugin.settings.globalDefaults.smallIcon,
              type: value as any,
            };
            await this.plugin.saveSettings();
            this.display();
          })
      );

    const smallIconType = this.plugin.settings.globalDefaults.smallIcon?.type ?? "";

    if (smallIconType === "url") {
      new Setting(containerEl)
        .setName("Small icon URL")
        .addText((text) =>
          text
            .setPlaceholder("https://example.com/project-icon.png")
            .setValue(this.plugin.settings.globalDefaults.smallIcon?.url ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.smallIcon = {
                ...this.plugin.settings.globalDefaults.smallIcon,
                url: value,
              };
              await this.plugin.saveSettings();
            })
        );
    } else if (smallIconType === "asset") {
      new Setting(containerEl)
        .setName("Small icon vault path")
        .addText((text) =>
          text
            .setPlaceholder(".rich-presence/vault-icon.png")
            .setValue(this.plugin.settings.globalDefaults.smallIcon?.assetPath ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.smallIcon = {
                ...this.plugin.settings.globalDefaults.smallIcon,
                assetPath: value,
              };
              await this.plugin.saveSettings();
            })
        );
    } else if (smallIconType === "key") {
      new Setting(containerEl)
        .setName("Small icon Discord asset key")
        .addText((text) =>
          text
            .setPlaceholder("my-project-icon")
            .setValue(this.plugin.settings.globalDefaults.smallIcon?.key ?? "")
            .onChange(async (value) => {
              this.plugin.settings.globalDefaults.smallIcon = {
                ...this.plugin.settings.globalDefaults.smallIcon,
                key: value,
              };
              await this.plugin.saveSettings();
            })
        );
    }

    // ── Privacy ────────────────────────────────────────────
    containerEl.createEl("h2", { text: "Privacy" });

    new Setting(containerEl)
      .setName("Privacy mode")
      .setDesc("Hide sensitive information from your rich presence")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.globalDefaults.privacyMode?.enabled ?? false)
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.privacyMode = {
              ...this.plugin.settings.globalDefaults.privacyMode!,
              enabled: value,
            };
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Hide file name")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.globalDefaults.privacyMode?.hideFileName ?? false)
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.privacyMode = {
              ...this.plugin.settings.globalDefaults.privacyMode!,
              hideFileName: value,
            };
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Hide vault name")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.globalDefaults.privacyMode?.hideVaultName ?? false)
          .onChange(async (value) => {
            this.plugin.settings.globalDefaults.privacyMode = {
              ...this.plugin.settings.globalDefaults.privacyMode!,
              hideVaultName: value,
            };
            await this.plugin.saveSettings();
          })
      );

    // ── Misc ───────────────────────────────────────────────
    containerEl.createEl("h2", { text: "Miscellaneous" });

    new Setting(containerEl)
      .setName("Show status bar item")
      .setDesc("Show connection status in Obsidian's status bar")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showStatusBarItem)
          .onChange(async (value) => {
            this.plugin.settings.showStatusBarItem = value;
            await this.plugin.saveSettings();
            this.plugin.updateStatusBar();
          })
      );

    new Setting(containerEl)
      .setName("Show notice on connect")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showNoticeOnConnect)
          .onChange(async (value) => {
            this.plugin.settings.showNoticeOnConnect = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Debug logging")
      .setDesc("Log IPC messages to browser console for debugging")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.debugLogging)
          .onChange(async (value) => {
            this.plugin.settings.debugLogging = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Force update presence")
      .setDesc("Manually refresh the rich presence right now")
      .addButton((btn) =>
        btn
          .setButtonText("Update now")
          .setCta()
          .onClick(() => {
            this.plugin.updatePresence();
            new Notice("Rich presence updated!");
          })
      );

    // Footer
    containerEl.createEl("p", {
      text: "💡 Tip: Put a rich-presence.json in your vault root to configure everything per-vault, including per-file-type icons.",
      cls: "setting-item-description",
    });
    containerEl.createEl("p", {
      text: "📁 For vault-specific icons, create a .rich-presence/ folder in your vault and add PNG images there.",
      cls: "setting-item-description",
    });
  }
}
