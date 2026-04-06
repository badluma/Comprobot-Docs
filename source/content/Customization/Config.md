---
title: Config
position: "1"
---

The `config.toml` file contains basic bot configuration settings.

## Template

```toml
command_prefix =  "!"
settings_prefix = "s!"
music_prefix    = "m!"

money_symbol    = "$"
bot_admins      = []
ascii_art       = ["¯\\_(ツ)_/¯"]

debug_mode      = false
```

## Values

### Command Prefixes

| Value             | Type   | Description                                           |
| ----------------- | ------ | ----------------------------------------------------- |
| `command_prefix`  | string | The prefix used to invoke regular commands            |
| `settings_prefix` | string | The prefix used to invoke settings commands           |
| `music_prefix`    | string | The prefix used for music commands (currently unused) |

### Money

| Value          | Type   | Description                                                    |
| -------------- | ------ | -------------------------------------------------------------- |
| `money_symbol` | string | The symbol used to display currency amounts                    |
| `bot_admins`   | list   | List of Discord user IDs who have admin access to bot commands |

### Fun

| Value       | Type | Description                                                         |
| ----------- | ---- | ------------------------------------------------------------------- |
| `ascii_art` | list | List of ASCII art strings that the `ascii` command randomly returns |

### Debug

| Value        | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| `debug_mode` | boolean | Enables debug mode for development |

## Examples

### Change command prefix

```toml
command_prefix = "?"
```

### Add bot admin

```toml
bot_admins = [123456789012345678]
```

### Add custom ASCII art

```toml
ascii_art = ["¯\\_(ツ)_/¯", "( ͡° ͜ʖ ͡°)", "┬─┬ノ( º _ ºノ)"]
```
