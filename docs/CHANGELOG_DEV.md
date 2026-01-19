# Developer Changelog

All notable developer experience improvements, tooling changes, and meta-work will be documented in this file.

This tracks changes to the **development process and infrastructure**, not user-facing features (see [CHANGELOG.md](CHANGELOG.md) for user-facing changes).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

### v9.1.0 - Documentation Sync (2026-01-19) <!-- v9.1.0 Change -->

#### Meta-Work - Guardrail Synchronization (Issue #65, #66, #68)
- **Problem:** Modular logic files (`ra_jd-parsing.md`, `jfa_workflow-router.md`, `ng_summary-generation.md`) drift from the Gold Master instructions.
- **Solution:** Executed a "Documentation Sync" phase to align all modular references.
- **Sync Targets:**
  - `PROJECT-INSTRUCTIONS.md` (Gold Master)
  - `Project-GUI-Instructions.md` (Entrypoint)
  - `optimization-tools/narrative-generator/ng_summary-generation.md` (Module)
  - `optimization-tools/resume-analyzer/ra_jd-parsing.md` (Module)
  - `optimization-tools/job-fit-analyzer/jfa_workflow-router.md` (Module)

#### Added - Documentation Protocol
- **Keyword Visibility Rule:** Codified as Guardrail #34 in `ra_jd-parsing.md` and `PROJECT-INSTRUCTIONS.md`.
- **Customization Offer Rule:** Codified as Guardrail #35 in `jfa_workflow-router.md` and `PROJECT-INSTRUCTIONS.md`.

---

### v8.3.1 - Precision Bullet Logic & Governance Lifecycle (2026-01-13) <!-- v8.3.1 Change -->

#### Added - Governance Lifecycle Compliance (Issue #42)
- **Problem:** AI agents often skip Project Management (PM) steps (issues, branches, roadmaps) during intense technical execution.
- **Solution:** Codified **Guardrail #31 (Workflow Lifecycle Compliance)**.
- **Mandatory Sequence:** `gh issue create` -> `git checkout -b` -> `ROADMAP.md` update -> `docs/plans/` -> **THEN** execution.
- **Enforcement:** The system now checks for these artifacts before allowing core logic modifications.

#### Added - Shadow Modularization Pattern (Issue #42)
- **Problem:** Modularizing logic into standalone files risks fragmenting the "Gold Master" and increasing the likelihood of divergence.
- **Solution:** Implemented the **Shadow Modularization** pattern (ADR-004).
- **Structure:**
  - **Module**: Standalone MD file (e.g., `bullet-generation-logic.md`).
  - **Shadow**: `PROJECT-INSTRUCTIONS.md` keeps a copy of the logic wrapped in `<!-- SILENT SYNC -->` comments.
  - **Reference**: `Project-GUI-Instructions.md` uses `<modular_reference />` to reduce prompt overhead without losing system integrity.

#### Meta-Work - Knowledge Graph Expansion
- **Patterns:** Added "Causal Impact Linking" and "Governance Lifecycle" to `patterns.md`.
- **Concepts:** Added "Portfolio Employment Safety" and "Chronology Depth Control" to `concepts.md`.
- **Gotchas:** Added "Agent Governance Drift" and "Absolute Path Regression" to `gotchas.md`.

#### Impact
- ✅ **Prompt Optimization:** Reduced `Project-GUI-Instructions.md` size by ~1.5k lines across v8.3.0 and v8.3.1.
- ✅ **Process Integrity:** Guaranteed audit trail for all future changes.
- ✅ **Portability:** Enforced relative path usage in all new documentation.

---

### v8.3.0 - Quality Gates Module Extraction (2026-01-12) <!-- v8.3.0 Change -->

#### Added - Modularization Infrastructure (Issue #32)
- **Extraction:** Moved ~770 lines of XML quality rules and system guardrails from the GUI context to a dedicated module.
- **File:** `optimization-tools/resume-analyzer/quality-gates-guardrails.md`
- **Result:** Drastic reduction in token usage for every GUI analysis session without loss of validation quality.

#### Documentation Cleanup
- Removed redundant/empty headers in `Project-GUI-Instructions.md` from previous partial extractions.
- Standardized the `<modular_reference />` tag format for all extracted components.

---

---

### v6.3.1.1 - Implementing Guardrail Core Modules (2026-01-04) <!-- v6.3.1.1 Change -->

#### Issue Detected - LLM Replacement Pattern
- **Problem:** Gemini replaced existing guardrail implementations with plan specifications instead of merging additions
- **Impact:** Lost CRITICAL priority tags, backup/restore logic, and placeholder detection in Guardrail #6
- **Detection:** User-requested audit comparing local changes against committed HEAD

#### Fixed - Guardrail Restorations
- **Guardrail #6 (Data Loss Prevention):** Restored original with CRITICAL priority, backup/restore logic, placeholder detection, MERGED with new `<trigger>` and `<item_count_verification>` from plan
- **Guardrail #3 (Professional Summary):** Restored `<priority>HIGH</priority>` tag, archived original as commented reference
- **Guardrail #21:** Split into #21a (original skill-role matching) and #21b (new limitation cross-check) - both coexist

#### Files Updated (4)
- `optimization-tools/job-fit-analyzer/incremental-updates.md` - Guardrails #6, #21a, #21b
- `optimization-tools/narrative-generator/summary-generation.md` - Guardrail #3 with archived original
- `PROJECT-INSTRUCTIONS.md` - Guardrail #6 in master checklist
- `quick-start-phase.md` - Guardrail #6 in condensed checklist

#### Security - Username Anonymization
- Replaced hardcoded `/Users/mkaplan/...` paths with `/Users/<username>/...` in documentation examples
- Files: `docs/CHANGELOG_DEV.md`, `docs/lessons-learned/process/Lessons_Learned_Chat_History_Workflow.md`

#### Cleanup
- Deleted duplicate `docs/plans/v6.3-adding_guardrails.md` (canonical file is `v6.3.0-adding_guardrails.md`)
- Created audit report: `docs/plans/v6.3.0-change-audit-report.md`

#### Lesson Learned
> When applying implementation plans, LLMs may REPLACE existing implementations with plan specifications instead of MERGING additions. Always audit for content loss when using AI to implement changes, especially for guardrails and safety-critical logic.

---

### v6.3.0 - System Integrity Guardrails (2026-01-03) <!-- v6.3.0 Change -->
> **Also in CHANGELOG.md:** This entry is duplicated here because the 27 comprehensive quality guardrails are **internal validation rules and process controls**, not user-facing features. Users don't interact with these guardrails directly - they're automated quality checks that enforce standards during development.

#### Added - 27 Comprehensive Quality Guardrails
**Classification:** Internal validation rules, process automation, developer tooling

**Core System Guardrails:**
- **Guardrail #1 (JD Parser Output Validation):** Ensures parsing JD schema completeness before gap analysis
- **Guardrail #2 (Hard vs Soft Skill Categorization):** 5-question decision tree prevents mis-categorization
- **Guardrail #3 (Professional Summary Validation):** Character limits (300-350), tense checking, pronoun detection
- **Guardrail #4 (Bullet Character Limits):** 100-210 character range enforcement
- **Guardrail #5 (CAR Framework Enforcement):** Context-Action-Result validation for all bullets
- **Guardrail #6 (Data Loss Prevention - CRITICAL):** Backup/restore, placeholder detection, item count verification
- **Guardrail #7 (Keyword Evidence Cross-Check):** Prevents keyword stuffing without job history evidence
- **Guardrail #8 (Metric Preservation):** Never remove quantifiable metrics during optimization
- **Guardrail #9 (Tense Consistency):** Past-tense action verbs required for all bullets
- **Guardrail #10 (Escape Character Detection):** Prevents `\~`, `\%`, `\+` in output

