# v6.1.9 - Consolidated Test Cases (Phases 2-4)

**Version:** 6.1.9
**Date:** 2025-12-30
**Authors:** Claude Sonnet 4 (baseline) + Claude Opus 4.5 (expansion + corrections)
**Total Test Cases:** 79

This consolidated file merges all Phase 2-4 test cases into a single reference document.

---

## Test Case Summary

| Part | Category | Count | Author | Focus |
|------|----------|-------|--------|-------|
| 10 | INT | 8 | Sonnet | Phase 2 Integration Flow |
| 11 | INC | 10 | Sonnet | Phase 3 Incremental Updates |
| 12 | DIFF | 7 | Sonnet | Phase 3 Re-Comparison |
| 13 | SUM | 7 | Sonnet | Phase 4 Summary Generation |
| 14 | INTX | 8 | Opus | Extended Integration |
| 15 | INCX | 10 | Opus | Extended Incremental Updates |
| 16 | DIFFX | 7 | Opus | Extended Diff Scenarios |
| 17 | SUMX | 8 | Opus | Extended Summary |
| 18 | GATE | 7 | Opus | Blocking Gate Combinations |
| 19 | ERR | 7 | Opus | Error Recovery |
| 20 | FIX | 12 | Opus | Logic Corrections & Gaps |

**Grand Total:** 79 test cases for Phases 2-4

---

## PART 10: Phase 2 Integration Flow Tests (Sonnet Baseline)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| INT-001 | Phase 1 → Phase 3 Data Flow | Job history v2.0 + JD | v2.0 job history loads correctly, hard/soft skills separated | Check: Evidence citations use "Company \| Job Title" format |
| INT-002 | v1.0 History Backward Compatibility | v1.0 job history + Phase 3 run | System loads v1.0, suggest upgrade, functions normally | Check: Evidence matching works with combined skills array |
| INT-003 | Missing Sections Handling | History with no education/certs | System marks those requirements as MISSING without error | Check: No null reference errors during analysis |
| INT-004 | Duplicate Skill Citations | Skill "Python" in 3 different roles | Evidence citations list all occurrences across all positions | Check: Multiple citations grouped per position |
| INT-005 | Overlapping Dates (Moonlighting) | Positions with overlapping date ranges | System doesn't double-count years of experience in aggregates | Check: Conservative aggregate calculation (max range) |
| INT-006 | Achievement-Based Inference | Achievement matches JD but skill not listed | Status set to INFERRED based on accomplishment context | Check: Citation points to achievement quote, confidence >= 0.5 |
| INT-007 | Required vs Preferred Weighting | JD with mixed priority requirements | Status affects score proportionally (Required = 1.5x Preferred) | Check: Missing Required impacts score more than Missing Preferred |
| INT-008 | Blocking Gate Override | Trigger gate (e.g., low score) + User "yes" | System logs override and continues to recommendations | Check: Recommendations generated after confirmation |

---

## PART 11: Phase 3 Incremental Update Tests (Sonnet Baseline)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| INC-001 | Add Recent Position | Add new position (current) | Position inserted at index 1, others shifted down | Check: New position is first, dates are most recent |
| INC-002 | Add Chronological Position | Add position from 2016-2018 | Position inserted between 2019 and 2015 roles | Check: Position Index 3 (or correct position) updated |
| INC-003 | Edit Position Achievements | Update text in Position 2 | Only Position 2 modified, others preserved | Check: Version metadata updated, aggregates refreshed |
| INC-004 | Remove Position | Delete Position 4 | Position removed, indices 5+ shifted DOWN to 4+ | Check: Aggregate years of experience reduced correctly |
| INC-005 | Add Position (No Skills) | Position with empty skills list | Schema validation passes, matched as empty array | Check: Evidence matcher handles empty skills without error |
| INC-006 | Extend Position Duration | Update 2020-2022 to 2020-2023 | Aggregate years of experience increases by 1 | Check: `total_years` in metadata reflects change |
| INC-007 | Multiple Roles @ Same Company | Add new role at existing company | Both roles preserved with distinct titles/dates | Check: Citations show both roles: "Google \| SWE" & "Google \| Sr SWE" |
| INC-008 | Delete Last Position | Attempt to delete only position | System warns that history will be empty | Check: Require explicit confirmation for total deletion |
| INC-009 | Future Date Validation | Start date = 2026-01-01 | Rejects input with clear error message | Check: Error "Start date cannot be in the future" |
| INC-010 | Concurrent Operation | Add position while Phase 3 runs | System queues update or warns user | Check: State integrity maintained after both finish |

