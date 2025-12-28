# Lessons Learned: Claude Code Skills Architecture

**Date:** 2025-12-28
**Context:** v5.1.0 development - Adding remote work classification feature
**Problem Solved:** Skills not appearing in Claude Code slash command dropdown despite existing in project

---

## The Problem We Faced

During the v5.1.0 feature development, we attempted to use the `/doc-update` skill to run the documentation update protocol after implementing remote work classification logic. However, the skill did not appear in the slash command dropdown.

**Issues Discovered:**
- `/doc-update`, `/lesson-learned`, and `/patch` skills were not appearing in dropdown
- Skills existed in `.claude/skills/` directory with proper `.md` formatting
- Only `/chat-history` skill was working
- Restarting Claude Code did not resolve the issue
- File encoding appeared normal (UTF-8) with no hidden characters

**Impact:**
- Workflow automation was blocked - had to run documentation updates manually
- Wasted 30+ minutes troubleshooting file formatting, permissions, and restarts
- Created confusion about where skills should be stored
- Duplicate skill files in two locations causing maintenance burden

**Why This Matters:**
- Skills are fundamental to Claude Code workflow automation
- Template repositories need correct skill setup guidance
- Team onboarding requires understanding skill architecture
- Documentation update protocol depends on `/doc-update` skill availability

---

## What We Learned: Skills Are Global, Not Project-Specific

### The Core Insight

**Claude Code loads skills exclusively from `~/.claude/commands/` (global user directory), NOT from `.claude/skills/` (project directory).**

This is a fundamental architectural decision that differs from how many developers might intuitively expect project-specific tooling to work. Skills are treated as user-level commands available across all projects, similar to global npm packages or system-wide CLI tools.

**The Solution:**
Skills must be installed to the global `~/.claude/commands/` directory to be recognized by Claude Code. Project-level `.claude/skills/` directories are not scanned or loaded.

---

## The Solution: Global Skills Installation

### Layer 1: Identify Skill Files

Skills are markdown files (`.md` extension) that define reusable prompts and workflows.

**Location misconception:**
```bash
# ❌ This does NOT work - skills won't load
.claude/skills/doc-update.md
.claude/skills/lesson-learned.md
```

**Correct location:**
```bash
# ✅ This DOES work - skills load on startup
~/.claude/commands/doc-update.md
~/.claude/commands/lesson-learned.md
```

### Layer 2: Copy Skills to Global Directory

One-time installation command:

```bash
# Copy all skills to global directory
cp .claude/skills/*.md ~/.claude/commands/

# Verify installation
ls -l ~/.claude/commands/
```

**Expected output:**
```
-rw-------  1 user  staff   6740 Dec 28 14:07 chat-history.md
-rw-r--r--  1 user  staff   3198 Dec 28 14:07 doc-update.md
-rw-r--r--  1 user  staff  10701 Dec 28 14:07 lesson-learned.md
-rw-r--r--  1 user  staff   1575 Dec 28 14:07 patch.md
```

### Layer 3: Remove Project-Level Duplication

Since skills are global-only, maintaining project-level copies creates unnecessary duplication:

```bash
# Remove project-level skills directory
rm -rf .claude/skills/

# Verify it's gone
ls -la .claude/
```

**Result:** Cleaner project structure, single source of truth for skills.

### Layer 4: Restart Claude Code

After installing skills to `~/.claude/commands/`, restart Claude Code to load them:

```bash
# In Claude Code terminal
/exit

# Restart Claude Code application
```

**Test:** Start typing `/doc` in the chat input - the dropdown should now show `/doc-update`.

---

## Implementation Results

### Problems Fixed

- ✅ All 4 skills now appear in slash command dropdown
- ✅ `/doc-update` skill successfully invokes documentation update protocol
- ✅ Skills available across ALL projects (not just this one)
- ✅ Eliminated duplicate files and maintenance burden
- ✅ Cleaner project directory structure

### Metrics of Success

**Before:**
- ❌ 0/4 custom skills working (only chat-history from global directory)
- ❌ `.claude/skills/` directory with ~22KB of duplicate files
- ❌ Skills had to be run manually by reading and following markdown files
- ❌ Documentation update protocol required 10+ manual steps

**After:**
- ✅ 4/4 skills working globally across all projects
- ✅ Zero duplication - single source in `~/.claude/commands/`
- ✅ Skills invocable with simple `/skill-name` command
- ✅ Documentation updates automated via `/doc-update` workflow

---

## Root Cause Analysis

### Why Did These Issues Happen?

