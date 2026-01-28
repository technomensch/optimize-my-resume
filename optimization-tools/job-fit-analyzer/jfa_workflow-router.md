# Workflow Router - Complete Entry Point System (Job Fit Analyzer)

**Version:** 9.1.0 <!-- v9.1.0 Change: Documentation Sync -->
**Created:** 2025-12-29
**Purpose:** Complete routing system that detects user intent and routes to appropriate workflow
**Extends:** optimization-tools/resume-analyzer/ra_entry-router.md
**Note:** v7.1.0 introduces strategic assessment methodology with 85/75/65/55 fit thresholds and rare skill overrides.

---

## Overview

This protocol extends the Resume Analysis entry router with additional routing scenarios for incremental updates, re-comparison, and ambiguous input handling. It provides the complete entry point system for all user interactions.

**Integration:**
- Resume Analysis (entry-router.md): 5 core scenarios (new user, JD comparison, Bullet Optimizer, ambiguous, first interaction)
- Job Fit Analyzer (this file): 3 additional scenarios (incremental updates, re-comparison, ambiguous input handling)

**Total Scenarios:** 8

---

## Core Routing (from Resume Analysis)

**See:** optimization-tools/resume-analyzer/ra_entry-router.md for complete implementation

### Scenario 1: New User (Resume Analysis)
- **Condition:** hasResume = true AND hasJobHistory = false
- **Route:** Resume Analysis (Full Analysis)
- **Action:** Generate job history creation (includes Master Summary)

### Scenario 2: JD Comparison (Job Fit Analyzer)
- **Condition:** hasJobHistory = true AND hasJD = true
- **Route:** Job Fit Analyzer (JD Comparison)
- **Action:** JD parsing + evidence matching

### Scenario 3: Bullet Optimizer (Bullet Optimizer)
- **Condition:** hasJobHistory = true AND user mentions ("bullet", "optimize", "improve wording")
- **Route:** Bullet Optimizer (Bullet Optimizer)
- **Action:** Optimize bullets + Per-JD Professional Summary (FORCE DISAMBIGUATION: Do NOT use ng_summary-generation.md Master section)

### Scenario 4: Ambiguous Intent (The "Optimize My Resume" Trap)
- **Condition:** hasJobHistory = true AND (hasJD = false OR ambiguous prompt like "optimize my resume")
- **Route:** None (FORCE Clarification Gate)
- **Action:** Present a high-contrast choice to prevent logic conflation:
  - **Option A:** Master Summary Generation (For general use, no JD required).
  - **Option B:** Per-JD Bullet + Summary Optimization (Requires target JD, maximizes fit).

### Scenario 5: First Interaction
- **Condition:** hasResume = false AND hasJobHistory = false
- **Route:** None (Explain system)
- **Action:** Show welcome message with instructions

---

## Additional Routing (Job Fit Analyzer)

### Scenario 6: Incremental Position Update

**Trigger Keywords:**
- "add position"
- "add new job"
- "edit position"
- "update position"
- "remove position"
- "delete position"

**Detection Logic:**
```javascript
IF user message matches INCREMENTAL_UPDATE_KEYWORDS:
  state.workflowType = "incremental_update"

  IF message includes ("add", "new"):
    state.updateAction = "add"
  ELSE IF message includes ("edit", "update", "change"):
    state.updateAction = "edit"
  ELSE IF message includes ("remove", "delete"):
    state.updateAction = "remove"
  ELSE:
    state.updateAction = "clarify"
```

**Confirmation Prompt:**
```
"I'll help you update your job history.

What would you like to do?
1. Add a new position
2. Edit an existing position
3. Remove a position

Please select 1-3 or describe the change."
```

**Handler:** See optimization-tools/job-fit-analyzer/jfa_incremental-updates.md for complete workflow

**Workflow Summary:**
- **Add:** Collect all job history creation fields → Insert chronologically → Recalculate aggregates → Save
- **Edit:** Select position → Show current values → Update fields → Recalculate → Save
- **Remove:** Select position → Confirm deletion → Remove → Recalculate → Save

---

### Scenario 7: JD Re-Comparison

**Trigger Keywords:**
- "compare again"
- "re-run comparison"
- "updated my history"
- "re-compare"
- "check again"

