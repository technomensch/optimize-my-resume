# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### v5.1.0 - Remote Work Classification for Job Analysis (2025-12-28) <!-- v5.1.0 Change -->
> **Branch:** `main`

#### Added
- **Location-Based Job Filtering:** Mode 3 (JD Comparison) now evaluates work location requirements as part of preliminary fit assessment
  - Extracts work arrangement constraints from job descriptions (Remote, Hybrid, On-site, geographic restrictions)
  - Categorizes location red flags (state residency requirements, "fake remote" indicators)
  - New Step 5 "location_blocking_gate" stops analysis early for fundamental location mismatches
  - Location alignment now weighted in core qualifications scoring (50% weight category)
  - Saves time by preventing resume optimization for geographically incompatible positions

#### Changed
- **Scoring Methodology:** Core qualifications now includes "Work location/arrangement alignment (remote/hybrid/on-site compatibility)"
- **Matching Criteria:** Added `location_match` and `location_mismatch` criteria to job history comparison

#### Impact
- ✅ Early-exit logic prevents wasted effort on location-incompatible jobs
- ✅ Detects "fake remote" job postings (e.g., "Remote during training, then on-site")
- ✅ Geographic restriction validation (state residency requirements)
- ✅ Tiered blocking: Critical (immediate stop) vs High/Moderate (score reduction)

---

### v4.12.5 - Metrics & Analysis Hotfix (2025-12-21)
> **Branch:** `v4.12.5-hotfix-metrics-analysis`

#### Fixed
- **Metric Analysis Conflicts:** Resolved issue where AI suggested "Add Metrics" even when code analysis found metrics. Now suppresses contradiction or changes to "Refine Metric".
- **Refinement Block:** Restored the "Refinement Opportunities" block at the top of each position (P1, P2...) to group Redundancy, Consolidation, and Reordering suggestions.
- **Ambiguous Labels:** Changed vague "Lead with..." AI suggestions to explicit `[REORDER]` type.
- **Result Clarity:** Improved "Why/Fix" formatting for inline recommendations.

### v4.12.4 - Patch: Severity Labels & Recommendation Visibility (2025-12-21)
> **Branch:** `v4.12.4-patch-count-reasons`

#### Fixed
- **Severity Labels:** Added explicit [HIGH], [MEDIUM], [LOW] prioritization to recommendations.
- **Missing Recommendations:** Fixed issue where AI recommendations were not displaying if strictly separate from analysis.
- **Redundancy Display:** Re-enabled display of redundancy and consolidation findings with "Why/Fix" templates.

### v4.12.3 - Patch: Analysis Layout & Categorization (2025-12-21)
> **Branch:** `v4.12.3-patch-anaylsis-updates`

#### Fixed
- **Header Ordering:** Adjusted layout to place Contact Info and Professional Summary immediately after Executive Summary.
- **Education Warning:** Now explicitly warns if Education section is missing, rather than failing silently.
- **Recommendation Labels:** Switched from generic `[AI]` prefix to specific types (`[CONDENSE]`, `[REWRITE]`) based on content.
- **Collaborative Verbs:** Improved detection of "verb + with" patterns to correctly categorize as Collaboration.

### v4.12.0 - Integrated Analysis Display (2025-12-21)
> **Branch:** `v4.12-display_enhancements`

#### Added
- **Integrated Analysis ("God Mode"):** Unified display combining visual validation (Metrics/Action/Length) with AI-driven recommendations inline per bullet.
- **Action Verb Bar Chart:** HTML-style bar chart in terminal illustrating distribution of 5 verb categories.
- **Prioritized Repairs Summary:** Top-level checklist of Blocker/Risk/Tweak issues.

#### Changed
- **Modular cards deprecated** in favor of integrated inline view.
- **Executive Summary** refined to include Verb Diversity chart directly.

---

### v4.11.4 - Adverb Category Naming Correction (2025-12-20)
> **Branch:** `v4.11.4-hotfix-adverb-list`

#### Fixed
- **Category Naming Mismatch:** Corrected adverb category names to match wireframes and display logic
  - Root cause: v4.5 implementation incorrectly named categories (Creation/Leadership/Achievement/Improvement/Analysis)
  - Wireframes and `pipeline.js` already used correct names (Built/Lead/Managed/Collaborate/Improved)
  - Analytics modules (`verb-lists.js`, `verb-validation.js`) and prompts were using wrong names
  
#### Changed
- **Category Names Updated:**
  - Creation → Built (Blue 🔵)
  - Leadership → Lead (Yellow 🟡)
  - Achievement → Managed (Purple 🟣)
  - Improvement → Improved (Green 🟢)
  - Analysis → Collaborate (Pink 🩷)
  
- **Verb List Updates:**
  - Managed category now focuses on oversight, resource coordination, and operational control
  - Collaborate category focuses on partnership, teamwork, and cross-functional cooperation
  
#### Technical
- **Files Modified:** `js/analytics/config/verb-lists.js`, `js/analytics/verb-validation.js`, `docs/prompts/analyzer/Resume_Analyzer_Prompt.md`, `README.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`
- **Related Plan:** `docs/plans/v4.11.4-hotfix-adverb-list.md`

---

### v4.11.3 - Bullet Character Limit Synchronization (2025-12-20)
> **Branch:** `v4.11.3-hotfix_bullet_char`

