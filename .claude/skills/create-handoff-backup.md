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

**Ask the user these questions:**

### 1.1: Artifact Information
```
What artifact or project are you creating a handoff for?

**Artifact Name:** [e.g., Phase1ResumeAnalyzer, MyComponent]
**Artifact Type:** 
- [ ] React Component
- [ ] Full Application
- [ ] API/Backend Service
- [ ] Library/Module
- [ ] CLI Tool
- [ ] Other: ___________

**Primary File(s):**
- [e.g., Phase1ResumeAnalyzer.jsx (1200 lines)]
- [Additional files if applicable]

**Location:**
- [ ] In Git repository (committed)
- [ ] In outputs directory only (/mnt/user-data/outputs/)
- [ ] Other: ___________
```

### 1.2: Project State
```
What is the current state of the project?

**Version/Status:**
- Current version: [e.g., v6.5.3, v1.0.0, or "not versioned"]
- Git status: [e.g., "NOT in Git", "on branch main", "feature branch"]
- Deployment: [e.g., "NOT deployed", "deployed to prod", "in staging"]

**Functionality:**
- [ ] Fully working
- [ ] Mostly working (with known issues)
- [ ] In development
- [ ] Prototype/POC

**Known Issues:**
How many issues are tracked?
- Active bugs: [count]
- Planned enhancements: [count]
- Total issues documented: [count]
```

### 1.3: Documentation Scope
```
What documentation already exists?

**Existing Documentation:**
- [ ] Issue tracking docs (e.g., v6.5.2-analyzer-enhancements.md)
- [ ] Enhancement specs (e.g., ENH-001-token-tracking.md)
- [ ] Session summaries (e.g., session-summary-2026-01-08.md)
- [ ] Test cases (e.g., error-handling-test-cases.md)
- [ ] Implementation plans
- [ ] Other: ___________

**List existing doc files:**
[Paste filenames or provide directory path]
```

### 1.4: Handoff Audience
```
Who is the handoff for?

- [ ] New developer joining project
- [ ] AI assistant (Opus/Sonnet in Claude Code)
- [ ] Future you (after break from project)
- [ ] Open-source contributors
- [ ] Team members
- [ ] Other: ___________

**Assumptions about audience:**
- [ ] No prior knowledge of project
- [ ] Familiar with technology stack
- [ ] Has access to codebase
- [ ] Needs step-by-step orientation
```

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

### 3.1: Critical Warnings Section

**Always include Git status warning if applicable:**
```markdown
# [Project Name] - Complete Handoff Guide

**Version:** [Documentation version]
**Date:** YYYY-MM-DD
**For:** New developers, maintainers, or AI assistants
**Reading Time:** 15 minutes
**Project Status:** [Current state]

---

## ⚠️ CRITICAL: [Git/Deployment] Status Warning

[IF artifact not in Git:]
THE ARTIFACT HAS NEVER BEEN COMMITTED TO GIT.

All version numbers in documentation are tracking labels only.
Artifact exists ONLY in: [path]

[IF artifact not deployed:]
THE ARTIFACT IS NOT DEPLOYED ANYWHERE.

This is a local development artifact in outputs directory.

---
```

### 3.2: Executive Summary

```markdown
## 🎯 Executive Summary

You're inheriting [brief description of what this is].

**Current State:**
- ✅/❌ **Artifact:** [filename] ([size], [line count])
- ✅/❌ **Git Status:** [status]
- ✅/❌ **Deployment Status:** [status]
- ✅ **Documentation:** [Complete/Partial]
- ✅/🔴 **Issues:** [X resolved, Y active]
- 📋 **Planned:** [What's next]

**What You Need to Know:**
1. [Key fact 1]
2. [Key fact 2]
3. [Key fact 3]
4. [Key fact 4]
5. [Next task]
```

### 3.3: Timeline

```markdown
## 📅 Timeline - How We Got Here

**[Month Year] - [Phase Name]**
| Date | Event | Files Created/Updated | Git Status |
|------|-------|----------------------|------------|
| [Date] | [Event] | [Files] | ✅/❌ |

[Add Reality Check sections explaining documentation vs actual state]
```

### 3.4: File Inventory by Category

```markdown
## 📁 File Inventory - What You Have

### Category 1: THE ARTIFACT (User-Facing)
- **[filename]** - [Description]
  - Purpose: [What it does]
  - Status: [Working/Broken/In Progress]
  - Size: [Lines/KB]
  - Git: ✅/❌

### Category 2: Documentation for PROJECT-INSTRUCTIONS
[Files that should be extracted into project instructions]

### Category 3: Issue Tracking & Status
[All issue and enhancement docs]

### Category 4: Active Work
[Implementation plans, solution approaches]

### Category 5: Context & History
[Session summaries, progress logs]

### Category 6: Navigation
[Master indexes, guides]
```

