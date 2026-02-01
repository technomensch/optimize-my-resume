# Test Cases: Issue #98 - Guardrail Enforcement Fix

**Version:** 1.0
**Status:** 🔴 Pending Implementation

---

## Test Suite Overview

All tests use the **same input data as v9.3.6 production failure** (2026-01-29):
- Resume/Job History: User's Optimize-My-Resume portfolio project
- Job Description: Original test case with 87/100 fit score
- Expected: Zero guardrail violations in output

---

## Layer 1: Structural Prompt Logic Tests

### Test 1.1: Position Count Enforcement
**Objective:** Verify exactly N positions generated (not fewer)

**Setup:** Resume has 6 positions, budget allows for 5 bullets per position = 30 total

**Test Steps:**
1. Run bullet generation with Layer 1 prompt limits
2. Count generated bullets
3. Assert count == 30

**Expected Result:** ✅ Exactly 30 bullets, no positions skipped

**Failure Mode:** ❌ Only 25 bullets (positions left out) = REJECT

---

### Test 1.2: Chronological Ordering
**Objective:** Positions ordered by startDate DESC (newest first)

**Setup:** Generate bullets for positions with dates:
- Oct 2025-Present (newest)
- Jul 2022-Jun 2023
- Jan 2020-Jun 2022
- (and others in mixed order)

**Test Steps:**
1. Extract position order from output
2. Assert position[i].startDate > position[i+1].startDate for all i

**Expected Result:** ✅ Newest position first, chronological order maintained

**Failure Mode:** ❌ Positions out of order = REJECT

---

### Test 1.3: Word Budget Enforcement
**Objective:** Total output <= word budget (e.g., 800 words)

**Setup:** Budget = 800 words for all bullets + summary

**Test Steps:**
1. Count total words in generated bullets
2. Count words in professional summary
3. Assert total <= 800

**Expected Result:** ✅ Total words ≤ 800, within budget

**Failure Mode:** ❌ 850 words (over budget) = REJECT

---

### Test 1.4: Action Verb Diversity
**Objective:** Max 2 bullets per verb category (Built, Led, Managed, etc.)

**Setup:** Generate 30 bullets across 6 positions

**Test Steps:**
1. Extract verb category from each bullet
2. Count bullets per category: Built, Led, Managed, Improved, Collaborated
3. Assert category_max <= 2

**Expected Result:** ✅ No verb used more than 2x

**Failure Mode:** ❌ "Built" used 4 times = REJECT

---

## Layer 2: "Proof of Work" Schema Tests

### Test 2.1: All Guardrails Have Validation Proof
**Objective:** Every guardrail (G1-G37) shows PASS with proof, not just claims

**Setup:** Generate bullets with Layer 2 schema

**Test Steps:**
1. Parse JSON response
2. For each bullet, check guardrailValidation object
3. Assert all guardrails present with status and proof
4. Assert all_guardrails_passed == true

**Expected Result:** ✅ All guardrails shown with proof

**Failure Mode:** ❌ Missing G5, or G5 shows no proof = REJECT

---

### Test 2.2: Metric Traceability (G1)
**Objective:** Every metric is traceable to source evidence

**Setup:** Bullet with metric: "50+ deployments"

**Test Steps:**
1. Check G1_MetricTraceability in validation
2. Assert status == "PASS"
3. Assert proof mentions "50+ deployments" or source text

**Expected Result:** ✅ Metric proof visible

**Failure Mode:** ❌ G1 status == "FAIL" = REJECT

---

### Test 2.3: Action Verb Quality (G5)
**Objective:** Verb is approved and first use in category

**Setup:** Bullet with verb "Built"

**Test Steps:**
1. Check G5_ActionVerbQuality validation
2. Assert verb in approved list
3. Assert "first in category" or count <= 2

**Expected Result:** ✅ Verb validated and approved

**Failure Mode:** ❌ G5 status == "FAIL" or verb not approved = REJECT

---

### Test 2.4: Character Limits (G24)
**Objective:** Each bullet is 100-210 characters

**Setup:** Generate bullets

**Test Steps:**
1. For each bullet, check G24_CharacterLimit
2. Assert status == "PASS"
3. Assert charCount >= 100 AND charCount <= 210

**Expected Result:** ✅ All bullets within limits

**Failure Mode:** ❌ Bullet is 95 chars (too short) = REJECT

---

## Layer 3: Two-Turn Workflow Tests

### Test 3.1: Turn 1 Budget Plan Validation
**Objective:** Turn 1 outputs feasible plan

**Setup:** Resume with 6 positions, budget 800 words

**Test Steps:**
1. Run Turn 1 (budget planning only)
2. Verify output includes:
   - Words per position (feasibility math)
   - Position ordering (chronological plan)
   - Keyword distribution strategy
   - "Feasible: YES" flag
