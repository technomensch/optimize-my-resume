# ADR-002: Skills Must Be Global-Only

**Status:** Accepted
**Date:** 2026-01-02 (formalized from 2025-12-29 discovery)
**Deciders:** technomensch
**Tags:** #architecture #skills #claude-code #global-directory #workflow

**Related:**
- **Supersedes:** None (architectural constraint from Claude Code)
- **Superseded by:** N/A
- **Related Lessons:** [Claude Code Skills Architecture](../lessons-learned/architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md), [Skills Not Loading Until Restart](../lessons-learned/debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)
- **Related ADRs:** ADR-001 (Dual-Format Documentation)

---

## Context and Problem Statement

Claude Code supports custom "skills" - markdown files that define reusable prompts and workflows accessible via slash commands (e.g., `/doc-update`, `/lesson-learned`). During v5.1.0 development, we attempted to use project-local skills stored in `.claude/skills/` but discovered they were not loading in Claude Code.

**The Problem:**
- Skills placed in `.claude/skills/` (project directory) do not appear in Claude Code
- Only skills in `~/.claude/commands/` (global user directory) are recognized
- This differs from typical project-based tooling expectations (like npm scripts, VS Code extensions per workspace)
- Unclear where to store skills for version control and team sharing

**Key Question:**
Should we try to work around this constraint, lobby for project-local support, or embrace the global-only architecture?

---

## Decision Drivers

1. **Claude Code Architecture** - Fundamental design decision outside our control
2. **User Experience** - Skills available across ALL projects (global scope)
3. **Team Collaboration** - How to share skills when they're global-only
4. **Maintenance** - Avoiding duplication between global and project copies
5. **Onboarding** - New team members need to install skills manually
6. **Version Control** - Want skills tracked in repository for documentation

---

## Considered Options

### Option 1: Use Global Directory Only (No Project Copy)
**Approach:** Install all skills to `~/.claude/commands/`, don't track in project repo

**Pros:**
- Clean project structure (no skill files)
- Single source of truth (global only)
- No synchronization issues
- Simpler mental model

**Cons:**
- Skills not versioned with project
- Team members must install manually
- No documentation of available skills in repo
- Hard to discover what skills exist for project
- Can't track skill changes over time

---

### Option 2: Project-Local Only (Lobby for Feature)
**Approach:** Request Claude Code support project-local `.claude/skills/`

**Pros:**
- Natural project-scoping
- Skills versioned with code
- Team gets skills automatically on clone
- Project-specific customization

**Cons:**
- Feature doesn't exist (would need to wait)
- May never be implemented (architectural decision)
- Current workarounds would be complex
- Not in our control

---

### Option 3: Global Execution + Project Reference (Hybrid)
**Approach:** Install skills globally for execution, keep reference copies in project for version control

**Pros:**
- Skills work (in global directory)
- Skills documented (in project repo)
- Version controlled (track changes)
- Team can discover available skills
- Can sync global from project when needed

**Cons:**
- Two copies of each skill (sync risk)
- Manual installation required for team
- More complex mental model
- Need clear documentation of pattern

---

### Option 4: Git Hooks Auto-Sync
**Approach:** Use git hooks to auto-sync `.claude/skills/` → `~/.claude/commands/`

**Pros:**
- Automatic synchronization
- Skills always up-to-date
- Version controlled
- Team benefits on pull

**Cons:**
- Git hook complexity
- Surprising behavior (auto-copying files)
- Cross-platform compatibility issues
- May interfere with user's global skills

---

## Decision Outcome

**Chosen option:** **"Option 3: Global Execution + Project Reference (Hybrid)"**

**Rationale:**

We accept Claude Code's global-only architecture and work WITH it, not against it:

### Implementation Pattern

**Global Directory (Execution):**
```bash
~/.claude/commands/
├── doc-update.md          # Active, used by Claude Code
├── lesson-learned.md      # Active, used by Claude Code
├── patch.md               # Active, used by Claude Code
└── session-summary.md     # Active, used by Claude Code
```

**Project Directory (Reference & Documentation):**
```bash
.claude/skills/
├── doc-update.md          # Reference copy for version control
├── lesson-learned.md      # Reference copy for version control
├── patch.md               # Reference copy for version control
├── session-summary.md     # Reference copy for version control
└── README.md              # Installation instructions
```

### Clear Separation of Concerns

**Purpose of `~/.claude/commands/` (Global):**
- Execution - Claude Code loads skills from here
- User-level - Available across all projects
- Permanent - Installed once, works everywhere

**Purpose of `.claude/skills/` (Project):**
- Documentation - Shows what skills are available
- Version Control - Track skill changes over time
- Distribution - Team can see and copy skills
- Reference - Not executed directly

---

## Consequences

### Positive

✅ **Skills Work** - Installed in global directory where Claude Code expects them
✅ **Version Controlled** - Project reference copies tracked in git
✅ **Discoverable** - New team members can see what skills exist
✅ **Documented** - Installation instructions in project README
✅ **Flexible** - Can update global skills independently of project

