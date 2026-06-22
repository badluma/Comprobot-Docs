The `never-have-i-ever` command returns a random "Never Have I Ever" statement from the [Truth or Dare API](https://api.truthordarebot.xyz/).

## Usage

```
!never-have-i-ever [rating]
```

Aliases: `!nhie`

Optionally filter by rating: `pg`, `pg13`, or `r`.

## Example response

```
Never have I ever sent a text to the wrong person.
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
```
