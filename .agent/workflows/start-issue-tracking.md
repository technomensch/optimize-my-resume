---
description: Initialize issue tracking for a specific problem or enhancement with Git governance enforcement
version: v9.4.1
created: 2026-01-29
---

# Start Issue Tracking

**Purpose:** Initialize issue tracking for a specific problem or enhancement, creating structured documentation that can be managed with Git using Claude Code locally.

**Version:** v9.4.1 (Updated: 2026-01-29)

---

## Command Syntax

```
/start-issue-tracking
/start-issue-tracking <brief-description>
```

**Examples:**
- `/start-issue-tracking`
- `/start-issue-tracking JSON truncation with multi-position resumes`
- `/start-issue-tracking Add token usage display`

---

## When to Use This Skill

Use `/start-issue-tracking` when:
- You've identified a bug that needs to be fixed
- You're planning a new feature or enhancement
- You want to document a problem before solving it
- You need to create a handoff for another developer
- You're starting work on a complex issue that needs tracking

**CRITICAL RULE:**
- When creating the GitHub Issue, you **MUST** use the `--body-file` flag to populate the description with your detailed `solution-approach.md`. Never use a manual summary.

**Do NOT use for:**
- Simple typo fixes or trivial changes
- Work that's already complete (use `/lessons-learned` instead)
- General documentation updates (use standard Git workflow)

---

## Step 0: Discourse Capture & Behavior Lock (PRE-FLIGHT)

**Mode: READ-ONLY ANALYSIS.** 

1. **proposal_capture:** Scan the preceding chat history for the "Would you like me to..." proposal. Extract the Logic, Affected Files, and Target Outcome automatically.
2. **behavior_lock:** Explicitly state: *"Establishing safety locks. I will capture your recent proposal into documentation and stop cold before implementation."*
3. **stop_on_error:** Confirm that you will stop after every documentation step to show its work and will NOT proceed to implementation without explicit approval.

---

## Step 1: Verification & Versioning Gate (INTERACTIVE)

### 1.0: Git Authority Check
Run these commands BEFORE asking the user questions:
```bash
git branch -a
git log -n 5
```
**RULE:** The Git branch history is the source of truth for versioning. Ignore stale versioning strings in file headers if they conflict with the branch naming schema.

### 1.1: Versioning Decision
Based on the Git check, ask the user:
```markdown
I detect existing work on [Branch Name]. Is this:

1. [ ] A **New Feature**? (vX.[Minor].0 - New Issue)
2. [ ] A **Patch** to Merged Work? (vX.X.[Patch] - Bug/Correction to Main)
3. [ ] A **WIP Update**? (Continue on existing branch, update existing plan)
4. [ ] A **Hotfix**? (vX.X.X.[Hotfix] - Critical fix to a patch)

Please select the version increment path (1-4):
```

### 1.2: Issue Type
```
6. [ ] 🔧 Refactor - Code restructuring without behavior change
7. [ ] 🛡️ Hardening - Strengthening existing guardrails or validation logic

What type of issue is this?
```

### 1.3: Issue Details
*(Pre-filled from Discourse Capture)*
```
... [same as before] ...
```

**WAIT FOR USER INPUT** before proceeding to Step 2.

---

## Step 2: Determine Issue Number

### 2.1: Check Existing Issues
```bash
# List existing issue documentation files
ls -1 docs/issues/ 2>/dev/null | grep -E '^issue-[0-9]+' | sort -V

# OR check enhancement tracker if it exists
ls -1 docs/enhancements/ 2>/dev/null | grep -E '^ENH-[0-9]+' | sort -V
```

### 2.2: Assign Next Number

**POLICY: Identifier Decoupling (Dual-ID Policy)**
- **Local ID (Logical):** `issue-N` or `ENH-NNN`. A sequential count of internal project tasks/folders. This is the **Source of Truth** for the local file system and branch names.
- **GitHub ID (Platform):** `#N`. The serial ID assigned by GitHub.
- **Alignment Rule:** Identity is NOT required (GitHub IDs drift due to PRs/Discussions). **Mapping IS MANDATORY.**
- **Persistence:** The Local ID must be recorded in the GitHub Issue body. The GitHub ID must be recorded in local issue descriptions.

**Confirm with user:**
```
I'll create this as Local ID [Local-ID] (Mapped to GitHub Issue #[N]).
Branch/Plan will follow Local ID: v[Version]-[Local-ID]-[slug]
GitHub Issue Title: [Type] Descriptive Title

Is this mapping correct? (y/n)
```

---

## Step 3: Create Directory Structure

### 3.1: For Bugs/Issues
```bash
# Create issue directory
mkdir -p docs/issues/issue-N/

# Issue will contain:
# - issue-N-description.md (main documentation)
# - solution-approach.md (proposed fixes)
# - test-cases.md (how to test)
# - implementation-log.md (work log)
```

