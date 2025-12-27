# Pre-Merge Checklist

**Purpose:** Verify all cleanup and documentation requirements before merging a feature branch to main.

**When to Use:** Before running `git merge [feature-branch]` or creating a pull request.

---

## Mandatory Checks

### ✅ 1. Temporary Files Cleanup

**Check for orphaned tmp files:**
```bash
ls docs/prompts/tmp/*.md
```

**Expected Output:**
```
ls: docs/prompts/tmp/*.md: No such file or directory
```

**If files exist:**
```bash
# Review files first
ls -la docs/prompts/tmp/

# Delete all .md files except README.md
rm docs/prompts/tmp/[SpecificPrompt]_v*.md

# Or delete all tmp prompts at once (safe - README.md is excluded by pattern)
rm docs/prompts/tmp/*_v*.md
```

**Why Critical:**
- tmp/ files are gitignored and won't be committed
- Leaving orphaned files creates confusion
- Next developer might not know if they're safe to delete
- Violates the "ephemeral tmp" principle

---

### ✅ 2. Documentation Updates Complete

**Verify all docs updated:**
```bash
# Check git status for modified docs
git status

# Should see updates to:
# - docs/ROADMAP.md (if milestone added)
# - docs/CHANGELOG.md (if user-facing changes)
# - docs/CHANGELOG_DEV.md (if developer tools/process/lessons learned)
# - docs/prompts/[category]/[Prompt].md (if prompt changed)
# - docs/plans/[version]_plan.md (if new feature)
```

**Verify version bumps:**
- [ ] ROADMAP.md version history updated
- [ ] Prompt files have new version in header
- [ ] Inline comments added (`<!-- vX.Y Change -->`)
- [ ] CHANGELOG.md has entry for user-facing changes
- [ ] CHANGELOG_DEV.md has entry for developer experience changes (if applicable)

---

### ✅ 3. Stable Prompts Updated (If Branch Prompts Used)

**If you used `docs/prompts/tmp/` for testing:**

- [ ] Copied tmp prompt to stable location
- [ ] Removed `[TESTING]` header from stable version
- [ ] Updated version to final (e.g., v1.3 not v1.3-BRANCH)
- [ ] Verified all changes are in stable prompt
- [ ] Deleted tmp prompt file
- [ ] Verified deletion: `ls docs/prompts/tmp/*.md` shows nothing

---

### ✅ 4. Git Hygiene

**Verify commits:**
```bash
# Check commit history
git log --oneline -5

# Verify commit messages follow convention:
# - docs(scope): description
# - feat(scope): description
# - fix(scope): description
```

**Check for uncommitted changes:**
```bash
git status

# Should show:
# "nothing to commit, working tree clean"
# OR only intentional uncommitted files
```

---

### ✅ 5. Plan Consolidation (If Applicable)

**If you created new implementation plans:**

- [ ] New plans added to `docs/plans/`
- [ ] If major version complete (e.g., v4.x → v5.0), consolidate old plans
- [ ] Update `docs/plans/vX.x_consolidated_plans.md` if consolidating
- [ ] Remove individual plan files after consolidation (use `git rm`)

---

### ✅ 6. Branch-Specific Checks

**Feature Branch Verification:**
```bash
# Verify you're on the correct branch
git branch

# Should show:
# * v4.5-feature-name (or similar)

# Verify branch is up to date with origin
git fetch
git status

# Should show:
# "Your branch is up to date with 'origin/v4.5-feature-name'"
# OR "Your branch is ahead of 'origin/...' by N commits"
```

---

### ✅ 7. Testing Validation (If Code Changes)

**If implementation includes code changes:**

- [ ] All test cases passed
- [ ] No regressions in existing functionality
- [ ] User has verified changes in preview/testing environment
- [ ] Test results documented (in commit message or plan)

---

### ✅ 8. Version Consistency Check (NEW)

**Purpose:** Ensure version numbers align across all documentation

**Required checks:**
- [ ] Prompt files incremented if modified (e.g., v4.5 → v4.5.1)
- [ ] CHANGELOG version matches prompt version
- [ ] ROADMAP document version incremented
- [ ] Inline comments added for current version (`<!-- vX.Y Change -->`)

**Automated check:**
```bash
# Run this to verify version consistency
./scripts/check-version-consistency.sh
```

**Manual verification:**
```bash
# Check prompt version
head -1 docs/prompts/analyzer/Resume_Analyzer_Prompt.md

# Check CHANGELOG latest entry
head -20 docs/CHANGELOG.md | grep "###"

# Verify they match
```

**Why Critical:** Version mismatches create confusion about which features are in which release.

---

### ✅ 9. Integration Verification (NEW)

**Purpose:** Ensure features actually work end-to-end, not just in prompt files

**If code changes were made:**
- [ ] Run smoke test or manual verification
- [ ] Verify new features appear in actual output (not just prompt files)
- [ ] Check for error logs or warnings
- [ ] Document test results in `/docs/testing/[version]_tests.md`

**Required evidence:**
- Screenshot or output snippet showing feature working
- Token usage measurement (if performance-related)
- Test results file committed with merge

