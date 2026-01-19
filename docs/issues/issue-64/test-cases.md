# Test Cases: Narrative Fit Verification

## Test Suite Overview
**Feature:** Narrative Fit Summary
**Priority:** Medium

---

### TC-64-01: Verify Coverage Matrix
**Steps:**
1. Analyze resume with known strong match.
2. Check Narrative Fit Summary.
**Expected:**
- Requirements mapped to specific bullets.
- High coherence score.

### TC-64-02: Verify Gap Identification
**Steps:**
1. Analyze resume missing key requirement.
**Expected:**
- Requirement flagged as "NARRATIVE GAP".
- Actionable recommendation provided.

### TC-64-03: Keyword Hit Calculation
**Steps:**
1. Manually count keywords in resume.
2. Compare with system count.
**Expected:**
- Accurate count (+/- 10% tolerance for stemming differences).
