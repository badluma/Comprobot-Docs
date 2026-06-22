The `test` command runs a message through the bot's command processor without needing a live Discord connection. Useful for verifying that a command works after changing config.

## Usage

```
comprobot test "<message>"
```

## Examples

```sh
comprobot test "!calculate 2+2"
comprobot test "!joke"
comprobot test "!bitcoin usd"
comprobot test "!bible john 3 16"
```

## Notes

- The message must include the prefix (default `!`).
- All command checks still apply — if a command is disabled in `active.toml`, it won't respond.
- Uses fake Discord objects, so commands that require attachments or specific permissions won't fully work in this mode.
