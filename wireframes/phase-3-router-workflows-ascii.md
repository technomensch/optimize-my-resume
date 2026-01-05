# Phase 3: Router & Workflows - ASCII Workflow

**Version:** 1.1 <!-- v1.1 Change: Added Bullet Optimization & Guardrail Integration -->
**Last Updated:** 2026-01-05
**Related Modules:** `phases/phase-3/`, `core/format-rules.md`

---

## Overview
Phase 3 contains the "brains" of the system's runtime. The Workflow Router handles 8 scenarios, while the Optimization engine transforms resume bullets using v6.3.0 Quality Guardrails.

## Diagram

```text
    [ Current State ] + [ New Input ]
              |
              v
+---------------------------------------+
|           WORKFLOW ROUTER             |
|---------------------------------------|
| 1. Full Analysis (New User)           |
| 2. Add/Edit Job (Incremental)         |
| 3. Re-Compare JD (Diff Analysis)      |
| 4. Fresh Comparison (New JD)          |
| ...[8 Total Scenarios]                |
+---------------------------------------+
              |
      +-------+-------+
      |               |
      v               v
+-----------+   +-----------+
| INCR.     |   | BULLET    |
| UPDATES   |   | OPTIMIZE  |
+-----------+   +-----------+
| - Add     |   | - G2: Chrono Sort        |
| - Edit    |   | - G15: Multi-word Scan   |
| - Remove  |   | - G20: Acronym Spellout  |
+-----------+   +-----------+
      |               |
      +-------+-------+
              |
              v
        ( TO PHASE 4 )
```

## Key Decision Points
- **Scenario Detection:** Router checks if a JD is in cache, if job history exists, and what the user just typed to decide the path.
- **Sorting Logic:** Guardrail #2 ensures that even during incremental updates, the output maintains REVERSE CHRONOLOGICAL order.
- **Phrase Variation:** Guardrail #15 detects if the same 3+ word phrase is used 3+ times across different positions.

## Inputs
- Cached JD / New JD
- Current Job History (v2.0)
- User's specific update requests

## Outputs
- Updated Job History (v2.1+)
- Optimized Bullets (v6.3.0 Standard)
- Progress Diffs ("Score +12%")

## Files Involved
- `phases/phase-3/workflow-router.md`
- `core/format-rules.md` (Guardrails #2, #15, #20)
- `phases/phase-3/re-comparison.md`

## Related Phases
- **Previous:** **Phase 2: Core Integration**
- **Next:** **Phase 4: Summary & Polish**
