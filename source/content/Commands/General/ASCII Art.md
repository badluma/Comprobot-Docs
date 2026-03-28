The `ascii` command returns a random ASCII art string from the configured list.

## Usage

```
!ascii
```

## Example response

```
┏━╸┏━┓┏┳┓┏━┓┏━┓┏━┓┏┓ ┏━┓╺┳╸
┃  ┃ ┃┃┃┃┣━┛┣┳┛┃ ┃┣┻┓┃ ┃ ┃ 
┗━╸┗━┛╹ ╹╹  ╹┗╸┗━┛┗━┛┗━┛ ╹                         
```

## Source code

```python
def ascii():
    return random.choice(config["ascii_art"])
```
