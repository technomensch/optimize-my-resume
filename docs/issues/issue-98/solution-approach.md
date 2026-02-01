# Solution Approach: Issue #98 - Guardrail Enforcement Fix

**Version:** 1.0 (Planning Phase)
**Created:** 2026-01-30
**Status:** 🔴 Pending Sonnet Comparison Analysis

---

## Strategy Overview

Implement **Four-Layer Enforcement Strategy** to move from passive documentation-based guardrails to active structural validation:

1. **Structural Prompt Logic** — Hard mathematical limits
2. **"Proof of Work" Schema** — JSON validation gates
3. **Workflow Multi-Turn** — Constraint validation pause
4. **Modular Injection** — Literal guardrail code in prompts

---

## Phase 1: Analysis & Design (Sonnet)

### What Sonnet Does
1. **Read Gemini's recommendation** (from Opus's earlier analysis)
2. **Compare** against v9.3.6 enforcement system
3. **Identify gaps** — What did Gemini find that v9.3.6 missed?
4. **Merge insights** — Combine best of both approaches
5. **Validate completeness** — Ensure all 4 layers are necessary and sufficient
6. **Create specifications** — Detailed tech specs for Opus to implement

### Deliverables
- Updated implementation plan with Gemini insights merged
- Technical specifications for each layer
- Identified risks and mitigation strategies
- Confirmation that solution-approach is complete for Opus

### Success Criteria (Sonnet)
- [ ] Four-Layer approach is validated as complete
- [ ] No gaps between layers
- [ ] Implementation sequence is clear
- [ ] Opus has everything needed to build

---

## Phase 2: Implementation (Opus)

### Layer 1: Structural Prompt Logic Implementation

**File:** `docs/workflow-templates/bullet-generation-prompt-template.md`

**Changes:**
```javascript
// Add to prompt template
GUARDRAIL_ENFORCEMENT = {
  POSITION_COUNT: {
    rule: "Generate exactly N bullets (from budget plan)",
    validation: "assert(bullets.length === expectedCount)"
  },
  CHRONOLOGICAL: {
    rule: "Sort positions by startDate DESC",
    validation: "assert(positions[i].date > positions[i+1].date)"
  },
  WORD_BUDGET: {
    rule: "Total content <= budget (e.g., 800 words)",
    validation: "assert(totalWords <= BUDGET)"
  },
  VERB_DIVERSITY: {
    rule: "Max 2 bullets per verb category",
    validation: "assert(category_max <= 2)"
  }
}
```

**Test:** Generate single-turn bullet set → Verify constraints enforced mathematically

---

### Layer 2: "Proof of Work" Schema

**File:** `docs/workflow-templates/guardrail-validation-schema.md` (NEW)

**Response Structure:**
```json
{
  "bullets": [
    {
      "text": "...",
      "charCount": 145,
      "guardra ilValidation": {
        "G1_MetricTraceability": {
          "status": "PASS",
          "proof": "Metric '50+ deployments' found in source"
        },
        "G5_ActionVerbQuality": {
          "status": "PASS",
          "proof": "Verb 'Built' approved, first in category"
        }
        // ... all G1-G37 guardrails ...
      }
    }
  ],
  "reconciliation": {
    "all_guardrails_passed": true,
    "validation_timestamp": "2026-01-30T15:40Z"
  }
}
```

**Validation Gate:**
- If `all_guardrails_passed !== true` → REJECT output
- Require explicit proof for EACH guardrail
- No "validation in thinking block" — must be visible

**Test:** Generate bullets → Verify schema validation passes before delivery

---

### Layer 3: Two-Turn Workflow

**File:** `docs/workflow-templates/constrained-generation-workflow.md` (NEW)

**Turn 1: Constraint Validation**
```
INPUT: Resume + JD + word budget + position count
OUTPUT:
- Budget allocation (words per position)
- Position ordering (chronological plan)
- Keyword distribution (per-position strategy)
- Feasibility assessment (is this possible?)

USER GATE: Approve plan or adjust constraints
```

**Turn 2: Constrained Generation**
```
INPUT: Resume + JD + APPROVED PLAN from Turn 1
OUTPUT:
- Bullets constrained to plan
- Full guardrail validation
- Reconciliation table (all constraints met)

DELIVERY: Only if all constraints satisfied
```

