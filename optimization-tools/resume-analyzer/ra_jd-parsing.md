# Job Description Parsing Protocol

**Version:** 9.1.0 <!-- v9.1.0 Change: Documentation Sync -->
**Created:** 2025-12-28
**Purpose:** Extract structured data from job descriptions using comprehensive parsing schema

---

## Overview

This protocol defines the complete extraction schema for job descriptions (JDs). It handles both structured JDs (with clear sections) and conversational JDs (narrative format), extracting all relevant information into a standardized parsing format.

**Key Features:**
- Dual extraction strategy (structured vs conversational)
- Hard/soft skill separation with classification
- Inference for missing fields (no warnings)
- Remote work classification with context
- Required vs preferred distinction

---

## Standard Schema

### Category 1: Company & Role Information (4 fields)

#### 1. company
**Type:** string
**Description:** Employer/hiring company name
**Extraction:**
- Look for: Company name in header, signature, or "About [Company]" section
- LinkedIn JDs: Extract from "Company: XYZ Corp"
- Email JDs: Extract from sender domain or signature
- **If missing:** Set to null (continue silently per Decision 6)

**Example:**
```
"company": "TechCorp Inc."
```

---

#### 2. job_title
**Type:** string
**Description:** Official role title
**Extraction:**
- Look for: First heading, "Position:", "Role:", "Job Title:"
- Common patterns: "[Title] at [Company]", "We're hiring a [Title]"
- **If missing:** This is CRITICAL - cannot proceed without title

**Example:**
```
"job_title": "Senior Product Manager"
```

---

#### 3. location
**Type:** string
**Description:** Physical location or "Remote"
**Extraction:**
- Look for: "Location:", "Based in:", Address patterns
- Formats: "San Francisco, CA", "New York, NY", "Remote", "Remote (US only)"
- **If missing:** Set to null (continue silently per Decision 6)

**Example:**
```
"location": "San Francisco, CA"
```

---

#### 4. work_lifestyle
**Type:** enum ["Remote", "On-Site", "Hybrid", "Limited Remote"]
**Description:** Work arrangement type
**Extraction:**
- Look for keywords: "Remote", "On-site", "Hybrid", "Work from home", "In-office"
- Context matters: "Remote with weekly office visits" → "Limited Remote"
- **If missing:** Infer from location field (if location is "Remote" → "Remote")

**Example:**
```
"work_lifestyle": "Hybrid"
```

---

### Category 2: Work Conditions (4 fields)

#### 5. remote_restrictions
**Type:** string
**Description:** Geographic or proximity restrictions for remote work
**Extraction:**
- Look for: State restrictions, timezone requirements, commuting distance, occasional on-site
- Apply Decision 4 labels (see Remote Work Classification section below)
- **If missing:** Set to null

**Examples:**
```
"remote_restrictions": "[REMOTE - PROXIMITY REQUIRED] Must be within commuting distance of NYC office"
"remote_restrictions": "[REMOTE - LOCATION DEPENDENT] Remote for candidates in CA, NY, TX only"
"remote_restrictions": "[REMOTE - VERIFY REQUIREMENTS] Mentions 'flexible remote' but also 'occasional travel to HQ'"
"remote_restrictions": "[LIMITED REMOTE] Remote with quarterly on-site meetings in Chicago"
```

---

#### 6. employee_type
**Type:** enum ["Full-time", "Part-time", "Contract", "Temporary", "Internship"]
**Description:** Employment classification
**Extraction:**
- Look for: "Full-time", "Part-time", "Contract", "W2", "1099", "Contractor", "Temp", "Intern"
- **Default:** "Full-time" (if not specified)

**Example:**
```
"employee_type": "Full-time"
```

---

#### 7. travel_required
**Type:** string
**Description:** Travel frequency or percentage
**Extraction:**
- Look for: "Travel: X%", "Occasional travel", "Up to X days per month", "Frequent travel required"
- Quantify when possible: "Monthly" → "~10-15%", "Quarterly" → "~5%"
- **If missing:** Set to null

**Example:**
```
"travel_required": "10-15% (quarterly team meetings)"
```

---

