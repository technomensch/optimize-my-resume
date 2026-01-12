# Phase 2: Core Integration - ASCII Workflow

**Version:** 1.1 <!-- v1.1 Change: Added Calibrated Scoring (Industry, Role, Context) -->
**Last Updated:** 2026-01-05
**Related Modules:** `optimization-tools/bullet-optimizer/`, `core/adjacent-technical.md`, `core/industry-context.md`

---

## Overview
Phase 2 performs the heavy lifting of matching the user's evidence against the JD requirements. It applies v6.3.1 Calibration Rules to ensure "Evidence Matching" isn't inflated by support roles or misleading keywords.

## Diagram

```text
  [ Job History Creation ]      [ Parsed JD ]
           |                      |
           +----------+-----------+
                      |
                      v
+---------------------------------------------+
|           EVIDENCE MATCHING FLOW            |
|---------------------------------------------|
| 1. Extract Requirement                      |
| 2. Search Job History for Evidence          |
| 3. Apply Context Validation (v6.3.1 Rule)   |--> Hands-on vs Support
| 4. Map Industry/Role Type Transferability    |--> Penalty logic
| 5. Calculate Calibrated Match Score         |
+---------------------------------------------+
                      |
                      v
+---------------------------------------------+
|          BLOCKING GATES (REINFORCED)        |
|---------------------------------------------|
| [X] Match Score < 80%? (Stop Tier)          |
| [X] Role-Type Mismatch (e.g. BA vs PM)?     |
| [X] Significant Industry Gap?               |
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
- **Context Validation:** Filter out false matches where the candidate only "wrote about" a technology.
- **Transferability Penalties:** Automatically deducts points if the candidate is moving from a low-transferability industry (e.g., Gov -> Startup).
- **Blocking Criteria:** Stopping point for scores ≤79% is strictly enforced; users cannot override ultra-poor fits.

## Inputs
- Structured Job History (job history creation)
- Parsed Job Description (parsing)
- Transferability Matrix (`industry-context.md`)

## Outputs
- Calibrated Match Analysis Report
- Evidence Audit (Grouping requirements by bullet citation)
- "The Why" assessment (Educational score breakdown)

## Files Involved
- `optimization-tools/bullet-optimizer/evidence-matching.md`
- `core/adjacent-technical.md`
- `core/industry-context.md`
- `core/role-type-validation.md`

## Related Phases
- **Previous:** **Phase 1: Foundation**
- **Next:** **Phase 3: Router & Workflows**
