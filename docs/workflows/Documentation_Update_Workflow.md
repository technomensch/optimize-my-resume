# Documentation Update Workflow

## Version History
- v1.0: Initial creation - Standard documentation update process (2025-12-10)

---

## Purpose

This workflow defines the standard process for updating project documentation after implementing features, fixing bugs, or making significant changes to the codebase.

---

## When to Use This Workflow

Run this workflow whenever you:
- ✅ Complete a feature implementation
- ✅ Make significant code changes
- ✅ Update AI prompts or system behavior
- ✅ Add new tools or scripts
- ✅ Change the project structure
- ✅ Fix important bugs that affect documentation

---

## Quick Start

### In Claude Code CLI:
```bash
/doc-update
```

This loads the full Documentation Update Protocol and guides you through the process interactively.

---

## The 7-Step Process

### Step 1: Identify Targets

Determine which documentation files need updates:

**Core Documentation:**
- `docs/prompts/sys/System_Prompt.md` - Backend logic, rules, prompts
- `docs/prompts/sys/UI_Prompt.md` - Frontend flow, visuals, state
- `docs/prompts/analyzer/Resume_Analyzer_Prompt.md` - Standalone analysis
- `docs/prompts/comparative/JD_Comparative_Prompt.md` - JD comparison
- `docs/prompts/sys/App_Gen_Prompt.md` - Build, install, config

**Project Documentation:**
- `docs/ROADMAP.md` - Project status, milestones
- `docs/plans/*.md` - Implementation plans
- `docs/CHANGELOG.md` - User-facing changes
- `docs/CHANGELOG_DEV.md` - Developer experience changes
- `README.md` - Project overview and version

**Tip:** If unsure, the `/doc-update` command will help you identify what needs updating.

---

### Step 2: User Verification (INTERACTIVE)

**Before making ANY changes**, propose your update plan:

```
Based on the [feature/fix/change], I propose updating:
- [Document 1]: [What will change]
- [Document 2]: [What will change]
- [Document 3]: [What will change]

Are these the correct documents? Should any be added or removed?
```

**Wait for user confirmation** before proceeding.

---

### Step 3: Version Strategy (INTERACTIVE)

For each document, determine the version bump:

**Minor Version (x.x.1):**
- Small clarifications or additions
- Bug fixes
- Minor feature additions
- Example: v3.10.0 → v3.10.1

**Major Version (x.1.0):**
- New major features
- Significant behavior changes
- Architectural updates
- Example: v3.10.1 → v3.11.0

Ask the user:
```
Should the update for [Document] be:
1. Minor (x.x.1) - Small changes, clarifications
2. Major (x.1.0) - Significant new features or behavior changes
```

---

### Step 4: Apply Updates

Update each document following these rules:

#### Rule 1: Version History Entry

At the top of the document, add:
```markdown
## Version History
- v[NewVersion]: [Brief description of changes]
- v[OldVersion]: [Previous entry]
```

#### Rule 2: Inline Comments

At every changed location, add a comment:
```markdown
New text or modified section. <!-- v[X.Y] Change: Description -->
```

For code files:
```javascript
// v[X.Y] Change: Description
function newFunction() { ... }
```

#### Rule 3: Code File Headers

For HTML/JS/TS/CSS files, update the header:
```html
<!--
Version History:
v[New]: [Change description]
v[Old]: [Previous description]
-->
```

#### Rule 4: Version History Consolidation

When reaching a major version milestone (e.g., v4.0), consolidate previous minor versions:
```markdown
v3.x: Summary (v3.0-v3.17)
      - Feature 1
      - Feature 2
v4.0: Major Update - Complete Refactor
      - New architecture
      - Breaking changes
```

---

### Step 5: Test-First Validation

**For code changes only:**

1. **Implement First** - Apply changes to application code
2. **User Tests** - User verifies functionality in preview environment
3. **Doc Update** - Only after validation, update documentation to match reality

**Skip this step for documentation-only updates.**

---

### Step 5.5: Branch Prompt Testing

**For significant AI prompt changes only:**

#### When to Use Branch Prompts:
- ✅ Adding new prompt features
- ✅ Major restructuring of prompt logic
- ✅ Behavioral changes that need validation
- ✅ Complex multi-section updates

#### When NOT to Use:
- ❌ Typo fixes or minor clarifications
- ❌ Version history updates
- ❌ Adding simple examples
- ❌ Documentation-only changes

#### Workflow:

**1. Create Temporary Branch Prompt:**
```bash
cp docs/prompts/analyzer/Resume_Analyzer_Prompt.md \
   docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
```

**2. Add Testing Header:**
```markdown
# Resume Analyzer Prompt v1.3 [TESTING]

⚠️ **TESTING VERSION - NOT FOR PRODUCTION**
- Status: Under development and testing
- Branch: v4.6-export-feature
- Baseline: Resume_Analyzer_Prompt.md v1.2
- Changes: Added export functionality
- Test Plan: docs/plans/v4.6_export_feature_plan.md
```

**3. Implement & Test:**
- Make all changes in tmp version only
- Test thoroughly against implementation plan
- Iterate and refine

**4. Merge to Stable:**
```bash
cp docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md \
   docs/prompts/analyzer/Resume_Analyzer_Prompt.md
```

**5. Clean Up (CRITICAL):**
```bash
rm docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
ls docs/prompts/tmp/*.md  # Should show: No such file or directory
```

**6. Update Stable Prompt:**
- Remove `[TESTING]` header
- Update version to final
- Commit with "tested and validated" note

---

