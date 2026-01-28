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

### ENH-002: Bullet Generation: Process & Knowledge Foundation

**Status:** 🔴 ACTIVE  
**Type:** Enhancement  
**Priority:** High  
**Created:** 2026-01-28  
**Branch:** `v9.3.0-ENH-002-knowledge-foundation`  

**Quick Summary:**
Establish rules and document lessons (Efficiency/Guardrail focus) for personal project metrics.

**Documentation:** [docs/plans/v9.3.0-ENH-002-knowledge-foundation.md](plans/v9.3.0-ENH-002-knowledge-foundation.md)

---

### ENH-003: Bullet Generation: Strategic Planning

**Status:** 🔴 ACTIVE  
**Type:** Enhancement  
**Priority:** Medium  
**Created:** 2026-01-28  
**Branch:** `v9.3.1-ENH-003-strategic-planning`  

**Quick Summary:**
Audit and formalize logic separation between Professional Summary hub and Bullet Hub.

**Documentation:** [docs/plans/v9.3.1-ENH-003-strategic-planning.md](plans/v9.3.1-ENH-003-strategic-planning.md)

---

### ENH-004: Bullet Generation: Logic Hub Implementation

**Status:** 🔴 ACTIVE  
**Type:** Enhancement  
**Priority:** High  
**Created:** 2026-01-28  
**Branch:** `v9.3.2-ENH-004-logic-core`  

**Quick Summary:**
Create a central logic source of truth and enforce Shadow Sync across instruction files.

**Documentation:** [docs/plans/v9.3.2-ENH-004-logic-core.md](plans/v9.3.2-ENH-004-logic-core.md)

---

### ENH-005: Bullet Generation: Component Integration

**Status:** 🔴 ACTIVE  
**Type:** Enhancement  
**Priority:** High  
**Created:** 2026-01-28  
**Branch:** `v9.3.3-ENH-005-component-integration`  

**Quick Summary:**
Hook up local and web GUI components to the new robust logic hub.

**Documentation:** [docs/plans/v9.3.3-ENH-005-component-integration.md](plans/v9.3.3-ENH-005-component-integration.md)

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

_None yet_

---

## Legend

| Status | Meaning |
|--------|---------|
| 🔴 ACTIVE | Work in progress |
| 🟡 BLOCKED | Waiting on something |
| 🟢 RESOLVED | Fixed, pending merge |
| ✅ COMPLETE | Merged to main |
