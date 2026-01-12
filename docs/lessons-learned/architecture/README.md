# Architecture Lessons

Lessons learned about architectural decisions, design patterns, and structural choices.

**Total Lessons:** 5
**Last Updated:** 2026-01-12

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

### 3. [Relative File Paths](Lessons_Learned_Relative_File_Paths.md)
**Date:** 2026-01-07
**Problem Solved:** Machine-specific absolute paths in versioned docs
**Key Learning:** Enforcement of relative paths from repository root for all documentation references

### 4. [Strategic vs Strict JD Assessment Methodology](Lessons_Learned_Strategic_Assessment_Methodology.md)
**Date:** 2026-01-12
**Problem Solved:** Rigid checkbox matching causing false negatives
**Key Learning:** 85/75/65/55 thresholds + rare skill overrides + inflation calibration

### 5. [Shadow Modularization Strategy](Lessons_Learned_Shadow_Modularization_Strategy.md)
**Date:** 2026-01-12
**Problem Solved:** 85k token redundancy and maintenance drift
**Key Learning:** Pivot to 'Identify and Copy' for Gold Master and 'Extract and Remove' for Optimized Entrypoint

---

## Common Themes

**Global vs. Project-Local:**
- Skills Architecture lesson establishes clear distinction between global execution and project documentation
- ID-Based Architecture shows how to reference instead of duplicate

**Optimization:**
- Both lessons focus on reducing redundancy (skills loading, token usage)
- Relative File Paths lesson shows how to standardize documentation across environments
- Architecture decisions driven by constraints (Claude Code design, token limits, portability)

---

## Related

- **Decisions:** [../../decisions/](../../decisions/)
- **Knowledge:** [../../knowledge/patterns.md](../../knowledge/patterns.md)
- **Main Index:** [../README.md](../README.md)

---

**Created:** 2026-01-02
