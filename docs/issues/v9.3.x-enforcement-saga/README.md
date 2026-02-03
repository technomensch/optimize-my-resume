# v9.3.x Enforcement Saga

**Status:** 🔄 Active
**Version Range:** v9.3.4 - v9.3.7.1+ (ongoing)
**Related Issues:** #85, #97
**Started:** 2026-01-27
**Last Updated:** 2026-02-02

---

## Quick Links

- [Description](./description.md) - Current understanding and living document
- [Implementation Log](./implementation-log.md) - Complete attempt history
- [Test Cases](./test-cases.md) - Validation scenarios
- [Root Cause Evolution](./analysis/root-cause-evolution.md) - How understanding evolved

---

## Current Status

**Latest Attempt:** [009-n8n-external-orchestration](./attempts/009-n8n-external-orchestration/)
**Status:** 🔄 In Progress (v10 workflow under development)
**Next Action:** Complete n8n v10 prompts, test execution, or pivot to v9.3.8 multi-turn human-in-loop

---

## Attempt Summary

| # | Attempt | Version | Status | Outcome |
|---|---------|---------|--------|---------|
| 001 | Baseline v9.3.5 | v9.3.5 | ✅ | 15/18 hardening items complete |
| 002 | Unified Validation | v9.3.5.2 | ✅ | Single validation source established |
| 003 | Metric Validation | v9.3.5.3 | ✅ | Metric preservation verified |
| 004 | Guardrail Registry | v9.3.5.6 | ✅ | Standardized IDs implemented |
| 005 | Layered Defense | v9.3.6 | ✗ | Never implemented |
| 006 | Four-Layer Strategy | v9.3.7 | ✗ | Jan 29 FAILURE - 0% compliance |
| 007 | Verification | v9.3.7.1 | ✅ | 12 items complete (15a7dae) |
| 008 | Python Validation | — | ⚠️ | Works in IDE only, Platform 1-3 N/A |
| 009 | n8n External Orch | — | 🔄 | v10 in progress (Gemini violating constraints) |

---

## Key Findings

1. **LLM Self-Enforcement Impossible:** All models (Haiku, Opus, Gemini) exhibit identical vibe-coding drift
2. **Platform Compliance Ceiling:** Chat ~30-40%, Claude Project ~50-60%, IDE with validation ~95%+
3. **External Enforcement Required:** Only external systems (Python, n8n) can prevent constraint bypass
4. **Multi-Turn Gateway Pattern:** Human-in-loop gates between turns prevent accumulated constraint violations

---

## Knowledge Graph Links

- [Four-Layer Enforcement Strategy](../../knowledge/patterns.md#four-layer-enforcement-strategy)
- [External Validation Pattern](../../knowledge/patterns.md#external-validation-pattern)
- [Platform-Specific Enforcement Limits](../../knowledge/gotchas.md#platform-enforcement-limits)
- [LLM Self-Enforcement Impossible](../../lessons-learned/enforcement/llm-self-enforcement-limitation.md)

---

**Navigation:** [All Meta-Issues](../) | [Knowledge Graph](../../knowledge/) | [Plans](../../plans/)
