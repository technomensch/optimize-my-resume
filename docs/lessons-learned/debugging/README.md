# Debugging Lessons

Lessons learned from debugging sessions, bug investigations, and troubleshooting.

**Total Lessons:** 1
**Last Updated:** 2026-01-02

---

## All Debugging Lessons

### 1. [Skills Not Loading Until Restart](Lessons_Learned_Skills_Not_Loading_Until_Restart.md)
**Date:** 2026-01-02
**Problem Solved:** Skills added to `~/.claude/commands/` during active session don't load until restart
**Key Learning:** Claude Code loads skills at startup only, not dynamically. Always restart after adding/modifying skills.

---

## Common Themes

**Loading Mechanisms:**
- Understanding when resources load (startup vs. runtime) prevents wasted debugging time
- Document temporal behavior as explicitly as functional behavior

**Setting Expectations:**
- Hot-reload is common in modern tools but not universal
- Make restart requirements explicit in workflows

---

## Related

- **Knowledge:** [../../knowledge/gotchas.md](../../knowledge/gotchas.md)
- **Main Index:** [../README.md](../README.md)

---

**Created:** 2026-01-02
