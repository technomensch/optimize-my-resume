# Optimize-My-Resume - Requirements Document

**Version:** 2.0.0
**Created:** January 11, 2026
**Status:** DRAFT
**Purpose:** Define system requirements in natural language for stakeholder and business alignment.

---

## Document Guidelines

- **This document describes WHAT the system does, not HOW it is built.**
- Requirements are written in natural, non-technical language.
- Each user story represents a single, testable piece of functionality.
- Acceptance criteria define the conditions that must be met for a story to be "done."
- Business rules define constraints and guidelines that apply to a story.
- For technical implementation details, see the separate **Requirements Traceability Matrix**.

---

## Numbering Schema

| Level | Format | Description |
|-------|--------|-------------|
| **Epic** | `X.0.0.0` | A major business capability or product area |
| **Feature** | `X.Y.0.0` | A functional grouping within an Epic |
| **User Story** | `X.Y.Z.0` | A single, atomic piece of user-facing functionality |
| **Acceptance Criteria** | `X.Y.Z.A.n` | Testable conditions for a User Story to be considered "done" |
| **Business Rule** | `X.Y.Z.R.n` | Constraints or guidelines that apply to a User Story |

---

# EPIC 1.0.0.0: Resume Analyzer

**Description:** Allow users to upload their resume and receive a comprehensive quality analysis, including scores, recommendations, and a structured job history they can use for future applications.

**Business Value:** Users gain clarity on how their resume is perceived, what needs improvement, and receive a reusable data asset (job history) for future job applications.

---

## Feature 1.1.0.0: Resume Upload

**Description:** Allow users to upload their resume in commonly used file formats.

---

### User Story 1.1.1.0: PDF Document Ingestion
**As a** user, **I want to** upload my resume as a PDF file, **so that** the system can analyze its content.

#### Acceptance Criteria:
- **1.1.1.A.1:** When I upload a PDF file, the system accepts it without error.
- **1.1.1.A.2:** When I upload a file that is not a PDF, the system displays an appropriate error message.
- **1.1.1.A.3:** The system extracts readable text from the PDF for analysis.

#### Business Rules:
- **1.1.1.R.1:** PDF files must be 10MB or less in size.

---

### User Story 1.1.2.0: Word Document Ingestion
**As a** user, **I want to** upload my resume as a Microsoft Word document (DOCX), **so that** the system can analyze its content.

#### Acceptance Criteria:
- **1.1.2.A.1:** When I upload a DOCX file, the system accepts it without error.
- **1.1.2.A.2:** When I upload a file that is not a DOCX, the system displays an appropriate error message.
- **1.1.2.A.3:** The system extracts readable text from the document for analysis.

#### Business Rules:
- **1.1.2.R.1:** DOCX files must be 10MB or less in size.

---

### User Story 1.1.3.0: Plain Text Ingestion
**As a** user, **I want to** upload my resume as a plain text file (TXT), **so that** the system can analyze its content.

#### Acceptance Criteria:
- **1.1.3.A.1:** When I upload a TXT file, the system accepts it without error.
- **1.1.3.A.2:** The system uses the text content directly for analysis.

#### Business Rules:
- **1.1.3.R.1:** TXT files must be 5MB or less in size.

---

### User Story 1.1.4.0: Rich Text Ingestion
**As a** user, **I want to** upload my resume as a Rich Text Format file (RTF), **so that** the system can analyze its content.

#### Acceptance Criteria:
- **1.1.4.A.1:** When I upload an RTF file, the system accepts it without error.
- **1.1.4.A.2:** The system extracts readable text from the RTF for analysis.

#### Business Rules:
- **1.1.4.R.1:** RTF files must be 10MB or less in size.

---

### User Story 1.1.5.0: Markdown Ingestion
**As a** user, **I want to** upload my resume as a Markdown file (MD), **so that** the system can analyze its content.

#### Acceptance Criteria:
- **1.1.5.A.1:** When I upload an MD file, the system accepts it without error.
- **1.1.5.A.2:** The system processes Markdown formatting to extract readable text.

#### Business Rules:
- **1.1.5.R.1:** MD files must be 5MB or less in size.

---

### User Story 1.1.6.0: Direct Text Input
**As a** user, **I want to** paste my resume text directly into the system, **so that** I can use the system without having a file saved on my computer.

#### Acceptance Criteria:
- **1.1.6.A.1:** The system provides a text input area where I can paste content.
- **1.1.6.A.2:** When I paste text and submit, the system accepts it for analysis.
- **1.1.6.A.3:** The system handles special characters and formatting gracefully.

---

### User Story 1.1.7.0: Automated Content Categorization
**As a** user, **I want** the system to automatically detect whether I uploaded a resume or a job description, **so that** it can route me to the correct workflow.

#### Acceptance Criteria:
- **1.1.7.A.1:** When I upload a resume, the system identifies it as a resume.
- **1.1.7.A.2:** When I upload a job description, the system identifies it as a job description.
- **1.1.7.A.3:** When the content type is unclear, the system asks me to confirm what I uploaded.

---

## Feature 1.2.0.0: Resume Parsing

**Description:** Extract structured information from the uploaded resume content.

---

### User Story 1.2.1.0: Job Title Extraction
**As a** system, **I want to** identify and extract job titles from each position in the resume, **so that** I can categorize the user's work history.

#### Acceptance Criteria:
- **1.2.1.A.1:** For each position listed, the system captures the job title.
- **1.2.1.A.2:** If a job title cannot be determined, the system flags it for user clarification.

---

### User Story 1.2.2.0: Company Name Extraction
**As a** system, **I want to** identify and extract company names from each position in the resume, **so that** I can track where the user has worked.

#### Acceptance Criteria:
- **1.2.2.A.1:** For each position listed, the system captures the company name.
- **1.2.2.A.2:** If a company name cannot be determined, the system flags it for user clarification.

---

### User Story 1.2.3.0: Employment Duration Calculation
**As a** system, **I want to** identify and extract start and end dates for each position, **so that** I can calculate employment duration.

#### Acceptance Criteria:
- **1.2.3.A.1:** For each position, the system captures the start date.
- **1.2.3.A.2:** For each position, the system captures the end date (or "Present" if current).
- **1.2.3.A.3:** The system calculates the duration of each position.

---

### User Story 1.2.4.0: Bullet Point Extraction
**As a** system, **I want to** identify and extract individual bullet points from each position, **so that** I can analyze them individually.

#### Acceptance Criteria:
- **1.2.4.A.1:** For each position, the system captures all bullet points.
- **1.2.4.A.2:** Bullet points are associated with their parent position.

---

### User Story 1.2.5.0: Work Environment Classification
**As a** system, **I want to** determine whether each position was remote, hybrid, or on-site, **so that** I can include this context in the analysis.

#### Acceptance Criteria:
- **1.2.5.A.1:** If location type is mentioned, the system captures it.
- **1.2.5.A.2:** If location type is not mentioned, the system marks it as unknown.

---

### User Story 1.2.6.0: Core Competency Identification
**As a** system, **I want to** identify skills mentioned in the resume, **so that** I can categorize them for analysis.

#### Acceptance Criteria:
- **1.2.6.A.1:** The system identifies technical skills (hard skills).
- **1.2.6.A.2:** The system identifies interpersonal skills (soft skills).
- **1.2.6.A.3:** Skills are associated with the positions where they were demonstrated.

---

## Feature 1.3.0.0: Resume Quality Scoring

**Description:** Evaluate the resume against quality criteria and provide scores.

---

### User Story 1.3.1.0: Quality Index Calculation
**As a** user, **I want to** see an overall score for my resume, **so that** I understand its general quality at a glance.

#### Acceptance Criteria:
- **1.3.1.A.1:** The system displays a single overall score (e.g., letter grade or percentage).
- **1.3.1.A.2:** The score is based on multiple weighted factors.

---

