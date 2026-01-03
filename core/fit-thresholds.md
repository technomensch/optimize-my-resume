# Fit Thresholds Configuration

**Version:** 6.3.0 <!-- v6.3.0 Change: Added Guardrail #19 Fit Assessment Score Consistency -->
**Applies to:** All Phases

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

### Category-Level Weights

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

### Skill-Level Priority Weights (v6.1.9)

Based on industry ATS scoring best practices (Rezi.ai, Jobscan, Recruiterflow):

```xml
<skill_priority_scoring>
  <!-- 3:2:1 Priority Model -->
  <required_skills priority="3" weight="1.5x">
    Skills explicitly marked as "Required", "Must have", or "Essential"
    Missing a required skill has 1.5x the negative impact of missing a preferred skill
  </required_skills>

  <preferred_skills priority="2" weight="1.0x">
    Skills marked as "Preferred", "Nice to have", or "Bonus"
    Baseline weight for gap calculations
  </preferred_skills>

  <optional_skills priority="1" weight="0.5x">
    Skills mentioned but not emphasized, inferred from context
    Half the impact of preferred skills
  </optional_skills>
</skill_priority_scoring>
```

**Example Calculation:**

| Skill | Status | Priority | Impact |
|-------|--------|----------|--------|
| Python (Required) | MISSING | 3 | -15 points |
| SQL (Required) | MATCHED | 3 | +15 points |
| AWS (Preferred) | MISSING | 2 | -10 points |
| Kubernetes (Optional) | MISSING | 1 | -5 points |

**Sources:**
- Rezi.ai ATS Resume Checker (3:2:1 priority scoring)
- Recruiterflow: "10% change in weighting can shift scores by 5-8 points"
- Jobscan: 80% match rate target for resume optimization

---

## Decision Tree Summary

| Fit % | Action | Output Type | Token Usage |
|-------|--------|-------------|-------------|
| **90-100%** | Proceed immediately | Full bullet generation | HIGH |
| **80-89%** | Ask user about gaps | Full investigation + bullets if proceed | MEDIUM-HIGH |
| **75-79%** | Stop with brief summary | Brief exit (~150-250 words) | LOW |
| **≤74%** | Stop with ultra-brief | Ultra-brief exit (~50-100 words) | MINIMAL |

---

## Fit Assessment Quality Gates (Guardrails)

### Guardrail #19: Fit Assessment Score Consistency

> **Implementation Target:** Add to [fit-thresholds.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/fit-thresholds.md).

**Instruction Text:**
```xml
<fit_score_consistency_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Ensure the calculated fit percentage matches the volume and severity of identified gaps.
  </instruction>
  
  <validation_logic>
    BEFORE outputting final score, count the following:
    - critical_gaps_count = (number of Required/Must-have skills missing)
    - preferred_gaps_count = (number of Preferred/Nice-to-have skills missing)
    
    APPLY "Consistency Check":
    IF critical_gaps_count >= 3:
      score MUST be <= 79% (Stop Tier)
    IF critical_gaps_count == 2:
      score MUST be <= 85% (Good/Ask Tier)
    IF critical_gaps_count == 0 AND preferred_gaps_count <= 2:
      score SHOULD be >= 90% (Excellent Tier)
      
    IF score conflicts with gap counts:
      RECALCULATE using Scoring Methodology weights (50/30/20) and 3:2:1 model.
  </validation_logic>
  
  <output_requirement>
    Provide a "Score Justification" block in internal thinking:
    "Score [X]% justified by [N] critical matches vs [M] gaps."
  </output_requirement>
</fit_score_consistency_guardrail>
```

---

## Usage Notes

- These thresholds are used in Mode 3 (JD Comparison) Phase 1
- Thresholds prevent token waste on poor-fit applications
- User cannot override stop decisions for ≤79% fits
