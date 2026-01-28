---
description: Enforce Shadow Sync Protocol: Verification for modular rule consistency
---
# enforce-shadow-sync

Execute Shadow Sync Protocol verification checks. Detects which files changed and verifies all three tiers (MODULAR, GOLD MASTER, OPTIMIZED ENTRYPOINT) are synchronized. Works regardless of which tier was modified first.

---

## Description

This skill **executes** the Shadow Sync Protocol verification defined in [patterns.md](../docs/knowledge/patterns.md#shadow-sync-protocol).

**What it does:**
1. Detects which files changed (MODULAR, GOLD MASTER, OPTIMIZED ENTRYPOINT)
2. Runs grep/file verification checks for each tier
3. Searches for terminology inconsistencies across all tiers
4. Reports pass/fail with specific corrections needed

**When to use:**
- After making changes to `optimization-tools/` files
- After making changes to `PROJECT-INSTRUCTIONS.md`
- After making changes to `Project-GUI-Instructions.md`
- Before creating a git commit

---

## Usage

```bash
/enforce-shadow-sync
/enforce-shadow-sync --auto
/enforce-shadow-sync --old-term="Hiring Manager Perspective" --new-term="Resume Narrative Analysis"
/enforce-shadow-sync --show-details
```

**Parameters:**
- `--auto` (optional): Skip interactive prompts, auto-run and report
- `--old-term` (optional): Search for old terminology to find missed references
- `--new-term` (optional): Verify new terminology is used consistently
- `--show-details` (optional): Show diff details of what changed

---

## Verification Checklist (What Actually Runs)

### Check 1: Detect Changed Files

```bash
git diff --name-only | grep -E "(optimization-tools|PROJECT-INSTRUCTIONS|Project-GUI-Instructions)"
```

**Output:**
- Lists which tiers changed
- Categorizes as MODULAR, GOLD MASTER, or OPTIMIZED ENTRYPOINT
- Reports if multiple tiers changed

### Check 2: Verify MODULAR Files

If `optimization-tools/*` changed:

```bash
# Find all rule IDs in changed MODULAR files
grep -rh "<rule_id>\|<section id" optimization-tools/ | sort | uniq
```

**Pass:** Rule IDs found
**Fail:** No rules defined

### Check 3: Verify GOLD MASTER Sync

If MODULAR changed:

```bash
# For each rule ID, verify it exists in PROJECT-INSTRUCTIONS.md
for rule in $(grep -rh "<rule_id>" optimization-tools/ | cut -d'>' -f2 | cut -d'<' -f1 | sort | uniq); do
  grep -q "modular_reference.*$rule" PROJECT-INSTRUCTIONS.md || echo "MISSING: $rule"
done
```

**Pass:** All rule IDs found in PROJECT-INSTRUCTIONS.md
**Fail:** Any rule IDs missing from GOLD MASTER

### Check 4: Verify OPTIMIZED ENTRYPOINT

If GOLD MASTER changed:

```bash
# Verify Project-GUI-Instructions.md has modular references
grep -c "modular_reference" Project-GUI-Instructions.md
```

**Pass:** References exist
**Fail:** No references found

### Check 5: Terminology Search

```bash
# Search for old terminology across all three tiers
if [ -n "$OLD_TERM" ]; then
  # Exact match
  grep -r "$OLD_TERM" optimization-tools/ PROJECT-INSTRUCTIONS.md Project-GUI-Instructions.md

  # Snake_case variation
  SNAKE_CASE=$(echo "$OLD_TERM" | tr ' ' '_')
  grep -ir "$SNAKE_CASE" .

  # Report matches found
fi
```

**Pass:** 0 matches for old terminology
**Fail:** Any matches found

### Check 6: Interface Consistency

```bash
# Verify interfaces read from correct sources
echo "Claude Artifacts uses: PROJECT-INSTRUCTIONS.md"
grep -q "narrativeAnalysis\|narrative_analysis" PROJECT-INSTRUCTIONS.md && echo "✅ Found" || echo "❌ Missing"

echo "Local React uses: .jsx inline prompts"
grep -q "narrativeAnalysis\|narrative_analysis" src/components/*.jsx && echo "✅ Found" || echo "❌ Missing"
```

**Pass:** All interfaces have current terminology
**Fail:** Any interface has old terminology

---

## Report Format

**When all checks pass:**
```
✅ Shadow Sync Verification PASSED

Files changed:
├─ MODULAR: optimization-tools/resume-analyzer/ra_resume-analyzer-display.md
├─ GOLD MASTER: PROJECT-INSTRUCTIONS.md
└─ OPTIMIZED ENTRYPOINT: Project-GUI-Instructions.md

Verification results:
├─ ✅ MODULAR rule IDs: 5 rules found
├─ ✅ GOLD MASTER sync: All 5 rules referenced
├─ ✅ OPTIMIZED ENTRYPOINT: 5 modular references
├─ ✅ Terminology: 0 matches for old terms
└─ ✅ Interfaces: All current terminology found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to commit ✅
```

**When checks fail:**
```
❌ Shadow Sync Verification FAILED

Files changed:
└─ GOLD MASTER: PROJECT-INSTRUCTIONS.md

Failed checks:
├─ ❌ MODULAR sync: Line 2521 has old "Hiring Manager Perspective"
├─ ❌ OPTIMIZED ENTRYPOINT: Reference line numbers don't match MODULAR (181-299 vs 185-305)
└─ ❌ Terminology: Found 2 matches for old term "hiring_manager_perspective"

Required fixes:
→ Update optimization-tools/resume-analyzer/ra_resume-analyzer-display.md
→ Verify line numbers match in Project-GUI-Instructions.md
→ Remove all "hiring_manager_perspective" references

Re-run: /enforce-shadow-sync --auto
```

---

## Common Failures & Fixes

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| MODULAR not in GOLD MASTER | MODULE updated, GOLD MASTER not synced | Copy exact MODULE content to GOLD MASTER |
| Wrong line numbers in ENTRYPOINT | Line ranges didn't update with MODULE changes | Find actual lines in MODULE, update references |
| Old terminology found | Incomplete terminology migration | Search all variations (exact, snake_case, camelCase) and update |
| Missing modular references | ENTRYPOINT not updated | Add or update `<modular_reference>` tags |
| Interface shows old output | Different interface reads from different source | Verify which file that interface actually uses |

---

## Before Committing

**Always run:**

```bash
/enforce-shadow-sync --auto

# Only commit if you see: ✅ Ready to commit

git add optimization-tools/ PROJECT-INSTRUCTIONS.md Project-GUI-Instructions.md
git commit -m "docs: Shadow Sync update - [what changed]"
```

---

## Linking to Protocol

This skill implements the verification steps from the **Shadow Sync Protocol**:

1. **Identify which file(s) changed** ← Check 1
2. **Verify MODULE and GOLD MASTER have identical rule logic** ← Check 2-3
3. **Verify OPTIMIZED ENTRYPOINT correctly references** ← Check 4
4. **Search for ALL terminology variations** ← Check 5
5. **Test with ACTUAL interface** ← Check 6

**Reference:** [Shadow Sync Protocol Pattern](../docs/knowledge/patterns.md#shadow-sync-protocol)

---

**Created:** 2026-01-16
**Version:** 1.0
**Purpose:** Execute (not document) Shadow Sync Protocol verification
**Success:** All checks pass → Safe to commit
