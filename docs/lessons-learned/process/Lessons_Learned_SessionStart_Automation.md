# Lessons Learned: SessionStart Hook Automation for Memory System

**Date:** 2026-01-03
**Context:** v6.3.0 Memory System - Automation Layer Implementation
**Problem Solved:** Manual triggering of memory system documentation created overhead and risk of forgetting to document important work

---

## The Problem We Faced

After implementing the v6.3.0 Memory System with its four-pillar architecture (Lessons, ADRs, Knowledge, Sessions), we had powerful documentation infrastructure but a critical usability gap: **all documentation required manual triggering**.

**Issues Discovered:**
- Skills (`/recall`, `/lesson-learned`, `/session-summary`) required users to remember when to invoke them
- No automated context loading at session start
- No reminders about uncommitted work or recent activity
- Risk of forgetting to document significant work before context limits
- No connection between git commits and documentation suggestions

**Impact:**
- Cognitive overhead remembering to document
- Inconsistent documentation capture
- Valuable lessons potentially lost when sessions hit token limits
- Team members unaware of when to use memory system skills

**Why This Matters:**
The Memory System's value depends on consistent use. If triggering documentation requires manual memory (ironically), the system designed to preserve knowledge becomes dependent on human fallibility.

---

## What We Learned: Semi-Automatic is Better Than Fully Automatic

### The Core Insight

Automation should operate at **decision boundaries** (session start, commit time) to suggest actions, not execute them. This preserves human judgment about what deserves documentation while removing the burden of remembering *when* to document.

**The Solution:**
Three-layer automation using Claude Code hooks and git hooks:
1. **SessionStart Hook** - Context loading at session boundaries
2. **Git Commit Hook** - Keyword-based suggestions after commits
3. **Documentation Layer** - Capturing the automation pattern itself

---

## The Solution: Three-Layer Hook-Based Automation

### Layer 1: SessionStart Hook (Context Loading)

**File:** `hooks/hooks.json`
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

**File:** `hooks/session-start-memory.sh`
```bash
#!/bin/bash
# SessionStart hook for Memory System integration
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" || exit 1

# Detect session context
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log -1 --pretty=format:'%h - %s (%cr)' 2>/dev/null || echo "No commits")
UNCOMMITTED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
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

**What This Does:**
- Runs automatically when Claude Code session starts or resumes
- Loads current git state (branch, commits, uncommitted files)
- Suggests `/recall` queries based on branch naming patterns
- Warns if 10+ commits in past week (session-summary opportunity)
- Reminds about uncommitted files worth documenting

### Layer 2: Git Commit Hook (Keyword-Based Suggestions)

**File:** `hooks/post-commit.template`
```bash
#!/bin/bash
# Post-commit hook for Memory System
# Suggests documentation based on commit message keywords

COMMIT_MSG=$(git log -1 --pretty=%B)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Memory System Suggestion"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Keyword-based triggers
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

**File:** `hooks/install-hooks.sh`
```bash
#!/bin/bash
# Install git hooks from templates
set -euo pipefail

HOOKS_DIR=".git/hooks"
TEMPLATE_DIR="hooks"

echo "Installing git hooks..."

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

**What This Does:**
- Runs automatically after every `git commit`
- Analyzes commit message for documentation keywords
- Suggests `/lesson-learned` for: fix, implement, refactor, pattern, architecture
- Suggests ADR creation for architectural decisions
- Suggests gotcha documentation for surprising behavior
- Links to related existing lessons via keyword search
- **Moderate verbosity:** 3-5 lines per suggestion with context

### Layer 3: Documentation & Knowledge Capture

**Knowledge Graph Entry:**
Added "Learning Mode (★ Insight Pattern)" concept to `docs/knowledge/concepts.md` explaining how SessionStart hooks can customize Claude's output style.

**This Lesson:**
Comprehensive documentation of the automation implementation for replication.

---

## Implementation Results

### Problems Fixed

- ✅ Automated context loading at session start
- ✅ Branch-aware `/recall` suggestions
- ✅ Session-summary reminders based on commit volume
- ✅ Keyword-based documentation triggers after commits
- ✅ Links to related lessons from commit messages
- ✅ Team-wide hook distribution via version control

### Metrics of Success

**Before:**
- ❌ Manual memory required to invoke skills
- ❌ No context about recent work at session start
- ❌ Easy to forget documentation before context limits
- ❌ No connection between commits and documentation

**After:**
- ✅ Automatic context summary at every session start
- ✅ Smart `/recall` suggestions based on branch name
- ✅ Proactive warnings about 10+ commits (session-summary trigger)
- ✅ Post-commit suggestions for lesson-worthy work
- ✅ Non-intrusive moderate verbosity (3-5 lines)
- ✅ Keyword-based triggers (no noisy metric thresholds)

---

## Root Cause Analysis

### Why Did Manual Triggering Create Overhead?

**1. Cognitive Load Problem**
- Problem: Users had to remember when to document
- Why it happened: Skills are powerful but require explicit invocation
- Human memory is fallible, especially during intense coding sessions

**2. No Temporal Boundaries**
- Problem: No natural triggers for documentation
- Why it happened: Skills exist outside the development workflow
- Sessions can run for hours without documentation checkpoints

**3. Disconnect from Git Workflow**
- Problem: Commits happened independently of documentation
- Why it happened: Git hooks and Claude Code skills were separate systems
- Significant commits didn't prompt documentation consideration

### How Hook-Based Automation Prevents Each Issue

**Issue 1: Cognitive Load**
- Solution: SessionStart hook automatically loads context
- Result: No need to remember to check project state

**Issue 2: No Temporal Boundaries**
- Solution: Two boundary points (session start + commit time)
- Result: Natural documentation checkpoints in workflow

**Issue 3: Git Workflow Disconnect**
- Solution: Post-commit hook analyzes commit messages
- Result: Documentation suggestions happen in git workflow context

---

## Replication Pattern for Any Project

### Generic Hook-Based Automation Structure

```bash
# 1. SessionStart Hook (Claude Code)
hooks/hooks.json              # Hook registration (team-wide)
hooks/session-start-X.sh      # Context loading script

