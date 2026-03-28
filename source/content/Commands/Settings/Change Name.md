The `name` command changes the bot's username.

## Usage

```
s!name <new_name>
```

Aliases: `s!nickname`

## Example response

User:

```
s!name NewBotName
```

Bot:

```
Name applied successfully.
```

## Source code

```python
if command in keywords["settings"]["change_name"]:
    if len(args) < 2:
        return error_messages["missing_argument"]
    if client is None or client.user is None:
        return error_messages["bot_unavailable"]
    await client.user.edit(username=args[1])
    return success_messages["nickname_applied"]
```
