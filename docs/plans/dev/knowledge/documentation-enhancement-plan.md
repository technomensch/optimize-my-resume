# v6.1.0 - Documentation Enhancement & Structural Reorganization

**Version:** 6.1.0 (MINOR - New features + documentation enhancements)
**Branch:** `v6.1.0`
**Date:** 2025-12-29
**Type:** MINOR (New features: Job Summary documentation, enhanced wireframes, terminology consistency)

---

## 🎯 Overview

v6.1.0 introduces documentation enhancements, structural reorganization, and terminology consistency across the project. Unlike v6.0.5 (cleanup-only), this is a MINOR version bump because we're adding:
- **New feature documentation:** Job Summary usage guide
- **New wireframes:** 10 comprehensive visual guides (ASCII + Mermaid)
- **Enhanced test coverage:** Gap-filling test cases for Phases 2-4

---

## 📋 Sub-Version Strategy

Instead of one large v6.1.0 commit, we'll use semantic sub-versioning:

| Sub-Version | Focus | Files Modified | Plan Document |
|-------------|-------|----------------|---------------|
| **v6.1.1** | Folder restructure (`/shared/` → `/optimization-tools/`) | 5 files | `v6.1.1-folder-restructure.md` |
| **v6.1.2** | Documentation updates (README, CHANGELOG, ROADMAP) | 4 files | `v6.1.2-documentation-updates.md` |
| **v6.1.3** | Wireframe creation (10 new files) | 10 files | `v6.1.3-wireframes.md` |
| **v6.1.4** | Legacy archival (obsolete files cleanup) | ~12 files | `v6.1.4-legacy-archival.md` |
| **v6.1.5** | Test case gap-filling (Opus deliverable) | 1 file | `v6.1.5-test-gaps.md` |

Each sub-version gets:
- ✅ Its own plan document in `/docs/plans/`
- ✅ Its own git commit with conventional commit message
- ✅ ROADMAP tracking entry
- ✅ CHANGELOG entry (consolidated in v6.1.0 final release)

---

## 🗂️ Sub-Version Details

### v6.1.1 - Folder Restructure

**Goal:** Rename `/shared/` → `/optimization-tools/` for clearer architecture naming

**Changes:**
1. Rename directory: `mv shared/ optimization-tools/`
2. Update references in:
   - `PROJECT-INSTRUCTIONS.md` (~15 occurrences)
   - `README.md` (file structure tree)
   - `docs/CHANGELOG.md` (v6.0.0 entry)
   - `ROADMAP.md` (phase tracking)
   - `quick-start-mode.md` (if any references)

**Success Criteria:**
- [ ] All `shared/phase-X/` references changed to `optimization-tools/phase-X/`
- [ ] No broken file paths
- [ ] Search returns 0 results for `shared/phase-` (excluding docs/legacy)

**Estimated Time:** 30 minutes

---

### v6.1.2 - Documentation Updates

**Goal:** Update terminology (Mode → Phase) and add Job Summary feature documentation

**Changes:**

#### README.md Updates (28 occurrences)

**Section 1: Mode → Phase Terminology**
- Line 11-13: "Mode 1/2/3" → "Phase 1/2/3" (What This System Does)
- Line 30: "Makes Mode 3 much better" → "Makes Phase 3 much better"
- Line 65-67: Mode references in Claude instructions → Phase references
- Line 252, 257, 262: Tip section headers (Mode → Phase)
- Line 268: "After Mode 1 analyzes" → "After Phase 1 analyzes"
- Line 283-285: Troubleshooting section (Mode → Phase)
- Line 304: Section header "What Each Mode Does" → "What Each Phase Does"
- Line 306, 330, 347: Subsection headers (Mode → Phase)
- Line 378: "How to Use All Three Modes Together" → "How to Use All Three Phases Together"
- Line 382, 388, 393, 399: Workflow steps (Mode → Phase)
- Line 492: FAQ answer (Mode → Phase)

**Section 2: Job Summary Feature Documentation** (NEW)

Add new tip section after Line 271:

