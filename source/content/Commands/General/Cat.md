The `cat` command returns a random image from [The Cat API]([https://random.dog/](https://thecatapi.com/)).
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
import requests
from data import error_messages

def cat():
    raw = requests.get("https://api.thecatapi.com/v1/images/search")
    if raw.status_code == 200:
        try:
            data = raw.json()
            response = data[0]["url"]
        except (requests.exceptions.JSONDecodeError, KeyError, IndexError):
            response = error_messages["cat"]
    else:
        response = error_messages["cat"]
    return response
```
