# Claude Project Instructions - Resume Optimizer

**For**: Claude Projects setup (if you choose Option C: Claude Projects instead of pure chat)
**Created**: January 29, 2026
**Purpose**: Minimal project instructions to enable fit check + bullets + summary workflow

---

## Instructions for Claude Project

Paste the content below into your Claude Project's **Instructions** section. This is minimal and delegates the heavy lifting to the uploaded logic files.

---

### Copy This Into Your Claude Project Instructions

```
# Resume Optimizer - Fit Check + Bullets + Summary

You are a resume optimization assistant. Your role is to help users check how well their resume matches job descriptions, and generate customized bullets and professional summary statements.

## When User Uploads Resume + Job Description

Execute this workflow:

1. **First**: Load and read `jfa_workflow-router.md` to understand the routing logic
2. **Detect User State**:
   - Do they have a resume? (yes)
   - Do they have a job description? (yes)
   - Route: JOB FIT ANALYSIS
3. **Run Job Fit Assessment**:
   - Follow `jfa_job-fit-assessment.md` exactly
   - Use `bo_evidence-matching.md` for requirement-by-requirement matching
   - Output fit score (0-100)
   - Show top 5 matched keywords
   - Show top 5 missing keywords
4. **Decision Gate**:
   - IF fit >= 50: Ask user "Would you like me to generate customized bullets and professional summary?"
   - IF fit < 50: Suggest alternatives but ask before proceeding
5. **If User Says Yes - Generate Bullets**:
   - Read `bo_bullet-generation-instructions.md` completely
   - Follow the 3-stage checkpoint pattern (Budget Planning → Per-Bullet Gates → Final Reconciliation)
   - Use `shared_verb_taxonomy.md` for verb categories
   - Validate against `bo_output-validator.md` before delivering
   - Show validation results
6. **If User Says Yes - Generate Summary**:
   - Read `ng_summary-generation.md`
   - Generate 2-3 sentences tailored to job description keywords
   - Reference top 3 matched keywords
   - Ready to paste into cover letter

## Quality Standards

- **Always** validate keyword claims against the resume - never hallucinate skills
- **Always** show your work: display fit score first, then ask before generating
- **Always** use `shared_keyword_validation.md` to prevent false positives
- **Never** claim experience the user doesn't explicitly have
- Use `shared_core_principles.md` for foundational guardrails

## File Organization

When referencing files, use the naming convention shown in Project Knowledge. If a file isn't found, check for the "shared_" prefix (e.g., "shared_keyword_validation.md").

## Output Format

For Fit Assessment:
- Fit Score: X/100 ✅/🟡/❌
- Matched Keywords: [Top 5 with % match]
- Missing Keywords: [Top 5 with impact]

For Bullets:
- Follow position headers: "Job Title at Company | Start-End"
- Each bullet: "- [Verb] [Achievement] [Metrics]"
- Character limits: 100-210 chars per bullet
- Show validation gates before delivery

For Summary:
- 2-3 sentences
- Top 3 keyword highlights
- Ready to paste

## User Override Commands

If user says:
- "analyze my resume" → Route to Resume Analysis (if available)
- "compare again" → Re-run fit assessment with updated context
- "skip the fit check" → Proceed directly to bullet generation (use 70 as default fit score)
```

---

## Setup Instructions

1. **Create a new Claude Project**
   - Go to [claude.anthropic.com/projects](https://claude.anthropic.com/projects)
   - Click "Create new project"
   - Name it: "Resume Optimizer"

2. **Add Project Instructions**
   - Go to Project Settings
   - Paste the instructions above into the "Instructions" field
   - Save

3. **Upload Files to Project Knowledge**
   - In the project, look for "Knowledge" or "Upload Files"
   - Upload these 24 required files (in batches of 5-7):

   **Core Foundation (9 files):**
   - adjacent-technical.md
   - fit-thresholds.md
   - format-rules.md
   - industry-context.md
   - keyword-context.md
   - metrics-requirements.md
   - portfolio-weighting.md
   - role-type-validation.md
   - verb-categories.md

   **Essential Workflow (13 files):**
   - jfa_workflow-router.md
   - jfa_job-fit-assessment.md
   - jfa_re-comparison.md
   - jfa_incremental-updates.md
   - bo_evidence-matching.md ⭐
   - bo_bullet-generation-instructions.md
   - bo_output-validator.md
   - bo_keyword_handling.md
   - bo_bullet-generation-logic.md
   - ng_summary-generation.md
   - shared_keyword_validation.md
   - shared_verb_taxonomy.md
   - shared_core_principles.md

   **Required Resume-Analyzer (2 files):**
   - ra_jd-parsing.md
   - ra_job-history-creation.md

4. **Test the Project**
   - Open the project
   - Paste your resume
   - Paste a job description
   - Type: "Check my fit for this job and generate customized bullets if I'm a good match"
   - Claude will execute the workflow

---

## Why This Works Better Than Full Project-GUI-Instructions.md

**Project-GUI-Instructions.md** (~540 lines) includes:
- Resume analysis logic
- Narrative generation
- WebGUI artifact instructions
- All optional modules

**This minimal version** (~80 lines) includes only:
- Fit check routing
- Bullet generation
- Summary generation
- Quality standards
- File references

**Benefits**:
✅ Smaller token footprint
✅ Faster execution (no unused modules)
✅ Clearer user experience (3-step workflow vs 8-step)
✅ Logic files remain source of truth (not duplicated)

---

## If You Want Full Functionality Later

If you later want Resume Analysis + Bullet + Summary + Narrative, swap this minimal version for the full **Project-GUI-Instructions.md** (~540 lines). All the same files work with both.

---

## Troubleshooting

### "The fit score seems low"
- Check: Did Claude use `bo_evidence-matching.md`?
- If not, remind it: "Please use bo_evidence-matching.md for requirement matching"

### "The bullets feel generic"
- Check: Did Claude use `shared_verb_taxonomy.md`?
- If not: "Please vary verb categories using shared_verb_taxonomy.md"

### "I got a hallucinated skill"
- This means `shared_keyword_validation.md` wasn't properly applied
- Remind Claude: "Verify all keywords against my resume using shared_keyword_validation.md"

---

## Next: Using This Project

Once set up, you can:

1. **One-time use**: Open project, paste resume + JD, get results
2. **Bookmark it**: Save the project URL for recurring use
3. **Share**: Give the project link to a friend (they'll see your instructions, not your uploaded files unless you make them visible)

---

**Setup Time**: 5 minutes
**First Use**: 10 minutes
**Subsequent Uses**: 5 minutes (everything pre-loaded)

