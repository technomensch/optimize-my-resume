# ADR-005: LLM Constraint Engineering and Safety Patterns

## Status
Proposed (2026-01-23)

## Context
During complex development and debugging sessions (e.g., Issue #79), the LLM agent frequently ignored negative constraints ("Do not change code") and failed to stop when encountering logical ambiguities or brittle environments (loops). This behavior stems from the autoregressive nature of LLMs, the "Pink Elephant" problem (statistical priming), and the "Lost in the Middle" phenomenon.

## Decision
We will formalize and enforce three core prompt engineering patterns to mitigate LLM non-compliance and prevent governance drift.

### 1. Positive Constraints
- **Pattern:** Replace negative commands ("Don't") with exclusive positive permissions ("Only").
- **Implementation:** Commands like `/read-only-analysis` enforce a strict subset of allowed tools.

### 2. Recency Effect (End-of-Prompt Execution)
- **Pattern:** Critical "STOP" instructions and behavioral locks must be placed at the extreme end of the prompt or after a session update.
- **Implementation:** Workflow Step 0s ensure these instructions are the most recent context before tool calls.

### 3. Chain-of-Thought Verification (Pre-flight Checks)
- **Pattern:** Force the model to "show its work" and verify its execution state *before* performing any action.
- **Implementation:** Requiring the model to output "MODE: READ-ONLY ANALYSIS" or "STRICT EXECUTION MODE" as its first token.

### 4. Zero-Deviation Execution
- **Pattern:** Plans authored by external analysts (human or secondary LLM) must be executed literally without unauthorized improvements.
- **Implementation:** The `/execute-plan` workflow requires quoting the plan source before every edit.

## Consequences

### Positive
- Increased reliability of the agent in complex/fragile sections of the codebase.
- Clearer audit trail (the agent explicitly states its intent and constraints).
- Reduced risk of accidental code deletion or unintended "improvements."

### Negative
- Minor increase in initial latency as the agent performs pre-flight checks.
- Slight increase in token consumption per task.
- Requires discipline to activate the correct mode via slash commands.
