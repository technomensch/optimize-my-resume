# Lessons Learned: GitHub Issue-Driven Branching and Planning

**Date:** 2026-01-07
**Context:** Automation of Project Maintenance and Bugfixing (v6.5.1)
**Problem Solved:** Manually tracking requirements across multiple feature requests/bugs leads to fragmentation and implementation gaps.

---

## The Problem We Faced

When managing multiple simultaneous updates (e.g., Issues #5, #6, #7, #8, #9), it is difficult to maintain a single source of truth for implementation requirements. Relying on memory or manual copy-pasting from a browser UI often misses:
- **Authoritative Comments**: Overriding instructions found in specific issue threads.
- **Precise XML/Code Snippets**: Exact formatting requirements that are easily mangled when summarized.
- **Workflow Consistency**: Linking branches and plans to the specific work items they address.

**Issues Discovered:**
- **Information Silos**: Initial issue bodies don't always reflect final decisions made in comment threads.
- **Context Loss**: Switching between terminal, IDE, and browser creates cognitive friction and potential for error.

**Impact:**
- Missing a "critical" guardrail or "authoritative" display rule during the planning phase.
- Redundant work if two issues overlap or conflict.

---

## What We Learned: The "CLI-First" Research Pattern

### The Core Insight
The `gh` (GitHub) CLI is a superior research tool for AI assistants compared to web searching or manual summary. By programmatically fetching the full thread (body + comments), the assistant can consolidate multiple requirements into a single "Surgical Implementation Plan" with 100% accuracy to the user's intent.

**The Solution:**
Adopted a standard protocol for "GitHub-Driven Planning":
1.  **Multi-Issue Retrieval**: Use `gh issue view [X] --comments` for all relevant issues.
2.  **Authoritative Consolidation**: Analyze bodies and comments to find the most recent/overriding instruction.
3.  **Exact Snippet Extraction**: Copy absolute XML/code directly into the plan.

---

## The Solution: GitHub Integration Protocol

### Layer 1: Branch Automation
Always create a branch named after the cumulative patch (e.g., `v6.5.1-analyzer-report-bugfixes`) to provide a isolated workspace for the consolidated changes.

### Layer 2: Full-Thread Inspection
The solution involves running batch commands to extract all context before a single line of code is written:
```bash
# Extract bodies and comments for all target work items
gh issue view 5 --comments
gh issue view 6 --comments
# ... etc
```

### Layer 4: Close the Loop (The Feedback Loop)
If the implementation process reveals errors or requires modifications to the existing instructions (e.g., correcting the `clean_verb_display` rule), the AI must post a comment back to the original GitHub issue. This ensures:
- **Project Transparency**: Other contributors (human or AI) are aware of the override.
- **Traceability**: The rationale for the documentation change is linked directly to the work item.
- **Continuous Improvement**: Prevents future sessions from repeating the same mistake by explicitly correcting the "source of truth."

---

## Implementation Results

### Problems Fixed
- ✅ Identified an authoritative override for Issue #6 that would have been missed by looking at the body alone.
- ✅ Captured exact XML character limits (`74/210 chars`) and emoji sets from Issue #9 and #6.
- ✅ Corrected an erroneous instruction in Issue #9 (`clean_verb_display`) and pushed the fix back to the issue thread for future reference.

### Metrics of Success
**Manual Planning:**
- ❌ High risk of missing overrides.
- ❌ Inconsistent snippet formatting.
- ❌ Silent overrides lead to documentation drift.

**GitHub-Driven Planning:**
- ✅ Authoritative source retrieval.
- ✅ Surgical implementation accuracy.
- ✅ Explicit feedback loop prevents technical debt in instructions.

---

## Replication Pattern for Any Project

### The "Issue-to-Plan" Workflow
1.  **Command**: `gh issue list` (Identify scope).
2.  **Command**: `gh issue view <id> --comments` (Gather intelligence).
3.  **Action**: Create `docs/plans/[version]-[task].md` (Centralize truth).
4.  **Action**: Extract and paste exact snippets into the plan.
5.  **Action**: **Close the Loop**: If the plan modifies instructions, run `gh issue comment <id> --body "Update: [Description of change]"` to notify stakeholders.

---

## How to Implement in Your Project

### Step 1: Install `gh` CLI
Ensure the environment has the GitHub CLI authenticated.

### Step 2: Use Surgical Planning
When the user lists issues, run a loop or batch command to read every comment. Treat the **last comment by the owner/authority** as the final requirement.

---

## Lessons for Future Features

### **Lesson 1: The CLI is the Source of Truth**
**Pattern:** Programmatic requirement gathering.
**Application:** Used to consolidate Issues #5-#9 for the analyzer report.
**Result:** A plan that was approved by the user with zero "hallucinations" of requirements.

---

## Conclusion
Don't guess or summarize what you can read directly from the source. By leveraging GitHub's CLI, an AI can transform a list of "bug reports" into a "surgical strike team" of implementation tasks.

**Key Takeaway:**
*Read the comments. The body is the proposal; the comments are the decision.*

---

**Created:** 2026-01-07
**Version:** 1.0
**Related Docs:**
- [docs/plans/v6.5.1-analyzer-report-bugfixes.md](../../plans/v6.5.1-analyzer-report-bugfixes.md)
- [.claude/skills/lesson-learned.md](../../../.claude/skills/lesson-learned.md)
