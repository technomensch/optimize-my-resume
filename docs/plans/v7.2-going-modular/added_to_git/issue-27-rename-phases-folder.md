# Issue #27: Rename "phases" folder to avoid naming collision

**Status:** 🔴 ACTIVE  
**Type:** Refactor  
**Priority:** High  
**Created:** 2026-01-11  
**Last Updated:** 2026-01-11  
**Affected Files:** 
- /phases/ directory (entire directory)
- References in PROJECT-INSTRUCTIONS.md

**Labels:** `architecture` `refactor` `high-priority`

---

## Problem Description

The current `/phases/` directory name creates a naming collision with the new modular architecture. The modularization plan includes creating files named:
- `phase1-display-rules.md`
- `phase3-fit-assessment.md`

This creates confusion between:
- `/phases/` (existing workflow directory)
- `phase1-*.md`, `phase3-*.md` (new module files)

**Symptoms:**
- Unclear naming: "phases" could refer to the directory OR the module files
- Potential file organization confusion
- Harder to reference in documentation ("phases" is ambiguous)

---

## Current Behavior

**Current directory structure:**
```
/phases/
├── phase-1/
│   ├── job-history-v2-creation.md
│   ├── jd-parsing-17-point.md
│   └── entry-router.md
├── phase-2/
│   └── evidence-matching.md
├── phase-3/
│   ├── workflow-router.md
│   ├── incremental-updates.md
│   └── re-comparison.md
└── phase-4/
    └── summary-generation.md
```

**Problem:** New files like `phase1-display-rules.md` would exist alongside `/phases/phase-1/`, causing confusion.

---

## Expected Behavior

**Desired directory structure:**
```
/workflow-phases/
├── phase-1/
│   ├── job-history-v2-creation.md
│   ├── jd-parsing-17-point.md
│   └── entry-router.md
├── phase-2/
│   └── evidence-matching.md
├── phase-3/
│   ├── workflow-router.md
│   ├── incremental-updates.md
│   └── re-comparison.md
└── phase-4/
    └── summary-generation.md

/phase1-display-rules.md (new modular file - no collision)
/phase3-fit-assessment.md (new modular file - no collision)
```

**OR alternative:**
```
/phase-workflows/
├── phase-1/
...
```

**Benefit:** Clear separation between workflow documentation and module files.

---

## Impact Assessment

**Who is affected:**
- [x] All users (references in PROJECT-INSTRUCTIONS)
- [x] Future developers (navigation clarity)

**Severity:**
- **High:** Must be resolved before creating new module files
- Blocking issue for Issues #28-31

**Workaround Available:**
- [ ] No - This must be fixed to proceed with modularization

---

## Root Cause Analysis

**Initial Hypothesis:**
The `/phases/` directory was created before the modularization plan. The name made sense then (it contains phase-by-phase workflow documentation), but now creates collision with new "phaseN-*.md" module naming convention.

**Investigation Steps:**
1. Check all references to `/phases/` in PROJECT-INSTRUCTIONS.md
2. Verify no other code/scripts reference this directory
3. Confirm rename won't break existing functionality

**Confirmed Root Cause:**
Directory named before modular architecture was planned. Simple naming collision.

---

## Proposed Solutions

### Option 1: Rename to `/workflow-phases/`
**Description:** Rename `/phases/` → `/workflow-phases/`

**Time Estimate:** 30 minutes

**Success Probability:** 95%

**Pros:**
- Clear distinction: "workflow-phases" (directory) vs "phase1-*.md" (modules)
- Maintains semantic meaning (workflow documentation by phase)
- Minimal confusion

**Cons:**
- Longer name (but more descriptive)

**Implementation:**
```bash
# Rename directory
mv /phases /workflow-phases

# Update references in PROJECT-INSTRUCTIONS.md
sed -i 's|/phases/|/workflow-phases/|g' PROJECT-INSTRUCTIONS.md
sed -i 's|phases/|workflow-phases/|g' PROJECT-INSTRUCTIONS.md
```

---

### Option 2: Rename to `/phase-workflows/`
**Description:** Rename `/phases/` → `/phase-workflows/`

**Time Estimate:** 30 minutes

**Success Probability:** 95%

**Pros:**
- Emphasizes "workflows" aspect
- Clear distinction from "phase1-*.md" files
- Descriptive name

**Cons:**
- Slightly less intuitive than "workflow-phases"

**Implementation:**
```bash
# Rename directory
mv /phases /phase-workflows

# Update references
sed -i 's|/phases/|/phase-workflows/|g' PROJECT-INSTRUCTIONS.md
sed -i 's|phases/|phase-workflows/|g' PROJECT-INSTRUCTIONS.md
```

---

### Option 3: Rename module files instead
**Description:** Use different naming for module files: `display-rules-phase1.md`, `fit-assessment-phase3.md`

**Time Estimate:** 5 minutes (just planning, no actual rename needed yet)

**Success Probability:** 80%

**Pros:**
- No need to rename existing directory
- Avoids refactoring existing references

**Cons:**
- Less intuitive naming (phase number at end, not beginning)
- Goes against common convention (phase1-*, phase2-* is more standard)
- Doesn't solve the semantic collision

**Implementation:**
```
/phases/ (unchanged)
/display-rules-phase1.md (new)
/fit-assessment-phase3.md (new)
```

---

**Recommended:** Option 1 (`/workflow-phases/`)

**Reasoning:**
1. Most descriptive name that clarifies purpose
2. Follows common convention (noun first: "workflow")
3. Clear distinction from module files
4. Easy to implement (simple rename + reference update)

---

## Testing Strategy

**Test Cases:**
1. Verify all references updated in PROJECT-INSTRUCTIONS.md
2. Verify Claude can find files in new location
3. Test Phase 1, 2, 3, 4 workflow references still work
4. Verify no broken links in documentation

**Regression Tests:**
- [ ] Phase 1 job history creation still loads correctly
- [ ] Phase 2 evidence matching still loads correctly
- [ ] Phase 3 workflow router still loads correctly
- [ ] Phase 4 summary generation still loads correctly

**Success Criteria:**
- [ ] Directory renamed
- [ ] All references updated
- [ ] No broken links
- [ ] All workflows still functional

---

## Related Issues

**Blocks:**
- Issue #28 - Extract phase1-display-rules.md (can't create until this is resolved)
- Issue #29 - Extract phase3-fit-assessment.md (can't create until this is resolved)
- Issue #30 - Extract quality-gates-guardrails.md
- Issue #31 - Extract job-history-template-system.md

**Related:**
- v7.1 Modularization Project (master tracker)

---

## Progress Log

### 2026-01-11 - Initial Discovery
- Identified naming collision during modularization planning
- Created Issue #27
- Proposed 3 solutions
- Recommended: Option 1 (/workflow-phases/)

---

## Resolution

**Date Resolved:** [Pending]  
**Solution Implemented:** [Pending]  
**Files Changed:** [Pending]

**Commit:** [Pending]  
**Branch:** [Pending]  
**Merged To:** [Pending]

**Verification:**
- [Pending]

---

**Created:** 2026-01-11  
**Last Updated:** 2026-01-11  
**Version:** 1.0
