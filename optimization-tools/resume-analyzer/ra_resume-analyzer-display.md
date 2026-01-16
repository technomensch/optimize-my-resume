# Resume Analyzer Display Module

<!-- ========================================================================== -->
<!-- VERSION HISTORY                                                            -->
<!-- ========================================================================== -->
<!--
v8.5.1 (Issue #56 - Report UX Enhancement) - 2026-01-16
- Replaced Hiring Manager Perspective with Resume Narrative Analysis
- Added Quick Action Checklist rules (top 3 prioritized actions)
- Added Overall Grade Display (A-C letter grading system)
- Added Job History Summary Display Rules (collapse/expand functionality)
- Condensed Per-Bullet Recommendations to single-line format
- Replaced all "Phase 1" references with "Resume Analysis" or "Resume Analyzer"
- 35% report length reduction, 50% faster scan time, ~12K tokens saved

v6.5.0 - Initial modular structure
- Bullet color-coding system
- Metrics detection
- Per-bullet audit display
- Prioritized repairs summary
-->

<!-- ========================================================================== -->
<!-- BULLET COLOR-CODING SYSTEM (v6.5.0)                                        -->
<!-- ========================================================================== -->

<bullet_color_coding_rules>
  <priority>HIGH</priority>
  <applies_to>Resume Analysis, Bullet Optimizer, Job Fit Analyzer - All bullet displays</applies_to>
  
  <purpose>
    Visually identify action verb categories by coloring the first word of each bullet.
    Enables quick visual assessment of verb diversity and achievement types.
  </purpose>

  <color_mapping>
    <category verb_name="Built" color="blue" hex="#3B82F6">
      <description>Creates new systems/products/processes</description>
      <verbs>built, developed, designed, launched, established, implemented, created, engineered, architected, pioneered</verbs>
    </category>
    
    <category verb_name="Lead" color="orange" hex="#FBBF24">
      <description>Drives initiatives, guides teams</description>
      <verbs>led, directed, spearheaded, drove, championed, headed, piloted, steered, mentored, coached</verbs>
    </category>
    
    <category verb_name="Managed" color="purple" hex="#A855F7">
      <description>Oversees resources, coordinates operations</description>
      <verbs>managed, supervised, coordinated, oversaw, administered, orchestrated, facilitated, organized, planned, prioritized</verbs>
    </category>
    
    <category verb_name="Improved" color="green" hex="#10B981">
      <description>Optimizes and enhances existing systems</description>
      <verbs>optimized, improved, streamlined, enhanced, transformed, upgraded, refined, boosted, increased, reduced</verbs>
    </category>
    
    <category verb_name="Collaborate" color="pink" hex="#EC4899">
      <description>Partners cross-functionally, works with teams</description>
      <verbs>collaborated, partnered, cooperated, coordinated, facilitated, liaised, worked with, teamed with, consulted, advised</verbs>
    </category>
  </color_mapping>

  <implementation_rules>
    <rule priority="critical">
      Extract the first word of each bullet (the action verb).
    </rule>
    
    <rule priority="critical">
      Match the first word against verb lists above (case-insensitive).
    </rule>
    
    <rule priority="critical">
      Apply the corresponding color to the first word ONLY.
    </rule>
    
    <rule priority="high">
      If verb is not found in any category, display in default color (white/gray).
    </rule>
    
    <rule priority="high">
      Color coding applies to visual display ONLY - does not change the actual bullet text.
    </rule>
  </implementation_rules>

  <example_output>
    [Built] a real-time analytics dashboard using React and PostgreSQL
    [Lead] cross-functional team of 8 engineers to launch Q4 roadmap
    [Managed] $2M annual budget and 12-person operations team
    [Improved] page load time from 3s to 0.8s using lazy loading
    [Collaborate] with design team to create user-centric UX patterns
  </example_output>
</bullet_color_coding_rules>

<!-- ========================================================================== -->
<!-- BULLET METRICS DETECTION (v6.5.0)                                          -->
<!-- ========================================================================== -->

<bullet_metrics_detection_rules>
  <priority>HIGH</priority>
  <applies_to>Resume Analysis, Bullet Optimizer, Job Fit Analyzer - All bullet displays</applies_to>
  
  <purpose>
    Visually indicate whether each bullet contains quantified metrics.
    Helps users identify which bullets have impact evidence and which need strengthening.
  </purpose>

  <metric_types_recognized>
    <type pattern="\d+%">Percentages (e.g., "50%", "3.2%")</type>
    <type pattern="\$\d+">Currency (e.g., "$2M", "$500K", "$1.2B")</type>
    <type pattern="~\d+">Approximations (e.g., "~40", "~10%")</type>
    <type pattern="\d+x">Multipliers (e.g., "3x", "10x")</type>
    <type pattern="from \d+ to \d+">Ranges/improvements (e.g., "from 3s to 0.8s")</type>
    <type pattern="\d+ (seconds|minutes|hours|days|weeks|months|years)">Time-based (e.g., "3 days", "2 weeks")</type>
    <type pattern="\d+ (users|customers|clients|transactions|records|items|pages)">Volume-based (e.g., "500 users", "10K transactions")</type>
    <type pattern="(Top|First) \d+">Rankings (e.g., "Top 10", "First 5")</type>
  </metric_types_recognized>

  <detection_algorithm>
    1. Scan each bullet for any metric pattern above
    2. If ANY metric found: Mark bullet as "HAS METRICS" ✓
    3. If NO metrics found: Mark bullet as "NO METRICS" -
  </detection_algorithm>

  <display_format>
    When displaying bullets, add a metric indicator next to each bullet:
    
    ✓ (Green checkmark) = Bullet contains quantified metric(s)
    - (Gray dash) = Bullet lacks quantified metrics
  </display_format>

  <reporting_in_resume_analysis>
    In Resume Analysis Report, include summary per position:
    
    "Metrics Coverage: X/Y bullets have quantified impact (XX%)
     Target: 70-80% of bullets should contain metrics"
  </reporting_in_resume_analysis>
</bullet_metrics_detection_rules>

<!-- ========================================================================== -->
<!-- BULLET DISPLAY AND GROUPING (v6.5.0)                                       -->
<!-- ========================================================================== -->

<bullet_display_and_grouping_rules>
  <priority>CRITICAL</priority>
  <applies_to>Resume Analysis, Bullet Optimizer, Job Fit Analyzer - All bullet displays</applies_to>
  
  <purpose>
    Define standard format for displaying bullets.
    Ensures consistency: clean text + metrics detection.
  </purpose>

  <grouping_logic>
    <order>Reverse chronological (most recent job first)</order>
    <grouping_unit>By job title + company</grouping_unit>
    
    <position_header_format>
      [Job Title] at [Company] | [Start Date] - [End Date]
      Duration: [X years/months]
    </position_header_format>
  </grouping_logic>
  
  <bullet_display_within_position>
    <instruction>
      Display the verb category in brackets before the bullet text.
      - Format: [Category] Verb reminder
      - Example: [Built] Built system...
      - Do NOT put the color name (Green) in text.
    </instruction>

    <format>
      [METRIC_INDICATOR] [[Category]] [Verb] [remainder of bullet text]
    </format>

    <key>
      - METRIC_INDICATOR: ✓ [Has Metrics] (if metrics present) or - [No Metrics] (if no metrics)
      - [Category]: The action verb category in brackets (e.g., [Built], [Lead], [Managed], [Improved], [Collaborate])
      - [Verb]: The action verb itself (Capitalized, no brackets)
    </key>

    <example>
      ✓ [Has Metrics] [Built] Built a real-time analytics dashboard using React
      - [No Metrics] [Managed] Managed daily standups for the engineering team
    </example>
  </bullet_display_within_position>
  
  <position_summary>
    After all bullets for a position, display:
    - Total bullets: X | With metrics: X (XX%)
    - Verb distribution: Built (X), Lead (X), Managed (X), Improved (X), Collaborate (X)
  </position_summary>

  <reverse_chronological_verification>
    GUARDRAIL: Sort positions by end_date DESCENDING (most recent first).
  </reverse_chronological_verification>
</bullet_display_and_grouping_rules>

<!-- ========================================================================== -->
<!-- RESUME NARRATIVE ANALYSIS (v8.5.1)                                        -->
<!-- ========================================================================== -->

<resume_narrative_analysis_rules>
  <priority>HIGH</priority>
  <applies_to>Resume Analysis only</applies_to>

  <terminology_note>
    IMPORTANT: Do NOT use "Phase 1" terminology (removed in Issue #55).
    Use "Resume Analysis" or "Resume Analyzer" instead.
  </terminology_note>

  <purpose>
    Analyze the resume holistically to answer:
    1. What story does this resume tell?
    2. Is the narrative coherent or confusing?
    3. What roles is this person best positioned for?
    4. How can they strengthen their narrative?
  </purpose>

  <analysis_components>
    <component id="1" name="primary_identity">
      <description>Single-sentence identification of main career identity</description>
      <format>**Primary Identity Detected:** [Role Type] ✅ CLEAR / ⚠️ UNCLEAR</format>
    </component>

    <component id="2" name="career_arc">
      <description>3-stage progression summary</description>
      <format>
        **Career Arc:** [Early Stage] → [Mid Stage] → [Current Stage] ✅ COHESIVE / ⚠️ DISJOINTED
      </format>
    </component>

    <component id="3" name="narrative_strength">
      <description>0-100 score based on coherence</description>
      <scoring>
        - 85-100: Extremely clear, no confusion
        - 70-84: Mostly clear, minor gaps
        - 50-69: Some confusion, needs work
        - 0-49: Very unclear, major issues
      </scoring>
    </component>

    <component id="4" name="whats_working">
      <description>Consistent threads and clear progression</description>
      <format>
        ### ✅ What's Working
        **Consistent Thread:** [Description]
        **Clear Progression:** [Timeline breakdown]
      </format>
    </component>

    <component id="5" name="confusion_points">
      <description>Red flags hiring managers might spot</description>
      <format>
        ### ⚠️ Potential Confusion Points
        **1. [Issue Title]**
        - **The Issue:** [What's confusing]
        - **The Fix:** [How to address it]
        - **Hiring Manager Question:** [What they'll wonder]
      </format>
    </component>

    <component id="6" name="role_fit_matrix">
      <description>Strong/Moderate/Weak fit categories with specific roles</description>
      <format>
        ### 🎯 Which Roles Will See You As a Strong Fit?
        **Strong Match (90%+ fit):**
        - [Role 1]
        - [Role 2]

        **Moderate Match (70-85% fit):**
        - [Role 3] - [Condition for fit]

        **Weak Match (<60% fit):**
        - [Role 4] - [Why it's weak]
      </format>
    </component>

    <component id="7" name="strengthening_recommendations">
      <description>Conditional guidance based on target role</description>
      <format>
        ### 💡 Narrative Strengthening Recommendations
        **If targeting [Role Type]:**
        → [Specific action 1]
        → [Specific action 2]
      </format>
    </component>
  </analysis_components>

  <holistic_analysis_logic>
    <step number="1" name="scan_all_positions">
      Read ALL positions to understand full career trajectory.
      Do NOT analyze position-by-position.
    </step>

    <step number="2" name="identify_patterns">
      Look for:
      - Recurring skills across positions
      - Industry consistency or pivots
      - Progression (operational → strategic)
      - Gaps or unexplained transitions
    </step>

    <step number="3" name="detect_narrative_conflicts">
      Flag:
      - "Trying to be everything" (4+ distinct domains)
      - Industry whiplash (unrelated sectors)
      - Title confusion (same level across 5+ years)
      - Skill mismatches (claiming tech skills in support roles)
    </step>

    <step number="4" name="market_positioning">
      Based on strongest patterns, recommend:
      - Primary target roles (90%+ fit)
      - Stretch roles (70-85% fit with specific framing)
      - Avoid roles (poor fit, will waste time)
    </step>
  </holistic_analysis_logic>

  <output_length>400-600 words (vs 2000+ for per-position inference)</output_length>
</resume_narrative_analysis_rules>

<!-- ========================================================================== -->
<!-- JOB HISTORY SUMMARY GENERATION (v6.5.0)                                    -->
<!-- ========================================================================== -->

<job_history_summary_generation_rules>
  <priority>HIGH</priority>
  <applies_to>Resume Analysis - Narrative Analysis section</applies_to>
  
  <purpose>
    Generate comprehensive job history job history creation schema summaries for each position.
    CRITICAL: Summaries must be SYNTHESIZED from the raw resume data, not copied.
    We are creating the "Ideal Version" of this role, identifying what the user 
    *actually* did versus what the resume *says* they did.
  </purpose>

  <auto_generation_process>
    <step number="1" name="analyze_raw_bullets">
      For each position:
      - Read all raw bullets to understand the scope and impact.
      - Infer the standard "Day-to-Day" duties of this role type.
      - Identify the specific "Wins" or "Projects."
    </step>

    <step number="2" name="synthesize_responsibilities">
      Generate <core_responsibilities>:
      - Write 3-4 NEW bullets that describe the functional scope.
      - Example: "Directed the end-to-end SDLC..." or "Managed stakeholder relationships..."
      - Do NOT simply copy the user's poorly written bullets here.
    </step>

    <step number="3" name="isolate_achievements">
      Generate <key_achievements>:
      - Select the top 3-5 strongest accomplishments from the raw text.
      - If possible, slightly polish them for readability, but keep the original metrics.
      - Ensure these are distinct from the general responsibilities.
    </step>

    <step number="4" name="structure_data">
      Organize extracted data into job history creation schema:
      - professional_summary (synthesized)
      - core_responsibilities (synthesized/functional)
      - key_achievements (filtered wins)
      - hard_skills_demonstrated (categorized)
      - soft_skills_demonstrated (categorized)
      - tools_technologies (extracted)
      - impact_metrics (quantified results)
      - industry_domain (inferred from context)
      - team_scope (extracted or inferred)
    </step>
  </auto_generation_process>

  <display_format_in_resume_analysis>
    <priority>CRITICAL</priority>
    <instruction>
      When displaying summaries in the chat window, ALWAYS render them as formatted Markdown.
      NEVER output raw XML tags (like <core_responsibilities>) in the visual report.
    </instruction>

    <rendering_rules>
      <structure>
        1. Convert <professional_summary> tag → "### 📝 Professional Summary"
        2. Convert <core_responsibilities> tag → "### 📋 Core Responsibilities"
        3. Convert <key_achievements> tag → "### 🏆 Key Achievements"
        4. Convert <hard_skills_demonstrated> tag → "### 💻 Hard Skills"
        5. Convert <soft_skills_demonstrated> tag → "### 🤝 Soft Skills"
        6. Convert <tools_technologies> tag → "### 🛠 Tools & Technologies"
        7. Convert <impact_metrics> tag → "### 📊 Impact Metrics"
        8. Convert <team_scope> tag → "### 👥 Team Scope"
      </structure>

      <bullet_formatting>
        For all bullet points within Core Responsibilities and Key Achievements:
        MUST apply standard bullet_display_and_grouping_rules:
        - Prefix with Metric Indicator: ✓ [Has Metrics] or - [No Metrics]
        - Prefix with Verb Category: [Category] (e.g., [Built])
        - Example: "✓ [Has Metrics] [Built] Architected a scalable..."
      </bullet_formatting>
    </rendering_rules>
    <example_output>
      #### 📄 Job History Summary: Position 1

      **Inferred Title:** Microsoft 365 Administrator
      **Duration:** 10 months

      ### 📝 Professional Summary
      Served as the Microsoft 365 Subject Matter Expert...

      ### 📋 Core Responsibilities
      * - [No Metrics] [Collaborate] Capture requirements from the Business Development team...
      * - [No Metrics] [Built] Create custom SharePoint Online forms...

      ### 🏆 Key Achievements
      * ✓ [Has Metrics] [Built] Built custom SharePoint Online forms with Power Apps...

      [...continue for all sections...]
    </example_output>
  </display_format_in_resume_analysis>
  
  <download_export_formats>
    <format name="xml">
      <file_format>XML (job history creation Schema)</file_format>
      <use_case>Machine processing, LLM consumption, system imports, version control</use_case>
    </format>

    <format name="markdown">
      <file_format>Markdown (.md)</file_format>
      <use_case>Reading, sharing, presentations, documentation</use_case>
    </format>

    <format name="zip">
      <file_format>ZIP archive</file_format>
      <use_case>Complete backup with both formats</use_case>
    </format>
  </download_export_formats>

  <file_naming_convention>
    <xml_format>
      claude_generated_job_history_v6.5_[YYYYMMDD].xml
    </xml_format>

    <markdown_format>
      claude_generated_job_history_v6.5_[YYYYMMDD].md
    </markdown_format>

    <zip_format>
      claude_generated_job_history_v6.5_[YYYYMMDD]_BOTH.zip
    </zip_format>
  </file_naming_convention>

  <user_guidance>
    <during_analysis>
      "Your job history summaries are being generated automatically as we analyze 
      each position."
    </during_analysis>

    <before_download>
      "We've compiled all positions into comprehensive job history summaries. 
      Download in your preferred format:
      
      📄 XML - For LLM processing, system integration, version control
      📝 Markdown - For reading, sharing, presentations
      📦 Both (ZIP) - Complete backup"
    </before_download>
  </user_guidance>
</job_history_summary_generation_rules>

<!-- ========================================================================== -->
<!-- JOB HISTORY SUMMARY DISPLAY RULES (v8.5.1)                                 -->
<!-- ========================================================================== -->

<job_history_summary_display_rules>
  <priority>HIGH</priority>
  <default_state>COLLAPSED</default_state>
  <applies_to>Resume Analysis - Job History Summary section</applies_to>

  <purpose>
    Reduce report verbosity by collapsing job history summaries by default.
    Users can expand to see full details when needed.
  </purpose>

  <collapsed_view>
    Show only:
    - Position header: "📄 Job History Summary Available"
    - Professional Summary (2-3 sentences)
    - Key Achievements (top 3 only)
    - "▼ Expand for full details" toggle button
  </collapsed_view>

  <expanded_view>
    Show all 8 sections of v2.0 schema:
    - Professional Summary
    - Core Responsibilities
    - Key Achievements
    - Hard Skills Demonstrated
    - Soft Skills Demonstrated
    - Tools & Technologies
    - Impact Metrics
    - Team Scope
  </expanded_view>

  <download_format>
    Full v2.0 schema in XML/MD downloads (always complete, no data loss)
  </download_format>

  <ui_implementation>
    <react_state>
      const [expandedJobHistories, setExpandedJobHistories] = useState(new Set());
    </react_state>

    <toggle_function>
      const toggleJobHistory = (positionId) => {
        const newSet = new Set(expandedJobHistories);
        if (newSet.has(positionId)) {
          newSet.delete(positionId);
        } else {
          newSet.add(positionId);
        }
        setExpandedJobHistories(newSet);
      };
    </toggle_function>
  </ui_implementation>

  <impact>~40% report length reduction without data loss</impact>
</job_history_summary_display_rules>

<!-- ========================================================================== -->
<!-- JOB HISTORY EXPORT FUNCTIONALITY (v6.5.0)                                  -->
<!-- ========================================================================== -->

<job_history_export_functionality>
  <priority>CRITICAL</priority>
  <applies_to>Resume Analysis - After Narrative Analysis section</applies_to>
  
  <download_options>
    <option id="1" format="xml">
      <label>📥 Download as XML (.xml)</label>
      <description>Job History Creation XML Schema - Perfect for LLM processing</description>
      <use_cases>
        - Import into LLM systems
        - Version control and tracking
        - System integrations
      </use_cases>
    </option>

    <option id="2" format="markdown">
      <label>📥 Download as Markdown (.md)</label>
      <description>Human-readable format with emoji headers and tables</description>
      <use_cases>
        - Reading and review
        - Sharing with mentors
        - Documentation and presentations
      </use_cases>
    </option>

    <option id="3" format="zip">
      <label>📥 Download Both (ZIP)</label>
      <description>Complete set with both XML and Markdown versions</description>
      <use_cases>
        - Complete backup
        - Different use cases
      </use_cases>
    </option>
  </download_options>

  <button_placement>
    <location>Immediately after all position summaries are displayed</location>
    <prominence>High - center of screen, clear call-to-action</prominence>
  </button_placement>

  <technical_requirements>
    <requirement priority="critical">
      Generate files on demand when user clicks download button
    </requirement>
    
    <requirement priority="critical">
      Filename should include date in YYYYMMDD format
    </requirement>
    
    <requirement priority="high">
      XML output must be valid, well-formed, and properly escaped
    </requirement>
    
    <requirement priority="high">
      Markdown output must be properly formatted with correct syntax
    </requirement>
    
    <requirement priority="moderate">
      Browser should trigger download dialog (not open in new tab)
    </requirement>
  </technical_requirements>

  <user_feedback>
    <on_download_complete>
      "✓ Download complete! Your job history summary is ready.
      
      You can now:
      • Use as reference for future applications
      • Share with career coaches
      • Import into tracking systems"
    </on_download_complete>
  </user_feedback>
</job_history_export_functionality>

<!-- ========================================================================== -->
<!-- PER-BULLET AUDIT DISPLAY (v6.5.0)                                          -->
<!-- ========================================================================== -->

<per_bullet_audit_rules>
  <priority>CRITICAL</priority>
  <applies_to>Resume Analysis Report</applies_to>

  <repairs_needed_generation_rules> <!-- v6.5.3 Change: Removed verbose suggestions -->
    <priority>HIGH</priority>
    
    <purpose>
      The repairsNeeded array contains BRIEF issue descriptors identified during analysis.
      These are surfaced in the Prioritized Repairs Summary for quick scanning.
      Detailed repair suggestions are now located in the per-bullet recommendation field.
    </purpose>
    
    <severity_definitions>
      <blocker>Dealbreaker issues that risk auto-rejection by ATS or hiring manager</blocker>
      <risk>Significant issues that meaningfully lower resume score</risk>
      <tweak>Minor refinements for professional polish</tweak>
    </severity_definitions>
    
    <what_to_flag>
      1. Missing Metrics: Bullets without quantified impact (%, $, numbers, time)
      2. Character Count: Bullets under 100 or over 210 characters
      3. Weak Verbs: Responsible, Helped, Worked on, Participated in
      4. Verb Distribution: Any category < 5% of total bullets
      5. Verb Repetition: Same category used twice in one position
      6. No Impact: Bullets lacking clear business outcome
    </what_to_flag>
    
    <array_structure>
      {
        "severity": "risk|tweak|blocker",
        "position": "Position 1: Job Title",
        "bulletNumber": 1,
        "issue": "Brief 1-sentence description (max 50 chars)"
        <!-- NOTE: No suggestion field here. Detailed fixes go in bullet.recommendation -->
      }
    </array_structure>
  </repairs_needed_generation_rules>

  <purpose>
    Display a detailed analysis table beneath every bullet point in the resume, 
    providing granular, line-by-line feedback.
  </purpose>

  <rendering_requirement>
    <priority>CRITICAL</priority>
    <instruction>
      ALWAYS use standard Markdown Table syntax for the audit display.
      NEVER use ASCII art or code blocks.
    </instruction>
  </rendering_requirement>

  <width_control>
    <priority>HIGH</priority>
    <instruction>
      To prevent the table from becoming too wide (not wrapping):
      1. Keep "Analysis" text concise.
      2. Use the HTML break tag <br> to manually force a new line between distinct thoughts (e.g., between the Finding and the Recommendation).
      3. Insert <br> if a single sentence exceeds ~50 characters.
    </instruction>
  </width_control>

  <integration_rule>
    The audit table must appear directly after the original bullet point.
    Do not repeat the bullet text inside the table.
  </integration_rule>

  <analysis_table_structure>
    <columns>
      Column 1: Check (Metric, Verb, Length)
      Column 2: Status (✅ Passed, ❌ Failed, ⚠️ Weak)
      Column 3: Analysis (Specific findings and fixes)
    </columns>
    
    <row id="1" name="Metrics">
      <check>Metrics</check>
      <logic>
        - ✅ Passed: If metrics are detected.
        - ❌ Failed: If no metrics are detected.
      </logic>
      <output>
        - On Passed: List metrics found <br> (e.g., "65% reduction").
        - On Failed: "Lacks quantifiable impact. <br> Add: # of users, efficiency %..."
      </output>
    </row>
    
    <row id="2" name="Action Verb">
      <column_1>Action Verb</column_1>
      <column_2>
        - "Passed": If verb is strong and not redundant.
        - "Weak": If verb is passive (e.g., "Worked on").
        - "Redundant": If the same verb category is used in a nearby bullet.
      </column_2>
      <column_3>
        - On "Passed": Show the verb category and the verb itself (e.g., "[Built] Architected").
        - On "Weak": Explain why it's weak and suggest alternatives.
        - On "Redundant": Note the redundancy and suggest alternatives.
      </column_3>
    </row>
    
    <row id="3" name="Char Count">
      <check>Length</check>
      <logic>
        - ✅ Passed: 100-210 characters.
        - ❌ Failed: <100 or >210 characters.
      </logic>
      <output>
        - Show count (e.g., "74/210 chars").
        - If failed, add break: <br> (e.g., "26 chars below minimum").
      </output>
    </row>
  </analysis_table_structure>

  <per_bullet_recommendations>
    <description>
      If any check fails, add a recommendation block below the table.
    </description>
    <rule priority="high">
      Consolidate multiple issues into single-line recommendation.
      Format: [Icon] **[Action verb] + [specifics]** ([current state])
      Maximum length: 100 characters
    </rule>
    <format>
      Use a blockquote (>) to distinctively set off recommendations.
      Single line with severity icon, action, and current state.
    </format>
    <examples>
      - ⚠️ **Add metrics** (no quantified impact)
      - ⚠️ **Expand to 100+ chars** (currently 74 chars)
      - ⚠️ **Add metrics + expand** (74 chars, no impact data)
      - 🔧 **Use different verb category** (3rd "Built" in this position)
    </examples>
  </per_bullet_recommendations>

  <example_display>  
        ✓ [Has Metrics] [Built] Created technical documentation and training materials.
                     
        | Check | Status | Analysis |
        | :--- | :--- | :--- |             
        | **Metrics** | ❌ **Failed** | **Lacks quantifiable impact.** <br> Add: # of documents, team members trained... |
        | **Verb** | ✅ **Passed** | **[Built] Created** |        
        | **Length** | ❌ **Failed** | **74/210 chars** <br> (26 chars below minimum) |   
                     
        > **⚠️ RECOMMENDATIONS**  
        > * [⚠️ RISK] Missing metrics - add quantified achievements       
        > * [⚠️ RISK] Bullet too short - expand with impact context            
                     
  </example_display> 
</per_bullet_audit_rules>

<!-- ========================================================================== -->
<!-- OVERALL GRADE DISPLAY (v8.5.1)                                            -->
<!-- ========================================================================== -->

<overall_grade_display>
  <priority>MODERATE</priority>
  <location>Executive Summary, before Prioritized Repairs</location>
  <applies_to>Resume Analysis Report</applies_to>

  <purpose>
    Provide users with an immediate, at-a-glance assessment of resume quality
    using a familiar letter grade system.
  </purpose>

  <calculation>
    Overall Grade = (
      ATS Format Score * 0.25 +
      Content Quality Score * 0.35 +
      Quantifiable Impact Score * 0.25 +
      Skills & Keywords Score * 0.15
    )
  </calculation>

  <grade_mapping>
    - 90-100: A (Excellent)
    - 80-89: B+ (Strong)
    - 70-79: B (Good)
    - 60-69: C+ (Needs Work)
    - 0-59: C (Requires Major Revision)
  </grade_mapping>

  <visual_format>
    📊 **OVERALL GRADE: [Letter] ([Score]/100)**
    [Progress bar using █ and ░]

    ✅ Strengths: [Top 2 strengths]
    ⚠️ Needs Work: [Top 2 weaknesses]
  </visual_format>

  <example_output>
    📊 **OVERALL GRADE: B+ (85/100)**
    ████████████████████░ 85%

    ✅ Strengths: Strong ATS format, excellent quantified impact
    ⚠️ Needs Work: Verb diversity (25% "Built" verbs)
  </example_output>
</overall_grade_display>

<!-- ========================================================================== -->
<!-- QUICK ACTION CHECKLIST (v8.5.1)                                           -->
<!-- ========================================================================== -->

<quick_action_checklist_rules>
  <priority>HIGH</priority>
  <location>Immediately after Overall Grade, before Narrative Analysis</location>
  <applies_to>Resume Analysis Report - Executive Summary</applies_to>

  <purpose>
    Provide users with an immediate, prioritized list of the top 3 actions they should take.
    Reduces decision paralysis and provides clear starting point.
  </purpose>

  <selection_algorithm>
    <step number="1">Collect all RISK and BLOCKER items from repairsNeeded array</step>
    <step number="2">Sort by severity: BLOCKER > RISK</step>
    <step number="3">Within same severity, prioritize by impact:
      - Character count violations (>210 or <100)
      - Missing metrics
      - Weak verbs
      - Verb distribution gaps (<5%)
    </step>
    <step number="4">Select top 3 items</step>
    <step number="5">Format with position references (P1-B3)</step>
  </selection_algorithm>

  <output_format>
    🎯 **YOUR TOP 3 ACTION ITEMS**
    1. [Severity Icon] [Brief description] ([Position references])
    2. [Severity Icon] [Brief description] ([Position references])
    3. [Severity Icon] [Brief description] ([Position references])
  </output_format>

  <example_output>
    🎯 **YOUR TOP 3 ACTION ITEMS**
    1. ⚠️ Fix 6 bullets exceeding 210 chars (P1-B3, P1-B4, P2-B1, P2-B3, P4-B3, P6-B2)
    2. ⚠️ Add metrics to 6 bullets to reach 70% coverage target
    3. 🔧 Diversify verb usage - reduce "Built" from 30% to <20%
  </example_output>

  <impact>2x actionability improvement, reduces decision paralysis</impact>
</quick_action_checklist_rules>

<!-- ========================================================================== -->
<!-- PRIORITIZED REPAIRS SUMMARY (v6.5.0)                                       -->
<!-- ========================================================================== -->

<prioritized_repairs_summary_rules>
  <priority>CRITICAL</priority>
  <applies_to>Resume Analysis Report</applies_to>

  <purpose>
    Provide a high-level, prioritized summary of all identified issues.
    Enables users to understand severity and actionability at a glance.
  </purpose>

  <severity_levels>
    <level id="blocker" symbol="⛔">Dealbreakers that risk auto-rejection.</level>
    <level id="risk" symbol="⚠️">Significant issues that lower the resume's score and impact.</level>
    <level id="tweak" symbol="🔧">Minor refinements for professional polish.</level>
  </severity_levels>

  <executive_summary_integration>
    <description>
      The main executive summary at the top of the report includes:
    </description>
    <rule priority="critical">
      This executive summary MUST be the first element in the output to provide 
      an immediate, high-level overview.
    </rule>

    <markdown_table_format>
      <priority>CRITICAL</priority>
      <applies_to>Resume Analysis Executive Summary output</applies_to>
      
      <formatting_rules>
        <rule id="use_markdown_tables">Use Markdown table syntax for all structured data</rule>
        <rule id="use_bold_for_headers">Bold (**text**) for category names and important labels</rule>
        <rule id="use_emojis">Use emojis for visual emphasis (✅ ⚠️ ⛔ 🔧 📊 📋)</rule>
        <rule id="use_blockquotes">Use blockquote (>) for THE VERDICT statement</rule>
        <rule id="progress_bars">Use Unicode block characters for progress bars (█ ░)</rule>
        <rule id="line_breaks">Use `<br>` for multi-line content in table cells</rule>
      </formatting_rules>
      
      <structure>
        <section order="1">Top-level summary table (Overall Grade, Word Count, Bullet Count)</section>
        <section order="2">Scoring Breakdown table (4 assessment areas)</section>
        <section order="3">Action Verb Diversity table with visual bars</section>
        <section order="4">Prioritized Repairs summary table</section>
        <section order="5">THE VERDICT blockquote</section>
      </structure>
      
      <no_ascii_art>
        Do NOT use ASCII box drawing characters (╔ ═ ║ ╚ ╝ ╠ ╣ ╧ ╪)
        Do NOT use text color annotations like (text-cyan) (text-yellow) (text-red) (text-green) (text-blue) (text-purple) (text-pink)
      </no_ascii_art>
    </markdown_table_format>
        <rule priority="high">
          Invalid format for email or phone → ⚠️ RISK
          May cause ATS parsing failures
        </rule>

        <rule priority="moderate">
          Missing LinkedIn, GitHub, or Portfolio → 🔧 TWEAK
          Recommended but not required
        </rule>
      </severity_assignment>
    
    <element name="Prioritized Repairs Counts">
      - A one-line summary of issue counts by severity.
      - Example: "[⛔ BLOCKER: 0]  [⚠️ RISK: 4]  [🔧 TWEAK: 6]"
    </element>
    
    <element name="The Verdict">
      - A concise, one-sentence summary of the resume's overall status.
      - Example: "Your resume is ATS COMPATIBLE, but needs CONTENT improvements for impact."
    </element>
    
    <element name="Repair Legend">
      - A legend explaining the meaning of the Blocker, Risk, and Tweak symbols.
    </element>
  </executive_summary_integration>

  <final_summary_section>
    <description>
      A new section titled "PRIORITIZED REPAIRS SUMMARY" will be added at the end of the entire report.
    </description>
    <structure>
      - Issues will be grouped by severity ([⚠️ RISK] then [🔧 TWEAK]).
      - Each issue will reference its location (e.g., "[P1-B4]").
      - Each issue will provide a concise description and an actionable fix suggestion.
    </structure>
    <example>
      [⚠️ RISK] - 4 issues (Significant Impact - Lowers Score)
      ───────────────────────────────────────────────────────────────────────────────
      1. [P1-B4] Missing metrics - add quantified achievements
         → Add: "Created 25+ technical documents, reducing onboarding time by 30%"
    </example>
  </final_summary_section>
</prioritized_repairs_summary_rules>