#### Fixed
- **False-Positive Length Errors:** Prioritized Repairs no longer reports "exceeds 150 characters" for bullets within the valid 100-210 range
  - Root cause: `quality-checks.js` used outdated `maxChars: 150` while `scoring.js` was updated to 100-210 in v4.11.2
  - Synchronized `BULLET_LENGTH_THRESHOLDS` constant to match scoring.js compliance range

#### Changed
- **Bullet Length Thresholds** in `quality-checks.js`:
  - `minChars`: 30 → 50 (aligned with idealMin for consistency)
  - `maxChars`: 150 → 210 (aligned with scoring.js upper bound)
  - `idealMin`: 50 → 100 (matches scoring.js compliance range start)
  - `idealMax`: 120 → 210 (matches scoring.js compliance range end)

#### Technical
- **Files Modified:** `js/analytics/quality-checks.js`, `docs/plans/v4.11_analytics_validation_plan.md`
- **Related Plan:** `docs/plans/v4.11.3-hotfix_bullet_char.md`

---

### v4.11.2 - ATS Score Calculation Fix (2025-12-20)
> **Branch:** `v4.11.2-hotfix-ats_format_score`

#### Fixed
- **ATS Format Score Stuck at 6/40:** Score now correctly reflects section presence and content metrics
  - Root cause: Parser stores data at root level (`parsedResume.experience`) but scoring expected nested structure (`parsedResume.sections.experience`)
  - Auto-mapping now populates `sections` object from root fields in `indexResume()`
  - Synced `bulletCount` and `wordCount` to `parsedResume` object before scoring

#### Enhanced
- **Bullet Character Length Standard:** Updated from 60-180 to 100-210 characters
  - Better alignment with ATS parsing requirements and professional resume standards
  - Affects Content Quality scoring (Character Length Compliance component)
  
- **Executive Summary Breakdown:** Added sub-component visibility for all 4 scoring categories
  - **ATS Format:** Shows breakdown of Section Presence, Order, Bullet Count, Word Count
  - **Content Quality:** Shows Character Length, Date Format, Formatting Style
  - **Quantifiable Impact:** Shows Metric Density, Impact Statements
  - **Skills & Keywords:** Shows Hard Skills, Soft Skills, Distribution
  - Integrated into existing purple-bordered table (not separate display)

#### Impact
- ATS Format Score accurately awards points for section presence (20pts), section order (10pts), bullet count (5pts), and word count (5pts)
- Resumes with valid structure now receive appropriate scores instead of near-zero
- Users now see **why** each category scored as it did with specific sub-component feedback

#### Technical
- **Files Modified:** `js/logic/pipeline.js`, `js/analytics/scoring.js`, `js/logic/display-analytics.js`
- **Wireframe Updated:** `docs/prompts/analyzer/wireframes/01_Executive_Summary.md` (v1.1)
- **Related Plan:** `docs/plans/v4.11.2_hotfix_ats_format_score.md`

---

### v4.11.1 - ATS Format Parsing Hotfix (2025-12-20)
> **Branch:** `v4.11.1-hotfix-ats_format_parsing`

#### Fixed
- **Missing Contact Info Parsing:** Added `email`, `phone`, `location`, `linkedin` fields to AI parsing schemas
- **Missing Professional Summary Parsing:** Added `professionalSummary` field to both `PARSE_SCHEMA` and `PARSE_SCHEMA_ENHANCED`
- **Headerless Summary Detection:** AI prompt now explicitly extracts summary text even without a "Professional Summary" header
  - Recognizes: "Summary", "Profile", "Career Profile", "About Me", or no header at all

#### Impact
- Resolves false "Missing Professional Summary" BLOCKER errors for valid resumes
- Resolves false "Missing Contact Info" BLOCKER errors when info is present but unrecognized

#### Technical
- **Files Modified:** `js/config.js`
- **Related Plan:** `docs/plans/v4.11.1_hotfix_ats_format_parsing.md`

---

### v4.11 - Analytics Validation (2025-12-20)
> **Branch:** `v4.11_analytics_validation`

#### Added
- **Quality Checks Module** (`js/analytics/quality-checks.js`)
  - Grammar & Tense Validation: Detects inconsistent past/present tense usage
  - Formatting Consistency: Checks for capitalization and punctuation patterns
  - ATS Red Flags: Identifies risky characters, tables, and images
  - Date Format Validation: Ensures consistent date patterns (MM/YYYY vs Month Year)

- **Professional Summary Validation** (`js/analytics/summary-validation.js`)
  - First-person pronoun detection (I, me, my, we)
  - Length compliance checking (word/character counts)
  - Subjective buzzword detection (e.g., "Passionate", "Motivated")

- **Section Compliance Validation** (`js/analytics/section-compliance.js`)
  - Standard section presence check (Experience, Education, Skills)
  - Layout ordering verification against ATS best practices
  - Essential contact info verification (Email, Phone, LinkedIn)

- **Prioritized Repairs Display** (`js/logic/display-analytics.js`)
  - Unified "Grouped Quality Issues" presentation
  - Consolidated feedback from all likelihood sources (Summary, Sections, Quality)
  - Severity-based grouping:
    - ⛔ BLOCKER (Dealbreakers)
    - ⚠️ RISK (Score reducers)
    - 🔧 TWEAK ( refinements)

#### Fixed
- **Validation Logic:** resolved "SyntaxError: Invalid regular expression" in verb pattern matchers.
- **Import Error:** Fixed `STRONG_VERBS` import binding in `verb-lists.js`.

