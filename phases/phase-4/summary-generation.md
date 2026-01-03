# Professional Summary Generation Protocol - Phase 4

**Version:** 1.2.0 <!-- v1.2.0 Change: Added Guardrails #3, #13, #15, #26 -->
**Created:** 2025-12-28
**Purpose:** Generate professional summaries (master + per-JD customization)

---

## Overview

This protocol generates two types of professional summaries:

1. **Master Summary** - Comprehensive, stored in job history v2.0
   - Created during Phase 1 (job history creation)
   - Aggregates entire career
   - Used as baseline for customization

2. **Per-JD Summary** - Customized, ephemeral (not stored)
   - Generated during Phase 3 (JD comparison)
   - Optimized with JD-specific keywords
   - User copies to their resume for that application

**Key Features:**
- Evidence-based (pulls from actual achievements)
- Quantified metrics (team size, revenue, users)
- Keyword-optimized (for ATS)
- Maintains authenticity (only includes demonstrated skills)

---

## Master Summary Generation (Phase 1)

### Trigger

After Phase 1 extracts all positions, before saving job history v2.0:

```
Position extraction complete → Aggregate career data → Generate master summary → Save to job history
```

---

### Structure (3-4 Sentences)

```
Sentence 1: Role + Scope
  - Current or most recent title
  - Years of experience
  - Industry/domain

Sentence 2: Achievements + Metrics
  - Quantified results across career
  - Impact (revenue, users, efficiency)
  - Scale (team size, budget)

Sentence 3: Hard Skills
  - 2-3 technical/measurable skills
  - Drawn from aggregated hard_skills_demonstrated

Sentence 4 (optional): Soft Skills
  - 1-2 interpersonal/behavioral skills
  - Drawn from aggregated soft_skills_demonstrated
```

---

### Data Aggregation

Before generating summary, collect:

```
AGGREGATE_DATA = {
  // Career metadata
  total_years: Calculate from all position date ranges,
  total_positions: positions.length,
  industries: Extract unique industries from all positions,
  companies: Extract unique companies (prioritize well-known brands),

  // Titles
  current_title: positions[0].job_title (most recent),
  highest_title: Determine highest level (Lead, Senior, VP, etc.),

  // Achievements
  top_achievements: Select 2-3 most impressive achievements with metrics,
  total_revenue_impact: Sum all revenue metrics across achievements,
  total_cost_savings: Sum all cost saving metrics,
  max_team_size: Max of all team_scope values,
  max_users_impacted: Max of all user metrics,

  // Skills
  top_hard_skills: Select 2-3 most frequently mentioned hard skills,
  top_soft_skills: Select 1-2 most frequently mentioned soft skills,

  // Recognition
  notable_companies: Filter for Fortune 500, FAANG, well-known brands,
  awards: Extract from awards_recognition fields (if present)
}
```

---

### Selection Criteria

#### Top Achievements (select 2-3):

```
SCORING_FACTORS = {
  has_quantified_metric: +3 points,
  revenue_impact: +2 points,
  cost_savings: +2 points,
  scale_of_impact: +2 points (users, team size, budget),
  recency: +1 point (current role),
  company_recognition: +1 point (well-known brand)
}

achievements.sort_by_score()
selected = achievements[0:2]  // Top 2 achievements
```

#### Top Hard Skills (select 2-3):

```
FREQUENCY = count occurrences across all positions
RECENCY = bonus for skills in current role
RELEVANCE = bonus for skills in multiple positions

hard_skills.sort_by(frequency * recency * relevance)
selected = hard_skills[0:3]  // Top 3 skills
```

---

### Generation Examples

#### Example 1: Product Manager

**Input data:**
```
- Current title: Senior Product Manager
- Total experience: 8 years
- Companies: Google, Salesforce, StartupCo
- Top achievement 1: "Launched 12 revenue-generating features ($5M ARR)"
- Top achievement 2: "Managed roadmap for 500K+ users"
- Team size: max 12
- Top hard skills: Agile, JIRA, SQL
- Top soft skills: Stakeholder management, Leadership
```

**Generated summary:**
```
Senior Product Manager with 8 years leading B2B SaaS products at Google and Salesforce. Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users, and led cross-functional teams of 10+. Expert in Agile methodologies, JIRA, SQL, and data-driven prioritization. Known for exceptional stakeholder communication and ability to translate technical concepts for executive audiences.
```

