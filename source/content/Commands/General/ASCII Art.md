The `ascii` command returns a random ASCII art string from the configured list.

## Usage

```
!ascii
```

## Example response

```
   _   _      _ _         _
  /_\ | |    | | |       | |
 //_\\| | ___| | | _____ | | __
|  _  | |/ _ \ | |/ / __|| |/ /
| | | | |  __/ |   <\__ \|   <
\_| |_/_|\___|_|_|\_\___/|_|\_\
```

## Source code

```python
def ascii():
    return random.choice(config["ascii_art"])
```
