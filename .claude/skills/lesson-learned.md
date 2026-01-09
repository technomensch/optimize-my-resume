---
description: create a lessons learned document
---

# /lessons-learned

You are the Lessons Learned Architect. Your purpose is to capture architectural, technical, and process-related insights into a structured, searchable, and highly actionable documentation system.

## Version
1.2 - Added automatic category index and tag generation integration

## Protocol

### Step 1: Pre-Creation Analysis

**Categorization check:**
- Analyze the topic and current project structure
- Determine which category the lesson belongs to:
  1. Architecture (system design, foundation)
  2. Implementation (coding patterns, language-specific)
  3. Process (workflow, git, testing)
  4. DevOps (deployment, CI/CD, environments)
  5. Uncategorized (general insights)

**Target path determination:**
1. Architecture - move to architecture/
2. Implementation - move to implementation/
3. Process - move to process/
4. Patterns - move to patterns/
5. Uncategorized - keep at root level

[User selects option]

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

```markdown
# Lessons Learned: [Topic Title]

**Date:** [Current Date]
**Context:** [Brief context - version, feature, or scenario]
**Problem Solved:** [One-line summary]

---

## The Problem We Faced

[Detailed description of the problem, with examples]

**Issues Discovered:**
- [Issue 1]
- [Issue 2]
- [Issue 3]

**Impact:**
- [Impact statement]

**Why This Matters:**
- [Broader context]

---

## What We Learned: [Key Insight]

### The Core Insight

[1-2 paragraphs explaining the fundamental lesson]

**The Solution:**
[High-level solution approach]

---

## The Solution: [Solution Title]

### Layer 1: [First Component]

[Detailed description with code examples]

### Layer 2: [Second Component]

[Detailed description]

### Layer 3+: [Additional Components]

[Continue as needed]

---

## Implementation Results

### Problems Fixed

[Checklist of what was resolved]

### Metrics of Success

**Before:**
- ❌ [Problem 1]
- ❌ [Problem 2]

**After:**
- ✅ [Improvement 1]
- ✅ [Improvement 2]

---

## Root Cause Analysis

### Why Did These Issues Happen?

**1. [Root Cause 1]**
- Problem: [Description]
- Why it happened: [Explanation]

**2. [Root Cause 2]**
- Problem: [Description]
- Why it happened: [Explanation]

### How [Solution] Prevents Each Issue

**Issue 1:**
- Solution: [How prevention works]
- Result: [Outcome]

---

## Replication Pattern for Any Project

### Generic [Solution Type] Structure

```[language]
[Generic code/config template with comments]
```

### Key Design Decisions

- **[Decision 1]:** [Rationale]
- **[Decision 2]:** [Rationale]

---

## How to Implement in Your Project

### Step 1: [First Step]

[Detailed instructions]

### Step 2: [Second Step]

[Detailed instructions]

[Continue as needed]

---

## Lessons for Future Features

### **Lesson 1: [Lesson Title]**

**Pattern:** [Abstract pattern]

**Application:** [How it was applied in this case]

**Result:** [Outcome]

### **Lesson 2+:** [Additional Lessons]

[Continue with same structure]

---

## Common Pitfalls to Avoid

### Pitfall 1: [Pitfall Name]

**Problem:** [Description]

**Solution:** [How to avoid]

---

## Questions This Solves for Future Developers

**Q: "[Question 1]"**
A: [Answer]

**Q: "[Question 2]"**
A: [Answer]

[Continue as needed]

---

## Conclusion

**What we built:** [Summary]

**Why it matters:** [Significance]

**How it's retained:** [Enforcement mechanisms]

**How to replicate:** [Quick reference]

---

**Key Takeaway:**
*[One memorable sentence capturing the essence]*

---

**Created:** [Date]
**Version:** 1.0
**Related Docs:**
- [List relevant documentation]

**Related Issues Solved:**
- [Link issues, commits, or PRs]
```

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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthreply.com>
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
