# Claude Project: "Should I Apply?" - Fit Check + Bullets Generator

**Version:** 1.0
**Created:** January 29, 2026
**Purpose:** Quick decision tool for job hunting - check fit and generate customized bullets for a specific job
**Setup Time:** 10 minutes (one-time)
**Per-Use Time:** 5-10 minutes

---

## Overview

This Claude Project helps you quickly decide whether to apply to a job and generates customized bullets if you're a good fit.

**What You'll Get:**
1. ✅ Fit score (0-100) with keyword breakdown
2. ✅ Matched/missing keywords analysis
3. ✅ Decision: "Should I apply?"
4. ✅ Customized bullets (if fit >= 50)
5. ✅ Customized summary (if fit >= 50)

**Frequency:** Best for checking 1-5 jobs per week

---

## Project Instructions (Copy This Into Claude Projects)

### Paste This Into Your Project Settings > Instructions

```
# "Should I Apply?" Resume Assistant

You are a resume optimization assistant specialized in helping candidates quickly assess job fit and generate customized application materials.

## Your Role

When a user provides a job description (and optionally their resume):

**Resume Source Priority:**
1. If user provides resume in message → Use provided resume
2. If project has resume.txt or resume.md file → Use project file
3. If project has job-history-summary.md or job_history_summaries_*.txt → Use job history as resume
4. If none found → Ask user to provide their resume

Execute this workflow:

### Step 1: Load Your Knowledge & Resume
1. Read jfa_workflow-router.md to understand your workflow options
2. Check for existing resume in project files:
   - Look for: resume.txt, resume.md, job-history-summary.md, job_history_summaries_*.txt
   - If found and no resume provided in message → Use this file as the user's resume
   - If multiple found → Prefer job-history-summary.md or most recent job_history_summaries_*.txt
3. If no resume file found in project → User must provide resume in message

### Step 2: Run Fit Assessment
Follow jfa_job-fit-assessment.md to:
- Calculate fit score (0-100)
- Display top 5 matched keywords
- Display top 5 missing keywords
- Show match percentage for each keyword

### Step 3: Decision Gate
IF fit score >= 50:
  - Ask: "Your fit is strong (Score: X/100). Would you like me to generate customized bullets and summary for this role?"

ELSE (fit < 50):
  - Ask: "Your fit is moderate/weak (Score: X/100). Would you still like customized materials, or explore a better-matched role?"

### Step 4: Generate Customized Materials (If User Says Yes)

#### Generate Bullets:
Follow bo_bullet-generation-instructions.md:
- Implement 3-stage checkpoint pattern (Budget → Per-Bullet → Reconciliation)
- Use bo_evidence-matching.md for requirement matching
- Use shared_keyword_validation.md to prevent hallucinated skills
- Validate using bo_output-validator.md
- Show character counts and validation checks

#### Generate Summary:
Follow ng_summary-generation.md to:
- Create 2-3 sentence customized summary
- Integrate JD keywords naturally
- Maintain accuracy of metrics/achievements

### Step 5: Output Format

**For Fit Assessment:**
```
Fit Score: X/100 ✅/🟡/❌

Top 5 Matched Keywords:
✅ [Keyword] ([%] match)
✅ [Keyword] ([%] match)
...

Top 5 Missing Keywords:
❌ [Keyword] (0% - not found)
⚠️ [Keyword] ([%] - partial match)
...
```

**For Bullets:**
```
CUSTOMIZED BULLETS FOR [COMPANY] | [JOB TITLE]

Position: [Position Name] | [Dates]

[Verb] [Achievement] [Metrics]

Validation:
✓ Character count: X (within 100-210)
✓ Verb diversity: No repeats
✓ Metrics verified: All claims traceable
```

**For Summary:**
```
CUSTOMIZED PROFESSIONAL SUMMARY

[2-3 sentences tailored to job description]

---
Ready to paste into cover letter!
```

## Critical Standards

- **Always** validate keywords against resume using shared_keyword_validation.md - never hallucinate skills
- **Always** show fit assessment before asking about bullets/summary
- **Always** use format-rules.md for character limits (100-210 chars per bullet)
- **Always** use verb-categories.md for verb diversity
- **Never** change quantified metrics - all numbers must be accurate
- **Never** claim skills not explicitly in the resume

## File References

Core foundation: format-rules.md, fit-thresholds.md, verb-categories.md, adjacent-technical.md, industry-context.md, keyword-context.md, metrics-requirements.md, portfolio-weighting.md, role-type-validation.md

Fit analysis: jfa_workflow-router.md, jfa_job-fit-assessment.md, jfa_re-comparison.md, jfa_incremental-updates.md

Bullets: bo_evidence-matching.md, bo_bullet-generation-instructions.md, bo_output-validator.md, bo_keyword_handling.md, bo_bullet-generation-logic.md

Validation: shared_keyword_validation.md, shared_verb_taxonomy.md, shared_core_principles.md

Resume analysis: ra_jd-parsing.md (for parsing job descriptions)
```

---

## Files to Upload (22 files total)

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

### Batch 2: Job Fit Analyzer (4 files)
```
optimization-tools/job-fit-analyzer/:
  - jfa_workflow-router.md
  - jfa_job-fit-assessment.md
  - jfa_re-comparison.md
  - jfa_incremental-updates.md
```

### Batch 3: Bullet Optimizer (5 files)
```
optimization-tools/bullet-optimizer/:
  - bo_evidence-matching.md ⭐
  - bo_bullet-generation-instructions.md
  - bo_output-validator.md
  - bo_keyword_handling.md
  - bo_bullet-generation-logic.md
```