---

## PART 12: Phase 3 Re-Comparison & Diff Tests (Sonnet Baseline)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| DIFF-001 | Skill Improvement | Status: MISSING → MATCHED | Diff shows Python as an improvement | Check: "Improvements" section lists Python with status change |
| DIFF-002 | Re-comparison (No Change) | Run comparison with same files | Diff shows "No changes detected" | Check: Score delta = 0, no items in improvements/regressions |
| DIFF-003 | Score Delta Accuracy | 72% → 81% change | Displays +9 points improvement correctly | Check: Math matches (81 - 72 = 9) |
| DIFF-004 | Skill Regression | Status: MATCHED → PARTIAL | Diff shows regression with recommendation | Check: "Regressions" section lists SQL with explanation |
| DIFF-005 | Cache Version Mismatch | v1.0 Cache + v2.0 Schema | System re-parses JD using 17-point parser | Check: Warning "Outdated schema. Re-parsing..." shown |
| DIFF-006 | Schema Upgrade Diff | Upgrade history v1.0 → v2.0 | Diff notes structural enhancement | Check: "Job history upgraded" note appears in summary |
| DIFF-007 | Missing Cache Recovery | Delete `jd_parsed/` entry | System prompts for JD text re-upload | Check: Error "Cached JD not found" prompts for input |

---

## PART 13: Phase 4 Professional Summary Tests (Sonnet Baseline)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| SUM-001 | Master Summary (Multi-Role) | 3 roles in history | Generates 3-4 sentences with career aggregates | Check: Includes "X years across Y companies" phrasing |
| SUM-002 | Master Summary (Single Role) | 1 role in history | Adjusts phrasing to focus on depth at 1 company | Check: No plural "companies" if only one listed |
| SUM-003 | Per-JD Customization | JD keywords: Python, AWS | Substitutes generic hard skills with JD keywords | Check: "Expert in Python, AWS" replaces master skills |
| SUM-004 | Summary (No Metrics) | History with zero numbers | Omits metrics sentence gracefully, focus on scope | Check: No placeholder zeros or awkward blank spaces |
| SUM-005 | Low Fit Protection | Match Score < 30 (gate threshold) | Does not offer customized per-JD summary | Check: Customization prompt skipped after gate triggers |
| SUM-006 | Length Constraint | Summary > 350 chars | Truncates at nearest sentence boundary | Check: Character count <= 350, no partial sentences |
| SUM-007 | Career Transition | Teacher → Engineer | Focuses on transferable skills (leadership, training) | Check: Highlights relevant bridge skills in summary |

---

## PART 14: Extended Integration Flow Tests (Opus)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| INTX-001 | Contractor Citation Format | History: "Accenture (Client: DHS)" | Citation: "Accenture (Client: DHS) \| Business Analyst" | Check: Client relationship preserved in citation |
| INTX-002 | Freelance Multi-Client | History: 5 freelance clients, same period | Citation: "Freelance (5 clients) \| Consultant (2019-2022)" | Check: Client count aggregated, not listed individually |
| INTX-003 | Internship vs Full-Time Weighting | JD requires "5+ years experience", history has 3 FT + 2 intern | System calculates 3 years (interns weighted 0.5x or excluded) | Check: Internship disclaimer in experience calculation |
| INTX-004 | Evidence from Certification Only | JD: "AWS required", History: No AWS work but has AWS cert | Status: MATCHED via certification, confidence 0.9 | Check: Citation references certification, not job experience |
| INTX-005 | Stale Skills (>5 years old) | JD: "Python", History: Python used only 2015-2017 | Status: PARTIAL (stale), recommendation to highlight recent use | Check: Recency warning displayed with skill match |
| INTX-006 | Implicit Skill from Tool | JD: "SQL", History: "Used Tableau for reporting" | Status: INFERRED (Tableau implies SQL), confidence 0.6 | Check: Inference reasoning displayed in gap rationale |
| INTX-007 | Skill Level Mismatch | JD: "Expert Python", History: "Python (intermediate)" | Status: PARTIAL, gap rationale explains level deficit | Check: Proficiency level noted in evidence |
| INTX-008 | Cross-Position Skill Aggregation | JD: "5+ years Python", History: 2 yrs @ Co A + 3 yrs @ Co B | Status: MATCHED, citations show both positions | Check: Combined duration >= requirement threshold |