#### 8. clearance
**Type:** string
**Description:** Security clearance requirements
**Extraction:**
- Look for: "Security clearance", "Secret clearance", "Top Secret", "TS/SCI", "Public Trust"
- Note: "Must be able to obtain" vs "Must have active"
- **If missing:** Set to null (continue silently per Decision 6)

**Example:**
```
"clearance": "Secret clearance required (or ability to obtain)"
```

---

### Category 3: Compensation & Basic Requirements (4 fields)

#### 9. salary_range
**Type:** string
**Description:** Compensation range or estimate
**Extraction:**
- Look for: "$X-$Y", "Competitive salary", "Market rate", "$XK-$YK"
- Format consistently: "$120,000 - $160,000"
- **If missing:** Set to null (continue silently per Decision 6)

**Example:**
```
"salary_range": "$120,000 - $160,000"
```

---

#### 10. required_experience
**Type:** string
**Description:** Years and type of experience required
**Extraction:**
- Look for: "X+ years", "X years of experience in [domain]", "Minimum X years"
- Combine with domain: "5+ years in product management"
- **If missing:** Set to "Not specified"

**Example:**
```
"required_experience": "5+ years in product management"
```

---

#### 11. required_education
**Type:** string
**Description:** Degree requirements
**Extraction:**
- Look for: "Bachelor's degree", "Master's preferred", "PhD required", "or equivalent experience"
- Note: "Required" vs "Preferred"
- **If missing:** Set to null (continue silently per Decision 6)

**Example:**
```
"required_education": "Bachelor's degree in Computer Science or related field"
```

---

#### 12. job_responsibilities
**Type:** array of strings
**Description:** Core duties and responsibilities
**Extraction:**
- Look for: "Responsibilities:", "You will:", "Day-to-day:", bullet lists under responsibilities
- Extract as array (one bullet per item)
- **If missing:** Extract from full JD text (look for action verbs: "manage", "lead", "develop")

**Example:**
```
"job_responsibilities": [
  "Lead product strategy and roadmap for B2B SaaS platform",
  "Manage cross-functional team of 10+ (engineering, design, marketing)",
  "Define and track success metrics for 3-5 concurrent initiatives",
  "Present quarterly business reviews to C-level executives"
]
```

---

### Category 4: Hard Skills (2 fields)

#### 13. skills_needed (HARD SKILLS - REQUIRED)
**Type:** array of strings
**Description:** Technical/measurable skills that are REQUIRED
**Extraction:**
- Look for: "Requirements:", "Must have:", "Required skills:", "Proficiency in:"
- Separate from soft skills using Skills Categorization (see below)
- **If skills section missing:** Infer from responsibilities text (Decision 6)

**Example:**
```
"skills_needed": [
  "Python",
  "SQL",
  "AWS (EC2, S3, Lambda)",
  "Docker",
  "Kubernetes",
  "JIRA",
  "Agile/Scrum"
]
```

---

#### 14. skills_wanted (HARD SKILLS - PREFERRED)
**Type:** array of strings
**Description:** Technical/measurable skills that are PREFERRED but not required
**Extraction:**
- Look for: "Nice to have:", "Preferred:", "Bonus:", "Plus:"
- Separate from soft skills using Skills Categorization
- **If missing:** Set to empty array

**Example:**
```
"skills_wanted": [
  "Terraform",
  "GraphQL",
  "Machine Learning frameworks (scikit-learn, TensorFlow)"
]
```

---

### Category 5: Soft Skills (2 fields)

#### 15. soft_skills_needed (SOFT SKILLS - REQUIRED)
**Type:** array of strings
**Description:** Interpersonal/behavioral skills that are REQUIRED
**Extraction:**
- Look for: "Strong communication", "Leadership experience", "Team player"
- Extract from requirements section
- Separate from hard skills using Skills Categorization

**Example:**
```
"soft_skills_needed": [
  "Leadership (managing teams of 10+)",
  "Stakeholder management (C-level presentations)",
  "Communication (technical to non-technical audiences)",
  "Problem-solving"
]
```

---

