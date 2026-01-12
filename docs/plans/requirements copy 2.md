# Optimize-My-Resume - Requirements Document

**Version:** 1.1.0
**Created:** January 11, 2026
**Status:**  DRAFT
**Purpose:** Map system functionality to Epics, Features, User Stories, and Business Rules for Jira integration.

---

## Numbering Schema

| Level | Format | Description |
|-------|--------|-------------|
| **Epic** | `X.0.0.0` | Top-level business capability |
| **Feature** | `X.Y.0.0` | A major functional component of an Epic |
| **User Story** | `X.Y.Z.0` | A user-facing deliverable within a Feature |
| **Business Rule** | `X.Y.Z.N` | A specific guideline or constraint for a User Story |
| **Sub-Rule** | `X.Y.Z.N.M` | A granular, checkable item within a Business Rule |

---

# EPIC 1.0.0.0: Resume Analyzer

**Description:** The core analysis engine that parses a resume, evaluates its quality, and generates a structured job history for downstream use by other epics.

**Goal:** Provide users with actionable feedback on their resume's structure, content quality, and ATS compatibility.

---

## Feature 1.1.0.0: Resume Ingestion & Parsing

**Description:** Accept user resumes in various formats and extract structured data for analysis.

### User Story 1.1.1.0: Upload Resume File
**As a** user, **I want to** upload my resume (PDF, DOCX, or TXT), **so that** the system can analyze its content.

#### Business Rules:
- **1.1.1.1:** System must accept `.pdf` file format.
- **1.1.1.2:** System must accept `.docx` file format.
- **1.1.1.3:** System must accept `.txt` file format.
- **1.1.1.4:** System must detect if uploaded content is a resume or a job description.
- **1.1.1.5:** If content type is ambiguous, system must ask for clarification using a two-step process.

### User Story 1.1.2.0: Parse Resume into Structured Data
**As a** system, **I want to** extract positions, dates, companies, and bullet points from the resume, **so that** I can analyze each component individually.

#### Business Rules:
- **1.1.2.1:** Extract `job_title` for each position.
- **1.1.2.2:** Extract `company` for each position.
- **1.1.2.3:** Extract `start_date` for each position.
- **1.1.2.4:** Extract `end_date` for each position.
- **1.1.2.5:** Calculate `duration` for each position.
- **1.1.2.6:** Parse remote/hybrid/on-site status from position descriptions.
- **1.1.2.7:** Extract hard skills from position content.
- **1.1.2.8:** Extract soft skills from position content.
- **1.1.2.9:** Classify skills using the 17-point classification rules.

---

## Feature 1.2.0.0: Resume Analysis Report

**Description:** Generate a comprehensive analysis report evaluating the resume's quality across multiple dimensions.

### User Story 1.2.1.0: Generate Executive Summary
**As a** user, **I want to** see a high-level summary of my resume's score and repair priorities, **so that** I understand the overall status at a glance.

#### Business Rules:
- **1.2.1.1:** Display an overall grade based on 4 scoring categories.
- **1.2.1.2:** Display BLOCKER count with ⛔ icon.
- **1.2.1.3:** Display RISK count with ⚠️ icon.
- **1.2.1.4:** Display TWEAK count with 🔧 icon.
- **1.2.1.5:** Display "The Verdict" as a single, concise summary sentence.
- **1.2.1.6:** Executive Summary must be the FIRST element in the report output.

### User Story 1.2.2.0: Score Resume on Four Categories
**As a** user, **I want to** see my resume scored on ATS Format, Content Quality, Quantifiable Impact, and Skills & Keywords, **so that** I know where to improve.

#### Business Rules:
- **1.2.2.1:** Calculate ATS Format Score.
  - **1.2.2.1.1:** Evaluate character limits (100-210 chars/bullet).
  - **1.2.2.1.2:** Evaluate header structure.
  - **1.2.2.1.3:** Evaluate contact info formatting.
- **1.2.2.2:** Calculate Content Quality Score.
  - **1.2.2.2.1:** Evaluate action verb strength.
  - **1.2.2.2.2:** Evaluate verb tense (must be past tense).
  - **1.2.2.2.3:** Evaluate verb category diversity.
- **1.2.2.3:** Calculate Quantifiable Impact Score.
  - **1.2.2.3.1:** Calculate percentage of bullets with metrics.
  - **1.2.2.3.2:** Target range: 70-80% of bullets should have metrics.
- **1.2.2.4:** Calculate Skills & Keywords Score.
  - **1.2.2.4.1:** Evaluate coverage of relevant industry terms.
  - **1.2.2.4.2:** Evaluate presence of certifications.

### User Story 1.2.3.0: Display Per-Bullet Audit
**As a** user, **I want to** see a detailed analysis table below each bullet point, **so that** I understand exactly what needs to be fixed.

#### Business Rules:
- **1.2.3.1:** Display Metrics check row in audit table.
- **1.2.3.2:** Display Action Verb check row in audit table.
- **1.2.3.3:** Display Character Count check row in audit table.
- **1.2.3.4:** Use Markdown table syntax for audit tables.
- **1.2.3.5:** Never use ASCII art for tables.
- **1.2.3.6:** Display `✅ Passed` for passing checks.
- **1.2.3.7:** Display `❌ Failed` for failing checks.
- **1.2.3.8:** Display `⚠️ Weak` for marginal checks.
- **1.2.3.9:** If any check fails, display a recommendation block using blockquote format `>`.
- **1.2.3.10:** Prefix RISK recommendations with `[⚠️ RISK]`.
- **1.2.3.11:** Prefix TWEAK recommendations with `[🔧 TWEAK]`.

