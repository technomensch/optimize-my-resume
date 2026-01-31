# Job History Creation - Creation Protocol

**Version:** 6.5.1 <!-- v6.5.1 Change: Release synchronization -->
**Created:** 2025-12-28
**Purpose:** Complete job history schema with evidence-based matching support

---

## Overview

This protocol guides the creation of a comprehensive job history file that serves as the single source of truth for resume optimization. Unlike v1.0, this version explicitly separates hard and soft skills, includes education and certifications, and supports evidence-based matching with keyword checking.

**Key Improvements:**
- 12-section schema (expanded from 8)
- Hard/soft skill separation with context analysis
- Evidence citation format standardization
- Education and certification tracking
- Enhanced metadata for gap analysis

---

## 12-Section Schema

### Section 1: Personal Information

```
# Personal Information

**Full Name:** [First Last]
**Location:** [City, State/Country]
**Email:** [email@example.com]
**Phone:** [Optional]
**LinkedIn:** [Optional URL]
**Portfolio/GitHub:** [Optional URL]
```

**Purpose:** Basic contact and location info for remote work validation.

---

### Section 2: Professional Summary (Master)

```
# Professional Summary

[2-3 paragraph master summary capturing:
- Current role/level
- Years of experience
- Core expertise areas
- Key achievements or differentiators]
```

**Purpose:** Master summary for general career overview; Project 2 handles its own tailored summary logic.

**Guidelines:**
- Keep factual and evidence-based
- Avoid buzzwords without backing evidence
- Highlight measurable impact where possible

---

### Section 3: Education

```
# Education

## [Degree Name]
**Institution:** [University Name]
**Location:** [City, State]
**Graduation:** [Month Year]
**GPA:** [Optional, if 3.5+]
**Relevant Coursework:** [Optional list]
**Honors:** [Optional - Dean's List, cum laude, etc.]

## [Additional Degrees]
[Same format as above]
```

**Purpose:** Education requirements validation, degree matching.

**Handling Edge Cases:**
- Incomplete degree: Mark as "In Progress (Expected: [date])"
- Bootcamp/alternative education: List under "Professional Training" subsection
- International degrees: Include US equivalency if known

---

### Section 4: Certifications

```
# Certifications

## [Certification Name]
**Issuing Organization:** [Name]
**Issue Date:** [Month Year]
**Expiration Date:** [Month Year or "No expiration"]
**Credential ID:** [Optional]
**Verification URL:** [Optional]

## [Additional Certifications]
[Same format as above]
```

**Purpose:** Certification requirements validation, credential verification.

**Classification:**
- Active certifications (not expired)
- Expired certifications (may still show expertise)
- In-progress certifications

---

### Section 5: Hard Skills

```
# Hard Skills

## Technical Skills
- **Programming Languages:** Python (5 years), SQL (7 years), JavaScript (3 years)
- **Frameworks/Libraries:** React, Node.js, Django, FastAPI
- **Tools/Platforms:** AWS (EC2, S3, Lambda), Docker, Kubernetes, Git
- **Data/Analytics:** Pandas, NumPy, Tableau, PowerBI
- **Other:** [Category-specific skills]

## Domain-Specific Skills
- **[Domain]:** Specific technical skills relevant to domain
```

**Purpose:** Hard skill matching for blocking gates and gap analysis.

**Hard Skill Classification Rules:**
1. **Measurable/testable** → HARD
   - Programming languages, tools, platforms
   - Certifications, methodologies with formal training
   - Technical processes with specific steps

2. **Requires specialized knowledge** → HARD
   - Domain expertise (finance, healthcare, etc.)
   - Regulatory knowledge (HIPAA, SOX, etc.)
   - Specialized analytical techniques

3. **Context clues** → HARD
   - "Certification required"
   - "Proficiency in [tool]"
   - "Experience with [specific technology]"

4. **Default to HARD when ambiguous** (safer for blocking gates)

**Format:**
- Include years of experience where known
- Group by category for readability
- Use specific version numbers if relevant (Python 3.x, React 18)

---

### Section 6: Soft Skills

