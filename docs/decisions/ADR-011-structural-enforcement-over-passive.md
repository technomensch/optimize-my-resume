# ADR-011: Structural Enforcement Over Passive Instructions

**Status:** ACCEPTED
**Date:** 2026-01-31
**Enforcement Level:** v9.3.7

---

## Context

v9.3.6 relied on "Passive Enforcement" — documenting rules in markdown and assuming the LLM would follow them. Production testing on 2026-01-29 proved this fails completely under instructional saturation.

## Decision

We are pivoting to "Active Structural Enforcement" (v9.3.7).

1. **Structural Over Semantic:** We will use JSON schemas, mathematical assertions, and multi-turn workflows instead of just markdown lists.
2. **Positive Over Negative:** All constraints are reframed as "Success Requirements" to avoid the Pink Elephant Problem.
3. **Observability Over Silence:** Per-bullet validation proof and final reconciliation tables are mandatory.
4. **Research-Driven:** Layer 0 (Input Sanitization) is mandated to prevent Unicode evasion (arXiv 2504.11168).

## Consequence

- **Pros:** Higher compliance rates, early detection of drift, verifiable output.
- **Cons:** Higher token consumption, 2-turn latency, increased complexity in prompt templates.
- **Realistic Cap:** Prompt-based enforcement is still probabilistic (~60-80%). 100% compliance requires external code validation (Layer 4/Platform 4).
