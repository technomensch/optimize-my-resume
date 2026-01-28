# ENH-006 - Unified Multi-Agent Workflow System

**Status:** 🔴 ACTIVE
**Priority:** HIGH
**Created:** 2026-01-28
**Local Tracking ID:** ENH-006

---

## Specification

### Problem Statement
Workflow logic has diverged between Gemini (`.agent/workflows`) and Claude Code (`.claude/skills`). This fragmentation leads to:
1. **Logic Drift:** Improvements in one agent's workflow (e.g., v1.3 Knowledge Graph markers in Claude) are missing in the other.
2. **Naming Inconsistency:** Lack of enforced policy for [Prefix] titling in GitHub issues versus versioned branch naming.
3. **Maintenance Overhead:** Double context required when updating shared system logic.

### Objectives
1. **Unify Logic:** Establish `.agent/workflows` as the Single Source of Truth (SSoT).
2. **Symlink Integration:** Map `.claude/skills` to `.agent/workflows` via symbolic linking.
3. **Enforce Governance:** Implement the `[BUG]/[ENHANCEMENT]` titling policy for GitHub issues.
4. **Update Metrics:** Reflect the architecture evolution (Hub-and-Spoke 2.0) in job history.

### Out of Scope
- Migrating non-workflow configuration files.
- Modifying core React components (except for terminology updates if flagged by `enforce-shadow-sync`).

---

## Requirements

### R1: Modular Consolidation
- Move all unique Claude skills (`enforce-shadow-sync.md`, `update-knowledge-graph.md`) to `.agent/workflows`.
- Perform surgical merges for `start-issue-tracking.md` (logic from Agent + templates from Claude).
- Promote Claude's `lesson-learned.md` (v1.3) and `session-summary.md` to authoritative status.

### R2: Symbolic Linkage
- Delete `.claude/skills` directory.
- Create relative symbolic link from `.claude/skills` to `.agent/workflows`.

### R3: Governance Policy
- Update `start-issue-tracking.md` to enforce:
  - `[BUG]` or `[ENHANCEMENT]` prefix in GitHub titles.
  - Mandatory tagging in GitHub.
  - Inclusion of Local ID in issue body.
  - Versioned branch and plan naming.

### R4: Gold Master Compliance
- Synchronize `PROJECT-INSTRUCTIONS.md` with the new "Unified Workflow System" architecture.
- Update `job_history_summaries_v12.txt` with v12.0 metrics and accomplishments.
