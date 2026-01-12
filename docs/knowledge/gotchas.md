# Common Gotchas & Solutions

**Last Updated:** 2026-01-02
**Entries:** 7

---

## Quick Navigation

- [Skills Not Appearing](#skills-not-appearing) - Global directory requirement
- [Skills Not Loading After Changes](#skills-not-loading-after-changes) - Startup-only loading
- [Lost Content in Updates](#lost-content-in-updates) - Full rewrite pitfall
- [Project vs. Global Confusion](#project-vs-global-confusion) - Scoping misunderstanding
- [Chat History Bloat](#chat-history-bloat) - Gitignore pattern needed
- [Plan File Location](#plan-file-location) - Temporary vs. permanent
- [Deleting Feature Branches](#deleting-feature-branches) - Loss of audit trail

---

## Claude Code Gotchas

### Skills Not Appearing

**Symptom:** Created skill in `.claude/skills/` but it doesn't appear in Claude Code

**Gotcha:** Skills load from `~/.claude/commands/` (global) only, not `.claude/skills/` (project)

**Fix:**
```bash
cp .claude/skills/your-skill.md ~/.claude/commands/
# Restart Claude Code
```

**Why:** Architectural decision in Claude Code - skills are user-level, not project-level

**See:** [ADR-002: Skills Global-Only](../decisions/ADR-002-skills-global-only.md)

---

### Skills Not Loading After Changes

**Symptom:** Modified skill in `~/.claude/commands/` but changes don't take effect

**Gotcha:** Claude Code loads skills at startup only, not dynamically during runtime

**Fix:**
1. Save changes to `~/.claude/commands/your-skill.md`
2. Quit Claude Code completely
3. Relaunch Claude Code
4. Test skill

**Why:** No hot-reload mechanism - skills load once at startup for performance

**See:** [Lesson: Skills Not Loading Until Restart](../lessons-learned/debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

---

## Content Management Gotchas

### Lost Content in Updates

**Symptom:** Updated document and lost carefully crafted metrics, details, or phrasing

**Gotcha:** LLMs default to full rewrites instead of surgical updates

**Fix:**
1. Always use surgical updates pattern
2. Explicitly instruct: "Add to existing section, don't rewrite"
3. Validate preservation rate (should be 80%+)
4. Review diffs before accepting

**Why:** LLMs optimize for consistency, which often means regenerating content

**See:** [ADR-003: Surgical Updates Pattern](../decisions/ADR-003-surgical-updates-pattern.md)

---

### Project vs. Global Confusion

**Symptom:** Unclear whether file should be in project repository or global directory

**Gotcha:** Mixing execution location with documentation location

**Rule of Thumb:**
- **Execution** → Global directory (`~/.claude/commands/`)
- **Documentation** → Project repository (`.claude/skills/`, `docs/`)
- **Both** → Hybrid pattern (global execution + project reference)

**See:** [Concept: Global vs. Project-Local](concepts.md#global-vs-project-local)

---

## Git/Version Control Gotchas

### Chat History Bloat

**Symptom:** Repository size growing due to chat history exports

**Gotcha:** Need to track folder but ignore contents

**Fix:**
```gitignore
# .gitignore
chat-history/*
!chat-history/.gitkeep
```

**Why:** Want folder in repo for workflow, but exports are large and session-specific

**See:** [Lesson: Chat History Workflow](../lessons-learned/process/Lessons_Learned_Chat_History_Workflow.md)

---

### Plan File Location

**Symptom:** Plans created in `.claude/plans/` not versioned, lost after cleanup

**Gotcha:** Temporary vs. permanent plan locations

**Fix:**
```bash
# Move plan from temporary to tracked location
mv ~/.claude/plans/feature-plan.md docs/plans/
```

**Why:** `.claude/plans/` is temporary (Claude Code internal), `docs/plans/` is permanent (git tracked)

**See:** [Lesson: Plan File Locations](../lessons-learned/process/Lessons_Learned_Plan_File_Locations.md)

---

### Deleting Feature Branches

**Symptom:** Lost the "thought process" and reasoning behind a merged feature
**Gotcha:** Standard git cleanup (deleting branches) destroys the granular commit history
**Fix:**
- **NEVER** delete feature branches after merging
- Keep them on origin as historical archives
- Use `v8.x-` naming to organize them
- If deleted, check `git reflog` immediately to restore

**Why:** The *history of decisions* is as valuable as the code. Squashed merges in main hide the intermediate steps.

**See:** [ADR-006: Strict Branch Preservation](../decisions/ADR-006-strict-branch-preservation.md)

---

**Maintenance:**
- Add gotchas immediately when encountered
- Include clear solutions and prevention strategies
- Link to related lessons learned for details

**Created:** 2026-01-02
