# v6.0 Implementation Handoff - Opus → Sonnet

**Date:** 2025-12-28
**From:** Opus (planning & decisions)
**To:** Sonnet (implementation)
**Status:** Ready for Phase 1 (v6.0.1)

---

## Context

User and Opus completed a deep dive review session resulting in:
- 10 critical design decisions
- Removal of multi-track from scope
- 4-phase implementation approach (due to token budget)

**Key Documents:**
- [v6.0-implementation-plan.md](v6.0-implementation-plan.md) - Master plan with all decisions
- [v6.0-deep-dive-test-cases.md](v6.0-deep-dive-test-cases.md) - 95+ test cases for QA
- [ROADMAP.md](/ROADMAP.md) - Version planning

---

## 10 Critical Decisions Made

### Decision 1: Phase 1 Test Case Priority
**Must-have for launch (31 tests):**
- JD missing fields (8)
- Ambiguous skills (10)
- Location parsing (7)
- Router intent (6)

**Deferred:** Summary edge cases, performance benchmarks

### Decision 2: Blocking Gates - Soft Block
Gates **warn but allow override** (not hard block).

**Message must include:**
```
⚠ WARNING: Poor Job Fit Detected

Hard Skills Required by JD:
  [MATCHED] Python, SQL
  [MISSING] AWS, Kubernetes, Docker, React, TypeScript

You are missing 5 of 7 required hard skills.

Proceeding will use tokens to generate recommendations that are unlikely
to be useful. This is not advised.

Do you want to proceed anyway? (yes/no)
```

### Decision 3: Evidence Matching - Two-Part Check
1. **Evidence Match:** Search job history for demonstrated experience (not just keyword)
2. **Keyword Check:** Flag if keyword missing from resume even when evidence exists

**Example:**
```
[MATCHED] Agile
  Evidence: "Led sprint planning sessions" (Company | PM)
  Keyword recommendation: Ensure "Agile" appears in skills or summary
```

### Decision 4: Remote Work - Four Contextual Labels
| JD Pattern | Label |
|------------|-------|
| "Must be within commuting distance" | [REMOTE - PROXIMITY REQUIRED] |
| "Remote for candidates in [state/region]" | [REMOTE - LOCATION DEPENDENT] |
| Vague remote language | [REMOTE - VERIFY REQUIREMENTS] |
| "Remote with occasional on-site" | [LIMITED REMOTE] |

Each must include explanation of why it's flagged.

### Decision 5: Evidence Citation Format
| Scenario | Format |
|----------|--------|
| Same company, multiple roles | Show each role separately with dates |
| Contractor | `Accenture (Client: DHS) \| Analyst` |
| Freelance | `Consultant \| Freelance (5 clients)` |

**Example with promotions:**
```
[MATCHED] Python
  Evidence:
  - "Developed ETL pipelines"
    → Google | PM (2018-2020)
  - "Built automation scripts"
    → Google | Lead PM (2022-2024)
```

### Decision 6: Missing JD Fields - Null + Infer
| Missing Field | Behavior |
|---------------|----------|
| Salary, clearance, education | Set to null, continue silently |
| Skills section | Infer from responsibilities text |
| Location | Set to null, continue silently |

No warnings about incomplete JDs.

### Decision 7: Router Ambiguous Input - Confirm + Follow-up
Two-step guided conversation:
```
Step 1: Confirm assumption
"This looks like a professional summary. Is that correct? (yes/no)"

Step 2a: If yes
"Would you like me to optimize it?"

Step 2b: If no
"Got it. Is this:
 1. Part of a resume (I'll analyze it)
 2. Part of a JD (I'll compare)
 3. Something else"
```

### Decision 8: Error Message Tone - Hybrid
Clear explanation + context + actionable options.

**Example:**
```
There's an issue with your job history: the 3rd position (Senior Analyst,
2019-2021) is missing a company name.

Options:
1. I'll help you add it
2. Skip this position for now
```

### Decision 9: State Recovery - Removed
**Decision:** State recovery removed from scope.