#### 16. soft_skills_wanted (SOFT SKILLS - PREFERRED)
**Type:** array of strings
**Description:** Interpersonal/behavioral skills that are PREFERRED
**Extraction:**
- Look for: Soft skills mentioned in "Nice to have" or "Preferred" sections
- **If missing:** Set to empty array

**Example:**
```
"soft_skills_wanted": [
  "Mentoring and coaching",
  "Change management experience"
]
```

---

### Category 6: Qualifications & Certifications (2 fields - omitted per final plan adjustment)

**Note:** The original parsing schema included:
- qualifications_needed
- qualifications_wanted
- certifications_needed
- certifications_wanted

These have been **consolidated** into the skills arrays for simplicity:
- Certifications → Add to `skills_needed` or `skills_wanted` with note
- Qualifications → Extract as `required_experience` or `required_education`

This reduces the schema to **16 fields** but maintains all information.

---

## Hard vs Soft Skill Classification

### Classification Rules (from Decision 3)

Use this decision tree to classify each skill:

```
Is the skill measurable/testable with objective criteria?
├─ YES → Is it a technical tool, language, or methodology?
│  ├─ YES → HARD SKILL
│  └─ NO → Is it domain-specific knowledge?
│     ├─ YES → HARD SKILL
│     └─ NO → Check context clues
│        ├─ "Certification required" → HARD SKILL
│        └─ "Mindset" or "approach" → SOFT SKILL
└─ NO → Is it interpersonal or behavioral?
   ├─ YES → SOFT SKILL
   └─ NO → **DEFAULT TO HARD SKILL** (safer for blocking gates)
```

### Hard Skill Indicators

**Definition:** Technical, measurable, teachable skills

**Examples:**
- Programming languages: Python, Java, JavaScript, SQL, C++, Ruby, PHP
- Cloud platforms: AWS, Azure, GCP
- Tools/frameworks: Docker, Kubernetes, React, Django, Tableau, Salesforce
- Methodologies: Agile, Scrum, Six Sigma, Lean
- Domain knowledge: HIPAA, GDPR, SOX, ISO 27001
- Certifications: PMP, AWS Solutions Architect, CPA, CFA

**Context clues:**
- "Proficiency in..."
- "X+ years experience with..."
- "Certification in..."
- "Knowledge of..."
- "Expertise in..."

**When in doubt:** If it can be tested or requires specialized training → HARD

---

### Soft Skill Indicators

**Definition:** Interpersonal, behavioral, personality traits

**Examples:**
- Communication: Written, verbal, presentation, active listening
- Leadership: Team management, mentoring, coaching, delegation
- Collaboration: Teamwork, cross-functional, conflict resolution
- Problem-solving: Critical thinking, analytical skills, creativity
- Work style: Time management, adaptability, self-motivation
- Emotional intelligence: Empathy, patience, cultural sensitivity

**Context clues:**
- "Strong..." (e.g., "Strong communicator")
- "Excellent..." (e.g., "Excellent team player")
- "Ability to..." (e.g., "Ability to work under pressure")
- "Proven..." (e.g., "Proven leadership")

**When in doubt:** If it describes how someone works with others → SOFT

---

### Ambiguous Skills - Default to HARD

These skills could be either hard or soft depending on context. Default to HARD for blocking gate safety:

| Skill | Default | Reasoning |
|-------|---------|-----------|
| Project Management | HARD | Could mean PMP certification; safer to treat as hard |
| Agile | HARD | Formal methodology with certifications (Scrum Master, etc.) |
| Data Analysis | HARD | Technical skill requiring tools (SQL, Excel, Python) |
| Technical Writing | HARD | Specific deliverable type requiring structured approach |
| Client Relations | SOFT | Interpersonal relationship management |
| Strategic Thinking | SOFT | Cognitive approach, not measurable |

---

## Remote Work Classification (Decision 4)

Apply these labels to the `remote_restrictions` field:

### Label 1: [REMOTE - PROXIMITY REQUIRED]

**When to use:**
- JD says "Must be within commuting distance of [location]"
- JD says "Remote with weekly/regular office visits"
- JD implies occasional in-person presence is expected

