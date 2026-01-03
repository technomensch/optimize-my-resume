# update-history

Intelligently update job history files with surgical precision - increment version, identify changes from chat context, and apply updates without rewriting.

## Description

This skill manages job history updates by:
- Copying current version to new incremented version
- Analyzing chat context to identify what needs updating
- Surgically applying changes (not rewriting entire file)
- Following template schema for consistency
- Generating both .txt (XML) and .md (Markdown) formats

**Philosophy:** Preserve existing content, enhance surgically, maintain version history.

## Usage

```
/update-history [job_history_file.txt]
```

**Parameters:**
- `job_history_file.txt` (optional): Path to current job history file
  - If not provided but Claude recognizes it from context, will verify
  - If unknown, will ask user to specify

**Examples:**
```
/update-history chat-history/claude_generated_job_history_summaries_v7.txt
/update-history  # Claude will try to infer or ask
```

## Workflow

### Step 1: Identify Source File

**Option A - File provided:**
```
User: /update-history chat-history/claude_generated_job_history_summaries_v7.txt
Claude: [Uses this file]
```

**Option B - File inferred from context:**
```
User: /update-history
Claude: "I see you've been working with v7.txt. Is this the file you want to update? (y/n)"
User: y
Claude: [Proceeds with v7.txt]
```

**Option C - File unknown:**
```
User: /update-history
Claude: "Which job history file would you like to update? Please provide the path."
User: chat-history/claude_generated_job_history_summaries_v7.txt
Claude: [Proceeds]
```

### Step 2: Analyze Update Context

**If chat session contains update discussions:**
```
Claude analyzes recent conversation and identifies:
- Position updates (e.g., "added JSON to Position 3")
- New achievements (e.g., "RFP automation project")
- Metric changes (e.g., "13+ releases, 80% deployment reduction")
- New skills (e.g., "Power Platform Pipelines")
- Company name corrections (e.g., "Foxhole Technology")

Claude: "Based on our conversation, I identified these updates:
1. Position 3: Add JSON/Power Apps work
2. Position 4: Add JSON references to Power Automate
3. Position 5: Update company to Foxhole Technology
4. Position 5: Add RFP automation achievement

Is this correct? (y/n/modify)"
```

**If no update context in chat:**
```
Claude: "What updates do you want to make to the job history?

Options:
1. Add new position
2. Update existing position (specify which)
3. Add achievements to existing position
4. Update metrics/dates
5. Other (explain)

Please describe what needs updating, or provide bullet points
for optimization following the bullet optimization workflow."
```

### Step 3: Determine Version Increment

**Version increment rules:**
```
Current: v7.0

MAJOR (v7.0 → v8.0):
- Added/removed entire position
- Major restructuring
- Schema changes

MINOR (v7.0 → v7.1):
- Added achievements to existing position
- Updated metrics
- Added skills/tools
- Company name corrections
- Content enhancements

PATCH (v7.1 → v7.1.1):
- Typo fixes
- Minor clarifications
- Formatting corrections
```

**Claude determines increment:**
```
Claude: "These changes constitute a MINOR version update.
I'll create v7.1 with the following changes:
- [List of changes]

Proceed? (y/n)"
```

### Step 4: Copy and Increment

**Actions:**
1. Copy `v7.txt` → `v7.1.txt`
2. Update title: `VERSION 7.1 (BRIEF DESCRIPTION)`
3. Add version history entry at top:
```
v7.1: [Brief description of changes] (Jan 2, 2026)
  - Change 1
  - Change 2
  - Change 3
```

### Step 5: Apply Surgical Updates

**Surgical update principles:**
```
✅ DO:
- Add new content to existing sections
- Enhance existing bullet points
- Insert new achievements/responsibilities
- Update specific metrics
- Preserve all existing detail

❌ DON'T:
- Rewrite entire sections from scratch
- Remove existing content (unless explicitly requested)
- Change structure/order without reason
- Lose existing metrics or details
```

