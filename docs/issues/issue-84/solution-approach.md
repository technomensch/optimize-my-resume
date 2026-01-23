# Issue #84 - Solution Approach

**Last Updated:** 2026-01-23

---

## Option 1: Modular Safety Workflows & ADR-005

### Implementation Steps

**Step 1: Formalize ADR-005**
Create `docs/decisions/ADR-005-llm-constraint-engineering.md` documenting the "Pink Elephant" problem and standardized mitigation strategies (Positive Constraints, Recency, Pre-flight Checks).

**Step 2: Harden Implementation Plan Workflow**
Modify `.agent/workflows/implementation-plan.md` to include a mandatory check for execution state (READ-ONLY ANALYSIS).

**Step 3: Create Specialized Stop-on-Error Workflows**
Create `.agent/workflows/read-only-analysis.md` and `.agent/workflows/execute-plan.md` with explicit behavioral locks and quotation requirements.

**Step 4: Update Skill & Issue Tracking**
Synchronize `.claude/skills/update-knowledge-graph.md` and `.agent/workflows/start-issue-tracking.md` with the new safety patterns.

### Files to Modify
- `.agent/workflows/implementation-plan.md`
  - Change: Add Step 0 for execution state.
- `.agent/workflows/start-issue-tracking.md`
  - Change: Add safety pattern requirements to problem documentation.
- `docs/plans/v9.2.2-fix-bullet-display-bug.md`
  - Change: Add `/execute-plan` header.
- `.claude/skills/update-knowledge-graph.md`
  - Change: Update to recognize ADR-005.

### Estimated Time
- Development: 1.5 hours
- Testing: 1 hour
- Documentation: 1.5 hours
- **Total:** 4 hours

### Risk Assessment
- **Low Risk:** These are workflow-level changes that improve safety without modifying core application logic. The only risk is potential over-constraint of the agent if prompts are too rigid, which can be tuned.

---

## Recommendation

**Chosen Approach:** Option 1

**Reasoning:**
1.  **Defense-in-Depth:** Hardens both the planning process and the execution process.
2.  **Explicit Governance:** ADR-005 provides a permanent record of *why* we are using these specific prompt patterns, preventing future drift.

**Trade-offs Accepted:**
- Slight increase in token count for workflow prompts.
- Minor friction in starting tasks (Step 0 check).