#### Technical
- **New Files:** 3 files created
  - `js/analytics/quality-checks.js`
  - `js/analytics/summary-validation.js`
  - `js/analytics/section-compliance.js`
- **Modified:** `js/logic/pipeline.js`, `js/logic/display-analytics.js`, `js/analytics/config/verb-lists.js`

### v4.10 - Analytics Optimization (2025-12-19)
> **Branch:** `v4.10_analytics_optimization`

#### Added
- **Cross-Resume Redundancy Detection** (`js/analytics/redundancy.js`)
  - Capability pattern matching to identify repeated skills across positions
  - Severity calculation: HIGH (3+ positions), MEDIUM (2 positions, broad), LOW (2 positions, specific)
  - Word savings estimation for consolidation planning
  - Per-position alert helpers for display integration

- **Per-Position Reordering Recommendations** (`js/analytics/reordering.js`)
  - Optimal bullet order calculation based on v4.9 strength ratings
  - Primary sort: Quantifiable Impact (metrics presence) per v4.9.1 UX guidance
  - Secondary sort: Overall bullet strength (4-point criteria)
  - Move recommendations with human-readable reasons

- **Consolidation Opportunities** (`js/analytics/consolidation.js`)
  - Identifies merge candidates from redundancy data
  - Word savings calculation (current vs projected)
  - Priority ranking: HIGH/MEDIUM/LOW based on severity + savings
  - Suggested consolidated text templates with rationale

- **Per-Position Optimization Cards** (`js/logic/display-analytics.js`)
  - `displayPerPositionCards()` function showing optimization alerts per position
  - Redundancy alerts with cross-position references
  - Reordering recommendations with move instructions
  - Consolidation opportunities with word savings
  - Bullet strength indicators (🟢 Strong, 🟡 Medium, 🔴 Weak)
  - Consolidation summary with total word savings

#### Changed
- **State Management** (`js/state.js`)
  - Extended analytics object: `{ scoring, bulletStrengths, verbAlerts, redundancy, reordering, consolidation }`

- **Analysis Pipeline** (`js/logic/pipeline.js`)
  - Integrated v4.10 analytics modules into standalone analysis flow
  - Added per-position cards display after Executive Summary

#### Technical
- **New Files:** 3 files created
  - `js/analytics/redundancy.js` - Cross-resume redundancy detection
  - `js/analytics/reordering.js` - Bullet reordering recommendations
  - `js/analytics/consolidation.js` - Consolidation opportunity finder
- **Modified Files:** `js/state.js`, `js/logic/pipeline.js`, `js/logic/display-analytics.js`
- **Terminology:** Uses "Refinement" not "Polish" per v4.9.1 UX guidance
- **Inline Comments:** All changes marked with `// v4.10 Change:` for audit trail

#### Documentation
- Updated `docs/plans/v4.10_analytics_optimization_plan.md` with implementation progress tracking
- Version history added to all modified files

### v4.9.2 - Documentation Alignment & Wireframe Consolidation (2025-12-19)
> **Branch:** `v4.9.2-terminology-ui-wireframe-updates`

#### Added
- **Modular Wireframes:** Created a new subdirectory `docs/prompts/analyzer/wireframes/` with standalone components (00-06) for all analysis phases.
- **Reference Source:** Restored `Resume_Analyzer_Wireframe.md` as the authoritative primary file, embedding all modular components.
- **Versioning:** All modular wireframe files and the master wireframe now feature a **Version: 1.0** header for tracking.

#### Changed
- **Terminology Alignment:** Synchronized `Resume_Analyzer_Prompt.md` and `System_Prompt.md` with v4.9.1 standards (ATS Format, Content Quality, Quantifiable Impact, Skills & Keywords).
- **Severity Standardization:** Updated prioritization levels to BLOCKER, RISK, and TWEAK across all prompt documentation.
- **System Prompt Recovery:** Restored full version history in `System_Prompt.md` while appending v4.9.2 updates.
- **Phase 4.5 Restoration:** Explicitly restored "Action Verb Distribution" as a standalone section (rejecting previous consolidation plans) with its own modular wireframe (`06_Action_Verb_Distribution.md`).

#### Technical
- **Centralized Documentation:** Designated `Resume_Analyzer_Wireframe.md` as the single source of truth for the terminal UI, linking all 7 sub-modules.

### v4.9.1 - UX Terminology Updates & Documentation Sync (2025-12-19)
> **Branches:** `v4.9.1-exec-summary-updates`, `v4.9.1-terminology-exec-summary-ux-updates`

#### Fixed
- **Phase 3 Hang:** Resolved critical crash in error handling logic (`pipeline.js`)
  - Fixed `hideLoading()` call without arguments causing TypeError in `utils.js`
  - Hoisted timer variables to ensure visibility in catch block

#### Changed
- **User-Facing Terminology:** Refined scoring category names for clarity and professional alignment
  - **Code Updates:** Renamed 4 scoring functions and updated property names in `js/analytics/scoring.js` and `js/logic/display-analytics.js`
    - "Structure" → **"ATS Format"** (emphasizes machine readability)
    - "Grammar" → **"Content Quality"** (broader professionalism scope)
    - "Results" → **"Quantifiable Impact"** (highlights measurable achievements)
    - "Keywords" → **"Skills & Keywords"** (clarifies hard + soft skills focus)
  - **Display Labels:** Updated Executive Summary and Score Breakdown sections to use new terminology
  - **Function Names:** Renamed for consistency
    - `calculateStructureScore()` → `calculateATSFormatScore()`
    - `calculateGrammarScore()` → `calculateContentQualityScore()`
    - `calculateResultsScore()` → `calculateQuantifiableImpactScore()`
    - `calculateKeywordsScore()` → `calculateSkillsKeywordsScore()`
  - **Property Names:** Updated breakdown object: `{atsFormat, contentQuality, quantifiableImpact, skillsKeywords}`

