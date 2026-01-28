# Keyword Input Handling

<!-- ========================================================================== -->
<!-- MODULE: Keyword Input Handling                                            -->
<!-- ========================================================================== -->
<!-- Version: 1.1 (Extracted from Project-GUI-Instructions.md v9.1.0)          -->
<!-- Location: optimization-tools/bullet-optimizer/bo-keyword-handling.md      -->
<!-- Purpose: Handle user-provided keyword lists for bullet optimization       -->
<!-- ========================================================================== -->

## Overview

This module handles keyword optimization requests that come either with the JD or after bullet generation. Always cross-reference keywords against job history to maintain authenticity.

## User Keyword Preferences

**Referenced from:** `optimization-tools/narrative-generator/ng_summary-generation.md#user_keyword_preferences`

IF the user provides a list of specific keywords to USE or IGNORE:

1. **Strictly Enforce:** Do not use any keyword from the "IGNORE" list.
2. **Prioritize:** Ensure valid keywords from the "USE" list are integrated (if evidence exists).
3. **Custom Keywords:** If user adds a keyword not in the JD, treat it as a high-priority "USE" keyword (subject to evidence validation per Guardrail #32).

## Timing Scenarios

Keywords can be provided in two ways:
1. **WITH the JD** (included in JD text or as separate list)
2. **AFTER bullet generation** (user provides separate keyword list for optimization)

## Scenario 1: Keywords WITH the JD

### Trigger
User provides keywords alongside JD (e.g., "Here's the JD and these keywords: X, Y, Z")

### Process Steps

1. **Extract keywords** from user input (separate from JD parsing)

2. **Merge keywords** during Job Fit Analyzer JD parsing:
   - Combine user-provided keywords with JD-extracted keywords
   - Preserve user-provided keywords even if not in JD

3. **Cross-reference EACH keyword** against job history using keyword validation rules:
   - Check `tools_technologies` in positions
   - Check `hard_skills_demonstrated` in positions
   - Check `soft_skills_demonstrated` in positions
   - Check `key_achievements` in positions
   - **Apply keyword context validation** (see `optimization-tools/shared/keyword-validation.md`)

4. **Categorize keywords:**
   - ✅ **EVIDENCED:** Keyword appears in at least one position's actual work (Tier 1 or Tier 2 evidence)
   - ❌ **NOT EVIDENCED:** Keyword only in master_skills_inventory or nowhere (Tier 3 or absent)
   - ❓ **UNCLEAR:** Keyword might be evidenced but needs user confirmation

5. **Include only EVIDENCED keywords** in bullet optimization

6. **Output keyword coverage report** (see format below)

## Scenario 2: Keywords AFTER Bullets

### Trigger
User provides keywords after bullets are already generated (e.g., "Can you add these keywords: X, Y, Z?")

### Process Steps

1. **Ask user:** "Should I regenerate bullets to incorporate these keywords?"

2. **If yes, cross-reference** each keyword against job history:
   - Apply keyword context validation rules
   - Check for Tier 1 or Tier 2 evidence

3. **Flag keywords with NO evidence:**
   - Display message: "This keyword (e.g., 'Confluence') isn't evidenced in your job history."
   - Provide options:
     - (A) Skip this keyword
     - (B) Confirm you have this experience and I'll add context

4. **Wait for user response** on flagged keywords

5. **Regenerate bullets** using only:
   - Keywords with evidence (Tier 1 or Tier 2)
   - Keywords user explicitly confirmed (exception to evidence principle)

6. **Output keyword coverage report** (see format below)

## Keyword Coverage Report Format

Include this report after bullet generation when keywords were provided:

```
**Keyword Coverage Report**

✅ **Successfully Incorporated** (X keywords):
- [Keyword 1] - Position Y, Bullet Z (120 chars)
- [Keyword 2] - Position A, Bullet B (150 chars)
...

❌ **Skipped - Not Evidenced** (X keywords):
- [Keyword 3] - Reason: Not found in any position's tools, skills, or achievements
- [Keyword 4] - Reason: Only in master_skills_inventory, no position evidence
...

❓ **Requires Clarification** (X keywords):
- [Keyword 5] - Question: "You mentioned [skill], but I don't see it in your job history. Do you have experience with this?"
...
```

## Critical Rules

| Priority | Rule |
|----------|------|
| **CRITICAL** | NEVER force keywords without evidence (see keyword evidence principle) |
| **CRITICAL** | ALWAYS ask user confirmation for keywords not in job history |
| **HIGH** | ALWAYS output keyword coverage report when keywords provided |
| **HIGH** | Prefer omitting a keyword over inventing context for it |

## Evidence Validation

**Before using any keyword**, apply validation from `optimization-tools/shared/keyword-validation.md`:

1. Check verb context (Built vs Documented)
2. Check role context (Engineer vs Technical Writer)
3. Apply Interview Test
4. Assign evidence tier (1, 2, or 3)
5. Use only Tier 1 or Tier 2 evidence

## Exception Handling

**Exception to evidence requirement:**

If user explicitly says: "I have [Technology X] experience" (even if not in job history), then add it. But ONLY with explicit user confirmation.

**Why this exception exists:**
- User may have experience not captured in job history
- User may be updating their profile with new skills
- User takes responsibility for claimed experience

**How to handle:**
```
User: "Add Confluence to the bullets"
System: "I don't see Confluence in your job history. Do you have hands-on experience with it?"
User: "Yes, I use it daily"
System: "Great! I'll incorporate Confluence based on your confirmation."
```

## Integration Points

This module is referenced by:
- `optimization-tools/bullet-optimizer/bo_bullet-generation-logic.md`
- `optimization-tools/job-fit-analyzer/jfa_job-fit-assessment.md`
- `optimization-tools/narrative-generator/ng_summary-generation.md`

## Related Modules

- `optimization-tools/shared/keyword-validation.md` - Evidence validation rules
- `optimization-tools/resume-analyzer/ra_jd-parsing.md` - JD keyword extraction
