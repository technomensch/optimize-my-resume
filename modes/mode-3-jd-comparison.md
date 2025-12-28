# Mode 3: JD Comparison

<!-- Version: 5.0 -->
<!-- Purpose: Compare job description to user's experience and generate tailored bullets -->
<!-- Last Updated: December 2024 -->

---

## Mode Definition

```xml
<mode id="3" name="jd_comparison">
  <triggers>
    - User provides job description + references job number/company
    - User says: "compare this JD to my experience", "create bullets for this job"
    - User uploads JD and asks for tailored bullets
  </triggers>
  
  <behavior>
    - Pull from /mnt/project/claude_generated_job_history_summaries.txt if company mentioned
    - Perform PRELIMINARY FIT ASSESSMENT before generating bullets (v4.0)
    - If critical gaps found, ask user about missing experience (v4.0)
    - Only proceed with bullet generation if fit is adequate (v4.0)
    - Perform JD match analysis
    - Identify gaps and strengths
    - Generate optimized bullets tailored to JD keywords
    - Apply verb diversity rule
  </behavior>
</mode>
```

---

## Pre-Generation Fit Assessment

```xml
<mode_3_pre_generation_assessment>
  
  <purpose>
    Evaluate job description fit against user's experience BEFORE generating bullets. Stop early if critical domain/technology gaps exist to avoid wasting tokens on positions the user shouldn't apply for.
  </purpose>

  <execution_order priority="CRITICAL">
    This assessment MUST run BEFORE any bullet generation. Do not generate bullets until this assessment is complete and proceed decision is made.
  </execution_order>
</mode_3_pre_generation_assessment>
```

---

## Phase 1: Initial Fit Assessment

```xml
<phase_1_initial_fit_assessment>
  
  <step number="1" name="extract_critical_requirements">
    <purpose>Identify non-negotiable or heavily emphasized requirements from JD</purpose>
    
    <what_to_extract>
      <domain_expertise>
        Industry-specific knowledge (e.g., "power management", "energy systems", "healthcare", "financial services")
      </domain_expertise>
      
      <specialized_platforms>
        Specific enterprise systems (e.g., "SAP", "Salesforce", "Epic", "Workday", "OpenText")
      </specialized_platforms>
      
      <programming_languages>
        Languages with specific experience levels (e.g., "5+ years Python", "expert-level Java")
      </programming_languages>
      
      <technical_specializations>
        Niche technical areas (e.g., "data center operations", "telemetry systems", "RAG-based AI", "blockchain")
      </technical_specializations>
      
      <certifications>
        Required credentials (e.g., "PMP required", "must have security clearance")
      </certifications>
      
      <industry_experience>
        Sector-specific background (e.g., "3+ years in manufacturing", "federal government experience required")
      </industry_experience>
    </what_to_extract>
    
    <categorization>
      <red_flag priority="critical">
        - Marked as "required" or "must have"
        - Appears multiple times throughout JD
        - In job title or role overview section
        - Clearly foundational to role success
      </red_flag>
      
      <yellow_flag priority="moderate">
        - Marked as "preferred" or "nice to have"
        - Mentioned once or twice
        - In desired/bonus qualifications section
        - Would help but not essential
      </yellow_flag>
    </categorization>
  </step>

  <step number="2" name="compare_against_job_history">
    <purpose>Check if user has the critical requirements in their background</purpose>
    
    <process>
      1. Search /mnt/project/claude_generated_job_history_summaries.txt for each critical requirement
      2. Flag requirements NOT found in job history
      3. Note strength of match for requirements that ARE found (tangential vs direct)
    </process>
    
    <matching_criteria>
      <direct_match>Exact technology/domain/platform mentioned in job history</direct_match>
      <tangential_match>Related but not identical (e.g., "Google Workspace" when JD wants "Microsoft 365")</tangential_match>
      <transferable_match>Conceptually similar (e.g., "content management" when JD wants "records management")</transferable_match>
      <no_match>No evidence of experience in this area</no_match>
    </matching_criteria>
  </step>

  <step number="3" name="calculate_preliminary_fit">
    <purpose>Determine initial fit percentage before user interaction</purpose>
    
    <scoring_methodology>
      <core_qualifications weight="50%">
        - Required qualifications match
        - Years of experience alignment
        - Role type match (BA, TW, PM, etc.)
      </core_qualifications>
      
      <critical_requirements weight="30%">
        - Domain expertise requirements
        - Specialized platforms/technologies
        - Industry experience
      </critical_requirements>
      
      <preferred_qualifications weight="20%">
        - Nice-to-have skills
        - Bonus certifications
        - Additional technologies
      </preferred_qualifications>
    </scoring_methodology>
    
    <fit_thresholds>
      <excellent range="90-100%">Strong match, proceed automatically</excellent>
      <good range="80-89%">Good match, FLAG gaps and ASK user (full gap analysis)</good>
      <weak range="75-79%">Weak match, STOP with brief summary (no detailed analysis)</weak>
      <poor range="0-74%">Poor match, STOP with ultra-brief summary (minimal explanation)</poor>
    </fit_thresholds>
  </step>

  <step number="4" name="decision_point">
    <purpose>Decide whether to proceed, ask user, or stop (and with what level of detail)</purpose>
    
    <decision_tree>
      <if_fit_90_or_above>
        <action>PROCEED to bullet generation automatically</action>
        <rationale>Good fit, user should apply</rationale>
      </if_fit_90_or_above>
      
      <if_fit_80_to_89>
        <action>FLAG gaps and ASK user (proceed to Phase 2 - Full Gap Investigation)</action>
        <rationale>Moderate fit with addressable gaps</rationale>
      </if_fit_80_to_89>
      
      <if_fit_75_to_79>
        <action>STOP with BRIEF SUMMARY (skip to Phase 3A - Brief Exit Output)</action>
        <rationale>Weak match, not worth detailed investigation</rationale>
        <no_user_override>Do not offer to generate bullets anyway</no_user_override>
      </if_fit_75_to_79>
      
      <if_fit_74_or_below>
        <action>STOP with ULTRA-BRIEF SUMMARY (skip to Phase 3B - Ultra-Brief Exit Output)</action>
        <rationale>Poor match, fundamental mismatch</rationale>
        <no_user_override>Do not offer to generate bullets anyway</no_user_override>
      </if_fit_74_or_below>
    </decision_tree>
  </step>

</phase_1_initial_fit_assessment>
```

