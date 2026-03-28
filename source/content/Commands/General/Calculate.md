The `calculate` command evaluates a mathematical expression and returns the result.

## Usage

```
!calculate <expression>
```

## Example response

User:

```
!calculate 2+2
```

Bot:

```
Result: 4
```

## Source code

```python
def calculate(calculation):
    try:
        result = eval(calculation)
        response = f"Result: {result}"
    except Exception as e:
        response = f"{error_messages['calculate']} (error {str(e)})"
    return response
```
