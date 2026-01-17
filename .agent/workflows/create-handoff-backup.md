---
description: Create comprehensive project handoff documentation
---
# Create Handoff Backup

**Purpose:** Create comprehensive handoff documentation for a project artifact, consolidating all work, issues, and progress into a complete backup package for new developers or AI assistants.

**Version:** 1.0 (Created: 2026-01-08)

---

## Command Syntax

```
/create-handoff-backup
/create-handoff-backup <artifact-name>
```

**Examples:**
- `/create-handoff-backup`
- `/create-handoff-backup Phase1ResumeAnalyzer`
- `/create-handoff-backup MyReactComponent`

---

## When to Use This Skill

Use `/create-handoff-backup` when:
- ✅ Transitioning project to another developer
- ✅ Preparing for context window limits (>180K tokens)
- ✅ Completing a major milestone and want to preserve state
- ✅ Creating documentation for AI assistant handoffs
- ✅ Need to stop work temporarily and want comprehensive backup
- ✅ Want to create "start here" guides for new contributors

**Do NOT use for:**
- ❌ Simple Git commits (use standard Git workflow)
- ❌ Daily progress logs (use lightweight notes)
- ❌ Work that's still in early exploration phase
- ❌ Projects without significant documentation needs

---

## Overview - What Gets Created

This skill generates a **complete handoff package** containing:

1. **START-HERE-handoff-guide.md** - Authoritative orientation document
2. **documentation-map.md** - Master index of all files
3. **VISUAL-FILE-MAP.md** - Visual reference and decision tree
4. **Issue/Enhancement tracking docs** - Consolidated status
5. **Artifact creation guide** - Step-by-step rebuild instructions
6. **Session summaries** - Context and history
7. **Test cases** - Comprehensive testing scenarios

**Total Output:** 10-15 files, ~50-100 pages of documentation

**Reading Time:** 15-30 minutes for orientation, full details on-demand

---

## Step 1: Verification (INTERACTIVE)

**Ask the user the questions from the template at:** `docs/workflow-templates/handoff-verification.md`

**WAIT FOR USER INPUT** before proceeding to Step 2.

---

## Step 2: Scan Existing Documentation

### 2.1: Locate All Project Files

**Search common locations:**
```bash
# Check outputs directory
ls -lh /mnt/user-data/outputs/ | grep -E '\.(md|jsx|js|py|txt)$'

# Check project directories
ls -lh docs/
ls -lh docs/issues/
ls -lh docs/enhancements/
ls -lh docs/sessions/

# Check for existing guides
find . -name "*guide*.md" -o -name "*README*.md"
```

### 2.2: Categorize Files

**Group files by type:**

**Category 1: Artifacts (User-Facing)**
- Main application files (.jsx, .js, .py, etc.)
- Only files that users/customers interact with

**Category 2: Issue Tracking**
- Bug reports (issue-N-*.md)
- Enhancement specs (ENH-NNN-*.md)
- Master trackers (issue-tracker-update.md)

**Category 3: Implementation Documentation**
- Enhancement implementation plans
- Solution approach documents
- Technical specifications

**Category 4: Session Context**
- Session summaries
- Progress logs
- Work-in-progress notes

**Category 5: Testing**
- Test case documents
- Debug guides
- Error handling scenarios

**Category 6: Existing Guides (if any)**
- Creation guides
- Quick-start guides
- Conceptual overviews

### 2.3: Extract Key Information

**For each file, extract:**
- Purpose (what is this file for?)
- Status (active, completed, archived?)
- Key content (main takeaways)
- Priority (critical, high, medium, low?)
- Last updated date

**Create inventory table:**
```
| File | Type | Purpose | Status | Priority | Updated |
|------|------|---------|--------|----------|---------|
| file1.md | Issue | Bug #7 | Active | Critical | 2026-01-08 |
| file2.md | Spec | ENH-001 | Planned | High | 2026-01-08 |
```

---

## Step 3: Create START-HERE-handoff-guide.md

**File:** `/mnt/user-data/outputs/START-HERE-handoff-guide.md`

