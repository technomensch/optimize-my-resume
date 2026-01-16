# Issue #55 - Test Cases

**Last Updated:** 2026-01-15

---

## Test Case 1: Terminology Check
**Scenario:** Verify header text update
**Steps:**
1. Open Analyzer (Local or Web).
2. Look at H1 Header.
**Expected:** Displays "Resume Analyzer" (NOT "Phase 1: ...").

## Test Case 2: Version Badge
**Scenario:** Verify version visibility
**Steps:**
1. Look at H1 Header.
**Expected:** `v8.4.2` badge is visible.

## Test Case 3: Portfolio Labeling
**Scenario:** Verify independent project tagging
**Steps:**
1. Load a resume with a position title containing "Project".
2. Check Company Name display.
**Expected:** Appends `(Independent Project)`.

## Test Case 4: UI Cleanup
**Scenario:** Verify clean section headers
**Steps:**
1. Scroll to section headers.
**Expected:** Reads "Job History Export" (NOT "Section 6: Job History Export").
