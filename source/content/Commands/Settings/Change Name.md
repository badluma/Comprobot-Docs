The `name` command changes the bot's Discord username.

## Usage

```
!config name <new_name>
```

Aliases: `!config nickname`, `!set name`, `!settings name`

Requires administrator permissions or bot admin status.

## Example response

User:
```
!config name CoolBot
```

Bot:
```
Name 'CoolBot' applied successfully.
```

## Source code

```python
@settings_cmd.command(
    name=keywords["settings"]["change_name"][0],
    aliases=keywords["settings"]["change_name"][1:],
)
@_is_admin_or_bot_admin()
async def name_cmd(self, ctx, *, name: str | None = None):
    if not name:
        await ctx.send(error_messages["missing_argument"])
        return
    if client.user is None:
        await ctx.send(error_messages["bot_unavailable"])
        return
    await client.user.edit(username=name)
    await ctx.send(
        choice(output["settings"]["nickname_applied"]).replace("{{NAME}}", name)
    )
```
