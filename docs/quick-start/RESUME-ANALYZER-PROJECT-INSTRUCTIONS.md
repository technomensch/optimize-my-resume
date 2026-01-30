# Claude Project: Resume Analyzer - Deep Career Analysis + Summary Generation

**Version:** 1.0
**Created:** January 29, 2026
**Purpose:** Comprehensive resume analysis and professional summary generation
**Setup Time:** 10 minutes (one-time)
**Per-Use Time:** 10-15 minutes

---

## Overview

This Claude Project provides deep-dive resume analysis and generates your professional master summary.

**What You'll Get:**
1. ✅ Complete resume/job history extraction and analysis
2. ✅ Career trajectory and achievements mapping
3. ✅ Master professional summary (for all applications)
4. ✅ Hard skills and soft skills assessment
5. ✅ Career metrics and impact quantification
6. ✅ Exportable job history for future use

**Frequency:** Best for initial setup or quarterly resume reviews

**Note:** Once you create your master summary, use the "Should I Apply?" project for individual job applications.

---

## Project Instructions (Copy This Into Claude Projects)

### Paste This Into Your Project Settings > Instructions

```
# Resume Analyzer - Career Analysis & Summary Generation

You are a professional resume analyst specializing in extracting career data,
identifying achievements, and generating comprehensive summaries.

## Your Role

When a user requests resume analysis:

**Resume Source Priority:**
1. If user provides resume in message → Use provided resume
2. If project has resume.txt or resume.md file → Use project file
3. If project has job-history-summary.md or job_history_summaries_*.txt → Use job history for analysis
4. If none found → Ask user to provide their resume

Execute this workflow:

### Step 1: Load Your Knowledge & Resume
1. Read ra_resume-analyzer.md to understand the analysis framework
2. Check for existing resume in project files:
   - Look for: resume.txt, resume.md, job-history-summary.md, job_history_summaries_*.txt
   - If found and no resume provided in message → Use this file as the user's resume
   - If multiple found → Prefer job-history-summary.md or most recent job_history_summaries_*.txt
3. If no resume file found in project → User must provide resume in message

### Step 2: Perform Resume Analysis
Follow ra_resume-analysis-procedures.md to:
- Extract all positions (job title, company, dates, achievements)
- Identify hard skills demonstrated across all roles
- Identify soft skills demonstrated across all roles
- Map career trajectory and progression
- Quantify impact (revenue, cost savings, team size, users impacted, etc.)

### Step 3: Quality Gate Validation
Use ra_quality-gates-guardrails.md to validate:
- All metrics are traceable to specific achievements
- All claims are supported by resume content
- Skills are accurately categorized (hard vs soft)
- Impact quantification follows guardrail standards

### Step 4: Generate Master Summary
Follow ng_summary-generation.md to:
- Aggregate career data across all positions
- Select top 2-3 achievements by impact
- Identify top 2-3 hard skills by frequency and relevance
- Identify top 1-2 soft skills by demonstration
- Generate 3-4 sentence master professional summary
- Format as ready-to-use resume header

### Step 5: Output Comprehensive Analysis Report

**Format:**

```
========================================
RESUME ANALYSIS COMPLETE
========================================

CAREER OVERVIEW
===============
Total Experience: X years
Positions Analyzed: N
Current Title: [Title]
Key Industries: [Industries]

TOP ACHIEVEMENTS (By Impact)
=============================
1. [Achievement] - [Quantified Impact]
   Evidence: [Supporting details]

2. [Achievement] - [Quantified Impact]
   Evidence: [Supporting details]

3. [Achievement] - [Quantified Impact]
   Evidence: [Supporting details]

HARD SKILLS IDENTIFIED
======================
(Ranked by frequency and recency)
1. [Skill] - X years, Y positions
2. [Skill] - X years, Y positions
3. [Skill] - X years, Y positions
[... top 10 total]

SOFT SKILLS IDENTIFIED
======================
(Ranked by demonstration strength)
1. [Skill] - Demonstrated in: [positions]
2. [Skill] - Demonstrated in: [positions]
[... top 5-7 total]

CAREER METRICS
===============
- Total team leadership: X people (max in single role)
- Revenue impact: $X (aggregated across achievements)
- Cost savings: $X (aggregated across achievements)
- Users impacted: X (peak scale)
- Notable companies: [Company names]

---

MASTER PROFESSIONAL SUMMARY
===========================

[3-4 sentences synthesizing entire career]

Copy this directly into the professional summary section of your resume.
Use this as baseline for role-specific customization.

---

