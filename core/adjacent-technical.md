# Adjacent Technical Area Definition

**Version:** 9.3.5  
**Date:** January 28, 2026  
**Applies to:** Job Fit Analyzer  
**Priority:** HIGH

---

## Purpose

Define clear boundaries for "adjacent technical" experience to distinguish roles that build/operate systems from those that support/document them.

---

## Validation Rule

```xml
<adjacent_technical_definition>
  <version>1.0</version>
  <priority>HIGH</priority>
  
  <context>
    Many JDs include language like "technical background required" or "experience 
    in systems, networks, or adjacent technical areas." This section defines what 
    qualifies as "adjacent technical" vs. "technical-adjacent support roles."
  </context>
  
  <valid_adjacent_technical_roles>
    <description>
      Roles where the person BUILDS, OPERATES, or ENGINEERS technical systems:
    </description>
    <examples>
      - Site Reliability Engineering (SRE)
      - DevOps / Platform Engineering
      - Systems Administration
      - Network Engineering
      - Security Engineering / Security Operations
      - Data Engineering / Data Platform
      - Database Administration
      - Cloud Infrastructure Engineering
      - QA/Test Automation Engineering
      - Technical Support Engineering (Tier 3+)
      - Solutions Architecture
      - Technical Sales Engineering (with hands-on implementation)
    </examples>
  </valid_adjacent_technical_roles>
  
  <invalid_adjacent_technical_roles>
    <description>
      Roles that SUPPORT or DOCUMENT technical systems but don't build/operate them:
    </description>
    <examples>
      - Technical Writing (writes ABOUT systems, doesn't build them)
      - Business Analysis (gathers requirements, doesn't implement)
      - Project Management (coordinates technical work, doesn't do it)
      - IT Help Desk / Tier 1-2 Support (uses systems, doesn't engineer them)
      - SaaS Administration (configures tools, doesn't build infrastructure)
      - Scrum Master / Agile Coach (facilitates, doesn't build)
      - Technical Recruiting (evaluates technical skills, doesn't have them)
      - Technical Training (teaches systems, may not engineer them)
    </examples>
  </invalid_adjacent_technical_roles>
  
  <distinction_rule>
    <rule priority="critical">
      "Working WITH technical systems" ≠ "Working IN/ON technical systems"
      
      - Working WITH: Uses technical systems as tools to accomplish non-technical goals
        Example: Using Jira to manage projects, administering Google Workspace
        
      - Working IN/ON: Builds, maintains, or operates technical infrastructure
        Example: Writing Terraform configs, managing Kubernetes clusters, building CI/CD pipelines
    </rule>
  </distinction_rule>
  
  <assessment_questions>
    <question id="1">Did this role require writing code that went to production?</question>
    <question id="2">Did this role require on-call/pager duty for system reliability?</question>
    <question id="3">Did this role require architecture decisions for scalability/performance?</question>
    <question id="4">Did this role require debugging production incidents at the infrastructure level?</question>
    <question id="5">Did this role require security hardening or vulnerability remediation?</question>
    
    <scoring>
      - 3+ "Yes" answers: Valid adjacent technical experience
      - 1-2 "Yes" answers: Partial technical exposure (flag as gap)
      - 0 "Yes" answers: Technical-adjacent support role (not "adjacent technical")
    </scoring>
  </assessment_questions>
  
  <examples>
    <example type="valid">
      Role: "Google Workspace Administrator supporting 10,000 users"
      Assessment Questions:
      - Production code? No (configuration, not code)
      - On-call duty? Possibly (for major outages)
      - Architecture decisions? No (SaaS platform)
      - Infrastructure debugging? No (SaaS platform)
      - Security hardening? Partial (policy configuration)
      
      Score: 0-1 "Yes" → Technical-adjacent support role
      Verdict: Does NOT qualify as "adjacent technical" for PM roles requiring 
               developer credibility
    </example>
    
    <example type="valid">
      Role: "DevOps Engineer managing CI/CD pipelines and Kubernetes clusters"
      Assessment Questions:
      - Production code? Yes (pipeline configs, scripts)
      - On-call duty? Yes
      - Architecture decisions? Yes
      - Infrastructure debugging? Yes
      - Security hardening? Yes
      
      Score: 5 "Yes" → Valid adjacent technical experience
      Verdict: Qualifies as "adjacent technical" for PM roles
    </example>
    
    <example type="edge_case">
      Role: "Technical Writer for cloud infrastructure documentation"
      Assessment Questions:
      - Production code? No
      - On-call duty? No
      - Architecture decisions? No (documents others' decisions)
      - Infrastructure debugging? No
      - Security hardening? No
      
      Score: 0 "Yes" → Technical-adjacent support role
      Verdict: Writing ABOUT Kubernetes ≠ Working WITH Kubernetes
               Does NOT qualify as "adjacent technical"
    </example>
  </examples>
</adjacent_technical_definition>
```

---

## Usage Notes

- This rule is applied during Job Fit Analyzer
- Embedded inline in PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- Works in conjunction with keyword-context.md to prevent false-positive technical matches

---

## Version History

- v1.0 (January 4, 2026): Initial creation from v6.3.1 plan Task 2