### Batch 4: Shared + Resume Parsing (4 files)
```
optimization-tools/shared/:
  - shared_keyword_validation.md
  - shared_verb_taxonomy.md
  - shared_core_principles.md

optimization-tools/resume-analyzer/:
  - ra_jd-parsing.md
```

---

## Setup Steps

### 1. Create the Project
1. Go to [claude.anthropic.com/projects](https://claude.anthropic.com/projects)
2. Click "Create new project"
3. Name: **"Should I Apply?"**
4. Description: "Quick fit checker and bullet generator for job applications"

### 2. Add Instructions
1. Go to Project Settings (gear icon)
2. Find "Instructions" section
3. Paste the instructions above (between the triple backticks)
4. Save

### 3. Upload Files
1. In the project, find "Knowledge" or "Upload Files" section
2. Upload the 22 optimization files in 4 batches (drag 5-6 at a time):
   - Batch 1: 9 core files
   - Batch 2: 4 jfa files
   - Batch 3: 5 bo files
   - Batch 4: 4 shared + ra files
3. **Optional (Recommended):** Upload your resume as a file to the project:
   - Create a file called `resume.txt` or `resume.md` with your resume content
   - Upload it to the project knowledge
   - After this, you can just paste job descriptions - the project will automatically use your uploaded resume
4. Wait for all files to show ✓ (uploaded successfully)

### 4. Test the Project
1. Open the project
2. Paste a sample resume
3. Paste a sample job description
4. Type: "Check if I should apply to this role. If fit is good, generate customized bullets."
5. Claude should respond with fit assessment + optional bullets

---

## First Use Example

### Input
```
[Your resume in plain text]

---

[Job description from LinkedIn/company website]
```

### Output
```
FIT ASSESSMENT
==============
Fit Score: 72/100 ✅ PROCEED

Matched Keywords (Top 5):
✅ Product Management (95%)
✅ Agile/Scrum (85%)
✅ Stakeholder Management (80%)
✅ Enterprise SaaS (75%)
✅ Technical Leadership (70%)

Missing Keywords (Top 5):
❌ Go-to-market Strategy (0%)
⚠️ Python (40% - mentioned but not emphasized)
❌ Kubernetes (0%)
⚠️ Data Analytics (30%)
❌ FinTech Domain (0%)

RECOMMENDATION
Your fit is strong for this role. The missing "go-to-market strategy" can be
addressed in your cover letter. Proceed with application.

---

Would you like me to generate customized bullets and summary for this role?
```

### If User Says "Yes"
```
CUSTOMIZED BULLETS
==================

Position: Senior Product Manager (Google) | 2021-2024

[Architected] Architected enterprise SaaS platform serving 500K+ users
across 12+ integrated features, demonstrating ability to manage complex
technical roadmaps in fast-moving organizations.

[Led] Led cross-functional teams of 8+ engineers and designers through
quarterly planning cycles, establishing agile methodologies that improved
sprint velocity by 40%.

[Optimized] Optimized stakeholder communication processes for c-suite
presentations, translating technical concepts into business impact metrics
that drove executive alignment on product strategy.

---

CUSTOMIZED SUMMARY

Product-focused technical leader with 8+ years scaling enterprise SaaS platforms
at Google and Salesforce. Expert in Agile product management, stakeholder
alignment, and cross-functional team leadership. Proven ability to balance
technical complexity with business outcomes, driving products from concept
through 500K+ user adoption. Known for exceptional ability to communicate
technical strategy to executive stakeholders.

---

Ready to paste into your resume/cover letter!
```

---

## Tips for Best Results

1. **Resume Quality Matters**
   - Include specific metrics (not "managed team" but "led team of 8")
   - Include quantified results (not "improved performance" but "reduced time by 40%")
   - Include company names and dates

2. **Job Description Format**
   - Copy the full job posting (title, company, requirements, description)
   - Include "Required Skills" and "Responsibilities" sections
   - Full context helps with better analysis

3. **Customization**
   - Generated bullets are ready to use as-is
   - You can ask for variations: "Give me 3 alternative bullets for this position"
   - You can ask for keyword emphasis: "Emphasize Python skills more"

4. **Follow-up Questions**
   - "Make the bullets shorter" → Reweigh character limits
   - "Add more metrics" → Identify additional quantifiable achievements
   - "Different angle" → Generate alternative phrasing
   - "How do I address the [missing skill]?" → Bridge gap analysis

---

## When to Use This Project

✅ **Perfect for:**
- Checking 1-5 jobs per week
- Quick "should I apply?" decisions
- Generating position-specific bullets
- Comparing fit across multiple roles in one session

❌ **Not ideal for:**
- Deep career analysis (use Resume Analyzer instead)
- Comprehensive resume rewrites
- Long-term career planning

---

## Next Steps After Using This Project

**If Fit >= 75%:** Apply with generated bullets
**If Fit 50-75%:** Use bullets + customize in cover letter
**If Fit < 50%:** Consider different role or use resume analyzer to strengthen profile

---

## Support

- For detailed bullet generation logic, see bo_bullet-generation-instructions.md
- For keyword validation rules, see shared_keyword_validation.md
- For fit scoring details, see jfa_job-fit-assessment.md
- For full resume deep-dive, see the "Resume Analyzer" project (separate)

---

**Ready to go!** 🚀 Open the project and paste your resume + job description to start.
