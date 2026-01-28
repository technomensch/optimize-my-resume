---
description: Execute a specific implementation plan with zero-deviation enforcement
see_also: docs/decisions/ADR-005-llm-constraint-engineering.md
---

## 0. Pre-flight Check

User MUST provide the absolute or relative path to the `.md` implementation plan.

---

## 1. State Initialization (MUST be first output)

Before ANY other action, output this block:

```
═══════════════════════════════════════════════════════════════
STRICT EXECUTION MODE
Plan: [Plan Path]
Allowed Tools: Read, Edit, Write, Bash (verification only)
Forbidden: Improvements, assumptions, gap-filling, unauthorized fixes
═══════════════════════════════════════════════════════════════
```

---

═══════════════════════════════════════════════════════════════
```

---

## 1.5. Branch Validation (DELEGATES to /git-governance)

Before proceeding, invoke: **`@git-governance branch-check`**

This will:
- Verify branch links to an open issue
- Check for uncommitted changes on parent branch
- Validate chained branch hierarchy (if applicable)

HALT if validation fails.

---

## 2. Allowed Tools (Positive Constraints)

You may ONLY use these tools during plan execution:

| Tool | Permitted Use |
|------|---------------|
| `Read` | View files referenced in plan |
| `Edit` | Modify files per plan instructions |
| `Write` | Create files per plan instructions |
| `Bash` | ONLY for verification: `ls`, `wc -l`, `git diff`, `git status` |
| `AskUserQuestion` | Clarify ambiguities (triggers HALT) |

**All other tools are FORBIDDEN** unless the plan explicitly requires them.

---

## 3. Execution Protocol

### Literal Mapping
For **every edit**, you MUST first:
1. Quote the specific line or instruction from the plan you are fulfilling
2. State which file and what change you will make
3. Then execute the edit

Example:
```
Plan instruction: "Task 1 | lines 2456-2690 | core-validators.js"
Action: Creating src/validators/bullet-generation/core-validators.js with content from lines 2456-2690
```

### Data Integrity Audit
After **every file edit**:
1. Perform a `Read` on the changed file
2. Verify you have added ONLY what the plan specified
3. If you detect ANY unauthorized additions (extra comments, formatting, "improvements"), proceed to Rollback Protocol

### No Improvements
Even if you see:
- A bug in the code
- A better way to implement something
- Missing error handling
- Typos in comments

**DO NOT FIX IT** unless explicitly stated in the plan.

---

## 4. HALT Protocol (Ambiguity Lock)

If the plan is ambiguous, unclear, or missing information, you are **FORBIDDEN** from assuming or filling gaps.

Output this block and STOP:

```
═══════════════════════════════════════════════════════════════
HALT: Ambiguity Lock (Protocol Step 4)

Issue: [describe the ambiguity]
Plan Reference: "[quote the unclear section]"
Question: [specific clarification needed]

STRICT EXECUTION MODE: Awaiting Clarification. Stop.
═══════════════════════════════════════════════════════════════
```

Do NOT proceed until user provides clarification.

---

## 5. Progress Checkpoints

After **every 3 file modifications** OR completing a logical task group:

```
─────────────────────────────────────────────────
CHECKPOINT: [N/Total] tasks complete
Files modified: [list files]
Next: [describe next task from plan]
─────────────────────────────────────────────────
```

Wait for user acknowledgment (`continue`, `proceed`, or similar) before continuing.

---

## 6. Rollback Protocol

If Data Integrity Audit detects unauthorized additions:

1. **Revert**: `git checkout -- [file]` to restore original
2. **Re-read**: Quote the plan instruction again
3. **Re-apply**: Make change with ONLY plan-specified content
4. **Verify**: Run Data Integrity Audit again
5. **If second attempt fails**: Trigger HALT Protocol

---

## 7. Completion Verification

When all plan tasks are complete:

1. **Quote each success criterion** from the plan's verification section
2. **Verify each criterion** (run commands, check file sizes, etc.)
3. Output completion status:

**If all criteria met:**
```
═══════════════════════════════════════════════════════════════
EXECUTION COMPLETE
Plan: [Plan Path]
Criteria verified: [N/N]
- [criterion 1]: ✅
- [criterion 2]: ✅
- [criterion N]: ✅
═══════════════════════════════════════════════════════════════
```

**If criteria not met:**
```
═══════════════════════════════════════════════════════════════
EXECUTION INCOMPLETE
Plan: [Plan Path]
Criteria verified: [X/N]
- [criterion 1]: ✅
- [criterion 2]: ❌ [reason]
- [criterion N]: ⏳ [not yet checked]

Awaiting user decision: retry, adjust plan, or accept partial.
═══════════════════════════════════════════════════════════════
```

---

## 8. Commit Gate (DELEGATES to /git-governance)

After all tasks complete, invoke: **`@git-governance commit-and-link`**

This will:
- Enforce conventional commit format
- Require issue reference (Closes #N)
- Verify commit succeeded

HALT if commit fails.

---

## Summary: Execution Flow

```
1. Output State Initialization block
2. Read the plan file
3. For each task in plan:
   a. Quote the plan instruction (Literal Mapping)
   b. Execute the edit
   c. Verify with Data Integrity Audit
   d. If ambiguous → HALT Protocol
   e. Every 3 edits → Checkpoint
4. After all tasks → Completion Verification
```
