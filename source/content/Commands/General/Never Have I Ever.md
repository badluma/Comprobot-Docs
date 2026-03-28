The `never-have-i-ever` command returns a random "Never Have I Ever" question from the [Truth or Dare API](https://api.truthordarebot.xyz/).

## Usage

```
!never-have-i-ever
```

Aliases: `!nhie`

## Example response

```
Never have I ever sent a text to the wrong person
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

def never_have_i_ever():
    return api.tord(
        "https://api.truthordarebot.xyz/api/nhie", args[0] if args else None
    )
```
