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
100$ added to the account of John. They now have 150$.
```

## Source code

```python
def add_money(username, amount):
    data.money["members"][username] = data.money["members"].get(username, 0) + amount
    data.save_toml(data.money, data.get_data_path(".money.toml"))
    balance = data.money["members"][username]
    return (
        choice(data.output["money"]["add_money"])
        .replace("{{AMOUNT}}", str(amount))
        .replace("{{USERNAME}}", username)
        .replace("{{BALANCE}}", str(balance))
        .replace("{{MONEY_SYMBOL}}", data.config["money_symbol"])
    )
```