```markdown
### 5. **Use Job Summary Generation for Applications**
   - After Phase 3 analyzes a job description, ask: "Create a professional summary for this job"
   - The system generates TWO types of summaries:
     - **Master Summary:** Comprehensive overview of your entire career (stored in job history)
     - **Per-JD Summary:** Customized version optimized for the specific job posting (ephemeral)
   - **Use cases:**
     - Cover letters: Lead with the per-JD summary
     - LinkedIn applications: Paste customized summary in "Why are you interested?" section
     - Email applications: Include in the body to show tailored interest
   - **Pro tip:** The per-JD summary includes JD keywords for ATS optimization
```

**Section 3: Version Update**
- Line 407-408: Update version from 6.0.0 → 6.1.0
- Line 411: "What's New in v6.0" → "What's New in v6.1"
- Add v6.1.0 feature list:
  ```markdown
  ### What's New in v6.1:
  - **Enhanced Documentation** - Consistent phase terminology across all docs
  - **Job Summary Usage Guide** - Clear instructions for professional summary generation
  - **Visual Wireframes** - 10 comprehensive workflow diagrams (ASCII + Mermaid)
  - **Improved File Structure** - `/optimization-tools/` folder for clearer organization
  - **Expanded Test Coverage** - 30+ new test cases for Phases 2-4
  ```

#### CHANGELOG.md Update

Add v6.1.0 entry:

```markdown
### v6.1.0 - Documentation Enhancement & Job Summary Guide (2025-12-29)
> **Branch:** `v6.1.0`

#### Added
- **Job Summary Usage Guide** - New tip section in README explaining how to use professional summary generation
  - Master summary vs per-JD summary differences
  - Use cases (cover letters, LinkedIn, email applications)
  - ATS keyword optimization tip
- **Comprehensive Wireframes** - 10 visual workflow guides (5 ASCII + 5 Mermaid)
  - Phase 1: Foundation (job history v2.0, JD parser, entry router)
  - Phase 2: Core Integration (evidence matching, blocking gates)
  - Phase 3: Router & Workflows (8-scenario routing, incremental updates)
  - Phase 4: Summary & Polish (professional summary generation)
  - Complete Workflow: End-to-end user journey
- **Test Case Expansion** - 30+ new test cases for Phases 2-4
  - Integration flow tests (Phase 1 → Phase 3)
  - Incremental update edge cases
  - Re-comparison diff accuracy validation
  - Professional summary quality checks

#### Changed
- **Terminology Consistency** - "Mode 1/2/3" → "Phase 1/2/3" across all user-facing documentation
  - README.md: 28 occurrences updated
  - quick-start-mode.md: Updated to use phase terminology
  - Consistent with internal architecture (`/optimization-tools/` folder structure)
- **Folder Structure** - Renamed `/shared/` → `/optimization-tools/` for clearer naming
  - Updated all references in PROJECT-INSTRUCTIONS.md, README.md, CHANGELOG.md, ROADMAP.md
- **Version Numbering** - Updated README from v6.0.0 → v6.1.0

#### Removed
- **Obsolete v5.0 Files** - Archived to `/docs/legacy/`
  - `/modes/` directory → `/docs/legacy/modes-v5/`
  - `/wireframes/` (v5.0) → `/docs/legacy/wireframes-v5/`
  - `/optimization-tools/v5-legacy/` → `/docs/legacy/shared-v5/`
  - Root `CHANGELOG.md` (duplicate) → `/docs/legacy/CHANGELOG-v5.md`
  - `ADD_REMOTE_WORK_LOGIC.md` → `/docs/legacy/implementation-prompts/`

#### Impact
- ✅ Clearer user experience with consistent terminology
- ✅ Better onboarding with Job Summary usage guide
- ✅ Improved developer experience with visual wireframes
- ✅ Cleaner repository structure with legacy files archived
```

#### ROADMAP.md Update

Add v6.1.0 entry:

```markdown
### v6.1.0 - Documentation Enhancement (COMPLETE)
**Branch:** `v6.1.0` | **Status:** Complete | **Date:** 2025-12-29

**Sub-Versions:**
- [x] v6.1.1 - Folder restructure (`/shared/` → `/optimization-tools/`)
- [x] v6.1.2 - Documentation updates (terminology + Job Summary guide)
- [x] v6.1.3 - Wireframe creation (10 files)
- [x] v6.1.4 - Legacy archival
- [x] v6.1.5 - Test case gap-filling

**Features:**
- [x] Job Summary usage guide in README
- [x] Terminology consistency (Mode → Phase)
- [x] 10 comprehensive wireframes (ASCII + Mermaid)
- [x] 30+ new test cases for Phases 2-4
- [x] Legacy file archival to /docs/legacy/

**Notes:** Documentation-focused release improving user experience and developer onboarding.
```