---

## PART 15: Extended Incremental Update Tests (Opus)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| INCX-001 | Batch Add (3 positions at once) | User provides 3 positions in single message | All 3 added, sorted chronologically, single confirmation | Check: All positions indexed correctly in one operation |
| INCX-002 | Edit Causes Skill Reclassification | Edit: Change "Managed projects" → "Managed Scrum sprints" | Skills array updated: +Scrum (hard), recategorization runs | Check: Skills arrays reflect new keywords |
| INCX-003 | Edit Position Title to Match JD | Edit: "PM" → "Product Manager" (matches JD exactly) | Re-comparison would show improved keyword match | Check: Title change updates evidence citations |
| INCX-004 | Remove Position Referenced in Cache | Position 2 cited in cached JD comparison | Warning: "This position is referenced in 2 cached comparisons" | Check: User informed of downstream impact |
| INCX-005 | Add Position with Only Soft Skills | Position has: Leadership, Communication, Teamwork | hard_skills_demonstrated: [], soft_skills_demonstrated: [3 items] | Check: Empty hard skills array doesn't cause errors |
| INCX-006 | Merge Duplicate Companies | 2 positions at "Google Inc" and "Google LLC" | System suggests merge: "Same company? Combine?" | Check: Company name normalization offered |
| INCX-007 | Split One Position into Two | User: "Actually that was two roles at same company" | System creates 2 position entries, divides achievements | Check: Original achievements distributed, no duplication |
| INCX-008 | Add Position with Gap Before | Add 2020-2022 role, gap exists 2018-2020 | Gap noted in metadata but no penalty | Check: Employment gap flagged for user awareness only |
| INCX-009 | Edit End Date to Future | User: "Change end date to 2026-06" | Rejects with "End date cannot be in the future" | Check: Validation triggers on edit, not just add |
| INCX-010 | Undo Last Edit | User: "Undo that change" immediately after edit | Previous version restored from checkpoint | Check: Checkpoint system maintains last-known-good state |

---

## PART 16: Extended Diff Tests (Opus)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| DIFFX-001 | Score Decrease (Regression) | Remove Python from history, re-run JD | Score drops (e.g., 81% → 68%), "Regressions" section shows Python | Check: Regression clearly labeled with previous status |
| DIFFX-002 | Multiple JDs Re-Compared | User: "Re-run comparisons for all saved JDs" | Batch re-comparison, summary table of score deltas | Check: Each JD shows individual delta and aggregate trend |
| DIFFX-003 | JD Updated Since Last Comparison | JD in cache differs from pasted JD (employer updated posting) | Warning: "JD appears modified. Re-parse?" | Check: Hash/checksum comparison detects changes |
| DIFFX-004 | Mixed Improvements/Regressions | Add Python (+), Remove SQL (-) | Improvements: Python, Regressions: SQL, Net: 0 delta | Check: Both sections populated correctly |
| DIFFX-005 | Status Change Within Same Category | PARTIAL (0.5) → PARTIAL (0.75) improvement | Shows as improvement with confidence delta | Check: Intra-status improvements tracked |
| DIFFX-006 | Re-Comparison After Schema Upgrade | v1.0 → v2.0 upgrade, then re-compare | System notes new fields available (hard/soft separation) | Check: "Enhanced analysis available" message |
| DIFFX-007 | Stale Cache Warning | Cache is 30+ days old | Warning: "Cached JD is 45 days old. Employer may have updated." | Check: Age threshold triggers staleness warning |

---

