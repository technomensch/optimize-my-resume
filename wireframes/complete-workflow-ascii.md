# Complete Workflow - ASCII Journey

**Version:** 1.1 <!-- v1.1 Change: Added v6.3.x Guardrails and Core Modules -->
**Last Updated:** 2026-01-05

---

## Overview
The "Complete Workflow" represents the end-to-end user journey from initial setup to a final, optimized application. It shows how data flows through all four phases, protected by v6.3.x Guardrails and Core Modules to ensure integrity and accuracy.

## Diagram

```text
       [ USER START ]
              |
              v
+-----------------------------+
|    PHASE 1: FOUNDATION      |--> [ Job History v2.0 ]
| (Analyze Resume & Parse JD) |--> [ JD Profile ]
+-----------------------------+
              |
              v
   < GUARDRAIL: FIT GATES > ----> [ Portfolio Weighting ]
   < CORE: FIT THRESHOLDS > ----> [ Adjacent Technical ]
              |
              v
+-----------------------------+
|  PHASE 2: CORE INTEGRATION  |--> [ Match Report ]
| (Evidence Match / Gates)    |--> [ Blocking Alerts ]
+-----------------------------+
              |
              v
  < GUARDRAIL: CONTEXT GATE > ----> [ Keyword Context ]
  < CORE: ROLE VALIDATION   > ----> [ Industry Context ]
              |
              v
+-----------------------------+
| PHASE 3: ROUTER & WORKFLOWS |--> [ Improved Match ]
|  (Optimize & Re-Compare)    |--> [ Versioned History ]
+-----------------------------+
              |
              v
  < GUARDRAIL: QUALITY GATE > ----> [ Budget Enforcement ]
  < CORE: FORMAT RULES      > ----> [ Verb Diversity ]
              |
              v
+-----------------------------+
|   PHASE 4: SUMMARY/POLISH   |--> [ Master Summary ]
| (Professional Synthesis)    |--> [ Tailored Summary ]
+-----------------------------+
              |
              v
      [ READY TO APPLY ]
```

## Key Decision Points
- **Fit Assessment Gate:** Phase 3 comparison triggers a stop-score logic (≤79%) using `fit-thresholds.md`.
- **Context Validation:** Prevents false positives by differentiating "Writing ABOUT" vs "Working WITH" a technology.
- **Iteration Loop:** Users often loop between Phase 3 and Phase 2 as they update their resume and re-verify their match score.
- **Entry Points:** Returning users can enter directly at Phase 3 (Routing) if their files are already saved in the project.

## Inputs
- Resume
- Multiple JDs (over time)
- Performance metrics
- Portfolio/Personal Projects (50% weighted)

## Outputs
- 100% matched resume bullets (Validated)
- High-conversion professional summaries
- Clear career metric aggregates
- Plain text export (Auto-generated)

## Files Involved
- All files in `optimization-tools/` directory
- All files in `core/` directory (Guardrails & Rules)

## Related Phases
- **Flow:** Phase 1 -> Phase 2 -> Phase 3 -> Phase 4
- **Security:** Guardrail #6 (Data Loss Prevention) active throughout.