```
# Soft Skills

## Leadership & Management
- Team leadership (managed teams of 5-12)
- Stakeholder management (C-level presentations)
- Conflict resolution
- Mentoring and coaching

## Communication
- Technical writing (documentation, RFPs)
- Public speaking (conferences, internal presentations)
- Cross-functional collaboration
- Client-facing communication

## Problem-Solving & Adaptability
- Critical thinking
- Strategic planning
- Process improvement
- Change management

## Work Style
- Agile/Scrum participation
- Remote collaboration
- Time management
- Self-directed learning
```

**Purpose:** Soft skill matching with evidence citations.

**Soft Skill Classification Rules:**
1. **Interpersonal/behavioral** → SOFT
   - Communication, leadership, teamwork
   - Adaptability, creativity, emotional intelligence

2. **Mindset/approach** → SOFT
   - "Growth mindset"
   - "Customer-focused"
   - "Detail-oriented"

3. **Context clues** → SOFT
   - "Strong communicator"
   - "Team player"
   - "Adaptable to changing priorities"

**Format:**
- Include context/scale where possible (team size, audience type)
- Link to specific experiences when available

---

### Section 7: Job History

```
# Job History

## [Company Name]

### [Job Title]
**Duration:** [Month Year] - [Month Year or "Present"]
**Location:** [City, State] | [Remote/Hybrid/On-site]
**Reporting To:** [Optional - helps establish level]

**Key Responsibilities:**
- [Primary responsibility with measurable scope]
- [Secondary responsibility]
- [Additional responsibilities]

**Key Achievements:**
- [Quantifiable achievement with impact]
  - Context: [What was the problem/opportunity]
  - Action: [What you did]
  - Result: [Measurable outcome]
  - Skills Used: [Relevant hard/soft skills demonstrated]

- [Additional achievements following same format]

**Technologies/Tools Used:**
[Specific tech stack for this role - enables evidence matching]

**Skills Demonstrated:**
- Hard: [List of hard skills with evidence in this role]
- Soft: [List of soft skills with evidence in this role]

---

### [Previous Job Title at Same Company]
[If promoted or changed roles at same company, use same format]

---

## [Previous Company Name]
[Same format as above]
```

**Purpose:** Evidence source for gap analysis and skill matching.

**Citation Format Standards (Decision 5):**

| Scenario | Format | Example |
|----------|--------|---------|
| Standard role | `Company \| Title (dates)` | `Google \| PM (2018-2020)` |
| Contractor | `Company (Client: X) \| Title` | `Accenture (Client: DHS) \| Analyst` |
| Freelance | `Consultant \| Freelance (X clients)` | `Consultant \| Freelance (5 clients)` |
| Multiple roles | Show each separately | See example below |

**Example with promotions:**
```
## Google

### Lead Product Manager
**Duration:** 2022-2024
[Details]

### Senior Product Manager
**Duration:** 2020-2022
[Details]

### Product Manager
**Duration:** 2018-2020
[Details]
```

**Evidence Matching (Decision 3):**

When matching skills to job history, use **two-part check:**

1. **Evidence Match:** Search for demonstrated experience
   - Example: JD requires "Agile experience"
   - Evidence: "Led sprint planning sessions" at Google | PM (2018-2020)
   - Result: [MATCHED]

2. **Keyword Check:** Flag if keyword missing even when evidence exists
   - Example: Evidence shows Agile participation, but word "Agile" never appears
   - Recommendation: "Ensure 'Agile' appears in skills or summary"

**Output Format for Evidence Citations:**
```
[MATCHED] Agile
  Evidence: "Led sprint planning sessions"
    → Google | PM (2018-2020)
  Keyword recommendation: Add "Agile" to skills section if not present
```

---

### Section 8: Projects (Optional)

```
# Notable Projects

## [Project Name]
**Role:** [Your role in project]
**Duration:** [Month Year - Month Year]
**Context:** [Company/client or "Personal project"]

**Description:**
[1-2 sentences describing the project]

**Your Contributions:**
- [Specific contribution with impact]
- [Additional contributions]

**Technologies Used:**
[Tech stack]

**Outcome:**
[Measurable result or current status]
```

