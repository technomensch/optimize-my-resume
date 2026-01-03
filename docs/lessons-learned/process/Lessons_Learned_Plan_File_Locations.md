# Lessons Learned: Plan File Locations

**Date:** 2025-12-10
**Context:** v4.6-export-feature planning session
**Problem Solved:** Branch-specific feature plans were being created in temporary `.claude/plans/` directory instead of tracked `docs/plans/` directory

---

## The Problem We Faced

During the planning session for the v4.6 export/download feature, Claude Code's Plan Mode automatically created the implementation plan at:

```
.claude/plans/stateless-coalescing-corbato.md
```

This file location presented several issues:

**Issues Discovered:**
- ❌ `.claude/plans/` is gitignored - plans wouldn't be tracked in version control
- ❌ Plan would be lost after the session or if `.claude` directory was cleaned
- ❌ No project documentation trail for implementation decisions
- ❌ ROADMAP couldn't reference the plan (external to git)
- ❌ Future developers couldn't see the implementation rationale
- ❌ Plan wouldn't be preserved for post-implementation reference

**Impact:**
- Implementation plans for versioned features were being treated as temporary session artifacts
- Loss of valuable implementation context and decision-making rationale
- Broken documentation workflow (ROADMAP → Implementation Plan → Code)

**Why This Matters:**
Implementation plans are a critical part of project documentation. They capture:
- **Design decisions** and trade-offs considered
- **Implementation approach** and step-by-step guides
- **Technical considerations** for future reference
- **Success criteria** for validation
- **Risk assessment** and mitigation strategies

Losing these plans after implementation means losing the "why" behind the "what."

---

## What We Learned: Location Matters Based on Plan Type

### The Core Insight

**Not all plans are created equal.** There are two fundamentally different types of plans:

**1. Feature Branch Plans** (Permanent Documentation)
- Plans for versioned features that will be implemented in branches
- Need to be tracked in git for project documentation
- Referenced in ROADMAP.md and CHANGELOG.md
- Preserved permanently as implementation reference

**2. Ad Hoc/Exploratory Plans** (Temporary Session Artifacts)
- Quick investigations, bug analysis, or exploratory work
- Session-specific, not part of long-term documentation
- Can be safely gitignored and cleaned up after session
- Don't need project-wide visibility

**The Solution:**
Create a clear **decision tree** based on plan purpose:
- Branch-specific feature → `docs/plans/v[X.Y]_[feature]_plan.md` (tracked)
- Ad hoc exploration → `.claude/plans/[auto-name].md` (gitignored)

---

## The Solution: Plan Mode Workflow SOP

We implemented a two-layer solution:

### Layer 1: Documentation - Plan Mode Workflow SOP

Created `docs/workflows/Plan_Mode_Workflow.md` defining:

**Plan File Location Standards:**
```
Decision Tree:

Is this plan for a feature branch implementation?
├─ YES → docs/plans/v[X.Y]_[feature-name]_plan.md
│         Examples:
│         - docs/plans/v4.6_export_feature_plan.md
│         - docs/plans/v4.5_action_verb_categorization_plan.md
│
└─ NO → .claude/plans/[auto-generated-name].md
          Examples:
          - .claude/plans/debugging-performance.md
          - .claude/plans/investigation-2024-12-10.md
```

**Naming Convention:**
- Format: `v[X.Y]_[feature-name]_plan.md`
- Use underscores for spaces
- Include version number matching the branch
- Keep concise but descriptive

### Layer 2: Process - Copy Plan Before Exiting Plan Mode

**Workflow for Branch-Specific Plans:**

```bash
# Step 1: Plan Mode creates plan in .claude/plans/
# (automatic by Claude Code)

# Step 2: Before exiting plan mode, copy to proper location
cp .claude/plans/[auto-name].md docs/plans/v[X.Y]_[feature-name]_plan.md

# Step 3: Exit plan mode
# Plan is now tracked in git

# Step 4: Reference in implementation
git commit -m "feat(v4.6): implement export feature
...
Ref: docs/plans/v4.6_export_feature_plan.md"
```

