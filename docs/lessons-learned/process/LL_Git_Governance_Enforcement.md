# Lesson Learned: Git Governance Enforcement

**Date:** 2026-01-28  
**Category:** Process  
**Tags:** #git #governance #guardrails #workflow

---

## Problem

During v9.3.x implementation (issues #87, #89, #91, #92), all four branches (v9.3.0, v9.3.1, v9.3.2, v9.3.3) ended up pointing to the same base commit (`d2bb565`). This violated Guardrail #31's intent of "Establish ID → Establish Locality → Establish Link" and made version history untraceable.

**Root Cause:**
- No enforcement of per-version commits before proceeding to next plan
- No validation of branch hierarchy (v9.3.1 should branch FROM v9.3.0, not main)
- No automated issue linkage verification
- No approval gates for destructive operations (push, merge, close)

---

## Solution

Created `.agent/workflows/git-governance.md` as a centralized enforcement workflow that:

1. **Validates branch state** before plan execution
2. **Enforces commit discipline** with conventional format and issue references
3. **Requires explicit approval** for push/merge/close operations
4. **Auto-detects orphan branches** and prompts for issue linkage
5. **Validates branch hierarchy** for chained versions

### Integration Points

- `/execute-plan.md`: Added Section 1.5 (branch validation) and Section 8 (commit gate)
- `/start-issue-tracking.md`: Delegated branch creation to git-governance
- `/implementation-plan.md`: Added dependency check for chained versions

---

## Pattern: Shared Enforcement via Workflow Delegation

Instead of duplicating git logic across workflows, we use `@workflow-name command` delegation:

```markdown
Invoke: **`@git-governance branch-check`**
```

This creates a single source of truth for governance rules.

---

## Commands Available

| Command | Purpose |
|---------|---------|
| `branch-check` | Validate branch state before execution |
| `create-branch` | Create with hierarchy + issue link |
| `commit-and-link` | Commit with issue reference |
| `push-and-pr` | Push + draft PR with approval |
| `push-approval` | Ask before pushing |
| `merge-approval` | Ask before merging |
| `close-issue` | Ask before closing issue |
| `link-issue` | Link orphan branch to issue |
| `pre-flight` | Check uncommitted changes |
| `status` | Show governance state |

---

## Impact

**Before:**
- Interleaved commits across versions
- Orphan branches without issue links
- Accidental pushes/merges
- Untraceable version history

**After:**
- Per-version commits enforced
- Automatic issue linkage validation
- Explicit approval gates
- Clean, traceable Git history

---

## Related

- **Guardrail #31:** Governance & Tracking (Establish ID → Locality → Link)
- **Issue #93:** Git Governance Workflow implementation
- **ADR-005:** LLM Constraint Engineering (enforcement patterns)

---

## Recommendation

**Always use git-governance for:**
- Creating branches (ensures hierarchy)
- Committing changes (ensures format + issue refs)
- Pushing to origin (prevents accidental pushes)
- Merging branches (prevents premature merges)
- Closing issues (ensures completion verification)

**Never bypass git-governance** for these operations.
