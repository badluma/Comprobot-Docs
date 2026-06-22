---
title: Keywords
position: "3"
---

The `keywords.toml` file defines the trigger words for each command. The first entry in each list is the primary command name; the rest are aliases.

## Template

```toml
[general]
quote             = ["quote"]
joke              = ["joke"]
meme              = ["meme"]
waifu             = ["waifu"]
duck              = ["duck"]
dog               = ["dog"]
cat               = ["cat"]
chuck_norris      = ["chuck", "norris", "chucknorris"]
fact              = ["fact"]
bible             = ["bible"]
calculate         = ["calculate", "calc"]
bitcoin           = ["bitcoin", "btc"]
currency          = ["currency", "convert", "conv"]
qr_code           = ["qr_code", "qr"]
reminder          = ["reminder", "remind", "todo"]
ascii_art         = ["ascii", "art"]
help              = ["help"]
truth             = ["truth"]
dare              = ["dare"]
wyr               = ["wyr"]
never_have_i_ever = ["never-have-i-ever", "nhie"]
paranoia          = ["paranoia"]
trivia            = ["trivia", "quiz", "question"]

[settings]
settings          = ["config", "set", "settings"]
profile_picture   = ["pfp", "picture", "pic"]
banner            = ["banner"]
change_name       = ["name", "nickname"]
change_keywords   = ["keywords", "key"]

[money]
add_money         = ["add", "add_money"]
remove_money      = ["subtract", "sub", "remove_money"]
check_balance     = ["check", "check_balance", "balance"]
```

## Sections

### [general]

Keywords for all regular commands, used with the configured prefix (default `!`).

### [settings]

Keywords for bot settings commands. These are subcommands of the settings group — the first entry in `settings` becomes the group name (default `config`). So settings commands are called like `!config pfp`, `!config banner`, etc.

### [money]

Keywords for the economy commands.

## Examples

### Add aliases to a command

```toml
[general]
quote = ["quote", "inspiration", "daily"]
joke  = ["joke", "funny", "pun"]
```

### Change the settings group name

```toml
[settings]
settings = ["settings", "config", "set"]
```

After this, settings commands become `!settings pfp`, `!settings banner`, etc.

## Notes

- Keywords are case-insensitive
- Changes take effect after restarting the bot
- You can also change keywords live with the `!config keywords` command
