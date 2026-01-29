# Incremental Job History Updates Protocol - Job Fit Analyzer

**Version:** 6.5.1 <!-- v6.5.1 Change: Release synchronization -->
**Created:** 2025-12-28
**Purpose:** Add, edit, or remove positions from job history without full re-analysis

---

## Overview

This protocol enables users to incrementally update their job history creation without re-running the full Resume Analysis analysis. Users can add new positions, edit existing positions, or remove outdated positions while maintaining data integrity.

**Key Features:**
- Add single position with full job history creation schema
- Edit specific fields of existing position
- Remove position with confirmation
- Automatic recalculation of aggregates (years of experience, skills)
- Maintains chronological order
- Preserves file format and structure

---

## Add Position Workflow

### Trigger

User says: "add position", "add new job", "add role", or similar

### Step-by-Step Process

#### Step 1: Collect Basic Information

Ask in sequence:

```
1. "What was your job title?"
   → Wait for response → job_title

2. "Which company did you work for?"
   → Wait for response → company

3. "What were your employment dates? (format: Month Year - Month Year or Present)"
   → Wait for response → dates
   → Parse into start_date and end_date

4. "Was this role Remote, Hybrid, or On-site?"
   → Wait for response → work_location

5. "Where was the company/office located? (City, State)"
   → Wait for response → location
```

---

#### Step 2: Collect Responsibilities

```
"Tell me about your core responsibilities in this role. List 3-5 key duties."

→ Wait for user to provide list (bullet format or paragraph)
→ Parse into core_responsibilities array (3-5 items)
→ If user provides < 3, ask: "Can you tell me about 1-2 more responsibilities?"
```

---

#### Step 3: Collect Achievements

```
"What were your key achievements in this role? Please include metrics where possible.
List 2-4 major accomplishments."

→ Wait for user to provide achievements
→ Parse into key_achievements array (2-4 items)
→ For each achievement, ensure CAR format (Context-Action-Result)
→ If missing metrics, ask: "Can you quantify the impact? (e.g., % improvement, $ saved, users affected)"
```

---

#### Step 4: Extract Skills

```
"What technical skills or tools did you use in this role?"

→ Wait for user to list skills
→ Categorize using skills categorizer (hard vs soft)
→ Add to hard_skills_demonstrated and soft_skills_demonstrated arrays
```

Alternative approach (automatic):
```
Extract skills from responsibilities and achievements:
  - Scan for tool names (Python, SQL, JIRA, etc.)
  - Scan for action verbs indicating soft skills (led, managed, communicated)
  - Auto-populate arrays
  - CONFIRM with user: "I detected these skills: [list]. Is this accurate?"
```

---

#### Step 5: Extract Education & Certifications (if applicable)

```
"Did you earn any degrees or certifications during this role? (or type 'none')"

→ If user provides:
  - education = "[Degree], [Institution], [Year]"
  - certifications = array of certification names

→ If user says "none":
  - education = null
  - certifications = []
```

---

#### Step 6: Generate Professional Summary for Position

```
Using collected information:
  - Job title, company, dates
  - Core responsibilities (top 2-3)
  - Key achievements (top 1-2 with metrics)
  - Hard skills (top 2-3)
  - Soft skills (top 1-2)

Generate 2-3 sentence professional summary following format:
  "[Title] at [Company] where I [key responsibility]. [Major achievement with metric]. Demonstrated expertise in [2-3 hard skills] and [1-2 soft skills]."

Example:
  "Product Manager at Google where I led product strategy for Workspace security features.
   Launched zero-trust framework increasing enterprise adoption by 34% ($8M ARR).
   Demonstrated expertise in AWS, SQL, and stakeholder management."
```

---

#### Step 7: Insert at Correct Chronological Position

```
LOAD: existing job_history_v2.0

positions = job_history.positions

// Sort by start_date descending (most recent first)
positions.sort((a, b) => b.start_date - a.start_date)

// Insert new position at correct location
for (i = 0; i < positions.length; i++) {
  if (new_position.start_date > positions[i].start_date) {
    positions.insert(i, new_position)
    break
  }
}

// If new position is oldest, append at end
if (not inserted) {
  positions.append(new_position)
}
```

