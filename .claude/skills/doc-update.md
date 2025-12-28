# Documentation Update Protocol

**Purpose:** Load and follow the standardized documentation update process for this project.

---

## Protocol Reference

Read and follow the complete protocol defined in:
`/Users/mkaplan/Documents/GitHub/optimize-my-resume/docs/prompts/dev/Update_Doc_Prompt.md`

This ensures all documentation updates follow the standard process for:

### ✅ Mandatory Steps
1. **Identify Targets** - Determine which docs need updating (ROADMAP, CHANGELOG, CHANGELOG_DEV, prompts, plans)
2. **User Verification** - Confirm proposed changes before proceeding (INTERACTIVE)
3. **Version Strategy** - Ask for Minor (x.x.1) vs Major (x.1.0) bump (INTERACTIVE)
4. **Apply Updates** - Follow Rules 1-5:
   - Rule 1: Version History entries
   - Rule 2: Inline comments (`<!-- vX.Y Change -->`)
   - Rule 3: Code file version headers
   - Rule 4: Version history consolidation
   - Rule 5: Implementation plan consolidation (when applicable)
5. **Test-First Validation** - For code changes only
5.5. **Branch Prompt Testing** - For major prompt changes only (use `docs/prompts/tmp/`)
6. **Roadmap Synchronization** - Update reference table, mark tasks complete
7. **Git Operations** - Stage, commit with structured messages, push

### 🎯 Key Reminders
- Always use **feature branches** for major updates (`v4.5-feature-name`)
- Follow **interactive verification** (Steps 2-3) - don't skip user confirmation
- Add **inline comments** at every change location
- Update **CHANGELOG.md** for user-facing changes
- Update **CHANGELOG_DEV.md** for developer experience changes (tools, process, lessons learned)
- Use **conventional commit** format for git messages
- **⚠️ CRITICAL: Clean up tmp/ files** - Always delete `docs/prompts/tmp/*.md` after merging

### 🧹 Pre-Merge Cleanup Checklist
Before merging your feature branch:
```bash
# Check for orphaned tmp files
ls docs/prompts/tmp/*.md

# Expected: "No such file or directory"
# If files exist: DELETE THEM before merging!
rm docs/prompts/tmp/*.md  # (except README.md)
```

### 📋 Target Documents
1. `docs/prompts/sys/System_Prompt.md`
2. `docs/prompts/sys/UI_Prompt.md`
3. `docs/prompts/analyzer/Resume_Analyzer_Prompt.md`
4. `docs/prompts/comparative/JD_Comparative_Prompt.md`
5. `docs/prompts/sys/App_Gen_Prompt.md`
6. `docs/ROADMAP.md`
7. `docs/plans/*.md`
8. `docs/CHANGELOG.md` - User-facing changes
9. `docs/CHANGELOG_DEV.md` - Developer experience changes (tools, process, lessons learned)

---

## Usage

Type `/doc-update` at the start of any session where you'll be making documentation changes to load this protocol.

**Example Workflow:**
```
User: /doc-update
Assistant: [Loads protocol, ready to follow Update_Doc_Prompt.md steps]

User: "Update the Resume Analyzer Prompt to add action verb categorization"
Assistant: "Based on this change, I propose updating:
- Resume_Analyzer_Prompt.md
- ROADMAP.md
- CHANGELOG.md

Are these the correct documents? Should any be added or removed?"
```

---

**Protocol Version:** Follows Update_Doc_Prompt.md v1.5 (branch prompt workflow with tmp/ directory)
**Last Updated:** 2025-12-08
**See Also:** `/docs/prompts/dev/Pre_Merge_Checklist.md` for cleanup verification
