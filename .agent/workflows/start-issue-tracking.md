# Start Issue Tracking

**Purpose:** Initialize issue tracking for a specific problem or enhancement, creating structured documentation that can be managed with Git using Claude Code locally.

**Version:** 1.0 (Created: 2026-01-08)

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

## Step 0: Verification & Stop-on-Error (PRE-FLIGHT)

Before initializing the issue tracker, explicitly state: **"MODE: READ-ONLY ANALYSIS. Establishing behavior locks..."** 
Confirm that you will stop and ask the user directly if you encounter any issues, confusion, or ambiguous code paths.

---

## Step 1: Verification (INTERACTIVE)

**Ask the user these questions:**

### 1.1: Issue Type
```
What type of issue is this?

1. [ ] 🐛 Bug - Something is broken or not working correctly
2. [ ] ✨ Enhancement - New feature or improvement
3. [ ] 🎨 UI/UX - Visual or user experience improvement
4. [ ] 📝 Documentation - Documentation update or addition
5. [ ] ⚡ Performance - Speed or efficiency improvement
6. [ ] 🔧 Refactor - Code restructuring without behavior change

Please select the type (1-6):
```

### 1.2: Issue Details
```
Please provide the following information:

**Issue Title:** [Brief, descriptive title]
**Example:** "JSON response truncation for resumes with 3+ positions"

**Problem Description:** [What's wrong or what needs to be added?]
**Example:** "API truncates JSON response at ~17.6K characters, causing parse errors"

**Current Behavior:** [What happens now?]
**Example:** "Multi-position analysis fails with SyntaxError"

**Expected Behavior:** [What should happen?]
**Example:** "All positions should be analyzed successfully regardless of count"

**Impact/Priority:**
1. [ ] Critical - Blocks major functionality
2. [ ] High - Significant problem, workaround exists
3. [ ] Medium - Important but not urgent
4. [ ] Low - Nice to have

**Affected Files/Components:** [Which files are involved?]
**Example:** "Phase1ResumeAnalyzer.jsx, lines 145-290 (API call + parsing)"
```

### 1.3: Context Gathering
```
**Has this issue been discussed before?**
- [ ] Yes - Provide chat links or document references
- [ ] No - This is newly discovered

**Do you have error logs or screenshots?**
- [ ] Yes - I'll paste them below
- [ ] No

**Is there an existing workaround?**
- [ ] Yes - Describe: ___________
- [ ] No
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

**For Bugs/Issues:**
- Format: `issue-N` where N is next sequential number
- Example: If issue-7 exists, create issue-8

**For Enhancements:**
- Format: `ENH-NNN` where NNN is zero-padded (001, 002, etc.)
- Example: If ENH-001 exists, create ENH-002
- **Local directory:** `docs/enhancements/ENH-002/` (supporting docs)
- **Main plan:** `docs/plans/v[Major.Minor.0]-ENH-002-{slug}.md`

**Confirm with user:**
```
I'll create this as [Issue #8 / ENH-002].

Is this correct? (y/n)
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

### 4.1: Main Issue Document
**File:** `docs/plans/v[Major.Minor.0]-[issue N]-{slug}.md` (for issues)
**File:** `docs/plans/v[Major.Minor.Patch]-[issue N]-{slug}.md` (for patches)

> **Note:** The `gh issue create` command below MUST use the `--body-file` flag pointing to this implementation plan to ensure all technical details are visible in the GitHub UI. Do not use manual summaries.

This is the final implementation plan and should include at least references to:
- docs/issues/issue-N/issue-N-description.md
- docs/issues/issue-N/solution-approach.md
- docs/issues/issue-N/test-cases.md

**Action:**
Read and use the template from: `docs/workflow-templates/issue_template.md`

### 4.2: Solution Approach Document
**File:** `docs/issues/issue-N/solution-approach.md`

**Action:**
Read and use the template from: `docs/workflow-templates/solution-approach.md`

### 4.3: Test Cases Document
**File:** `docs/issues/issue-N/test-cases.md`

**Action:**
Read and use the template from: `docs/workflow-templates/test-cases.md`

---

## Step 5: Git Integration

### 5.1: Create Feature Branch
```bash
# For issues (new minor version)
git checkout -b v[Major.Minor.0]-[issue N]-brief-description

# For patches (patch version)
git checkout -b v[Major.Minor.Patch]-[issue N]-brief-description

# Examples
git checkout -b v9.2.0-issue-7-json-truncation
git checkout -b v9.1.1-issue-7-json-truncation
```

