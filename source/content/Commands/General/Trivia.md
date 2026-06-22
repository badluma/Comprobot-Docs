The `trivia` command fetches a random multiple-choice question from the [Open Trivia Database](https://opentdb.com/). The bot adds number reactions and a **Reveal Answer** button so players can guess before the answer is shown.

## Usage

```
!trivia
```

Aliases: `!quiz`, `!question`

## Example response

User:
```
!trivia
```

Bot:
```
## Which programming language shares its name with a type of snake?
1. Ruby
2. Python
3. Cobra
4. Viper

Difficulty: Easy
Category: Science, Computers
```

The bot reacts with 1️⃣–4️⃣ for voting and attaches a **Reveal Answer** button. Only the person who ran the command or an admin can reveal the answer, which also lists everyone who reacted with the correct option.

## Source code

```python
def trivia():
    try:
        raw = requests.get("https://opentdb.com/api.php?amount=1&type=multiple", timeout=10)
    except requests.exceptions.RequestException:
        return None
    if raw.status_code != 200:
        return None
    try:
        data = raw.json()
    except requests.exceptions.JSONDecodeError:
        return None
    if data.get("response_code") != 0 or not data.get("results"):
        return None

    result = data["results"][0]
    correct = html.unescape(result["correct_answer"])
    incorrect = [html.unescape(a) for a in result["incorrect_answers"]]
    choices = incorrect + [correct]
    shuffle(choices)
    correct_index = choices.index(correct) + 1  # 1-based

    return {
        "question": html.unescape(result["question"]),
        "choices": choices,
        "correct_index": correct_index,
        "correct_answer": correct,
        "difficulty": result["difficulty"].title(),
        "category": html.unescape(result["category"]).replace(": ", ", ").title(),
    }
```
