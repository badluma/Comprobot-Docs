The `purge` command deletes all messages in the current channel.

## Usage

```
!purge
```

Requires administrator permissions.

## Source code

```python
@ext_commands.command(name="purge")
@ext_commands.check(lambda ctx: active["general"]["purge"])
@ext_commands.has_permissions(administrator=True)
async def purge_cmd(self, ctx):
    await ctx.channel.purge()
```
