The `dare` command returns a random dare from the [Truth or Dare API](https://api.truthordarebot.xyz/).

## Usage

```
!dare
```

## Example response

```
Send a voice message to someone saying "I love you"
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

def dare():
    return api.tord(
        "https://api.truthordarebot.xyz/api/dare", args[0] if args else None
    )
```
