The `bitcoin` command returns the current price of Bitcoin from the [CoinGecko API](https://www.coingecko.com/en/api).

## Usage

```
!bitcoin [currency]
```

Aliases: `!btc`

Defaults to USD if no currency is specified.

## Example response

User:
```
!bitcoin
```

Bot:
```
The bitcoin price is currently at 45000.0 USD.
```

User:
```
!btc eur
```

Bot:
```
The bitcoin price is currently at 41500.0 EUR.
```

## Source code

```python
def bitcoin(currency_parameter):
    currency = currency_parameter.lower() if len(str(currency_parameter)) > 1 else "usd"
    bitcoin_price = requests.get(
        f"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies={currency}"
    )
    if bitcoin_price.status_code == 200:
        data = bitcoin_price.json()
        if "bitcoin" in data and currency in data["bitcoin"]:
            response = (
                choice(output["general"]["bitcoin"])
                .replace(r"{{AMOUNT}}", str(data["bitcoin"][currency]))
                .replace(r"{{CURRENCY}}", currency.upper())
            )
        else:
            response = error_messages["currency"]
    else:
        response = error_messages["bitcoin"]
    return response
```
