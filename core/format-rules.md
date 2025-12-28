# Format Rules Configuration

**Version:** 5.0  
**Applies to:** All Modes

---

## Critical Formatting Rules

```xml
<critical_formatting_rules>
  <rule id="no_em_dashes" priority="critical">
    NEVER use em-dashes (—) anywhere in the output. Use hyphens (-) or rephrase sentences instead.
  </rule>
  
  <rule id="colored_verb_categories" priority="high">
    Display action verb categories with their color names in parentheses:
    - Built (Blue)
    - Lead (Orange)
    - Managed (Purple)
    - Improved (Green)
    - Collaborate (Pink)
  </rule>
</critical_formatting_rules>
```

---

## Character Limits

| Element | Limit | Notes |
|---------|-------|-------|
| **Bullet point** | ≤210 characters | Hard limit for ATS compatibility |
| **Bullet point** | ~20-28 words | Approximate word count |
| **Professional summary** | 300-350 characters | Strict range |

---

## Word Count Targets

```xml
<total_word_count_constraint>
  Total word count across ALL bullets must not exceed 350-500 words for work experience section
</total_word_count_constraint>
```

| Experience Level | Word Count Target |
|------------------|-------------------|
| New Graduate (0-1 year) | 300-400 words |
| Early Career (1-5 years) | 350-500 words |
| Mid-Career (6-15 years) | 350-500 words |
| Senior (15+ years) | 500-650 words |

---

## Bullet Count Per Position

```xml
<bullet_count_per_position>
  <baseline_rule>Default to 3 bullets per position</baseline_rule>
  
  <minimum_bullets_per_position>
    <rule priority="high">Each position should have at least 2 bullets minimum</rule>
    <exception>Only use 1 bullet if:
      - Word count is at maximum (375 words) AND
      - The position is older (4+ positions back) AND
      - That single bullet is highly relevant to the JD
    </exception>
    <rationale>A single bullet makes a position look insignificant; 2 bullets minimum maintains professional appearance while showing breadth of experience</rationale>
  </minimum_bullets_per_position>
  
  <strategic_expansion>
    <rule>Only increase to 4-5 bullets if the additional bullets will materially strengthen the application against the specific job description</rule>
    <constraint>No more than 2 jobs should have 5 bullets</constraint>
    <constraint>No more than 2 jobs should have 4 bullets</constraint>
    <rationale>This ensures the resume remains focused on strongest matches without diluting impact with weaker bullets</rationale>
  </strategic_expansion>
  
  <decision_framework>
    <increase_to_5_bullets>
      Only if position has exceptionally strong match to JD AND all 5 bullets directly address critical job requirements
    </increase_to_5_bullets>
    <increase_to_4_bullets>
      Only if position has strong match to JD AND 4th bullet adds meaningful value beyond the core 3
    </increase_to_4_bullets>
    <keep_at_3_bullets>
      Default for most positions, especially if matches are good but not exceptional
    </keep_at_3_bullets>
  </decision_framework>
  
  <ordering>Within each position, order bullets from strongest match to weakest match for the specific JD</ordering>
</bullet_count_per_position>
```

---

## Position Ordering

```xml
<position_ordering>
  <critical_rule>Positions MUST be displayed in REVERSE CHRONOLOGICAL ORDER</critical_rule>
  <definition>Reverse chronological = Most recent job FIRST (Position 1), oldest job LAST</definition>
  <source>Pull position order from /mnt/project/claude_generated_job_history_summaries.txt where:
    - Job 1 = Most recent contract
    - Job 6 = Oldest contract (USAID)
  </source>
  <example>
    Correct order: Job 1 (DHS) then Job 2 (Space Force) then Job 3 (Agile BA) then Job 4 (KM Program) then Job 5 (DoE SOC) then Job 6 (USAID)
    
    Incorrect order: Job 6 (USAID) then Job 5 (DoE SOC) etc.
  </example>
</position_ordering>
```

---

## Validation Requirements

| Requirement | Target | Priority |
|-------------|--------|----------|
| Character limit | <210 chars | Critical |
| Word count range | ~20-28 words | Critical |
| Total word count | 350-500 words | Critical |
| No em-dashes used | None allowed | Critical |
| Positions ordered | Reverse chronological | Critical |
| Bullets ordered by strength | Within each position | High |
| Max 2 jobs with 5 bullets | ≤2 | Critical |
| Max 2 jobs with 4 bullets | ≤2 | Critical |
| Min 2 bullets per position | ≥2 | High |
| Copy-paste ready | Code blocks used | High |
| Reasoning included | Why this matches | High |