**Rationale:** We don't control the LLM environment, so we can't implement checkpoints.

**User notifications added:**
- Welcome message explaining file persistence
- End of Mode 1 message confirming save

### Decision 10: Progress Indicators - No Time Targets
Show progress without documented performance targets.

**Example:**
```
Parsing job description...
Extracting skills and requirements...
Matching against your job history...
Generating gap analysis...
Done.
```

---

## Scope Changes from Original Plan

**Removed:**
- Multi-track career support (deferred to v6.2+)
- State recovery/checkpoints (not possible)
- Performance benchmarks with time targets

**Added:**
- Soft blocking gates with skill list
- Evidence-based matching with keyword check
- Four contextual remote work labels
- User notifications about file persistence
- Progress indicators

---

## 4-Phase Implementation Approach

Due to token budget constraints, v6.0 is split into 4 sub-versions:

| Phase | Version | Files | Token Budget |
|-------|---------|-------|--------------|
| 1 | v6.0.1-foundation | 3 new | 53K |
| 2 | v6.0.2-core-integration | 3 modified | 64K |
| 3 | v6.0.3-router-workflows | 2 new | 49K |
| 4 | v6.0.4-summary-polish | 2 modified | 37K |

Each phase has its own plan file in `/docs/plans/`.

---

## Start with Phase 1 (v6.0.1)

**Branch:** `v6.0.1-foundation`

**Files to create:**
1. `shared/job-history-v2-creation.md` - 12-section schema
2. `shared/jd-parsing-17-point.md` - 17-point JD parser
3. `shared/entry-router.md` - 5-scenario routing

**Critical requirements:**
- Evidence-based matching with keyword check (Decision 3)
- Hard/soft skill separation with context analysis
- Citation format: `Company | Title (dates)` (Decision 5)

**Test after Phase 1:**
- Parse sample JD, verify all 17 fields extracted
- Run sample resume, verify job history v2.0 format
- Test router with 5 scenarios

---

## Watch Out For

### 1. Hard/Soft Skill Classification
**Risk:** Misclassification breaks blocking gates.

**Mitigation:**
- Use context clues ("certification" → HARD, "mindset" → SOFT)
- Default to HARD when ambiguous (safer for gates)
- See Decision 3

### 2. Evidence Citation Format
**Risk:** Inconsistent source formats.

**Mitigation:**
- Enforce `Company | Title (dates)` during job history creation
- See Decision 5 for edge cases (contractor, freelance, promotions)

### 3. Missing JD Fields
**Risk:** Parser fails on incomplete JDs.

**Mitigation:**
- Set missing fields to null, continue silently
- Infer skills from responsibilities if skills section missing
- See Decision 6

### 4. Router False Positives
**Risk:** Router misidentifies input type.

**Mitigation:**
- Use JD validation heuristics (must contain "requirements", "qualifications")
- Confirm with user when confidence is low
- See Decision 7

### 5. Blocking Gates Too Aggressive
**Risk:** Users get blocked on close matches.

**Solution implemented:**
- Soft block with override option (Decision 2)
- Show which skills are missing
- Warn about token usage

---

## Success Criteria (Phase 1)

- [ ] Job history v2.0 generated with all 12 sections
- [ ] Hard/soft skills separated correctly
- [ ] 17-point JD parsing extracts all fields
- [ ] Router detects all 5 scenarios correctly
- [ ] Entry router confirms before executing mode
- [ ] Evidence citations use correct format

---

## After Phase 1

1. **Test** against the must-have test cases (31 tests)
2. **Commit** to branch `v6.0.1-foundation`
3. **Continue** to Phase 2 (v6.0.2-core-integration)

---

## Questions? Check These First

1. **Output format unclear?** See Decisions 2, 5, 8, 10
2. **Routing logic unclear?** See Decision 7
3. **Skill classification unclear?** See Decision 3
4. **Missing field handling?** See Decision 6

---

**Ready to start Phase 1 (v6.0.1-foundation).**