**1. Incorrect Mental Model of Skill Scope**
- **Problem:** Assumed skills were project-specific like `.vscode/settings.json` or `.eslintrc`
- **Why it happened:** Many development tools use project-level configuration directories
- **Reality:** Claude Code treats skills as user-level commands, similar to global CLI tools

**2. Misleading Directory Name**
- **Problem:** `.claude/skills/` directory existed in project but was never scanned
- **Why it happened:** The directory name suggests it's a valid location for skills
- **Reality:** Only `~/.claude/commands/` is scanned; project-level directories are ignored

**3. Chat-History False Positive**
- **Problem:** `chat-history` skill worked, suggesting project-level skills were valid
- **Why it happened:** `chat-history.md` existed in BOTH `.claude/skills/` AND `~/.claude/commands/`
- **Reality:** It was working because of the global copy, not the project copy

### How Global Skills Prevent Each Issue

**Issue 1: Skills not appearing in dropdown**
- **Solution:** Global directory is scanned on Claude Code startup
- **Result:** All skills in `~/.claude/commands/` automatically available

**Issue 2: Confusion about skill location**
- **Solution:** Single source of truth - only one valid location
- **Result:** Clear mental model - skills are global like CLI tools

**Issue 3: Maintenance burden of duplicates**
- **Solution:** Global skills shared across all projects
- **Result:** Update once in `~/.claude/commands/`, use everywhere

---

## Replication Pattern for Any Project

### Generic Skills Installation Structure

**For individual developers:**
```bash
#!/bin/bash
# install-skills.sh - Install Claude Code skills globally

# Copy all skills to global commands directory
cp .claude/skills/*.md ~/.claude/commands/

echo "✅ Skills installed to ~/.claude/commands/"
echo "📝 Restart Claude Code for skills to load"
echo ""
echo "Installed skills:"
ls ~/.claude/commands/*.md | xargs -n 1 basename
```

