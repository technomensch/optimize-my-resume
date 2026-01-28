---
description: Enforce Git governance policy for branch hierarchy and issue linkage
---

# Git Governance Workflow

**Purpose:** Centralized enforcement of Git discipline across all workflows to prevent governance drift and ensure traceability.

---

## Commands

### `branch-check`
**Purpose:** Validate branch state before plan execution  
**Called by:** `/execute-plan`

**Checks:**
1. Verify current branch links to an open issue
2. Check for uncommitted changes on parent branch (for chained versions)
3. Validate branch hierarchy (v9.3.1 must branch FROM v9.3.0, not main)

**Output:**
```
✅ Branch Validation Passed
- Branch: v9.3.3-ENH-005-component-integration
- Linked to: Issue #92
- Parent: v9.3.2-ENH-004-logic-core (committed)
```

**HALT if:**
- Branch not linked to issue → Prompt: "Link to issue #? Or create new?"
- Parent branch has uncommitted changes → "Commit parent branch first"
- Invalid hierarchy detected → "Branch from correct parent"

---

### `create-branch`
**Purpose:** Create branch with proper hierarchy and issue linkage  
**Called by:** `/start-issue-tracking`

**Syntax:**
```
@git-governance create-branch --from [parent] --name [branch-name] --issue [N]
```

**Steps:**
1. Verify parent branch exists and is committed
2. Create branch: `git checkout -b [branch-name]`
3. Link to issue (store in `.git/config` or prompt user)
4. Create draft PR immediately: `gh pr create --draft --title "WIP: [title]" --body "Closes #[N]"`

---

### `commit-and-link`
**Purpose:** Commit with conventional format and issue reference  
**Called by:** `/execute-plan` (after completion)

**Steps:**
1. Check for uncommitted changes: `git status --porcelain`
2. Prompt user for commit message (suggest conventional format)
3. Enforce issue reference in commit body: `Closes #[N]`
4. Execute: `git commit -m "[type]([scope]): [message]\n\nCloses #[N]"`
5. Verify commit: `git log -1 --oneline`

**HALT if:** No changes to commit

---

### `push-and-pr`
**Purpose:** Push to origin and create draft PR with approval  
**Called by:** `/start-issue-tracking`, user

**Steps:**
1. **ASK USER:** "Push branch to origin? (y/n)"
2. If yes: `git push -u origin [branch-name]`
3. **ASK USER:** "Create draft PR? (y/n)"
4. If yes: `gh pr create --draft --title "WIP: [title]" --body "Closes #[N]"`

---

### `push-approval`
**Purpose:** Request approval before pushing  
**Called by:** User, workflows

**Steps:**
1. Show what will be pushed: `git log origin/[branch]..HEAD --oneline`
2. **ASK USER:** "Push [N] commits to origin? (y/n)"
3. If yes: `git push`

---

### `merge-approval`
**Purpose:** Request approval before merging  
**Called by:** User

**Steps:**
1. Show merge preview: `git diff [target-branch]...[current-branch] --stat`
2. **ASK USER:** "Merge [current] into [target]? (y/n)"
3. If yes: `git merge [current-branch]`

---

### `close-issue`
**Purpose:** Request approval before closing issue  
**Called by:** User, workflows

**Steps:**
1. Show issue details: `gh issue view [N]`
2. **ASK USER:** "Close issue #[N]? (y/n)"
3. If yes: `gh issue close [N] --comment "Resolved in [commit/PR]"`

---

### `link-issue`
**Purpose:** Link orphan branch to issue  
**Called by:** Auto-detect during `branch-check`

**Steps:**
1. Detect orphan: No issue reference in branch name or PR
2. **ASK USER:** "Link to existing issue #? Or create new? (number/new)"
3. If number: Update PR body with `Closes #[N]`
4. If new: Call `/start-issue-tracking`

---

### `pre-flight`
**Purpose:** Check for uncommitted changes before plan execution  
**Called by:** `/implementation-plan`

**Steps:**
1. Check: `git status --porcelain`
2. If uncommitted changes exist:
   - **HALT:** "Uncommitted changes detected. Commit or stash before proceeding."

---

### `status`
**Purpose:** Show current governance state  
**Called by:** User

**Output:**
```
Git Governance Status
─────────────────────
Branch: v9.3.3-ENH-005-component-integration
Linked Issue: #92 (OPEN)
Parent: v9.3.2-ENH-004-logic-core
Uncommitted Changes: 2 files
Last Commit: d2bb565 (2 hours ago)
Draft PR: #93
```