### User Story 1.2.4.0: Display Bullet Color Coding
**As a** user, **I want to** see my action verbs color-coded by category, **so that** I can visually assess verb diversity.

#### Business Rules:
- **1.2.4.1:** Built category = Blue color.
- **1.2.4.2:** Lead category = Orange color.
- **1.2.4.3:** Managed category = Purple color.
- **1.2.4.4:** Improved category = Green color.
- **1.2.4.5:** Collaborate category = Pink color.
- **1.2.4.6:** Display format: `[Category] Verb ...` (e.g., `[Built] Architected...`).

### User Story 1.2.5.0: Display Metrics Indicator
**As a** user, **I want to** see a clear indicator next to each bullet showing if it has metrics, **so that** I know which bullets lack quantified impact.

#### Business Rules:
- **1.2.5.1:** Display `✓ [Has Metrics]` for bullets with quantified metrics.
- **1.2.5.2:** Display `- [No Metrics]` for bullets lacking metrics.
- **1.2.5.3:** Recognize percentage metrics (e.g., `50%`).
- **1.2.5.4:** Recognize currency metrics (e.g., `$2M`).
- **1.2.5.5:** Recognize approximation metrics (e.g., `~40`).
- **1.2.5.6:** Recognize multiplier metrics (e.g., `3x`).
- **1.2.5.7:** Recognize range metrics (e.g., `from 3s to 0.8s`).
- **1.2.5.8:** Recognize time-based metrics (e.g., `3 days`).
- **1.2.5.9:** Recognize volume-based metrics (e.g., `500 users`).

---

## Feature 1.3.0.0: Hiring Manager Perspective

**Description:** Analyze the resume from the viewpoint of an external hiring manager, inferring job titles based on actual work performed.

### User Story 1.3.1.0: Infer Job Titles from Achievements
**As a** user, **I want to** see what job titles a hiring manager would perceive based on my achievements, **so that** I can identify perception gaps.

#### Business Rules:
- **1.3.1.1:** IGNORE stated resume job titles.
- **1.3.1.2:** Infer titles based on responsibilities and impact.
- **1.3.1.3:** Use real market job titles (not creative internal titles).
- **1.3.1.4:** Assess seniority level based on team size.
- **1.3.1.5:** Assess seniority level based on budget responsibility.
- **1.3.1.6:** Assess seniority level based on strategic scope.
- **1.3.1.7:** Document reasoning with specific evidence from achievements.
- **1.3.1.8:** Provide confidence level: `High`.
- **1.3.1.9:** Provide confidence level: `Medium`.
- **1.3.1.10:** Provide confidence level: `Low`.

### User Story 1.3.2.0: Display Career Narrative
**As a** user, **I want to** see a synthesized view of my career progression based on the inferred titles, **so that** I understand my career trajectory.

---

## Feature 1.4.0.0: Job History Generation

**Description:** Generate a structured Job History document (v2.0 schema) that becomes the source of truth for all downstream operations.

### User Story 1.4.1.0: Generate Job History v2.0 Schema
**As a** system, **I want to** create a structured job history document from the parsed resume, **so that** it can be used for JD comparison and bullet generation.

#### Business Rules:
- **1.4.1.1:** Schema version must be `v2.0`.
- **1.4.1.2:** Include `metadata` section per position.
- **1.4.1.3:** Include `professional_summary` section per position.
- **1.4.1.4:** Include `core_responsibilities` section per position.
- **1.4.1.5:** Include `key_achievements` section per position.
- **1.4.1.6:** Include `hard_skills_demonstrated` section per position.
- **1.4.1.7:** Include `soft_skills_demonstrated` section per position.
- **1.4.1.8:** Include `tools_technologies` section per position.
- **1.4.1.9:** Include `impact_metrics` section per position.
- **1.4.1.10:** Include `industry_domain` section per position.
- **1.4.1.11:** Include `methodology` section per position.
- **1.4.1.12:** Include `strategic_decisions` section per position.
- **1.4.1.13:** Include `team_scope` section per position.
- **1.4.1.14:** Include `honest_limitations` section per position.
- **1.4.1.15:** `core_responsibilities` must be synthesized (not copied verbatim).
- **1.4.1.16:** `key_achievements` must contain specific wins with metrics.
- **1.4.1.17:** Separate `hard_skills_demonstrated` from `soft_skills_demonstrated`.

### User Story 1.4.2.0: Export Job History
**As a** user, **I want to** download my Job History in multiple formats, **so that** I can use it with different tools.

#### Business Rules:
- **1.4.2.1:** Support export to XML format (`.txt` extension).
- **1.4.2.2:** Support export to Markdown format (`.md` extension).
- **1.4.2.3:** Support export to ZIP archive (containing both formats).
- **1.4.2.4:** File naming format: `claude_generated_job_history_v[VERSION]_[YYYYMMDD].[ext]`.
- **1.4.2.5:** XML format is the source of truth for LLM consumption.
- **1.4.2.6:** Markdown format is for human presentation.

---

# EPIC 2.0.0.0: Narrative Generator

**Description:** Help users build and refine their professional narrative by discovering hidden achievements, metrics, and context through probing questions.

**Goal:** Enrich the user's Job History with more impactful, quantified achievements.

