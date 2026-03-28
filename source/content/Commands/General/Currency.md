The `currency` command converts an amount from one currency to another using the [Fawazahmed0 Currency API](https://github.com/fawazahmed0/currency-api).

## Usage

```
!currency <amount> <from_currency> <to_currency>
```

## Example response

User:

```
!currency 100 usd eur
```

Bot:

```
100 USD = 92.50 EUR
```

## Source code

```python
def currency(currency1, currency2, amount):
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return error_messages["currency"]

    currency1 = currency1.lower()
    currency2 = currency2.lower()

    available_currencies = requests.get(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    )

    if available_currencies.status_code != 200:
        return error_messages["unavailable"]

    available_currencies = available_currencies.json()

    if currency1 not in available_currencies:
        return f"{error_messages['currency']} ({currency1})"
    if currency2 not in available_currencies:
        return f"{error_messages['currency']} ({currency2})"

    raw_response = requests.get(
        f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{currency1}.json"
    )

    if raw_response.status_code != 200:
        return error_messages["unavailable"]

    raw_response = raw_response.json()

    if currency1 not in raw_response or currency2 not in raw_response[currency1]:
        return error_messages["currency"]

    rate = raw_response[currency1][currency2]
    response = rate * amount
    return f"{amount} {currency1.upper()} = {response:.2f} {currency2.upper()}"
```
