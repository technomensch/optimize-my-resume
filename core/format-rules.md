# Format Rules Configuration

**Version:** 6.5.1 <!-- v6.5.1 Change: Aligned with Analyzer Output Overhaul -->
**Applies to:** All Phases

---

## Technical Quality Assurance Rules

```xml
<quality_assurance_rules>
  <phrase_variation_rule>
    <priority>high</priority>
    <instruction>Vary phrasing for repeated metrics/achievements (max 2 exact repetitions).</instruction>
  </phrase_variation_rule>

  <symbol_consistency_rule>
    <priority>high</priority>
    <instruction>Use ~ for approximation; no escaped characters (\~, \%, \+).</instruction>
  </symbol_consistency_rule>

  <verb_tense_rule>
    <priority>critical</priority>
    <instruction>All bullets must start with past-tense action verbs; no gerunds as main verbs.</instruction>
  </verb_tense_rule>

  <keyword_diversity_rule>
    <priority>high</priority>
    <instruction>Avoid repeating summary keywords in bullets unless critical for ATS.</instruction>
  </keyword_diversity_rule>

  <pre_output_quality_checklist>
    <priority>high</priority>
    <instruction>Final scan for formatting, grammar, and keyword duplication.</instruction>
  </pre_output_quality_checklist>

  <automatic_quality_gate> <!-- v6.1.10 Change: Added automatic quality enforcement with regeneration loop -->
    <priority>critical</priority>
    <instruction>Mandatory quality gate before output - checks quality, verb diversity, regenerates if issues found.</instruction>
  </automatic_quality_gate>

  <automatic_plain_text_export> <!-- v6.1.10 Change: Added automatic plain text file generation -->
    <priority>high</priority>
    <instruction>Auto-generate plain text export after quality gate passes.</instruction>
  </automatic_plain_text_export>

  <secondary_grammar_check_rule> <!-- v6.1.7 Change: Added mandatory secondary grammar check warning -->
    <priority>high</priority>
    <instruction>Include "[RECOMMENDED] Perform a secondary grammar check..." warning in all output.</instruction>
  </secondary_grammar_check_rule>

  <budget_enforcement_guardrail> <!-- v6.3.0 Change: Guardrail #8 - Budget Compliance Gate -->
    <priority>HIGH</priority>
    <trigger>Before presenting final output</trigger>
    <per_bullet_validation>
      FOR EACH bullet:
        IF character_count < 100 OR character_count > 210:
          FLAG as "Out of range" and REGENERATE
      RULE: Zero tolerance for bullets outside 100-210 character range
    </per_bullet_validation>
    <total_word_count_validation>
      total_words = SUM(all_bullets.word_count)
      IF total_words > 500:
        STOP and apply reduction strategy:
          1. Identify oldest/weakest positions (4+ back)
          2. Reduce bullets from 3→2 or 2→1 for those positions
          3. Recalculate until total_words <= 500
      IF total_words < 350:
        FLAG as "Underutilized" - consider adding bullets to strongest positions
    </total_word_count_validation>
  </budget_enforcement_guardrail>

  <quality_gate_failure_protocol> <!-- v6.3.0 Change: Guardrail #14 - Infinite Loop Prevention -->
    <priority>CRITICAL</priority>
    <instruction>If quality gate fails after 3 iterations, provide diagnostic output to user.</instruction>
    <failure_handling>
      IF iterations >= 3 AND issues_remain:
        STOP regeneration loop
        OUTPUT to user:
          "⚠️ Quality Gate Alert
          After 3 regeneration attempts, the following issues persist:
          - [List specific issues: e.g., 'Position 2 has duplicate verb categories']
          - [List specific issues: e.g., 'Bullet 5 exceeds 210 character limit']
          This may indicate:
          1. Insufficient content in job history for this position
          2. JD requirements conflict with available experience
          3. Need for manual refinement
          Would you like me to:
          A) Present best attempt with warnings
          B) Skip this position
          C) Ask clarifying questions about [specific issue]"
    </failure_handling>
  </quality_gate_failure_protocol>

  <phrase_repetition_enforcement_guardrail> <!-- v6.3.0 Change: Guardrail #15 - Maximum-2-Occurrences Scanner -->
    <priority>HIGH</priority>
    <instruction>Scan ALL bullets and summary for repeated multi-word phrases (3+ words).</instruction>
    <detection_logic>
      1. Extract all 3+ word sequences from bullets and summary
      2. Normalize: lowercase, remove punctuation
      3. Count occurrences of each sequence
      4. IF any sequence appears 3+ times:
           FLAG as "Excessive repetition: '[phrase]' appears [N] times"
           APPLY variation strategies from phrase_variation_rule
    </detection_logic>
    <variation_requirements>
      FOR sequences appearing 3+ times:
        - Keep in strongest/most-impactful position only
        - Replace in other positions with different achievements from those job histories
        - OR apply verb/format/structure variation strategies
    </variation_requirements>
  </phrase_repetition_enforcement_guardrail>

  <em_dash_validation_guardrail> <!-- v6.3.0 Change: Guardrail #22 - No Em-Dash Scanner -->
    <priority>HIGH</priority>
    <instruction>Scan ALL output text for em-dash characters (—) before presenting to user.</instruction>
    <detection_and_correction>
      SCAN final output for Unicode character U+2014 (—)
      IF em-dash found:
        FOR EACH occurrence:
          REPLACE with hyphen (-) OR rephrase sentence
      COMMON PATTERNS TO FIX:
        - "experience — including" → "experience, including" OR "experience - including"
        - "skills—Python" → "skills: Python" OR "skills - Python"
        - "2020—2023" → "2020-2023"
    </detection_and_correction>
    <also_check>
      - En-dash (–) U+2013: Replace with hyphen for ranges
      - Curly quotes (" ") U+201C/U+201D: Replace with straight quotes
      - Curly apostrophe (') U+2019: Replace with straight apostrophe
    </also_check>
  </em_dash_validation_guardrail>
</quality_assurance_rules>
```

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

  <rule id="acronym_expansion" priority="moderate"> <!-- v6.3.0 Change: Guardrail #20 - First-Use Spell-Out Rule -->
    Industry-standard acronyms (AWS, SQL, API) can be used as-is.
    Domain-specific or ambiguous acronyms must be spelled out on first use.
    <standard_acronyms_allowed>
      AWS, SQL, API, REST, JSON, XML, HTML, CSS, CI/CD, DevOps, SaaS, PaaS,
      ATS, KPI, ROI, SLA, ETL, GDPR, HIPAA, SOC, NIST
    </standard_acronyms_allowed>
    <expansion_required>
      FOR acronyms NOT in standard list:
        - First mention: "Federal Information Security Management Act (FISMA)"
        - Subsequent: "FISMA"
      EXCEPTION: If acronym appears in JD without expansion, match JD format
    </expansion_required>
    <validation>
      SCAN all bullets for uppercase 2-5 letter sequences
      IF sequence NOT in standard_acronyms_allowed:
        IF first occurrence in resume:
          FLAG: "Acronym '[ABC]' should be spelled out on first use"
    </validation>
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
  
  <recency_weighting_guardrail> <!-- v6.3.0 Change: Guardrail #12 - Freshness Priority Rule -->
    <priority>MODERATE</priority>
    <instruction>Allocate bullets based on position recency and JD relevance.</instruction>
    <allocation_rules>
      <rule id="position_1_priority">
        Position 1 (most recent) should have:
          - Minimum 3 bullets
          - At least 2 quantified metrics
          - Strongest JD keyword matches
      </rule>
      <rule id="position_4_plus_constraint">
        Positions 4+ (older roles) should have:
          - Maximum 2 bullets (unless exceptionally relevant to JD)
          - Only include if directly relevant to JD requirements
      </rule>
      <validation>
        IF Position 1 has fewer bullets than Position 3+:
          FLAG as "Inverted recency priority" and rebalance
      </validation>
    </allocation_rules>
  </recency_weighting_guardrail>
  
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

  <chronological_validation_guardrail> <!-- v6.3.0 Change: Guardrail #2 - Mandatory Pre-Draft Sorting Logic -->
    <priority>CRITICAL</priority>
    <pre_draft_step>
      Before drafting ANY position content, generate a "Sort Validation Table" in your internal thinking process:
      | Role Rank | Position ID | End Date | Start Date |
      |-----------|-------------|----------|------------|
      | 1 (Newest)| [ID]        | [Date]   | [Date]     |
      | 2         | [ID]        | [Date]   | [Date]     |
      
      Rule: Sort Order must be 'End Date' DESCENDING. If any End Date is later than the End Date of the position above it, the sort is invalid.
    </pre_draft_step>
  </chronological_validation_guardrail>
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
| Secondary Grammar Check | "[RECOMMENDED]..." warning included | High | <!-- v6.1.7 Change: Added secondary grammar check requirement -->
| Quality Gate Passed | All checks pass before output | Critical | <!-- v6.1.10 Change: Added quality gate validation -->
| Verb Diversity Complete | All 5 categories represented | Critical | <!-- v6.1.10 Change: Added verb diversity validation -->
| No Repeated Verbs in Position | Different categories per position | High | <!-- v6.1.10 Change: Added verb repetition check -->
| Plain Text Export Generated | Auto-created after quality gate | High | <!-- v6.1.10 Change: Added plain text export requirement -->
