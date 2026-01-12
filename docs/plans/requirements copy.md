# Optimize-My-Resume - Requirements Document

**Version:** 1.0.0
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
- **1.1.1.1:** System must accept `.pdf`, `.docx`, and `.txt` file formats.
- **1.1.1.2:** System must detect if uploaded content is a resume or a job description.
- **1.1.1.3:** If content type is ambiguous, system must ask for clarification using a two-step process.

### User Story 1.1.2.0: Parse Resume into Structured Data
**As a** system, **I want to** extract positions, dates, companies, and bullet points from the resume, **so that** I can analyze each component individually.

#### Business Rules:
- **1.1.2.1:** Extract metadata for each position: `job_title`, `company`, `start_date`, `end_date`, `duration`.
- **1.1.2.2:** Parse remote/hybrid/on-site status from position descriptions.
- **1.1.2.3:** Extract and separate hard skills from soft skills using the 17-point classification rules.

---

## Feature 1.2.0.0: Resume Analysis Report

**Description:** Generate a comprehensive analysis report evaluating the resume's quality across multiple dimensions.

### User Story 1.2.1.0: Generate Executive Summary
**As a** user, **I want to** see a high-level summary of my resume's score and repair priorities, **so that** I understand the overall status at a glance.

#### Business Rules:
- **1.2.1.1:** Display an overall grade based on 4 scoring categories.
- **1.2.1.2:** Display "Prioritized Repairs" counts: `[⛔ BLOCKER: X] [⚠️ RISK: X] [🔧 TWEAK: X]`.
- **1.2.1.3:** Display "The Verdict" as a single, concise summary sentence.
- **1.2.1.4:** Executive Summary must be the FIRST element in the report output.

### User Story 1.2.2.0: Score Resume on Four Categories
**As a** user, **I want to** see my resume scored on ATS Format, Content Quality, Quantifiable Impact, and Skills & Keywords, **so that** I know where to improve.

#### Business Rules:
- **1.2.2.1:** **ATS Format Score:** Evaluate character limits (100-210 chars/bullet), header structure, and contact info formatting.
- **1.2.2.2:** **Content Quality Score:** Evaluate action verb strength, verb tense (past tense), and verb category diversity.
- **1.2.2.3:** **Quantifiable Impact Score:** Percentage of bullets with metrics (%, $, numbers, time). Target: 70-80%.
- **1.2.2.4:** **Skills & Keywords Score:** Coverage of relevant industry terms and certifications.

### User Story 1.2.3.0: Display Per-Bullet Audit
**As a** user, **I want to** see a detailed analysis table below each bullet point, **so that** I understand exactly what needs to be fixed.

#### Business Rules:
- **1.2.3.1:** Each bullet displays a 3-row audit table: Metrics, Action Verb, Character Count.
- **1.2.3.2:** Use Markdown table syntax; never use ASCII art.
- **1.2.3.3:** Status indicators: `✅ Passed`, `❌ Failed`, `⚠️ Weak`.
- **1.2.3.4:** If any check fails, display a recommendation block using blockquote format `>`.
- **1.2.3.5:** Prefix recommendations with severity: `[⚠️ RISK]` or `[🔧 TWEAK]`.

### User Story 1.2.4.0: Display Bullet Color Coding
**As a** user, **I want to** see my action verbs color-coded by category, **so that** I can visually assess verb diversity.

#### Business Rules:
- **1.2.4.1:** **Built (Blue):** Creates new systems/products/processes.
- **1.2.4.2:** **Lead (Orange):** Drives initiatives, guides teams.
- **1.2.4.3:** **Managed (Purple):** Oversees resources, coordinates operations.
- **1.2.4.4:** **Improved (Green):** Optimizes and enhances existing systems.
- **1.2.4.5:** **Collaborate (Pink):** Partners cross-functionally, works with teams.
- **1.2.4.6:** Format: `[Category] Verb ...` (e.g., `[Built] Architected...`).

### User Story 1.2.5.0: Display Metrics Indicator
**As a** user, **I want to** see a clear indicator next to each bullet showing if it has metrics, **so that** I know which bullets lack quantified impact.

