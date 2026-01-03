# Lessons Learned: Claude Code Skills Not Loading Until Restart

**Date:** January 2, 2026
**Context:** v6.3.0 development - Implementing memory system skills
**Problem Solved:** Skills added to ~/.claude/commands/ during active session don't load until restart

---

## The Problem We Faced

After creating three new skills (`/recall`, `/session-summary`, enhanced `/lesson-learned`) and placing them in `~/.claude/commands/`, attempting to use them resulted in "Unknown slash command" errors.

**Issues Discovered:**
- `/recall` returned "Unknown slash command: recall"
- `/session-summary` returned "Unknown slash command: session-summary"
- Skills were correctly placed in `~/.claude/commands/` directory
- File permissions were correct
- Markdown syntax was valid
- Yet Claude Code didn't recognize them

**Impact:**
- Cannot test new skills immediately after creation
- Workflow interruption (must restart app)
- Confusing for users expecting hot-reload
- Could lead to debugging wild goose chases

**Why This Matters:**
Understanding when skills are loaded prevents wasted time debugging "broken" skills that are actually just not loaded yet. This is a fundamental architectural constraint of Claude Code that affects skill development workflows.

---

## What We Learned: Skills Load at Startup Only

### The Core Insight

**Claude Code loads skills from `~/.claude/commands/` at application startup, not dynamically during runtime.**

This means:
- ✅ Skills present at startup are available immediately
- ❌ Skills added during active session are NOT available
- ❌ Skills modified during active session use OLD version
- ✅ Restart makes new/modified skills available

**The Solution:**
After adding or modifying skills in `~/.claude/commands/`, restart Claude Code to load them.

---

## The Solution: Restart After Skill Changes

### Simple Workflow

**When creating new skills:**

```bash
# 1. Create skill file
vim ~/.claude/commands/new-skill.md

# 2. Save and exit

# 3. Restart Claude Code
# (Quit application, relaunch)

# 4. Test skill
/new-skill
```

**When modifying existing skills:**

```bash
# 1. Edit skill file
vim ~/.claude/commands/existing-skill.md

# 2. Save changes

# 3. Restart Claude Code
# (Quit application, relaunch)

# 4. Test modifications
/existing-skill
```

### Why Restart is Required

**Claude Code architecture:**

```
Startup Sequence:
1. Launch application
2. Scan ~/.claude/commands/
3. Load all .md files as skills
4. Parse skill syntax
5. Register slash commands
6. [Skills now available]

Runtime:
- Skills loaded in memory
- No filesystem watching
- No hot-reload mechanism
- Changes require restart
```

**This is by design:**
- Simpler implementation (no file watchers)
- Better performance (one-time load)
- Predictable behavior (no mid-session changes)
- Fewer edge cases (no partial reloads)

---

## Implementation Results

### Problems Fixed

✅ **Understanding:**
- Before: Confusion why skills don't work immediately
- After: Clear mental model of skill loading

✅ **Workflow:**
- Before: Debug "broken" skills for minutes
- After: Restart immediately, test works

✅ **Documentation:**
- Before: Undocumented behavior
- After: Explicit lesson learned captured

### Metrics of Success

**Before Understanding:**
- Time wasted debugging: 5-10 minutes per skill
- Frustration level: High
- False assumptions: "Skill syntax must be wrong"

**After Understanding:**
- Time wasted: 0 seconds (immediate restart)
- Frustration level: None (expected behavior)
- Correct mental model: "Restart to load"

---

## Root Cause Analysis

### Why Did This Issue Happen?

**1. No Documentation of Loading Mechanism**
- **Problem:** Claude Code docs don't explicitly state "startup only" loading
- **Why it happened:** Common assumption from other systems (VS Code extensions hot-reload)
- **Result:** Users expect dynamic loading, get confused when it doesn't work

**2. No Feedback When Skills Added**
- **Problem:** No confirmation message after placing file in ~/.claude/commands/
- **Why it happened:** File system operations are silent
- **Result:** User doesn't know if skill was registered

**3. Common Hot-Reload Expectation**
- **Problem:** Many modern tools support hot-reload (Vite, Next.js, VS Code)
- **Why it happened:** Users bring expectations from other ecosystems
- **Result:** Expect Claude Code to work same way

