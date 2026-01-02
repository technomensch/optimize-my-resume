# Optimize My Resume - Roadmap

## Current Version: v6.2.0 <!-- v6.2.0 Change -->
## In Development: v6.3.0 <!-- v6.2.0 Change -->

---

## v6.0.0 - Complete Workflow System (COMPLETE) <!-- v6.0.0 Change: Marked complete -->

**Branch:** `v6.0-complete_workflow_system`

**Implementation Approach:** Split into 4 phases due to token budget constraints (241K → 203K tokens)

### Phase Breakdown

#### ✅ v6.0.1 - Foundation (COMPLETE)
**Branch:** `v6.0.1-foundation` | **Status:** Complete | **Date:** 2025-12-28

**Files Created:**
- [x] `phases/phase-1/job-history-v2-creation.md` - 12-section schema
- [x] `phases/phase-1/jd-parsing-17-point.md` - 17-point JD parser with hard/soft skill classification
- [x] `phases/phase-1/entry-router.md` - 5-scenario routing logic

**Notes:** Foundation modules created but not yet integrated into modes.

---

#### ✅ v6.0.2 - Core Integration (COMPLETE)
**Branch:** `v6.0.2-core-integration` | **Status:** Complete | **Date:** 2025-12-29

**Files Created:**
- [x] `phases/phase-2/evidence-matching.md` - Requirement-by-requirement gap analysis with evidence citations

**Files Modified:**
- [x] `PROJECT-INSTRUCTIONS.md` - Phase 1 enhancement (v2.0 schema generation, next steps guidance)
- [x] `phases/phase-2/` - 17-point parser integration, evidence matching, blocking gates
- [x] `phases/phase-3/` - v2.0 backward compatibility with upgrade recommendations

**Notes:** Core integration complete. Phases 1 and 3 now use v2.0 schema. Phase 2 supports both v1.0 and v2.0 formats.

---

#### ✅ v6.0.3 - Router & Workflows (COMPLETE)
**Branch:** `v6.0.3-router-workflows` | **Status:** Complete | **Date:** 2025-12-29

**Files Created:**
- [x] `phases/phase-3/workflow-router.md` - Complete 8-scenario routing system
- [x] `phases/phase-3/incremental-updates.md` - Add/edit/remove positions (created by Opus)
- [x] `phases/phase-3/re-comparison.md` - JD re-comparison with diff output (created by Opus)
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

**Notes:** Router & workflows complete. System now auto-detects user intent and confirms before executing. Users can incrementally update job history and re-run JD comparisons with change tracking. (Note: These features were previously in the backlog and are now fully implemented).

---

#### ✅ v6.0.4 - Summary & Polish (COMPLETE) <!-- v6.0.0 Change -->
**Branch:** `v6.0.4-summary-polish` | **Status:** Complete | **Date:** 2025-12-29 <!-- v6.0.0 Change -->

**Files Created:** <!-- v6.0.0 Change -->
- [x] `phases/phase-4/summary-generation.md` - Master + per-JD summaries (created by Opus, 646 lines) <!-- v6.0.0 Change -->

**Files Modified:** <!-- v6.0.0 Change -->
- [x] `docs/CHANGELOG.md` - Complete v6.0.0 release entry with 4-phase documentation <!-- v6.0.0 Change -->
- [x] `PROJECT-INSTRUCTIONS.md` - Updated to v6.0.0 with release notes <!-- v6.0.0 Change -->
- [x] `ROADMAP.md` - Marked v6.0.4 complete, updated current version <!-- v6.0.0 Change -->

**Features:** <!-- v6.0.0 Change -->
- [x] Professional summary generation (master + per-JD customization) <!-- v6.0.0 Change -->
- [x] 3-4 sentence structure with metrics and skills <!-- v6.0.0 Change -->
- [x] Keyword optimization based on JD requirements <!-- v6.0.0 Change -->
- [x] Complete v6.0.0 release documentation <!-- v6.0.0 Change -->

**Notes:** Phase 4 complete. All v6.0 features implemented and documented. System now includes complete workflow from entry routing through summary generation. <!-- v6.0.0 Change -->

---

**Test Coverage Required:**
- JD missing fields handling (8 tests)
- Ambiguous skills classification (10 tests)
- Location parsing (7 tests)
- Router intent detection (6 tests)


