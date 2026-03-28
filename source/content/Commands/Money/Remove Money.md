The `remove` command removes money from a user's balance.

## Usage

```
!remove <username> <amount>
```

Aliases: `!rm`, `!remove_money`

Requires administrator permissions or bot admin status.

## Example response

User:

```
!remove John 50
```

Bot:

```
50 subtracted from John. They now have 100$.
```

If the user doesn't have enough money:

```
John doesn't have enough money. They now have 0$.
```

## Source code

```python
def remove_money(username, amount):
    current = data.money["members"].get(username, 0)
    if current < amount:
        data.money["members"][username] = 0
        data.save_toml(data.money, "data/.do_not_touch/money.toml")
        return f"{username} doesn't have enough money. They now have 0{data.config['money_symbol']}."
    else:
        data.money["members"][username] -= amount
        data.save_toml(data.money, "data/.do_not_touch/money.toml")
        return f"{amount} subtracted from {username}. They now have {data.money['members'][username]}{data.config['money_symbol']}."
```
