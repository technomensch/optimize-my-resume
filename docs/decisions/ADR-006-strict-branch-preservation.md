# ADR-006: Strict Branch Preservation Policy

**Status:** Accepted
**Date:** 2026-01-12
**Deciders:** User, Agent
**Tags:** #process #git #audit-trail #compliance

**Related:**
- **Sessions:** [2026-01/2026-01-12_v8-modularization-progress.md](../sessions/2026-01/2026-01-12_v8-modularization-progress.md)

---

## Context and Problem Statement

In standard software development, feature branches are often deleted after merging to keep the repository clean. However, in this project, the implementation *process* and the *reasoning* contained in the commit history are as valuable as the code itself. Deleting branches destroys this granular audit trail, making it difficult to reconstruct *why* a decision was made.

**Key Factors:**
- **Auditability:** Need to trace every logic change back to its source.
- **Context:** Commit messages on branches often contain "thinking" that is squashed in main.

---

## Decision Drivers

- Preserving the "Thought Process" of the development.
- Ensuring a complete, unbroken chain of custody for all changes.
- Preventing data loss of experimental/intermediate states.

---

## Considered Options

1.  **Standard Cleanup:** Delete branches after merge (rejected).
2.  **Strict Preservation (Selected):** NEVER delete feature branches; keep them on origin.
3.  **Tagging:** Tag merge commits (insufficient granularity).

---

## Decision Outcome

**Chosen option:** "Strict Preservation"

**Rationale:**
The user explicitly values the historical record over repository hygiene. The storage cost of extra branches is negligible compared to the value of preserved context.

**Positive Consequences:**
- Full history always available.
- "What was I trying to do here?" is easily answerable.
- Accidental loss of work is minimized.

**Negative Consequences:**
- Repository clutter (many branches).
- `git branch -a` output becomes noisy.

**Mitigation:**
- Use structured naming `v8.x-feature-name` to organize branches.
- filtering `git branch` output when searching.

---

## Implementation Notes

**Rule:**
- **Verify:** Before closing a task, verify the branch is pushed to origin.
- **Merge:** Merge to `main`.
- **Archive:** DO NOT DELETE. Leave the branch alone.

**Created:** 2026-01-12
**Last Updated:** 2026-01-12
