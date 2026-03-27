The `quote` command returns a random command from the [zenquotes.io](https://zenquotes.io/) API.
## Usage

```txt
!quote
```

## Example response

```txt
Change yourself - you are in control. 
~Mahatma Gandhi
```

## Source code

```python
import requests
from data import error_messages

def quote():
    quote_response = requests.get("https://zenquotes.io/api/random")
    try:
        data = quote_response.json()
        fetched_quote = data[0]["q"]
        author = data[0]["a"]
        response = f"""{fetched_quote}\n~{author}"""
    except (requests.exceptions.JSONDecodeError, KeyError, IndexError):
        response = error_messages["quote"]
    return response
```