- **Prioritized Repairs:** "Action Items" renamed to "Prioritized Repairs" with severity levels
  - [⛔ BLOCKER] Dealbreakers
  - [⚠️ RISK] Significant Impact
  - [🔧 TWEAK] Refinement

#### Documentation
- **Prompt Files Updated (v1.1 → v1.2):**
  - `docs/prompts/analyzer/Resume_Analyzer_Prompt.md` - Updated scoring breakdown terminology, version history
  - `docs/prompts/analyzer/Resume_Analyzer_Architecture.md` - Updated code examples with new function names

- **Plan Files Updated (v1.0 → v1.1):**
  - `docs/plans/v4.9_analytics_foundation_plan.md` (v1.2 → v1.3) - Updated Component 1 scoring breakdown, wireframes
  - `docs/plans/v4.10_analytics_optimization_plan.md` - Added "Quantifiable Impact" as primary sort weight
  - `docs/plans/v4.11_analytics_validation_plan.md` - Updated severity classification (blocker/risk/tweak)
  - `docs/plans/v4.12_display_enhancements_plan.md` - "Polish" → "Refinement" consistency

- **Roadmap:** Added Milestone 20 for v4.9.1 UX Terminology Updates

#### Technical
- **Consistency Strategy:** Function names, property names, and display labels now aligned (e.g., `atsFormat` throughout)
- **Inline Comments:** Added v4.9.1 markers at every change location for audit trail
- **Version Headers:** Updated code files with v4.9.1 terminology mapping documentation
- **No Logic Changes:** Scoring algorithms unchanged (/40, /20, /20, /20 distribution preserved)

### v4.9.0 - Analytics Foundation (2025-12-18) <!-- v4.9.0 Change -->
> **Branch:** `v4.9-analytics-foundation` (merged to `v4.8.3-security_hotfix`)

#### Added
- **Executive Summary Dashboard:** New consolidated analytics display showing:
  - Overall score (X/100) with letter grade (A+, A, B+, B, etc.)
  - Score breakdown: Structure /40, Grammar /20, Results /20, Keywords /20
  - Career profile: Experience level with target vs actual word/bullet counts
  - Verb diversity score (X/5 categories) with emoji-coded distribution
  - Action items count (critical, major, minor errors)
  - Visual compliance indicators (✓ compliant, ⚠️ out of range)

- **100-Point Composite Scoring System:** Quantitative resume quality assessment
  - **Structure Score** (/40): Section presence, order, word/bullet count compliance
  - **Grammar Score** (/20): Character length validation, formatting consistency
  - **Results Score** (/20): Metric density, impact statements
  - **Keywords Score** (/20): Hard skills (12pts), soft skills (8pts) distribution
  - Experience-based targets: Scoring adjusts for New Grad vs Mid-Career vs Senior/Executive

- **Bullet Strength Analysis:** 4-point criteria system rates each bullet
  - Metric presence (+1), Impact statement (+1), Strong verb (+1), Proper length (+1)
  - Classification: Strong (3-4pts), Medium (2pts), Weak (0-1pts)
  - Summary statistics: Distribution percentages, average points, weak bullet identification

- **Action Verb Validation:** 3 types of alerts for verb diversity
  - Repetition alerts: 2+ same verb per position
  - Category overuse alerts: 3+ verbs from same category per position
  - Weak verb detection: Passive/vague verbs with synonym suggestions
  - Resume-wide summary: Category distribution, overused/underused patterns

#### Changed
- **Analysis Pipeline:** Analytics now calculated after AI analysis completes (Phase 3)
- **Data Aggregation:** Bullets aggregated into flat array for analytics processing
- **Phase Labels:** Updated from 3 phases to 3 phases (removed temporary 2.5 label)

#### Technical
- **New Files:** 9 files created (682 lines of code)
  - Config layer: `experience-targets.js`, `verb-lists.js`, `scoring-rules.js`
  - Utils layer: `tests.js`, `impact-detection.js`
  - Analytics: `scoring.js`, `bullet-strength.js`, `verb-validation.js`
  - Display: `display-analytics.js`
- **Modified Files:** `state.js`, `pipeline.js`, `Resume_Analyzer_Prompt.md`
- **Architecture:** Functional modules with config separation (Approach 3: Pragmatic Balance)
- **Quality:** All critical integration issues resolved, moderate issues documented for v4.10

#### Documentation
- **Architecture Guide:** Created `Resume_Analyzer_Architecture.md` (moved from plans/)
- **Implementation Plan:** Updated `v4.9_analytics_foundation_plan.md` with completion status
- **ROADMAP.md:** Added Milestone 19 with implementation details

#### Known Limitations
- Date format validation: Currently placeholder (always passes) - TODO v4.10
- Formatting validation: Currently placeholder (assumes 0 issues) - TODO v4.10
- Box-drawing alignment: Emoji width may cause slight misalignment in some terminals