---

#### Example 2: Data Engineer

**Input data:**
```
- Current title: Senior Data Engineer
- Total experience: 6 years
- Companies: TechCorp, DataCo
- Top achievement 1: "Built data pipelines processing 10M+ records daily"
- Top achievement 2: "Reduced ETL runtime by 65% (4.2hrs → 1.5hrs)"
- Team size: max 5
- Top hard skills: Python, SQL, AWS
- Top soft skills: Collaboration, Problem-solving
```

**Generated summary:**
```
Senior Data Engineer with 6 years building scalable data infrastructure. Built data pipelines processing 10M+ records daily and reduced ETL runtime by 65% (4.2hrs → 1.5hrs) through optimization. Proficient in Python, SQL, AWS (EC2, S3, Lambda), and distributed computing frameworks. Strong collaborator who bridges technical and business teams to deliver data solutions.
```

---

#### Example 3: Software Engineer

**Input data:**
```
- Current title: Staff Software Engineer
- Total experience: 10 years
- Companies: Google, Amazon, Microsoft
- Top achievement 1: "Architected microservices platform serving 1M+ requests/sec"
- Top achievement 2: "Led migration to Kubernetes reducing infrastructure costs by $2M/year"
- Team size: max 8
- Top hard skills: Java, Kubernetes, AWS
- Top soft skills: Technical leadership, Mentoring
```

**Generated summary:**
```
Staff Software Engineer with 10 years at Google, Amazon, and Microsoft building high-scale distributed systems. Architected microservices platform serving 1M+ requests/sec and led Kubernetes migration reducing infrastructure costs by $2M/year. Deep expertise in Java, Kubernetes, AWS, and system design patterns. Technical leader who mentors engineers and drives architectural decisions across teams.
```

---

### Storage

Save to job history v2.0:

```
job_history_v2.0 = {
  schema_version: "2.0.0",
  personal_info: {...},
  master_summary: "[Generated summary text]",
  positions: [...],
  ...
}

SAVE: claude_generated_job_history_summaries_v2.txt
```

---

### Progress Indicators (Decision 10)

```
Display during generation (no time estimates):

"Generating professional summary..."
"Aggregating career metrics..."
"Selecting key achievements..."
"Done. Summary added to job history."
```

---

## Per-JD Summary Customization (Phase 3)

### Trigger

After Phase 3 gap analysis completes:

```
IF match_score >= 50:
  ASK: "Would you like me to generate a customized professional summary for this JD?"

  IF user says "yes":
    → Generate per-JD summary

ELSE:
  → Skip (too many gaps, customization won't help)
```

---

### Timing (Decision from v6.0.4 plan)

Generate **AFTER** gap analysis (not before) because:
- Summary can leverage gap insights
- Can optimize keyword placement based on what's missing
- More strategic customization

---

### Customization Logic

#### Step 1: Load Master Summary

```
LOAD: job_history_v2.0.master_summary

base_summary = master_summary

// Parse into components
components = {
  role_scope: sentence 1,
  achievements: sentence 2,
  hard_skills: sentence 3,
  soft_skills: sentence 4 (if present)
}
```

---

#### Step 2: Extract JD Keywords

Focus on **PARTIAL** skills (evidence exists but keyword missing):

```
jd_keywords = []

FOR (requirement of gap_analysis) {
  IF (requirement.status === "Partial" AND requirement.subcategory === "Skills Needed") {
    jd_keywords.push(requirement.requirement)
  }
}

// Limit to top 3-5 keywords
jd_keywords = jd_keywords.slice(0, 5)

// Fallback: If no partial skills, use matched skills
IF (jd_keywords.length === 0) {
  jd_keywords = gap_analysis
    .filter(r => r.status === "Matched" AND r.subcategory === "Skills Needed")
    .slice(0, 3)
    .map(r => r.requirement)
}
```

---

#### Step 3: Replace Generic Hard Skills with JD-Specific Keywords

