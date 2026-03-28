The `purge` command deletes all messages in the current channel.

## Usage

```
!purge
```

Requires administrator permissions.

## Example response

Bot:

```
All messages deleted.
```

## Source code

```python
elif command == "purge" and active["purge"]:
    if ctx.author.guild_permissions.administrator:
        await ctx.channel.purge()
        return "All messages deleted."
```
