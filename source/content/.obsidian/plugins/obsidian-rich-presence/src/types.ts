// ============================================================
// Rich Presence Types
// ============================================================

export interface IconConfig {
  type: "url" | "asset" | "key" | "";
  url?: string;
  assetPath?: string;
  key?: string;
  fallbackEmoji?: string;
}

export interface TimestampConfig {
  enabled: boolean;
  mode: "session" | "file" | "off";
}

export interface ButtonConfig {
  enabled: boolean;
  label: string;
  url: string;
}

export interface PrivacyConfig {
  enabled: boolean;
  hideFileName: boolean;
  hideVaultName: boolean;
  hiddenFileName: string;
  hiddenVaultName: string;
}

export interface IdleConfig {
  enabled: boolean;
  timeoutMinutes: number;
  idleState: string;
  idleDetails: string;
}

export interface RichPresenceVaultConfig {
  enabled?: boolean;
  display?: {
    details?: string;
    state?: string;
    largeImageText?: string;
    smallImageText?: string;
  };
  largeIcon?: IconConfig;
  smallIcon?: IconConfig;
  timestamps?: TimestampConfig;
  buttons?: ButtonConfig[];
  privacyMode?: PrivacyConfig;
  variables?: Record<string, string>;
  fileTypeIcons?: Record<string, string>;
  idleSettings?: IdleConfig;
  updateInterval?: number;
}

export interface PresenceActivity {
  details?: string;
  state?: string;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  buttons?: Array<{ label: string; url: string }>;
  instance?: boolean;
}

// Global plugin settings (stored in data.json)
export interface PluginSettings {
  // Discord Application Client ID
  clientId: string;

  // Global defaults (merged with per-vault config)
  globalDefaults: RichPresenceVaultConfig;

  // Per-vault overrides (keyed by vault name)
  vaultOverrides: Record<string, RichPresenceVaultConfig>;

  // UI settings
  showStatusBarItem: boolean;
  showNoticeOnConnect: boolean;
  debugLogging: boolean;

  // Config file name inside vault
  configFileName: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  clientId: "1234567890123456789",
  globalDefaults: {
    enabled: true,
    display: {
      details: "📝 {file_name}",
      state: "🗂️ {vault_name}  ·  {file_count} notes",
      largeImageText: "Obsidian — {vault_name}",
      smallImageText: "{vault_name}",
    },
    largeIcon: {
      type: "key",
      key: "obsidian",
      url: "https://obsidian.md/images/obsidian-logo-gradient.png",
      assetPath: "",
    },
    smallIcon: {
      type: "",
      url: "",
      assetPath: ".rich-presence/vault-icon.png",
      key: "",
      fallbackEmoji: "📓",
    },
    timestamps: {
      enabled: true,
      mode: "session",
    },
    buttons: [
      { enabled: false, label: "Visit my notes", url: "" },
      { enabled: false, label: "My GitHub", url: "" },
    ],
    privacyMode: {
      enabled: false,
      hideFileName: false,
      hideVaultName: false,
      hiddenFileName: "a secret file...",
      hiddenVaultName: "a private vault",
    },
    variables: {},
    fileTypeIcons: {},
    idleSettings: {
      enabled: true,
      timeoutMinutes: 10,
      idleState: "💤 Away",
      idleDetails: "Idle",
    },
    updateInterval: 15,
  },
  vaultOverrides: {},
  showStatusBarItem: true,
  showNoticeOnConnect: true,
  debugLogging: false,
  configFileName: "rich-presence.json",
};
