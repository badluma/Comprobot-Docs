The `start` command starts the bot.

## Usage

```
comprobot start [options]
```

## Options

| Flag             | Description                                              |
| ---------------- | ------------------------------------------------------- |
| `-d`, `--daemon` | Run the bot detached in the background                  |
| `-p`, `--path`   | Use a custom path for the bot's configuration directory |

## Notes

Make sure your `.env` file contains a valid `BOT_TOKEN` before running. On first run, Comprobot prints the path to the data directory where config files are stored. If you haven't set things up yet, run `comprobot onboard` instead.

Starting the bot also launches the web [dashboard](Dashboard) in the background.
