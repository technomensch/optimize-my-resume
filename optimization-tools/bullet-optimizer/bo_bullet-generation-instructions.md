# Bullet Generation Protocol - Logic Hub

**Version:** 9.3.2.1
**Date:** 2026-01-28
**Purpose:** Centralized logic for generating high-impact, verifiable resume bullets for solo W2 roles and complex portfolio projects.
**Source of Truth:** This file is the "Hub" referenced by ADR-009.

---

<workflow_disambiguation>
  <this_workflow>
    Bullet Generation + Professional Summary (Per-JD Customization).
    Triggered by "Optimize My Application" after JD comparison.
    Generates optimized bullets AND customized professional summary.
  </this_workflow>
  <not_this_workflow>
    If user just completed Resume Analysis and has NO target JD:
    STOP. Route to: optimization-tools/narrative-generator/ng_summary-generation.md (for Master Summary only).
    This workflow requires a JD for keyword optimization.
  </not_this_workflow>
</workflow_disambiguation>

---

## 1. Core Achievement Guardrails

### [G1] Metric Traceability
For every numeric metric or specific achievement, perform an internal "source-check":
1. Identify the **Position ID (N)** being drafted.
2. Scan ONLY the source data for Position N.
3. **Hallucination Prevention:** If the metric appears in any other position but NOT in Position N, it is a HALLUCINATION. Do not use it.
4. Citation: Internally note [Metric X traced to Position N].

### [G20] Acronym Expansion (Step 1.1 - Pre-draft)
Before drafting, generate an internal "Acronym Inventory":
1. List all domain-specific acronyms used (e.g., NIST, RBAC, RACI).
2. Identify the FIRST position/occurrence where the acronym appears.
3. **MANDATORY:** Spell out the acronym in full followed by the abbreviation in parentheses at that first occurrence (e.g., `Role-Based Access Control (RBAC)`).
4. Subsequent occurrences may use the abbreviation only.

### [G5/G21] Limitation Visibility (Pre-flight Audit)
Check `honest_limitations` and `honest_limitations_evidence` **BEFORE** recommending bullets for each position.
1. **Mandatory Step 0 Audit:** The agent MUST verify limitations for every position in the visible "Pre-flight Guardrail Check" table (Step 0 of the workflow).
2. **Logic:** 
   - IF generated_bullet mentions [Skill X] AND `<honest_limitations>` contains "No experience with [Skill X]":
     - FLAG as CONTRADICTION.
     - Remove the claim or rephrase to match the limitation (e.g., "exposed to" instead of "expert in").
3. **Purpose:** This prevents "Hidden Over-claiming" and ensures the narrative is defensible.

### [G11] Metric Plausibility (Logic Filter)
Apply common-sense validation to numeric claims BEFORE delivering.
1. **Currency Symbols:** EVERY dollar amount MUST include the `$` symbol (e.g., `$10M` not `10M`).
2. **Logic Verification:** 
   - All percentages must be 0-100%.
   - Time reduction claims (e.g., "saved 4 hours") must be backed by a "Before/After" context in the source.
3. **MANDATORY:** Include this logic check in the Step 0 "Data Integrity Audit" to prevent illogical or malformatted metric claims.


### [G29] Metric Preservation / Data Integrity Audit
When rewriting or optimizing existing bullets for keywords:
1. **Audit Logic (Step 0):** BEFORE drafting the final bullet, the agent MUST perform a visible "Data Integrity Audit" in its internal thinking or as a prefatory note:
   - `Original Metrics: [List every integer, %, $, duration from source]`
   - `Target Metrics: [Verify ALL are present in the planned draft]`
2. **Comparison:** Ensure ALL original metrics are retained in the NEW bullet unless explicitly replaced by a superior validated metric.
3. **Restoration:** If a metric is lost during rewriting, restore it immediately. **Zero-tolerance for metric loss.**

---

## 2. Structural Integrity

### [G8] Budget Enforcement
- **Per-Bullet Length:** 100-210 characters. No exceptions.
- **Total Word Count (500-Word Hard Cap):** The total output (all bullets) MUST be 350-500 words.
- **Enforcement Logic:** Count words before delivering. If `total_words > 500`, you MUST remove the last bullet point from each position, starting with the oldest (Position 8) and moving forward (Position 7, 6, etc.), until the total is under 500.

