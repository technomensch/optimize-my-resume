# ENH-002 - Test Cases

**Last Updated:** 2026-01-28

---

## Regression Tests (Must Pass)

### Test Case R1: Workflow Persistence
**Scenario:** Verify the lesson-learned workflow still facilitates basic lesson creation.  
**Steps:**
1. Run `/lessons-learned`.
2. Follow prompts.
**Expected Result:** A lesson document is generated correctly.  

---

## New Tests (For This Issue)

### Test Case N1: Knowledge Graph Hook
**Scenario:** Verify the new hook in the workflow prompts for KG updates.  
**Steps:**
1. Run `/lessons-learned update`.
2. Observe final steps.
**Expected Result:** The workflow instructs the agent to update the Knowledge Graph.  

### Test Case N2: ADR Linkage
**Scenario:** Verify ADR-005 is correctly integrated.  
**Steps:**
1. Check `docs/knowledge/patterns.md`.
**Expected Result:** New pattern is documented with a reference to ADR-005.  

---

## Test Results Summary

**Date Tested:** 2026-01-28  
**Tester:** Antigravity  