## PART 17: Extended Summary Tests (Opus)

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| SUMX-001 | Executive-Level Summary | History: VP/C-level roles only | Summary emphasizes strategic impact, P&L, board exposure | Check: Seniority-appropriate language used |
| SUMX-002 | Entry-Level Summary | History: 1-2 years, junior roles | Summary emphasizes growth potential, education, skills | Check: No overclaiming of experience |
| SUMX-003 | Per-JD Summary Skill Substitution Limit | JD has 8 required skills, summary can fit 3 | Top 3 by priority inserted, others omitted | Check: Highest-priority skills selected |
| SUMX-004 | Summary with Conflicting Metrics | History: "Saved $2M" and "Reduced costs by $500K" at same company | Aggregates conservatively or uses larger figure with context | Check: No double-counting of metrics |
| SUMX-005 | Industry Pivot Summary | History: Healthcare → Tech transition | Summary bridges domains: "Healthcare tech expertise transitioning to SaaS" | Check: Transition narrative present |
| SUMX-006 | Remote Work Emphasis | JD: "Remote position", History: 3 years remote | Summary includes "experienced remote collaborator" language | Check: Remote compatibility highlighted when relevant |
| SUMX-007 | Summary Keyword Density Check | Per-JD summary generated | At least 2 JD keywords appear in first 100 characters | Check: Keyword density meets ATS optimization |
| SUMX-008 | No Recognizable Companies | History: All small/unknown companies | Summary omits company name-dropping, focuses on achievements | Check: No awkward "at CompanyX you've never heard of" phrasing |

---

## PART 18: Blocking Gate Combination Tests (Opus)

| Test ID | Scenario | Gates Triggered | Expected Behavior | Validation Rule |
|---------|----------|-----------------|-------------------|-----------------|
| GATE-001 | Hard Skill + Location Gate | Missing 4/6 hard skills AND location mismatch | Both warnings displayed, most severe first | Check: Location gate shown before skills gate |
| GATE-002 | Low Score + Hard Skill Deficit | Score = 28% AND missing 5/7 hard skills | Single combined warning (not two separate) | Check: Warnings consolidated, not duplicated |
| GATE-003 | Gate Override Persistence | User overrides Gate 1, hits Gate 2 | Gate 2 still fires (override is per-gate) | Check: Override doesn't bypass subsequent gates |
| GATE-004 | All Gates Pass (Edge Case) | Score = 50, skills balanced, location match | No gates triggered, proceeds to recommendations | Check: Smooth flow when all gates pass |
| GATE-005 | Location Gate with Remote Exception | JD: "NYC only" but user in NJ | Warning but note: "You may be within commuting distance" | Check: Proximity detection for non-exact matches |
| GATE-006 | Gate Skip for Returning User | User previously overrode all gates for this JD | System remembers preference, skips gates on re-comparison | Check: Override state persisted in JD cache |
| GATE-007 | Borderline Score (29 vs 30 threshold) | Score = 29.5, rounds to 30 | Gate does NOT trigger (30 is threshold) | Check: Rounding favors user at boundary |

---

## PART 19: Error Recovery Tests (Opus)

| Test ID | Scenario | Error Condition | Expected Recovery | Validation Rule |
|---------|----------|-----------------|-------------------|-----------------|
| ERR-001 | Corrupted Job History JSON | Invalid JSON in v2.0 file | Error: "Job history file corrupted. Restore backup?" | Check: Backup offered, not silent failure |
| ERR-002 | Missing Schema Version | v2.0 file missing `schema_version` field | System infers version from structure, warns user | Check: Graceful degradation with warning |
| ERR-003 | Position with Null Required Field | Position missing `job_title` (required) | System prompts: "Position 3 is missing job title. Enter now?" | Check: Repair prompt before proceeding |
| ERR-004 | Circular Skill Reference | Skill A implies B, B implies A (edge case) | System detects loop, breaks at first occurrence | Check: No infinite loop in inference |
| ERR-005 | JD Parse Timeout | JD parsing exceeds 30 seconds | Partial result returned with warning, retry offered | Check: Timeout doesn't crash, partial data preserved |
| ERR-006 | Duplicate Position Detection | Two positions with identical company/title/dates | Warning: "Duplicate position detected. Remove one?" | Check: Duplicate flagged, user decides |
| ERR-007 | Cache Read Failure | `jd_parsed/` directory permissions issue | Error with specific remedy: "Check folder permissions" | Check: Actionable error message provided |

---

## PART 20: Logic Corrections & Gap-Filling Tests (Opus)

### Sonnet Logic Issues Corrected

