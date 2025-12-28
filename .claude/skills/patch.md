# Create Patch and Make Changes

**Purpose:** Start a structured patch workflow for any changes on unreleased branches (bugfixes, improvements, optimizations, etc.) that enforces analysis → planning → implementation.

---

## Trigger

Type `/patch` when you need to make patch-level changes before merging to main

---

## Execution

Follow the Patch Workflow defined in:
`docs/workflows/Patch_Workflow.md`

### Phases (In Order)

1. **Analysis** - Understand the change needed
2. **Planning** - Create plan document BEFORE implementing
3. **Implementation** - Make changes according to plan
4. **Testing** - Verify changes work
5. **Documentation** - Update all docs

### Automatic Actions

**When user types `/patch`:**

1. Ask for change type:
   - [ ] Bugfix
   - [ ] Improvement/Enhancement
   - [ ] Optimization
   - [ ] Refactoring
   - [ ] Documentation
   - [ ] Other (specify)

2. Ask for change description
3. Determine patch version (v[X.Y.Z+1])
4. Create patch branch: `v[X.Y.Z+1]-[patch-name]`
5. Guide through analysis
6. **REQUIRE** plan document creation before implementing
7. Guide through implementation
8. Guide through testing
9. Guide through documentation

### Critical Rule

**NEVER implement changes before creating the plan document.**

The plan must be in:
`docs/plans/v[X.Y.Z+1]_[patch-name]_plan.md`

And must be approved by user before implementation begins.

---

**Created:** 2025-12-10
**Updated:** 2025-12-11 (v1.1 - Renamed from /troubleshoot to /patch, expanded scope)
**Version:** 1.1
**Related:** `docs/workflows/Patch_Workflow.md`