---

## Feature 2.1.0.0: Target Role Identification

**Description:** Understand what type of job the user is seeking.

### User Story 2.1.1.0: Ask User for Target Role
**As a** system, **I want to** ask the user what type of job they are looking for, **so that** I can tailor my probing questions and analysis.

#### Business Rules:
- **2.1.1.1:** Capture target job title (e.g., "Product Manager").
- **2.1.1.2:** Capture target industry (e.g., "B2B SaaS").
- **2.1.1.3:** Capture seniority level (e.g., "Senior").

---

## Feature 2.2.0.0: Metric Discovery

**Description:** Probing questions to uncover hidden metrics and achievements for each position.

### User Story 2.2.1.0: Ask Probing Questions for Each Position
**As a** user, **I want to** be asked clarifying questions about each role, **so that** I can uncover metrics and achievements I may have forgotten.

#### Business Rules:
- **2.2.1.1:** Ask about team size managed.
- **2.2.1.2:** Ask about budget managed.
- **2.2.1.3:** Ask about users impacted.
- **2.2.1.4:** Ask about time savings achieved.
- **2.2.1.5:** Ask about efficiency gains achieved.
- **2.2.1.6:** Ask about cost reductions achieved.
- **2.2.1.7:** Ask about cross-functional collaboration scope.
- **2.2.1.8:** Ask about tools and technologies used hands-on.
- **2.2.1.9:** Ask about challenges overcome.
- **2.2.1.10:** Ask about problems solved.

### User Story 2.2.2.0: Update Job History with Discovered Data
**As a** system, **I want to** update the Job History file with newly discovered metrics and achievements, **so that** future analyses use the enriched data.

#### Business Rules:
- **2.2.2.1:** Use surgical updates; do not overwrite existing content.
- **2.2.2.2:** Increment Job History version number using MAJOR/MINOR/PATCH rules.
- **2.2.2.3:** Validate updated file with `validate_job_history.py` script.

---

## Feature 2.3.0.0: Incremental Job History Updates

**Description:** Allow users to add, edit, or remove positions without full re-analysis.

### User Story 2.3.1.0: Add a New Position
**As a** user, **I want to** add a new job position to my existing Job History, **so that** I don't have to re-analyze my entire resume.

#### Business Rules:
- **2.3.1.1:** Collect all v2.0 schema fields for the new position.
- **2.3.1.2:** Insert position chronologically by date.
- **2.3.1.3:** Recalculate total years of experience.
- **2.3.1.4:** Recalculate skills inventory.
- **2.3.1.5:** Save updated file.
- **2.3.1.6:** Validate updated file.

### User Story 2.3.2.0: Edit an Existing Position
**As a** user, **I want to** edit specific fields of an existing position, **so that** I can correct or enhance my Job History.

### User Story 2.3.3.0: Remove a Position
**As a** user, **I want to** remove a position from my Job History, **so that** I can exclude irrelevant experience.

---

# EPIC 3.0.0.0: Am I Qualified? (Job Fit Analyzer)

**Description:** Compare a Job Description against the user's narrative/Job History and generate a fit assessment report.

**Goal:** Help users understand if they should apply to a specific job before investing time in customization.

---

## Feature 3.1.0.0: JD Parsing (17-Point System)

**Description:** Parse Job Descriptions into a structured format for comparison.

### User Story 3.1.1.0: Parse Job Description
**As a** system, **I want to** extract structured data from a pasted Job Description, **so that** I can compare it against the user's experience.

#### Business Rules:
- **3.1.1.1:** Extract Company Name from JD.
- **3.1.1.2:** Extract Job Title from JD.
- **3.1.1.3:** Extract Location from JD.
- **3.1.1.4:** Extract Remote/Hybrid/On-Site status from JD.
- **3.1.1.5:** Extract Required Skills from JD.
- **3.1.1.6:** Extract Preferred Skills from JD.
- **3.1.1.7:** Extract Required Qualifications from JD.
- **3.1.1.8:** Extract Preferred Qualifications from JD.
- **3.1.1.9:** Extract Education Requirements from JD.
- **3.1.1.10:** Extract Experience Level from JD.
- **3.1.1.11:** Extract Certifications from JD.
- **3.1.1.12:** Extract Industry from JD.
- **3.1.1.13:** Extract Salary Range from JD (if provided).
- **3.1.1.14:** Extract Red Flags from JD.
- **3.1.1.15:** Extract Application Deadline from JD (if provided).
- **3.1.1.16:** Categorize Required skills with 3x weight.
- **3.1.1.17:** Categorize Preferred skills with 2x weight.
- **3.1.1.18:** Categorize Optional skills with 1x weight.
- **3.1.1.19:** Validate JD is not a LinkedIn article (anti-false-positive).
- **3.1.1.20:** Validate JD is not irrelevant content (anti-false-positive).

---

## Feature 3.2.0.0: Fit Assessment

**Description:** Calculate a fit score comparing JD requirements to the user's Job History.

### User Story 3.2.1.0: Calculate Preliminary Fit Score
**As a** user, **I want to** see a percentage fit score comparing my experience to the JD requirements, **so that** I know if I should apply.

