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

### [v9.3.5 / v9.3.5.3] Metric-Only Validation & Deadlock Logic
**Local ID:** `issue-85` | **GitHub Issue:** [#97](https://github.com/technomensch/optimize-my-resume/issues/97)  
**Status:** 🔴 ACTIVE (v9.3.5.3 Hotfix)
**Type:** 🛡️ Hardening
**Initial Resolution:** 2026-01-28
**Hotfix Required:** 2026-01-29 - Logic redundancy (v9.3.5.2) and agentic momentum (v9.3.5.3).  
**Resolution:** [WIP] Implementing Metric-Only Reporting and Deterministic Deadlocks. Continuation of GitHub #96 (ENH-003).

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