#### Business Rules:
- **1.2.5.1:** `✓ [Has Metrics]`: Bullet contains quantified metric(s).
- **1.2.5.2:** `- [No Metrics]`: Bullet lacks quantified metrics.
- **1.2.5.3:** Recognized metric types: percentages (`%`), currency (`$`), approximations (`~`), multipliers (`x`), ranges (`from X to Y`), time-based, volume-based.

---

## Feature 1.3.0.0: Hiring Manager Perspective

**Description:** Analyze the resume from the viewpoint of an external hiring manager, inferring job titles based on actual work performed.

### User Story 1.3.1.0: Infer Job Titles from Achievements
**As a** user, **I want to** see what job titles a hiring manager would perceive based on my achievements, **so that** I can identify perception gaps.

#### Business Rules:
- **1.3.1.1:** IGNORE stated resume job titles; infer based on responsibilities and impact.
- **1.3.1.2:** Use real market job titles, not creative internal titles.
- **1.3.1.3:** Assess seniority level based on team size, budget, and strategic scope.
- **1.3.1.4:** Document reasoning with specific evidence from achievements.
- **1.3.1.5:** Provide confidence level: `High`, `Medium`, or `Low`.

### User Story 1.3.2.0: Display Career Narrative
**As a** user, **I want to** see a synthesized view of my career progression based on the inferred titles, **so that** I understand my career trajectory.

---

## Feature 1.4.0.0: Job History Generation

**Description:** Generate a structured Job History document (v2.0 schema) that becomes the source of truth for all downstream operations.

### User Story 1.4.1.0: Generate Job History v2.0 Schema
**As a** system, **I want to** create a structured job history document from the parsed resume, **so that** it can be used for JD comparison and bullet generation.

#### Business Rules:
- **1.4.1.1:** Schema version: `v2.0`.
- **1.4.1.2:** Required sections per position: `metadata`, `professional_summary`, `core_responsibilities`, `key_achievements`, `hard_skills_demonstrated`, `soft_skills_demonstrated`, `tools_technologies`, `impact_metrics`, `industry_domain`, `methodology`, `strategic_decisions`, `team_scope`, `honest_limitations`.
- **1.4.1.3:** `core_responsibilities` must be synthesized (not copied verbatim from resume).
- **1.4.1.4:** `key_achievements` must contain specific wins with metrics.
- **1.4.1.5:** Separate `hard_skills_demonstrated` from `soft_skills_demonstrated`.

### User Story 1.4.2.0: Export Job History
**As a** user, **I want to** download my Job History in multiple formats, **so that** I can use it with different tools.

#### Business Rules:
- **1.4.2.1:** Export formats: XML (`.txt`), Markdown (`.md`), ZIP (both).
- **1.4.2.2:** File naming: `claude_generated_job_history_v[VERSION]_[YYYYMMDD].[ext]`.
- **1.4.2.3:** XML format is the source of truth for LLM consumption.
- **1.4.2.4:** Markdown format is for human presentation.

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
- **2.1.1.1:** Capture target job title (e.g., "Product Manager," "Software Engineer").
- **2.1.1.2:** Capture target industry (e.g., "B2B SaaS," "FinTech").
- **2.1.1.3:** Capture seniority level (e.g., "Senior," "Manager").

---

## Feature 2.2.0.0: Metric Discovery

**Description:** Probing questions to uncover hidden metrics and achievements for each position.

### User Story 2.2.1.0: Ask Probing Questions for Each Position
**As a** user, **I want to** be asked clarifying questions about each role, **so that** I can uncover metrics and achievements I may have forgotten.

#### Business Rules:
- **2.2.1.1:** For each position, ask about: team size, budget managed, users impacted, time savings, efficiency gains, cost reductions.
- **2.2.1.2:** Ask about cross-functional collaboration scope.
- **2.2.1.3:** Ask about tools and technologies used hands-on.
- **2.2.1.4:** Ask about challenges overcome and problems solved.

### User Story 2.2.2.0: Update Job History with Discovered Data
**As a** system, **I want to** update the Job History file with newly discovered metrics and achievements, **so that** future analyses use the enriched data.