NEXT STEPS
==========
1. Export this analysis (save for future reference)
2. Use "Should I Apply?" project to generate role-specific bullets
3. For each job: fit check → customized bullets → apply
```

## Quality Standards

- **Always** validate all metrics against resume content
- **Always** support all skills with specific evidence from positions
- **Always** use ng_summary-generation.md for summary structure
- **Always** follow ra_quality-gates-guardrails.md validation
- **Never** infer skills not explicitly mentioned in resume
- **Never** fabricate or speculate about metrics

## File References

Resume Analysis: ra_resume-analyzer.md, ra_resume-analysis-procedures.md
Quality Standards: ra_quality-gates-guardrails.md
Summary Generation: ng_summary-generation.md
Job Description Parsing: ra_jd-parsing.md
Narrative System: ra_narrative-generation-system.md

Core Foundation: format-rules.md, metrics-requirements.md, adjacent-technical.md,
fit-thresholds.md, verb-categories.md, industry-context.md, keyword-context.md,
portfolio-weighting.md, role-type-validation.md

Shared Standards: shared_keyword_validation.md, shared_verb_taxonomy.md, shared_core_principles.md
```

---

## Files to Upload (19 files total)

### Batch 1: Core Foundation (9 files)
```
core/:
  - adjacent-technical.md
  - fit-thresholds.md
  - format-rules.md
  - industry-context.md
  - keyword-context.md
  - metrics-requirements.md
  - portfolio-weighting.md
  - role-type-validation.md
  - verb-categories.md
```

### Batch 2: Resume Analyzer (6 files)
```
optimization-tools/resume-analyzer/:
  - ra_resume-analyzer.md
  - ra_resume-analysis-procedures.md
  - ra_narrative-generation-system.md
  - ra_quality-gates-guardrails.md
  - ra_job-history-creation.md
  - ra_jd-parsing.md
```

### Batch 3: Narrative + Shared (4 files)
```
optimization-tools/narrative-generator/:
  - ng_summary-generation.md

optimization-tools/shared/:
  - shared_keyword_validation.md
  - shared_verb_taxonomy.md
  - shared_core_principles.md
```

---

## Setup Steps

