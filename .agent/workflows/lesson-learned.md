---
description: Document lessons learned, problems solved, and patterns
---
# Document Lessons Learned

**Purpose:** Create a comprehensive Lessons Learned document after solving a problem or implementing a new pattern.

**Version:** 1.2 (Updated: 2026-01-02) <!-- v1.2 Change: Added category auto-detection and master index updates -->

---

## Syntax Detection <!-- v1.1 Change -->

**Create New Document:**
- `/lessons-learned` → Create new document (Steps 1-5 below)
- `/lessons-learned <topic>` → Create new document with topic

**Update Existing Document:**
- `/lessons-learned update <filename>` → Update existing document (Step 0 below)
- Example: `/lessons-learned update Lessons_Learned_Chat_History_Workflow.md`

---

## Step 0: Update Existing Document (v1.1 Feature) <!-- v1.1 Change -->

**When user types:** `/lessons-learned update <filename>`

### Step 0.1: Read Existing Document

1. **Locate file:**
   - Path: `docs/lessons-learned/<filename>`
   - If not found, ask user for correct path

2. **Extract metadata:**
   - Current version (from **Version:** field)
   - Creation date (from **Created:** field)
   - Last update date (from **Version:** field if present)

3. **Determine next version:**
   - Minor increment: v1.0 → v1.1 → v1.2
   - Format: `**Version:** 1.X (Updated: YYYY-MM-DD) <!-- v1.X Change -->`

### Step 0.2: Ask What to Update

Present options to user:

```markdown
I'll help you update **<filename>**

**Current Version:** v1.X
**Last Updated:** YYYY-MM-DD

**What would you like to update?**

1. [ ] Add new section (will be inserted before Conclusion)
2. [ ] Update existing section (specify which section)
3. [ ] Add to version history only
4. [ ] Other (describe)

Please select an option and provide details.
```

### Step 0.3: Gather Update Content

Based on user selection:

**For "Add new section":**
- Ask for section title
- Ask for section content (or user will provide)
- Ask where to insert (default: before Conclusion)

**For "Update existing section":**
- Ask which section to update
- Ask what to add/change
- Preserve existing content, append new content

**For "Add to version history only":**
- Ask for changelog entry

### Step 0.4: Apply Updates

**Update version history:**
```markdown
**Version:** 1.X (Updated: 2025-12-12) <!-- v1.X Change -->

**Changelog:** <!-- v1.X Change -->
- v1.0 (YYYY-MM-DD): Initial release
- v1.X (2025-12-12): [Brief description of changes] <!-- v1.X Change -->
```

**Add dated section header** (if adding new section):
```markdown
## [Section Name] (Updated: 2025-12-12) <!-- v1.X Change -->

[Content]
```

**Update existing section** (if modifying):
```markdown
## [Existing Section]

[Original content]

### [Sub-section] (Updated: 2025-12-12) <!-- v1.X Change -->

[New content added here]
```

**Add inline comments** at all change locations:
```markdown
<!-- v1.X Change -->
```

### Step 0.5: Confirm with User

Show user the changes that will be made:

```markdown
**Proposed Updates to <filename>:**

**Version:** v1.X → v1.Y

**Changes:**
1. [Change 1 description]
2. [Change 2 description]

**Sections Modified:**
- [Section name] (line XX)
- [Section name] (line YY)

**Proceed with these updates?** (yes/no)
```

### Step 0.6: Write Updated Document

- Preserve ALL existing content
- Add new sections/content as specified
- Update version metadata
- Add all inline comments
- Save file

### Step 0.7: Commit (if user approves)

```bash
git add docs/lessons-learned/<filename>
git commit -m "docs(lessons): update <topic> v1.X

[Description of changes]

v1.X Change

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Instructions (Create New Document)

When the user invokes this command without "update", follow this structured process:

### Step 1: Verification (INTERACTIVE)

**Ask the user these questions:**

1. **What problem did you solve or pattern did you implement?**
   - Briefly describe in 1-2 sentences

2. **What should this lessons learned document cover?**
   - The problem encountered
   - Root cause analysis
   - Solution implemented
   - Prevention systems
   - Replication guidance
   - Other (specify)

3. **What is the primary audience?**
   - Future developers on this project
   - External developers wanting to replicate the pattern
   - General software engineering best practices
   - AI-assisted development workflows
   - Other (specify)

4. **Suggested filename:**
   - Format: `Lessons_Learned_[Topic].md`
   - Example: `Lessons_Learned_Automated_Validation.md`
   - Confirm or suggest alternative

**WAIT FOR USER CONFIRMATION** before proceeding to Step 1.5.

### Step 1.5: Auto-Detect Lesson Category (v1.2 Feature) <!-- v1.2 Change -->

**After gathering lesson topic, determine category:**

**Category detection logic:**

| Keywords in Topic/Description | Category |
|-------------------------------|----------|
| "architecture", "design decision", "pattern", "structure", "architectural" | `architecture/` |
| "bug", "debug", "error", "fix", "troubleshoot", "debugging" | `debugging/` |
| "workflow", "process", "SOP", "procedure", "ceremony", "practice" | `process/` |
| "reusable", "pattern", "template", "boilerplate", "framework" | `patterns/` |
| No clear match | `[uncategorized]` (root directory) |

**Ask user to confirm:**

```markdown
Based on your topic, I recommend:

**Category:** architecture

This lesson will be saved to: docs/lessons-learned/architecture/

