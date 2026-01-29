# Entry Point Router - User Intent Detection & Phase Routing

**Version:** 6.5.1 <!-- v6.5.1 Change: Added Resume Analysis Overhaul support (Repairs, Position Headers) -->
**Created:** 2025-12-28
**Purpose:** Detect user state and intent, then route to appropriate workflow with confirmation

---

## Overview

This protocol defines the entry point router that analyzes user input and context to determine which phase to execute. It uses a hybrid auto-detect + confirmation approach to ensure the right workflow runs every time.

**Key Features:**
- Context-aware detection (checks for existing job history, JD, resume)
- 5 core routing scenarios + ambiguous input handling
- User confirmation before executing (no surprise phase switches)
- Override commands for force-routing
- Graceful handling of unclear intent (Decision 7)

---

## Context Detection

Before routing, gather context about the user's current state:

### Check 1: Job History Exists?

```
FILE_PATH = /mnt/project/claude_generated_job_history_summaries_v2.txt

IF file exists AND file size > 0:
  state.hasJobHistory = true
  state.jobHistoryVersion = "2.0"
ELSE IF /mnt/project/claude_generated_job_history_summaries.txt exists:
  state.hasJobHistory = true
  state.jobHistoryVersion = "1.0"
ELSE:
  state.hasJobHistory = false
```

**Purpose:** Determines if user has completed Resume Analysis (Resume Analysis)

---

### Check 2: Job Description Provided?

```
JD_INDICATORS = [
  "Job Description:", "JD:", "Role:", "Requirements:",
  "Apply for:", "Position at", "Responsibilities:",
  "Qualifications:", "We are looking for", "About the role"
]

JD_VALIDATION_HEURISTICS = {
  min_length: 200 characters,
  max_length: 5000 characters,
  has_keywords: Contains ("requirements" OR "qualifications" OR "responsibilities"),
  has_structure: Contains bullet points OR numbered lists,
  has_role_info: Mentions job title OR company name
}

IF user message matches JD_INDICATORS:
  IF JD_VALIDATION_HEURISTICS pass:
    state.hasJD = true
    state.jdConfidence = "high"
  ELSE IF partial match:
    state.hasJD = "maybe"
    state.jdConfidence = "medium"
    → Proceed with confirmation (ask user to verify)
  ELSE:
    state.hasJD = false
    state.jdConfidence = "low"
ELSE:
  state.hasJD = false
```

**Purpose:** Detects if user pasted a job description for Job Fit Analyzer comparison

**Anti-false-positive measures:**
- Length check: Prevents short snippets from being detected as JDs
- Keyword requirement: Must contain "requirements", "qualifications", or "responsibilities"
- Structure check: JDs typically have lists, not just paragraphs
- Max length: Prevents articles/blog posts from being detected as JDs

---

### Check 3: Resume Uploaded?

```
IF user uploads file:
  IF file extension in [".pdf", ".docx", ".txt"]:
    state.hasResume = true
    state.resumeFormat = file_extension
  ELSE:
    state.hasResume = false
    WARN "Unsupported file format. Please upload PDF, DOCX, or TXT."

OR IF user pastes text:
  IF text.word_count > 100:
    state.hasResume = true
    state.resumeFormat = "text"
  ELSE:
    state.hasResume = false
```

**Purpose:** Detects if user provided resume for Resume Analysis analysis

---

### Check 4: Override Commands

```
OVERRIDE_KEYWORDS = {
  "re-analyze": {action: "force_resume_analysis", deleteHistory: false},
  "start over": {action: "force_resume_analysis", deleteHistory: true},
  "start fresh": {action: "force_resume_analysis", deleteHistory: true},
  "analyze my resume": {action: "force_resume_analysis", deleteHistory: false},
  "optimize bullet": {action: "force_bullet_optimizer"},
  "optimize bullets": {action: "force_bullet_optimizer"},
  "improve wording": {action: "force_bullet_optimizer"},
  "check fit": {action: "force_job_fit_analyzer"},
  "compare to jd": {action: "force_job_fit_analyzer"}
}

IF user message matches OVERRIDE_KEYWORDS:
  state.forceMode = detected_action
  state.skipConfirmation = false (still confirm with user)
```

