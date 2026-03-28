The `wyr` command returns a random "Would You Rather" question from the [Truth or Dare API](https://api.truthordarebot.xyz/).

## Usage

```
!wyr
```

## Example response

```
Would you rather never be able to lie or never be able to tell when others are lying?
```

## Source code

```python
def tord(url, rating, max_retries=10):
    for _ in range(max_retries):
        response = requests.get(url)
        if response.status_code != 200:
            continue
        data = response.json()
        if not rating or data.get("rating") == rating:
            return data["question"]
    return None

def wyr():
    return api.tord(
        "https://api.truthordarebot.xyz/api/wyr", args[0] if args else None
    )
```
