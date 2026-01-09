# Archived v6.0 Planning Documents

This directory contains the original comprehensive planning documents for v6.0 that were superseded by the modular 4-phase implementation plans.

## Files

### `v6.0-original-comprehensive-plan.md`
- **Created:** 2025-12-28 (Sonnet 4.5)
- **Purpose:** Initial comprehensive plan covering all v6.0 features in a single document
- **Scope:** Complete system design with 10 identified logic issues
- **Token Estimate:** 241,000 tokens (exceeded single-session budget)
- **Why Archived:** Too large for single implementation - split into 4 phases

### `v6.0-implementation-plan.md`
- **Created:** 2025-12-28 (Opus 4.5 review)
- **Purpose:** Deep-dive review of Sonnet's plan with additional findings
- **Key Contributions:**
  - Identified 7 additional issues
  - Added 3 additional workflows (incremental updates, multi-track, re-comparison)
  - Made 10 design decisions (blocking gates, evidence format, etc.)
  - Expanded scope to include keyword frequency analysis
- **Why Archived:** Consolidated into 4 modular plans for phased implementation

## Active Plans

The comprehensive v6.0 work has been broken into 4 implementable phases:

1. **v6.0.1-foundation.md** (53K tokens)
   - Job history schema v2.0
   - Skills categorizer
   - 17-point JD parser

2. **v6.0.2-core-integration.md** (64K tokens)
   - Evidence matcher
   - Mode 1 & 3 enhancements
   - Blocking gates

3. **v6.0.3-router-workflows.md** (49K tokens)
   - Entry point router
   - Incremental updates
   - JD re-comparison

4. **v6.0.4-summary-polish.md** (37K tokens)
   - Professional summary generation
   - Documentation updates
   - Final integration

**Total:** 203K tokens (within 200K per-session budget when split)

## Why Split?

The original comprehensive plan (241K tokens) exceeded Claude Code's single-session token budget. Splitting into 4 phases allows:

- ✅ Each phase fits within budget
- ✅ Natural testing checkpoints
- ✅ Easier rollback if issues arise
- ✅ Incremental progress visibility
- ✅ Parallel development possible

## What Was Preserved?

All features from both the Sonnet and Opus plans were preserved in the 4-phase split:

- ✅ All 10 logic issues addressed
- ✅ All Opus design decisions incorporated
- ✅ All additional workflows included (except multi-track, per Decision 1a)
- ✅ All testing requirements captured

## What Was Removed?

Per Opus review:
- ❌ Multi-track career support (deferred to v6.2+, per Decision 1a)
- ❌ State recovery/checkpoints (not possible, per Decision 9)
- ❌ Performance time targets (per Decision 10)

---

**Archive Date:** 2025-12-28
**Reason:** Superseded by modular 4-phase plans
**Retained Value:** Historical reference, design rationale documentation