---

#### Step 8: Recalculate Aggregates

```
// Total years of experience
total_years = 0
for (position of positions) {
  years = (position.end_date - position.start_date) / 365
  total_years += years
}

// Aggregate all hard skills
all_hard_skills = new Set()
for (position of positions) {
  for (skill of position.hard_skills_demonstrated) {
    all_hard_skills.add(skill)
  }
}

// Aggregate all soft skills
all_soft_skills = new Set()
for (position of positions) {
  for (skill of position.soft_skills_demonstrated) {
    all_soft_skills.add(skill)
  }
}

// Update job history metadata
job_history.total_years_experience = total_years
job_history.all_hard_skills = Array.from(all_hard_skills)
job_history.all_soft_skills = Array.from(all_soft_skills)
job_history.total_positions = positions.length
job_history.last_updated = current_date
```

---

#### Step 9: Save and Confirm

```
SAVE: claude_generated_job_history_summaries_v2.txt

CONFIRM to user:
  "✅ Added [Job Title] at [Company].

  Your job history now includes:
  - Total positions: [N]
  - Total experience: [X.Y] years
  - New hard skills added: [list if any]
  - New soft skills added: [list if any]

  Would you like to:
  1. Compare to a job description (Job Fit Analyzer)
  2. Add another position
  3. Export updated job history"
```

---

## Edit Position Workflow

### Trigger

User says: "edit position", "update job", "modify role", or similar

### Step-by-Step Process

#### Step 1: List Positions for Selection

```
LOAD: job_history_v2.0

DISPLAY to user:
  "Which position would you like to edit?

  1. [Company] | [Job Title] ([Dates])
  2. [Company] | [Job Title] ([Dates])
  3. [Company] | [Job Title] ([Dates])
  ...

  Enter the number (1-[N]):"
```

---

#### Step 2: Show Current Values

```
After user selects position [i]:

DISPLAY:
  "Current details for [Company] | [Job Title]:

  Job Title: [current value]
  Company: [current value]
  Dates: [current value]
  Location: [current value]
  Work Location: [current value]

  Responsibilities ([N]):
    - [responsibility 1]
    - [responsibility 2]
    ...

  Achievements ([N]):
    - [achievement 1]
    - [achievement 2]
    ...

  Hard Skills ([N]): [skill1], [skill2], ...
  Soft Skills ([N]): [skill1], [skill2], ...

  Education: [current value or 'none']
  Certifications: [current value or 'none']

  Professional Summary:
  [current summary]
  "
```

---

#### Step 3: Ask What to Change

```
"What would you like to update? You can change:
- Basic info (title, company, dates, location)
- Responsibilities
- Achievements
- Skills
- Education or certifications
- Professional summary
- Multiple fields

Tell me what you'd like to change."
```

---

#### Step 4: Collect Changes

Based on user response, update specific fields:

**If updating basic info:**
```
"What's the new [field name]?"
→ Update field
→ Repeat for each field user wants to change
```

**If updating responsibilities:**
```
"Would you like to:
1. Add new responsibilities
2. Remove existing responsibilities
3. Edit specific responsibility

Enter 1, 2, or 3:"

→ If 1 (Add): Collect new responsibilities, append to array
→ If 2 (Remove): Show list with numbers, user selects which to remove
→ If 3 (Edit): Show list with numbers, user selects which to edit, provide new text
```

**If updating achievements:**
```
Same workflow as responsibilities (add/remove/edit)
```

**If updating skills:**
```
"I'll recategorize your skills based on the updated responsibilities and achievements.
Or, you can manually specify skills to add/remove.

Which approach would you like?"

→ If automatic: Re-run skills categorizer on updated text
→ If manual: Collect skill additions/removals from user
```

---

#### Step 5: Regenerate Professional Summary (if major changes)

