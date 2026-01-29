# Lessons Learned: Recursive Constraint Validation - The 3-Stage Checkpoint Pattern

**Date:** 2026-01-29  
**Context:** v9.3.5.1 - Bullet Generation Guardrail Hardening  
**Problem Solved:** How to prevent LLM drift when validating outputs with recursive, interdependent constraints  

**Version:** 1.0

---

## The Problem We Faced

During bullet generation for resume optimization, we encountered a critical pattern of LLM "drift" where models would consistently violate project guardrails despite explicit validation rules. The core issue was a **recursive constraint satisfaction problem** that couldn't be solved with traditional single-pass validation.

### The Constraint Triangle

Resume bullet generation requires satisfying three interdependent constraints simultaneously:

1. **Character Limits:** Each bullet must be 100-210 characters
2. **Word Count Budget:** Total output must be 350-500 words
3. **Conceptual Uniqueness:** No 3+ word phrase can repeat more than twice across all bullets

### Why This Is Recursive

These constraints form a **recursive loop**:
- Adding bullets to meet word count → May violate character limits
- Compressing bullets to meet character limits → May drop below word count
- Removing duplicate phrases → May require regenerating bullets, affecting both counts
- Adjusting bullet count per position → Cascades through all three constraints

### The Failure Pattern: "Generate Then Panic"

**What LLMs were doing:**
1. Generate all bullets first (optimizing for quality/relevance)
2. Check validation rules afterward
3. Discover budget violations (e.g., 520 words, over the 500-word cap)
4. Attempt retroactive fixes (remove bullets, compress text)
5. **Break other constraints** in the process (character limits, uniqueness)

**Impact:**
- Gemini reported "too many guardrails" and cognitive overload
- Claude Sonnet ignored the 19-check validation table
- Both models defaulted to "resume training bias" instead of project rules
- Validation became a formality, not an enforcement mechanism

---

## Root Cause Analysis

### Why Single-Pass Validation Failed

**The 19-Check Monolithic Table:**
```markdown
- [ ] Character limits (100-210)
- [ ] Word count (350-500)
- [ ] Phrase uniqueness (no 3+ word repeats)
- [ ] Verb diversity
- [ ] Metric preservation
- [ ] Formatting rules
... (16 more checks)
```

**Problems:**
1. **No Pre-Planning:** LLM had no budget allocation before generation
2. **No Incremental Gates:** All checks happened after all bullets were written
3. **No Fallback Logic:** When over budget, no explicit instructions on what to remove
4. **Negative Constraints:** "Do not exceed 500 words" primes the LLM to focus on the violation
5. **Invisible Checkpoints:** Validation could happen "in thinking" with no accountability

### The Cognitive Load Problem

**Instructional Saturation:**
In a 4,000+ line context window with 19 simultaneous constraints, critical rules lose attention weight. The LLM experiences:
- **Dilution:** Each rule gets less cognitive "weight"
- **Training Bias Override:** Defaults to "what a resume looks like" from training data
- **Assumption-Making:** Fills gaps with implicit logic instead of stopping to ask

---

## The Solution: 3-Stage Checkpoint Pattern

### Overview

Replace the single 19-check table with **three sequential, visible checkpoints**:

1. **Checkpoint 1: Budget Planning** (Before generation)
2. **Checkpoint 2: Per-Bullet Gates** (During generation)
3. **Checkpoint 3: Final Reconciliation** (After generation)

### Stage 1: Budget Planning (Pre-Generation)

**Purpose:** Allocate bullets per position BEFORE writing any content.

**LLM Must Output:**
```markdown
## Budget Allocation Table

| Position | Recency Weight | JD Relevance | Allocated Bullets | Est. Words |
|----------|----------------|--------------|-------------------|------------|
| P1       | High (2024)    | 85%          | 5                 | 120        |
| P2       | High (2023)    | 70%          | 4                 | 95         |
| P3       | Medium (2022)  | 50%          | 3                 | 75         |
| P4       | Low (2020)     | 30%          | 2                 | 50         |
| P5       | Low (2019)     | 20%          | 2                 | 50         |

**Total Estimated Words:** 390 ✅ (within 350-500 range)
```

**Anti-Drift Mechanisms:**
- **Visible Accountability:** Can't skip this step; must output the table
- **Positive Constraint:** "Allocate based on recency" vs. "Don't over-allocate"
- **Budget Pre-Planning:** Prevents "generate then panic" behavior

### Stage 2: Per-Bullet Gates (During Generation)

**Purpose:** Validate EACH bullet as it's written, not after all are complete.

**LLM Must Check (Per Bullet):**
```markdown
Bullet 1 (Position 1):
- [x] Character count: 185 ✅ (100-210 range)
- [x] Unique phrasing: No 3+ word phrase used 3x ✅
- [x] Verb category: "Built" (not used in P1 yet) ✅
- [x] Metrics traced: Source = P1, Job Title = "Senior Engineer" ✅
```

**Anti-Drift Mechanisms:**
- **Incremental Validation:** Catch violations immediately, not after 16 bullets
- **Visible Gates:** Each bullet has a visible pass/fail record
- **Corrective Feedback Loop:** Fix issues before moving to next bullet

