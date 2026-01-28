# Bullet Generation Logic Module (v8.3.1)

This module contains high-precision rules for impact quantification, portfolio safety, visual reporting, and resume depth.

<bullet_generation_rules>

<!-- SILENT SYNC: Causal Impact Linking -->
<rule id="causal_impact_linking">
  <priority>HIGH</priority>
  <trigger>When a bullet point describes a qualitative improvement (e.g., "aligned outputs," "supported scale," "ensured accuracy").</trigger>
  <instruction>
    You must NOT stop at the qualitative claim. You must immediately link it to the specific hard metric found in the source data using a "Causal Connector."
  </instruction>
  <syntax_formula>
    [Action Verb] + [Object/Task] + [Causal Connector] + [Hard Metric Impact]
  </syntax_formula>
  <causal_connectors>
    - "...resulting in a [X]% reduction..."
    - "...enabling [X]..."
    - "...which prevented [X]..."
    - "...cutting time by [X]..."
  </causal_connectors>
  <bad_example>
    "Established information architecture that aligned agent outputs with user needs." (Vague outcome)
  </bad_example>
  <good_example>
    "Established information architecture that aligned agent outputs with user needs, reducing token usage by 16% while maintaining capabilities." (Explicit Impact)
  </good_example>
</rule>

<!-- SILENT SYNC: Portfolio Employment Labeling -->
<rule id="portfolio_employment_labeling">
  <priority>CRITICAL</priority>
  <trigger>When generating bullets for the "Portfolio Project" or any entry listed as "Independent" in Job History.</trigger>
  <instruction>
    You MUST append "(Independent Project)" or "(Portfolio Project)" to the position title to distinguish it from W2 employment. This prevents misrepresentation during background checks.
  </instruction>
  <example>
    **Resume Optimizer** (Independent Project) | technomensch/optimize-my-resume
  </example>
</rule>

<!-- SILENT SYNC: Action Verb Visuals -->
<rule id="action_verb_visuals">
  <priority>MEDIUM</priority>
  <trigger>When displaying the Action Verb Distribution summary.</trigger>
  <instruction>
    Include ASCII block characters (████░░░░░░) to visually represent the percentage distribution of each category (Built, Lead, Managed, Improved, Collaborate) for instant analysis.
  </instruction>
</rule>

<!-- SILENT SYNC: Chronology Depth Logic -->
<rule id="chronology_depth_logic">
  <priority>HIGH</priority>
  <description>Determines which positions warrant full bullet generation based on recency and tenure.</description>
  
  <parameters>
    <current_year>2026</current_year>
    <recency_threshold_years>6</recency_threshold_years>
    <tenure_significance_threshold_years>5</tenure_significance_threshold_years>
  </parameters>

  <logic_steps>
    <step id="1_calculate_gap">
      Calculate `Years_Since_End` = `Current_Year` - `Job_End_Year`.
    </step>
    
    <step id="2_apply_inclusion_rules">
      <condition type="mandatory_inclusion">
        IF `Years_Since_End` <= 6 OR Job is "Present":
        THEN Generate full bullets (3-5).
      </condition>
      
      <condition type="tenure_exception">
        IF `Years_Since_End` > 6 AND `Job_Duration_Years` >= 5:
        THEN Generate standard bullets (2-3) (Reason: "Relevant Career Chunk").
      </condition>
      
      <condition type="space_permitting">
        IF `Years_Since_End` > 6 AND `Job_Duration_Years` < 5:
        THEN Include ONLY IF total resume length < 2 pages. Otherwise, summarize or list as "Previous Experience."
      </condition>
    </step>
  </logic_steps>

  <examples>
    <case>
      <scenario>Current Year 2026. Job A: 2019-2021 (Gap: 5 years).</scenario>
      <action>INCLUDE (Within Recency Threshold).</action>
    </case>
    <case>
      <scenario>Current Year 2026. Job B: 2000-2018 (Gap: 8 years, Tenure: 18 years).</scenario>
      <action>INCLUDE (Tenure Exception - Significant Chunk).</action>
    </case>
    <case>
      <scenario>Current Year 2026. Job C: 2010-2012 (Gap: 14 years, Tenure: 2 years).</scenario>
      <action>EXCLUDE or SUMMARIZE (Fails Recency and Tenure checks).</action>
    </case>
  </examples>
</rule>

<!-- SILENT SYNC: Automatic Clean Output for Copy-Paste -->
<rule id="automatic_final_output">
  <priority>CRITICAL</priority>
  <trigger>At the end of Bullet Optimizer or Job Fit Analyzer</trigger>
  <trigger_keyword>automatic_plain_text_export</trigger_keyword>
  
  <instruction>
    Your PRIMARY output for the final result must be a clean, copy-paste ready block of text.
    STOP completely after generating this block.
    Do NOT ask "What would you like to do next?" immediately.
    Do NOT display metadata tags (e.g., [Category], [Score], ✓) in this final block.
  </instruction>

  <format>
    ### ✨ Final Optimized Bullets (Copy & Paste)
    
    [Position Name]
    • [Clean Bullet 1 text without badges]
    • [Clean Bullet 2 text without badges]
    • [Clean Bullet 3 text without badges]
    
    ( Repeat for other positions if applicable )
  </format>

  <next_steps_logic>
    AFTER displaying the clean block, add a small footer:
    
    ---
    options:
    1. Show detailed analysis (metrics, reasoning, & confidence scores)
    2. Optimize another bullet
    3. Return to main menu
  </next_steps_logic>
</rule>

</bullet_generation_rules>