**Example output:**
```
"remote_restrictions": "[REMOTE - PROXIMITY REQUIRED] Must be within commuting distance of NYC office for weekly team meetings"
```

**Explanation to user:**
"This role is listed as remote but requires proximity to the NYC office for regular in-person meetings. If you're not within commuting distance, this may not be a true remote opportunity."

---

### Label 2: [REMOTE - LOCATION DEPENDENT]

**When to use:**
- JD specifies state/region restrictions
- JD says "Remote for candidates in [list of states]"
- JD mentions timezone requirements

**Example output:**
```
"remote_restrictions": "[REMOTE - LOCATION DEPENDENT] Remote for candidates in CA, NY, TX, or FL only"
```

**Explanation to user:**
"This role is remote but restricted to specific states (CA, NY, TX, FL). Verify your location is eligible before applying."

---

### Label 3: [REMOTE - VERIFY REQUIREMENTS]

**When to use:**
- Vague or contradictory remote language
- JD says "Flexible remote" but also mentions "collaborative environment" or "in-person culture"
- Unclear if truly remote or hybrid

**Example output:**
```
"remote_restrictions": "[REMOTE - VERIFY REQUIREMENTS] JD mentions 'flexible remote work' but also emphasizes 'collaborative in-person culture' - clarify expectations with employer"
```

**Explanation to user:**
"The remote work policy is unclear. This JD has mixed signals - contact the hiring manager to clarify expectations before applying."

---

### Label 4: [LIMITED REMOTE]

**When to use:**
- JD explicitly states occasional on-site requirements
- Quarterly/monthly meetings required
- Hybrid schedule with specific in-office days

**Example output:**
```
"remote_restrictions": "[LIMITED REMOTE] Remote with quarterly on-site meetings in Chicago (estimated 4 trips/year)"
```

**Explanation to user:**
"This role offers remote work but requires quarterly travel to Chicago for on-site meetings. Budget for ~4 trips per year."

---

## Extraction Strategy

### Strategy A: Structured JD Parsing

**When to use:** JD has clear section headers (Requirements, Qualifications, Responsibilities, etc.)

**Process:**

```
STEP 1: Identify section headers
  Look for: "Requirements:", "Qualifications:", "Responsibilities:", "About the Role:", "Nice to Have:", "Preferred:"

STEP 2: Extract by section
  - Company & Role → Extract from header or first paragraph
  - Responsibilities → "Responsibilities:" section
  - Required skills → "Requirements:" or "Must have:" section
  - Preferred skills → "Nice to have:" or "Preferred:" section
  - Education → "Qualifications:" section
  - Experience → "Requirements:" section (look for "X+ years")

STEP 3: Categorize skills
  For each skill extracted:
    - Apply classification decision tree
    - Separate into hard vs soft
    - Add to appropriate array (skills_needed vs skills_wanted, soft_skills_needed vs soft_skills_wanted)

STEP 4: Extract metadata
  - Location → Look for "Location:", "Based in:", address patterns
  - Work lifestyle → "Remote", "Hybrid", "On-site" keywords
  - Salary → "$X-$Y", "Competitive salary"
  - Company → Header, "About [Company]", sender domain

STEP 5: Validate completeness
  - Check if all 17 fields attempted
  - Missing fields → Apply null/inference rules (Decision 6)
```

**Example:**
```
Input JD:
"Senior Product Manager at TechCorp

Location: San Francisco, CA (Hybrid - 3 days in office)

Responsibilities:
- Lead product strategy for B2B SaaS platform
- Manage team of 8 (engineers and designers)
- Define success metrics and track KPIs

Requirements:
- 5+ years product management experience
- Proficiency in SQL, JIRA, and data analysis
- Strong leadership and communication skills
- Bachelor's degree in CS or related field

Nice to Have:
- Experience with machine learning products
- AWS or GCP knowledge"

Output:
{
  "company": "TechCorp",
  "job_title": "Senior Product Manager",
  "location": "San Francisco, CA",
  "work_lifestyle": "Hybrid",
  "remote_restrictions": null,
  "employee_type": "Full-time",
  "travel_required": null,
  "clearance": null,
  "salary_range": null,
  "required_experience": "5+ years product management experience",
  "required_education": "Bachelor's degree in CS or related field",
  "job_responsibilities": [
    "Lead product strategy for B2B SaaS platform",
    "Manage team of 8 (engineers and designers)",
    "Define success metrics and track KPIs"
  ],
  "skills_needed": ["SQL", "JIRA", "Data analysis"],
  "skills_wanted": ["Machine learning", "AWS", "GCP"],
  "soft_skills_needed": ["Leadership", "Communication"],
  "soft_skills_wanted": []
}
```