**Example surgical update:**
```xml
<!-- BEFORE (v7.0) -->
<hard_skills_demonstrated>
  - Azure DevOps
  - Sprint Planning
</hard_skills_demonstrated>

<!-- AFTER (v7.1) - SURGICAL -->
<hard_skills_demonstrated>
  - Azure DevOps
  - Azure DevOps Pipelines (CI/CD)  ← ADDED
  - Sprint Planning
  - Power Platform Pipeline Management  ← ADDED
</hard_skills_demonstrated>

<!-- NOT THIS (complete rewrite) -->
<hard_skills_demonstrated>
  - CI/CD with Azure DevOps
  - Agile sprint planning
</hard_skills_demonstrated>
```

### Step 6: Validate and Convert

**After surgical updates:**
```bash
# 1. Validate XML structure
python3 scripts/validate_job_history.py chat-history/job_history_v7.1.txt

# 2. Generate Markdown
python3 scripts/convert_job_history_to_md.py chat-history/job_history_v7.1.txt
```

**Output:**
```
✅ Created v7.1.txt (XML format)
✅ Created v7.1.md (Markdown format)
✅ Validation passed
```

### Step 7: Summary

**Claude provides:**
```
📋 Update Summary

Version: v7.0 → v7.1
Description: JSON/Power Platform additions

Changes Applied:
✅ Position 3: Added JSON schema work for Power Apps
✅ Position 4: Added JSON references for Power Automate
✅ Position 5: Updated company to Foxhole Technology
✅ Position 5: Added RFP automation achievement (8 new bullets)

Files Created:
- chat-history/claude_generated_job_history_summaries_v7.1.txt
- chat-history/claude_generated_job_history_summaries_v7.1.md

Validation: ✅ Passed
```

## Decision Tree

```
/update-history [file?]
       ↓
┌──────┴──────┐
│ File given? │
└──────┬──────┘
       ↓
    NO ↓ YES
       ↓      ↓
┌──────┴──────┐
│ Infer from  │ → Verify → ✅
│ context?    │
└──────┬──────┘
       ↓
    NO ↓ YES
       ↓      ↓
┌──────┴──────┐
│  Ask user   │
│  for file   │
└──────┬──────┘
       ↓
┌─────────────────┐
│ Analyze chat    │
│ for updates     │
└────────┬────────┘
         ↓
   ┌─────┴─────┐
   │ Found?    │
   └─────┬─────┘
         ↓
     NO  ↓ YES
         ↓     ↓
   ┌─────┴─────┐
   │ Ask what  │  → Verify updates
   │ to update │
   └─────┬─────┘
         ↓
   ┌─────────────────┐
   │ Bullet          │
   │ optimization?   │
   └────────┬────────┘
            ↓
      ┌─────┴──────┐
      │ Determine  │
      │ version    │
      │ increment  │
      └─────┬──────┘
            ↓
      ┌─────┴──────┐
      │ Copy &     │
      │ increment  │
      └─────┬──────┘
            ↓
      ┌─────┴──────┐
      │ Apply      │
      │ surgical   │
      │ updates    │
      └─────┬──────┘
            ↓
      ┌─────┴──────┐
      │ Validate & │
      │ convert    │
      └─────┬──────┘
            ↓
      ┌─────┴──────┐
      │ Summary &  │
      │ delivery   │
      └────────────┘
```

## Context Analysis

**Claude looks for these patterns in chat:**

### Pattern 1: Explicit Updates
```
User: "Add JSON to Position 3"
User: "Update company name to Foxhole Technology"
User: "Add RFP automation project to Position 5"

Claude: [Captures these as specific update tasks]
```

### Pattern 2: Detailed Discussions
```
User: "I also used JSON for Power Automate flows"
User: "At Foxhole Technology, I built RFP automation..."

Claude: [Infers these should be added to job history]
```

### Pattern 3: Q&A About Content
```
User: "Does the job history mention CI/CD?"
Claude: [Checks] "No, I don't see CI/CD mentioned."
User: "I managed 13+ releases with pipelines..."

Claude: [Captures this as potential addition]
```

