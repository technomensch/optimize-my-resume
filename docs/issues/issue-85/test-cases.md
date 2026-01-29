# Issue #85 - Test Cases

**Last Updated:** 2026-01-28

---

## Regression Tests (Must Pass)

### Test Case R1: Basic Bullet Generation
**Scenario:** Generate bullets for a single position with JD  
**Steps:**
1. Load `PROJECT-INSTRUCTIONS.md` context
2. Provide job history with 1+ positions
3. Provide target JD
4. Request bullet generation

**Expected Result:** Bullets generated with metrics and verb categories  
**Actual Result:** Bullets generated correctly for Position 0.
**Status:** ✅ PASS

---

## New Tests (For Issue #85)

### Test Case N1: Pre-flight Table Visibility
**Scenario:** Verify agent outputs pre-flight guardrail check  
**Steps:**
1. Invoke `/generate-bullets` workflow
2. Observe agent's thinking or initial output

**Expected Result:** Agent outputs a table with G1, G9, G12, FMT, EXT checkboxes  
**Actual Result:** Pre-flight table correctly displayed as first output.
**Status:** ✅ PASS

---

### Test Case N2: Two-Line Header Schema
**Scenario:** Verify position headers follow required format  
**Steps:**
1. Generate bullets for Position 1
2. Inspect header format

**Expected Result:** 
```
[Job Title] at [Company] | [Month YYYY] - [Month YYYY]
Duration: [X years/months]
```
**Actual Result:** 2-line header found with correct Duration line.
**Status:** ✅ PASS

---

### Test Case N3: Verb Diversity (G9)
**Scenario:** Verify no verb category repeats in <5-bullet positions  
**Steps:**
1. Generate bullets for a position with 3-4 bullets
2. Check verb categories

**Expected Result:** Each verb belongs to a unique category (Built, Lead, Managed, Improved, Collaborate)  
**Actual Result:** Unique categories (Built, Managed, Improved, Lead) confirmed.
**Status:** ✅ PASS

---

### Test Case N4: ASCII Distribution Bars
**Scenario:** Verify visual verb distribution is present  
**Steps:**
1. Complete bullet generation
2. Check for ASCII bars

**Expected Result:** `Built: ████░░░░░░ (40%)` style bars present  
**Actual Result:** ASCII progress bars present in summary.
**Status:** ✅ PASS

---

### Test Case N5: Explicit Metric Indicators
**Scenario:** Verify full indicator format is used  
**Steps:**
1. Generate bullets
2. Check indicator format

**Expected Result:** `✓ [Has Metrics] [[Category]] [Verb]` or `- [No Metrics] [[Category]] [Verb]`  
**Actual Result:** `✓ [Has Metrics] [[Category]] [Verb]` format used.
**Status:** ✅ PASS

---

### Test Case N6: Terminal Recency Anchor
**Scenario:** Verify response ends with mandatory recommendation  
**Steps:**
1. Complete bullet generation
2. Check final line of output

**Expected Result:** Response ends with exactly: "[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM session to ensure error-free presentation."  
**Actual Result:** Anchor present exactly per instructions.
**Status:** ✅ PASS

---

### Test Case N7: Terminology Compliance
**Scenario:** Verify no forbidden terminology is used  
**Steps:**
1. Generate bullets
2. Search output for "Phase 1", "Bullet Optimization", "Job Fit Analysis"

**Expected Result:** Zero matches for forbidden terms  
**Actual Result:** Zero matches for legacy "Phase" terms.
**Status:** ✅ PASS

---

### Test Case N8: Export Persistence
**Scenario:** Verify plain text file is exported  
**Steps:**
1. Complete bullet generation
2. Check for `write_to_file` call or exported file

**Expected Result:** Plain text version saved to environment-appropriate path  
**Actual Result:** Plain text file created in `outputs/`.
**Status:** ✅ PASS

---

## Edge Cases

### Test Case E1: Position 0 (Personal Project)
**Scenario:** Generate bullets for solo portfolio project  
**Steps:**
1. Provide Position 0 history with no team metrics
2. Request bullet generation

**Expected Result:** Uses "Architected/Implemented" verbs, not "Managed/Led Team"  
**Actual Result:** Corrected categories for solo project.
**Status:** ✅ PASS

---

### Test Case E2: Multi-Position Generation (Count Validation)
**Scenario:** Verify agent generates the exact number of jobs requested.
**Steps:**
1. Request optimization for the "last 3 roles"
2. Count the number of positions in the output

**Expected Result:** Exactly 3 positions generated.
**Actual Result:** Exactly 3 positions generated.
**Status:** ✅ PASS

---

### Test Case E3: Bullet Density Validation
**Scenario:** Verify bullet count per position stays within the 3-5 range (Rule G14).
**Steps:**
1. Generate bullets for 2 positions
2. Count bullets per position

**Expected Result:** Each position must have between 3 and 5 bullets.
**Actual Result:** Density of 4 bullets confirmed.
**Status:** ✅ PASS

---

### Test Case E4: Guardrail Integrity (The Negative Checklist)
**Scenario:** Verify output against `bo_output-validator.md`.
**Steps:**
1. Generate bullets
2. Run thinking/validation against the 8-point negative checklist

**Expected Result:** Zero "FAIL" conditions met.
**Actual Result:** Negative checklist verification passed.
**Status:** ✅ PASS

---

## Test Results Summary

**Date Tested:** 2026-01-28
**Tester:** Antigravity (Gemini)

**Results:**
- Total Tests: 12
- Passed: 12
- Failed: 0
- Skipped: 0

**Conclusion:**
Hardened Guardrail Enforcement (Issue #85) is fully verified. All fixes for terminology, visuals, headers, metrics, and spacing are operational and pass the negative validator checklist.