**Success Criteria:**
- [ ] README has Job Summary tip section
- [ ] All 28 Mode→Phase references updated
- [ ] Version updated to 6.1.0
- [ ] CHANGELOG v6.1.0 entry complete
- [ ] ROADMAP v6.1.0 tracking added

**Estimated Time:** 45 minutes

---

### v6.1.3 - Wireframe Creation

**Goal:** Create 10 comprehensive visual workflow guides (5 ASCII + 5 Mermaid)

**Wireframe Structure:**

Each phase gets **2 files**:
1. `wireframes/phase-X-[name]-ascii.md` - ASCII diagram (terminal-friendly)
2. `wireframes/phase-X-[name]-mermaid.md` - Mermaid flowchart (GitHub-rendered)

**Files to Create:**

1. **Phase 1 - Foundation**
   - `wireframes/phase-1-foundation-ascii.md`
   - `wireframes/phase-1-foundation-mermaid.md`
   - Content: Job history v2.0 creation, 17-point JD parsing, entry router

2. **Phase 2 - Core Integration**
   - `wireframes/phase-2-core-integration-ascii.md`
   - `wireframes/phase-2-core-integration-mermaid.md`
   - Content: Evidence matching flow, blocking gates logic, Mode enhancements

3. **Phase 3 - Router & Workflows**
   - `wireframes/phase-3-router-workflows-ascii.md`
   - `wireframes/phase-3-router-workflows-mermaid.md`
   - Content: 8-scenario routing, incremental updates, JD re-comparison

4. **Phase 4 - Summary & Polish**
   - `wireframes/phase-4-summary-polish-ascii.md`
   - `wireframes/phase-4-summary-polish-mermaid.md`
   - Content: Master summary generation, per-JD customization

5. **Complete Workflow**
   - `wireframes/complete-workflow-ascii.md`
   - `wireframes/complete-workflow-mermaid.md`
   - Content: End-to-end user journey (entry → routing → execution → output)

**Wireframe Template:**

Each file follows this structure:

```markdown
# [Phase Name] - [ASCII/Mermaid]

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `optimization-tools/phase-X/`

---

## Overview
[Brief description of what this phase does]

## Diagram

[ASCII art or Mermaid code here]

## Key Decision Points
- [Branching logic 1]
- [Branching logic 2]

## Inputs
- [Required data/files]

## Outputs
- [What gets generated/modified]

## Files Involved
- `optimization-tools/phase-X/[module].md`

## Related Phases
- **Previous:** [Link to previous phase]
- **Next:** [Link to next phase]
```

**Success Criteria:**
- [ ] 10 wireframe files created (5 ASCII + 5 Mermaid)
- [ ] All diagrams render correctly (ASCII in terminal, Mermaid on GitHub)
- [ ] Each wireframe has overview, diagram, inputs, outputs, files
- [ ] Cross-references between phases working

**Estimated Time:** 90 minutes

---

### v6.1.4 - Legacy Archival

**Goal:** Archive obsolete v5.0 files to `/docs/legacy/`

**Directory Structure:**

```
docs/legacy/
├── README.md                           ← Explains what's archived and why
├── modes-v5/
│   ├── mode-1-full-analysis.md
│   ├── mode-2-bullet-optimization.md
│   └── mode-3-jd-comparison.md
├── wireframes-v5/
│   ├── mode-1-workflow.md
│   ├── mode-2-workflow.md
│   └── mode-3-workflow.md
├── shared-v5/
│   ├── initial-greeting.md
│   └── job-summary-creation.md
├── implementation-prompts/
│   └── ADD_REMOTE_WORK_LOGIC.md
└── CHANGELOG-v5.md                     ← Root CHANGELOG.md (duplicate)
```

**File Operations:**

