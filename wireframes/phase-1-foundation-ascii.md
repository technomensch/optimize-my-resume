# Phase 1: Foundation - ASCII Workflow

**Version:** 1.1 <!-- v1.1 Change: Added v6.3.x Fit Gates and 17-Point Check Integration -->
**Last Updated:** 2026-01-05
**Related Modules:** `optimization-tools/resume-analyzer/`, `core/fit-thresholds.md`

---

## Overview
Phase 1 establishes the system's foundation by processing primary inputs: the user's resume (converted to Job History v2.0) and the targeted Job Description (parsed through a 17-point inspection). It now includes a mandatory Fit Assessment Gate to validate alignment before proceeding.

## Diagram

```text
    [ USER INPUT ]
          |
          v
+-----------------------+
|     ENTRY ROUTER      |---[ Query/Help ]---> ( Mode Selection )
+-----------------------+
          |
    +-----+-----+
    |           |
    v           v
+-------+   +-------+
|  RES  |   |  JD   |
|PARSER |   |PARSER |---[ 17-POINT CHECK ]
+-------+   +-------+
    |           |
    |           v
    |   < FIT ASSESSMENT GATE > ---[ Score <= 79% ]---> ( STOP )
    |   ( v6.3.1 Guardrails )   ---[ Score >= 80% ]---> ( PROCEED )
    |           |
    v           v
+-----------------------+
|  JOB HISTORY v2.0     |
| (12 CATEGORIES)       |
+-----------------------+
          |
          v
    ( TO PHASE 2 )
```

## Key Decision Points
- **Input Type:** Router determines if input is a Resume, a JD, or a conversational command.
- **17-Point Inspection:** JD Parser extracts logistics, technical requirements, and soft skills.
- **Fit Assessment Gate:** Engages `fit-thresholds.md` and `portfolio-weighting.md` to ensure realistic matching.
- **Categorization:** Skills are explicitly separated into Hard and Soft categories at the foundation.

## Inputs
- Raw Resume text (from User)
- Raw Job Description text (from User)
- Portfolio/Project details (v6.3.1 rules)

## Outputs
- `claude_generated_job_history_summaries_v2.txt` (Structured XML-like history)
- Preliminary Fit Assessment Report (with Gap analysis)

## Files Involved
- `optimization-tools/resume-analyzer/job-history-v2-creation.md`
- `optimization-tools/resume-analyzer/jd-parsing-17-point.md`
- `core/fit-thresholds.md`
- `core/portfolio-weighting.md`

## Related Phases
- **Previous:** N/A (Entry Point)
- **Next:** **Phase 2: Core Integration**