### Layer 3: Integration with Documentation Workflow

Updated documentation to enforce this standard:

1. **Plan Mode Workflow** - Primary SOP document
2. **Documentation Update Workflow** - References plan location standards
3. **/lesson-learned command** - Creates lessons learned in `docs/lessons-learned/`
4. **ROADMAP.md** - Links to implementation plans in `docs/plans/`

---

## Implementation Results

### Problems Fixed

Before:
- ❌ Feature plans lost in gitignored `.claude/plans/`
- ❌ No standard for where to save plans
- ❌ ROADMAP couldn't link to plans
- ❌ Implementation rationale not preserved

After:
- ✅ Feature plans tracked in `docs/plans/` with clear naming convention
- ✅ Decision tree defines where each plan type goes
- ✅ ROADMAP can link to permanent plan files
- ✅ Implementation context preserved for future reference
- ✅ Workflow documented in `docs/workflows/Plan_Mode_Workflow.md`

### Metrics of Success

**Documentation Created:**
- `docs/workflows/Plan_Mode_Workflow.md` (500+ lines)
- `docs/workflows/Documentation_Update_Workflow.md` (400+ lines)
- `docs/lessons-learned/Lessons_Learned_Plan_File_Locations.md` (this doc)

**Folder Structure Improved:**
```
docs/
├── workflows/              # NEW: Process documentation
│   ├── Plan_Mode_Workflow.md
│   └── Documentation_Update_Workflow.md
├── lessons-learned/        # NEW: Problem/solution retrospectives
│   ├── Lessons_Learned_Plan_File_Locations.md
│   ├── Lessons_Learned_Split_Changelog_Versioning.md
│   ├── Lessons_Learned_Automated_Validation.md
│   └── Lessons_Learned_Branch_Prompt_Workflow.md
├── plans/                  # Implementation plans (tracked)
│   └── v4.6_export_feature_plan.md
└── .claude/plans/          # Ad hoc plans (gitignored)
```

---

## Root Cause Analysis

### Why Did This Issue Happen?

**1. Default Behavior of EnterPlanMode Tool**
- **Problem:** Claude Code's EnterPlanMode tool automatically creates plans in `.claude/plans/` with auto-generated names
- **Why it happened:** Default location is session-specific, designed for temporary planning
- **Design rationale:** Reasonable default for ad hoc exploration, but doesn't distinguish feature plans

**2. No Documented Standard for Plan Organization**
- **Problem:** Project had no SOP for where different types of plans should be saved
- **Why it happened:** Documentation gap - workflow wasn't defined yet
- **Impact:** Both AI and human developers didn't know the proper location

**3. Lack of Plan Type Distinction**
- **Problem:** All plans treated equally regardless of purpose
- **Why it happened:** No decision tree or classification system existed
- **Result:** Important feature plans handled like temporary investigation notes

### How Plan Mode Workflow SOP Prevents Each Issue

**Issue 1: Default .claude/plans/ location**
- **Solution:** Documented workflow requires copying feature plans to `docs/plans/` before exiting plan mode
- **Result:** Feature plans preserved in git, ad hoc plans stay temporary

**Issue 2: No standard**
- **Solution:** Created comprehensive `Plan_Mode_Workflow.md` with decision tree and naming conventions
- **Result:** Clear guidance for every planning scenario

**Issue 3: No type distinction**
- **Solution:** Explicit classification (Feature vs Ad Hoc) with different handling
- **Result:** Right plan type goes to right location automatically

---

## Replication Pattern for Any Project

### Generic Plan Organization Structure

This pattern works for **any software project** using Claude Code or similar AI-assisted development tools:

```
project/
├── docs/
│   ├── workflows/              # HOW: Process documentation
│   │   ├── Plan_Mode_Workflow.md
│   │   └── Documentation_Update_Workflow.md
│   │
│   ├── plans/                  # WHAT: Implementation plans (tracked)
│   │   ├── v1.0_feature_a_plan.md
│   │   ├── v1.1_feature_b_plan.md
│   │   └── v2.0_major_refactor_plan.md
│   │
│   └── lessons-learned/        # WHY: Problem/solution retrospectives
│       └── Lessons_Learned_*.md
│
└── .claude/plans/              # Temporary ad hoc plans (gitignored)
    └── [auto-generated].md
```