# 2. Git Commit Hook (Git)
hooks/post-commit.template    # Suggestion script template
hooks/install-hooks.sh        # Installation script for team

# 3. Documentation
docs/knowledge/concepts.md    # Document the pattern
docs/lessons-learned/         # Create comprehensive lesson
```

### Key Design Decisions

- **Keyword-Based Triggers:** Manual judgment via commit message keywords, not file/line count metrics (avoids noise)
- **Moderate Verbosity:** 3-5 lines with context (not minimal, not overwhelming)
- **Suggestion-Only:** Hooks suggest actions, don't execute them (preserves user agency)
- **Team-Wide Distribution:** Hooks committed to repo (consistent experience)
- **Template + Installer Pattern:** Git hooks in template form with install script (version-controlled but requires setup)

---

## How to Implement in Your Project

### Step 1: Create SessionStart Hook

1. Create `hooks/hooks.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "hooks/session-start-YOURPROJECT.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

2. Create `hooks/session-start-YOURPROJECT.sh`:
   - Load relevant project context (git, dependencies, recent activity)
   - Suggest appropriate queries or actions
   - Make it executable: `chmod +x hooks/session-start-YOURPROJECT.sh`

3. Test manually: `./hooks/session-start-YOURPROJECT.sh`

4. Commit hooks to repository

5. **Team members:** Restart Claude Code to load hooks

### Step 2: Create Git Commit Hook

1. Create `hooks/post-commit.template`:
   - Define keyword patterns for your domain
   - Customize suggestions based on commit patterns
   - Add project-specific documentation links
   - Make it executable: `chmod +x hooks/post-commit.template`

2. Create `hooks/install-hooks.sh`:
   - Script to copy template to `.git/hooks/`
   - Make it executable: `chmod +x hooks/install-hooks.sh`

3. Test installation: `./hooks/install-hooks.sh`

4. Test with sample commit

5. Commit templates to repository

6. **Team members:** Run `./hooks/install-hooks.sh` after cloning

### Step 3: Document the Pattern

1. Add concept to knowledge graph explaining the automation
2. Create comprehensive lesson (like this one) for replication
3. Update team onboarding docs with hook installation instructions

---

## Lessons for Future Features

### **Lesson 1: Hooks Operate at Boundaries**

**Pattern:** Place automation at natural workflow boundaries (session start, commit time, pre-push)

**Application:** SessionStart loads context when Claude starts; post-commit triggers after git commits

**Result:** Non-intrusive suggestions that fit into existing workflow rhythms

### **Lesson 2: Semi-Automatic Beats Fully Automatic**

**Pattern:** Automate detection and suggestion, but preserve human judgment for execution

**Application:** Hooks detect patterns and suggest documentation, but don't force creation

**Result:** Removes tedium while preventing documentation fatigue and over-capture

### **Lesson 3: Keyword-Based > Metric-Based for Triggers**

**Pattern:** Use intentional signals (commit message keywords) rather than indirect metrics (file counts, line changes)

**Application:** Post-commit hook triggers on "fix", "implement", "architecture" keywords, not file/line thresholds

**Result:** Less noisy, more accurate triggers that respect user intent expressed in commit messages

### **Lesson 4: Template + Installer Pattern for Git Hooks**