### User Story 1.3.2.0: ATS Compatibility Scoring
**As a** user, **I want to** know how well my resume will perform with Applicant Tracking Systems, **so that** I can ensure it gets past automated screening.

#### Acceptance Criteria:
- **1.3.2.A.1:** The system provides an ATS compatibility score.
- **1.3.2.A.2:** The score considers bullet point length.
- **1.3.2.A.3:** The score considers header structure.
- **1.3.2.A.4:** The score considers contact information formatting.

---

### User Story 1.3.3.0: Narrative Impact Scoring
**As a** user, **I want to** know the quality of my resume content, **so that** I can improve my writing.

#### Acceptance Criteria:
- **1.3.3.A.1:** The system provides a content quality score.
- **1.3.3.A.2:** The score considers action verb strength.
- **1.3.3.A.3:** The score considers verb tense consistency.
- **1.3.3.A.4:** The score considers action verb diversity.

---

### User Story 1.3.4.0: Metric Density Evaluation
**As a** user, **I want to** know how well my resume demonstrates measurable impact, **so that** I can add more metrics where needed.

#### Acceptance Criteria:
- **1.3.4.A.1:** The system provides a quantifiable impact score.
- **1.3.4.A.2:** The system identifies bullets that contain metrics (numbers, percentages, dollar amounts).
- **1.3.4.A.3:** The system identifies bullets that lack metrics.

#### Business Rules:
- **1.3.4.R.1:** The target is for 70-80% of bullets to contain quantifiable metrics.

---

### User Story 1.3.5.0: Keyword Strategy Assessment
**As a** user, **I want to** know how well my resume covers relevant skills and industry keywords, **so that** I can ensure I'm presenting my qualifications effectively.

#### Acceptance Criteria:
- **1.3.5.A.1:** The system provides a skills and keywords score.
- **1.3.5.A.2:** The system identifies relevant industry terms present in the resume.

---

## Feature 1.4.0.0: Per-Bullet Analysis

**Description:** Provide detailed analysis for each individual bullet point in the resume.

---

### User Story 1.4.1.0: Metric Presence Detection
**As a** user, **I want to** see whether each bullet point contains quantified metrics, **so that** I know which bullets need strengthening.

#### Acceptance Criteria:
- **1.4.1.A.1:** Each bullet displays an indicator showing if metrics are present.
- **1.4.1.A.2:** The system recognizes percentages, currency values, and numeric quantities as metrics.

---

### User Story 1.4.2.0: Verb Category Classification
**As a** user, **I want to** see the strength and category of each bullet's action verb, **so that** I can improve weak verbs and ensure diversity.

#### Acceptance Criteria:
- **1.4.2.A.1:** Each bullet displays its action verb category.
- **1.4.2.A.2:** The system flags weak or passive action verbs.

---

### User Story 1.4.3.0: Character Count Validation
**As a** user, **I want to** know if my bullet points are the right length, **so that** they display properly in ATS systems.

#### Acceptance Criteria:
- **1.4.3.A.1:** Each bullet displays its character count.
- **1.4.3.A.2:** The system flags bullets that are too short.
- **1.4.3.A.3:** The system flags bullets that are too long.

#### Business Rules:
- **1.4.3.R.1:** Bullets should be between 100 and 210 characters.

---

### User Story 1.4.4.0: Optimization Guidance Generation
**As a** user, **I want to** see specific recommendations for improving each bullet, **so that** I know exactly what to fix.

#### Acceptance Criteria:
- **1.4.4.A.1:** If a bullet has issues, the system provides actionable suggestions.
- **1.4.4.A.2:** Suggestions are prioritized by severity.

---

## Feature 1.5.0.0: Action Verb Analysis

**Description:** Analyze the variety and strength of action verbs used across the resume.

---

### User Story 1.5.1.0: Categorize Action Verbs
**As a** user, **I want to** see my action verbs organized by category, **so that** I can ensure I'm demonstrating a range of capabilities.

#### Acceptance Criteria:
- **1.5.1.A.1:** The system groups action verbs into categories (e.g., Built, Led, Managed, Improved, Collaborated).
- **1.5.1.A.2:** Each bullet's verb is assigned to a category.

---

### User Story 1.5.2.0: Display Verb Distribution
**As a** user, **I want to** see a visual representation of my verb category distribution, **so that** I can identify over-used or under-used categories.

#### Acceptance Criteria:
- **1.5.2.A.1:** The system displays the percentage of bullets in each verb category.
- **1.5.2.A.2:** The system highlights categories that are under-represented.
- **1.5.2.A.3:** The system highlights categories that are over-represented.

#### Business Rules:
- **1.5.2.R.1:** Each verb category should represent at least 5% of total bullets.
- **1.5.2.R.2:** No verb category should exceed 40% of total bullets.

---

### User Story 1.5.3.0: Color-Code Action Verbs
**As a** user, **I want to** see my action verbs color-coded by category, **so that** I can visually assess diversity at a glance.

#### Acceptance Criteria:
- **1.5.3.A.1:** Each verb category has a distinct color.
- **1.5.3.A.2:** The first word of each bullet is displayed in its category color.

---

## Feature 1.6.0.0: Hiring Manager Perspective

**Description:** Analyze the resume from an external hiring manager's point of view.

---

### User Story 1.6.1.0: Infer Job Titles from Work Performed
**As a** user, **I want to** see what job titles a hiring manager would infer from my resume, **so that** I can identify if my true role is being communicated.

#### Acceptance Criteria:
- **1.6.1.A.1:** For each position, the system suggests what job title a reader would perceive.
- **1.6.1.A.2:** The inferred title is based on achievements and responsibilities, not the stated title.
- **1.6.1.A.3:** The system explains why it inferred each title.

---

### User Story 1.6.2.0: Seniority Alignment Assessment
**As a** user, **I want to** see what seniority level my resume conveys, **so that** I can ensure I'm positioning myself appropriately.

#### Acceptance Criteria:
- **1.6.2.A.1:** The system assesses apparent seniority based on scope and impact described.
- **1.6.2.A.2:** Factors include team size, budget responsibility, and strategic scope.

---

### User Story 1.6.3.0: Career Progression Summary
**As a** user, **I want to** see a synthesized summary of my career progression, **so that** I understand how my trajectory appears to others.

#### Acceptance Criteria:
- **1.6.3.A.1:** The system provides a narrative summary of the user's career arc.
- **1.6.3.A.2:** The narrative is based on the inferred titles and progression.

---

## Feature 1.7.0.0: Issue Prioritization

**Description:** Organize identified issues by severity to help users prioritize fixes.

---

### User Story 1.7.1.0: Issue Severity Classification
**As a** user, **I want to** see my resume issues organized by severity, **so that** I can fix the most critical problems first.

#### Acceptance Criteria:
- **1.7.1.A.1:** Issues are categorized as Blocker, Risk, or Tweak.
- **1.7.1.A.2:** Blockers are issues that may cause automatic rejection.
- **1.7.1.A.3:** Risks are issues that significantly lower resume impact.
- **1.7.1.A.4:** Tweaks are minor improvements for polish.

---

### User Story 1.7.2.0: Repair Scope Aggregation
**As a** user, **I want to** see a quick count of issues by severity, **so that** I understand the overall scope of improvements needed.

#### Acceptance Criteria:
- **1.7.2.A.1:** The system displays the count of Blockers.
- **1.7.2.A.2:** The system displays the count of Risks.
- **1.7.2.A.3:** The system displays the count of Tweaks.

---

### User Story 1.7.3.0: Actionable Fix Prioritization
**As a** user, **I want to** see a consolidated list of all repairs needed, **so that** I have a clear action plan.

#### Acceptance Criteria:
- **1.7.3.A.1:** The list is ordered by severity (Blockers first, then Risks, then Tweaks).
- **1.7.3.A.2:** Each item references the specific location (position and bullet).
- **1.7.3.A.3:** Each item includes a suggested fix.

