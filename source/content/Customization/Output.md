---
title: Output
position: "5"
---

The `output.toml` file allows you to customize the format of command outputs using variables.

## Template

```toml
[general]
quote             = ["{{QUOTE}}\n~ {{AUTHOR}}"]
joke              = ["{{SETUP}} ||{{PUNCHLINE}}||"]
meme              = ["{{URL}}"]
waifu             = ["### Which one is the better waifu? \n ![]({{URL1}}) ![]({{URL2}})"]
duck              = ["{{URL}}"]
dog               = ["{{URL}}"]
cat               = ["{{URL}}"]
chuck_norris      = ["{{JOKE}}"]
fact              = ["{{FACT}}"]
bible             = ["{{PASSAGE}}\n{{BOOK}} {{CHAPTER}}:{{VERSE}}"]
calculate         = ["{{RESULT}}"]
bitcoin           = ["The bitcoin price is currently at {{AMOUNT}} {{CURRENCY}}."]
currency          = ["{{FROM_AMOUNT}} {{FROM_CURRENCY}} = {{TO_AMOUNT}} {{TO_CURRENCY}}"]
qr_code           = ["{{URL}}"]
reminder          = ["Reminder set in {{TIME}}"]
ascii_art         = ["{{ASCII_ART}}"]
truth             = ["{{QUESTION}}"]
dare              = ["{{QUESTION}}"]
wyr               = ["{{QUESTION}}"]
never_have_i_ever = ["{{QUESTION}}"]
paranoia          = ["{{QUESTION}}"]
trivia            = ["## {{QUESTION}}\n1. {{CHOICE1}}\n2. {{CHOICE2}}\n3. {{CHOICE3}}\n4. {{CHOICE4}}\n\n-# Difficulty: {{DIFFICULTY}}\n-# Category: {{CATEGORY}}"]

[settings]
profile_picture_applied = ["Profile picture applied successfully."]
banner_applied          = ["Banner applied successfully."]
nickname_applied        = ["Name '{{NAME}}' applied successfully."]
keywords_applied        = ["Custom keywords '{{KEYWORDS}}' for the command '{{COMMAND}}' applied successfully!"]

[money]
add_money          = ["{{AMOUNT}}{{MONEY_SYMBOL}} added to to the account of {{USERNAME}}. They now have {{BALANCE}}{{MONEY_SYMBOL}}."]
remove_money       = ["{{AMOUNT}} subtracted from the account of {{USERNAME}}. They now have {{BALANCE}}{{MONEY_SYMBOL}}."]
check_balance      = ["The balance of the account from {{USERNAME}} is currently {{BALANCE}}{{MONEY_SYMBOL}}."]
insufficient_funds = ["{{USERNAME}} doesn't have enough money. They now have {{BALANCE}}{{MONEY_SYMBOL}}."]

[moderation]
delete = ["Your message was deleted because it contains banned text: {{TEXT}}"]
kick   = ["Your account was kicked because your message contains banned text: {{TEXT}}"]
ban    = ["Your account was banned because your message contains banned text: {{TEXT}}"]
mute   = ["Your account was muted for {{MINUTES}} minutes because your message contains banned text: {{TEXT}}"]

reason = "Sending banned text"
```

## Variables

### Command Variables

| Command                                 | Variables                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `quote`                                 | `{{QUOTE}}`, `{{AUTHOR}}`                                                                  |
| `joke`                                  | `{{SETUP}}`, `{{PUNCHLINE}}`                                                               |
| `meme`, `duck`, `dog`, `cat`, `qr_code` | `{{URL}}`                                                                                  |
| `waifu`                                 | `{{URL1}}`, `{{URL2}}`                                                                     |
| `chuck_norris`                          | `{{JOKE}}`                                                                                 |
| `fact`                                  | `{{FACT}}`                                                                                 |
| `bible`                                 | `{{PASSAGE}}`, `{{BOOK}}`, `{{CHAPTER}}`, `{{VERSE}}`                                      |
| `calculate`                             | `{{RESULT}}`                                                                               |
| `bitcoin`                               | `{{AMOUNT}}`, `{{CURRENCY}}`                                                               |
| `currency`                              | `{{FROM_AMOUNT}}`, `{{FROM_CURRENCY}}`, `{{TO_AMOUNT}}`, `{{TO_CURRENCY}}`                 |
| `reminder`                              | `{{TIME}}`                                                                                 |
| `ascii_art`                             | `{{ASCII_ART}}`                                                                            |
| `trivia`                                | `{{QUESTION}}`, `{{CHOICE1}}`–`{{CHOICE4}}`, `{{DIFFICULTY}}`, `{{CATEGORY}}`              |
| Truth or Dare                           | `{{QUESTION}}`                                                                             |

### Settings Variables

| Setting            | Variables                     |
| ------------------ | ----------------------------- |
| `nickname_applied` | `{{NAME}}`                    |
| `keywords_applied` | `{{KEYWORDS}}`, `{{COMMAND}}` |

### Money Variables

| Action               | Variables                                                       |
| -------------------- | --------------------------------------------------------------- |
| `add_money`          | `{{AMOUNT}}`, `{{MONEY_SYMBOL}}`, `{{USERNAME}}`, `{{BALANCE}}` |
| `remove_money`       | `{{AMOUNT}}`, `{{MONEY_SYMBOL}}`, `{{USERNAME}}`, `{{BALANCE}}` |
| `check_balance`      | `{{USERNAME}}`, `{{BALANCE}}`, `{{MONEY_SYMBOL}}`               |
| `insufficient_funds` | `{{USERNAME}}`, `{{BALANCE}}`, `{{MONEY_SYMBOL}}`               |

### Moderation Variables

| Action   | Variables                 |
| -------- | ------------------------- |
| `delete` | `{{TEXT}}`                |
| `kick`   | `{{TEXT}}`                |
| `ban`    | `{{TEXT}}`                |
| `mute`   | `{{MINUTES}}`, `{{TEXT}}` |

## Multiple Output Formats

You can specify multiple output formats for a single command. The bot will randomly pick one.

## Examples

### Simple quote format

```toml
[general]
quote = ["\"{{QUOTE}}\" - {{AUTHOR}}"]
```

### Emphasized joke format

```toml
[general]
joke = ["**Setup:** {{SETUP}}\n||**Punchline:** {{PUNCHLINE}}||"]
```

### Custom balance message

```toml
[money]
check_balance = ["💰 {{USERNAME}}: {{BALANCE}}{{MONEY_SYMBOL}}"]
```

### Bible with styling

```toml
[general]
bible = ["📖 **{{BOOK}} {{CHAPTER}}:{{VERSE}}**\n\n{{PASSAGE}}"]
```
