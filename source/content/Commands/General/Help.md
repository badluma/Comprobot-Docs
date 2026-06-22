The `help` command lists the available command categories, or the commands within a specific category along with their descriptions and aliases.

## Usage

```
!help [category]
```

Running it without arguments lists the categories. Pass a category name to list its commands. Only enabled commands are shown.

## Example response

User:
```
!help
```

Bot:
```
# Categories
General
!help general

Settings
!help settings

Money
!help money
```

User:
```
!help money
```

Bot:
```
## Money
!add - Add money to a user's balance (admin only)
Aliases: !add_money

!subtract - Remove money from a user's balance (admin only)
Aliases: !sub, !remove_money

!check - Check a user's money balance
Aliases: !check_balance, !balance
```

## Source code

```python
def help(category=None):
    if not category:
        message = "# Categories"

        for category in list(keywords.keys()):
            message += f"\n**{category.title()}**\n!help {category}\n-# ​"
        return message
    else:
        if category.lower() not in list(keywords.keys()):
            return error_messages["unknown_category"]
        message = f"## {category.title()}\n"
        for command in list(keywords[category.lower()].keys()):
            if active.get(category.lower(), {}).get(command, True):
                message += f"\n**{config['prefix']}{keywords[category.lower()][command][0]}** - {descriptions[category.lower()][command]}"
                if len(keywords[category.lower()][command]) > 1:
                    message += f"\n-# Aliases: {', '.join(config['prefix'] + alias for alias in keywords[category.lower()][command][1:])}"
                message += "\n-# ​"
        return message
```
