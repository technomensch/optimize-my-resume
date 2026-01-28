# Job History Template System

<job_history_template_system>
  <version>1.1</version>
  <created>January 13, 2026</created>

  <overview>
    A comprehensive template system ensuring ALL LLMs (Claude, Gemini, ChatGPT, Copilot)
    generate job history summaries with IDENTICAL structure, regardless of which AI assistant
    is used. Includes XML schema templates, validation scripts, conversion tools, and
    automated workflow skills.
  </overview>

  <problem_solved>
    Before the template system:
    - Different LLMs used different tag names
    - Sections appeared in different orders
    - No standardized validation process
    - Inconsistent date formats
    - Manual conversion to presentation formats

    After the template system:
    - Guaranteed cross-LLM structural consistency
    - Automated validation catches schema violations
    - Dual-format architecture (.txt for LLMs, .md for humans)
    - Workflow automation for version management
  </problem_solved>

  <dual_format_architecture>
    <purpose>Optimize for both machine readability and human presentation</purpose>

    <txt_format>
      <extension>.txt (XML structure)</extension>
      <purpose>Source of truth for LLM consumption</purpose>
      <characteristics>
        - XML-like tag structure for semantic clarity
        - Explicit section markers
        - Schema validation compatible
        - Optimized for LLM parsing
      </characteristics>
      <usage>
        - Primary format for job history generation
        - Edit this format when updating content
        - Version control as authoritative source
      </usage>
    </txt_format>

    <md_format>
      <extension>.md (Markdown)</extension>
      <purpose>Presentation format for human viewing</purpose>
      <characteristics>
        - Emoji headers (🎯, 🏢, 📊, 💼)
        - Markdown tables for metrics
        - Hierarchical structure
        - Professional formatting
      </characteristics>
      <usage>
        - Generated automatically from .txt
        - Use for presentations and reviews
        - Do NOT edit directly (regenerate from .txt)
      </usage>
    </md_format>

    <workflow>
      1. Generate/edit .txt file (XML structure)
      2. Validate using validate_job_history.py
      3. Convert to .md using convert_job_history_to_md.py
      4. Version control both formats (.txt is authoritative)
    </workflow>
  </dual_format_architecture>

  <template_files_location>
    <xml_schema>templates/job_history_template.xml</xml_schema>
    <markdown_template>templates/job_history_template.md</markdown_template>
    <llm_instructions>templates/LLM_GENERATION_INSTRUCTIONS.md (3,500+ words)</llm_instructions>
    <system_readme>templates/README.md (comprehensive guide)</system_readme>

    <critical_rule>
      ALL LLMs MUST reference templates/LLM_GENERATION_INSTRUCTIONS.md before
      generating job history to ensure consistent structure.
    </critical_rule>
  </template_files_location>

  <required_schema_structure>
    <file_header>
      COMPREHENSIVE JOB HISTORY SUMMARIES - VERSION X.Y (DESCRIPTION)
      Format: vX.Y Schema
      Last Updated: [Date]
      Total Jobs: X
    </file_header>

    <version_history_block>
      <!-- Version History:
      vX.Y: Brief description (Month Day, Year)
        - Change 1
        - Change 2
        - Change 3
      -->
    </version_history_block>

    <global_sections>
      - education (formal degrees)
      - certifications (professional certifications)
      - master_skills_inventory (comprehensive skills list)
    </global_sections>

    <position_structure>
      <position id="N">
        <metadata>...</metadata>
        <professional_summary>...</professional_summary>
        <core_responsibilities>...</core_responsibilities>
        <key_achievements>...</key_achievements>
        <hard_skills_demonstrated>...</hard_skills_demonstrated>
        <soft_skills_demonstrated>...</soft_skills_demonstrated>
        <tools_technologies>...</tools_technologies>
        <impact_metrics>...</impact_metrics>
        <industry_domain>...</industry_domain>
        <methodology>...</methodology>
        <strategic_decisions>...</strategic_decisions>
        <team_scope>...</team_scope>
        <honest_limitations>...</honest_limitations>
      </position>
    </position_structure>

    <critical_rules>
      <rule priority="critical">ALWAYS use exact tag names from template (no synonyms)</rule>
      <rule priority="critical">NEVER skip sections (use "Not applicable" if no data)</rule>
      <rule priority="critical">ALWAYS maintain section order as defined in template</rule>
      <rule priority="high">Use standardized date format: "Month Year" or "Present"</rule>
      <rule priority="high">Balance all XML tags (every opening tag has closing tag)</rule>
    </critical_rules>
  </required_schema_structure>

  <validation_and_conversion>
    <validation_script>
      <path>scripts/validate_job_history.py</path>
      <purpose>Ensure job history files comply with template schema</purpose>
      <usage>python3 scripts/validate_job_history.py &lt;file.txt&gt;</usage>

      <checks>
        - Header format validation
        - Version history presence
        - Required global sections (education, certifications, master_skills_inventory)
        - Required position sections (metadata, professional_summary, core_responsibilities, etc.)
        - Metadata completeness (job_title, company, dates, duration)
        - Professional summary length (minimum 2 sentences)
        - XML tag balance (all tags properly opened/closed)
      </checks>

      <output>
        ✅ VALIDATION PASSED - Job history file matches template schema!
        OR
        ❌ VALIDATION FAILED - Fix errors and run validation again
      </output>
    </validation_script>

    <conversion_script>
      <path>scripts/convert_job_history_to_md.py</path>
      <purpose>Convert .txt (XML) to .md (Markdown) presentation format</purpose>
      <usage>python3 scripts/convert_job_history_to_md.py &lt;file.txt&gt;</usage>

      <features>
        - XML parsing with regex
        - Emoji header generation
        - Markdown table formatting for metrics
        - Hierarchical structure creation
        - Achievement expansion (CONTEXT/ACTION/RESULT/IMPACT)
        - Professional summary formatting
        - Skills list conversion
      </features>

      <output>
        ✅ Converted file.txt to file.md
      </output>
    </conversion_script>

    <critical_workflow>
      ALWAYS validate BEFORE converting:

      1. Generate/edit job_history_vX.txt
      2. python3 scripts/validate_job_history.py job_history_vX.txt
      3. If validation passes, proceed to step 4
      4. python3 scripts/convert_job_history_to_md.py job_history_vX.txt
      5. Review job_history_vX.md for presentation quality
    </critical_workflow>
  </validation_and_conversion>

  <workflow_skills>
    <skill_1_md_job_history>
      <name>/md-job-history</name>
      <location>.agent/workflows/md-job-history.md</location>
      <purpose>Convert job history .txt to .md format</purpose>

      <usage>
        /md-job-history [filename.txt]

        Examples:
        /md-job-history chat-history/claude_generated_job_history_summaries_v7.txt
        /md-job-history  (Claude will infer or ask for filename)
      </usage>

      <workflow>
        1. Identify source file (from parameter or context)
        2. Validate file exists and is readable
        3. Run conversion script
        4. Report success with output filename
      </workflow>

      <integration>
        Works seamlessly with /update-history workflow
      </integration>
    </skill_1_md_job_history>

    <skill_2_update_history>
      <name>/update-history</name>
      <location>.agent/workflows/update-history.md</location>
      <purpose>Intelligent version management with surgical updates</purpose>

      <usage>
        /update-history [filename.txt]

        Examples:
        /update-history chat-history/claude_generated_job_history_summaries_v7.txt
        /update-history  (Claude will analyze chat context for updates)
      </usage>

      <workflow>
        1. Identify source file (provided, inferred from context, or ask)
        2. Analyze chat context to identify updates needed
        3. Determine version increment (MAJOR/MINOR/PATCH)
        4. Copy and increment version number
        5. Apply surgical updates (preserve existing content)
        6. Validate updated file
        7. Convert to Markdown
        8. Provide summary of changes
      </workflow>

      <version_increment_rules>
        <major>v7.0 → v8.0: New/removed position, major restructuring, schema changes</major>
        <minor>v7.0 → v7.1: Added achievements, updated metrics, new skills, content enhancements</minor>
        <patch>v7.1 → v7.1.1: Typo fixes, minor clarifications, formatting corrections</patch>
      </version_increment_rules>

      <surgical_update_philosophy>
        ✅ DO:
        - Add new content to existing sections
        - Enhance existing bullet points
        - Insert new achievements/responsibilities
        - Update specific metrics
        - Preserve all existing detail

        ❌ DON'T:
        - Rewrite entire sections from scratch
        - Remove existing content (unless explicitly requested)
        - Change structure/order without reason
        - Lose existing metrics or details
      </surgical_update_philosophy>
    </skill_2_update_history>
  </workflow_skills>

  <best_practices>
    <practice priority="critical">
      Keep .txt as source of truth, generate .md for presentations
    </practice>

    <practice priority="critical">
      Always validate before converting (.txt → .md)
    </practice>

    <practice priority="high">
      Reference templates/LLM_GENERATION_INSTRUCTIONS.md before generating job history
    </practice>

    <practice priority="high">
      Use surgical updates only - preserve existing content, add/enhance specific sections
    </practice>

    <practice priority="high">
      Version control both .txt and .md files, but .txt is authoritative
    </practice>

    <practice priority="moderate">
      Run /update-history before chat compaction to preserve context
    </practice>
  </best_practices>

  <cross_llm_consistency>
    <guarantee>
      By following templates/LLM_GENERATION_INSTRUCTIONS.md, ANY LLM will generate:
      - Identical XML structure
      - Same tag names
      - Same section order
      - Consistent date formats
      - Validated schema compliance
    </guarantee>

    <llms_supported>
      - Claude (Anthropic)
      - Gemini (Google)
      - ChatGPT (OpenAI)
      - Copilot (Microsoft)
      - Any other LLM with access to template files
    </llms_supported>

    <validation_ensures>
      Template system prevents structural drift as LLM technology evolves.
      Validation script catches inconsistencies immediately.
    </validation_ensures>
  </cross_llm_consistency>

  <example_files>
    <latest_version>chat-history/claude_generated_job_history_summaries_v7.1.txt</latest_version>
    <markdown_version>chat-history/claude_generated_job_history_summaries_v7.1.md</markdown_version>

    <reference>
      Always refer to latest version for style, tone, and structure examples
    </reference>
  </example_files>

  <troubleshooting>
    <problem>Validation fails</problem>
    <solution>
      1. Read error messages carefully
      2. Open file and template side-by-side
      3. Fix missing/misordered sections
      4. Re-validate
    </solution>

    <problem>Conversion produces malformed Markdown</problem>
    <solution>
      1. Check if .txt has proper XML structure
      2. Ensure tags are balanced
      3. Verify content between tags isn't malformed
      4. Re-run conversion after fixes
    </solution>

    <problem>Different LLM generated different structure</problem>
    <solution>
      1. Ensure LLM was given templates/LLM_GENERATION_INSTRUCTIONS.md
      2. Explicitly reference templates/job_history_template.xml
      3. Validate output - catches inconsistencies
      4. Regenerate following template exactly
    </solution>
  </troubleshooting>

  <integration_with_phases>
    <phase_1_integration>
      When generating job history in Phase 1:
      1. Reference templates/job_history_template.xml for structure
      2. Follow templates/LLM_GENERATION_INSTRUCTIONS.md for consistency
      3. Generate .txt file following exact schema
      4. Validate using scripts/validate_job_history.py
      5. Convert to .md using scripts/convert_job_history_to_md.py
      6. Deliver both formats to user
    </phase_1_integration>

    <phase_2_integration>
      When optimizing bullets in Phase 2:
      - Reference job history .txt for context
      - Maintain consistency with template structure
      - Update job history using /update-history workflow
    </phase_2_integration>

    <phase_3_integration>
      When comparing to JD in Phase 3:
      - Reference job history .txt for evidence matching
      - Use structured achievement format (CONTEXT/ACTION/RESULT/IMPACT)
      - Update job history if new accomplishments discovered
    </phase_3_integration>
  </integration_with_phases>

  <version_history_template_system>
    v1.0 (January 2, 2026):
    - Created XML schema template (templates/job_history_template.xml)
    - Created Markdown template (templates/job_history_template.md)
    - Authored 3,500+ word LLM instruction guide
    - Built Python validation script (226 lines)
    - Built Python conversion script (400+ lines)
    - Created /md-job-history workflow skill
    - Created /update-history workflow skill
    - Established dual-format architecture
  </version_history_template_system>
</job_history_template_system>
