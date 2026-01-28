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

### Step 0: Mandatory Pre-flight Verification (CRITICAL)

**VISIBLE OUTPUT REQUIRED:** Before initializing ANY generation, the agent MUST output a "Pre-flight Guardrail Check" table **AS THE FIRST THING IN ITS RESPONSE** (visible to the user, NOT hidden in thinking).

| ID | Guardrail | Integration Status |
| :--- | :--- | :--- |
| **G1** | Metric Traceability | [ ] Referenced from history |
| **G9** | Verb Diversity | [ ] 1 category per position (5 categories: Built, Lead, Managed, Improved, Collaborate) |
| **G12** | Recency Rule | [ ] All 2020-2026 roles included |
| **G14** | Bullet Density | [ ] 3-5 bullets per pos (Rev Chrono Order) |
| **G24** | Char Limits | [ ] Max 210 readable chars per bullet |
| **G29** | Metric Presence | [ ] Data Integrity Audit (No loss from source) |
| **FMT** | Header Format | [ ] 2-line schema: `Title at Company | Dates` + `Duration: X years/months` |
| **EXT** | Plain Text Export | [ ] Target: environment-appropriate |

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

### Step 3: Execute Bullet Generation
Follow the logic hub instructions in order:
1. **Core Achievement Guardrails** (G1, G5, G11, G21, G29) - Metric traceability, plausibility, evidence
2. **Structural Integrity** (G8, G9, G12) - Headers, verb diversity, chronology
3. **Personal Project Optimization** (if Position 0) - Solo portfolio rules
4. **Specialized Logic** (G30, G33) - Personal project metrics, narrative fit
5. **Final Output Formatting** - FMT gates for headers, visuals, indicators

### Step 4: Validate Output

**⚠️ ACTION REQUIRED:** Before delivering the final result, the agent MUST:
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
