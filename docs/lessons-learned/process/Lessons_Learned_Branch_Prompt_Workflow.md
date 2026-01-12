# Lessons Learned: Branch Prompt Workflow Pattern

**Date:** 2025-12-08
**Context:** AI Prompt Engineering for Production Systems
**Problem Solved:** How to safely test and iterate on AI prompt changes without breaking stable versions

---

## The Problem We Faced

When developing complex AI-powered systems, prompts are as critical as code. A bad prompt update can:
- Break existing functionality
- Produce incorrect analysis results
- Require rollbacks that lose work
- Create confusion about which version is "live"

**Common scenarios requiring safe prompt testing:**
- Adding new features to existing prompts (classification systems, detection algorithms, analysis frameworks)
- Major restructuring of prompt logic or organization
- Changing output formats or response structures
- Implementing new validation rules or quality checks
- Updating examples or adding new edge cases
- Behavioral changes that need validation before deployment

**Example from our project:**
We needed to implement a major prompt update adding a 5-category classification system with 100+ items, detection algorithms, and distribution counting. This required extensive testing and iteration.

**Traditional approach problems:**
- Editing the main prompt file directly = risky, no safety net
- Creating a copy alongside the main file = clutters the directory, causes confusion
- No clear process for when/how to merge tested changes back
- Test versions accidentally get committed to version control
- Difficult to track which version is stable vs experimental

---

## The Solution: Branch Prompt Workflow with Temporary Directory

### Core Concept

**Use a dedicated `/tmp/` directory for testing prompt versions, with strict cleanup enforcement.**

**Key Principles:**
1. **Isolation:** Test prompts live in a separate, clearly-marked temporary space
2. **Ephemeral:** tmp files are deleted immediately after merging (never retained)
3. **Enforced:** gitignore prevents accidental commits, process requires cleanup
4. **Documented:** Multiple layers of documentation ensure practice retention

---

## How We Implemented It

### Step 1: Create the Temporary Directory Structure

**What we did:**
```bash
mkdir -p docs/prompts/tmp
```

**Why this location:**
- Lives inside `/docs/prompts/` (close to the prompts being tested)
- Named `tmp` (standard Unix convention for temporary files)
- Separate from production prompt directories (analyzer/, sys/, etc.)

**Created these files:**
- `.gitkeep` - Keeps the empty directory in version control
- `README.md` - Documents the workflow for developers who find the directory

### Step 2: Configure gitignore to Prevent Commits

**What we did:**
Added to `.gitignore`:
```
# Temporary Development Files
# Temporary branch prompts - never commit, always delete after merge
docs/prompts/tmp/*.md
!docs/prompts/tmp/README.md
!docs/prompts/tmp/.gitkeep
```

**What this does:**
- Ignores all `.md` files in `tmp/` (the test prompts)
- Allows `README.md` and `.gitkeep` (documentation files)
- Prevents accidentally committing test versions

**Why this matters:**
Even if someone forgets to delete tmp files, git won't commit them. This creates a forcing function for cleanup.

### Step 3: Document the Workflow

**We created/updated 5 documents:**

1. **`Update_Doc_Prompt.md`** - Added Step 5.5: Branch Prompt Testing
   - When to use branch prompts (major changes) vs when not to (typos)
   - Complete 7-step workflow from creation to cleanup
   - Critical cleanup requirements highlighted

2. **`/doc-update` slash command** - Updated to include Step 5.5
   - Quick reference loaded at session start
   - Pre-merge cleanup checklist included
   - Critical warning about tmp file cleanup

3. **`Pre_Merge_Checklist.md`** - Standalone verification document
   - 7 mandatory checks before merging any branch
   - Automated verification script
   - Troubleshooting for common cleanup issues

4. **`tmp/README.md`** - In-directory documentation
   - Explains what tmp/ is for
   - Provides usage examples
   - Emphasizes cleanup rules