---

## Integration Points

### In `/execute-plan.md`

Add after Section 1 (State Initialization):

```markdown
## 1.5 Branch Validation (DELEGATES to /git-governance)

Before proceeding, invoke: **`@git-governance branch-check`**

This will:
- Verify branch links to an open issue
- Check for uncommitted changes on parent branch
- Validate chained branch hierarchy (if applicable)

HALT if validation fails.
```

Add after Section 7 (Completion Verification):

```markdown
## 8. Commit Gate (DELEGATES to /git-governance)

After all tasks complete, invoke: **`@git-governance commit-and-link`**

This will:
- Enforce conventional commit format
- Require issue reference (Closes #N)
- Verify commit succeeded

HALT if commit fails.
```

---

### In `/start-issue-tracking.md`

Replace Step 5.1 (Create Feature Branch):

```markdown
### 5.1: Create Feature Branch (DELEGATES to /git-governance)

Invoke: **`@git-governance create-branch --from [parent] --name [branch-name] --issue [N]`**

This handles:
- Parent branch commit validation
- Branch creation with proper hierarchy
- Issue linkage verification
- Draft PR creation
```

---

### In `/implementation-plan.md`

Add after Step 2:

```markdown
## 2a. Dependency Check (DELEGATES to /git-governance)

If this plan depends on a prior version (e.g., v9.3.3 depends on v9.3.2):

Invoke: **`@git-governance pre-flight --parent [prior-branch]`**

This will:
- Verify the prior branch has been committed
- Validate branch hierarchy
- HALT if prior version is uncommitted
```

---

## Enforcement Checklist

- [ ] Branch creation validates parent commit
- [ ] Commits require conventional format
- [ ] Commits require issue reference
- [ ] Push requires explicit approval
- [ ] Merge requires explicit approval
- [ ] Issue close requires explicit approval
- [ ] Orphan branches trigger issue linkage prompt
- [ ] Chained versions enforce hierarchy

---

## Examples

### Example 1: Execute Plan with Validation
```
User: @execute-plan docs/plans/v9.3.3-ENH-005.md

Agent: Invoking @git-governance branch-check...
✅ Branch validated: v9.3.3-ENH-005-component-integration
✅ Linked to Issue #92
✅ Parent v9.3.2 is committed

Proceeding with execution...
```

### Example 2: Orphan Branch Detection
```
Agent: @git-governance branch-check
⚠️  Branch not linked to any issue

Link to existing issue #? Or create new? (number/new): 92

✅ Linked to Issue #92
```

### Example 3: Push Approval
```
User: @git-governance push-approval

Agent: Push 3 commits to origin? (y/n)
- feat(v9.3.3): integrate bullet logic hub
- docs(v9.3.3): update walkthrough
- chore(v9.3.3): update session summary

User: y

Agent: ✅ Pushed to origin/v9.3.3-ENH-005-component-integration
```

---

## Best Practices

### Avoiding Interactive Prompts

When using `gh` CLI commands in automated workflows, avoid interactive prompts that can block execution:

**Problem:** Commands like `gh pr create` may prompt for remote selection if multiple remotes exist.

**Solutions:**

1. **Push branch first, then create PR:**
   ```bash
   # First push the branch explicitly
   git push -u origin [branch-name]
   
   # Then create PR (remote already known)
   gh pr create --draft --title "WIP: [title]" --body "Closes #[N]"
   ```

2. **Detect remote dynamically:**
   ```bash
   # Get the remote URL and extract owner/repo
   REMOTE=$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
   gh pr create --draft --repo "$REMOTE" --title "WIP: [title]" --body "Closes #[N]"
   ```

3. **Use `--head` flag for clarity:**
   ```bash
   gh pr create --draft --head [branch-name] --title "WIP: [title]" --body "Closes #[N]"
   ```

**Important:** Do NOT hardcode `--repo` values in reusable workflows, as the repo will vary by project. Use dynamic detection instead.

### Agent Terminal Limitations

When agents run terminal commands:
- Interactive prompts (arrow key selection) cannot be handled
- Commands requiring user input will hang indefinitely
- Always use non-interactive flags or pre-push branches

---

**Created:** 2026-01-28  
**Version:** 1.0  
**Usage:** Called by other workflows or invoked directly by user