### Stage 3: Final Reconciliation (Post-Generation)

**Purpose:** Verify total output meets all strategic constraints and provide explicit fallback logic.

**LLM Must Output:**
```markdown
## Final Reconciliation

**Word Count Check:**
- Actual: 485 words ✅ (within 350-500 range)

**Bullet Distribution Check:**
- Positions with 5 bullets: 1 ✅ (max 2 allowed)
- Positions with 4 bullets: 1 ✅ (max 2 allowed)
- Minimum bullets per position: 2 ✅ (all positions meet minimum)

**Formatting Rules:**
- [x] Position headers (2-line schema)
- [x] Em-dash ban (tight hyphens only)
- [x] Acronym expansion (first use)
- [x] Terminal recency anchor

**Status:** ✅ ALL CHECKS PASSED
```

**Explicit Fallback Sequence (If Over Budget):**
```markdown
IF word count > 500:
1. Remove bullets from P8 (oldest position) first
2. If still over, remove from P7
3. Continue removing from oldest → newest until under 500
4. Re-run Final Reconciliation to confirm
```

**Anti-Drift Mechanisms:**
- **Positive Fallback:** "Remove from oldest first" vs. "Don't remove from recent"
- **Explicit Logic:** No ambiguity about what to do when over budget
- **Visible Reconciliation:** Must display the final check table

---

## Implementation Results

### Before (Single-Pass Validation)

**Symptoms:**
- ❌ LLMs generated 520+ word outputs, ignored 500-word cap
- ❌ Retroactive compression broke character limits (bullets became 95 chars)
- ❌ Phrase repetition went unnoticed until final review
- ❌ No visible accountability (validation hidden in "thinking")

**Failure Rate:**
- Gemini: 80% guardrail violation rate
- Claude Sonnet: 60% guardrail violation rate

### After (3-Stage Checkpoints)

**Expected Results:**
- ✅ Budget allocated before generation (prevents over-generation)
- ✅ Per-bullet validation catches issues incrementally
- ✅ Explicit fallback logic prevents "panic mode" fixes
- ✅ Visible checkpoints create accountability trail

**Validation:**
- Test with 8-position resume (high complexity)
- Verify all 3 checkpoints are displayed in output
- Confirm fallback sequence triggers correctly when over budget

---

## Replication Pattern for Any Recursive Constraint Problem

### When to Use This Pattern

Use the 3-Stage Checkpoint Pattern when:
1. **Multiple Interdependent Constraints:** Changing one affects others
2. **Budget-Driven Allocation:** Limited resources (words, tokens, time)
3. **LLM Drift Risk:** Complex rules that LLMs tend to ignore
4. **Incremental Generation:** Output is built piece-by-piece

### Generic 3-Stage Template

#### Stage 1: Resource Allocation (Pre-Generation)

```markdown
## [Resource] Allocation Table

| Unit | Priority | Constraint A | Constraint B | Allocated [Resource] |
|------|----------|--------------|--------------|----------------------|
| U1   | High     | Value        | Value        | Amount               |
| U2   | Medium   | Value        | Value        | Amount               |

**Total Allocated:** [X] ✅ (within [min-max] range)
```

**Purpose:** Force LLM to plan before executing.

#### Stage 2: Incremental Validation (During Generation)

```markdown
[Unit 1]:
- [x] Constraint A: [Value] ✅
- [x] Constraint B: [Value] ✅
- [x] Constraint C: [Value] ✅
```

**Purpose:** Catch violations immediately, not after completion.

#### Stage 3: Final Reconciliation (Post-Generation)

```markdown
## Final Check

**[Primary Constraint]:**
- Actual: [Value] ✅ (within [range])

**[Distribution Constraint]:**
- [Metric]: [Value] ✅

**Fallback Sequence (If Violated):**
1. [Action 1]
2. [Action 2]
3. Re-run Final Reconciliation
```

**Purpose:** Verify total output and provide explicit recovery logic.

---

## Key Design Decisions

### 1. Visible Checkpoints (Not Hidden in Thinking)

**Why:** LLMs can "hallucinate" validation in thinking without actually checking.

**Solution:** Mandate that all checkpoint tables appear in the final output.

**Example:**
```markdown
❌ BAD: "I validated the bullets in my thinking"
✅ GOOD: [Displays Budget Allocation Table in output]
```

### 2. Positive Constraints (Not Negative)

**Why:** Negative constraints ("Don't exceed 500 words") prime the LLM to focus on the violation.

**Solution:** Frame as positive actions ("Allocate 350-500 words across positions").

**Example:**
```markdown
❌ BAD: "Do not remove bullets from recent positions"
✅ GOOD: "Remove bullets from oldest positions first (P8 → P7 → P6)"
```

### 3. Explicit Fallback Logic (Not Implicit)

**Why:** LLMs make assumptions when logic is ambiguous.

**Solution:** Provide step-by-step instructions for recovery.

**Example:**
```markdown
❌ BAD: "If over budget, adjust as needed"
✅ GOOD: "If word count > 500: Remove from P8, then P7, then P6 until under 500"
```