### v4.8.3 - Security Hotfix (2025-12-17)
> **Branch:** `v4.8.3-security_hotfix`

#### Security
- **Fixed hardcoded paths:** Configuration now uses workspace variables (`${workspaceFolder}`)
  - Resolves privacy leak (developer username exposure in repository)
  - Enables collaboration (works for all contributors out-of-the-box)
  - Cross-platform compatible (macOS, Linux, Windows)
- **Added input validation:** 4-layer security checks prevent path traversal and resource exhaustion attacks
  - Path traversal protection (rejects `..`, `~`, relative paths)
  - File size validation (max 100MB to prevent disk exhaustion)
  - Disk space validation (min 500MB free before operations)
  - Archive boundary checks (prevents escape from project directory)

#### Added
- **Local settings pattern:** `.claude/settings.local.json.example` template for user customization
  - Users can override defaults without modifying tracked files
  - Gitignored user settings prevent accidental commits
  - Clear documentation via example file

#### Technical
- Script version: 1.0 → 1.1 (security hardening)
- Cross-platform compatibility improvements
- Comprehensive security validation before all file operations

### v4.6.2 - Export & UX Bugfixes (2025-12-10)
> **Branch:** `v4.6.2-pdf-and-analysis-prompt-fixes`

#### Fixed
- **Removed PDF Export:** PDF export button removed due to browser compatibility issues
  - Users can now print the HTML export to PDF instead
  - Export menu simplified to 3 buttons: Markdown, JSON, HTML
- **Skip Redundant Analysis Prompt:** Fixed annoying prompt when switching from standalone to comparative mode
  - If standalone analysis already completed, comparative mode skips "Would you like to perform analysis first?" prompt
  - Shows message: "✓ Resume Quality Analysis already completed. Using cached results."
  - Prompt still appears for fresh comparative analysis sessions

#### Changed
- Export menu reduced from 4 to 3 export formats
- HTML export button tooltip updated to mention printing to PDF
- Phase 0 in comparative mode now checks if analysis already done

#### Technical
- Removed `exportAsPDF()` function from js/export.js
- Added conditional check in js/logic/pipeline.js for `state.analysis`
- Better UX with fewer redundant prompts

### v4.5.2 - Token Optimization (2025-12-09)
> **Branch:** `v4.5.1-prompt-integration` → merged into `v4.5-action-verb-categorization`

#### Performance
- **Token Reduction:** Reduced token usage by ~8,000 tokens (28-33% reduction per analysis)
  - **Before:** 20-30K tokens per analysis
  - **After:** 13-21K tokens per analysis
- **Quality Maintained:** 98%+ accuracy preserved with semantic verb detection

#### Changed
- **Resume_Analyzer_Prompt.md:**
  - Consolidated version history to v4.5 only (removed v1.0-v1.3)
  - Condensed action verb lists from 170+ to 50 verbs (top 10 per category)
  - Updated inline comments from v1.3 to v4.5
  - Preserved all explanatory content, examples, and "How to Calculate" sections
- **config.js - STANDALONE_ANALYSIS_SCHEMA:**
  - Simplified actionVerbAnalysis schema from 51 lines to 25 lines
  - Updated category names: Built/Lead/Managed/Collaborate/Improved (Corrected in v4.11.4)
  - Removed complex "perPosition" nested array structure
  - AI now includes per-position details in text output
- **pipeline.js - runStandaloneAnalysis():**
  - Optimized prompt data passing from 18 lines to 2 lines
  - Removed redundant instructions (already in systemPrompt file)
  - Kept only essential data: Resume JSON + Experience Level

#### Technical
- **Commit:** `db3cadd`
- **Files changed:** 3 files, 38 insertions(+), 95 deletions(-)
- **Backup created:** Resume_Analyzer_Prompt.md.v4.5.bak (local developer backup, not committed to git)

### v4.5.1 - Prompt Integration Fix (2025-12-09)
> **Branch:** `v4.5.1-prompt-integration` (created from `v4.5-action-verb-categorization`)

#### Fixed
- **Prompt Integration:** Pipeline.js now loads analyzer prompt from file using loadPrompt('analyzer')
- Replaced hardcoded STANDALONE_PROMPT with dynamically loaded prompt
- Action verb categorization now appears in analysis output (resolves v4.5.0 known issue)

#### Documentation
- **ROADMAP.md v1.19:** Marked Milestone 13 complete with actual implementation details
- **CHANGELOG.md:** Finalized v4.5.0 entry with complete feature list
- **Resume_Analyzer_Wireframe.md v1.1:** Added Phase 4.5 showing verb categorization output
- **v4.5 implementation plan v1.1:** Added completion summary

#### Technical
- **Commit:** `2bb1f62`
- **Files changed:** 6 files

### v4.5.0 - Action Verb Categorization (2025-12-09) ✅
#### Added
- **Five-category action verb system** with emoji indicators:
  - Built (Blue 🔵): 30+ verbs for building/establishing
  - Lead (Yellow 🟡): 30+ verbs for driving/guiding
  - Managed (Purple 🟣): 30+ verbs for oversight/coordination
  - Improved (Green 🟢): 30+ verbs for optimizing
  - Collaborate (Pink 🩷): 30+ verbs for partnership