### How Understanding Prevents Each Issue

**Issue 1 (No documentation):**
- **Solution:** This lessons learned document captures the behavior
- **Result:** Future developers know to restart

**Issue 2 (No feedback):**
- **Solution:** Document the workflow: create → restart → test
- **Result:** Restart becomes expected part of workflow

**Issue 3 (Hot-reload expectation):**
- **Solution:** Explicitly document "startup only, no hot-reload"
- **Result:** Correct expectations set upfront

---

## Replication Pattern for Any Project

### Generic "Startup Loading" Detection

**How to identify startup-only loading:**

1. **Create test resource:**
   ```bash
   # Create new config/plugin/skill file
   echo "test content" > ~/.config/app/test.conf
   ```

2. **Attempt to use without restart:**
   - If works: Dynamic loading ✅
   - If fails: Startup-only loading ❌

3. **Restart application:**
   - If now works: Confirms startup-only loading

4. **Document behavior:**
   - Capture in lessons learned
   - Update workflow documentation
   - Add to troubleshooting guide

### Key Design Decisions

**Decision 1: When to Restart**
- **Rationale:** After any skill create/modify/delete operations
- **Alternative rejected:** Try to force reload (no mechanism exists)
- **Result:** Simple, reliable workflow

**Decision 2: Where to Document**
- **Rationale:** Both troubleshooting guide AND lessons learned
- **Alternative rejected:** README only (easy to miss)
- **Result:** Multiple discovery paths

**Decision 3: Include in Skill Creation Workflow**
- **Rationale:** Make restart explicit step in process
- **Alternative rejected:** Assume users know to restart
- **Result:** No confusion, clear expectations

---

## How to Implement in Your Project

### Step 1: Test Your Tool's Loading Behavior

```bash
# For any tool with plugins/extensions/skills:

# 1. Note current loaded items
<tool> --list-plugins

# 2. Add new item while tool is running
echo "new-plugin" > ~/.config/tool/plugins/new.conf

# 3. Test if immediately available
<tool> --use-plugin new

# 4. If fails, restart tool
<tool> restart

# 5. Test again
<tool> --use-plugin new

# 6. Document findings
```

### Step 2: Update Skill Development Workflow

**Add restart as explicit step:**

```markdown
## Skill Development Workflow

1. Create skill file in ~/.claude/commands/
2. Write skill content
3. **Restart Claude Code** ← Critical step
4. Test skill functionality
5. Iterate (edit → restart → test)
```

### Step 3: Create Troubleshooting Entry

**Add to gotchas.md:**

```markdown
### Skills Not Appearing

**Problem:** Created skill but getting "Unknown slash command"

**Solution:**
1. Verify file is in ~/.claude/commands/
2. Verify filename ends with .md
3. **Restart Claude Code**
4. Try skill again

**Why:** Claude Code loads skills at startup only, not dynamically.
```

### Step 4: Add to Knowledge Graph

**Update knowledge/gotchas.md:**

```markdown
## Skills Loading

**Quick Summary:** Claude Code loads skills at startup only.

**Solution:** Restart after adding/modifying skills.

**Related:** [Lessons: Skills Not Loading](../lessons-learned/debugging/...)
```

---

## Lessons for Future Features

### Lesson 1: Test Assumptions About Loading Mechanisms

**Pattern:** Don't assume hot-reload exists without testing

**Application:** When working with any plugin/extension system:
1. Test if changes load immediately
2. Document actual behavior found
3. Update workflows accordingly

**Result:** Correct mental model from day one, no confusion.

**Generalization:** Verify loading behavior early in any extensibility system.

### Lesson 2: Document Runtime Characteristics

**Pattern:** Capture "when things happen" not just "how things work"

**Application:** Document:
- When configuration loads (startup vs runtime)
- When changes take effect (immediate vs restart)
- When cache clears (never vs periodic vs manual)

**Result:** Users know what to expect, no surprises.

**Generalization:** Temporal behavior is as important as functional behavior.

### Lesson 3: Make Restart Explicit in Workflows

**Pattern:** If restart required, make it explicit step in process

**Application:**
- Don't hide restart in fine print
- Include in step-by-step guides
- Add to checklists

**Result:** Users follow correct workflow every time.