**Purpose:** Additional evidence for skills, especially for career changers or recent grads.

**When to include:**
- Significant projects outside regular job duties
- Open-source contributions
- Personal projects demonstrating relevant skills
- Academic projects (for recent graduates)

---

### Section 9: Awards & Recognition

```
# Awards & Recognition

- **[Award Name]** - [Issuing Organization], [Year]
  - [Brief context: what it was for]

- **[Additional Awards]**
```

**Purpose:** Differentiation, culture fit signals, achievement validation.

---

### Section 10: Publications & Speaking

```
# Publications & Speaking

## Publications
- **[Title]** - [Publication], [Date]
  - [Brief description or link]

## Conference Presentations
- **[Talk Title]** - [Conference Name], [Date]
  - [Brief description]

## Other Speaking
- [Internal talks, webinars, podcasts, etc.]
```

**Purpose:** Thought leadership evidence, communication skill validation.

---

### Section 11: Volunteer Work

```
# Volunteer Work

## [Organization Name]
**Role:** [Your role]
**Duration:** [Month Year - Month Year or "Ongoing"]

**Activities:**
- [What you did]
- [Impact or outcomes]

**Skills Used:**
[Relevant skills demonstrated through volunteer work]
```

**Purpose:** Culture fit, skill demonstration outside work, gap explanation.

---

### Section 12: Additional Information

```
# Additional Information

**Languages:**
- English (Native)
- Spanish (Professional working proficiency)
- [Additional languages with proficiency level]

**Clearances:**
- [Security clearance type and status]
- [Expiration date if applicable]

**Work Authorization:**
- [US Citizen / Green Card / Work Visa (H1B, etc.)]

**Availability:**
- [Notice period: 2 weeks, immediate, etc.]
- [Preferred start date if relevant]

**Salary Expectations:**
- [Optional - use if applying to specific JD that requests it]

**Other:**
- [Professional memberships]
- [Relevant hobbies that demonstrate skills]
- [Patents or other credentials]
```

**Purpose:** Logistics, clearance requirements, work authorization validation.

---

## Hard/Soft Skill Separation Guidelines

### Classification Decision Tree

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

### Context Analysis Examples

| Skill Phrase | Classification | Reasoning |
|--------------|----------------|-----------|
| "Python programming" | HARD | Technical, measurable, testable |
| "Agile methodology" | HARD | Formal methodology with certification paths |
| "Leadership experience" | SOFT | Interpersonal, behavioral |
| "Problem-solving" | SOFT | Cognitive approach, not measurable objectively |
| "AWS certification" | HARD | "Certification" keyword + technical |
| "Growth mindset" | SOFT | "Mindset" keyword + behavioral |
| "Data analysis" | HARD | Technical domain skill |
| "Stakeholder management" | SOFT | Interpersonal relationship skill |
| "HIPAA compliance" | HARD | Regulatory knowledge, specific rules |
| "Adaptability" | SOFT | Behavioral trait |

### Ambiguous Cases - Default to HARD

When unclear, default to HARD because:
1. Blocking gates check hard skill deficits
2. Better to warn user about potential mismatch than miss it
3. Soft skill gaps are less likely to be deal-breakers

**Examples of ambiguous cases:**
- "Project management" → HARD (can mean PMP certification or general coordination)
- "Technical writing" → HARD (specific deliverable type)
- "Client relations" → SOFT (interpersonal)

---

## Creation Workflow (Resume Analysis)

When creating a job history file in Resume Analysis, follow this sequence:

### Step 1: Personal Information
- Collect name, location, contact info
- Confirm remote work eligibility (location-based)

### Step 2: Education
- Start with highest degree
- Collect all degrees, bootcamps, relevant training
- Mark in-progress degrees clearly

### Step 3: Certifications
- Active certifications first
- Include expiration dates
- Note in-progress certifications

### Step 4: Skills Extraction
- Start with resume skills section (if provided)
- Extract additional skills from job descriptions
- Classify each as HARD or SOFT using decision tree
- Group hard skills by category (programming, tools, domain)
- Group soft skills by type (leadership, communication, etc.)