```bash
# Create legacy directory structure
mkdir -p docs/legacy/{modes-v5,wireframes-v5,shared-v5,implementation-prompts}

# Move modes (v5.0 - not referenced)
mv modes/mode-1-full-analysis.md docs/legacy/modes-v5/
mv modes/mode-2-bullet-optimization.md docs/legacy/modes-v5/
mv modes/mode-3-jd-comparison.md docs/legacy/modes-v5/
rmdir modes/

# Move wireframes (v5.0 - outdated)
mv wireframes/mode-1-workflow.md docs/legacy/wireframes-v5/
mv wireframes/mode-2-workflow.md docs/legacy/wireframes-v5/
mv wireframes/mode-3-workflow.md docs/legacy/wireframes-v5/
rmdir wireframes/  # Will be recreated with v6.1 wireframes

# Move shared v5-legacy
mv optimization-tools/v5-legacy/initial-greeting.md docs/legacy/shared-v5/
mv optimization-tools/v5-legacy/job-summary-creation.md docs/legacy/shared-v5/
rmdir optimization-tools/v5-legacy/

# Move root obsolete files
mv CHANGELOG.md docs/legacy/CHANGELOG-v5.md
mv ADD_REMOTE_WORK_LOGIC.md docs/legacy/implementation-prompts/

# Move Opus handoff (temporary artifact)
mv optimization-tools/opus-handoff.md docs/plans/archive/opus-handoff.md
```

**Create Legacy README:**

`docs/legacy/README.md`:

```markdown
# Legacy Files Archive

This directory contains v5.0 files that have been superseded by v6.0+ architecture.

**Last Updated:** 2025-12-29 (v6.1.4)

---

## What's Here

### `/modes-v5/` - v5.0 Mode Definitions
Original mode files from v5.0 release. Superseded by `/optimization-tools/` modular architecture in v6.0.

**Files:**
- `mode-1-full-analysis.md` - Full resume analysis (v5.0)
- `mode-2-bullet-optimization.md` - Bullet optimization (v5.0)
- `mode-3-jd-comparison.md` - JD comparison (v5.0)

**Replaced by:**
- `/optimization-tools/resume-analyzer/` - Job history v2.0, JD parser, entry router (v6.0.1)
- `/optimization-tools/bullet-optimizer/` - Evidence matching, blocking gates (v6.0.2)
- `/optimization-tools/job-fit-analyzer/` - Workflow router, incremental updates (v6.0.3)
- `/optimization-tools/narrative-generator/` - Summary generation (v6.0.4)

---

### `/wireframes-v5/` - v5.0 Visual Diagrams
Original workflow wireframes from v5.0. Replaced by comprehensive ASCII + Mermaid diagrams in v6.1.3.

**Files:**
- `mode-1-workflow.md` - Full analysis wireframe (v5.0)
- `mode-2-workflow.md` - Bullet optimization wireframe (v5.0)
- `mode-3-workflow.md` - JD comparison wireframe (v5.0)

**Replaced by:** `/wireframes/` (v6.1.3)
- 10 files: 5 ASCII + 5 Mermaid (phase-1 through phase-4 + complete workflow)

---

### `/shared-v5/` - v5.0 Shared Components
Legacy shared components from v5.0, pre-modular architecture.

**Files:**
- `initial-greeting.md` - User greeting template (v5.0)
- `job-summary-creation.md` - Job summary generator (v5.0)

**Replaced by:**
- `/optimization-tools/resume-analyzer/entry-router.md` - Handles greetings via routing (v6.0.1)
- `/optimization-tools/narrative-generator/summary-generation.md` - Professional summary (v6.0.4)

---

### `/implementation-prompts/` - One-Time Implementation Prompts
Terminal prompts used for implementing specific features. No longer needed after implementation.

**Files:**
- `ADD_REMOTE_WORK_LOGIC.md` - v5.1 remote work classification implementation prompt

**Status:** Feature implemented in v5.1, integrated into v6.0 system

---

### `CHANGELOG-v5.md` - Outdated Changelog
Root-level changelog from v5.0 (duplicate of `docs/CHANGELOG.md`).

**Why archived:**
- Duplicate file (canonical version is `docs/CHANGELOG.md`)
- Last updated Dec 27, 2024 (stops at v5.0)
- Superseded by comprehensive v6.0 changelog

**Current changelog:** `docs/CHANGELOG.md` (v6.0.0+)

---

## Why Archive Instead of Delete?

These files provide historical context for:
1. **Understanding evolution** - How v5.0 architecture evolved to v6.0
2. **Migration reference** - For users with v5.0 job history files
3. **Design decisions** - Why certain approaches were replaced
4. **Rollback capability** - If needed to reference v5.0 implementation

---

## Related Documentation

- **Current Architecture:** See `PROJECT-INSTRUCTIONS.md` (v6.0.0)
- **Version History:** See `docs/CHANGELOG.md`
- **Roadmap:** See `ROADMAP.md`
- **Plans:** See `docs/plans/v6.*.md`
```