---

### Strategy B: Conversational JD Parsing

**When to use:** JD has narrative format without clear sections

**Process:**

```
STEP 1: Keyword-based extraction
  Scan full text for skill keywords:
    - Programming: "Python", "Java", "SQL", "JavaScript"
    - Cloud: "AWS", "Azure", "GCP", "Kubernetes"
    - Tools: "JIRA", "Salesforce", "Tableau"
    - Soft skills: "leadership", "communication", "teamwork"

STEP 2: Pattern matching
  Look for patterns:
    - "X years of experience in [SKILL]" → skills_needed
    - "Proficient in [TOOL]" → skills_needed
    - "Bonus if you know [SKILL]" → skills_wanted
    - "We're looking for someone who [QUALITY]" → soft skills

STEP 3: Contextual inference
  Extract from narrative:
    - "We need a Python developer" → skills_needed: ["Python"]
    - "Love working with AWS?" → skills_wanted: ["AWS"]
    - "You'll lead a team of 5" → soft_skills_needed: ["Leadership"]

STEP 4: Confidence flagging
  - Mark extraction as "low confidence"
  - Note: "JD format is non-standard. Results may be incomplete."

STEP 5: Inference for missing fields (Decision 6)
  - skills_needed → Infer from responsibilities text
  - Other missing fields → Set to null
```

**Example:**
```
Input JD:
"Hey! We're a fast-growing startup looking for an awesome data engineer.

You'll be building data pipelines using Python and SQL, working with our data science team to deliver insights to customers. AWS experience is a big plus!

We're remote-friendly but prefer folks in the Pacific timezone. Expect some travel for quarterly team offsites.

If you love data and want to make an impact, let's chat!"

Output:
{
  "company": null,
  "job_title": "Data Engineer",
  "location": "Remote",
  "work_lifestyle": "Remote",
  "remote_restrictions": "[REMOTE - LOCATION DEPENDENT] Pacific timezone preference mentioned",
  "employee_type": "Full-time",
  "travel_required": "Quarterly team offsites",
  "clearance": null,
  "salary_range": null,
  "required_experience": "Not specified",
  "required_education": null,
  "job_responsibilities": [
    "Build data pipelines using Python and SQL",
    "Work with data science team to deliver insights to customers"
  ],
  "skills_needed": ["Python", "SQL"],
  "skills_wanted": ["AWS"],
  "soft_skills_needed": ["Collaboration (work with data science team)"],
  "soft_skills_wanted": []
}
```

---

## Missing Field Handling (Decision 6)

Apply these rules when fields are missing:

| Missing Field | Behavior | Rationale |
|---------------|----------|-----------|
| company | Set to null | Can proceed without company name |
| location | Set to null | Can proceed, may affect remote validation |
| salary_range | Set to null | Common for JDs to omit salary |
| clearance | Set to null | Only relevant for government/defense roles |
| required_education | Set to null | Many roles don't specify education |
| skills_needed | **Infer from responsibilities** | Critical for gap analysis |
| skills_wanted | Set to empty array | Not critical |
| soft_skills_needed | Infer from responsibilities | Look for "lead", "manage", "communicate" verbs |

**Important:** NO warnings about incomplete JDs (per Decision 6)

Just work with what's available and set missing optional fields to null.

---

## Output Format

### Complete Output Schema

