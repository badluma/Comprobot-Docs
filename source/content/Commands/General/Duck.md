The `duck` command returns a random image from the [Random-Duck](https://random-d.uk) API.
## Usage

```
!duck
```

## Example response

```
https://random-d.uk/api/randomimg?t=1774612345188
```

Preview:
![](https://random-d.uk/api/randomimg?t=1774612345188)
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

def duck():
    return access_api(
	    "https://random-d.uk/api/random", 
	    "url", 
	    error_messages["duck"]
	)
```
