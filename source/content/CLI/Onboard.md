The `onboard` command runs the interactive setup wizard. It guides you through creating a Discord bot, setting your token, choosing which commands to enable, and optionally configuring an AI provider. Once done, it starts the bot automatically.

## Usage

```
comprobot onboard
```

## Steps

1. Prompts for your bot token.
2. Lets you choose which commands to activate.
3. Asks if you want to enable AI features, and if so, which provider (Groq, Gemini, or Ollama) and which model.
4. Saves all settings and starts the bot.

## Notes

Run this once after installing. To reconfigure later, use `comprobot config` or edit the TOML files in your data directory directly.