**Detection Logic:**
```javascript
IF user message matches RE_COMPARISON_KEYWORDS:
  state.workflowType = "re_comparison"

  IF hasJobHistory = false:
    ERROR: "No job history found. Run Resume Analysis first."
  ELSE IF hasJD = true:
    state.jdSource = "current_message"
  ELSE:
    state.jdSource = "cache_or_prompt"
```

**Confirmation Prompt (if JD not provided):**
```
"I'll re-run the JD comparison with your updated job history.

Do you have a previously analyzed job description, or would you like to provide a new one?

If you previously analyzed a JD (e.g., 'Google Product Manager'), I can reuse it.
Otherwise, please paste the job description."
```

**Handler:** See optimization-tools/job-fit-analyzer/jfa_re-comparison.md for complete workflow

**Workflow Summary:**
- Check for cached JD → Load if exists, ask to paste if not
- Run evidence matcher with CURRENT job history
- Generate diff output (improvements, regressions, no change)
- Show score delta (e.g., 72% → 81%)
- Store versioned comparison

---

### Scenario 8: Ambiguous Input with Two-Step Clarification

**Trigger:**
- User provides input that doesn't clearly match any scenario
- Could be resume excerpt, JD excerpt, or something else

**Detection Logic:**
```javascript
IF cannot determine intent from context AND input_length > 100:
  state.workflowType = "ambiguous_input"

  // Attempt classification
  IF text looks like resume (has job titles, companies, dates):
    state.likelyType = "resume"
  ELSE IF text looks like JD (has requirements, qualifications):
    state.likelyType = "jd"
  ELSE:
    state.likelyType = "unknown"
```

**Two-Step Clarification Process:**

**Step 1: Confirm Assumption**
```
"This looks like [LIKELY_TYPE]. Is that correct? (yes/no)"

Example:
"This looks like part of a resume. Is that correct? (yes/no)"
```

**Step 2a: If Yes, Confirm Action**
```
"Would you like me to [APPROPRIATE_ACTION]? (yes/no)"

Examples:
- Resume → "Would you like me to analyze it? (Resume Analysis)"
- JD → "Would you like me to compare it to your job history? (Job Fit Analyzer)"
```

**Step 2b: If No, Present Options**
```
"Got it. Is this:
1. Part of a resume (I'll analyze it with Resume Analysis)
2. Part of a JD (I'll compare against your job history with Job Fit Analyzer)
3. Something else (tell me what you'd like me to do)"
```

---

## Override Commands (Force Routing)

These commands bypass normal routing logic and force a specific phase:

### Re-Analyze Resume
**Keywords:** "re-analyze", "analyze again", "re-run Resume Analysis"
**Action:** Force Resume Analysis (append to existing job history)
**Use Case:** User updated their resume and wants to add new positions

### Start Fresh
**Keywords:** "start fresh", "start over", "reset"
**Action:**
1. Confirm: "This will delete your existing job history. Are you sure?"
2. If yes: Delete job history creation file → Force Resume Analysis
**Use Case:** User wants to completely re-do their job history

### Update Job History
**Keywords:** "update job history", "modify history"
**Action:** Route to Scenario 6 (Incremental Update)
**Use Case:** User wants to add/edit/remove positions

### Optimize My Application (Aggressive Disambiguation)
**Keywords:** "optimize my application", "optimize my resume", "customize resume", "make bullets fit"
**Action:** TRIGGER DISAMBIGUATION GATE. 
**Aggressive Prompt Item:** 
"⚠️ I need to clarify your goal to prevent data loss or logic conflation:
1. Are you creating a **Master Summary** to describe your general career? (Uses 'ng_summary-generation.md')
2. Are you **Optimizing for a Specific JD**? (Uses 'bo_bullet-generation-instructions.md' + Per-JD Summary)

If you have a JD, I strongly recommend Option 2."

---

## Context State Schema

```javascript
{
  // File existence
  hasJobHistory: boolean,
  jobHistoryVersion: "1.0" | "2.0" | null,

  // Input detection
  hasResume: boolean,
  resumeFormat: ".pdf" | ".docx" | ".txt" | "pasted_text" | null,
  hasJD: boolean | "maybe",
  jdConfidence: "high" | "medium" | "low",

  // Intent detection
  workflowType: "new_user" | "jd_comparison" | "bullet_optimization" |
                "ambiguous" | "first_interaction" | "incremental_update" |
                "re_comparison" | "ambiguous_input",

  // Override detection
  forcePhase: null | "phase_1" | "phase_2" | "phase_3" | "incremental_update",

  // Additional context
  updateAction: "add" | "edit" | "remove" | "clarify" | null,
  jdSource: "current_message" | "cache_or_prompt" | null,
  likelyType: "resume" | "jd" | "unknown" | null
}
```

