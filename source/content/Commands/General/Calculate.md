The `calculate` command evaluates a mathematical expression and returns the result.

## Usage

```
!calculate <expression>
```

Aliases: `!calc`

## Example response

User:
```
!calculate 2+2
```

Bot:
```
4
```

User:
```
!calc (10 * 3) / 5
```

Bot:
```
6.0
```

## Source code

```python
def calculate(calculation):
    try:
        result = eval(calculation)
        response = choice(output["general"]["calculate"]).replace(
            r"{{RESULT}}", str(result)
        )
    except ZeroDivisionError:
        response = error_messages["calculate"]
    except Exception:
        response = error_messages["calculate"]
    return response
```
