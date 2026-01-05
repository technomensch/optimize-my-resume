# Lessons Learned: Fit Assessment Calibration - Closing Instruction Gaps for Cross-LLM Consistency

**Date:** January 4, 2026
**Context:** Optimize-My-Resume v6.3.0 → v6.3.1, Phase 3 Fit Assessment
**Problem Solved:** Identified and addressed 5 instruction gaps that allowed LLMs to interpret fit assessment criteria inconsistently

---

## The Problem We Faced

When the same job description was evaluated by two different LLMs using identical project instructions, they produced fundamentally different assessments—not because of model capabilities, but because the instructions lacked explicit guardrails for ambiguous scenarios.

**Issues Discovered:**

1. **Portfolio projects treated as professional experience** - Instructions didn't specify that personal/side projects should be weighted differently than employment when assessing "years of experience" requirements

2. **"Adjacent technical" left undefined** - When a JD required "technical background or adjacent technical experience," there was no guidance on what qualifies as "adjacent technical" vs. "technical-adjacent support roles"

3. **Documentation experience conflated with hands-on experience** - A Technical Writer who "documented Kubernetes architecture" was being matched to "Kubernetes experience" requirements

4. **Industry context ignored** - No guidance on how government contracting experience transfers (or doesn't) to B2B SaaS roles, or vice versa

5. **Role-type conflation** - Business Analyst experience was being counted toward Product Manager requirements without clear transferability rules

**Impact:**

- One model might auto-proceed to bullet generation while another correctly stops with a "weak fit" warning
- Users could receive false confidence about their fit for roles they're unqualified for
- The system's core value proposition (honest, defensible assessment) was undermined by instruction ambiguity

**Why This Matters:**

Any LLM-based system relying on complex assessment logic will produce inconsistent results if the instructions contain implicit assumptions. Different models fill in ambiguity differently based on their training—what seems "obvious" to one model may not be to another.

---

## What We Learned: Explicit Beats Implicit

### The Core Insight

**LLMs don't share common sense assumptions.** When instructions say "assess technical experience," each model interprets "technical" based on its training. One model might liberally credit documentation work; another might strictly require hands-on engineering. Neither is wrong—the instructions failed to specify.

**The Solution:**

Every assessment criterion that involves judgment must have:
1. **Explicit definitions** (what counts, what doesn't)
2. **Boundary examples** (edge cases with correct/incorrect interpretations)
3. **Quantified transferability** (if X transfers to Y, by how much?)
4. **Validation questions** (objective tests to apply)

---

## The Solution: Five Calibration Modules

### Module 1: Portfolio Project Weighting

**Problem:** A user's impressive GitHub portfolio was being counted as equivalent to professional PM experience.

**Root Cause:** Instructions said "check job history for experience" but didn't distinguish employment from personal projects.

**Solution:**
```xml
<portfolio_project_weighting>
  <rule id="skills_only">
    Portfolio projects count toward "technical skills demonstrated" ONLY.
    They do NOT count toward:
    - Years of professional experience in a role type
    - Customer-facing product management experience
    - Revenue or P&L responsibility
  </rule>
  
  <rule id="recency_discount">
    Portfolio projects receive 50% weight compared to equivalent 
    professional experience for skill matching.
  </rule>
</portfolio_project_weighting>
```

**Key Principle:** Building a personal tool ≠ Managing a product for customers. Managing your own backlog ≠ Managing a product roadmap with stakeholders.

---

### Module 2: Adjacent Technical Definition

**Problem:** Technical Writers and Business Analysts were being classified as having "adjacent technical experience" because they worked with technical teams.

**Root Cause:** No definition of what "adjacent technical" actually means.

**Solution:** Five assessment questions that objectively categorize roles:

| Question | Yes = Technical | No = Support Role |
|----------|-----------------|-------------------|
| Did this role require writing production code? | ✅ | ❌ |
| Did this role require on-call/pager duty? | ✅ | ❌ |
| Did this role require architecture decisions? | ✅ | ❌ |
| Did this role require infrastructure debugging? | ✅ | ❌ |
| Did this role require security hardening? | ✅ | ❌ |

**Scoring:**
- 3+ "Yes" → Valid adjacent technical experience
- 1-2 "Yes" → Partial technical exposure (flag as gap)
- 0 "Yes" → Technical-adjacent support role (NOT "adjacent technical")

**Key Principle:** "Working WITH technical systems" ≠ "Working IN/ON technical systems"

---

### Module 3: Keyword Context Validation

**Problem:** A Technical Writer's job history listed "Kubernetes, Docker, AWS" in their tools section, and this was matched to JD requirements for "container orchestration experience."

**Root Cause:** No distinction between documenting a technology vs. operating it.

**Solution:** Three-tier evidence system:

| Tier | Description | Weight |
|------|-------------|--------|
| **Direct Evidence** | "Built CI/CD pipeline using Jenkins" | 100% |
| **Supervised Exposure** | "Tested deployments in UAT environment" | 50% |
| **Documentation Only** | "Created runbooks for Kubernetes operations" | 0% |

**Validation Process:**
1. Identify the **verb context** (Built vs. Documented vs. Researched)
2. Check the **role context** (Engineer vs. Technical Writer vs. BA)
3. Apply the **Interview Test**: "Could this person speak to implementation details, or only high-level documentation?"

**Key Principle:** Writing ABOUT a technology ≠ Working WITH that technology.

---

### Module 4: Industry Context Validation

**Problem:** 100% government contracting experience was being assessed as a good fit for B2B SaaS startup roles.

**Root Cause:** No guidance on industry transferability.

**Solution:** Transferability matrix with explicit percentages:

| From → To | B2B SaaS | Government | Consumer | Startup |
|-----------|----------|------------|----------|---------|
| **Government** | 30% | 100% | 15% | 25% |
| **B2B SaaS** | 100% | 35% | 55% | 85% |
| **Consumer** | 50% | 10% | 100% | 85% |
| **Enterprise** | 80% | 60% | 55% | 50% |

**Assessment Process:**
1. Identify JD industry from company description
2. Categorize candidate's background by industry
3. Calculate match percentage
4. Apply transferability adjustment to fit score

**Key Principle:** Different industries have different metrics, sales cycles, and success criteria. Experience doesn't transfer 1:1.

---

### Module 5: Role-Type Experience Validation

**Problem:** 5 years of Business Analyst experience was being counted as qualifying for Senior Product Manager roles.

**Root Cause:** No explicit mapping of how role types transfer to each other.

**Solution:** Role transferability rules with "equivalent years" calculation:

| From | To | Transferability | What Transfers | What Doesn't |
|------|-----|-----------------|----------------|--------------|
| BA → PM | 50-60% | Requirements, stakeholder communication | Product vision, revenue ownership |
| TW → PM | 25-35% | Communication, user empathy | Strategy, technical credibility |
| Engineer → PM | 60-75% | Technical depth, systems thinking | Customer discovery, GTM |
| PM → BA | 80-90% | Process thinking, requirements | N/A (PM is superset) |

**Calculation Example:**
- Candidate: 3 years BA + 2 years TW
- JD: Senior PM (requires ~5 years)
- Equivalent: (3 × 0.55) + (2 × 0.30) = 1.65 + 0.6 = **2.25 equivalent years**
- Assessment: Significant gap for Senior PM role

**Key Principle:** Adjacent role experience provides foundation but not role-specific expertise.

---

## Implementation Results

### Problems Fixed

- ✅ Portfolio projects now weighted at 50% for skills, 0% for role experience
- ✅ "Adjacent technical" has objective 5-question assessment
- ✅ Keyword matching validates verb context (built vs. documented)
- ✅ Industry mismatch flagged with transferability percentage
- ✅ Role-type gaps calculated with equivalent years methodology

### What This Enables

**Before:**
- Model A: "92% fit - proceeding to bullet generation"
- Model B: "52% fit - weak match, recommend not applying"
- User confused about which assessment to trust

**After:**
- Both models apply same validation rules
- Explicit penalties documented in output
- User understands exactly why fit score is what it is
- Consistent recommendations regardless of which LLM processes the request

---

## Root Cause Analysis

### Why Did These Gaps Exist?

**1. Assumed Shared Context**
- Original instructions assumed the LLM would "know" that a Technical Writer documenting Kubernetes isn't the same as a DevOps engineer operating Kubernetes
- Different models have different assumptions baked in from training

**2. Binary Matching Logic**
- Original logic: "Does keyword X appear in job history? Yes/No"
- Missing: "In what context does keyword X appear?"

**3. Missing Transferability Framework**
- Original logic treated all experience as equally relevant
- No accounting for industry differences or role-type boundaries

**4. Portfolio/Professional Conflation**
- Job history schema didn't distinguish employment types
- A GitHub portfolio with 200 commits looked equivalent to 2 years of employment

### How the New Modules Prevent Each Issue

| Gap | Prevention Mechanism |
|-----|---------------------|
| Portfolio inflation | `portfolio_project_weighting` rules with 50% cap |
| "Adjacent technical" ambiguity | 5-question objective assessment |
| Documentation false positives | 3-tier evidence validation with verb context |
| Industry mismatch | Transferability matrix with explicit percentages |
| Role-type conflation | Equivalent years calculation with transferability factors |

---

## Replication Pattern for Any LLM Assessment System

### Generic Calibration Framework

Any LLM-based assessment system should include these components:

```xml
<assessment_calibration_framework>
  
  <!-- 1. Define what counts as evidence -->
  <evidence_tiers>
    <tier weight="100%">Direct/hands-on experience</tier>
    <tier weight="50%">Supervised/supported exposure</tier>
    <tier weight="0%">Observation/documentation only</tier>
  </evidence_tiers>
  
  <!-- 2. Define boundary conditions -->
  <boundary_definitions>
    <definition term="[ambiguous_term]">
      <includes>[explicit list of what qualifies]</includes>
      <excludes>[explicit list of what doesn't qualify]</excludes>
      <assessment_questions>[objective tests to apply]</assessment_questions>
    </definition>
  </boundary_definitions>
  
  <!-- 3. Define transferability rules -->
  <transferability_matrix>
    <from category="A" to="B" percentage="X%">
      <what_transfers>[list]</what_transfers>
      <what_doesnt>[list]</what_doesnt>
    </from>
  </transferability_matrix>
  
  <!-- 4. Define weighting rules for different source types -->
  <source_weighting>
    <source type="professional_employment" weight="100%"/>
    <source type="portfolio_project" weight="50%"/>
    <source type="coursework" weight="25%"/>
    <source type="self_reported" weight="0%">Requires verification</source>
  </source_weighting>
  
  <!-- 5. Define calculation order -->
  <calculation_order>
    <step>Calculate raw score from requirement matching</step>
    <step>Apply evidence tier validation</step>
    <step>Apply source weighting rules</step>
    <step>Apply transferability adjustments</step>
    <step>Apply boundary definition penalties</step>
    <step>Final score = adjusted total</step>
  </calculation_order>
  
</assessment_calibration_framework>
```

### Key Design Decisions

- **Explicit over implicit:** If something requires judgment, define the judgment criteria
- **Quantified transferability:** Don't say "some transfer"—say "55% transfer"
- **Objective tests:** Provide yes/no questions that any model can answer consistently
- **Negative examples:** Show what DOESN'T count, not just what does
- **Calculation order:** Specify exactly when each rule applies

---

## How to Implement in Your Project

### Step 1: Identify Ambiguous Assessment Criteria

Review your instructions for phrases like:
- "relevant experience"
- "technical background"
- "similar roles"
- "transferable skills"

Each of these needs explicit definition.

### Step 2: Create Boundary Definitions

For each ambiguous term:
1. List 3-5 things that definitely qualify
2. List 3-5 things that definitely don't qualify
3. Create objective assessment questions
4. Provide edge case examples with correct interpretations

### Step 3: Build Transferability Rules

If your system assesses "fit" across categories (industries, role types, skill areas):
1. Create explicit percentage mappings
2. Document what transfers and what doesn't
3. Provide calculation examples

### Step 4: Add Evidence Tier Validation

For any keyword or skill matching:
1. Define what constitutes "direct" evidence
2. Define what constitutes "partial" evidence
3. Define what should be excluded (documentation-only, etc.)

### Step 5: Test with Multiple Models

Run the same assessment through 2-3 different LLMs:
- If scores vary by >15%, you have instruction gaps
- Identify which criteria caused divergence
- Add explicit rules until scores converge

---

## Lessons for Future Features

### **Lesson 1: LLMs Fill Ambiguity Differently**

**Pattern:** When instructions contain implicit assumptions, different models will fill them with different defaults based on their training data.

**Application:** Every "obvious" criterion in an assessment system needs to be made explicit with boundary conditions.

**Result:** Cross-model consistency improved from ~40 point variance to <10 point variance.

---

### **Lesson 2: Negative Examples Are as Important as Positive Examples**

**Pattern:** Saying what DOES count is insufficient. You must also say what DOESN'T count.

**Application:** Added explicit exclusion lists to every definition (e.g., "Technical-adjacent support roles do NOT qualify as adjacent technical experience").

**Result:** False positive rate for keyword matching reduced significantly.

---

### **Lesson 3: Quantify Transferability or Don't Mention It**

**Pattern:** Vague statements like "some skills transfer" allow models to assign arbitrary weights.

**Application:** Replaced qualitative language with explicit percentages (e.g., "BA → PM transferability: 55%").

**Result:** Role-type assessments became reproducible and explainable.

---

### **Lesson 4: Multi-Model Testing Reveals Instruction Weaknesses**

**Pattern:** Testing with only one model hides instruction gaps because that model's assumptions mask the ambiguity.

**Application:** Established Multi-Model Adversarial Validation (MMAV) as standard practice—run critical assessments through multiple models to surface interpretation differences.

**Result:** Identified 5 instruction gaps that single-model testing missed.

---

## Common Pitfalls to Avoid

### Pitfall 1: Assuming "Common Sense" Interpretation

**Problem:** Instructions said "assess technical depth" assuming all models would know that Technical Writers don't have "technical depth" in the engineering sense.

**Solution:** Define exactly what "technical depth" means with specific indicators:
- Production code ownership
- Architecture decision authority
- On-call responsibility
- Infrastructure debugging capability

---

### Pitfall 2: Treating All Job History Equally

**Problem:** A GitHub portfolio with 47 releases looked equivalent to 2 years of professional PM work.

**Solution:** Categorize experience sources and weight them differently:
- Professional employment: 100%
- Portfolio projects: 50%
- Coursework/certifications: 25%
- Self-reported skills: 0% (requires evidence)

---

### Pitfall 3: Binary Keyword Matching

**Problem:** "Kubernetes" in job history matched to "Kubernetes experience" requirement, regardless of context.

**Solution:** Validate keyword context before matching:
- What verb precedes the keyword? (Built vs. Documented)
- What role was the person in? (Engineer vs. Writer)
- What tier of evidence does this represent?

---

### Pitfall 4: Ignoring Industry Context

**Problem:** Government contracting experience was assessed as equivalent to B2B SaaS experience.

**Solution:** Create explicit industry transferability matrix showing that different industries have different:
- Success metrics (CPARS vs. ARR)
- Sales cycles (24 months vs. 30 days)
- Decision-making processes (RFP vs. self-serve)

---

## Questions This Solves for Future Developers

**Q: "Why did two different LLMs give me completely different fit scores?"**
A: The original instructions contained ambiguous criteria that models interpreted differently. The calibration modules add explicit definitions, boundary conditions, and quantified transferability rules so all models apply the same logic.

**Q: "Should I count my side projects as professional experience?"**
A: No. Portfolio projects demonstrate skills but don't count toward "years of experience" requirements. They receive 50% weight for skill matching and 0% for role-type experience.

**Q: "I documented Kubernetes clusters—does that count as Kubernetes experience?"**
A: No. Documentation-only evidence receives 0% weight. "Writing ABOUT a technology" ≠ "Working WITH that technology." You would need hands-on operational experience (Tier 1) or supervised exposure (Tier 2) for it to count.

**Q: "How much does my BA experience count toward PM roles?"**
A: Approximately 55%. Three years of BA experience equals ~1.65 equivalent years of PM experience. Requirements elicitation and stakeholder communication transfer, but product vision and revenue ownership don't.

**Q: "How do I know if my instructions have similar gaps?"**
A: Run the same assessment through 2-3 different LLMs. If scores vary by more than 15%, you have instruction gaps. Look for ambiguous terms, missing boundary definitions, and unquantified transferability claims.

---

## Conclusion

**What we built:** Five calibration modules that close instruction gaps allowing inconsistent LLM interpretation of fit assessment criteria.

**Why it matters:** Any LLM-based assessment system that relies on implicit assumptions will produce inconsistent results across models. Explicit definitions, quantified transferability, and objective validation questions create reproducible assessments.

**How it's retained:** Calibration modules are integrated into Phase 3 pre-generation assessment with explicit calculation order and penalty application.

**How to replicate:** Follow the Generic Calibration Framework pattern—define evidence tiers, boundary conditions, transferability rules, source weighting, and calculation order for any assessment criteria.

---

**Key Takeaway:**
*LLMs don't share common sense—every judgment criterion in an assessment system must have explicit definitions, boundary examples, and quantified transferability rules, or different models will fill the ambiguity with different assumptions.*

---

**Created:** January 4, 2026
**Version:** 1.0
**Category:** Process

**Related Docs:**
- `fit-assessment-calibration-plan.md` (implementation plan)
- `phases/phase-3/workflow-router.md` (Phase 3 routing logic)
- `core/fit-thresholds.md` (fit scoring methodology)

**Related Issues Solved:**
- Cross-LLM fit assessment inconsistency
- Portfolio project over-crediting
- Documentation-as-experience false positives
- Industry transferability gaps
- Role-type conflation

**Tags:** #process #fit-assessment #cross-llm #calibration #guardrails