---

## Phase 2: Gap Investigation (80-89% fit only)

```xml
<phase_2_gap_investigation>
  
  <trigger_conditions>
    - Preliminary fit is 80-89% (moderate match), OR
    - Any RED FLAG requirement is missing AND fit is 80-89%
  </trigger_conditions>

  <output_format_for_user>
    ⚠️ **PRELIMINARY FIT ASSESSMENT: [XX]% - POTENTIAL GAPS IDENTIFIED**

    I've analyzed this job description against your background before generating bullets. This role heavily emphasizes **[domain/technology/specialization]**, which I don't see in your job history.

    **Critical Requirements from JD:**
    - [Requirement 1]: [❌ Not found / ⚠️ Tangential match / ✅ Found]
    - [Requirement 2]: [Status]
    - [Requirement 3]: [Status]

    **Questions:**

    **1. Do you have experience with [domain/technology]?**
    
    If yes, please describe:
    - What did you do?
    - How long?
    - What was the scope/scale?
    - Any measurable outcomes?
    - Which tools/technologies did you use?

    **2. [Additional questions for other gaps]**

    Based on your responses, I'll recalculate the fit and decide whether to generate tailored bullets or recommend skipping this position.
  </output_format_for_user>

  <user_response_handling>
    
    <if_user_confirms_experience>
      <action>Capture experience using probing questions</action>
      <process>
        1. Use probing question framework
        2. Gather: What, How long, Scale, Tools, Outcomes, Context
        3. Generate mini job summary entry
        4. Append to job history file
        5. Recalculate fit percentage with new information
        6. Proceed to decision based on updated fit
      </process>
    </if_user_confirms_experience>

    <if_user_denies_experience>
      <action>Present choice to user</action>
      <options>
        A) Generate bullets anyway - Not recommended
        B) Skip this application - Recommended
      </options>
    </if_user_denies_experience>

  </user_response_handling>

</phase_2_gap_investigation>
```

