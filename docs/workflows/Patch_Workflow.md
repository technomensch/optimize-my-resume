# Patch Workflow - Standard Operating Procedure

## Version History
- v1.1: Scope expansion - Renamed from Bugfix Workflow, expanded to all patch-level changes (2025-12-11)
- v1.0: Initial creation - Standardized bugfix process (2025-12-10)

---

## Purpose

This workflow defines the standard process for analyzing, planning, implementing, and documenting patch-level changes in a systematic way that prevents jumping to solutions before understanding the problem.

**Scope:** Bugfixes, improvements, optimizations, refactoring, and documentation changes that increment the patch version (x.y.Z).

**Key Principle:** **Analyze → Plan → Implement → Test → Document**

Never skip the planning phase, even for "simple" changes.

---

## When to Use This Workflow

Use this workflow whenever you need to make **patch-level changes** on unreleased branches:

**Bugfixes:**
- ✅ Discover a bug in existing functionality
- ✅ Receive a bug report from users
- ✅ Find unexpected behavior during testing
- ✅ Need to fix a regression from recent changes

**Improvements/Enhancements:**
- ✅ Small feature enhancements that don't change the API
- ✅ UX improvements to existing features
- ✅ Error message improvements

**Optimizations:**
- ✅ Performance improvements
- ✅ Code efficiency enhancements
- ✅ Memory usage optimizations

**Refactoring:**
- ✅ Code cleanup without behavior changes
- ✅ Internal restructuring
- ✅ Technical debt reduction

**Documentation:**
- ✅ Documentation fixes or improvements
- ✅ Comment updates
- ✅ README enhancements

---

## Quick Start

### In Claude Code CLI:
```bash
/patch
```

This loads the patch workflow protocol and guides you through the process.

---

## The 5-Phase Process

### Phase 1: Analysis (Required)

**Goal:** Understand the change needed before proposing solutions

**Steps:**
1. **Identify the Change Needed**
   - For bugs: Reproduce and confirm the issue
   - For improvements: Define the enhancement scope
   - For optimizations: Measure current performance
   - For refactoring: Identify code smell or technical debt
   - Note expected vs actual behavior

2. **Analyze the Code**
   - Find the relevant code sections
   - Trace the execution flow
   - Identify what needs to change

3. **Determine Root Cause or Opportunity**
   - For bugs: Why does the issue occur?
   - For improvements: What's the gap or limitation?
   - For optimizations: Where is the bottleneck?
   - For refactoring: What pattern should be improved?

4. **Document Findings**
   - Write down what you discovered
   - Include code references (file:line)
   - Note any related issues or dependencies

**Output:** Clear understanding of what needs to change and why

**Don't move to Phase 2 until:** You can explain WHY the change is needed, not just WHAT should change

---

### Phase 2: Planning (Required)

**Goal:** Design the implementation before making changes

**Steps:**
1. **Create Branch Plan Document**
   - Location: `docs/plans/v[X.Y.Z]-[patch-name].md` (Automatically created)
   - Follow naming convention: patch version (x.y.Z)
   - Examples:
     - `docs/plans/v4.6.1-export-bugfix.md`
     - `docs/plans/v4.6.2-pdf-optimization.md`
     - `docs/plans/v4.6.3-refactor-state.md`

2. **Analyze Solution Approaches**
   - List multiple possible approaches
   - Compare pros/cons of each
   - Choose the best approach

3. **Document the Plan**
   - What files need to change?
   - What functions need modification?
   - What edge cases to consider?
   - How to test the changes?

4. **Identify Risks**
   - Could the changes break something else?
   - Are there backwards compatibility concerns?
   - Do we need to update documentation?

**Output:** Automatic creation of plan document in `docs/plans/v[Major.Minor.Patch]-[name].md`

**Don't move to Phase 3 until:** Plan is documented and approved

---

### Phase 3: Implementation (After Planning)

**Goal:** Implement the changes according to the plan

