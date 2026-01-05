# Session: Fit Assessment Calibration & Cross-LLM Consistency

**Date:** January 4, 2026
**Type:** Analysis & Planning
**Duration:** ~1 hour
**Status:** Completed

---

## Session Overview

Analyzed a significant discrepancy between two LLM assessments (Haiku: 52% vs Gemini: 92%) of the same job description to identify root cause instruction gaps. Diagnosed 5 specific instruction weaknesses that allowed inconsistent interpretation, then created a comprehensive 6-task implementation plan and lessons learned document to address cross-LLM consistency in fit assessments.

---

## What We Built

### 1. Implementation Plan (`fit-assessment-calibration-plan.md`)
Complete implementation plan for v6.3.1 with 6 tasks:

| Task | Module | Purpose |
|------|--------|---------|
| 1 | Portfolio Project Weighting | Prevent personal projects from counting as professional experience |
| 2 | Adjacent Technical Definition | 5-question objective assessment for "technical background" |
| 3 | Keyword Context Validation | 3-tier evidence system (Direct/Supervised/Documentation) |
| 4 | Industry Context Validation | Transferability matrix (Gov→SaaS = 30%, etc.) |
| 5 | Role-Type Experience Validation | Equivalent years calculation (BA→PM = 55%) |
| 6 | Updated Fit Score Calculation | Integration of all validation penalties |

### 2. Lessons Learned (`Lessons_Learned_Fit_Assessment_Calibration.md`)
Comprehensive documentation of:
- Problem analysis (5 instruction gaps)
- Root cause (implicit assumptions, binary matching, missing transferability)
- Solution modules with explicit XML rules
- Generic Calibration Framework for any LLM assessment system
- 4 key lessons for future development
- Common pitfalls and prevention strategies

---

## Decisions Made

### 1. Focus on Instruction Gaps, Not Score Variance
**Decision:** Frame the problem as "instruction gaps that cause inconsistent results" rather than "score variance between models."

**Rationale:** The score difference (52% vs 92%) is a symptom. The root cause is missing explicit definitions that allow models to interpret criteria differently.

### 2. Quantified Transferability Over Qualitative Language
**Decision:** Replace vague phrases like "some skills transfer" with explicit percentages (e.g., "BA→PM: 55%").

**Rationale:** Qualitative language allows models to assign arbitrary weights. Explicit percentages create reproducible calculations.

### 3. Evidence Tiers for Keyword Matching
**Decision:** Implement 3-tier evidence system:
- Tier 1 (100%): Direct/hands-on experience
- Tier 2 (50%): Supervised exposure
- Tier 3 (0%): Documentation only

**Rationale:** Prevents false positives where documenting a technology is matched to "experience with" that technology.

### 4. Category: Process (for Lessons Learned)
**Decision:** Categorize the lesson as `process/` rather than `architecture/` or `patterns/`.

**Rationale:** This addresses a procedural gap in how assessments are calculated, not an architectural design pattern.

### 5. Generalized Examples
**Decision:** Write all examples in generic terms (not tied to Marc's specific job history) so other users can apply them.

**Rationale:** Makes the system reusable and the lessons learned applicable to any user.

---

## Problems Solved

| Problem | Solution |
|---------|----------|
| Portfolio projects counted as PM experience | Portfolio weighting rules (50% for skills, 0% for role experience) |
| "Adjacent technical" undefined | 5-question objective assessment |
| Documentation matched to hands-on requirements | 3-tier evidence validation with verb context |
| Industry mismatch ignored | Transferability matrix with explicit percentages |
| BA experience counted as PM experience | Role-type transferability with equivalent years calculation |

---

## Files Created

| File | Location | Purpose |
|------|----------|---------|
| `fit-assessment-calibration-plan.md` | `/mnt/user-data/outputs/` | Implementation plan for Sonnet in VS Code |
| `Lessons_Learned_Fit_Assessment_Calibration.md` | `/mnt/user-data/outputs/` | Process documentation for future reference |

---

## Key Insights

### Insight 1: LLMs Don't Share Common Sense
Different models fill ambiguity with different assumptions based on their training. What seems "obvious" to one model may not be to another.

### Insight 2: Negative Examples Are Critical
Saying what DOES count is insufficient. Instructions must also explicitly say what DOESN'T count to prevent over-crediting.

### Insight 3: Multi-Model Testing Reveals Gaps
Testing with only one model hides instruction weaknesses because that model's assumptions mask the ambiguity. Running the same assessment through multiple models surfaces interpretation differences.

### Insight 4: The Haiku Assessment Was More Accurate
For the specific JD (Chainguard Senior PM), Haiku's 52% assessment correctly identified:
- 0 years PM experience
- Technical writing ≠ developer background
- Government contracting ≠ B2B SaaS
- Portfolio project ≠ professional employment

Gemini's 92% over-credited portfolio work and found "transferable" matches that don't hold up to scrutiny.

---

## Lessons Learned

1. **Explicit beats implicit** - Every assessment criterion that involves judgment needs definitions, boundary examples, and quantified transferability

2. **Writing ABOUT ≠ Working WITH** - Documentation of a technology doesn't constitute experience with that technology

3. **Portfolio ≠ Employment** - Personal projects demonstrate skills but don't count toward "years of experience" requirements

4. **Industry context matters** - Government contracting experience transfers at ~30% to B2B SaaS roles

5. **Role types have boundaries** - BA experience ≈ 55% of equivalent PM experience; Technical Writer ≈ 30%

---

## Next Steps

1. **Implement in VS Code** - Give `fit-assessment-calibration-plan.md` to Sonnet for implementation

2. **Test with Chainguard JD** - Verify both models produce similar scores (45-60% range) after implementation

3. **Update Project Instructions** - Insert the 6 XML blocks at specified locations

4. **Add to Lessons Learned Index** - Update `docs/lessons-learned/README.md` with new entry

5. **Version Bump** - Increment to v6.3.1 after implementation

---

## Related Resources

| Resource | Relationship |
|----------|--------------|
| `phases/phase-3/workflow-router.md` | Phase 3 routing logic (where fit assessment occurs) |
| `core/fit-thresholds.md` | Existing fit scoring methodology |
| Project instructions (main prompt) | Where new modules will be inserted |
| v6.3.0 guardrails | 27 existing guardrails to integrate with |

---

## Session Stats

- Files created: 2
- Implementation tasks defined: 6
- Instruction gaps identified: 5
- Lessons documented: 5
- XML blocks ready for implementation: 6
- Transferability rules defined: 8+ (industry + role-type combinations)

---

**Session Tags:** #fit-assessment #cross-llm #calibration #planning #lessons-learned

**Created:** January 4, 2026
**Category:** Analysis & Planning
