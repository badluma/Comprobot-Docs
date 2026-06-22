The `keywords` command changes the trigger words for a command.

## Usage

```
!config keywords <command> <new_keywords...>
```

Aliases: `!config key`, `!set keywords`, `!settings keywords`

Requires administrator permissions or bot admin status.

## Example response

User:
```
!config keywords joke funny pun
```

Bot:
```
Custom keywords 'funny pun' for the command 'joke' applied successfully!
```

This changes the triggers for the `joke` command to `!funny` and `!pun`.

## Source code

```python
@settings_cmd.command(
    name=keywords["settings"]["change_keywords"][0],
    aliases=keywords["settings"]["change_keywords"][1:],
)
@_is_admin_or_bot_admin()
async def keywords_cmd(self, ctx, command_name: str | None = None, *new_keywords):
    if not command_name or not new_keywords:
        await ctx.send(error_messages["missing_argument"])
        return
    from . import data as data_module
    target_category = None
    for category in data_module.keywords:
        if command_name in data_module.keywords[category]:
            target_category = category
            break
    if target_category is None:
        await ctx.send(error_messages["unknown_argument"])
        return
    data_module.keywords[target_category][command_name] = list(new_keywords)
    data_module.save_toml(
        data_module.keywords,
        data_module.get_data_path("keywords.toml"),
    )
    await ctx.send(
        choice(output["settings"]["keywords_applied"])
        .replace("{{KEYWORDS}}", " ".join(new_keywords))
        .replace("{{COMMAND}}", command_name)
    )
```
