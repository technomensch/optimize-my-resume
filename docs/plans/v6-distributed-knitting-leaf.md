# v6.0 Complete Workflow System Implementation Plan

## Overview

**Version:** 6.0.0 (MAJOR - Breaking schema changes)
**Branch:** `v6.0-complete_workflow_system`
**Scope:** Restore legacy features + add complete entry-to-exit workflow routing

**Key Changes:**
- Job History Schema v2.0 (hard/soft skills separation, education, certifications)
- Restore 17-point JD parsing from legacy system
- Professional summary customization (master + per-JD options)
- Entry point routing with auto-detect and confirmation
- Keyword/skills extraction and evidence-based matching

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ENTRY POINT ROUTER                          │
│                   (new: shared/entry-router.md)                  │
│                                                                   │
│  User uploads resume → Analyze file → Detect state → Confirm     │
└────────────┬─────────────────┬──────────────────┬────────────────┘
             │                 │                  │
             ▼                 ▼                  ▼
      ┌──────────┐      ┌──────────┐      ┌──────────┐
      │  MODE 1  │      │  MODE 2  │      │  MODE 3  │
      │  Full    │──┐   │  Bullet  │      │    JD    │
      │ Analysis │  │   │   Opt    │      │ Compare  │
      └──────────┘  │   └──────────┘      └──────────┘
                    │                            ▲
                    │   ┌──────────────┐         │
                    └──▶│ Job History  │─────────┘
                        │  Creation    │
                        │  (v2.0)      │
                        └──────────────┘
```

**Data Flow:**
1. **Entry Router:** User provides resume → system detects state (new user, has job history, has JD)
2. **Mode 1:** New resume → Full analysis → Generate job history v2.0 → Offer next steps
3. **Mode 2:** Has job history → Upload bullets → Optimize → Update job history
4. **Mode 3:** Has job history + JD → Parse JD (17-point) → Gap analysis → Recommendations

---

## Job History Schema v2.0

### Storage Location
- **File:** `shared/job-history-v2-creation.md` (NEW)
- **Output:** `claude_generated_job_history_summaries_v2.txt` (NEW)
- **Format:** Plain text with v2.0 structured sections

### Schema Structure

Each job entry contains **12 sections** (up from 8 in v1.0):

```xml
<job_entry_schema_v2>
  <metadata>
    <job_title>Senior Product Manager</job_title>
    <company>TechCorp Inc.</company>
    <dates>Jan 2020 - Dec 2022</dates>
    <schema_version>2.0</schema_version>
  </metadata>

  <professional_summary>
    <!-- Master summary for this role (2-3 sentences) -->
    <!-- Aggregate metrics, key achievements, scope -->
  </professional_summary>

  <core_responsibilities>
    <!-- 3-5 bullet points of primary duties -->
    <!-- Focus on scope and accountability -->
  </core_responsibilities>

  <key_achievements>
    <!-- 3-5 bullet points with quantified results -->
    <!-- STAR format with metrics -->
  </key_achievements>

  <hard_skills_demonstrated>
    <!-- Array of technical/measurable skills -->
    <!-- Example: Python, SQL, Agile, JIRA, AWS, GDPR compliance -->
  </hard_skills_demonstrated>

  <soft_skills_demonstrated>
    <!-- Array of interpersonal/behavioral skills -->
    <!-- Example: Leadership, Communication, Problem-solving, Collaboration -->
  </soft_skills_demonstrated>

  <education>
    <!-- Degree, institution, year (if mentioned in this role context) -->
    <!-- Example: "MBA, Stanford University, 2019" -->
  </education>

  <certifications>
    <!-- Professional certifications relevant to this role -->
    <!-- Example: "PMP, Certified Scrum Master, AWS Solutions Architect" -->
  </certifications>

  <tools_technologies>
    <!-- Specific tools used (subset of hard skills, more granular) -->
    <!-- Example: "JIRA, Confluence, Tableau, Salesforce, GitHub" -->
  </tools_technologies>

  <impact_metrics>
    <!-- Quantified business impact -->
    <!-- Example: "Increased revenue by $2M, Reduced costs by 30%, Led team of 12" -->
  </impact_metrics>

  <industry_domain>
    <!-- Industry sector and domain expertise -->
    <!-- Example: "Fintech, Healthcare SaaS, E-commerce" -->
  </industry_domain>

  <team_scope>
    <!-- Leadership and team size -->
    <!-- Example: "Managed cross-functional team of 15, Reported to VP Product" -->
  </team_scope>