- **Execution trigger instructions** (WHEN/HOW/WHERE to perform verb categorization)
- **Per-position verb counting** with 2+ repetition alerts
- **Prominent 3+ SAME CATEGORY callouts** for critical repetition detection
- **Resume-wide verb summary** showing category usage across all positions
- **Semantic detection** for unlisted verbs based on contextual meaning
- **Prompt-loader infrastructure** for file-based prompt loading with cache-busting

#### Changed
- Enhanced Resume Analyzer Prompt (v1.2 → v4.5) with complete verb categorization integration
- Updated Executive Summary to include verb category diversity analysis with repetition alerts
- Integrated verb distribution into Section 3 output after each position's bullet analysis
- Disabled testing mode warnings (production mode)
- Updated boot message from v4.3.1 to v4.5

#### Technical
- **Commit:** `c66f6b2`
- **Branch:** `v4.5-action-verb-categorization`
- **Files changed:** 10 files, 986 insertions(+), 21 deletions(-)
- **New files:** `js/prompt-loader.js`, `js/PROMPT_LOADER_README.md`
- **Updated prompts:** Resume_Analyzer_Prompt.md v4.5 (actual)
- **Implementation plan:** `/docs/plans/v4.5_action_verb_categorization_plan.md`

#### Known Issues
- **Prompt integration incomplete:** Pipeline.js still uses hardcoded prompts from config.js instead of loading from files
- **Action verb categorization not appearing in output:** Requires pipeline.js update to integrate prompt-loader (tracked in v4.5.1)

#### Documentation
- Consolidated v4.0-v4.4.2 implementation plans into `/docs/plans/v4.x_consolidated_plans.md`
- Updated ROADMAP.md v1.19 to mark Milestone 13 complete
- Reduces 8 separate plan files to single historical reference document (1,074 lines)

## Released

### v4.4.x - README Updates and Recovery (2025-12-08)
#### Note - Google Antigravity Incident
v4.4.0-v4.4.3 primarily consisted of README documentation updates and minor prompt refinements for Gap Analysis evidence formatting. All branches (v4.4, v4.4.1, v4.4.2, v4.4.3) were successfully merged into main on 2025-12-08. However, **Google's Antigravity AI inadvertently deleted these commits from the remote origin repository** on the same day. The changes are preserved locally and documented in this changelog.

### v4.4.3 - Refined Source Citations (2025-12-08)
#### Added
- Defensive coding to strip "Resume - " and similar prefixes from evidence sources
- Improved cleanliness of cited evidence in Gap Analysis

### v4.4.2 - Schema-Based Evidence Formatting (2025-12-08)
#### Fixed
- Resolved "Wall of Text" issue in Gap Analysis evidence display
- Implemented structured array schema for evidence items
- Enforced "One Bullet Per Line" formatting for readability
- added clear Source Citations (Company | Job Title) for every piece of evidence

### v4.4.1 - Evidence Formatting Attempt (Superseded) (2025-12-08)
#### Changed
- Initial attempt to fix evidence formatting via prompt engineering (string-based)
- *Note: This version proved unreliable and was superseded by the schema-based approach in v4.4.2*

### v4.4 - Pre-Analysis Quality Check (2025-12-08)
#### Added
- **Interactive Quality Check:** Prompt to run Standalone Analysis before Comparative Analysis
- allows users to fix resume quality issues (metrics, impact) before assessing job fit
- Integrated seamless flow between Standalone and Comparative modes

### v4.3.1 - Enhanced Progress Feedback (2024-12-04)
#### Added - User Experience
- Reassurance messages for long-running operations (15s and 30s thresholds)
- "Still processing..." message appears after 15 seconds
- "This is taking longer than usual..." message appears after 30 seconds
- Genuine sequential phase completion showing real progress
- Phase numbering (e.g., "PHASE 1/6") for progress tracking
- Elapsed time display for each phase with 0.1s precision
- Visual indicators: ⏳ (in progress), ✓ (complete)

#### Added - Performance Optimization
- Comparative mode now reuses cached data from standalone analysis
- Shows "✓ Resume Already Parsed (using cached data)" when applicable
- Shows "✓ Experience Already Calculated: X Years, Level" when cached
- Saves ~25 seconds when switching from standalone to comparative mode

#### Changed - Based on 2025 UX Research
- Removed inaccurate time estimates (e.g., "5-10 seconds", "15-30 seconds")
- Removed artificial sub-steps that displayed all at once
- Focused on honest progress feedback rather than fake sequential indicators
- Updated version display to v4.3.1 (index.html, main.js, README.md)

#### Technical Implementation
- Enhanced `showLoading()` to return timer object with reassurance timers (js/utils.js)
- Enhanced `hideLoading()` to accept timer object and clear reassurance timers
- Added backwards compatibility for legacy timer number format
- Added caching checks to `runComparativeAnalysis()` (js/logic/pipeline.js)
- Optimized phase display to skip unnecessary loading indicators

#### Documentation
- Updated implementation plan to reflect 2025 UX research decisions
- Documented reassurance timer thresholds and behavior
- Documented caching optimization strategy
- See `/docs/plans/v4.3.1_progress_feedback_plan.md` for complete details

#### UX Research Applied
- Users with progress indicators tolerate 22.6s waits vs 9s without indicators
- Descriptive feedback more effective than inaccurate time estimates
- Sequential completion shows concrete progress better than fake sub-steps
- Immediate feedback critical for async operations

