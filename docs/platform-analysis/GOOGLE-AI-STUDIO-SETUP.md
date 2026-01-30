# Google AI Studio Setup: Two Resume Optimization Projects

**Date:** January 29, 2026
**Purpose:** Set up two separate Gemini-powered resume tools in Google AI Studio
**Total Setup Time:** 40-60 minutes (both projects)
**Cost:** Free (100 requests/month each)

---

## Overview

Create two separate Google AI Studio apps to match your two Claude Projects:

1. **"Should I Apply?"** - Quick fit check + bullets (5-10 min per use)
2. **Resume Analyzer** - Deep analysis + summary generation (15 min per use)

Both use the same files from your optimize-my-resume repository, but with different prompts and workflows.

---

## Why Google AI Studio?

- ✅ Persistent URLs you can bookmark
- ✅ No file re-uploads (files stay loaded)
- ✅ Free tier: 100 requests/month
- ✅ One-click deployment
- ✅ Auto-generates web interface
- ✅ Can be shared with others

**Trade-off:** Gemini model is slightly weaker than Claude, but sufficient for resume work.

---

## Prerequisites

1. Google Account (free)
2. Access to [ai.google.dev/studio](https://ai.google.dev/studio)
3. Your optimize-my-resume files locally (from earlier setup)
4. 40-60 minutes

---

---

# PROJECT 1: "Should I Apply?" in Google AI Studio

## Part 1: Create the App

### Step 1: Navigate to Google AI Studio
1. Go to [ai.google.dev/studio](https://ai.google.dev/studio)
2. Sign in with your Google account
3. Click **"Build in Studio"** (not "Chat")

### Step 2: Create New App
1. Find "Create New App" section
2. Click **"Get Started"**
3. Select **"Create blank project"**

### Step 3: Name Your Project
- **Project Name:** "Should I Apply?"
- **Description:** "Quick job fit checker and customized bullet generator"

---

## Part 2: Add the Prompt

### Step 4: Define the App Instructions

In the **"System Instructions"** or **"Prompt"** section, paste:

```
You are a resume optimization assistant specialized in quick job fit assessment
and customized bullet generation.

WORKFLOW:
1. Check for resume in project files (resume.txt, resume.md, job-history-summary.md, job_history_summaries_*.txt)
   - If found and user hasn't provided resume → Use project file
   - If not found → User must provide resume
2. User provides: job description (resume comes from project files or message)
3. You perform fit assessment
4. Generate customized bullets if fit >= 50

PROCESS:

## Step 1: Fit Assessment
- Extract keywords from job description
- Match against resume content
- Calculate fit score (0-100) as percentage of matched requirements
- List top 5 matched keywords with match percentage
- List top 5 missing keywords with impact assessment

## Step 2: Decision Gate
IF fit_score >= 50:
  - Recommend proceeding with application
  - Ask if user wants customized bullets
ELSE:
  - Note that significant gaps exist
  - Suggest considering other roles or strengthening resume

## Step 3: Generate Customized Bullets (if requested)
- Create 3-5 position-specific bullets
- Each bullet: [Verb] [Achievement] [Metrics]
- Character count: 100-210 characters each
- Show validation: character count, verb diversity, metric accuracy

## Step 4: Generate Customized Summary (if requested)
- Create 2-3 sentence professional summary
- Incorporate top 3 JD keywords naturally
- Maintain factual accuracy of all metrics
- Ready-to-paste format

OUTPUT FORMAT FOR FIT ASSESSMENT:

```
FIT ASSESSMENT RESULTS
======================

Fit Score: [X]/100 ✅/🟡/❌

Top 5 Matched Keywords:
✅ [Keyword] ([%]% match)
✅ [Keyword] ([%]% match)
...

Top 5 Missing Keywords:
❌ [Keyword] (0% - critical gap)
⚠️ [Keyword] ([%]% - partial match)
...

RECOMMENDATION:
[Brief recommendation about applying]

---
Would you like me to generate customized bullets and summary?
```

OUTPUT FORMAT FOR BULLETS:

```
CUSTOMIZED BULLETS
==================

[Position Title] | [Company] | [Dates]

[Verb] [Achievement with metrics]
Validation: [X] chars, verb: [Verb], metrics verified

[Verb] [Achievement with metrics]
Validation: [X] chars, verb: [Verb], metrics verified

[Verb] [Achievement with metrics]
Validation: [X] chars, verb: [Verb], metrics verified
```

OUTPUT FORMAT FOR SUMMARY:

```
CUSTOMIZED PROFESSIONAL SUMMARY
===============================

[2-3 sentences incorporating JD keywords]

Ready to paste into cover letter!
```

CRITICAL STANDARDS:
- Never hallucinate skills not in resume
- Never change quantified metrics
- Always validate keywords against resume
- Always show character counts for bullets
- Always explain why each bullet matches the JD

QUALITY GATES:
- Fit score must be based on demonstrated skills, not inferred
- All metrics must be traceable to resume content
- Bullets must have unique verbs (no repetition of "Led", "Managed", etc.)
- Character limits: 100-210 per bullet
- All keyword claims must have resume evidence
```

---

## Part 3: Upload Files

### Step 5: Add Files (if Google AI Studio supports file context)

**Option A: Upload Files (if supported)**
1. Look for "Files" or "Upload" section
2. Upload your prepared files:
   - All 9 core foundation files
   - All 4 jfa files
   - All 5 bo files
   - All 4 shared + ra files (22 total)

**Option B: Paste File Contents (if uploads not supported)**
1. Open each file locally
2. For the most critical files, paste their content into the system prompt or a supplementary context section
3. Priority order:
   - bo_bullet-generation-instructions.md
   - jfa_job-fit-assessment.md
   - shared_keyword_validation.md
   - format-rules.md

### Step 6: Test the App

1. Click **"Test"** or **"Preview"**
2. Paste a sample resume
3. Paste a sample job description
4. Enter: "Check my fit for this job. If I'm a good match, generate customized bullets."
5. Review the output for:
   - Accurate fit score
   - Reasonable keyword matching
   - Clear bullet generation
   - Proper validation information

---

## Part 4: Deploy

### Step 7: Deploy to Public URL

1. Click **"Deploy"** button
2. Select or create Google Cloud Project (free tier available)
3. Wait 2-5 minutes for deployment
4. You'll get a public URL like: `https://generativelanguage.googleapis.com/generate/...`
5. **Bookmark this URL** - you can reuse it forever

### Step 8: Share (Optional)

You can now:
- ✅ Bookmark the URL for personal use
- ✅ Share the link with others
- ✅ Use from any device with internet

---

## Pro Tip: Upload Your Resume to Google AI Studio (One-Time)

After you create your app, you can add your resume to the app's context:

1. Edit your app settings
2. Find the "Context" or "Files" section
3. Add a text block with your resume content (or paste as context)
4. Save

**Result:** Forever after, just paste job descriptions - the app automatically uses your resume

---

## Using Your Google AI Studio App

### First Time (without resume uploaded):
1. Open your bookmarked URL
2. Paste your resume
3. Paste a job description
4. Ask: "Check fit and generate bullets if good match"
5. Get results in 2-3 minutes

### After Uploading Resume to App:
1. Open your bookmarked URL (resume pre-loaded)
2. Paste new job description
3. Get fit check in 2-3 minutes
4. **Saves:** Resume copy/paste time forever

### Subsequent Uses:
1. Open your bookmarked URL (files stay loaded)
2. Paste new job description only
3. Get fit check in 2-3 minutes

---

---

# PROJECT 2: Resume Analyzer in Google AI Studio

## Part 1: Create the App

### Step 1: Create New App
1. Go back to [ai.google.dev/studio](https://ai.google.dev/studio)
2. Click **"Build in Studio"**
3. Click **"Create New App"** → **"Get Started"** → **"Create blank project"**

### Step 2: Name Your Project
- **Project Name:** "Resume Analyzer"
- **Description:** "Comprehensive resume analysis and professional summary generation"

---

## Part 2: Add the Prompt

### Step 3: Define the App Instructions

Paste this into the **"System Instructions"** section:

```
You are a professional resume analyst specializing in comprehensive career analysis
and professional summary generation.

WORKFLOW:
1. Check for resume in project files (resume.txt, resume.md, job-history-summary.md, job_history_summaries_*.txt)
   - If found and user hasn't provided resume → Use project file
   - If not found → User must provide resume
2. Extract and analyze all career data from provided or project resume
3. Generate comprehensive career analysis + master professional summary

PROCESS:

## Step 1: Extract Resume Data
- All positions (title, company, dates, location)
- All achievements with metrics
- All skills mentioned (hard and soft)
- All industries and domains
- Career timeline and progression

## Step 2: Analyze Career Data
- Identify top 3 achievements by impact (quantified)
- Rank hard skills by frequency and recency
- Rank soft skills by demonstration strength
- Calculate aggregate metrics (team size, revenue, cost savings, users impacted)
- Identify career trajectory and growth pattern

## Step 3: Quality Validation
- Verify all metrics are traceable to resume
- Verify all skills are explicitly demonstrated
- Check for quantified evidence
- Ensure no inferred or hallucinated claims

## Step 4: Generate Master Professional Summary
- 3-4 sentences synthesizing entire career
- Include: title, years, top achievements, key skills
- Incorporate quantified metrics
- Focus on most impressive outcomes
- Ready-to-paste format for resume header

## Step 5: Generate Comprehensive Report

OUTPUT FORMAT:

```
RESUME ANALYSIS COMPLETE
========================

CAREER OVERVIEW
===============
Total Experience: [X] years
Positions Analyzed: [N]
Current/Most Recent Title: [Title]
Key Industries: [Industries]

TOP ACHIEVEMENTS (By Impact)
=============================
1. [Achievement] - [Quantified Impact]
   Company: [Company Name] | Position: [Position]

2. [Achievement] - [Quantified Impact]
   Company: [Company Name] | Position: [Position]

3. [Achievement] - [Quantified Impact]
   Company: [Company Name] | Position: [Position]

HARD SKILLS IDENTIFIED
======================
(Ranked by frequency, recency, and relevance)
1. [Skill] - [X years], [Y positions]
2. [Skill] - [X years], [Y positions]
3. [Skill] - [X years], [Y positions]
[... top 10 total]

SOFT SKILLS IDENTIFIED
======================
(Ranked by demonstration strength)
1. [Skill] - Demonstrated in: [positions]
2. [Skill] - Demonstrated in: [positions]
[... top 5-7 total]

CAREER METRICS (Aggregated)
===========================
- Total team leadership: [X people]
- Revenue impact: $[X] (summed across achievements)
- Cost savings: $[X] (summed across achievements)
- Users/customers impacted: [X] (peak scale)
- Notable companies: [Company names]
- Industries: [Industry list]

---

MASTER PROFESSIONAL SUMMARY
===========================

[3-4 sentences synthesizing career]

→ Copy this directly to your resume's professional summary section.
→ Use as baseline for role-specific customization.

---

NEXT STEPS
==========
1. Copy summary to your resume
2. Use "Should I Apply?" tool for role-specific bullets
3. For each job: resume + JD → customized bullets
```

QUALITY STANDARDS:
- Only mention skills explicitly stated in resume
- Only report metrics explicitly in resume
- Never infer or hallucinate achievements
- Never speculate about experience
- Validate all claims against resume content
```

---

## Part 3: Upload Files

### Step 4: Add Files

**Option A: Upload Files (if supported)**
1. Look for "Files" or "Upload" section
2. Upload your prepared files:
   - All 9 core foundation files
   - All 6 resume analyzer files
   - All 4 narrative + shared files (19 total)

**Option B: Paste File Contents (if uploads not supported)**
1. Priority files to reference:
   - ra_resume-analyzer.md
   - ra_quality-gates-guardrails.md
   - ng_summary-generation.md
   - shared_keyword_validation.md

---

## Part 4: Test & Deploy

### Step 5: Test the App

1. Click **"Test"** or **"Preview"**
2. Paste your complete resume
3. Enter: "Analyze my resume and generate a professional summary"
4. Review the output for:
   - Complete position extraction
   - Accurate metrics
   - Relevant skills identification
   - Professional summary quality

### Step 6: Deploy

1. Click **"Deploy"**
2. Select or create Google Cloud Project
3. Wait 2-5 minutes for deployment
4. **Bookmark your URL**

---

## Using Your Google AI Studio App

### First Use (Setup - 15 min):
1. Open your bookmarked Resume Analyzer URL
2. Paste your complete resume
3. Wait for analysis + summary generation
4. Copy summary to your resume
5. Save the analysis report

### Maintenance (Monthly - 10 min):
1. Update resume with new achievements
2. Open Resume Analyzer URL
3. Paste updated resume
4. Regenerate analysis + summary
5. Update resume header

---

---

# COMPARISON: Claude Projects vs Google AI Studio

| Factor | Claude Projects | Google AI Studio |
|--------|-----------------|------------------|
| **Setup Time** | 10 min | 20-30 min |
| **Model Quality** | Claude 3.5 (best) | Gemini (good) |
| **Persistence** | URLs persistent | URLs persistent |
| **File Handling** | Uploads files | Pastes or uploads |
| **Cost** | Free (existing subscription) | Free (100/month each) |
| **Speed** | Faster responses | Slightly slower |
| **Reusability** | Infinite | Free: 100/month per app |
| **Sharing** | Via project link | Via public URL |
| **Best For** | Active power user | Backup/secondary tool |

---

---

# WORKFLOW DECISION TREE

```
Do you want persistent URLs for multiple devices?
  → YES: Use Google AI Studio (both projects)
  → NO: Use Claude Projects (faster setup)

Do you prefer Claude or Gemini?
  → Claude: Use Claude Projects
  → Gemini (or multi-model): Use Google AI Studio

Will you use this frequently (3+ times/week)?
  → YES: Set up both platforms for redundancy
  → NO: Pick one platform only

Budget constraints?
  → Very limited: Use Google AI Studio (100 free/month)
  → Comfortable: Use Claude Projects (already subscribed)
```

---

---

# RECOMMENDED PATH

### If You Want Fastest Setup:
1. Use **Claude Projects** (10 min each, 20 min total)
2. Both projects ready immediately
3. Best model quality (Claude 3.5)
4. No additional cost

### If You Want Persistent Web Apps:
1. Use **Google AI Studio** (30 min each, 60 min total)
2. Bookmarkable URLs
3. Can share with others
4. Free tier sufficient
5. Slightly weaker model (Gemini)

### If You Want Both (Redundancy):
1. Set up **Claude Projects** first (20 min)
   - Use for daily work
   - Best quality
2. Set up **Google AI Studio** second (60 min)
   - Backup when Claude is busy
   - Shareable URLs
3. **Total setup: 80 min, then infinite reuse**

---

---

# TROUBLESHOOTING

### Google AI Studio Not Working

**"Upload not supported"**
- Solution: Use system prompt to paste critical file snippets
- Include: prompt format + quality standards

**"Model response is weak"**
- Solution: Add more detail to prompt
- Include: examples of good/bad outputs
- Reference specific formatting requirements

**"File context not recognized"**
- Solution: Include file guidelines in system prompt
- Paste critical file content into prompt

### File Copy Issues

**"I can't find the files"**
- Check: ~/Desktop/resume-optimizer/ folder
- Run copy commands again:
  ```bash
  cd ~/optimize-my-resume
  cp core/*.md ~/Desktop/resume-optimizer/
  cp optimization-tools/*/[file].md ~/Desktop/resume-optimizer/
  ```

**"File upload size too large"**
- Solution: Upload files in batches of 5-7
- Wait for one batch to complete before next

---

---

# NEXT STEPS

### Immediate (Today):
- [ ] Choose platform (Claude Projects vs Google AI Studio)
- [ ] Create first project ("Should I Apply?")
- [ ] Test with sample resume + job description

### Short-term (This Week):
- [ ] Create second project (Resume Analyzer)
- [ ] Run resume analysis to extract master summary
- [ ] Bookmark your URLs

### Ongoing:
- [ ] Use "Should I Apply?" for each job (5-10 min)
- [ ] Update Resume Analyzer monthly (10 min)
- [ ] Maintain local backup of analysis

---

**Ready to set up?** Start with Claude Projects for speed, or Google AI Studio for persistence. Either way, you'll have your resume optimizer live in under an hour! 🚀
