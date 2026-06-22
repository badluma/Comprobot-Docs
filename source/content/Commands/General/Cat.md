The `cat` command returns a random image from [The Cat API](https://thecatapi.com/).

## Usage

```
!cat
```

## Example response

```
https://cdn2.thecatapi.com/images/zFm4AbO-d.jpg
```

Preview:
![](https://cdn2.thecatapi.com/images/zFm4AbO-d.jpg)

## Source code

```python
def cat():
    raw = requests.get("https://api.thecatapi.com/v1/images/search")
    if raw.status_code != 200:
        return f"{error_messages['cat']} (HTTP {raw.status_code})"
    try:
        data = raw.json()
        response = choice(output["general"]["cat"]).replace(r"{{URL}}", data[0]["url"])
    except (requests.exceptions.JSONDecodeError, KeyError, IndexError):
        response = error_messages["cat"]
    return response
```
