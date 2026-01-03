# Lessons Learned: Patch Workflow and /patch Command

**Date:** 2025-12-10 (Created), 2025-12-11 (Updated for scope expansion)
**Context:** v4.6.1-export-bugfix development
**Problem Solved:** Jumping to implementation before proper analysis and planning during patch-level changes (bugfixes, improvements, optimizations, refactoring)

---

## The Problem We Faced

During the v4.6.1 export bugfix, I (Claude Code) violated the proper workflow by:
1. ❌ Investigating the bug (found DOM vs state issue)
2. ❌ **Immediately implementing the fix** (rewrote export functions)
3. ❌ Creating the plan document **after** implementation
4. ❌ Documenting retrospectively instead of proactively

**User Feedback:**
> "There needs to be a plan sandwiched after investigate, before fix"
>
> "should we create a workflow and/or slash command?"
>
> "So when I want to start troubleshooting, it should automatically start a new X.X.X. branch version and put the plan before implementation. should we make it `/troubleshoot`??"

**Note (2025-12-11):** Originally created for bugfixes, this workflow was later expanded to cover ALL patch-level changes (improvements, optimizations, refactoring, documentation). The command was renamed from `/troubleshoot` to `/patch` to reflect the broader scope.

**Issues Discovered:**
- No standardized patch-level change workflow existed
- Plan Mode Workflow only covered new features, not patch changes
- No enforcement mechanism to prevent skipping planning
- Easy to jump to "obvious" changes without documentation
- No automatic branch creation for patch changes
- Version numbering not automated

**Impact:**
- Plan created retrospectively (less valuable)
- Decision rationale not captured during decision-making
- Risk of implementing wrong solution
- Harder to review changes without upfront plan
- Sets bad precedent for future bugfixes

**Why This Matters:**
Patch-level changes deserve the same rigor as features. A poorly planned change can:
- Address symptoms instead of root causes (for bugfixes)
- Introduce new bugs or regressions
- Miss edge cases or optimization opportunities
- Create technical debt
- Leave no documentation of why the change was made
- Result in suboptimal solutions (for improvements/optimizations)

---

## What We Learned: Workflows Need Enforcement Mechanisms

### The Core Insight

**Documentation alone isn't enough.** We had documentation workflows (Plan Mode, Documentation Update) but no enforcement for patch-level changes. Creating a `/patch` command (originally `/troubleshoot`) that **forces** the correct workflow prevents shortcuts.

**The Solution:**
A structured patch workflow with:
1. **Automatic branch creation** - No manual version incrementing
2. **Enforced planning phase** - Can't proceed to implementation without plan
3. **Guided analysis** - Systematic investigation of what needs to change and why
4. **Interactive checkpoints** - User approval required at key stages
5. **Documentation integration** - Automatic `/doc-update` trigger
6. **Flexible scope** - Supports bugfixes, improvements, optimizations, refactoring, and documentation changes

---

## The Solution: Patch Workflow + /patch Command

### Layer 1: Workflow Documentation

**Created:** `docs/workflows/Patch_Workflow.md` (originally `Bugfix_Workflow.md`, renamed 2025-12-11)

**Defines 5 phases:**
1. **Analysis** - Identify change needed, understand root cause or opportunity
2. **Planning** - Create plan document (REQUIRED)
3. **Implementation** - Make changes according to plan
4. **Testing** - Verify changes work, test edge cases
5. **Documentation** - Update all docs

**Key principles:**
- Never skip planning (even for "simple" changes)
- One change per branch
- Patch version for all patch-level changes (x.y.Z)
- Plan document before code changes
- Supports multiple change types: bugfixes, improvements, optimizations, refactoring, documentation

### Layer 2: Slash Command Automation

**Created:** `.claude/commands/patch.md` (originally `troubleshoot.md`, renamed 2025-12-11)