---

## Feature 1.8.0.0: Job History Generation

**Description:** Create a structured, reusable document containing the user's complete work history.

---

### User Story 1.8.1.0: Master Profile Consolidation
**As a** user, **I want** the system to create a structured record of my work history from my resume, **so that** I can reuse it for future job applications.

#### Acceptance Criteria:
- **1.8.1.A.1:** The job history contains all positions extracted from the resume.
- **1.8.1.A.2:** Each position includes dates, company, title, responsibilities, and achievements.
- **1.8.1.A.3:** The job history includes a master skills inventory.

---

### User Story 1.8.2.0: Summary Synthesis Generation
**As a** user, **I want** my job history to include an automatically generated professional summary, **so that** I have a starting point for my resume header.

#### Acceptance Criteria:
- **1.8.2.A.1:** The job history includes a 2-3 paragraph professional summary.
- **1.8.2.A.2:** The summary synthesizes the user's career highlights and expertise.

---

### User Story 1.8.3.0: Profile Export Functionality
**As a** user, **I want to** download my job history to my computer, **so that** I can save it for future use.

#### Acceptance Criteria:
- **1.8.3.A.1:** The system provides a download option.
- **1.8.3.A.2:** The downloaded file is in a format I can open and read.

---

### User Story 1.8.4.0: Cross-Platform Compatibility Export
**As a** user, **I want to** choose the format for my job history download, **so that** I can use the format that works best for my needs.

#### Acceptance Criteria:
- **1.8.4.A.1:** The system offers at least two export format options.
- **1.8.4.A.2:** One format is optimized for human readability.
- **1.8.4.A.3:** One format is optimized for importing into other tools.

#### Business Rules:
- **1.8.0.R.1:** (12-Section Schema) Every job history file MUST follow a strictly defined structure with 12 sections (Personal Info, Master Summary, Education, Certifications, Hard Skills, Soft Skills, Job History, Projects, Awards, Publications/Speaking, Volunteer, Additional Info).
- **1.8.0.R.2:** (Standardized Tags) All AI models MUST use identical XML tag names without synonyms for all sections and metadata fields.
- **1.8.0.R.3:** (No Skipped Sections) Mandatory sections that have no data MUST be marked as "Not applicable" rather than being omitted.
- **1.8.0.R.4:** (Master Skills Inventory) All skills identified in individual roles MUST be aggregated into a comprehensive "Master Skills Inventory".
- **1.8.0.R.5:** (Promotion Handling) Multiple roles or promotions at the same company MUST be shown as separate entries with their own dates and responsibilities to demonstrate career progression.
- **1.8.0.R.6:** (Metric Traceability) Every metric (e.g., $, %, multipliers) MUST be uniquely tied to the specific position where it was achieved.

---

# EPIC 2.0.0.0: Job Fit Analyzer

**Description:** Allow users to compare their experience against a specific job description to understand how well they match the requirements.

**Business Value:** Users can make informed decisions about whether to apply for a job and understand what gaps they need to address.

---

## Feature 2.1.0.0: Job Description Input

**Description:** Allow users to provide a job description for comparison.

---

### User Story 2.1.1.0: JD Content Ingestion
**As a** user, **I want to** paste a job description into the system, **so that** I can compare it against my experience.

#### Acceptance Criteria:
- **2.1.1.A.1:** The system provides a text input area for the job description.
- **2.1.1.A.2:** The system accepts job descriptions of typical length.

---

### User Story 2.1.2.0: JD Integrity Validation
**As a** system, **I want to** verify that the pasted content is a job description, **so that** I don't analyze irrelevant content.

#### Acceptance Criteria:
- **2.1.2.A.1:** The system detects if the content appears to be a job description.
- **2.1.2.A.2:** The system warns the user if the content does not appear to be a job description.
- **2.1.2.A.3:** The system can distinguish job descriptions from LinkedIn articles or other content.

---

## Feature 2.2.0.0: Job Description Analysis

**Description:** Extract and categorize requirements from the job description.

---

### User Story 2.2.1.0: Mandatory Skill Identification
**As a** system, **I want to** identify skills marked as required in the job description, **so that** I can assess the user's match.

#### Acceptance Criteria:
- **2.2.1.A.1:** The system identifies skills labeled as "required" or "must have."
- **2.2.1.A.2:** Required skills are listed separately from preferred skills.

---

### User Story 2.2.2.0: Desirable Attribute Discovery
**As a** system, **I want to** identify skills marked as preferred in the job description, **so that** I can assess the user's additional qualifications.

#### Acceptance Criteria:
- **2.2.2.A.1:** The system identifies skills labeled as "preferred" or "nice to have."
- **2.2.2.A.2:** Preferred skills are listed separately from required skills.

---

### User Story 2.2.3.0: Experience Benchmark Extraction
**As a** system, **I want to** identify years of experience required, **so that** I can compare against the user's background.

#### Acceptance Criteria:
- **2.2.3.A.1:** The system identifies stated experience requirements (e.g., "5+ years").
- **2.2.3.A.2:** The system identifies the type of experience required (e.g., "in product management").

---

### User Story 2.2.4.0: Academic Prerequisite Identification
**As a** system, **I want to** identify education requirements, **so that** I can compare against the user's qualifications.

#### Acceptance Criteria:
- **2.2.4.A.1:** The system identifies required degrees or certifications.
- **2.2.4.A.2:** The system distinguishes required from preferred education.

---

### User Story 2.2.5.0: Geographic Eligibility Checking
**As a** system, **I want to** identify work location requirements, **so that** I can flag compatibility issues.

#### Acceptance Criteria:
- **2.2.5.A.1:** The system identifies if the role is remote, hybrid, or on-site.
- **2.2.5.A.2:** The system identifies geographic restrictions (e.g., "must be in California").

---

## Feature 2.3.0.0: Fit Score Calculation

**Description:** Calculate how well the user matches the job requirements.

---

### User Story 2.3.1.0: Strategic Alignment Scoring
**As a** user, **I want to** see an overall fit score for a job, **so that** I can quickly assess if I should apply.

#### Acceptance Criteria:
- **2.3.1.A.1:** The system displays a percentage fit score.
- **2.3.1.A.2:** The score reflects how many requirements the user meets.

---

### User Story 2.3.2.0: Multi-Tier Skill Weighting
**As a** system, **I want to** weight required skills more heavily than preferred skills, **so that** the fit score accurately reflects job priorities.

#### Acceptance Criteria:
- **2.3.2.A.1:** Required skills contribute more to the score than preferred skills.
- **2.3.2.A.2:** The weighting is transparent to the user.

---

### User Story 2.3.3.0: Match Level Categorization
**As a** user, **I want to** understand what my fit score means, **so that** I can make an informed decision about applying.

#### Acceptance Criteria:
- **2.3.3.A.1:** Scores above 90% are labeled as "Excellent Match."
- **2.3.3.A.2:** Scores between 80-89% are labeled as "Good Match with Minor Gaps."
- **2.3.3.A.3:** Scores between 75-79% are labeled as "Weak Match."
- **2.3.3.A.4:** Scores below 75% are labeled as "Poor Match."

---

## Feature 2.4.0.0: Requirement Matching

**Description:** Show the user which specific requirements they meet or miss.

---

### User Story 2.4.1.0: Critical Constraint Verification
**As a** user, **I want to** see which job requirements I meet, **so that** I understand my strengths for this role.

#### Acceptance Criteria:
- **2.4.1.A.1:** Matched requirements are clearly listed.
- **2.4.1.A.2:** For each match, the system shows which part of my experience demonstrates it.

---

### User Story 2.4.2.0: Desirable Fit Enhancement
**As a** user, **I want to** see which job requirements I partially meet, **so that** I understand where I have some relevant experience.

