# Keyword Context Validation Rules

**Version:** 1.0  
**Date:** January 4, 2026  
**Applies to:** Phase 3 Pre-Generation Fit Assessment  
**Priority:** CRITICAL

---

## Purpose

Prevent false matches where someone documented/wrote about a technology but didn't actually work with it hands-on.

---

## Core Principle

**Writing ABOUT a technology ≠ Working WITH that technology**  
**Documenting a system ≠ Operating that system**  
**Researching a tool ≠ Using that tool in production**

---

## Validation Rule

```xml
<keyword_context_validation>
  <version>1.0</version>
  <priority>CRITICAL</priority>
  
  <core_principle>
    Writing ABOUT a technology ≠ Working WITH that technology
    Documenting a system ≠ Operating that system
    Researching a tool ≠ Using that tool in production
  </core_principle>
  
  <validation_process>
    <step number="1">
      When matching a JD keyword to job history, identify the VERB CONTEXT:
      
      ✅ VALID action verbs (hands-on work):
      - Built, Developed, Implemented, Deployed, Configured
      - Managed, Administered, Operated, Maintained
      - Engineered, Architected, Designed (with implementation)
      - Debugged, Troubleshot, Resolved, Fixed
      - Migrated, Upgraded, Scaled, Optimized
      
      ❌ INVALID action verbs (support work):
      - Documented, Wrote about, Created documentation for
      - Researched, Evaluated, Assessed, Analyzed
      - Interviewed SMEs about, Gathered requirements for
      - Trained users on, Created training for
      - Observed, Shadowed, Learned about
    </step>
    
    <step number="2">
      Check the ROLE CONTEXT:
      
      If the job title is "Technical Writer," "Business Analyst," "Project Manager," 
      or similar support role, be SKEPTICAL of technology claims:
      
      - A Technical Writer who "worked with Kubernetes" likely DOCUMENTED Kubernetes,
        not OPERATED Kubernetes clusters
      - A BA who "worked with AWS" likely gathered REQUIREMENTS for AWS migration,
        not ARCHITECTED AWS infrastructure
    </step>
    
    <step number="3">
      Apply the "Interview Test":
      
      "If a hiring manager asked 'Tell me about your experience with [Technology X],'
      could this person speak to hands-on implementation details, or only high-level
      documentation/requirements?"
      
      - Hands-on: "I configured the ingress controllers and debugged networking issues"
      - Documentation: "I wrote the runbooks that explained how to configure ingress"
    </step>
  </validation_process>
  
  <evidence_tiers>
    <tier id="1" name="direct_evidence" weight="100%">
      <description>Hands-on implementation or operation</description>
      <indicators>
        - "Built [system] using [technology]"
        - "Managed [X] instances of [technology]"
        - "On-call for [system] incidents"
        - "Deployed to production using [technology]"
      </indicators>
    </tier>
    
    <tier id="2" name="supervised_exposure" weight="50%">
      <description>Worked alongside practitioners, had some hands-on exposure</description>
      <indicators>
        - "Tested [technology] in UAT environment"
        - "Configured [tool] settings under engineer guidance"
        - "Participated in [system] incident response"
        - "Assisted with [technology] migration"
      </indicators>
    </tier>
    
    <tier id="3" name="documentation_only" weight="0%">
      <description>Wrote about or documented technology without hands-on use</description>
      <indicators>
        - "Documented [technology] architecture"
        - "Created runbooks for [system]"
        - "Wrote CONOPS for [platform]"
        - "Gathered requirements for [technology] implementation"
        - "Interviewed engineers about [system]"
      </indicators>
    </tier>
  </evidence_tiers>
  
  <examples>
    <example type="false_positive_prevention">
      Job History Entry: "Authored NIST-compliant CONOPS for Space Force cloud initiatives on DoD PaaS infrastructure"
      JD Keyword: "Cloud-native development experience"
      
      Analysis:
      - Action verb: "Authored" → Documentation work
      - Role context: Technical Writer
      - Evidence tier: Tier 3 (documentation only)
      
      ❌ WRONG: "Match found - cloud-native experience from Space Force role"
      ✅ CORRECT: "No match - candidate documented cloud systems but did not 
         develop or operate them. Cloud-native development: NOT EVIDENCED."
    </example>
    
    <example type="false_positive_prevention">
      Job History Entry: "Created 5 user playbooks with annotated screenshots for ServiceNow HR"
      JD Keyword: "ServiceNow development experience"
      
      Analysis:
      - Action verb: "Created playbooks" → Documentation work
      - Role context: Technical Writer
      - Evidence tier: Tier 3 (documentation only)
      
      ❌ WRONG: "Match found - ServiceNow experience"
      ✅ CORRECT: "No match - candidate created end-user documentation for ServiceNow 
         but did not develop or configure the platform. ServiceNow development: NOT EVIDENCED."
    </example>
    
    <example type="valid_match">
      Job History Entry: "Built Power Automate workflows automating employee onboarding, eliminating 3 manual processes"
      JD Keyword: "Workflow automation experience"
      
      Analysis:
      - Action verb: "Built" → Hands-on implementation
      - Role context: Technical Writer (but implemented, not just documented)
      - Evidence tier: Tier 1 (direct evidence)
      
      ✅ CORRECT: "Match found - hands-on workflow automation using Power Automate"
    </example>
    
    <example type="partial_match">
      Job History Entry: "Tested and evaluated new Google Workspace features in UAT environment"
      JD Keyword: "Google Workspace administration"
      
      Analysis:
      - Action verb: "Tested and evaluated" → Supervised exposure
      - Role context: Administrator (legitimate admin work)
      - Evidence tier: Tier 2 (supervised exposure, 50% weight)
      
      ✅ CORRECT: "Partial match (50%) - UAT testing experience with Google Workspace, 
         but not primary administrator role"
    </example>
  </examples>
  
  <common_false_positive_patterns>
    <pattern id="1">
      Trap: Technical Writer lists technologies in "tools_technologies" section
      Reality: They documented these tools, didn't operate them
      Fix: Cross-reference with key_achievements - look for implementation verbs
    </pattern>
    
    <pattern id="2">
      Trap: BA lists platforms in "hard_skills_demonstrated"
      Reality: They gathered requirements FOR these platforms, didn't build ON them
      Fix: Check if any achievement shows hands-on work, not just requirements
    </pattern>
    
    <pattern id="3">
      Trap: PM lists engineering tools in skills
      Reality: They managed engineers who used these tools
      Fix: "Managed team using [tool]" ≠ "Used [tool]"
    </pattern>
  </common_false_positive_patterns>
</keyword_context_validation>
```

---

## Usage Notes

- This rule is applied during Phase 3 Pre-Generation Fit Assessment
- Embedded inline in PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- Works in conjunction with adjacent-technical.md and role-type-validation.md

---

## Version History

- v1.0 (January 4, 2026): Initial creation from v6.3.1 plan Task 3
