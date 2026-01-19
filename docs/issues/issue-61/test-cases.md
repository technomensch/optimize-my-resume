# Test Cases: Industry Transferability Display

## Test Suite Overview

**Feature:** Industry context visualization  
**Component:** Should-I-Apply WebGUI  
**Priority:** Medium

---

## Display Tests

### TC-61-01: Same Industry Match
**Steps:**
1. Analyze resume from Tech industry
2. Against JD for Tech role
3. Observe industry context section

**Expected:**
- ✓ Shows both industries
- ✓ Transferability level: HIGH
- ✓ No penalty indicated

### TC-61-02: Adjacent Industry Match
**Steps:**
1. Analyze Government resume
2. Against SaaS JD
3. Observe penalty and reasoning

**Expected:**
- ✓ Transferability level: MODERATE
- ✓ Shows penalty applied (e.g., -10 points)
- ✓ Clear reasoning displayed

### TC-61-03: Unrelated Industry
**Steps:**
1. Analyze Retail resume
2. Against Software Engineering JD

**Expected:**
- ✓ Transferability level: LOW
- ⚠️ Higher penalty (e.g., -20 points)
- ✓ Clear warning message

---

## Test Summary

**Total Test Cases:** 3  
**Priority:** Medium  
**Estimated Testing Time:** 30 minutes