#### Acceptance Criteria:
- **2.4.2.A.1:** Partially matched requirements are clearly listed.
- **2.4.2.A.2:** The system explains why the match is partial.

---

### User Story 2.4.3.0: Qualification Gap Analysis
**As a** user, **I want to** see which job requirements I do not meet, **so that** I understand my gaps.

#### Acceptance Criteria:
- **2.4.3.A.1:** Missing requirements are clearly listed.
- **2.4.3.A.2:** The system explains why no match was found.

---

## Feature 2.5.0.0: Blocking Conditions

**Description:** Identify fundamental mismatches that make a job unsuitable.

---

### User Story 2.5.1.0: Flag Location Incompatibility
**As a** user, **I want to** be warned if a job's location requirements conflict with my situation, **so that** I don't waste time on incompatible roles.

#### Acceptance Criteria:
- **2.5.1.A.1:** If the job requires on-site and I'm remote-only, the system warns me.
- **2.5.1.A.2:** If the job has geographic restrictions I don't meet, the system warns me.

---

### User Story 2.5.2.0: Flag Critical Skill Gaps
**As a** user, **I want to** be warned if I'm missing critical required skills, **so that** I can make an informed decision about applying.

#### Acceptance Criteria:
- **2.5.2.A.1:** The system identifies skills that appear multiple times or are emphasized in the job description.
- **2.5.2.A.2:** If I'm missing these critical skills, the system displays a warning.

---

# EPIC 3.0.0.0: Resume Customizer

**Description:** Allow users to generate tailored resume content optimized for a specific job description.

**Business Value:** Users receive customized, optimized resume content that increases their chances of getting interviews.

---

## Feature 3.1.0.0: Bullet Optimization

**Description:** Improve existing resume bullets or generate new ones.

---

### User Story 3.1.1.0: Bullet Tailoring Algorithm
**As a** user, **I want to** receive improved versions of my current resume bullets, **so that** I can strengthen my existing content.

#### Acceptance Criteria:
- **3.1.1.A.1:** For each bullet I provide, the system suggests improved versions.
- **3.1.1.A.2:** Improvements maintain the factual accuracy of my original statement.
- **3.1.1.A.3:** Improvements address identified issues (weak verbs, missing metrics, length).

---

### User Story 3.1.2.0: Keyword Infusion Strategy
**As a** user, **I want to** receive new resume bullets tailored to a specific job description, **so that** my resume is optimized for that application.

#### Acceptance Criteria:
- **3.1.2.A.1:** Generated bullets incorporate relevant keywords from the job description.
- **3.1.2.A.2:** Generated bullets are based only on experience from my job history.
- **3.1.2.A.3:** Generated bullets meet length and formatting requirements.

#### Business Rules:
- **3.1.2.R.1:** The system will not claim experience I don't have.
- **3.1.2.R.2:** All bullets must be based on evidenced experience.

---

### User Story 3.1.3.0: Linguistic Variety Enforcement
**As a** system, **I want to** ensure generated bullets use a variety of action verb categories, **so that** the resume demonstrates a range of capabilities.

#### Acceptance Criteria:
- **3.1.3.A.1:** Generated bullets collectively use all five action verb categories.
- **3.1.3.A.2:** No single category is over-represented.

---

## Feature 3.2.0.0: Professional Summary Generation

**Description:** Generate customized professional summary content.

---

### User Story 3.2.1.0: Master Brand Synthesis
**As a** user, **I want to** generate a comprehensive professional summary, **so that** I have a reusable summary for my resume.

#### Acceptance Criteria:
- **3.2.1.A.1:** The summary is 2-3 paragraphs.
- **3.2.1.A.2:** The summary synthesizes my career highlights.
- **3.2.1.A.3:** The summary includes key skills and achievements.

---

### User Story 3.2.2.0: Targeted Value Proposition
**As a** user, **I want to** generate a summary tailored to a specific job description, **so that** my resume header is optimized for that application.

#### Acceptance Criteria:
- **3.2.2.A.1:** The summary is 3-4 sentences.
- **3.2.2.A.2:** The summary incorporates keywords from the job description.
- **3.2.2.A.3:** The summary highlights qualifications relevant to the job.

---

## Feature 3.3.0.0: Quality Validation

**Description:** Ensure all generated content meets quality standards.

---

### User Story 3.3.1.0: Automated Quality Gatekeeping
**As a** system, **I want to** verify that all generated bullets meet quality requirements, **so that** users receive polished, ready-to-use content.

#### Acceptance Criteria:
- **3.3.1.A.1:** All bullets meet length requirements.
- **3.3.1.A.2:** All bullets start with past-tense action verbs.
- **3.3.1.A.3:** All bullets are grammatically correct.

---

### User Story 3.3.2.0: Autonomous Content Correction
**As a** system, **I want to** automatically fix common quality issues, **so that** users don't receive flawed content.

#### Acceptance Criteria:
- **3.3.2.A.1:** The system detects and corrects bullets starting with "-ing" words.
- **3.3.2.A.2:** The system removes repeated phrases across bullets.

---

## Feature 3.4.0.0: Export and Delivery

**Description:** Deliver finalized resume content in usable formats.

---

### User Story 3.4.1.0: Plain Text Content Export
**As a** user, **I want to** receive my optimized bullets in plain text format, **so that** I can easily copy and paste them into my resume.

#### Acceptance Criteria:
- **3.4.1.A.1:** The export contains no special formatting.
- **3.4.1.A.2:** I can copy the text directly into any document.

---

### User Story 3.4.2.0: Grammar & Tone Verification Guidance
**As a** user, **I want to** be reminded to proofread the generated content, **so that** I catch any errors before submitting my resume.

#### Acceptance Criteria:
- **3.4.2.A.1:** The system displays a recommendation to perform a secondary grammar check.
- **3.4.2.A.2:** The recommendation appears with the final output.

---

# EPIC 4.0.0.0: Narrative Builder

**Description:** Help users discover and articulate hidden achievements and metrics through guided questioning.

**Business Value:** Users uncover impactful accomplishments they may have forgotten or undersold, strengthening their overall narrative.

---

## Feature 4.1.0.0: Probing Questions

**Description:** Ask targeted questions to uncover additional achievements and metrics.

---

### User Story 4.1.1.0: Structural Scope Discovery
**As a** user, **I want to** be asked about the size of teams I managed or worked with, **so that** I can add this context to my experience.

#### Acceptance Criteria:
- **4.1.1.A.1:** For relevant positions, the system asks about team size.
- **4.1.1.A.2:** My answers are recorded for use in my job history.

---

### User Story 4.1.2.0: Fiscal Impact Discovery
**As a** user, **I want to** be asked about budgets I managed, **so that** I can demonstrate financial responsibility.

#### Acceptance Criteria:
- **4.1.2.A.1:** For relevant positions, the system asks about budget responsibility.
- **4.1.2.A.2:** My answers are recorded for use in my job history.

---

### User Story 4.1.3.0: Quantifiable Success Discovery
**As a** user, **I want to** be asked about the quantifiable impact of my work, **so that** I can add metrics to my achievements.

#### Acceptance Criteria:
- **4.1.3.A.1:** The system asks about time savings, cost reductions, and efficiency gains.
- **4.1.3.A.2:** The system asks about user impact (how many people were affected).

---

### User Story 4.1.4.0: S.T.A.R. Context Discovery
**As a** user, **I want to** be asked about significant challenges I faced, **so that** I can articulate my problem-solving abilities.

#### Acceptance Criteria:
- **4.1.4.A.1:** The system asks about obstacles and how I overcame them.
- **4.1.4.A.2:** My answers are recorded for use in my job history.

---

## Feature 4.2.0.0: Job History Enrichment

**Description:** Update the user's job history with newly discovered information.

---

### User Story 4.2.1.0: Data Profile Enrichment
**As a** system, **I want to** add newly discovered information to the user's job history, **so that** future analyses benefit from the enriched data.

