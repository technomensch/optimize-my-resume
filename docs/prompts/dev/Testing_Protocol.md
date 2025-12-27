# Prompt Testing Protocol v1.0

## Version History
- v1.0: Initial testing protocol. Created as part of v4.2 documentation reorganization. <!-- v1.0 Change -->

## Purpose

Standardized testing procedures for AI prompt changes.

## When to Test

- ✅ Modifying existing prompt logic
- ✅ Adding new analysis phases
- ✅ Changing output formats
- ✅ Updating schemas

## Test Types

### 1. Smoke Tests (5-10 min)
**Purpose:** Verify prompt doesn't break

**Procedure:**
1. Run analysis with sample resume
2. Verify all phases complete
3. Check output format

**Pass Criteria:** No errors, all sections present, readable output

### 2. Regression Tests (15-20 min)
**Key Test Cases:**

| ID | Input | Expected Output |
|-----|-------|-----------------|
| RT-001 | Resume (3 positions, 12 bullets) | All positions parsed |
| RT-002 | Resume with no metrics | Coverage: 0% |
| RT-003 | Resume with all metrics | Coverage: 100% |
| RT-004 | Low match JD (score <30) | Blocked with warning |
| RT-005 | Hard skill deficit | Blocked with message |

### 3. Feature Tests (v4.3 Specific)

| Feature | Test | Expected |
|---------|------|----------|
| Skill count | Resume with 9 hard, 3 soft | "[HARD SKILLS] Total Count: 9" |
| Bullet format | Same resume | Bullets, not commas |
| Metric tag | Bullet with metric | "✓ HAS METRICS: [text]" |
| Metric tag | Bullet without | "✗ NO METRICS: [text]" |

### 4. Edge Cases (15-20 min)

| ID | Edge Case | Expected |
|----|-----------|----------|
| EC-001 | Resume with 1 position | Parses successfully |
| EC-002 | Resume with 10 positions | All parse, display reasonably |
| EC-003 | Empty resume text | Graceful error |
| EC-004 | No skills section | Extract from experience |

## Testing Checklist

Before committing:
- [ ] Smoke tests pass
- [ ] Regression tests pass
- [ ] Feature tests pass (if applicable)
- [ ] Edge cases handled
- [ ] 508 compliant output
- [ ] Version history updated
- [ ] CHANGELOG.md updated

## Sample Test Data

### Sample Resume: Mid-Career PM
```
Sarah Johnson
Product Manager

EXPERIENCE
TechCorp | Senior PM | 2021-Present
- Led team to launch mobile app
- Collaborated with engineering
- Managed roadmap

StartupXYZ | PM | 2018-2021
- Increased engagement by 45%
- Conducted 50+ interviews
- Reduced churn from 8% to 3%

SKILLS
SQL, Python, JIRA, Agile
```

**Expected Results:**
- Experience: 6.7 years (Mid-Career)
- Hard Skills: 9
- Metric Coverage: 50%

## Related Documentation

- [Update Doc Prompt](Update_Doc_Prompt.md)
- [PARAMETERS.md](../PARAMETERS.md)