### Step 5: Job History (Detailed)
- Start with current/most recent role
- For each position:
  - Basic info (company, title, dates, location)
  - 3-5 key responsibilities
  - 2-4 key achievements in CAR format (Context-Action-Result)
  - Technologies/tools used
  - Skills demonstrated (link to Sections 5 & 6)

- **Promotion Handling:**
  - Create separate entries for each role at same company
  - Include full date ranges for each
  - Show progression clearly

- **Employment Gaps:**
  - Note gaps >3 months
  - Suggest including explanation (sabbatical, education, family, etc.)
  - Check if volunteer work or projects can fill gaps

### Step 6: Projects (If Applicable)
- Include if:
  - Career changer with relevant side projects
  - Recent graduate with academic projects
  - Significant open-source contributions
  - Freelance work not captured in job history

### Step 7: Awards, Publications, Speaking
- Collect any professional recognition
- Industry publications or blog posts
- Conference talks or presentations

### Step 8: Volunteer Work
- Include if demonstrates relevant skills
- Include if explains employment gaps
- Include if shows culture fit

### Step 9: Additional Information
- Languages (if multilingual role or international company)
- Clearances (if government/defense roles)
- Work authorization (always ask for US-based roles)
- Availability and salary (optional)

### Step 10: Master Summary
- **Create LAST** (after collecting all info)
- Pull from strongest achievements across all roles
- Highlight most relevant skills for user's target roles
- Keep to 2-3 paragraphs
- Focus on measurable impact

---

## File Format & Storage

**Filename:** `job_history_[FirstLast].md`

**Example:** `job_history_jane_smith.md`

**Storage Location:** `user-data/job-histories/`

**File Header:**
```markdown
# Job History - [Full Name]

**Created:** [Date]
**Last Updated:** [Date]
**Version:** 6.5.1 <!-- v6.5.1 Change: Release synchronization -->
**Status:** [Complete | In Progress]

---
```

**Version Control:**
- Track updates in header
- Create dated backups before major changes: `job_history_jane_smith_2025_12_28.md`
- Keep previous version for comparison

---

## Validation Checklist

Before marking job history as complete:

- [ ] **Section 1:** Personal info includes location for remote work validation
- [ ] **Section 2:** Master summary written (2-3 paragraphs)
- [ ] **Section 3:** All degrees listed with dates
- [ ] **Section 4:** Active certifications included with expiration dates
- [ ] **Section 5:** Hard skills categorized and classified correctly
- [ ] **Section 6:** Soft skills listed with context where possible
- [ ] **Section 7:** Job history complete with:
  - [ ] All positions include dates, location, remote status
  - [ ] Each position has 3-5 responsibilities
  - [ ] Each position has 2-4 achievements in CAR format
  - [ ] Technologies/tools listed for each role
  - [ ] Skills demonstrated linked to Sections 5 & 6
  - [ ] Citation format follows standards (Decision 5)
  - [ ] Promotions shown as separate entries with dates
- [ ] **Section 8:** Projects included if applicable
- [ ] **Section 9:** Awards listed if any
- [ ] **Section 10:** Publications/speaking listed if any
- [ ] **Section 11:** Volunteer work included if relevant
- [ ] **Section 12:** Additional info complete (languages, clearances, work auth)
- [ ] **Evidence Quality:** Each achievement has clear Context-Action-Result
- [ ] **Classification Accuracy:** Spot-check 5 skills for correct HARD/SOFT classification

- [ ] **Classification Accuracy:** Spot-check 5 skills for correct HARD/SOFT classification

---

## Job History Quality Gates (Guardrails)

### G1: Metric Isolation & Traceability

> **Implementation Target:** Add to [job-history-creation.md](optimization-tools/resume-analyzer/ra_job-history-creation.md) (primary) and [evidence-matching.md](optimization-tools/bullet-optimizer/bo_evidence-matching.md) (secondary).