```
ORIGINAL hard_skills sentence:
  "Expert in Agile methodologies, JIRA, SQL, and data-driven decision-making"

JD_KEYWORDS (from gap analysis):
  ["Python", "AWS", "Kubernetes"]

STRATEGY:
  - Keep structure and soft skills unchanged
  - Replace first 2-3 hard skills with JD keywords
  - Keep 1-2 original skills if they're also in JD

CUSTOMIZED hard_skills sentence:
  "Expert in Python, AWS cloud architecture, Kubernetes orchestration, and data-driven decision-making"

RATIONALE:
  - "Agile" → Removed (not in JD)
  - "JIRA" → Removed (not in JD)
  - "SQL" → Removed (not in JD)
  - Added "Python", "AWS", "Kubernetes" (from JD keywords)
  - Kept "data-driven decision-making" (general, not tool-specific)
```

---

#### Step 4: Add JD-Specific Industry/Domain Terms

```
IF jd.industry_domain in ["Fintech", "Healthcare", "E-commerce", "SaaS", "Enterprise"]:
  ADD domain mention to role_scope sentence

ORIGINAL role_scope:
  "Senior Product Manager with 8 years leading B2B SaaS products at Google and Salesforce."

JD industry: "Fintech"

CUSTOMIZED role_scope:
  "Senior Product Manager with 8 years leading B2B SaaS products in fintech and enterprise software at Google and Salesforce."
```

---

#### Step 5: Maintain Metrics and Achievements

**Do NOT change:**
- Quantified results (team size, revenue, users)
- Specific achievements
- Company names
- Years of experience

**These are factual and must remain accurate.**

```
ORIGINAL achievements:
  "Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users"

CUSTOMIZED achievements:
  [SAME - do not change metrics]
  "Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users"
```

---

### Customization Examples

#### Example 1: Product Manager → Fintech Role

**Master Summary:**
```
Senior Product Manager with 8 years leading B2B SaaS products at Google and Salesforce. Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users, and led cross-functional teams of 10+. Expert in Agile methodologies, JIRA, SQL, and data-driven prioritization. Known for exceptional stakeholder communication and ability to translate technical concepts for executive audiences.
```

**JD Keywords:** ["Python", "AWS", "Fintech"]

**Customized Summary:**
```
Senior Product Manager with 8 years leading B2B SaaS products in fintech and enterprise software at Google and Salesforce. Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users, and led cross-functional teams of 10+. Expert in Python-based analytics, AWS cloud infrastructure, data-driven prioritization, and product-led growth strategies. Known for exceptional stakeholder communication and ability to translate technical concepts for executive audiences.
```

**Changes:**
- Added "in fintech and enterprise software" (domain)
- "Agile methodologies, JIRA, SQL" → "Python-based analytics, AWS cloud infrastructure" (JD keywords)
- Kept achievements unchanged
- Kept soft skills unchanged

---

#### Example 2: Data Engineer → ML Platform Role

**Master Summary:**
```
Senior Data Engineer with 6 years building scalable data infrastructure. Built data pipelines processing 10M+ records daily and reduced ETL runtime by 65% (4.2hrs → 1.5hrs) through optimization. Proficient in Python, SQL, AWS (EC2, S3, Lambda), and distributed computing frameworks. Strong collaborator who bridges technical and business teams to deliver data solutions.
```

**JD Keywords:** ["Machine Learning", "Kubernetes", "TensorFlow"]

**Customized Summary:**
```
Senior Data Engineer with 6 years building scalable data infrastructure for machine learning platforms. Built data pipelines processing 10M+ records daily and reduced ETL runtime by 65% (4.2hrs → 1.5hrs) through optimization. Proficient in Python, Kubernetes orchestration, TensorFlow pipelines, and distributed computing frameworks. Strong collaborator who bridges technical and business teams to deliver ML-powered data solutions.
```

**Changes:**
- Added "for machine learning platforms" (domain context)
- "SQL, AWS (EC2, S3, Lambda)" → "Kubernetes orchestration, TensorFlow pipelines" (JD keywords)
- "data solutions" → "ML-powered data solutions" (domain terminology)
- Kept achievements unchanged
- Kept soft skills unchanged

---

### Output Format

