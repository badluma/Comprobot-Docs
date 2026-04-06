# ⚡ Obsidian Rich Presence

Show your Obsidian activity on Discord with **fully customizable** rich presence. Configure everything — text, icons, timestamps, buttons, privacy, per-vault settings, idle detection, and more — all through a simple JSON file.

![Rich Presence Preview](https://i.imgur.com/example.png)

---

## Features

- 📝 **Fully customizable display text** with powerful variable system
- 🖼️ **Custom large icon** — use a URL, a file from your vault, or a Discord asset key
- 🔖 **Custom small icon** — per-project branding, changes by file type, or per-vault
- ⏱️ **Timestamps** — session time, file time, or disabled
- 🔘 **Up to 2 clickable buttons** (link to your website, GitHub, etc.)
- 🔒 **Privacy mode** — hide file/vault names when sharing your screen
- 💤 **Idle detection** — shows a custom state after inactivity
- 📂 **Per-file-type icons** — different small icon for `.md`, `.canvas`, `.pdf`, etc.
- 🗂️ **Per-vault configuration** via `rich-presence.json` in vault root
- 🔄 **Auto-reload** when you save the config file — no restart needed
- 🖱️ **Status bar indicator** — shows connection status, click to toggle

---

## Installation

### Manual Install

1. Download the latest release (or build from source)
2. Copy `main.js`, `manifest.json`, and `styles.css` into:
   ```
   <your-vault>/.obsidian/plugins/obsidian-rich-presence/
   ```
3. Enable the plugin in **Settings → Community Plugins**

### Build from Source

```bash
git clone https://github.com/yourname/obsidian-rich-presence
cd obsidian-rich-presence
npm install
npm run build
```

---

## Discord Setup

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** and give it a name (e.g. "Obsidian")
3. Copy the **Application ID** (Client ID)
4. Go to **Rich Presence → Art Assets** and upload your icons
   - Upload your Obsidian logo as the large icon
   - Upload any project/vault icons as small icons
   - Note the **key names** you assign to each asset
5. Paste the Client ID into **Obsidian Settings → Rich Presence → Discord Application Client ID**

> **Note:** Discord Desktop must be running on the same machine. Discord Web does not support Rich Presence.

---

## Configuration

### Quick Start

Use the command **"Rich Presence: Create default config file"** or go to Settings and click **"Create file"**. This creates a `rich-presence.json` in your vault root with everything pre-filled and documented.

### The Config File

Place `rich-presence.json` in your **vault root** (same level as your `.obsidian` folder):

```json
{
  "enabled": true,

  "display": {
    "details": "📝 {file_name}",
    "state": "🗂️ {vault_name}  ·  {note_count} notes",
    "largeImageText": "Obsidian — {vault_name}",
    "smallImageText": "{vault_name}"
  },

  "largeIcon": {
    "type": "url",
    "url": "https://obsidian.md/images/obsidian-logo-gradient.png"
  },

  "smallIcon": {
    "type": "asset",
    "assetPath": ".rich-presence/vault-icon.png"
  },

  "timestamps": {
    "enabled": true,
    "mode": "session"
  },

  "buttons": [
    { "enabled": true, "label": "My Notes", "url": "https://example.com" },
    { "enabled": false, "label": "My GitHub", "url": "https://github.com" }
  ],

  "privacyMode": {
    "enabled": false,
    "hideFileName": true,
    "hideVaultName": false,
    "hiddenFileName": "a secret file..."
  },

  "variables": {
    "project": "My Book",
    "status": "Writing"
  },

  "fileTypeIcons": {
    "canvas": "https://example.com/canvas-icon.png",
    "pdf": "https://example.com/pdf-icon.png"
  },

  "idleSettings": {
    "enabled": true,
    "timeoutMinutes": 10,
    "idleState": "💤 Away",
    "idleDetails": "Idle — {vault_name}"
  },

  "updateInterval": 15
}
```

The config file is **reloaded automatically** when you save it — no restart needed!

---

## Available Variables

Use these in any display string (`details`, `state`, `largeImageText`, `smallImageText`, `idleState`, `idleDetails`):

| Variable | Description |
|---|---|
| `{file_name}` | Active file name (no extension) |
| `{file_name_ext}` | Active file name with extension |
| `{file_path}` | Full path from vault root |
| `{file_ext}` | File extension (e.g. `md`, `canvas`) |
| `{vault_name}` | Vault name |
| `{vault_path}` | Absolute path to vault on disk |
| `{file_count}` | Total file count in vault |
| `{note_count}` | Markdown note count |
| `{folder}` | Parent folder of active file |
| `{time}` | Current time (`HH:MM`) |
| `{date}` | Current date (`YYYY-MM-DD`) |
| `{session_time}` | Time since Obsidian opened (e.g. `2h 15m`) |
| `{file_time}` | Time since current file opened |
| `{custom.KEY}` | Custom variable from `variables` block |

**Custom variables example:**

```json
"variables": {
  "project": "My Novel",
  "chapter": "Chapter 3"
},
"display": {
  "details": "✍️ Writing {custom.project}",
  "state": "{custom.chapter}  ·  {file_name}"
}
```

---

## Icon Configuration

### Large Icon (App Icon)

The large icon represents Obsidian itself. Set it in three ways:

```json
// Option 1: External URL
"largeIcon": { "type": "url", "url": "https://example.com/obsidian.png" }

// Option 2: File inside your vault
"largeIcon": { "type": "asset", "assetPath": ".rich-presence/app-icon.png" }

// Option 3: Discord asset key (uploaded in Discord Developer Portal)
"largeIcon": { "type": "key", "key": "obsidian" }
```

### Small Icon (Project Icon)

The small icon overlays the large icon and is great for per-project or per-vault branding:

```json
// Option 1: External URL
"smallIcon": { "type": "url", "url": "https://example.com/project.png" }

// Option 2: File inside your vault
"smallIcon": { "type": "asset", "assetPath": ".rich-presence/vault-icon.png" }

// Option 3: Discord asset key
"smallIcon": { "type": "key", "key": "my-project" }

// Option 4: None (hidden)
"smallIcon": { "type": "" }
```

### Vault Icon Folder

For local icons, create a `.rich-presence/` folder in your vault root:

```
my-vault/
├── .rich-presence/
│   ├── app-icon.png      ← large icon
│   └── vault-icon.png    ← small icon
├── rich-presence.json
└── .obsidian/
```

### Per-File-Type Icons

Show a different small icon depending on the file type being edited:

```json
"fileTypeIcons": {
  "md":     "https://example.com/markdown-icon.png",
  "canvas": "https://example.com/canvas-icon.png",
  "pdf":    "https://example.com/pdf-icon.png",
  "excalidraw": "my-excalidraw-key"
}
```

File type icons override the default `smallIcon` setting when a matching file is open.

---

## Privacy Mode

Enable privacy mode to hide sensitive information when sharing your screen:

```json
"privacyMode": {
  "enabled": true,
  "hideFileName": true,
  "hideVaultName": false,
  "hiddenFileName": "a secret file...",
  "hiddenVaultName": "a private vault"
}
```

Toggle privacy mode quickly with the command **"Rich Presence: Toggle privacy mode"**.

---

## Idle Detection

Automatically change your presence when you haven't interacted with Obsidian for a while:

```json
"idleSettings": {
  "enabled": true,
  "timeoutMinutes": 10,
  "idleState": "💤 Away",
  "idleDetails": "Idle — {vault_name}"
}
```

The presence returns to normal automatically when you start typing or clicking again.

---

## Multiple Vaults

Each vault can have its own `rich-presence.json`. You can also set per-vault overrides in **Settings → Rich Presence** which take priority over the JSON file.

---

## Commands

| Command | Description |
|---|---|
| `Rich Presence: Reconnect to Discord` | Manually reconnect |
| `Rich Presence: Disconnect from Discord` | Stop showing presence |
| `Rich Presence: Update rich presence now` | Force refresh |
| `Rich Presence: Create default config file` | Create `rich-presence.json` |
| `Rich Presence: Toggle privacy mode` | Quick privacy toggle |

---

## Troubleshooting

**Not connecting to Discord:**
- Make sure Discord Desktop is running (not Discord Web)
- Try the "Reconnect" button in settings or via command
- Check that your Client ID is correct

**Icons not showing:**
- For `key` type: Make sure you've uploaded the asset in the Discord Developer Portal under your application's Rich Presence → Art Assets
- For `url` type: The URL must be a direct image link (ending in `.png`, `.jpg`, etc.) that is publicly accessible
- For `asset` type: The file must exist at the specified path inside your vault

**Changes not taking effect:**
- Save your `rich-presence.json` (the plugin auto-reloads on save)
- Use the "Update rich presence now" command
- Discord caches presence — changes may take a few seconds to appear

---

## License

MIT