**Instruction Text:**
```xml
<metric_isolation_guardrail>
  <priority>CRITICAL</priority>
  <instruction>
    Ensure every metric ($ amounts, %, multipliers) is uniquely tied to the specific position where it was achieved.
  </instruction>
  
  <validation_logic>
    BEFORE finalized extraction:
    1. Scan all extracted metrics.
    2. FOR EACH metric:
       - Confirm literal presence in source text for THAT position.
       - IF found in other positions, verify if it's a repeated achievement or a cross-contamination error.
       - FLAG for re-verification if a metric appears in multiple roles with identical wording.
  </validation_logic>
  
  <metric_source_formatting>
    When listing a metric in <achievements>, include a 'Traceability Hash' in internal thinking:
    [Metric: "34% increase"] -> [Source: "Google Lead PM Responsibilities paragraph 3"]
  </metric_source_formatting>
</metric_isolation_guardrail>
```

### G17: Scope Attribution Validation

> **Implementation Target:** Add to [job-history-creation.md](optimization-tools/resume-analyzer/ra_job-history-creation.md).

**Instruction Text:**
```xml
<scope_attribution_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Distinguish between team-wide achievements and individual contributions.
  </instruction>
  
  <validation_logic>
    SCAN achievements for collective pronouns ("We", "The team", "Our department").
    IF found:
      IDENTIFY specific user role in that achievement.
      REWRITE to emphasize individual action: "Led team of X to..." or "Contributed [Specific Effort] to team project that achieved..."
      
    BLOCK: Achieving a 50% revenue increase for the entire 5,000-person company as a Junior Analyst achievement. 
    REWRITE: "Performed critical data analysis supporting $X revenue increase initiative."
  </validation_logic>
</scope_attribution_guardrail>
```

### G5: honest_limitations Enforcement (Secondary)

> **Implementation Target:** Add to [evidence-matching.md](optimization-tools/bullet-optimizer/bo_evidence-matching.md) (primary) and [job-history-creation.md](optimization-tools/resume-analyzer/ra_job-history-creation.md) (secondary).

**Instruction Text:**
```xml
<honest_limitations_enforcement>
  <instruction>
    During initial extraction, if a user mentions limitations (e.g., "I did Python but only for 3 months"), these MUST be captured in an "Honest Limitations Summary" section.
  </instruction>
  <validation>
    Cross-reference every hard skill claim in Section 5 against the Limitations Summary.
    IF skill claim exceeds stated limitation:
      FLAG as "Potential Hallucination/Overstatement"
      REDUCE claim to match limitation.
  </validation>
</honest_limitations_enforcement>
```

### G43: Positional Anchoring (Format Agnostic)

**Instruction Text:**
```xml
<positional_anchoring_logic id="G43">
  <context>Handling raw/non-standard resume inputs or legacy job history files.</context>
  <priority>CRITICAL</priority>
  <instruction>
    IF the input data does not follow the v12.1+ Job History XML/Markdown schema:
    1. **Scan:** Identify distinct employment blocks (Company + Title + Dates).
    2. **Tag:** Assign a sequential anchor ID starting from [P1] (most recent) to [Pn] (oldest).
    3. **Citation Mandate:** Every skill extracted into Section 12 MUST be accompanied by at least one [Pn] tag in internal thinking and output validation.
    4. **Persistence:** These [Pn] tags serve as the Source of Truth for all downstream Evidence Gating (ENH-007).
  </instruction>
</positional_anchoring_logic>
```

### G44: Skills Evidence Gate (Section 12 Hardening)

**Instruction Text:**
```xml
<skills_evidence_gate_rule id="G44">
  <intent>Prevent unverified skill claims in the Master Skills Inventory (Section 12).</intent>
  <priority>CRITICAL</priority>
  <rule>
    For every skill proposed for Section 12:
    1. **Verification:** The agent MUST search ALL achievements and responsibilities in Section 7 (Job History) for the specific skill or its immediate synonyms.
    2. **Gating:** IF no evidence is found in any position [P1-Pn]:
       - BLOCK the skill from being added to the Master Inventory.
       - ALERT the user: "I cannot find evidence of [Skill] in your work history. You must first add a bullet or achievement that demonstrates this skill before I can include it in Section 12."
    3. **Citation:** Every approved skill MUST be listed with its supporting P-IDs (e.g., "Python [P1, P3]").
  </rule>
</skills_evidence_gate_rule>
```