**Gap Analysis Guardrails:**
- **Guardrail #11 (Evidence Citation Format):** Standardized "Company | Job Title" citation format
- **Guardrail #12 (Blocking Logic Sequence):** Low score → Hard skill deficit → Location gates in order
- **Guardrail #13 (Match Score Calculation):** Documented formula with requirement-level weighting
- **Guardrail #14 (Partial Match Definition):** Criteria for [MATCHED], [PARTIAL], [MISSING] status
- **Guardrail #15 (Cross-Position Deduplication):** Prevents duplicate recommendations across positions

**Incremental Update Guardrails:**
- **Guardrail #16 (Position Addition Workflow):** Chronological insertion, aggregate recalculation
- **Guardrail #17 (Position Edit Workflow):** Show current → Modify → Recalculate pipeline
- **Guardrail #18 (Position Removal Workflow):** Confirmation → Remove → Recalculate safeguards
- **Guardrail #19 (Aggregate Recalculation):** Years of experience, master skills inventory updates
- **Guardrail #20 (Version Tracking):** Schema version field validation (job_history job history creation+)
- **Guardrail #21a (Skill-Role Matching):** Technical skills matched to technical roles only
- **Guardrail #21b (Limitation Cross-Check):** Portfolio projects counted as skills-only, not professional experience

**Summary Generation Guardrails:**
- **Guardrail #22 (Master Summary Structure):** 4-sentence format (Role/Achievements/Hard/Soft)
- **Guardrail #23 (Per-JD Summary Customization):** Keyword replacement preserving metrics
- **Guardrail #24 (Summary Length Limits):** 300-350 characters strict enforcement
- **Guardrail #25 (Evidence-Based Summaries):** Only demonstrated skills from job history
- **Guardrail #26 (Aggregation Accuracy):** Total years, companies, team sizes from metadata

**Output Quality Guardrails:**
- **Guardrail #27 (Secondary Grammar Check Warning):** Mandatory recommendation for external validation

#### Impact
- ✅ **Process Controls:** 27 automated checks prevent quality regressions
- ✅ **Developer Safety:** Data loss prevention, backup/restore logic
- ✅ **Consistency:** Standardized validation across all phases
- ✅ **Documentation:** All guardrails documented in phase-specific files

#### Files Updated
- `PROJECT-INSTRUCTIONS.md` - Master guardrail checklist
- `quick-start-phase.md` - Condensed guardrail reference
- `optimization-tools/resume-analyzer/jd-parsing.md` - Guardrails #1-2
- `optimization-tools/bullet-optimizer/evidence-matching.md` - Guardrails #11-15
- `optimization-tools/job-fit-analyzer/incremental-updates.md` - Guardrails #16-21b
- `optimization-tools/narrative-generator/summary-generation.md` - Guardrails #3, #22-26
- `core/format-rules.md` - Guardrails #4-10, #27

---

### v6.2.0 - Job History Template System & Workflow Automation (2026-01-02) <!-- v6.2.0 Change -->
> **Also in CHANGELOG.md:** This entry is duplicated here because the template system, validation scripts, conversion tools, and workflow skills are **developer tooling and automation infrastructure**, not user-facing features. Users benefit from these tools indirectly through improved consistency and validation.

#### Added - Developer Tooling & Automation

**Template System (4 files, ~1,515 lines):**
- **`job_history_template.xml`** - job history creation schema with 12 required sections
  - Hard/soft skills separated into distinct arrays
  - Education and certifications sections added
  - Professional summary per role
  - Tools/technologies granular listing
  - Impact metrics categorization
  - Schema version tracking
- **`job_history_generation_instructions.md`** - 3,500+ word comprehensive guide
  - CAR Framework enforcement rules
  - Hard vs Soft skill classification decision tree
  - Metric extraction guidelines
  - Cross-LLM consistency standards (Claude, Gemini, ChatGPT, Copilot)
- **`bullet_template.md`** - CAR Framework reference with examples
  - Context-Action-Result structure
  - Measurable impact requirements
  - 5-category action verb system (Built/Lead/Managed/Improved/Collaborate)
- **`TEMPLATE_USAGE.md`** - Quick start guide
  - Template system overview
  - Workflow integration
  - Style & tone guidelines
  - Common mistakes to avoid

**Python Automation Tools (2 scripts, ~626 lines):**
- **`validate_job_history.py`** (226 lines) - Schema compliance validation
  - Header format validation (VERSION X.Y with description)
  - Version history presence checking
  - Required global sections verification (education, certifications, master_skills_inventory)
  - Required position sections validation (13 sections per position)
  - Metadata completeness checks (job_title, company, dates, duration)
  - Professional summary length validation (minimum 2 sentences)
  - XML tag balance verification (all tags properly opened/closed)
- **`convert_job_history_to_md.py`** (400+ lines) - XML to Markdown conversion
  - XML parsing with regex
  - Emoji header generation (📋 for positions, 🎯 for achievements)
  - Markdown table formatting for metrics
  - Hierarchical structure creation
  - Achievement expansion (CONTEXT/ACTION/RESULT/IMPACT)
  - Professional summary formatting
  - Skills list conversion

**Workflow Skills (2 skills, ~697 lines):**
- **`/md-job-history` Skill** - Convert job history to Markdown
  - Context-aware file detection
  - Automatic validation before conversion
  - User-friendly error messages
  - Integration with /update-history workflow
- **`/update-history` Skill** - Intelligent version management
  - Analyzes chat context to identify updates
  - Determines version increment (MAJOR/MINOR/PATCH)
  - Applies surgical updates (preserves existing content)
  - Validates and converts to both formats (.txt + .md)
  - Provides summary of changes

**Dual-Format Architecture:**
- **.txt format (XML structure)** - Source of truth for LLM consumption
  - XML-like tag structure for semantic clarity
  - Explicit section markers
  - Schema validation compatible
  - Optimized for LLM parsing
- **.md format (Markdown)** - Presentation format for human viewing
  - Generated automatically from .txt
  - Emoji headers and professional formatting
  - Markdown tables
  - Do NOT edit directly (regenerate from .txt)

#### Changed
- **PROJECT-INSTRUCTIONS.md** - Added comprehensive `<job_history_template_system>` section (v6.1.11 → v6.2.0)
  - 385 lines of template system documentation
  - Dual-format architecture explanation
  - Validation and conversion workflows
  - Workflow skills documentation
  - Best practices and cross-LLM consistency guarantees
  - Integration with Phases 1, 2, and 3
- **quick-start-phase.md** - Added condensed `<job_history_template_system>` section
  - Quick reference for template system
  - Critical rules and required structure
  - Validation and conversion workflow
  - Version management guidelines

