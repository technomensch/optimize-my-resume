# Phase 3: Router & Workflows - ASCII Workflow

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `phases/phase-3/`

---

## Overview
Phase 3 contains the "brains" of the system's runtime. The Workflow Router detects 8 different user scenarios (e.g., adding a job, re-comparing a JD after updates, checking match without JD) and routes the conversation to the specialized workflow needed to handle that state.

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
| 5. Multi-Step Recovery                |
| ...[8 Total Scenarios]                |
+---------------------------------------+
              |
      +-------+-------+
      |               |
      v               v
+-----------+   +-----------+
| INCR.     |   | JD RE-    |
| UPDATES   |   | COMPARE   |
+-----------+   +-----------+
| - Add     |   | - Load JD |
| - Edit    |   | - New Match|
| - Remove  |   | - Score Δ |
+-----------+   +-----------+
      |               |
      +-------+-------+
              |
              v
        ( TO PHASE 4 )
```

## Key Decision Points
- **Scenario Detection:** Router checks if a JD is in cache, if job history exists, and what the user just typed to decide the path.
- **Delta Tracking:** JD re-comparison specifically calculates the "Score Delta" (e.g., "+10% improved") to show progress.

## Inputs
- Cached JD (if exists)
- Current Job History
- New user intent/data

## Outputs
- Updated Job History (v2.1+)
- Match Improvement Reports (Diffs)
- Score Deltas

## Files Involved
- `phases/phase-3/workflow-router.md`
- `phases/phase-3/incremental-updates.md`
- `phases/phase-3/re-comparison.md`

## Related Phases
- **Previous:** **Phase 2: Core Integration**
- **Next:** **Phase 4: Summary & Polish**
