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
# Create enhancement directory
mkdir -p docs/enhancements/ENH-NNN/

# Enhancement will contain:
# - ENH-NNN-specification.md (requirements)
# - implementation-plan.md (step-by-step plan)
# - test-cases.md (acceptance criteria)
# - progress-log.md (work log)
```

---

## Step 4: Generate Issue Documentation

### 4.1: Main Issue Document Template

**File:** `docs/issues/issue-N/issue-N-{slug}.md`

> **Note:** The `gh issue create` command below MUST use the `--body-file` flag pointing to `solution-approach.md` (or this description file) to ensure all technical details are visible in the GitHub UI. Do not use manual summaries.

```markdown
# Issue #N: [Title]

**Status:** 🔴 ACTIVE / ✅ RESOLVED / ⏸️ PAUSED  
**Type:** Bug / Enhancement / UI / Documentation / Performance / Refactor  
**Priority:** Critical / High / Medium / Low  
**Created:** YYYY-MM-DD  
**Last Updated:** YYYY-MM-DD  
**Affected Files:** 
- file1.ext (lines X-Y)
- file2.ext (lines A-B)

**Labels:** `component-name` + `bug|enhancement` + `priority-level`

---

## Problem Description

[Detailed description of what's wrong or what needs to be added]

**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Error Messages:**
```
[Paste actual error messages here]
```

**Console/Log Output:**
```
[Paste relevant logs here]
```

---

## Current Behavior

[What happens now - step by step]

1. User does X
2. System does Y
3. Error occurs at Z

---

## Expected Behavior

[What should happen instead]

1. User does X
2. System should do Y
3. Result should be Z

---

## Impact Assessment

**Who is affected:**
- [ ] All users
- [ ] Users with specific configuration
- [ ] Only on certain platforms
- [ ] Edge case / rare scenario

**Severity:**
- **Critical:** [Why this is critical]
- **High:** [Why this is high priority]
- **Medium:** [Why this is medium priority]
- **Low:** [Why this is low priority]

**Workaround Available:**
- [ ] Yes - [Describe workaround]
- [ ] No

---

## Root Cause Analysis

**Initial Hypothesis:**
[What you think is causing the problem]

**Investigation Steps:**
1. [Step 1 - what to check]
2. [Step 2 - what to verify]
3. [Step 3 - what to test]

**Confirmed Root Cause:**
[To be filled after investigation]

---

## Proposed Solutions

### Option 1: [Quick Fix / Band-Aid]
**Description:** [What to do]  
**Time Estimate:** [How long]  
**Success Probability:** [%]  
**Pros:**
- [Pro 1]

**Cons:**
- [Con 1]

### Option 2: [Proper Fix / Architectural Solution]
**Description:** [What to do]  
**Time Estimate:** [How long]  
**Success Probability:** [%]  
**Pros:**
- [Pro 1]

**Cons:**
- [Con 1]

**Recommended:** [Which option and why]

---

## Testing Strategy

**Test Cases:**
1. [Test case 1]
2. [Test case 2]

**Regression Tests:**
- [ ] Test case A
- [ ] Test case B

**Success Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

---

## Related Issues

**Depends On:**
- Issue #X - [Brief description]

**Blocks:**
- Issue #Y - [Brief description]

**Related:**
- Enhancement ENH-NNN - [Brief description]

---

## Progress Log

### YYYY-MM-DD - Initial Discovery
- [What was found]
- [What was tried]

### YYYY-MM-DD - Investigation
- [Investigation findings]

### YYYY-MM-DD - Solution Attempt
- [What was implemented]
- [Results]

---

## Resolution

**Date Resolved:** YYYY-MM-DD  
**Solution Implemented:** [Which option was chosen]  
**Files Changed:**
- file1.ext (lines X-Y)

**Commit:** [Git commit hash]  
**Branch:** [feature/fix branch name]  
**Merged To:** [main/develop]

**Verification:**
- [How it was tested]
- [Results]

---

**Created:** YYYY-MM-DD  
**Last Updated:** YYYY-MM-DD  
**Version:** 1.0
```

---

## Step 5: Create Supporting Documents

### 5.1: Solution Approach Document

**File:** `docs/issues/issue-N/solution-approach.md`

```markdown
# Issue #N - Solution Approach

**Last Updated:** YYYY-MM-DD

---

## Option 1: [Name]

### Implementation Steps

**Step 1: [First Step]**
```[language]
// Code or configuration changes
```

**Step 2: [Second Step]**
[Detailed instructions]

### Files to Modify
- `path/to/file1.ext` (lines X-Y)
  - Change: [What to change]
  - Why: [Reason]

### Estimated Time
- Development: X hours
- Testing: Y hours
- Documentation: Z hours
- **Total:** X+Y+Z hours

### Risk Assessment
- **Low Risk:** [Why]
- **Medium Risk:** [Why]
- **High Risk:** [Why]

---

## Option 2: [Name]

[Same structure as Option 1]

---

## Recommendation

**Chosen Approach:** Option [1/2]

**Reasoning:**
1. [Reason 1]
2. [Reason 2]

**Trade-offs Accepted:**
- [Trade-off 1]
```

### 5.2: Test Cases Document

**File:** `docs/issues/issue-N/test-cases.md`

```markdown
# Issue #N - Test Cases

**Last Updated:** YYYY-MM-DD

---

## Regression Tests (Must Pass)

### Test Case R1: [Name]
**Scenario:** [What to test]  
**Steps:**
1. [Step 1]
2. [Step 2]

**Expected Result:** [What should happen]  
**Actual Result:** [To be filled during testing]  
**Status:** ⏳ Pending / ✅ Pass / ❌ Fail

---

## New Tests (For This Issue)

### Test Case N1: [Name]
**Scenario:** [What to test]  
**Steps:**
1. [Step 1]
2. [Step 2]

**Expected Result:** [What should happen]  
**Actual Result:** [To be filled during testing]  
**Status:** ⏳ Pending / ✅ Pass / ❌ Fail

---

## Edge Cases

### Test Case E1: [Name]
[Same structure]

---

## Test Results Summary

**Date Tested:** YYYY-MM-DD  
**Tester:** [Name/Role]

**Results:**
- Total Tests: X
- Passed: Y
- Failed: Z
- Skipped: W

**Conclusion:**
[Pass/Fail/Partial]
```

---

## Step 6: Git Integration

### 6.1: Create Feature Branch
```bash
# For bugs
git checkout -b fix/issue-N-brief-description

# For enhancements
git checkout -b feat/ENH-NNN-brief-description

# Examples
git checkout -b fix/issue-7-json-truncation
git checkout -b feat/ENH-001-token-tracking
```

### 6.2: Initial Commit
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

### 6.3: Push to Remote & Link Issue
```bash
# Push branch
git push -u origin fix/issue-N-brief-description

# IMMEDIATELY create Draft PR to link branch to Issue (Prevent Governance Drift)
gh pr create --draft --title "WIP: Issue #N - [Brief Title]" --body "Closes #N"
```

---

## Step 7: Update Issue Tracker

### 7.1: Master Issue Tracker

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

### 7.2: Update README (if applicable)

Add to "Known Issues" section:
```markdown
## Known Issues

- **Issue #N:** [Title] - [Brief description] ([Status])
  - Documentation: [Link to issue directory]
  - Workaround: [If available]
```

---

## Step 8: Confirm Completion

**Present summary to user:**

```markdown
✅ **Issue Tracking Initialized**

**Issue #N: [Title]**
- Status: 🔴 ACTIVE
- Type: [Bug/Enhancement]
- Priority: [Level]

**Files Created:**
- docs/issues/issue-N/issue-N-description.md
- docs/issues/issue-N/solution-approach.md
- docs/issues/issue-N/test-cases.md

**Git Status:**
- Branch: fix/issue-N-brief-description
- Committed: ✅
- Pushed: ✅

**Next Steps:**
1. Begin investigation (solution-approach.md)
2. Implement chosen solution
3. Run test cases (test-cases.md)
4. Update progress in issue-N-description.md
5. Commit changes with: `git commit -m "fix(issue-N): [description]"`

**Quick Links:**
- Issue Doc: docs/issues/issue-N/issue-N-description.md
- Master Tracker: docs/issue-tracker.md

Ready to start work on Issue #N!
```

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
- Creates `docs/issues/issue-7/`
- Files: issue-7-json-truncation.md, solution-approach.md, test-cases.md
- Git branch: `fix/issue-7-json-truncation`
- Commits and pushes documentation

### Example 2: Enhancement

**Input:**
```
/start-issue-tracking Add token usage display
```

**Output:**
- Creates `docs/enhancements/ENH-001/`
- Files: ENH-001-specification.md, implementation-plan.md, test-cases.md
- Git branch: `feat/ENH-001-token-tracking`
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

**Enhancements:**
- `ENH-NNN-specification.md` (e.g., ENH-001-specification.md)
- `implementation-plan.md`
- `test-cases.md`
- `progress-log.md`

**Branch Names:**
- `fix/issue-N-brief-slug` (e.g., fix/issue-7-json-truncation)
- `feat/ENH-NNN-brief-slug` (e.g., feat/ENH-001-token-tracking)

---

**Created:** January 8, 2026  
**Version:** 1.0  
**Usage:** Type `/start-issue-tracking` when you identify a bug or want to plan an enhancement  
**Integration:** Works with Git, Claude Code, and `/lessons-learned` skill
