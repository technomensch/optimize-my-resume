---
description: Synchronize Knowledge Graph extraction with active plans and local/GitHub issue tracking
---

# Governance Synchronization Workflow

This workflow ensures that insights extracted from the Knowledge Graph are properly reflected in the current implementation plan and categorized correctly in local and GitHub issue trackers.

---

## Step 1: Institutional Knowledge Extraction
1. **Trigger:** Run `[/update-knowledge-graph]`.
2. **Analysis:** Review the extracted patterns or lessons. 
3. **Identification:** Identify the **Primary Lesson** that prompted this sync (e.g., "Active Enforcement Failure").

## Step 2: Active Plan Synchronization
1. **Locate Plan:** Open the currently "Active" or "Planning" document in `docs/plans/` (e.g., `v9.3.7-guardrail-enforcement-fix.md`).
2. **Update Metadata:** Ensure the `GitHub Continuations` and `Status` lines are current.
3. **Inject Insights:** Add a "Lessons Learned Integration" section to the plan, linking the specific Knowledge Graph entry to the proposed change. 

## Step 3: Local Issue Management
1. **Audit:** Find the `Local Issue ID` defined in the active plan (e.g., `issue-98`).
2. **Update:** Open `docs/issues/[ID].md` and append progress, blocking issues, or new verification requirements discovered during knowledge extraction.
3. **Decision Gate:** 
   - If the new insight represents a *separate* scope or a new bug:
     - **STOP:** Ask user: **"A new discovery has been made: [Description]. Should I create a new local issue for this, or continue updating [Current ID]?"**
     - If yes, initialize the new issue via `/start-issue-tracking`.

## Step 4: GitHub Linkage & Sync
1. **Identify Mapping:** Map the Local ID to the GitHub Issue number using the `docs/issue-tracker.md` or the `GitHub Continuations` metadata in the plan.
   - *Note: GitHub #97 might map to Local issue-98. Do not assume identical numbering.*
2. **Status Check:** Check the remote status of the linked GitHub issue(s).
3. **Update Remote:** Generate a summary of local progress and lessons learned to be posted as a comment on the GitHub issue.
4. **Decision Gate:** 
   - If the local work has diverged or requires a new branch/issue on GitHub:
     - **STOP:** Ask user: **"The local implementation now addresses [Topic]. Should I initialize a new GitHub issue for this continuation?"**

## Step 5: Final Governance Audit
1. **Shadow Sync:** Run `[/enforce-shadow-sync]` to ensure the `PROJECT-INSTRUCTIONS.md` (Gold Master) acknowledges the new issue/plan status.
2. **Close Loop:** Output a **Governance Sync Summary Table**:
   | Component | Target ID/File | Status |
   | :--- | :--- | :--- |
   | Knowledge | [Entry Name] | Linked |
   | Plan | [vX.Y.Z] | Updated |
   | Local | [issue-XX] | Updated |
   | GitHub | [#YY] | Commented |
