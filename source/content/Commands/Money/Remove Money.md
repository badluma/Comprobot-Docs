The `subtract` command subtracts money from a user's balance.

## Usage

```
!subtract <username> <amount>
```

Aliases: `!sub`, `!remove_money`

Requires administrator permissions or bot admin status.

## Example response

User:
```
!subtract John 50
```

Bot:
```
50 subtracted from the account of John. They now have 100$.
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
        data.save_toml(data.money, data.get_data_path(".money.toml"))
        return (
            choice(data.output["money"]["insufficient_funds"])
            .replace("{{USERNAME}}", username)
            .replace("{{BALANCE}}", str(0))
            .replace("{{MONEY_SYMBOL}}", data.config["money_symbol"])
        )
    else:
        data.money["members"][username] -= amount
        data.save_toml(data.money, data.get_data_path(".money.toml"))
        balance = data.money["members"][username]
        return (
            choice(data.output["money"]["remove_money"])
            .replace("{{AMOUNT}}", str(amount))
            .replace("{{USERNAME}}", username)
            .replace("{{BALANCE}}", str(balance))
            .replace("{{MONEY_SYMBOL}}", data.config["money_symbol"])
        )
```