---

## v6.1.0 - Documentation Enhancement (COMPLETE)

**Branch:** `v6.1.0` | **Status:** Complete | **Date:** 2025-12-29

### Sub-Versions
- ✅ v6.1.1 - Folder restructure (`/shared/` → `/phases/`)
- ✅ v6.1.2 - Documentation updates (terminology + Job Summary guide)
- ✅ v6.1.3 - Wireframe creation (10 files)
- ✅ v6.1.4 - Legacy archival
- ✅ v6.1.5 - Test case gap-filling
- ✅ v6.1.6 - Gemini grammar tips & quality assurance
- ✅ v6.1.7 - Mandatory secondary grammar check warning
- ✅ v6.1.8 - Location red flag update with state abbreviation expansion
- ✅ v6.1.9 - Skill priority weights (3:2:1 model) & test case expansion (79 tests)

### Features
- [x] Job Summary usage guide in README
- [x] Terminology consistency (Mode → Phase)
- [x] 10 comprehensive wireframes (ASCII + Mermaid)
- [x] 30+ new test cases for Phases 2-4
- [x] Legacy file archival to /docs/legacy/
- [x] Comprehensive Quality Assurance Rules (phrase variation, symbol consistency, verb tense, keyword diversity)
- [x] Automated implementation plan workflow

**Notes:** Documentation-focused release improving user experience and developer onboarding. Completes terminology alignment started with `/phases/` folder rename. v6.1.7 adds critical grammar, quality assurance standards, and mandatory proofreading warnings.

---

## v6.2.0 - Job History Template System & Workflow Automation (COMPLETE) <!-- v6.2.0 Addition -->

**Branch:** `v6.2.0-job-history-templates` | **Status:** Complete | **Date:** 2026-01-02 <!-- v6.2.0 Addition -->

### Overview
Comprehensive template infrastructure ensuring cross-LLM consistency for job history generation. Dual-format architecture (.txt for LLMs, .md for humans) with automated validation and conversion tools.

### Files Created (6,452 lines total)
**Templates (4 files):**
- [x] `templates/job_history_template.xml` - XML schema defining exact structure all LLMs must follow
- [x] `templates/job_history_template.md` - Markdown presentation format structure
- [x] `templates/LLM_GENERATION_INSTRUCTIONS.md` - 3,500+ word comprehensive guide for all LLMs
- [x] `templates/README.md` - Complete template system documentation

**Python Scripts (2 files):**
- [x] `scripts/validate_job_history.py` - 226 lines, ensures schema compliance
- [x] `scripts/convert_job_history_to_md.py` - 400+ lines, converts .txt to .md

**Workflow Skills (2 files):**
- [x] `.claude/skills/md-job-history.md` - /md-job-history skill for conversion
- [x] `.claude/skills/update-history.md` - /update-history skill for version management

**Job History Updates:**
- [x] `chat-history/claude_generated_job_history_summaries_v7.0.txt` - JSON/Power Platform additions
- [x] `chat-history/claude_generated_job_history_summaries_v7.1.txt` - Template system achievements
- [x] Corresponding .md files for both versions

**Documentation:**
- [x] `docs/plans/v6.2.0_job-history-templates_plan.md` - Implementation plan (~900 lines)

### Files Modified
- [x] `PROJECT-INSTRUCTIONS.md` (v6.1.11 → v6.2.0) - Added 385-line `<job_history_template_system>` section
- [x] `quick-start-phase.md` (v6.1.11 → v6.2.0) - Added condensed template system reference
- [x] `docs/CHANGELOG.md` - Comprehensive v6.2.0 entry
- [x] `ROADMAP.md` - This file (marked v6.2.0 complete)

### Features Implemented
**Template System:**
- [x] XML schema with 13 required sections per position
- [x] Standardized tag names (no synonyms allowed)
- [x] Mandatory section ordering
- [x] Standardized date formats
- [x] Cross-LLM consistency guarantees

**Automation Tools:**
- [x] Validation script with 7 check categories
- [x] Conversion script with emoji headers, tables, hierarchical structure
- [x] /md-job-history workflow skill
- [x] /update-history workflow skill with surgical update philosophy

