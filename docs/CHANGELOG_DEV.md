# Developer Changelog

All notable developer experience improvements, tooling changes, and meta-work will be documented in this file.

This tracks changes to the **development process and infrastructure**, not user-facing features (see [CHANGELOG.md](CHANGELOG.md) for user-facing changes).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### v6.3.0.1 - Guardrail Implementation Audit & Restoration (2026-01-03) <!-- v6.3.0.1 Change -->

#### Issue Detected - LLM Replacement Pattern
- **Problem:** Gemini replaced existing guardrail implementations with plan specifications instead of merging additions
- **Impact:** Lost CRITICAL priority tags, backup/restore logic, and placeholder detection in Guardrail #6
- **Detection:** User-requested audit comparing local changes against committed HEAD

#### Fixed - Guardrail Restorations
- **Guardrail #6 (Data Loss Prevention):** Restored original with CRITICAL priority, backup/restore logic, placeholder detection, MERGED with new `<trigger>` and `<item_count_verification>` from plan
- **Guardrail #3 (Professional Summary):** Restored `<priority>HIGH</priority>` tag, archived original as commented reference
- **Guardrail #21:** Split into #21a (original skill-role matching) and #21b (new limitation cross-check) - both coexist

#### Files Updated (4)
- `phases/phase-3/incremental-updates.md` - Guardrails #6, #21a, #21b
- `phases/phase-4/summary-generation.md` - Guardrail #3 with archived original
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
- **Lessons Learned v2.0 → v2.1:** Added comprehensive security hardening section
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