### 3.5: Documentation Integration Plan

```markdown
## 📚 Documentation Integration Plan

### Update 1: PROJECT-INSTRUCTIONS.md [Section Name]
**Priority:** HIGH
**Time:** X hours
**Purpose:** [Why this update matters]

**Extract from:**
- file1.md (sections A, B)
- file2.md (sections X, Y)

**Add to:** PROJECT-INSTRUCTIONS.md → [section name]

**Complete XML/Markdown provided:**
```xml
[Actual XML to copy/paste]
```

[Repeat for each integration update]
```

### 3.6: Priority Order for Next Steps

```markdown
## 🔄 What Needs to Be Done - Priority Order

### CRITICAL FIRST STEP
[e.g., Initialize Git repository if needed]

### IMMEDIATE (This Week)
**Task 1:** [Most urgent task]
- Why: [Reasoning]
- Time: [Estimate]
- Steps: [High-level steps]

### SHORT-TERM (Next 2 Weeks)
**Task 2:** [Next priority]

### ONGOING
**Task 3:** [Maintenance tasks]
```

### 3.7: First Day Checklist

```markdown
## ✅ First Day Checklist

### Morning (Orientation - 2 hours)
- [ ] Read this document completely (15 min)
- [ ] Review documentation-map.md (10 min)
- [ ] Check VISUAL-FILE-MAP.md (5 min)
- [ ] Scan artifact file (30 min)
- [ ] Review issue tracker (30 min)
- [ ] Set up development environment (30 min)

### Afternoon (First Task - 2-4 hours)
- [ ] Pick highest priority task
- [ ] Read relevant documentation
- [ ] Create feature branch
- [ ] Begin implementation
```

### 3.8: Common Questions

```markdown
## ❓ Common Questions

**Q: Where do I start?**
A: [Answer with specific steps]

**Q: What's the most important file?**
A: [Answer]

**Q: What if I break something?**
A: [Answer with rollback instructions]

[Add 10+ Q&As covering common scenarios]
```

### 3.9: Summary

```markdown
## ✅ Summary - TL;DR

**What You Have:**
- [List key assets]

**What You Do:**
0. [Optional setup step]
1. [First task]
2. [Second task]
3. [Third task]

**Key Files:**
- [List 3-5 most important files]

**Current Version:** [Version]
**Next Version:** [What's next]

**Critical Reality Check:**
[Any important caveats]
```

---

## Step 4: Create documentation-map.md

**File:** `/mnt/user-data/outputs/documentation-map.md`

### 4.1: File Structure Overview

```markdown
# Project Documentation Map

**Last Updated:** YYYY-MM-DD
**Total Files:** [count]
**Purpose:** Master index of all project documentation

---

## 📂 File Structure Overview

```
/mnt/user-data/outputs/
├── [artifact-file]           ← THE ARTIFACT (only user-facing file)
├── START-HERE-handoff-guide.md ← Read this first
├── documentation-map.md         ← You are here
├── VISUAL-FILE-MAP.md          ← Visual reference
├── issue-tracking/
│   ├── issue-N-description.md
│   └── ...
├── enhancements/
│   ├── ENH-NNN-spec.md
│   └── ...
├── guides/
│   └── [creation guides]
├── sessions/
│   └── [session summaries]
└── tests/
    └── [test cases]
```
```

### 4.2: File Categories

```markdown
## 📑 Files by Category

### 🎨 UX/UI Artifact (User-Facing)
[Only files that users interact with]

### 📝 Documentation Updates
[Files that should be extracted to PROJECT-INSTRUCTIONS]

### 🔧 Implementation Guides
[How to build or fix things]

### 📊 Status & Tracking
[Current state, issue tracking]

### 🧪 Testing
[Test cases, QA scenarios]

### 📚 Learning & Context
[Background, history, rationale]

### 🗺️ Navigation
[Indexes, maps, guides]
```

### 4.3: How to Create/Use the Artifact

```markdown
## 🚀 How to Create/Use the Artifact

### Option 1: Use Existing Artifact (30 seconds)
[Steps to use as-is]

### Option 2: Build from Scratch (2-3 hours)
[Reference to creation guide]

### Option 3: Modify Existing (variable time)
[How to make changes]
```

### 4.4: Where to Find Each Issue