**Action:**
Read and use the template from: `docs/workflow-templates/handoff-guide.md`

---

## Step 4: Create documentation-map.md

**File:** `/mnt/user-data/outputs/documentation-map.md`

**Action:**
Read and use the template from: `docs/workflow-templates/documentation-map.md`

---

## Step 5: Create VISUAL-FILE-MAP.md

**File:** `/mnt/user-data/outputs/VISUAL-FILE-MAP.md`

**Action:**
Read and use the template from: `docs/workflow-templates/visual-file-map.md`

---

## Step 6: Consolidate Issue Tracking

### 6.1: Review All Issue Documents

**Scan for:**
- Issue tracking files (v6.5.2-analyzer-enhancements.md, etc.)
- Individual issue files (issue-N-*.md)
- Enhancement specs (ENH-NNN-*.md)
- Master trackers (issue-tracker-update.md)

### 6.2: Extract Issue Status

**For each issue, extract:**
```
Issue #N: [Title]
- Type: Bug / Enhancement / UI / Performance
- Priority: Critical / High / Medium / Low
- Status: Active / Resolved / Paused
- Files Affected: [list]
- Solution Status: [Proposed / In Progress / Implemented / Tested]
- Git Branch: [branch name if exists]
- Related Issues: [list]
```

### 6.3: Create Consolidated Status

**Add to handoff guide:**
```markdown
## 📊 Issue Status Overview

**Total Issues:** X
**Active:** Y
**Resolved:** Z

### Active Issues (Require Attention)

#### Issue #N: [Title] 🔴 CRITICAL
- **Problem:** [Brief description]
- **Files:** [Affected files]
- **Solution:** [Proposed approach]
- **Time Estimate:** [Hours]
- **Documentation:** [Link to issue file]
- **Next Step:** [What to do]

[Repeat for each active issue]

### Resolved Issues (For Reference)

#### Issue #N: [Title] ✅ RESOLVED
- **Problem:** [Brief description]
- **Solution:** [What was done]
- **Commit:** [Git commit hash if available]
- **Documentation:** [Link to issue file]

[Repeat for each resolved issue]
```

---

## Step 7: Create Artifact Creation Guide (if not exists)

**File:** `/mnt/user-data/outputs/[artifact-name]-creation-guide.md`

**Action:**
Read and use the template from: `docs/workflow-templates/artifact-creation-guide.md`

---

## Step 8: Session Summary Consolidation

### 8.1: Review Session Summaries

**Locate all session files:**
```bash
ls /mnt/user-data/outputs/ | grep -i session
```

### 8.2: Extract Key Information

**For each session, note:**
- Date and duration
- What was discussed
- What was built/changed
- Decisions made
- Problems solved
- Files created/modified
- Commits made

### 8.3: Add to Timeline

**Incorporate into handoff guide timeline section:**
```markdown
### [Date] - [Session Name]

**Duration:** [Hours]
**Phase:** [Development phase]

| Time | Event | Files Created | Git Status |
|------|-------|---------------|------------|
| Morning | [Activity] | [Files] | ✅/❌ |
| Afternoon | [Activity] | [Files] | ✅/❌ |
```

---

## Step 9: Final Assembly and Review

### 9.1: Verify All Files Created

**Checklist:**
- [ ] START-HERE-handoff-guide.md
- [ ] documentation-map.md
- [ ] VISUAL-FILE-MAP.md
- [ ] Issue tracking consolidated
- [ ] Artifact creation guide exists
- [ ] Session summaries referenced
- [ ] Test cases documented
- [ ] All links working
- [ ] Git status accurate
- [ ] Priority ordering clear

### 9.2: Cross-Reference Check

**Verify:**
- START-HERE links to documentation-map ✓
- documentation-map links to all files ✓
- VISUAL-FILE-MAP matches actual structure ✓
- Issue numbers consistent across docs ✓
- File paths correct ✓
- Dates current ✓

### 9.3: Git Status Accuracy

