import { App, TFile, normalizePath } from "obsidian";
import { RichPresenceVaultConfig, PluginSettings } from "./types";

/**
 * Loads and deep-merges vault config from rich-presence.json
 * with the global defaults from plugin settings.
 */
export async function loadVaultConfig(
  app: App,
  settings: PluginSettings
): Promise<RichPresenceVaultConfig> {
  const configPath = normalizePath(settings.configFileName);
  const file = app.vault.getAbstractFileByPath(configPath);

  let vaultConfig: RichPresenceVaultConfig = {};

  if (file instanceof TFile) {
    try {
      const raw = await app.vault.read(file);
      const parsed = JSON.parse(stripCommentKeys(raw));
      vaultConfig = parsed as RichPresenceVaultConfig;
    } catch (e) {
      console.error("[RichPresence] Failed to parse rich-presence.json:", e);
    }
  }

  // Also check per-vault overrides from plugin settings
  const vaultName = app.vault.getName();
  const vaultOverride = settings.vaultOverrides[vaultName] ?? {};

  // Deep merge: globalDefaults < vaultConfig (json file) < vaultOverride (plugin settings)
  return deepMerge(
    deepMerge(settings.globalDefaults, vaultConfig),
    vaultOverride
  );
}

/**
 * Strip keys that start with underscore (used as comment keys in JSON)
 */
function stripCommentKeys(json: string): string {
  // Remove "_comment..." keys from JSON string via regex
  return json.replace(/"_[^"]*"\s*:\s*(?:"[^"]*"|\d+|true|false|null)\s*,?\s*/g, "");
}

/**
 * Deep merge two objects. Arrays are replaced (not merged).
 */
export function deepMerge<T extends Record<string, any>>(
  base: T,
  override: Partial<T>
): T {
  const result = { ...base } as T;
  for (const key in override) {
    const val = override[key];
    if (val === undefined || val === null) continue;

    if (
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as Record<string, any>, val as Record<string, any>) as any;
    } else {
      result[key] = val as any;
    }
  }
  return result;
}

/**
 * Watches the config file for changes and calls onChange.
 * Returns an unsubscribe function.
 */
export function watchConfigFile(
  app: App,
  configFileName: string,
  onChange: () => void
): () => void {
  const handler = app.vault.on("modify", (file) => {
    if (file.path === normalizePath(configFileName)) {
      onChange();
    }
  });

  return () => {
    app.vault.offref(handler);
  };
}

/**
 * Creates the default rich-presence.json in the vault root if it doesn't exist.
 */
export async function createDefaultConfigFile(
  app: App,
  configFileName: string
): Promise<void> {
  const configPath = normalizePath(configFileName);
  const existing = app.vault.getAbstractFileByPath(configPath);

  if (!existing) {
    const defaultContent = JSON.stringify(DEFAULT_JSON_CONFIG, null, 2);
    await app.vault.create(configPath, defaultContent);
  }
}

const DEFAULT_JSON_CONFIG = {
  "_comment": "Rich Presence configuration. Place at vault root as rich-presence.json",
  "_docs": "Available variables: {file_name}, {file_name_ext}, {file_path}, {file_ext}, {vault_name}, {vault_path}, {file_count}, {note_count}, {folder}, {time}, {date}, {session_time}, {file_time}, {custom.KEY}",

  "enabled": true,

  "display": {
    "details": "📝 {file_name}",
    "state": "🗂️ {vault_name}  ·  {note_count} notes",
    "largeImageText": "Obsidian — {vault_name}",
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
    "fallbackEmoji": "📓"
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
    "idleState": "💤 Away",
    "idleDetails": "Idle — {vault_name}"
  },

  "updateInterval": 15
};