**Automates workflow:**
```
/patch
  ↓
Ask for change type (bugfix, improvement, optimization, refactoring, documentation)
  ↓
Ask for change description
  ↓
Calculate patch version (v[X.Y.Z+1])
  ↓
Create patch branch
  ↓
Guide analysis
  ↓
REQUIRE plan document creation
  ↓
Wait for user approval
  ↓
Guide implementation
  ↓
Guide testing
  ↓
Trigger /doc-update
```

**Enforcement mechanisms:**
- Branch created automatically (correct naming)
- Analysis phase guided step-by-step
- **Cannot proceed to implementation without plan document**
- Plan must be approved by user
- Testing checklist enforced
- Documentation triggered automatically
- Supports multiple change types with appropriate inline comment formats

### Layer 3: Decision Tree

```
Patch Change Needed
│
├─ Use /patch command
│  │
│  ├─ Phase 1: Analysis (Guided)
│  │  └─ Root cause/opportunity identified? → YES → Continue
│  │                                        → NO  → Keep analyzing
│  │
│  ├─ Phase 2: Planning (ENFORCED)
│  │  ├─ Create docs/plans/v[X.Y.Z+1]_[name]_plan.md
│  │  ├─ Document solution approaches
│  │  ├─ Get user approval
│  │  └─ BLOCKED until plan exists and approved
│  │
│  ├─ Phase 3: Implementation (After Approval)
│  │  └─ Make changes according to plan
│  │
│  ├─ Phase 4: Testing (Verify)
│  │  └─ Test cases from plan
│  │
│  └─ Phase 5: Documentation (Complete)
│     └─ Run /doc-update
```

---

## Implementation Results

### Problems Fixed

**Before:**
- ❌ No patch-level change workflow (only feature workflow)
- ❌ Easy to skip planning phase
- ❌ Manual branch creation prone to errors
- ❌ Version numbering inconsistent
- ❌ No enforcement of documentation

**After:**
- ✅ Dedicated patch workflow documented
- ✅ `/patch` command enforces workflow (originally `/troubleshoot`)
- ✅ Automatic branch creation with correct naming
- ✅ Plan document required before implementation
- ✅ Interactive checkpoints with user approval
- ✅ Integrated with `/doc-update`
- ✅ Supports multiple change types (bugfixes, improvements, optimizations, refactoring, documentation)

### Metrics of Success

**Workflow Compliance:**
- Before: 0% (jumped straight to fix)
- After: 100% (command enforces phases)

**Documentation Quality:**
- Before: Retrospective plan (less valuable)
- After: Proactive plan (captures decision-making)

**User Experience:**
- Before: Type `/patch` (or `/troubleshoot`) → nothing
- After: Type `/patch` → guided through entire workflow with change type selection

---

## Root Cause Analysis

### Why Did This Issue Happen?

**1. Incomplete Workflow Coverage**
- **Problem:** Had workflows for features and documentation, but not patch-level changes
- **Why it happened:** Assumed patch changes were "simpler" and didn't need structure
- **Reality:** Patch changes need MORE structure (easier to rush, higher risk of mistakes)

**2. No Enforcement Mechanism**
- **Problem:** Documentation workflows existed but were optional
- **Why it happened:** Relied on memory/discipline to follow workflows
- **Reality:** Need forcing functions (slash commands) to prevent shortcuts

**3. Missing Slash Command**
- **Problem:** Had `/doc-update` and `/lesson-learned` but no `/patch` (originally `/troubleshoot`)
- **Why it happened:** Didn't anticipate need for patch-specific command
- **Reality:** Different workflows need different commands

### How Patch Workflow Prevents Each Issue

**Issue 1: No patch workflow**
- **Solution:** Created `Patch_Workflow.md` (originally `Bugfix_Workflow.md`) with 5 phases
- **Result:** Clear process for all future patch-level changes
- **Expansion (2025-12-11):** Scope expanded to cover all patch types, not just bugfixes

**Issue 2: Easy to skip planning**
- **Solution:** `/patch` command blocks implementation until plan exists
- **Result:** Impossible to skip planning phase

