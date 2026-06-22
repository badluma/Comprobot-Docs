The `bible` command returns either a random or a specific Bible verse from the [Bible API](https://bible-api.com/).

## Usage

```
!bible [book] [chapter] [verse]
```

Running it without arguments returns a random verse. To look up a specific verse, provide the book name, chapter number, and verse number.

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

### Specific verse

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
def bible(is_random, book_arg="John", chapter_arg=16, verse_arg=32):
    if is_random:
        url = "https://bible-api.com/data/web/random"
    else:
        url = f"https://bible-api.com/{book_arg} {chapter_arg}:{verse_arg}"

    bible_response = requests.get(url)
    if bible_response.status_code == 200:
        try:
            data = bible_response.json()
            if "random_verse" in data:
                verse = data["random_verse"]
                response = (
                    choice(output["general"]["bible"])
                    .replace(r"{{PASSAGE}}", verse["text"].strip())
                    .replace(r"{{BOOK}}", verse["book"].strip())
                    .replace(r"{{CHAPTER}}", str(verse["chapter"]).strip())
                    .replace(r"{{VERSE}}", str(verse["verse"]).strip())
                )
            elif "text" in data and "reference" in data:
                parts = data["reference"].split()
                book = parts[0] if parts else book_arg
                ref_parts = data["reference"].split(":")
                chapter_verse = ref_parts[1] if len(ref_parts) > 1 else "1"
                chapter = (
                    chapter_verse.split(":")[0]
                    if ":" in chapter_verse
                    else chapter_verse
                )
                verse_num = chapter_verse.split(":")[1] if ":" in chapter_verse else "1"
                response = (
                    choice(output["general"]["bible"])
                    .replace(r"{{PASSAGE}}", data["text"].strip())
                    .replace(r"{{BOOK}}", book.strip())
                    .replace(r"{{CHAPTER}}", chapter.strip())
                    .replace(r"{{VERSE}}", verse_num.strip())
                )
            else:
                response = error_messages["passage_not_found"].replace(
                    r"{{PASSAGE}}", f"{book_arg} {chapter_arg}:{verse_arg}"
                )
        except (requests.exceptions.JSONDecodeError, KeyError):
            response = error_messages["bible"]
    elif bible_response.status_code == 404:
        response = error_messages["passage_not_found"].replace(
            r"{{PASSAGE}}", f"{book_arg} {chapter_arg}:{verse_arg}"
        )
    else:
        response = f"{error_messages['bible']} (HTTP {bible_response.status_code})"
    return response
```