**Success Criteria:**
- [ ] All obsolete files moved to `/docs/legacy/`
- [ ] Legacy README created explaining archival
- [ ] No duplicate files in active directories
- [ ] Original directories removed (modes/, old wireframes/)

**Estimated Time:** 20 minutes

---

### v6.1.5 - Test Case Gap-Filling

**Goal:** Create test cases for Phases 2-4 to supplement existing Phase 1 coverage

**Background:**
- Existing: `v6.0-deep-dive-test-cases.md` (95+ tests, mostly Phase 1)
- Missing: Integration tests, incremental updates, re-comparison, summary validation

**Deliverable:** Plan for Opus to create 30+ new test cases

---

## 📄 OPUS TEST PLAN (Copy this section to give to Opus)

```markdown
# Test Case Gap-Filling for v6.0 Phases 2-4

**Goal:** Create test cases for Phases 2-4 to supplement the existing 95+ test cases in `v6.0-deep-dive-test-cases.md`

**Context:**
- v6.0 is fully implemented across 4 phases
- Existing test file covers Phase 1 comprehensively (JD parser, skills categorizer, router basics)
- Gaps exist in Phase 2-4 integration flows and edge cases

---

## Test Coverage Gaps Identified

### Gap 1: Phase 2 Integration Flow (Mode 1 → Mode 3)
**Missing:** End-to-end integration tests validating data flow from job history creation to evidence matching

**Required Test Cases (~8 tests):**

1. **INT-001:** User runs Phase 1 (creates job history v2.0) → immediately runs Phase 3 (JD comparison)
   - **Validate:** v2.0 job history loads correctly, hard/soft skills separated, evidence citations use proper format
   - **Expected:** All 12 job history sections accessible, no null reference errors

2. **INT-002:** User has v1.0 job history → runs Phase 3 (backward compatibility)
   - **Validate:** Phase 3 loads v1.0 format, suggests upgrade, still functions
   - **Expected:** Evidence matching works with combined skills_demonstrated array

3. **INT-003:** Phase 1 creates job history with missing sections (no education/certifications)
   - **Validate:** Phase 3 handles null sections gracefully
   - **Expected:** Evidence matcher doesn't fail, marks education/certification requirements as MISSING

4. **INT-004:** Job history has duplicate skills across positions (e.g., "Python" in 3 roles)
   - **Validate:** Evidence citations list all occurrences
   - **Expected:** Multiple citations: "Python mentioned in: Position 1, Position 2, Position 3"

5. **INT-005:** Phase 1 creates job history with overlapping dates (moonlighting scenario)
   - **Validate:** Evidence matcher doesn't double-count years of experience
   - **Expected:** Conservative aggregate calculation, note overlap in citations

6. **INT-006:** JD requirement matches achievement but not explicit skill listing
   - **Validate:** Evidence matcher infers skill from achievement context
   - **Expected:** Status = INFERRED, citation = achievement quote, confidence score documented

7. **INT-007:** JD has "Required" and "Preferred" skills → job history matches some of each
   - **Validate:** Evidence matcher weights Required > Preferred in scoring
   - **Expected:** Missing Required skill impacts score more than missing Preferred

8. **INT-008:** Blocking gates trigger (hard skill deficit, low match score, location mismatch)
   - **Validate:** User can override each gate, system continues after "yes" confirmation
   - **Expected:** Override logged, recommendations still generated with warning

---

### Gap 2: Phase 3 Incremental Updates
**Missing:** Edge case tests for add/edit/remove position operations

**Required Test Cases (~10 tests):**

1. **INC-001:** User adds new position to job history (most recent role)
   - **Validate:** Position inserted chronologically (Position 1), indices shifted
   - **Expected:** Previous Position 1 becomes Position 2, aggregates recalculated

2. **INC-002:** User adds position in the middle (not most recent)
   - **Validate:** Correct chronological insertion, indices recalculated
   - **Expected:** If dates are 2015-2017, inserted between 2018 and 2014 positions

3. **INC-003:** User edits existing position (updates achievements)
   - **Validate:** Only target position modified, others unchanged
   - **Expected:** Version comment added, aggregates recalculated if metrics changed

4. **INC-004:** User removes position from job history
   - **Validate:** Position deleted, indices recalculated, aggregates updated
   - **Expected:** Years of experience reduced, skills from removed position excluded from aggregates

5. **INC-005:** User adds position with no hard skills
   - **Validate:** hard_skills_demonstrated = empty array, not null
   - **Expected:** Schema validation passes, evidence matcher handles gracefully

6. **INC-006:** User edits position dates (extending duration)
   - **Validate:** Aggregate years of experience recalculated
   - **Expected:** If original 2020-2022 (2 years) → 2020-2023 (3 years), total +1 year

7. **INC-007:** User adds position with company that already exists in history
   - **Validate:** Both positions preserved, evidence citations disambiguate
   - **Expected:** "Google | Software Engineer (2018-2020)" vs "Google | Senior SWE (2020-2022)"

8. **INC-008:** User removes last remaining position
   - **Validate:** System warns before deletion
   - **Expected:** "This will delete your entire job history. Confirm?"

9. **INC-009:** User adds position with future start date (error case)
   - **Validate:** Date validation catches error
   - **Expected:** "Start date cannot be in the future. Please verify dates."

10. **INC-010:** User adds position while Phase 3 comparison is in progress
    - **Validate:** System handles concurrent operations
    - **Expected:** Either queue update or prompt user to wait for comparison to complete

---

### Gap 3: Phase 3 Re-Comparison with Diff Output
**Missing:** Diff accuracy validation tests

**Required Test Cases (~7 tests):**

1. **DIFF-001:** User updates job history (adds Python skill) → re-runs previous JD comparison
   - **Validate:** Diff shows: "Python: MISSING → MATCHED"
   - **Expected:** Improvements section lists Python with before/after status

2. **DIFF-002:** User re-runs comparison without any job history changes
   - **Validate:** Diff shows "No changes detected"
   - **Expected:** All requirements maintain same status (MATCHED stays MATCHED, MISSING stays MISSING)

3. **DIFF-003:** Score delta calculation accuracy
   - **Validate:** Previous score 72%, new score 81% → delta = +9 points
   - **Expected:** Diff output: "Overall Match: 72% → 81% (+9 points improvement)"

4. **DIFF-004:** User updates job history but removes a previously matched skill
   - **Validate:** Diff shows regression: "SQL: MATCHED → PARTIAL" (if still partially present)
   - **Expected:** Regressions section lists SQL with explanation

5. **DIFF-005:** JD cached version mismatch (cache is v1, current schema is v2)
   - **Validate:** System detects version mismatch, re-parses JD
   - **Expected:** Warning: "Cached JD uses outdated schema. Re-parsing..."

6. **DIFF-006:** User runs re-comparison with different job history version (v1.0 → v2.0 upgrade)
   - **Validate:** Diff handles schema change gracefully
   - **Expected:** Note: "Job history upgraded from v1.0 to v2.0. Hard/soft skills now separated."

7. **DIFF-007:** User deletes cached JD → tries to re-compare
   - **Validate:** System detects missing cache, prompts for JD re-upload
   - **Expected:** "Cached JD not found. Please paste the job description again."

---

### Gap 4: Phase 4 Professional Summary Validation
**Missing:** Summary quality and accuracy tests

**Required Test Cases (~7 tests):**

1. **SUM-001:** Master summary generation from complete job history (3 positions)
   - **Validate:** 3-4 sentences, includes aggregates (total years, companies, team sizes)
   - **Expected:** "Senior PM with 8 years across Google, Amazon, Startup. Led 15+ product launches..."

2. **SUM-002:** Master summary from single position
   - **Validate:** Adjusts phrasing to avoid "across X companies"
   - **Expected:** "Senior PM with 3 years at Google. Led 5 product launches..."

3. **SUM-003:** Per-JD summary customization (JD requires Python, AWS, Kubernetes)
   - **Validate:** Replaces generic hard skills with JD-specific keywords
   - **Expected:** Original: "Expert in Agile, SQL, JavaScript" → Customized: "Expert in Python, AWS, Kubernetes"

4. **SUM-004:** Summary generation with no quantified metrics in job history
   - **Validate:** Omits metrics sentence gracefully
   - **Expected:** "Senior PM with 5 years at TechCorp. Led cross-functional teams. Expert in..."

5. **SUM-005:** Per-JD summary when match score < 50
   - **Validate:** System doesn't offer per-JD summary (low fit job)
   - **Expected:** Only master summary provided, no customization offered

6. **SUM-006:** Summary exceeds 350 character limit
   - **Validate:** Truncates intelligently at sentence boundary
   - **Expected:** Last incomplete sentence removed, ends with period

7. **SUM-007:** User has career change (unrelated positions: Teacher → Software Engineer)
   - **Validate:** Summary emphasizes transferable skills
   - **Expected:** "Career transitioned from education to software engineering. 3 years teaching..."

---

## Test File Structure Recommendation

**Option A: Append to Existing File** (RECOMMENDED)
Add new sections to `v6.0-deep-dive-test-cases.md`:

```markdown
## PART 10: Phase 2 Integration Flow Tests (8 tests)
[INT-001 through INT-008]

