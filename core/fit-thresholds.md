# Fit Thresholds Configuration

**Version:** 9.3.5  
**Applies to:** Resume Analysis & Job Fit Analyzer

---

## Fit Threshold Definitions

<!-- part of v7.1 issue #33 -->
<fit_thresholds_updated>
  <thresholds>
    <excellent range="85-100%">
      <action>Proceed automatically to bullet generation</action>
      <messaging>Excellent match - proceed with confidence</messaging>
    </excellent>
    
    <good range="75-84%">
      <action>Flag minor gaps, ask user for strategic differentiators</action>
      <messaging>Good match - competitive if you highlight differentiators</messaging>
      <clarification>
        Present gap summary and ask:\n        "What makes you a unique fit for this role despite these minor gaps?"
      </clarification>
    </good>
    
    <moderate range="65-74%">
      <action>Ask user if they have differentiator skill or strategic advantage</action>
      <messaging>Moderate match - competitive IF you have unfair advantage</messaging>
      <clarification>
        Present gap summary and ask:\n        "Do you have expertise in [RARE SKILL X] or [CRITICAL REQUIREMENT Y] \n        that would make you stand out despite these gaps?"
      </clarification>
    </moderate>
    
    <weak range="55-64%">
      <action>Brief exit summary (150-250 words)</action>
      <messaging>Weak match - only apply if perfect culture fit or internal referral</messaging>
    </weak>
    
    <poor range="0-54%">
      <action>Ultra-brief exit summary (50-100 words)</action>
      <messaging>Poor match - focus efforts elsewhere</messaging>
    </poor>
  </thresholds>
  
  <threshold_rationale>
    Changed from 90/80/75/74 to 85/75/65/55 because:
    - Acknowledges JDs are inflated (~30% above actual requirements)
    - Reduces false negatives (skipping good opportunities)
    - Better aligns with real-world hiring manager expectations
    - Accounts for strategic positioning value
  </threshold_rationale>
</fit_thresholds_updated>

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

| Fit % | Action | Messaging | Token Usage |
|-------|--------|-----------|-------------|
| **85-100%** | Proceed immediately | Excellent match - proceed with confidence | HIGH |
| **75-84%** | Ask user about gaps | Good match - competitive with differentiators | MEDIUM-HIGH |
| **65-74%** | Ask about unfair advantage | Moderate match - competitive with advantage | MEDIUM |
| **55-64%** | Stop with brief summary | Weak match - apply only if culture/referral | LOW |
| **0-54%** | Stop with ultra-brief | Poor match - focus efforts elsewhere | MINIMAL |

---

## Strategic Assessment Rules (v7.1.0)

<!-- part of v7.1 issue #33 -->
<real_world_hiring_context>
  <priority>MODERATE</priority>
  <principles>
    <principle id="jd_inflation">JDs are ~30% inflated. 70% match is competitive.</principle>
    <principle id="rare_over_common">Rare skills > Years of common experience.</principle>
    <principle id="transferable_foundations">Technical foundations (tools, workflows) transfer near-perfectly.</principle>
  </principles>
</real_world_hiring_context>

<!-- part of v7.1 issue #33 -->
<strategic_rare_skill_override>
  <instruction>Apply override for rare required skills (<20% prevalence).</instruction>
  <logic>Portfolio weight 50%→100%; reduced industry penalty; +15 competitive bonus.</logic>
</strategic_rare_skill_override>

<!-- part of v7.1 issue #33 -->
<deliverables_over_titles_rule>
  <statement>Prioritize impact/deliverables over job titles.</statement>
  <implication>Reduce role_type_gap penalty by 5-10 points for high-impact deliverables.</implication>
</deliverables_over_titles_rule>

<!-- part of v7.1.1 issue #34 -->
<technical_role_exception>
  <logic>
    Code is code. Tools are tools.
    IF the role is heavily technical (Technical Writer, Developer, DevOps) AND the toolset matches (e.g., Git, Azure, Jira),
    THEN reduce Industry Gap Penalty by 75%.
  </logic>