#### Acceptance Criteria:
- **4.2.1.A.1:** New information is added to the appropriate position.
- **4.2.1.A.2:** Existing information is not overwritten unless the user confirms.

---

### User Story 4.2.2.0: Chronological Audit Trail
**As a** system, **I want to** update the version number when changes are made, **so that** there is a clear record of modifications.

#### Acceptance Criteria:
- **4.2.2.A.1:** The version number is incremented when changes are saved.

---

## Feature 4.3.0.0: Incremental Updates

**Description:** Allow users to add, edit, or remove positions without full re-analysis.

---

### User Story 4.3.1.0: Chronological Profile Extension
**As a** user, **I want to** add a new position to my job history, **so that** I can include recent experience without re-analyzing my entire resume.

#### Acceptance Criteria:
- **4.3.1.A.1:** I can add a new position with all relevant information.
- **4.3.1.A.2:** The new position is placed in chronological order.
- **4.3.1.A.3:** Running totals (years of experience, skills) are updated.

---

### User Story 4.3.2.0: Position Record Refinement
**As a** user, **I want to** edit information in an existing position, **so that** I can correct errors or add details.

#### Acceptance Criteria:
- **4.3.2.A.1:** I can modify any field in an existing position.
- **4.3.2.A.2:** My changes are saved and reflected in the job history.

---

### User Story 4.3.3.0: Profile Curation Management
**As a** user, **I want to** remove a position from my job history, **so that** I can exclude irrelevant experience.

#### Acceptance Criteria:
- **4.3.3.A.1:** I can select a position to remove.
- **4.3.3.A.2:** The system asks me to confirm before removing.
- **4.3.3.A.3:** Running totals are updated after removal.

#### Business Rules:
- **4.0.0.R.1:** (BAR/CAR Achievement Format) Achievements MUST be documented using a structured Context-Action-Result (CAR) or Background-Action-Result (BAR) format.
- **4.0.0.R.2:** (Individual Contribution Validation) The system MUST distinguish between team-wide accomplishments and the user's specific individual contribution.
- **4.0.0.R.3:** (Surgical Update Philosophy) When building the narrative, the system MUST perform "surgical updates"—adding or enhancing specific details without removing, rewriting, or losing existing valid content.
- **4.0.0.R.4:** (Honest Limitations Disclosure) Any noted constraints or limited exposures (e.g., "basic familiarity only") MUST be captured in an "Honest Limitations" section to prevent over-claiming in the optimized resume.
- **4.0.0.R.5:** (Evidence Linkage) Every skill or achievement identified during the narrative build MUST be linked to specific evidence (using company, title, and dates).
- **4.0.0.R.6:** (Hard/Soft Skill Classification) Skills MUST be classified as HARD (measurable technical knowledge) or SOFT (interpersonal/behavioral) using the standardized project decision tree.

---

# EPIC 5.0.0.0: User Interface

**Description:** Provide a visual interface for interacting with the system.

**Business Value:** Users can engage with the system through an intuitive, visually appealing interface rather than text-only interaction.

---

## Feature 5.1.0.0: Model Selection

**Description:** Allow users to choose which AI model to use for analysis.

---

### User Story 5.1.1.0: Compute Tier Selection
**As a** user, **I want to** choose which AI model to use, **so that** I can balance speed, quality, and cost.

#### Acceptance Criteria:
- **5.1.1.A.1:** The system displays available model options.
- **5.1.1.A.2:** Each option includes a description of its characteristics.
- **5.1.1.A.3:** I can select a model before analysis begins.

---

### User Story 5.1.2.0: Model Policy Enforcement
**As a** system, **I want to** require the user to select a model before starting analysis, **so that** they make an informed choice.

#### Acceptance Criteria:
- **5.1.2.A.1:** The "Analyze" button is disabled until a model is selected.
- **5.1.2.A.2:** A message prompts the user to select a model.

---

### User Story 5.1.3.0: Subscription Transparency Display
**As a** user, **I want to** see which models require a paid subscription, **so that** I don't select an option I can't use.

#### Acceptance Criteria:
- **5.1.3.A.1:** Models requiring a paid subscription are clearly marked.
- **5.1.3.A.2:** If I select a paid model but don't have a subscription, I receive an error message.

---

## Feature 5.2.0.0: Token Usage Information

**Description:** Help users understand and manage their usage limits.

---

### User Story 5.2.1.0: Resource Consumption Estimation
**As a** user, **I want to** see how many tokens each model uses, **so that** I can plan my usage within my limits.

#### Acceptance Criteria:
- **5.2.1.A.1:** The system displays estimated token usage per model.
- **5.2.1.A.2:** The information is displayed before I start analysis.

---

### User Story 5.2.2.0: Allocation Awareness Display
**As a** user, **I want to** understand my daily usage limits, **so that** I can use the system strategically.

#### Acceptance Criteria:
- **5.2.2.A.1:** The system explains the usage limit (e.g., tokens per time period).
- **5.2.2.A.2:** The system explains that limits are shared across all features.

---

## Feature 5.3.0.0: Error Handling

**Description:** Display helpful error messages when problems occur.

---

### User Story 5.3.1.0: Concurrency Limit Management
**As a** user, **I want to** understand when I've hit my usage limit, **so that** I know when I can try again.

#### Acceptance Criteria:
- **5.3.1.A.1:** The system displays a clear message when the limit is reached.
- **5.3.1.A.2:** The message includes when the limit will reset.

---

### User Story 5.3.2.0: Graceful Degradation Handling
**As a** user, **I want to** understand when analysis fails, **so that** I know how to resolve the issue.

#### Acceptance Criteria:
- **5.3.2.A.1:** The system displays a clear error message.
- **5.3.2.A.2:** The message suggests possible solutions (e.g., try again, shorten resume).

---

### User Story 5.3.3.0: System Recovery Retry
**As a** user, **I want to** retry a failed analysis, **so that** I can attempt to complete the process.

#### Acceptance Criteria:
- **5.3.3.A.1:** The system allows me to retry after a failure.
- **5.3.3.A.2:** After multiple failures, the system provides more detailed guidance.

---

## Feature 5.4.0.0: Visual Results Display

**Description:** Present analysis results in a visually appealing, easy-to-understand format.

---

### User Story 5.4.1.0: Executive Insight Visualization
**As a** user, **I want to** see a visual summary of my analysis results, **so that** I can understand my overall status quickly.

#### Acceptance Criteria:
- **5.4.1.A.1:** The summary includes my overall score.
- **5.4.1.A.2:** The summary includes counts of issues by severity.
- **5.4.1.A.3:** The summary is displayed prominently at the top of the results.

---

### User Story 5.4.2.0: Information Hierarchy Management
**As a** user, **I want to** expand and collapse position details, **so that** I can focus on one position at a time.

#### Acceptance Criteria:
- **5.4.2.A.1:** Each position has a header I can click to expand or collapse.
- **5.4.2.A.2:** When collapsed, only the position summary is visible.
- **5.4.2.A.3:** When expanded, all bullet details are visible.

---

### User Story 5.4.3.0: Linguistic Balance Visualization
**As a** user, **I want to** see a chart showing my action verb distribution, **so that** I can quickly assess diversity.

#### Acceptance Criteria:
- **5.4.3.A.1:** The chart shows a bar for each verb category.
- **5.4.3.A.2:** The bars are proportional to the percentage of bullets in each category.
- **5.4.3.A.3:** The chart uses the same colors as the verb color coding.

---

### User Story 5.4.4.0: UI State Mass-Toggle
**As a** user, **I want to** expand or collapse all position sections at once, **so that** I can quickly navigate the report.

#### Acceptance Criteria:
- **5.4.4.A.1:** The system provides an "Expand All" button.
- **5.4.4.A.2:** The system provides a "Collapse All" button.
- **5.4.4.A.3:** Clicking "Expand All" opens all position sections.
- **5.4.4.A.4:** Clicking "Collapse All" closes all position sections.