**Issue 3: Manual version incrementing**
- **Solution:** Command automatically calculates patch version
- **Result:** Consistent version numbering

---

## Replication Pattern for Any Project

### Generic Patch Workflow System

This pattern works for **any software project**:

**1. Create Workflow Document**
```
docs/workflows/Patch_Workflow.md
- Define phases (analyze → plan → implement → test → document)
- Create checklists
- Provide templates
- Support multiple change types
```

**2. Create Automation Command**
```
.your-ai-tool/commands/patch.md
- Ask for change type (bugfix, improvement, optimization, refactoring, documentation)
- Ask for change description
- Create patch branch with calculated version
- Guide through phases
- ENFORCE planning before implementation
- Integrate with documentation tools
```

**3. Define Branch Naming**
```
v[X.Y.Z+1]-[patch-name]
Examples:
Bugfixes:
- v4.6.1-export-bugfix
- v2.3.1-auth-crash

Improvements:
- v4.6.2-better-error-messages
- v2.3.2-ux-enhancement

Optimizations:
- v4.6.3-pdf-optimization
- v2.3.3-query-performance
```

**4. Plan Document Template**
```markdown
# [Change Name] - v[X.Y.Z+1]

## Change Type
[Bugfix | Improvement | Optimization | Refactoring | Documentation]

## Analysis
[Current state, what needs to change, root cause or opportunity]

## Solution Approaches
[Considered options and trade-offs]

## Chosen Solution
[What we're doing and why]

## Testing
[How to verify changes work]

## Lessons Learned
[What we learned]
```

---

## Key Design Decisions

### Decision 1: Separate Patch Workflow from Feature Workflow

**Rationale:** Patch-level changes have different characteristics than features
- Patch version (x.y.Z) vs minor version (x.Y.0)
- Modify existing behavior vs add new behavior
- Typically smaller scope, higher urgency
- Multiple types: bugfixes, improvements, optimizations, refactoring

**Benefit:** Specialized workflow optimized for patch-level changes

### Decision 2: Command-Based Enforcement

**Rationale:** Documentation alone isn't enough to prevent shortcuts

**Benefit:** Slash command creates forcing function that guides workflow

### Decision 3: Interactive Checkpoints

**Rationale:** Need user approval at key decision points

**Benefit:** Prevents runaway automation, ensures alignment

### Decision 4: Automatic Version Calculation

**Rationale:** Version numbering errors are common and annoying

**Benefit:** One less thing to think about, consistent numbering

### Decision 5: Integrated Documentation

**Rationale:** Documentation often skipped as "final step"

**Benefit:** Workflow triggers `/doc-update` automatically

---

## How to Implement in Your Project

### Step 1: Create Patch Workflow Document

```bash
mkdir -p docs/workflows
touch docs/workflows/Patch_Workflow.md
```

**Include:**
- Analysis phase guide (understand what needs to change and why)
- Planning requirements
- Implementation checklist
- Testing checklist
- Documentation checklist
- Support for multiple change types

### Step 2: Create /patch Command

```bash
mkdir -p .your-ai-tool/commands
touch .your-ai-tool/commands/patch.md
```

**Key features:**
- Ask for change type (bugfix, improvement, optimization, refactoring, documentation)
- Ask for change description
- Auto-create branch with correct version
- Enforce planning phase
- Guide through all phases

### Step 3: Define Standards

**Branch naming:**
```
v[X.Y.Z+1]-[patch-name]
Examples:
- v4.6.1-export-bugfix (bugfix)
- v4.6.2-better-errors (improvement)
- v4.6.3-pdf-optimization (optimization)
```

**Plan location:**
```
docs/plans/v[X.Y.Z+1]_[patch-name]_plan.md
```

**Commit format:**
```
[type](v[X.Y.Z+1]): brief description
# type: fix, perf, refactor, docs, etc.

Detailed explanation

Change type: [Bugfix|Improvement|Optimization|Refactoring]

Ref: docs/plans/v[X.Y.Z+1]_[name]_plan.md
```

### Step 4: Train Your Team

