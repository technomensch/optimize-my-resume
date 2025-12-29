# Phase 1: Foundation - ASCII Workflow

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `phases/phase-1/`

---

## Overview
Phase 1 establishes the system's foundation by processing primary inputs: the user's resume (converted to Job History v2.0) and the targeted Job Description (parsed through a 17-point inspection).

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
|PARSER |   |PARSER |
+-------+   +-------+
    |           |
    |     +-----+-----+---------------[ 17-POINT CHECK ]
    |     |           |
    |     v           v
    | [ HARD SKILLS ] [ SOFT SKILLS ]
    | [ RESPONSIBILITIES ] [ LOGISTICS ]
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
- **Parsing Depth:** JD Parser extracts 17 distinct data points to ensure high-fidelity matching.
- **Categorization:** Skills are explicitly separated into Hard and Soft categories at the foundation.

## Inputs
- Raw Resume text (from User)
- Raw Job Description text (from User)
- User intent (prompts)

## Outputs
- `claude_generated_job_history_summaries_v2.txt` (Structured JSON-like history)
- Parsed JD Context (Internal state for matching)

## Files Involved
- `phases/phase-1/job-history-v2.md`
- `phases/phase-1-jd-parser.md`
- `phases/phase-1-entry-router.md`

## Related Phases
- **Previous:** N/A (Entry Point)
- **Next:** **Phase 2: Core Integration**
