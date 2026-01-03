# Action Verb Categories

**Version:** 6.3.0 <!-- v6.3.0 Change: Added Guardrail #9 and secondary implementation for #7, #24 -->
**Applies to:** All Modes

---

## Overview

Each resume bullet should start with a strong action verb that falls into one of five strategic categories. These categories help ensure diversity in how achievements are presented and provide a framework for analyzing verb usage patterns across the resume.

---

## The Five Categories

### 1. Built (Blue) 🔵

**Purpose:** Demonstrates creation, construction, and establishment of new systems, products, or processes.

**Top 10 verbs:** built, developed, designed, launched, established, implemented, created, engineered, architected, pioneered

**Note:** Semantic detection will categorize unlisted verbs that mean "creating/building something new"

**Color Indicator:** 🔵 Blue  
**How to mark:** When identifying verbs in this category, prefix with blue circle emoji  
**Example in bullet:** "🔵 **Built** new customer onboarding system reducing setup time 40%"  
**Example in distribution:** "Built 🔵: ████░░░░░░ 2 bullets (33%)"

---

### 2. Lead (Yellow) 🟡

**Purpose:** Shows ability to drive initiatives, guide teams, and champion efforts.

**Top 10 verbs:** led, directed, spearheaded, drove, championed, headed, piloted, steered, mentored, coached

**Note:** Semantic detection will categorize unlisted verbs that mean "driving/guiding teams or initiatives"

**Color Indicator:** 🟡 Yellow  
**How to mark:** When identifying verbs in this category, prefix with yellow circle emoji  
**Example in bullet:** "🟡 **Spearheaded** cross-functional initiative with 5 departments"  
**Example in distribution:** "Lead 🟡: ██████░░░░ 3 bullets (50%)"

---

### 3. Managed (Purple) 🟣

**Purpose:** Demonstrates oversight, resource coordination, and operational control.

**Top 10 verbs:** managed, supervised, coordinated, oversaw, administered, orchestrated, facilitated, organized, planned, prioritized

**Note:** Semantic detection will categorize unlisted verbs that mean "managing/overseeing/coordinating resources"

**Color Indicator:** 🟣 Purple  
**How to mark:** When identifying verbs in this category, prefix with purple circle emoji  
**Example in bullet:** "🟣 **Managed** cross-functional team of 12 engineers across 3 time zones"  
**Example in distribution:** "Managed 🟣: ████░░░░░░ 4 bullets (17%)"

---

### 4. Improved (Green) 🟢

**Purpose:** Shows continuous improvement, optimization, and measurable enhancement of existing systems.

**Top 10 verbs:** optimized, improved, streamlined, enhanced, transformed, upgraded, refined, boosted, increased, reduced

**Note:** Semantic detection will categorize unlisted verbs that mean "making something better/optimizing"

**Color Indicator:** 🟢 Green  
**How to mark:** When identifying verbs in this category, prefix with green circle emoji  
**Example in bullet:** "🟢 **Optimized** database queries, reducing page load time 60%"  
**Example in distribution:** "Improved 🟢: ████░░░░░░ 4 bullets (17%)"

---

### 5. Collaborate (Pink) 🩷

**Purpose:** Demonstrates partnership, teamwork, and cross-functional cooperation.

**Top 10 verbs:** collaborated, partnered, cooperated, coordinated, facilitated, liaised, worked with, teamed with, consulted, advised

**Note:** Semantic detection will categorize unlisted verbs that mean "partnering/working together"

**Color Indicator:** 🩷 Pink  
**How to mark:** When identifying verbs in this category, prefix with pink heart emoji  
**Example in bullet:** "🩷 **Collaborated** with Sales and Marketing to launch GTM strategy"  
**Example in distribution:** "Collaborate 🩷: ██░░░░░░░░ 2 bullets (8%)"

---

## Category Assignment Guidelines

Verbs indicating different aspects of organizational work should be categorized based on their primary focus:

| Focus | Category |
|-------|----------|
| Driving/guiding/championing a team effort | **Lead (Yellow)** |
| Managing/overseeing/coordinating resources | **Managed (Purple)** |
| Partnering/collaborating cross-functionally | **Collaborate (Pink)** |
| Building/creating something new | **Built (Blue)** |
| Improving/optimizing processes | **Improved (Green)** |

---

## Verb Category Detection

**Objective:** Identify action verbs in the resume that semantically belong to one of the five categories but are not explicitly listed above.

**Detection Process:**

For each bullet point in the resume:

1. **Extract the starting verb** (first word of the bullet, excluding articles)
2. **Check if verb is in the defined category lists** (Built, Lead, Managed, Improved, Collaborate)
3. **If NOT in lists, analyze semantic meaning:**
   - Does it mean "creating/building something new"? → **Built (Blue) 🔵**
   - Does it mean "driving/guiding/championing teams or initiatives"? → **Lead (Yellow) 🟡**
   - Does it mean "managing/overseeing/coordinating resources"? → **Managed (Purple) 🟣**
   - Does it mean "making something better/optimizing"? → **Improved (Green) 🟢**
   - Does it mean "partnering/collaborating/working together"? → **Collaborate (Pink) 🩷**