**Purpose:** Allows users to explicitly request a specific phase

---

## 5 Core Routing Scenarios

After context detection, match against these scenarios in priority order:

### Scenario 1: New User (Priority 1)

**Condition:**
```
state.hasResume = true AND state.hasJobHistory = false
```

**Route:** Resume Analysis (Full Resume Analysis)

**Confirmation Message:**
```
I detected a new resume upload. I'll perform a comprehensive resume analysis
and create your job history profile in job history creation format.

This analysis will:
- Extract all your work history with evidence-based achievements
- Separate hard skills (technical) from soft skills (interpersonal)
- Create a master professional summary
- Prepare your profile for job description comparisons

After analysis, you can:
- Optimize specific bullets (Bullet Optimizer)
- Check fit for a job description (Job Fit Analyzer)

Proceed with full analysis?
```

**User Response:**
- **yes** → Execute Resume Analysis
- **no** → Ask "What would you like me to do instead?"

---

### Scenario 2: JD Comparison (Priority 2)

**Condition:**
```
state.hasJobHistory = true AND state.hasJD = true
```

**Route:** Job Fit Analyzer (JD Gap Analysis)

**Confirmation Message:**
```
I detected your job history and a job description. I'll analyze your fit
for this role using the parsing gap analysis system.

This comparison will:
- Parse the JD for required/preferred skills (hard & soft)
- Match each requirement against your job history with evidence citations
- Identify gaps and provide strategic recommendations
- Check blocking gates (hard skill deficit, location mismatch, low match score)

Expected output:
- Color-coded gap analysis ([MATCHED] / [PARTIAL] / [MISSING])
- Evidence citations for each matched skill
- Match score (0-100)
- Customized professional summary (if good fit)

Proceed with JD fit analysis?
```

**User Response:**
- **yes** → Execute Job Fit Analyzer
- **no** → Ask "Would you like to do something else instead?"

---

### Scenario 3: Bullet Optimizer (Priority 3)

**Condition:**
```
state.hasJobHistory = true AND user mentions ("bullet", "optimize", "improve wording", "rewrite")
```

**Route:** Bullet Optimizer (Bullet Optimizer)

**Confirmation Message:**
```
I'll optimize your resume bullets using your job history as context.

This will:
- Strengthen weak verbs and add quantifiable metrics
- Ensure bullets follow CAR format (Context-Action-Result)
- Insert relevant keywords from your job history
- Maintain authenticity (only use skills you've demonstrated)

Which bullets would you like me to improve? You can:
- Paste specific bullets to optimize
- Upload your current resume for bulk optimization
- Tell me which role/achievement to focus on

Please provide the bullets or resume.
```

**User Response:**
- **Provides bullets/resume** → Execute Bullet Optimizer
- **Unclear** → Ask for clarification

---

### Scenario 4: Ambiguous (Priority 4)

**Condition:**
```
state.hasJobHistory = true AND state.hasJD = false AND state.hasResume = false AND no override detected
```

**Route:** None (Ask user to clarify)

**Clarification Message:**
```
I see you have a job history on file. What would you like to do?

1. **Check fit for a job description** (Job Fit Analyzer)
   → Paste a job description and I'll analyze your match

2. **Optimize resume bullets** (Bullet Optimizer)
   → Paste bullets or upload your resume for improvement

3. **Re-analyze my resume** (Resume Analysis)
   → Provide updated resume for fresh analysis

4. **Update my job history**
   → Add, edit, or remove a position

Please select 1-4 or describe what you need.
```

