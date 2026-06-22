---
title: Customization
position: "4"
---

Comprobot uses TOML configuration files stored in the bot's data directory. On Linux this is typically `~/.local/share/Comprobot/`, on Mac it's `~/Library/Application Support/Comprobot/`, and on Windows it's `%APPDATA%\Comprobot\`.

## Configuration Files

| File                                 | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| [Config](Config)                     | Basic bot settings (prefix, admins, ASCII art)   |
| [Active Commands](Active%20Commands) | Enable/disable individual commands               |
| [Keywords](Keywords)                 | Customize command triggers and aliases           |
| [Error Messages](Error%20Messages)   | Custom error messages for failed commands        |
| [Output](Output)                     | Customize command output format with variables   |
| [AI](AI)                             | AI chat settings (provider, model, prompts)      |
| [Moderation](Moderation)             | Automatic moderation for banned words            |
| [Money](Money)                       | User balances (auto-managed)                     |
| [Descriptions](Descriptions)         | Command descriptions shown in `!help`            |

## Getting Started

You can edit any `.toml` file directly with a text editor. Changes take effect after restarting the bot. For a quicker way to configure things, use the built-in config editor:

```bash
# Interactive TUI editor
comprobot config

# Non-interactive: edit a specific key
comprobot config ai provider groq
comprobot config secrets BOT_TOKEN abc
```

Keep your `.env` file private — it contains your bot token and API keys.