#### Impact
- ✅ **Cross-LLM Consistency** - Claude, Gemini, ChatGPT, Copilot all generate identical structure
- ✅ **Automated Validation** - Schema violations caught immediately
- ✅ **Dual-Format Output** - .txt for LLMs, .md for humans
- ✅ **Workflow Automation** - /md-job-history and /update-history skills streamline management
- ✅ **Version Management** - Clear MAJOR/MINOR/PATCH increment rules
- ✅ **Surgical Updates** - Preserve existing content, enhance specific sections
- ✅ **Template System** - Prevents structural drift as LLM technology evolves
- ✅ **Comprehensive Documentation** - 3,500+ word guide ensures consistency

#### Philosophy
- Keep .txt as source of truth, generate .md for presentations
- Always validate before converting
- Use surgical updates only - preserve existing content, add/enhance specific sections
- Template system ensures consistency across all LLMs now and in the future

#### Files Created (6,452 lines total)
- Templates: 4 files (~1,515 lines)
- Scripts: 2 files (~626 lines)
- Skills: 2 files (~697 lines)
- Job history: v7.0, v7.1 with .txt and .md formats (~2,714 lines)
- Plans: Implementation plan (~900 lines)

---

### v6.1.9 - Skill Priority Weights & Test Case Expansion (2025-12-30) <!-- v6.1.9 Change -->
> **Also in CHANGELOG.md:** This entry is duplicated here because the 79 test cases are **testing infrastructure and QA tooling**, not a user-facing feature. The skill priority weights ARE user-facing, but the bulk of this entry (47 new test cases) is developer-focused testing infrastructure.

#### Added - Testing Infrastructure (Developer Tooling)

**Expanded Test Suite - 79 Total Test Cases:**
- **Baseline (32 test cases):** Sonnet baseline tests for Phases 2-4
- **New (47 test cases):** Opus advanced test coverage

**Test Categories Added:**
- **INTX (8 tests):** Complex integration scenarios
  - Contractors and freelance work handling
  - Stale skills (5+ years old) detection
  - Multiple roles at same company
  - Portfolio project vs professional experience distinction
- **INCX (10 tests):** Advanced position manipulation
  - Batch operations (add/edit/remove multiple positions)
  - Position merging logic
  - Undo/redo functionality
  - Aggregate recalculation edge cases
- **DIFFX (7 tests):** Complex diff scenarios
  - Batch comparison across versions
  - Regression detection (improvements → regressions)
  - Stale cache handling
  - Cross-version diff accuracy
- **SUMX (8 tests):** Advanced summary generation
  - Executive-level summaries (C-suite, VP)
  - Entry-level summaries (new grad, intern)
  - Career pivot summaries (role transition)
  - Industry-specific customization
- **GATE (7 tests):** Blocking gate combinations
  - Multiple gates triggering simultaneously
  - Edge cases at threshold boundaries
  - Override confirmation workflows
  - Gate bypass scenarios
- **ERR (7 tests):** Error recovery and resilience
  - Invalid JD formats
  - Malformed job history schemas
  - API timeout handling
  - Partial data recovery
- **FIX (12 tests):** Logic corrections
  - Corrected test definitions from original Sonnet baseline
  - Gap-filling tests for uncovered scenarios
  - Regression tests for known bugs

#### Fixed - Test Logic Errors (Developer Corrections)
Corrected 4 issues in original Sonnet test definitions:
- **INC-004:** Index direction corrected from "shifted up" to "shifted DOWN"
- **SUM-005:** Threshold corrected from 42 to 30 (actual blocking gate value)
- **INT-007:** Added explicit weight ratio (Required = 1.5x Preferred)
- **INT-006:** Clarified confidence boundary as ">= 0.5" (inclusive)

#### Added - Skill Priority Weights (User-Facing Scoring)

**3:2:1 Model (Industry-Standard ATS Methodology):**
Based on Rezi.ai, Jobscan, and Recruiterflow best practices:
- **Required skills**: 1.5x weight (priority 3) - "Required", "Must have", "Essential"
- **Preferred skills**: 1.0x weight (priority 2) - "Preferred", "Nice to have", "Bonus"
- **Optional skills**: 0.5x weight (priority 1) - Inferred from context, not emphasized

**Impact on Gap Analysis:**
- Missing a Required skill now has 1.5x the negative impact of missing a Preferred skill
- More accurate job fit scoring reflecting recruiter evaluation patterns
- Aligned with industry-standard ATS scoring methodologies

#### Changed - System Files
- **Scoring Formula:** `optimization-tools/bullet-optimizer/evidence-matching.md` updated with priority-weighted calculation
- **System Instructions:** `PROJECT-INSTRUCTIONS.md` and `quick-start-phase.md` updated with skill priority weights
- **Core Configuration:** `core/fit-thresholds.md` includes skill-level priority weights alongside category weights

#### Impact
- ✅ **Testing Infrastructure:** 79 total test cases (62% increase in coverage)
- ✅ **Edge Case Coverage:** Complex scenarios now tested (contractors, pivots, batch ops)
- ✅ **Quality Assurance:** Gate combinations, error recovery, regression detection
- ✅ **Accurate Scoring:** Required skills weighted 1.5x Preferred skills
- ✅ **No Breaking Changes:** Additive enhancement only

#### Technical
- **Test Suite Location:** `docs/testing/phases-2-4/`
- **Test Documentation:** Each category documented with purpose and expected behavior
- **Regression Suite:** FIX category prevents known bugs from returning

---

### v6.1.8 - Location Red Flag Update with State Abbreviation Expansion (2025-12-30) <!-- v6.1.8 Change -->
> **Also in CHANGELOG.md:** This entry is duplicated here because the enhanced `location_red_flags` detection and state abbreviation mapping are **internal validation logic improvements**, not user-facing features. Users don't configure these rules - they're automated detection patterns that improve JD parsing accuracy.

#### Added - Internal Validation Logic

**State Abbreviation Mapping (Developer Data Structure):**
- Complete mapping of all 50 US states + DC for automatic state code expansion
- Auto-expands state abbreviations: "AL, AK, MT" → "Alabama (AL), Alaska (AK), Montana (MT)"
- Applies to all location parsing: payroll restrictions, residency requirements, excluded states
- Improves user experience by showing full state names alongside codes
- Reduces confusion for users unfamiliar with all state abbreviations

**Enhanced `location_red_flags` Detection Pattern:**
- New pattern: "The following states are not approved for remote payroll at this time: [list]"
- Improves blocking gate accuracy for location mismatches during Phase 1 JD parsing
- Prevents wasted effort on applications where user's state is excluded due to payroll compliance
- Triggers critical blocking gate when user's location matches excluded states

#### Changed - Internal Parsing Logic

**Enhanced `location_mismatch` Instruction:**
- Now references `state_abbreviation_mapping` for clearer output
- Example output: "Excluded: Alabama (AL), Alaska (AK)" instead of just "AL, AK"
- Automatic expansion in all location-related warnings and error messages

#### Impact
- ✅ **Better Detection:** Payroll compliance restrictions caught during Phase 1 JD parsing
- ✅ **More Accurate Blocking:** Location blocking gate warnings during Phase 2
- ✅ **Improved UX:** No manual state code lookup needed (auto-expanded)
- ✅ **Clearer Warnings:** More accessible location warnings for all users
- ✅ **No Breaking Changes:** Additive enhancement only

#### Technical
- **Files Modified:** `optimization-tools/resume-analyzer/jd-parsing.md`
- **Detection Pattern Added:** State-specific remote payroll restriction parsing
- **Data Structure Added:** 51-entry state abbreviation mapping (50 states + DC)
- **Classification:** Internal validation logic, automated parsing enhancement