### v4.2.1 - Documentation Structure Refinement (2024-11-XX)
#### Added
- Created `/docs/plans/` directory for implementation plans (separate from prompts)
- Created `plans/README.md` explaining PLANS vs ROADMAP vs PROMPTS distinction
- Enhanced CHANGELOG with code version histories from `index.html`, `main.js`, `pipeline.js`, `claude.js`

#### Changed
- Moved and renamed `Resume_Analyzer_Roadmap.md` → `plans/v4.3_standalone_analysis_plan.md`
- Clarified file is an implementation PLAN, not a roadmap
- Updated all documentation cross-references to reflect new structure
- Enhanced v4.0 and v4.1 CHANGELOG entries with detailed module changes
- Consolidated v3.x CHANGELOG entries per Update Doc Protocol Rule 4

### v4.3 - Standalone Analysis Mode (Released)
#### Added - Core Features
- Dual analysis modes: Standalone (resume quality check) and Comparative (job fit check)
- Interactive mode selection after resume input with validated input loop
- Context-aware post-analysis menu adapting to current mode
- Mode switching capability between standalone and comparative mid-session

#### Added - State Management
- `analysisMode` field to global state ('standalone' | 'comparative' | null) in js/state.js
- Enhanced state documentation for v4.3 changes

#### Added - Schema Enhancements
- `PARSE_SCHEMA_ENHANCED`: Enhanced parsing with skillsIdentified and hasMetric per bullet
- `STANDALONE_ANALYSIS_SCHEMA`: Output structure for standalone analysis results
- `STANDALONE_PROMPT`: AI instructions for quality-focused analysis without JD

#### Added - User Flow
- Step 2: Analysis mode selection with visual separators
- Validated input loop accepting '1', '2', or keywords ('analyze', 'fit', 'check')
- Conditional JD collection only for comparative mode
- Updated postAnalysisMenu() with context-aware options

#### Added - Pipeline Architecture
- Refactored `runAnalysisPipeline()` with branching logic
- Created `parseResumePhase()` shared function with enhanced schema support
- Created `calculateExperiencePhase()` shared function
- Created `runStandaloneAnalysis()` with 3 phases
- Created `runComparativeAnalysis()` extracting existing logic with 6 phases

#### Added - Standalone Analysis Output
- Skills Inventory: Categorized hard/soft skills with totals
- Metric Coverage: Overall percentage and position-level breakdown
- Per-bullet status: ✓ HAS METRICS / ✗ NO METRICS (508-compliant)
- Position ratings: EXCELLENT / GOOD / NEEDS IMPROVEMENT
- Quality issues with severity levels (High/Medium/Low)
- Recommendations with specific bullet references and impact analysis

#### Changed
- Comparative mode maintains all v3.x features (blocking logic, gap analysis)
- Enhanced parseResumePhase() with API retry/switch options
- Proper error propagation to prevent incomplete analysis

#### Implementation Details
- Files Modified: js/state.js, js/config.js, js/main.js, js/logic/pipeline.js
- Code Changes: +636 lines, -244 lines
- See `/docs/plans/v4.3_standalone_analysis_plan.md` for detailed implementation plan

## [Released]

### [v4.2] - 2024-12-03

#### Added - Documentation Reorganization
- Reorganized `/docs` folder structure by content type (`analyzer/`, `comparative/`, `sys/`, `dev/`)
- Created `JD_Comparative_Prompt.md` - Extracted comparative analysis logic from System_Prompt v3.10
- Created `Resume_Analyzer_Wireframe.md` - Visual flow diagram for standalone analysis
- Created `v4.3_standalone_analysis_plan.md` - Implementation plan for v4.3 (originally named Resume_Analyzer_Roadmap.md)
- Created `CHANGELOG.md` - User-facing release notes following Keep a Changelog standard
- Created `PARAMETERS.md` - Centralized parameter reference for all prompts
- Created comprehensive README.md files in all documentation folders for navigation

#### Changed
- Renamed all documentation files to remove "Resume_Optimizer_" prefix for clarity
- Moved files to organized subfolder structure under `/docs/prompts/`
- Updated System_Prompt.md to v3.11 with references to new comparative prompt location
- Updated all cross-references in documentation to reflect new paths
- Updated Update_Doc_Prompt.md v1.3 with 6 target files (added comparative prompt)

### [v4.1] - 2024-12-02

#### Added - User Experience & API Improvements
- **Claude API Browser Compatibility** (`js/ai/claude.js`)
  - Added `anthropic-dangerous-direct-browser-access: true` header
  - Enabled direct Claude API calls from browser (Anthropic CORS support added Aug 2024)
  - Both Gemini and Claude APIs now fully functional in browser environment
- **Interactive API Key Setup** (`js/main.js`)
  - Educational prompts explaining Claude Pro vs Developer API distinction
  - Proactive guidance: auto-switches to Gemini if user only has Claude Pro
  - Clear messaging about API billing before key entry
  - Gemini free tier recommendations for users without API credits
- **Enhanced Error Recovery** (`js/logic/pipeline.js`)
  - Interactive retry/switch options after API errors
  - Users can retry with different key, switch providers, or exit gracefully
  - Data preservation: no need to re-enter resume/JD on retry
- **Input Validation** (`js/main.js`)
  - Validation for provider selection (1, 2, or keywords)
  - Validation for billing type selection
  - Error loops with clear messages and re-prompts

#### Changed
- Removed outdated CORS warnings from Claude API error messages
- Updated provider prompts to say "Gemini API" and "Anthropic Dev API" for clarity

