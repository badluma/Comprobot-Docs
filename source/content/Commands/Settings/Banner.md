The `banner` command changes the bot's banner image.

## Usage

```
s!banner <image>
```

Attach an image to the message.

## Example response

User:

```
s!banner [attached image]
```

Bot:

```
Banner applied successfully.
```

## Source code

```python
if command in keywords["settings"]["banner"]:
    if not ctx.attachments:
        return error_messages["no_attachments"]
    if client is None or client.user is None:
        return error_messages["bot_unavailable"]
    new_banner = ctx.attachments[0]
    await new_banner.save("Cache/banner.png")
    with open("Cache/banner.png", "rb") as image_file:
        image_data = image_file.read()
    await client.user.edit(banner=image_data)
    return success_messages["banner_applied"]
```
