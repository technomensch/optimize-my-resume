# Bullet Generation Protocol - Logic Hub

**Version:** 9.3.2.1
**Date:** 2026-01-28
**Purpose:** Centralized logic for generating high-impact, verifiable resume bullets for solo W2 roles and complex portfolio projects.
**Source of Truth:** This file is the "Hub" referenced by ADR-009.

---

## 1. Core Achievement Guardrails

### [G1] Metric Traceability
For every numeric metric or specific achievement, perform an internal "source-check":
1. Identify the **Position ID (N)** being drafted.
2. Scan ONLY the source data for Position N.
3. **Hallucination Prevention:** If the metric appears in any other position but NOT in Position N, it is a HALLUCINATION. Do not use it.
4. Citation: Internally note [Metric X traced to Position N].

### [G5] Limitation Enforcement
Before finalizing any bullet, cross-reference the `<honest_limitations>` section of the target Position.
- IF generated_bullet mentions [Skill X] AND `<honest_limitations>` contains "No experience with [Skill X]":
  - FLAG as CONTRADICTION.
  - Remove the claim or rephrase to match the limitation (e.g., "exposed to" instead of "expert in").

### [G11] Metric Plausibility
Apply common-sense validation to numeric claims before output:
- **Percentage Range:** All percentages must be 0-100%.
- **Time Savings:** Time reduction claims must show valid before/after.
- **Team Size Consistency:** Team size should be consistent with role level.
- **Currency Format:** All currency values must include `$` symbol.

### [G21] Limitation Bullet Cross-Check (Pre-flight)
Check `honest_limitations` **BEFORE** recommending bullets for each position. This prevents wasted generation cycles.

### [G29] Metric Preservation
When rewriting or optimizing existing bullets for keywords:
1. **Audit Logic:** Extract all numeric values (integers, percentages, currency) from the ORIGINAL bullet.
2. **Comparison:** Ensure ALL original metrics are retained in the NEW bullet unless explicitly replaced by a superior validated metric.
3. **Restoration:** If a metric is lost during rewriting, restore it immediately.

---

## 2. Structural Integrity

### [G8] Budget Enforcement
- **Per-Bullet Length:** 100-210 characters. No exceptions.
- **Total Word Count:** 350-500 words across all bullets. If exceeded, reduce bullets from oldest positions first.

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

## 5. Final Output Formatting

- **Verb Category:** Every bullet must start with a category-aligned action verb.
- **Metric Indicator:** Use `✓` for quantified bullets and `-` for qualitative ones (where applicable by UI).
- **Date Format:** "Month Year" or "Present".
- **ATS Optimization:** Include 8-12 unique JD keywords across all bullets, with no more than 3 per bullet.

---

## Version History
- **9.3.2.1 (2026-01-28):** Added G5, G11, G12, G21 to complete guardrail consolidation.
- **9.3.2 (2026-01-28):** Initial creation with G1, G8, G9, G29, G30, G33.

---

**Related Decisions:**
- [ADR-009: Hub-and-Spoke Bullet Generation](../../docs/decisions/ADR-009-hub-and-spoke-bullet-generation.md)
- [LL_Personal_Project_Metrics](../../docs/lessons-learned/process/LL_Personal_Project_Metrics.md)