## PART 11: Phase 3 Incremental Update Tests (10 tests)
[INC-001 through INC-010]

## PART 12: Phase 3 Re-Comparison Diff Tests (7 tests)
[DIFF-001 through DIFF-007]

## PART 13: Phase 4 Professional Summary Tests (7 tests)
[SUM-001 through SUM-007]
```

**Option B: Create Separate Phase Files**
Create new files:
- `test-cases-phase-2-integration.md` (8 tests)
- `test-cases-phase-3-workflows.md` (17 tests)
- `test-cases-phase-4-summaries.md` (7 tests)

---

## Deliverable Format

For each test case, provide:

```markdown
| Test ID | Scenario | Input | Expected Output | Validation Rule |
|---------|----------|-------|-----------------|-----------------|
| [ID] | [Description] | [What user provides] | [What system should do] | [How to verify correctness] |
```

**Example:**

| Test ID | Scenario | Input | Expected Output | Validation Rule |
|---------|----------|-------|-----------------|-----------------|
| INT-001 | Phase 1 → Phase 3 integration | Job history v2.0 + JD | Evidence citations with proper format | Check: "Company \| Job Title" format, no "Resume -" prefix |

---

## Success Criteria

- [ ] 32 new test cases created (8 + 10 + 7 + 7)
- [ ] Each test has: ID, scenario, input, expected output, validation rule
- [ ] Tests integrated into existing test documentation (appended to `v6.0-deep-dive-test-cases.md` or separate files)
- [ ] Test IDs follow naming convention (INT-XXX, INC-XXX, DIFF-XXX, SUM-XXX)
- [ ] Total test coverage: 127+ tests (95 existing + 32 new)

---

## Additional Context for Opus

**Existing Test Coverage (v6.0-deep-dive-test-cases.md):**
- JD Parser: 22 tests (missing fields, location, salary)
- Skills Categorizer: 25 tests (ambiguous skills, multi-meaning)
- Evidence Matcher: 16 tests (citations, confidence) - PARTIAL, needs integration tests
- Router: 17 tests (intent, state recovery)
- Summary Generator: 8 tests (edge cases) - PARTIAL, needs quality validation

**Phase Implementation Details:**
- **Phase 1 (v6.0.1):** Job history v2.0, 17-point JD parser, entry router
- **Phase 2 (v6.0.2):** Evidence matching with citations, blocking gates
- **Phase 3 (v6.0.3):** Workflow router, incremental updates, re-comparison
- **Phase 4 (v6.0.4):** Professional summary (master + per-JD)

**Files to Reference:**
- `optimization-tools/bullet-optimizer/evidence-matching.md` - Evidence matching logic
- `optimization-tools/job-fit-analyzer/incremental-updates.md` - Add/edit/remove operations
- `optimization-tools/job-fit-analyzer/re-comparison.md` - Diff calculation logic
- `optimization-tools/narrative-generator/summary-generation.md` - Summary templates

---

**Estimated Completion Time:** 45-60 minutes
```

