The `check` command shows the current balance for a user.

## Usage

```
!check <username>
```

Aliases: `!check_balance`, `!balance`

## Example response

User:
```
!check John
```

Bot:
```
The balance of the account from John is currently 150$.
```

## Source code

```python
def check_balance(username):
    try:
        balance = data.money["members"][username]
    except (KeyError, tomlkit.exceptions.NonExistentKey):
        data.money["members"][username] = 0
        data.save_toml(data.money, data.get_data_path(".money.toml"))
        balance = 0
    return (
        choice(data.output["money"]["check_balance"])
        .replace("{{USERNAME}}", username)
        .replace("{{BALANCE}}", str(balance))
        .replace("{{MONEY_SYMBOL}}", data.config["money_symbol"])
    )
```
