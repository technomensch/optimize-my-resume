# Optimize My Resume - Roadmap

## Current Version: v5.1.0
## In Development: v6.0.0

---

## v6.0.0 - Complete Workflow System (In Progress)

**Branch:** `v6.0-complete_workflow_system`

**Implementation Approach:** Split into 4 phases due to token budget constraints (241K → 203K tokens)

### Phase Breakdown

#### ✅ v6.0.1 - Foundation (COMPLETE)
**Branch:** `v6.0.1-foundation` | **Status:** Complete | **Date:** 2025-12-28

**Files Created:**
- [x] `shared/phase-1/job-history-v2-creation.md` - 12-section schema
- [x] `shared/phase-1/jd-parsing-17-point.md` - 17-point JD parser with hard/soft skill classification
- [x] `shared/phase-1/entry-router.md` - 5-scenario routing logic

**Notes:** Foundation modules created but not yet integrated into modes.

---

#### ✅ v6.0.2 - Core Integration (COMPLETE)
**Branch:** `v6.0.2-core-integration` | **Status:** Complete | **Date:** 2025-12-29

**Files Created:**
- [x] `shared/phase-2/evidence-matching.md` - Requirement-by-requirement gap analysis with evidence citations

**Files Modified:**
- [x] `PROJECT-INSTRUCTIONS.md` - Mode 1 enhancement (v2.0 schema generation, next steps guidance)
- [x] `modes/mode-3-jd-comparison.md` - 17-point parser integration, evidence matching, blocking gates
- [x] `modes/mode-2-bullet-optimization.md` - v2.0 backward compatibility with upgrade recommendations

**Notes:** Core integration complete. Modes 1 and 3 now use v2.0 schema. Mode 2 supports both v1.0 and v2.0 formats.

---

#### ✅ v6.0.3 - Router & Workflows (COMPLETE)
**Branch:** `v6.0.3-router-workflows` | **Status:** Complete | **Date:** 2025-12-29

**Files Created:**
- [x] `shared/phase-3/workflow-router.md` - Complete 8-scenario routing system
- [x] `shared/phase-3/incremental-updates.md` - Add/edit/remove positions (created by Opus)
- [x] `shared/phase-3/re-comparison.md` - JD re-comparison with diff output (created by Opus)
- [x] `jd_parsed/` - Cache directory for parsed JDs

**Files Modified:**
- [x] `PROJECT-INSTRUCTIONS.md` - Added entry point routing section with 8 scenarios
- [x] `.gitignore` - Added jd_parsed/ to ignore cached JDs

**Features:**
- [x] Intelligent routing with JD validation (anti-false-positive)
- [x] Incremental updates (add/edit/remove positions without full re-analysis)
- [x] JD re-comparison with diff output (improvements, regressions, score delta)
- [x] Override commands (re-analyze, start fresh, add position)
- [x] Two-step clarification for ambiguous input

**Notes:** Router & workflows complete. System now auto-detects user intent and confirms before executing. Users can incrementally update job history and re-run JD comparisons with change tracking.

---

#### 📋 v6.0.4 - Summary & Polish (PLANNED)
**Branch:** `v6.0.4-summary-polish` | **Status:** Planned

**Files to Create:**
- [ ] `shared/phase-4/summary-generation.md` - Master + per-JD summaries

**Files to Modify:**
- [ ] `docs/CHANGELOG.md` - v6.0.0 entry
- [ ] `settings.json` - v6.0 configuration

---

**Test Coverage Required:**
- JD missing fields handling (8 tests)
- Ambiguous skills classification (10 tests)
- Location parsing (7 tests)
- Router intent detection (6 tests)

---

## v6.1.0 - Polish & Edge Cases (Future)

**Planned Features:**
- [ ] Summary generator edge cases
- [ ] Enhanced error messages (E001-E008)
- [ ] Output specification templates (ensure consistent output across LLMs)
  - Exact templates for each output type
  - Formatting rules (no emojis, bullet styles, spacing)
  - Required vs optional sections
  - Character limits where applicable

**Removed from scope:**
- ~~State recovery (checkpoints, undo)~~ - Not possible without environment control. File-based persistence only.

---

## v6.2.0+ - Resume Generation (Future)

**Planned Features:**
- [ ] Generate tailored resume from job history based on JD
- [ ] Job board-specific resume formats (Indeed, LinkedIn, etc.)
- [ ] Role-specific resume generation (select which roles to include)

**Architecture Decision (2025-12-28):**
> Multi-track career support was considered for v6.0 but deferred. Instead of maintaining separate "tracks" (PM resume vs Analyst resume), the system will dynamically pull relevant bullets from the complete job history based on JD requirements. This is a cleaner architecture that avoids track management complexity.

---

## Backlog (Unprioritized)

- [ ] Batch JD comparison (compare resume to multiple JDs at once)
- [ ] Keyword frequency analysis (after 3+ JD comparisons, show most-requested skills)
- [ ] Incremental position updates (add/edit/remove single positions)
- [ ] JD re-comparison with diff output (show changes after updating job history)
- [ ] Export job history to different formats (JSON, PDF, etc.)

---

## Completed

### v5.1.0 - Remote Work Validation
- [x] Remote/Hybrid/On-Site classification
- [x] Fake-remote detection
- [x] State residency restrictions
- [x] Location mismatch blocking gate

### v5.0.0 - Initial System
- [x] Mode 1: Full Resume Analysis
- [x] Mode 2: Bullet Optimization
- [x] Mode 3: JD Comparison
- [x] Job History Schema v1.0

---

**Last Updated:** 2025-12-29 (Marked v6.0.3 complete - workflow router with incremental updates and re-comparison)
