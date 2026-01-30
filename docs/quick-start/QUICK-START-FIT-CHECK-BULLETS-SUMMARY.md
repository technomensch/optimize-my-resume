# Quick-Start: Resume Fit Check + Bullet/Summary Generator

**Created:** January 29, 2026
**Purpose:** Fastest, easiest, cheapest way to check JD fit and generate customized bullets + summary
**Target:** Single-session workflow (no setup, drag-and-drop files)
**Estimated Time to First Result:** 5-15 minutes (depending on file size)

---

## Platform Comparison Matrix

| Factor | Claude Chat ✅ | Google AI Studio | Google Agent Manager |
|--------|-----------|------------------|---------------------|
| **Setup Time** | 2 minutes | 15-30 minutes | 30+ minutes |
| **Cost** | Free* | Free tier (limited) | Free tier (limited) |
| **Learning Curve** | None | Moderate | Steep |
| **Best For** | This use case | Prototyping apps | Production multi-agent |
| **Deployment** | Immediate | Cloud Run (optional) | Vertex AI (required) |
| **Offline Capability** | No | No | No |
| **AI Model Quality** | Claude 3.5 (best) | Gemini (good) | Gemini (good) |
| **File Handling** | Upload 5-10 files | Upload 5-10 files | Code-based setup |
| **Ideal For** | Quick fit checks | Custom web interface | Enterprise workflows |

**Recommendation:** **Claude Chat** - Zero setup, immediate execution, best quality results.

---

## Option 1: Claude Chat (RECOMMENDED)

### Why This Works Best For You

1. **No Setup**: Works immediately with existing Claude subscription
2. **Modular Uploads**: Drag-and-drop exactly the files you need
3. **One-Session Workflow**: Resume → Fit Check → Bullets → Summary (in 1 conversation)
4. **Best Model Quality**: Claude 3.5 Sonnet outperforms Gemini on resume optimization
5. **Cost**: Already covered by your subscription

### Step-by-Step Implementation

#### Step 1: Prepare Your Files (3-5 minutes)

Copy these files from your repository. Complete file list for fit check + bullets + summary:

**Core Foundation (Required - 9 files from /core/):**
```
From core/:
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

**Essential Workflow (Required - 13 files):**
```
From optimization-tools/job-fit-analyzer/:
  - jfa_workflow-router.md
  - jfa_job-fit-assessment.md
  - jfa_re-comparison.md
  - jfa_incremental-updates.md

From optimization-tools/bullet-optimizer/:
  - bo_evidence-matching.md ⭐ CRITICAL (requirement matching, references ra_jd-parsing.md)
  - bo_bullet-generation-instructions.md
  - bo_output-validator.md
  - bo_keyword_handling.md (user-provided keyword optimization)
  - bo_bullet-generation-logic.md (causal impact linking, portfolio labeling)

From optimization-tools/narrative-generator/:
  - ng_summary-generation.md (references ra_jd-parsing.md and ra_job-history-creation.md)

From optimization-tools/shared/:
  - shared_keyword_validation.md (REQUIRED - prevents hallucinated skills)
  - shared_verb_taxonomy.md (action verb categories for diversity)
```

**Required Resume-Analyzer Files (2 files - referenced by workflow above):**
```
From optimization-tools/resume-analyzer/:
  - ra_jd-parsing.md (referenced by bo_evidence-matching.md and ng_summary-generation.md)
  - ra_job-history-creation.md (referenced by ng_summary-generation.md)
```

**Optional Foundational Context (enhances quality):**
```
From optimization-tools/shared/:
  - shared_core_principles.md (foundational guardrails context)

From optimization-tools/resume-analyzer/:
  - ra_resume-analyzer.md
  - ra_resume-analysis-procedures.md
  - ra_narrative-generation-system.md
  - ra_quality-gates-guardrails.md (comprehensive guardrail definitions)
```

**Optional Reference (helpful for understanding):**
```
From docs/governance/:
  - guardrail-registry.md (quality gates reference)