**User Response:**
- **1** → Wait for JD, then execute Job Fit Analyzer
- **2** → Wait for bullets, then execute Bullet Optimizer
- **3** → Wait for resume, then execute Resume Analysis
- **4** → Ask which position to modify (not in v6.0.1, placeholder for v6.0.3)

---

### Scenario 5: First Interaction (Priority 5)

**Condition:**
```
state.hasResume = false AND state.hasJobHistory = false
```

**Route:** None (Explain system)

**Welcome Message:**
```
Welcome to the Resume Analyzer & Optimizer!

I can help you:

1. **Analyze your resume** (Resume Analysis)
   - Comprehensive feedback on achievements, skills, and wording
   - Creates a structured job history for future comparisons
   - Generates professional summary

2. **Optimize bullets** (Bullet Optimizer)
   - Improve specific resume lines with stronger verbs and metrics
   - Ensure CAR format (Context-Action-Result)
   - Insert relevant keywords

3. **Check job fit** (Job Fit Analyzer)
   - Compare your resume to a job description
   - Identify gaps and provide strategic recommendations
   - Get customized professional summary for specific JDs

---

**To get started:**

- Upload your resume (PDF, DOCX, or paste text) for Resume Analysis
- If you have a specific job description, include that too!

---

**Note about file persistence:**

Your job history is saved to files in this project directory. If you close this
session, your data persists but conversation context is lost.

You can start a new session anytime - I'll pick up where you left off using your
saved files.
```

---

## Ambiguous Input Handling (Decision 7)

If the router cannot confidently determine what the user provided, use **two-step guided conversation**:

### Step 1: Confirm Assumption

Ask user to verify your interpretation:

```
"This looks like [DETECTED_TYPE]. Is that correct? (yes/no)"
```

**Examples:**
- "This looks like a professional summary. Is that correct?"
- "This looks like a job description. Is that correct?"
- "This looks like resume bullets. Is that correct?"

---

### Step 2a: If YES → Offer Action

```
"Would you like me to [ACTION]?"
```

**Examples:**
- "Would you like me to optimize it?" (if professional summary)
- "Would you like me to analyze your fit?" (if job description)
- "Would you like me to improve these bullets?" (if resume bullets)

---

### Step 2b: If NO → Clarify

```
"Got it. Is this:
 1. Part of a resume (I'll analyze it)
 2. Part of a JD (I'll compare against your job history)
 3. Something else (tell me what you need)"
```

**User Response:**
- **1** → Route to Resume Analysis or Bullet Optimizer (depending on whether full resume or bullets)
- **2** → Route to Job Fit Analyzer (JD comparison)
- **3** → Ask user to describe their need

---

## Router Workflow Diagram

```
START
  ↓
Detect Context (hasJobHistory, hasJD, hasResume, overrides)
  ↓
Match against 5 scenarios (priority order)
  ↓
[Scenario matched?]
  YES → Present confirmation message
    ↓
    [User confirms?]
      YES → Execute phase
      NO → Ask "What would you like instead?"
  NO → [Ambiguous input]
    ↓
    Step 1: Confirm assumption
      ↓
      [User confirms assumption?]
        YES → Step 2a: Offer action
        NO → Step 2b: Clarify intent (3 options)
```

---

## Examples

### Example 1: New User Uploads Resume

**User Input:**
```
[Uploads resume.pdf]
```

**Context Detection:**
```
hasResume = true
hasJobHistory = false
hasJD = false
```

**Routing:**
- Matches **Scenario 1** (New User)
- Displays confirmation message
- Waits for user "yes/no"

**User confirms:** → Execute Resume Analysis

---

### Example 2: Returning User Pastes JD

**User Input:**
```
Job Description: Senior Product Manager

TechCorp is seeking a Senior Product Manager...

Requirements:
- 5+ years PM experience
- SQL, JIRA, Agile
- Leadership experience

[continues...]
```