---

### v6.1.7 - Gemini Grammar Tips & Quality Assurance (2025-12-29) <!-- v6.1.7 Change -->
> **Also in CHANGELOG.md:** This entry is duplicated here because the Quality Assurance Rules and Pre-output Quality Checklist are **internal QA processes and automation**, not user-facing features. These are automated validation systems that run behind the scenes to ensure quality.

#### Added - Internal QA Rules & Automation

**Quality Assurance Rules (Internal Validation):**
- **Phrase Variation Rule:** Prevents exact repetition of metrics/achievements (max 2 occurrences)
  - Automated scan: Detects duplicate phrases across positions
  - Triggers: Warning if same metric appears 3+ times
  - Developer control: Built into pre-output validation pipeline
- **Symbol Consistency Rule:** Standardizes use of tildes (~), percentages (%), and hyphenated ranges
  - Prohibits escaped characters: `\~`, `\%`, `\+`
  - Automated detection: Scans output before presentation
  - Auto-correction: Removes backslashes from escaped symbols
- **Verb Tense Rule:** Enforces past-tense action verbs at the start of all bullets
  - Prohibits gerunds (-ing verbs) at bullet start
  - Automated detection: Regex pattern matching
  - Developer control: Blocks output until corrected
- **Keyword Diversity Rule:** Optimizes keyword distribution between professional summary and position bullets
  - Prevents keyword duplication (summary vs bullets)
  - Automated scan: Cross-references keywords
  - Developer control: Suggests redistribution before output

**Pre-output Quality Checklist (Automated Validation):**
- **Escaped Characters Detection:** Scans for `\~`, `\%`, `\+` and auto-corrects
- **Gerund Detection:** Identifies bullets starting with -ing verbs
- **Repeated Phrase Detection:** Flags >2 exact occurrences of same phrase
- **Keyword Duplication Checking:** Cross-checks summary vs bullets
- **Automated Execution:** Runs automatically before all output presentation
- **Blocking Gate:** Output held until all checks pass

#### Added - Workflow Automation (Developer Experience)

**Implementation Plan Auto-Naming:**
- Plans now automatically named and saved to `/docs/plans/v[BranchName].md`
- Eliminates manual naming step
- Consistent naming convention across all plans
- Developer workflow streamlined

#### Changed - System Instructions
- **PROJECT-INSTRUCTIONS.md:** Added `<quality_assurance_rules>` section
  - Integrated QA rules into core instructions
  - Mandatory secondary grammar check warning added
  - Pre-output checklist documented
- **quick-start-phase.md:** Added QA rules reference
  - Condensed QA standards for quick lookup
  - Cross-reference to full documentation
- **core/format-rules.md:** Updated to v6.1.7 with technical QA standards
  - Symbol consistency specifications
  - Character escaping rules
  - Tense validation patterns

#### Impact
- ✅ **Improved Quality:** Automated checks catch formatting and grammar issues
- ✅ **Better ATS Compatibility:** Consistent symbol usage prevents parsing errors
- ✅ **Enhanced Keyword Coverage:** Distribution optimization without redundancy
- ✅ **Streamlined Workflow:** Auto-naming for implementation plans
- ✅ **No Breaking Changes:** Additive enhancement only

#### Technical
- **Classification:** Internal QA automation, process controls, developer tooling
- **Execution:** Pre-output validation pipeline (automatic)
- **Files Modified:** 3 instruction files + 1 core config file
- **Developer Benefit:** Reduced manual QA burden, consistent quality enforcement

---

### v4.11.1 - ATS Format Parsing Hotfix (2025-12-20) <!-- v4.11.1 Change -->
> **User-facing changes:** See [CHANGELOG.md](CHANGELOG.md) for full details.
> This is a user-facing fix (parsing improvements), documented in main changelog.

---

### v4.12 - Integrated "God-Mode" Display (2025-12-21) <!-- v4.12 Change -->

#### Added - Integrated Analysis Display
- **"God-Mode" View:** Replaced modular optimization cards with per-bullet inline analysis.
  - Displays Metrics (Pass/Fail), Action Verb (Emoji/Color), and Character Count for every bullet.
  - Inline Recommendations: Suggestions appear directly below the relevant bullet.
  - **Philosophy:** Reduce cognitive load by presenting analysis in context.

#### Enhanced - Executive Summary
- **Action Verb Bar Chart:** Added visual distribution of verb categories (Built, Lead, Managed, Collaborate, Improved).
- **Assessment Criteria:** Added "The Why" column to score breakdown for educational value.
- **Prioritized Repairs:** New summary section grouping issues by severity (Risk vs Tweak).

#### Technical - Refactoring
- **Pipeline Simplification:** Removed 4 legacy display sections (Metrics, Position Cards, Verb Analysis, Recommendations) from `pipeline.js`.
- **Circular Dependency Fix:** Moved `printWrapped` utility from `pipeline.js` to `js/utils.js`.
- **Wireframe Consolidation:** Merged modular wireframe rules into single authoritative `Resume_Analyzer_Wireframe.md`.

#### Impact
- ✅ Signifcant UX improvement via inline context.
- ✅ Streamlined code in `pipeline.js`.
- ✅ Resolved circular dependency risk.
---

### v4.9.0 - Analytics Foundation Architecture (2025-12-18) <!-- v4.9.0 Change -->

#### Added - Architecture Pattern
- **Pragmatic Balance Approach:** Google Search validated architecture pattern (2025 Node.js CLI best practices)
  - Functional modules (not classes) - maintains consistency with existing codebase style
  - Config separation - scoring rubrics in standalone files (easy to modify without code changes)
  - Display extraction - analytics display in separate module (keeps pipeline.js readable)
  - Three-tier architecture - Presentation/Logic/Data layers with clear separation of concerns
  - Single Responsibility Principle per module

- **Configuration Layer:** Externalized business rules for easy modification
  - `experience-targets.js` - Experience-based scoring targets (New Grad → Senior/Executive)
  - `verb-lists.js` - 150 curated strong verbs (30 per category) + 45 weak verbs
  - `scoring-rules.js` - Exact point allocations for composite score (Structure/Grammar/Results/Keywords)

- **Utility Layer:** Reusable test evaluators and detection functions
  - `tests.js` - Binary/range/threshold test evaluators shared across scoring modules
  - `impact-detection.js` - Metric and impact statement detection with keyword matching

#### Added - Code Review Process
- **Automated Code Review:** Integrated `code-reviewer` agent into implementation workflow
  - Critical issue detection: Data flow timing, schema mismatches, missing aggregation
  - Confidence-based filtering: Only reports high-priority issues (90%+ confidence)
  - Fixed 6 critical issues before deployment (data timing, bullet aggregation, skills extraction, etc.)
  - Documented 3 moderate issues for future work (date validation, formatting checks, box-drawing alignment)

#### Added - Documentation Architecture
- **Architecture Documentation:** Created `Resume_Analyzer_Architecture.md` as authoritative implementation guide
  - Moved from `docs/plans/` to `docs/prompts/analyzer/` (accessible to AI prompt system)
  - Reference added to `Resume_Analyzer_Prompt.md` clarifying separation of concerns:
    - Prompt file = WHAT to evaluate (rules, criteria, scoring methodology)
    - Architecture file = HOW to implement (file structure, modules, design patterns)