```
IF (responsibilities changed OR achievements changed OR skills changed):
  "Your position details have changed significantly. Would you like me to regenerate
   the professional summary for this role?"

  → If yes: Generate new summary using updated information
  → If no: Keep existing summary
```

---

#### Step 6: Recalculate Aggregates (if dates changed or skills changed)

```
IF (dates changed):
  → Recalculate total_years_experience
  → Re-sort positions chronologically

IF (skills changed):
  → Rebuild all_hard_skills and all_soft_skills aggregates
```

---

#### Step 7: Save and Confirm

```
SAVE: claude_generated_job_history_summaries_v2.txt

CONFIRM:
  "✅ Updated [Job Title] at [Company].

  Changes made:
  - [field 1]: [old value] → [new value]
  - [field 2]: [old value] → [new value]
  ...

  [If aggregates changed:]
  - Total experience: [old] years → [new] years
  - New skills added: [list]

  Would you like to:
  1. Edit another position
  2. Compare to a job description (Job Fit Analyzer)
  3. Export updated job history"
```

---

## Remove Position Workflow

### Trigger

User says: "remove position", "delete job", "remove role", or similar

### Step-by-Step Process

#### Step 1: List Positions for Deletion

```
DISPLAY:
  "Which position would you like to remove?

  1. [Company] | [Job Title] ([Dates])
  2. [Company] | [Job Title] ([Dates])
  3. [Company] | [Job Title] ([Dates])
  ...

  Enter the number (1-[N]):"
```

---

#### Step 2: Confirm Deletion

```
After user selects position [i]:

WARN:
  "⚠️  Are you sure you want to remove this position?

  [Company] | [Job Title]
  [Dates]
  [Brief summary or first responsibility]

  This action will:
  - Remove this position from your job history
  - Recalculate your total years of experience
  - Update your aggregated skills list

  This cannot be undone. Type 'yes' to confirm or 'no' to cancel."

→ Wait for user response
```

---

#### Step 3: Remove from Array

```
IF user confirms "yes":

  positions.remove(i)

  CONFIRM:
    "Position removed."

ELSE:
  "Deletion cancelled. Position retained in job history."
  → Exit workflow
```

---

#### Step 4: Recalculate Aggregates

```
// Recalculate total years
total_years = 0
for (position of positions) {
  years = (position.end_date - position.start_date) / 365
  total_years += years
}

// Rebuild skill aggregates
all_hard_skills = new Set()
all_soft_skills = new Set()
for (position of positions) {
  for (skill of position.hard_skills_demonstrated) {
    all_hard_skills.add(skill)
  }
  for (skill of position.soft_skills_demonstrated) {
    all_soft_skills.add(skill)
  }
}

// Update metadata
job_history.total_years_experience = total_years
job_history.all_hard_skills = Array.from(all_hard_skills)
job_history.all_soft_skills = Array.from(all_soft_skills)
job_history.total_positions = positions.length
job_history.last_updated = current_date
```

---

#### Step 5: Save and Confirm

```
SAVE: claude_generated_job_history_summaries_v2.txt

CONFIRM:
  "✅ Removed [Job Title] at [Company].

  Your job history now includes:
  - Total positions: [N] (was [N+1])
  - Total experience: [X.Y] years (was [old_total] years)
  [If skills were unique to removed position:]
  - Skills removed: [list]

  Would you like to:
  1. Remove another position
  2. Compare to a job description (Job Fit Analyzer)
  3. Export updated job history"
```

---

## Edge Cases & Error Handling

### Case 1: User Adds Duplicate Position

**Problem:** User adds position that already exists (same company + title + dates)

**Detection:**
```
for (existing_position of positions) {
  if (existing_position.company === new_position.company &&
      existing_position.job_title === new_position.job_title &&
      existing_position.dates === new_position.dates) {
    → Duplicate detected
  }
}
```

**Solution:**
```
WARN:
  "⚠️  It looks like you already have this position in your job history:

  [Company] | [Job Title] ([Dates])

  Would you like to:
  1. Add it anyway (if the dates are slightly different or it's a separate stint)
  2. Edit the existing position instead
  3. Cancel

  Enter 1, 2, or 3:"
```

