The `config` command lets you edit the bot's configuration files. Run it without arguments for an interactive TUI, or pass arguments directly for non-interactive use.

## Usage

**Interactive (TUI):**
```
comprobot config
```

**Non-interactive:**
```
comprobot config <file> <key> <value>
```

**Edit secrets (`.env`):**
```
comprobot config secrets <key> <value>
```

## Examples

```sh
# Set the AI provider
comprobot config ai provider groq

# Change the command prefix
comprobot config config prefix !

# Set the bot token
comprobot config secrets BOT_TOKEN your-token-here

# Enable debug mode
comprobot config config debug_mode true
```

## Notes

- `<file>` is the config filename without the `.toml` extension (e.g. `ai`, `config`, `active`).
- `secrets` is a special alias that targets the `.env` file instead of a TOML file.
- For list values, pass multiple space-separated values: `comprobot config config bot_admins 123456 789012`.
- Changes take effect after restarting the bot.