### Key Design Decisions

**Decision 1: Separate Workflows from Guides**
- **Rationale:** Workflows are process documentation (HOW), guides are educational (WHY + WHAT)
- **Benefit:** Easier to find the right documentation type
- **Application:** Created `docs/workflows/` for step-by-step processes

**Decision 2: Lessons Learned in Own Folder**
- **Rationale:** Retrospectives are distinct from tutorials/guides
- **Benefit:** Clear separation of problem/solution documentation
- **Application:** Created `docs/lessons-learned/` for pattern documentation

**Decision 3: Version-Prefixed Plan Filenames**
- **Rationale:** Plans should be immediately identifiable by version
- **Benefit:** Easy to match plans to branches/releases
- **Application:** Naming convention `v[X.Y]_[feature]_plan.md`

**Decision 4: Git-Track Feature Plans, Ignore Ad Hoc**
- **Rationale:** Different retention needs for different plan types
- **Benefit:** Permanent documentation for important work, no clutter from investigations
- **Application:** `.claude/plans/` in `.gitignore`, `docs/plans/` tracked

---

## How to Implement in Your Project

### Step 1: Create Folder Structure

```bash
mkdir -p docs/workflows
mkdir -p docs/plans
mkdir -p docs/lessons-learned
mkdir -p .claude/plans
```

### Step 2: Update .gitignore

```gitignore
# Temporary Claude Code plans
.claude/plans/*.md
!.claude/plans/README.md
```

### Step 3: Create Plan Mode Workflow Document

Copy the template from this project:
- Source: `docs/workflows/Plan_Mode_Workflow.md`
- Customize decision tree for your project's versioning scheme
- Add your project-specific naming conventions

### Step 4: Create README Files for Navigation

`docs/plans/README.md`:
```markdown
# Implementation Plans

This folder contains implementation plans for versioned features.

## Naming Convention
`v[X.Y]_[feature-name]_plan.md`

## Active Plans
- [v1.0_authentication_plan.md](v1.0_authentication_plan.md)

## Completed Plans
- [v0.9_initial_setup_plan.md](v0.9_initial_setup_plan.md) ✅
```

`.claude/plans/README.md`:
```markdown
# Temporary Ad Hoc Plans

This folder contains temporary planning files created during Claude Code sessions.

**These files are gitignored** - they are session-specific and not part of project documentation.

For feature branch plans, see `/docs/plans/` instead.
```

### Step 5: Train Your Team

Document the workflow in your onboarding guide:
1. When to use each plan location
2. Naming conventions
3. How to reference plans in commits/ROADMAP

### Step 6: Enforce in Code Review

Add to your PR checklist:
```markdown
- [ ] If this PR implements a feature plan, is the plan file in `docs/plans/`?
- [ ] Does the commit message reference the plan (Ref: docs/plans/...)?
- [ ] Is the ROADMAP updated to link to the plan?
```

---

## Lessons for Future Features

### **Lesson 1: Distinguish Permanent from Temporary**

**Pattern:** Not all artifacts should be treated equally - classify based on retention needs

**Application in This Case:**
- Feature plans = Permanent (tracked in git)
- Ad hoc investigations = Temporary (gitignored)
- Decision tree makes classification explicit

**Result:** Right artifacts in right places automatically

**Future Application:**
- Apply same logic to other documentation types
- Build artifacts (dist/ vs src/)
- Test data (fixtures vs generated)
- Configuration (templates vs instances)

### **Lesson 2: Location Encodes Intent**

**Pattern:** Where a file lives should signal its purpose and lifecycle

**Application in This Case:**
- `docs/plans/` = "This is permanent feature documentation"
- `.claude/plans/` = "This is temporary session artifact"
- File location itself is documentation

**Result:** Developers know intent without reading content

**Future Application:**
- Use folder structure to enforce policies
- Make .gitignore align with folder purposes
- Tool defaults should match most common use case