</technical_role_exception>

---

## Fit Assessment Quality Gates (Guardrails)

### Guardrail #19: Fit Assessment Score Consistency

> **Implementation Target:** Add to [fit-thresholds.md](core/fit-thresholds.md).

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

## Validation Penalties (v6.3.1)

The following penalties are applied to raw fit scores to account for validation rule violations:

```xml
<validation_penalties>
  <penalty id="portfolio_inflation">
    <trigger>Portfolio project experience counted toward role requirements</trigger>
    <adjustment>-15 to -25 points depending on weight given</adjustment>
    <message>"Portfolio projects provide skill evidence but don't count as 
    professional [role type] experience."</message>
  </penalty>
  
  <penalty id="adjacent_technical_misclassification">
    <trigger>Technical-adjacent role (TW, BA, PM) counted as "adjacent technical"</trigger>
    <adjustment>-10 to -20 points</adjustment>
    <message>"Writing ABOUT technical systems ≠ working IN technical systems."</message>
  </penalty>
  
  <penalty id="documentation_false_positive">
    <trigger>Documentation experience matched to hands-on technical requirement</trigger>
    <adjustment>-5 to -15 points per false match</adjustment>
    <message>"Documentation of [technology] ≠ hands-on [technology] experience."</message>
  </penalty>
  
  <penalty id="industry_mismatch">
    <trigger>Candidate industry doesn't match JD industry</trigger>
    <adjustment>See industry_context_validation transferability matrix</adjustment>
    <message>"Your [industry] background has [X%] transferability to [JD industry]."</message>
  </penalty>
  
  <penalty id="role_type_gap">
    <trigger>Insufficient direct experience in target role type</trigger>
    <adjustment>-10 to -30 points based on gap severity</adjustment>
    <message>"Senior [role] requires ~X years. You have Y direct + Z transferable."</message>
  </penalty>
</validation_penalties>
```

---

## Score Calculation Order (v6.3.1)

Fit scores must be calculated in this specific order to ensure validation rules are properly applied:

```xml
<calculation_order>
  <step order="1">Calculate raw score from requirements matching</step>
  <step order="2">Apply portfolio_project_weighting rules</step>
  <step order="3">Apply adjacent_technical_definition validation</step>
  <step order="4">Apply keyword_context_validation (remove false positives)</step>
  <step order="5">Apply industry_context_validation penalty</step>
  <step order="6">Apply role_type_experience_validation penalty</step>
  <step order="7">Final score = Raw score - All penalties</step>
</calculation_order>
```

**Reference Files:**
- `core/portfolio-weighting.md` - Portfolio project rules
- `core/adjacent-technical.md` - Technical role definitions
- `core/keyword-context.md` - Context validation rules
- `core/industry-context.md` - Industry transferability
- `core/role-type-validation.md` - Role-type assessment

---

## Usage Notes

- These thresholds are used in Job Fit Analyzer (Initial Assessment)
- Thresholds prevent token waste on poor-fit applications
- User cannot override stop decisions for ≤79% fits

---

## Version History

- v7.1.0 (January 12, 2026): Strategic Assessment Methodology (Issue #33)
  - Updated fit thresholds (85/75/65/55) to account for JD inflation
  - Added Strategic Rare Skill Override logic
  - Added Deliverables Over Titles Rule
  - Added Technical Skills Transferability Exception
  - Integrated Real-World Hiring Context principles
- v6.3.1 (January 4, 2026): Added validation penalties and calculation order
  - Added 5 validation penalty types for new v6.3.1 rules
  - Added 7-step calculation order for proper penalty application
  - Added references to 5 new core validation modules
- v6.3.0 (January 3, 2026): Added Guardrail #19 - Fit Assessment Score Consistency
- v6.1.9 (December 2025): Added Skill-Level Priority Weights (3:2:1 Model)
- v6.0.0 (Initial): Fit threshold definitions and scoring methodology