</job_entry_schema_v2>
```

### Key Differences from v1.0

**Added (6 new sections):**
- `hard_skills_demonstrated` - Separates technical skills
- `soft_skills_demonstrated` - Separates behavioral skills
- `education` - Formal education details
- `certifications` - Professional certifications
- `tools_technologies` - Granular tool listing
- `professional_summary` - Master summary per role

**Modified:**
- `skills_demonstrated` → split into hard/soft
- Added `schema_version` metadata for compatibility tracking

**Preserved:**
- `core_responsibilities`, `key_achievements`, `impact_metrics`, `industry_domain`, `team_scope`

### Migration Strategy

**Fresh Start (per user decision):**
- No migration of existing v1.0 job histories
- New schema only (`claude_generated_job_history_summaries_v2.txt`)
- Keep v1.0 file (`claude_generated_job_history_summaries.txt`) for reference
- Mode 1 generates v2.0 format for all new analyses
- User can manually port old histories if desired

---

## 17-Point JD Parsing (Restored from Legacy)

### Implementation Location
- **File:** `modes/mode-3-jd-comparison.md` (ENHANCE)
- **Section:** Phase 1, Step 1 - `extract_critical_requirements`

### Complete 17-Point Schema

```xml
<jd_parsing_schema_17_point>
  <!-- Company & Role Info (4 fields) -->
  <company>Employer name</company>
  <job_title>Role title</job_title>
  <location>Physical location or "Remote"</location>
  <work_lifestyle>Remote | On-Site | Hybrid</work_lifestyle>

  <!-- Work Conditions (4 fields) -->
  <remote_restrictions>State restrictions or "fake remote" indicators</remote_restrictions>
  <employee_type>Full-time | Part-time | Contract</employee_type>
  <travel_required>Travel percentage or frequency</travel_required>
  <clearance>Security clearance requirements</clearance>

  <!-- Compensation & Requirements (4 fields) -->
  <salary_range>Compensation range</salary_range>
  <required_experience>Years and type of experience</required_experience>
  <required_education>Degree requirements</required_education>
  <job_responsibilities>Array of core duties</job_responsibilities>

  <!-- Hard Skills (2 fields) -->
  <skills_needed>Array of REQUIRED hard skills (Python, SQL, AWS, etc.)</skills_needed>
  <skills_wanted>Array of PREFERRED hard skills</skills_wanted>

  <!-- Soft Skills (2 fields) -->
  <soft_skills_needed>Array of REQUIRED soft skills (Leadership, Communication, etc.)</soft_skills_needed>
  <soft_skills_wanted>Array of PREFERRED soft skills</soft_skills_wanted>

  <!-- Qualifications & Certifications (4 fields) -->
  <qualifications_needed>Array of required qualifications</qualifications_needed>
  <qualifications_wanted>Array of preferred qualifications</qualifications_wanted>
  <certifications_needed>Array of required certifications</certifications_needed>
  <certifications_wanted>Array of preferred certifications</certifications_wanted>
</jd_parsing_schema_17_point>
```

### Hard vs Soft Skills Distinction Rules

**Hard Skills (Technical/Measurable):**
- Programming languages (Python, Java, JavaScript, SQL)
- Tools and frameworks (JIRA, AWS, Docker, React, Tableau)
- Domain knowledge (HIPAA, GDPR, Agile, Six Sigma, SEO)
- Technical certifications (PMP, AWS Solutions Architect, CPA)

**Soft Skills (Interpersonal/Behavioral):**
- Communication (written, verbal, presentation, stakeholder management)
- Leadership (team management, mentoring, coaching, delegation)
- Collaboration (teamwork, cross-functional, conflict resolution)
- Work style (time management, adaptability, problem-solving, critical thinking)

**AI Classification Instruction:**
> "You MUST categorize each skill correctly. Misclassification affects blocking logic. When in doubt, technical/measurable = hard, interpersonal/behavioral = soft."

---

## Evidence-Based Gap Analysis (Enhanced)

### Requirement-by-Requirement Tracking

**Current State (v5.1):** Aggregate gap categories
**v6.0 State:** Individual requirement analysis with evidence citations

```javascript
// For EVERY requirement in JD, create an analysis entry:
{
  requirement: "Python programming",
  subcategory: "Skills Needed",
  importance: "Required",
  status: "Matched", // or "Partial" or "Missing"
  evidence: [
    {
      content: "Developed ETL pipelines using Python and Pandas",
      source: "Data Engineer | TechCorp"
    },
    {
      content: "Automated workflows with Python scripts (saved 20 hrs/week)",
      source: "Senior Analyst | StartupCo"
    }
  ],
  gap_rationale: "Strong evidence across multiple roles"
}
```

### Evidence Formatting Rules (CRITICAL)

**Schema Structure:**
```json
"evidence": [
  {
    "content": "Direct quote or achievement from resume",
    "source": "Company | Job Title"
  }
]
```

**Rules:**
1. **Separate Items:** Do not combine multiple achievements into one evidence block
2. **Mandatory Source:** Every evidence item MUST have a source in "Company | Title" format
3. **Clean Source:** NO prefixes like "Resume -", "Candidate -", "at" - just "Company | Title"
4. **No "Not found":** If no evidence exists, return empty array `[]` or `null`, NOT string "Not found"
5. **Exact Quotes:** Use verbatim resume text when possible, paraphrase only if needed for clarity

### Color-Coded Output Format

**Key/Legend (Display First):**
```
KEY: [MATCHED] (Green) | [PARTIAL] (Yellow) | [MISSING] (Red)
```

**Section Headers:**
```markdown
[HARD SKILLS - REQUIRED]
[MATCHED] Python
  Evidence:
  - "Developed ETL pipelines using Python and Pandas" (Data Engineer | TechCorp)
  - "Automated workflows with Python scripts" (Senior Analyst | StartupCo)