```json
{
  "jd_parsed": {
    "company": "TechCorp Inc.",
    "job_title": "Senior Product Manager",
    "location": "San Francisco, CA",
    "work_lifestyle": "Hybrid",
    "remote_restrictions": null,
    "employee_type": "Full-time",
    "travel_required": "10-15% (quarterly team meetings)",
    "clearance": null,
    "salary_range": "$120,000 - $160,000",
    "required_experience": "5+ years in product management",
    "required_education": "Bachelor's degree in CS or related field",
    "job_responsibilities": [
      "Lead product strategy for B2B SaaS platform",
      "Manage cross-functional team of 10+",
      "Define and track success metrics"
    ],
    "skills_needed": ["SQL", "JIRA", "Agile", "Data analysis"],
    "skills_wanted": ["AWS", "Kubernetes", "Machine learning"],
    "soft_skills_needed": ["Leadership", "Communication", "Stakeholder management"],
    "soft_skills_wanted": ["Mentoring"]
  },
  "extraction_metadata": {
    "extraction_confidence": "high",
    "extraction_method": "structured",
    "top_matched_keywords": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "top_missing_keywords": ["Gap 1", "Gap 2", "Gap 3", "Gap 4", "Gap 5"],
    "missing_fields": ["clearance"],
    "inferred_fields": [],
    "ambiguous_skills": []
  }
}
```

<jd_keyword_visibility id="34">
  **Requirement:** Every analysis summary MUST explicitly list the top 5 matched and top 5 missing keywords to provide immediate feedback on applicant fit.
</jd_keyword_visibility>

### Metadata Fields

**extraction_confidence:**
- "high" - Structured JD with all sections present
- "medium" - Structured JD with some missing sections
- "low" - Conversational JD or significant missing information

**extraction_method:**
- "structured" - Strategy A used
- "conversational" - Strategy B used
- "hybrid" - Mix of both strategies

**missing_fields:**
- Array of field names set to null

**inferred_fields:**
- Array of field names where inference was used (e.g., "skills_needed")

**ambiguous_skills:**
- Array of skills that could be hard or soft (defaulted to hard)

---

## Validation Checklist

Before finalizing JD parse:

- [ ] **Company & Role:** At minimum, job_title must be present
- [ ] **Skills:** At least 1 skill in skills_needed (infer from responsibilities if needed)
- [ ] **Hard/Soft Separation:** All skills categorized correctly
- [ ] **Required vs Preferred:** Skills in correct array (needed vs wanted)
- [ ] **Remote Classification:** If work_lifestyle is "Remote", check remote_restrictions
- [ ] **Missing Fields:** Set to null (not empty string, not "Not specified" unless noted)
- [ ] **Metadata:** extraction_confidence, extraction_method populated

- [ ] **Metadata:** extraction_confidence, extraction_method populated

---

## JD Parsing Quality Gates (Guardrails)

### Guardrail #7: Skill Categorization Consistency

> **Implementation Target:** Add to [jd-parsing.md](optimization-tools/resume-analyzer/ra_jd-parsing.md) (primary) and [verb-categories.md](core/verb-categories.md) (secondary).

**Instruction Text:**
```xml
<skill_classification_guardrail>
  <instruction>
    A single skill term cannot exist in both <hard_skills_needed> and <soft_skills_needed> arrays within the same JD output.
  </instruction>
  
  <validation_logic>
    BEFORE finalized output:
    1. Scan elements in all four skill arrays (needed/wanted, hard/soft).
    2. CHECK for duplicates across Hard/Soft boundaries.
    3. IF found:
       - Technical/Tools/Hard Skills -> Move to HARD_SKILLS, remove from Soft.
       - Behavioral/Leadership/Interpersonal -> Move to SOFT_SKILLS, remove from Hard.
  </validation_logic>
</skill_classification_guardrail>
```

### Guardrail #10: JD Keyword Density Validation

> **Implementation Target:** Add to [jd-parsing.md](optimization-tools/resume-analyzer/ra_jd-parsing.md).

**Instruction Text:**
```xml
<keyword_quality_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Identify and weight keywords based on JD frequency and section emphasis.
  </instruction>
  
  <validation_logic>
    FOR EACH extracted skill:
      calculated_importance = (total_occurrences_in_jd) * (section_multiplier)
      
      section_multiplier = {
        "Job Title": 3.0,
        "Requirements Header": 2.0,
        "Responsibilities Bullet": 1.5,
        "Conversational Mention": 1.0
      }
      
    IF importance >= [Threshold]:
      FLAG as "Core Keyword"
      MUST be prioritized in <evidence-matching> and <summary-generation>.
  </validation_logic>
</keyword_quality_guardrail>
```