---

## Usage in Gap Analysis (Job Fit Analyzer)

When comparing job history to JD:

### Hard Skill Matching
1. Extract hard skills from JD
2. For each hard skill:
   - Search Section 5 for keyword match
   - Search Section 7 for evidence (project work, achievements)
   - If found in Section 7 but not Section 5 → Flag keyword gap
   - If not found anywhere → Mark as [MISSING]

### Soft Skill Matching (Evidence-Based)
1. Extract soft skills from JD
2. For each soft skill:
   - Search Section 7 for demonstrated experience
   - Example: "Leadership" → Look for "managed team," "led project," "mentored"
   - Cite evidence using format: `Company | Title (dates)`
   - If evidence found but keyword missing → Recommend adding to Section 6

### Education Matching
1. Compare JD education requirements to Section 3
2. Flag if required degree missing
3. Consider equivalent experience if user has 5+ years in field

### Certification Matching
1. Compare JD certification requirements to Section 4
2. Flag required certifications that are missing or expired
3. Note in-progress certifications that meet requirement timeline

### Evidence Citation Output (Decision 3)

**Format:**
```
[MATCHED] Python
  Evidence:
  - "Developed ETL pipelines processing 10M+ records daily"
    → Google | PM (2018-2020)
  - "Built automation scripts reducing manual work by 15 hours/week"
    → Google | Lead PM (2022-2024)

[MATCHED] Agile
  Evidence: "Led sprint planning sessions with 8-person team"
    → Google | PM (2018-2020)
  Keyword recommendation: Add "Agile" to Section 5 if not present

[MISSING] Kubernetes
  No evidence found in job history
  Recommendation: Consider adding if you have experience, or flag as skill gap
```

---

## Migration from v1.0

If user has existing v1.0 job history:

1. **Import existing sections:**
   - Personal info → Section 1
   - Professional summary → Section 2
   - Job history → Section 7
   - Projects → Section 8

2. **Add new sections:**
   - Education → Section 3 (collect from user)
   - Certifications → Section 4 (collect from user)
   - Awards → Section 9 (collect from user)
   - Publications/Speaking → Section 10 (collect from user)
   - Volunteer → Section 11 (collect from user)
   - Additional info → Section 12 (collect from user)

3. **Refactor skills:**
   - Extract all skills mentioned in job history
   - Classify each as HARD or SOFT
   - Populate Section 5 (hard skills) and Section 6 (soft skills)
   - Add years of experience where known
   - Add context/scale for soft skills

4. **Update job history format:**
   - Add "Skills Demonstrated" to each position
   - Ensure achievements follow CAR format
   - Add "Technologies/Tools Used" if missing
   - Verify citation format standards

5. **Validate:**
   - Run through validation checklist
   - Spot-check skill classifications
   - Ensure no information lost from v1.0

---

## Example: Complete Job History Entry

```markdown
## Google

### Lead Product Manager
**Duration:** 2022-2024
**Location:** Mountain View, CA | Hybrid (3 days/week on-site)
**Reporting To:** VP of Product

**Key Responsibilities:**
- Led product strategy and roadmap for Google Workspace security features, managing $15M annual budget
- Managed cross-functional team of 12 (eng, design, analytics, marketing) across 3 time zones
- Owned stakeholder communication with C-level executives and external security partners
- Defined and tracked success metrics for 5 major product launches

**Key Achievements:**
- **Launched Zero Trust security framework for Workspace**
  - Context: Enterprise customers required enhanced security controls for remote work compliance
  - Action: Led 9-month initiative with engineering, security, and compliance teams to design and implement zero-trust architecture
  - Result: Increased enterprise adoption by 34%, added $8M ARR, achieved SOC 2 Type II compliance
  - Skills Used: Product strategy, stakeholder management, zero-trust security, compliance (SOC 2, GDPR)

- **Reduced security incident response time by 65%**
  - Context: Customer complaints about slow incident detection and resolution
  - Action: Partnered with engineering to implement ML-based threat detection and automated remediation workflows
  - Result: Response time decreased from 4.2 hours to 1.5 hours average, customer satisfaction score increased from 6.8 to 8.9/10
  - Skills Used: Machine learning (partnership), process improvement, data analysis, customer empathy

**Technologies/Tools Used:**
- Google Cloud Platform (GCP, IAM, Security Command Center)
- Product analytics: Looker, Mixpanel, Google Analytics
- Project management: Jira, Asana, Google Workspace
- Data analysis: SQL, Python (basic), Google Sheets

**Skills Demonstrated:**
- Hard: Product management, Google Cloud Platform, SQL, data analysis, SOC 2 compliance, zero-trust architecture, ML (partnership)
- Soft: Leadership (12-person team), stakeholder management (C-level), cross-functional collaboration, strategic thinking, customer empathy
```

