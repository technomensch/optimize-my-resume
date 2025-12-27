# Resume Optimizer Documentation Update Prompt

## Version History
- v1.0: Initial Release
- v1.1: Added Rule 3 for Code File Version Headers <!-- v1.1 Change -->
- v1.2: Added Step 5 'Test-First Validation' rule <!-- v1.2 Change -->
- v1.3: Added Rule 4 for Version History Consolidation <!-- v1.3 Change -->
- v1.4: Added `docs/plans/*.md` to target documents list (Step 1, item 7). Part of v4.2.1 documentation reorganization. <!-- v1.4 Change -->
- v1.5: Added Step 5.5 'Branch Prompt Testing' workflow and tmp/ directory usage <!-- v1.5 Change -->

## Purpose
This prompt defines the standard operating procedure for updating project documentation to ensure consistency, version tracking, and accurate reference for future development. Use this prompt whenever code, logic, or UI changes are made that affect the system's behavior.

## TRIGGER
**"Run Doc Update Protocol"** or **"Update Documentation"**

## EXECUTION STEPS

### Step 1: Identify Targets
Analyze the recent changes made to the codebase or requirements. Identify which of the following authoritative documents require updates:
1.  `docs/prompts/sys/System_Prompt.md` (Backend Logic, Rules, Prompts)
2.  `docs/prompts/sys/UI_Prompt.md` (Frontend Flow, Visuals, State)
3.  `docs/prompts/analyzer/Resume_Analyzer_Prompt.md` (Standalone Analysis Logic)
4.  `docs/prompts/comparative/JD_Comparative_Prompt.md` (JD Comparison Logic)
5.  `docs/prompts/sys/App_Gen_Prompt.md` (Build, Install, Config)
6.  `docs/ROADMAP.md` (Project Status, Milestones)
7.  `docs/plans/*.md` (Implementation Plans for specific features)
8.  `docs/CHANGELOG.md` (User-facing changes and feature releases)
9.  `docs/CHANGELOG_DEV.md` (Developer experience: tools, process, lessons learned)

### Step 2: User Verification (INTERACTIVE)
Before making any changes, present the proposed plan to the user:
> "Based on the recent changes [summary of changes], I propose updating the following documents:
> - [Doc Name]
> - [Doc Name]
>
> Are these the correct documents? Should any be added or removed?"

### Step 3: Version Strategy (INTERACTIVE)
For each document confirmed in Step 2, ask:
> "Should the update for [Doc Name] be a **Minor** (x.x.1) or **Major** (x.1.0) version bump?"

### Step 4: Apply Updates
Once confirmed, apply the updates to the files adhering to these strict formatting rules:

#### Rule 1: Version History
At the top of the document, add a new entry to the `## Version History` section:
- `v[NewVersion]: [Brief description of what changed]`

#### Rule 2: Inline Comments
At the specific location in the document where the text was modified, added, or removed, insert a comment explicitly stating the version and change.

*Markdown Example:*
```markdown
### Some Section
Old rule text...
New rule text added here. <!-- v1.5 Change: Added new rule for X -->
```

*Code Block Example:*
```javascript
// v1.5 Change: Updated logic to handle Y
function newLogic() { ... }
```

#### Rule 3: Code File Version Headers (v1.1 Change)
For every code file (html, ts, tsx, css, json) updated, a comment block must be added or updated at the very top of the file tracking the change history.

*HTML/XML Example:*
```html
<!--
Version History:
v1.0: Initial
v1.1: Added feature X
-->
```

*JS/TS/JSONC Example:*
```javascript
/**
 * Version History:
 * v1.0: Initial
 */
```

#### Rule 4: Version History Consolidation (v1.3 Change)
When a major version milestone is reached (e.g., v4.0), consolidate all minor versions of the previous major version into a single summary entry to maintain readability.

