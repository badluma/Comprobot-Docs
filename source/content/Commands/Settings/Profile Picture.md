The `pfp` command changes the bot's profile picture.

## Usage

```
s!pfp <image>
```

Aliases: `s!picture`, `s!pic`

Attach an image to the message.

## Example response

User:

```
s!pfp [attached image]
```

Bot:

```
Profile picture applied successfully.
```

## Source code

```python
if command in keywords["settings"]["profile_picture"]:
    if not ctx.attachments:
        return error_messages["no_attachments"]
    if client is None or client.user is None:
        return error_messages["bot_unavailable"]
    new_pfp = ctx.attachments[0]
    await new_pfp.save("Cache/pfp.png")
    with open("Cache/pfp.png", "rb") as image_file:
        image_data = image_file.read()
    await client.user.edit(avatar=image_data)
    return success_messages["profile_picture_applied"]
```
