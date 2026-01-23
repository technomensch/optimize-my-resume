# Action Verb Taxonomy

<!-- ========================================================================== -->
<!-- MODULE: Action Verb Taxonomy                                              -->
<!-- ========================================================================== -->
<!-- Version: 1.0 (Extracted from Project-GUI-Instructions.md v9.2.0)          -->
<!-- Location: optimization-tools/shared/shared_verb-taxonomy.md               -->
<!-- Purpose: Define action verb categories for resume bullet classification   -->
<!-- ========================================================================== -->

## Overview

This module defines the standard taxonomy of action verbs used across all optimization tools for categorizing and color-coding resume bullets.

## Core Instruction

Every bullet must start with a strong verb from these categories. Track distribution across resume.

## Verb Categories

### Category 1: Built (Blue)

**Description:** Creates new systems/products/processes

**Verbs:**
- built
- developed
- designed
- launched
- established
- implemented
- created
- engineered
- architected
- pioneered

**Color Code:** Blue
**When to use:** For accomplishments involving creation of new systems, products, processes, or capabilities

---

### Category 2: Lead (Yellow/Orange)

**Description:** Drives initiatives, guides teams

**Verbs:**
- led
- directed
- spearheaded
- drove
- championed
- headed
- piloted
- steered
- mentored
- coached

**Color Code:** Yellow/Orange
**When to use:** For accomplishments involving leadership, initiative-driving, or team guidance

---

### Category 3: Managed (Purple)

**Description:** Oversees resources, coordinates operations

**Verbs:**
- managed
- supervised
- coordinated
- oversaw
- administered
- orchestrated
- facilitated
- organized
- planned
- prioritized

**Color Code:** Purple
**When to use:** For accomplishments involving resource management, operational oversight, or coordination

---

### Category 4: Improved (Green)

**Description:** Optimizes and enhances existing systems

**Verbs:**
- optimized
- improved
- streamlined
- enhanced
- transformed
- upgraded
- refined
- boosted
- increased
- reduced

**Color Code:** Green
**When to use:** For accomplishments involving optimization, enhancement, or measurable improvements

---

### Category 5: Collaborate (Pink)

**Description:** Partners cross-functionally, works with teams

**Verbs:**
- collaborated
- partnered
- cooperated
- coordinated
- facilitated
- liaised
- worked with
- teamed with
- consulted
- advised

**Color Code:** Pink
**When to use:** For accomplishments emphasizing cross-functional partnership or advisory work

---

## Verbs to Avoid

These weak or passive verbs should NOT be used in resume bullets:

- Responsible for
- Assisted
- Helped
- Worked on
- Participated in

**Why avoid:** These verbs are vague, passive, and don't convey clear ownership or impact.

---

## Verb Diversity Rule

When generating recommendations for 2+ bullets in a single session:

1. **Use each action verb category only once** across the primary recommendations for each position or job
2. **Maximize diversity** by selecting different categories for each bullet
3. **Prioritize matching** the verb category to the achievement type

**Example (Good):**
- Position 1, Bullet 1: [Built] Developed new API...
- Position 1, Bullet 2: [Lead] Spearheaded migration...
- Position 1, Bullet 3: [Improved] Optimized database queries...

**Example (Bad - Lacks Diversity):**
- Position 1, Bullet 1: [Built] Developed new API...
- Position 1, Bullet 2: [Built] Created microservices...
- Position 1, Bullet 3: [Built] Implemented CI/CD...

---

## Verb Distribution Threshold Rule

**Priority:** HIGH

**Rule:** Any action verb category representing less than 5% of total bullets should be flagged as a TWEAK in analysis reports.

**Calculation:**
```
Percentage = (bullets_in_category / total_bullets) * 100
IF percentage < 5% THEN flag as TWEAK
```

**Example:**
Resume with 20 total bullets:
- Built: 8 (40%) → Over-represented
- Lead: 1 (5%) → At threshold
- Managed: 6 (30%) → Over-represented
- Improved: 4 (20%) → Well balanced
- Collaborate: 1 (5%) → At threshold

**Suggestion:** "Consider adding more 'Collaborate' verbs to balance distribution"

---

## Visual Representation Guidelines

Used by Resume Analyzer and other tools to display verb balance.

### Balance Levels

#### Level 1: Over-Represented
- **Range:** 28% - 100%
- **Status:** Over-Represented
- **Icon:** ⚠️ AlertTriangle
- **Color:** Red
- **Message:** "Too many - diversify"

#### Level 2: Well Balanced
- **Range:** 13% - 27%
- **Status:** Well Balanced
- **Icon:** ✓ CheckCircle
- **Color:** Green
- **Message:** "Well balanced"

#### Level 3: Under-Represented
- **Range:** 5% - 12%
- **Status:** Under-Represented
- **Icon:** ⚠️ AlertTriangle
- **Color:** Yellow/Orange
- **Message:** "Consider adding more"

#### Level 4: Severely Under-Represented
- **Range:** 0% - 4%
- **Status:** Severely Under-Represented
- **Icon:** ❌ XCircle
- **Color:** Red
- **Message:** "Critical gap"

---

## Color Coding Reference

These verb categories are used for visual color-coding in resume displays across all tools:

| Verb Category | Color | Hex Code (Optional) |
|--------------|-------|---------------------|
| Built | Blue | #3B82F6 |
| Lead | Orange | #F59E0B |
| Managed | Purple | #8B5CF6 |
| Improved | Green | #10B981 |
| Collaborate | Pink | #EC4899 |

**When displaying bullets** (Resume Analyzer, Bullet Optimizer, Job Fit Analyzer):
- Color the first verb according to its category
- Use consistent color scheme across all tools
- Include category label for accessibility

---

## Integration Points

This module is referenced by:
- `optimization-tools/resume-analyzer/ra_resume-analyzer-display.md`
- `optimization-tools/bullet-optimizer/bo_bullet-generation-logic.md`
- `optimization-tools/job-fit-analyzer/jfa_job-fit-assessment.md`

When any tool analyzes or generates bullets, it should:
1. Classify the action verb using this taxonomy
2. Apply color coding per the scheme above
3. Track distribution across all bullets
4. Flag imbalances per the threshold rule
