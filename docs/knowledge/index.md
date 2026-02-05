# Knowledge Graph - Master Index

**Purpose:** Quick-reference navigation across all knowledge domains

**Last Updated:** 2026-02-05
**Total Entries:** 20 concepts, 28 patterns, 10 gotchas, 9 workflows
**Critical Reference:** [Enforcement Failure Analysis & Solutions](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) - Jan 29 incident learnings

---

## ⚠️ CRITICAL: Start Here for Enforcement Understanding

**[ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md)** is the consolidated reference for understanding why guardrail enforcement failed on Jan 29 and how to prevent regression. This document:
- Explains the incident timeline (21:00-21:40 UTC)
- Documents 4+ critical failures that were supposed to be prevented
- Maps failures to specific guardrails (G1-G37) and lessons learned
- Explains why documentation-based enforcement cannot force compliance
- References all related institutional knowledge in one place

**[ENFORCEMENT_STRUCTURAL_SOLUTIONS.md](ENFORCEMENT_STRUCTURAL_SOLUTIONS.md)** proposes structural changes that address the enforcement gap:
- Human-in-the-loop gates (user approval between stages)
- External validation scripts (non-bypassable by LLM)
- Prompt architecture improvements (recency anchors, templates)
- Combined layered defense strategy

**[scripts/validate_bullets.py](../../scripts/validate_bullets.py)** - External validation script (runs outside LLM, cannot be bypassed)

**Read these if you're implementing any guardrail-dependent workflows.**

---

## Navigation by Type

- **[Concepts](concepts.md)** - Core ideas and principles
- **[Patterns](patterns.md)** - Reusable design patterns
- **[Gotchas](gotchas.md)** - Common pitfalls and solutions
- **[Workflows](workflows.md)** - Step-by-step processes
- **[Enforcement Failure Analysis](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md)** - Why enforcement failed (Jan 29 incident)
- **[Enforcement Structural Solutions](ENFORCEMENT_STRUCTURAL_SOLUTIONS.md)** - How to prevent recurrence (proposals)

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
├─ Enforcement (CRITICAL)
│  ├─ Passive vs Active → [concepts.md#passive-vs-active-enforcement]
│  ├─ Platform-Specific → [patterns.md#platform-specific-enforcement]
│  ├─ Layered Defense → [patterns.md#layered-defense-strategy]
│  ├─ Multi-Turn Workflow → [workflows.md#multi-turn-enforcement]
│  ├─ Incident Analysis → [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md]
│  └─ Solutions → [ENFORCEMENT_STRUCTURAL_SOLUTIONS.md]
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
- **[Enforcement Failure Analysis & Solutions](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md)** ← START HERE (2026-01-30)
- **[Layered Defense Strategy](patterns.md#layered-defense-strategy)** - Multiple redundant mechanisms per platform
- **[Platform-Specific Enforcement](patterns.md#platform-specific-enforcement)** - Compliance expectations by platform
- **[Passive vs Active Enforcement](concepts.md#passive-vs-active-enforcement)** - Why documentation alone fails
- [The Vibe-Coding Drift](gotchas.md#the-vibe-coding-drift) - Why guardrails failed
- [3-Stage Checkpoint Pattern](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md#what-the-3-stage-checkpoint-pattern-was-designed-to-prevent) - How to prevent regression
- [Multi-Turn Enforcement](workflows.md#multi-turn-enforcement) - Chat interface enforcement workflow
- Shadow Modularization → [concepts.md#shadow-modularization]
- Action Verb Categories → [concepts.md#action-verb-categories]
- Surgical Updates → [concepts.md#surgical-updates]

**Critical Gotchas (Enforcement):**
- [The Vibe-Coding Drift](gotchas.md#the-vibe-coding-drift) - Model reverts to training bias in saturated context
- [Instructional Saturation](gotchas.md#instructional-saturation) - Rules lose priority in long context windows
- [Recursive Constraint Drift](gotchas.md#recursive-constraint-drift) - Interdependent constraints cause failures
- Skills Not Appearing → [gotchas.md#skills-not-appearing]
- Unverified Skill Hallucination → [gotchas.md#unverified-skill-hallucination]
- Lost Content in Updates → [gotchas.md#lost-content-in-updates]

**Recent Additions (2026-02-05):**
- 5-Plane Guardrail Taxonomy Concept (2026-02-05) - Classification into identity, authority, design, language, change-control planes
- Local Guardrail Overlay vs Canonical Registry Concept (2026-02-05) - Namespace separation for project-local vs system-wide constraints
- Resume-as-Governed-System Concept (2026-02-05) - Treating resume as infrastructure with formal constraints
- Job Title Evolution Strategy Concept (2026-02-05) - Target positioning for emerging AI-infrastructure roles
- Guardrail Freeze Protocol Pattern (2026-02-05) - Fixed guardrail count, no additions policy
- Context Handoff Protocol Pattern (2026-02-05) - Cross-platform state transfer via `.codex-ai-context/`
- Project Memory System Pattern (2026-02-05) - Persistent governance memory for Claude Code agents
- Meta-Issue Tracking Pattern Link Update (2026-02-05) - Fixed cross-reference to lesson file
- Layered Defense Strategy Pattern (2026-01-30) - Multiple redundant enforcement mechanisms per platform
- Platform-Specific Enforcement Pattern (2026-01-30) - Compliance expectations by platform (~30-95%)

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
