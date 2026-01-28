---
description: whenever an implementation plan is created, it has the name of the branch and is automatically put in /docs/plans
---

0. **Pre-flight Check & Execution Mode:**
   - Before generating the plan, explicitly state: **"MODE: READ-ONLY ANALYSIS. Establishing behavior locks..."**
   - Verify that you understand the "Stop-on-Error" policy.
1. Identify the target branch name for the current task.
   - For features: `v[Major.Minor.0]-[feature-name]`
   - For patches: `v[Major.Minor.Patch]-[patch-name]`
2. **Dependency Check (DELEGATES to /git-governance):**
   - If this plan depends on a prior version (e.g., v9.3.3 depends on v9.3.2):
   - Invoke: **`@git-governance pre-flight --parent [prior-branch]`**
   - This will verify the prior branch has been committed and validate branch hierarchy.
   - HALT if prior version is uncommitted.
3. Create the implementation plan content.
4. Save the plan to `docs/plans/[BranchName].md`.
5. Update `docs/CHANGELOG.md` or `docs/ROADMAP.md` to reference the new plan if appropriate.