[PARTIAL] Machine Learning
  Evidence:
  - "Applied statistical models to forecast trends" (Data Analyst | StartupCo)
  Gap: Resume shows statistical analysis but not explicit ML frameworks (scikit-learn, TensorFlow)

[MISSING] Kubernetes
  Evidence: None found
  Gap: No container orchestration experience mentioned
```

**Sorting Order (Within Each Section):**
- Matched items first
- Partial items second
- Missing items last

---

## Blocking Gates (Restored from Legacy)

### Gate 1: Hard Skill Deficit

**Rule:**
```javascript
IF count(Missing Hard Skills) > count(Matched Hard Skills)
THEN BLOCK recommendations
```

**Output:**
```
⚠ CRITICAL SKILL DEFICIT DETECTED

You are missing 7 required hard skills, while only matching 3.

Missing: Kubernetes, Docker, Terraform, React, TypeScript, GraphQL, AWS Lambda
Matched: Python, SQL, Git

Recommendations have been suppressed. It is not strategic to apply for a role
where you lack the majority of mandatory technical requirements.
```

### Gate 2: Low Match Score

**Rule:**
```javascript
IF gapAnalysis.score < 30
THEN BLOCK recommendations
```

**Output:**
```
⚠ LOW MATCH SCORE DETECTED (<30)

Final Match Score: 24/100

Based on the analysis, this position has significant gaps compared to your profile.
Optimization is unlikely to bridge this gap effectively.

Recommendation: Focus on roles with 50+ match scores where optimization can be strategic.
```

### Gate 3: Location Mismatch (Already in v5.1)

**Keep existing logic from ADD_REMOTE_WORK_LOGIC.md:**
- On-site vs Remote conflicts
- State residency restrictions
- "Fake remote" detection
- Hybrid distance requirements

**Output:** (Already implemented in v5.1)

---

## Professional Summary Customization

### Dual-Mode Strategy (Per User Decision)

**Mode 1: Master Summary Generation**
- Generate ONE master summary per role during job history creation
- Stored in `<professional_summary>` section of job entry
- Generic but comprehensive (not JD-specific)
- Used as baseline for Mode 3 customization

**Mode 3: Per-JD Summary Customization**
- User can request JD-specific summary
- Takes master summary + JD keywords → tailored version
- NOT stored (ephemeral, generated on-demand)
- Presented as optimization recommendation

### Master Summary Requirements (Mode 1)

**Structure (3-4 sentences):**
1. **Role + Scope:** "Senior Product Manager with 8 years leading B2B SaaS products"
2. **Achievements + Metrics:** "Launched 12+ features generating $5M ARR, led teams of 10+"
3. **Hard Skills (2-3):** "Expert in Agile methodologies, JIRA, SQL, and data-driven decision-making"
4. **Soft Skills (1-2):** "Known for stakeholder communication and cross-functional collaboration"

**Example:**
```
Senior Product Manager with 8 years leading B2B SaaS products at Google and Salesforce.
Launched 12+ revenue-generating features ($5M ARR), managed roadmaps for 500K+ users,
and led cross-functional teams of 10+. Expert in Agile methodologies, JIRA, SQL, and
data-driven prioritization. Known for exceptional stakeholder communication and ability
to translate technical concepts for executive audiences.
```

### Per-JD Summary Customization (Mode 3)

**When to Trigger:**
- User explicitly requests: "Generate a customized professional summary for this JD"
- OR Mode 3 automatically offers after gap analysis (if match score >50)

**Customization Logic:**
1. Start with master summary from job history
2. Extract top 3-5 missing hard skills from JD that have "Partial" matches in resume
3. Replace generic hard skills with JD-specific keywords
4. Add JD-specific industry/domain terms
5. Maintain same metric/achievement structure

**Example:**
```
Original (Master):
"Expert in Agile methodologies, JIRA, SQL, and data-driven decision-making"

Customized for JD requiring (Python, Kubernetes, AWS):
"Expert in Python, AWS cloud architecture, Kubernetes orchestration, and data-driven decision-making"
```

**Presentation:**
```markdown
[PROFESSIONAL SUMMARY - CUSTOMIZED FOR THIS JD]

[Your customized summary here]

