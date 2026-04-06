---
title: Active Commands
position: "2"
---

The `active.toml` file controls which commands are enabled or disabled.

## Template

```toml
quote             = true
joke              = true
meme              = true
waifu             = true
image             = true
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

truth             = true
dare              = true
wyr               = true
never_have_i_ever = true
paranoia          = true

nsfw              = false

purge             = true
```

## Values

### General Commands

| Value          | Default | Description                                                |
| -------------- | ------- | ---------------------------------------------------------- |
| `quote`        | `true`  | Enable/disable the `quote` command                         |
| `joke`         | `true`  | Enable/disable the `joke` command                          |
| `meme`         | `true`  | Enable/disable the `meme` command                          |
| `waifu`        | `true`  | Enable/disable the `waifu` command                         |
| `image`        | `true`  | Enable/disable the `image` command (used for duck/dog/cat) |
| `duck`         | `true`  | Enable/disable the `duck` command                          |
| `dog`          | `true`  | Enable/disable the `dog` command                           |
| `cat`          | `true`  | Enable/disable the `cat` command                           |
| `chuck_norris` | `true`  | Enable/disable the `chuck` command                         |
| `fact`         | `true`  | Enable/disable the `fact` command                          |
| `bible`        | `true`  | Enable/disable the `bible` command                         |
| `calculate`    | `true`  | Enable/disable the `calculate` command                     |
| `bitcoin`      | `true`  | Enable/disable the `bitcoin` command                       |
| `currency`     | `true`  | Enable/disable the `currency` command                      |
| `qr_code`      | `true`  | Enable/disable the `qr` command                            |

### Truth or Dare Commands

| Value               | Default | Description                           |
| ------------------- | ------- | ------------------------------------- |
| `truth`             | `true`  | Enable/disable the `truth` command    |
| `dare`              | `true`  | Enable/disable the `dare` command     |
| `wyr`               | `true`  | Enable/disable the `wyr` command      |
| `never_have_i_ever` | `true`  | Enable/disable the `nhie` command     |
| `paranoia`          | `true`  | Enable/disable the `paranoia` command |

### Other

| Value   | Default | Description                                      |
| ------- | ------- | ------------------------------------------------ |
| `nsfw`  | `false` | Enable/disable NSFW content in the waifu command |
| `purge` | `true`  | Enable/disable the `purge` command               |

## Examples

### Disable multiple commands

```toml
meme    = false
waifu   = false
nsfw    = false
```

### Enable only specific commands

```toml
quote          = true
joke           = true
meme           = true
duck           = false
dog            = false
cat            = false
chuck_norris   = false
fact           = false
bible          = false
calculate      = false
bitcoin        = false
currency       = false
qr_code        = false
truth          = false
dare           = false
wyr            = false
never_have_i_ever = false
paranoia       = false
```