### Pattern 4: Corrections
```
User: "The company was actually Foxhole Technology, not DoE"
User: "It should say Canvas AND model-driven, not just Canvas"

Claude: [Identifies corrections to apply]
```

## Integration with Other Workflows

### With Bullet Optimization
```
If user provides bullets but no structured history:
1. Run bullet optimization workflow
2. Generate job_history_vX.txt
3. Validate and convert
4. Deliver both formats
```

### With /doc-update
```
After /update-history:
1. Job history updated (v7.0 → v7.1)
2. Run /doc-update to sync:
   - CHANGELOG.md
   - ROADMAP.md
   - Other docs referencing job history
```

### With /patch
```
If significant changes:
1. Complete /update-history
2. Recommend /patch to capture work
3. Document changes for future reference
```

## Examples

### Example 1: Context-Aware Update

**Chat context:**
```
User: "Does Position 3 mention CI/CD?"
Claude: "No, I don't see CI/CD in Position 3."
User: "I managed 13+ weekly releases with Azure DevOps pipelines..."
[Discussion continues about deployment work]

User: /update-history
```

**Claude response:**
```
Based on our conversation about CI/CD and deployment work,
I identified these updates for Position 3:

1. Add CI/CD responsibilities
2. Add release management achievements
3. Add DevOps hard skills
4. Add deployment metrics

This would be a MINOR version update (v7.0 → v7.1).

Shall I proceed with these updates? (y/n)
```

### Example 2: Explicit Updates

**Chat:**
```
User: /update-history chat-history/v7.txt

I need to add:
- Position 5 company should be "Foxhole Technology"
- Add RFP automation project to Position 5
- Add JSON references to Positions 3, 4, 5
```

**Claude response:**
```
I'll create v7.1 with the following surgical updates:

Position 3:
- Add JSON schema work for Canvas/model-driven Power Apps

Position 4:
- Update Power Automate references to mention JSON

Position 5:
- Update company to "Foxhole Technology (DoE SOC contract)"
- Add RFP automation achievement
- Add JSON and Power Apps to hard skills

This is a MINOR update (v7.0 → v7.1: "JSON/Power Platform additions")

Proceed? (y/n)
```

### Example 3: New Position

**Chat:**
```
User: /update-history v7.txt

Add new Position 7:
- Role: Senior Technical Writer
- Company: ABC Corp
[... bullets ...]
```

**Claude response:**
```
Adding a new position is a MAJOR version update.

I'll create v8.0 with:
- New Position 7 (Senior Technical Writer at ABC Corp)
- Updated Total Jobs count
- Generated from provided bullets

This will follow the bullet optimization workflow.
Proceed? (y/n)
```

## Best Practices

### 1. Always Verify Inferred Updates
```
Never assume - always confirm with user what should be updated
```

### 2. Preserve Existing Content
```
Surgical updates only - don't rewrite unless explicitly requested
```

### 3. Follow Template Schema
```
All updates must conform to templates/job_history_template.xml
```

### 4. Validate Before Delivery
```
Always run validation and conversion scripts
```

### 5. Document Version Changes
```
Clear version history entry explaining what changed
```

## Troubleshooting

**Problem:** Can't infer file from context
**Solution:** Ask user explicitly for file path

**Problem:** Updates unclear from chat
**Solution:** Ask user to clarify what needs updating

**Problem:** Validation fails after update
**Solution:** Review changes against template, fix, re-validate

**Problem:** User wants to revert
**Solution:** Previous versions preserved (v7.0 still exists alongside v7.1)

## Technical Details

**Files Modified:**
- Source .txt file copied and incremented
- New .md generated from new .txt
- Previous versions preserved (no overwrites)

**Validation:**
```bash
python3 scripts/validate_job_history.py <new_file.txt>
```

**Conversion:**
```bash
python3 scripts/convert_job_history_to_md.py <new_file.txt>
```

**Version History Format:**
```
vX.Y: Brief description (Month Day, Year)
  - Specific change 1
  - Specific change 2
  - Specific change 3
```

---

**Version:** 1.0
**Created:** January 2, 2026
**Integration:** Works with /doc-update, /patch, bullet optimization workflow