5. **`tmp/.gitkeep`** - Metadata in the gitkeep file itself
   - Documents the lifecycle of tmp files
   - Explains why the directory exists

### Step 4: Create Multi-Layer Enforcement

**Layer 1 - Prevention (Technical):**
- gitignore blocks commits = Can't preserve tmp files even accidentally

**Layer 2 - Process (Documentation):**
- Update_Doc_Prompt.md Step 5.5 = Official workflow requirement
- /doc-update command = Loads reminders every session
- Pre_Merge_Checklist.md = Verification before merge

**Layer 3 - Discovery (In-Context Help):**
- tmp/README.md = Found immediately when someone opens the directory
- Inline comments in all docs = Explain why cleanup matters

**Layer 4 - Automation (Future):**
- Pre-merge git hook template provided
- Can add CI/CD checks for tmp/ cleanliness

---

## The Workflow in Practice

### Scenario: Implementing a Major Prompt Update

**1. Planning Phase**
```
User: "I want to add [new feature] to [AI Prompt]"
Assistant: "Let me create an implementation plan first..."
→ Creates /docs/plans/vX.Y_feature_name_plan.md
→ Documents requirements, test cases, success criteria
```

**Examples:**
- "Add multi-language support to translation prompt"
- "Implement sentiment scoring system in analysis prompt"
- "Add structured output format to generation prompt"
- "Integrate new classification taxonomy"

**2. Branch Prompt Creation**
```
User: "Now let's implement it"
Assistant: "I'll create a branch prompt for testing..."
→ Copies stable prompt to tmp/ directory with new version number
→ cp docs/prompts/[category]/[Prompt].md \
     docs/prompts/tmp/[Prompt]_v[NewVersion].md
```

**Example:**
```bash
cp docs/prompts/analyzer/Resume_Analyzer_Prompt.md \
   docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
```

**3. Implementation in tmp Version**
```
Assistant: "Making changes to the tmp version only..."
→ Edits tmp/[Prompt]_v[NewVersion].md
→ Adds testing header: [TESTING - NOT FOR PRODUCTION]
→ Implements new feature/changes
→ Adds inline comments marking changes
→ Stable version remains untouched
```

**What changes:**
- Feature logic added
- New examples/edge cases
- Updated instructions
- Modified output format
- Enhanced validation rules

**What stays safe:**
- Production prompt unchanged
- Existing functionality preserved
- Can continue using stable version during testing

**4. Testing**
```
User: "Let me test this with real data..."
→ Runs test cases from implementation plan
→ Validates new feature accuracy/behavior
→ Checks for regressions
→ Iterates on tmp version based on results
→ Stable version still running in production
```

**Testing approaches:**
- Unit tests for specific features
- Integration tests with real data
- A/B comparison (old vs new results)
- Edge case validation
- Performance testing

**5. Merge to Stable**
```
User: "Tests passed! Let's finalize."
Assistant: "Copying tested version to stable location..."
→ cp docs/prompts/tmp/[Prompt]_v[NewVersion].md \
     docs/prompts/[category]/[Prompt].md
→ Removes [TESTING] header from stable file
→ Updates version to final
→ Documents what was validated
```

**6. Cleanup (ENFORCED)**
```
Assistant: "Deleting tmp file..."
→ rm docs/prompts/tmp/[Prompt]_v[NewVersion].md
→ ls docs/prompts/tmp/*.md  # Verifies: "No such file or directory"
```

