The `chuck` command returns a random Chuck Norris joke from the [ChuckNorris.io](https://chucknorris.io) API.
## Usage

```
!chuck
```

## Example response

```
For St. Patrick's day, Chuck Norris caught and crucified a Leprechaun, drank six kegs of green beer and roundhouse kicked the mayor of Boston.
```

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

def chuck():
    return access_api(
        "https://api.chucknorris.io/jokes/random", 
        "value", 
        error_messages["chuck"]
    )
```