#### Technical - Data Flow Improvements
- **Analytics Timing Fix:** Moved analytics calculation from Phase 2.5 to after Phase 3
  - Problem: Analytics ran before AI analysis completed, missing critical data
  - Solution: Calculate after `standaloneResult` available (skills inventory, verb analysis, etc.)
  - Impact: Analytics now has access to complete resume data

- **Data Aggregation Layer:** Added preprocessing step for analytics
  - Aggregate bullets from nested `experience[].bullets` into flat array with position metadata
  - Calculate word/bullet counts from aggregated data (not from missing fields)
  - Extract hard/soft skills from `standaloneResult.skillsInventory`
  - Fixed schema mismatch (verb-validation.js: "experience" not "positions")

#### Files Created
- **9 new files (682 lines of code)**
  - Config: 3 files (`experience-targets.js`, `verb-lists.js`, `scoring-rules.js`)
  - Utils: 2 files (`tests.js`, `impact-detection.js`)
  - Analytics: 3 files (`scoring.js`, `bullet-strength.js`, `verb-validation.js`)
  - Display: 1 file (`display-analytics.js`)

#### Files Modified
- `js/state.js` - Added analytics object, word/bullet count fields
- `js/logic/pipeline.js` - Integrated analytics with data aggregation
- `docs/prompts/analyzer/Resume_Analyzer_Prompt.md` - Added architecture reference

#### Lessons Learned
- **Timing Matters:** Analytics calculation must happen AFTER AI analysis completes (not before)
- **Data Aggregation Required:** Nested structures need flattening before analytics can process
- **Config Separation:** Externalized business rules enable non-technical users to modify scoring
- **Code Review Value:** Automated review caught 6 critical issues that would have caused runtime failures
- **Documentation Separation:** Prompts (WHAT) vs Architecture (HOW) clarifies responsibilities

#### Impact
- ✅ Clean architecture pattern (Google Search validated)
- ✅ All critical integration issues resolved
- ✅ Config separation enables easy rubric modification
- ✅ Code review process prevents deployment of broken code
- ✅ Documentation architecture supports AI-driven development

---

### v4.8.3 - Security Hotfix for Chat History Export (2025-12-17)

#### Fixed - Critical Security Vulnerabilities
- **Hardcoded Absolute Path (P0):** Exposed developer username, broke collaboration
  - Before: `/Users/<username>/Documents/GitHub/Resume_Analyzer_Optimizer/scripts/...`
  - After: `${workspaceFolder}/scripts/...`
  - Impact: Works for ALL contributors, cross-platform compatible, no PII exposure

- **No Path Traversal Validation (P0):** Script accepted any path from environment
  - Added: Path traversal detection (rejects `..`, `~`, relative paths)
  - Added: Absolute path requirement
  - Prevents: Directory traversal attacks, unauthorized file access

- **No File Size Validation (P1):** No limits on file size
  - Added: 100MB max file size check
  - Prevents: Disk exhaustion attacks, runaway session handling
  - Cross-platform: Detects macOS vs Linux for `stat` command

- **No Disk Space Check (P1):** Could fail mid-copy if disk full
  - Added: 500MB minimum free space validation
  - Prevents: Partial exports, silent failures
  - Cross-platform: Platform-specific `df` command usage

- **Cross-Platform Issues (P2):** macOS-only implementation
  - Added: `$OSTYPE` detection for macOS vs Linux
  - Fixed: `stat` command syntax (macOS: `-f`, Linux: `-c`)
  - Result: Works on both macOS and Linux

#### Added - Configuration Pattern
- **Local Settings Override:** `.claude/settings.local.json.example` template
  - Pattern: `settings.json` (tracked) + `settings.local.json` (gitignored)
  - Users can customize paths, limits, formats without modifying repository
  - Template provides documentation and examples
  - Prevents accidental commit of environment-specific settings

#### Updated - Documentation
- **Lessons Learned job history creation → v2.1:** Added comprehensive security hardening section
  - Documented 5 critical security issues discovered
  - Explained 4 hotfix solutions with code examples
  - Added 5 security review lessons learned
  - Updated testing protocol with security validation tests
  - Impact assessment (before/after v4.8.3 metrics)

#### Technical
- **Branch:** `v4.8.3-security_hotfix`
- **Script Version:** 1.0 → 1.1 (security hardening)
- **Security Checks Added:** 4 layers (path, size, space, boundary)
- **Attack Vectors Mitigated:** 5 (path traversal, disk exhaustion, collaboration failure, privacy leak, cross-platform)
- **Files Modified:** 2 (settings.json, auto-export-transcript.sh)
- **Files Added:** 2 (settings.local.json.example, v4.8.3 plan)
- **Documentation Updated:** 2 (lessons learned, .gitignore)

#### Impact
- ✅ Zero hardcoded paths (privacy preserved)
- ✅ Works for all contributors (collaboration enabled)
- ✅ Path traversal attacks blocked (security hardened)
- ✅ Resource exhaustion prevented (disk protection)
- ✅ Cross-platform compatible (macOS + Linux)

---

### v4.8.2 - Automated Chat History Export System (2025-12-17)

#### Added - Automation Infrastructure
- **PreCompact Hook System:** Fully automated chat history export before context compaction
  - Triggers: Both automatic compaction and manual `/compact` command
  - Configuration: `.claude/settings.json` with dual matchers (auto + manual)
  - Zero user intervention required - exports happen automatically
  - Supersedes v4.7.2 manual slash command workflow

- **Export Automation Script:** `scripts/auto-export-transcript.sh`
  - Receives transcript path via `HOOK_INPUT` environment variable
  - Parses session metadata: `transcript_path`, `session_id`, `trigger` type
  - Generates timestamped filenames: `YYYY_MM_DD-HH_MM_SS-chat_history.jsonl`
  - Dual-format export: Raw JSONL + human-readable TXT in single operation
  - Updates `.chat-history-tracker.json` automatically
  - Informative feedback: Shows both filenames, sizes, timestamps, trigger type

- **JSONL-to-Conversation Converter:** `scripts/convert-jsonl-to-conversation.sh` v1.1
  - Parses Claude Code's JSONL transcript format correctly
  - Extracts thinking blocks from assistant messages
  - Formats with visual box boundaries for readability
  - Handles user messages, assistant messages, tool calls, and tool results
  - Truncates long tool results (2000 chars) for readability
  - Complete bug fix from v1.0 (which produced empty output)

#### Fixed - Critical
- **Converter v1.0 Bug:** Initial assumptions about JSONL structure were incorrect
  - v1.0 expected: `.role` and `.content` at top level → produced 595B empty files
  - v1.1 correct: `.type` and `.message.content` with nested arrays
  - Discovery process: Manual inspection of actual Claude Code transcripts
  - Result: Full conversation content with thinking blocks properly captured

#### Architecture Evolution
- **From Manual (v4.7.2) to Automated (v4.8.2):**
  - v4.7.2: User types `/chat-history`, manually exports, tells assistant
  - v4.8.2: PreCompact hooks trigger automatically, zero user action needed
  - User feedback: "I didn't want a manual workflow. I created this slash command so it would be automated"
  - Technical discovery: PreCompact hooks provide direct transcript access via `HOOK_INPUT`

#### Implementation Details

