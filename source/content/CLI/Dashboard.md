The `dashboard` command starts Comprobot's web dashboard, a browser-based UI for managing the bot's configuration. The bot also launches it automatically when you run `comprobot start`.

## Usage

```
comprobot dashboard [options]
```

## Options

| Flag            | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `-w`, `--watch` | Run the dashboard in the foreground instead of detaching   |

## Notes

- The dashboard runs at `http://localhost:7626` by default. Set `DASHBOARD_PORT` in your `.env` file to change the port.
- Running in the foreground (`-w`) opens the dashboard in your browser and prints logs until you stop it with `Ctrl+C`.
- If the port is already in use, Comprobot assumes the dashboard is already running and won't start a second instance.