```
========================================
PROFESSIONAL SUMMARY - CUSTOMIZED FOR THIS JD
========================================

[Company] | [Job Title]

[Customized summary text - 3-4 sentences]

---

CHANGES MADE:
✓ Added JD keywords: "Python", "AWS", "Kubernetes"
✓ Emphasized cloud architecture experience (from "Managed AWS deployments" achievement)
✓ Added fintech domain context
✓ Retained leadership scope and metrics

---

IMPORTANT: This summary is optimized for this specific JD. Copy it to your resume for this application.

Do NOT use this summary for other applications - use your master summary or generate a new customized summary for each JD.

---
[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM before pasting these bullets into your final resume and submitting. <!-- v1.1.0 Change: Added mandatory secondary grammar check warning -->

========================================
```

---

## Edge Cases & Error Handling

### Case 1: Missing Master Summary

**Problem:** Job history v2.0 exists but master_summary field is empty

**Solution:**
```
Generate from scratch using all positions:
  1. Aggregate career data
  2. Generate summary following master summary protocol
  3. SAVE to job history
  4. CONFIRM: "I generated a master summary and saved it to your job history."
```

---

### Case 2: Low Match Score (<50)

**Problem:** User wants per-JD summary but match score is too low

**Solution:**
```
DO NOT offer per-JD summary customization.

REASONING:
  "Your match score is [score]/100 for this JD. There are significant gaps that
   keyword optimization alone won't bridge.

   I recommend focusing on roles with 50+ match scores where strategic customization
   can be effective.

   Would you like to:
   1. Review the gap analysis to understand missing requirements
   2. Add/update positions to improve your profile
   3. Compare to a different JD"
```

---

### Case 3: No Partial Skills (All Matched or All Missing)

**Problem:** Gap analysis has no "Partial" skills to use as keywords

**Solution:**
```
Fallback to using matched skills:

jd_keywords = gap_analysis
  .filter(r => r.status === "Matched" AND r.subcategory === "Skills Needed")
  .slice(0, 3)

CUSTOMIZE to emphasize JD-specific context:
  - Use JD terminology
  - Emphasize matched skills
  - Add domain/industry context from JD
```

---

### Case 4: JD Has No Industry/Domain

**Problem:** JD doesn't specify industry (generic posting)

**Solution:**
```
Skip domain customization:
  - Keep role_scope sentence unchanged
  - Focus only on keyword replacement in hard_skills sentence
```

---

## Progress Indicators (Decision 10)

```
Display during generation (no time estimates):

DURING MASTER SUMMARY GENERATION:
"Generating professional summary..."
"Aggregating career metrics..."
"Selecting key achievements..."
"Done. Summary added to job history."

DURING PER-JD CUSTOMIZATION:
"Customizing summary for this JD..."
"Extracting JD keywords..."
"Optimizing keyword placement..."
"Done. Here's your customized summary:"
```

---

## Summary Generation Quality Gates (Guardrails)

### Guardrail #3: Professional Summary Separation

> **Implementation Target:** Add to [phases/phase-4/summary-generation.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-4/summary-generation.md).

**Instruction Text:**
```xml
<summary_abstraction_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Ensure the Professional Summary is a high-level abstraction and does not exactly duplicate the wording of specific resume bullets.
  </instruction>
  
  <validation_logic>
    BEFORE finalized output:
    1. Extract all generated summary sentences.
    2. COMPARE each sentence against all extracted resume bullets in <positions>.
    3. IF similarity (Levenshtein distance or semantic overlap) > 85%:
       - REWRITE the summary sentence to be broader.
       - Focus on the *aggregate* impact rather than the *specific* task.
  </validation_logic>
</summary_abstraction_guardrail>
```

### Guardrail #13: Summary-to-Bullet Metric Reconciliation

> **Implementation Target:** Add to [phases/phase-4/summary-generation.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-4/summary-generation.md).

**Instruction Text:**
```xml
<metric_reconciliation_guardrail>
  <priority>CRITICAL</priority>
  <instruction>
    Every metric used in a Professional Summary MUST have a corresponding, supporting metric in the Job History bullets.
  </instruction>
  
  <validation_logic>
    FOR EACH metric (%, $, volume) in the summary:
      SEARCH for that metric in the key_achievements of the Job History.
      IF NOT found:
        STOP generation.
        PROMPT: "Summary mentions [Metric X], but I don't see this in your job highlights. Did you mean to add this to a specific position first?"
  </validation_logic>
</metric_reconciliation_guardrail>
```

### Guardrail #26: Output Order Enforcement

> **Implementation Target:** Add to [phases/phase-4/summary-generation.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-4/summary-generation.md).