Changes Made:
- Added JD keywords: "Python", "AWS", "Kubernetes"
- Emphasized cloud architecture experience (from "Managed AWS deployments" achievement)
- Retained leadership scope and metrics
```

---

## Entry Point Routing Logic

### New File: `shared/entry-router.md`

**Purpose:** Detect user state and route to appropriate mode with confirmation

### Detection Logic (Hybrid Auto-Detect + Confirmation)

```xml
<entry_router>
  <step_1_analyze_context>
    <!-- Check for existing job history -->
    <check name="job_history_exists">
      IF file exists: claude_generated_job_history_summaries_v2.txt
      AND file is not empty
      THEN state.hasJobHistory = true
    </check>

    <!-- Check for job description in input -->
    <check name="jd_provided">
      IF user message contains job posting indicators:
        - "Job Description:", "JD:", "Role:", "Requirements:"
        - "Apply for:", "Position at [company]"
        - Length > 200 words with structured sections
      THEN state.hasJD = true
    </check>

    <!-- Check for resume file -->
    <check name="resume_uploaded">
      IF user uploads PDF/DOCX/TXT file
      OR provides resume text
      THEN state.hasResume = true
    </check>
  </step_1_analyze_context>

  <step_2_route_with_confirmation>
    <!-- Scenario 1: New User (No job history, resume provided) -->
    <scenario priority="1">
      <condition>state.hasResume = true AND state.hasJobHistory = false</condition>
      <auto_route>Mode 1 (Full Analysis)</auto_route>
      <confirmation_prompt>
        "I detected a new resume upload. I'll perform a comprehensive resume analysis
        and create your job history profile. This will take 3-5 minutes.

        After analysis, you can:
        - Optimize specific bullets (Mode 2)
        - Check fit for a job description (Mode 3)

        Proceed with full analysis?"
      </confirmation_prompt>
    </scenario>

    <!-- Scenario 2: Has Job History + JD (Most common) -->
    <scenario priority="2">
      <condition>state.hasJobHistory = true AND state.hasJD = true</condition>
      <auto_route>Mode 3 (JD Comparison)</auto_route>
      <confirmation_prompt>
        "I detected your job history and a job description. I'll analyze your fit
        for this role using the 17-point gap analysis system.

        This will compare your profile against:
        - Required/preferred hard skills
        - Required/preferred soft skills
        - Experience, education, certifications
        - Location/remote work compatibility

        Proceed with JD fit analysis?"
      </confirmation_prompt>
    </scenario>

    <!-- Scenario 3: Has Job History, wants bullet optimization -->
    <scenario priority="3">
      <condition>state.hasJobHistory = true AND user mentions "bullet", "optimize", "improve wording"</condition>
      <auto_route>Mode 2 (Bullet Optimization)</auto_route>
      <confirmation_prompt>
        "I'll optimize your resume bullets using your job history as context.

        Which bullets would you like me to improve? You can:
        - Paste specific bullets to optimize
        - Upload your current resume for bulk optimization

        Proceed?"
      </confirmation_prompt>
    </scenario>

    <!-- Scenario 4: Ambiguous (Has job history, unclear intent) -->
    <scenario priority="4">
      <condition>state.hasJobHistory = true AND state.hasJD = false</condition>
      <auto_route>None (Ask user)</auto_route>
      <clarification_prompt>
        "I see you have a job history on file. What would you like to do?

        1. Check fit for a specific job description (Mode 3)
        2. Optimize resume bullets (Mode 2)
        3. Re-analyze my resume with updated info (Mode 1)

        Please select 1, 2, or 3, or describe what you need."
      </clarification_prompt>
    </scenario>

    <!-- Scenario 5: No context at all (First interaction) -->
    <scenario priority="5">
      <condition>state.hasResume = false AND state.hasJobHistory = false</condition>
      <auto_route>None (Explain system)</auto_route>
      <welcome_prompt>
        "Welcome to the Resume Analyzer & Optimizer!

        I can help you:
        1. **Analyze your resume** - Get comprehensive feedback (Mode 1)
        2. **Optimize bullets** - Improve specific resume lines (Mode 2)
        3. **Check job fit** - Compare your resume to a job description (Mode 3)

        To get started, please upload your resume (PDF, DOCX, or paste text).

        If you have a specific job description you're targeting, include that too!"
      </welcome_prompt>
    </scenario>
  </step_2_route_with_confirmation>

  <step_3_execute_mode>
    <!-- After user confirms, execute the selected mode -->
    <!-- Pass state context to mode for personalized handling -->
  </step_3_execute_mode>
</entry_router>
```

### User Experience Flow

```
User uploads resume
       ↓
Router detects: New user, no job history
       ↓
Router suggests: "Run full analysis?"
       ↓
User confirms: "Yes"
       ↓
Mode 1 executes → Generates job history v2.0
       ↓
Mode 1 completes: "Analysis done! Next steps: 1) Optimize bullets, 2) Check job fit"
       ↓
User: "Here's a JD I want to apply for"
       ↓
Router detects: Has job history + JD
       ↓
Router suggests: "Run JD fit analysis?"
       ↓
User confirms: "Yes"
       ↓