#### Fixed
- Prevented jumping to post-analysis menu before analysis completes
- Fixed validation to prevent invalid selections
- Fixed Claude API CORS issue that was preventing browser-based usage

### [v4.0] - 2024-12-02

#### Added - Modular Architecture (Complete Refactor)
- **Phase 2: Constants & Configuration**
  - Created `js/config.js` - System prompts, all schemas (JD_SCHEMA, PARSE_SCHEMA, etc.)
  - Created `js/state.js` - Global state object, config management
- **Phase 3: Utilities & AI Layer**
  - Created `js/utils.js` - Terminal I/O functions, user input prompts, date parsing
  - Created `js/ai/providers.js` - AI abstraction interface (`generateAIContent` wrapper)
  - Created `js/ai/gemini.js` - Gemini API implementation
  - Created `js/ai/claude.js` - Claude API implementation with CORS handling
- **Phase 4: Business Logic**
  - Created `js/main.js` - Application initialization, menu flows, config loading
  - Created `js/logic/pipeline.js` - Complete 6-phase analysis pipeline
- **Version Tracking**
  - Added version history headers to all code files
  - Inline version comments marking changes

#### Changed
- Refactored monolithic `index.html` (872 lines) into 8 ES6 modules (199 lines)
- Reduced main HTML file size by 77% (-673 lines)
- Improved maintainability with clear separation of concerns
- Enhanced testability with modular structure

#### Preserved
- All v3.x features intact:
  - Multi-provider support (Gemini/Claude) with runtime selection
  - 17-point detailed JD analysis
  - Evidence-based gap analysis with explicit citation
  - Hard/Soft skill grouping with Need/Want separation
  - Blocking logic (hard skill deficit, low score threshold <30)
  - Deduplication and cross-position redundancy detection
  - Post-pipeline menu (rerun, new resume, new JD)

#### Removed
- Monolithic inline JavaScript from HTML
- Single-file architecture (872-line index.html)

### [v3.x] - CLI Evolution (2024)

This release series (v3.0-v3.17) evolved the command-line interface with multi-provider support, advanced gap analysis, and intelligent blocking logic.

#### Key Features Added
- **Multi-Provider Support** - Runtime selection between Gemini and Claude APIs
- **17-Point JD Analysis** (v3.7) - Skills/Qualifications/Certifications with Need/Want breakdown
- **Hard vs. Soft Skills Distinction** (v3.7) - Proper categorization for accurate matching
- **Evidence-Based Gap Analysis** (v3.4-v3.9) - Explicit citation of resume evidence for each requirement
- **Blocking Logic** (v3.8, v3.10)
  - Low Score Threshold: Blocks recommendations if match score < 30
  - Hard Skill Deficit Gate: Blocks if Missing Hard Skills > Matched Hard Skills
- **Gap Analysis Presentation** (v3.8-v3.9) - Sorting, tagging ([MATCHED]/[PARTIAL]/[MISSING]), section summaries
- **Overall Score Summary Block** (v3.9) - Detailed explanation of match score logic
- **Soft Skill Need/Want Separation** (v3.9) - Distinct buckets for required vs preferred soft skills
- **Recommendation Deduplication** (v3.4) - Merge identical recommendations across positions
- **Cross-Position Redundancy Detection** (v3.4) - Identify repeated capabilities across roles
- **Post-Pipeline Menu** (v3.17) - Rerun analysis, new resume, new JD options
- **CORS Handling** (v3.17) - Error handling for Claude API in browser preview
- **Resume Analysis Agent Framework** (v3.0) - Category tagging ([BA], [PM], [TW], [ITSM])
- **Protection Mode** (v3.0) - Gap-critical content preservation
- **Content Preservation Rules** (v3.1-v3.3) - Explicit rules for metrics, placeholder notation (`<<__>>`), optimization allowances

#### Version Milestones
- **v3.0** - Resume Analysis Agent framework, category tagging
- **v3.1-v3.3** - Content preservation and metric philosophy
- **v3.4-v3.5** - Evidence-based gap analysis
- **v3.7** - 17-point JD analysis schema
- **v3.8-v3.9** - Output presentation rules and blocking thresholds
- **v3.10** - Hard skill deficit blocking
- **v3.17** - CORS handling for browser compatibility

### [v2.x] - Quality & Token Management (2024)

#### v2.1
##### Added
- Token tracking across phases
- Phase gates to prevent token waste

#### v2.0
##### Added
- Quality scoring system (0-100)
- Metric applicability checks
- Quantification rate tracking

### [v1.0] - Initial Release (2024)

#### Added
- Multi-job analysis system
- Basic resume parsing
- Recommendation generation
- Document export (.docx)
- Google Gemini API integration
- Basic gap analysis

---

## Versioning Strategy

- **Major (x.0.0):** Breaking changes, architectural shifts
- **Minor (0.x.0):** New features, significant enhancements
- **Patch (0.0.x):** Bug fixes, documentation updates

## Migration Guides

- [v4.1 → v4.2](guides/MIGRATION_v4.2.md) - Documentation structure changes
- [v4.2 → v4.2.1](guides/MIGRATION_v4.2.1.md) - Plans directory introduction and file reorganization

---

## Notes

For detailed technical changes in individual prompt files, see version histories within:
- `prompts/sys/System_Prompt.md`
- `prompts/analyzer/Resume_Analyzer_Prompt.md`
- `prompts/dev/Update_Doc_Prompt.md`
