The `dog` command returns a random image from the [Random.Dog](https://random.dog/)) API.
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

def dog():
    return access_api(
	    "https://random.dog/woojson", 
	    "url", 
	    error_messages["dog"]
	)
```