**Test:** Run two-turn workflow → Confirm Turn 2 respects Turn 1 plan

---

### Layer 4: Modular Injection

**File:** `docs/workflow-templates/guardrail-injection-manifest.md` (NEW)

**What Gets Injected:**
Literal code from `bo_bullet-generation-instructions.md`:

```
System Instructions:
---BEGIN INJECTED GUARDRAILS---

G1_METRIC_TRACEABILITY:
if (bullet.hasMetric()) {
  assert(bullet.sourceEvidence.includes(bullet.metric));
}

G5_ACTION_VERB_QUALITY:
const approved = ['Built', 'Led', 'Managed', 'Improved'];
assert(approved.includes(bullet.verb));
assert(positionBullets.filter(b => b.category === verb).length < 3);

G24_CHARACTER_LIMITS:
assert(bullet.text.length >= 100 && bullet.text.length <= 210);

---END INJECTED GUARDRAILS---
```

**Why Inject:**
- LLM sees guardrails as structural requirement code
- Not advisory guidance ("try to follow")
- But hard logic ("must pass")

**Test:** Verify all critical guardrails appear in prompt as pseudo-code

---

## Phase 3: Integration & Testing

### Production Test (Same Case as v9.3.6 Failure)

**Input:** Resume + JD from original 87/100 fit score test

**Expected Output:**
- ✅ All positions included (not left out)
- ✅ Chronological order correct
- ✅ Word budget respected
- ✅ Action verb distribution valid
- ✅ All guardrails show PASS status
- ✅ Reconciliation table visible

**Success Criteria:**
- Zero guardrail violations in output
- Enforcement visible (not hidden)
- All validation proof shown explicitly
- User can see WHY each bullet passed

---

## Phase 4: Documentation & Knowledge

### Update Files
1. **docs/knowledge/gotchas.md** — Add enforcement failure pattern
2. **docs/lessons-learned/** — Document what failed in v9.3.6
3. **docs/decisions/ADR-011** — Formalize structural enforcement decision
4. **docs/issue-tracker.md** — Mark issue #98 complete
5. **PROJECT-INSTRUCTIONS.md** — Reference new enforcement workflow

### Knowledge Graph Updates
- "Passive Instruction Drift" pattern
- "Enforcement Failure Mode" gotcha
- "Structural Constraints vs Advisory" lesson

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Constraints too strict, generation impossible | CRITICAL | Layer 3 validates feasibility in Turn 1 before committing |
| LLM ignores injected code | HIGH | Layer 2 rejects output if code not followed (structural gate) |
| Performance impact from 2-turn workflow | MEDIUM | Turn 1 is fast (math only), overall 1-2x normal time |
| Missing guardrail during injection | MEDIUM | Manifest checklist ensures all G1-G37 accounted for |

---

## Success Criteria (Final)

- [ ] Layer 1: Hard limits in prompt with MUST/MUST NOT language
- [ ] Layer 2: JSON schema rejects non-compliant output
- [ ] Layer 3: Two-turn workflow implemented and tested
- [ ] Layer 4: All critical guardrails injected as code
- [ ] Production test: Zero guardrail violations
- [ ] Enforcement visible and provable (not hidden)
- [ ] Knowledge graph updated with enforcement patterns
- [ ] All documentation synced and consistent

---

## Timeline (Estimated)

- **Sonnet Analysis:** 1-2 hours (comparison + specification)
- **Opus Implementation:** 4-6 hours (4 layers + integration)
- **Production Testing:** 1-2 hours (test + validation)
- **Total:** ~6-10 hours of work

---

## Deliverables

### Planning Phase (Sonnet - THIS PHASE)
- ✅ Updated implementation plan with Gemini insights
- ✅ Technical specifications for each layer
- ✅ Risk assessment and mitigation strategies
- ✅ Clear handoff to Opus with all details

### Implementation Phase (Opus - NEXT)
- ✅ All 4 layers implemented
- ✅ Production test passed
- ✅ Documentation and knowledge graph updated
- ✅ Ready to merge v9.3.7 to main