**Version Management:**
- [x] MAJOR/MINOR/PATCH increment rules
- [x] Surgical updates (preserve existing content)
- [x] Chat context analysis
- [x] Automatic validation and conversion

### Impact
- ✅ Cross-LLM consistency (Claude, Gemini, ChatGPT, Copilot)
- ✅ Automated schema validation
- ✅ Dual-format output (.txt for LLMs, .md for humans)
- ✅ Workflow automation streamlines management
- ✅ Template system prevents structural drift

**Notes:** Template system provides infrastructure for consistent job history generation across all current and future LLMs. The 3,500+ word instruction guide ensures any AI assistant can generate identical structure.

---

## v6.3.0 - Polish & Edge Cases (Future) <!-- v6.2.0 Change -->

**Planned Features:**
- [ ] Summary generator edge cases
- [ ] Enhanced error messages (E001-E008)
- [ ] Output specification templates for resume bullets (ensure consistent output across LLMs)
  - Exact templates for each output type
  - Formatting rules (no emojis, bullet styles, spacing)
  - Required vs optional sections
  - Character limits where applicable

**Removed from scope:**
- ~~State recovery (checkpoints, undo)~~ - Not possible without environment control. File-based persistence only.

---

## v6.4.0+ - Resume Generation (Future) <!-- v6.2.0 Change -->

**Planned Features:**
- [ ] Generate tailored resume from job history based on JD
- [ ] Job board-specific resume formats (Indeed, LinkedIn, etc.)
- [ ] Role-specific resume generation (select which roles to include)

**Architecture Decision (2025-12-28):**
> Multi-track career support was considered for v6.0 but deferred. Instead of maintaining separate "tracks" (PM resume vs Analyst resume), the system will dynamically pull relevant bullets from the complete job history based on JD requirements. This is a cleaner architecture that avoids track management complexity.

---

## v6.1.8 - Location Red Flag Update with State Abbreviation Expansion (COMPLETE)

**Branch:** `v6.1.8-location_red_flag_update` | **Status:** Complete | **Date:** 2025-12-30

**Changes:**
- [x] Enhanced location_red_flags to detect state-specific remote payroll restrictions
- [x] Added state abbreviation mapping (50 states + DC) with auto-expansion
- [x] Updated location_mismatch instruction to reference state mapping
- [x] Improved blocking gate accuracy for location mismatches

**Impact:**
- Users get explicit warnings for jobs with payroll compliance restrictions
- State abbreviations automatically expanded to full names (e.g., "AL" → "Alabama (AL)")
- Better user experience - no need to decode state codes manually

---

## v6.1.9 - Skill Priority Weights & Test Case Expansion (COMPLETE) <!-- v6.1.9 Change -->

**Branch:** `v6.1.9-gap-analysis_test-cases` | **Status:** Complete | **Date:** 2025-12-30

**Changes:**
- [x] Added 3:2:1 skill priority weights (Required=1.5x, Preferred=1.0x, Optional=0.5x)
- [x] Updated scoring formula in `evidence-matching.md` with priority-weighted calculation
- [x] Added `<skill_priority_scoring>` to PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- [x] Expanded test suite: 79 tests for Phases 2-4 (Sonnet baseline + Opus expansion)
- [x] Created FIX series correcting 4 Sonnet logic errors
- [x] Reorganized testing folder: `v6.1.5-testing/` → `testing/`

**Files Modified:**
- `core/fit-thresholds.md` (v5.0 → v5.1)
- `phases/phase-2/evidence-matching.md` (v1.0 → v1.1)
- `PROJECT-INSTRUCTIONS.md` (v6.1.7 → v6.1.9)
- `quick-start-phase.md` (v6.1.7 → v6.1.9)

**Test Files:**
- `docs/plans/testing/phase-1-test-cases.md` (95+ Phase 1 tests)
- `docs/plans/testing/phase-2-4-test-cases.md` (79 Phase 2-4 tests)
- `docs/plans/testing/test-results.md` (execution results)

**Impact:**
- More accurate match scoring that reflects recruiter evaluation priorities
- Missing a Required skill now has 1.5x the negative impact of missing a Preferred skill
- Comprehensive test coverage for all phases

---

## v6.1.11 - Keyword Evidence Principle & Enhanced Quality Controls (COMPLETE) <!-- v6.1.11 Change -->

