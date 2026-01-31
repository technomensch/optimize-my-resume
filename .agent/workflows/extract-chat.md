---
description: Extract chat history from Claude and Gemini local log sources
---
# /extract-chat

Automates the extraction of chat history from local Claude (.jsonl) and Gemini (.json/.pb) log files.

## Usage

```bash
/extract-chat [-claude | -gemini]
```

## Options

- `-claude`: Extract only Claude Code session history
- `-gemini`: Extract only Antigravity/Gemini session history
- (no option): Extract all available history

## How it works

The workflow runs the centralized Python extraction script located at `chat-history/scripts/run_extraction.py`.

1. **Claude Extraction**: Scans `~/.claude/projects/` for activity logs and merges them by date into `chat-history/YYYY-MM-DD-claude.md`.
2. **Gemini Extraction**: Scans `~/.gemini/tmp/` and `~/.gemini/antigravity/conversations/` for session logs and merges them by date into `chat-history/YYYY-MM-DD-gemini.md`.

## Execution

// turbo
1. Run the extraction script:
```bash
python3 chat-history/scripts/run_extraction.py --source {{ source_flag }}
```

> [!NOTE]
> The `{{ source_flag }}` is automatically determined by the trigger used:
> - `/extract-chat -claude` -> `claude`
> - `/extract-chat -gemini` -> `gemini`
> - `/extract-chat` -> `all`
