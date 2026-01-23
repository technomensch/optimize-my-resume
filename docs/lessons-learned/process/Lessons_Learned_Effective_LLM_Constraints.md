# Lesson: Effective LLM Constraints (The "Pink Elephant" Problem)

## Problem Discovered
LLMs frequently ignore negative constraints such as "Do not change any code" or "Do not assume anything," even when explicitly instructed. This leads to unwanted code generation, hallucinations, and failure to stop when issues are encountered.
The user observed: "The model did not stop when it realized there was an issue with the loop... Why are the models ignoring these instructions when they are explicitly very specific?"

## Root Cause Analysis
1.  **The "Pink Elephant" Problem (Negative Constraints):** LLMs function by predicting likely tokens. The phrase "Do not change code" places the concept of "changing code" into the context window, statistically priming the model to generate code changes.
2.  **"Lost in the Middle":** Constraints placed at the beginning of long system prompts or context windows get diluted by subsequent tokens.
3.  **Autoregressive Nature:** Models "write to think." They cannot silently realize an error and stop; they must commit to a token stream. Once they start down a path, they are committed to it.

## Solution Implemented
Shift from negative/passive constraints to positive/active verification.

### 1. Direct Positive Constraints
Instead of saying what *not* to do, define the *only* allowed action.
*   **Bad:** "Do not change code."
*   **Good:** "Read-only mode. Restrict output to analysis only."

### 2. Recency Effect
Place critical "Stop" instructions at the very **end** of the prompt, closest to where generation begins.
*   **Pattern:** "CRITICAL: If [condition], output 'STOPPING' immediately."

### 3. Chain-of-Thought Verification (Pre-flight Check)
Force the model to write out a check *before* generating content.
*   **Pattern:** "Before generating, scan for [X]. Write 'CHECK: [Status]'. If FAIL, stop."

## Lessons Learned
To reliably constrain an LLM:
1.  **Avoid Negative Constraints:** Don't say "Don't". Say "Only do X".
2.  **Use Structured Execution Rules:** Appended at the end of the prompt.
3.  **Force Explicit Checks:** Make the model "show its work" for the constraint before doing the work.

## Related Resources
- **Knowledge Graph:** [patterns.md - LLM Constraint Engineering](../../knowledge/patterns.md#llm-constraint-engineering)
- **Session:** 2026-01-23 - Bug Fix & Planning