```markdown
## 🐛 Where to Find Each Issue

**Issue #1:** [Title]
- File: [filename]
- Lines: [line numbers]
- Status: ✅ Resolved / 🔴 Active

[List all issues with location references]
```

### 4.5: File Purpose Quick Reference

```markdown
## 📋 File Purpose Quick Reference

| File | What It Does | When to Use |
|------|--------------|-------------|
| [file1] | [Purpose] | [Use case] |
| [file2] | [Purpose] | [Use case] |
```

### 4.6: Search Tips

```markdown
## 🔍 Quick Search Tips

**Looking for:**
- How to build the artifact → [guide name]
- Current issues → [tracker name]
- How to fix Issue #N → [issue file]
- Test cases → [test file]
- Session history → [session summary]
```

---

## Step 5: Create VISUAL-FILE-MAP.md

**File:** `/mnt/user-data/outputs/VISUAL-FILE-MAP.md`

### 5.1: Visual Reference Header

```markdown
# [Project Name] - Visual File Map

**Quick Visual Reference** - See where everything fits

---

## ⚠️ CRITICAL: [Status] Reality Check

[Any critical warnings about Git, deployment, etc.]

---
```

### 5.2: File Relationships Diagram

```markdown
## 🗺️ File Relationships

```
START HERE
    ↓
    ├─→ Want to understand project?
    │       └─→ documentation-map.md
    │               ├─→ File purposes
    │               ├─→ Issue locations
    │               └─→ Quick search tips
    │
    ├─→ Need visual overview?
    │       └─→ VISUAL-FILE-MAP.md (you are here)
    │
    ├─→ Ready to build?
    │       └─→ [artifact-creation-guide].md
    │               ├─→ Architecture overview
    │               ├─→ Step-by-step build
    │               └─→ Testing checklist
    │
    ├─→ Need to fix Issue #N?
    │       └─→ [issue-N-handoff].md
    │               ├─→ Problem description
    │               ├─→ Solution options
    │               └─→ Implementation steps
    │
    ├─→ Want full context?
    │       └─→ session-summary-[date].md
    │               ├─→ What was discussed
    │               ├─→ Decisions made
    │               └─→ What was built
    │
    └─→ Need to test?
            └─→ [test-cases].md
                    ├─→ Test scenarios
                    ├─→ Success criteria
                    └─→ Known issues
```
```

### 5.3: Timeline Visualization

```markdown
## 📅 Timeline Visualization

```
[Month] [Year]
    ↓
[Date] ─┬─ [Event 1]
        │   └─→ [file1.md]
        │
        ├─ [Event 2]
        │   └─→ [file2.md]
        │
        └─ [Event 3]
            └─→ [file3.md]
```
```

### 5.4: Files by Action Type

```markdown
## 🎯 Files by Action Type

### 🎨 UX/UI Artifact
- [artifact-file] ← Only user-facing file

### 📝 Documentation Updates
- [file1] → Extract to PROJECT-INSTRUCTIONS
- [file2] → Extract to PROJECT-INSTRUCTIONS

### 🔧 Implementation Guides
- [guide1] → Use for next task
- [guide2] → Use for future enhancement

### 📊 Status/Tracking
- [tracker1] → Check current state
- [tracker2] → See what's planned

[Continue for all categories]
```

### 5.5: Quick Decision Tree

```markdown
## 🌳 Quick Decision Tree

```
What do you need?
    │
    ├─ Understanding? → START-HERE-handoff-guide.md
    │
    ├─ Find a file? → documentation-map.md
    │
    ├─ Build artifact? → [creation-guide].md
    │
    ├─ Fix bug? → [issue-handoff].md
    │
    ├─ Add feature? → [enhancement-spec].md
    │
    ├─ Test? → [test-cases].md
    │
    └─ Context? → [session-summary].md
```
```

### 5.6: Summary Table

```markdown
## 📋 Summary Table - All Files

**⚠️ Git Status:** [Status message if needed]

| File | Type | Purpose | Git Status | Priority |
|------|------|---------|------------|----------|
| [file1] | Artifact | [Purpose] | ✅/❌ | 🔴/🟡/🟢 |
| [file2] | Guide | [Purpose] | ✅/❌ | 🔴/🟡/🟢 |

**Legend:**
- 🔴 HIGH = Critical path
- 🟡 MED = Important
- 🟢 LOW = Reference/optional
```

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

### 7.1: Architecture Overview

