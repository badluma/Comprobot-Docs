The `bitcoin` command returns the current price of Bitcoin from the [CoinGecko API](https://www.coingecko.com/en/api).

## Usage

```
!bitcoin [currency]
```

Defaults to USD if no currency is specified.

## Example response

User:

```
!bitcoin
```

Bot:

```
bitcoin is at 45000.00 usd rn
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
            response = f"bitcoin is at {data['bitcoin'][currency]} {currency} rn"
        else:
            response = error_messages["currency"]
    else:
        response = error_messages["bitcoin"]
    return response
```