#### Business Rules:
- **3.2.1.1:** Core Qualifications weight = 50%.
- **3.2.1.2:** Critical Requirements weight = 30%.
- **3.2.1.3:** Preferred Qualifications weight = 20%.
- **3.2.1.4:** Required skills = 1.5x weight (3:2:1 Model).
- **3.2.1.5:** Preferred skills = 1.0x weight (3:2:1 Model).
- **3.2.1.6:** Optional skills = 0.5x weight (3:2:1 Model).
- **3.2.1.7:** Fit threshold 90-100% = Excellent (proceed automatically).
- **3.2.1.8:** Fit threshold 80-89% = Good (flag gaps, ask user).
- **3.2.1.9:** Fit threshold 75-79% = Weak (stop with brief summary).
- **3.2.1.10:** Fit threshold 0-74% = Poor (stop with ultra-brief summary).

### User Story 3.2.2.0: Apply Validation Penalties
**As a** system, **I want to** apply penalties for inflated experience or industry gaps, **so that** the fit score is accurate.

#### Business Rules:
- **3.2.2.1:** Portfolio Inflation Penalty: Personal projects counted as professional = -15 points.
- **3.2.2.2:** Portfolio Inflation Penalty: Maximum = -25 points.
- **3.2.2.3:** Adjacent Technical Misclassification Penalty: Support role as technical = -10 points.
- **3.2.2.4:** Adjacent Technical Misclassification Penalty: Maximum = -20 points.
- **3.2.2.5:** Documentation False Positive Penalty: Writing ABOUT technology = -5 points per match.
- **3.2.2.6:** Documentation False Positive Penalty: Maximum = -15 points per match.
- **3.2.2.7:** Industry Mismatch Penalty: Use industry transferability matrix.
- **3.2.2.8:** Role-Type Gap Penalty: Insufficient direct experience = -10 points.
- **3.2.2.9:** Role-Type Gap Penalty: Maximum = -30 points.

### User Story 3.2.3.0: Display Evidence Matching
**As a** user, **I want to** see which JD requirements I match, partially match, or miss, **so that** I understand my gaps.

#### Business Rules:
- **3.2.3.1:** Display `✅ MATCHED` for fully matched requirements.
- **3.2.3.2:** Display `🟡 PARTIAL` for partially matched requirements.
- **3.2.3.3:** Display `❌ MISSING` for unmatched requirements.
- **3.2.3.4:** For matches, cite the specific position from Job History.
- **3.2.3.5:** For matches, cite the specific evidence from Job History.
- **3.2.3.6:** For gaps, explain why the experience doesn't qualify.

---

## Feature 3.3.0.0: Blocking Gates

**Description:** Stop the process early if fundamental mismatches exist.

### User Story 3.3.1.0: Apply Location Blocking Gate
**As a** system, **I want to** stop analysis if there's a fundamental location mismatch, **so that** the user doesn't waste time on an incompatible role.

#### Business Rules:
- **3.3.1.1:** If JD requires On-site AND user is Remote-only → BLOCK.
- **3.3.1.2:** If JD has state residency restriction AND user is in a different state → BLOCK.
- **3.3.1.3:** Expand state abbreviations to full names (e.g., "AL" → "Alabama (AL)").

### User Story 3.3.2.0: Apply Hard Skill Deficit Blocking Gate
**As a** system, **I want to** block if too many required technical skills are missing, **so that** the user focuses on roles they can realistically obtain.

### User Story 3.3.3.0: Apply Low Match Score Blocking Gate
**As a** system, **I want to** block if the overall fit is below a critical threshold (e.g., 30%), **so that** the user doesn't pursue a poor-fit role.

---

## Feature 3.4.0.0: Keyword Handling

**Description:** Handle keyword optimization requests with validation against Job History.

### User Story 3.4.1.0: Validate Keywords Against Job History
**As a** system, **I want to** cross-reference JD keywords against the user's Job History, **so that** I only incorporate evidenced keywords.

#### Business Rules:
- **3.4.1.1:** Tier 1 evidence = Hands-on implementation (100% weight).
- **3.4.1.2:** Tier 2 evidence = Supervised exposure (50% weight).
- **3.4.1.3:** Tier 3 evidence = Documentation only (0% weight).
- **3.4.1.4:** Never force keywords without evidence (Keyword Evidence Principle).
- **3.4.1.5:** Ask user confirmation for keywords not in Job History.
- **3.4.1.6:** Output `✓ Incorporated` for evidenced keywords.
- **3.4.1.7:** Output `✗ Skipped` for unevidenced keywords.
- **3.4.1.8:** Output `? Requires Clarification` for ambiguous keywords.

---

# EPIC 4.0.0.0: Customize Resume

**Description:** Generate tailored resume content (bullets and professional summary) based on a specific Job Description and the user's narrative.

**Goal:** Produce optimized, ATS-friendly resume content ready for submission.

---

## Feature 4.1.0.0: Bullet Optimization

**Description:** Generate or improve individual resume bullets.

### User Story 4.1.1.0: Optimize Individual Bullets
**As a** user, **I want to** paste 1-5 bullets and receive optimized versions, **so that** I can strengthen my resume content.

#### Business Rules:
- **4.1.1.1:** Analyze each bullet for action verbs.
- **4.1.1.2:** Analyze each bullet for metrics.
- **4.1.1.3:** Analyze each bullet for clarity.
- **4.1.1.4:** Ask follow-up questions if metrics are missing.
- **4.1.1.5:** Generate 2-3 improved versions of each bullet.
- **4.1.1.6:** Show before/after comparison.