**Branch:** `v6.1.11-various_fixes` | **Status:** Complete | **Date:** 2025-12-31

**Changes:**
- [x] Added keyword_evidence_principle to core_principles (critical priority)
- [x] Added keyword_input_handling section for WITH-JD and AFTER-bullets scenarios
- [x] Updated PROJECT-INSTRUCTIONS.md (v6.1.10 → v6.1.11)
- [x] Updated quick-start-phase.md (v6.1.9 → v6.1.11)
- [x] Updated core/format-rules.md (v6.1.10 → v6.1.11)

**Files Modified:**
- `PROJECT-INSTRUCTIONS.md` - Added keyword_evidence and keyword_input_handling
- `quick-start-phase.md` - Added keyword_evidence and keyword_input_handling
- `core/format-rules.md` - Version bump
- `docs/CHANGELOG.md` - Added v6.1.11 entry
- `ROADMAP.md` - Current version update

**Keyword Evidence Features:**
- Cross-references keywords against job history before optimization
- Only includes keywords evidenced in position tools/skills/achievements
- Exception: User can explicitly confirm unevidenced skills
- Prevents keyword stuffing without backing evidence

**Keyword Input Handling Features:**
- Handles keywords provided WITH JD or AFTER bullet generation
- Categorizes keywords: ✓ EVIDENCED, ✗ NOT EVIDENCED, ? UNCLEAR
- Outputs keyword coverage report
- Asks user confirmation for unevidenced keywords

**Impact:**
- Prevents keyword stuffing and maintains resume authenticity
- Ensures keywords only included when backed by actual job history
- Transparent reporting of which keywords were/weren't incorporated
- Better alignment between resume content and actual experience

---

## v6.1.10 - Automatic Quality Gate & Plain Text Export (COMPLETE) <!-- v6.1.10 Change -->

**Branch:** `v6.1.10-fix_2nd_pass` | **Status:** Complete | **Date:** 2025-12-31

**Changes:**
- [x] Added `<automatic_quality_gate>` section to PROJECT-INSTRUCTIONS.md with 4-step enforcement
- [x] Added `<automatic_plain_text_export>` section to PROJECT-INSTRUCTIONS.md
- [x] Updated core/format-rules.md with new validation requirements
- [x] Version bump: v6.1.9 → v6.1.10

**Files Modified:**
- `PROJECT-INSTRUCTIONS.md` (v6.1.9 → v6.1.10)
- `core/format-rules.md` (v6.1.7 → v6.1.10)
- `docs/CHANGELOG.md` (added v6.1.10 entry)
- `ROADMAP.md` (current version update)

**Quality Gate Features:**
- Step 1: Run quality checklist (escaped chars, gerunds, repeated phrases)
- Step 2: Verify verb diversity (all 5 categories represented)
- Step 3: Auto-regenerate bullets if issues found (max 3 iterations)
- Step 4: Trigger plain text export after passing

**Plain Text Export Features:**
- Auto-generates `/mnt/user-data/outputs/[job-title]-bullets.txt`
- Clean format: No markdown, proper bullet points (•)
- Includes metadata: character/word counts, verb distribution
- Auto-displayed in response with copy-paste code block

**Impact:**
- Zero quality issues in final output (escaped chars, gerunds, missing verb diversity)
- All 5 verb categories guaranteed in every resume
- No repeated verb categories within same position
- Plain text export auto-generated for easy copy-paste
- Reduced manual formatting work for users

---

## v7.0.0 - Multi-Agent Architecture (Future)

**Planned Features:**
- [ ] Convert Phase files into independent agents with specialized identities
- [ ] Implement Orchestrator/Manager agent logic using `workflow-router.md`
- [ ] Standardize context hand-offs (Write/Select/Compress) between agents
- [ ] Reference Architecture: [Lessons_learned-Context_Engineering_Template.txt](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/docs/lessons-learned/Lessons_learned-Context_Engineering_Template.txt)

---

## Backlog (Unprioritized)

- [ ] Batch JD comparison (compare resume to multiple JDs at once)
- [ ] Keyword frequency analysis (after 3+ JD comparisons, show most-requested skills)
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

**Last Updated:** 2025-12-30 (v6.1.9 - Skill priority weights & test case expansion) <!-- v6.1.9 Change -->
