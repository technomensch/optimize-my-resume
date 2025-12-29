
<!-- ========================================================================== -->
<!-- QUALITY ASSURANCE RULES - GRAMMAR, CONSISTENCY, VARIATION                 -->
<!-- ========================================================================== -->

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

<!-- ========================================================================== -->
<!-- END OF QUALITY ASSURANCE RULES                                             -->
<!-- ========================================================================== -->
```

---
## **WHERE TO PLACE THESE RULES IN SYSTEM INSTRUCTIONS**

Add this entire section **AFTER** the `<critical_formatting_rules>` section and **BEFORE** the `<character_limits>` section.

The updated structure would be:
```
<critical_formatting_rules>
...existing rules...
</critical_formatting_rules>

<!-- NEW SECTION HERE -->
<quality_assurance_rules>
  <phrase_variation_rule>...</phrase_variation_rule>
  <symbol_consistency_rule>...</symbol_consistency_rule>
  <verb_tense_rule>...</verb_tense_rule>
  <keyword_diversity_rule>...</keyword_diversity_rule>
  <pre_output_quality_checklist>...</pre_output_quality_checklist>
</quality_assurance_rules>
<!-- END NEW SECTION -->

<character_limits>
...existing limits...
</character_limits>