**Instruction Text:**
```xml
<output_order_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Enforce a strict section order for the final customized output.
  </instruction>
  
  <required_order>
    1. [Company] | [Job Title] (Header)
    2. Professional Summary (Customized)
    3. Changes Made (Summary of Optimization)
    4. Key Achievements (Optional / if requested)
    5. Action Verb Categories (Optional / if requested)
    6. Secondary Grammar Check Warning (v1.1.0)
  </required_order>
  
  <validation_logic>
    IF output sequence deviates from <required_order>:
      RE-ORDER sections before presenting to user.
  </validation_logic>
</output_order_guardrail>
```

### Guardrail #15: Phrase Repetition Enforcement (Secondary)

> **Implementation Target:** Add to [core/format-rules.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/format-rules.md) (primary) and [phases/phase-4/summary-generation.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-4/summary-generation.md) (secondary).

**Instruction Text:**
```xml
<summary_phrase_repetition_check>
  <instruction>
    Apply Guardrail #15 logic (3+ word phrases repeated 3+ times) across both the Summary and the top 3 visible positions to ensure overall narrative variety.
  </instruction>
</summary_phrase_repetition_check>
```

---

## Quality Checks

Before finalizing summary:

### Master Summary Quality Checks

- [ ] **Length:** 3-4 sentences (80-120 words)
- [ ] **Quantified metrics:** At least 2 numbers (years, team size, revenue, users)
- [ ] **Hard skills:** 2-3 technical skills mentioned
- [ ] **Soft skills:** 1-2 interpersonal skills mentioned
- [ ] **Company names:** At least 1 recognizable company (if applicable)
- [ ] **Factual accuracy:** All numbers and claims backed by job history
- [ ] **No buzzwords:** Avoid "synergy", "rockstar", "ninja", "guru"

### Per-JD Summary Quality Checks

- [ ] **Keywords:** 3-5 JD keywords integrated naturally
- [ ] **Metrics unchanged:** All quantified achievements remain accurate
- [ ] **Natural language:** No keyword stuffing, reads smoothly
- [ ] **Domain context:** Industry/domain mentioned if relevant
- [ ] **Differentiation:** Clearly different from master summary
- [ ] **ATS-friendly:** Keywords appear naturally (not just listed)

---

## Integration with Other Workflows

### After Phase 1 → Master Summary → Next Steps

```
Phase 1 completes → Master summary generated → Save job history

DISPLAY:
  "✅ Analysis complete! Your job history has been saved.

  Your profile includes:
  - [N] positions analyzed
  - [X] hard skills identified, [Y] soft skills
  - Professional summary generated

  Next steps - What would you like to do?
  1. Optimize specific resume bullets (Phase 2)
  2. Check fit for a job description (Phase 3)
  3. Export job history for review"
```

---

### After Phase 3 Gap Analysis → Offer Per-JD Summary

```
Gap analysis completes → match_score >= 50

DISPLAY:
  "Your match score is [score]/100 for [Company] | [Title].

  Would you like me to generate a customized professional summary for this JD?

  This will optimize your summary with keywords from the job description while
  maintaining your actual achievements and metrics."

IF user says "yes" → Generate per-JD summary
```

---

## Storage

### Master Summary

```
STORED: job_history_v2.0.master_summary

FILE: claude_generated_job_history_summaries_v2.txt

PERSISTENCE: Permanent (saved to disk)
```

### Per-JD Summary

```
STORED: Ephemeral (not saved)

DISPLAY: To user for manual copy/paste

PERSISTENCE: None (user must copy to their resume)

RATIONALE: Per-JD summaries are application-specific. Storing would clutter
           job history and create confusion about which summary to use.
```

---

## Related Protocols

- **Job History Creation:** `phases/phase-1/job-history-v2-creation.md`
- **JD Parsing:** `phases/phase-1/jd-parsing-17-point.md`
- **Evidence Matching:** `phases/phase-2/evidence-matching.md`
- **Phase 3 Integration:** `phases/phase-3/workflow-router.md`

---

**Version History:**
- v1.0 (2025-12-28): Initial summary generation (master + per-JD customization)
- v1.1.0 (2025-12-29): Added mandatory secondary grammar check warning as per v6.1.7 update <!-- v1.1.0 Change -->

---

**End of Professional Summary Generation Protocol**