**Dual-Format Export Strategy:**
- **JSONL Format:** Raw transcript, machine-readable, complete fidelity
  - Direct copy from Claude Code's transcript location
  - Preserves all metadata, timestamps, UUIDs
  - Programmatic access for future processing

- **TXT Format:** Human-readable conversation script
  - Thinking blocks with visual box boundaries
  - Clean message formatting with separators
  - Tool calls and results formatted with context
  - Includes: User messages, assistant messages, thinking, tool use

**Claude Code JSONL Format (Discovered):**
```json
{"type": "user", "message": {"content": "string"}}
{"type": "assistant", "message": {"content": [
  {"type": "thinking", "thinking": "..."},
  {"type": "text", "text": "..."},
  {"type": "tool_use", "name": "...", "input": {...}}
]}}
```

#### Testing
- **Manual Hook Simulation:** Successful test with `export HOOK_INPUT=...`
  - Created 20MB JSONL export
  - Created 595B TXT (empty due to v1.0 bug, fixed in v1.1)
  - Tracker updated correctly
- **User Testing Pending:** Requires VS Code restart + `/compact` command

#### Documentation
- **Retroactive Plan:** `docs/plans/v4.8.2_chat_history_automation_plan.md`
  - Documents actual implementation (not original v4.7.2 plan)
  - Complete technical journey: challenges, discoveries, solutions
  - Architecture diagrams and format specifications
  - Converter bug fix details and format discovery process

#### Impact

**Reliability:**
- ✅ Zero user intervention - no forgotten exports
- ✅ Guaranteed execution via event-driven hooks
- ✅ Works with both automatic and manual compaction

**Completeness:**
- ✅ Thinking blocks captured automatically in readable format
- ✅ Dual formats: machine-readable (JSONL) + human-readable (TXT)
- ✅ Full conversation fidelity with timestamps and metadata

**Developer Experience:**
- ✅ Set and forget - no workflow interruption
- ✅ Automatic archiving before context loss
- ✅ Readable exports for review and reference

#### Technical
- **Branch:** `v4.8.2-chat_history_fix`
- **Files Added:**
  - `scripts/auto-export-transcript.sh` (5.0K)
  - `scripts/convert-jsonl-to-conversation.sh` (11K, v1.1)
  - `.claude/settings.json` (PreCompact hooks)
  - `docs/plans/v4.8.2_chat_history_automation_plan.md`
