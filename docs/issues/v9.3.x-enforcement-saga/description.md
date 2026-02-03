# v9.3.x Enforcement Saga: Description

**Last Updated:** 2026-02-02
**Current Understanding:** LLM self-enforcement is fundamentally impossible; external validation is required for compliance >80%

---

## Problem Statement

The resume optimization system requires strict constraint enforcement (e.g., max 5 bullets per position, max 2 positions per turn). Despite clear documentation, architectural patterns, and prompt engineering, LLMs consistently bypass these constraints through "vibe-coding drift" - a behavioral pattern where LLMs understand constraints but choose not to follow them.

### Symptoms

- Claude Haiku, Claude Opus, and Gemini all violate guardrails identically
- Improved prompts have diminishing returns on compliance
- Structural constraints (four-layer enforcement) are bypassed
- Documentation and examples don't prevent violations
- Different models exhibit same bypass patterns (not model-specific)

### Impact

- Production failure on Jan 29: 0% compliance despite four enforcement layers
- Users cannot reliably generate constraint-compliant output
- Platform-specific variance: Chat 30-40%, Claude Project 50-60%, IDE 95%+
- Severity: **CRITICAL** for high-compliance use cases (>80% required)

---

## Current Understanding (Living Section)

**Root Cause:** LLMs have two independent capabilities:
1. **Semantic Understanding:** LLMs understand constraint meaning perfectly
2. **Behavior Following:** LLMs choose to follow or ignore instructions based on training bias (vibe-coding drift)

An LLM can fully comprehend a constraint and still choose not to follow it. This makes self-enforcement impossible without external validation.

**Key Insights:**

1. **External Validation is Mandatory**
   - Platform-agnostic validation layers prevent constraint bypass
   - validate_bullets.py achieves 95%+ compliance in IDE environments
   - n8n webhook orchestration can achieve 85-90% with retry logic

2. **Platform-Specific Strategies Required**
   - Chat, Claude Project, Google AI Studio: No Python/n8n execution → max 60-80% compliance
   - IDE, n8n Cloud: External validation possible → 85-95% compliance
   - No single approach works everywhere

3. **Multi-Turn Human Gates Work**
   - User approval between turns creates non-bypassable checkpoints
   - Accumulated state across turns makes violations obvious
   - Human-in-loop pattern scales across all platforms

4. **Prompt Optimization Has Ceiling**
   - Single-pass prompt engineering maxes out at 60-80% compliance
   - Improved prompts show diminishing returns
   - Constraint visibility (CAPS, examples) helps but cannot overcome vibe-coding drift

**Platform/Domain Specific Details:**

| Platform | Mechanism | Max Compliance | Notes |
|----------|-----------|----------------|-------|
| Chat Interface | Prompt-only | 30-40% | No external validation possible |
| Claude Project | Prompt-only | 50-60% | Custom instructions help slightly |
| Google AI Studio | Prompt-only | 50-70% | Different model but same pattern |
| IDE (Python) | External validation | 95%+ | validate_bullets.py enforces constraints |
| n8n Webhook | External + retry | 85-90% | Orchestration with human gates |

---

## Evolution of Understanding

| Date | Phase | Belief | Invalidated By | New Understanding |
|------|-------|--------|----------------|-------------------|
| Jan 27-28 | Hardening | "Better docs will fix it" | Attempt 001-004 | Documentation ignored |
| Jan 28-29 | Structural | "Structural constraints work" | Attempt 005-006 | Structure still bypassable |
| Jan 30 | Four-Layer | "Four layers provide defense" | Jan 29 production test | LLM ignores all layers |
| Jan 31 | Recognition | "External validation needed" | Attempt 007-008 | IDE-only solution |
| Feb 1-2 | Orchestration | "n8n will solve it" | Attempt 009 (v10) | Gemini also violates constraints |
| Feb 2 | Current | "Multi-turn human gates required" | All model testing | Recommendation: v9.3.8 |

---

## Related Documentation

- [Implementation Log](./implementation-log.md) - All 9 attempts with plan references
- [Root Cause Evolution](./analysis/root-cause-evolution.md) - Detailed timeline of understanding shifts
- [Test Cases](./test-cases.md) - Validation scenarios for each approach
- **Knowledge Graph:**
  - [Four-Layer Enforcement Strategy](../../knowledge/patterns.md#four-layer-enforcement-strategy)
  - [External Validation Pattern](../../knowledge/patterns.md#external-validation-pattern)
  - [Platform-Specific Enforcement Limits](../../knowledge/gotchas.md#platform-enforcement-limits)

---

**Note:** This is a living document - updated as each attempt reveals new insights. Last significant shift: Feb 2, 2026 - Gemini v10 still violating constraints despite improved prompts.