### [G9] Verb Diversity
- No verb category (Built, Lead, Managed, Improved, Collaborate) may be used more than once within a single position.
- **Exception:** If a position has 5+ bullets, allow ONE category to repeat.

### [G12] Recency Weighting
Allocate bullets based on position recency and JD relevance:
- **Position 1 (most recent):** Minimum 3 bullets, at least 2 quantified.
- **Positions 4+:** Maximum 2 bullets.

---

## 3. Personal Project Optimization (Position 0)

### Synthetic Metric Attribution
For solo portfolio projects (where traditional "team management" or "revenue" metrics are unavailable), shift focus to **Architectural Robustness** and **Knowledge Management**.

**Prioritize these "True Path" metrics:**
- **Automated Guardrails:** Number of checks/rules built (e.g., "Implemented 32+ automated guardrails").
- **Custom Skills:** Number of modular AI extensions (e.g., "Architected 13 custom AI skills").
- **Documentation Density:** Number of source-of-truth documents (e.g., "Authored 53 domain-specific MD files").
- **Release Velocity:** Number of feature releases or PRs (e.g., "Maintained 47 releases in 5 weeks").

### Verb Sensitivity (Solo Work)
Avoid "Corporate Defaultism" verbs that imply a team structure for individual initiatives.
- ❌ **Directed / Managed / Led Team**
- ✅ **Spearheaded / Architected / Implemented / Engineered**

---

## 4. Specialized Logic

### [G30] Industry & Role Tuning
- **Technical Roles:** Emphasize keywords and system-level impact.
- **Leadership Roles:** Emphasize "Strategic Decisions" and "Team Scope" (even if the team is "AI agents" for solo projects).

### [G33] Narrative Fit Audit
After generating bullets, perform a self-audit:
1. **Gap Check:** Ensure the top 3 hard requirements from the JD are addressed by at least one bullet.
2. **Level Match:** Verify the collective narrative aligns with the target role seniority (e.g., Senior vs. Staff).
3. **Gap Reporting:** If a key requirement cannot be addressed with evidence, flag it as a "Narrative Gap" in optimization notes.

---

## 5. Final Output Formatting (Execution Gates)

**PREREQUISITE:** Before delivering content, the agent MUST pass the validation checklist in `optimization-tools/bullet-optimizer/bo_output-validator.md`.

### [FMT] Position Header Schema
Every position MUST transition with the following two-line header:
```
[Job Title] at [Company] | [Start Date]-[End Date]
Duration: [X years/months]
```

### [FMT] Action Verb Visuals
Include an ASCII distribution summary at the end of the bullet set for each position or as a summary table:
`Built: ████░░░░░░ (40%)`

### [FMT] Bullet Display Indicator
Ensure the explicit display tags are used, always prefixed with a Markdown bullet (`- `) for list rendering:
- `- ✓ [Has Metrics] [[Category]] [Verb] [remainder]`
- `- - [No Metrics] [[Category]] [Verb] [remainder]`

### [FMT] Symbol & Spacing Guardrail (G22)
- **Zero Em-dash Policy:** NEVER use em-dashes (`—`) in resume bullets. Use hyphens (`-`) or rephrase.
- **Hyphenation Rule:** Use hyphens without spaces for compound adjectives (e.g., `multi-agent`, `cross-functional`).
- **No Spaced Hyphens:** 
  - **Inside Sentences:** Avoid ` - ` pattern; use tight hyphens for adjectives.
  - **Date Ranges:** Use tight hyphens `[Start]-[End]` (e.g., `Jan 2023-Present`). Spaced hyphens in ranges are a FAIL.

### [FMT] Terminal Recency Anchor (THE SYSTEM CLOSER)
The output MUST conclude with exactly this hard-coded recommendation:
"[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM session to ensure error-free presentation."

---

## Version History
- **9.3.5 (2026-01-28):** Hardened formatting gates and added bo_output-validator reference. <!-- issue-85 fix -->
- **9.3.2.1 (2026-01-28):** Added G5, G11, G12, G21 to complete guardrail consolidation.
- **9.3.2 (2026-01-28):** Initial creation with G1, G8, G9, G29, G30, G33.

---

**Related Decisions:**
- [ADR-009: Hub-and-Spoke Bullet Generation](../../docs/decisions/ADR-009-hub-and-spoke-bullet-generation.md)
- [LL_Personal_Project_Metrics](../../docs/lessons-learned/process/LL_Personal_Project_Metrics.md)
