The `bibel` command returns either a random or a custom bible verse from the [Bible API]().
## Usage

```
!bible [book] [chapter] [verse]
```

## Example response

### Random

User:
```
!bible
```

Bot:
```
Yahweh, keep me from the hands of the wicked. Preserve me from the violent men who have determined to trip my feet. 

Psalms 140:4
```

### Custom verse

User:
```
!bible Genesis 1 1
```

Bot:
```
In the beginning, God created the heavens and the earth. 

Genesis 1:1
```

## Source code

```python
import requests
from data import error_messages

def bible():
    bible_response = requests.get(
	    "https://bibleapi.com/data/web/random"
	)
    if bible_response.status_code == 200:
        try:
            data = bible_response.json()
            if "random_verse" in data:
                verse = data["random_verse"]
                response = f"{verse['text']}{verse['book']} {verse['chapter']}, {verse['verse']}"
            else:
                response = error_messages["bible"]
        except (requests.exceptions.JSONDecodeError, KeyError):
            response = error_messages["bible"]
    else:
        response = f"{error_messages['bible']} ({bible_response.status_code})"
    return response
```