```

**Total Required Size**: ~170 KB (24 files: 9 core + 13 workflow + 2 ra)
**Total With Optional Context**: ~220 KB (29 files)
**Complete Set (with all resume analysis)**: ~280 KB (34 files)

#### Step 2: Start Claude Chat (1 minute)

1. Go to [claude.anthropic.com](https://claude.anthropic.com)
2. Click "New Conversation"
3. Keep this tab open for file uploads

#### Step 3: Upload Files in Order (5-7 minutes)

Claude Chat shows an attachment icon (📎). Upload in this sequence (you can drag multiple files at once):

**Batch 1 - Core Foundation (Upload first - 9 files):**
1. adjacent-technical.md (role type distinction)
2. fit-thresholds.md (scoring calibration)
3. format-rules.md (character limits, symbol usage)
4. industry-context.md (transferability matrices)
5. keyword-context.md ("Working WITH" vs "Writing ABOUT" validation)
6. metrics-requirements.md (quantifiable impact standards)
7. portfolio-weighting.md (personal project weighting rules)
8. role-type-validation.md (role type distinctions)
9. verb-categories.md (action verb taxonomy)

**Batch 2 - Workflow Logic (9 files):**
10. jfa_workflow-router.md (entry point detection)
11. jfa_job-fit-assessment.md (fit calculation logic)
12. jfa_re-comparison.md (re-run fit assessment)
13. jfa_incremental-updates.md (add/edit/remove positions)
14. bo_evidence-matching.md ⭐ (requirement matching - CRITICAL)
15. bo_bullet-generation-instructions.md (bullet generation rules)
16. bo_output-validator.md (validation gates)
17. bo_keyword_handling.md (user-provided keyword optimization)
18. bo_bullet-generation-logic.md (causal impact linking, portfolio labeling)

**Batch 3 - Summary & Keyword Validation (3 files):**
19. ng_summary-generation.md (summary generation)
20. shared_keyword_validation.md (keyword matching - REQUIRED)
21. shared_verb_taxonomy.md (action verb categories for diversity)

**Batch 4 - Required Resume-Analyzer Files (2 files):**
22. ra_jd-parsing.md (JD parsing - referenced by bo_evidence-matching.md)
23. ra_job-history-creation.md (job history schema - referenced by ng_summary-generation.md)

**Optional - Recommended for Quality (1 file):**
24. shared_core_principles.md (foundational guardrails context)

**Tip**: You can drag multiple files at once (5-7 at a time) - Claude will queue them. Upload in batches to manage the upload process. All 24 files total ~170 KB.

**Minimum to Start**: If you want to start quickly, at minimum upload Batches 1-3 (21 files) + Batch 4 (2 files) = 23 files. This gives you everything needed for fit check + bullets + summary.

#### Step 4: Provide Your Resume (2 minutes)

Paste or upload your resume as plain text. Example:

```
SENIOR TECHNICAL BUSINESS ANALYST | 10+ years | DHS, State Dept, CISA

Current Role: Principal Technical Architect (2024-Present)
  - Established requirements discipline for federal agency
  - Architected knowledge management system (95 plans, 19 lessons, 9 ADRs)
  - Led cross-functional team through multi-month project recovery
  [additional roles...]
```

#### Step 5: Provide Job Description (2 minutes)

Paste the job description you want to check. Example:

```
Job Title: Senior Technical Product Manager
Company: TechCorp
Required:
  - 8+ years technical product management
  - Experience with enterprise software
  - Proven ability to drive product roadmap
[additional requirements...]
```

#### Step 6: Execute Workflow (5-10 minutes)

Send this prompt:

```
I've uploaded my resume and job description. Please:

1. FIRST: Use jfa_workflow-router.md to detect my state and confirm the workflow
2. Run JOB FIT ASSESSMENT per jfa_job-fit-assessment.md
   - Output fit score (0-100)
   - Show top 5 matched keywords
   - Show top 5 missing keywords
3. If fit >= 50:
   a) GENERATE BULLETS using bo_bullet-generation-instructions.md
      - Output 3-5 position-specific bullets
      - Follow 3-stage checkpoint pattern (Budget → Per-Bullet → Reconciliation)
      - Validate against guardrail-registry.md gates
   b) GENERATE SUMMARY using ng_summary-generation.md
      - 2-3 sentences tailored to job description
      - Highlight most relevant skills
      - Ready to paste into cover letter