### User Story 4.1.2.0: Generate JD-Tailored Bullets
**As a** user, **I want to** generate new resume bullets tailored to a specific JD, **so that** my resume is customized for the application.

#### Business Rules:
- **4.1.2.1:** Bullets must use only keywords evidenced in Job History.
- **4.1.2.2:** Bullets must include Built verb category.
- **4.1.2.3:** Bullets must include Lead verb category.
- **4.1.2.4:** Bullets must include Managed verb category.
- **4.1.2.5:** Bullets must include Improved verb category.
- **4.1.2.6:** Bullets must include Collaborate verb category.
- **4.1.2.7:** Bullets must be minimum 100 characters.
- **4.1.2.8:** Bullets must be maximum 210 characters.
- **4.1.2.9:** Bullets must start with past-tense action verbs.
- **4.1.2.10:** Bullets must NOT start with gerunds (-ing forms).

---

## Feature 4.2.0.0: Quality Gate Enforcement

**Description:** Ensure all generated content passes quality validation before presentation.

### User Story 4.2.1.0: Run Automatic Quality Gate
**As a** system, **I want to** automatically validate generated bullets against quality rules, **so that** the user receives error-free output.

#### Business Rules:
- **4.2.1.1:** Step 1: Check for escaped characters (remove backslashes).
- **4.2.1.2:** Step 1: Check for gerunds at start of bullets.
- **4.2.1.3:** Step 1: Check for repeated phrases (>2 occurrences).
- **4.2.1.4:** Step 2: Verify Built verb category is represented.
- **4.2.1.5:** Step 2: Verify Lead verb category is represented.
- **4.2.1.6:** Step 2: Verify Managed verb category is represented.
- **4.2.1.7:** Step 2: Verify Improved verb category is represented.
- **4.2.1.8:** Step 2: Verify Collaborate verb category is represented.
- **4.2.1.9:** Step 3: Auto-regenerate bullets if issues found.
- **4.2.1.10:** Step 3: Maximum 3 regeneration iterations.
- **4.2.1.11:** Step 4: If issues persist after 3 iterations, present diagnostic output.
- **4.2.1.12:** Step 4: Offer user options to proceed, skip, or clarify.

---

## Feature 4.3.0.0: Professional Summary Generation

**Description:** Generate customized professional summaries.

### User Story 4.3.1.0: Generate Master Summary
**As a** user, **I want to** generate a comprehensive Master Summary from my Job History, **so that** I have a reusable professional overview.

#### Business Rules:
- **4.3.1.1:** Summary must be 2-3 paragraphs.
- **4.3.1.2:** Summary must include career overview.
- **4.3.1.3:** Summary must include expertise areas.
- **4.3.1.4:** Summary must include key achievements.
- **4.3.1.5:** Include 2-3 hard skills.
- **4.3.1.6:** Include 1-2 soft skills.
- **4.3.1.7:** Use metrics where available.
- **4.3.1.8:** Store Master Summary in Job History for reuse.

### User Story 4.3.2.0: Generate Per-JD Summary
**As a** user, **I want to** generate a customized summary tailored to a specific Job Description, **so that** my application is optimized.

#### Business Rules:
- **4.3.2.1:** Summary must be 3-4 sentences.
- **4.3.2.2:** Summary must be optimized for JD keywords.
- **4.3.2.3:** Summary is ephemeral (not stored in Job History).
- **4.3.2.4:** Include JD-specific keywords for ATS optimization.

---

## Feature 4.4.0.0: Export & Delivery

**Description:** Deliver final resume content in usable formats.

### User Story 4.4.1.0: Generate Plain Text Export
**As a** user, **I want to** receive my optimized bullets in a clean, copy-paste ready plain text format, **so that** I can easily paste them into my resume.

#### Business Rules:
- **4.4.1.1:** No bold markdown formatting (`**`).
- **4.4.1.2:** No italic markdown formatting (`_`).
- **4.4.1.3:** No code block formatting.
- **4.4.1.4:** Use plain text bullet character: `•`.
- **4.4.1.5:** Include character count per bullet.
- **4.4.1.6:** Include total word count.
- **4.4.1.7:** Include verb distribution breakdown.
- **4.4.1.8:** Maintain reverse chronological order (newest job first).
- **4.4.1.9:** Include secondary grammar check recommendation.

---

# EPIC 5.0.0.0: System Configuration & Guardrails

**Description:** The underlying rules, quality gates, and validation systems that ensure data integrity and consistent output.

**Goal:** Maintain system reliability and prevent hallucination, data loss, or quality regressions.

---

## Feature 5.1.0.0: Workflow Routing

**Description:** Intelligently route users to the correct phase based on their inputs and state.

### User Story 5.1.1.0: Detect User State
**As a** system, **I want to** detect what context the user has (resume, JD, Job History), **so that** I can route them to the correct workflow.

#### Business Rules:
- **5.1.1.1:** Detect `hasJobHistory` state.
- **5.1.1.2:** Detect `hasJD` state.
- **5.1.1.3:** Detect `hasResume` state.
- **5.1.1.4:** Routing Scenario: New User.
- **5.1.1.5:** Routing Scenario: JD Comparison.
- **5.1.1.6:** Routing Scenario: Bullet Optimization.
- **5.1.1.7:** Routing Scenario: Ambiguous Intent.
- **5.1.1.8:** Routing Scenario: First Interaction.
- **5.1.1.9:** Routing Scenario: Incremental Update.
- **5.1.1.10:** Routing Scenario: Re-Comparison.
- **5.1.1.11:** Routing Scenario: Ambiguous Input.
- **5.1.1.12:** Confirm with user before proceeding.
- **5.1.1.13:** Handle override command: "re-analyze".
- **5.1.1.14:** Handle override command: "start fresh".
- **5.1.1.15:** Handle override command: "add position".