| Original Test | Issue | Correction Applied |
|---------------|-------|-------------------|
| INC-004 | Said indices "shifted up" | Corrected to "shifted DOWN" |
| SUM-005 | Used score 42 as threshold | Corrected to use gate threshold (<30) |
| INT-007 | No weight ratios specified | Added: Required = 1.5x Preferred |
| INT-006 | Confidence "> 0.5" ambiguous | Clarified: ">= 0.5" (inclusive) |

### Gap-Filling Tests

| Test ID | Scenario | Input | Expected Behavior | Validation Rule |
|---------|----------|-------|-------------------|-----------------|
| FIX-001 | Skill Case Sensitivity | JD: "Python", History: "PYTHON" | Status: MATCHED (case-insensitive) | Check: Matching ignores case |
| FIX-002 | Duplicate Skill Within Position | Position has ["Python", "python", "SQL"] | Deduplicates to ["Python", "SQL"] | Check: No duplicate entries in arrays |
| FIX-003 | JD with Only Preferred Skills | JD has skills_wanted but empty skills_needed | System proceeds without hard-skill gate | Check: Gate logic handles missing required section |
| FIX-004 | Inverted Date Range | Position: start=2023-01, end=2020-01 | Error: "End date cannot be before start date" | Check: Date order validated |
| FIX-005 | Confidence Boundary (0.5) | Inference confidence = exactly 0.50 | Status: INFERRED (0.5 is inclusive threshold) | Check: Boundary handled consistently |
| FIX-006 | Score Boundary (30) | Match score = exactly 30 | Gate does NOT trigger (>= 30 is passing) | Check: Boundary condition correct |
| FIX-007 | Two Simultaneous Full-Time Jobs | 2 W-2 positions with identical date ranges | Warning: "Overlapping full-time roles detected" | Check: Moonlighting flagged for review |
| FIX-008 | Required vs Preferred Weight Ratio | JD: 2 Required MISSING, 4 Preferred MATCHED | Score formula: Required = 1.5x weight in calculation | Check: Score reflects weighted priorities |
| FIX-009 | Empty skills_needed Array | JD parses with skills_needed: [] | Hard skill gate skipped, soft skills evaluated | Check: Empty array doesn't crash gate logic |
| FIX-010 | Position Index After Removal | Remove Position 3 of 5 | Positions 4,5 become 3,4 (shift DOWN not up) | Check: Indices decrement correctly |
| FIX-011 | Summary Low Experience | History: 1 year total experience | Summary says "1 year" not "years across companies" | Check: Grammar/phrasing adjusts to experience level |
| FIX-012 | Fuzzy Company Match in Citation | History: "Google LLC", JD match from "Alphabet/Google" | Citation normalizes to standard name | Check: Related company names recognized |

---

## Execution Priority Matrix

| Priority | Test IDs | Rationale |
|----------|----------|-----------|
| **P0 (Critical)** | GATE-*, ERR-001 to ERR-003, FIX-004 to FIX-010 | Blocking gates, data integrity, boundary conditions |
| **P1 (High)** | INT-001 to INT-008, INTX-001 to INTX-004, DIFF-001, DIFFX-001, FIX-001 to FIX-003 | Core workflow reliability |
| **P2 (Medium)** | INC-*, INCX-*, SUM-*, SUMX-*, FIX-011, FIX-012 | Feature completeness |
| **P3 (Low)** | Remaining tests | Edge case coverage |

---

## Test Suite Statistics

| Metric | Value |
|--------|-------|
| Total Tests (Phases 2-4) | 79 |
| Sonnet Baseline | 32 |
| Opus Extended | 35 |
| Opus Corrections/Gaps | 12 |
| P0 Critical Tests | 23 |
| P1 High Priority | 17 |
| P2 Medium Priority | 28 |
| P3 Low Priority | 11 |

---

## Related Files

| File | Description |
|------|-------------|
| `v6.0-deep-dive-test-cases.md` | 95+ Phase 1 tests (JD parser, skills, router) |
| `v6.1.5-sonnet-test-cases.md` | Original Sonnet baseline (superseded by this file) |
| `v6.1.5-opus-expanded-test-cases.md` | Opus expansion details (superseded by this file) |
| `v6.1.5-test-results.md` | Test execution results |

**Combined with Phase 1 tests: 174+ total test cases**