Please show me the fit score first, then ask if I want bullets/summary generated.
```

---

## Step-by-Step Results You'll Get

### Output 1: Fit Assessment
```
================================================================================
FIT ASSESSMENT
================================================================================

Fit Score: 78/100 ✅ (High - Proceed to Customization)

Matched Keywords (Top 5):
  ✅ Technical Product Management (100%) - 2 positions match
  ✅ Enterprise Software (95%) - Current role
  ✅ Requirements Discipline (90%) - Demonstrated at DHS
  ✅ Agile/Scrum (85%) - 3+ years
  ✅ Stakeholder Management (80%) - All roles

Missing Keywords (Top 5):
  ❌ Roadmap Planning (0%) - Not explicitly mentioned
  ⚠️  Python/Java (25%) - Mentioned tools but no coding
  ⚠️  Design Thinking (40%) - Implied but not explicit
  ⚠️  SaaS Metrics (30%) - Not relevant to your background
  ❌ Kubernetes (0%) - Not in your experience

Recommendation: Strong fit for this role. Keywords can be highlighted in bullets/summary.
```

### Output 2: Customized Bullets
```
Position 1 - Senior Technical Business Analyst:

[Architected] Architected knowledge management system for federal agency,
generating 259 markdown files (80K+ lines) across 4-pillar architecture
serving as single source of truth for 95 implementation plans.

[Managed] Managed requirements discipline recovery effort across 3 federal
agencies (DHS, State Dept, CISA), resulting in 47 releases in 5 weeks
(210 commits) and 100% plan-before-implement enforcement.