### 3.2: For Enhancements
```bash
# Create enhancement directory for supporting docs
mkdir -p docs/enhancements/ENH-NNN/

# Enhancement supporting docs will contain:
# - ENH-NNN-specification.md (requirements)
# - solution-approach.md (proposed implementation)
# - test-cases.md (acceptance criteria)
# - progress-log.md (work log)

# Main implementation plan will be:
# docs/plans/v[Major.Minor.0]-ENH-NNN-{slug}.md
```

---

## Step 4: Generate Issue Documentation

### 4.1: Implementation Plan Template (v9.4.0)

Every generated plan MUST include this **Safety Header** and **Atomic Approval Protocol**:

```markdown
# Implementation Plan: [Version]-[ID]-[Slug]

**STATUS:** 🔴 STOPPED (Waiting for Manual Approval of Step 1)
**GOVERNANCE:** Atomic Approval Required (Step-by-Step)
**BEHAVIOR LOCKS:** 
- [x] Zero-Deviation Execution
- [x] Stop-on-Confusion (Interactive Gate)
- [x] Visible Result Validation (Post-Step Tables)

## Execution Protocol
1. **Present Logic:** Before every tool call, state the intended change and logic.
2. **Wait:** Request explicit "YES" to proceed.
3. **Execute:** Run the tool.
4. **Validate:** Display the Validation Check table (see below).

## Recursive Logic Reconciliation (If Applicable)
| Step | Action | Character Budget | Word Budget | Conceptual Redundancy | Status |
|------|--------|------------------|-------------|-----------------------|--------|
| X.Y  | [Task] | 100-210? [ ]     | 350-500? [ ]| No 3+ word repeats? [ ]| [ ]    |
```

**Action:**
Read and use the template from: `docs/workflow-templates/implementation_plan_template.md`

---

## Step 5: Git Integration (DELEGATES to /git-governance)

### 5.1: Create Feature Branch (DELEGATES to /git-governance)

Invoke: **`@git-governance create-branch --from [parent] --name [branch-name] --issue [N]`**

**Constraint:** The `[branch-name]` MUST include the version prefix (e.g., `v9.3.4-issue-N`), but the PR title generated by Git Governance should be descriptive and mirror the clean GitHub Issue title (including type prefix).

This handles:
- Parent branch commit validation
- Branch creation with proper hierarchy
- Issue linkage verification
- Draft PR creation (Non-interactive with `--repo` detection)

**Example:**
```
@git-governance create-branch --from main --name v9.3.4-issue-92-logic-consolidation --issue 92
```

### 5.2: Verify Branch Creation

The git-governance workflow will output:
```
✅ Branch Created: v9.3.4-issue-92-logic-consolidation
✅ Linked to Issue #92
✅ Draft PR #XX created
```

---

## Step 6: Update Issue Tracker & Knowledge Capture

### 6.1: Master Issue Tracker
Add entry to `docs/issue-tracker.md`. 

### 6.2: Knowledge Capture Integration (Delegation)
**Mandatory Question:** *"We just identified [recursive loop drift/logic failure]. Should I run **`/lesson-learned`** now to sync this pattern to the Knowledge Graph before we start the fix?"*

If yes, run it. If no, ensure a task is added to the plan to update the KG after implementation.

### 6.3: Link Solution Approach
The `solution-approach.md` MUST link to the resulting lesson or updated gotcha in the Knowledge Graph.

### 6.4: Shadow Sync Check
**Action:** Detect if affected files include `optimization-tools/`, `PROJECT-INSTRUCTIONS.md`, or `Project-GUI-Instructions.md`.
**Logic:** If yes, add a mandatory task to the implementation plan: 
*"Run `/enforce-shadow-sync --auto` after each file modification to verify tier synchronization."*
Include Shadow Sync verification in the Final Reconciliation table of the plan.

### 6.5: Release Documentation Hook
**Mandatory Question:** *"Would you like me to run **`/doc-update`** now to synchronize the ROADMAP and CHANGELOG before I stage and push these initialization files?"*

---

## Step 7: The "Freeze & Document" Termination

**Present summary to user:**

```markdown
✅ **Issue Tracking Initialized**
✅ **Implementation Freeze Engaged**

**Local Issue #N: [Type] Descriptive Title**
- Status: 🔴 ACTIVE (LOCKED)
- Branch: v[Major.Minor.Patch]-[issue N]-brief-slug
- GitHub Issue: #[N] (Reopened/Created)

**Files Created:**
- docs/issues/issue-N/issue-N-description.md
- docs/plans/vX.X.X-issue-N-slug.md

**Logic Sync:**
- [x] Git Authority Validated
- [x] Knowledge Graph Lesson Initialized
```

