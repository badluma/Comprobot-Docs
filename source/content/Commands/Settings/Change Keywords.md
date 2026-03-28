The `keywords` command changes the keyword aliases for a command.

## Usage

```
s!keywords <command> <new_keywords...>
```

Aliases: `s!key`

## Example response

User:

```
s!keywords joke funny pun
```

This changes the keyword for the `joke` command to `funny` and `pun`.

## Source code

```python
if command in keywords["settings"]["change_keywords"]:
    if len(args) < 2:
        return error_messages["missing_argument"]
    keywords[args[1]] = args[2:]
```
