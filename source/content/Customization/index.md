---
title: Customization
position: "4"
---

Comprobot uses TOML configuration files for easy customization. All configuration files are stored in the bot's data directory (typically `~/.local/share/Comprobot/` on Linux or `%APPDATA%\Comprobot\` on Windows).

## Configuration Files

| File                                 | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| [Config](Config)                     | Basic bot settings (prefixes, admins, ASCII art) |
| [Active Commands](Active%20Commands) | Enable/disable individual commands               |
| [Keywords](Keywords)                 | Customize command aliases/triggers               |
| [Error Messages](Error%20Messages)   | Custom error messages for failed commands        |
| [Output](Output)                     | Customize command output format with variables   |
| [AI](AI)                             | AI chat settings (provider, model, prompts)      |
| [Moderation](Moderation)             | Automatic moderation for banned words            |
| [Money](Money)                       | User balances (auto-generated)                   |

## Getting Started

Most settings can be changed while the bot is running - simply edit the TOML file and save. The bot will automatically reload the changes.

For security, keep your `.env` file private as it contains your API keys.
