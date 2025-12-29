# Phase 2: Core Integration - ASCII Workflow

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `phases/phase-2/`

---

## Overview
Phase 2 performs the heavy lifting of matching the user's evidence against the JD requirements. It enforces "Blocking Gates" to ensure users are aware of significant match deficits (location mismatch, match score < 50%, or missing critical hard skills) before they proceed to optimization.

## Diagram

```text
  [ Job History v2.0 ]      [ Parsed JD ]
           |                      |
           +----------+-----------+
                      |
                      v
+---------------------------------------------+
|           EVIDENCE MATCHING FLOW            |
|---------------------------------------------|
| 1. Extract Requirement                      |
| 2. Search Job History for Evidence          |
| 3. Format Citation (Role | Company)         |
| 4. Calculate Match Confidence               |
+---------------------------------------------+
                      |
                      v
+---------------------------------------------+
|               BLOCKING GATES                |
|---------------------------------------------|
| [X] Match Score < 50%?                      |
| [X] Missing Critical Hard Skills?           |
| [X] Location/Remote Mismatch?               |
+---------------------------------------------+
          |           |           |
       (PASS)      (WARN)      (FAIL)
          |           |           |
          +-----------+-----------+
                      |
                ( Proceed? )
                      |
                      v
                ( TO PHASE 3 )
```

## Key Decision Points
- **Blocking Criteria:** If any gate fails, the system pauses and demands explicit user confirmation ("Are you sure you want to proceed despite the mismatch?")
- **Evidence Quality:** Matches are tagged as "MATCHED", "PARTIAL", or "MISSING" based on the strength of resume quotes.

## Inputs
- Structured Job History
- Parsed Job Description
- User confirmation (if gates triggered)

## Outputs
- Match Analysis Report
- Score breakdown
- Blocking gate status

## Files Involved
- `phases/phase-2/evidence-matching.md`
- `phases/phase-2-blocking-gates.md`

## Related Phases
- **Previous:** **Phase 1: Foundation**
- **Next:** **Phase 3: Router & Workflows**
