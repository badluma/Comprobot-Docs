---
title: Error Messages
position: "4"
---

The `error_messages.toml` file contains custom error messages for when commands fail.

## Template

```toml
quote             = "Failed to get a quote."
joke              = "Failed to get a joke."
meme              = "Failed to get a meme."
waifu             = "Failed to get a waifu image."
duck              = "Failed to get a duck image."
dog               = "Failed to get a dog image."
cat               = "Failed to get a cat image."
chuck             = "Failed to get a Chuck Norris joke."
fact              = "Failed to get a fact."
bible             = "Failed to get a bible verse."
passage_not_found = "Couldn't find bible passage: {{PASSAGE}}"
truth             = "Failed to get a truth question."
dare              = "Failed to get a dare question."
wyr               = "Failed to get a Would You Rather question."
never-hie         = "Failed to get a Never Have I Ever question."
paranoia          = "Failed to get a paranoia question."
trivia            = "Failed to get a trivia question."
calculate         = "Invalid calculation. Use +-*/"
bitcoin           = "Failed to get the current bitcoin price."
currency          = "Unknown currency."
unavailable       = "API unavailable."
unknown_command   = "Unknown command."
unknown_argument  = "Unknown argument."
missing_argument  = "Missing argument."
no_attachment     = "No attachment given."
bot_unavailable   = "Bot not available."
unknown_category  = "Unknown category."
no_ascii_art      = "No ASCII art available."
unknown_unit      = "Unknown unit: {{UNIT}}"
```

## Values

### Command Error Messages

| Value               | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| `quote`             | Error message when the quote API fails                                            |
| `joke`              | Error message when the joke API fails                                             |
| `meme`              | Error message when the meme API fails                                             |
| `waifu`             | Error message when the waifu API fails                                            |
| `duck`              | Error message when the duck API fails                                             |
| `dog`               | Error message when the dog API fails                                              |
| `cat`               | Error message when the cat API fails                                              |
| `chuck`             | Error message when the Chuck Norris API fails                                     |
| `fact`              | Error message when the fact API fails                                             |
| `bible`             | Error message when the bible API fails                                            |
| `passage_not_found` | Error message when a bible passage is not found (supports `{{PASSAGE}}` variable) |
| `truth`             | Error message when the truth API fails                                            |
| `dare`              | Error message when the dare API fails                                             |
| `wyr`               | Error message when the wyr API fails                                              |
| `never-hie`         | Error message when the NHIE API fails                                             |
| `paranoia`          | Error message when the paranoia API fails                                         |
| `trivia`            | Error message when the trivia API fails                                           |
| `calculate`         | Error message for invalid calculations                                            |
| `bitcoin`           | Error message when the bitcoin API fails                                          |
| `currency`          | Error message for unknown currency                                                |
| `unavailable`       | Error message when an API is unavailable                                          |

### General Error Messages

| Value              | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `unknown_command`  | Message for unknown commands                                 |
| `unknown_argument` | Message for unknown arguments                                |
| `missing_argument` | Message for missing arguments                                |
| `no_attachment`    | Message when no attachment is provided                       |
| `bot_unavailable`  | Message when the bot is unavailable                          |
| `unknown_category` | Message for an unknown `!help` category                      |
| `no_ascii_art`     | Message when no ASCII art is configured                      |
| `unknown_unit`     | Message for an invalid reminder time unit (supports `{{UNIT}}`) |

## Examples

### Customize error messages

```toml
quote    = "Couldn't fetch a quote right now. Please try again later!"
joke     = "My joke database is empty. Please tell me a joke instead!"
meme     = "No memes found. The internet is broken!"
```

### Add custom passage error

```toml
passage_not_found = "Chapter not found: {{PASSAGE}}. Try a different reference."
```
