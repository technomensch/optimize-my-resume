# Process Lessons

Lessons learned about workflow improvements, development processes, and team practices.

**Total Lessons:** 7
**Last Updated:** 2026-01-03

---

## All Process Lessons

### 1. [SessionStart Hook Automation](Lessons_Learned_SessionStart_Automation.md)
**Date:** 2026-01-03
**Problem Solved:** Manual triggering overhead for memory system skills
**Key Learning:** Hook-based automation at workflow boundaries (SessionStart + git commit) provides semi-automatic documentation prompts without removing human judgment

### 2. [Patch Workflow and /patch Command](Lessons_Learned_Patch_Workflow.md)
**Date:** 2025-12-11
**Problem Solved:** Jumping to implementation before proper analysis during patch-level changes
**Key Learning:** Always analyze → plan → implement, even for "simple" bug fixes

### 3. [Branch Prompt Workflow Pattern](Lessons_Learned_Branch_Prompt_Workflow.md)
**Date:** 2025-12-10
**Problem Solved:** How to safely test AI prompt changes without breaking stable versions
**Key Learning:** Use branch-specific temporary prompts for iteration, never commit them

### 4. [Chat History Export Workflow](Lessons_Learned_Chat_History_Workflow.md)
**Date:** 2025-12-18
**Problem Solved:** Preserving conversation context before chat compaction
**Key Learning:** Track chat-history/ folder in git, ignore contents with .gitignore, export before compaction

### 5. [Plan File Locations](Lessons_Learned_Plan_File_Locations.md)
**Date:** 2025-12-10
**Problem Solved:** Feature plans created in temporary `.claude/plans/` instead of tracked `docs/plans/`
**Key Learning:** Move plans from `.claude/plans/` to `docs/plans/` for version control

### 6. [Automated Validation for Documentation Consistency](Lessons_Learned_Automated_Validation.md)
**Date:** 2025-12-10
**Problem Solved:** Documentation conflicts and version inconsistencies during rapid iteration
**Key Learning:** Automated validation scripts catch issues before they compound

### 7. [Version Consistency Across Split Changelogs](Lessons_Learned_Split_Changelog_Versioning.md)
**Date:** 2025-12-17
**Problem Solved:** Maintaining version consistency with separate user and developer changelogs
**Key Learning:** Extract and compare versions from both changelogs to ensure synchronization

---

## Common Themes

**Pre-Implementation Planning:**
- Patch Workflow, Plan File Locations emphasize planning before coding
- Branch Prompt Workflow shows safe iteration patterns

**Git Hygiene:**
- Chat History, Plan File Locations, Branch Prompt all address what to track vs. ignore
- Clear patterns: track folders, ignore temporary contents

**Automation:**
- SessionStart Hook, Automated Validation, and Split Changelog show value of automation
- SessionStart Hook: Context loading and documentation prompts at workflow boundaries
- Automated Validation: Scripts catching errors before they compound
- Reducing manual checking burden while preserving human judgment

---

## Related

- **Workflows:** [../../workflows/](../../workflows/)
- **Knowledge:** [../../knowledge/workflows.md](../../knowledge/workflows.md)
- **Main Index:** [../README.md](../README.md)

---

**Created:** 2026-01-02