---

## Feature 5.5.0.0: Cross-LLM Consistency

**Description:** Ensure job history output is consistent regardless of which AI model is used.

---

### User Story 5.5.1.0: Schema Consistency Enforcement
**As a** system, **I want to** use standardized templates for job history generation, **so that** any AI model produces identical structure.

#### Acceptance Criteria:
- **5.5.1.A.1:** All AI models reference the same job history template.
- **5.5.1.A.2:** Output structure is identical regardless of which model is used.

---

### User Story 5.5.2.0: Multi-Format Schema Delivery
**As a** system, **I want to** generate job history in both XML and Markdown formats, **so that** the output is optimized for both machine and human consumption.

#### Acceptance Criteria:
- **5.5.2.A.1:** The system generates an XML-structured file for machine readability.
- **5.5.2.A.2:** The system generates a Markdown file for human presentation.
- **5.5.2.A.3:** The XML file is the source of truth.

---

### User Story 5.5.3.0: Structural Integrity Verification
**As a** system, **I want to** validate job history files against the schema, **so that** I can catch structural errors.

#### Acceptance Criteria:
- **5.5.3.A.1:** The system can validate job history files.
- **5.5.3.A.2:** Validation catches missing sections.
- **5.5.3.A.3:** Validation catches malformed tags.

---

### User Story 5.5.4.0: Schema-Aware Format Transformation
**As a** user, **I want to** convert my job history from XML to Markdown, **so that** I can view it in a human-readable format.

#### Acceptance Criteria:
- **5.5.4.A.1:** The system can convert from XML to Markdown.
- **5.5.4.A.2:** The converted file maintains all content.

---

# EPIC 6.0.0.0: Local Development Mode

**Description:** Allow users to run the Resume Analyzer locally using Ollama, without requiring a Claude API subscription.

**Business Value:** Users can analyze resumes for free using open-source models running on their own hardware, with unlimited usage.

---

## Feature 6.1.0.0: Ollama Integration

**Description:** Connect to a local Ollama instance for AI processing.

---

### User Story 6.1.1.0: Backend Health Monitoring
**As a** user, **I want to** see whether Ollama is running on my computer, **so that** I know if I can use the analyzer.

#### Acceptance Criteria:
- **6.1.1.A.1:** The system displays Ollama connection status (Connected, Disconnected, Checking).
- **6.1.1.A.2:** When connected, the system shows how many models are available.
- **6.1.1.A.3:** When disconnected, the system provides instructions to start Ollama.

---

### User Story 6.1.2.0: Connection State Synchronization
**As a** user, **I want to** manually refresh the Ollama connection status, **so that** I can retry after starting Ollama.

#### Acceptance Criteria:
- **6.1.2.A.1:** The system provides a "Check Status" button.
- **6.1.2.A.2:** Clicking the button rechecks the Ollama connection.

---

### User Story 6.1.3.0: Service Status Awareness
**As a** user, **I want to** see a clear warning if Ollama is not running, **so that** I know how to fix the issue.

#### Acceptance Criteria:
- **6.1.3.A.1:** If Ollama is not running, display a warning banner.
- **6.1.3.A.2:** The warning includes the command to start Ollama.

---

## Feature 6.2.0.0: Local Model Selection

**Description:** Allow users to select from locally installed Ollama models.

---

### User Story 6.2.1.0: Local Resource Inventory
**As a** user, **I want to** see which Ollama models I have installed, **so that** I can choose one for analysis.

#### Acceptance Criteria:
- **6.2.1.A.1:** The system shows only models that are installed locally.
- **6.2.1.A.2:** Each model shows a name and description.
- **6.2.1.A.3:** One model is marked as recommended.

---

### User Story 6.2.2.0: Cognitive Model Defaulting
**As a** user, **I want** the system to automatically select the recommended model if available, **so that** I can start analyzing quickly.

#### Acceptance Criteria:
- **6.2.2.A.1:** If the recommended model is installed, it is pre-selected.
- **6.2.2.A.2:** Users can still change to a different model.

---

### User Story 6.2.3.0: Setup Guidance Delivery
**As a** user, **I want to** see how to install additional models, **so that** I can expand my options.

#### Acceptance Criteria:
- **6.2.3.A.1:** If configured models are not installed, the system shows installation instructions.
- **6.2.3.A.2:** Instructions include the correct `ollama pull` commands.

---

## Feature 6.3.0.0: Supported Local Models

**Description:** Support multiple open-source models via Ollama.

---

### User Story 6.3.1.0: Llama Architecture Compatibility
**As a** user, **I want to** use the Llama 3.1 model, **so that** I can get balanced speed and quality (recommended).

#### Acceptance Criteria:
- **6.3.1.A.1:** Llama 3.1 is available as a model option.
- **6.3.1.A.2:** Llama 3.1 is marked as the recommended model.

---

### User Story 6.3.2.0: Mistral Architecture Compatibility
**As a** user, **I want to** use the Mistral model, **so that** I can get fast analysis for shorter resumes.

#### Acceptance Criteria:
- **6.3.2.A.1:** Mistral is available as a model option.

---

### User Story 6.3.3.0: Gemma Architecture Compatibility
**As a** user, **I want to** use the Gemma 2 model, **so that** I can get detailed technical analysis.

#### Acceptance Criteria:
- **6.3.3.A.1:** Gemma 2 is available as a model option.

---

### User Story 6.3.4.0: Qwen Architecture Compatibility
**As a** user, **I want to** use the Qwen 2.5 model, **so that** I can get creative bullet rewrites.

#### Acceptance Criteria:
- **6.3.4.A.1:** Qwen 2.5 is available as a model option.

---

### User Story 6.3.5.0: Phi Architecture Compatibility
**As a** user, **I want to** use the Phi-3 model, **so that** I can get precise technical details.

#### Acceptance Criteria:
- **6.3.5.A.1:** Phi-3 is available as a model option.

---

## Feature 6.4.0.0: Local File Upload

**Description:** Allow users to upload resume files from their computer.

---

### User Story 6.4.1.0: Local Multi-Format Ingestion
**As a** user, **I want to** upload a text file from my computer, **so that** I don't have to copy and paste.

#### Acceptance Criteria:
- **6.4.1.A.1:** The system provides a file upload area.
- **6.4.1.A.2:** I can click to browse for a file.
- **6.4.1.A.3:** The system accepts .txt files.
- **6.4.1.A.4:** The file contents are loaded into the input area.

---

## Feature 6.5.0.0: Local Error Handling

**Description:** Provide helpful error messages for local mode issues.

---

### User Story 6.5.1.0: Connectivity Fault Notification
**As a** user, **I want to** understand when there's a connection problem with Ollama, **so that** I can fix it.

#### Acceptance Criteria:
- **6.5.1.A.1:** The system explains that Ollama cannot be reached.
- **6.5.1.A.2:** The error provides troubleshooting steps.
- **6.5.1.A.3:** The error includes the command to start Ollama.

---

### User Story 6.5.2.0: Parsing Fault Recovery
**As a** user, **I want to** understand when the model produces invalid output, **so that** I can try again or switch models.

#### Acceptance Criteria:
- **6.5.2.A.1:** The system explains that the response has a syntax error.
- **6.5.2.A.2:** The error suggests switching models.
- **6.5.2.A.3:** The error suggests simplifying the resume.

---

### User Story 6.5.3.0: Operational Transparency Toggle
**As a** user, **I want to** see debug information when troubleshooting, **so that** I can diagnose issues.

#### Acceptance Criteria:
- **6.5.3.A.1:** The system provides a toggle to show/hide debug info.
- **6.5.3.A.2:** Debug info includes Ollama status and selected model.
- **6.5.3.A.3:** Debug info references browser console for detailed logs.

---

