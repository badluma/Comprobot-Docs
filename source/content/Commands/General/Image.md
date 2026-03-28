The `image` command returns a random image based on the animal specified (duck, dog, or cat).

## Usage

```
!image <animal>
```

Available animals: `duck`, `dog`, `cat`

## Example response

User:

```
!image cat
```

Bot:

```
https://cdn2.thecatapi.com/images/zFm4AbO-d.jpg
```

## Source code

```python
elif command in keywords["commands"]["image"] and active["image"]:
    if args[0] in keywords["commands"]["duck"] and active["duck"]:
        return api.duck()
    elif args[0] in keywords["commands"]["dog"] and active["dog"]:
        return api.dog()
    elif args[0] in keywords["commands"]["cat"] and active["cat"]:
        return api.cat()
```
