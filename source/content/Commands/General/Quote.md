The `quote` command returns a random inspirational quote from the [ZenQuotes API](https://zenquotes.io/), falling back to the [Quotable API](https://github.com/lukePeavey/quotable) if ZenQuotes is unavailable.

## Usage

```
!quote
```

## Example response

```
Change yourself - you are in control.
~ Mahatma Gandhi
```

## Source code

```python
def quote():
    for fetcher in (_fetch_quote_zenquotes, _fetch_quote_quotable):
        try:
            result = fetcher()
            if result is None:
                continue
            fetched_quote, author = result
            return (
                choice(output["general"]["quote"])
                .replace(r"{{QUOTE}}", fetched_quote)
                .replace(r"{{AUTHOR}}", author)
            )
        except (requests.exceptions.RequestException, KeyError, IndexError):
            continue
    return error_messages["quote"]
```
