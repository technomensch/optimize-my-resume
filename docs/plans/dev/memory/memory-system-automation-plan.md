# Memory System Automation Implementation Plan

**Goal:** Implement semi-automated triggers for the Memory System to reduce manual overhead while preserving user judgment about what to document.

**Date:** 2026-01-03
**Complexity:** Medium (3 automation layers)
**Estimated Scope:** 5 new files, 1 existing file modified

---

## Executive Summary

Based on exploration of Claude Code's hook system, skills architecture, and git infrastructure, this plan implements **three complementary automation layers**:

1. **SessionStart Hook** - Loads project context and suggests memory queries at session start
2. **Git Commit Hook** - Detects significant changes and recommends documentation after commits
3. **Learning Mode Enhancement** - Documents the ★ Insight pattern as a knowledge concept

**Key Constraint:** Skills cannot be programmatically invoked—hooks can only *suggest* actions that Claude executes based on context.

---

## Architecture: Three-Layer Automation

```
┌─────────────────────────────────────────────┐
│  Layer 1: SessionStart Hook                │
│  (Runs when Claude Code starts/resumes)    │
│  • Loads recent commits, branch status     │
│  • Suggests /recall queries                │
│  • Detects if session-summary is due       │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Layer 2: Git Commit Hook                  │
│  (Runs after each git commit)              │
│  • Analyzes commit scope and impact        │
│  • Recommends /lesson-learned for complex  │
│  • Links to related lessons/ADRs           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Layer 3: Learning Mode Pattern            │
│  (Documents ★ Insight pattern)             │
│  • Captures hook-based learning approach   │
│  • Explains SessionStart customization     │
│  • Provides template for other projects    │
└─────────────────────────────────────────────┘
```

---

## Critical Files to Modify/Create

### New Files (5)

1. **`hooks/hooks.json`** (new, committed)
   - SessionStart hook configuration
   - Points to hook script

2. **`hooks/session-start-memory.sh`** (new, committed)
   - Bash script to load project context
   - Suggest /recall queries based on git state
   - Detect if session-summary needed

3. **`hooks/post-commit.template`** (new, committed)
   - Analyze commit for documentation triggers
   - Suggest /lesson-learned for keyword matches
   - Link to related memory entries

4. **`hooks/install-hooks.sh`** (new, committed)
   - Install script for git hooks
   - Copies templates to .git/hooks/

5. **`docs/lessons-learned/process/Lessons_Learned_SessionStart_Automation.md`** (new)
   - Comprehensive lesson about implementing automation
   - Replication pattern for other projects
   - Trade-offs and constraints

### Modified Files (1)

1. **`docs/knowledge/concepts.md`** (update existing)
   - Add "Learning Mode (★ Insight)" concept
   - Document SessionStart hook pattern
   - Explain hook-based customization

---

## Layer 1: SessionStart Hook

### Purpose
Load project context at session start and suggest memory system queries to Claude.

### Implementation

**File:** `hooks/hooks.json` (committed to repo for team distribution)
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "hooks/session-start-memory.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

**Why hooks.json:**
- Committed to repository → All team members get the hook
- Version controlled → Changes tracked in git
- Consistent experience → Everyone sees the same memory context

**File:** `hooks/session-start-memory.sh` (755 permissions)
```bash
#!/bin/bash
# SessionStart hook for Memory System integration
# Loads project context and suggests memory queries

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" || exit 1

# Detect session context
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log -1 --pretty=format:'%h - %s (%cr)' 2>/dev/null || echo "No commits")
UNCOMMITTED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')

# Check if recent work warrants documentation
RECENT_COMMITS=$(git log --since="1 week ago" --oneline 2>/dev/null | wc -l | tr -d ' ')
LESSONS_COUNT=$(find docs/lessons-learned -name "*.md" -not -name "README.md" 2>/dev/null | wc -l | tr -d ' ')

# Build context message
cat <<EOF
## Memory System Context

**Current Branch:** $CURRENT_BRANCH
**Last Commit:** $LAST_COMMIT
**Uncommitted Changes:** $UNCOMMITTED files
**Recent Activity:** $RECENT_COMMITS commits (past week)
**Lessons Captured:** $LESSONS_COUNT lessons

### Suggested Memory Queries

EOF

# Suggest /recall based on branch name
if [[ "$CURRENT_BRANCH" == *"memory"* ]]; then
    echo "- \`/recall memory system\` - Review memory architecture"
elif [[ "$CURRENT_BRANCH" == *"feature"* ]]; then
    echo "- \`/recall patterns\` - Check implementation patterns"
elif [[ "$CURRENT_BRANCH" == *"fix"* ]]; then
    echo "- \`/recall debugging\` - Review debugging lessons"
fi

# Suggest session-summary if lots of recent work
if [ "$RECENT_COMMITS" -gt 10 ]; then
    echo ""
    echo "⚠️ **$RECENT_COMMITS commits in past week** - Consider \`/session-summary\` to preserve context"
fi

# Link to uncommitted changes
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo ""
    echo "📝 **$UNCOMMITTED uncommitted files** - Document changes with \`/lesson-learned\` after commit"
fi

exit 0
```

