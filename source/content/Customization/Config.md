---
title: Config
position: "1"
---

The `config.toml` file contains the basic settings for your bot.

## Template

```toml
prefix         = "!"

money_symbol   = "$"
ascii_art      = ["¯\\_(ツ)_/¯"]
bot_admins     = []

debug_mode     = false

whitelist      = []
whitelist_mode = false
```

## Values

| Value          | Type    | Description                                                       |
| -------------- | ------- | ----------------------------------------------------------------- |
| `prefix`       | string  | The prefix used to invoke all commands                            |
| `money_symbol` | string  | The symbol displayed next to money amounts                        |
| `bot_admins`   | list    | Discord user IDs that have bot admin access                       |
| `ascii_art`    | list    | ASCII art strings that `!ascii` randomly returns                  |
| `debug_mode`     | boolean | Run moderation checks on admin and bot messages too (for testing) |
| `whitelist`      | list    | Channel IDs the bot is limited to when whitelist mode is on        |
| `whitelist_mode` | boolean | Restrict the bot to only respond in whitelisted channels           |

## Examples

### Change command prefix

```toml
prefix = "?"
```

### Add bot admins

```toml
bot_admins = [123456789012345678, 987654321098765432]
```

### Add custom ASCII art

```toml
ascii_art = ["¯\\_(ツ)_/¯", "( ͡° ͜ʖ ͡°)", "┬─┬ノ( º _ ºノ)"]
```

### Restrict the bot to specific channels

```toml
whitelist      = [123456789012345678, 987654321098765432]
whitelist_mode = true
```
