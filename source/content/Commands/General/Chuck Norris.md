The `chuck` command returns a random Chuck Norris joke from the [ChuckNorris.io](https://chucknorris.io) API.

## Usage

```
!chuck
```

Aliases: `!norris`, `!chucknorris`

## Example response

```
For St. Patrick's day, Chuck Norris caught and crucified a Leprechaun, drank six kegs of green beer and roundhouse kicked the mayor of Boston.
```

## Source code

```python
def chuck():
    success, joke = access_api(
        "https://api.chucknorris.io/jokes/random", "value", error_messages["chuck"]
    )
    if not success:
        return joke
    return choice(output["general"]["chuck_norris"]).replace(r"{{JOKE}}", joke)
```