**What This Hook Does:**
- Loads git status and recent activity
- Suggests `/recall` queries based on branch name pattern
- Recommends `/session-summary` if high commit activity
- Alerts about uncommitted work worth documenting
- Outputs to stdout (visible in Claude's context)

**What It Cannot Do:**
- Execute `/recall` or `/session-summary` automatically
- Force Claude to take actions
- Display interactive prompts

---

## Layer 2: Git Commit Hook

### Purpose
Analyze commits and recommend documentation after significant changes.

### Implementation

**File:** `hooks/post-commit.template` (committed to repo as template)
```bash
#!/bin/bash
# Post-commit hook for Memory System
# Suggests documentation based on commit message keywords

COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Memory System Suggestion"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Keyword-based triggers (no line/file count thresholds)
LESSON_KEYWORDS="fix|solved|debug|implement|refactor|pattern|architecture|design"
ADR_KEYWORDS="architecture|design|decision|adr|pattern"
GOTCHA_KEYWORDS="gotcha|pitfall|surprising|unexpected|workaround"

if echo "$COMMIT_MSG" | grep -iEq "$LESSON_KEYWORDS"; then
    echo "💡 Lesson-worthy commit detected"
    echo "   Consider: /lesson-learned"
    echo "   Reason: Commit message suggests problem-solving or implementation"
    echo ""
fi

if echo "$COMMIT_MSG" | grep -iEq "$ADR_KEYWORDS"; then
    echo "🏛️  Architectural commit detected"
    echo "   Consider: Create ADR in docs/decisions/"
    echo "   Reason: Design decision may need formalization"
    echo ""
fi

if echo "$COMMIT_MSG" | grep -iEq "$GOTCHA_KEYWORDS"; then
    echo "⚠️  Gotcha detected"
    echo "   Consider: Update docs/knowledge/gotchas.md"
    echo "   Reason: Surprising behavior worth documenting"
    echo ""
fi

# Link to related lessons
COMMIT_KEYWORDS=$(echo "$COMMIT_MSG" | tr '[:upper:]' '[:lower:]' | grep -oE '\w{5,}' | head -5)
RELATED_LESSONS=$(grep -rl "$COMMIT_KEYWORDS" docs/lessons-learned/ 2>/dev/null | head -3)

if [ -n "$RELATED_LESSONS" ]; then
    echo "📖 Related lessons:"
    echo "$RELATED_LESSONS" | while read -r lesson; do
        LESSON_NAME=$(basename "$lesson" .md | sed 's/Lessons_Learned_//')
        echo "   - $LESSON_NAME"
    done
    echo "   Tip: /recall <topic> to review"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**File:** `hooks/install-hooks.sh` (installation script)
```bash
#!/bin/bash
# Install git hooks from templates
# Run this after cloning the repository

set -euo pipefail

HOOKS_DIR=".git/hooks"
TEMPLATE_DIR="hooks"

echo "Installing git hooks..."

# Install post-commit hook
if [ -f "$TEMPLATE_DIR/post-commit.template" ]; then
    cp "$TEMPLATE_DIR/post-commit.template" "$HOOKS_DIR/post-commit"
    chmod +x "$HOOKS_DIR/post-commit"
    echo "✅ Installed post-commit hook"
else
    echo "❌ post-commit.template not found"
    exit 1
fi

echo ""
echo "Git hooks installed successfully!"
echo "Run a git commit to test the Memory System suggestions."
```

**What This Hook Does (Keyword-Based Triggers):**
- Runs automatically after every `git commit`
- **Keyword-based detection only** (no line/file count metrics)
- Suggests `/lesson-learned` for commits with keywords: "fix", "solved", "debug", "implement", "refactor", "pattern", "architecture", "design"
- Suggests ADR creation for: "architecture", "design", "decision", "adr", "pattern"
- Suggests gotcha documentation for: "gotcha", "pitfall", "surprising", "unexpected", "workaround"
- Searches for related lessons based on commit message
- **Moderate verbosity:** Shows what was detected, why it matters, what to do (3-5 lines per suggestion)

**Distribution Method:**
- Template committed to `hooks/post-commit.template`
- Install script (`hooks/install-hooks.sh`) copies template to `.git/hooks/`
- Team members run `./hooks/install-hooks.sh` after cloning
- Template changes are version-controlled

**What It Cannot Do:**
- Invoke `/lesson-learned` automatically
- Create ADRs without user approval
- Access Claude Code directly (runs in separate process)

---

## Layer 3: Learning Mode Pattern Documentation

### Purpose
Document the ★ Insight pattern and SessionStart hook customization as reusable knowledge.

### Implementation

**File:** `docs/knowledge/concepts.md` (add new concept)

Add this section under "Workflow Concepts":

```markdown
### Learning Mode (★ Insight Pattern)

**Category:** Concept
**Tags:** #claude-code #hooks #learning #customization #output-style

#### Quick Summary

The ★ Insight boxes that appear in Claude Code responses are generated by a SessionStart hook that configures the output style. This demonstrates how hooks can customize Claude's interaction patterns system-wide.

#### Details

**How It Works:**

SessionStart hook adds context to Claude's system prompt:
```
You are in 'learning' output style mode, which combines interactive
learning with educational explanations.
```

**Insight Format:**
```
★ Insight ─────────────────────────────────────
[2-3 key educational points]
─────────────────────────────────────────────────
```

**Hook Location:**
- Global user settings: `~/.claude/settings.json`
- Configured at user level (not project level)
- Applies to all Claude Code sessions

**Pattern Purpose:**
- Provides educational context during problem-solving
- Highlights architectural decisions and trade-offs
- Balances task completion with learning
- Insights specific to codebase or code just written

**Distinction from Memory System:**
- ★ Insight = Real-time interaction enhancement (ephemeral, session-only)
- Memory System = Persistent knowledge capture (survives across sessions)
- ★ Insight = How Claude communicates during the session
- Memory System = What gets documented after the session

#### Key Insight

Hooks operate at a different layer than memory systems—they modify *interaction patterns* (presentation) rather than *knowledge persistence* (storage). Both are valuable but serve different purposes.

#### Cross-References

- **Pattern:** [Automation Strategy](#automation-strategy)
- **Hook Guide:** `~/.claude/plugins/.../HOOKS_GUIDE.md`
- **Lesson:** [SessionStart Automation](../lessons-learned/process/Lessons_Learned_SessionStart_Automation.md)
```

**File:** `docs/lessons-learned/process/Lessons_Learned_SessionStart_Automation.md` (new)

[Full comprehensive lesson following template - would be ~600-800 lines]

**Key Sections:**
- Problem: Manual memory system triggering creates overhead
- Root Cause: No automated context loading or documentation suggestions
- Solution: Three-layer automation (SessionStart + git hooks + learning mode)
- Implementation: Step-by-step for SessionStart hook and git hook setup
- Replication Pattern: Generic template for any project
- Lessons: Semi-automatic is better than fully automatic
- Pitfalls: Don't auto-invoke skills, preserve user judgment

---

## Implementation Sequence

### Phase 1: SessionStart Hook (Foundation)
1. Create `hooks/hooks.json` with SessionStart configuration
2. Create `hooks/session-start-memory.sh` script
3. Set executable permissions: `chmod +x hooks/session-start-memory.sh`
4. Test by restarting Claude Code session
5. Verify context appears at session start

**Validation:** SessionStart hook output should appear in chat context

---

### Phase 2: Git Commit Hook (Trigger Detection)
1. Create `hooks/post-commit.template` script
2. Create `hooks/install-hooks.sh` installation script
3. Set executable permissions: `chmod +x hooks/install-hooks.sh`
4. Run `./hooks/install-hooks.sh` to install
5. Test with a sample commit
6. Verify suggestion appears in terminal after commit

**Validation:** Commit, see terminal output with suggestions

---

### Phase 3: Documentation (Knowledge Capture)
1. Add "Learning Mode" concept to `docs/knowledge/concepts.md`
2. Create comprehensive lesson `Lessons_Learned_SessionStart_Automation.md`
3. Update master index `docs/lessons-learned/README.md`
4. Commit all documentation

**Validation:** `/recall automation` finds new entries

---

## Success Criteria

**Layer 1 Success (SessionStart):**
- ✅ Hook loads git context at session start
- ✅ Suggests `/recall` queries based on branch
- ✅ Recommends `/session-summary` after high activity
- ✅ Does NOT auto-execute skills (preserves judgment)

**Layer 2 Success (Git Commit):**
- ✅ Analyzes commits after each `git commit`
- ✅ Suggests `/lesson-learned` for keyword matches
- ✅ Links to related existing lessons
- ✅ Visible in terminal, not intrusive

**Layer 3 Success (Documentation):**
- ✅ Learning Mode pattern documented in knowledge graph
- ✅ Comprehensive lesson created with replication guide
- ✅ Searchable via `/recall automation` or `/recall hooks`
- ✅ Cross-references to automation concept

---

## Constraints & Trade-offs

### Hard Constraints (Cannot Change)
1. **Skills cannot be programmatically invoked** - Hooks can only suggest, not execute
2. **SessionStart hooks require restart** - Changes need Claude Code restart
3. **Git hooks run in separate process** - Cannot access Claude Code directly
4. **Hooks load at startup only** - No hot-reload capability

### Design Choices (Intentional)
1. **Semi-automatic approach** - Preserves user judgment about what to document
2. **Suggestion-based** - Hooks recommend actions, Claude/user decides
3. **Layered automation** - Multiple detection points (session start + commit)
4. **Non-intrusive** - Suggestions don't block workflow
5. **Keyword-based triggers** - Manual judgment via intentional commit messages

### What This Does NOT Do
- ❌ Auto-invoke `/lesson-learned` after every commit
- ❌ Force creation of ADRs or session summaries
- ❌ Detect patterns during active session (only at boundaries)
- ❌ Create documentation without user approval

---

## User Preferences (Confirmed)

Based on user responses:

1. **SessionStart hook location:** `hooks/hooks.json` (committed to repo)
   - ✅ Team-wide distribution
   - ✅ Version controlled
   - ✅ Consistent experience

2. **Git hook distribution:** Template in `hooks/` directory with install script
   - ✅ `hooks/post-commit.template` committed
   - ✅ `hooks/install-hooks.sh` for easy setup
   - ✅ Version-controlled but requires one-time install

3. **Suggestion verbosity:** Moderate (3-5 lines with context)
   - ✅ Shows what was detected
   - ✅ Explains why it matters
   - ✅ Recommends specific action

4. **Trigger approach:** Keyword-based only (no line/file count thresholds)
   - ✅ Manual judgment via commit message keywords
   - ✅ Less noisy than metric-based triggers
   - ✅ Encourages intentional commit messages

---

## Files Summary

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| `hooks/hooks.json` | Config | ~15 | Hook registration (committed) |
| `hooks/session-start-memory.sh` | Bash | ~60 | SessionStart automation |
| `hooks/post-commit.template` | Bash | ~50 | Commit-time suggestions template |
| `hooks/install-hooks.sh` | Bash | ~20 | Git hook installation script |
| `docs/knowledge/concepts.md` | Markdown | +40 | Learning Mode concept |
| `docs/lessons-learned/process/Lessons_Learned_SessionStart_Automation.md` | Markdown | ~700 | Comprehensive lesson |

**Total New Code:** ~885 lines
**Total Files Modified:** 1 (concepts.md)
**Total Files Created:** 5 (hooks.json, session-start-memory.sh, post-commit.template, install-hooks.sh, lesson)

---

## Implementation Ready

Plan has been updated to reflect user preferences. Ready to proceed with implementation upon approval.