3. Assert output shows approvals and plan details

**Expected Result:** ✅ Turn 1 outputs plan with "Feasible: YES"

**Failure Mode:** ❌ "Feasible: NO" or incomplete plan = STOP before Turn 2

---

### Test 3.2: Turn 2 Respects Turn 1 Plan
**Objective:** Turn 2 generation uses approved constraints from Turn 1

**Setup:** Run Turn 2 with approved plan from Test 3.1

**Test Steps:**
1. Run Turn 2 with Turn 1 budget allocation
2. Count bullets per position
3. Assert distribution matches Turn 1 plan ± 1 bullet
4. Assert word usage <= allocated budget per position

**Expected Result:** ✅ Turn 2 follows Turn 1 plan within tolerance

**Failure Mode:** ❌ Turn 2 ignores plan, generates differently = REJECT

---

### Test 3.3: Constraint Impossibility Caught in Turn 1
**Objective:** Turn 1 detects and reports impossible constraints

**Setup:** Resume with 6 positions but budget = 100 words (impossible)

**Test Steps:**
1. Run Turn 1 with impossible constraints
2. Assert output shows "Feasible: NO"
3. Assert error message explains why (e.g., "100 words for 6 positions is impossible")

**Expected Result:** ✅ Turn 1 catches impossibility before Turn 2

**Failure Mode:** ❌ Turn 1 says feasible when it's not = dangerous

---

## Layer 4: Modular Injection Tests

### Test 4.1: Guardrails Appear in Prompt as Code
**Objective:** Prompt template includes literal guardrail code

**Setup:** Inspect bullet-generation-prompt-template.md

**Test Steps:**
1. Open prompt template
2. Search for "---BEGIN INJECTED GUARDRAILS---"
3. Assert section exists and contains pseudo-code for:
   - G1_METRIC_TRACEABILITY
   - G5_ACTION_VERB_QUALITY
   - G24_CHARACTER_LIMITS
   - (all critical guardrails)
4. Verify code is indented/marked as pseudo-code

**Expected Result:** ✅ All guardrails appear as code in prompt

**Failure Mode:** ❌ Guardrails referenced as "follow these" (advisory) = not injected properly

---

### Test 4.2: Injected Code Matches Source
**Objective:** Prompt code matches bo_bullet-generation-instructions.md

**Setup:** Compare prompt template to bo_bullet-generation-instructions.md

**Test Steps:**
1. Extract guardrail code from prompt
2. Extract guardrail code from bo_bullet-generation-instructions.md
3. Assert they're identical (except formatting)
4. Verify no drift between source and injection

**Expected Result:** ✅ Injected code matches source exactly

**Failure Mode:** ❌ Code drifted between files = risk of inconsistency

---

## Production Test: Full System Integration

### Test P.1: Real Resume + JD (v9.3.6 Failure Case)
**Objective:** Reproduce v9.3.6 failure scenario and verify it now works

**Setup:** Use exact same inputs as 2026-01-29 production test
- Resume/Job History: Portfolio project
- Job Description: Original test JD (87/100 fit score)

**Test Steps:**
1. Run full v9.3.7 system (all 4 layers)
2. Generate customized bullets and summary
3. Verify:
   - All positions included (not left out)
   - Positions in chronological order
   - Word budget respected
   - Action verb distribution valid
   - All guardrails PASS with proof
   - Reconciliation table complete

**Expected Result:** ✅ Zero guardrail violations, full enforcement visible

**Failure Modes:**
- ❌ Position left out (Layer 1 failure)
- ❌ Wrong order (Layer 1 failure)
- ❌ Over word budget (Layer 1 failure)
- ❌ Verb repeated 3+ times (Layer 1 failure)
- ❌ Guardrail shows FAIL (Layer 2 failure)
- ❌ Guardrail lacks proof (Layer 2 failure)

**Success Proof:**
- Screenshot: Full output with all guardrails PASS
- Reconciliation table: All constraints verified
- User feedback: "This is what v9.3.6 should have done"

---

## Acceptance Criteria

**ALL tests must PASS to accept v9.3.7:**

- [ ] Layer 1: 4 tests pass (constraints enforced)
- [ ] Layer 2: 4 tests pass (validation schema working)
- [ ] Layer 3: 3 tests pass (two-turn workflow working)
- [ ] Layer 4: 2 tests pass (injection verified)
- [ ] Production: P.1 test passes (full system works)

**If ANY test fails:**
- Categorize as Layer 1/2/3/4 failure
- Fix that layer
- Re-run all tests
- Document what went wrong and fix

---

## Test Execution Notes

- Run tests in order: Layer 1 → Layer 2 → Layer 3 → Layer 4 → Production
- Layer 1 tests can run independently
- Layers 2-4 depend on Layer 1 passing
- Production test (P.1) requires all layers passing
- Document any issues in implementation-log.md
