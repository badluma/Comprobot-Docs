---
title: Descriptions
position: "9"
---

The `descriptions.toml` file holds the short description shown for each command in the `!help` output. Descriptions are grouped into `[general]`, `[settings]`, and `[money]` sections, matching the other command config files.

## Template

```toml
[general]
quote             = "Get a random inspirational quote."
joke              = "Get a random two-part joke"
meme              = "Get a random meme image"
waifu             = "Compare two random waifu images"
duck              = "Get a random duck image"
dog               = "Get a random dog image"
cat               = "Get a random cat image"
chuck_norris      = "Get a random Chuck Norris fact"
fact              = "Get a random fun fact"
bible             = "Get a random or specific Bible verse"
calculate         = "Evaluate a math expression"
bitcoin           = "Get the current Bitcoin price in a given currency"
currency          = "Convert an amount between two currencies"
qr_code           = "Generate a QR code from a URL"
reminder          = "Set a reminder for a specific time"
ascii_art         = "Display the bot's ASCII art"
help              = "Show available commands"
truth             = "Get a truth question for truth or dare"
dare              = "Get a dare challenge for truth or dare"
wyr               = "Get a would you rather question"
never_have_i_ever = "Get a never have I ever prompt"
paranoia          = "Get a paranoia question"
trivia            = "Get a multiple-choice trivia question"
purge             = "Delete all messages in the channel (admin only)"

[settings]
settings          = "Configure the bot"
profile_picture   = "Change the bot's profile picture"
banner            = "Change the bot's banner"
change_name       = "Change the bot's username"
change_keywords   = "Change a command's trigger keywords"

[money]
check_balance     = "Check a user's money balance"
add_money         = "Add money to a user's balance (admin only)"
remove_money      = "Remove money from a user's balance (admin only)"
```

## Notes

- These strings only affect what `!help <category>` prints next to each command.
- Each key matches a command key in `keywords.toml`.
- Changes take effect after restarting the bot.
