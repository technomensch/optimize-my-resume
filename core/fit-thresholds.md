# Fit Thresholds Configuration

<!-- Version: 5.0 -->
<!-- Purpose: Define fit percentage thresholds for Mode 3 (JD Comparison) -->
<!-- Last Updated: December 2024 -->

---

## Fit Threshold Definitions

```xml
<fit_thresholds>
  <tier name="excellent" range="90-100%">
    <action>Proceed to bullet generation automatically</action>
    <rationale>Strong match, user should apply</rationale>
  </tier>
  
  <tier name="good" range="80-89%">
    <action>FLAG gaps and ASK user (proceed to Phase 2 - Full Gap Investigation)</action>
    <rationale>Moderate fit with addressable gaps</rationale>
  </tier>
  
  <tier name="weak" range="75-79%">
    <action>STOP with BRIEF SUMMARY (skip to Phase 3A - Brief Exit Output)</action>
    <rationale>Weak match, not worth detailed investigation</rationale>
    <no_user_override>Do not offer to generate bullets anyway</no_user_override>
  </tier>
  
  <tier name="poor" range="0-74%">
    <action>STOP with ULTRA-BRIEF SUMMARY (skip to Phase 3B - Ultra-Brief Exit Output)</action>
    <rationale>Poor match, fundamental mismatch</rationale>
    <no_user_override>Do not offer to generate bullets anyway</no_user_override>
  </tier>
</fit_thresholds>
```

---

## Scoring Methodology

```xml
<scoring_methodology>
  <core_qualifications weight="50%">
    - Required qualifications match
    - Years of experience alignment
    - Role type match (BA, TW, PM, etc.)
  </core_qualifications>
  
  <critical_requirements weight="30%">
    - Domain expertise requirements
    - Specialized platforms/technologies
    - Industry experience
  </critical_requirements>
  
  <preferred_qualifications weight="20%">
    - Nice-to-have skills
    - Bonus certifications
    - Additional technologies
  </preferred_qualifications>
</scoring_methodology>
```

---

## Decision Tree Summary

| Fit % | Action | Output Type | Token Usage |
|-------|--------|-------------|-------------|
| **90-100%** | Proceed immediately | Full bullet generation | HIGH |
| **80-89%** | Ask user about gaps | Full investigation + bullets if proceed | MEDIUM-HIGH |
| **75-79%** | Stop with brief summary | Brief exit (~150-250 words) | LOW |
| **≤74%** | Stop with ultra-brief | Ultra-brief exit (~50-100 words) | MINIMAL |

---

## Usage Notes

- These thresholds are used in Mode 3 (JD Comparison) Phase 1
- Thresholds prevent token waste on poor-fit applications
- User cannot override stop decisions for ≤79% fits
