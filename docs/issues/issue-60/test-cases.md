# Test Cases: Multi-JD Batch Analysis

## Test Suite Overview

**Feature:** Batch upload and comparison of multiple job descriptions  
**Component:** Should-I-Apply WebGUI  
**Priority:** Low (v2.0.0)  
**Status:** Deferred

---

## Batch Upload Tests

### TC-60-01: Add Multiple JDs
**Steps:**
1. Enable batch mode
2. Add 3 different JDs
3. Verify list updates

**Expected:**
- ✓ Each JD shows in list
- ✓ Can edit company/title for each
- ✓ Can remove individual JD

### TC-60-02: Upload 10+ JDs
**Steps:**
1. Add 10 job descriptions
2. Observe UI performance

**Expected:**
- ✓ UI remains responsive
- ✓ Token estimate warning appears
- ✓ Scrolling works smoothly

---

## Batch Analysis Tests

### TC-60-03: Analyze 3 JDs Sequentially
**Steps:**
1. Add 3 JDs
2. Click "Analyze All"
3. Observe progress

**Expected:**
- ✓ Progress bar updates (1/3, 2/3, 3/3)
- ✓ Each analysis completes
- ✓ Results display incrementally

### TC-60-04: Token Budget Warning
**Steps:**
1. Add 15+ JDs
2. Attempt to analyze

**Expected:**
- ⚠️ Warning about token usage
- ✓ Suggestion to batch in smaller groups
- ✓ Option to proceed anyway

---

## Comparison View Tests

### TC-60-05: Sort by Fit Score
**Steps:**
1. Complete batch analysis
2. Click "Sort by Fit Score"

**Expected:**
- ✓ Results re-order (highest to lowest)
- ✓ Top match clearly highlighted

### TC-60-06: View Individual Details
**Steps:**
1. Click "View Details" on any result
2. Observe detailed view

**Expected:**
- ✓ Full analysis shown
- ✓ Can return to comparison view
- ✓ Position maintained in list

---

## Test Summary

**Total Test Cases:** 6  
**Priority:** All Low (deferred feature)

**Estimated Testing Time:** 2-3 hours (when implemented)