---

## Edge Cases

### Case 1: JD Lists Skills Without Required/Preferred Distinction

**Problem:** All skills in one list, no "required" vs "nice to have"

**Solution:**
- If list is under "Requirements" → ALL go to skills_needed
- If list is under generic "Skills" → Use context clues
  - Skills with "X+ years" → skills_needed
  - Skills with "bonus", "plus", "preferred" → skills_wanted
- **If unclear:** Put all in skills_needed (conservative approach)

---

### Case 2: JD Mixes Hard and Soft Skills in Same List

**Problem:** "Requirements: Python, SQL, strong communication, teamwork"

**Solution:**
- Classify each skill individually
- Separate into appropriate arrays
- Result:
  - skills_needed: ["Python", "SQL"]
  - soft_skills_needed: ["Communication", "Teamwork"]

---

### Case 3: JD Has No Skills Section

**Problem:** No explicit skills list anywhere

**Solution:**
- Infer from job_responsibilities
- Look for:
  - Tools mentioned: "using JIRA" → skills_needed: ["JIRA"]
  - Verbs: "develop Python scripts" → skills_needed: ["Python"]
  - Management: "lead team of 5" → soft_skills_needed: ["Leadership"]
- Mark in metadata: `inferred_fields: ["skills_needed", "soft_skills_needed"]`

---

### Case 4: Unclear Work Lifestyle (Remote vs Hybrid)

**Problem:** JD says "flexible work arrangement" or "remote options available"

**Solution:**
- Set work_lifestyle to "Remote"
- Add to remote_restrictions: `[REMOTE - VERIFY REQUIREMENTS] JD mentions flexible work but lacks specifics - clarify with employer`
- Flag for user review

---

### Case 5: Multiple Locations Listed

**Problem:** "Locations: San Francisco, New York, Austin"

**Solution:**
- Concatenate: `"location": "San Francisco, CA | New York, NY | Austin, TX"`
- Set work_lifestyle based on context:
  - If "or" → "On-Site" (must pick one location)
  - If "and" → Unclear (may be multi-office role)

---

### Case 6: Ambiguous Skill Classification

**Problem:** Skill could be hard or soft (e.g., "Project Management")

**Solution:**
- Check context:
  - "PMP certification" → HARD
  - "Strong project management skills" → HARD (default when ambiguous)
- Add to metadata: `ambiguous_skills: ["Project Management"]`
- Default to HARD for blocking gate safety

---

## Usage in Gap Analysis (Job Fit Analyzer)

After parsing JD, the parsing output feeds into evidence matching:

```
1. Load job_history_v2.0
2. For EACH requirement in jd_parsed:
   - skills_needed (hard) → Match against job_history.hard_skills_demonstrated
   - skills_wanted (hard) → Match against job_history.hard_skills_demonstrated
   - soft_skills_needed → Match against job_history.soft_skills_demonstrated
   - soft_skills_wanted → Match against job_history.soft_skills_demonstrated
   - required_education → Match against job_history.education
   - required_experience → Calculate from job_history.positions date ranges

3. Generate requirement-by-requirement gap analysis
4. Check blocking gates (hard skill deficit, low match score, location mismatch)
```

---

## Related Protocols

- **Job History Creation:** `optimization-tools/resume-analyzer/ra_job-history-creation.md`
- **Skills Categorization:** Use classification rules from this document
- **Evidence Matching:** `optimization-tools/bullet-optimizer/bo_evidence-matching.md` (v6.0.2)
- **Entry Router:** `optimization-tools/resume-analyzer/ra_entry-router.md`

---

**Version History:**
- v9.0.0 (2026-01-19): Initial keyword management integration
- v9.1.0 (2026-01-19): Documentation Sync - Added JD keyword visibility requirement (Guardrail #34) <!-- v9.1.0 Change -->

---

**End of Job Description Parsing Protocol**