#### Business Rules:
- **2.2.2.1:** Use surgical updates; do not overwrite existing content.
- **2.2.2.2:** Increment Job History version number (MAJOR/MINOR/PATCH rules).
- **2.2.2.3:** Validate updated file with `validate_job_history.py` script.

---

## Feature 2.3.0.0: Incremental Job History Updates

**Description:** Allow users to add, edit, or remove positions without full re-analysis.

### User Story 2.3.1.0: Add a New Position
**As a** user, **I want to** add a new job position to my existing Job History, **so that** I don't have to re-analyze my entire resume.

#### Business Rules:
- **2.3.1.1:** Collect all v2.0 schema fields for the new position.
- **2.3.1.2:** Insert position chronologically by date.
- **2.3.1.3:** Recalculate aggregates (total years of experience, skills inventory).
- **2.3.1.4:** Save and validate updated file.

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
- **3.1.1.1:** Extract 17 data points: Company Name, Job Title, Location, Remote/Hybrid/On-Site, Required Skills, Preferred Skills, Required Qualifications, Preferred Qualifications, Education Requirements, Experience Level, Certifications, Industry, Salary Range, Red Flags, Application Deadline, and more.
- **3.1.1.2:** Categorize skills as Required (3x weight), Preferred (2x weight), or Optional (1x weight).
- **3.1.1.3:** Validate JD is not a LinkedIn article or irrelevant content (anti-false-positive).

---

## Feature 3.2.0.0: Fit Assessment

**Description:** Calculate a fit score comparing JD requirements to the user's Job History.

### User Story 3.2.1.0: Calculate Preliminary Fit Score
**As a** user, **I want to** see a percentage fit score comparing my experience to the JD requirements, **so that** I know if I should apply.

#### Business Rules:
- **3.2.1.1:** Scoring methodology weights: Core Qualifications (50%), Critical Requirements (30%), Preferred Qualifications (20%).
- **3.2.1.2:** Skill-level priority weights (3:2:1 Model): Required=1.5x, Preferred=1.0x, Optional=0.5x.
- **3.2.1.3:** Fit thresholds: `90-100%` = Excellent (proceed), `80-89%` = Good (flag gaps), `75-79%` = Weak (stop with brief summary), `0-74%` = Poor (stop with ultra-brief summary).

### User Story 3.2.2.0: Apply Validation Penalties
**As a** system, **I want to** apply penalties for inflated experience or industry gaps, **so that** the fit score is accurate.

#### Business Rules:
- **3.2.2.1:** **Portfolio Inflation Penalty:** Personal projects counted as professional experience = -15 to -25 points.
- **3.2.2.2:** **Adjacent Technical Misclassification Penalty:** Support role counted as technical role = -10 to -20 points.
- **3.2.2.3:** **Documentation False Positive Penalty:** Writing ABOUT technology matched to hands-on requirement = -5 to -15 points per match.
- **3.2.2.4:** **Industry Mismatch Penalty:** Use industry transferability matrix (e.g., Government → B2B SaaS = 30%).
- **3.2.2.5:** **Role-Type Gap Penalty:** Insufficient direct experience in target role = -10 to -30 points.

### User Story 3.2.3.0: Display Evidence Matching
**As a** user, **I want to** see which JD requirements I match, partially match, or miss, **so that** I understand my gaps.

#### Business Rules:
- **3.2.3.1:** Display requirements as: `✅ MATCHED`, `🟡 PARTIAL`, `❌ MISSING`.
- **3.2.3.2:** For matches, cite the specific position and evidence from Job History.
- **3.2.3.3:** For gaps, explain why the experience doesn't qualify.

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
- **3.4.1.1:** Evidence tiers: `Tier 1 (100%)` = Hands-on implementation, `Tier 2 (50%)` = Supervised exposure, `Tier 3 (0%)` = Documentation only.
- **3.4.1.2:** Never force keywords without evidence (Keyword Evidence Principle).
- **3.4.1.3:** Ask user confirmation for keywords not in Job History.
- **3.4.1.4:** Output Keyword Coverage Report: `✓ Incorporated`, `✗ Skipped`, `? Requires Clarification`.

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
- **4.1.1.1:** Analyze each bullet for action verbs, metrics, and clarity.
- **4.1.1.2:** Ask follow-up questions if metrics are missing.
- **4.1.1.3:** Generate 2-3 improved versions of each bullet.
- **4.1.1.4:** Show before/after comparison.

