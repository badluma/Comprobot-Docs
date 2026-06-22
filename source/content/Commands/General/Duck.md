The `duck` command returns a random duck image from the [Random-Duck](https://random-d.uk) API.

## Usage

```
!duck
```

## Example response

```
https://random-d.uk/api/images/11.jpg
```

Preview:
![](https://random-d.uk/api/images/11.jpg)

## Source code

```python
def duck():
    success, url = access_api(
        "https://random-d.uk/api/random", "url", error_messages["duck"]
    )
    if not success:
        return url
    return choice(output["general"]["duck"]).replace(r"{{URL}}", url)
```