**Context Detection:**
```
hasResume = false
hasJobHistory = true (job history creation file exists)
hasJD = true (JD indicators + validation pass)
jdConfidence = "high"
```

**Routing:**
- Matches **Scenario 2** (JD Comparison)
- Displays confirmation message
- Waits for user "yes/no"

**User confirms:** → Execute Job Fit Analyzer

---

### Example 3: User Says "Optimize Bullets"

**User Input:**
```
Can you optimize these bullets?

- Managed projects
- Worked with stakeholders
- Improved processes
```

**Context Detection:**
```
hasResume = false (short text, likely bullets not full resume)
hasJobHistory = true
hasJD = false
override = "optimize bullets" detected
```

**Routing:**
- Matches **Scenario 3** (Bullet Optimizer)
- Displays confirmation message
- User already provided bullets, so no need to wait

**User confirms:** → Execute Bullet Optimizer with provided bullets

---

### Example 4: Ambiguous - User with Job History, No Clear Intent

**User Input:**
```
What can you help me with?
```

**Context Detection:**
```
hasResume = false
hasJobHistory = true
hasJD = false
no override detected
```

**Routing:**
- Matches **Scenario 4** (Ambiguous)
- Displays clarification message with 4 options
- Waits for user to select 1-4

**User responds "1":** → Wait for JD, then execute Job Fit Analyzer

---

### Example 5: Ambiguous Input - Unknown Text Type

**User Input:**
```
[Pastes 2 paragraphs of text that could be a professional summary OR part of a JD]
```

**Context Detection:**
```
hasResume = false (too short for full resume)
hasJobHistory = true
hasJD = "maybe" (low confidence, length is 300 words but lacks clear JD structure)
jdConfidence = "low"
```

**Routing:**
- **Ambiguous input** (Decision 7)
- Step 1: "This looks like a professional summary. Is that correct? (yes/no)"

**User says "yes":**
- Step 2a: "Would you like me to optimize it?"
  - **User says "yes"** → Execute Bullet Optimizer (treat as bullet to optimize)

