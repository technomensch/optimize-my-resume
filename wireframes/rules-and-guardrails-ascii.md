# Rules and Guardrails - ASCII Hierarchy

**Version:** 1.0 <!-- v1.0 Initial: Capturing v6.3.x Integrated Guardrails -->
**Last Updated:** 2026-01-05

---

## Overview
This wireframe displays the hierarchy of rules and guardrails that govern the Optimize-My-Resume system. These rules act as "Safety-as-Code" to ensure high-fidelity, authentic, and high-conversion resume output.

## Diagram

```text
       [ SYSTEM INPUT ]
              |
              v
+==============================+
|    LAYER 1: INTEGRITY GATES  |
| (Foundational System Safety) |
+==============================+
| [G#6] Data Loss Prevention   |--> Automatic Backup/Restore
| [G#19] Score Consistency     |--> Gaps must match %
| [G#10] Plan Consolidation    |--> Dev Workflow Safety
+==============================+
              |
              v
+==============================+
|    LAYER 2: VALIDATION CORE  |
| (Content Truth & Calibration)|
+==============================+
| [M1] Portfolio Weighting     |--> 50% discount on Projects
| [M2] Adjacent Technical      |--> No "Support" as "Engineer"
| [M3] Keyword Context         |--> "Working WITH" vs "ABOUT"
| [M4] Industry Context        |--> Transferability Matrix
| [M5] Role-Type Validation    |--> PM != BA != TW != SRE
+==============================+
              |
              v
+==============================+
|    LAYER 3: OUTPUT QUALITY   |
| (Format & UX Guardrails)     |
+==============================+
| [G#8] Budget Enforcement     |--> 100-210 Char Hard Limit
| [G#12] Freshness Priority    |--> Position 1 Recency
| [G#15] Repetition Scanner    |--> Max 2 phrase repeats
| [G#20] Acronym Spell-Out     |--> First-use expansion
| [G#22] No Em-Dash Rule       |--> Straight hyphen ONLY
+==============================+
              |
              v
      [ OPTIMIZED OUTPUT ]
```

## Guardrail Catalog

### Integrity Gate (System)
- **Data Loss Prevention (#6):** CRITICAL. Ensures LLM doesn't overwrite core logic during implementation.
- **Score Consistency (#19):** Ensures that if a user has 3+ critical gaps, the score CANNOT exceed 79%.

### Validation Core (Calibration)
- **Portfolio Weighting:** Prevents personal projects from counting as professional "Years of Experience".
- **Keyword Context:** Detects "false matches" where a candidate documented a tool but didn't build it.
- **Industry Context:** Penalizes government-to-SaaS transitions unless direct transferability is proven.

### Output Hardening (UX)
- **Character Budget:** Hard stop at 210 characters per bullet for ATS compatibility.
- **Verb Diversity:** Requires all 5 categories (Built, Lead, Managed, Improved, Collaborate) to be present.
- **Em-Dash Scanner:** Automatically converts smart/em-dashes to standard hyphens for text-only ATS systems.

## Files Referenced
- `core/fit-thresholds.md`
- `core/format-rules.md`
- `core/portfolio-weighting.md`
- `core/adjacent-technical.md`
- `core/keyword-context.md`
- `core/industry-context.md`
- `core/role-type-validation.md`
