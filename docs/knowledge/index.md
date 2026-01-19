# Knowledge Graph - Master Index

**Purpose:** Quick-reference navigation across all knowledge domains

**Last Updated:** 2026-01-19
**Total Entries:** 14 concepts, 15 patterns, 10 gotchas, 8 workflows

---

## Navigation by Type

- **[Concepts](concepts.md)** - Core ideas and principles
- **[Patterns](patterns.md)** - Reusable design patterns
- **[Gotchas](gotchas.md)** - Common pitfalls and solutions
- **[Workflows](workflows.md)** - Step-by-step processes

---

## Concept Map

```
Optimize-My-Resume Project
├─ Documentation Patterns
│  ├─ Dual-Format Strategy → [patterns.md#dual-format]
│  ├─ Surgical Updates → [patterns.md#surgical-updates]
│  ├─ Version History → [patterns.md#version-history]
│  └─ Related: [ADR-001], [Lessons]
│
├─ Memory Systems
│  ├─ Lessons Learned → [concepts.md#lessons]
│  ├─ ADRs → [concepts.md#adrs]
│  ├─ Knowledge Graph → [concepts.md#knowledge-graph]
│  └─ Session Summaries → [concepts.md#sessions]
│
└─ Workflows
   ├─ Documentation Update → [workflows.md#doc-update]
   ├─ Plan Mode → [workflows.md#plan-mode]
   ├─ Patch Creation → [workflows.md#patch]
   └─ Application Optimization → [workflows.md#application-optimization]
```

---

## Quick Links

**Most Referenced:**
- Shadow Modularization → [concepts.md#shadow-modularization]
- Action Verb Categories → [concepts.md#action-verb-categories]
- Surgical Updates → [concepts.md#surgical-updates]

**Common Gotchas:**
- Skills Not Appearing → [gotchas.md#skills-not-appearing]
- Unverified Skill Hallucination → [gotchas.md#unverified-skill-hallucination]
- Lost Content in Updates → [gotchas.md#lost-content-in-updates]

**Recent Additions:**
- Application Optimization Workflow (2026-01-19)
- Custom Keyword Hub (2026-01-19)
- Interactive Tag Toggling Pattern (2026-01-19)
- Memory System Architecture (2026-01-02)

---

## Bidirectional Links

This index uses `[[wiki-style]]` links internally for navigation. Each entry links back to:
- Source lessons learned
- Formal ADRs
- Implementation sessions
- Related workflows

**Example navigation path:**
```
User needs: "How do skills work?"
→ index.md → concepts.md#skills-scope
→ Cross-ref → ADR-002 (Skills Global-Only)
→ Cross-ref → Lesson: Skills Architecture
→ Cross-ref → Workflow: Plan Mode
```

---

## Maintenance

**Auto-updated by:**
- `/lesson-learned` - Adds cross-refs to new lessons
- `/session-summary` - Links to session documentation
- Manual curation - For pattern extraction

**Update frequency:** After each new lesson/ADR/session

---

**Created:** 2026-01-02
