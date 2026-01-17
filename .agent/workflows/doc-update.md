---
description: Standard operating procedure for updating project documentation
---
# doc-update

This skill defines the standard operating procedure for updating project documentation to ensure consistency, version tracking, and accurate reference for future development. Use this prompt whenever code, logic, or UI changes are made that affect the system's behavior.

---

## TRIGGER
**"Run Doc Update Protocol"** or **"Update Documentation"**

---

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
> "Should the update for [Doc Name] be a **PATCH** (X.Y.Z → X.Y.Z+1), **MINOR** (X.Y.Z → X.Y+1.0), or **MAJOR** (X.Y.Z → X+1.0.0) version bump?"

**Semantic Versioning Guide:**
- **PATCH (Z)**: Bug fixes, typos, clarifications (backward-compatible)
- **MINOR (Y)**: New features, new functionality (backward-compatible)
- **MAJOR (X)**: Breaking changes, incompatible API changes

### Step 4: Apply Updates
Once confirmed, apply the updates to the files adhering to these strict formatting rules:

#### Rule 1: Version History
At the top of the document, add a new entry to the `## Version History` section:
- `v[NewVersion]: [Brief description of what changed]`

#### Rule 2: Inline Comments
At the specific location in the document where the text was modified, added, or removed, insert a comment explicitly stating the version and change.

#### Rule 3: Code File Version Headers
For every code file (html, ts, tsx, css, json) updated, a comment block must be added or updated at the very top of the file tracking the change history.

#### Rule 4: Version History Consolidation
When a major version milestone is reached (e.g., v4.0), consolidate all minor versions of the previous major version into a single summary entry.

### Step 5: Test-First Validation
For changes involving logic, algorithms, scoring thresholds, or visual UI elements:
1. **Implement Code First:** Apply the changes to the application code.
2. **User Verification:** The user must verify the functionality in the Preview environment.
3. **Doc Update:** ONLY after the implementation is proven to work, proceed to update the authoritative documentation.

### Step 5.5: Branch Prompt Testing
**For significant AI prompt changes only** (new features, major rewrites, behavior changes).

**Workflow:**
1. **Create Temporary Branch Prompt:** Copy stable prompt to `docs/prompts/tmp/` with header `[Prompt Name] v[NewVersion] [TESTING]`.
2. **Implement Changes:** In the tmp file only.
3. **Test Thoroughly:** Validate against expected behavior.
4. **Merge to Main Prompt:** Copy tmp to stable location.
5. **Clean Up (CRITICAL):** Delete the tmp file immediately.

### Step 6: Roadmap Synchronization
Always check `docs/ROADMAP.md`.
1.  Update the "Reference Documentation" table with the new version numbers.
2.  Mark relevant tasks as `[x]` Completed.
3.  Add a version history entry for the Roadmap itself.
