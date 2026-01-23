# Issue #84: LLM Constraint Workflows and Safety Patterns

**Title:** Standardizing LLM Constraints and Safety Patterns
**Status:** 🔴 ACTIVE
**Priority:** High
**Created:** 2026-01-23

## Description
LLMs frequently ignore negative constraints and fail to stop on errors. This issue standardizes the mitigation strategy by implementing specialized /read-only-analysis and /execute-plan workflows, and formalizing ADR-005.

## Current Behavior
The model may continue generating code or making "improvements" even when explicitly told not to, leading to loops or deviations from pre-approved plans.

## Expected Behavior
The agent should adhere to strict behavioral locks when activated by a slash command, halting on ambiguity and quoting plan sources before modification.

## Implementation Plan
See: [v9.2.1.1-working-with-llms.md](../../plans/v9.2.1.1-working-with-llms.md)

## Documentation
- [Solution Approach](./solution-approach.md)
- [Test Cases](./test-cases.md)
