---
title: Moderation
position: "7"
---

The `moderation.toml` file configures automatic moderation actions for banned words.

## Template

```toml
delete = []
kick   = []
ban    = []
mute   = []
time_to_mute = 5 # In minutes
```

## Values

| Value          | Type    | Description                                |
| -------------- | ------- | ------------------------------------------ |
| `delete`       | list    | Banned words that trigger message deletion |
| `kick`         | list    | Banned words that trigger user kick        |
| `ban`          | list    | Banned words that trigger user ban         |
| `mute`         | list    | Banned words that trigger temporary mute   |
| `time_to_mute` | integer | Duration of mute in minutes                |

## How It Works

1. When a user sends a message, the bot checks it against all lists
2. If a word matches:
   - `delete`: The message is deleted
   - `kick`: The user is kicked from the server
   - `ban`: The user is banned from the server
   - `mute`: The user is muted for the specified duration
3. The bot attempts to DM the user about the action taken

## Priority

Actions are checked in this order:

1. `ban` (most severe)
2. `kick`
3. `mute`
4. `delete` (least severe)

A word appearing in multiple lists will trigger all applicable actions.

## Examples

### Simple word filter

```toml
delete = ["badword", "offensive"]
```

### Multi-level moderation

```toml
delete = ["spam", "advertisement"]
kick   = ["insult", "harassment"]
ban    = ["hate speech", "threats"]
mute   = ["profanity"]
time_to_mute = 10
```

### Case-insensitive

All matching is case-insensitive, so "BADWORD" will match "badword" in the list.

## Safety Notes

- The bot requires appropriate permissions (Manage Messages, Kick Members, Ban Members) for these actions
- Moderation actions are logged to the console
- Users are DM'd when actioned (if possible)