---

### Case 2: User Edits Dates Creating Overlap

**Problem:** Updated dates overlap with another position (impossible timeline)

**Detection:**
```
for (position of positions) {
  if (position !== edited_position) {
    if (edited_position.start_date < position.end_date &&
        edited_position.end_date > position.start_date) {
      → Overlap detected
    }
  }
}
```

**Solution:**
```
WARN:
  "⚠️  The dates you entered overlap with another position:

  [Edited]: [Company] | [Job Title] ([New Dates])
  [Existing]: [Company] | [Job Title] ([Dates])

  This creates a timeline overlap. Would you like to:
  1. Keep the new dates (if positions were concurrent/overlapping)
  2. Adjust the dates to avoid overlap
  3. Cancel this edit

  Enter 1, 2, or 3:"
```

---

### Case 3: User Removes Only Position

**Problem:** User tries to remove their only position

**Solution:**
```
WARN:
  "⚠️  This is your only position in job history. Removing it will leave your
      job history empty.

  Are you sure? You'll need to add a new position or re-run Resume Analysis to rebuild
  your job history.

  Type 'yes' to confirm or 'no' to cancel."
```

---

### Case 4: User Provides Incomplete Information

**Problem:** User skips required fields or provides vague responses

**Solution:**
```
For required fields (job_title, company, dates):
  → Re-prompt until user provides value
  "I need the [field name] to continue. Please provide:"

For optional fields (achievements, education):
  → Allow user to skip
  "That's optional. Type 'skip' if you don't have this information."
```

---

## Incremental Update Quality Gates (Guardrails)

### G6: Data Loss Prevention during Updates

> **Implementation Target:** [incremental-updates.md](optimization-tools/job-fit-analyzer/jfa_incremental-updates.md).

**Instruction Text:**
```xml
<data_loss_prevention_guardrail> <!-- v6.3.0 Change: Restored original with additions merged -->
  <priority>CRITICAL</priority>
  <trigger>When executing /update-history or modifying existing positions</trigger> <!-- NEW from v6.3.0 plan -->
  <instruction>
    Ensure that adding or editing a position does not overwrite or delete unrelated existing data.
  </instruction>
  
  <!-- NEW from v6.3.0 plan: Item Count Verification -->
  <item_count_verification>
    Compare the "Item Count" of the original vs. the new draft.
    
    Rule:
    - New `core_responsibilities` count >= Original count (unless deletion explicitly requested).
    - New `key_achievements` count >= Original count.
    
    IF New count < Original count:
      STOP and verify: "Did you intend to remove [Missing Item]?"
  </item_count_verification>
  
  <!-- ORIGINAL: Full validation with backup/restore logic -->
  <validation_logic>
    BEFORE saving finalized job history:
    1. LOAD original file.
    2. PERFORM 'Integrity Check':
       - count_before = total_positions
       - count_after = (total_positions + 1) [for Add] OR (total_positions) [for Edit]
       - IF count_after is unexpected:
         ABORT save.
         RE-SYNC with original file and RETRY update logic.
    3. SEARCH for "Placeholder" text or empty [brackets] in fields that were NOT part of the current update.
       IF found:
         BLOCK save and restore from backup.
  </validation_logic>
</data_loss_prevention_guardrail>
```


### G16: Master Skills Inventory Protection

> **Implementation Target:** [PROJECT-INSTRUCTIONS.md](PROJECT-INSTRUCTIONS.md) (primary) and [incremental-updates.md](optimization-tools/job-fit-analyzer/jfa_incremental-updates.md) (secondary).

**Instruction Text:**
```xml
<inventory_protection_guardrail>
  <priority>CRITICAL</priority>
  <instruction>
    Never add a skill to the <master_skills_inventory> unless it is explicitly and literally supported by a <key_achievement> or <core_responsibility> in the Job History.
  </instruction>
  
  <validation_logic>
    WHEN user adds/edits a skill:
      SCAN position achievements for that skill keyword.
      IF NOT found:
        PROMPT: "I see you're adding [Skill], but I don't see matching achievements. Should we add an achievement that demonstrates this skill first?"
        BLOCK addition to master inventory until evidence is provided.
  </validation_logic>
</inventory_protection_guardrail>
```

