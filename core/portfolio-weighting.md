# Portfolio Project Weighting Rules

**Version:** 9.3.5  
**Date:** January 28, 2026  
**Applies to:** Job Fit Analyzer  
**Priority:** HIGH

---

## Purpose

Prevent portfolio/personal projects from being weighted equally to professional employment when calculating fit scores and role experience.

---

## Validation Rule

```xml
<portfolio_project_weighting>
  <version>1.0</version>
  <priority>HIGH</priority>
  
  <definition>
    Portfolio projects include:
    - Personal GitHub repositories
    - Side projects and hobby work
    - Open-source contributions (unless paid/sponsored)
    - Self-directed learning projects
    - Freelance work without formal employment relationship
    - Positions marked as "Personal Project" or "Portfolio" in job history
  </definition>
  
  <weighting_rules>
    <rule id="skills_only">
      Portfolio projects count toward "technical skills demonstrated" category ONLY.
      They do NOT count toward:
      - Years of professional experience in a role type (PM, Engineer, etc.)
      - Customer-facing product management experience
      - B2B/B2C/Enterprise sales cycle experience
      - Revenue or P&L responsibility
      - Team leadership or people management experience
      - Industry-specific experience (SaaS, FinTech, Healthcare, etc.)
    </rule>
    
    <rule id="recency_discount">
      When calculating fit scores, portfolio projects receive 50% weight compared 
      to equivalent professional experience for skill matching.
      
      Example:
      - Professional role with "workflow automation": 100% skill credit
      - Portfolio project with "workflow automation": 50% skill credit
    </rule>
    
    <rule id="scope_limitations">
      Portfolio projects cannot demonstrate:
      - Cross-functional leadership (no real org to navigate)
      - Stakeholder management at scale (self-directed ≠ org politics)
      - Production system ownership (personal repos ≠ enterprise systems)
      - Customer success metrics (no paying customers unless proven)
      
      Exception: If portfolio project has documented external users, paying 
      customers, or organizational adoption, treat as professional experience.
    </rule>
  </weighting_rules>
  
  <pm_role_specific_rules>
    <rule id="pm_experience_validation">
      For Product Manager roles, the following MUST come from professional employment:
      - Product roadmap ownership
      - Customer discovery and research
      - Feature prioritization with stakeholders
      - Go-to-market collaboration
      - Success metrics ownership (retention, revenue, adoption)
      
      Building a personal tool (even a sophisticated one) does NOT equal PM experience.
      Managing your own project backlog ≠ Managing a product for customers.
    </rule>
  </pm_role_specific_rules>
  
  <examples>
    <example type="incorrect_assessment">
      Job History: "Built multi-agent AI system with 47 releases in personal GitHub repo"
      JD Requirement: "3+ years Product Management experience"
      
      ❌ WRONG: "Direct match - managed product releases"
      ✅ CORRECT: "Portfolio project demonstrates technical skills and release 
         discipline, but does not count toward PM experience requirement. 
         PM Experience: 0 years."
    </example>
    
    <example type="incorrect_assessment">
      Job History: "Created documentation system with 15,000+ lines across 25 files"
      JD Requirement: "Experience driving product strategy and roadmaps"
      
      ❌ WRONG: "Direct match - drove documentation strategy and roadmap"
      ✅ CORRECT: "Portfolio project shows planning ability, but personal project 
         roadmaps ≠ customer-facing product roadmaps with revenue implications."
    </example>
    
    <example type="correct_assessment">
      Job History: "Open-source project with 500+ GitHub stars and 50+ contributors"
      JD Requirement: "Experience leading cross-functional teams"
      
      ✅ CORRECT: "Open-source leadership with external contributors demonstrates 
         some cross-functional coordination. Partial credit (50%) for team leadership."
    </example>
  </examples>
</portfolio_project_weighting>
```

---

## Usage Notes

- This rule is applied during Job Fit Analyzer
- Embedded inline in PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- Works in conjunction with role-type-validation.md for comprehensive experience assessment

---

## Version History

- v1.0 (January 4, 2026): Initial creation from v6.3.1 plan Task 1