**Is this correct?**
1. ✅ Yes - use architecture/
2. Process - move to process/
3. Debugging - move to debugging/
4. Patterns - move to patterns/
5. Uncategorized - keep at root level

[User selects option]
```

**Category override:**
- User can always override auto-detection
- Option 5 (Uncategorized) places in docs/lessons-learned/ (root)
- Other options place in respective subdirectory

**Filename generation with category:**

```
Category: architecture
Topic: Memory System Foundation
Path: docs/lessons-learned/architecture/Lessons_Learned_Memory_System_Foundation.md
```

**Category README check:**
- If category subdirectory doesn't exist, create it
- Copy category README template if needed

### Step 2: Structure Planning

Based on user responses, plan document structure using this template:

**Action:**
Read and use the template from: `docs/workflow-templates/lesson-learned.md`

### Step 3: Content Gathering (INTERACTIVE)

**Ask the user for key information:**

1. **Problem Details:**
   - What specific issues were encountered?
   - What was the impact?
   - Examples or evidence?

2. **Root Cause:**
   - Why did the problem happen?
   - What underlying factors contributed?
   - Were there patterns or systemic issues?

3. **Solution Components:**
   - What did you build/implement?
   - What are the key layers/parts?
   - Code examples or configurations?

4. **Metrics/Evidence:**
   - Before/after comparisons
   - Performance measurements
   - Success indicators

5. **Replication Guidance:**
   - What's the abstract pattern?
   - How can others apply it?
   - What to customize vs keep universal?

**CONFIRM** the gathered information with user before writing.

### Step 4: Document Creation

Create the lessons learned document at:
`/Users/mkaplan/Documents/GitHub/optimize-my-resume/docs/lessons-learned/Lessons_Learned_[Topic].md`

**Writing Guidelines:**

1. **Be Specific:** Use actual examples, file paths, code snippets from the project
2. **Be Actionable:** Provide replication patterns and step-by-step guides
3. **Be Complete:** Cover problem → root cause → solution → replication
4. **Be Future-Focused:** Answer questions future developers will have
5. **Use Formatting:**
   - ✅/❌ for before/after comparisons
   - Code blocks with language tags
   - Clear section headers
   - Bullet lists for scannability

### Step 4.5: Update Master Index (v1.2 Feature) <!-- v1.2 Change -->

**Auto-update docs/lessons-learned/README.md:**

**Add entry to appropriate category section:**

```markdown
## Architecture Lessons (5 total)

- [2026-01-02 - Memory System Foundation](architecture/Lessons_Learned_Memory_System_Foundation.md) - Four-pillar knowledge capture system
- [2025-12-29 - Skills Architecture](Lessons_Learned_Claude_Code_Skills_Architecture.md) - Claude Code skills global-only pattern
[... existing entries ...]

**Tags:** #architecture #memory #knowledge-graph
```

**Tag extraction:**
Auto-generate tags from:
- Category name (e.g., #architecture)
- Topic keywords (e.g., #memory, #knowledge-graph)
- Technology names mentioned (e.g., #claude-code)

**Update tag index:**

```markdown
## Tag Index

**#architecture** (5 lessons)
- [Memory System Foundation](architecture/Lessons_Learned_Memory_System_Foundation.md)
- [Skills Architecture](Lessons_Learned_Claude_Code_Skills_Architecture.md)
[... other #architecture lessons ...]
```

**Update chronological index:**

```markdown
## Chronological Index

**2026**
- 2026-01-02: [Memory System Foundation](architecture/Lessons_Learned_Memory_System_Foundation.md)

**2025**
- 2025-12-31: [Context Engineering Template](Lessons_learned-Context_Engineering_Template.txt)
[... other 2025 lessons ...]
```

**Update header stats:**

```markdown
**Total Lessons:** 4 → 5
**Last Updated:** 2026-01-02
```

### Step 5: Commit

After document is created and user approves:

```bash
git add docs/lessons-learned/Lessons_Learned_[Topic].md
git commit -m "docs(lessons): create [topic] lessons learned

[Brief description of what the document covers]

### Key Contents

[3-5 bullet points of main sections]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
"
```

---

## Example Invocation

**User types:** `/lessons-learned`

**Assistant responds:**

"I'll help you create a Lessons Learned document. Let me ask a few questions first:

1. **What problem did you solve or pattern did you implement?**

2. **What should this lessons learned document cover?**
   - [ ] The problem encountered
   - [ ] Root cause analysis
   - [ ] Solution implemented
   - [ ] Prevention systems
   - [ ] Replication guidance
   - [ ] Other: ___________

3. **What is the primary audience?**
   - [ ] Future developers on this project
   - [ ] External developers wanting to replicate the pattern
   - [ ] General software engineering best practices
   - [ ] Other: ___________

4. **Suggested filename:** Lessons_Learned_[Topic].md

   What should [Topic] be?"

---

## Checklist Before Creating Document

- [ ] User confirmed what to document
- [ ] Verified topic and scope
- [ ] Confirmed filename
- [ ] Gathered problem details, root cause, solution, metrics
- [ ] User approved content plan
- [ ] Document follows template structure
- [ ] Includes replication pattern for other projects
- [ ] Committed with descriptive message

---

## Related Commands

- `/doc-update` - Standard documentation update protocol
- This command is specifically for creating Lessons Learned documents after solving problems

---

**Created:** 2025-12-09
**Version:** 1.0
**Usage:** Type `/lessons-learned` when you want to document a problem solved or pattern implemented
