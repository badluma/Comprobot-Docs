The `fact` command returns a random useless fact from the [Useless Facts API](https://uselessfacts.jsph.pl/).

## Usage

```
!fact
```

## Example response

```
Elwood Edwards did the voice for the AOL sound files (i.e. "You've got Mail!").
```

## Source code

```python
def fact():
    success, fact_text = access_api(
        "https://uselessfacts.jsph.pl/api/v2/facts/random",
        "text",
        error_messages["fact"],
    )
    if not success:
        return fact_text
    return choice(output["general"]["fact"]).replace(r"{{FACT}}", fact_text)
```
