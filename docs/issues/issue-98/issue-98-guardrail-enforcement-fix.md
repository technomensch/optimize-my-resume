# Issue #98: Guardrail Enforcement Fix - Structural Constraints

**Status:** 🔴 ACTIVE (Planning Phase)
**Local ID:** issue-98
**GitHub Continuations:** #97 (Guardrail Hardening), #99 (ENH-008 Governance), #101
**Type:** 🛡️ Hardening (Critical Bug Fix)
**Priority:** CRITICAL
**Created:** 2026-01-30
**Assigned:** Pending (Sonnet for analysis, Opus for implementation)

---

## Problem Statement

### Executive Summary

The guardrail enforcement system built in v9.3.6 completely failed in production testing (2026-01-29). Despite 2 days of hardening work creating 37 standardized guardrails with documentation, institutional knowledge, and a 3-Stage Checkpoint Pattern, **all enforcement mechanisms were bypassed in real-world use**.

### What Failed

Production test with 87/100 fit score (excellent match) revealed:
- ❌ Jobs left out of resume bullets
- ❌ Chronological ordering violated
- ❌ Professional summary word count unaccounted
- ❌ Action verb distribution completely ignored
- ❌ System claimed compliance but showed no validation proof

### Root Cause

**Passive instruction-based enforcement cannot prevent LLM drift in real-world usage.**

The v9.3.6 system:
- ✅ Documented guardrails comprehensively (37 G1-G37 registry)
- ✅ Created 3-Stage Checkpoint Pattern
- ✅ Validated system is "production-ready"
- ❌ But did NOT structurally enforce guardrails during generation
- ❌ Lacked validation gates that would reject non-compliant output

**User's Reaction:**
> "i have spent 2 days hardening the guardrails and everything was ignored"

This is a legitimate system failure. The guardrails exist and are documented, but they're not actively enforced in a way that prevents violations.

---

## Current State (v9.3.6)

### What Was Built
- `bo_output-validator.md` — 15-point validation checklist
- Guardrail registry with G1-G37 standardized IDs
- `bo_bullet-generation-instructions.md` — 3-stage checkpoint pattern
- Institutional knowledge:
  - `docs/knowledge/gotchas.md` — Documents failures guardrails prevent
  - `docs/lessons-learned/` — Explains WHY enforcement matters
  - `docs/decisions/ADR-010` — Formalizes guardrail hardening pattern

### What's Missing
- **Layer 1:** Hard mathematical limits in prompts (not just suggestions)
- **Layer 2:** JSON validation gates that reject non-compliant output
- **Layer 3:** Multi-turn workflow to validate constraints before committing
- **Layer 4:** Literal guardrail code injected as "hard logic" not suggestions

---

## Solution: Four-Layer Enforcement Strategy

### Overview

Move from **passive instructions** to **active structural constraints**.

| Layer | Name | What | Result |
|-------|------|------|--------|
| 1 | Structural Prompt Logic | Hard mathematical limits in prompt template | Constrains what generation is possible |
| 2 | "Proof of Work" Schema | JSON validation gates requiring evidence | Rejects non-compliant output before delivery |
| 3 | Workflow Multi-Turn | Two-turn workflow with validation pause | Validates constraints are feasible before generation |
| 4 | Modular Injection | Literal guardrail code in prompts | LLM sees guardrails as structural code, not suggestions |

### Key Principle

**Validation gates that reject invalid output, not instructions that can be ignored.**

---

## Detailed Solution

See [v9.3.7-guardrail-enforcement-fix.md](../../plans/v9.3.7-guardrail-enforcement-fix.md) for full implementation details.

---

## Expected Outcomes

After v9.3.7 implementation:
1. ✅ Guardrails are structurally enforced, not just documented
2. ✅ Invalid output is rejected before user sees it
3. ✅ Validation proof is visible (not hidden in thinking blocks)
4. ✅ Production test re-run shows zero guardrail violations
5. ✅ System is "hardened against drift" not just "production ready"

---

## Task Allocation

### Sonnet (Analysis & Design)
- Compare Gemini's Four-Layer Strategy vs v9.3.6 approach
- Identify gaps and merge insights
- Validate architectural completeness
- Create detailed technical specifications
- Verify plan completeness for Opus handoff

### Opus (Implementation)
- Implement all 4 layers
- Update prompt templates with hard limits and injected code
- Create validation schema and gates
- Implement two-turn workflow
- Run production tests and verify enforcement
- Update documentation and knowledge graph

---

## Related Documentation

- **Case Study:** [ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md](../ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md)
- **Implementation Plan:** [docs/plans/v9.3.7-guardrail-enforcement-fix.md](../../plans/v9.3.7-guardrail-enforcement-fix.md)
- **Existing Guardrails:** `bo_output-validator.md`, `bo_bullet-generation-instructions.md`
- **Lessons Learned:** `docs/lessons-learned/process/`

---

## Dependencies

- Requires v9.3.6 to be complete (guardrail registry exists)
- Requires Gemini's Four-Layer analysis (input from external review)
- No blocking dependencies on other concurrent work