[Designed] Designed issue tracking system with 15 unique issues generating
53 diagnostic documents, establishing enterprise-grade governance for
AI-directed development with full context preservation across sessions.
```

### Output 3: Customized Summary
```
Senior Technical Business Analyst with 10+ years establishing requirements
discipline and optimizing high-velocity release cycles for federal agencies.
Expert in architecting knowledge management programs and implementing
enterprise-grade governance frameworks. Proven ability to resolve
multi-month delays through rigorous backlog grooming and process automation.
```

---

## Option 2: Google AI Studio (If You Prefer Gemini)

### When to Use This Instead

- You prefer Gemini's model
- You want to save the project as a reusable web app
- You're willing to spend 15-30 minutes on setup

### Quick Setup

1. Go to [ai.google.dev/studio](https://ai.google.dev/studio)
2. Click "Build in Studio"
3. Describe: "Resume optimizer: upload resume + JD, get fit score + customized bullets/summary"
4. AI Studio generates a full UI automatically
5. Upload the same 6 files as Claude Chat
6. Test locally, optionally deploy to Google Cloud Run

**Cost**: Free tier covers your use case. Upgrade if >100 queries/month.

**Pros**:
- Self-contained web app you can share/bookmark
- Can be deployed as permanent tool
- Works locally without login

**Cons**:
- 15-30 min setup vs. 5 min for Claude Chat
- Gemini slightly weaker than Claude for complex resume logic
- Requires Google account setup

---

## Option 3: Google Agent Manager (Enterprise-Grade)

### When to Use This

- You're building this as a service for multiple users
- You need production-level logging/monitoring
- You want multi-agent orchestration (fit check + bullets + summary in parallel)

### Not Recommended For Your Current Need

**Why**: Overkill for single-user, single-session workflow. Requires:
- Google Cloud Platform account setup (15-30 min)
- Agent Development Kit (ADK) learning curve (2-4 hours)
- Python code deployment (not visual)
- Cost: Free tier but complex to manage

**Better Use Case**: If you later build this as a SaaS product.

---

## Detailed File Reference

### Core Foundation Files (Required - 9 files from /core/)

#### 1. **adjacent-technical.md** (Role Type Distinction)
- Distinguishes between hands-on engineering vs technical-adjacent roles
- Critical for accurate role-type validation
- ~50 lines, 2KB

#### 2. **fit-thresholds.md** (Scoring Calibration)
- Defines scoring calibration rules and stop-score penalties
- Sets standards for fit score calculation
- ~60 lines, 3KB

#### 3. **format-rules.md** (Output Constraints)
- Enforces character limits (100-210 chars per bullet)
- Symbol usage rules
- Verb diversity requirements
- ~80 lines, 4KB

#### 4. **industry-context.md** (Transferability Matrices)
- Manages industry transferability matrices (e.g., Gov to SaaS)
- Key for cross-industry fit assessment
- ~100 lines, 5KB

#### 5. **keyword-context.md** (Knowledge Validation)
- Validates "Working WITH" vs "Writing ABOUT" a technology
- Prevents false keyword claims
- ~80 lines, 4KB

#### 6. **metrics-requirements.md** (Quantifiable Impact)
- Defines standards for quantifiable impact
- Metric density requirements
- ~70 lines, 3KB

#### 7. **portfolio-weighting.md** (Project Valuation)
- Applies 50% discount to personal projects vs professional experience
- Weights evidence appropriately
- ~60 lines, 3KB

#### 8. **role-type-validation.md** (Role Distinctions)
- Prevents conflating distinct roles (e.g., BA vs PM tenure)
- Maintains role-type integrity
- ~60 lines, 3KB

#### 9. **verb-categories.md** (Action Verb Taxonomy)
- Categorizes action verbs into Built, Lead, Managed, Improved, Collaborate
- Referenced by multiple modules for verb diversity
- ~80 lines, 4KB

---

### Essential Workflow Files (Required - 13 files)

#### 10. **jfa_workflow-router.md** (Entry Point)
- Detects your state: "Do I have resume? Do I have JD?"
- Routes to correct workflow (fit check, bullet generation, etc.)
- Confirms with you before executing
- ~80 lines, 3KB

#### 11. **jfa_job-fit-assessment.md** (Fit Scoring)
- Calculates fit score using keyword matching and requirement analysis
- Displays matched/missing keywords with percentages
- Decides if fit >= 50 (proceed to bullets/summary)
- ~150 lines, 8KB

#### 12. **jfa_re-comparison.md** (Re-run Fit Assessment)
- Re-runs JD comparison with updated job history
- Useful when you've refined your resume
- ~100 lines, 5KB

#### 13. **jfa_incremental-updates.md** (Position Updates)
- Add/edit/remove positions without full re-analysis
- Preserves previously calculated fit scores
- ~80 lines, 4KB

#### 14. **bo_evidence-matching.md** ⭐ (CRITICAL - Requirement Matching)
- Requirement-by-requirement gap analysis (JD vs your experience)
- Evidence citations showing where you match
- Color-coded output: [MATCHED] / [PARTIAL] / [MISSING]
- Feeds into fit score calculation
- References ra_jd-parsing.md for JD parsing
- ~200 lines, 10KB

#### 15. **bo_bullet-generation-instructions.md** (Bullet Logic Hub)
- Centralized logic for generating high-impact bullets
- Implements 3-stage checkpoint pattern:
  - Stage 1: Budget Planning (allocate bullets by position)
  - Stage 2: Per-Bullet Validation (check each bullet)
  - Stage 3: Final Reconciliation (verify word count, character limits)
- Quality gates: character limits (100-210), uniqueness checks, metric traceability
- ~300 lines, 15KB

#### 16. **bo_output-validator.md** (Validation Gates)
- Forced verification to prevent instruction bypass
- 8-point checklist: terminology, headers, verb diversity, chronology, metrics, etc.
- Used at final stage before delivering results
- ~100 lines, 5KB

#### 17. **bo_keyword_handling.md** (User-Provided Keywords)
- Handles user requests to optimize specific keywords
- Allows dynamic keyword refinement
- ~80 lines, 4KB

#### 18. **bo_bullet-generation-logic.md** (Advanced Bullet Generation)
- Causal impact linking (showing cause and effect)
- Portfolio employment labeling
- Action verb visual categorization
- Chronology depth logic
- ~150 lines, 8KB

#### 19. **ng_summary-generation.md** (Summary Logic)
- Generates 2-3 sentence professional summary
- Tailored to job description keywords
- References ra_jd-parsing.md and ra_job-history-creation.md
- Ready to paste into cover letter
- ~150 lines, 8KB

#### 20. **shared_keyword_validation.md** ⭐ (Keyword Quality Assurance)
- Validates keywords against resume (REQUIRED for accuracy)
- Prevents hallucinated skills (e.g., claiming 3 years Kubernetes when you have 3 months)
- Evidence tiers (explicit, implied, related)
- ~100 lines, 5KB

#### 21. **shared_verb_taxonomy.md** (Action Verb Categories)
- Defines verb categories (Built, Managed, Optimized, etc.)
- Referenced for verb diversity checks
- Improves bullet category distribution
- ~80 lines, 4KB

---

### Required Resume-Analyzer Files (2 files - Referenced by Workflow)

#### 22. **ra_jd-parsing.md** (Job Description Parsing)
- Referenced by bo_evidence-matching.md and ng_summary-generation.md
- Parses JD into structured requirements
- ~80 lines, 4KB

#### 23. **ra_job-history-creation.md** (Job History Schema)
- Referenced by ng_summary-generation.md
- Defines how to structure your resume/job history for analysis
- ~100 lines, 5KB

---

### Optional Recommended Files (Enhances Quality)

#### 24. **shared_core_principles.md** (Foundational Context)
- Fundamental guardrails and principles
- Provides context for all validation logic
- ~80 lines, 4KB

---

### Optional Resume Analysis Files (For Full System Analysis)

#### **ra_resume-analyzer.md** (Full Resume Analysis)
- Complete resume analysis procedures
- ~150 lines, 8KB

#### **ra_resume-analysis-procedures.md** (Analysis Procedures)
- Step-by-step resume analysis workflow
- ~120 lines, 6KB

#### **ra_narrative-generation-system.md** (Narrative Generation)
- System for generating professional narratives
- ~100 lines, 5KB

#### **ra_quality-gates-guardrails.md** (Comprehensive Guardrails)
- Detailed quality gate definitions (G1-G44+)
- ~300 lines, 15KB

---

### Optional Reference File

#### **guardrail-registry.md** (Quality Gates Reference)
- Comprehensive guardrail definitions
- For reference if you want to understand validation rules
- Optional but helpful for deep understanding
- ~200 lines, 10KB

---

**File Count Summary:**
- **Core Foundation**: 9 files
- **Essential Workflow**: 13 files
- **Required Resume-Analyzer**: 2 files
- **Optional Recommended**: 1 file
- **Minimum for Fit Check + Bullets + Summary**: 24 files (~170 KB)

Claude easily handles 24+ files in a single conversation.

---

## Workflow: Step-by-Step Example

### Session Flow

```
You:  "I've attached my resume and a job description. How well do I fit?"

