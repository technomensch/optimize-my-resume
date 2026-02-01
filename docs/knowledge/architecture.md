# Architecture Patterns Catalog

**Last Updated:** 2026-01-29

---

## Quick Navigation

- [ID-Based Architecture](#id-based-architecture) - Logical referencing and token optimization
- [Identifier Decoupling](#identifier-decoupling) - Separation of local logical IDs from platform serial IDs
- [3-Layer Unified Redundancy Framework](#3-layer-unified-redundancy-framework) - Architecture for recursive guardrail compliance

---

### ID-Based Architecture

**Problem:** Token bloat from repeating full content
**Solution:** Reference entities by ID, store full content once
**When to use:** AI pipelines with repeated data structures
**Quick Reference:**
- Assign unique IDs to entities
- Reference by ID in subsequent mentions
- Reduces token usage, eliminates redundancy
**See:** [ID-Based Architecture Lesson](../lessons-learned/architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)

---

### Identifier Decoupling (Dual-ID Policy)

**Problem:** Local context (folders/branches) drifts from platform serial numbering (GitHub Issues), causing confusing renames.
**Solution:** Map local persistent IDs to platform serial IDs instead of attempting to align them.
**When to use:** Project management across local and cloud platforms.
**Quick Reference:**
- **Local ID:** `issue-85` (Logical, persistent, used for file paths/branches).
- **Platform ID:** `#97` (Serial, drifts, used for tracking).
- **Policy:** Never rename local assets to match platform drift. Maintain bidirectional links in metadata.
**See:** [Identifier Decoupling Lesson](../lessons-learned/process/Lessons_Learned_Identifier_Decoupling.md)

---

### 3-Layer Unified Redundancy Framework (G40)

**Problem:** LLMs fail to satisfy multiple interdependent/recursive constraints in a single-pass monolithic validation.
**Solution:** Decouple validation into three sequential, visible stages: Planning → Gating → Reconciliation.
**When to use:** Multi-position resume generation, complex summarization with hard length and uniqueness constraints.
**Quick Reference:**
1. **Layer 1 (Planning):** Force LLM to allocate resources (bullets/words) across all units BEFORE generation.
2. **Layer 2 (Gating):** Real-time chain-of-thought audits for each unit.
3. **Layer 3 (Reconciliation):** Verify total output against global budgets with raw metrics.
**See:** [Agentic Momentum Lesson](../lessons-learned/process/Lessons_Learned_Agentic_Momentum_Governance.md)