**Onboarding checklist:**
- [ ] Read `Patch_Workflow.md`
- [ ] Practice using `/patch` command
- [ ] Review example patch (v4.6.1 bugfix)
- [ ] Understand why planning is required
- [ ] Learn supported change types

### Step 5: Enforce in Code Review

**PR Checklist:**
```markdown
For patch-level changes:
- [ ] Created via `/patch` command
- [ ] Plan document exists in `docs/plans/`
- [ ] Plan created BEFORE implementation
- [ ] All phases completed (analyze → plan → implement → test → doc)
- [ ] Change type clearly identified
- [ ] Tests verify changes and prevent regressions
```

---

## Lessons for Future Development

### **Lesson 1: Workflows Need Enforcement**

**Pattern:** Documentation + Automation + Forcing Functions

**Application in This Case:**
- Workflow: Patch_Workflow.md (documentation)
- Command: /patch (automation)
- Blocking: Can't implement without plan (forcing function)

**Result:** Compliance goes from optional to required

**Future Application:**
- Any critical workflow should have a slash command
- Commands should enforce key requirements
- Interactive checkpoints prevent automation runaway

### **Lesson 2: Different Tasks Need Different Workflows**

**Pattern:** Don't use one-size-fits-all workflows

**Application in This Case:**
- Features → Plan Mode Workflow (minor versions, complex planning)
- Patch changes → Patch Workflow (patch versions, multiple types: bugfixes, improvements, optimizations, refactoring)
- Documentation → Doc Update Workflow (version management)

**Result:** Each workflow optimized for its task type

**Future Application:**
- Expand workflows as new patterns emerge
- Each gets its own slash command if needed
- Tailor phases to task characteristics

### **Lesson 3: Retrospective Plans Have Less Value**

**Pattern:** Plans are most valuable when created DURING decision-making, not AFTER

**Application in This Case:**
- v4.6.1 plan created after fix (documents what was done)
- Future patch changes plan first (documents WHY decisions made)

**Result:** Real-time decision capture vs post-hoc rationalization

**Future Application:**
- Always create plans before implementation
- Use plans as working documents (update as you learn)
- Capture alternatives considered, not just chosen path

### **Lesson 4: Automate Version Management**

**Pattern:** Remove mental overhead from routine tasks

**Application in This Case:**
- `/patch` calculates patch version automatically
- No need to remember "what's the current version?"
- Consistent v[X.Y.Z+1] incrementing

**Result:** One less decision to make, fewer errors

**Future Application:**
- Automate other routine decisions (branch naming, file locations, etc.)
- Let humans focus on hard problems, automate easy ones
- Use templates and commands to enforce patterns

### **Lesson 5: Slash Commands Are Workflow Entry Points**

**Pattern:** Command name signals workflow type

**Application in This Case:**
- `/doc-update` → Documentation workflow
- `/lesson-learned` → Lessons learned creation
- `/patch` → Patch workflow (originally `/troubleshoot`)

**Result:** Clear, discoverable entry points for workflows

**Future Application:**
- Create slash command for each major workflow
- Name commands for user intent (/deploy, /release, /refactor)
- Commands load appropriate workflow and guide execution
- Update command names to reflect evolved scope (bugfix → patch)

---

## Common Pitfalls to Avoid

### Pitfall 1: Skipping Planning for "Obvious" Changes

**Problem:** "The change is obvious, no need to document"

**Why Bad:** "Obvious" changes often miss edge cases or have unintended side effects

**Solution:** `/patch` command enforces planning for ALL patch-level changes

### Pitfall 2: Creating Plan After Implementation

**Problem:** "I'll write up what I did afterward"

**Why Bad:** Loses decision rationale, alternatives considered, can't undo easily

**Solution:** Command blocks implementation until plan exists

### Pitfall 3: Manual Version Management

**Problem:** Manually determining next version number

**Why Bad:** Prone to errors, inconsistent, wastes time

**Solution:** Command auto-calculates patch version

### Pitfall 4: Documentation as Afterthought