---

## Feature 5.2.0.0: System Guardrails

**Description:** 28+ quality and safety guardrails to prevent errors.

### User Story 5.2.1.0: Enforce Metric Traceability
**As a** system, **I want to** verify that every metric I include can be traced to a specific position in the Job History, **so that** I don't hallucinate achievements.

#### Business Rules:
- **5.2.1.1:** For every metric, identify the Position ID source.
- **5.2.1.2:** If metric appears in a different position block, it's a HALLUCINATION.
- **5.2.1.3:** Remove hallucinated metrics.

### User Story 5.2.2.0: Enforce Chronological Validation
**As a** system, **I want to** verify positions are sorted by End Date descending (most recent first), **so that** the resume follows standard conventions.

### User Story 5.2.3.0: Enforce Limitation Compliance
**As a** system, **I want to** cross-reference generated content against the `<honest_limitations>` section of each position, **so that** I don't claim skills the user doesn't have.

### User Story 5.2.4.0: Enforce Bullet Grouping Verification
**As a** system, **I want to** verify bullets are properly grouped by position and not mixed, **so that** the output is correctly organized.

---

## Feature 5.3.0.0: Template System

**Description:** Ensure cross-LLM consistency with standardized templates.

### User Story 5.3.1.0: Use Standardized Templates for Job History
**As a** system, **I want to** generate Job History documents using a standardized XML schema and template, **so that** any LLM produces identical structure.

#### Business Rules:
- **5.3.1.1:** Reference `templates/job_history_template.xml` for structure.
- **5.3.1.2:** Reference `templates/LLM_GENERATION_INSTRUCTIONS.md` for consistency.
- **5.3.1.3:** Validate output with `scripts/validate_job_history.py`.
- **5.3.1.4:** Never use `key_accomplishments` (use `key_achievements`).
- **5.3.1.5:** Never use synonym tag names that deviate from schema.

---

# EPIC 6.0.0.0: GUI Web Artifact

**Description:** A React-based web component rendered within Claude.ai as an "Artifact" that provides an interactive GUI for Phase 1 Resume Analysis.

**Goal:** Provide a visual, user-friendly interface for analyzing resumes without requiring users to read raw text output.

---

## Feature 6.1.0.0: Phase 1 Resume Analyzer Artifact

**Description:** A single-file React component (`Phase1ResumeAnalyzer.jsx`) that provides a complete GUI for Phase 1 analysis.

### User Story 6.1.1.0: Display Model Selection
**As a** user, **I want to** select which Claude model to use (Haiku, Sonnet, Opus), **so that** I can balance speed, quality, and token cost.

#### Business Rules:
- **6.1.1.1:** Available model: `claude-haiku-4`.
- **6.1.1.2:** Available model: `claude-sonnet-4` (default).
- **6.1.1.3:** Available model: `claude-opus-4` (Pro only).
- **6.1.1.4:** Analyze button DISABLED until model is selected.
- **6.1.1.5:** Display ⭐ Pro only indicator for Opus.
- **6.1.1.6:** Auto-switch to Sonnet if free user selects Opus.

### User Story 6.1.2.0: Accept Resume Input
**As a** user, **I want to** paste my resume into a text area, **so that** the system can analyze it.

#### Business Rules:
- **6.1.2.1:** Provide a large textarea for resume input.
- **6.1.2.2:** Show character count.
- **6.1.2.3:** Provide placeholder text with instructions.

### User Story 6.1.3.0: Display Analysis Results
**As a** user, **I want to** see a visual report of my resume analysis, **so that** I can understand the findings without reading raw data.

#### Business Rules:
- **6.1.3.1:** Display Executive Summary with scores.
- **6.1.3.2:** Display Action Verb Diversity as a visual bar chart.
- **6.1.3.3:** Display Action Verb Diversity with color coding.
- **6.1.3.4:** Display Position-by-Position Review.
- **6.1.3.5:** Display collapsible sections for each position.
- **6.1.3.6:** Display Per-Bullet Audit Tables.
- **6.1.3.7:** Display Metrics check in audit table.
- **6.1.3.8:** Display Verb check in audit table.
- **6.1.3.9:** Display Length check in audit table.
- **6.1.3.10:** Display Prioritized Repairs Summary.
- **6.1.3.11:** Display severity icons in Repairs Summary.

### User Story 6.1.4.0: Handle Errors Gracefully
**As a** user, **I want to** see helpful error messages when analysis fails, **so that** I know how to resolve the issue.

#### Business Rules:
- **6.1.4.1:** Display Attempt 1/3 error message.
- **6.1.4.2:** Display Attempt 2/3 error message.
- **6.1.4.3:** Display Attempt 3/3 error message with detailed guidance.
- **6.1.4.4:** JSON Truncation Error: Guide user to shorten resume.
- **6.1.4.5:** JSON Truncation Error: Offer to analyze in parts.
- **6.1.4.6:** Rate Limit Error: Display countdown to reset time.
- **6.1.4.7:** Permission Error: Auto-switch to Sonnet.

---

## Feature 6.2.0.0: Token Usage Guidance