Mode 3 executes → 17-point parsing → Gap analysis → Recommendations
```

---

## Implementation Sequence (Step-by-Step)

### Phase 1: Schema & Core Infrastructure (3 files)

**1.1 Create Job History Schema v2.0**
- **File:** `shared/job-history-v2-creation.md` (NEW)
- **Content:** Full 12-section schema with examples
- **Test:** Run Mode 1 on sample resume, verify v2.0 output format

**1.2 Create 17-Point JD Parsing Schema**
- **File:** `shared/jd-parsing-17-point.md` (NEW)
- **Content:** Complete parsing instructions + hard/soft skill classification rules
- **Test:** Parse sample JD, verify all 17 fields extracted

**1.3 Create Entry Point Router**
- **File:** `shared/entry-router.md` (NEW)
- **Content:** 5-scenario detection logic + confirmation prompts
- **Test:** Simulate 5 scenarios, verify correct routing

### Phase 2: Mode Enhancements (3 files modified)

**2.1 Enhance Mode 1 (Full Analysis)**
- **File:** `PROJECT-INSTRUCTIONS.md` (MODIFY)
- **Changes:**
  - Update job history creation to use v2.0 schema
  - Add professional summary generation (master summary)
  - Add hard/soft skill separation logic
  - Add education and certification extraction
  - Add "Next Steps" offer at end (route to Mode 2 or 3)
- **Test:** Analyze resume, verify job history v2.0 generated

**2.2 Enhance Mode 3 (JD Comparison)**
- **File:** `modes/mode-3-jd-comparison.md` (MODIFY)
- **Changes:**
  - Replace current JD extraction with 17-point schema
  - Add requirement-by-requirement gap tracking
  - Add evidence-based matching with citations
  - Add color-coded output formatting
  - Add blocking gates (hard skill deficit, low score)
  - Keep existing location blocking gate from v5.1
  - Add per-JD summary customization option
- **Test:** Run JD comparison, verify all 17 fields + evidence + blocking gates

**2.3 Update Mode 2 (Bullet Optimization)**
- **File:** `modes/mode-2-bullet-optimization.md` (MODIFY - MINOR)
- **Changes:**
  - Update to read from job history v2.0 (backward compatible)
  - Reference hard/soft skills arrays for keyword insertion
  - No major logic changes (already reads job history correctly)
- **Test:** Optimize bullets, verify v2.0 job history usage

### Phase 3: Integration & Documentation (2 files modified)

**3.1 Update PROJECT-INSTRUCTIONS.md**
- **File:** `PROJECT-INSTRUCTIONS.md` (MODIFY)
- **Changes:**
  - Add entry router reference at top
  - Update Mode 1 section with v2.0 schema
  - Update Mode 3 section with 17-point parsing
  - Add "How the System Works" section explaining routing
  - Update version to 6.0.0
- **Test:** Full end-to-end workflow (new user → analysis → JD comparison)

**3.2 Update CHANGELOG.md**
- **File:** `docs/CHANGELOG.md` (MODIFY)
- **Changes:**
  - Add v6.0.0 entry with breaking changes notice
  - Document all new features
  - Explain schema migration strategy (fresh start)
- **Test:** Verify version history is clear

### Phase 4: Testing & Validation

**4.1 Scenario Testing**
- Test all 5 router scenarios
- Test Mode 1 → Mode 2 transition
- Test Mode 1 → Mode 3 transition
- Test blocking gates (hard skill deficit, low score, location)
- Test evidence citation formatting

**4.2 Edge Case Testing**
- Resume with no education/certifications (should handle gracefully)
- JD with missing fields (should fill with "Not specified")
- Job history v1.0 compatibility (Mode 2 should still work)
- Ambiguous skills (AI must classify correctly)

---

## File Modification Plan (Surgical Changes)

### NEW Files (5 files)

1. **`shared/entry-router.md`**
   - Purpose: Entry point routing logic (5 scenarios)
   - Size: ~150 lines
   - Dependencies: None (standalone)

2. **`shared/job-history-v2-creation.md`**
   - Purpose: Job history schema v2.0 with 12 sections
   - Size: ~200 lines
   - Dependencies: Called by Mode 1

3. **`shared/jd-parsing-17-point.md`**
   - Purpose: 17-point JD parsing schema + hard/soft skill rules
   - Size: ~180 lines
   - Dependencies: Called by Mode 3

4. **`docs/plans/v6.0-complete_workflow_system.md`**
   - Purpose: This plan document (for future reference)
   - Size: ~400 lines
   - Dependencies: None (documentation)

5. **`claude_generated_job_history_summaries_v2.txt`**
   - Purpose: Output file for job history v2.0 data
   - Size: Variable (user data)
   - Dependencies: Generated by Mode 1

### MODIFIED Files (4 files)

1. **`PROJECT-INSTRUCTIONS.md`** (Lines ~1-800)
   - **Section 1 (NEW):** Add entry router reference (after line 15)
     ```xml
     <!-- Add after line 15 -->
     <entry_routing>
       Before executing any mode, consult shared/entry-router.md to detect user state
       and route to appropriate mode with confirmation.
     </entry_routing>
     ```
   - **Section 2 (MODIFY):** Update Mode 1 job history creation (lines 40-120)
     - Change: Reference `shared/job-history-v2-creation.md` instead of current schema
     - Add: Professional summary generation instructions
     - Add: Hard/soft skill separation logic
   - **Section 3 (NEW):** Add "Next Steps" offer at end of Mode 1 (after line 120)
     ```xml
     <mode_1_completion>
       After analysis, offer next steps:
       "Analysis complete! Next, you can:
       1. Optimize specific bullets (Mode 2)
       2. Check fit for a job description (Mode 3)"
     </mode_1_completion>
     ```
   - **Section 4 (MODIFY):** Update version number (line ~800)
     - Change: `v5.1.0` → `v6.0.0`

2. **`modes/mode-3-jd-comparison.md`** (Lines ~1-400)
   - **Section 1 (MODIFY):** Replace JD extraction (lines 80-120)
     - Change: Use `shared/jd-parsing-17-point.md` schema
     - Add: All 17 fields (company, location, skills_needed, soft_skills_needed, etc.)
   - **Section 2 (NEW):** Add requirement-by-requirement gap tracking (after line 150)
     - Add: Evidence array structure with source citations
     - Add: Status tracking (Matched/Partial/Missing)
   - **Section 3 (NEW):** Add color-coded output formatting (after line 180)
     - Add: KEY legend, section headers, sorting order
   - **Section 4 (NEW):** Add blocking gates (after line 220)
     - Add: Gate 1 (hard skill deficit)
     - Add: Gate 2 (low match score)
     - Keep: Gate 3 (location mismatch from v5.1)
   - **Section 5 (NEW):** Add per-JD summary customization (after line 280)
     - Add: Trigger logic and customization instructions

3. **`modes/mode-2-bullet-optimization.md`** (Lines ~1-200)
   - **Section 1 (MODIFY):** Update job history file reference (line ~30)
     - Change: Support BOTH v1.0 and v2.0 formats (backward compatible)
     - Add: Read from `claude_generated_job_history_summaries_v2.txt` if exists
     - Fallback: Read from `claude_generated_job_history_summaries.txt` if v2.0 not found
   - **Section 2 (MINOR):** Reference hard/soft skills arrays (line ~60)
     - Add: Use `<hard_skills_demonstrated>` for technical keyword insertion
     - Add: Use `<soft_skills_demonstrated>` for behavioral keyword insertion

4. **`docs/CHANGELOG.md`** (Lines ~1-100)
   - **Section 1 (NEW):** Add v6.0.0 entry (after line 10)
     - Document: Breaking changes (schema v2.0)
     - Document: All 6 major features
     - Document: Migration strategy (fresh start)

### FILES TO NOT TOUCH (Preserve Existing)

- `modes/mode-1-workflow.md` - Keep as reference, not active
- `wireframes/*.md` - All wireframes (historical reference)
- `docs/prompts/legacy-prompts/*.md` - Legacy documentation (keep for reference)
- `docs/lessons-learned/*.md` - Preserve all lessons learned
- `claude_generated_job_history_summaries.txt` - Keep v1.0 file (don't delete)
- `.gitignore` - Already configured correctly (legacy-prompts ignored)

---

## Potential Logic Issues & Workflow Gaps

### ⚠️ ISSUE 1: Job History v1.0 vs v2.0 Compatibility

**Problem:** User might have existing v1.0 job history, but Mode 2 expects v2.0 format.

**Risk:** Mode 2 bullet optimization breaks for users with v1.0 job histories.

**Solution:**
- Mode 2 must support BOTH formats (backward compatibility)
- Check for v2.0 file first, fallback to v1.0 if not found
- If v1.0 found, MODE 2 should recommend: "I see you have v1.0 job history. Consider re-running Mode 1 to upgrade to v2.0 for better keyword matching."

**Implementation:**
```xml
<job_history_loading logic="backward_compatible">
  IF file exists: claude_generated_job_history_summaries_v2.txt
    THEN use v2.0 schema (has hard/soft skills separation)
  ELSE IF file exists: claude_generated_job_history_summaries.txt
    THEN use v1.0 schema (combined skills_demonstrated)
    AND recommend upgrade to v2.0
  ELSE
    RETURN error: "No job history found. Run Mode 1 first."
</job_history_loading>
```

### ⚠️ ISSUE 2: Hard/Soft Skill Misclassification

**Problem:** AI might misclassify skills (e.g., "Project Management" as soft skill when it should be hard).

**Risk:** Blocking gates fail (hard skill deficit calculated incorrectly).

**Solution:**
- Provide explicit examples in `shared/jd-parsing-17-point.md`
- Add validation rule: If skill appears in both hard/soft arrays, flag for review
- When in doubt, default to HARD skill (safer for blocking gate logic)

**Validation Logic:**
```javascript
// After JD parsing, check for duplicates:
const duplicates = skillsNeeded.filter(s => softSkillsNeeded.includes(s));
if (duplicates.length > 0) {
  warn(`Ambiguous skills detected: ${duplicates.join(', ')}`);
  // Keep in hard skills array (safer default)
}
```

### ⚠️ ISSUE 3: Evidence Citation Source Format Inconsistency

**Problem:** User job histories might have inconsistent company/title formats.

**Risk:** Evidence sources display as "at Google" vs "Google | PM" vs "Product Manager at Google".

**Solution:**
- Standardize format during job history creation (Mode 1)
- Enforce "Company | Job Title" format in v2.0 schema
- Add post-processing in Mode 3 to normalize sources:
  ```javascript
  // Normalize evidence source format:
  source = source.replace(/^at\s+/, '').replace(/\s+at\s+/, ' | ');
  // "Product Manager at Google" → "Product Manager | Google"
  // Then flip: "Google | Product Manager"
  ```

### ⚠️ ISSUE 4: Entry Router False Positives (JD Detection)

**Problem:** User pastes long text that looks like JD but isn't (e.g., article, LinkedIn post).

**Risk:** Router auto-routes to Mode 3, but JD parsing fails.

**Solution:**
- Add JD validation heuristics in router:
  - Must contain keywords: "requirements", "qualifications", "responsibilities"
  - Must have structured sections (not just prose)
  - Must be >200 words but <5000 words (reasonable JD length)
- If validation fails, ask user: "This looks like a job description, but I'm not certain. Confirm: Is this a JD you want to analyze?"

**Implementation:**
```xml
<jd_validation>
  <heuristics>
    - Contains "requirements" OR "qualifications" OR "responsibilities"
    - Length between 200-5000 words
    - Has bullet points or numbered lists
    - Mentions company name or role title
  </heuristics>
  <fallback>
    IF validation fails THEN ask user for confirmation
  </fallback>
</jd_validation>
```

### ⚠️ ISSUE 5: Professional Summary Customization Timing

**Problem:** User might want per-JD summary BEFORE running full gap analysis (to include in application).

**Risk:** Current workflow: Gap analysis → Recommendations → Summary at end (too late).

**Solution:**
- Add option in Mode 3 Phase 1 (after JD parsing):
  ```xml
  <early_summary_offer>
    After JD parsing complete, ask:
    "Would you like me to generate a customized professional summary for this JD
    before running the full gap analysis? (Recommended if you're ready to apply)"

    IF yes: Generate summary → Present → Continue to gap analysis
    IF no: Proceed to gap analysis → Offer summary at end
  </early_summary_offer>
  ```

### ⚠️ ISSUE 6: Blocking Gate Too Aggressive

**Problem:** Hard skill deficit gate might block users who are close matches (e.g., 4 matched, 5 missing).

**Risk:** User misses strategic opportunities where slight optimization could bridge gap.

**Solution:**
- Add threshold tolerance: Only block if `missing > matched + 2`
- Add override option: "This role shows a hard skill deficit. However, if you believe you can address these gaps, I can continue. Proceed anyway?"

**Refined Logic:**
```javascript
const hardSkillDeficit = missingHard - matchedHard;
if (hardSkillDeficit > 2) {
  // Strong deficit - recommend blocking
  print("⚠ CRITICAL SKILL DEFICIT DETECTED");
  ask("Proceed anyway? (Not recommended)");
} else if (hardSkillDeficit > 0) {
  // Moderate deficit - warn but don't block
  print("⚠ Hard skill gap detected (not critical)");
  print("Recommendations will focus on addressing these gaps.");
}
```

### ⚠️ ISSUE 7: Education/Certifications Missing from Resume

**Problem:** User resume might not mention education or certifications (older resumes often omit these).

**Risk:** Job history v2.0 has empty `<education>` and `<certifications>` sections, looks incomplete.

**Solution:**
- Mode 1 should ASK user if sections are empty:
  ```xml
  <missing_sections_prompt>
    "I didn't find education or certifications in your resume.
    Do you have:
    - Degree(s) to add? (e.g., 'BS Computer Science, MIT, 2015')
    - Certifications? (e.g., 'PMP, AWS Solutions Architect')

    If yes, please provide them. If no, I'll mark as 'Not specified'."
  </missing_sections_prompt>
  ```
- Store "Not specified" vs empty array (semantic difference)

### ⚠️ ISSUE 8: Mode Transition Not Obvious to User

**Problem:** After Mode 1 completes, user might not know they can run Mode 2 or Mode 3.

**Risk:** User thinks session is over, doesn't leverage full workflow.

**Solution:**
- Mode 1 MUST end with explicit next steps offer (already in plan):
  ```
  "✅ Analysis complete! Your job history has been saved.

  Next steps - What would you like to do?
  1. Optimize specific resume bullets (Mode 2)
  2. Check fit for a job description (Mode 3)
  3. Export job history for review

  Just let me know, or paste a job description to start Mode 3!"
  ```

### ⚠️ ISSUE 9: Router Doesn't Handle Resume Updates

**Problem:** User runs Mode 1, then updates resume, wants to re-analyze.

**Risk:** Router sees existing job history and routes to Mode 2/3, not Mode 1.

**Solution:**
- Add explicit user commands to override routing:
  - User says "re-analyze my resume" → Force Mode 1 (append to job history)
  - User says "start fresh" → Delete v2.0 file, Force Mode 1
- Entry router should check for override keywords:
  ```xml
  <override_commands>
    - "re-analyze" → Force Mode 1
    - "start over" → Delete job history, Force Mode 1
    - "update job history" → Force Mode 1 (append mode)
  </override_commands>
  ```

### ⚠️ ISSUE 10: JD Parsing Fails for Non-Standard Formats

**Problem:** Some JDs are conversational (e.g., "We're looking for a rockstar dev who loves Python!") vs structured.

**Risk:** 17-point parser can't extract fields, returns empty arrays.

**Solution:**
- Add fallback extraction logic:
  - If structured extraction fails, use keyword-based extraction
  - Look for skills in free-form text (e.g., "Python" in sentence → add to skills_needed)
  - Flag as "low confidence" and warn user:
    ```
    "⚠ This JD format is non-standard. I've extracted what I could, but results
    may be incomplete. Recommend manually reviewing the gap analysis."
    ```

---

## Testing Checklist

### Functional Tests

- [ ] Mode 1 generates job history v2.0 with all 12 sections
- [ ] Mode 1 generates professional summary (master) correctly
- [ ] Mode 1 separates hard/soft skills accurately
- [ ] Mode 1 extracts education and certifications (if present)
- [ ] Mode 1 handles missing education/certifications gracefully
- [ ] Mode 2 reads v2.0 job history correctly
- [ ] Mode 2 falls back to v1.0 if v2.0 not found
- [ ] Mode 3 parses JD using 17-point schema (all fields)
- [ ] Mode 3 classifies hard vs soft skills correctly
- [ ] Mode 3 generates evidence citations with proper source format
- [ ] Mode 3 displays color-coded output (Matched/Partial/Missing)
- [ ] Mode 3 triggers hard skill deficit gate correctly
- [ ] Mode 3 triggers low match score gate correctly
- [ ] Mode 3 triggers location mismatch gate (v5.1 logic preserved)
- [ ] Mode 3 generates per-JD customized summary
- [ ] Entry router detects all 5 scenarios correctly
- [ ] Entry router confirms before executing mode
- [ ] Blocking gates can be overridden with user confirmation

### Edge Case Tests

- [ ] Resume with no education → Prompts user to add
- [ ] Resume with no certifications → Marks as "Not specified"
- [ ] JD with missing fields → Fills with "Not specified"
- [ ] JD in conversational format → Uses fallback extraction
- [ ] Ambiguous skill classification → Defaults to hard skill
- [ ] Evidence source formatting → Normalizes to "Company | Title"
- [ ] User with v1.0 job history → Mode 2 works, suggests upgrade
- [ ] User says "re-analyze" → Forces Mode 1 despite existing history
- [ ] Multiple jobs in resume → All jobs get v2.0 sections
- [ ] Very long resume (10+ jobs) → Handles without truncation

### Integration Tests

- [ ] Full workflow: New user → Mode 1 → Mode 3
- [ ] Full workflow: Existing user → Mode 2 → optimize bullets
- [ ] Full workflow: Mode 1 → User adds JD → Router routes to Mode 3
- [ ] Mode 3 blocking gate → User overrides → Continues analysis
- [ ] Mode 3 per-JD summary → Includes customized keywords
- [ ] Entry router → Ambiguous scenario → Asks user for clarification

---

## Success Metrics

**v6.0 is successful if:**

1. ✅ Job history v2.0 generated with all 12 sections (100% of Mode 1 runs)
2. ✅ Hard/soft skill separation accurate (>95% correct classifications)
3. ✅ 17-point JD parsing extracts all fields (100% structured JDs, >80% conversational JDs)
4. ✅ Evidence citations formatted correctly ("Company | Title" format, 100% of entries)
5. ✅ Blocking gates fire correctly (0 false positives, <5% false negatives)
6. ✅ Entry router routes correctly (100% of 5 standard scenarios)
7. ✅ Professional summaries customized with JD keywords (>90% of Mode 3 runs)
8. ✅ Mode 2 backward compatible (works with v1.0 job histories)
9. ✅ User transitions between modes seamlessly (no confusion)
10. ✅ No data loss during schema migration (v1.0 files preserved)

---

## Rollback Plan (If v6.0 Fails)

**If critical issues arise:**

1. **Preserve v5.1.0 branch:** Do not delete or force-push
2. **Revert to v5.1.0:** `git checkout v5.1-add_remote_validation`
3. **Document failure:** Add to lessons learned with root cause
4. **Incremental approach:** Instead of v6.0 all-at-once, do:
   - v5.2: Job history v2.0 only
   - v5.3: 17-point JD parsing only
   - v5.4: Entry router only
   - v6.0: Combine all features after validation

**Known risks for rollback scenario:**
- User has generated v2.0 job history → Must manually convert back to v1.0
- Solution: Provide conversion script or instructions

---

## Final Deliverables

**After implementation, these files will exist:**

### New Files (5)
1. `shared/entry-router.md`
2. `shared/job-history-v2-creation.md`
3. `shared/jd-parsing-17-point.md`
4. `docs/plans/v6.0-complete_workflow_system.md`
5. `claude_generated_job_history_summaries_v2.txt` (user data)

### Modified Files (4)
1. `PROJECT-INSTRUCTIONS.md` (v6.0.0)
2. `modes/mode-3-jd-comparison.md` (enhanced)
3. `modes/mode-2-bullet-optimization.md` (backward compatible)
4. `docs/CHANGELOG.md` (v6.0.0 entry)

### Preserved Files
- All v5.1.0 files (unchanged)
- `claude_generated_job_history_summaries.txt` (v1.0 preserved)
- All legacy prompts and documentation

**Total new code:** ~730 lines
**Total modified code:** ~150 lines
**Deletion:** 0 lines (surgical additions only)

---

## Questions for User Before Implementation

1. **Professional Summary Timing:** Should Mode 3 offer customized summary BEFORE or AFTER gap analysis? (Current plan: After, but Issue #5 suggests offering before)

2. **Blocking Gate Aggressiveness:** Should hard skill deficit gate allow override, or be absolute? (Current plan: Allow override with warning)

3. **JD Detection Sensitivity:** Should router ask for confirmation on ALL suspected JDs, or only when confidence is low? (Current plan: Confirm only on low confidence)

4. **Education/Certifications Prompting:** If resume has no education/certifications, should Mode 1 ASK user to provide, or just mark as "Not specified"? (Current plan: Ask user)

5. **Version Naming:** Confirm v6.0.0 is correct version number for these breaking changes? (Current assumption: Yes, per earlier conversation)

---

**Plan Status:** READY FOR REVIEW
**Created:** 2025-12-28
**Next Step:** User approval → Begin Phase 1 implementation
