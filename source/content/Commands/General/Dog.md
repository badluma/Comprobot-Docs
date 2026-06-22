The `dog` command returns a random image from the [Random.Dog](https://random.dog/) API.

## Usage

```
!dog
```

## Example response

```
https://random.dog/c70ec919-5ca0-438f-80f2-b292812e19f3.jpg
```

Preview:
![](https://random.dog/c70ec919-5ca0-438f-80f2-b292812e19f3.jpg)

## Source code

```python
def dog():
    success, url = access_api(
        "https://random.dog/woof.json", "url", error_messages["dog"]
    )
    if not success:
        return url
    return choice(output["general"]["dog"]).replace(r"{{URL}}", url)
```