---

## 🔄 Execution Sequence

### Step 1: v6.1.1 - Folder Restructure (30 min)
1. Rename `shared/` → `optimization-tools/`
2. Update references in 5 files
3. Search for remaining `shared/` references
4. Commit: `refactor(v6.1.1): rename /shared/ to /optimization-tools/ for clarity`

### Step 2: v6.1.2 - Documentation Updates (45 min)
1. Update README.md (28 Mode→Phase changes + Job Summary tip)
2. Add CHANGELOG v6.1.0 entry
3. Add ROADMAP v6.1.0 entry
4. Commit: `docs(v6.1.2): terminology consistency and Job Summary guide`

### Step 3: v6.1.3 - Wireframe Creation (90 min)
1. Create `/wireframes/` directory
2. Write 10 wireframe files (5 ASCII + 5 Mermaid)
3. Test rendering (ASCII in terminal, Mermaid on GitHub)
4. Commit: `docs(v6.1.3): add comprehensive visual wireframes for all phases`

### Step 4: v6.1.4 - Legacy Archival (20 min)
1. Create `/docs/legacy/` structure
2. Move obsolete files
3. Create legacy README
4. Commit: `chore(v6.1.4): archive v5.0 legacy files to docs/legacy`

### Step 5: v6.1.5 - Test Case Gap-Filling (Opus)
1. Provide Opus with test plan (from section above)
2. Review Opus deliverable (32 new test cases)
3. Integrate into test documentation
4. Commit: `test(v6.1.5): add 32 test cases for Phases 2-4 integration`

