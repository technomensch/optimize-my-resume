<quality_assurance_rules>
  <phrase_variation_rule>
    <priority>high</priority>
    <instruction>
      When the same metric or achievement appears across multiple positions, vary the phrasing 
      to avoid exact repetition while maintaining accuracy.
      
      Maximum repetition: Same exact phrase may appear maximum 2 times across entire resume.
      If achievement appears 3+ times, use at least 3 different phrasings.
      
      Special rule for common achievements (e.g., "version control"):
      - Include the exact metric/achievement in ONLY the position where it's strongest/most impactful
      - For other positions, reference related but different achievements from job history
    </instruction>
    
    <variation_strategies>
      - Change verb: implementing → established → introduced → deployed
      - Change format: "from 0% to 100%" → "(0% to 100% coverage)" → "achieving 100% compliance"
      - Change structure: "implementing X from Y to Z" → "established X (Y to Z)" → "introduced X achieving Z"
    </variation_strategies>
    
    <example_version_control>
      If "version control 0% to 100%" appears in multiple job histories:
      
      Step 1: Identify strongest position (e.g., DoE SOC - regulatory audit with 40 runbooks)
      Step 2: Keep "version control" bullet ONLY in strongest position
      Step 3: Replace in other positions with different achievements from their job histories:
      
      - DHS: Use "Created standardized style guide and templates" instead
      - CISA: Use "Retired 10% outdated artifacts" or "Optimized SharePoint repositories" instead
    </example_version_control>
  </phrase_variation_rule>

  <symbol_consistency_rule>
    <priority>high</priority>
    <instruction>
      Use consistent symbols and formatting across all bullets and summary.
    </instruction>
    
    <approximation_symbol>
      - ALWAYS use: ~ (tilde without backslash)
      - NEVER use: \~ (escaped tilde)
      - Example: "~40%" not "\~40%"
    </approximation_symbol>
    
    <other_symbols>
      - Percentages: Always use % symbol (never "percent")
      - Plus signs: Use + for "or more" (e.g., "700+")
      - Ranges: Use hyphen without spaces (e.g., "3-5" not "3 - 5")
    </other_symbols>
    
    <quality_check>
      Before finalizing output, scan for escaped characters (\~, \%, \+) and remove backslashes.
    </quality_check>
  </symbol_consistency_rule>

  <verb_tense_rule>
    <priority>critical</priority>
    <instruction>
      ALL resume bullets must start with past-tense action verbs. 
      NEVER use gerunds (-ing forms) or present-tense verbs as the main action verb.
    </instruction>
    
    <correct_usage>
      - "Authored 700+ user stories..."
      - "Created 150+ test cases..."
      - "Led zero-downtime migration..."
    </correct_usage>
    
    <incorrect_usage>
      - ❌ "Authoring 3-5 communications monthly" 
      - ❌ "Creating knowledge base articles"
      - ❌ "Leading migration projects"
    </incorrect_usage>
    
    <gerund_exceptions>
      Gerunds are acceptable ONLY when:
      1. Used as a noun/object: "specialized in creating documentation"
      2. Following a past-tense verb: "focused on improving processes"
      3. In parenthetical clarifications: "led team (overseeing 5 members)"
      
      But NEVER as the main bullet verb.
    </gerund_exceptions>
    
    <common_corrections>
      - Authoring → Authored
      - Creating → Created
      - Leading → Led
      - Managing → Managed
      - Developing → Developed
      - Implementing → Implemented
    </common_corrections>
  </verb_tense_rule>

  <keyword_diversity_rule>
    <priority>high</priority>
    <instruction>
      Keywords used in the professional summary should NOT be repeated in position bullets 
      unless the keyword is a JD "must-have" that requires multiple mentions for ATS ranking.
      
      Strategy:
      - Professional Summary: Include 6-8 strongest/most-mentioned JD keywords
      - Position Bullets: Include remaining 25-35 keywords distributed across all positions
      - Avoid repeating summary keywords in bullets to maximize keyword coverage
      
      Exception: Core role keywords (e.g., "requirements," "documentation," "stakeholders") 
      may appear in both if they appear 5+ times in the JD.
    </instruction>
  </keyword_diversity_rule>

  <pre_output_quality_checklist>
    <priority>high</priority>
    <instruction>
      Before presenting final bullets and summary, run through this checklist:
    </instruction>
    
    <automated_scan_patterns>
      Scan output for these common issues:
      - Search: \~ → Replace: ~
      - Search: "ing " at start of bullet → Flag for correction
      - Search: repeated exact phrases (>2 occurrences) → Flag for variation
      - Search: keywords in summary → Cross-check against bullets for duplication
      - Search: common achievements (version control, style guides, etc.) → Verify appears only in strongest position
    </automated_scan_patterns>
  </pre_output_quality_checklist>

  <automatic_quality_gate> <!-- v6.1.10 Change: Added automatic quality enforcement with regeneration loop -->
    <priority>critical</priority>
    <trigger>After generating bullets, BEFORE presenting output</trigger>

    <instruction>
      Execute this mandatory quality gate sequence before presenting ANY bullet output.
      This is a BLOCKING gate - output cannot be presented until all checks pass.
    </instruction>

    <step_1_run_quality_checklist>
      <action>Run pre_output_quality_checklist automated scans</action>
      <scans>
        - Escaped characters: Search for \~, \%, \+ and flag for correction
        - Gerunds: Search for "ing " at start of bullet and flag for correction
        - Repeated phrases: Search for exact phrases appearing >2 times and flag for variation
        - Keyword duplication: Check summary keywords against bullet keywords
        - Common achievements: Verify version control, style guides appear only in strongest position
      </scans>
    </step_1_run_quality_checklist>

    <step_2_check_verb_diversity>
      <action>Verify all 5 verb categories are represented across bullets</action>
      <categories_required>
        - Built (Blue): Creates new systems/products/processes
        - Lead (Orange): Drives initiatives, guides teams
        - Managed (Purple): Oversees resources, coordinates operations
        - Improved (Green): Optimizes and enhances existing systems
        - Collaborate (Pink): Partners cross-functionally, works with teams
      </categories_required>

      <validation_rules>
        <rule priority="critical">
          IF any category = 0 occurrences across ALL bullets:
          FLAG as "Incomplete diversity" and REGENERATE
        </rule>
        <rule priority="high">
          IF same category repeats within same position (e.g., Position 1 has 3 "Built" bullets):
          FLAG as "Repeated verb category" and REGENERATE
        </rule>
        <rule priority="moderate">
          PREFER balanced distribution (13-27% per category)
          If distribution is heavily skewed (>40% in one category), consider rebalancing
        </rule>
      </validation_rules>
    </step_2_check_verb_diversity>

    <step_3_regenerate_if_needed>
      <trigger>IF any flags from step 1 or step 2 are raised</trigger>

      <regeneration_process>
        1. Identify affected positions and specific issues
        2. For missing verb categories: Select bullets that can naturally use missing category
        3. For repeated categories within position: Rewrite one bullet using different category
        4. For escaped characters: Remove backslashes (~ not \~)
        5. For gerunds: Convert to past-tense verbs (Authored not Authoring)
        6. For repeated phrases: Apply variation strategies from phrase_variation_rule
        7. Regenerate affected bullets maintaining all requirements (character limits, metrics, etc.)
        8. Re-run steps 1 and 2 on regenerated bullets
        9. Repeat until ALL checks pass
      </regeneration_process>

      <quality_gate_failure_protocol> <!-- v6.3.0 Change: Added Guardrail #14 -->
        <priority>CRITICAL</priority>
        <instruction>
          If quality gate fails after 3 iterations, provide diagnostic output to user.
        </instruction>
        
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

      <if_no_issues>
        Proceed to step 4 (automatic plain text export)
      </if_no_issues>
    </step_3_regenerate_if_needed>

    <step_4_export_plain_text>
      <action>Auto-generate plain text export</action>
      <reference>See automatic_plain_text_export section below</reference>
    </step_4_export_plain_text>

    <critical_note>
      This quality gate ensures ZERO quality issues reach final output.
      Never skip or bypass this gate - it is mandatory for all bullet generation.
    </critical_note>
  </automatic_quality_gate>

  <automatic_plain_text_export> <!-- v6.1.10 Change: Added automatic plain text file generation -->
    <priority>high</priority>
    <priority>high</priority>
    <trigger>After automatic_quality_gate passes and all bullets finalized (Bullet Optimizer & Job Fit Analyzer)</trigger>

    <instruction>
      Automatically generate a clean, copy-paste ready block of text as the PRIMARY output.
      This serves Bullet Optimizer and Job Fit Analyzer.
    </instruction>

    <step_1_verify_chronological_order> <!-- v6.1.11 Change: Added chronological order verification -->
      <action>BEFORE creating plain text file, verify position ordering</action>
      <verification_process>
        1. Verify positions are in REVERSE CHRONOLOGICAL ORDER (newest first)
        2. If dates are unclear, use tenure duration or context clues
        3. Most recent position should appear first in the export
        4. Oldest position should appear last in the export
      </verification_process>
      <critical_rule>
        Plain text export MUST maintain reverse chronological order (most recent job first).
        This matches standard resume conventions and user expectations.
      </critical_rule>
    </step_1_verify_chronological_order>

    <step_2_format_and_export> <!-- v6.1.11 Change: Restructured as step 2 -->
      <action>Format plain text with positions ordered newest → oldest</action>
      <output>Create file in /mnt/user-data/outputs/</output>
    </step_2_format_and_export>

    <format_specification>
      <structure>
        [Professional Summary]

        POSITION 1: [Title] at [Company] | [Date Range]
        • [Bullet 1]
        • [Bullet 2]
        • [Bullet 3]

        POSITION 2: [Title] at [Company] | [Date Range]
        • [Bullet 1]
        • [Bullet 2]
        ...

        ---
        METADATA:
        Total Positions: X
        Total Bullets: X
        Character Count Per Bullet: X-X (target: 100-210)
        Total Word Count: X (target: 350-500)
        Verb Category Distribution:
          - Built (Blue): X bullets (X%)
          - Lead (Orange): X bullets (X%)
          - Managed (Purple): X bullets (X%)
          - Improved (Green): X bullets (X%)
          - Collaborate (Pink): X bullets (X%)
      </structure>

      <formatting_rules>
        - Use plain text bullet character: •
        - NO markdown formatting (no **, no _, no code blocks)
        - NO escaped characters (use ~ not \~)
        - Include date ranges for each position
        - Include verb category distribution for transparency
        - Character counts should be per-bullet ranges (e.g., "120-180")
      </formatting_rules>
    </format_specification>

    <output_location>
      <path>/mnt/user-data/outputs/[job-title-slug]-bullets.txt</path>
      <naming_convention>
        - Use job title from JD, convert to lowercase-with-hyphens
        - Example: "Senior Technical Writer" → "senior-technical-writer-bullets.txt"
        - If no JD, use: "optimized-resume-bullets.txt"
      </naming_convention>
      <directory_creation>
        If /mnt/user-data/outputs/ does not exist, create it before writing file
      </directory_creation>
    </output_location>

    <presentation>
      <method>Display plain text content in response</method>
      <format>Use code block for easy copy-paste</format>
      <message>
        Include this message after presenting bullets:

        "✅ Plain text export generated: [filename]

        This file contains your bullets in clean, copy-paste ready format with:
        - No markdown formatting
        - Proper bullet points (•)
        - Character/word count metadata
        - Verb category distribution

        You can copy directly from above or access the file at: /mnt/user-data/outputs/[filename]"
      </message>
    </presentation>

    <no_markdown_instruction>
      CRITICAL: Plain text export must NOT contain:
      - Bold/italic markdown (**, *, _, etc.)
      - Code blocks (```)
      - Heading markers (#)
      - Escaped characters (\~, \%, \+)

      Plain text should be completely clean and ready to paste into any resume builder or document.
    </no_markdown_instruction>
    <plain_text_grouping_format>
    <instruction>
      When exporting bullets to plain text, maintain grouping by job title 
      and reverse chronological order.
    </instruction>
    
    <plain_text_format>
      [JOB TITLE] at [COMPANY] | [DATE RANGE]
      Duration: [X years/months]
      
      • [COLORED VERB] [bullet text] [METRIC_TAG if applicable]
      • [COLORED VERB] [bullet text]
      
      Position Summary:
      Total bullets: X | With metrics: X (XX%)
      Verb distribution: [breakdown]
      
      ═════════════════════════════════════════════════════════════════════
    </plain_text_format>
    
    <note>
      In plain text export, color information is preserved in metadata:
      
      <!-- Color Legend: Built=BLUE, Led=ORANGE, Managed=PURPLE, Improved=GREEN, Collaborate=PINK -->
    </note>
  </plain_text_grouping_format>
</automatic_plain_text_export>

  <secondary_grammar_check_rule> <!-- v6.1.7 Change: Added mandatory secondary grammar check warning -->
    <priority>high</priority>
    <instruction>
      Whenever bullets or summaries are generated, ALWAYS include this mandatory hard-coded recommendation at the end of the output block:
      
      "[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM before pasting these bullets into your final resume and submitting."
    </instruction>
  </secondary_grammar_check_rule>

  <system_guardrails> <!-- v6.3.0 Change: Replaced checklist with exact XML for all 27 guardrails -->
    <bullet_grouping_verification_guardrail id="28">
      <priority>CRITICAL</priority>
      <trigger>Before displaying any bullet set in Resume Analysis, Bullet Optimizer, or Job Fit Analyzer</trigger>
      
      <purpose>
        Verify that bullets are properly grouped by job title and displayed in 
        reverse chronological order.
      </purpose>
      
      <verification_steps>
        1. Identify all positions in resume/job history
        2. Extract end dates for each position
        3. Sort positions by end date DESCENDING (most recent first)
        4. Verify each bullet is assigned to correct position
        5. Verify position header format is consistent
      </verification_steps>
      
      <common_errors_to_check>
        - Bullets mixed between positions
        - Positions in chronological order (should be reverse)
        - Missing position headers
        - Incomplete position metadata
        - Duplicate bullets across positions
      </common_errors_to_check>
      
      <failure_protocol>
        If grouping verification fails:
        1. STOP display
        2. Log specific verification failure
        3. Reprocess and re-sort positions
        4. Re-run verification before retrying
      </failure_protocol>
    </bullet_grouping_verification_guardrail>
    <metric_traceability_guardrail id="1">
      <instruction>
        For every numeric metric or specific achievement included in the output, you must perform an internal "source-check" before finalizing the draft.
      </instruction>
      <verification_steps>
        1. Identify the Job ID (Position N) for which you are writing.
        2. Scan ONLY the <position id="N"> block in the source job history.
        3. If the metric appears in any other position block, but NOT in block N, it is a HALLUCINATION and must be removed.
        4. Provide an internal "thinking" citation: [Metric X traced to Position N].
      </verification_steps>
    </metric_traceability_guardrail>

    <chronological_validation_guardrail id="2">
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

    <summary_abstraction_guardrail id="3">
      <instruction>
        The Professional Summary must function as an "Executive Synthesis," not a "Bullet Echo."
      </instruction>
      <constraints>
        - <constraint id="no_mirroring">No sentence in the summary can share more than 50% of its keywords with any single bullet point in the resume.</constraint>
        - <constraint id="synthesis_requirement">At least one sentence must synthesize metrics across multiple roles (e.g., "Led projects across [Industry A] and [Industry B], achieving [Cumulative Metric]").</constraint>
        - <constraint id="impact_first">Start sentences with the "Outcome" (The Why) rather than the "Action" (The How) to differentiate from bullets.</constraint>
      </constraints>
    </summary_abstraction_guardrail>

    <validity_heuristic_check id="4">
      <instruction>
        Perform a "Common Sense Audit" on metric-role pairings.
      </instruction>
      <audit_questions>
        - "Does it make sense for a [User_Role] to be personally responsible for [Result X]?"
        - "Is this metric too specific to a different job category (e.g., code coverage metrics in a PM role)?"
        - "If the metric is for a government role, does it strictly adhere to the Job History limitations for that specific agency?"
      </audit_questions>
    </validity_heuristic_check>

    <limitation_enforcement_guardrail id="5">
      <priority>CRITICAL</priority>
      <instruction>
        Before finalizing any bullet point, cross-reference the generated content against the <honest_limitations> section of the target Position.
      </instruction>
      <verification_logic>
        1. **Visible Step 0 Audit:** Verify limitations for every position in the visible "Pre-flight Guardrail Check" table (Step 0 of the workflow).
        2. IF generated_bullet mentions [Skill X] AND <honest_limitations> contains "No experience with [Skill X]":
           - FLAG as CONTRADICTION.
           - Remove the claim or rephrase to match the limitation.
      </verification_logic>
    </limitation_enforcement_guardrail>

    <data_loss_prevention_guardrail id="6"> <!-- v6.3.0 Change: Restored original with additions merged -->
      <priority>CRITICAL</priority>
      <trigger>When executing /update-history or modifying existing positions</trigger>
      <instruction>
        Ensure that adding or editing a position does not overwrite or delete unrelated existing data.
      </instruction>
      
      <!-- Item Count Verification (from v6.3.0 plan) -->
      <item_count_verification>
        Compare the "Item Count" of the original vs. the new draft.
        
        Rule:
        - New `core_responsibilities` count >= Original count (unless deletion explicitly requested).
        - New `key_achievements` count >= Original count.
        
        IF New count < Original count:
          STOP and verify: "Did you intend to remove [Missing Item]?"
      </item_count_verification>
      
      <!-- Original: Full validation with backup/restore logic -->
      <validation_logic>
        BEFORE saving finalized job history:
        1. LOAD original file.
        2. PERFORM 'Integrity Check':
            - count_before = total_positions
            - count_after = (total_positions + 1) [for Add] OR (total_positions) [for Edit]
            - IF count_after is unexpected:
              ABORT save.
              RE-SYNC with original file and RETRY update logic.
        3. SEARCH for "Placeholder" text or empty [brackets] in fields that were NOT part of the current update.
            IF found:
              BLOCK save and restore from backup.
      </validation_logic>
    </data_loss_prevention_guardrail>

    <skill_classification_guardrail id="7">
      <instruction>
        A single skill term cannot exist in both <hard_skills_demonstrated> and <soft_skills_demonstrated> within the same position.
      </instruction>
      <auto_correction>
        IF duplicates found:
        - Technical/Tools/Hard Skills -> Keep in <hard_skills_demonstrated>, remove from Soft.
        - Behavioral/Leadership/Interpersonal -> Keep in <soft_skills_demonstrated>, remove from Hard.
      </auto_correction>
    </skill_classification_guardrail>

    <budget_enforcement_guardrail id="8">
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
            1. Count words before delivery.
            2. IF total_words > 500: Remove the last bullet point from each position, starting with the oldest (Position 8) and moving forward, until total_words <= 500.
        IF total_words < 350:
          FLAG as "Underutilized" - consider adding bullets to strongest positions
      </total_word_count_validation>
    </budget_enforcement_guardrail>

    <position_verb_diversity_guardrail id="9">
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

    <keyword_density_guardrail id="10">
      <priority>MODERATE</priority>
      <instruction>
        Validate that JD keywords are distributed naturally across bullets and summary.
      </instruction>
      <density_rules>
        <rule id="no_stuffing">
          No single bullet should contain more than 3 distinct JD keywords.
        </rule>
        <rule id="minimum_coverage">
          Target: 8-12 unique JD keywords across entire output
        </rule>
        <rule id="natural_distribution">
          No keyword should appear more than 2 times across all bullets
        </rule>
      </density_rules>
    </keyword_density_guardrail>

    <metric_plausibility_guardrail id="11">
      <priority>HIGH</priority>
      <instruction>
        Apply common-sense validation to numeric claims before output.
      </instruction>
      <plausibility_checks>
        <check id="percentage_range">All percentages must be 0-100%</check>
        <check id="time_savings">Time reduction claims must show valid before/after context</check>
        <check id="currency_format">MANDATORY: All currency values MUST include $ symbol (e.g., $100K)</check>
      </plausibility_checks>
    </metric_plausibility_guardrail>

    <recency_weighting_guardrail id="12">
      <priority>MODERATE</priority>
      <instruction>
        Allocate bullets based on position recency and JD relevance.
      </instruction>
      <allocation_rules>
        <rule id="position_1_priority">
          Position 1 (most recent) should have:
            - Minimum 3 bullets
            - At least 2 quantified metrics
        </rule>
        <rule id="position_4_plus_constraint">
          Positions 4+ should have max 2 bullets.
        </rule>
      </allocation_rules>
    </recency_weighting_guardrail>

    <summary_metric_reconciliation_guardrail id="13">
      <priority>HIGH</priority>
      <instruction>
        Every quantified claim in the Professional Summary must be traceable to at least one bullet point.
      </instruction>
      <validation_process>
        1. Extract all metrics from Professional Summary
        2. FOR EACH metric in summary:
              Search all bullets for supporting evidence
              IF metric NOT found: FLAG as "Unsupported summary claim"
      </validation_process>
    </summary_metric_reconciliation_guardrail>

    <quality_gate_failure_protocol id="14">
      <priority>CRITICAL</priority>
      <instruction>
        If quality gate fails after 3 iterations, provide diagnostic output to user.
      </instruction>
    </quality_gate_failure_protocol>

    <phrase_repetition_enforcement_guardrail id="15">
      <priority>HIGH</priority>
      <instruction>
        Scan ALL bullets and summary for repeated multi-word phrases (3+ words).
      </instruction>
      <detection_logic>
        1. Extract all 3+ word sequences from drafted output.
        2. IF any sequence appears 3+ times:
           - FLAG as FAIL in Output Validator.
           - REGENERATE affected bullets using alternative phrasings.
      </detection_logic>
    </phrase_repetition_enforcement_guardrail>

    <master_skills_inventory_guardrail id="16">
      <priority>CRITICAL</priority>
      <instruction>
        Never add a skill to the <master_skills_inventory> unless it is explicitly and literally supported by a <key_achievement> or <core_responsibility> in the Job History. 
        Additionally, the inventory is QUARANTINED from bullet generation; ONLY use role-specific evidence for Position N bullets.
      </instruction>
      
      <protection_logic>
        WHEN user adds/edits a skill:
          SCAN position achievements for that skill keyword.
          IF NOT found:
            PROMPT: "I see you're adding [Skill], but I don't see matching achievements. Should we add an achievement that demonstrates this skill first?"
            BLOCK addition to master inventory until evidence is provided.
      </protection_logic>
      
      <quarantine_logic>
        When generating bullets for Position N, ONLY use evidence from that position's sections.
        NEVER reference the generic master_skills_inventory for role-specific bullet generation.
      </quarantine_logic>
    </master_skills_inventory_guardrail>

    <scope_attribution_guardrail id="17">
      <priority>HIGH</priority>
      <instruction>
        Verify that claimed achievements match the user's actual scope of control.
      </instruction>
      <attribution_rules>
        <rule id="team_achievement_markers">Distinguish individual vs. team scope.</rule>
        <rule id="organizational_results">Verify role level justifies company-wide metrics.</rule>
      </attribution_rules>
    </scope_attribution_guardrail>

    <cross_phase_consistency_guardrail id="18">
      <priority>CRITICAL</priority>
      <instruction>
        Job history generated in Resume Analysis is immutable unless user explicitly updates it.
      </instruction>
    </cross_phase_consistency_guardrail>

    <fit_score_consistency_guardrail id="19">
      <priority>MODERATE</priority>
      <instruction>
        Fit assessment score must be mathematically consistent with identified gaps.
      </instruction>
    </fit_score_consistency_guardrail>

    <acronym_expansion_guardrail id="20">
      <priority>MODERATE</priority>
      <instruction>
        Spell out domain-specific acronyms on first use.
      </instruction>
      <verification_logic>
        1. Generate internal "Acronym Inventory" at Step 1.1 (Pre-draft).
        2. Identify FIRST occurrence of each acronym (e.g., NIST, RBAC).
        3. MANDATORY: Spell out in full + abbreviation in parentheses (e.g., "National Institute of Standards and Technology (NIST)").
      </verification_logic>
    </acronym_expansion_guardrail>

    <limitation_bullet_cross_check_guardrail id="21">
      <priority>CRITICAL</priority>
      <instruction>
        Check honest_limitations BEFORE recommending bullets for each position.
      </instruction>
    </limitation_bullet_cross_check_guardrail>

    <em_dash_validation_guardrail id="22">
      <priority>HIGH</priority>
      <instruction>
        Scan ALL output text for em-dash characters (—) or spaced hyphens ( - ) before presenting to user.
      </instruction>
      <verification_logic>
        1. **Zero Em-dash:** Replace all em-dashes (—) with tight hyphens (-) or rephrase.
        2. **Tight Spacing:** 
           - Compound adjectives must be tight (e.g., `multi-agent`).
           - Date ranges must be tight (e.g., `Jan 2023-Present`).
        3. **FAIL Condition:** Any "spaced hyphen" (e.g., `Job - Title`) is a formatting violation.
      </verification_logic>
    </em_dash_validation_guardrail>

    <user_state_persistence_guardrail id="23">
      <priority>CRITICAL</priority>
      <instruction>
        User-stated preferences (location, remote preference, target roles) must be retained and applied across all phases.
      </instruction>
    </user_state_persistence_guardrail>

    <alternatives_presentation_guardrail id="24">
      <priority>HIGH</priority>
      <instruction>
        When optimizing bullets, present at least 2 alternatives that respect existing verb category usage.
      </instruction>
      <loop_prevention_principles>
        <principle id="soft_limits">Use SOFT constraints for global category counts.</principle>
        <principle id="escape_hatch">If all saturated, fall back to least-used category.</principle>
      </loop_prevention_principles>
    </alternatives_presentation_guardrail>

    <confirmation_tracking_guardrail id="25">
      <priority>MODERATE</priority>
      <instruction>
        Track user confirmations within session to avoid redundant questions.
      </instruction>
    </confirmation_tracking_guardrail>

    <output_structure_consistency_guardrail id="26">
      <priority>HIGH</priority>
      <instruction>
        All phase outputs must follow their defined structure templates.
      </instruction>
    </output_structure_consistency_guardrail>

    <input_type_detection_guardrail id="27">
      <priority>HIGH</priority>
      <instruction>
        Before processing user input, classify input type with confidence score.
      </instruction>
    </input_type_detection_guardrail>

    <metric_preservation_guardrail id="29">
      <priority>CRITICAL</priority>
      <trigger>When rewriting, optimizing, or editing existing bullets (especially for keyword inclusion)</trigger>
      
      <instruction>
        You must perform a "Data Integrity Audit" before finalizing any edited bullet.
      </instruction>
      
      <audit_logic>
        1. Extract all numeric values (integers, percentages, currency) from the ORIGINAL bullet.
        2. Extract all numeric values from the NEW bullet.
        3. IF a specific number from Original is missing in New:
            STOP and Verify: "Did I intend to remove this metric?"
            IF NO (accidental loss during rewriting): RESTORE the metric immediately.
            IF YES (replaced by better metric): Proceed.
      </audit_logic>
      
      <example>
        Original: "Managed 20 API calls across 6 systems."
        Draft: "Managed API calls to ensure team alignment."
        Audit: 
          - Original has {20, 6}
          - Draft has {}
          - ERROR: Data Loss Detected.
        Correction: "Managed 20 API calls across 6 systems to ensure team alignment."
      </example>
    </metric_preservation_guardrail>

    <!-- v8.3.1 Issue #42 -->
    <guardrail id="30">
      <name>modularity_compliance</name>
      <priority>CRITICAL</priority>
      <instruction>You MUST NOT modify logic directly in the GUI context. Ensure all system logic follows the v8 hub-and-spoke modular architecture.</instruction>
      <process>
        1. [NEW] Create standalone module in /optimization-tools/.
        2. [SHADOW] Add "Silent Sync" HTML markers in Gold Master (PROJECT-INSTRUCTIONS.md).
        3. [MODULAR] Replace GUI logic with &lt;modular_reference file="..." /&gt;.
      </process>
    </guardrail>

    <guardrail id="31">
      <name>workflow_lifecycle_compliance</name>
      <priority>CRITICAL</priority>
      <instruction>You MUST NOT proceed to planning or execution without first establishing the necessary project management infrastructure.</instruction>
      <steps>
        1. Identify or create a GitHub Issue (gh issue create).
        2. Establish a dedicated feature/patch branch.
        3. Update ROADMAP.md and CHANGELOG.md status.
        4. Save implementation plan to docs/plans/[branch-name].md.
      </steps>
    </guardrail>

    <custom_keyword_evidence_guardrail id="32">
      <priority>HIGH</priority>
      <trigger>When a user manually requests a keyword that is NOT found in their job history</trigger>
      <logic>
        IF user manually requests a keyword that is NOT in the job history:
        1. **Validation:** Check job history for evidence (synonyms allowed).
        2. **Warning:** If no evidence is found, you MUST warn the user: "I cannot find evidence of [keyword] in your history. Including it may not be defensible in an interview."
        3. **Override:** Only proceed if the user explicitly confirms (e.g., "Use it anyway").
        4. **Integration:** If confirmed but unverified, incorporate it LIGHTLY (do not make it the central theme).
      </logic>
    </custom_keyword_evidence_guardrail>
    <narrative_fit_verification id="33">
       <priority>HIGH</priority>
       <instruction>
         Ensure generated bullets align with the target role seniority and address key JD requirements.
       </instruction>
    </narrative_fit_verification>

    <markdown_bullet_enforcement id="34">
      <priority>HIGH</priority>
      <instruction>
        Ensure every optimized bullet in chat output is prefixed with a Markdown bullet character (- ) to force list rendering.
      </instruction>
      <logic>
        1. **Negative Pattern:** Bullet text starting with "✓" or "[[Category]]" without a leading "- ". 
        2. **FAIL Condition:** Any output where multiple bullets are rendered as a single paragraph block.
        3. **PASS Condition:** Every bullet is on its own line, prefixed with "- ".
      </logic>
    </markdown_bullet_enforcement>

    <visual_math_integrity_guardrail id="36">
      <priority>CRITICAL</priority>
      <instruction>
        The visible ASCII distribution bars MUST mathematically match the actual verb count in the text.
      </instruction>
      <logic>
        1. **Count:** Tally the actual verbs used in the generated bullets (e.g., 3 "Built").
        2. **Verify:** Check the ASCII bar percentage (e.g., "Built: 30%").
        3. **FAIL Condition:** If the bar shows a different percentage than the actual text count.
      </logic>
    </visual_math_integrity_guardrail>

    <verb_distribution_threshold_guardrail id="37">
      <priority>HIGH</priority>
      <instruction>
        Ensure no verb category is left behind. Every category must represent at least 5% of the total bullets.
      </instruction>
      <logic>
        1. **Calculation:** (Category Count / Total Bullets) * 100
        2. **Threshold:** If result < 5% (and Total Bullets >= 20), FLAG as a distribution imbalance.
        3. **Correction:** Reselect 1-2 bullets to use the under-represented category.
      </logic>
    </verb_distribution_threshold_guardrail>

    <action_verb_tense_enforcement id="35">
      <priority>CRITICAL</priority>
      <instruction>
        Strictly ban Gerunds (-ing) at the start of bullets. Bullets must start with Past Tense action verbs.
      </instruction>
      <logic>
        1. **Negative Pattern:** Bullet starts with "Managing", "Leading", "Developing", "Creating".
        2. **FAIL Condition:** Any bullet starting with a word ending in "ing".
        3. **Correction:** Convert to past tense (Managed, Led, Developed, Created).
      </logic>
    </action_verb_tense_enforcement>
  </system_guardrails>
</quality_assurance_rules>