### Negative

⚠️ **Manual Installation** - Team must copy skills to global directory
⚠️ **Sync Risk** - Two copies can drift out of sync
⚠️ **Duplication** - Same content in two locations
⚠️ **Complexity** - Need to understand global vs. project distinction

### Neutral

🔵 **User-Level Sharing** - Skills shared across projects (could be pro or con)
🔵 **Global Namespace** - All skills in one directory (need unique names)

---

## Implementation Guidelines

### Installation (New Team Member)

When cloning the repository:

```bash
# 1. Clone repository
git clone <repo-url>
cd <repo>

# 2. Install skills globally (one-time setup)
cp .claude/skills/*.md ~/.claude/commands/

# 3. Restart Claude Code to load skills
# (Skills load at startup only)

# 4. Verify installation
ls ~/.claude/commands/
```

### Updating Skills

When modifying a skill:

```bash
# 1. Edit the project reference copy (source of truth)
vim .claude/skills/doc-update.md

# 2. Commit changes
git add .claude/skills/doc-update.md
git commit -m "feat(skills): enhance doc-update skill"

# 3. Sync to global directory
cp .claude/skills/doc-update.md ~/.claude/commands/

# 4. Restart Claude Code to reload
# (Skills load at startup only - see ADR-XXX)
```

### Creating New Skills

When adding a new skill:

```bash
# 1. Create in project directory first (for version control)
touch .claude/skills/new-skill.md
vim .claude/skills/new-skill.md

# 2. Test by copying to global
cp .claude/skills/new-skill.md ~/.claude/commands/

# 3. Restart Claude Code

# 4. Once working, commit project copy
git add .claude/skills/new-skill.md
git commit -m "feat(skills): add new-skill command"
```

### Project README Template

Add to project README:

```markdown
## Skills Installation

This project includes custom Claude Code skills in `.claude/skills/`.

**One-time setup:**
\```bash
cp .claude/skills/*.md ~/.claude/commands/
\```

**After updating skills:**
\```bash
cp .claude/skills/<skill-name>.md ~/.claude/commands/
# Restart Claude Code
\```

**Available skills:**
- `/doc-update` - Documentation update protocol
- `/lesson-learned` - Create lessons learned documents
- `/patch` - Guided patch workflow
```

---

## Validation

**How we'll know this decision is working:**
1. ✅ All team members can use skills after one-time installation
2. ✅ Skills appear in Claude Code slash command dropdown
3. ✅ Project documentation clearly shows available skills
4. ✅ Skill updates propagate to team via git pull + manual sync
5. ✅ No confusion about where to edit skills (project copy is source)

**When to revisit:**
- If Claude Code adds project-local skill support
- If synchronization becomes major pain point (>10% of issues)
- If team grows beyond 5 people (installation overhead increases)

---

## Migration Steps

From old pattern (project-local only) to new pattern:

```bash
# 1. Identify existing project skills
ls .claude/skills/

# 2. Install to global directory
mkdir -p ~/.claude/commands
cp .claude/skills/*.md ~/.claude/commands/

# 3. Keep project copies for reference
# (No deletion needed - they serve as documentation)

# 4. Add installation instructions to README
vim README.md

# 5. Restart Claude Code
```

---

## Alternative Implementations

### Auto-Sync Script (Optional)

For teams that want semi-automated syncing:

```bash
#!/bin/bash
# scripts/sync-skills.sh
# Copies .claude/skills/ to ~/.claude/commands/

cp .claude/skills/*.md ~/.claude/commands/
echo "✅ Skills synced to ~/.claude/commands/"
echo "⚠️  Restart Claude Code to load changes"
```

Usage:
```bash
./scripts/sync-skills.sh
```

**Note:** Manual restart still required (skills load at startup only).

---

## Examples

### Good: Clear Installation Docs
```markdown
## Skills Setup

**Install once:**
\```bash
cp .claude/skills/*.md ~/.claude/commands/
\```

**After this:**
1. Restart Claude Code
2. Type `/` to see available skills
3. Use `/doc-update`, `/lesson-learned`, etc.
```

### Good: Update Workflow
```
1. Edit: .claude/skills/doc-update.md
2. Commit: git add + git commit
3. Sync: cp .claude/skills/doc-update.md ~/.claude/commands/
4. Restart Claude Code
```

### Avoid: Confusing Pattern
```markdown
❌ Skills are in .claude/skills/ and will work automatically
```
This is misleading - they must be copied to global directory.

---

## Related Decisions

- **ADR-001:** Dual-Format Documentation Strategy
- **ADR-003:** Surgical Updates Pattern (to be created)
- **Future ADR:** Skills Loading Behavior (startup-only, no hot-reload)

---

**Decision Date:** 2026-01-02
**Discovery Date:** 2025-12-29
**Implementation Date:** 2025-12-29 (applied retroactively)
**Last Reviewed:** 2026-01-02
**Next Review:** 2026-07-02 (6 months, or when Claude Code updates)