**Blocking requirement:** Features must be verified working before merge. If incomplete, document "Known Issues" clearly in:
- CHANGELOG.md
- Plan file
- README.md (if user-facing)

**Example check:**
```bash
# For v4.5 verb categorization - verify it appears in output
# Run analysis and grep for emoji indicators
./run_analysis.sh | grep -E "🔵|🟡|🟠|🟢|🟣"

# Should return results if feature is working
```

**Why Critical:** Prevents merging features that don't actually work (like v4.5 prompt integration issue).

---

### ✅ 9.5. Plan Status Markers (Standard Format)

**Purpose:** Ensure consistent plan lifecycle tracking across all documentation

**Canonical Status Markers:**

Plans MUST use one of these standardized status markers:

```markdown
**Status:** 📋 DRAFT - Pending Approval
**Status:** 🚧 IN PROGRESS - [Current Phase]
**Status:** ✅ IMPLEMENTED - Pending User Testing
**Status:** ✅ COMPLETE - Ready for Consolidation
**Status:** 🔀 SUPERSEDED BY v[X.Y.Z]
**Status:** ⛔ CANCELLED - [Brief Reason]
```

**Status Lifecycle:**

```
DRAFT → IN PROGRESS → IMPLEMENTED → COMPLETE → [Consolidated]
                           ↓
                      SUPERSEDED (if replaced by better approach)
                           ↓
                      CANCELLED (if no longer needed)
```

**Consolidation Trigger:**

Plans are ready for consolidation when status is:
- `✅ COMPLETE - Ready for Consolidation`
- `✅ COMPLETE - Ready for merge`
- Any variation of `✅.*Complete`

**When to Mark Complete:**

Mark a plan as COMPLETE when ALL of these are true:
- [ ] Implementation code is committed
- [ ] Documentation is updated
- [ ] PR is merged to main branch
- [ ] User testing is complete (if applicable)
- [ ] All success criteria met

