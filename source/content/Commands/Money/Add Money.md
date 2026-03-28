The `add` command adds money to a user's balance.

## Usage

```
!add <username> <amount>
```

Aliases: `!add_money`

Requires administrator permissions or bot admin status.

## Example response

User:

```
!add John 100
```

Bot:

```
150$ added to to John
```

## Source code

```python
def add_money(username, amount):
    data.money["members"][username] = data.money["members"].get(username, 0) + amount
    data.save_toml(data.money, "data/.do_not_touch/money.toml")
    return f"{data.money['members'][username]}{data.config['money_symbol']} added to to {username}"
```
