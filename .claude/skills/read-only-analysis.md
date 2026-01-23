---
description: Lock the agent into a read-only analysis mode with strict stop-on-error behavior
---

1. Before any tool calls, write: **"READ-ONLY MODE ACTIVE. Establishing behavior locks..."**
2. Execute the task with these rules:
   - **Positive Constraint:** You are restricted to `view_file`, `list_dir`, `grep_search`, `view_code_item`, `view_file_outline`, and `read_terminal`. You are FORBIDDEN from using `write_to_file`, `replace_file_content`, or `multi_replace_file_content`.
   - **Ambiguity Lock:** Analyze logic step-by-step. If logic is circular, contradictory, or ambiguous, you must output **"HALT: Ambiguity in [File:Line]"** and stop to ask the user.
   - **Verification:** Do not guess. If code is not visible, use `view_file`.
   - **Stop-on-Error:** If you encounter unexpected behavior or errors in the environment, stop immediately.
