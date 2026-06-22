---
title: Active Commands
position: "2"
---

The `active.toml` file controls which commands are enabled or disabled. Commands are grouped into `[general]`, `[settings]`, and `[money]` sections.

## Template

```toml
[general]
quote             = true
joke              = true
meme              = true
waifu             = true
duck              = true
dog               = true
cat               = true
chuck_norris      = true
fact              = true
bible             = true
calculate         = true
bitcoin           = true
currency          = true
qr_code           = true
reminder          = true
ascii_art         = true
help              = true
truth             = true
dare              = true
wyr               = true
never_have_i_ever = true
paranoia          = true
trivia            = true
nsfw              = false
purge             = true

[settings]
settings          = true
profile_picture   = true
banner            = true
change_name       = true
change_keywords   = true

[money]
add_money         = true
remove_money      = true
check_balance     = true
```

## Values

### General Commands

| Value          | Default | Description                            |
| -------------- | ------- | -------------------------------------- |
| `quote`        | `true`  | Enable/disable the `quote` command     |
| `joke`         | `true`  | Enable/disable the `joke` command      |
| `meme`         | `true`  | Enable/disable the `meme` command      |
| `waifu`        | `true`  | Enable/disable the `waifu` command     |
| `duck`         | `true`  | Enable/disable the `duck` command      |
| `dog`          | `true`  | Enable/disable the `dog` command       |
| `cat`          | `true`  | Enable/disable the `cat` command       |
| `chuck_norris` | `true`  | Enable/disable the `chuck` command     |
| `fact`         | `true`  | Enable/disable the `fact` command      |
| `bible`        | `true`  | Enable/disable the `bible` command     |
| `calculate`    | `true`  | Enable/disable the `calculate` command |
| `bitcoin`      | `true`  | Enable/disable the `bitcoin` command   |
| `currency`     | `true`  | Enable/disable the `currency` command  |
| `qr_code`      | `true`  | Enable/disable the `qr` command        |
| `reminder`     | `true`  | Enable/disable the `reminder` command  |
| `ascii_art`    | `true`  | Enable/disable the `ascii` command     |
| `help`         | `true`  | Enable/disable the `help` command      |

### Truth or Dare Commands

| Value               | Default | Description                           |
| ------------------- | ------- | ------------------------------------- |
| `truth`             | `true`  | Enable/disable the `truth` command    |
| `dare`              | `true`  | Enable/disable the `dare` command     |
| `wyr`               | `true`  | Enable/disable the `wyr` command      |
| `never_have_i_ever` | `true`  | Enable/disable the `nhie` command     |
| `paranoia`          | `true`  | Enable/disable the `paranoia` command |
| `trivia`            | `true`  | Enable/disable the `trivia` command   |

### Other

| Value   | Default | Description                                      |
| ------- | ------- | ------------------------------------------------ |
| `nsfw`  | `false` | Enable/disable NSFW content in the waifu command |
| `purge` | `true`  | Enable/disable the `purge` command               |

### Settings Commands

| Value             | Default | Description                                  |
| ----------------- | ------- | -------------------------------------------- |
| `settings`        | `true`  | Enable/disable the settings command group    |
| `profile_picture` | `true`  | Enable/disable the `pfp` command             |
| `banner`          | `true`  | Enable/disable the `banner` command          |
| `change_name`     | `true`  | Enable/disable the `name` command            |
| `change_keywords` | `true`  | Enable/disable the `keywords` command        |

### Money Commands

| Value           | Default | Description                            |
| --------------- | ------- | -------------------------------------- |
| `add_money`     | `true`  | Enable/disable the `add` command       |
| `remove_money`  | `true`  | Enable/disable the `subtract` command  |
| `check_balance` | `true`  | Enable/disable the `check` command     |

## Examples

### Disable multiple commands

```toml
[general]
meme  = false
waifu = false
nsfw  = false
```

### Disable a whole category

```toml
[money]
add_money     = false
remove_money  = false
check_balance = false
```
