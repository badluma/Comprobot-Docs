---
title: Money
position: "8"
---

The `.money.toml` file stores user balances for the economy system. It's a hidden file (note the leading dot) that the bot creates and manages on its own.

## Template

```toml
members = {}
```

## Structure

The `members` object stores user balances using Discord user IDs as keys:

```toml
members = { badluma = 100 }
```

## Values

| Key         | Value | Description                                                  |
| ----------- | ----- | ------------------------------------------------------------ |
| members     | dict  | The dictionary that stores the money values.                 |
| username(s) | int   | Is named after the user's username and stores their balance. |

## Notes

- This file is automatically managed by the bot
- Manually editing is not recommended while the bot is running
- Balances persist between bot restarts

## Related Commands

- `balance` - Check a user's balance
- `add_money` - Add money to a user (admin only)
- `remove_money` - Remove money from a user (admin only)
