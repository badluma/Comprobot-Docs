The `reset` command rewrites Comprobot's TOML configuration files. Any missing keys are restored to their defaults and unrecognized keys are removed, bringing the files in sync with the current version's templates.

## Usage

```
comprobot reset
```

## Notes

This rewrites `ai.toml`, `active.toml`, `config.toml`, `error_messages.toml`, `keywords.toml`, `moderation.toml`, `descriptions.toml`, and `output.toml` in your data directory. Your `.env` secrets and stored balances are left untouched.
