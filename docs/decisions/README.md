# Architecture Decision Records (ADRs)

**Total ADRs:** 3
**Status:** 3 Accepted, 0 Proposed
**Last Decision:** 2026-01-02 (ADR-003)

---

## What Are ADRs?

Architecture Decision Records document significant architectural decisions made during the project lifecycle. Each ADR captures context, decision, and consequences.

**When to create an ADR:**
- Significant architectural choices
- Technology selection decisions
- Design pattern adoptions
- Process changes that affect architecture

---

## Active ADRs (Status: Accepted)

| ID | Title | Date | Tags | Related |
|----|-------|------|------|---------|
| [001](ADR-001-dual-format-documentation.md) | Dual-Format Documentation Strategy | 2026-01-02 | #documentation #format #llm-optimization | [Memory System Lesson](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md) |
| [002](ADR-002-skills-global-only.md) | Skills Must Be Global-Only | 2026-01-02 | #architecture #skills #claude-code | [Skills Architecture](../lessons-learned/architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md) |
| [003](ADR-003-surgical-updates-pattern.md) | Surgical Updates Pattern | 2026-01-02 | #pattern #updates #preservation | [ID-Based Architecture](../lessons-learned/architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md) |

## Proposed ADRs

| ID | Title | Date | Tags | Status |
|----|-------|------|------|--------|
| - | - | - | - | - |

## Deprecated/Superseded

[None yet]

---

## Quick Reference

**Create new ADR:**
```bash
# Use next sequential number
cp docs/decisions/template.md docs/decisions/001-title.md
# Edit and update status
```

**Update ADR status:**
- Proposed → Accepted: Implementation complete
- Accepted → Deprecated: No longer recommended
- Accepted → Superseded: Replaced by newer ADR

**Link notation:**
- L-NNN: Lesson learned reference
- ADR-NNN: Other ADR reference
- S-YYYY-MM-DD: Session reference

---

## Related Resources

- **Lessons Learned:** [../lessons-learned/](../lessons-learned/)
- **Sessions:** [../sessions/](../sessions/)
- **Knowledge Graph:** [../knowledge/](../knowledge/)
- **Template:** [template.md](template.md)

---

**Last Updated:** 2026-01-02