**CRITICAL TERMINATION:**
*"DOCUMENTATION COMPLETE. I have ENGAGED the implementation freeze. Read the plan at [path] and say 'Execute Step 1' when you have reviewed and approved the logic. I will not proceed until then."*

**STOP.**

---

## Workflow Integration

### For Solo Developers
```
User identifies issue
  ↓
/start-issue-tracking
  ↓
Documentation created in Git
  ↓
Work on fix in feature branch
  ↓
Commit with issue reference
  ↓
Merge to main when complete
```

### For Team Handoffs (Claude Code → Opus/Sonnet)
```
User identifies issue in claude.ai
  ↓
/start-issue-tracking (creates docs)
  ↓
Download docs to local machine
  ↓
Open in Claude Code locally
  ↓
Opus/Sonnet reads issue docs from Git
  ↓
Implements solution with Git commits
  ↓
Updates progress in issue docs
```

---

## Examples

### Example 1: Bug Report

**Input:**
```
/start-issue-tracking JSON truncation with multi-position resumes
```

**Output:**
- Creates `docs/issues/issue-7/` (supporting docs)
- Creates `docs/plans/v9.3.4-issue-7-json-truncation.md` (main implementation plan)
- Git branch: `v9.3.4-issue-7-json-truncation`
- Commits and pushes documentation

### Example 2: Enhancement

**Input:**
```
/start-issue-tracking Add token usage display
```

**Output:**
- Creates `docs/enhancements/ENH-001/` (supporting docs)
- Creates `docs/plans/v9.3.4-ENH-001-token-tracking.md` (main implementation plan)
- Git branch: `v9.3.4-ENH-001-token-tracking`
- Commits and pushes documentation

---

## Integration with Other Skills

**Before starting work:**
- `/start-issue-tracking` ← Initialize tracking

**During work:**
- Standard Git commits referencing issue number

**After completion:**
- `/lessons-learned` ← Document what was learned
- `/doc-update` ← Synchronize documentation and Roadmap
- Update issue status to ✅ RESOLVED

---

## Troubleshooting

### Problem: Issue number already exists
**Solution:**
```
Check existing issues:
ls docs/issues/ | sort -V

Use next sequential number
```

### Problem: Not sure if this is an issue or enhancement
**Solution:**
- Bug = Something broken
- Enhancement = New feature/improvement
- When in doubt, choose Enhancement

### Problem: Git branch creation fails
**Solution:**
```bash
# Check current branch
git branch

# Make sure you're on main/develop
git checkout main

# Try again
git checkout -b fix/issue-N-description
```

---

## Best Practices

1. **Be Specific:** Issue titles should be clear and descriptive
2. **Document Early:** Create issue docs as soon as problem is identified
3. **Use Branches:** Always create feature branch for issue work
4. **Reference Issues:** Include issue number in all related commits
5. **Update Progress:** Keep issue docs current as work progresses
6. **Link Related:** Connect related issues and enhancements
7. **Test Thoroughly:** Define test cases before implementing solution
8. **Avoiding Interactive Prompts:** Always use `--repo` or push first to ensure `gh` commands don't hang in automated environments.

---

## File Naming Conventions

**Issues:**
- `issue-N-{slug}.md` (e.g., issue-7-json-truncation.md)
- `solution-approach.md`
- `test-cases.md`
- `implementation-log.md`

**Enhancements (supporting docs in docs/enhancements/ENH-NNN/):**
- `ENH-NNN-specification.md` (e.g., ENH-001-specification.md)
- `solution-approach.md`
- `test-cases.md`
- `progress-log.md`

**Main Implementation Plan:**
- `docs/plans/v[Major.Minor.0]-ENH-NNN-{slug}.md` (for enhancements)
- `docs/plans/v[Major.Minor.Patch]-ENH-NNN-{slug}.md` (for enhancement patches)

**Branch Names:**
- For issues: `v[Major.Minor.0]-[issue N]-brief-slug` (e.g., v9.3.4-issue-7-json-truncation)
- For patches: `v[Major.Minor.Patch]-[issue N]-brief-slug` (e.g., v9.3.4-issue-7-json-truncation)

**Main Implementation Plan:**
- For issues: `docs/plans/v[Major.Minor.0]-[issue N]-{slug}.md`
- For patches: `docs/plans/v[Major.Minor.Patch]-[issue N]-{slug}.md`

---

**Created:** January 8, 2026  
**Version:** v9.4.1  
**Usage:** Type `/start-issue-tracking` when you identify a bug or want to plan an enhancement  
**Integration:** Works with Git, Claude Code, and `/lessons-learned` skill
