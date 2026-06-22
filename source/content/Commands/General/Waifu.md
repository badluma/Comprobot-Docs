The `waifu` command fetches two random waifu images from [waifu.pics](https://waifu.pics/) (falling back to [waifu.im](https://waifu.im/)) and asks you to pick your favorite.

## Usage

```
!waifu
```

## Example response

```
### Which one is the better waifu?
![](https://i.waifu.pics/image1.jpg) ![](https://i.waifu.pics/image2.jpg)
```

## Source code

```python
def _fetch_waifu_url():
    try:
        r = requests.get("https://api.waifu.pics/sfw/waifu", timeout=10)
        if r.status_code == 200:
            return r.json()["url"]
    except (requests.exceptions.RequestException, KeyError):
        pass
    try:
        r = requests.get("https://api.waifu.im/search/?included_tags=waifu", timeout=10)
        if r.status_code == 200:
            return r.json()["images"][0]["url"]
    except (requests.exceptions.RequestException, KeyError, IndexError):
        pass
    return None


def waifu():
    url1 = _fetch_waifu_url()
    if url1 is None:
        return error_messages["waifu"]
    url2 = _fetch_waifu_url()
    if url2 is None:
        return error_messages["waifu"]
    return (
        choice(output["general"]["waifu"])
        .replace(r"{{URL1}}", url1)
        .replace(r"{{URL2}}", url2)
    )
```