**Problem:** "I'll update docs later"

**Why Bad:** Often forgotten, incomplete when done

**Solution:** Workflow includes documentation phase with checklist

### Pitfall 5: No Enforcement Mechanism

**Problem:** Workflows are "guidelines" that can be skipped

**Why Bad:** Only followed when convenient, defeats purpose

**Solution:** Slash commands create forcing functions

---

## Questions This Solves for Future Developers

**Q: "How do I make a patch-level change properly?"**
A: Type `/patch` and follow the guided workflow. It enforces analysis → planning → implementation.

**Q: "Do I need a plan document for a small change?"**
A: Yes - ALL patch-level changes get plan documents. The `/patch` command requires it.

**Q: "What version number should I use for a patch change?"**
A: The `/patch` command calculates it automatically (patch increment).

**Q: "Can I skip the planning phase if the change is obvious?"**
A: No - the command blocks implementation until the plan document exists and is approved.

**Q: "What should go in a patch plan?"**
A: Change type, analysis (current state, root cause/opportunity), solution approaches, chosen solution, testing, lessons learned. See template in `Patch_Workflow.md`.

**Q: "How is patch workflow different from feature workflow?"**
A: Patch changes use patch versions (x.y.Z), support multiple change types (bugfixes, improvements, optimizations, refactoring), and use `/patch` command. Features use minor versions (x.Y.0) and use Plan Mode.

**Q: "What are the supported patch change types?"**
A: Bugfix, Improvement/Enhancement, Optimization, Refactoring, Documentation.

---

## Conclusion

**What we built:**
- Patch_Workflow.md (5-phase process documentation) - originally Bugfix_Workflow.md, expanded 2025-12-11
- `/patch` slash command (automation and enforcement) - originally `/troubleshoot`, renamed 2025-12-11
- Plan document template (standardized structure with change type field)
- Integration with existing workflows (/doc-update)
- Support for multiple change types (bugfixes, improvements, optimizations, refactoring, documentation)

**Why it matters:**
Patch-level changes are high-risk (can introduce regressions) and deserve structured workflows. By enforcing planning before implementation, we prevent rushed changes and capture valuable decision context for all types of modifications.

**How it's retained:**
- **Documentation:** Patch_Workflow.md is the canonical process
- **Enforcement:** `/patch` command blocks shortcuts
- **Integration:** Works with Plan Mode and Doc Update workflows
- **Training:** This lessons learned explains why the workflow exists
- **Evolution:** Scope expanded from bugfixes-only to all patch-level changes

**How to replicate:**
1. Create patch workflow document with phases supporting multiple change types
2. Create `/patch` command that enforces workflow
3. Define branch naming and versioning standards
4. Integrate with documentation workflows
5. Train team and enforce in code review

---

**Key Takeaway:**
*Workflows without enforcement mechanisms are merely suggestions. Slash commands that enforce critical phases (like planning) transform workflows from optional guidelines into required processes, dramatically improving consistency and quality.*

---

**Created:** 2025-12-10
**Updated:** 2025-12-11 (v1.1 - Expanded scope from bugfixes to all patch-level changes)
**Version:** 1.1

**Related Docs:**
- `docs/workflows/Patch_Workflow.md` - The workflow itself (originally Bugfix_Workflow.md)
- `.claude/commands/patch.md` - The slash command (originally troubleshoot.md)
- `docs/plans/v4.6.1_export_bugfix_plan.md` - Example bugfix plan
- `docs/workflows/Plan_Mode_Workflow.md` - Feature workflow (comparison)
- `docs/workflows/diagrams/patch_workflow.mermaid.md` - Workflow diagrams
- `docs/workflows/diagrams/patch_workflow.ascii.md` - ASCII workflow diagrams

**Related Issues Solved:**
- Jumping to implementation without planning
- Missing patch-level change workflow
- No enforcement of planning phase
- Manual version management
- Inconsistent patch change process
- Scope limited to bugfixes only (resolved by expansion to all patch types)