**Steps:**
1. **Create Patch Branch**
   ```bash
   git checkout -b v[X.Y.Z]-[patch-name]
   ```

2. **Implement Changes**
   - Follow the plan document
   - Make minimal changes (only what's needed)
   - Stay focused on the planned scope

3. **Update Version Numbers**
   - Increment patch version (x.y.Z)
   - Update version comments in modified files
   - Update metadata (if applicable)

4. **Add Inline Comments**
   - Mark changes with version and type:
     - `// v[X.Y.Z] Fix: description` (for bugfixes)
     - `// v[X.Y.Z] Improvement: description` (for enhancements)
     - `// v[X.Y.Z] Optimization: description` (for performance)
     - `// v[X.Y.Z] Refactor: description` (for restructuring)
   - Reference the plan document
   - Explain why the change was made

**Output:** Code changes committed to patch branch

---

### Phase 4: Testing (Before Merging)

**Goal:** Verify the changes work as expected and don't break anything else

**Steps:**
1. **Test the Primary Change**
   - For bugs: Confirm the issue is fixed
   - For improvements: Verify the enhancement works
   - For optimizations: Measure performance gains
   - For refactoring: Confirm behavior is unchanged
   - Try variations/edge cases

2. **Regression Testing**
   - Test related features
   - Ensure nothing else broke
   - Check both happy path and error cases

3. **Document Test Results**
   - Add to plan document or commit message
   - Note what was tested
   - Include test data or measurements if relevant

**Output:** Confirmed changes with test results

---

### Phase 5: Documentation (After Testing)

**Goal:** Update all relevant documentation

**Steps:**
1. **Update CHANGELOG.md**
   ```markdown
   ## [v[X.Y.Z]] - YYYY-MM-DD

   ### Fixed (for bugfixes)
   - [Brief description of bug fix]

   ### Improved (for enhancements)
   - [Brief description of improvement]

   ### Performance (for optimizations)
   - [Brief description of optimization]

   ### Technical (for refactoring)
   - [Brief description of refactoring]
   ```

2. **Update Version History**
   - Modified files get version history entries
   - Include file:line references
   - Mark with appropriate version comments

3. **Update README (if needed)**
   - Increment version number
   - Add to "Recent Changes" if significant

4. **Reference Plan Document**
   - Commit messages reference plan
   - Plan marked as complete in ROADMAP

**Output:** Complete documentation of the changes

---

## Branch Naming Convention

**Format:** `v[X.Y.Z]-[patch-name]`

**Examples:**

**Bugfixes:**
- `v4.6.1-export-bugfix` - Fix export functionality
- `v3.2.1-auth-crash` - Fix authentication crash
- `v5.0.1-memory-leak` - Fix memory leak

**Improvements:**
- `v4.6.2-better-error-messages` - Improve error messaging
- `v3.2.2-ux-enhancement` - Enhance user experience
- `v5.0.2-validation-improvement` - Improve validation

**Optimizations:**
- `v4.6.3-pdf-optimization` - Optimize PDF generation
- `v3.2.3-query-performance` - Improve query performance
- `v5.0.3-bundle-size` - Reduce bundle size

**Refactoring:**
- `v4.6.4-refactor-state` - Refactor state management
- `v3.2.4-cleanup-utils` - Clean up utility functions
- `v5.0.4-modernize-syntax` - Modernize syntax

**Rules:**
- Always use patch version (x.y.Z) for patch-level changes
- Use descriptive but concise name
- Use hyphens, not underscores
- Lowercase only

---

## Plan Document Template

```markdown
# [Change Name] - v[X.Y.Z]

## Change Type
[Bugfix | Improvement | Optimization | Refactoring | Documentation]

## Executive Summary
Brief description of the change and its purpose

## Analysis
### Current State
What exists now and what needs to change

### Root Cause / Opportunity
- For bugs: Why the issue occurs
- For improvements: What gap or limitation exists
- For optimizations: Where the bottleneck is
- For refactoring: What pattern needs improvement

### Impact
Who is affected and how significant

## Solution Approach
### Strategy
What approach was chosen and why

### Alternatives Considered
Other options and why they were not chosen

### Code Changes
Specific files and functions to be modified

## Testing Verification
### Test Plan
How the changes will be tested

### Success Criteria
Expected before/after comparison

## Files Modified
List with line numbers and planned changes

## Risks and Considerations
Potential issues and mitigation strategies

## Lessons Learned (Post-Implementation)
What we learned from this change
```

---

## Decision Tree

```
Patch Change Needed
│
├─ Can you identify what needs to change?
│  ├─ NO → Gather more information
│  └─ YES → Phase 1: Analysis
│             │
│             ├─ Root cause/opportunity identified?
│             │  ├─ NO → Continue analysis
│             │  └─ YES → Phase 2: Plan
│             │           │
│             │           ├─ Plan documented?
│             │           │  ├─ NO → Create plan document
│             │           │  └─ YES → Phase 3: Implementation
│             │                        │
│             │                        ├─ Changes complete?
│             │                        │  ├─ NO → Continue implementation
│             │                        │  └─ YES → Phase 4: Test
│             │                                 │
│             │                                 ├─ Tests pass?
│             │                                 │  ├─ NO → Debug and iterate
│             │                                 │  └─ YES → Phase 5: Document
│             │                                            │
│             │                                            └─ Merge to main
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Jumping to Solution

**Problem:** "I see the issue, let me fix it!" → Implement without planning

**Why Bad:** Might miss root cause, address symptom not problem, break other things

**Solution:** Always complete Phase 1 (Analysis) and Phase 2 (Planning) first

### ❌ Mistake 2: Not Creating Plan Document

**Problem:** "It's a simple change, no need for a plan"

**Why Bad:** No documentation of decision-making, can't reference later

**Solution:** **ALL** patch-level changes get a plan document, even "simple" ones

### ❌ Mistake 3: Combining Multiple Changes in One Branch

**Problem:** "While I'm here, let me make this other change too..."

**Why Bad:** Harder to review, harder to revert, muddles git history

**Solution:** One change, one branch, one plan document

### ❌ Mistake 4: Not Testing Edge Cases

**Problem:** "Tested the main case, that's enough"

**Why Bad:** Issues might occur in variations, regressions might be introduced

**Solution:** Test edge cases, test related features, do regression testing

### ❌ Mistake 5: Skipping Documentation

**Problem:** "Code is self-documenting, no need for comments"

**Why Bad:** Future developers don't know why the change was made

**Solution:** Add inline comments, update version history, document in CHANGELOG

---

## Integration with Other Workflows

### With Plan Mode Workflow

- Plan Mode is for **new features** and **minor version releases**
- Patch Workflow is for **patch-level changes** (bugfixes, improvements, optimizations, refactoring)
- Both create plan documents in `docs/plans/`
- Both follow similar phases (Analysis/Exploration → Planning → Implementation → Testing → Documentation)

**Key Difference:** Patch changes use patch versions (x.y.Z), features use minor versions (x.Y.0)

### With Documentation Update Workflow

- After patch changes are complete and tested
- Run `/doc-update` to update all documentation
- Follow the 7-step documentation process
- Update ROADMAP to mark changes complete

---

## Checklist

**Phase 1: Analysis**
- [ ] Change need identified and understood
- [ ] Root cause/opportunity identified
- [ ] Code sections located
- [ ] Findings documented

**Phase 2: Planning**
- [ ] Branch plan document created (`docs/plans/v[X.Y.Z]_[name]_plan.md`)
- [ ] Solution approaches analyzed
- [ ] Implementation approach chosen and documented
- [ ] Risks identified
- [ ] Plan approved

**Phase 3: Implementation**
- [ ] Patch branch created (`v[X.Y.Z]-[name]`)
- [ ] Changes implemented per plan
- [ ] Version numbers updated
- [ ] Inline comments added (with appropriate change type label)
- [ ] Changes committed

**Phase 4: Testing**
- [ ] Primary change tested and confirmed working
- [ ] Edge cases tested
- [ ] Regression testing completed
- [ ] Test results documented

**Phase 5: Documentation**
- [ ] CHANGELOG.md updated (with appropriate section: Fixed/Improved/Performance/Technical)
- [ ] Version history updated in modified files
- [ ] README updated (if needed)
- [ ] Plan document marked complete
- [ ] Ready to merge

---

## Example: v4.6.1 Export Bugfix (Patch Type: Bugfix)

This example demonstrates the workflow for a **bugfix** type patch change. The same workflow applies to improvements, optimizations, and refactoring.

**Bug Report:** "All the report exports generated was the last 3 recommendations"

**Phase 1: Analysis**
- Reproduced: Markdown/JSON exports only show end of output
- Root cause: Exports read from `state` object, not DOM
- Finding: HTML/PDF work because they clone DOM
- Impact: Major - affects all Markdown/JSON exports

**Phase 2: Planning** (Should have done first!)
- Created: `docs/plans/v4.6.1_export_bugfix_plan.md`
- Approach: Parse from DOM (#history element)
- Alternative considered: Refactor to store everything in state (rejected - too invasive)
- Risk: DOM parsing might be fragile if HTML structure changes

**Phase 3: Implementation**
- Branch: `v4.6.1-export-bugfix`
- File: `js/export.js`
- Changes: Rewrote exportAsMarkdown() and exportAsJSON() to parse DOM
- Version: Updated to 4.6.1
- Comments: Added `// v4.6.1 Fix: Parse from DOM instead of incomplete state object`

**Phase 4: Testing**
- Test: Run standalone analysis, export all formats
- Verify: All sections present in exports
- Confirm: File sizes increased significantly
- Regression: Tested HTML/PDF exports still work

**Phase 5: Documentation**
- Update CHANGELOG.md with v4.6.1 entry under "### Fixed"
- Update version history in export.js
- Reference plan document in commit
- Update README with new version number

---

## Related Documentation

- **Plan Mode Workflow:** `docs/workflows/Plan_Mode_Workflow.md`
- **Documentation Update Workflow:** `docs/workflows/Documentation_Update_Workflow.md`
- **Lessons Learned:** `docs/lessons-learned/`

---

## Quick Reference Commands

```bash
# Start patch workflow
/patch

# Create patch branch
git checkout -b v[X.Y.Z]-[patch-name]

# Check plan location
ls docs/plans/v*.md

# Run documentation update after changes
/doc-update

# Commit patch changes
# Use appropriate prefix: fix/feat/perf/refactor/docs
git commit -m "[type](v[X.Y.Z]): brief description

Detailed explanation of changes

Change type: [Bugfix|Improvement|Optimization|Refactoring]

Ref: docs/plans/v[X.Y.Z]_[name]_plan.md"
```

---

## Changelog

### v1.1 - 2025-12-11
- Renamed from "Bugfix Workflow" to "Patch Workflow"
- Expanded scope to all patch-level changes (bugfixes, improvements, optimizations, refactoring, documentation)
- Renamed Phase 1 from "Investigation" to "Analysis" (more general term)
- Updated all terminology from "bugfix" to "patch" or "patch-level change"
- Added change type examples throughout (bugfix, improvement, optimization, refactoring)
- Enhanced plan document template with change type field
- Updated branch naming examples for all change types
- Updated inline comment formats with change type labels
- Enhanced CHANGELOG.md format with multiple sections
- Updated command reference from `/bugfix` to `/patch`
- Expanded example with more detail

### v1.0 - 2025-12-10
- Initial creation
- Documented 5-phase bugfix process
- Created decision tree and checklists
- Defined plan document template
- Integrated with existing workflows
- Learned from v4.6.1 export bugfix experience

---

**Last Updated:** 2025-12-11
**Status:** Active Workflow
**Related:** `/patch` slash command