**Total estimated time:** ~3 hours (excluding Opus work)

---

## ✅ Success Criteria

### Functional
- [ ] All `/shared/` references updated to `/optimization-tools/`
- [ ] README has Job Summary usage guide
- [ ] 28 Mode→Phase terminology updates complete
- [ ] 10 wireframe files created and rendering correctly
- [ ] All legacy files archived to `/docs/legacy/`
- [ ] No broken file paths or duplicate files

### Documentation
- [ ] CHANGELOG v6.1.0 entry complete with all sub-versions
- [ ] ROADMAP v6.1.0 tracking entry added
- [ ] Legacy README explains what's archived and why
- [ ] Version updated to 6.1.0 in README

### Testing
- [ ] Test plan provided to Opus
- [ ] 32 new test cases created by Opus
- [ ] Test cases integrated into documentation
- [ ] Total coverage: 127+ tests

### Quality
- [ ] Each sub-version has its own plan document
- [ ] Each commit uses conventional commit format
- [ ] Inline version comments added (v6.1.X)
- [ ] All files pass validation checks

---

## 📊 Impact Summary

**Files to rename:** 1 directory (`shared/` → `optimization-tools/`)
**Files to create:** 17 files (10 wireframes + 5 plans + 1 legacy README + 1 test doc)
**Files to modify:** 5 files (README, CHANGELOG, ROADMAP, PROJECT-INSTRUCTIONS, quick-start-mode)
**Files to move:** ~12 files (to `/docs/legacy/`)
**Files to delete:** 1 file (root `CHANGELOG.md` duplicate)

**Total changes:** ~36 file operations

---

## 🚀 Next Steps (Post-v6.1.0)

### v6.1.1+ (Future patches)
- User feedback on wireframe clarity
- Additional test cases if gaps found
- Quick-start-mode.md terminology updates

### v6.2.0+ (Future features)
- Output specification templates (from ROADMAP)
- Enhanced error messages (E001-E008)
- Batch JD comparison

---

**Plan Status:** READY FOR USER APPROVAL
**Created:** 2025-12-29
**Next Step:** Get user confirmation, then execute v6.1.1
