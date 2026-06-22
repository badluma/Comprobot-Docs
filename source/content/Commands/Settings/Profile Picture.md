The `pfp` command changes the bot's profile picture. Attach an image to the message.

## Usage

```
!config pfp
```

Aliases: `!config picture`, `!config pic`, `!set pfp`, `!settings pfp`

Requires administrator permissions or bot admin status.

## Example response

User:
```
!config pfp [attached image]
```

Bot:
```
Profile picture applied successfully.
```

## Source code

```python
@settings_cmd.command(
    name=keywords["settings"]["profile_picture"][0],
    aliases=keywords["settings"]["profile_picture"][1:],
)
@_is_admin_or_bot_admin()
async def pfp_cmd(self, ctx):
    if not ctx.message.attachments:
        await ctx.send(error_messages["no_attachment"])
        return
    cache_dir = user_cache_dir("Comprobot", appauthor=False)
    os.makedirs(cache_dir, exist_ok=True)
    await ctx.message.attachments[0].save(f"{cache_dir}/pfp.png")
    if client.user is None:
        await ctx.send(error_messages["bot_unavailable"])
        return
    with open(f"{cache_dir}/pfp.png", "rb") as f:
        await client.user.edit(avatar=f.read())
    await ctx.send(choice(output["settings"]["profile_picture_applied"]))
```