### G21a: Skill Inventory Context Verification (Original) <!-- v6.3.0 Change: Restored original guardrail -->

> **Implementation Target:** [evidence-matching.md](optimization-tools/bullet-optimizer/bo_evidence-matching.md) (primary) and [incremental-updates.md](optimization-tools/job-fit-analyzer/jfa_incremental-updates.md) (secondary).

**Instruction Text:**
```xml
<incremental_skill_context_check>
  <priority>HIGH</priority> <!-- v6.3.0 Change: Added priority tag -->
  <instruction>
    When updating a position, verify that newly added skills match the professional level and domain of that specific role.
  </instruction>
</incremental_skill_context_check>
```

### G21: Limitation-to-Bullet Cross-Check (Secondary) <!-- v6.3.0 Change: Renamed from #21 to #21b to distinguish from original -->

> **Implementation Target:** [evidence-matching.md](optimization-tools/bullet-optimizer/bo_evidence-matching.md) (primary) and [incremental-updates.md](optimization-tools/job-fit-analyzer/jfa_incremental-updates.md) (secondary).

**Instruction Text:**
```xml
<limitation_bullet_cross_check_guardrail>
  <priority>CRITICAL</priority>
  <instruction>
    During Job Fit Analyzer bullet generation, check honest_limitations BEFORE recommending bullets for each position.
  </instruction>
  
  <validation_logic>
    WHEN generating bullets for Position N in Job Fit Analyzer:
      1. Load position[N].honest_limitations
      2. Extract JD requirements
      3. FOR EACH JD requirement:
           IF requirement mentions skill/tool in honest_limitations:
             DO NOT generate bullet for Position N using this requirement
             ADD to gap analysis: "Position [N] limited: [limitation text]"
  </validation_logic>
</limitation_bullet_cross_check_guardrail>
```

---

## Validation Rules

### Position Data Validation

```
REQUIRED FIELDS (cannot be null/empty):
- job_title
- company
- dates (start_date)

OPTIONAL FIELDS (can be null/empty):
- education
- certifications
- travel_required
- clearance

ARRAY FIELDS (minimum 1 item):
- core_responsibilities (min: 1, recommended: 3-5)
- key_achievements (min: 1, recommended: 2-4)
- hard_skills_demonstrated (min: 1)
- soft_skills_demonstrated (min: 1)
```

### Date Validation

```
START_DATE:
  - Must be valid date format (Month YYYY or MM/YYYY or YYYY-MM)
  - Must be in the past (not future)

END_DATE:
  - Must be valid date format OR "Present"
  - Must be after start_date
  - If "Present", set end_date = current_date for calculations
```

---

## Integration with Other Workflows

### After Adding Position → JD Comparison

```
User adds new position → Updates job history → Wants to re-compare to JD

Flow:
  1. User adds position (this protocol)
  2. System offers: "Compare to JD?"
  3. If yes → Route to re-comparison workflow (see phase-3-re-comparison.md)
  4. Re-comparison uses UPDATED job history for matching
```

---

### After Editing Position → Re-generate Summary

```
User edits major fields (responsibilities, achievements) → Summary may be outdated

Flow:
  1. User edits position
  2. System detects major changes
  3. Offers: "Regenerate professional summary for this role?"
  4. If yes → Use summary generation logic to create new summary
```

---

## Related Protocols

- **Job History Creation:** `optimization-tools/resume-analyzer/ra_job-history-creation.md`
- **Skills Categorization:** Use classification rules from phase-1 docs
- **Re-Comparison:** `optimization-tools/job-fit-analyzer/jfa_re-comparison.md`
- **Summary Generation:** `optimization-tools/narrative-generator/ng_summary-generation.md` (future)

---

**Version History:**
- v1.0 (2025-12-28): Initial incremental update workflows (add/edit/remove)

---

**End of Incremental Job History Updates Protocol**