**Why critical:**
- Prevents confusion about which version is live
- Forces discipline (can't skip cleanup)
- Keeps repository clean
- Enforced by gitignore

**7. Commit**
```
Assistant: "Committing with tested and validated note..."
→ git commit -m "feat(prompts): finalize [Prompt] vX.Y
   - All test cases passed
   - [Specific validation metrics]
   - Merged from tested tmp version"
```

**Example commit messages:**
- "feat(prompts): add multi-language support job history creation - tested on 5 languages"
- "feat(prompts): implement sentiment scoring v1.5 - 95% accuracy validated"
- "feat(prompts): restructure output format v3.0 - backward compatible"

---

## Why This Pattern Works

### **1. Safety**
- Stable prompts never touched during testing
- Easy rollback (just delete tmp file)
- Production always has a working version

### **2. Clarity**
- Obvious which file is testing vs production
- tmp/ location signals "temporary, don't trust yet"
- Testing header makes status unmistakable

### **3. Iterative Development**
- Make changes → test → refine → test → repeat
- All iterations happen in tmp version
- Merge only when confident

### **4. Enforcement**
- gitignore prevents commits
- Multiple docs reinforce cleanup
- Process requires verification
- Can't merge without cleanup

### **5. Discoverability**
- tmp/README.md explains workflow immediately
- /doc-update loads full protocol
- Pre-merge checklist catches forgotten cleanup

---

## How to Replicate This in Your Project

### For AI Prompt Projects

**Natural Language Prompt for Claude/GPT:**

```
I want to implement a branch prompt workflow for my AI project.

Requirements:
1. Create a /docs/prompts/tmp/ directory for testing prompt versions
2. Configure .gitignore to prevent committing tmp prompt files
3. Create documentation that enforces cleanup after merging
4. Set up a workflow where:
   - Stable prompts stay in their normal locations
   - Testing versions go in tmp/ with version numbers
   - After testing, tmp version merges to stable
   - tmp file gets deleted immediately
5. Add multiple enforcement layers (gitignore, docs, checklists)

Structure:
- /docs/prompts/analyzer/ (stable prompts)
- /docs/prompts/tmp/ (testing versions - ephemeral)
- /docs/prompts/dev/Update_Doc_Prompt.md (workflow documentation)

Can you help me set this up?
```

**Expected Actions:**
1. Creates tmp/ directory with .gitkeep and README.md
2. Updates .gitignore to ignore tmp/*.md
3. Creates or updates documentation protocol
4. Provides workflow examples
5. Sets up pre-merge verification checklist

### For General Software Projects (Not AI-Specific)

**Adapt the Pattern:**

```
I want to implement a branch workflow for [configuration files / schemas / templates].

Requirements:
1. Create /tmp/ or /test/ directory for testing versions
2. Configure .gitignore to prevent committing test files
3. Document when to use test versions vs direct edits
4. Enforce cleanup after merging test → production

Files to test:
- Configuration files (config.yaml, settings.json)
- Database schemas
- API specifications
- Documentation templates

Can you set up:
- Directory structure
- gitignore rules
- Workflow documentation
- Pre-merge checklist
```

### Key Adaptation Points

**What to keep universal:**
- tmp/ or test/ directory for ephemeral versions
- gitignore to prevent commits
- Documentation of workflow
- Pre-merge cleanup verification
- Multi-layer enforcement

**What to customize:**
- Directory location (where test files live)
- File types being tested
- Naming conventions
- Testing process (depends on what's being tested)
- Merge criteria (what validates a successful test)

---

## Lessons for Future Features

### **1. Documentation Is Enforcement**

We learned: The more places you document a requirement, the harder it is to forget.

**Applied:**
- 5 different documents mention cleanup
- /doc-update command loads reminders
- tmp/README.md found when opening directory

**Principle:**
Don't rely on memory. Make the process discoverable at the point of use.

### **2. Gitignore as Safety Net**

We learned: Even with perfect documentation, people forget. Technical barriers prevent mistakes.

**Applied:**
- gitignore blocks tmp file commits
- Even if you forget cleanup, git won't preserve bad state

**Principle:**
Use tools to enforce policies, not just documentation.

### **3. Ephemeral > Persistent**

We learned: If test files can be saved "just in case," they will accumulate.

**Applied:**
- tmp/ files must be deleted (not optional)
- gitignore forces this (can't commit to preserve)
- No "archive old test files" option

**Principle:**
Make the right thing easy and the wrong thing hard.

### **4. Context-Aware Help**

We learned: Help should appear where people need it, not just in centralized docs.

**Applied:**
- tmp/README.md explains workflow in the directory itself
- .gitkeep file contains lifecycle documentation
- /doc-update command at session start

**Principle:**
Put documentation at the point of decision, not just in a wiki.

### **5. Process > Tools**

We learned: A well-documented process with simple tools (directories + gitignore) beats complex tooling.

**Applied:**
- No custom scripts required
- Standard Unix conventions (tmp/)
- Simple copy/delete operations
- Pre-merge checklist anyone can run

**Principle:**
Start with the simplest solution that enforces the requirement.

---

## Metrics of Success

### **How We Know It Works:**

**Before this workflow:**
- ❌ Risk of breaking stable prompts
- ❌ No clear testing process
- ❌ Confusion about which version is "live"
- ❌ No enforcement of cleanup

**After this workflow:**
- ✅ Stable prompts protected during development
- ✅ Clear 7-step testing process documented
- ✅ tmp/ location signals "testing" immediately
- ✅ gitignore + docs + checklist = enforced cleanup
- ✅ Discoverable via /doc-update command
- ✅ Replicable by reading this document

**Measurement:**
- Developer can explain workflow after reading once ✅
- tmp/ directory stays clean (no orphaned files) ✅
- Stable prompts never accidentally broken ✅
- Process documented in 5 places ✅

---

## Future Improvements

### **Potential Automation:**

1. **Pre-commit git hook:**
```bash
# Warn if tmp/ has files
if ls docs/prompts/tmp/*.md 2>/dev/null; then
    echo "⚠️  Warning: tmp/ has files. Don't forget cleanup!"
fi
```

2. **CI/CD check:**
```yaml
# GitHub Actions
- name: Check tmp cleanup
  run: |
    if ls docs/prompts/tmp/*.md 2>/dev/null; then
      echo "❌ tmp/ directory has orphaned files!"
      exit 1
    fi
```

3. **Automated testing:**
```bash
# Run tests on tmp prompts before allowing merge
pytest tests/prompt_validation/test_tmp_prompts.py
```

### **Process Refinements:**

- Add "tested by" field to prompt headers
- Track test results in commit messages
- Create prompt version changelog
- Add rollback procedure documentation

---

## Questions This Solves for Future Developers

**Q: "Where do I test prompt changes?"**
A: In `docs/prompts/tmp/[PromptName]_v[NewVersion].md`

**Q: "Can I commit my test prompt?"**
A: No, gitignore prevents it. Test → Merge → Delete is the workflow.

**Q: "What if I forget to delete tmp files?"**
A: Pre-merge checklist catches it. Also, they won't be committed anyway.

**Q: "How do I know if a prompt is stable or testing?"**
A: Stable = normal directory. Testing = tmp/ directory + [TESTING] header.

**Q: "Can I keep old test prompts for reference?"**
A: No, that's what git history is for. tmp/ must stay clean.

**Q: "How do I know the workflow?"**
A: Type `/doc-update` to load the protocol.

---

## Conclusion

**What we built:** A disciplined, enforceable workflow for testing AI prompt changes safely.

**Why it matters:** Prompts are code. They deserve the same care as software - testing, versioning, cleanup.

**How it's retained:** Multi-layer enforcement (technical + process + documentation) ensures this practice persists.

**How to replicate:** Use the natural language prompts above to implement in any project.

---

**Key Takeaway:**
*Good workflows don't rely on memory or discipline alone. They use technical barriers (gitignore), discoverable documentation (tmp/README.md), and verification steps (Pre_Merge_Checklist.md) to make the right behavior inevitable.*

---

**Created:** 2025-12-08
**Version:** 1.0
**Related Docs:**
- `/docs/prompts/dev/Update_Doc_Prompt.md` - Step 5.5
- `/docs/prompts/dev/Pre_Merge_Checklist.md`
- `/docs/prompts/tmp/README.md`
- `/.claude/commands/doc-update.md`
