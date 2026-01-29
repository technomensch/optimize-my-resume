---
description: Generate optimized resume bullets using the centralized logic hub
---

# Generate Bullets Workflow

This workflow routes bullet generation requests to the centralized logic hub (`bo_bullet-generation-instructions.md`) following the "Bullet-First" execution order defined in ADR-009.

---

## ⚠️ CRITICAL: Stop-on-Confusion Gate

**Before proceeding with ANY step:**
If you are unsure about a rule, term, or instruction:
1. **STOP immediately**
2. **Ask the user for clarification**
3. **Do NOT assume or infer guardrail definitions from labels alone**

If you feel overwhelmed by the number of rules, say so. The user can help prioritize.

---

## When to Use This Workflow

Use this workflow when:
- User requests bullet optimization for a specific position
- Running the "Optimize My Application" flow (bullets must be generated before summary)
- Updating existing bullets to match a new JD

---

## Execution Steps

### Step 0: Stage 1 - Budget Planning (Checkpoint 1)

**VISIBLE OUTPUT REQUIRED:** Before initializing ANY generation, the agent MUST output a **Budget Allocation Table** to plan for recursive constraints (Char limits vs. Word budget).

| Position ID | Recency Weight | JD Relevance | Allocated Bullets | Est. Words |
| :--- | :--- | :--- | :--- | :--- |
| P1 (Current) | High | % | [Count] | [Est] |
| P2 | High | % | [Count] | [Est] |
| P3 | Medium | % | [Count] | [Est] |
| P4+ | Low | % | [Count] | [Est] |

**Budget Verification:**
- [ ] Estimated word count: 350-500 ✅
- [ ] Distribution check: Max 2 positions with 5 bullets, max 2 with 4.
- [ ] Strategy: Prioritize JD keywords and metrics in P1-P3.

### Step 1: Verify Prerequisites
Ensure the following context is available:
- **Job History:** Either from uploaded file, `job-summaries/` directory, or PROJECT-INSTRUCTIONS.md context
- **JD (if applicable):** Either from uploaded file, `jd_parsed/` directory, or user-provided text

**Note:** File paths and names may vary by environment (Claude Desktop, Claude Web, other LLMs). The workflow adapts to whatever context is available.

### Step 2: Load the Logic Hub

**⚠️ ACTION REQUIRED:** Use your file reading capability to **OPEN AND READ** this file NOW:
```
optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md
```

**Do NOT proceed to Step 3 until you have read Sections 1-5 of that file.**

**CHECKPOINT:** After reading, confirm you understand:
- [ ] The 2-line header format (Section 5: [FMT] Position Header Schema)
- [ ] Verb diversity means 1 category per position for <5 bullets (Section 3 or G9)
- [ ] The mandatory terminal anchor text (Section 5: [FMT] Terminal Recency Anchor)

If you cannot confirm all three, **STOP and re-read the file**.

### Step 3: Execute Bullet Generation (Stage 2 - Per-Bullet Gates)

Follow the logic hub instructions in order. **MANDATORY:** For EVERY bullet generated, you must verify the following in thinking and fix before outputting:
- [x] **Character Count:** 100-210 readable chars (G24)
- [x] **Unique Phrasing:** No 3+ word phrase used 3x across resume (G15)
- [x] **Verb Category:** Correct mapping (G9), no repeats within same position
- [x] **Metric Traceability:** Metrics preserved from source (G29)

1. **Core Achievement Guardrails** (G1, G5, G11, G21, G29) - Metric traceability, plausibility, evidence
2. **Structural Integrity** (G8, G9, G12) - Headers, verb diversity, chronology
3. **Personal Project Optimization** (if Position 0) - Solo portfolio rules
4. **Specialized Logic** (G30, G33) - Personal project metrics, narrative fit
5. **Final Output Formatting** - FMT gates for headers, visuals, indicators


### Step 4: Validate Output (Stage 3 - Final Reconciliation)

**⚠️ ACTION REQUIRED:** Before delivering the final result, the agent MUST output a **Final Reconciliation Table**:

| Requirement | Actual Value | Status |
| :--- | :--- | :--- |
| Word Count | [Count] | [Pass/Fail] (350-500) |
| Min Bullets | [Count] | [Pass/Fail] (Min 2/pos) |
| Distribution | [P1-P8] | [Pass/Fail] (Max 2x5, Max 2x4) |
| Formatting | FMT/ANC/EXT| [Pass/Fail] |

**Explicit Fallback Sequence (If Word Count > 500):**
1. Identify the oldest positions (e.g., P8, P7).
2. Remove bullets from the oldest positions until word count is < 500.
3. If still over, compress bullets in recent positions without losing metrics.
4. **Re-run Stage 3 Verification.**

1. **OPEN AND READ `optimization-tools/bullet-optimizer/bo_output-validator.md`** and perform all 8 checks.
2. **Verify Terminal Recency Anchor:** Confirm the response ends with the mandatory grammar recommendation.
3. **Run ASCII Visuals:** Confirm category distribution bars are present (e.g., `Built: ████░░░░░░ (40%)`).

**If any validation check FAILS:** Do NOT deliver. Fix the issue and re-validate.

### Step 5: Return Results & Export
Provide the primary output in the chat window, then:
1.  **Environment-Aware Export:**
    - **Claude.ai Artifacts:** Use `write_to_file` to export to `/mnt/user-data/outputs/`
    - **Local Development (Claude Code, Antigravity):** Export to `./outputs/` or user's home directory
    - **Other LLM Chat Interfaces:** Provide plain text version in chat (no file export capability)
2.  **Recommendation:** Print the hard-coded terminal anchor:
    `[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM session to ensure error-free presentation.`

---

## Execution Order: "Bullet-First" Priority

When running the full "Optimize My Application" flow:
1. **First:** Generate bullets using this workflow
2. **Then:** Generate **Per-JD Professional Summary** using the "Per-JD Summary Customization" section of `ng_summary-generation.md` (lines 229-473)
   - ⚠️ This is **NOT** the "Master Summary Generation" section (which is for Resume Analysis only)
   - The per-JD summary is optimized with JD keywords and is ephemeral (not stored)

This ensures the summary is an abstraction of the bullets, not a dictation.

---

## Related Documentation
- [ADR-009: Hub-and-Spoke Bullet Generation](../../docs/decisions/ADR-009-hub-and-spoke-bullet-generation.md)
- [Logic Map: Summary vs. Bullet](../../docs/enhancements/ENH-003/logic-map.md)
- [Bullet Generation Instructions Hub](../../optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md)
- [Output Validator (Negative Checklist)](../../optimization-tools/bullet-optimizer/bo_output-validator.md)
