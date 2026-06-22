The `qr` command generates a QR code image from a URL using the [QR Server API](https://api.qrserver.com/v1/create-qr-code/).

## Usage

```
!qr <link>
```

Aliases: `!qr_code`

## Example response

User:
```
!qr https://example.com
```

Bot:
```
https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com
```

Preview:
![](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com)

## Source code

```python
def qr(link):
    url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={link}"
    return choice(output["general"]["qr_code"]).replace(r"{{URL}}", url)
```
