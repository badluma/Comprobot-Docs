The `meme` command returns a random meme from Reddit through the [Meme API](https://meme-api.com/gimme).
## Usage

```txt
!meme
```

## Example response
```txt
https://i.redd.it/su7ykkspy4rg1.png
```

Preview:
![](https://i.redd.it/su7ykkspy4rg1.png)
## Source code

```python
import requests
from data import error_messages

def access_api(url, parameter, error_message, headers=None):
    if headers:
        raw = requests.get(url, headers=headers)
    else:
        raw = requests.get(url)
    if raw.status_code == 200:
        try:
            data = raw.json()
            response = data[parameter]
        except (requests.exceptions.JSONDecodeError, KeyError):
            response = str(f"{error_message}")
        except Exception as e:
            response = str(f"{error_message} (Error {str(e)})")
    else:
        response = str(f"{error_message} (HTTP {raw.status_code})")

    return response

def meme():
    return access_api("https://meme-api.com/gimme", 
    "url", 
    error_messages["meme"])
```
