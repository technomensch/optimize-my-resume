# Phase 4: Summary & Polish - ASCII Workflow

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `phases/phase-4/`

---

## Overview
Phase 4 creates high-impact professional summaries. It generates two distinct outputs: a **Master Summary** (comprehensive overview for the general resume) and a **Per-JD Summary** (highly optimized version using specific keywords and metrics identified in Phase 2).

## Diagram

```text
  [ Complete Job History ]     [ Gap Analysis Result ]
            |                          |
            +------------+-------------+
                         |
                         v
+---------------------------------------------------+
|            SUMMARY GENERATION ENGINE              |
|---------------------------------------------------|
| 1. Analyze Core Career Profile (Metrics/Tenure)   |
| 2. Extract Top 3-5 Relevant JD Keywords           |
| 3. Synthesize Achievement-Oriented Opening        |
| 4. Perform Quality Check (Char Limit: 350)        |
+---------------------------------------------------+
                         |
            +------------+-------------+
            |                          |
            v                          v
+-----------------------+      +-----------------------+
|    MASTER SUMMARY     |      |    PER-JD SUMMARY     |
+-----------------------+      +-----------------------+
| - Comprehensive       |      | - Optimized keywords  |
| - High-level metrics  |      | - Target-specific     |
| - Reusable master     |      | - Ephemeral/Per-App   |
+-----------------------+      +-----------------------+
            |                          |
            +------------+-------------+
                         |
                         v
                  [ FINAL OUTPUT ]
```

## Key Decision Points
- **Keyword Priority:** The engine prioritizes "Missing" keywords from Phase 2 that the user actually has in their history but didn't highlight.
- **Tone Control:** Ensures the summary is assertive and metric-heavy rather than flowery or passive.

## Inputs
- Full Job History v2.0
- Phase 2 Match Analysis
- Character limits (350 char target)

## Outputs
- Master Professional Summary
- Context-aware Per-JD Summary

## Files Involved
- `phases/phase-4/summary-generation.md`

## Related Phases
- **Previous:** **Phase 3: Router & Workflows**
- **Next:** N/A (Project Exit)