**Do NOT mark complete when:**
- ❌ Work is done but PR not merged (use `IMPLEMENTED - Pending User Testing`)
- ❌ Next version work has started (doesn't mean previous is complete)
- ❌ Plan is superseded by different approach (use `SUPERSEDED BY vX.Y.Z`)

**Update Old Plans:**

If you find plans with non-standard status markers, update them:

```bash
# Find plans with non-standard status
grep -r "Status:" docs/plans/*.md | grep -v "DRAFT\|IN PROGRESS\|IMPLEMENTED\|COMPLETE\|SUPERSEDED\|CANCELLED"

# Update to standard format
```

**Examples:**

```markdown
# Good (Standard)
**Status:** ✅ COMPLETE - Ready for Consolidation

# Bad (Non-standard - needs update)
**Status:** Completed with modifications
**Status:** ✅ **COMPLETED** - December 11, 2025
**Status:** Done
```

**Consolidation Script Compatibility:**

The consolidation check looks for: `✅.*Complete`

This matches:
- ✅ COMPLETE
- ✅ Complete
- ✅ **COMPLETE**
- ✅ **COMPLETED**

But NOT:
- IMPLEMENTED
- Done
- Finished

**Why Critical:** Prevents the "19 different status formats" chaos. Consolidation automation depends on consistent markers.

---

### ✅ 10. Plan Consolidation (Enhanced)

**Purpose:** Keep plans directory organized and up-to-date

**Consolidation Rules - A plan MUST be consolidated when ALL of these are true:**
- [ ] Plan status changed to "✅ Complete" in ROADMAP.md
- [ ] All implementation work is done (no pending features)
- [ ] Plan is no longer being actively edited

**Consolidation Process:**
1. [ ] Append plan content to `docs/plans/v4.x_consolidated_plans.md`
2. [ ] Update consolidated doc's Table of Contents
3. [ ] Update version history table in consolidated doc
4. [ ] Remove standalone plan file: `git rm docs/plans/v4.X_feature_plan.md`
5. [ ] Update README.md links to point to consolidated doc section
6. [ ] Run: `./scripts/check-version-consistency.sh` to verify
7. [ ] Commit consolidation as part of completion commit

**Exception:** Plans stay separate ONLY if explicitly marked "Active Reference - Do Not Consolidate"

**Automated verification:**
```bash
# Check for unconsolidated completed plans
./scripts/check-version-consistency.sh
# Will report any completed plans not consolidated
```

**Why Critical:** Prevents accumulation of standalone completed plan files (caught v4.5 consolidation gap).

---

## Quick Checklist Summary

Copy this to your terminal and run through it:

```bash
echo "=== PRE-MERGE CHECKLIST ==="
echo ""
echo "1. Check tmp/ cleanup:"
ls docs/prompts/tmp/*.md 2>&1 | grep -q "No such file" && echo "✅ tmp/ clean" || echo "❌ tmp/ has orphaned files!"
echo ""
echo "2. Check git status:"
git status
echo ""
echo "3. Check recent commits:"
git log --oneline -3
echo ""
echo "4. Verify branch:"
git branch | grep '*'
echo ""
echo "=== END CHECKLIST ==="
```

---

## After Checklist Passes

### Ready to Merge

**If on feature branch:**
```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Merge feature branch
git merge v4.5-feature-name

# Push to remote
git push origin main

# Delete feature branch (optional)
git branch -d v4.5-feature-name
git push origin --delete v4.5-feature-name
```

**If using pull requests:**
1. Push feature branch to remote
2. Create PR on GitHub
3. Review and merge via GitHub UI
4. Delete feature branch after merge

---

## Common Issues

### Issue: tmp/ files still exist

**Symptom:**
```bash
$ ls docs/prompts/tmp/*.md
docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
```

**Solution:**
```bash
# Review the file first
cat docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md

# Verify it was merged to stable location
diff docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md \
     docs/prompts/analyzer/Resume_Analyzer_Prompt.md

# If merged successfully, delete tmp file
rm docs/prompts/tmp/Resume_Analyzer_Prompt_v1.3.md
```

### Issue: Version numbers don't match

**Symptom:** ROADMAP says v1.17, but prompt file still shows v1.16

**Solution:** Update prompt file version history to match planned version

### Issue: Uncommitted changes

**Symptom:** `git status` shows modified files

**Solution:**
```bash
# Review changes
git diff

# If intentional, stage and commit
git add [files]
git commit -m "description"

# If unintentional, revert
git checkout -- [files]
```

---

## Automation Setup

### Git Hooks for Automated Validation

Create git hooks to enforce documentation standards automatically.

#### Pre-Commit Hook (Consolidation Check)

**Purpose:** Block commits if completed plans are not consolidated

**Setup:**
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit consolidation check..."

# Check for unconsolidated completed plans
# Pattern v[0-9]*.md matches any version (v4.7, v10.2, v42.15.7, etc.)
STANDALONE_COMPLETE=$(find docs/plans -name "v[0-9]*.md" ! -name "*consolidated*" -exec grep -l "✅.*Complete" {} \; 2>/dev/null | wc -l | tr -d ' ')

if [ "$STANDALONE_COMPLETE" -gt 0 ]; then
    echo "❌ COMMIT BLOCKED: Found $STANDALONE_COMPLETE completed plan(s) not consolidated:"
    find docs/plans -name "v[0-9]*.md" ! -name "*consolidated*" -exec grep -l "✅.*Complete" {} \; 2>/dev/null | sed 's|^|    - |'
    echo ""
    echo "📋 Required actions before commit:"
    echo "1. Consolidate each plan into v4.x_consolidated_plans.md"
    echo "2. Update docs/plans/README.md links"
    echo "3. Run: git rm docs/plans/[completed_plan].md"
    echo "4. Run this check again"
    exit 1
fi

echo "✅ Consolidation check passed"
EOF

chmod +x .git/hooks/pre-commit
```

**Why Critical:** Prevents accumulating standalone completed plan files (caught the v4.5 consolidation gap).

---

#### Pre-Push Hook (Version Consistency)

**Purpose:** Block pushes if version numbers are inconsistent or tmp files exist

**Setup:**
```bash
# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

echo "🔍 Running pre-push validation..."

# 1. Check for version consistency
if [ -f scripts/check-version-consistency.sh ]; then
    bash scripts/check-version-consistency.sh
    if [ $? -ne 0 ]; then
        echo "❌ PUSH BLOCKED: Version inconsistency detected"
        echo "Fix version numbers and re-run this check"
        exit 1
    fi
fi

# 2. Check for orphaned tmp files
if ls docs/prompts/tmp/*_v*.md 1> /dev/null 2>&1; then
    echo "❌ PUSH BLOCKED: Orphaned tmp files detected"
    echo "Clean up before pushing:"
    ls docs/prompts/tmp/*_v*.md
    echo ""
    echo "Run: rm docs/prompts/tmp/*_v*.md"
    exit 1
fi

echo "✅ Pre-push validation passed"
EOF

chmod +x .git/hooks/pre-push
```

**Why Critical:** Ensures documentation consistency before code reaches remote repository.

---

#### Testing the Hooks

**Verify hooks are installed:**
```bash
ls -la .git/hooks/pre-commit .git/hooks/pre-push
```

**Test pre-commit hook:**
```bash
# Simulate a completed plan without consolidation
echo "Status: ✅ Complete" >> docs/plans/test_plan.md
git add docs/plans/test_plan.md
git commit -m "test"
# Should block with consolidation error

# Clean up test
rm docs/plans/test_plan.md
```

**Test pre-push hook:**
```bash
# This should pass if versions are consistent
git push --dry-run
```

---

#### Disabling Hooks (Emergency Use Only)

If you need to bypass hooks temporarily:
```bash
# Skip pre-commit hook
git commit --no-verify -m "message"

# Skip pre-push hook
git push --no-verify
```

**⚠️ Warning:** Only use `--no-verify` in emergencies. Bypassing hooks defeats the purpose of automated validation.

---

**Last Updated:** 2025-12-09 (v4.5.3 - Enhanced automation with consolidation checks)
**See Also:** `/docs/prompts/dev/Update_Doc_Prompt.md` - Step 5.5