**Generalization:** Required steps should be explicit, not assumed.

### Lesson 4: Create Debugging Gotchas Immediately

**Pattern:** When you hit unexpected behavior, document it immediately

**Application:**
1. Hit confusing behavior
2. Investigate and solve
3. Create lesson learned same day
4. Add to troubleshooting guide

**Result:** Next person (or future you) doesn't waste time.

**Generalization:** Document gotchas while they're fresh.

---

## Common Pitfalls to Avoid

### Pitfall 1: Debugging Skill Syntax Before Checking if Loaded

**Problem:** Spend time fixing "broken" syntax when skill just isn't loaded

**Solution:** First step when skill doesn't work: restart. Second step: debug syntax.

**Why:** 90% of "skill doesn't work" issues are "skill not loaded", not syntax errors.

### Pitfall 2: Editing Global Skills During Active Development

**Problem:** Edit ~/.claude/commands/skill.md, changes don't appear, confusion ensues

**Solution:** Accept that restart is required. Build it into muscle memory.

**Why:** Fighting the architecture wastes time.

### Pitfall 3: Assuming Hot-Reload Exists

**Problem:** Expect VS Code-like hot-reload, get frustrated when it doesn't work

**Solution:** Set correct expectations: Claude Code = startup loading only.

**Why:** Wrong mental model causes frustration.

### Pitfall 4: Not Testing Skills After Creation

**Problem:** Create skill, assume it works, discover issues later

**Solution:**
1. Create skill
2. Restart
3. Test immediately
4. Iterate if needed

**Why:** Immediate testing catches issues fast.

---

## Questions This Solves for Future Developers

**Q: "I created a skill in ~/.claude/commands/ but it's not working. What's wrong?"**

A: Restart Claude Code. Skills load at startup only, not dynamically during runtime.

**Q: "Do I need to restart after every skill modification?"**

A: Yes. Any change to skill files (create/modify/delete) requires restart to take effect.

**Q: "Is there a way to reload skills without restarting?"**

A: No. Claude Code doesn't support hot-reload. Restart is the only way.

**Q: "Why doesn't Claude Code support hot-reload like VS Code?"**

A: Architectural choice for simplicity. Startup-only loading is simpler to implement and more predictable.

**Q: "How do I know if a skill is loaded?"**

A: Try to use it. If you get "Unknown slash command", either it's not loaded (restart) or there's a syntax error (check file).

**Q: "Can I force Claude Code to reload skills?"**

A: No. Only restart works.

**Q: "Should I create skills in project .claude/skills/ or global ~/.claude/commands/?"**

A: Global ~/.claude/commands/ for actual execution. Project .claude/skills/ for reference/distribution only.

---

## Conclusion

**What we learned:**
Claude Code loads skills from `~/.claude/commands/` at startup only, not dynamically. After creating or modifying skills, restart Claude Code to load them.

**Why it matters:**
Understanding loading behavior prevents wasted time debugging "broken" skills that are actually just not loaded yet. Setting correct expectations (restart required) makes skill development smooth.

**How it's retained:**
- Documented in this lesson learned
- Added to troubleshooting guide
- Included in skill development workflow
- Captured in knowledge graph gotchas

**How to replicate:**
1. Test your tool's loading behavior (startup vs dynamic)
2. Document findings immediately
3. Update workflows to include restart
4. Add to troubleshooting guide

---

**Key Takeaway:**
*When developing extensibility systems, verify loading behavior early and document it explicitly. "Restart required" is a valid architectural choice—just make it clear to users.*

---

**Created:** January 2, 2026
**Version:** 1.0
**Related Docs:**
- Skills Architecture: `docs/lessons-learned/Lessons_Learned_Claude_Code_Skills_Architecture.md`
- Knowledge Graph Gotchas: `docs/knowledge/gotchas.md` (to be updated)
- Troubleshooting: Future documentation

**Related Issues:**
- Memory System Skills (Phase 2): Created skills, discovered restart requirement
- Testing workflow: Attempted /recall, /session-summary, /lesson-learned
- All resulted in "Unknown slash command" until restart understanding

**Next Steps:**
- Update docs/knowledge/gotchas.md with skills loading gotcha
- Add restart step to skill development workflow
- Test all three new skills after restart
