---
description: whenever an implementation plan is created, it has the name of the branch and is automatically put in /docs/plans
---

1. Identify the target branch name for the current task.
   - For features: `v[Major.Minor.0]-[feature-name]`
   - For patches: `v[Major.Minor.Patch]-[patch-name]`
2. Create the implementation plan content.
3. Save the plan to `docs/plans/[BranchName].md`.
4. Update `docs/CHANGELOG.md` or `docs/ROADMAP.md` to reference the new plan if appropriate.
