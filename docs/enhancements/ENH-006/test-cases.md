# ENH-006 - Test Cases

**Last Updated:** 2026-01-28
**Local Tracking ID:** ENH-006

---

## Convergence Tests (SSoT Verification)

### Test Case C1: Symbolic Link Integrity
**Scenario:** Verify that the symlink resolves and is accessible to both editors.
**Steps:**
1. Navigate to `.claude/`.
2. Run `ls -la skills`.
3. Verify it points to `../.agent/workflows`.

**Expected Result:** `skills -> ../.agent/workflows` is displayed as a link.
**Status:** ⏳ Pending

---

### Test Case C2: Multi-Agent Visibility
**Scenario:** Verify both Gemini and Claude see the consolidated list.
**Steps:**
1. In Gemini (Antigravity), check the workflow list.
2. In Claude CLI, run `claude --help` (or equivalent skill list command).
3. Verify `enforce-shadow-sync` and `git-governance` appear in both lists.

**Expected Result:** Both agents report access to the same 14+ workflows.
**Status:** ⏳ Pending

---

### Test Case C3: Governance Compliance
**Scenario:** Verify the new naming policy works in `/start-issue-tracking`.
**Steps:**
1. Run `/start-issue-tracking` for a test bug.
2. Verify it prompts for `[BUG] Title` and assigns versioned branch `v9.3.4-issue-N`.
3. Check if it correctly identifies the next local ID (e.g., `issue-85`).

**Expected Result:** Governance checks pass and naming matches policy.
**Status:** ⏳ Pending

---

## Test Results Summary

**Date Tested:** 2026-01-28
**Tester:** Antigravity (AI Agent)

**Results:**
- Total Tests: 3
- Passed: 0
- Failed: 0
- Pending: 3

**Conclusion:**
System is ready for implementation.
