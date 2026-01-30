# Test Cases: Layered Defense Strategy (v9.3.6)

**Note:** Previous test cases (v9.3.5.2) are obsolete after production failure proved documentation-based enforcement insufficient.

---

## Test Suite 1: Chat Interface Layers

### TC-1.1: Multi-Turn Stage Separation
**Objective:** Verify model cannot skip stages when each is a separate prompt.
**Steps:**
1. Use Stage 1 prompt from layered-enforcement-chat.md
2. Verify model outputs ONLY Budget Allocation Table
3. Verify model STOPS and waits for approval
**Pass Criteria:** No bullets generated in Stage 1 response

### TC-1.2: User Verification Checklist Effectiveness
**Objective:** Verify checklist catches common violations.
**Steps:**
1. Generate bullets with known violations (wrong order, gerunds, etc.)
2. User applies verification checklist
3. Record which violations caught vs missed
**Pass Criteria:** >80% of violations caught by checklist

### TC-1.3: Human Approval Gate
**Objective:** Verify model waits for explicit approval.
**Steps:**
1. Complete Stage 1
2. Do NOT say "proceed" or "approved"
3. Observe if model starts Stage 2 unprompted
**Pass Criteria:** Model does not proceed without explicit approval

---

## Test Suite 2: Claude Project Layers

### TC-2.1: Minimized Context Effect
**Objective:** Verify reduced context improves compliance.
**Steps:**
1. Test generation with full context (all files attached)
2. Test generation with minimized context (bo_claude-project-prompt.md only)
3. Compare compliance rates
**Pass Criteria:** Minimized context shows >10% improvement

### TC-2.2: Recency Anchor Effectiveness
**Objective:** Verify end-of-file instructions get higher attention.
**Steps:**
1. Place critical instruction at START of prompt
2. Place same instruction at END of prompt (recency anchor)
3. Compare compliance rates
**Pass Criteria:** End placement shows >15% improvement

### TC-2.3: Artifact Output Template
**Objective:** Verify pre-structured output format improves compliance.
**Steps:**
1. Request output with no template
2. Request output with artifact template
3. Compare format compliance
**Pass Criteria:** Template shows >20% format compliance improvement

---

## Test Suite 3: Combined Layered Defense

### TC-3.1: Layer Redundancy Test
**Objective:** Verify multiple layers catch failures that single layer misses.
**Steps:**
1. Intentionally bypass Layer 1 (multi-turn)
2. Check if Layer 2 (user verification) catches violation
3. If Layer 2 misses, check Layer 3 (validation prompt)
**Pass Criteria:** At least one layer catches each violation type

### TC-3.2: End-to-End Compliance Test
**Objective:** Measure combined compliance rate with all layers active.
**Steps:**
1. Run full workflow with all layers for Chat Interface
2. Run full workflow with all layers for Claude Project
3. Measure final compliance rate
**Pass Criteria:**
- Chat Interface: >60% (up from ~30-40%)
- Claude Project: >70% (up from ~50-60%)

---

## Validation Metrics

| Metric | Baseline | Target | Measured |
|--------|----------|--------|----------|
| Chat Interface Compliance | ~30-40% | >60% | TBD |
| Claude Project Compliance | ~50-60% | >70% | TBD |
| User Verification Catch Rate | N/A | >80% | TBD |
| Layer 2 Catches Layer 1 Failures | N/A | >50% | TBD |

---

## Archived Test Cases (v9.3.5.2 - OBSOLETE)

### TC-001: The Unified Pressure Test (OBSOLETE)
**Status:** Failed in production - documentation-based enforcement bypassed
**Original Scenario:** 10 Positions | 50 Bullets Requested.
**Why Obsolete:** Model ignored all stages and generated non-compliant output.

### TC-002: Fallback Deletion (OBSOLETE)
**Status:** Never reached - Stage 3 reconciliation was skipped entirely
**Original Scenario:** Generation results in 510 words.
**Why Obsolete:** Model never reached fallback logic because it bypassed all stages.