### User Story 4.1.2.0: Generate JD-Tailored Bullets
**As a** user, **I want to** generate new resume bullets tailored to a specific JD, **so that** my resume is customized for the application.

#### Business Rules:
- **4.1.2.1:** Bullets must use only keywords evidenced in Job History.
- **4.1.2.2:** Bullets must maintain verb category diversity (all 5 categories represented).
- **4.1.2.3:** Bullets must meet character limits (100-210 characters).
- **4.1.2.4:** Bullets must start with past-tense action verbs (no gerunds).

---

## Feature 4.2.0.0: Quality Gate Enforcement

**Description:** Ensure all generated content passes quality validation before presentation.

### User Story 4.2.1.0: Run Automatic Quality Gate
**As a** system, **I want to** automatically validate generated bullets against quality rules, **so that** the user receives error-free output.

#### Business Rules:
- **4.2.1.1:** Step 1: Run quality checklist (escaped chars, gerunds, repeated phrases).
- **4.2.1.2:** Step 2: Verify verb diversity (all 5 categories represented).
- **4.2.1.3:** Step 3: Auto-regenerate bullets if issues found (max 3 iterations).
- **4.2.1.4:** Step 4: If issues persist after 3 iterations, present user with diagnostic output and options.

---

## Feature 4.3.0.0: Professional Summary Generation

**Description:** Generate customized professional summaries.

### User Story 4.3.1.0: Generate Master Summary
**As a** user, **I want to** generate a comprehensive Master Summary from my Job History, **so that** I have a reusable professional overview.

#### Business Rules:
- **4.3.1.1:** 2-3 paragraphs summarizing career, expertise, and key achievements.
- **4.3.1.2:** Include 2-3 hard skills and 1-2 soft skills.
- **4.3.1.3:** Use metrics where available.
- **4.3.1.4:** Store in Job History for reuse.

### User Story 4.3.2.0: Generate Per-JD Summary
**As a** user, **I want to** generate a customized summary tailored to a specific Job Description, **so that** my application is optimized.

#### Business Rules:
- **4.3.2.1:** 3-4 sentences optimized for JD keywords.
- **4.3.2.2:** Ephemeral (not stored in Job History).
- **4.3.2.3:** Include JD-specific keywords for ATS optimization.

---

## Feature 4.4.0.0: Export & Delivery

**Description:** Deliver final resume content in usable formats.

### User Story 4.4.1.0: Generate Plain Text Export
**As a** user, **I want to** receive my optimized bullets in a clean, copy-paste ready plain text format, **so that** I can easily paste them into my resume.

#### Business Rules:
- **4.4.1.1:** No Markdown formatting (no `**`, `_`, code blocks).
- **4.4.1.2:** Use plain text bullet character: `•`.
- **4.4.1.3:** Include metadata: character counts, word counts, verb distribution.
- **4.4.1.4:** Maintain reverse chronological order (newest job first).
- **4.4.1.5:** Include secondary grammar check recommendation.

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
- **5.1.1.1:** Detect: `hasJobHistory`, `hasJD`, `hasResume`.
- **5.1.1.2:** 8 routing scenarios defined (New User, JD Comparison, Bullet Optimization, Ambiguous Intent, First Interaction, Incremental Update, Re-Comparison, Ambiguous Input).
- **5.1.1.3:** Confirm with user before proceeding.
- **5.1.1.4:** Handle override commands: "re-analyze," "start fresh," "add position."

---

## Feature 5.2.0.0: System Guardrails

**Description:** 28+ quality and safety guardrails to prevent errors.

### User Story 5.2.1.0: Enforce Metric Traceability
**As a** system, **I want to** verify that every metric I include can be traced to a specific position in the Job History, **so that** I don't hallucinate achievements.

