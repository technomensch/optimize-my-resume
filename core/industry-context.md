# Industry Context Validation

**Version:** 1.0  
**Date:** January 4, 2026  
**Applies to:** Phase 3 Pre-Generation Fit Assessment  
**Priority:** HIGH

---

## Purpose

Flag significant gaps when candidate's industry background doesn't match the job description's industry context, accounting for transferability differences.

---

## Validation Rule

```xml
<industry_context_validation>
  <version>1.0</version>
  <priority>HIGH</priority>
  
  <purpose>
    Different industries have fundamentally different operating models, metrics, 
    sales cycles, and success criteria. Experience in one industry doesn't always 
    transfer to another, especially for customer-facing roles like PM.
  </purpose>
  
  <industry_categories>
    <category id="b2b_saas">
      <name>B2B SaaS / Enterprise Software</name>
      <characteristics>
        - Revenue metrics: ARR, MRR, churn, expansion revenue
        - Sales cycle: 30-180 days, multiple stakeholders
        - Success metrics: NPS, adoption, feature usage, retention
        - GTM: Product-led growth, sales-assisted, enterprise sales
        - Pricing: Subscription tiers, usage-based, enterprise contracts
      </characteristics>
      <indicators_in_jd>
        "SaaS", "subscription", "ARR", "churn", "customer success", 
        "product-led", "enterprise sales", "self-serve"
      </indicators_in_jd>
    </category>
    
    <category id="government_contracting">
      <name>Government / Federal Contracting</name>
      <characteristics>
        - Revenue metrics: Contract value, ceiling, period of performance
        - Sales cycle: 6-24 months, RFP/RFQ process
        - Success metrics: Compliance, deliverables, CPARS ratings
        - GTM: Capture management, teaming agreements, set-asides
        - Pricing: T&M, FFP, cost-plus, IDIQ
      </characteristics>
      <indicators_in_jd>
        "Federal", "government", "agency", "FedRAMP", "compliance", 
        "clearance", "contracting officer"
      </indicators_in_jd>
    </category>
    
    <category id="consumer">
      <name>B2C / Consumer Products</name>
      <characteristics>
        - Revenue metrics: DAU/MAU, conversion, LTV, CAC
        - Sales cycle: Instant to 7 days
        - Success metrics: Engagement, retention, virality
        - GTM: Marketing-led, viral loops, app store optimization
        - Pricing: Freemium, ads, in-app purchases
      </characteristics>
      <indicators_in_jd>
        "Consumer", "B2C", "users", "engagement", "viral", "app store"
      </indicators_in_jd>
    </category>
    
    <category id="startup">
      <name>Startup / Early-Stage</name>
      <characteristics>
        - Resource constraints: Do more with less
        - Velocity: Ship fast, iterate faster
        - Ambiguity: Undefined processes, wear many hats
        - Risk tolerance: High, fail fast mentality
      </characteristics>
      <indicators_in_jd>
        "Fast-paced", "startup", "early-stage", "Series A/B", 
        "ambiguity", "wear many hats", "scrappy"
      </indicators_in_jd>
    </category>
    
    <category id="enterprise">
      <name>Enterprise / Large Corporation</name>
      <characteristics>
        - Process: Defined workflows, change management
        - Scale: Large teams, matrix organizations
        - Risk tolerance: Low, extensive planning
        - Velocity: Slower, more deliberate
      </characteristics>
      <indicators_in_jd>
        "Fortune 500", "enterprise", "global", "matrix organization",
        "change management", "stakeholder alignment"
      </indicators_in_jd>
    </category>
  </industry_categories>
  
  <transferability_matrix>
    <description>
      How well does experience in Industry A transfer to Industry B?
      Scale: HIGH (80%+), MODERATE (50-79%), LOW (20-49%), MINIMAL (0-19%)
    </description>
    
    <from_government_contracting>
      <to category="b2b_saas">LOW (30%)</to>
      <to category="consumer">MINIMAL (15%)</to>
      <to category="startup">LOW (25%)</to>
      <to category="enterprise">MODERATE (60%)</to>
      <reasoning>
        Government contracting has longer cycles, compliance focus, and different 
        success metrics. Process discipline transfers to enterprise, but B2B SaaS 
        velocity and consumer metrics are foreign.
      </reasoning>
    </from_government_contracting>
    
    <from_b2b_saas>
      <to category="government_contracting">LOW (35%)</to>
      <to category="consumer">MODERATE (55%)</to>
      <to category="startup">HIGH (85%)</to>
      <to category="enterprise">HIGH (80%)</to>
    </from_b2b_saas>
    
    <from_consumer>
      <to category="government_contracting">MINIMAL (10%)</to>
      <to category="b2b_saas">MODERATE (50%)</to>
      <to category="startup">HIGH (85%)</to>
      <to category="enterprise">MODERATE (55%)</to>
    </from_consumer>
  </transferability_matrix>
  
  <assessment_process>
    <step number="1">
      Identify JD industry category from company description and job requirements.
      Look for indicators listed in each category.
    </step>
    
    <step number="2">
      Identify candidate's industry background from job history.
      Categorize each position by industry.
    </step>
    
    <step number="3">
      Calculate industry match:
      - If 50%+ of experience is in JD's industry: No penalty
      - If 25-49% of experience is in JD's industry: Moderate gap (-10 to -15 points)
      - If 0-24% of experience is in JD's industry: Significant gap (-20 to -30 points)
    </step>
    
    <step number="4">
      Apply transferability adjustment:
      Use transferability_matrix to adjust the gap penalty.
      Example: Government → B2B SaaS = LOW (30%) transferability
               Gap penalty remains high even with transferable skills.
    </step>
  </assessment_process>
  
  <examples>
    <example type="significant_gap">
      Candidate Background: 100% Federal Government Contracting (6 positions)
      JD Industry: B2B SaaS Startup (Chainguard - container security)
      
      Assessment:
      - Industry match: 0% (no B2B SaaS experience)
      - Transferability: LOW (30%) from Government → B2B SaaS
      - Gap penalty: -25 points
      
      Output: "⚠️ INDUSTRY GAP: Your background is 100% federal government 
      contracting. This role is at a B2B SaaS startup with different success 
      metrics (ARR, churn, product-led growth), sales cycles, and velocity 
      expectations. Industry transferability: LOW."
    </example>
    
    <example type="partial_match">
      Candidate Background: 60% B2B SaaS, 40% Enterprise
      JD Industry: B2B SaaS Startup
      
      Assessment:
      - Industry match: 60% (majority B2B SaaS)
      - Transferability: N/A (direct match)
      - Gap penalty: None
      
      Output: No industry gap flagged.
    </example>
    
    <example type="transferable">
      Candidate Background: 100% Enterprise Software
      JD Industry: B2B SaaS (growth stage)
      
      Assessment:
      - Industry match: 0% (no SaaS-specific experience)
      - Transferability: HIGH (80%) from Enterprise → B2B SaaS
      - Gap penalty: -5 points (minimal due to high transferability)
      
      Output: "ℹ️ INDUSTRY NOTE: Your background is enterprise software. 
      This transfers well to B2B SaaS, though you may need to adapt to 
      faster iteration cycles and product-led growth metrics."
    </example>
  </examples>
  
  <output_integration>
    <location>Include in preliminary fit assessment output</location>
    <format>
      Add "Industry Context" section to fit assessment:
      
      **Industry Context**
      - JD Industry: [Category]
      - Your Background: [Category breakdown]
      - Transferability: [HIGH/MODERATE/LOW/MINIMAL]
      - Impact on Fit Score: [+/- X points]
    </format>
  </output_integration>
</industry_context_validation>
```

---

## Usage Notes

- This rule is applied during Phase 3 Pre-Generation Fit Assessment
- Embedded inline in PROJECT-INSTRUCTIONS.md and quick-start-phase.md
- Particularly important for PM, sales, and customer-facing roles

---

## Version History

- v1.0 (January 4, 2026): Initial creation from v6.3.1 plan Task 4
