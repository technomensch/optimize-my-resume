# Role-Type Experience Validation

**Version:** 1.0  
**Date:** January 4, 2026  
**Applies to:** Phase 3 Pre-Generation Fit Assessment  
**Priority:** CRITICAL

---

## Purpose

Prevent conflating different role types (e.g., treating BA experience as PM experience) and ensure role-type experience calculations account for transferability.

---

## Validation Rule

```xml
<role_type_experience_validation>
  <version>1.0</version>
  <priority>CRITICAL</priority>
  
  <purpose>
    Different role types (PM, BA, TW, Engineer) have distinct responsibilities and 
    career paths. Experience in one role type does NOT automatically qualify for 
    senior positions in another role type.
  </purpose>
  
  <role_type_definitions>
    <role_type id="product_manager">
      <titles>Product Manager, Product Owner, Group PM, Director of Product</titles>
      <core_responsibilities>
        - Product strategy and vision
        - Roadmap prioritization with business impact
        - Customer discovery and market research
        - Cross-functional leadership (Eng, Design, Marketing, Sales)
        - Success metrics ownership (revenue, adoption, retention)
        - Go-to-market collaboration
        - Pricing and packaging decisions
      </core_responsibilities>
      <does_not_include>
        - Project management (timeline/resource coordination)
        - Business analysis (requirements documentation)
        - Scrum master activities (ceremony facilitation)
        - Technical writing (documentation creation)
      </does_not_include>
    </role_type>
    
    <role_type id="business_analyst">
      <titles>Business Analyst, Systems Analyst, Requirements Analyst</titles>
      <core_responsibilities>
        - Requirements elicitation and documentation
        - Process analysis and optimization
        - User story creation and acceptance criteria
        - Gap analysis between current and future state
        - Stakeholder communication and alignment
        - UAT coordination and test case creation
      </core_responsibilities>
      <does_not_include>
        - Product vision/strategy ownership
        - Roadmap prioritization decisions
        - Revenue/business metrics ownership
        - Go-to-market strategy
      </does_not_include>
    </role_type>
    
    <role_type id="technical_writer">
      <titles>Technical Writer, Documentation Specialist, Content Developer</titles>
      <core_responsibilities>
        - Documentation creation and maintenance
        - Style guide development
        - Content audits and gap analysis
        - User-facing content (help docs, tutorials)
        - Internal documentation (runbooks, SOPs)
        - Information architecture
      </core_responsibilities>
      <does_not_include>
        - Product decisions
        - Requirements ownership
        - Engineering work
        - Customer-facing strategy
      </does_not_include>
    </role_type>
    
    <role_type id="project_manager">
      <titles>Project Manager, Program Manager, Delivery Manager</titles>
      <core_responsibilities>
        - Timeline and resource coordination
        - Risk management and mitigation
        - Status reporting and communication
        - Dependency management
        - Budget tracking
        - Stakeholder coordination
      </core_responsibilities>
      <does_not_include>
        - Product strategy decisions
        - Technical implementation
        - Requirements ownership
        - Success metrics definition
      </does_not_include>
    </role_type>
  </role_type_definitions>
  
  <transferability_rules>
    <rule id="ba_to_pm">
      <from>Business Analyst</from>
      <to>Product Manager</to>
      <transferability>MODERATE (50-60%)</transferability>
      <what_transfers>
        - Requirements elicitation skills
        - Stakeholder communication
        - User story writing
        - Process thinking
      </what_transfers>
      <what_doesnt_transfer>
        - Product vision/strategy experience
        - Revenue responsibility
        - Go-to-market experience
        - Roadmap prioritization at product level
      </what_doesnt_transfer>
      <typical_gap>
        BA with 5 years experience ≈ PM with 1-2 years experience
        (BA skills provide foundation but not PM-specific expertise)
      </typical_gap>
    </rule>
    
    <rule id="tw_to_pm">
      <from>Technical Writer</from>
      <to>Product Manager</to>
      <transferability>LOW (25-35%)</transferability>
      <what_transfers>
        - Communication skills
        - User empathy (from writing for users)
        - Attention to detail
        - Cross-functional collaboration
      </what_transfers>
      <what_doesnt_transfer>
        - Product strategy
        - Business metrics ownership
        - Technical credibility with engineers
        - Customer discovery
        - Roadmap prioritization
      </what_doesnt_transfer>
      <typical_gap>
        TW with 5 years experience does NOT qualify for Senior PM roles
        Would need PM-specific experience or Associate PM entry point
      </typical_gap>
    </rule>
    
    <rule id="engineer_to_pm">
      <from>Software Engineer</from>
      <to>Product Manager</to>
      <transferability>MODERATE-HIGH (60-75%)</transferability>
      <what_transfers>
        - Technical credibility
        - Understanding of engineering constraints
        - Systems thinking
        - Data analysis
      </what_transfers>
      <what_doesnt_transfer>
        - Customer discovery skills
        - Go-to-market experience
        - Business metrics focus
        - Cross-functional leadership beyond engineering
      </what_doesnt_transfer>
    </rule>
  </transferability_rules>
  
  <validation_process>
    <step number="1">
      Identify the JD's target role type from title and responsibilities.
    </step>
    
    <step number="2">
      Categorize each position in candidate's job history by role type.
    </step>
    
    <step number="3">
      Calculate role-type experience:
      - Direct experience: Years in exact role type
      - Transferable experience: Years in related roles × transferability %
      - Total equivalent: Direct + (Transferable × factor)
    </step>
    
    <step number="4">
      Compare to JD requirements:
      - "Senior" roles typically require 5+ years direct experience
      - "Mid-level" roles typically require 2-4 years direct experience
      - Entry/Associate roles may accept 0 years with transferable skills
    </step>
  </validation_process>
  
  <examples>
    <example type="insufficient_experience">
      JD: "Senior Product Manager" (implies 5+ years PM experience)
      
      Candidate History:
      - Technical Writer: 3 years
      - Business Analyst: 2 years
      - Google Workspace Admin: 2 years
      
      Calculation:
      - Direct PM experience: 0 years
      - BA → PM transfer: 2 years × 55% = 1.1 equivalent years
      - TW → PM transfer: 3 years × 30% = 0.9 equivalent years
      - Admin → PM transfer: 2 years × 15% = 0.3 equivalent years
      - Total equivalent: 2.3 years
      
      Assessment:
      ❌ "Senior PM requires ~5+ years PM experience. You have 0 years direct 
      PM experience and ~2.3 equivalent years from transferable roles. 
      This is a significant gap for a Senior-level position."
    </example>
    
    <example type="sufficient_experience">
      JD: "Product Manager" (mid-level, 2-4 years)
      
      Candidate History:
      - Associate PM: 1.5 years
      - Business Analyst: 3 years
      
      Calculation:
      - Direct PM experience: 1.5 years
      - BA → PM transfer: 3 years × 55% = 1.65 equivalent years
      - Total equivalent: 3.15 years
      
      Assessment:
      ✅ "Mid-level PM requires 2-4 years. You have 1.5 years direct PM 
      experience plus strong BA background. Total equivalent: ~3 years. 
      This meets the requirement."
    </example>
    
    <example type="role_confusion">
      JD: "Technical Product Manager" (requires technical depth + PM skills)
      
      Candidate History:
      - Technical Writer for DevOps teams: 4 years
      - BA for cloud migration: 2 years
      
      Trap: Candidate might claim "technical PM" fit because they wrote 
      technical documentation.
      
      Correct Assessment:
      - Direct PM experience: 0 years
      - Technical depth: LOW (documented technical systems, didn't build them)
      - "Technical PM" requires BOTH PM experience AND technical implementation
      
      ❌ "Technical PM requires both PM experience and hands-on technical work. 
      You have 0 years PM experience and your technical exposure is documentation-
      based, not implementation-based. This is a poor fit."
    </example>
  </examples>
  
  <output_format>
    Include in fit assessment:
    
    **Role-Type Analysis**
    - JD Role Type: [Product Manager / Business Analyst / etc.]
    - Seniority Level: [Senior / Mid / Entry] (requires ~X years)
    - Your Direct Experience: X years as [role type]
    - Transferable Experience: X equivalent years from [related roles]
    - Gap Assessment: [NONE / MODERATE / SIGNIFICANT]
  </output_format>
</role_type_experience_validation>
```

---

## Usage Notes

- This rule is applied during Phase 3 Pre-Generation Fit Assessment
- Embedded inline in PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- Works in conjunction with portfolio-weighting.md to prevent experience inflation

---

## Version History

- v1.0 (January 4, 2026): Initial creation from v6.3.1 plan Task 5