---

## Routing Decision Tree

```
USER INPUT
    |
    ├─> Check Override Commands
    |   ├─> "re-analyze" → Force Resume Analysis
    |   ├─> "start fresh" → Delete + Force Resume Analysis
    |   └─> "add/edit/remove position" → Scenario 6
    |
    ├─> Detect Context
    |   ├─> hasJobHistory? (check job history creation, then v1.0)
    |   ├─> hasJD? (JD validation heuristics)
    |   └─> hasResume? (file upload or long text)
    |
    ├─> Match Scenario (Priority Order)
    |   ├─> 1. New User (hasResume, no history)
    |   ├─> 2. JD Comparison (has history + JD)
    |   ├─> 3. Bullet Optimizer (has history + "optimize")
    |   ├─> 4. Ambiguous Intent (has history, unclear)
    |   ├─> 5. First Interaction (no context)
    |   ├─> 6. Incremental Update (update keywords)
    |   ├─> 7. Re-Comparison (re-run keywords)
    |   └─> 8. Ambiguous Input (cannot classify)
    |
    └─> Confirm with User
        ├─> Present detected workflow
        ├─> Wait for confirmation (yes/no)
        ├─> If yes: Execute workflow
        └─> If no: Ask "What would you like me to do instead?"
```

---

## JD Validation Heuristics (Anti-False-Positive)

**Purpose:** Prevent LinkedIn posts, articles, or blog posts from being detected as JDs

```javascript
function validateJD(text) {
  checks = {
    length: text.length >= 200 && text.length <= 5000,
    keywords: text.includes("requirements") || text.includes("qualifications") || text.includes("responsibilities"),
    structure: hasBulletPoints(text) || hasNumberedLists(text),
    roleInfo: mentionsJobTitle(text) || mentionsCompany(text)
  }

  passedChecks = checks.filter(c => c === true).length

  if (passedChecks >= 3) {
    return { isValid: true, confidence: "high" }
  } else if (passedChecks === 2) {
    return { isValid: "maybe", confidence: "medium" }
  } else {
    return { isValid: false, confidence: "low" }
  }
}
```

**If Low Confidence:**
```
"This text might be a job description, but I'm not certain.

Is this a JD you'd like me to analyze? (yes/no)"
```

---

## Confirmation Templates

### General Confirmation Format
```
"[DETECTION_STATEMENT]

[WORKFLOW_DESCRIPTION]

[WHAT_WILL_HAPPEN]

Proceed? (yes/no)"
```

### Example: JD Comparison
```
"I detected your job history and a job description.

I'll analyze your fit for this role using the parsing gap analysis system.

This will compare your profile against:
- Required/preferred hard skills
- Required/preferred soft skills
- Experience, education, certifications
- Location/remote work compatibility

Proceed with JD fit analysis? (yes/no)"
```

<post_analysis_customization_offer id="35">
  **Trigger:** After analysis is presented with Fit Score >= 50.
  **Offer:** "Would you like to customize your resume bullets and professional summary for this JD?"
  **Action:** Clicking "Optimize My Application" triggers the Narrative/Bullet generation workflow.
</post_analysis_customization_offer>

### Example: Incremental Update
```
"I detected a request to update your job history.

I can help you:
1. Add a new position
2. Edit an existing position
3. Remove a position

What would you like to do? (1/2/3)"
```

### Example: Bullet Optimizer
```
"I'll optimize your resume bullets and professional summary for this specific JD.

This workflow will:
1. Generate high-impact, JD-specific bullets for your recent roles.
2. Create a customized professional summary (Per-JD Customization).

[IMPORTANT] This uses 'bo_bullet-generation-instructions.md' for BOTH bullets and summary.
Do NOT use the Master Summary logic from Resume Analysis.

Proceed with application optimization? (yes/no)"
```

---

## Error Handling

### No Job History for Resume Analysis/2/3
```
"I don't have a job history file for you yet.

You need to run Resume Analysis (Full Resume Analysis) first to create your job history.

Would you like to upload your resume and run Resume Analysis? (yes/no)"
```