---

## Phase 3A: Brief Exit Output (75-79% fit)

```xml
<phase_3a_brief_exit_output>
  
  <when_to_use>
    Fit percentage is 75-79% (weak match)
  </when_to_use>

  <output_format>
    ⚠️ **APPLICATION STOPPED - INSUFFICIENT MATCH**

    **Job:** [Job Title] at [Company]
    **Overall Fit:** [XX]% (Weak Match)

    ---

    **Why This Isn't a Good Match:**

    [1-2 sentence explanation of fundamental mismatch]

    **Critical Missing Requirements:**
    - [Gap 1]
    - [Gap 2]
    - [Gap 3]
    - [Gap 4]

    **Your Strengths Lie In:**
    - [Strength 1]
    - [Strength 2]
    - [Strength 3]
    - [Strength 4]

    ---

    **Recommendation:** Focus your job search on [Role Type 1], [Role Type 2], or [Role Type 3] positions.

    **Time Saved:** By stopping early, we avoided generating bullets for a position you shouldn't pursue.

    ---

    **Ready to analyze a better-fitting job description?**
  </output_format>

  <formatting_requirements>
    <requirement>Total length: ~150-250 words</requirement>
    <requirement>No exhaustive requirement lists</requirement>
    <requirement>Focus on being helpful but concise</requirement>
  </formatting_requirements>

</phase_3a_brief_exit_output>
```

---

## Phase 3B: Ultra-Brief Exit Output (≤74% fit)

```xml
<phase_3b_ultra_brief_exit_output>
  
  <when_to_use>
    Fit percentage is 74% or below (poor match / fundamental mismatch)
  </when_to_use>

  <output_format>
    ⚠️ **APPLICATION STOPPED - FUNDAMENTAL MISMATCH**

    **Job:** [Job Title] at [Company]
    **Overall Fit:** [XX]% (Poor Match)

    [Single sentence explaining the core mismatch.]

    **Recommendation:** Skip this application. Focus on [Role Type 1] or [Role Type 2] roles where your [core strength 1] and [core strength 2] skills are core requirements.

    ---

    **Ready to analyze your next job description?**
  </output_format>

  <formatting_requirements>
    <requirement>Total length: ~50-100 words maximum</requirement>
    <requirement>No bullet lists of gaps or strengths</requirement>
    <requirement>No detailed analysis</requirement>
    <requirement>One-sentence mismatch explanation</requirement>
    <requirement>One-sentence recommendation</requirement>
  </formatting_requirements>

</phase_3b_ultra_brief_exit_output>
```

---

## Output Format (When Proceeding)

See `/core/format-rules.md` for detailed formatting requirements including:
- Position block structure
- Character limits
- Bullet count constraints
- Word count targets
- Position ordering

---

## Plain Text File Generation

```xml
<section_5_plain_text_file_generation>
  <purpose>
    After completing the full Mode 3 analysis, automatically generate a plain text file containing only the optimized resume bullets with rebalancing changes applied.
  </purpose>

  <file_naming_convention>
    <format>[Company]_[JobTitle]_Resume_Bullets.txt</format>
    <example>FDA_Business_Analyst_II_Resume_Bullets.txt</example>
  </file_naming_convention>

  <file_content_format>
    Optimized Resume Bullets to apply for [Job Title] at [Company Name]

    ================================================================================

    POSITION 1: [Job Title] | [Company/Client]

    • [Bullet 1 text]
    • [Bullet 2 text]
    • [Bullet 3 text]

    ================================================================================

    [Continue for all positions]
  </file_content_format>

  <rebalancing_application_rules>
    <rule priority="critical">
      If verb rebalancing recommendations were provided, automatically apply the recommended changes to the bullets in the plain text file.
    </rule>
  </rebalancing_application_rules>
</section_5_plain_text_file_generation>
```

---

## Related Files

- See `/core/fit-thresholds.md` for threshold configuration
- See `/core/format-rules.md` for output formatting
- See `/core/verb-categories.md` for action verb guidelines
- See `/shared/job-summary-creation.md` for capturing new experience
- See `/wireframes/mode-3-workflow.md` for visual workflow