### 5.2: Initial Commit
```bash
# Stage issue documentation
git add docs/issues/issue-N/
# OR
git add docs/enhancements/ENH-NNN/

# Commit with conventional format
git commit -m "docs(issue-N): create issue tracking for [title]

Issue #N: [Title]
Type: [Bug/Enhancement]
Priority: [Critical/High/Medium/Low]

Problem:
[Brief problem description]

Files Created:
- docs/issues/issue-N/issue-N-description.md
- docs/issues/issue-N/solution-approach.md
- docs/issues/issue-N/test-cases.md

Next Steps:
[What to do next]

Status: Active
"
```

### 5.3: Push to Remote & Link Issue
```bash
# Push branch
git push -u origin v[Major.Minor.0]-[issue N]-brief-description

# IMMEDIATELY create Draft PR to link branch to Issue (Prevent Governance Drift)
gh pr create --draft --title "WIP: Issue #N - [Brief Title]" --body "Closes #N"
```

---

## Step 6: Update Issue Tracker

### 6.1: Master Issue Tracker

**File:** `docs/issue-tracker.md` (create if doesn't exist)

**Add entry:**
```markdown
## Issue #N: [Title]

**Status:** 🔴 ACTIVE  
**Type:** Bug / Enhancement  
**Priority:** Critical / High / Medium / Low  
**Created:** YYYY-MM-DD  
**Assigned:** [Name/Unassigned]  
**Branch:** fix/issue-N-brief-description

**Quick Summary:**
[One-line description]

**Documentation:** [docs/issues/issue-N/](docs/issues/issue-N/)

**Progress:**
- [ ] Investigation complete
- [ ] Solution proposed
- [ ] Implementation started
- [ ] Testing complete
- [ ] Documentation updated
- [ ] Merged to main

---
```

### 6.2: Update README (if applicable)

Add to "Known Issues" section:
```markdown
## Known Issues

- **Issue #N:** [Title] - [Brief description] ([Status])
  - Documentation: [Link to issue directory]
  - Workaround: [If available]
```

---

## Step 7: Confirm Completion

**Present summary to user:**

```markdown
✅ **Issue Tracking Initialized**

**Issue #N: [Title]**
- Status: 🔴 ACTIVE
- Type: [Bug/Enhancement]

**Files Created:**
- docs/issues/issue-N/issue-N-description.md
- docs/issues/issue-N/solution-approach.md
- docs/issues/issue-N/test-cases.md

**Git Status:**
- Branch: v[Major.Minor.0]-[issue N]-brief-description
- Committed: ✅
- Pushed: ✅

**Next Steps:**
1. Begin investigation (solution-approach.md)
2. Implement chosen solution
3. Run test cases (test-cases.md)
```

**Quick Links:**
- Issue Doc: docs/issues/issue-N/issue-N-description.md
- Master Tracker: docs/issue-tracker.md

Ready to start work on Issue #N!

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
- Creates `docs/plans/v9.2.0-issue-7-json-truncation.md` (main implementation plan)
- Git branch: `v9.2.0-issue-7-json-truncation`
- Commits and pushes documentation

### Example 2: Enhancement

**Input:**
```
/start-issue-tracking Add token usage display
```

**Output:**
- Creates `docs/enhancements/ENH-001/` (supporting docs)
- Creates `docs/plans/v9.2.0-ENH-001-token-tracking.md` (main implementation plan)
- Git branch: `v9.2.0-ENH-001-token-tracking`
- Commits and pushes documentation

---

## Integration with Other Skills

**Before starting work:**
- `/start-issue-tracking` ← Initialize tracking

**During work:**
- Standard Git commits referencing issue number

**After completion:**
- `/lessons-learned` ← Document what was learned
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
- For issues: `v[Major.Minor.0]-[issue N]-brief-slug` (e.g., v9.2.0-issue-7-json-truncation)
- For patches: `v[Major.Minor.Patch]-[issue N]-brief-slug` (e.g., v9.1.1-issue-7-json-truncation)

**Main Implementation Plan:**
- For issues: `docs/plans/v[Major.Minor.0]-[issue N]-{slug}.md`
- For patches: `docs/plans/v[Major.Minor.Patch]-[issue N]-{slug}.md`

---

**Created:** January 8, 2026  
**Version:** 1.0  
**Usage:** Type `/start-issue-tracking` when you identify a bug or want to plan an enhancement  
**Integration:** Works with Git, Claude Code, and `/lessons-learned` skill
