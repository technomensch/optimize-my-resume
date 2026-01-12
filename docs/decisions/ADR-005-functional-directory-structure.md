# ADR-005: Functional Directory Structure

**Status:** Accepted
**Date:** 2026-01-12
**Deciders:** User, Agent
**Tags:** #architecture #directory-structure #organization

**Related:**
- **Sessions:** [2026-01/2026-01-12_v8-modularization-progress.md](../sessions/2026-01/2026-01-12_v8-modularization-progress.md)

---

## Context and Problem Statement

The project initially used a temporal directory structure (e.g., `phases/phase-1`, `phases/phase-2`). As the system evolved from a linear workflow into a platform of tools, this structure became rigid. Code sharing between "Phase 1" and "Phase 3" was awkward, and new features didn't fit the linear timeline.

**Key Factors:**
- **Scalability:** System is growing beyond a linear 4-phase process.
- **Discoverability:** Tools should be easy to find based on what they *do*, not when they *run*.

---

## Decision Drivers

- Moving from a "Process" mindset to a "Platform" mindset.
- Improving code reuse and module organization.
- Reducing confusion about where to store shared logic.

---

## Considered Options

1.  **Temporal:** Keep `phases/` (rejected).
2.  **Functional (Selected):** Rename to `optimization-tools/` and group by capability.
3.  **Flat:** Dump everything in `core/` (rejected, too messy).

---

## Decision Outcome

**Chosen option:** "Functional Directory Structure"

**Rationale:**
Grouping by capability (e.g., `resume-analyzer`, `job-fit-analyzer`, `narrative-generator`) aligns the directory structure with the system's architecture. It allows "Phase 1" and "Phase 3" to both consume the `resume-analyzer` tool without traversing arbitrary phase boundaries.

**Positive Consequences:**
- Clearer home for new logic.
- Promotes modularity and reuse.
- Decouples "Tools" from "Workflows".

**Negative Consequences:**
- Broken links in existing documentation (mitigated by bulk updates).
- Muscle memory friction for existing contributors.

---

## Implementation Notes

**Mapping:**
- `phases/phase-1` → `optimization-tools/resume-analyzer`
- `phases/phase-2` → `optimization-tools/bullet-optimizer`
- `phases/phase-3` → `optimization-tools/job-fit-analyzer`
- `phases/phase-4` → `optimization-tools/narrative-generator`

**Created:** 2026-01-12
**Last Updated:** 2026-01-12