### User Story 6.5.4.0: Data Persistence Awareness
**As a** user, **I want to** be reminded that my data is not saved, **so that** I remember to download my results.

#### Acceptance Criteria:
- **6.5.4.A.1:** The system displays a warning that data is not saved.
- **6.5.4.A.2:** The warning encourages downloading results before closing.

---

# EPIC 7.0.0.0: GUI for Additional Features

**Description:** Provide visual interfaces for the Job Fit Analyzer, Resume Customizer, and Narrative Builder features, following the design patterns established by the Resume Analyzer GUI.

**Business Value:** Users can interact with all system features through consistent, intuitive visual interfaces rather than text-only interaction.

**Status:** ❌ Not Yet Implemented (Future Enhancement)

---

## Feature 7.1.0.0: Job Fit Analyzer GUI

**Description:** Visual interface for comparing user experience against job descriptions.

---

### User Story 7.1.1.0: Standalone JD Intake Interface
**As a** user, **I want to** paste or upload a job description in the GUI as a standalone action, **so that** I can compare it against my experience at any time.

#### Acceptance Criteria:
- **7.1.1.A.1:** The system provides a text area to paste a job description.
- **7.1.1.A.2:** The system provides a file upload option for job descriptions.
- **7.1.1.A.3:** The interface matches the Resume Analyzer's input design.

---

### User Story 7.1.2.0: Source Profile Selection
**As a** user, **I want to** select which job history to use for comparison, **so that** I can use the most current version.

#### Acceptance Criteria:
- **7.1.2.A.1:** The system shows available job history files.
- **7.1.2.A.2:** I can select which file to use for comparison.
- **7.1.2.A.3:** The system indicates which file was last used.

---

### User Story 7.1.3.0: Strategic Fit Visualization
**As a** user, **I want to** see my fit score displayed visually, **so that** I can quickly understand my match level.

#### Acceptance Criteria:
- **7.1.3.A.1:** The fit score is displayed as a large, prominent number.
- **7.1.3.A.2:** The score is color-coded by match level (green for excellent, yellow for good, red for poor).
- **7.1.3.A.3:** The match level label is displayed (Excellent Match, Good Match, etc.).

---

### User Story 7.1.4.0: Matched Constraint List
**As a** user, **I want to** see a visual list of matched requirements, **so that** I know my strengths.

#### Acceptance Criteria:
- **7.1.4.A.1:** Matched requirements are displayed with a green checkmark.
- **7.1.4.A.2:** Each match shows the source evidence from my job history.
- **7.1.4.A.3:** The list is expandable/collapsible.

---

### User Story 7.1.5.0: Identified Gap Enumeration
**As a** user, **I want to** see a visual list of missing requirements, **so that** I know my gaps.

#### Acceptance Criteria:
- **7.1.5.A.1:** Missing requirements are displayed with a red X.
- **7.1.5.A.2:** Required skills are distinguished from preferred skills.
- **7.1.5.A.3:** The list is expandable/collapsible.

---

### User Story 7.1.6.0: Critical Blocker Notification
**As a** user, **I want to** see blocking conditions displayed prominently, **so that** I don't waste time on incompatible roles.

#### Acceptance Criteria:
- **7.1.6.A.1:** Blocking conditions are displayed at the top of the results.
- **7.1.6.A.2:** Blockers use red/warning styling to draw attention.
- **7.1.6.A.3:** Each blocker explains why it's a dealbreaker.

---

### User Story 7.1.7.0: Analysis Asset Export
**As a** user, **I want to** download my fit analysis, **so that** I can save it for reference.

#### Acceptance Criteria:
- **7.1.7.A.1:** The system provides a download button.
- **7.1.7.A.2:** The export includes the fit score, matches, and gaps.
- **7.1.7.A.3:** I can choose between formats (Markdown, plain text).

---

## Feature 7.2.0.0: Resume Customizer GUI

**Description:** Visual interface for generating and optimizing resume content.

---

### User Story 7.2.1.0: Optimization Scope Selection
**As a** user, **I want to** select which bullets to optimize from a visual list, **so that** I can focus on specific content.

#### Acceptance Criteria:
- **7.2.1.A.1:** My current bullets are displayed in a list.
- **7.2.1.A.2:** I can select/deselect bullets using checkboxes.
- **7.2.1.A.3:** I can select all or none with a single click.

---

### User Story 7.2.2.0: Optimization Context Injection
**As a** user, **I want to** specify the target job or industry, **so that** the optimization is tailored.

#### Acceptance Criteria:
- **7.2.2.A.1:** The system provides an input for target job title.
- **7.2.2.A.2:** The system provides an optional input for job description.
- **7.2.2.A.3:** The system provides an optional input for industry.

---

### User Story 7.2.3.0: Comparative Result Visualization
**As a** user, **I want to** see my original bullets next to the optimized versions, **so that** I can compare them.

#### Acceptance Criteria:
- **7.2.3.A.1:** Original bullet is displayed on the left.
- **7.2.3.A.2:** Optimized bullet is displayed on the right.
- **7.2.3.A.3:** Differences are highlighted (added keywords, stronger verbs).

---

### User Story 7.2.4.0: Individual Correction Acceptance
**As a** user, **I want to** accept or reject each optimization individually, **so that** I maintain control.

#### Acceptance Criteria:
- **7.2.4.A.1:** Each optimization has Accept and Reject buttons.
- **7.2.4.A.2:** Accepted optimizations are marked with a checkmark.
- **7.2.4.A.3:** Rejected optimizations can be re-optimized or kept original.

---

### User Story 7.2.5.0: Regenerative Variation Request
**As a** user, **I want to** request alternative versions of an optimization, **so that** I can choose the best fit.

#### Acceptance Criteria:
- **7.2.5.A.1:** Each optimization has a "Try Again" button.
- **7.2.5.A.2:** Clicking generates up to 3 alternative versions.
- **7.2.5.A.3:** I can select from the alternatives.

---

### User Story 7.2.6.0: Immediate Content Transfer
**As a** user, **I want to** copy my optimized bullets to the clipboard, **so that** I can paste them into my resume.

#### Acceptance Criteria:
- **7.2.6.A.1:** The system provides a "Copy All" button.
- **7.2.6.A.2:** Each bullet has an individual copy button.
- **7.2.6.A.3:** The system confirms when content is copied.

---

### User Story 7.2.7.0: Professional Brand Synthesis Interface
**As a** user, **I want to** request a professional summary through the GUI, **so that** I can generate resume header content.

#### Acceptance Criteria:
- **7.2.7.A.1:** The system provides a "Generate Summary" button.
- **7.2.7.A.2:** I can choose between master summary and job-specific summary.
- **7.2.7.A.3:** The generated summary is displayed in an editable text area.

---

### User Story 7.2.8.0: Tailored Asset Acquisition
**As a** user, **I want to** download all my optimized content, **so that** I can use it in my resume.

#### Acceptance Criteria:
- **7.2.8.A.1:** The system provides a download button for accepted optimizations.
- **7.2.8.A.2:** The export is in plain text format for easy pasting.
- **7.2.8.A.3:** The export is organized by position.

---

## Feature 7.3.0.0: Narrative Builder GUI

**Description:** Visual interface for discovering hidden achievements through probing questions.

---

### User Story 7.3.1.0: Interview-Style Achievement Discovery
**As a** user, **I want to** start building my narrative directly via probing questions, **so that** I can capture my achievements even before performing a full resume analysis.

#### Acceptance Criteria:
- **7.3.1.A.1:** Questions are displayed one at a time in a conversational format.
- **7.3.1.A.2:** Previous questions and answers are visible above.
- **7.3.1.A.3:** The interface resembles a chat or interview.
- **7.3.1.A.4:** The system can suggest trigger-ing a Resume Analysis if it detects missing foundational context during the narrative build.

---

### User Story 7.3.2.0: Conversational Response Capture
**As a** user, **I want to** type my answers to probing questions, **so that** I can provide detailed responses.