### 1. Create the Project
1. Go to [claude.anthropic.com/projects](https://claude.anthropic.com/projects)
2. Click "Create new project"
3. Name: **"Resume Analyzer"**
4. Description: "Deep career analysis and professional summary generation"

### 2. Add Instructions
1. Go to Project Settings (gear icon)
2. Find "Instructions" section
3. Paste the instructions above (between the triple backticks)
4. Save

### 3. Upload Files
1. In the project, find "Knowledge" or "Upload Files" section
2. Upload the 19 optimization files in 3 batches (drag 6-7 at a time):
   - Batch 1: 9 core files
   - Batch 2: 6 resume analyzer files
   - Batch 3: 4 narrative + shared files
3. **Recommended:** Upload your resume as a file to the project:
   - Create a file called `resume.txt` or `resume.md` with your complete resume
   - Upload it to the project knowledge
   - After this, you can just ask for analysis - the project will automatically use your uploaded resume
   - The project will detect and use the resume for all future analysis requests
4. Wait for all files to show ✓ (uploaded successfully)

### 4. Test the Project
1. Open the project
2. Paste your complete resume (plain text)
3. Type: "Analyze my resume and generate a comprehensive professional summary"
4. Claude should respond with full analysis + master summary

---

## First Use Example

### Input
```
SENIOR TECHNICAL BUSINESS ANALYST
Federal IT Leadership | 10+ years

Principal Technical Architect (2024-Present)
Federal Agency | Washington, DC
- Architected knowledge management system generating 259 markdown files (80K+ lines)
- Established requirements discipline framework driving 47 releases in 5 weeks
- Led team of 3 across multi-month project recovery
- Created 9 architectural decision records (ADRs) with 30 associated guardrails

Senior Requirements Analyst (2019-2024)
Federal Agency | Washington, DC
- Managed requirements for 95+ implementation plans across 77 archived + 18 active
- Captured 19 lessons learned from debugging sessions
- Established GitHub CLI integration workflows reducing manual processing by 60%
- Mentored 2 junior analysts in requirements discipline

[... additional positions ...]
```

### Output
```
========================================
RESUME ANALYSIS COMPLETE
========================================

CAREER OVERVIEW
===============
Total Experience: 10 years
Positions Analyzed: 2
Current Title: Principal Technical Architect
Key Industries: Federal IT, Government Technology

TOP ACHIEVEMENTS (By Impact)
=============================
1. Knowledge Management Architecture - 259 markdown files, 80K+ lines, 4-pillar design
   Evidence: Principal Technical Architect (2024-Present)

2. Requirements Discipline Framework - 47 releases in 5 weeks, 100% plan-before-implement
   Evidence: Principal Technical Architect (2024-Present)

3. Architectural Decision Documentation - 9 ADRs, 30 guardrails
   Evidence: Principal Technical Architect (2024-Present)

HARD SKILLS IDENTIFIED
======================
1. Requirements Management - 10 years, 2 positions
2. Architectural Design - 5 years, 1 position
3. GitHub CLI/Git Workflows - 5 years, 2 positions
4. Knowledge Management Systems - 5 years, 1 position
5. Federal IT Governance - 10 years, 2 positions

SOFT SKILLS IDENTIFIED
======================
1. Technical Leadership - Demonstrated through: Architecture design, team mentoring
2. Requirements Discipline - Demonstrated through: Framework establishment, release velocity
3. Cross-functional Coordination - Demonstrated through: Multi-agency context, team leadership
4. Documentation & Communication - Demonstrated through: ADR creation, 80K+ line documentation
5. Problem-solving - Demonstrated through: Project recovery, debugging session lessons

CAREER METRICS
===============
- Total team leadership: 3 people (current role)
- Documentation generated: 259 files, 80K+ lines
- Release velocity: 47 releases in 5 weeks (0.167 weeks/release)
- Architectural decisions documented: 9 ADRs
- Quality framework: 30 guardrails
- Notable organizations: Federal Agencies (DHS, State Dept, CISA)

---

MASTER PROFESSIONAL SUMMARY
===========================

Principal Technical Architect with 10+ years establishing requirements discipline and
scaling documentation systems for federal agencies. Expert in knowledge management architecture,
generating 259 markdown files across 4-pillar systems supporting 95+ implementation plans.
Demonstrated technical leadership through architecting frameworks driving 47 releases in 5 weeks
(100% plan-before-implement discipline) and creating 9 architectural decision records establishing
30 quality guardrails. Known for exceptional ability to systematize complex processes and mentor
teams in engineering discipline.

---

NEXT STEPS
==========
1. Copy master summary to your resume header
2. Use "Should I Apply?" project for role-specific customization
3. For each job application: paste this analysis + job description → get customized bullets
```

---

## When to Use This Project

✅ **Perfect for:**
- Initial resume setup (extract career data once)
- Quarterly resume updates (refresh analysis)
- Career transition planning (understand what skills transfer)
- Building job history documentation

❌ **Not ideal for:**
- Quick job fit checks (use "Should I Apply?" instead)
- Individual bullet generation (use "Should I Apply?" instead)
- Real-time job hunting (use "Should I Apply?" for speed)

---

## Workflow Integration

**Typical Usage Pattern:**

1. **Week 1: Resume Analyzer**
   - Analyze complete resume once
   - Generate master professional summary
   - Export analysis for reference
   - Total time: 15 minutes

2. **Week 2+: Should I Apply Project**
   - For each job: use "Should I Apply?" project
   - Paste master summary + job description
   - Get fit score + customized bullets
   - Apply if fit >= 50%
   - Time per job: 5-10 minutes

3. **Monthly: Resume Analyzer**
   - Update resume with new achievements
   - Re-run analysis
   - Update master summary
   - Total time: 10 minutes

---

## Tips for Best Results

1. **Include Quantified Metrics**
   - Not: "Led team"
   - But: "Led team of 8 engineers"
   - Not: "Improved performance"
   - But: "Reduced ETL runtime by 65% (4.2hrs → 1.5hrs)"

2. **Include Business Impact**
   - Include revenue generated ($X ARR)
   - Include cost savings ($X reduction)
   - Include scale metrics (users, records, documents)
   - Include timeline context (5 weeks, 2 years, etc.)

3. **Include Company Context**
   - Include company names
   - Include industry context (SaaS, government, fintech, etc.)
   - Include dates/tenure
   - Include team context (reported to, led teams, cross-functional)

4. **Structure Matters**
   - Job title, company, dates clearly separated
   - Achievement bullets with metrics
   - 3-5 key achievements per position (not exhaustive list)

---

## Export & Reuse

After analysis, you can:
- ✅ Copy master summary to your actual resume
- ✅ Save the full analysis report for reference
- ✅ Share the analysis with mentors for feedback
- ✅ Use skills inventory to identify learning gaps

---

## Support

- For analysis methodology, see ra_resume-analyzer.md
- For quality standards, see ra_quality-gates-guardrails.md
- For summary generation, see ng_summary-generation.md
- For job-fit analysis (per role), see the "Should I Apply?" project

---

**Ready to analyze!** 🚀 Open the project and paste your complete resume to begin.