### Invalid Override Command
```
"I recognized your intent to [ACTION], but [REASON_IT_FAILED].

Would you like to:
1. [ALTERNATIVE_1]
2. [ALTERNATIVE_2]
3. Something else (describe)"
```

### Unclear Intent After Clarification
```
"I'm not sure I understand. Could you describe what you'd like me to do?

For reference, I can:
- Analyze a resume (Resume Analysis)
- Optimize resume bullets (Bullet Optimizer)
- Compare you to a job description (Job Fit Analyzer)
- Update your job history (add/edit/remove positions)
- Re-run a previous JD comparison"
```

---

## Integration with PROJECT-INSTRUCTIONS.md

Add to PROJECT-INSTRUCTIONS.md before phase detection section:

```xml
<entry_point_routing>
  Before executing any phase, consult optimization-tools/job-fit-analyzer/jfa_workflow-router.md to:
  1. Detect user state (hasJobHistory, hasJD, hasResume)
  2. Identify user intent (which workflow to execute)
  3. Confirm with user before proceeding
  4. Handle override commands (re-analyze, start fresh, add position, etc.)

  The router handles 8 scenarios:
  - New user (no job history) → Resume Analysis
  - JD comparison (has job history + JD) → Job Fit Analyzer
  - Bullet optimization (has job history + wants optimization) → Bullet Optimizer
  - Ambiguous intent (has job history, unclear) → Ask user
  - First interaction (no context) → Welcome message
  - Incremental update (add/edit/remove position) → Incremental handler
  - Re-comparison (re-run JD analysis) → Re-comparison handler
  - Ambiguous input (cannot determine type) → Two-step clarification

  ALWAYS route through workflow-router.md first before executing any phase.

  NOTE: This router extends optimization-tools/resume-analyzer/ra_entry-router.md (5 core scenarios)
        with 3 additional scenarios from Job Fit Analyzer.
</entry_point_routing>
```

---

## Testing Scenarios

### Scenario 1: New User Upload
**Input:** User uploads resume.pdf
**Expected:** Detect hasResume=true, hasJobHistory=false → Route to Resume Analysis with confirmation

### Scenario 2: JD Comparison
**Input:** User pastes job description, has job history creation job history
**Expected:** Validate JD → Detect hasJD=true, hasJobHistory=true → Route to Job Fit Analyzer

### Scenario 3: False Positive (LinkedIn Post)
**Input:** User pastes 800-word LinkedIn article about job hunting
**Expected:** JD validation fails (no "requirements" keyword) → Low confidence → Ask user to confirm

### Scenario 4: Add Position
**Input:** User says "I want to add my new job"
**Expected:** Detect incremental update → Route to add position workflow

### Scenario 5: Re-Comparison
**Input:** User says "I updated my history, compare to that Google PM role again"
**Expected:** Detect re-comparison → Check cache for Google PM JD → Re-run evidence matcher → Generate diff

### Scenario 6: Ambiguous Input
**Input:** User pastes 200 words of text (unclear if resume or JD)
**Expected:** Attempt classification → Low confidence → Two-step clarification

### Scenario 7: Override Command
**Input:** User says "start fresh" with existing job history creation file
**Expected:** Confirm deletion → Delete file → Force Resume Analysis

### Scenario 8: No Context
**Input:** User's first message is "hello"
**Expected:** Detect first interaction → Show welcome message

---

- **Re-Comparison:** optimization-tools/job-fit-analyzer/jfa_re-comparison.md
- **JD Parsing:** optimization-tools/resume-analyzer/ra_jd-parsing.md
- **Evidence Matching:** optimization-tools/bullet-optimizer/bo_evidence-matching.md

---

## Workflow Routing Quality Gates (Guardrails)

### Guardrail #18: Skill/Metric Conflict Resolution

> **Implementation Target:** Add to [optimization-tools/job-fit-analyzer/jfa_workflow-router.md](optimization-tools/job-fit-analyzer/jfa_workflow-router.md).

**Instruction Text:**
```xml
<conflict_resolution_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Resolve contradictions between JD requirements and Job History facts before processing.
  </instruction>
  
  <validation_logic>
    IF JD requires [Skill X] AND Job History states [Limitation/Lack of Skill X]:
      STOP routing.
      PROMPT user: "JD requires [Skill X], but your history notes [Limitation]. How would you like me to represent this? (e.g., mention related skill [Y], or flag as a gap?)"
  </validation_logic>
</conflict_resolution_guardrail>
```

