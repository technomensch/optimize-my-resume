# Structural Solutions for Enforcement System Failure

**Status:** Proposal Document
**Date:** 2026-01-30
**Context:** Addressing questions from [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) and [ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md](../issues/ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md)
**Background:** Claude Projects approach already attempted and failed (user confirmed)

---

## The Core Problem Restated

**Why Documentation Alone Fails:**
1. LLMs are probabilistic - they can choose to ignore any instruction
2. Context saturation (4,000+ lines) causes rules to lose attention weight
3. Training bias overrides project-specific constraints under pressure
4. No mechanism can "force" compliance from inside the model
5. Even Claude Projects with all guardrail files loaded still bypassed enforcement (user confirmed)

**What We Need:**
Structural changes that make bypassing enforcement either **impossible** or **immediately visible** to the user.

---

## Questions to Answer

From the case study:

1. How should enforcement mechanisms be made structural so they can't be bypassed by the model?
2. What patterns work for embedding procedural requirements into a workflow?
3. How can the 3-stage checkpoint pattern be enforced rather than just documented?
4. Is there a workflow/skill mechanism that would force validation gates?
5. How do we make regression impossible across sessions and model switches?

---

## Solution Framework

The solutions fall into three categories:

| Category | Control Point | Bypass Risk | Implementation Effort |
|----------|--------------|-------------|----------------------|
| **A. Human-in-the-Loop** | User approval gates | Low (human verifies) | Low |
| **B. External Validation** | Scripts/tools outside LLM | None (LLM can't bypass) | Medium |
| **C. Prompt Architecture** | Structural prompt changes | Medium (still probabilistic) | Low |

**Recommendation:** Combine approaches. No single solution is sufficient.

---

## Solution A: Human-in-the-Loop Gates

### A1. Mandatory User Approval Between Stages

**Concept:** Break the continuous generation into discrete steps that require user approval before proceeding.

**Implementation:**

Instead of:
```
User: "Generate optimized bullets for this job"
LLM: [Generates everything in one response, potentially skipping stages]
```

Use:
```
User: "Generate optimized bullets for this job"
LLM: [Stage 1 Output Only]
     "Here's my Budget Allocation Table. Before I proceed to generate bullets:
     - Positions to include: [list]
     - Chronological order: [order]
     - Word budget: [breakdown]

     Reply 'approved' to proceed, or provide corrections."

User: "approved" (or corrections)

LLM: [Stage 2 Output Only]
     "Here are bullets for Position 0:
     [Bullets with per-bullet gate checks visible]

     Reply 'next' for Position 1, or provide corrections."

User: "next"
... continues per position ...

LLM: [Stage 3 Output Only]
     "Final Reconciliation:
     [Validation table]

     Reply 'deliver' to receive final output."
```

**Why This Works:**
- User sees each stage explicitly
- User can catch violations before they compound
- No hidden validation - everything visible
- LLM cannot skip stages because user must approve each one

**Drawbacks:**
- Slower workflow (multiple turns)
- Requires active user participation
- User fatigue on long sessions

**Workflow Change Required:**
Update `.agent/workflows/generate-bullets.md` to include explicit "STOP AND WAIT FOR USER APPROVAL" gates after each stage.

---

### A2. Pre-Flight Confirmation Gate

**Concept:** Before any generation, LLM outputs a pre-flight checklist and asks user to confirm they've read it.

**Implementation:**

```markdown
## PRE-FLIGHT CHECKLIST (You must acknowledge before I proceed)

I am about to generate bullets. I will follow these rules:
1. [ ] Output Budget Allocation Table FIRST (Stage 1)
2. [ ] Include ALL 9 positions in chronological order
3. [ ] Show per-bullet validation gates (Stage 2)
4. [ ] Output Final Reconciliation Table (Stage 3)
5. [ ] Word count: 350-500 total
6. [ ] Verb diversity: 3+ categories

**Reply "proceed" to confirm you've read this and will hold me accountable.**
```

**Why This Works:**
- Forces LLM to "sign" a contract before starting
- User knows what to expect
- Creates explicit accountability
- Easy to spot violations ("You said you'd do X but didn't")

**Workflow Change Required:**
Add this as Step 0.5 in generate-bullets.md, after reading the logic hub but before any generation.

---

## Solution B: External Validation (Non-Bypassable)

### B1. Python Validation Script

**Concept:** Create a script that parses LLM output and validates against guardrails. The LLM cannot bypass this because it runs outside the model.

**Implementation:**

```python
#!/usr/bin/env python3
"""
validate_bullets.py - External guardrail validation
Runs AFTER LLM generates output, BEFORE user accepts it
"""

import sys
import re

def validate_output(text):
    errors = []

    # Check 1: Budget Allocation Table present
    if "Budget Allocation Table" not in text and "Position ID" not in text:
        errors.append("FAIL [G40-Stage1]: Budget Allocation Table not found")

    # Check 2: Word count within range
    word_count = len(text.split())
    # (More sophisticated: count only bullet text, not headers)

    # Check 3: All 9 positions present
    positions_found = set(re.findall(r'Position (\d+)', text))
    if len(positions_found) < 9:
        errors.append(f"FAIL [G12]: Only {len(positions_found)} positions found, expected 9")

    # Check 4: Chronological order
    position_order = [int(p) for p in re.findall(r'Position (\d+)', text)]
    if position_order != sorted(position_order):
        errors.append(f"FAIL [G12]: Positions not in chronological order: {position_order}")

    # Check 5: Final Reconciliation Table present
    if "Final Reconciliation" not in text and "Reconciliation Table" not in text:
        errors.append("FAIL [G40-Stage3]: Final Reconciliation Table not found")

    # Check 6: Per-bullet character counts
    bullets = re.findall(r'[•\-\*]\s*(.+)', text)
    for i, bullet in enumerate(bullets):
        char_count = len(bullet)
        if char_count < 100 or char_count > 210:
            errors.append(f"FAIL [G24]: Bullet {i+1} has {char_count} chars (must be 100-210)")

    return errors

if __name__ == "__main__":
    # Read from stdin or file
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            text = f.read()
    else:
        text = sys.stdin.read()

    errors = validate_output(text)

    if errors:
        print("VALIDATION FAILED:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("VALIDATION PASSED: All guardrails satisfied")
        sys.exit(0)
```

**Usage:**
```bash
# After LLM generates output, save to file and run:
python validate_bullets.py generated_output.txt

# Or pipe directly:
cat generated_output.txt | python validate_bullets.py
```

**Why This Works:**
- Runs outside the LLM - cannot be bypassed
- Provides immediate feedback on violations
- Can be integrated into git hooks, CI/CD, or manual workflow
- Objective (no "vibe-check" ambiguity)

**Workflow Change Required:**
1. Create `scripts/validate_bullets.py`
2. Update workflow to include "Run validation script before accepting output"
3. Document the validation step in PROJECT-INSTRUCTIONS.md

---

### B2. Git Pre-Commit Hook

**Concept:** If generated content is saved to files (e.g., resume outputs), use git hooks to validate before allowing commit.

**Implementation:**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Find any modified resume/bullet files
RESUME_FILES=$(git diff --cached --name-only | grep -E '(resume|bullets|output).*\.(md|txt)$')

if [ -n "$RESUME_FILES" ]; then
    echo "Validating resume/bullet files..."
    for file in $RESUME_FILES; do
        python scripts/validate_bullets.py "$file"
        if [ $? -ne 0 ]; then
            echo "COMMIT BLOCKED: Validation failed for $file"
            exit 1
        fi
    done
fi

exit 0
```

**Why This Works:**
- Structural enforcement at the git level
- Cannot be bypassed by the LLM
- Creates permanent audit trail
- Blocks non-compliant content from being committed

**Drawback:**
- Only works if output is committed to git
- Not applicable for chat-only workflows

---

### B3. Claude Code Hook Integration

**Concept:** Use Claude Code's hook system to run validation after tool calls.

**Implementation:**

In `.claude/settings.json`:
```json
{
  "hooks": {
    "postToolCall": {
      "Write": "python scripts/validate_bullets.py ${filePath}"
    }
  }
}
```

**Why This Works:**
- Automatic validation whenever the LLM writes a file
- Integrated into the Claude Code workflow
- No manual step required

**Note:** This requires Claude Code hook support for custom validation scripts.

---

## Solution C: Prompt Architecture

### C1. Recency Anchors (End-of-Prompt Constraints)

**Concept:** Move critical constraints to the END of the prompt, closest to where generation begins. Constraints at the end have highest attention weight.

**Implementation:**

Current (buried in middle of context):
```
[4000 lines of job history, JD, previous conversation...]

Generate optimized bullets.
```

Improved:
```
[4000 lines of job history, JD, previous conversation...]

Generate optimized bullets.

CRITICAL REQUIREMENTS (BLOCKING):
1. You MUST output Budget Allocation Table BEFORE any bullets
2. You MUST include ALL 9 positions in order: 0, 1, 2, 3, 4, 5, 6, 7, 8
3. You MUST show per-bullet validation gates
4. You MUST output Final Reconciliation Table AFTER all bullets
5. If you skip ANY of these, the output is INVALID

START WITH: "## Budget Allocation Table"
```

**Why This Works:**
- Recency effect places constraints in working memory
- Explicit "START WITH" reduces drift
- All-caps BLOCKING signals importance

**Drawback:**
- Still probabilistic - LLM can still ignore
- Helps but doesn't guarantee compliance

---

### C2. Template-Forcing (Structured Output)

**Concept:** Instead of free-form generation, provide a strict template that must be filled. Reduces degrees of freedom.

**Implementation:**

```markdown
## YOUR OUTPUT MUST FOLLOW THIS EXACT STRUCTURE:

### 1. Budget Allocation Table (REQUIRED)
| Position | Include? | Bullets | Est. Words |
|----------|----------|---------|------------|
| 0        | [Y/N]    | [#]     | [#]        |
| 1        | [Y/N]    | [#]     | [#]        |
| 2        | [Y/N]    | [#]     | [#]        |
| 3        | [Y/N]    | [#]     | [#]        |
| 4        | [Y/N]    | [#]     | [#]        |
| 5        | [Y/N]    | [#]     | [#]        |
| 6        | [Y/N]    | [#]     | [#]        |
| 7        | [Y/N]    | [#]     | [#]        |
| 8        | [Y/N]    | [#]     | [#]        |
| TOTAL    | -        | [#]     | [#] (350-500) |

### 2. Position 0 Bullets
[Bullet 1] - [char count] chars - [verb category]
[Bullet 2] - [char count] chars - [verb category]
...

### 3. Position 1 Bullets
...

### 9. Final Reconciliation Table (REQUIRED)
| Check | Value | Pass/Fail |
|-------|-------|-----------|
| Word Count | [#] | [350-500?] |
| Position Count | [#] | [9?] |
| Chronological | [order] | [correct?] |
```

**Why This Works:**
- Reduces creative freedom = reduces drift
- Template acts as guardrail itself
- Easy to visually verify compliance
- Missing sections are obvious

**Drawback:**
- May feel rigid
- Requires updating template if requirements change

---

### C3. Explicit Failure Conditions

**Concept:** Instead of just saying "do X", also specify "if you don't do X, the result is INVALID."

**Implementation:**

```markdown
FAILURE CONDITIONS (If any are true, your output is REJECTED):

- [ ] Budget Allocation Table is missing → INVALID
- [ ] Any position (0-8) is missing → INVALID
- [ ] Positions are not in chronological order → INVALID
- [ ] Per-bullet validation gates not shown → INVALID
- [ ] Final Reconciliation Table is missing → INVALID
- [ ] Word count outside 350-500 → INVALID
- [ ] Any bullet outside 100-210 characters → INVALID

If your output would trigger ANY failure condition, STOP and fix it before outputting.
```

**Why This Works:**
- Negative constraints framed as explicit failure conditions
- Creates binary pass/fail mindset
- LLM can self-check against list before outputting

**Drawback:**
- Still depends on LLM choosing to check
- "Pink Elephant Problem" - mentioning failures may prime them

---

### C4. Decomposed Task Prompting

**Concept:** Instead of one big prompt, break into multiple smaller prompts that each focus on one stage.

**Implementation:**

**Prompt 1 (Stage 1 Only):**
```
Given the following 9 positions from job history and target JD:
[job history]
[JD]

Create ONLY a Budget Allocation Table. Do NOT generate any bullets yet.
Show: Position ID, Include (Y/N), Allocated Bullets, Estimated Words.
Total must be 350-500 words.
```

**Prompt 2 (Stage 2 - Position 0 Only):**
```
Based on this approved budget allocation:
[Stage 1 output]

Generate bullets for Position 0 ONLY.
For each bullet show:
- Bullet text
- Character count (must be 100-210)
- Verb category
- Source metric trace
```

**Prompt 3 (Stage 2 - Position 1 Only):**
```
[Same pattern for Position 1]
```

**... continues for all positions ...**

**Prompt 10 (Stage 3 Only):**
```
Here are all the bullets generated:
[All Stage 2 outputs]

Create ONLY a Final Reconciliation Table.
Check: Word count, Position count, Chronological order, Character limits.
```

**Why This Works:**
- Each prompt has a single, clear objective
- Reduces context per prompt = less saturation
- User can verify each step before proceeding
- If one step fails, only that step needs to be redone

**Drawback:**
- Requires 10+ separate prompts for full workflow
- More user effort
- May lose continuity between prompts

---

## Combined Solution: Recommended Approach

**Use a layered defense:**

### Layer 1: Prompt Architecture (C1 + C2 + C3)
- Recency anchors at end of prompt
- Template-forcing for structured output
- Explicit failure conditions

### Layer 2: Human-in-the-Loop (A1)
- User approval gates between Stage 1 → Stage 2 → Stage 3
- User can catch violations before they compound

### Layer 3: External Validation (B1)
- Python script validates final output
- Non-bypassable check before accepting result

### Workflow:

```
1. User provides JD + job history

2. LLM outputs Stage 1 (Budget Allocation Table)
   - Uses template format (C2)
   - Recency anchors ensure it starts correctly (C1)

3. USER APPROVAL GATE
   - User verifies all 9 positions present
   - User verifies chronological order
   - User says "approved" or provides corrections

4. LLM outputs Stage 2 (Bullets)
   - Per-position or all at once
   - Shows per-bullet validation gates

5. USER APPROVAL GATE
   - User verifies bullets look reasonable
   - User says "continue"

6. LLM outputs Stage 3 (Final Reconciliation)
   - Uses template format (C2)
   - Shows all validation metrics

7. USER APPROVAL GATE
   - User verifies all checks pass
   - User says "deliver"

8. EXTERNAL VALIDATION
   - User runs: python validate_bullets.py output.txt
   - Script checks all guardrails objectively
   - If FAIL: User asks LLM to fix specific issues
   - If PASS: Output is accepted
```

---

## Answer to Original Questions

### Q1: How should enforcement mechanisms be made structural?

**Answer:** Combine three approaches:
1. **Human gates** - User approval between stages
2. **External validation** - Scripts that run outside the LLM
3. **Template forcing** - Reduced degrees of freedom

No single approach is sufficient. The combination creates defense-in-depth.

### Q2: What patterns work for embedding procedural requirements?

**Answer:**
1. **Decomposed tasks** - One stage per prompt
2. **Recency anchors** - Critical rules at end of prompt
3. **Explicit failure conditions** - Binary pass/fail mindset
4. **Template structures** - Fill-in-the-blank reduces drift

### Q3: How can the 3-stage checkpoint pattern be enforced?

**Answer:**
1. **Require user approval** between stages (human gate)
2. **Use template output** that visually enforces stages
3. **Run external validation** after Stage 3 to verify all stages present
4. **Decompose** into separate prompts (one stage per prompt)

### Q4: Is there a workflow/skill mechanism that would force validation gates?

**Answer:** Yes, but limited:
- **Claude Code hooks** can run scripts after tool calls
- **Git pre-commit hooks** can block non-compliant commits
- **Workflow files** can include "STOP AND WAIT" gates

However, no mechanism can force the LLM itself to follow instructions. External validation is the only non-bypassable approach.

### Q5: How do we make regression impossible across sessions and model switches?

**Answer:** Regression is not "impossible" but can be minimized:
1. **External validation scripts** - Work regardless of model
2. **Template-based output** - Easy to verify visually
3. **Human approval gates** - User catches issues in any model
4. **Pre-commit hooks** - Block non-compliant content at git level
5. **Session start checklist** - Remind model of requirements at start

The key insight: **Move enforcement outside the LLM** wherever possible.

---

## Implementation Priority

| Solution | Impact | Effort | Priority |
|----------|--------|--------|----------|
| A1. User Approval Gates | High | Low | **P1** |
| B1. Python Validation Script | High | Medium | **P1** |
| C1. Recency Anchors | Medium | Low | **P2** |
| C2. Template-Forcing | Medium | Low | **P2** |
| C3. Explicit Failure Conditions | Medium | Low | **P2** |
| B2. Git Pre-Commit Hook | Medium | Low | **P3** |
| C4. Decomposed Task Prompting | High | High | **P3** |
| B3. Claude Code Hook | Medium | Medium | **P4** |

**Start with:**
1. Add user approval gates to generate-bullets.md (A1)
2. Create validate_bullets.py script (B1)
3. Update prompt templates with recency anchors and explicit failure conditions (C1, C3)

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/validate_bullets.py` | CREATE | External validation script |
| `.agent/workflows/generate-bullets.md` | MODIFY | Add user approval gates |
| `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` | MODIFY | Add recency anchors, template format |
| `PROJECT-INSTRUCTIONS.md` | MODIFY | Add external validation step to workflow |
| `.git/hooks/pre-commit` | CREATE | Git-level validation (optional) |

---

## Conclusion

**The enforcement system failure on Jan 29 cannot be solved by better documentation alone.**

The model can read, understand, and ignore any instruction. The only reliable solutions involve:
1. **Human verification** at each stage
2. **External validation** that runs outside the model
3. **Structural constraints** that reduce degrees of freedom

Documentation is necessary but not sufficient. Enforcement requires mechanisms the LLM cannot bypass.

---

## CRITICAL UPDATE: Platform-Specific Solutions

**Updated:** 2026-01-30
**Context:** Analysis of project history confirmed that ALL previous documentation-based enforcement attempts have been tried and failed:

| Attempted Solution | Evidence | Outcome |
|-------------------|----------|---------|
| Template-forcing | bo_output-validator.md, 3-Stage Checkpoint Pattern | **FAILED** - No mechanism forces use |
| Recency anchors | ADR-005, ADR-010 terminal anchors | **FAILED** - Insufficient alone |
| Pre-flight verification | generate-bullets.md Step 0 | **FAILED** - No visible tables generated |
| 3-Stage Checkpoint Pattern | ADR-010-guardrail-hardening-pattern.md | **COMPLETELY BYPASSED** |
| 15-point validation checklist | bo_output-validator.md | **NEVER USED** |
| Claude Project | User tested with all guardrail files | **FAILED** - "Back at square one" |

**Conclusion:** Documentation-based enforcement CANNOT work because there's no mechanism that FORCES compliance. Solutions must be structural.

---

## Platform-Specific Solution Options

### Platform 1: Chat Interface (Claude Chat, Gemini, ChatGPT)

**Constraints:**
- No external scripts (sandboxed environment)
- No persistent project memory (except ChatGPT's limited memory)
- Only conversation context available
- Cannot enforce anything programmatically

**What Has Failed:**
- Template instructions get ignored when context is large
- Recency anchors help but are insufficient
- Pre-flight checklists don't prevent violations

**Recommended Solution: Forced Multi-Turn Architecture**

The ONLY enforceable mechanism in chat interfaces is **conversation structure itself**. The user must force the model to stop at each stage.

**Implementation:**

**Step 1: Stage 1 ONLY Prompt**
```
TASK: Generate ONLY a Budget Allocation Table for resume bullets.

JD: [paste JD]
Job History: [paste or reference]

CRITICAL INSTRUCTION:
- Output ONLY the Budget Allocation Table
- Do NOT generate any bullets in this response
- List all positions (0-8) with: Include Y/N, Bullet count, Est. words
- Total must be 350-500 words
- When done, STOP and wait for my approval

FORMAT:
| Position | Include | Bullets | Est Words |
|----------|---------|---------|-----------|
[fill in]

STOP AFTER THE TABLE. Do not proceed.
```

**User reviews Stage 1 output. If wrong, corrections. If correct:**

**Step 2: Stage 2 Prompt (per position)**
```
APPROVED budget allocation:
[paste Stage 1 table]

Generate bullets for Position 0 ONLY.

For EACH bullet show:
- Bullet text
- Character count (must be 100-210)
- Verb category

When done with Position 0, STOP. Do not generate Position 1.
```

**Repeat for each position the user wants to include.**

**Step 3: Stage 3 Prompt**
```
Here are all generated bullets:
[paste all Stage 2 outputs]

Create ONLY a Final Reconciliation Table:
| Check | Value | Pass/Fail |
|-------|-------|-----------|
| Word Count | [#] | [350-500?] |
| Position Count | [#] | [expected?] |
| Chronological | [order] | [correct?] |
| Char Limits | [any violations?] | |

If ANY check fails, identify which bullets need fixing.
```

**Why This Works:**
- Model CANNOT skip stages because each stage is a separate prompt
- User sees all intermediate outputs
- Violations caught before they compound
- No context saturation (each prompt is small)

**Why Previous Approaches Failed:**
- Previous approaches used ONE prompt with "stop and wait" instructions
- Model interpreted "wait" as "wait within the same response" and continued
- Multi-prompt forces actual conversation turns

**Trade-offs:**
- Slower (10+ prompts for full workflow)
- Requires active user participation
- Better suited for learning the model's failure patterns than for production use

---

### Platform 2: Claude Project

**Constraints:**
- Has project-level system prompt
- Can attach files to project
- User confirmed this already failed

**What Has Failed:**
- All guardrail files attached to project
- System prompt included enforcement instructions
- Model still bypassed all enforcement in production run

**Why It Failed:**
Claude Projects suffer from the same fundamental issue: **instructions can be read and ignored**. The project system prompt is just more context - it doesn't change the probabilistic nature of generation.

**Recommended Solution: Minimized Context + Verification Artifacts**

Instead of trying to load all guardrails into the project, use a **minimalist enforcement approach**:

**Project Setup:**
1. **System Prompt (MAX 500 words):** Only the absolute critical rules
2. **No guardrail files attached:** They create context saturation
3. **One instruction file:** A simplified checklist, not comprehensive documentation

**Simplified System Prompt:**
```
You are a resume bullet optimizer. You MUST follow this 3-step process:

STEP 1 (ALWAYS FIRST):
Output a Budget Allocation Table showing all positions you will include.
Format: Position | Bullets | Est Words
Then STOP and ask: "Does this allocation look correct?"

STEP 2 (AFTER USER APPROVAL):
Generate bullets. For EACH bullet show: [text] - [X chars] - [verb category]
Character limit: 100-210 per bullet.
Then STOP and ask: "Ready for reconciliation?"

STEP 3 (AFTER USER APPROVAL):
Output a Final Reconciliation Table:
| Check | Value | Pass/Fail |
Then deliver final formatted output.

CRITICAL: If you skip ANY step, the user will ask you to start over.
```

**Verification Artifacts:**
Require the model to produce VISIBLE artifacts at each stage:
1. Budget table = verifiable artifact
2. Per-bullet char counts = verifiable artifact
3. Reconciliation table = verifiable artifact

If an artifact is missing, user immediately knows enforcement failed.

**Why This Might Work Better:**
- Smaller context = less saturation
- Fewer rules = easier to follow
- Visible artifacts = easy to spot violations
- User-facing "ask for approval" creates natural gates

**Trade-offs:**
- Loses the comprehensive guardrail detail
- Relies on user catching violations
- Still probabilistic (model can still ignore)

**Expectation:** ~60% compliance (vs. 0% with full guardrail docs loaded)

---

### Platform 3: Google AI Studio

**Constraints:**
- Similar to Claude Project (system instructions)
- Has "structured prompts" feature
- Temperature/safety controls
- Can save prompts for reuse

**What Might Work:**

**Structured Prompt Feature:**
Google AI Studio allows defining structured prompts with explicit input/output schemas. This is closer to template-forcing than Claude Projects.

**Implementation:**

**1. Create a Structured Prompt:**
```yaml
name: "Resume Bullet Generator"
description: "Generates resume bullets following 3-stage checkpoint pattern"

input_schema:
  - name: "job_description"
    type: "string"
    description: "Target job description"
  - name: "job_history"
    type: "string"
    description: "Candidate job history in XML format"

output_schema:
  - name: "stage1_budget"
    type: "object"
    properties:
      positions: array of {id, include, bullets, words}
      total_words: integer
  - name: "stage2_bullets"
    type: "array"
    items:
      position_id: integer
      bullets: array of {text, char_count, verb_category}
  - name: "stage3_reconciliation"
    type: "object"
    properties:
      word_count: {value, pass}
      position_count: {value, pass}
      char_limits: {violations, pass}

instructions: |
  Generate resume bullets following this exact 3-stage process.
  All three stages MUST be present in output.
  [Simplified rules here]
```

**2. Temperature Setting:**
Set temperature to 0.0-0.3 for maximum determinism. Higher temperatures increase creative drift.

**3. Safety Settings:**
Not directly applicable to enforcement, but ensure they don't block legitimate content.

**Why This Might Work Better:**
- Output schema creates structural requirement for all 3 stages
- Lower temperature reduces creative drift
- Structured prompts are reusable and version-controllable
- Explicit schema means missing stages are more obvious

**Trade-offs:**
- Output schema is a hint, not enforced by the API
- Gemini models may have different drift patterns than Claude
- Less project continuity than Claude Projects

**Expectation:** ~50-70% compliance (untested - needs experimentation)

---

### Platform 4: JSX GUIs (Future Implementation)

**Constraints:**
- Full programmatic control
- Can execute arbitrary validation code
- Can enforce UI-level gates
- This is the ONLY platform with true enforcement capability

**Recommended Solution: Stage-Gated UI with External Validation**

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    JSX GUI Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Stage 1   │───▶│   Stage 2   │───▶│   Stage 3   │     │
│  │   Budget    │    │   Bullets   │    │   Reconcile │     │
│  │   Planning  │    │   Generate  │    │   Validate  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                  │                  │              │
│        ▼                  ▼                  ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Validation  │    │ Validation  │    │ Validation  │     │
│  │   Gate 1    │    │   Gate 2    │    │   Gate 3    │     │
│  │ (Required)  │    │ (Required)  │    │ (Required)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                  │                  │              │
│        ▼                  ▼                  ▼              │
│  [User Approve]    [User Approve]    [User Approve]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Details:**

**1. Stage-Based UI:**
- UI only shows one stage at a time
- "Next" button is disabled until validation passes
- User MUST click approve to proceed

**2. Per-Stage Validation (JavaScript/Python):**
```javascript
// Stage 1 Validation
function validateBudgetAllocation(output) {
  const errors = [];

  // Check positions 0-8 all present
  const positions = parsePositions(output);
  if (positions.length < 9) {
    errors.push(`Missing positions: expected 9, got ${positions.length}`);
  }

  // Check total word budget
  const totalWords = positions.reduce((sum, p) => sum + p.estWords, 0);
  if (totalWords < 350 || totalWords > 500) {
    errors.push(`Word budget out of range: ${totalWords} (must be 350-500)`);
  }

  return { valid: errors.length === 0, errors };
}

// Stage 2 Validation (per bullet)
function validateBullet(bullet) {
  const errors = [];

  if (bullet.length < 100 || bullet.length > 210) {
    errors.push(`Character count ${bullet.length} out of range (100-210)`);
  }

  // Verb category check
  const validVerbs = ['Built', 'Lead', 'Managed', 'Improved', 'Collaborate'];
  if (!validVerbs.includes(bullet.verbCategory)) {
    errors.push(`Invalid verb category: ${bullet.verbCategory}`);
  }

  return { valid: errors.length === 0, errors };
}

// Stage 3 Validation
function validateReconciliation(allBullets, budget) {
  const errors = [];

  const totalWords = countWords(allBullets);
  if (totalWords < 350 || totalWords > 500) {
    errors.push(`Final word count ${totalWords} out of range`);
  }

  // Verify all allocated positions have bullets
  // ...

  return { valid: errors.length === 0, errors };
}
```

**3. API Call Structure:**
```javascript
// Stage 1: Budget Planning
const stage1Response = await callLLM({
  prompt: buildStage1Prompt(jd, jobHistory),
  outputFormat: 'json',
  schema: budgetAllocationSchema
});

const stage1Validation = validateBudgetAllocation(stage1Response);
if (!stage1Validation.valid) {
  showErrors(stage1Validation.errors);
  // User must fix or regenerate
  return;
}

// User approves Stage 1
await waitForUserApproval();

// Stage 2: Bullet Generation (per position)
const allBullets = [];
for (const position of stage1Response.positions) {
  if (!position.include) continue;

  const stage2Response = await callLLM({
    prompt: buildStage2Prompt(position, jd, jobHistory),
    outputFormat: 'json',
    schema: bulletSchema
  });

  for (const bullet of stage2Response.bullets) {
    const bulletValidation = validateBullet(bullet);
    if (!bulletValidation.valid) {
      showErrors(bulletValidation.errors);
      // Regenerate or fix this bullet
      continue;
    }
    allBullets.push(bullet);
  }

  await waitForUserApproval();
}

// Stage 3: Final Reconciliation
const stage3Validation = validateReconciliation(allBullets, stage1Response);
if (!stage3Validation.valid) {
  showErrors(stage3Validation.errors);
  // User must fix
  return;
}

// Output final result
displayFinalOutput(allBullets);
```

**Why This Works:**
- **Validation runs outside LLM** - cannot be bypassed
- **UI gates enforce stage progression** - cannot skip stages
- **JSON output schema** - reduces free-form drift
- **User approval required** - human-in-the-loop enforced by UI

**What's Different from Previous Attempts:**
- Previous: LLM told to follow rules, violations discovered post-hoc
- JSX GUI: LLM output validated programmatically, violations blocked in real-time

**Trade-offs:**
- Requires building and maintaining GUI
- Adds development complexity
- Requires API access (not just chat interface)

**Expectation:** ~95%+ compliance (validation is non-bypassable)

---

## Summary: Platform Compliance Expectations

| Platform | Enforcement Method | Expected Compliance | Notes |
|----------|-------------------|---------------------|-------|
| Chat Interface | Multi-turn prompts | ~30-40% | Relies entirely on user vigilance |
| Claude Project | Minimized context + artifacts | ~50-60% | Better than full docs, still probabilistic |
| Google AI Studio | Structured prompts + low temp | ~50-70% | Untested, needs experimentation |
| JSX GUI | External validation + UI gates | ~95%+ | Only truly enforceable option |

**Key Insight:**
- Platforms 1-3 are ALL probabilistic - the model CAN still ignore instructions
- Platform 4 (JSX GUI) is the only option with TRUE enforcement
- For critical production use, invest in Platform 4
- Platforms 1-3 are useful for learning and iteration, not final production

---

## Recommendations

**Immediate (Next Session):**
1. Test the multi-turn approach (Platform 1) in Claude Chat
2. Document compliance rate across 3-5 test runs
3. Identify which stages fail most often

**Short-Term:**
1. Create minimized Claude Project (Platform 2) with ~500 word system prompt
2. Test and compare compliance rate to chat interface
3. Test Google AI Studio structured prompts if available

**Medium-Term:**
1. Build JSX GUI prototype with validation gates
2. Integrate validate_bullets.py logic into JavaScript
3. Test with real job applications

**Long-Term:**
1. Deploy JSX GUI as primary production tool
2. Use chat interfaces only for quick tests/iterations
3. Archive comprehensive guardrail docs (they created more problems than they solved)

---

**Document Version:** 2.0
**Last Updated:** 2026-01-30
**Status:** Platform-Specific Solutions Added - Ready for Testing
