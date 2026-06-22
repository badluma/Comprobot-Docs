---
title: Comprobot Documentation
---

Comprobot is a highly customizable, open-source Discord bot that you can run on your own computer or server.

It's built with Python and comes with a wide range of fun and useful commands. You can add new commands, customize response formats, or change the behavior of existing ones without touching the core code — all through simple TOML config files.

It also has built-in AI chat support, activated when you @mention the bot. Supported providers are Ollama, Groq, and Gemini.

Comprobot also comes with a web dashboard for managing your configuration from the browser.

## Installation

Install Comprobot with pipx:

```bash
pipx install comprobot
```

If you don't have Python or pipx yet, check out the full [Installation guide](Installation). It also covers creating a Discord bot application and adding it to your server.

In short: install via pipx, create a bot on the [Discord Developer Portal](https://discord.com/developers/applications), add it to your server, copy the token into the `.env` file in the data directory (shown when you first run `comprobot start`), then run `comprobot start` again.

## Contributing

Pull requests are always welcome on the [Comprobot GitHub repo](https://github.com/badluma/comprobot). If you have a suggestion but aren't a coder, feel free to drop it in the _suggestions_ channel on my [Discord server](https://discord.gg/g6rZtmQgbK).

## Available commands

- **General**
	- [[Commands/General/ASCII Art]]
	- [[Commands/General/Bible]]
	- [[Commands/General/Bitcoin]]
	- [[Commands/General/Calculate]]
	- [[Commands/General/Cat]]
	- [[Commands/General/Chuck Norris]]
	- [[Commands/General/Currency]]
	- [[Commands/General/Dare]]
	- [[Commands/General/Dog]]
	- [[Commands/General/Duck]]
	- [[Commands/General/Fact]]
	- [[Commands/General/Help]]
	- [[Commands/General/Joke]]
	- [[Commands/General/Meme]]
	- [[Commands/General/Never Have I Ever]]
	- [[Commands/General/Paranoia]]
	- [[Commands/General/QR Code]]
	- [[Commands/General/Quote]]
	- [[Commands/General/Reminder]]
	- [[Commands/General/Trivia]]
	- [[Commands/General/Truth]]
	- [[Commands/General/Waifu]]
	- [[Commands/General/WYR]]
- **Money**
	- [[Commands/Money/Add Money]]
	- [[Commands/Money/Balance]]
	- [[Commands/Money/Remove Money]]
- **Settings**
	- [[Commands/Settings/Banner]]
	- [[Commands/Settings/Change Keywords]]
	- [[Commands/Settings/Change Name]]
	- [[Commands/Settings/Profile Picture]]
- **Moderation**
	- [[Commands/Moderation/Purge]]

## CLI

Comprobot has several CLI subcommands: `start`, `dashboard`, `onboard`, `config`, `test`, and `reset`. See the [CLI reference](CLI) for details.

## Customization

- [[Customization/Config]]
- [[Customization/Active Commands]]
- [[Customization/Keywords]]
- [[Customization/Error Messages]]
- [[Customization/Output]]
- [[Customization/AI]]
- [[Customization/Moderation]]
- [[Customization/Money]]
- [[Customization/Descriptions]]