**Critical Check:**
```bash
# Verify Git status claims
git status
git branch -a
git log --oneline | head -10

# If claims "not in Git", verify:
ls -la .git/  # Should not exist if truly not in Git
```

**Update docs if status incorrect**

---

## Step 10: Package and Present

**Action:**
Use the response templates from: `docs/workflow-templates/handoff-output.md` (Sections 10.1 and 10.2)
```markdown
**What to do with these files:**

### Option 1: Add to Project Files
```bash
# Copy to project directory
cp START-HERE-handoff-guide.md /path/to/project/docs/
cp documentation-map.md /path/to/project/docs/
cp VISUAL-FILE-MAP.md /path/to/project/docs/

# Commit to Git
cd /path/to/project
git add docs/
git commit -m "docs: add handoff documentation package

- Complete handoff guide with orientation
- Master documentation index
- Visual file map and decision tree
- Issue tracking consolidated
- Test cases documented

For new developers: Start with docs/START-HERE-handoff-guide.md
"
```

### Option 2: Store as Backup
Keep in /mnt/user-data/outputs/ for future reference

### Option 3: Share with Team
Email/Slack the files or links to new developers
```

---

## Step 11: Maintenance Instructions

### 11.1: Keeping Handoff Docs Current

```markdown
## 🔄 Keeping These Docs Updated

**When to update:**
- New issue discovered → Add to issue tracking section
- Issue resolved → Update status to ✅ RESOLVED
- File created → Add to documentation-map.md
- Major change → Update timeline in START-HERE
- Git status changes → Update Git warnings

**How to update:**
1. Edit relevant section in handoff guide
2. Update "Last Updated" date
3. Add note in changelog (if exists)
4. Commit changes
```

### 11.2: Re-Running This Skill

**Action:**
Refer to instructions in template: `docs/workflow-templates/handoff-output.md` (Section 11.2)

---

## Examples

### Example 1: React Component Handoff

**Input:**
```
/create-handoff-backup Phase1ResumeAnalyzer
```

**Output:**
- START-HERE-handoff-guide.md (45 pages)
- documentation-map.md (8 pages)
- VISUAL-FILE-MAP.md (6 pages)
- Consolidated issue tracking
- 16 files referenced and organized

### Example 2: Before Context Limit

**Scenario:** Chat approaching 180K tokens

**Input:**
```
/create-handoff-backup
```

**Output:**
- Complete handoff package
- Preserves all session context
- Enables seamless continuation in new chat

---

## Integration with Other Skills

**Before this skill:**
- `/start-issue-tracking` → Create issue docs

**Use this skill when:**
- Handoff needed
- Context limit approaching
- Project pause/transfer

**After this skill:**
- `/lessons-learned` → Document lessons learned from the handoff process

---

## Troubleshooting

### Problem: Too many files to organize

**Solution:**
Focus on:
1. The artifact file (most important)
2. Active issue docs
3. Implementation guides
4. Test cases
Archive or summarize older docs

### Problem: Unclear Git status

**Solution:**
```bash
git status                    # Check working tree
git log --oneline | head -5  # Check commit history
git remote -v                 # Check remote
```
Be honest in docs: "Git status unclear - verify before claiming"

### Problem: Documentation inconsistent

**Solution:**
- Note inconsistencies in START-HERE
- Create "Known Documentation Issues" section
- Don't try to resolve during handoff creation

---

## File Naming Convention

**Core Files:**
- `START-HERE-handoff-guide.md`
- `documentation-map.md`
- `VISUAL-FILE-MAP.md`

**Backup Package:**
- `handoff-backup-YYYY-MM-DD.zip`

**Supporting Files:**
- Keep original filenames
- Reference by original names in guides

---

## Success Criteria

**Handoff backup is complete when:**
- [ ] New person can orient in 15 minutes
- [ ] Links work and files are discoverable
- [ ] Next steps and Git status are clear

---

**Created:** January 8, 2026  
**Version:** 1.0  
**Usage:** Type `/create-handoff-backup` when transitioning project or approaching context limits  
**Output:** 3 core docs + consolidated supporting documentation (10-15 files total)
