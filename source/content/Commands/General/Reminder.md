The `reminder` command sets a personal reminder. After the given delay, the bot sends you the message as a direct message.

## Usage

```
!reminder <time> <message>
```

Aliases: `!remind`, `!todo`

The time is a number followed by a unit: `s` (seconds), `m` (minutes), or `h` (hours). For example, `10s`, `5m`, or `2h`.

## Example response

User:
```
!remind 10m Take the pizza out of the oven
```

Bot:
```
Reminder 'Take the pizza out of the oven' sending in 10m.
```

After the delay, the bot DMs you the message:
```
Take the pizza out of the oven
```

## Source code

```python
async def reminder(args, ctx):
    if len(args) < 2:
        return error_messages["missing_argument"]

    time_arg = args[0]
    message = " ".join(args[1:])

    match time_arg[-1]:
        case "s":
            time = int(time_arg[:-1])
        case "m":
            time = int(time_arg[:-1]) * 60
        case "h":
            time = int(time_arg[:-1]) * 3600
        case _:
            return error_messages["unknown_unit"]

    await ctx.send(f"Reminder '{message}' sending in {time_arg}.")

    await asyncio.sleep(time)
    await ctx.author.send(message)
```
