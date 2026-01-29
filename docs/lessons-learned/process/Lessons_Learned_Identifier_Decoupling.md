# Lesson: Identifier Decoupling (The Serial ID Drift)
**Version:** 1.0 (Created: 2026-01-29)

## Problem Discovered
The agent (Antigravity) attempted to "realign" local issue folders and branch names to match the platform ID (GitHub Issue #97). This caused **Logical Identifier Drift**, where historical local context (Issue #85) was overwritten to satisfy external platform numbering.

## Root Cause Analysis
1.  **Platform ID Drift:** GitHub Issue IDs are assigned serially across all project artifacts (Issues, PRs, Discussions). They do not represent a logical sequence of internal project tasks.
2.  **Assumption of Identity:** The agent assumed a 1:1 "Identity Relationship" between Local IDs and GitHub IDs.
3.  **Governance Overreach:** The agent prioritized "Visual Consistency" across platforms over "Logical Persistence" of local documentation.

## Solution Implemented (Dual-ID Policy)
Shifted from **Identity** (IDs must be the same) to **Mapping** (IDs must be linked).

### 1. Local ID (Logical Source of Truth)
- Format: `issue-N` or `ENH-NNN`
- Purpose: Logical grouping of files, plans, and branches.
- Constraint: MUST BE PERSISTENT. Never rename a local folder to match a GitHub ID.

### 2. GitHub ID (External Platform Reference)
- Format: `#N`
- Purpose: External tracking and communication.

### 3. The Mapping Mandate
- **Local -> GitHub:** Every local issue description MUST have a `GitHub Issue: #N` field.
- **GitHub -> Local:** Every GitHub issue body MUST have a `Local Tracking ID: issue-N` field.

## Lessons Learned
1.  **Don't Fight the Platform:** Platform IDs will always drift. Don't waste cognitive or operational load trying to align local files to them.
2.  **Logical Persistence:** The filesystem is the source of truth for the developer; the platform is the source of truth for the community. Use a mapping layer to bridge them.
3.  **Stop the Drift:** If an agent attempts to rename versioned assets to match an external ID, it is experiencing "Simulation Hallucination."

## Related Resources
- **Workflow:** `.agent/workflows/start-issue-tracking.md` (Updated with Dual-ID Policy)
- **ADR:** [ADR-004: Shadow Modularization (Context of SSoT)](../../decisions/ADR-004-shadow-modularization.md)
