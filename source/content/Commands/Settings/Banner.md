The `banner` command changes the bot's banner image. Attach an image to the message.

## Usage

```
!config banner
```

Aliases: `!set banner`, `!settings banner`

Requires administrator permissions or bot admin status.

## Example response

User:
```
!config banner [attached image]
```

Bot:
```
Banner applied successfully.
```

## Source code

```python
@settings_cmd.command(
    name=keywords["settings"]["banner"][0],
    aliases=keywords["settings"]["banner"][1:],
)
@_is_admin_or_bot_admin()
async def banner_cmd(self, ctx):
    if not ctx.message.attachments:
        await ctx.send(error_messages["no_attachment"])
        return
    cache_dir = user_cache_dir("Comprobot", appauthor=False)
    os.makedirs(cache_dir, exist_ok=True)
    await ctx.message.attachments[0].save(f"{cache_dir}/banner.png")
    if client.user is None:
        await ctx.send(error_messages["bot_unavailable"])
        return
    with open(f"{cache_dir}/banner.png", "rb") as f:
        await client.user.edit(banner=f.read())
    await ctx.send(choice(output["settings"]["banner_applied"]))
```
