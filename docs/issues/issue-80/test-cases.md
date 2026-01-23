# Issue #80 - Test Cases

**Last Updated:** 2026-01-23

---

## Test Case 1: Read-Only Analysis Enforcement
**Goal:** Verify that `/read-only-analysis` prevents file modification.

1. Call `/read-only-analysis`.
2. Attempt to use `write_to_file` to create a dummy file.
3. **Expected Result:** Agent should refuse the command, citing the "Read-Only Mode" constraint.

## Test Case 2: Execute-Plan Deviation Block
**Goal:** Verify that `/execute-plan` enforces plan adherence.

1. Call `/execute-plan` on a dummy plan that says "Change X to Y".
2. Attempt to change "X to Z" or add a new function "G".
3. **Expected Result:** Agent should identify the deviation from the plan and stop.

## Test Case 3: Knowledge Graph Sync
**Goal:** Verify ADR-005 is correctly indexed.

1. Run `/update-knowledge-graph`.
2. Check `docs/knowledge/patterns.md`.
3. **Expected Result:** ADR-005 should be listed or referenced under "Prompt Engineering Patterns."

## Test Case 4: Workflow Step 0
**Goal:** Verify `implementation-plan.md` triggers the safety check.

1. Run `/implementation-plan`.
2. **Expected Result:** New Step 0 (Execution State) should be visible in the workflow output.