### **Lesson 3: Process Documentation Prevents Errors**

**Pattern:** If you discover a mistake, create a process to prevent it

**Application in This Case:**
- Discovered: Plans in wrong location
- Created: Plan Mode Workflow SOP
- Result: Future plans will go to correct location

**Result:** Problem becomes lesson, lesson becomes prevention

**Future Application:**
- Every "lessons learned" should generate a workflow update
- Workflows should reference lessons learned for context
- Create feedback loop: problem → lesson → process → prevention

### **Lesson 4: Decision Trees Scale Knowledge**

**Pattern:** Complex decisions become simple with clear decision trees

**Application in This Case:**
```
Is this plan for a feature branch?
├─ YES → docs/plans/
└─ NO → .claude/plans/
```

**Result:** One question determines correct action

**Future Application:**
- Create decision trees for other ambiguous situations
- Version numbering (major vs minor)
- When to create new documentation vs update existing
- When to branch vs work on main

### **Lesson 5: Naming Conventions Enable Discovery**

**Pattern:** Consistent naming makes files easy to find and understand

**Application in This Case:**
- Format: `v[X.Y]_[feature]_plan.md`
- Version prefix enables sorting by version
- Feature name enables search by topic
- `.md` extension signals Markdown documentation

**Result:** Files self-document their purpose and version

**Future Application:**
- Apply versioning to all key documents
- Use prefixes to group related files
- Make filenames grep-friendly

---

## Common Pitfalls to Avoid

### Pitfall 1: Forgetting to Copy Before Exiting Plan Mode

**Problem:** Finish planning session, exit plan mode, realize plan is still in `.claude/plans/`

**Solution:**
- Make copying the plan the **last step** before calling ExitPlanMode
- Add to pre-exit checklist in Plan Mode Workflow
- Consider creating a bash alias: `save-plan v4.6 export-feature`

**Prevention:**
```bash
# Add to your shell aliases
alias save-plan='function _save_plan() {
  cp .claude/plans/*.md docs/plans/v$1_$2_plan.md &&
  echo "✅ Plan saved to docs/plans/v$1_$2_plan.md"
}; _save_plan'

# Usage: save-plan 4.6 export-feature
```

### Pitfall 2: Inconsistent Naming

**Problem:** Plans named `v4.6-export.md`, `export_plan_v4.6.md`, `Export Feature Plan.md`

**Solution:**
- **Always** follow the convention: `v[X.Y]_[feature]_plan.md`
- Use underscores (not hyphens or spaces)
- Use lowercase for feature name
- Version first, then feature name

**Good:**
- ✅ `v4.6_export_feature_plan.md`
- ✅ `v5.0_authentication_system_plan.md`

**Bad:**
- ❌ `export-plan-v4.6.md` (version at end)
- ❌ `v4.6-Export-Feature.md` (hyphens, capitals)
- ❌ `Export Feature Plan v4.6.md` (spaces, no underscores)

### Pitfall 3: Putting Ad Hoc Plans in docs/plans/

**Problem:** Investigation notes or bug analysis cluttering permanent documentation

**Solution:**
- Ask: "Is this for a versioned feature branch?"
- If NO → Leave in `.claude/plans/`
- If YES → Copy to `docs/plans/`

**Examples of Ad Hoc (Stay in .claude/plans/):**
- "Why is this function slow?"
- "Explore authentication libraries"
- "Debug production issue"
- "Investigate test failures"

**Examples of Feature (Move to docs/plans/):**
- "Implement export/download functionality" → `v4.6_export_feature_plan.md`
- "Add user authentication" → `v5.0_authentication_plan.md`
- "Refactor analysis pipeline" → `v4.7_pipeline_refactor_plan.md`

### Pitfall 4: Not Updating ROADMAP

**Problem:** Plan exists in `docs/plans/` but ROADMAP doesn't link to it

**Solution:**
- Always update ROADMAP when creating a feature plan
- Add plan link to milestone description
- Mark as complete when implementation finishes