### 4. Sequential Gates (Not Parallel)

**Why:** Parallel validation allows LLMs to skip steps.

**Solution:** Enforce sequence: Stage 1 → Stage 2 → Stage 3.

**Example:**
```markdown
❌ BAD: "Check all constraints at once"
✅ GOOD: "Complete Budget Planning before generating any bullets"
```

---

## Lessons for Future Features

### Lesson 1: Recursive Constraints Need Staged Validation

**Pattern:** When constraints affect each other, validate in stages, not all at once.

**Application:**
- Budget planning → Incremental gates → Final reconciliation
- Each stage focuses on a subset of constraints
- Prevents cognitive overload

**Result:** LLM can handle complex constraint systems without drift.

### Lesson 2: Visibility Creates Accountability

**Pattern:** Force LLMs to output validation tables, not hide them in thinking.

**Application:**
- Budget Allocation Table (visible)
- Per-Bullet Gates (visible)
- Final Reconciliation (visible)

**Result:** Creates an audit trail and prevents "hallucinated" validation.

### Lesson 3: Positive Framing Reduces Drift

**Pattern:** Frame constraints as "do this" instead of "don't do that."

**Application:**
- "Allocate 350-500 words" vs. "Don't exceed 500 words"
- "Remove from oldest first" vs. "Don't remove from recent"

**Result:** LLM focuses on the correct action, not the violation.

### Lesson 4: Explicit Fallback Logic Prevents Panic

**Pattern:** Provide step-by-step recovery instructions for constraint violations.

**Application:**
- IF over budget → Remove from P8 → P7 → P6
- IF under budget → Add to P1 → P2 → P3

**Result:** LLM knows exactly what to do instead of improvising.

---

## Common Pitfalls to Avoid

### Pitfall 1: Assuming LLMs Will "Figure It Out"

**Problem:** Leaving fallback logic implicit ("adjust as needed").

**Solution:** Provide explicit, step-by-step instructions.

### Pitfall 2: Allowing Hidden Validation

**Problem:** LLM validates in thinking, claims "all checks passed" without proof.

**Solution:** Mandate visible checkpoint tables in final output.

### Pitfall 3: Negative Constraint Priming

**Problem:** "Don't exceed 500 words" primes LLM to focus on the violation.

**Solution:** Reframe as positive allocation ("Allocate 350-500 words").

### Pitfall 4: Monolithic Validation

**Problem:** Checking all 19 constraints at once causes cognitive overload.

**Solution:** Break into 3 stages with focused subsets of constraints.

---

## Questions This Solves for Future Developers

**Q: "Why do LLMs ignore my validation rules?"**  
A: Single-pass validation after generation allows drift. Use staged checkpoints before, during, and after.

**Q: "How do I handle interdependent constraints?"**  
A: Use the 3-Stage Checkpoint Pattern: Budget Planning → Incremental Gates → Final Reconciliation.

**Q: "How do I prevent 'generate then panic' behavior?"**  
A: Force budget allocation BEFORE generation (Stage 1).

**Q: "How do I make validation accountable?"**  
A: Mandate visible checkpoint tables in the final output.

**Q: "What if the LLM violates a constraint?"**  
A: Provide explicit fallback logic (e.g., "Remove from P8 → P7 → P6").

---

## Conclusion

**What we built:** A 3-stage checkpoint system that prevents LLM drift during recursive constraint validation.

**Why it matters:** Single-pass validation fails when constraints are interdependent. Staged checkpoints with visible accountability prevent "generate then panic" behavior.

**How it's retained:**
- Budget Planning (Stage 1) prevents over-generation
- Incremental Gates (Stage 2) catch violations immediately
- Final Reconciliation (Stage 3) provides explicit fallback logic
- Visible checkpoints create an audit trail

**How to replicate:** Use the 3-Stage Checkpoint Pattern for any problem with recursive, interdependent constraints.

---

**Key Takeaway:**  
*Recursive constraints require staged validation. Force LLMs to plan before generating, validate incrementally during generation, and reconcile with explicit fallback logic after generation. Make all checkpoints visible to prevent validation drift.*

---

**Created:** 2026-01-29  
**Version:** 1.0  
**Related Docs:**
- **Knowledge Graph:** [patterns.md - 3-Stage Validation Checkpoint](../../knowledge/patterns.md#3-stage-validation-checkpoint)
- **Knowledge Graph:** [architecture.md - 3-Layer Unified Redundancy Framework](../../knowledge/architecture.md#3-layer-unified-redundancy-framework-g40)
- `.agent/workflows/generate-bullets.md` - Bullet generation workflow
- `optimization-tools/bullet-optimizer/bo_output-validator.md` - Output validation rules
- `docs/lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md` - LLM constraint engineering
- `docs/decisions/ADR-010-guardrail-hardening-pattern.md` - Guardrail hardening architecture

**Related Issues Solved:**
- v9.3.5: LLM guardrail drift (Issue #85 / GitHub #97)
- v9.3.5.1: Recursive constraint validation (3-stage checkpoint implementation)