### Guardrail #23: User State Persistence Consistency

> **Implementation Target:** Add to [optimization-tools/job-fit-analyzer/jfa_workflow-router.md](optimization-tools/job-fit-analyzer/jfa_workflow-router.md).

**Instruction Text:**
```xml
<state_persistence_guardrail>
  <priority>MODERATE</priority>
  <instruction>
    Maintain continuity of the 'State' across different tasks.
  </instruction>
  
  <validation_logic>
    BEFORE starting any new workflow Scenario (1-8):
      1. LOAD latest user-state from memory/context.
      2. VERIFY compatibility: "Does current intent [Scenario N] utilize all previously accepted changes from [Scenario M]?"
      3. IF mismatched (e.g., user is asking to re-compare a JD that was never parsed):
         - RESET to appropriate entry point.
         - NOTIFY user: "I see we have [Old State], but you're asking for [New Action]. I'll reset to [New Action] to ensure consistency."
  </validation_logic>
</state_persistence_guardrail>
```

### Guardrail #25: Confirmation Tracking Guardrail

> **Implementation Target:** Add to [optimization-tools/job-fit-analyzer/jfa_workflow-router.md](optimization-tools/job-fit-analyzer/jfa_workflow-router.md).

**Instruction Text:**
```xml
<confirmation_tracking_guardrail>
  <priority>CRITICAL</priority>
  <instruction>
    Never proceed to "Action" steps without explicit, affirmative user confirmation.
  </instruction>
  
  <validation_logic>
    FOR EVERY Scenario 1-8:
      MUST reach <confirmation_prompt> state.
      IF user response is NOT clearly affirmative ("yes", "proceed", "go", "1"):
        RE-PROMPT with clarified options.
        DO NOT execute handler (e.g., incremental-updates.md) until confirmation is logged.
  </validation_logic>
</confirmation_tracking_guardrail>
```

### Guardrail #27: Output Format Consistency Scanner

> **Implementation Target:** Add to [optimization-tools/job-fit-analyzer/jfa_workflow-router.md](optimization-tools/job-fit-analyzer/jfa_workflow-router.md).

**Instruction Text:**
```xml
<output_format_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Scan final output for unexpected markdown or structure anomalies.
  </instruction>
  
  <validation_logic>
    1. CHECK that the presentation exactly matches the 'Scenario' template (e.g., Scenarios 1-8).
    2. SCAN for:
       - Unclosed XML tags.
       - Missing bullet points where required.
       - Placeholder text like "[INSERT_HERE]" that wasn't replaced.
       - Broken file paths or URLs.
    3. IF anomalies found:
       - Auto-fix if trivial.
       - REGENERATE section if structural.
  </validation_logic>
</output_format_guardrail>
```

---

## Related Files

- **Core Routing (Resume Analysis):** optimization-tools/resume-analyzer/ra_entry-router.md
- **Incremental Updates:** optimization-tools/job-fit-analyzer/jfa_incremental-updates.md
- **Re-Comparison:** optimization-tools/job-fit-analyzer/jfa_re-comparison.md
- **JD Parsing:** optimization-tools/resume-analyzer/ra_jd-parsing.md
- **Evidence Matching:** optimization-tools/bullet-optimizer/bo_evidence-matching.md

---

## Changelog

**v1.0 (2025-12-29):**
- Initial creation for Job Fit Analyzer
- Extended Resume Analysis entry-router with 3 additional scenarios
- Added incremental update routing (Scenario 6)
- Added re-comparison routing (Scenario 7)
- Added ambiguous input handling (Scenario 8)
- Added override commands (re-analyze, start fresh)
- Added JD validation heuristics
- Added two-step clarification process

**v9.1.0 (2026-01-19):**
- Documentation Sync - Added post-analysis customization offer trigger (Guardrail #35) <!-- v9.1.0 Change -->

**v9.3.5 (2026-01-28):**
- **Hardening (Fix 4):** Added aggressive disambiguation for "Optimize my resume" to prevent conflation between Master Summary and Per-JD logic. Forced choice gate between Scenario 3 and Master Summary.
