# Issue & Enhancement Tracker

This document tracks active issues and enhancements for the Optimize My Resume project.

---

## Active Enhancements

### ENH-001: Model Selection for Bullet Regeneration

**Status:** 🔴 ACTIVE
**Type:** Enhancement
**Priority:** Medium
**Created:** 2026-01-25
**Assigned:** Unassigned
**Branch:** `ENH-001-model-regeneration`

**Quick Summary:**
Allow users to select a different LLM model and regenerate bullets without re-running comparison.

**Documentation:** [docs/enhancements/ENH-001/](enhancements/ENH-001/)

**Progress:**
- [x] Investigation complete
- [x] Solution proposed
- [ ] Implementation started
- [ ] Testing complete
- [ ] Documentation updated
- [ ] Merged to main

---

### ENH-008: Agent Governance Module (Logic Extraction)

**Status:** 🔴 ACTIVE
**Type:** Governance / Infrastructure
**Priority:** High
**Created:** 2026-01-29
**Assigned:** Unassigned
**Branch:** `v9.3.5.5-enh-008-gov-sync`

**Quick Summary:**
Extract dev-only and agent-governance rules (G42, Git Policy, Modularity) from the human-facing Gold Master to a dedicated modular reference.

**Documentation:** [docs/governance/agent-governance.md](governance/agent-governance.md)

**Progress:**
- [x] Audit & Rule Identification
- [x] Creation of modular governance file
- [x] Shadow Sync implementation in PROJECT-INSTRUCTIONS.md
- [ ] Final Validation
- [ ] Merged to main

---

## Active Issues

### Issue #79: GUI Customized Bullets Using Wrong Context

**Status:** 🔴 ACTIVE (v9.2.7 - Implementation)
**Type:** Bug
**Priority:** High
**Created:** 2026-01-22
**Branch:** `v9.2.7-issue-79-error-handling`

**Quick Summary:**
Multi-attempt issue: Null-coalescing (v9.2.5), Exact matching (v9.2.6), Error handling + Model switching (v9.2.7).

**Current Status:**
- v9.2.7: Error handling + ENH-001 implemented
- v9.2.8: Progress display + error feedback implemented
- Status: Ready for testing on Claude (local Ollama models had issues)

**Plans:**
- [v9.2.6: Fuzzy matching](plans/v9.2.6-issue-79-fuzzy-matching.md) ✅
- [v9.2.7: Error handling + ENH-001](plans/v9.2.7-issue-79-error-handling.md) 🎯

**Documentation:** [docs/issues/issue-79/](issues/issue-79/)

**Progress:**
- [x] v9.2.5: Null-coalescing (not the root cause)
- [x] v9.2.6: Fuzzy matching (implemented)
- [x] v9.2.7: Error handling + ENH-001 (implemented)
- [x] v9.2.8: User-visible progress & error feedback (implemented)
- [ ] Testing complete
- [ ] Merged to main

---

## Completed

### [v9.3.5.4] ENH-007: Skills Inventory Prep
**Local ID:** `ENH-007-prep` | **Status:** 🔴 ACTIVE
**Type:** Hardening / Infrastructure
**Description:** Preparing logic baseline for Evidence-Only Skills Inventory (Section 12 citations). Local-only.

### [v9.3.6] Guardrail Hardening & Layered Defense
**Local ID:** `issue-85` | **GitHub Issue:** [#97](https://github.com/technomensch/optimize-my-resume/issues/97)
**Status:** 🔴 ACTIVE (STRATEGY PIVOT)
**Type:** 🛡️ Hardening
**Initial Resolution:** 2026-01-28
**Production Failure:** 2026-01-29 21:00 UTC - ALL documentation-based enforcement bypassed
**Strategy Pivot:** 2026-01-30 - Layered Defense Strategy replacing documentation-only approach

**Quick Summary:**
After production failure proved documentation cannot force compliance, pivoting to Layered Defense Strategy with multiple redundant enforcement mechanisms per platform.

**Documentation:** [docs/issues/issue-85/](issues/issue-85/)

**Progress:**
- [x] v9.3.5.x: Documentation-based enforcement (FAILED in production)
- [x] Root cause analysis complete
- [x] Layered Defense Strategy pattern documented
- [x] Implementation plan created for Gemini
- [ ] Phase 1: Chat Interface Layers
- [ ] Phase 2: Claude Project Layers
- [ ] Testing and validation

---

### [v9.3.7] Issue #98: Guardrail Enforcement Fix (Four-Layer Strategy)

**Local ID:** `issue-98` | **GitHub Continuations:** [#97](https://github.com/technomensch/optimize-my-resume/issues/97), [#99](https://github.com/technomensch/optimize-my-resume/issues/99), [#101](https://github.com/technomensch/optimize-my-resume/issues/101)
**Status:** 🔴 ACTIVE (Planning Phase)
**Type:** 🛡️ Hardening (Critical Bug Fix)
**Priority:** CRITICAL
**Created:** 2026-01-30
**Branch:** `v9.3.7-guardrail-enforcement-fix`
**Plan:** [v9.3.7-guardrail-enforcement-fix.md](plans/v9.3.7-guardrail-enforcement-fix.md)

**Quick Summary:**
Fix critical enforcement bypass from v9.3.6 by implementing Four-Layer Enforcement Strategy: Structural Prompt Logic (hard limits), "Proof of Work" Schema (validation gates), Workflow Multi-Turn (constraint validation pause), and Modular Injection (literal guardrail code in prompts).

**Documentation:** [docs/issues/issue-98/](issues/issue-98/)

**Key Facts:**
- v9.3.6 enforcement system completely bypassed in production (2026-01-29)
- User spent 2 days hardening guardrails that were ignored
- Root cause: Passive instructions cannot prevent LLM drift
- Solution: Move from documentation to structural constraints

**Progress:**
- [x] Planning and issue documentation complete
- [x] Four-Layer strategy designed
- [ ] Sonnet analysis: Compare with Gemini insights
- [ ] Opus implementation: All 4 layers
- [ ] Production testing: Verify enforcement works
- [ ] Merged to main

**Task Allocation:**
- **Sonnet:** Analysis & design (compare Gemini strategy, validate completeness)
- **Opus:** Implementation & testing (build 4 layers, production test)

### [v9.3.4] ENH-006: Unified Multi-Agent Workflow System
**Status:** ✅ COMPLETE
**Type:** Enhancement
**Resolved:** 2026-01-28
**Resolution:** Consolidated skills into `.agent/workflows`, established SymSync, and enforced naming policy. GitHub Issue #95.

### [v9.3.0-v9.3.3] ENH-002 to ENH-005: Bullet Generation Overhaul
**Status:** ✅ COMPLETE
**Type:** Enhancement
**Resolved:** 2026-01-28
**Resolution:** Established logic hub (ENH-004), strategic planning (ENH-003), and component integration (ENH-005) for the generation core.

### [v9.3.5.4] ENH-007-prep: Format-Agnostic Skills Inventory baseline
**Status:** 🔴 ACTIVE
**Type:** Enhancement (Prep)
**Resolution:** [WIP] Defining on-the-fly positional tagging and evidence gating for raw resume inputs. Local only.

---

## Legend

| Status | Meaning |
|--------|---------|
| 🔴 ACTIVE | Work in progress |
| 🟡 BLOCKED | Waiting on something |
| 🟢 RESOLVED | Fixed, pending merge |
| ✅ COMPLETE | Merged to main |
