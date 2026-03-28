The `waifu` command returns two random waifu images from [waifu.pics](https://waifu.pics/) and asks you to pick your favorite.

## Usage

```
!waifu
```

## Example response

```
### Which one is better?

https://i.waifu.pics/image.jpg
https://i.waifu.pics/image2.jpg
```

## Source code

```python
def waifu():
    waifu1 = access_api(
        "https://api.waifu.pics/sfw/waifu", "url", error_messages["waifu"]
    )
    waifu2 = access_api(
        "https://api.waifu.pics/sfw/waifu", "url", error_messages["waifu"]
    )
    return f"""### Which one is better?

    {waifu1}
    {waifu2}"""
```