**Pattern:** Commit hook templates to repo, provide installer script for `.git/hooks/` deployment

**Application:** `hooks/post-commit.template` is version-controlled; `hooks/install-hooks.sh` deploys it locally

**Result:** Team-wide consistency with version control, while respecting git's non-committed hooks directory

### **Lesson 5: Moderate Verbosity Balances Information and Noise**

**Pattern:** Provide enough context to be actionable (3-5 lines) but not overwhelming

**Application:** Each suggestion shows what was detected, why it matters, what to do

**Result:** Users understand suggestions without terminal clutter

---

## Common Pitfalls to Avoid

### Pitfall 1: Auto-Invoking Skills

**Problem:** Attempting to have hooks automatically run `/lesson-learned` or `/session-summary`

**Why It Fails:** Claude Code skills can't be programmatically invoked—they're text-based instructions, not callable functions

**Solution:** Hooks should **suggest** skills for Claude to execute, not try to invoke them directly

### Pitfall 2: Metric-Based Triggers Too Sensitive

**Problem:** Triggering on every commit with 3+ files or 50+ lines creates noise

**Why It Fails:** Many commits are routine refactoring or formatting that don't warrant documentation

**Solution:** Use keyword-based triggers tied to user intent (commit message) rather than change magnitude

### Pitfall 3: Forgetting Startup-Only Loading

**Problem:** Modifying hooks and expecting immediate effect

**Why It Fails:** Claude Code loads hooks at startup only, not dynamically

**Solution:** Document that hook changes require Claude Code restart; test after restart

### Pitfall 4: Overwhelming Users with Suggestions

**Problem:** Every commit triggers 10+ lines of suggestions

**Why It Fails:** Too much output becomes noise users ignore

**Solution:** Moderate verbosity (3-5 lines per suggestion), only trigger on clear patterns

### Pitfall 5: Not Installing Git Hooks

**Problem:** Team members clone repo but don't run `./hooks/install-hooks.sh`

**Why It Fails:** Git doesn't commit `.git/hooks/` directory—templates need manual installation

**Solution:** Clear onboarding docs + README mentioning installation step

---

## Questions This Solves for Future Developers

**Q: "How do I get automated reminders about documentation?"**
A: Use SessionStart hooks to load context at session start and post-commit hooks to suggest documentation after significant commits.

**Q: "Can I make skills run automatically?"**
A: No—Claude Code skills can't be programmatically invoked. Hooks can only suggest skills for Claude to execute based on context.

**Q: "How do I avoid noisy automation?"**
A: Use keyword-based triggers (commit message analysis) rather than metrics (file/line counts), and moderate verbosity (3-5 lines per suggestion).

**Q: "Do hooks work for the whole team?"**
A: SessionStart hooks (in `hooks/hooks.json`) are committed and work team-wide after Claude Code restart. Git hooks need manual installation via `./hooks/install-hooks.sh`.

**Q: "What if hooks need to change?"**
A: Update templates in repo, commit, team members re-run install script for git hooks or restart Claude Code for SessionStart hooks.

**Q: "When should I create an ADR vs updating this automation?"**
A: Create an ADR when making architectural decisions (e.g., "Should we use hooks or polling?"). Update automation to refine triggers, keywords, or verbosity.

---

## Conclusion

**What we built:** Three-layer hook-based automation providing context loading at session start and keyword-based documentation suggestions after commits

**Why it matters:** Reduces cognitive overhead of remembering to document while preserving user judgment about what deserves documentation

**How it's retained:**
- SessionStart hooks committed to `hooks/hooks.json` (automatic team-wide distribution)
- Git hooks via template + installer pattern (version-controlled, manual install)
- Documentation in knowledge graph and lessons learned

**How to replicate:**
1. Create SessionStart hook loading project context
2. Create post-commit hook with domain-specific keywords
3. Use template + installer pattern for git hooks
4. Document the pattern as a reusable lesson

---

**Key Takeaway:**
*Semi-automatic documentation—automate suggestions at workflow boundaries, preserve judgment for execution—removes tedium without creating noise.*

---

**Created:** 2026-01-03
**Version:** 1.0
**Related Docs:**
- [Automation Strategy Concept](../../knowledge/concepts.md#automation-strategy)
- [Learning Mode Pattern](../../knowledge/concepts.md#learning-mode--insight-pattern)
- [Complete Memory System v6.3.0](../patterns/Lessons_Learned_Complete_Memory_System_v6.3.0_Implementation.md)
- [Implementation Plan](../../plans/dev/memory/memory-system-automation-plan.md)

**Related Issues Solved:**
- Manual triggering overhead
- Forgetting to document before context limits
- No connection between git commits and documentation
- Inconsistent memory system usage across team