**Description:** Educate users about token costs and help them optimize their daily budget.

### User Story 6.2.1.0: Display Token Information
**As a** user, **I want to** understand how many tokens each model uses, **so that** I can plan my usage across multiple phases.

#### Business Rules:
- **6.2.1.1:** Provide collapsible "Token usage info" section.
- **6.2.1.2:** Show Haiku token estimate: ~3K tokens.
- **6.2.1.3:** Show Sonnet token estimate: ~5K tokens.
- **6.2.1.4:** Show Opus token estimate: ~8K tokens.
- **6.2.1.5:** Show Free tier limit: 500K tokens per 5-hour window.
- **6.2.1.6:** Provide multi-phase strategy tip.

---

## Feature 6.3.0.0: Visual Components

**Description:** UI elements for enhanced visualization of analysis data.

### User Story 6.3.1.0: Display Color-Coded Action Verbs
**As a** user, **I want to** see my action verbs color-coded by category, **so that** I can quickly assess verb diversity.

#### Business Rules:
- **6.3.1.1:** Built = Blue (`#3B82F6`).
- **6.3.1.2:** Lead = Orange (`#FBBF24`).
- **6.3.1.3:** Managed = Purple (`#A855F7`).
- **6.3.1.4:** Improved = Green (`#10B981`).
- **6.3.1.5:** Collaborate = Pink (`#EC4899`).

### User Story 6.3.2.0: Display Verb Distribution Chart
**As a** user, **I want to** see a bar chart showing my verb distribution, **so that** I can identify over/under-represented categories.

#### Business Rules:
- **6.3.2.1:** Display visual progress bars for each category.
- **6.3.2.2:** Well-balanced indicator: 13-27%.
- **6.3.2.3:** Under-represented indicator: <13%.
- **6.3.2.4:** Over-represented indicator: >27%.
- **6.3.2.5:** Critical gap warning if any category is <5%.

### User Story 6.3.3.0: Display Severity Icons
**As a** user, **I want to** see visual icons for issue severity, **so that** I can prioritize my fixes.

#### Business Rules:
- **6.3.3.1:** Blocker = Red XCircle icon (⛔).
- **6.3.3.2:** Risk = Yellow AlertTriangle icon (⚠️).
- **6.3.3.3:** Tweak = Blue AlertCircle icon (🔧).

---

# EPIC 7.0.0.0: Modular Phase Protocols

**Description:** A set of standalone Markdown files in the `/phases/` directory that define the detailed logic for each workflow phase. These are loaded by the main PROJECT-INSTRUCTIONS as needed.

**Goal:** Modularize complex logic to reduce token consumption and improve maintainability.

---

## Feature 7.1.0.0: Phase 1 Foundation Modules

**Description:** Modules for resume analysis and job history creation.

### User Story 7.1.1.0: Entry Router Protocol
**As a** system, **I want to** route incoming user input to the correct workflow, **so that** the user receives the appropriate response.
- **File:** `phases/phase-1/entry-router.md`

#### Business Rules:
- **7.1.1.1:** Routing scenario: New User.
- **7.1.1.2:** Routing scenario: JD Comparison.
- **7.1.1.3:** Routing scenario: Bullet Optimization.
- **7.1.1.4:** Routing scenario: Ambiguous Intent.
- **7.1.1.5:** Routing scenario: First Interaction.
- **7.1.1.6:** Detect `hasJobHistory` state.
- **7.1.1.7:** Detect `hasJD` state.
- **7.1.1.8:** Detect `hasResume` state.
- **7.1.1.9:** Confirm with user before proceeding.

### User Story 7.1.2.0: JD Parsing Protocol (17-Point System)
**As a** system, **I want to** parse a Job Description into 17 structured data points, **so that** I can compare it against the user's experience.
- **File:** `phases/phase-1/jd-parsing-17-point.md`

#### Business Rules:
- **7.1.2.1:** Extract Company Name.
- **7.1.2.2:** Extract Job Title.
- **7.1.2.3:** Extract Location.
- **7.1.2.4:** Extract Required Skills.
- **7.1.2.5:** Extract Preferred Skills.
- **7.1.2.6:** Extract Education requirements.
- **7.1.2.7:** Categorize Required skills with weight.
- **7.1.2.8:** Categorize Preferred skills with weight.
- **7.1.2.9:** Categorize Optional skills with weight.
- **7.1.2.10:** Separate hard skills from soft skills.

### User Story 7.1.3.0: Job History v2.0 Creation Protocol
**As a** system, **I want to** generate a structured Job History document from parsed resume data, **so that** it can be used for JD comparison and bullet generation.
- **File:** `phases/phase-1/job-history-v2-creation.md`

#### Business Rules:
- **7.1.3.1:** 12-section schema per position.
- **7.1.3.2:** Version history tracking.
- **7.1.3.3:** Evidence matching integration.
- **7.1.3.4:** Hard skill classification.
- **7.1.3.5:** Soft skill classification.

---

## Feature 7.2.0.0: Phase 2 Core Integration Modules

**Description:** Modules for evidence matching and gap analysis.

### User Story 7.2.1.0: Evidence Matching Protocol
**As a** system, **I want to** match JD requirements against the user's Job History with evidence citations, **so that** the user understands their gaps and strengths.
- **File:** `phases/phase-2/evidence-matching.md`