**Template:**
```markdown
## v4.6.0 - Export/Download Feature
**Status:** 🚧 In Progress
**Branch:** v4.6-export-feature
**Plan:** [docs/plans/v4.6_export_feature_plan.md](plans/v4.6_export_feature_plan.md)
**Started:** 2025-12-10
```

### Pitfall 5: Deleting Plans After Implementation

**Problem:** "Feature is done, we don't need the plan anymore"

**Solution:** **NEVER** delete implementation plans

**Why Keep Them:**
- Document design decisions for future developers
- Provide context for "why did we do it this way?"
- Reference for similar features in the future
- Part of project history and knowledge base

**When to Consolidate:**
- After major version milestones (v4.x → v5.0)
- Create `v4.x_consolidated_plans.md` summarizing all v4 plans
- Keep individual plans for reference

---

## Questions This Solves for Future Developers

**Q: "Where should I save my implementation plan?"**

A: Use the decision tree:
- Feature branch implementation? → `docs/plans/v[X.Y]_[feature]_plan.md`
- Quick investigation or bug analysis? → `.claude/plans/[auto-name].md`

**Q: "What should I name the plan file?"**

A: Follow the convention: `v[X.Y]_[feature-name]_plan.md`
- Version first (matches branch version)
- Underscores between words
- Lowercase feature name
- Always ends in `_plan.md`

**Q: "Should I commit .claude/plans/ files?"**

A: **No** - `.claude/plans/` is gitignored for a reason. Those are temporary session artifacts.
Only commit files in `docs/plans/` for permanent feature documentation.

**Q: "When should I create a new plan vs update an existing one?"**

A: Create new plan for:
- New version (v4.6 → v4.7)
- Different feature/scope
- Major changes to approach

Update existing plan for:
- Minor refinements during same version
- Clarifications before implementation
- Test results during validation

**Q: "How do I reference the plan in my commit messages?"**

A: Add reference at the end:
```
feat(v4.6): implement export functionality

- Added PDF export
- Created export.js module

Ref: docs/plans/v4.6_export_feature_plan.md
```

**Q: "What if I forgot to copy the plan before exiting plan mode?"**

A: Check if the file still exists in `.claude/plans/`:
```bash
ls .claude/plans/*.md
# If found, copy it:
cp .claude/plans/[name].md docs/plans/v[X.Y]_[feature]_plan.md
```

If lost, you'll need to recreate it from:
- Commit messages
- Code implementation
- Memory/notes from session

**Prevention:** Always copy **before** exiting plan mode.

---

## Conclusion

**What we built:**
- Two-tier plan organization system (permanent vs temporary)
- Decision tree for plan location determination
- Naming convention for feature plans
- Workflow documentation for plan mode usage
- Integration with documentation update process

**Why it matters:**
Implementation plans are valuable project artifacts that capture design decisions, trade-offs, and rationale. By ensuring they're properly located and preserved, we maintain project knowledge that would otherwise be lost.

**How it's retained:**
- **Documentation:** `docs/workflows/Plan_Mode_Workflow.md` defines the standard
- **Process:** Copy step integrated into plan mode workflow
- **Enforcement:** Pre-merge checklist includes plan location verification
- **Tools:** Version consistency script can be extended to check plan references

**How to replicate:**
1. Create folder structure (`docs/workflows/`, `docs/plans/`, `docs/lessons-learned/`)
2. Define decision tree (feature vs ad hoc)
3. Establish naming convention
4. Document in workflow SOP
5. Add to code review checklist
6. Train team on the pattern

---

**Key Takeaway:**
*Plan location is not just organization—it's preservation. Feature plans belong in version control where they can serve future developers, not in temporary session directories where they'll be lost.*

---

**Created:** 2025-12-10
**Version:** 1.0

**Related Docs:**
- `docs/workflows/Plan_Mode_Workflow.md` - Complete plan mode workflow
- `docs/workflows/Documentation_Update_Workflow.md` - Documentation update process
- `docs/ROADMAP.md` - Links to all implementation plans
- `.claude/commands/lesson-learned.md` - Lessons learned creation command

**Related Issues Solved:**
- Plan file location confusion
- Missing implementation documentation
- No standard for plan organization
- ROADMAP unable to link to plans
