The `balance` command checks the money balance for a user.

## Usage

```
!balance <username>
```

Aliases: `!check`, `!check_balance`

## Example response

User:

```
!balance John
```

Bot:

```
150$
```

## Source code

```python
def check_balance(username):
    try:
        return f"{data.money['members'][username]}{data.config['money_symbol']}"
    except KeyError:
        data.money["members"][username] = 0
        data.save_toml(data.money, "data/.do_not_touch/money.toml")
        return f"0{data.config['money_symbol']}"
```
