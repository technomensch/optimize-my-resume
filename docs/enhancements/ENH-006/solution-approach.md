# ENH-006 - Solution Approach

**Last Updated:** 2026-01-28
**Local Tracking ID:** ENH-006

---

## Architecture: Symbolic Synchronization (SymSync)

### Implementation Steps

**Step 1: Cleanup & Backup**
- Backup original Claude skills to `.claude/skills_backup/`.
- Ensure all current work is committed or stashed.

**Step 2: Surgical Refactoring**
- **Surgical Merge:** `start-issue-tracking.md`.
  - Use Agent version as base.
  - Inject Claude's rich templates for `solution-approach.md` and `test-cases.md`.
  - Add governance naming policy.
- **Version Promotion:**
  - Copy Claude's `lesson-learned.md` (v1.3) to `.agent/workflows/`.
  - Copy Claude's `session-summary.md` to `.agent/workflows/`.

**Step 3: Migration & Linkage**
- Move `enforce-shadow-sync.md` and `update-knowledge-graph.md` to `.agent/workflows/`.
- Execute: `rm -rf .claude/skills && ln -s ../.agent/workflows .claude/skills`.

**Step 4: Instruction Sync**
- Update `PROJECT-INSTRUCTIONS.md` with:
  - New "Unified Workflow System" section.
  - Updated Guardrail #31 (Workflow Lifecycle) with naming policy.
  - Updates for Shadow Sync Protocol (Step 13).

### Files to Modify
- `.agent/workflows/start-issue-tracking.md`
- `.agent/workflows/lesson-learned.md`
- `.agent/workflows/session-summary.md`
- `PROJECT-INSTRUCTIONS.md`
- `.claude/skills` (Folder to Link)
- `job-history/job_history_summaries_v12.txt`

### Risk Assessment
- **Medium Risk:** Symbolic links might not resolve correctly in all terminal environments (e.g., restricted shells). 
- **Mitigation:** Verification step includes running `ls -la` and checking agent help outputs in both Gemini and Claude CLI.

---

## Recommendation

**Chosen Approach:** Symbolic Synchronization

**Reasoning:**
1. **Zero Logic Duplication:** Both agents read from the exact same physical byte-stream.
2. **Low Maintenance:** Updates to a workflow are immediately available to all agents without manual copying.
3. **Traceability:** One set of Git history for all agent intelligence.
