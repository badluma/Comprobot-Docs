The `joke` command fetches a random joke from the [Official Jokes API](https://official-joke-api.appspot.com/jokes/random) and hides the punchline using Discord's spoiler tags.

## Usage

```
!joke
```

## Example response

```
What do you get when you cross a snowman with a vampire? ||Frostbite.||
```

*The text between `||` is hidden until clicked.*

## Source code

```python
def joke():
    raw = requests.get("https://official-joke-api.appspot.com/jokes/random")
    if raw.status_code != 200:
        return f"{error_messages['joke']} (HTTP {raw.status_code})"
    try:
        data = raw.json()
        response = (
            choice(output["general"]["joke"])
            .replace(r"{{SETUP}}", data["setup"])
            .replace(r"{{PUNCHLINE}}", data["punchline"])
        )
    except (requests.exceptions.JSONDecodeError, KeyError):
        response = error_messages["joke"]
    return response
```