#### Business Rules:
- **5.2.1.1:** For every metric, identify the Position ID source.
- **5.2.1.2:** If metric appears in a different position block, it's a HALLUCINATION; remove it.

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
- **5.3.1.4:** Never use synonym tag names (e.g., `key_accomplishments` instead of `key_achievements`).

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
- **6.1.1.1:** Available models: `claude-haiku-4`, `claude-sonnet-4` (default), `claude-opus-4` (Pro only).
- **6.1.1.2:** Analyze button DISABLED until model is selected.
- **6.1.1.3:** Display tier requirements (⭐ Pro only for Opus).
- **6.1.1.4:** Auto-switch to Sonnet if free user selects Opus.

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
- **6.1.3.2:** Display Action Verb Diversity as a visual bar chart with color coding.
- **6.1.3.3:** Display Position-by-Position Review with collapsible sections.
- **6.1.3.4:** Display Per-Bullet Audit Tables (Metrics, Verb, Length checks).
- **6.1.3.5:** Display Prioritized Repairs Summary with severity icons.

### User Story 6.1.4.0: Handle Errors Gracefully
**As a** user, **I want to** see helpful error messages when analysis fails, **so that** I know how to resolve the issue.

#### Business Rules:
- **6.1.4.1:** Progressive error messages based on failure count (Attempt 1/3, 2/3, 3/3).
- **6.1.4.2:** JSON Truncation Error: Guide user to shorten resume or analyze in parts.
- **6.1.4.3:** Rate Limit Error: Display countdown to reset time.
- **6.1.4.4:** Permission Error: Auto-switch to Sonnet if Opus unavailable.

---

## Feature 6.2.0.0: Token Usage Guidance

**Description:** Educate users about token costs and help them optimize their daily budget.

### User Story 6.2.1.0: Display Token Information
**As a** user, **I want to** understand how many tokens each model uses, **so that** I can plan my usage across multiple phases.

#### Business Rules:
- **6.2.1.1:** Collapsible "Token usage info" section.
- **6.2.1.2:** Show token estimates: Haiku (~3K), Sonnet (~5K), Opus (~8K).
- **6.2.1.3:** Show Free tier limit: 500K tokens per 5-hour window.
- **6.2.1.4:** Provide multi-phase strategy tip (save tokens for Phase 2/3).

---

## Feature 6.3.0.0: Visual Components

**Description:** UI elements for enhanced visualization of analysis data.

### User Story 6.3.1.0: Display Color-Coded Action Verbs
**As a** user, **I want to** see my action verbs color-coded by category, **so that** I can quickly assess verb diversity.

#### Business Rules:
- **6.3.1.1:** Built = Blue (`#3B82F6`)
- **6.3.1.2:** Lead = Orange (`#FBBF24`)
- **6.3.1.3:** Managed = Purple (`#A855F7`)
- **6.3.1.4:** Improved = Green (`#10B981`)
- **6.3.1.5:** Collaborate = Pink (`#EC4899`)

### User Story 6.3.2.0: Display Verb Distribution Chart
**As a** user, **I want to** see a bar chart showing my verb distribution, **so that** I can identify over/under-represented categories.

#### Business Rules:
- **6.3.2.1:** Visual progress bars for each category.
- **6.3.2.2:** Balance indicators: Well-balanced (13-27%), Under-represented (<13%), Over-represented (>27%).
- **6.3.2.3:** Critical gap warning if any category is <5%.

### User Story 6.3.3.0: Display Severity Icons
**As a** user, **I want to** see visual icons for issue severity, **so that** I can prioritize my fixes.

#### Business Rules:
- **6.3.3.1:** ⛔ (Red XCircle) = Blocker
- **6.3.3.2:** ⚠️ (Yellow AlertTriangle) = Risk
- **6.3.3.3:** 🔧 (Blue AlertCircle) = Tweak

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
- **7.1.1.1:** 5 routing scenarios: New User, JD Comparison, Bullet Optimization, Ambiguous Intent, First Interaction.
- **7.1.1.2:** Detect user state: `hasJobHistory`, `hasJD`, `hasResume`.
- **7.1.1.3:** Confirm with user before proceeding.

### User Story 7.1.2.0: JD Parsing Protocol (17-Point System)
**As a** system, **I want to** parse a Job Description into 17 structured data points, **so that** I can compare it against the user's experience.
- **File:** `phases/phase-1/jd-parsing-17-point.md`