*Example:*
```html
<!--
Version History:
v3.x: CLI evolution (v3.0-v3.17)
      - Multi-provider support, gap analysis, blocking logic
      - Post-pipeline menu, CORS handling
v4.0: MODULAR ARCHITECTURE - Complete Refactor
      - Created modular structure with 8 separate modules
      - Reduced main file size by 77%
-->
```

This keeps version history clean and focused on major milestones while preserving the context of incremental improvements.

### Step 5: Test-First Validation (v1.2 Change)
For changes involving logic, algorithms, scoring thresholds, or visual UI elements:
1. **Implement Code First:** Apply the changes to the application code (e.g., `index.html`, `src/`).
2. **User Verification:** The user must verify the functionality in the Preview environment (e.g., "Test High Match", "Test Low Match").
3. **Doc Update:** ONLY after the implementation is proven to work, proceed to update the authoritative documentation to match the reality of the code.

### Step 5.5: Branch Prompt Testing (v1.5 Change) <!-- v1.5 Change -->
**For significant AI prompt changes only** (new features, major rewrites, behavior changes).

#### When to Use Branch Prompts:
- Adding new prompt features (e.g., 5-category action verb system)
- Major restructuring of prompt logic
- Behavioral changes that need validation
- Complex multi-section updates

#### When NOT to Use Branch Prompts:
- Typo fixes or minor clarifications
- Version history updates
- Adding simple examples
- Documentation-only changes

#### Branch Prompt Workflow:

**1. Create Temporary Branch Prompt:**
```bash
# Copy stable prompt to tmp/ directory with new version number
cp docs/prompts/analyzer/Resume_Analyzer_Prompt.md \
   docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
```

**Naming Convention:** `[PromptName]_v[NewVersion].md`
- ✅ `Resume_Analyzer_Prompt_v1.3.md`
- ✅ `System_Prompt_v3.11.md`
- ✅ `JD_Comparative_Prompt_v4.5.md`

**2. Add Testing Header:**
Add this at the top of the tmp prompt:
```markdown
# [Prompt Name] v[NewVersion] [TESTING]

⚠️ **TESTING VERSION - NOT FOR PRODUCTION**
- Status: Under development and testing
- Branch: [branch-name]
- Baseline: [OriginalPrompt].md v[OldVersion]
- Changes: [Brief description]
- Test Plan: /docs/plans/[implementation_plan].md

---
```

**3. Implement Changes:**
- Make all changes in the tmp version only
- Add inline comments for all changes
- Update version history in tmp file
- DO NOT modify the stable prompt yet

**4. Test Thoroughly:**
- Run all test cases from implementation plan
- Validate against expected behavior
- Document results
- Iterate and refine as needed

**5. Merge to Main Prompt:**
```bash
# After validation, copy tmp version to stable location
cp docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md \
   docs/prompts/analyzer/Resume_Analyzer_Prompt.md
```

**6. Clean Up (CRITICAL):**
```bash
# IMMEDIATELY delete the tmp file after merge
rm docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md

# Verify cleanup
ls docs/prompts/tmp/*.md  # Should show: No such file or directory
```

**7. Update Stable Prompt:**
- Remove `[TESTING]` header
- Update version to final (e.g., v1.3)
- Ensure all inline comments are present
- Commit with "tested and validated" note

#### Important Rules:

**⚠️ CRITICAL - Always Clean Up:**
- tmp/ files are gitignored - they will NOT be committed
- ALWAYS delete tmp files after merging to stable
- NEVER leave orphaned files in docs/prompts/tmp/
- Verify cleanup before merging your feature branch

**Pre-Merge Checklist:**
Before merging your feature branch to main:
```bash
# Check for orphaned tmp files
ls docs/prompts/tmp/*.md

# Expected output: "No such file or directory"
# If files exist: You forgot to clean up! Delete them.
```

### Step 6: Roadmap Synchronization
Always check `docs/ROADMAP.md`.
1.  Update the "Reference Documentation" table with the new version numbers.
2.  Mark relevant tasks as `[x]` Completed.
3.  Add a version history entry for the Roadmap itself.