```markdown
# [Artifact Name] - Complete Creation Guide

**Purpose:** Step-by-step instructions to build this artifact from scratch

---

## 🏗️ Architecture Overview

**Component Type:** [React Component / Full App / API / etc.]
**Size:** [Lines of code, file size]
**Technology Stack:**
- [Tech 1]
- [Tech 2]
- [Tech 3]

**Component Hierarchy:**
```
[Artifact Name]
├─ [Subcomponent 1]
│  ├─ [Feature A]
│  └─ [Feature B]
├─ [Subcomponent 2]
│  └─ [Feature C]
└─ [Subcomponent 3]
```
```

### 7.2: Prerequisites

```markdown
## 📋 Prerequisites

**Before you begin:**
- [ ] Node.js [version] installed
- [ ] [Other dependencies]
- [ ] [Required tools]

**Knowledge Required:**
- [Tech 1] basics
- [Tech 2] fundamentals
```

### 7.3: Step-by-Step Creation

```markdown
## 🔨 Step-by-Step Creation Process

### Step 1: [First Step]

**What:** [Brief description]

**Code:**
```[language]
// Complete code for this step
```

**Explanation:**
[Detailed explanation of what this code does]

### Step 2: [Second Step]

[Same structure]

[Continue for all steps]
```

### 7.4: Testing Checklist

```markdown
## ✅ Testing Checklist

After building, verify:
- [ ] [Test 1]
- [ ] [Test 2]
- [ ] [Test 3]

**Known Issues:**
- Issue #N: [Brief description] - See [link to fix]
```

### 7.5: Quick Start Options

```markdown
## 🚀 Quick Start Options

### Option 1: Use Existing Artifact (30 seconds)
```bash
# Copy from outputs
cp /mnt/user-data/outputs/[artifact-file] .
```

### Option 2: Build from Scratch (2-3 hours)
Follow steps 1-N above

### Option 3: Modify Existing
1. Copy existing artifact
2. Make your changes
3. Test thoroughly
```

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

### 10.1: Present File List

```markdown
✅ **Handoff Backup Complete**

**Core Documentation Created:**
- START-HERE-handoff-guide.md (15-min orientation)
- documentation-map.md (master index)
- VISUAL-FILE-MAP.md (visual reference)

**Supporting Documentation:**
- [List all other files created/consolidated]

**Total Files:** [count]
**Total Size:** [KB/MB]
**Reading Time:** 15 minutes (orientation), 2-3 hours (full detail)

**Quick Start:**
1. Read START-HERE-handoff-guide.md (15 min)
2. Review documentation-map.md (10 min)
3. Check VISUAL-FILE-MAP.md (5 min)
4. Begin [next task] (see handoff guide)

**All files ready for:**
- ✅ Download
- ✅ Addition to project files
- ✅ Commit to Git
- ✅ Sharing with team
```

### 10.2: Offer Download Package

**Present download options:**
```markdown
**Download Options:**

1. **Individual Files:**
   - [Link to START-HERE-handoff-guide.md]
   - [Link to documentation-map.md]
   - [Link to VISUAL-FILE-MAP.md]
   - [Links to other files]

2. **Complete Package (ZIP):**
   - [Link to handoff-backup-YYYY-MM-DD.zip]
   - Contains all documentation files
   - Ready to add to project

3. **Git-Ready Bundle:**
   - Pre-organized directory structure
   - Ready to commit to docs/ directory
```

### 10.3: Next Steps Guidance

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

```markdown
**To regenerate handoff backup:**

```
/create-handoff-backup [artifact-name]
```

This will:
- Rescan all documentation
- Update file inventory
- Refresh issue status
- Regenerate all three core docs
- Preserve existing content where possible
```

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

## Best Practices

1. **Be Honest:** Accurately represent Git/deployment status
2. **Prioritize:** Focus on what's most important
3. **Link Everything:** Make navigation easy
4. **Test Links:** Verify all file references work
5. **Update Dates:** Keep "Last Updated" current
6. **Assume Zero Knowledge:** Write for someone who knows nothing
7. **Provide Context:** Explain why things are the way they are
8. **Show Next Steps:** Always clear what to do next

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
- [ ] All files are discoverable via documentation-map
- [ ] Visual-file-map matches actual structure
- [ ] Git status is accurately represented
- [ ] Next steps are crystal clear
- [ ] All critical issues are documented
- [ ] Test cases are provided
- [ ] Links work correctly
- [ ] Files are downloadable
- [ ] Package is Git-ready

---

**Created:** January 8, 2026  
**Version:** 1.0  
**Usage:** Type `/create-handoff-backup` when transitioning project or approaching context limits  
**Output:** 3 core docs + consolidated supporting documentation (10-15 files total)