#### Business Rules:
- **7.1.2.1:** Extract 17 data points including: Company Name, Job Title, Location, Required Skills, Preferred Skills, Education, etc.
- **7.1.2.2:** Categorize skills as Required/Preferred/Optional with weights.
- **7.1.2.3:** Separate hard skills from soft skills.

### User Story 7.1.3.0: Job History v2.0 Creation Protocol
**As a** system, **I want to** generate a structured Job History document from parsed resume data, **so that** it can be used for JD comparison and bullet generation.
- **File:** `phases/phase-1/job-history-v2-creation.md`

#### Business Rules:
- **7.1.3.1:** 12-section schema per position.
- **7.1.3.2:** Version history tracking.
- **7.1.3.3:** Evidence matching integration.
- **7.1.3.4:** Hard/soft skill classification.

---

## Feature 7.2.0.0: Phase 2 Core Integration Modules

**Description:** Modules for evidence matching and gap analysis.

### User Story 7.2.1.0: Evidence Matching Protocol
**As a** system, **I want to** match JD requirements against the user's Job History with evidence citations, **so that** the user understands their gaps and strengths.
- **File:** `phases/phase-2/evidence-matching.md`

#### Business Rules:
- **7.2.1.1:** Requirement-by-requirement gap analysis.
- **7.2.1.2:** Evidence citations from Job History (Position ID, Bullet Number).
- **7.2.1.3:** Match types: `MATCHED`, `PARTIAL`, `MISSING`.
- **7.2.1.4:** Skill priority weights (3:2:1 model).

---

## Feature 7.3.0.0: Phase 3 Router & Workflow Modules

**Description:** Modules for workflow routing and incremental updates.

### User Story 7.3.1.0: Workflow Router Protocol
**As a** system, **I want to** route users to the correct phase/workflow based on their input and state, **so that** they receive the appropriate response.
- **File:** `phases/phase-3/workflow-router.md`

#### Business Rules:
- **7.3.1.1:** 8 routing scenarios.
- **7.3.1.2:** Context state schema: `hasJobHistory`, `hasJD`, `hasResume`, `userIntent`, etc.
- **7.3.1.3:** JD validation heuristics (anti-false-positive).
- **7.3.1.4:** Override commands: "re-analyze," "start fresh," "add position."

### User Story 7.3.2.0: Incremental Updates Protocol
**As a** user, **I want to** add, edit, or remove positions from my Job History without re-analyzing my entire resume, **so that** I can make quick updates.
- **File:** `phases/phase-3/incremental-updates.md`

#### Business Rules:
- **7.3.2.1:** Add: Collect v2.0 fields → Insert chronologically → Recalculate aggregates → Save.
- **7.3.2.2:** Edit: Select position → Show current values → Update fields → Recalculate → Save.
- **7.3.2.3:** Remove: Select position → Confirm → Delete → Recalculate aggregates → Save.

### User Story 7.3.3.0: Re-Comparison Protocol
**As a** user, **I want to** re-run a JD comparison after updating my Job History, **so that** I can see what improved or regressed.
- **File:** `phases/phase-3/re-comparison.md`

#### Business Rules:
- **7.3.3.1:** Load cached JD (or prompt for new paste).
- **7.3.3.2:** Run evidence matcher with current Job History.
- **7.3.3.3:** Generate diff output: Improvements, Regressions, No Change.
- **7.3.3.4:** Show score delta (e.g., "72% → 81%").

---

## Feature 7.4.0.0: Phase 4 Summary & Polish Modules

**Description:** Modules for professional summary generation.

### User Story 7.4.1.0: Summary Generation Protocol
**As a** system, **I want to** generate professional summaries (Master and Per-JD), **so that** users have reusable content for applications.
- **File:** `phases/phase-4/summary-generation.md`

#### Business Rules:
- **7.4.1.1:** Master Summary: 2-3 paragraphs, stored in Job History.
- **7.4.1.2:** Per-JD Summary: 3-4 sentences optimized for JD keywords, ephemeral.
- **7.4.1.3:** Keyword optimization based on JD requirements.
- **7.4.1.4:** Summary Abstraction Guardrail: No sentence can share >50% keywords with any bullet.

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