### Step 6: Roadmap Synchronization

Update `docs/ROADMAP.md`:

**1. Update Reference Documentation Table:**
```markdown
| Document | Version | Last Updated |
|----------|---------|--------------|
| System_Prompt.md | v[New] | 2025-12-10 |
```

**2. Mark Completed Tasks:**
```markdown
- [x] Feature name (v[X.Y])
```

**3. Add Version History Entry:**
```markdown
## Version History
- v1.[X]: Updated for feature implementation
```

---

### Step 7: Git Operations

#### Stage and Commit:

```bash
# Stage all documentation changes
git add docs/ROADMAP.md docs/CHANGELOG.md README.md docs/prompts/

# Commit with structured message
git commit -m "docs(v[X.Y]): [brief description]

- Updated [Document 1] v[Old] → v[New]
- Updated [Document 2] v[Old] → v[New]
- Added [changelog entry/new feature docs/etc]
- Updated ROADMAP reference table

[Additional context if needed]

Ref: docs/plans/v[X.Y]_[feature]_plan.md"
```

#### Verify Version Consistency:

```bash
# Run validation script
./scripts/check-version-consistency.sh
```

Expected output:
```
📄 Prompt version:        v[X.Y]
📋 CHANGELOG latest:      v[X.Y] (user-facing)
🔧 CHANGELOG_DEV latest:  v[X.Y] (developer)
📖 README version:        v[X.Y]

🎯 Highest version: v[X.Y] (from [Source])

✅ Version consistency check PASSED
```

#### Push to Remote:

```bash
# For feature branches
git push origin v[X.Y]-[feature-name]

# For main branch (after merge)
git push origin main
```

---

## Documentation File Decision Tree

```
What did you change?
│
├─ Backend logic/rules/prompts → System_Prompt.md
├─ Frontend UI/flow/state → UI_Prompt.md
├─ Standalone analysis logic → Resume_Analyzer_Prompt.md
├─ JD comparison logic → JD_Comparative_Prompt.md
├─ Build/install/config → App_Gen_Prompt.md
├─ Project status/milestones → ROADMAP.md
├─ Implementation plan → docs/plans/v[X.Y]_[feature]_plan.md
├─ User-facing features → CHANGELOG.md + README.md
└─ Developer tools/process → CHANGELOG_DEV.md
```

---

## Version Numbering Guide

### For Prompts (System, UI, Analyzer, etc.):

**Major (x.1.0):**
- New analysis features
- Significant behavior changes
- New sections or major restructuring
- Breaking changes

**Minor (x.x.1):**
- Clarifications
- Example additions
- Small rule additions
- Bug fixes

### For Project (README, CHANGELOG):

**Major (x.0.0):**
- Complete rewrites
- Major architectural changes
- Breaking API changes

**Minor (x.y.0):**
- New features
- Significant enhancements
- Non-breaking additions

**Patch (x.y.z):**
- Bug fixes
- Documentation improvements
- Small tweaks

---

## Pre-Merge Checklist

Before merging your feature branch:

```bash
# 1. Check for orphaned tmp files
ls docs/prompts/tmp/*.md
# Expected: "No such file or directory" (except README.md)

# 2. Verify version consistency
./scripts/check-version-consistency.sh
# Expected: ✅ PASSED

# 3. Verify all inline comments added
grep -r "<!-- v[0-9]" docs/prompts/
# Should show your version comments

# 4. Verify version history updated
head -20 docs/prompts/sys/System_Prompt.md
# Should show your new version entry

# 5. Verify ROADMAP updated
grep "v[X.Y]" docs/ROADMAP.md
# Should show your version references
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Updating Docs Before Testing
**Problem:** Documentation doesn't match actual behavior

**Solution:** Always implement → test → document (in that order)

### ❌ Mistake 2: Forgetting Inline Comments
**Problem:** Future developers can't see what changed

**Solution:** Add `<!-- vX.Y Change -->` at every modification

### ❌ Mistake 3: Inconsistent Version Numbers
**Problem:** README shows v4.6, CHANGELOG shows v4.5.2

**Solution:** Run `./scripts/check-version-consistency.sh` before committing

### ❌ Mistake 4: Leaving tmp Files
**Problem:** Orphaned testing prompts clutter the directory

**Solution:** Always clean up `docs/prompts/tmp/*.md` before merging

### ❌ Mistake 5: Not Updating ROADMAP
**Problem:** Project status becomes outdated

**Solution:** Always update ROADMAP reference table and mark tasks complete

---

## Related Documentation

- **Full Protocol:** `docs/prompts/dev/Update_Doc_Prompt.md`
- **Version Check Script:** `scripts/check-version-consistency.sh`
- **Plan Mode Workflow:** `docs/workflows/Plan_Mode_Workflow.md`
- **Lessons Learned:** `docs/lessons-learned/`

---

## Quick Reference Commands

```bash
# Load documentation update protocol
/doc-update

# Create lessons learned document
/lesson-learned

# Check version consistency
./scripts/check-version-consistency.sh

# Find all version history entries
grep -r "## Version History" docs/

# Find all inline version comments
grep -r "<!-- v[0-9]" docs/prompts/

# Check for orphaned tmp files
ls docs/prompts/tmp/*.md
```

---

## Changelog

### v1.0 - 2025-12-10
- Initial creation
- Documented 7-step update process
- Added decision trees and checklists
- Integrated with Plan Mode Workflow
- Added pre-merge verification steps

---

**Last Updated:** 2025-12-10
**Status:** Active Workflow
**Related:** `/doc-update` slash command