4. **If it matches a category semantically, flag for review:**
   - Report the verb
   - State which category it belongs to
   - Provide reasoning based on context

---

## Skill & Verb Quality Gates (Guardrails)

### Guardrail #9: Verb Diversity Per-Position Enforcement

> **Implementation Target:** Add to [verb-categories.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/verb-categories.md) (primary) and [format-rules.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/format-rules.md) (secondary).

**Instruction Text:**
```xml
<position_verb_diversity_guardrail>
  <priority>HIGH</priority>
  <instruction>
    Within a SINGLE position, no verb category may be used more than once.
  </instruction>
  
  <validation_logic>
    FOR EACH position:
      verb_categories_used = []
      
      FOR EACH bullet in position:
        category = identify_verb_category(bullet)
        
        IF category IN verb_categories_used:
          FLAG as "Duplicate category in position [N]"
          REGENERATE bullet using different category
        ELSE:
          verb_categories_used.append(category)
  </validation_logic>
  
  <exception>
    If position has 5+ bullets, allow ONE category to repeat (but still prefer diversity)
  </exception>
</position_verb_diversity_guardrail>
```

### Guardrail #7: Skill Categorization Mutual Exclusivity (Secondary)

> **Implementation Target:** Add to [jd-parsing-17-point.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-1/jd-parsing-17-point.md) (primary) and [verb-categories.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/verb-categories.md) (secondary).

**Instruction Text:**
```xml
<skill_classification_guardrail>
  <instruction>
    A single skill term cannot exist in both <hard_skills_demonstrated> and <soft_skills_demonstrated> within the same position.
  </instruction>
  <auto_correction>
    IF duplicates found:
    - Technical/Tools/Hard Skills -> Keep in <hard_skills_demonstrated>, remove from Soft.
    - Behavioral/Leadership/Interpersonal -> Keep in <soft_skills_demonstrated>, remove from Hard.
  </auto_correction>
</skill_classification_guardrail>
```

---

## Quality Gate Iteration & Loop Prevention

The following principles ensure that diversity rules do not cause infinite loops during regeneration.

### Loop Prevention Principles for Alternatives (#24 Secondary)

> **Implementation Target:** Add to [evidence-matching.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/phases/phase-2/evidence-matching.md) (primary) and [verb-categories.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/core/verb-categories.md) (secondary).

```xml
<loop_prevention_principles>
  <principle id="soft_limits">
    Use SOFT constraints (deprioritize) not HARD blocks for global category counts.
    Position-level: Hard constraint (never repeat within position)
    Global-level: Soft constraint (deprioritize, don't block entirely)
  </principle>
  
  <principle id="escape_hatch">
    If ALL categories are "unavailable", fall back to least-used category.
    Never return "no valid alternatives" error.
  </principle>
  
  <principle id="one_way_data_flow">
    Alternatives guardrail READS verb inventory but does NOT WRITE to it.
    Writing only occurs when user ACCEPTS a recommendation.
  </principle>
  
  <principle id="no_premature_counting">
    Do NOT count alternatives as "used" before user selection.
    Only accepted bullets update the category inventory.
  </principle>
</loop_prevention_principles>
```

### Anti-Patterns to Avoid
| Anti-Pattern | Why It Causes Loops |
|--------------|---------------------|
| Hard blocking categories after N uses | Could result in "no valid alternatives" error |
| Auto-regeneration when alternatives don't meet diversity | Creates feedback loop with quality gate |
| Counting alternatives before user accepts | Depletes inventory before selections made |

---

## Distribution Targets

| Category | Target % | Acceptable Range |
|----------|----------|------------------|
| Built (Blue) | 20% | 13-27% |
| Lead (Yellow) | 20% | 13-27% |
| Managed (Purple) | 20% | 13-27% |
| Improved (Green) | 20% | 13-27% |
| Collaborate (Pink) | 20% | 13-27% |

**Diversity Thresholds:**
- **Excellent diversity:** All 5 categories represented, no category >40% or <10%
- **Good diversity:** 4-5 categories represented, balanced distribution
- **Needs improvement:** 1-2 categories dominate (>50%), or <3 categories total
- **Red flag:** Only 1-2 categories represented across entire resume

---

## Weak Verbs to Avoid

- Responsible for
- Assisted with
- Helped
- Worked on
- Participated in (unless demonstrating collaboration with specific impact)

---

## Rebalancing Rules

```xml
<recommendation_criteria>
  <rule>Prioritize changing bullets where verb category doesn't naturally match the achievement type</rule>
  <rule>Convert "Built" bullets to "Improved" if optimizing existing systems rather than creating new ones</rule>
  <rule>Convert "Built" to "Managed" if overseeing ongoing operations rather than one-time creation</rule>
  <rule>Convert weaker bullets first (those with fewer JD matches)</rule>
  <rule>Preserve strongest bullets in their original verb categories when possible</rule>
  <rule>Aim for 13-27% per category after rebalancing</rule>
  <rule>Ensure rewritten bullets maintain character count under 210</rule>
</recommendation_criteria>
```
