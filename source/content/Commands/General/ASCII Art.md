The `ascii` command returns a random ASCII art string from the list configured in `config.toml`.

## Usage

```
!ascii
```

Aliases: `!art`

## Example response

```
¯\_(ツ)_/¯
```

## Source code

```python
def ascii():
    if not config["ascii_art"]:
        return error_messages["no_ascii_art"]
    return choice(output["general"]["ascii_art"]).replace(
        r"{{ASCII_ART}}", choice(config["ascii_art"])
    )
```