Claude:
  1. Reads jfa_workflow-router.md to confirm workflow
  2. Outputs fit assessment (score + keywords)
  3. Asks: "Would you like customized bullets and summary?"

You:  "Yes, generate them."

Claude:
  1. Reads bo_bullet-generation-instructions.md
  2. Generates bullets with 3-stage validation
  3. Reads ng_summary-generation.md
  4. Generates summary
  5. Shows quality gates (character counts, uniqueness checks)
  6. Outputs ready-to-use bullets + summary

Total time: 5-10 minutes
Total cost: $0 (your existing Claude subscription)
```

---

## File Organization for Easy Access

### Option A: Copy All Required Files to Local Folder (RECOMMENDED)

```bash
mkdir ~/Desktop/resume-optimizer
cd ~/Desktop/resume-optimizer

# Copy core foundation files (9 files)
cp ../../optimize-my-resume/core/*.md .

# Copy job-fit-analyzer files (4 files)
cp ../../optimize-my-resume/optimization-tools/job-fit-analyzer/jfa_*.md .

# Copy bullet-optimizer files (5 files)
cp ../../optimize-my-resume/optimization-tools/bullet-optimizer/bo_*.md .

# Copy narrative-generator files (1 file)
cp ../../optimize-my-resume/optimization-tools/narrative-generator/ng_*.md .

# Copy shared files (2 required, 1 optional)
cp ../../optimize-my-resume/optimization-tools/shared/shared_keyword_validation.md .
cp ../../optimize-my-resume/optimization-tools/shared/shared_verb_taxonomy.md .
cp ../../optimize-my-resume/optimization-tools/shared/shared_core_principles.md .

# Copy required resume-analyzer files (2 files)
cp ../../optimize-my-resume/optimization-tools/resume-analyzer/ra_jd-parsing.md .
cp ../../optimize-my-resume/optimization-tools/resume-analyzer/ra_job-history-creation.md .
```

Then drag all files from ~/Desktop/resume-optimizer/ into Claude Chat (you can drag in batches of 5-7 files).

**Total files copied**: 24 files (~170 KB)

### Option B: Copy All Optimization Tools (If You Want Everything)

```bash
mkdir ~/Desktop/resume-optimizer
cp -r ../../optimize-my-resume/core ~/Desktop/resume-optimizer/
cp -r ../../optimize-my-resume/optimization-tools ~/Desktop/resume-optimizer/
```

Then selectively drag needed files from the folders into Claude Chat.

### Option C: Use Claude Projects (Advanced - Persistent)

1. Go to [claude.anthropic.com/projects](https://claude.anthropic.com/projects)
2. Create new project: "Resume Optimizer"
3. Upload 7-9 essential files to Project Knowledge (don't upload all, keep focused)
4. System automatically remembers files for future sessions
5. Next time, just open the project + paste resume + paste JD
6. Saves time on file re-uploads

---

## Testing: Real-World Example

### Input: Your Job History + Real JD

**Your Resume (condensed):**
```
SENIOR TECHNICAL BUSINESS ANALYST - 10+ years
- Federal agencies: DHS, State Dept, CISA
- Current: Principal Technical Architect
  * Knowledge management systems
  * Requirements discipline
  * 95 implementation plans
  * 9 architectural decisions
  * 30 quality guardrails
```

**Target Job Description (Example - Tilt Finance):**
```
Senior Product Manager - FinTech
Required:
  - 7+ years product management
  - SAAS metrics expertise
  - Go-to-market strategy
  - Technical acumen
  - Risk management experience
```

**Expected Output:**
```
Fit Score: 62/100 (Medium - Proceed with caution)

Matched Keywords:
  ✅ Requirements Management → Product Management (85%)
  ✅ Stakeholder Coordination → Go-to-market (75%)
  ✅ Agile/Scrum (80%)
  ⚠️ Risk Management (65%) - Implied from federal work

Missing Keywords:
  ❌ SAAS Metrics (0%)
  ❌ FinTech Experience (0%)
  ⚠️ Go-to-Market Strategy (40%)

Customized Bullets:
  [Designed] Designed enterprise requirements framework serving federal
  agencies, demonstrating ability to manage complex stakeholder ecosystems
  and drive adoption of new product methodologies across 95 implementation
  cycles.

Customized Summary:
  Product-minded technical leader with 10+ years establishing requirements
  discipline in high-stakes federal environments. Proven ability to
  translate complex stakeholder needs into executable roadmaps. Ready to
  apply product expertise to FinTech innovation.
```

---

## Troubleshooting

### "Claude says fit is too low (< 50%)"

**Options:**
1. **Reframe your experience**: Add keywords to resume that are relevant but implied
   - Example: "Requirements Management" → "Product Roadmap Management"
2. **Generate anyway**: Ask Claude to "Generate bullets/summary despite low fit - I want to customize manually"
3. **Switch jobs**: Try a different job description more aligned with your background

### "Character limits are being violated (> 210 chars)"

**Solution**: Ask Claude to "Compress bullets to 100-210 characters using the 3-stage checkpoint pattern"

Claude will:
1. Show budget allocation (Stage 1)
2. Validate each bullet (Stage 2)
3. Reconcile totals (Stage 3)

### "Bullets feel generic"

**Solution**: Provide more context in your resume:
- Add specific metrics from your job history
- Include measurable outcomes ("47 releases in 5 weeks" not "frequent releases")
- Highlight pain points you solved

---

## Next Steps After Claude Chat

### If Fit >= 75%: You're Ready
1. Copy the generated bullets + summary
2. Paste into resume/cover letter
3. Apply to the job

### If Fit 50-75%: Manual Enhancement Needed
1. Ask Claude: "What keywords should I add to strengthen my fit?"
2. Update your job history with these keywords
3. Re-run the fit assessment (same chat)
4. Re-generate bullets/summary

### If Fit < 50%: Consider Your Options
1. **Skip this job** - Find one more aligned with your background
2. **Take the risk** - Use Claude-generated narrative to explain your transferable skills
3. **Strengthen the narrative** - Ask Claude: "How would you position my background to this job?"

---

## Advanced: Creating a Reusable Claude Project

If you plan to use this workflow many times:

1. Go to [claude.anthropic.com/projects](https://claude.anthropic.com/projects)
2. Create project: "Resume Optimizer"
3. In project settings, upload all 24 files to **Project Knowledge** (or use the file upload button):
   - All 9 /core/ foundation files
   - All 13 essential workflow files
   - Both required resume-analyzer files
   - Optional: shared_core_principles.md for context
4. Add this to project **System Prompt**:

```
You are a resume optimization assistant. When users provide:
1. Their resume
2. A job description

Execute this workflow:
1. Load the uploaded files to understand your responsibilities
2. Use jfa_workflow-router.md to confirm the workflow
3. Run fit assessment (jfa_job-fit-assessment.md)
4. If fit >= 50:
   - Generate bullets using bo_bullet-generation-instructions.md
   - Generate summary using ng_summary-generation.md
5. Validate against quality gates in format-rules.md and bo_output-validator.md
6. Show results in chat

Be concise. Show fit score first, ask before generating bullets/summary.

Always use shared_keyword_validation.md to prevent hallucinated skills.
```

5. **Save project** - Next time, open it + paste resume + paste JD
6. **Time savings**: Files auto-load (saves 3-5 minutes per session)

---

## Summary

| Aspect | Claude Chat | Google AI Studio |
|--------|------------|------------------|
| **Setup Time** | 2 min | 20 min |
| **First Result** | 5-10 min | 10-15 min |
| **Best For** | Quick one-off checks | Reusable web app |
| **Cost** | Free (your subscription) | Free tier |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recommendation** | ✅ Use this first | 🟡 Use if you need web app |

**Fastest Path to First Result:**
1. Copy 6 files from optimization-tools/
2. Open Claude Chat
3. Drag 6 files in
4. Paste resume + JD
5. Send workflow prompt
6. Get results in 5-10 minutes

---

## Files Checklist

### Core Foundation (Required - 9 files from /core/)
- [ ] adjacent-technical.md
- [ ] fit-thresholds.md
- [ ] format-rules.md
- [ ] industry-context.md
- [ ] keyword-context.md
- [ ] metrics-requirements.md
- [ ] portfolio-weighting.md
- [ ] role-type-validation.md
- [ ] verb-categories.md

### Essential Workflow (Required - 13 files)
- [ ] jfa_workflow-router.md
- [ ] jfa_job-fit-assessment.md
- [ ] jfa_re-comparison.md
- [ ] jfa_incremental-updates.md
- [ ] bo_evidence-matching.md ⭐ (Critical - requirement matching)
- [ ] bo_bullet-generation-instructions.md
- [ ] bo_output-validator.md
- [ ] bo_keyword_handling.md
- [ ] bo_bullet-generation-logic.md
- [ ] ng_summary-generation.md
- [ ] shared_keyword_validation.md (REQUIRED - prevents hallucinated skills)
- [ ] shared_verb_taxonomy.md (better verb diversity)
- [ ] shared_core_principles.md (foundational context)

### Required Resume-Analyzer (2 files)
- [ ] ra_jd-parsing.md (referenced by bo_evidence-matching.md and ng_summary-generation.md)
- [ ] ra_job-history-creation.md (referenced by ng_summary-generation.md)

### Optional (Reference/Analysis Only)
- [ ] guardrail-registry.md (quality gates reference)
- [ ] ra_resume-analyzer.md (full resume analysis)
- [ ] ra_resume-analysis-procedures.md (analysis procedures)
- [ ] ra_narrative-generation-system.md (narrative generation)
- [ ] ra_quality-gates-guardrails.md (comprehensive guardrails)

**Minimum to Start**: Core (9) + Workflow (13) + Resume-Analyzer (2) = 24 files
**Ready to go!** 🚀

---

**Questions?** Check the individual files for detailed logic, or ask Claude directly during your session.