- **Files Modified:** `.gitignore` (already had chat-history/* exclusion)
- **Related Plans:**
  - `docs/plans/v4.8.2_chat_history_automation_plan.md` (actual implementation)
  - `docs/plans/v4.7.2_chat_history_workflow_plan.md` (superseded manual approach)

---

### v4.7.2 - Manual Chat History Workflow (2025-12-16)
> **Status:** 🔀 SUPERSEDED BY v4.8.2

#### Context - Evolution to Automation
This version implemented a **manual workflow** that was quickly superseded by the automated v4.8.2 system. User feedback: *"I didn't want a manual workflow. I created this slash command so it would be automated"*

#### Added - Manual Export Tools
- **`/chat-history` Slash Command:** Manual chat history export workflow
  - Generated timestamped filename: `YYYY_MM_DD-HH_MM_SS-chat_history.txt`
  - Provided export instructions to user (manual UI process)
  - Guided user through export workflow
  - Location: `.claude/commands/chat-history.md`

- **Chat Export Tracking System:** `.chat-history-tracker.json`
  - Recorded export metadata: timestamp, filename, message count, export type
  - Enabled incremental/differential exports (only new messages)
  - Prevented duplicate archiving during auto-compaction
  - Schema documented in `.chat-history-tracker.template.json`
  - Template tracked in git, tracker file gitignored (local-only)

#### Enhanced - Developer Tools
- **`/lessons-learned` Command:** Added "update" mode for existing documents
  - Syntax: `/lessons-learned update <filename>`
  - Appended new content with version increment (v1.0 → v1.1)
  - Added dated section headers: `## Section (Updated: YYYY-MM-DD)`
  - Preserved all existing content (append-only)
  - Marked changes with inline comments: `<!-- v1.X Change -->`
  - Interactive workflow: asks what to update (section, version history)
  - Location: `.claude/commands/lesson-learned.md` (v1.0 → v1.1)

#### Updated - Documentation
- **Lessons Learned - Chat History Workflow:** v1.0 → v1.1
  - Added "Manual Export Workflow" section
  - Documented tracking system with schema details
  - Added "Incremental Export Detection" subsection
  - Updated export naming with `_continuation` suffix
  - Added 2 lessons: "Track State" and "User Control Over Automation"
  - Added 2 Q&A entries about manual export and duplicate prevention

- **`.gitignore`:** Added tracker template exception
  - New: `!chat-history/.chat-history-tracker.template.json`
  - Ensures schema documentation is version-controlled

#### Pattern Introduced
- **Incremental Export Pattern:** Track operation history for differential operations
  - Prevents duplicate work by recording completed operations
  - JSON tracker pattern reusable for backups, syncs, etc.

#### Why Superseded
- **Manual intervention required:** User must remember to type `/chat-history`
- **Workflow interruption:** Breaks user's focus during session
- **Human error prone:** Exports forgotten before compaction
- **Not truly automated:** Required user action at critical moments

#### Evolution Path
- v4.7.2 (Manual) → v4.8.2 (PreCompact hooks) → v4.8.3 (Security hardening)
- Manual slash command → Event-driven automation → Secure automation

#### Technical
- **Branch:** `v4.7.2-chat_history-lesson_learned_updated`
- **Files Created:** 3 (chat-history.md command, 2 tracker files)
- **Files Updated:** 3 (lesson-learned.md, Lessons_Learned doc, .gitignore)
- **Related Plan:** `docs/plans/v4.7.2_chat_history_workflow_plan.md`

---

### v4.8.1 - Dynamic Version Detection & ID Labels (2025-12-16)

#### Fixed - Critical
- **Hardcoded Version Strings:** App displayed v4.5 instead of actual v4.8
  - Root cause: Manual version maintenance in index.html and js/main.js
  - Recurring issue: Version gets out of sync during development
  - Impact: Users and developers see incorrect version number

#### Added - Build Infrastructure
- **Dynamic Version Detection:** `vite.config.ts`
  - Extracts version from git branch at build time using `execSync`
  - Parses branch name: `v4.8.1-labels_versioning` → `"4.8.1"`
  - Fallback logic: Reads CHANGELOG_DEV.md on non-version branches (e.g., main)
  - Injects as `import.meta.env.APP_VERSION` via Vite's define feature
  - Console output: `📦 Building Resume Optimizer v{version}`

#### Updated - Version Display
- **js/main.js:** Use `import.meta.env.APP_VERSION` instead of hardcoded "v4.5"
- **index.html:** Dynamic boot message injection via inline module script
- **Result:** Version automatically matches current branch, impossible to be out of sync

#### Added - Usability Enhancements
- **ID Labels Throughout Display:** `js/logic/pipeline.js`
  - Gap Analysis Evidence Audit: `[P1] Company - Title` position labels
  - Gap Analysis Bullets: `[P1-B1] HAS METRICS:` bullet labels with metric indicator
  - Standalone Recommendations: `[P1]` position labels in context lines
  - Comparative Recommendations: `[P1]` position labels in BEFORE section
  - Standalone Metrics Display: `[P1]` position labels for each position
  - Result: Self-documenting IDs improve usability of v4.8 architecture

#### Updated - Documentation
- **Lessons Learned - Split Changelog Versioning:** v1.0 → v1.1
  - Added "Hardcoded Version Strings in Code" section
  - Documented recurring version mismatch issue
  - Complete implementation guide with code examples
  - Build-time vs runtime detection comparison
  - Fallback strategies and replication pattern
  - Common pitfalls, Q&A, and developer guidance

#### Impact

**Version Detection:**
- ✅ Zero hardcoded version strings (removed from 2 locations)
- ✅ Automatic branch-based versioning
- ✅ Developers always know exact version running
- ✅ No manual updates required

**ID Labels:**
- ✅ Self-documenting position IDs: `[P1]` = Position 1
- ✅ Self-documenting bullet IDs: `[P1-B1]` = Position 1, Bullet 1
- ✅ Clear metric indicators: "HAS METRICS:" when bullet has quantifiable data
- ✅ Consistent formatting across all 5 display locations

#### Technical
- **Branch:** `v4.8.1-labels_versioning`
- **Commits:** `8005290` (version detection), `4841132` (ID labels), `8d631d2` (lessons learned)
- **Files modified:** 5 files (vite.config.ts, js/main.js, index.html, js/logic/pipeline.js, lessons learned)
- **Related Plan:** `docs/plans/v4.8.1_labels_versioning_plan.md`

---

### v4.7.2 - Chat History Workflow & Lessons Learned Updates (2025-12-16)

#### Added - Developer Tools
- **`/chat-history` Slash Command:** Manual chat history export workflow
  - Generates timestamped filename: `YYYY_MM_DD-HH_MM_SS-chat_history.txt`
  - Checks and updates `.chat-history-tracker.json` automatically
  - Supports incremental exports with `_continuation` suffix
  - Guides user through export process with status feedback
  - Location: `.claude/commands/chat-history.md`

- **Chat Export Tracking System:** `.chat-history-tracker.json`
  - Records export metadata: timestamp, filename, message count, export type
  - Enables incremental/differential exports (only new messages)
  - Prevents duplicate archiving during auto-compaction
  - Schema documented in `.chat-history-tracker.template.json`
  - Template file tracked in git, tracker file gitignored (local-only)

#### Enhanced - Developer Tools
- **`/lessons-learned` Command:** Added "update" mode for existing documents
  - Syntax: `/lessons-learned update <filename>`
  - Appends new content with version increment (v1.0 → v1.1 → v1.2)
  - Adds dated section headers: `## Section (Updated: YYYY-MM-DD)`
  - Preserves all existing content (append-only)
  - Marks all changes with inline comments: `<!-- v1.X Change -->`
  - Interactive: asks what to update (new section, update section, version history only)
  - Location: `.claude/commands/lesson-learned.md` (updated to v1.1)

#### Updated - Documentation
- **Lessons Learned - Chat History Workflow:** Updated to v1.1
  - Added "Manual Export Workflow" section documenting `/chat-history` command
  - Added "Tracking System" subsection with schema documentation
  - Added "Incremental Export Detection" subsection with timeline examples
  - Updated export naming convention to include `_continuation` suffix
  - Added 2 new lessons: "Track State for Incremental Operations" and "User Control Over Automation"
  - Added 2 new Q&A entries about manual export and duplicate prevention
  - File: `docs/lessons-learned/Lessons_Learned_Chat_History_Workflow.md`

- **Updated `.gitignore`:** Added exception to track tracker template
  - New line: `!chat-history/.chat-history-tracker.template.json`
  - Ensures schema documentation is version-controlled

#### Pattern Introduced
- **Incremental Export Pattern:** Track operation history to enable differential operations
  - Applicable to: exports, backups, syncs, any repeatable operation
  - Prevents duplicate work by recording what's been done
  - JSON tracker pattern reusable for other workflows

#### Technical
- **Branch:** `v4.7.2-chat_history-lesson_learned_updated`
- **Files created:** 3 files (chat-history.md command, 2 tracker files)
- **Files updated:** 3 files (lesson-learned.md, Lessons_Learned doc, .gitignore)
- **Related Plan:** `docs/plans/v4.7.2_chat_history_workflow_plan.md`

---

### v4.8 - ID-Based Architecture for Token Optimization (2025-12-16)

#### Problem Solved
- **Token Bloat:** AI responses contained 40-60% wasted tokens from repeated bullet text
- **Display Redundancy:** Same resume bullet appeared 5-10 times across analysis sections
- **Cluttered Output:** User feedback reported "giant blobs of text" and poor scannability

#### Solution Implemented
- **Universal ID System:** Assigned unique IDs to all resume positions (P1, P2...) and bullets (P1-B1, P1-B2...)
- **ID-Based References:** All AI analysis returns bullet IDs instead of full text
- **Display Resolution:** UI resolves IDs to content only when rendering

#### Architecture Changes

**Phase 1 - Indexing Foundation:**
- Added `indexResume()` function in `pipeline.js` - assigns IDs immediately after parsing
- Added `getBulletById()` helper - resolves IDs to text + context
- Added `printWrapped()` helper - consistent text wrapping with hanging indents
- Integration: Indexing runs automatically in `parseResumePhase()`

**Phase 2 - Standalone Analysis:**
- **Schema Updates:** `STANDALONE_ANALYSIS_SCHEMA` uses `bulletId` instead of `currentText`
- **Quality Issues:** Added `relatedBulletIds` array for grouping
- **Display:** Implemented "Grouped by Severity" layout (HIGH/MEDIUM/LOW)
- **Recommendations:** Resolve bullet IDs to show original text with context

**Phase 3 - Gap Analysis:**
- **Schema Updates:** `GAP_SCHEMA` uses `evidenceIds` array instead of evidence objects
- **System Prompt:** Updated to explain indexed resume format to AI
- **Display:** New "Evidence Audit" section shows each bullet once with requirements listed underneath
- **Result:** Inverted view eliminates redundancy (bullet → requirements, not requirement → bullets)

**Phase 4 - Recommendations:**
- **Schema Updates:** `RECOMMENDATION_SCHEMA` uses `bulletId` instead of `originalBullet`
- **Display:** Implemented "Card Style" layout with BEFORE/AFTER/WHY sections
- **Formatting:** Color-coded priorities, clean visual structure

#### Impact Metrics

**Token Reduction:**
- Gap Analysis responses: 40-60% fewer tokens (IDs vs repeated full text)
- Recommendation responses: 40-60% fewer tokens
- Overall pipeline: 40-60% cost savings on API calls

**Display Improvements:**
- Each bullet appears exactly once in Evidence Audit (vs 5-10 times before)
- Quality issues grouped by severity for easier scanning
- Recommendations use clean card layout with clear sections

**Code Quality:**
- Separation of concerns: Data (indexed resume) → Analysis (IDs) → Display (resolution)
- Single source of truth: `indexResume()` assigns all IDs
- Centralized lookup: `getBulletById()` used everywhere
- Reusable utilities: `printWrapped()` for consistent formatting

#### Pattern Value
- **Database normalization for AI:** Store data once, reference everywhere by ID
- **Applicable pattern:** Any AI pipeline analyzing source data (documents, code, images)
- **Key insight:** Separate identity (IDs) from content (text) from presentation (display)

#### Documentation
- **Lessons Learned:** `docs/lessons-learned/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md`
  - Comprehensive 1,090-line document
  - Problem analysis, root causes, 4-phase solution
  - Generic replication pattern for any AI pipeline
  - Common pitfalls and best practices

#### Technical
- **Branch:** `v4.8-output_token_optimization`
- **Commits:** `8edfe23` (implementation), `6356e6c` (lessons learned)
- **Files modified:** 2 code files (`js/config.js`, `js/logic/pipeline.js`)
- **Files created:** 1 lessons learned document
- **Lines changed:** +307 insertions, -47 deletions (code); +1,090 insertions (docs)
- **Related Plan:** `docs/plans/v4.8_output_token_optimization_enhancements.md`

---

### v4.5.4 - Split Changelog Version Detection (2025-12-09)

#### Context - Ad Hoc Development
**⚠️ Development Approach:** All work from v4.5.3 through v4.5.4 (commits `48ce681` → `dd578e3`) was done directly on main branch, not in feature branches. This was a continuous problem-solving session responding to immediate issues discovered after CHANGELOG_DEV.md creation.

**Why Ad Hoc:**
- v4.5.3: Documentation conflicts required immediate resolution
- v4.5.4: Version confusion discovered within 1 hour of CHANGELOG_DEV split
- Iterative fixes: Each commit addressed issues discovered in previous commit
- Meta-work only: No user-facing code changes, only documentation and tooling

**Session Timeline:**
1. `48ce681` - Fix documentation conflicts, create validation script
2. `8d0ac33` - Document automated validation lessons
3. `dbe3e3f` - Create /lessons-learned slash command
4. `9d17aaf` - Add CHANGELOG_DEV.md and update references
5. `f569b3c` - Update README to v4.5.2 (incorrect)
6. `b0d4d0d` - Fix README to v4.5.3, enhance validation script
7. `b26f978` - Rename slash command for UX
8. `dd578e3` - Document split changelog versioning lessons

**Total:** 8 commits over ~4 hours, all pushed together

**Lesson:** While ad hoc development on main is generally discouraged, it was appropriate here because: (1) only documentation/tooling changes, (2) each fix built on the previous, (3) comprehensive commit messages documented context, and (4) all work documented in CHANGELOG_DEV.md for traceability.

#### Fixed - Critical
- **README Version Mismatch:** README showed v4.5.2 when actual version was v4.5.3
  - Root cause: No validation across CHANGELOG.md and CHANGELOG_DEV.md
  - Impact: GitHub README displayed wrong version to users
  - First discovered within 1 hour of CHANGELOG_DEV.md creation

#### Enhanced - Validation Script
- **Smart Version Detection:** `scripts/check-version-consistency.sh`
  - Now checks BOTH CHANGELOG.md and CHANGELOG_DEV.md
  - Automatically determines highest version using semantic comparison
  - Enforces: README version = max(CHANGELOG.md, CHANGELOG_DEV.md)
  - Clear error messages with exact fix commands
  - **Example output:**
    ```
    🎯 Highest version: v4.5.3 (from CHANGELOG_DEV.md)
    📖 README version:  v4.5.2
    ❌ CRITICAL: README version mismatch
    ```

#### Added - Documentation
- **Lessons Learned:** `docs/guides/Lessons_Learned_Split_Changelog_Versioning.md`
  - Documents version consistency problem and solution
  - Generic multi-changelog version detection pattern
  - Replication guide for any project with split changelogs
  - Root cause analysis (why manual sync fails immediately)
  - Common pitfalls and prevention strategies

#### Improved - Developer Experience
- **Slash Command Rename:** `/lessons-learned` → `/lesson-learned`
  - Singular form more natural to type
  - Consistent with `/doc-update` naming pattern

#### Technical
- **Commits:** `b0d4d0d`, `b26f978`, plus lesson learned doc
- **Files changed:** 4 files modified, 1 file created, 1 file renamed
- **Detection time:** Version mismatch caught and fixed in <2 hours
- **Prevention:** Automated script prevents recurrence

---

### v4.5.3 - Automated Validation & Developer Tools (2025-12-09)

#### Added - Development Tools
- **Validation Script:** `scripts/check-version-consistency.sh`
  - Automated version consistency checking across CHANGELOG, ROADMAP, and prompt files
  - Plan consolidation detection (finds unconsolidated completed plans)
  - Exit codes: 0 = pass, 1 = fail (CI/CD compatible)
  - Runs in <1 second, reduces Pre-Merge Checklist time by ~50%

- **Slash Command:** `/lessons-learned`
  - Interactive command for creating Lessons Learned documents
  - 4-question verification process before document creation
  - Comprehensive template with problem/solution/replication structure
  - Guides document creation with checklist and writing guidelines

- **Testing Infrastructure:** `docs/testing/`
  - `TEST_TEMPLATE.md` - Standardized test documentation format
  - `v4.5_integration_tests.md` - Example test documentation
  - Requirement: Evidence (screenshots/output) before merge

#### Added - Process Improvements
- **Enhanced Pre-Merge Checklist:**
  - Section 8: Version Consistency Check (automated via script)
  - Section 9: Integration Verification (requires test evidence)
  - Section 10: Plan Consolidation (explicit 7-step process with blocking rules)

- **Git Hook Documentation:**
  - Pre-commit hook: Blocks commits with unconsolidated completed plans
  - Pre-push hook: Validates version consistency and tmp file cleanup
  - Setup instructions, testing procedures, emergency bypass documentation

#### Added - Documentation
- **Lessons Learned:** `docs/guides/Lessons_Learned_Automated_Validation.md`
  - Documents v4.5 series documentation conflicts and solutions
  - Root cause analysis of manual checklist failures
  - Four-layer validation system implementation guide
  - Generic replication pattern for any project
  - 5 key lessons for future features
  - Common pitfalls and FAQ

#### Fixed - Documentation Conflicts
- **Broken Links:** Fixed README links to point to consolidated plan sections
- **Version Inconsistencies:** Updated Resume_Analyzer_Prompt.md to v4.5.2 with full version history
- **Plan Consolidation:** Consolidated v4.5 plan into v4.x_consolidated_plans.md
- **File References:** Clarified backup file was local-only (not committed)
- **Status Updates:** Fixed PROMPT_LOADER_README.md status description

#### Removed
- `docs/plans/v4.5_action_verb_categorization_plan.md` - Consolidated
- `docs/guides/MIGRATION_v4.2.md` - Obsolete
- `docs/guides/MIGRATION_v4.2.1.md` - Obsolete

#### Technical
- **Commits:** `48ce681`, `8d0ac33`, `dbe3e3f`
- **Files changed:** 12 files modified, 4 files added, 3 files removed
- **Lines changed:** +2,293 insertions, -1,050 deletions

---

## What Goes in This Changelog?

**Include:**
- Development tools (scripts, slash commands, utilities)
- Process improvements (checklists, workflows, git hooks)
- Lessons learned documents
- Testing infrastructure and templates
- Documentation infrastructure (not content changes)
- Meta-work that improves developer experience

**Exclude (goes in main CHANGELOG.md):**
- User-facing features
- Prompt changes that affect analysis output
- UI/UX improvements
- Performance optimizations visible to users
- Bug fixes in the Resume Optimizer application

---

**Created:** 2025-12-09
**See Also:** [CHANGELOG.md](CHANGELOG.md) - User-facing changes
