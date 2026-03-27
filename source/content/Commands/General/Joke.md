A command that fetches a random joke from the [Official Jokes API from Appspot](https://official-joke-api.appspot.com/jokes/random) and hides the punchline using Discord's spoiler protection.
## Usage

```txt
!joke
```

## Example response

```txt
What do you get when you cross a snowman with a vampire? ||He let out a little wine.||
```

*The text in between `||` is hidden until you click it.*

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

def joke():
    setup = access_api(
        "https://official-joke-api.appspot.com/jokes/random",
        "setup",
        error_messages["joke"],
    )
    punchline = access_api(
        "https://official-joke-api.appspot.com/jokes/random",
        "punchline",
        error_messages["joke"],
    )
    response = f"{setup} ||{punchline}||"
    return response
```
