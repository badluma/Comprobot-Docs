The `meme` command returns a random meme image from Reddit via the [Meme API](https://meme-api.com/gimme).

## Usage

```
!meme
```

## Example response

```
https://i.redd.it/su7ykkspy4rg1.png
```

Preview:
![](https://i.redd.it/su7ykkspy4rg1.png)

## Source code

```python
def meme():
    success, url = access_api(
        "https://meme-api.com/gimme", "url", error_messages["meme"]
    )
    if not success:
        return url
    return choice(output["general"]["meme"]).replace(r"{{URL}}", url)
```