#### Acceptance Criteria:
- **7.3.2.A.1:** Each question has a text area for my answer.
- **7.3.2.A.2:** I can submit my answer with Enter or a button.
- **7.3.2.A.3:** Answers auto-save as drafts.

---

### User Story 7.3.3.0: Non-Linear Session Navigation
**As a** user, **I want to** skip questions I can't answer now, **so that** I can complete them later.

#### Acceptance Criteria:
- **7.3.3.A.1:** Each question has a "Skip" button.
- **7.3.3.A.2:** Skipped questions are saved for later.
- **7.3.3.A.3:** I can see a count of skipped questions.

---

### User Story 7.3.4.0: Extract Evidence Verification
**As a** user, **I want to** see metrics the system extracted from my answers, **so that** I can verify accuracy.

#### Acceptance Criteria:
- **7.3.4.A.1:** Extracted metrics are highlighted in my answers.
- **7.3.4.A.2:** I can confirm or correct extracted values.
- **7.3.4.A.3:** Confirmed metrics are marked with a checkmark.

---

### User Story 7.3.5.0: Preview Enriched Job History
**As a** user, **I want to** preview how my job history will look with new information, **so that** I can review before saving.

#### Acceptance Criteria:
- **7.3.5.A.1:** The system shows a preview of the enriched position.
- **7.3.5.A.2:** New information is highlighted.
- **7.3.5.A.3:** I can approve or edit before saving.

#### Business Rules:
- **7.3.5.R.1:** (Template Alignment) The preview MUST reflect the 12-section structure defined in the Job History Template (Metadata, Summary, Responsibilities, Achievements, Hard Skills, Soft Skills, Tools, Metrics, Industry, Methodology, Decisions, Team Scope).
- **7.3.5.R.2:** (BAR/CAR Transformation) Information extracted from interview answers MUST be transformed into the structured CAR (Context-Action-Result) format within the `<achievement>` tags.
- **7.3.5.R.3:** (Section-Specific Updating) The system MUST highlight which specific sections of the XML template (e.g., Section 7: Job History vs Section 5: Hard Skills) are being enriched by the current session.
- **7.3.5.R.4:** (Metric Attribution) All metrics previewed in `<impact_metrics>` MUST be cross-referenced against the `<key_achievements>` section to ensure internal consistency within the position block.
- **7.3.5.R.5:** (Schema Validation) The preview MUST be rendered from a valid XML stream that adheres to the `job_history_template.xml` schema before being displayed to the user.

---

### User Story 7.3.6.0: Profile Evolution Preservation
**As a** user, **I want to** save my enriched job history, **so that** future analyses use the new information.

#### Acceptance Criteria:
- **7.3.6.A.1:** The system provides a "Save" button.
- **7.3.6.A.2:** Saving increments the job history version.
- **7.3.6.A.3:** The system confirms successful save.

---

## Feature 7.4.0.0: Multi-Feature Navigation

**Description:** Allow users to navigate between all features in a unified interface.

---

### User Story 7.4.1.0: Centralized Module Navigation
**As a** user, **I want to** see a navigation menu for all features, **so that** I can switch between them.

#### Acceptance Criteria:
- **7.4.1.A.1:** A navigation bar or sidebar shows all available features.
- **7.4.1.A.2:** Features include: Resume Analyzer, Job Fit Analyzer, Resume Customizer, Narrative Builder.
- **7.4.1.A.3:** The current feature is highlighted.

---

### User Story 7.4.2.0: Cross-Module State Retention
**As a** user, **I want** my session data to persist when I switch features, **so that** I don't lose my work.

#### Acceptance Criteria:
- **7.4.2.A.1:** Switching features preserves my current analysis.
- **7.4.2.A.2:** I can return to a feature and continue where I left off.
- **7.4.2.A.3:** The system warns if I'm about to lose unsaved work.

---

### User Story 7.4.3.0: Display Workflow Guidance
**As a** user, **I want to** see suggested next steps based on my current state, **so that** I can follow the most logical path (Enrich -> Customize).

#### Acceptance Criteria:
- **7.4.3.A.1:** After Resume Analyzer, suggest Narrative Builder (to enrich data) or Job Fit Analyzer (to check a specific JD).
- **7.4.3.A.2:** After Narrative Builder, suggest Resume Customizer (to apply the new narrative to the resume).
- **7.4.3.A.3:** Suggestions explain the benefit of each next step.
- **7.4.3.A.4:** Job Fit Analyzer is presented as a utility that can be accessed at any time regardless of the core optimization path.

---

### User Story 7.4.4.0: Workflow Completion Monitoring
**As a** user, **I want to** see my progress through the overall workflow, **so that** I know how much I've completed.

#### Acceptance Criteria:
- **7.4.4.A.1:** The system shows which features I've completed.
- **7.4.4.A.2:** Each feature shows a completion status (Not Started, In Progress, Complete).
- **7.4.4.A.3:** Progress is saved across sessions if I download/upload my data.

---

## Feature 7.5.0.0: Consistent Design System

**Description:** Ensure all feature GUIs use consistent visual design.

---

### User Story 7.5.1.0: Universal Color Scheme Uniformity
**As a** user, **I want** all features to use the same color scheme, **so that** the application feels cohesive.

#### Acceptance Criteria:
- **7.5.1.A.1:** All features use the dark slate theme.
- **7.5.1.A.2:** Primary actions use blue.
- **7.5.1.A.3:** Warnings use orange, errors use red, success uses green.

---

### User Story 7.5.2.0: Interaction Pattern Predictability
**As a** user, **I want** buttons, inputs, and cards to look the same across features, **so that** I can predict interactions.

#### Acceptance Criteria:
- **7.5.2.A.1:** All buttons have consistent styling.
- **7.5.2.A.2:** All text areas have consistent styling.
- **7.5.2.A.3:** All cards and containers have consistent styling.

---

### User Story 7.5.3.0: Standardized Feedback Delivery
**As a** user, **I want** error messages to look and behave consistently, **so that** I can recognize and resolve issues.

#### Acceptance Criteria:
- **7.5.3.A.1:** All error messages use the same red notification style.
- **7.5.3.A.2:** All error messages include actionable guidance.
- **7.5.3.A.3:** Error icons are consistent across features.

---

### User Story 7.5.4.0: Synchronous State Visualization
**As a** user, **I want** loading states to look the same across features, **so that** I know when the system is working.

#### Acceptance Criteria:
- **7.5.4.A.1:** All features use the same spinner component.
- **7.5.4.A.2:** Loading text describes what's happening.
- **7.5.4.A.3:** Buttons are disabled during loading.

---

# Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ATS** | Applicant Tracking System - software used by employers to filter resumes |
| **Bullet** | A single achievement or responsibility statement in a resume |
| **Fit Score** | A percentage indicating how well a user matches a job description |
| **Hard Skill** | A technical or measurable ability (e.g., Python, SQL) |
| **Job History** | A structured document containing a user's complete work history |
| **Soft Skill** | An interpersonal or behavioral ability (e.g., leadership, communication) |
| **Verb Category** | A grouping of action verbs by type of work (Built, Led, Managed, Improved, Collaborated) |

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | January 11, 2026 | AI Assistant | Initial draft with technical implementation details |
| 1.1.0 | January 11, 2026 | AI Assistant | Expanded business rules to individual items |
| 2.0.0 | January 11, 2026 | AI Assistant | Complete rewrite to natural language; atomic user stories; added acceptance criteria; removed technical implementation details |
| 2.1.0 | January 11, 2026 | AI Assistant | Added Epic 6 (Local Development Mode) and Feature 5.5 (Cross-LLM Consistency) |
| 2.2.0 | January 11, 2026 | AI Assistant | Added Epic 7 (GUI for Additional Features) with UI requirements for Job Fit Analyzer, Resume Customizer, and Narrative Builder |