#### Business Rules:
- **7.2.1.1:** Perform requirement-by-requirement gap analysis.
- **7.2.1.2:** Provide evidence citations with Position ID.
- **7.2.1.3:** Provide evidence citations with Bullet Number.
- **7.2.1.4:** Display `MATCHED` match type.
- **7.2.1.5:** Display `PARTIAL` match type.
- **7.2.1.6:** Display `MISSING` match type.
- **7.2.1.7:** Apply skill priority weights (3:2:1 model).

---

## Feature 7.3.0.0: Phase 3 Router & Workflow Modules

**Description:** Modules for workflow routing and incremental updates.

### User Story 7.3.1.0: Workflow Router Protocol
**As a** system, **I want to** route users to the correct phase/workflow based on their input and state, **so that** they receive the appropriate response.
- **File:** `phases/phase-3/workflow-router.md`

#### Business Rules:
- **7.3.1.1:** Support 8 routing scenarios.
- **7.3.1.2:** Context state: `hasJobHistory`.
- **7.3.1.3:** Context state: `hasJD`.
- **7.3.1.4:** Context state: `hasResume`.
- **7.3.1.5:** Context state: `userIntent`.
- **7.3.1.6:** JD validation heuristics (anti-false-positive).
- **7.3.1.7:** Override command: "re-analyze".
- **7.3.1.8:** Override command: "start fresh".
- **7.3.1.9:** Override command: "add position".

### User Story 7.3.2.0: Incremental Updates Protocol
**As a** user, **I want to** add, edit, or remove positions from my Job History without re-analyzing my entire resume, **so that** I can make quick updates.
- **File:** `phases/phase-3/incremental-updates.md`

#### Business Rules:
- **7.3.2.1:** Add workflow: Collect v2.0 fields.
- **7.3.2.2:** Add workflow: Insert chronologically.
- **7.3.2.3:** Add workflow: Recalculate aggregates.
- **7.3.2.4:** Add workflow: Save file.
- **7.3.2.5:** Edit workflow: Select position.
- **7.3.2.6:** Edit workflow: Show current values.
- **7.3.2.7:** Edit workflow: Update fields.
- **7.3.2.8:** Edit workflow: Recalculate.
- **7.3.2.9:** Edit workflow: Save file.
- **7.3.2.10:** Remove workflow: Select position.
- **7.3.2.11:** Remove workflow: Confirm deletion.
- **7.3.2.12:** Remove workflow: Delete position.
- **7.3.2.13:** Remove workflow: Recalculate aggregates.
- **7.3.2.14:** Remove workflow: Save file.

### User Story 7.3.3.0: Re-Comparison Protocol
**As a** user, **I want to** re-run a JD comparison after updating my Job History, **so that** I can see what improved or regressed.
- **File:** `phases/phase-3/re-comparison.md`

#### Business Rules:
- **7.3.3.1:** Load cached JD (if available).
- **7.3.3.2:** Prompt for new JD paste (if not cached).
- **7.3.3.3:** Run evidence matcher with current Job History.
- **7.3.3.4:** Generate diff output: Improvements.
- **7.3.3.5:** Generate diff output: Regressions.
- **7.3.3.6:** Generate diff output: No Change.
- **7.3.3.7:** Show score delta (e.g., "72% → 81%").

---

## Feature 7.4.0.0: Phase 4 Summary & Polish Modules

**Description:** Modules for professional summary generation.

### User Story 7.4.1.0: Summary Generation Protocol
**As a** system, **I want to** generate professional summaries (Master and Per-JD), **so that** users have reusable content for applications.
- **File:** `phases/phase-4/summary-generation.md`

#### Business Rules:
- **7.4.1.1:** Master Summary: 2-3 paragraphs.
- **7.4.1.2:** Master Summary: Store in Job History.
- **7.4.1.3:** Per-JD Summary: 3-4 sentences.
- **7.4.1.4:** Per-JD Summary: Optimize for JD keywords.
- **7.4.1.5:** Per-JD Summary: Ephemeral (not stored).
- **7.4.1.6:** Keyword optimization based on JD requirements.
- **7.4.1.7:** Summary Abstraction Guardrail: No sentence can share >50% keywords with any bullet.

---

# Appendix: Traceability Matrix

| Epic | Feature | Existing System Component |
|------|---------|---------------------------|
| 1.0.0.0 | Resume Analyzer | Phase 1: Full Resume Analysis |
| 2.0.0.0 | Narrative Generator | `phases/phase-1/job-history-v2-creation.md` |
| 3.0.0.0 | Am I Qualified? | Phase 3: JD Comparison, `phases/phase-2/evidence-matching.md` |
| 4.0.0.0 | Customize Resume | Phase 2: Bullet Optimization, `phases/phase-4/summary-generation.md` |
| 5.0.0.0 | System Configuration | `phases/phase-3/workflow-router.md`, `quality_assurance_rules`, `system_guardrails` |
| 6.0.0.0 | GUI Web Artifact | `Phase1ResumeAnalyzer.jsx`, `artifact-creation-instructions.md`, `Project-GUI-Instructions.md` |
| 7.0.0.0 | Modular Phase Protocols | `/phases/phase-1/`, `/phases/phase-2/`, `/phases/phase-3/`, `/phases/phase-4/` |

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | January 11, 2026 | AI Assistant | Initial draft based on PROJECT-INSTRUCTIONS.md analysis |
| 1.1.0 | January 11, 2026 | AI Assistant | Expanded business rules to individual checkable items; added Sub-Rule level to numbering schema |