**Citation examples from this role:**
```
[MATCHED] Product strategy
  Evidence: "Led product strategy and roadmap for Google Workspace security features"
    → Google | Lead PM (2022-2024)

[MATCHED] Google Cloud Platform
  Evidence: "Implemented zero-trust architecture using GCP IAM and Security Command Center"
    → Google | Lead PM (2022-2024)

[MATCHED] Leadership
  Evidence: "Managed cross-functional team of 12 across 3 time zones"
    → Google | Lead PM (2022-2024)
```

---

## Error Handling & Edge Cases

### Missing Information

**If user cannot provide information for a section:**

1. **Education:** Mark as "Not available" and note this may limit opportunities requiring specific degrees
2. **Certifications:** Mark as "None" (common, not a problem)
3. **Job dates:** Ask for approximate (Month Year level minimum)
4. **Achievement metrics:** Ask for estimates or relative improvement ("~30%" or "significantly improved")

### Employment Gaps

**Gaps > 3 months:**
1. Note the gap in job history
2. Ask if there's an explanation (education, sabbatical, family, health, job search, etc.)
3. Check if volunteer work or projects can fill the gap
4. If no explanation provided, leave gap as-is (user can address in cover letter)

### Contractor/Freelance Complexity

**Multiple concurrent clients:**
```
## Freelance Consultant

### Independent Consultant
**Duration:** 2020-2022
**Location:** Remote

**Client Engagements:**

#### Client: Acme Corp (6 months)
**Role:** Senior Analyst
**Project:** [Description]
**Achievements:** [...]

#### Client: Widget Inc (4 months)
**Role:** Data Consultant
**Project:** [Description]
**Achievements:** [...]

#### Additional Clients
- Beta Co (3 months) - Data pipeline migration
- Gamma LLC (2 months) - BI dashboard development
- [2 additional short-term engagements]

**Skills Demonstrated:** [Aggregate across all clients]
```

**Citation format for multi-client:**
```
Evidence: "Developed ETL pipelines for 3 enterprise clients"
  → Consultant | Freelance (5 clients, 2020-2022)
```

### Career Changes

**If user is changing careers:**
1. Emphasize transferable skills in Sections 5 & 6
2. Include Section 8 (Projects) to show new skills
3. Include Section 11 (Volunteer) if demonstrates new field
4. Adjust master summary to bridge old and new career
5. Consider separate job history sections: "Relevant Experience" and "Additional Experience"

### Recent Graduates

**If user has <2 years experience:**
1. Education (Section 3) goes before job history
2. Include relevant coursework and projects
3. Section 8 (Projects) is critical - include academic projects
4. Include internships and co-ops in Section 7
5. TA/RA positions count as job history if relevant
6. Expand Section 11 (Volunteer) if shows relevant skills

---

## Related Protocols

- **JD Parsing (parsing):** `optimization-tools/resume-analyzer/ra_jd-parsing.md`
- **Entry Router (5-scenario):** `optimization-tools/resume-analyzer/ra_entry-router.md`
- **Evidence Matching:** `optimization-tools/bullet-optimizer/bo_evidence-matching.md`
- **Summary Generation:** `optimization-tools/narrative-generator/ng_summary-generation.md`

---

**Version History:**
- job history creation (2025-12-28): Complete rewrite with 12-section schema, hard/soft separation, evidence-based matching
- v1.0 (2025-12-15): Initial 8-section schema

---

**End of Job History Creation Creation Protocol**
