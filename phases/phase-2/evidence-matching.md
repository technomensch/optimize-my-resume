# Evidence-Based Matching Protocol - Phase 2

**Version:** 1.0
**Created:** 2025-12-28
**Purpose:** Match JD requirements against job history with evidence citations and gap analysis

---

## Overview

This protocol implements requirement-by-requirement matching between parsed job descriptions and job history v2.0. It provides evidence-based gap analysis with citations, enabling users to see exactly where their experience matches (or doesn't match) JD requirements.

**Key Features:**
- Two-part check: evidence match + keyword check (Decision 3)
- Requirement-by-requirement analysis (not aggregated)
- Evidence citations with standardized format (Decision 5)
- Color-coded output ([MATCHED] / [PARTIAL] / [MISSING])
- Diff generation for re-comparison workflow
- Gap rationale for each requirement

---

## Matching Logic

### Step 1: Requirement Extraction

Extract ALL requirements from the parsed JD (17-point format):

```javascript
requirements = []

// Hard skills - required
for (skill of jd.skills_needed) {
  requirements.push({
    requirement: skill,
    category: "Hard Skills",
    subcategory: "Skills Needed",
    importance: "Required"
  })
}

// Hard skills - preferred
for (skill of jd.skills_wanted) {
  requirements.push({
    requirement: skill,
    category: "Hard Skills",
    subcategory: "Skills Wanted",
    importance: "Preferred"
  })
}

// Soft skills - required
for (skill of jd.soft_skills_needed) {
  requirements.push({
    requirement: skill,
    category: "Soft Skills",
    subcategory: "Soft Skills Needed",
    importance: "Required"
  })
}

// Soft skills - preferred
for (skill of jd.soft_skills_wanted) {
  requirements.push({
    requirement: skill,
    category: "Soft Skills",
    subcategory: "Soft Skills Wanted",
    importance: "Preferred"
  })
}

// Education
if (jd.required_education) {
  requirements.push({
    requirement: jd.required_education,
    category: "Education",
    subcategory: "Required Education",
    importance: "Required"
  })
}

// Experience
if (jd.required_experience) {
  requirements.push({
    requirement: jd.required_experience,
    category: "Experience",
    subcategory: "Required Experience",
    importance: "Required"
  })
}

// Certifications (if separated)
for (cert of jd.certifications_needed || []) {
  requirements.push({
    requirement: cert,
    category: "Certifications",
    subcategory: "Certifications Needed",
    importance: "Required"
  })
}

// Total: N requirements to analyze
```

---

### Step 2: Evidence Search (Two-Part Check per Decision 3)

For EACH requirement, perform two checks:

#### Check 1: Evidence Match

Search job history for **demonstrated experience** (not just keyword presence):

```
SEARCH TARGETS:
1. hard_skills_demonstrated arrays (for hard skills)
2. soft_skills_demonstrated arrays (for soft skills)
3. core_responsibilities (for behavioral evidence)
4. key_achievements (for measurable results)
5. education field (for degree requirements)
6. certifications arrays (for cert requirements)
7. tools_technologies (for tool/platform experience)

MATCHING TYPES:

A. **Exact Match**
   Requirement: "Python"
   Found in: position.hard_skills_demonstrated = ["Python", "SQL", "AWS"]
   Result: EXACT MATCH

B. **Semantic Match**
   Requirement: "Python"
   Found in: achievement text "Developed ETL pipelines using Python and Pandas"
   Result: SEMANTIC MATCH (evidence found in description)

C. **Related Concept Match**
   Requirement: "Leadership"
   Found in: soft_skills_demonstrated = ["Team management"]
   Result: RELATED MATCH (similar concept)

D. **No Match**
   Requirement: "Kubernetes"
   Not found in any section
   Result: NO MATCH
```

---

#### Check 2: Keyword Check

After evidence matching, check if the keyword explicitly appears:

```
FOR EACH requirement with evidence match:

  SEARCH LOCATIONS:
  1. hard_skills_demonstrated or soft_skills_demonstrated arrays
  2. professional_summary (master summary)
  3. tools_technologies arrays

  IF keyword found in any location:
    keyword_present = true
  ELSE:
    keyword_present = false
    recommendation = "Add keyword '{requirement}' to skills section for ATS optimization"
```

**Example:**

```
Requirement: "Agile"

Evidence Match: FOUND
  - "Led sprint planning and backlog grooming sessions"
  - Source: TechCorp | PM (2018-2020)

Keyword Check: NOT FOUND
  - "Agile" does not appear in hard_skills_demonstrated array
  - "Agile" does not appear in professional summary

STATUS: PARTIAL
RECOMMENDATION: Add "Agile" to skills section for ATS. You have demonstrated experience.
```

---

### Step 3: Status Determination

Based on evidence match + keyword check, assign status:

| Evidence Match | Keyword Present | Status | Rationale |
|----------------|-----------------|--------|-----------|
| Exact or Semantic | Yes | **MATCHED** | Strong evidence + keyword present |
| Exact or Semantic | No | **PARTIAL** | Evidence exists but keyword missing (ATS gap) |
| Related Concept | Yes or No | **PARTIAL** | Similar skill, not exact match |
| No Match | N/A | **MISSING** | No evidence found |

---

### Step 4: Evidence Citation Formatting (Decision 5)

For each evidence found, cite the source using standardized format:

#### Standard Format

```
Company | Job Title
```

**Example:**
```
"Google | Product Manager"
```

#### Special Cases

| Scenario | Format | Example |
|----------|--------|---------|
| Same company, multiple roles | Show each role separately with dates | "Google \| PM (2018-2020)" and "Google \| Lead PM (2022-2024)" |
| Contractor | Company (Client: X) \| Title | "Accenture (Client: DHS) \| Analyst" |
| Freelance | Consultant \| Freelance (X clients) | "Consultant \| Freelance (5 clients)" |
| Current role | Company \| Title (dates - Present) | "TechCorp \| Senior PM (2022-Present)" |

---

### Step 5: Gap Rationale

For each requirement, provide explanation:

#### MATCHED - Strong Evidence

```
"Strong evidence across multiple roles"
"Exact keyword match in skills section"
"Demonstrated in [N] positions over [X] years"
"Primary responsibility in current role"
```

#### PARTIAL - Evidence with Gap

```
"Resume shows related experience ([related skill]) but not explicit [requirement]"
"Demonstrated leadership but not at required scale (led team of 5, JD requires 10+)"
"Experience from [X] years ago - consider refreshing"
"Keyword missing from resume - add to skills section for ATS"
```

#### MISSING - No Evidence

```
"No evidence of [SKILL] found in job history"
"Experience gap: JD requires [X], resume shows [Y]"
"Not mentioned in any position"
"Strategic gap - consider if this role is right fit"
```

---

## Output Format

### Color-Coded Output Structure

```
KEY: [MATCHED] | [PARTIAL] | [MISSING]

========================================
[HARD SKILLS - REQUIRED]
========================================

[MATCHED] Python
  Evidence:
  - "Developed ETL pipelines processing 10M+ records daily using Python and Pandas"
    → TechCorp | Data Engineer (2020-2022)
  - "Automated data workflows with Python scripts (saved 20 hrs/week)"
    → StartupCo | Senior Analyst (2018-2020)
  Keyword status: ✓ "Python" appears in hard_skills_demonstrated

[PARTIAL] Machine Learning
  Evidence:
  - "Applied statistical models to forecast customer churn (85% accuracy)"
    → StartupCo | Data Analyst (2017-2018)
  Gap: Resume shows statistical analysis but not explicit ML frameworks (scikit-learn, TensorFlow)
  Recommendation: If you have ML experience, add specific framework keywords to skills

[MISSING] Kubernetes
  Evidence: None found
  Gap: No container orchestration experience mentioned
  Recommendation: Not strategic to apply unless you're willing to learn Kubernetes on the job

----------------------------------------
REQUIRED SKILLS SUMMARY:
- Matched: 5 of 8 (63%)
- Partial: 2 of 8 (25%)
- Missing: 1 of 8 (13%)
----------------------------------------

========================================
[HARD SKILLS - PREFERRED]
========================================

[MATCHED] AWS
  Evidence:
  - "Managed AWS infrastructure (EC2, S3, Lambda) for production app serving 500K users"
    → TechCorp | DevOps Engineer (2020-2022)
  Keyword status: ✓ "AWS" appears in hard_skills_demonstrated

[MISSING] Terraform
  Evidence: None found
  Gap: No infrastructure-as-code experience mentioned
  Note: This is preferred, not required - acceptable gap

----------------------------------------
PREFERRED SKILLS SUMMARY:
- Matched: 1 of 2 (50%)
- Missing: 1 of 2 (50%)
----------------------------------------

========================================
[SOFT SKILLS - REQUIRED]
========================================

[MATCHED] Leadership
  Evidence:
  - "Managed cross-functional team of 12 (engineering, design, product)"
    → Google | Lead PM (2022-2024)
  - "Led team of 5 analysts in data migration project"
    → Accenture | Senior Analyst (2019-2020)
  Keyword status: ✓ "Leadership" appears in soft_skills_demonstrated

[PARTIAL] Stakeholder Management
  Evidence:
  - "Presented quarterly business reviews to VP of Product"
    → Google | PM (2020-2022)
  Gap: Evidence shows presentation skills but not explicit "stakeholder management" keyword
  Recommendation: Add "Stakeholder management (C-level presentations)" to soft skills

[MATCHED] Communication
  Evidence:
  - "Delivered technical training sessions to 50+ employees"
    → TechCorp | Senior Engineer (2018-2020)
  - "Authored technical documentation read by 10K+ developers"
    → OpenSource Project | Contributor (2016-2018)
  Keyword status: ✓ "Communication" appears in soft_skills_demonstrated

----------------------------------------
REQUIRED SOFT SKILLS SUMMARY:
- Matched: 2 of 3 (67%)
- Partial: 1 of 3 (33%)
----------------------------------------

========================================
[EDUCATION]
========================================

[MATCHED] Bachelor's degree in Computer Science or related field
  Evidence:
  - "Bachelor of Science in Computer Science"
    → University of California, Berkeley (2014)

========================================
[EXPERIENCE]
========================================

[MATCHED] 5+ years in product management
  Evidence:
  - Total product management experience: 6.5 years
    → Google | PM (2018-2020): 2 years
    → Google | Lead PM (2022-2024): 2 years
    → TechCorp | Senior PM (2024-Present): 2.5 years

========================================
OVERALL MATCH SCORE
========================================

Total Requirements: 16
- Matched: 10 (63%)
- Partial: 3 (19%)
- Missing: 3 (19%)

**Final Match Score: 72/100**

Scoring Method:
- Matched = 100% weight
- Partial = 50% weight
- Missing = 0% weight

Calculation: (10 * 1.0 + 3 * 0.5 + 3 * 0.0) / 16 = 0.72 = 72%

========================================
BLOCKING GATES CHECK
========================================

✓ Hard Skill Deficit: PASS (matched 5 of 8 required hard skills = 63%)
✓ Match Score: PASS (72% >= 50% threshold)
✓ Location: PASS (no mismatch detected)

All gates passed. You may proceed with application.
```

---

## Diff Generation (for Re-Comparison Workflow)

When user re-compares after updating job history, generate diff:

### Diff Structure

```javascript
{
  "improvements": [
    {
      "requirement": "Salesforce",
      "previous_status": "Missing",
      "current_status": "Matched",
      "new_evidence": "Implemented Salesforce integration handling 5K leads/month",
      "source": "Acme Corp | PM (2024-Present)"
    },
    {
      "requirement": "Python",
      "previous_status": "Partial",
      "current_status": "Matched",
      "change_reason": "Added 'Python' to hard_skills_demonstrated"
    }
  ],
  "regressions": [
    {
      "requirement": "AWS",
      "previous_status": "Matched",
      "current_status": "Partial",
      "change_reason": "Removed position that had AWS experience"
    }
  ],
  "no_change": ["SQL", "Agile", "Leadership", "Communication"],
  "score_delta": {
    "previous_score": 72,
    "current_score": 81,
    "delta": +9,
    "delta_percentage": "+13%"
  }
}
```

### Diff Output Format

```
========================================
CHANGES SINCE LAST COMPARISON
========================================

Previous comparison: 2025-12-20
Current comparison: 2025-12-28

---

IMPROVEMENTS (2):

✓ [MISSING → MATCHED] Salesforce
  New evidence: "Implemented Salesforce integration handling 5K leads/month"
  Source: Acme Corp | PM (2024-Present)

✓ [PARTIAL → MATCHED] Python
  Change: Added "Python" to hard_skills_demonstrated

---

REGRESSIONS (1):

⚠ [MATCHED → PARTIAL] AWS
  Change: Removed position (TechCorp | DevOps Engineer) that had AWS experience
  Recommendation: Consider adding AWS back to skills section if still relevant

---

NO CHANGE (4):

[MATCHED] SQL, Agile, Leadership, Communication
[MISSING] Kubernetes

---

OVERALL SCORE:

Previous: 72/100 (2025-12-20)
Current: 81/100 (2025-12-28)

**Improvement: +9 points (+13%)**

========================================
```

---

## Special Matching Rules

### Rule 1: Years of Experience Matching

```
JD Requirement: "5+ years of experience in [domain]"

CALCULATION:
1. Filter positions by domain (e.g., product management)
2. Sum date ranges (end_date - start_date)
3. Compare to requirement

STATUSES:
- Meets or exceeds requirement → MATCHED
- Within 1 year of requirement → PARTIAL
- Significantly below requirement → MISSING

EXAMPLE:
  JD requires: 5+ years PM experience
  Candidate has:
    - Google | PM (2018-2020): 2 years
    - Google | Lead PM (2022-2024): 2 years
    - TechCorp | Senior PM (2024-Present): 1.5 years
  Total: 5.5 years
  STATUS: MATCHED
```

---

### Rule 2: Education Matching

```
JD Requirement: "Bachelor's degree in Computer Science or related field"

MATCHING LOGIC:
1. Check if candidate has ANY bachelor's degree
2. Check if degree is in specified field or "related field"

RELATED FIELDS (for CS):
- Computer Science, Software Engineering, Information Technology
- Mathematics, Statistics, Data Science
- Electrical Engineering, Computer Engineering

STATUSES:
- Exact field match → MATCHED
- Related field match → MATCHED (note related)
- Different field → PARTIAL (has degree, different field)
- No degree → MISSING

EXPERIENCE EQUIVALENCY:
- JD says "or equivalent experience"
- Candidate has 8+ years in field → PARTIAL (no degree but extensive experience)
```

---

### Rule 3: Certification Matching

```
JD Requirement: "PMP certification required"

STATUSES:
- Active certification → MATCHED
- Expired certification → PARTIAL (need renewal)
- In-progress (studying for cert) → PARTIAL (mention in cover letter)
- No certification → MISSING
```

---

### Rule 4: Scale Matching (Team Size, Budget, Users)

```
JD Requirement: "Experience managing teams of 10+"

CANDIDATE EVIDENCE: "Managed team of 5 analysts"

MATCHING:
- Meets or exceeds scale → MATCHED
- Close to scale (within 30%) → PARTIAL
- Significantly below scale → PARTIAL (with note)

EXAMPLE OUTPUT:
[PARTIAL] Leadership (managing teams of 10+)
  Evidence: "Managed team of 5 analysts"
    → Accenture | Senior Analyst (2019-2020)
  Gap: Led teams but not at required scale (5 vs 10+ required)
  Recommendation: Highlight team leadership experience, acknowledge smaller scale
```

---

## Evidence Quality Scoring

Assign quality score to each evidence citation:

```
QUALITY_FACTORS = {
  recency: {
    current_role: 1.0,
    within_2_years: 0.9,
    2_5_years_ago: 0.7,
    5_10_years_ago: 0.5,
    over_10_years: 0.3
  },
  specificity: {
    quantified_metrics: 1.0,
    specific_tools_named: 0.9,
    general_description: 0.6,
    vague_mention: 0.3
  },
  relevance: {
    primary_responsibility: 1.0,
    secondary_responsibility: 0.8,
    occasional_use: 0.5,
    tangential_mention: 0.3
  }
}

OVERALL_QUALITY = (recency + specificity + relevance) / 3

IF quality < 0.5:
  ADD NOTE: "Evidence is weak - consider strengthening with metrics or recency"
```

---

## Output Schema (JSON)

```json
{
  "requirement_analysis": [
    {
      "requirement": "Python programming",
      "category": "Hard Skills",
      "subcategory": "Skills Needed",
      "importance": "Required",
      "status": "Matched",
      "evidence": [
        {
          "content": "Developed ETL pipelines processing 10M+ records daily using Python and Pandas",
          "source": "TechCorp | Data Engineer",
          "source_full": "TechCorp | Data Engineer (2020-2022)",
          "source_type": "achievement",
          "quality_score": 0.95
        },
        {
          "content": "Automated data workflows with Python scripts (saved 20 hrs/week)",
          "source": "StartupCo | Senior Analyst",
          "source_full": "StartupCo | Senior Analyst (2018-2020)",
          "source_type": "achievement",
          "quality_score": 0.85
        }
      ],
      "keyword_present": true,
      "gap_rationale": "Strong evidence across multiple roles",
      "recommendation": null
    },
    {
      "requirement": "Machine Learning",
      "category": "Hard Skills",
      "subcategory": "Skills Needed",
      "importance": "Required",
      "status": "Partial",
      "evidence": [
        {
          "content": "Applied statistical models to forecast customer churn (85% accuracy)",
          "source": "StartupCo | Data Analyst",
          "source_full": "StartupCo | Data Analyst (2017-2018)",
          "source_type": "achievement",
          "quality_score": 0.70
        }
      ],
      "keyword_present": false,
      "gap_rationale": "Resume shows statistical analysis but not explicit ML frameworks (scikit-learn, TensorFlow)",
      "recommendation": "If you have ML experience, add specific framework keywords to skills"
    }
  ],
  "summary": {
    "total_requirements": 16,
    "matched_count": 10,
    "partial_count": 3,
    "missing_count": 3,
    "match_score": 72,
    "by_category": {
      "hard_skills_required": {"matched": 5, "partial": 2, "missing": 1},
      "hard_skills_preferred": {"matched": 1, "partial": 0, "missing": 1},
      "soft_skills_required": {"matched": 2, "partial": 1, "missing": 0},
      "soft_skills_preferred": {"matched": 0, "partial": 0, "missing": 0},
      "education": {"matched": 1, "partial": 0, "missing": 0},
      "experience": {"matched": 1, "partial": 0, "missing": 0}
    }
  },
  "blocking_gates": {
    "hard_skill_deficit": "pass",
    "match_score": "pass",
    "location": "pass"
  }
}
```

---

## Related Protocols

- **JD Parsing:** `phases/phase-1/jd-parsing-17-point.md`
- **Job History Creation:** `phases/phase-1/job-history-v2-creation.md`
- **Phase 3 Integration:** `phases/phase-3/workflow-router.md`
- **Blocking Gates:** Defined in Phase 3 (workflow-router.md)

---

**Version History:**
- v1.0 (2025-12-28): Initial evidence matching with two-part check, citation formatting, diff generation

---

**End of Evidence-Based Matching Protocol**
