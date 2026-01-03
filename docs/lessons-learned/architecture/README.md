# Architecture Lessons

Lessons learned about architectural decisions, design patterns, and structural choices.

**Total Lessons:** 2
**Last Updated:** 2026-01-02

---

## All Architecture Lessons

### 1. [Claude Code Skills Architecture](Lessons_Learned_Claude_Code_Skills_Architecture.md)
**Date:** 2025-12-29
**Problem Solved:** Skills not appearing in Claude Code despite existing in project
**Key Learning:** Skills MUST be in `~/.claude/commands/` (global), not `.claude/skills/` (project-local reference only)

### 2. [ID-Based Architecture for Token Optimization](Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)
**Date:** 2025-12-17
**Problem Solved:** Token bloat and display redundancy in AI pipeline
**Key Learning:** Universal ID-based architecture eliminates redundancy by referencing entities by ID instead of repeating full content

---

## Common Themes

**Global vs. Project-Local:**
- Skills Architecture lesson establishes clear distinction between global execution and project documentation
- ID-Based Architecture shows how to reference instead of duplicate

**Optimization:**
- Both lessons focus on reducing redundancy (skills loading, token usage)
- Architecture decisions driven by constraints (Claude Code design, token limits)

---

## Related

- **Decisions:** [../../decisions/](../../decisions/)
- **Knowledge:** [../../knowledge/patterns.md](../../knowledge/patterns.md)
- **Main Index:** [../README.md](../README.md)

---

**Created:** 2026-01-02
