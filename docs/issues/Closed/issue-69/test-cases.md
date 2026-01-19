# Test Cases: Keyword Validation

## Test Suite Overview
**Feature:** Keyword Validation Guardrail
**Priority:** High

### TC-69-01: Evidence Detection
**Steps:**
1. Add custom keyword that exists in resume body.
**Expected:**
- Keyword verified (Green).
- No warning.

### TC-69-02: Unverified Warning
**Steps:**
1. Add custom keyword NOT in resume (e.g., "Astronaut").
**Expected:**
- Keyword unverified (Yellow).
- Warning icon visible.
- Hover text explains lack of evidence.

### TC-69-03: Confirmation Flow
**Steps:**
1. Click "Generate" with unverified keywords.
**Expected:**
- Modal appears warning about interview defensibility.
- Blocked until user confirms or removes.

### TC-69-04: Generation Prompt
**Steps:**
1. Confirm and Generate.
**Expected:**
- Prompt explicitly flags keyword as "User Confirmed - No Evidence".
- Instructions requesting "light integration" only.
