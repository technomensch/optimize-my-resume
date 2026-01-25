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

**Status:** 🔴 ACTIVE (v9.2.7 - Planning)
**Type:** Bug
**Priority:** High
**Created:** 2026-01-22
**Branch:** `v9.2.5-issue-79-attempt-3`

**Quick Summary:**
Multi-attempt issue: Null-coalescing (v9.2.5), Exact matching (v9.2.6), Error handling + Model switching (v9.2.7).

**Current Status:**
- v9.2.6: Fuzzy matching fix applied, tested
- New error: "No JSON found in response" during analysis
- Need: Better error messages + model regeneration (ENH-001)

**Plans:**
- [v9.2.6: Fuzzy matching](plans/v9.2.6-issue-79-fuzzy-matching.md) ✅
- [v9.2.7: Error handling + ENH-001](plans/v9.2.7-issue-79-error-handling.md) 🎯

**Documentation:** [docs/issues/issue-79/](issues/issue-79/)

**Progress:**
- [x] v9.2.5: Null-coalescing (not the root cause)
- [x] v9.2.6: Fuzzy matching (implemented)
- [ ] v9.2.7: Error handling + ENH-001 (planned)
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
