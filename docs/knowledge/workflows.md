# Workflow Quick References

**Last Updated:** 2026-01-02
**Entries:** 6

---

## Quick Navigation

- [Memory System Workflow](#memory-system-workflow) - Find, create, preserve knowledge
- [Skills Installation](#skills-installation) - Set up Claude Code skills
- [Lesson Creation](#lesson-creation) - Document problem-solving
- [ADR Creation](#adr-creation) - Formalize decisions
- [Patch Workflow](#patch-workflow) - Bug fixes and improvements
- [Session Summary](#session-summary) - Preserve context before limits

---

## Core Workflows

### Memory System Workflow

**Purpose:** Find existing knowledge, create new knowledge, preserve context

**Quick Steps:**
1. **Search first:** `/recall <topic>` to find existing solutions
2. **Found?** Apply and continue
3. **New solution?** Document with `/lesson-learned`
4. **Architectural decision?** Create ADR in `docs/decisions/`
5. **Before context limit (~180K tokens):** Run `/session-summary`

**See:** [Memory System Lesson](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

### Skills Installation

**Purpose:** Install Claude Code skills for first-time use or updates

**Quick Steps:**
```bash
# One-time setup (new team member)
1. Clone repository
2. cp .claude/skills/*.md ~/.claude/commands/
3. Restart Claude Code
4. Test skills with /skill-name

# After skill updates
1. Edit .claude/skills/skill-name.md (project copy)
2. git commit changes
3. cp .claude/skills/skill-name.md ~/.claude/commands/
4. Restart Claude Code
```

**Why restart?** Skills load at startup only, not dynamically

**See:** [ADR-002: Skills Global-Only](../decisions/ADR-002-skills-global-only.md)

---

## Documentation Workflows

### Lesson Creation

**Purpose:** Document complex problem-solving journeys

**Quick Steps:**
```bash
1. /lesson-learned
2. Describe problem and solution
3. Skill auto-detects category (architecture/debugging/process/patterns)
4. Confirm category
5. Skill creates lesson in appropriate subdirectory
6. Skill updates master index
```

**When to use:**
- After solving non-trivial problem
- Discovering surprising behavior
- Complex troubleshooting journey
- Pattern worth replicating

**See:** `/lesson-learned` skill (v1.2 with auto-categorization)

---

### ADR Creation

**Purpose:** Formalize significant architectural decisions

**Quick Steps:**
```bash
# Manual process:
1. Identify decision number (next in sequence)
2. cp docs/decisions/template.md docs/decisions/ADR-NNN-title.md
3. Fill in sections:
   - Context and Problem
   - Decision Drivers
   - Considered Options
   - Decision Outcome
   - Consequences
4. Link to related lessons/ADRs
5. git add and commit
6. Update docs/decisions/README.md
```

**When to use:**
- Before making significant architectural choice
- To formalize decision from lesson learned
- Choosing between technologies/patterns
- Decision affects multiple parts of system

**See:** [ADR Template](../decisions/template.md), [ADR-001](../decisions/ADR-001-dual-format-documentation.md)

---

### Session Summary

**Purpose:** Auto-document work session before context limits

**Quick Steps:**
```bash
1. /session-summary
2. Skill analyzes chat context
3. Extracts: built, decided, solved, learned
4. Auto-detects session type (feature/bugfix/planning/etc.)
5. Confirms with user
6. Creates summary in docs/sessions/YYYY-MM/
7. Updates session index
```

**When to use:**
- Token usage approaching 180K
- After completing major feature
- End of debugging session
- When switching between unrelated tasks

**See:** `/session-summary` skill

---

## Development Workflows

### Patch Workflow

**Purpose:** Structured approach to bug fixes and improvements

**Quick Steps:**
```bash
1. Identify issue
2. Analyze (don't jump to implementation)
3. Plan approach
4. Implement fix
5. Test
6. Commit with semantic version (PATCH)
7. Optional: /lesson-learned if complex
```

**Anti-pattern:** Jumping to implementation before understanding root cause

**See:** [Lesson: Patch Workflow](../lessons-learned/process/Lessons_Learned_Patch_Workflow.md)

---

## Content Update Workflows

### Surgical Updates

**Purpose:** Update content while preserving existing quality

**Quick Steps:**
```bash
# Using /update-history skill:
1. /update-history <file>
2. Skill analyzes chat for requested changes
3. Lists surgical updates for confirmation
4. Determines version increment (MAJOR/MINOR/PATCH)
5. Copies v7.txt → v7.1.txt
6. Applies surgical updates only (preserves 80%+)
7. Validates preservation rate
8. Generates markdown version
```

**Principles:**
- ✅ Add new content, enhance existing, update specific metrics
- ❌ Don't rewrite sections, don't lose existing detail

**See:** [ADR-003: Surgical Updates](../decisions/ADR-003-surgical-updates-pattern.md), `/update-history` skill

---

## Quick Command Reference

```bash
# Search & Find
/recall <topic>                    # Search all memory systems
/recall <topic> --type=lessons     # Search just lessons
/recall <topic> --format=paths     # Get file paths only

# Create Documentation
/lesson-learned                    # Create categorized lesson
/session-summary                   # Auto-document session

# Update Content
/update-history <file>             # Surgical content updates

# Version Control
git status                         # Check uncommitted changes
git add docs/                      # Stage documentation
git commit -m "docs: ..."          # Commit with semantic type

# Skills Management
cp .claude/skills/*.md ~/.claude/commands/   # Install skills
# Restart Claude Code after skill changes
```

---

**Maintenance:** Update workflows as processes evolve
**Created:** 2026-01-02