**User says "no":**
- Step 2b: "Got it. Is this:
   1. Part of a resume (I'll analyze it)
   2. Part of a JD (I'll compare against your job history)
   3. Something else"
  - **User says "2"** → Execute Job Fit Analyzer (JD comparison)

---

## Error Handling

### Error 1: User Confirms Phase but Lacks Required Input

**Problem:** User confirms Job Fit Analyzer (JD comparison) but didn't provide JD

**Solution:**
```
"I'll need the job description to analyze your fit. Please paste the JD text or upload the JD file."
```

Wait for JD, then proceed with Job Fit Analyzer.

---

### Error 2: User Declines All Suggestions

**Problem:** User says "no" to confirmation and "no" to all clarification options

**Solution:**
```
"No problem! Can you describe what you'd like help with? For example:
- 'Analyze my resume'
- 'Compare me to this job description'
- 'Optimize these bullets'

Or just paste your resume or JD, and I'll detect what you need."
```

---

### Error 3: Override Command but Missing Context

**Problem:** User says "check fit" but hasn't provided JD yet

**Solution:**
```
"I'll check your fit for a job description. Please paste the JD text below."
```

Wait for JD, then proceed with Job Fit Analyzer.

---

### Error 4: File Upload Fails

**Problem:** User uploads unsupported file type (e.g., .pages, .odt)

**Solution:**
```
"I can't read that file format. Please upload your resume in one of these formats:
- PDF (.pdf)
- Word (.docx)
- Plain text (.txt)

Alternatively, you can copy and paste your resume text directly."
```

---

## Router Configuration

### Confidence Thresholds

```
JD_DETECTION_CONFIDENCE = {
  high: 0.8,   # All validation heuristics pass
  medium: 0.5, # Partial validation (2-3 heuristics pass)
  low: 0.3     # Weak signals (1 heuristic passes)
}

IF jdConfidence < 0.5:
  → Treat as ambiguous, use two-step clarification
```

### Timeout Handling

```
CONFIRMATION_TIMEOUT = 5 minutes

IF user doesn't respond to confirmation within timeout:
  → Treat as "no" (don't auto-execute)
  → Wait for user to re-engage
```

---

## Phase Execution

After routing and confirmation, execute the appropriate phase:

### Execute Resume Analysis

```
LOAD: PROJECT-INSTRUCTIONS.md → Resume Analysis section
EXECUTE: Full resume analysis workflow
  - Extract positions, achievements, skills
  - Identify blocking gates and prioritized repairs (Blockers, Risks, Tweaks)
  - Generate hiring manager perspective with explicit position metadata
  - Generate job history creation
  - Generate master professional summary
  - Save to file
OUTPUT: Completion message + next steps
```

### Execute Bullet Optimizer

```
### Execute Bullet Optimizer

```
LOAD: PROJECT-INSTRUCTIONS.md → Bullet Optimizer section
LOAD: job history creation (for context)
EXECUTE: Bullet optimization workflow
  - Strengthen verbs
  - Add metrics
  - Insert keywords from job history
  - Ensure CAR format
OUTPUT: Optimized bullets
```

### Execute Job Fit Analyzer

```
LOAD: PROJECT-INSTRUCTIONS.md → Job Fit Analyzer section
LOAD: job history creation
LOAD: JD parsing protocol (parsing)
EXECUTE: JD comparison workflow
  - Parse JD (parsing schema)
  - Match requirements against job history
  - Generate gap analysis with evidence citations
  - Check blocking gates
  - Offer per-JD summary customization
OUTPUT: Gap analysis + recommendations
```

---

## Testing Scenarios

### Test 1: New User Happy Path

1. User uploads resume.pdf
2. Router detects: hasResume=true, hasJobHistory=false
3. Matches Scenario 1, shows confirmation
4. User says "yes"
5. ✅ Resume Analysis executes

---

### Test 2: JD Comparison Happy Path

1. User with existing job history pastes JD text
2. Router detects: hasJobHistory=true, hasJD=true (high confidence)
3. Matches Scenario 2, shows confirmation
4. User says "yes"
5. ✅ Job Fit Analyzer executes

---

### Test 3: Ambiguous Input - Professional Summary

1. User pastes 2-paragraph text
2. Router detects: Low confidence, could be summary or partial JD
3. Ambiguous input handling triggered
4. Step 1: "This looks like a professional summary. Is that correct?"
5. User says "yes"
6. Step 2a: "Would you like me to optimize it?"
7. User says "yes"
8. ✅ Bullet Optimizer executes

---

### Test 4: Override Command

1. User says "optimize bullets" + pastes bullets
2. Router detects override keyword
3. Matches Scenario 3, shows confirmation
4. User confirms (or auto-confirms since bullets already provided)
5. ✅ Bullet Optimizer executes

---

### Test 5: User Declines Confirmation

1. User uploads resume
2. Router matches Scenario 1, shows confirmation
3. User says "no"
4. Router asks "What would you like me to do instead?"
5. User says "Just check this one bullet"
6. ✅ Router re-routes to Bullet Optimizer

---

## Related Protocols

- **Resume Analysis:** `PROJECT-INSTRUCTIONS.md` → Resume Analysis section
- **Bullet Optimizer:** See `PROJECT-INSTRUCTIONS.md` → Core Process (Bullet Optimizer)
- **Job Fit Analyzer:** `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`
- **JD Parsing:** `optimization-tools/resume-analyzer/ra_jd-parsing.md`
- **Job History Creation:** `optimization-tools/resume-analyzer/ra_job-history-creation.md`

---

## Version History

- v1.0 (2025-12-28): Initial router with 5 scenarios, ambiguous input handling, override commands

---

**End of Entry Point Router Protocol**
