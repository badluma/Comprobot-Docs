The `fact` command returns a random fact from the [uselessfacts](https://uselessfacts.jsph.pl/) API.
## Usage

```
!fact
```

## Example response

```
Elwood Edwards did the voice for the AOL sound files (i.e. “You’ve got Mail!”).
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

def fact():
    return access_api(
        "https://uselessfacts.jsph.pl/api/v2/facts/random",
        "text",
        error_messages["fact"],
    )
```