**For template repositories:**
```markdown
## Claude Code Skills Setup

This project includes workflow automation skills for Claude Code.

### Installation

After cloning this repository, install the skills globally:

```bash
cp .claude/skills/*.md ~/.claude/commands/
```

Restart Claude Code to load the new skills.

### Available Skills

- `/doc-update` - Run documentation update protocol
- `/lesson-learned` - Create lessons learned documents
- `/patch` - Create patch files for changes
- `/chat-history` - Export chat history to archive

### Note

Skills are installed globally (`~/.claude/commands/`) and will be available
in all your Claude Code projects, not just this one.
```

### Key Design Decisions

- **Global vs Project-Level:** Skills are installed globally because they represent reusable workflows, not project-specific configuration
- **Manual Installation:** Skills require manual copy to global directory (not automatic) to give users control
- **Template Distribution:** Project templates can include skills in `.claude/skills/` for documentation and sharing, but users must copy them to `~/.claude/commands/`
- **Single Source of Truth:** Remove project-level skills after installation to eliminate confusion

---

## How to Implement in Your Project

### Step 1: Create or Identify Skills

If you have existing skills in `.claude/skills/`, verify they're valid:

```bash
# Check for skill files
ls -l .claude/skills/*.md

# Verify they're markdown files with proper headers
head -5 .claude/skills/doc-update.md
```

Expected format:
```markdown
# Skill Name

**Purpose:** Description of what this skill does

## Instructions for Assistant
[Commands and workflow]
```

### Step 2: Install Skills Globally

```bash
# Copy all skills to global directory
cp .claude/skills/*.md ~/.claude/commands/

# Verify installation
ls -l ~/.claude/commands/
```

### Step 3: Remove Project-Level Duplication

```bash
# Delete project-level skills directory
rm -rf .claude/skills/

# Stage the deletion
git add .claude/skills/

# Commit the cleanup
git commit -m "chore: remove project-level skills (now global-only)"
```

### Step 4: Document in Project README

Add to your project's README or setup documentation:

```markdown
## Skills Installation

This project uses Claude Code skills for workflow automation.
Install them globally after cloning:

```bash
# If skills are still in the repo for reference:
cp .claude/skills/*.md ~/.claude/commands/

# Or download from releases/template
```

Restart Claude Code to load the skills.
```

### Step 5: Update Template Repository (If Applicable)

If you maintain a template repo that others will clone:

**Option A: Include skills for distribution, document installation**
- Keep `.claude/skills/` in template
- Add installation instructions to README
- Include note that skills must be copied to `~/.claude/commands/`

**Option B: Don't include skills, document separately**
- Remove `.claude/skills/` from template
- Document recommended skills in README with installation links
- Let users install skills based on their needs

---

## Lessons for Future Features

### **Lesson 1: Understand Tool Architecture Before Debugging**

**Pattern:** When a feature doesn't work, understand the tool's architecture first before debugging implementation details.

**Application:** We initially debugged file encoding, permissions, and formatting before understanding that Claude Code's skill loading mechanism only scans `~/.claude/commands/`.

**Result:** 30 minutes spent on wrong debugging path. Should have checked documentation or tool architecture first.

### **Lesson 2: False Positives Can Mislead Troubleshooting**

**Pattern:** When one item works and others don't, investigate why the working item is different, not just why others fail.

**Application:** `chat-history` skill worked, but we didn't immediately investigate why. It turned out to exist in BOTH locations, creating a false positive that project-level skills were valid.

**Result:** Delayed discovery of root cause. Should have compared working vs non-working items earlier.

### **Lesson 3: Global Tools Simplify Multi-Project Workflows**

**Pattern:** Reusable workflow automation should be global, not project-specific.

**Application:** Documentation update protocols, lessons learned creation, and chat history exports are useful across ALL projects, not just one.

**Result:** Installing skills globally makes them immediately available in all current and future projects.

---

## Common Pitfalls to Avoid

### Pitfall 1: Assuming Project-Level Configuration

**Problem:** Creating `.claude/skills/` directory expecting skills to load automatically.

**Solution:** Always install skills to `~/.claude/commands/` (global directory). Project-level directories are not scanned.

### Pitfall 2: Not Restarting Claude Code After Installation

**Problem:** Installing skills but not restarting, leading to belief that installation failed.

**Solution:** Always restart Claude Code (`/exit` and relaunch) after adding new skills to `~/.claude/commands/`.

### Pitfall 3: Maintaining Duplicate Copies

**Problem:** Keeping skills in both `.claude/skills/` (project) and `~/.claude/commands/` (global), leading to sync issues.

**Solution:** Remove project-level copies after installation. Use global directory as single source of truth.

### Pitfall 4: Forgetting to Install Skills on New Machines

**Problem:** Skills work on one machine but not another because global directory isn't synced.

**Solution:** Document skill installation in project README. Consider creating an installation script for team members.

---

## Questions This Solves for Future Developers

**Q: "Why aren't my skills appearing in the Claude Code dropdown?"**
A: Skills must be in `~/.claude/commands/` (global), not `.claude/skills/` (project). Copy your skills to the global directory and restart Claude Code.

**Q: "Should I commit `.claude/skills/` to my repository?"**
A: Only if you're using it as a template/distribution mechanism. Document that users must copy to `~/.claude/commands/` after cloning. Otherwise, delete it to avoid confusion.

**Q: "Do I need to install skills for every project?"**
A: No! Skills in `~/.claude/commands/` are global and available across ALL projects automatically.

**Q: "One of my skills works but others don't - why?"**
A: Check if the working skill exists in BOTH `.claude/skills/` AND `~/.claude/commands/`. It's probably loading from the global directory. Copy the non-working skills to `~/.claude/commands/`.

**Q: "How do I share skills with my team?"**
A: Include them in a template repository's `.claude/skills/` directory with README instructions to copy to `~/.claude/commands/`. Or create a shared installation script.

**Q: "Can I have project-specific skills?"**
A: Not currently. All skills must be in the global `~/.claude/commands/` directory. If you need project-specific automation, use bash scripts or other mechanisms.

---

## Conclusion

**What we built:** A clear understanding of Claude Code's skills architecture and proper installation workflow.

**Why it matters:** Skills enable workflow automation that saves hours of manual work. Incorrect installation blocks access to essential productivity features.

**How it's retained:**
- Skills now correctly installed in `~/.claude/commands/`
- Project-level duplication removed
- Documentation created for future reference
- Template repository pattern established

**How to replicate:**
```bash
# One-time installation
cp .claude/skills/*.md ~/.claude/commands/
rm -rf .claude/skills/
# Restart Claude Code
```

---

**Key Takeaway:**
*Claude Code skills are global user commands (like npm globals), not project-specific configuration (like .vscode settings). Install to `~/.claude/commands/`, not `.claude/skills/`.*

---

**Created:** 2025-12-28
**Version:** 1.0

**Related Docs:**
- `.claude/commands/doc-update.md` - Documentation update protocol skill
- `.claude/commands/lesson-learned.md` - This skill that created this document
- `docs/prompts/dev/Update_Doc_Prompt.md` - Full documentation update protocol

**Related Commits:**
- `103480b` - feat: add remote work classification (removed .claude/skills/ directory)

**Related Issues Solved:**
- Skills not appearing in slash command dropdown
- Documentation update workflow blocked
- Duplicate skill files maintenance burden
- Team onboarding confusion about skill installation
