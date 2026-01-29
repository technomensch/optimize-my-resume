# Issue #85 - Solution Approach

**Last Updated:** 2026-01-28

---

## Chosen Approach: Multi-Layer Hardening

Move rules from passive memory to active execution gates using three complementary strategies.

---

## Layer 1: Pre-flight Rule Mapping (Step 0)

### Implementation Steps

**Step 1: Add Pre-flight Table to generate-bullets.md**
Force the agent to output a visible guardrail checklist BEFORE any bullet generation.

```markdown
| ID | Guardrail | Integration Status |
| :--- | :--- | :--- |
| **G1** | Metric Traceability | [ ] Referenced from history |
| **G9** | Verb Diversity | [ ] 1 category per position |
| **G12** | Recency Rule | [ ] All 2020-2026 roles included |
| **FMT** | Header Format | [ ] 2-line schema plan |
| **EXT** | Plain Text Export | [ ] Target path confirmed |
```

### Files Modified
- `.agent/workflows/generate-bullets.md` (lines 22-30) ✅ DONE

---

## Layer 2: External Validation Module (Negative Checklist)

### Implementation Steps

**Step 1: Create bo_output-validator.md**
An 8-point "Negative Checklist" that defines explicit FAIL conditions.

### Files Created
- `optimization-tools/bullet-optimizer/bo_output-validator.md` ✅ DONE

---

## Layer 3: Recency Anchor (System Closer)

### Implementation Steps

**Step 1: Append <final_recency_anchor> to PROJECT-INSTRUCTIONS.md**
Place critical terminal instructions at the absolute END of the prompt.

### Files Modified
- `PROJECT-INSTRUCTIONS.md` (lines 4285-4296) ✅ DONE

---

## Layer 4: Knowledge Graph Updates

### Implementation Steps

**Step 1: Document patterns and gotchas**

### Files Modified
- `docs/knowledge/patterns.md` - Added "Pre-flight Rule Mapping" and "Recency Anchor" patterns ✅ DONE
- `docs/knowledge/gotchas.md` - Added "Vibe-Coding Drift" entry ✅ DONE
- `docs/lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md` - Updated to v1.1 ✅ DONE

---

## Remaining Work

### Task 4.1: Verify Recency Anchor Content
- Confirm `<final_recency_anchor>` includes all critical constraints
- Currently contains: terminology check, mandatory EOF string

### Task 5.1: Shadow Sync Verification
- Run `/enforce-shadow-sync --auto`
- Fix remaining "Phase 1" terminology in:
  - `ra_job-history-template.md`
  - `ra_quality-gates-guardrails.md`
  - `ra_job-history-creation.md`

### Task 5.2: Functional Testing
- Test bullet generation with Position 0 (personal project) and Position 1 (most recent W2)
- Verify all 8 validation points pass

---

## Estimated Time
- Development: 1 hour (mostly complete)
- Testing: 30 minutes
- Documentation: 15 minutes
- **Total:** ~2 hours

---

## Risk Assessment
- **Low Risk:** Knowledge graph updates (documentation only)
- **Medium Risk:** Workflow changes could affect existing generation flows
- **Low Risk:** Recency anchor adds no new logic, only reinforcement
