---
title: AI
position: "6"
---

The `ai.toml` file configures the AI chat functionality of the bot.

## Template

```toml
activate_ai          = false

provider             = "groq" # Available providers: "ollama", "gemini", "groq"
model                = "qwen/qwen3-32b"
max_messages_context = 10
remove_emojis        = true
lower_response       = true
answer_to_reply      = false
include_username     = true
include_reply        = true
include_attachment   = true

system_prompt = """
You are a helpful assistant that gives short, helpful answers.
Your answers can maximally be 1000 characters long.
"""

user_prompt = """
{{USERNAME}} wrote the following message: {{MESSAGE}}
"""

user_reply_prompt = """
They added the following context: {{REPLY}}
"""

user_attachement_prompt = """
The user attached the following file: {{FILE}}
"""

user_prompt_structure = """
{{PROMPT}}

{{REPLY_PROMPT}}

{{ATTACHMENT_PROMPT}}
"""
```

## Values

### Basic Settings

| Value                  | Type    | Description                                             |
| ---------------------- | ------- | ------------------------------------------------------- |
| `activate_ai`          | boolean | Enable or disable AI chat functionality                 |
| `provider`             | string  | AI provider to use: `"ollama"`, `"gemini"`, or `"groq"` |
| `model`                | string  | Model to use (varies by provider)                       |
| `max_messages_context` | integer | Number of previous messages to include in context       |

### Response Settings

| Value             | Type    | Description                                         |
| ----------------- | ------- | --------------------------------------------------- |
| `remove_emojis`   | boolean | Remove emojis from AI responses                     |
| `lower_response`  | boolean | Convert AI responses to lowercase                   |
| `answer_to_reply` | boolean | Also answer when replying to the bot's own messages |

### Context Settings

| Value                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| `include_username`   | boolean | Include the username in the prompt |
| `include_reply`      | boolean | Include replied message content    |
| `include_attachment` | boolean | Include attachment filenames       |

### Prompt Templates

| Value                     | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `system_prompt`           | Instructions for the AI behavior                           |
| `user_prompt`             | Template for user messages (`{{USERNAME}}`, `{{MESSAGE}}`) |
| `user_reply_prompt`       | Template for replied content (`{{REPLY}}`)                 |
| `user_attachement_prompt` | Template for attachments (`{{FILE}}`)                      |
| `user_prompt_structure`   | How to combine all prompt parts                            |

## Provider Configuration

### Groq (Default)

```toml
provider = "groq"
model    = "qwen/qwen3-32b"
```

Requires `GROQ` API key in `.env` file.

### Gemini

```toml
provider = "gemini"
model    = "gemini-2.0-flash"
```

Requires `GEMINI` API key in `.env` file.

### Ollama

```toml
provider = "ollama"
model    = "llama3"
```

Requires Ollama running locally (default: `http://localhost:11434`).

## Examples

### Enable AI with Groq

```toml
activate_ai = true
provider    = "groq"
model       = "qwen/qwen3-32b"
```

### Custom system prompt

```toml
system_prompt = """
You are a sarcastic assistant who answers questions concisely.
Keep responses under 500 characters.
Never use emojis in your responses.
"""
```

### Include more context

```toml
max_messages_context = 20
include_attachment  = true
```

## Environment Variables

Make sure to set the appropriate API key in your `.env` file:

```env
BOT_TOKEN=your_discord_bot_token
GEMINI=your_gemini_api_key      # Only if using Gemini
GROQ=your_groq_api_key         # Only if using Groq
```
