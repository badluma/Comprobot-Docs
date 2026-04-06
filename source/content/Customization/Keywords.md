---
title: Keywords
position: "3"
---

The `keywords.toml` file defines the aliases/triggers for each command.

## Template

```toml
[commands]
quote             = ["quote"]
joke              = ["joke"]
meme              = ["meme"]
waifu             = ["waifu"]
image             = ["image", "picture"]
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
ascii_art         = ["ascii", "art"]

truth             = ["truth"]
dare              = ["dare"]
wyr               = ["wyr"]
never_have_i_ever = ["never-have-i-ever", "nhie"]
paranoia          = ["paranoia"]

[settings]
settings          = ["config", "set", "settings"]
profile_picture   = ["pfp", "picture", "pic"]
banner            = ["banner"]
change_name       = ["name", "nickname"]
change_keywords   = ["keywords", "key"]

[money]
add_money         = ["add", "add_money"]
remove_money      = ["remove", "rm", "remove_money"]
check_balance     = ["check", "check_balance", "balance"]
```

## Sections

### [commands]

Contains keywords for all general commands.

### [settings]

Contains keywords for settings commands (accessed with `s!` prefix).

### [money]

Contains keywords for money/economy commands.

## Examples

### Add aliases to a command

```toml
[commands]
quote           = ["quote", "inspiration", "daily"]
joke            = ["joke", "funny", "pun"]
```

### Change the trigger for settings commands

```toml
[settings]
settings        = ["config", "set", "settings", "cfg"]
profile_picture = ["pfp", "picture", "pic", "avatar"]
banner          = ["banner", "bg"]
change_name     = ["name", "nickname", "rename"]
change_keywords = ["keywords", "key", "alias"]
```

## Notes

- Keywords are case-insensitive
- Multiple aliases can be used for a single command
- Changes to keywords take effect immediately (no restart required)
