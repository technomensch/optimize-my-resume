# Optimize-My-Resume: Complete System Guide

**Version:** 6.4.0  
**Last Updated:** January 6, 2026  
**Author:** Marc Kaplan  
**Status:** Production Ready  
**Word Count:** ~25,000 words

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Core Philosophy](#core-philosophy)
4. [Phase System Detailed Guide](#phase-system-detailed-guide)
5. [Quality Assurance Framework](#quality-assurance-framework)
6. [Advanced Validation Rules](#advanced-validation-rules)
7. [Knowledge Management Integration](#knowledge-management-integration)
8. [Implementation Guide](#implementation-guide)
9. [Appendices](#appendices)
10. [Conclusion](#conclusion)

---

## Executive Summary

**Optimize-My-Resume** is a sophisticated AI-powered resume optimization system that transforms vague resume bullets into quantified, defensible achievements—without ever fabricating numbers. Built using natural language development methodology and cross-LLM compatible prompts, the system includes 27 quality guardrails, comprehensive validation rules, and integrated knowledge management.

### What Makes This Different

- **Zero Fabrication Policy**: Never invents metrics—asks questions, uses ranges, or omits claims
- **Evidence-Based Keywords**: All keywords must be traceable to actual job history
- **Cross-Platform Portability**: XML prompts work identically across Claude, Gemini, ChatGPT, Copilot
- **27 Quality Guardrails**: Automatic validation with regeneration loops (max 3 iterations)
- **Knowledge Integration**: Built-in lessons learned and session summaries for continuous improvement

### Primary Use Cases

1. **Job Seekers**: Optimize resume for specific job applications with authentic, defensible bullets
2. **Career Coaches**: Systematic framework for client resume reviews with quality assurance
3. **AI Developers**: Reference architecture for prompt engineering systems and multi-agent workflows
4. **Researchers**: Study case for AI-assisted development, evidence-based AI, and cross-LLM compatibility

### Key Statistics

- **47 releases** in 5 weeks (9.4 releases/week velocity)
- **210 commits** across 2 repositories
- **187 markdown files** (79,898 lines of technical documentation)
- **27 quality guardrails** with automatic validation
- **4 phases** covering full workflow (analysis → optimization → comparison → summary)
- **8 entry scenarios** with intelligent routing
- **100% cross-LLM compatibility** via XML-structured prompts

---

## System Architecture

### Four-Phase Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRY POINT ROUTER                        │
│  • Detects user state (has resume/history/JD?)             │
│  • Classifies intent (analyze/optimize/compare?)           │
│  • Validates input (JD vs resume vs bullets?)              │
│  • Routes to appropriate phase with confirmation           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│     PHASE 1      │          │     PHASE 2      │
│  Full Resume     │          │     Bullet       │
│    Analysis      │          │  Optimization    │
│                  │          │                  │
│ • Parse resume   │          │ • Parse bullets  │
│ • Generate v2.0  │          │ • Ask questions  │
│ • Calculate exp  │          │ • Check history  │
│ • Score 4 cats   │          │ • Generate alts  │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         └──────────────┬──────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │                               │
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│     PHASE 3      │          │     PHASE 4      │
│       JD         │          │    Summary       │
│   Comparison     │          │   Generation     │
│                  │          │                  │
│ • Fit assessment │          │ • Synthesize     │
│ • Evidence match │          │ • Apply strategy │
│ • Gap analysis   │          │ • Generate       │
│ • Bullet gen     │          │ • Validate       │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         └──────────────┬──────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTOMATIC QUALITY GATE                          │
│  • 27 guardrails validation                                 │
│  • Verb diversity check (5 categories)                      │
│  • Character limits (100-210 per bullet)                    │
│  • Regeneration loop (max 3 iterations)                     │
│  • Plain text auto-export                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               OUTPUT DELIVERY                                │
│  • Formatted bullets with color-coded verbs                 │
│  • Plain text export (copy-paste ready)                     │
│  • Metadata report (character counts, verb distribution)    │
│  • Keyword coverage report (evidenced vs skipped)           │
└─────────────────────────────────────────────────────────────┘
```

### Entry Point Router (8 Scenarios)

The system automatically detects user state and routes to the appropriate workflow:

| # | Scenario | Condition | Route | Action |
|---|----------|-----------|-------|--------|
| 1 | New User | Has resume, no job history | Phase 1 | Generate job history v2.0 |
| 2 | JD Comparison | Has job history + JD | Phase 3 | Parse JD + evidence matching |
| 3 | Bullet Optimization | Has job history + bullets | Phase 2 | Optimize with context |
| 4 | Ambiguous Intent | Has job history, unclear goal | Ask | Present menu (1-4 options) |
| 5 | First Interaction | No resume, no history | Explain | Show welcome + A/B/C/D/E menu |
| 6 | Incremental Update | "Add/edit/remove position" | Update | Modify job history surgically |
| 7 | Re-Comparison | "Compare again" + updated history | Re-Run | JD analysis with diff output |
| 8 | Ambiguous Input | Cannot determine input type | Clarify | Two-step confirmation |

### Component Architecture

**Core Components:**

1. **Entry Router**
   - State detection (hasResume, hasJobHistory, hasJD)
   - Intent classification (analyze, optimize, compare, update)
   - Input validation (JD vs resume vs bullets vs other)
   - User confirmation (present detected intent, ask for confirmation)

2. **Phase Processors**
   - Phase 1: Resume parser + job history generator
   - Phase 2: Bullet analyzer + question generator + optimizer
   - Phase 3: JD parser + fit assessor + evidence matcher + bullet generator
   - Phase 4: Cross-position synthesizer + summary generator

3. **Quality Gates**
   - 27 guardrails organized in 5 categories
   - Automatic validation (scan all output before delivery)
   - Regeneration loop (max 3 iterations)
   - Failure protocol (diagnostic output if 3 iterations insufficient)

4. **Knowledge Management**
   - Lessons learned (categorized: architecture/debugging/process/patterns)
   - Session summaries (month-based organization, auto-generated)
   - ADRs - Architecture Decision Records (sequential numbering 001-999)
   - Knowledge graph (quick-reference, concepts/patterns/gotchas)

5. **Template System**
   - XML schema (job_history_template.xml)
   - Markdown template (job_history_template.md)
   - LLM instructions (3,500+ words for cross-LLM consistency)
   - Validation script (Python, 226 lines)
   - Conversion script (Python, 400+ lines)

### Data Flow Architecture

```
User Input
   │
   ▼
┌──────────────────────────────────┐
│      ENTRY ROUTER                │
│                                  │
│  1. Detect State                 │
│     ├─ hasResume? (bool)         │
│     ├─ hasJobHistory? (bool)     │
│     └─ hasJD? (bool)             │
│                                  │
│  2. Classify Intent              │
│     ├─ analyze (Phase 1)         │
│     ├─ optimize (Phase 2)        │
│     ├─ compare (Phase 3)         │
│     ├─ update (incremental)      │
│     └─ unclear (ask user)        │
│                                  │
│  3. Validate Input               │
│     ├─ JD validation             │
│     ├─ Resume validation         │
│     └─ Anti-false-positive       │
│                                  │
│  4. Confirm with User            │
│     └─ Present detected intent   │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│     PHASE PROCESSOR              │
│                                  │
│  1. Execute Workflow             │
│     ├─ Phase-specific logic      │
│     ├─ Load job history if needed│
│     └─ Apply methodologies       │
│                                  │
│  2. Evidence Matching            │
│     ├─ Keyword validation        │
│     ├─ Context validation        │
│     ├─ Role-type validation      │
│     └─ Industry validation       │
│                                  │
│  3. Generate Output              │
│     ├─ Bullets (Phase 2/3)       │
│     ├─ Summary (Phase 4)         │
│     └─ Reports (all phases)      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│      QUALITY GATES               │
│                                  │
│  1. Run Checklist                │
│     ├─ Escaped chars (\~, \%)   │
│     ├─ Gerunds (ing at start)   │
│     ├─ Repeated phrases (>2x)   │
│     └─ Keyword duplication       │
│                                  │
│  2. Verb Diversity               │
│     ├─ Check 5 categories        │
│     ├─ Flag missing categories   │
│     └─ Flag repeated within pos  │
│                                  │
│  3. Regenerate if Needed         │
│     ├─ Identify issues           │
│     ├─ Fix specific problems     │
│     ├─ Re-validate               │
│     └─ Repeat (max 3 iterations) │
│                                  │
│  4. Export Plain Text            │
│     ├─ Verify chronological      │
│     ├─ Format with • bullets     │
│     └─ Include metadata          │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│     OUTPUT DELIVERY              │
│                                  │
│  • Formatted bullets             │
│  • Plain text export             │
│  • Metadata report               │
│  • Keyword coverage report       │
│  • Secondary check reminder      │
└──────────────────────────────────┘
```

---

## Core Philosophy

### Principle 1: Authenticity Over Impressiveness

**Core Rule:** Never fabricate numbers. Authentic resumes build trust and prepare candidates for interviews.

**Strategies When Metrics Are Missing:**

1. **Ask Clarifying Questions**
   ```
   System asks:
   - "How many users did this system support?"
   - "What was the timeline—weekly, monthly, quarterly?"
   - "Was there a before/after comparison you can reference?"
   - "What was the team size or scope?"
   - "Was there an SLA, quota, or performance target?"
   ```

2. **Use Conservative Ranges**
   ```
   ❌ BAD:  "Reduced deployment errors by 87.3%"
   ✅ GOOD: "Reduced deployment errors ~80% (baseline: 20/month → ~4/month)"
   
   Why better:
   ├─ Uses ~ to indicate approximation
   ├─ Shows baseline for context
   ├─ Provides concrete before/after
   └─ Defensible in interviews
   ```

3. **Convert Time to Cost**
   ```
   Original: "Saved 2 hours per deployment"
   
   Conversion chain:
   ├─ 2 hours × 8 deployments/month = 16 hours/month saved
   ├─ 16 hours/month × 12 months = 192 hours/year
   ├─ 192 hours × $150/hour = $28,800/year
   └─ "Saved ~$29K annually in engineering time"
   
   Note: Always label as estimate and show calculation
   ```

4. **Label All Estimates Clearly**
   ```
   Labeling symbols/words:
   ├─ ~ (tilde): "~40 runbooks", "~70% reduction"
   ├─ "approximately": "approximately 6 months"
   ├─ "estimated": "estimated $50K cost savings"
   └─ ranges: "10-15 team members", "3-5 stakeholders"
   ```

**Examples:**

```
SCENARIO 1: Missing Exact Numbers

Original bullet:
"Managed documentation for the team"

System asks:
1. Team size?
2. Type of documentation?
3. How many documents?
4. What was the outcome?

User answers:
1. About 10 people
2. SOPs and runbooks
3. Maybe 40-ish runbooks
4. Got ready for an audit

Output:
"Managed 40+ incident response runbooks for ~10-person cybersecurity 
team, implementing version control and quarterly review process for 
regulatory audit preparation"

Character count: 174
Metrics: 40 runbooks, 10-person team
Labels: "40+" indicates minimum, "~10-person" indicates approximation

---

SCENARIO 2: No Metrics Available

Original bullet:
"Helped with the project"

System asks:
1. What project?
2. What was your specific contribution?
3. What tools did you use?
4. What was the result?

User answers:
1. Dashboard data integrity project
2. Created swim-lane diagrams
3. Microsoft Visio
4. Mapped 20 API calls across 6 systems

Output:
"Designed comprehensive swim-lane diagrams mapping 20 API calls across 
6 reporting systems, identifying critical QA gaps in contract-tracking 
dashboards for DHS leadership visibility"

Character count: 189
Metrics: 20 API calls, 6 systems
Note: No fabricated percentages or time savings—only concrete deliverables

---

SCENARIO 3: Estimated Time Savings

Original bullet:
"Streamlined the approval process"

System asks:
1. What was the approval process for?
2. How was it streamlined?
3. Roughly how long did it take before vs after?
4. How often did this happen?

User answers:
1. Runbook approvals
2. Changed from email workflow to SharePoint
3. Maybe saved about a day per runbook? Hard to say exactly
4. We had about 40 runbooks

Output:
"Optimized runbook approval workflow by migrating from email to 
SharePoint shared drive, saving ~1 day per runbook (~40 days total 
across 40 runbooks)"

Character count: 160
Metrics: ~1 day savings, ~40 days total, 40 runbooks
Labels: All metrics marked with ~ for approximation
Defensibility: Can explain in interview that this was estimated based 
                on observed reduction in email back-and-forth
```

### Principle 2: Evidence-Based Keyword Integration

**Core Rule:** Keywords must be evidenced in job history positions—never force keywords without backing evidence.

**Why This Matters:**

- **Interview Readiness**: If you claim "Confluence experience" but can't speak to it in detail during an interview, credibility is damaged
- **Authenticity**: Hiring managers can spot keyword stuffing—it feels forced and inauthentic
- **Better Strategy**: Omitting a keyword is better than fabricating context for it

**Validation Process:**

```python
def validate_keyword(keyword, job_history):
    """
    Cross-reference keyword against all positions in job history.
    Returns: "EVIDENCED", "NOT_EVIDENCED", or "UNCLEAR"
    """
    evidence_found = False
    evidence_positions = []
    
    for position in job_history.positions:
        # Check tools/technologies
        if keyword in position.tools_technologies:
            evidence_found = True
            evidence_positions.append(position.id)
        
        # Check hard skills demonstrated
        elif keyword in position.hard_skills_demonstrated:
            evidence_found = True
            evidence_positions.append(position.id)
        
        # Check key achievements
        elif keyword in position.key_achievements:
            evidence_found = True
            evidence_positions.append(position.id)
    
    if evidence_found:
        return {
            "status": "EVIDENCED",
            "positions": evidence_positions,
            "action": "Include in bullets for these positions"
        }
    else:
        # Check if in master_skills_inventory but not in positions
        if keyword in job_history.master_skills_inventory:
            return {
                "status": "NOT_EVIDENCED",
                "warning": "Appears in master skills but no position evidence",
                "action": "Ask user for clarification or omit"
            }
        else:
            return {
                "status": "NOT_EVIDENCED",
                "warning": "Not found anywhere in job history",
                "action": "Ask user for confirmation or omit"
            }
```

**Example Workflow:**

```
JD contains keyword: "Confluence"

Step 1: Search job history
├─ Position 1: tools_technologies = [Jira, SharePoint, Visio]
├─ Position 2: tools_technologies = [Confluence, Jira, Slack]
├─ Position 3: tools_technologies = [SharePoint, Power Automate]
└─ RESULT: EVIDENCED in Position 2

Step 2: Include keyword in Position 2 bullets
Output:
"Authored 700+ user stories and acceptance criteria in Confluence, 
achieving 98% definition-of-done compliance across Agile sprint cycles"

---

JD contains keyword: "Kubernetes"

Step 1: Search job history
├─ Position 1-6: No mention in tools, skills, or achievements
├─ master_skills_inventory: "Kubernetes" appears (generic list)
└─ RESULT: NOT_EVIDENCED (only in generic master list)

Step 2: Ask user
System: "I see 'Kubernetes' in your master skills inventory, but I don't 
        see it mentioned in any specific position's work. Do you have 
        hands-on experience with Kubernetes?"

User Option A: "Yes, I used it at Company X for container orchestration"
System: "Great! Can you describe what you did with it?"
User: "I wrote CONOPS documentation about their Kubernetes architecture"
System: "Got it. That's documentation work, not hands-on operation. I'll 
        note you have Kubernetes knowledge but not operational experience."
Action: Omit keyword or phrase as "documented Kubernetes architecture"

User Option B: "No, I just put it there because I've heard of it"
System: "Thanks for the honesty. I'll omit this keyword since we don't 
        have evidence of hands-on experience."
Action: Omit keyword entirely

User Option C: "Yes, I configured Kubernetes clusters and managed deployments"
System: "Perfect! Which position was this?"
User: "Position 4—that government contract"
System: "I'll add this to Position 4 and include it in bullets."
Action: Add to Position 4 tools_technologies, include in bullets
```

**Keyword Coverage Report:**

After optimization, system always outputs:

```
**Keyword Coverage Report**

✓ Successfully Incorporated (8 keywords):
├─ Jira - Position 1, Bullet 2 (145 chars)
│         Position 3, Professional Summary
├─ Agile - Position 1, Bullet 1 (192 chars)
├─ SharePoint - Position 2, Bullet 1 (156 chars)
│               Position 3, Bullet 2 (168 chars)
├─ Confluence - Position 2, Bullet 3 (178 chars)
├─ Requirements - Position 1, Professional Summary
│                 Position 3, Bullet 1 (134 chars)
├─ Stakeholder Management - Position 1, Bullet 3 (201 chars)
├─ Azure DevOps - Position 1, Bullet 1 (192 chars)
└─ User Stories - Position 1, Bullet 2 (145 chars)
                  Position 2, Professional Summary

✗ Skipped - Not Evidenced (3 keywords):
├─ Kubernetes - Not found in any position's tools, skills, or achievements
│               Only in master_skills_inventory (no position evidence)
├─ React - Mentioned in Position 0 (portfolio) but not in professional roles
│          Portfolio projects count for skills only, not professional experience
└─ Salesforce - Not found anywhere in job history

? Requires Clarification (1 keyword):
└─ Power BI - Mentioned briefly in Position 4 context but not explicitly 
              in achievements. Did you use Power BI directly or just work 
              with reports others created?
```

### Principle 3: Context Validation

**Critical Distinction:** Documentation ≠ Implementation

Writing ABOUT a technology is fundamentally different from working WITH that technology in a hands-on capacity.

**The Problem:**

Many technical writers, business analysts, and project managers list technologies in their resumes because they created documentation, gathered requirements, or managed projects involving those technologies. However, when the job description asks for "hands-on experience with Kubernetes," they mean operational experience—not documentation experience.

**Context Validation Framework:**

```
┌─────────────────────────────────────────────────────────┐
│           EVIDENCE TIER CLASSIFICATION                   │
└─────────────────────────────────────────────────────────┘

TIER 1: Direct Hands-On Implementation (100% credit)
├─ Built, Developed, Implemented, Deployed, Configured
├─ Managed, Administered, Operated, Maintained
├─ Engineered, Architected, Designed (with implementation)
├─ Debugged, Troubleshot, Resolved, Fixed
└─ Migrated, Upgraded, Scaled, Optimized

Examples:
✅ "Built CI/CD pipeline using Jenkins and Kubernetes"
✅ "Managed 50+ EC2 instances across 3 AWS regions"
✅ "Debugged production incidents in microservices architecture"

TIER 2: Supervised Exposure (50% credit)
├─ Tested, Evaluated, Configured (under guidance)
├─ Assisted, Participated, Contributed (with hands-on component)
└─ Collaborated (with hands-on work, not just meetings)

Examples:
✅ "Tested Kubernetes deployments in UAT environment"
✅ "Assisted with AWS migration, configuring security groups"
✅ "Participated in Jenkins pipeline setup for CI/CD"

TIER 3: Documentation Only (0% credit)
├─ Documented, Wrote about, Created documentation for
├─ Researched, Evaluated, Assessed, Analyzed (no implementation)
├─ Interviewed SMEs about, Gathered requirements for
├─ Trained users on, Created training for
└─ Observed, Shadowed, Learned about

Examples:
❌ "Documented Kubernetes architecture for DoD PaaS"
❌ "Researched AWS best practices for migration planning"
❌ "Gathered requirements for Jenkins CI/CD implementation"
```

**Role Context Check:**

```
IF job_title in [Technical Writer, Business Analyst, Project Manager, 
                 Scrum Master, Product Owner]:
    THEN: Be SKEPTICAL of technology claims
    
    Example skeptical scenarios:
    ├─ TW claiming "Kubernetes experience"
    │  └─ Likely: Documented Kubernetes, not operated it
    ├─ BA claiming "AWS architecture experience"
    │  └─ Likely: Gathered requirements, didn't architect
    ├─ PM claiming "React development experience"
    │  └─ Likely: Managed React devs, didn't code React
    └─ Scrum Master claiming "DevOps experience"
        └─ Likely: Facilitated DevOps teams, didn't do DevOps work
```

**The Interview Test:**

Ask this question about every technical claim:

> "If a hiring manager asked 'Tell me about your experience with [Technology X],' 
> could this person speak to hands-on implementation details, or only high-level 
> documentation/requirements/facilitation?"

**Examples:**

```
EXAMPLE 1: False Positive (Caught by Context Validation)

Job History:
"Authored NIST-compliant CONOPS for Space Force cloud initiatives 
 on DoD PaaS infrastructure"

JD Requirement:
"3+ years cloud-native development experience"

Initial Analysis (WITHOUT context validation):
├─ Keywords match: cloud, infrastructure, platform
├─ Duration: ~1 year of cloud work
└─ FALSE POSITIVE: Looks like cloud experience

Context Validation:
├─ Action verb: "Authored" → Tier 3 (documentation)
├─ Role: Technical Writer
├─ Interview test: Could explain architecture, not implementation
└─ CORRECTION: Documentation work, not development work

Correct Output:
❌ "No match - candidate documented cloud systems but did not develop 
   or operate them. Cloud-native development: NOT EVIDENCED."

---

EXAMPLE 2: True Match (Passes Context Validation)

Job History:
"Built Power Automate workflows automating employee onboarding, 
 eliminating 3 manual processes"

JD Requirement:
"Workflow automation experience"

Initial Analysis:
├─ Keywords match: workflow, automation
├─ Concrete deliverable: Automated 3 processes
└─ Potential match

Context Validation:
├─ Action verb: "Built" → Tier 1 (hands-on implementation)
├─ Role: Technical Writer (but hands-on work, not docs)
├─ Interview test: Could explain Power Automate flows created
├─ Evidence: Specific outcome (eliminated 3 manual processes)
└─ CONFIRMED: True hands-on experience

Correct Output:
✅ "Match confirmed - hands-on workflow automation using Power Automate 
   with documented outcomes (3 processes eliminated)."

---

EXAMPLE 3: Partial Match (Tier 2)

Job History:
"Tested and evaluated new Google Workspace features in UAT environment"

JD Requirement:
"Google Workspace administration"

Initial Analysis:
├─ Keywords match: Google Workspace
├─ Environment: UAT (legitimate admin work)
└─ Potential match

Context Validation:
├─ Action verbs: "Tested and evaluated" → Tier 2 (supervised exposure)
├─ Role: Administrator (legitimate admin capacity)
├─ Interview test: Could speak to features tested, not full admin
├─ Scope: UAT only, not production
└─ ASSESSMENT: Partial match (50% credit)

Correct Output:
⚠️ "Partial match (50%) - UAT testing experience with Google Workspace, 
   but not primary production administrator role. Consider for roles 
   seeking UAT/testing focus or junior admin positions."
```

**Common False Positive Patterns:**

| Pattern | Trap | Reality | Fix |
|---------|------|---------|-----|
| TW lists technologies in tools_technologies | They documented these tools | Didn't operate them | Cross-reference with achievements - look for implementation verbs |
| BA lists platforms in hard_skills | They gathered requirements FOR platforms | Didn't build ON platforms | Check if any achievement shows hands-on work beyond requirements |
| PM lists engineering tools in skills | They managed engineers using tools | Didn't use tools themselves | "Managed team using X" ≠ "Used X" |
| All roles list "exposure to" or "worked with" | Vague phrasing hides lack of depth | Could mean anything from observed to implemented | Probe for specific action verbs and deliverables |

---

## Phase System Detailed Guide

### Phase 1: Full Resume Analysis

**Purpose:** Extract complete work history and create comprehensive job history v2.0 reference document.

**Triggers:**
- User uploads complete resume (PDF, DOCX, TXT, HTML)
- User says: "analyze my resume", "review my resume", "score my resume"
- User provides multi-position work experience in structured format

**Process Flow:**

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: PARSE RESUME                                   │
├─────────────────────────────────────────────────────────┤
│  • Extract text from PDF/DOCX/TXT                       │
│  • Identify position blocks (title, company, dates)     │
│  • Extract responsibilities (bullet points)             │
│  • Extract achievements (quantified statements)         │
│  • Extract skills (technical and soft)                  │
│  • Extract education and certifications                 │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: CALCULATE EXPERIENCE                           │
├─────────────────────────────────────────────────────────┤
│  • Total years of experience (sum all positions)        │
│  • Years per role type (PM: X, BA: Y, TW: Z)           │
│  • Identify gaps (career breaks, education periods)     │
│  • Calculate recency (how recent is each skill?)        │
│  • Determine seniority level (Junior/Mid/Senior/Lead)   │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: POSITION-BY-POSITION ANALYSIS                  │
├─────────────────────────────────────────────────────────┤
│  FOR EACH position:                                     │
│    1. Extract metadata (12 required fields)             │
│       ├─ job_title                                      │
│       ├─ company                                        │
│       ├─ dates (start, end, duration)                   │
│       ├─ location                                       │
│       └─ work_arrangement (remote/hybrid/on-site)       │
│                                                         │
│    2. Extract core_responsibilities (3-5 bullets)       │
│       ├─ Parse bullet structure                         │
│       ├─ Identify action verbs                          │
│       └─ Extract scope indicators                       │
│                                                         │
│    3. Extract key_achievements (3-5 with metrics)       │
│       ├─ Parse for CONTEXT/ACTION/RESULT/IMPACT         │
│       ├─ Extract quantified metrics                     │
│       └─ Identify business outcomes                     │
│                                                         │
│    4. Categorize skills (hard vs soft)                  │
│       ├─ Run each skill through classification logic    │
│       ├─ Technical/Tools → hard_skills                  │
│       └─ Behavioral/Leadership → soft_skills            │
│                                                         │
│    5. Extract tools_technologies                        │
│       ├─ Granular list (Jira, not "project mgmt tools")│
│       └─ Cross-reference with achievements              │
│                                                         │
│    6. Calculate impact_metrics                          │
│       ├─ Quantified business results                    │
│       ├─ Team size, users supported, budget managed     │
│       └─ Timelines and frequencies                      │
│                                                         │
│    7. Identify industry_domain                          │
│       ├─ Sector (Gov, SaaS, FinTech, Healthcare, etc.) │
│       └─ Domain expertise areas                         │
│                                                         │
│    8. Determine team_scope                              │
│       ├─ Direct reports (if any)                        │
│       ├─ Team size worked with                          │
│       └─ Stakeholder groups                             │
│                                                         │
│    9. Generate professional_summary (2-3 sentences)     │
│       ├─ Summarize role scope                           │
│       ├─ Include 2-3 hard skills demonstrated           │
│       ├─ Include 1-2 soft skills demonstrated           │
│       └─ Use metrics where available                    │
│                                                         │
│   10. Document honest_limitations                       │
│       ├─ What cannot be claimed (left before completion)│
│       ├─ Unknown metrics (didn't have access to data)   │
│       └─ Scope boundaries (what role didn't include)    │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: SCORE RESUME (4 Categories @ 25% each)         │
├─────────────────────────────────────────────────────────┤
│  1. ATS Format (25 points)                              │
│     ├─ Keyword density and relevance                    │
│     ├─ Structure (clear sections, consistent format)    │
│     ├─ Length (optimal: 1-2 pages)                      │
│     └─ File format (PDF preferred, Word acceptable)     │
│                                                         │
│  2. Content Quality (25 points)                         │
│     ├─ Clarity of responsibilities                      │
│     ├─ Specificity of achievements                      │
│     ├─ Action verb strength                             │
│     └─ Absence of vague language                        │
│                                                         │
│  3. Quantifiable Impact (25 points)                     │
│     ├─ Presence of metrics (numbers, percentages, $)    │
│     ├─ Business outcomes demonstrated                   │
│     ├─ Scope indicators (team size, users, budget)      │
│     └─ Defensibility (can metrics be explained?)        │
│                                                         │
│  4. Skills & Keywords (25 points)                       │
│     ├─ Breadth of skills (technical and soft)           │
│     ├─ Relevance to target roles                        │
│     ├─ Balance (not over-emphasized in one area)        │
│     └─ Recency (recent skills weighted higher)          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: GENERATE JOB HISTORY V2.0                      │
├─────────────────────────────────────────────────────────┤
│  • Format: XML-like structure in plain text             │
│  • Schema: 12-section structure per position            │
│  • Filename: claude_generated_job_history_summaries_v2.txt│
│  • Validation: Template compliance check                │
│  • Output: Both .txt (source) and .md (presentation)    │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 6: PRESENT RESULTS & NEXT STEPS                   │
├─────────────────────────────────────────────────────────┤
│  Output includes:                                       │
│  • Overall score (0-100)                                │
│  • Category breakdown (4 scores)                        │
│  • Strengths identified                                 │
│  • Areas for improvement                                │
│  • Job history filename confirmation                    │
│  • Next steps menu:                                     │
│    1. Optimize specific bullets (Phase 2)               │
│    2. Check fit for a job description (Phase 3)         │
│    3. Export job history for review                     │
└─────────────────────────────────────────────────────────┘
```

**Output Example:**

```
✅ RESUME ANALYSIS COMPLETE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL SCORE: 78/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Category Scores:
├─ 🟢 ATS Format:          22/25  (Strong keyword integration, clean structure)
├─ 🟡 Content Quality:     19/25  (Good specificity, could add more context)
├─ 🟡 Quantifiable Impact: 18/25  (Some metrics present, ask for more details)
└─ 🟢 Skills & Keywords:   19/25  (Good technical coverage, balanced soft skills)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRENGTHS IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Strong keyword presence (Agile, Jira, Confluence, requirements, stakeholders)
✅ Clear chronological progression across 6 professional roles
✅ Diverse skill set (Technical Writing, Business Analysis, Knowledge Management)
✅ Some quantified achievements (700+ user stories, 98% compliance)
✅ Federal government experience well-documented (clearances, agencies)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AREAS FOR IMPROVEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 More quantified metrics needed:
   - Position 2: "Created documentation" → How many docs? What type?
   - Position 4: "Managed workflows" → How many workflows? What was impact?
   - Position 5: "Supported team" → Team size? How many users/systems?

📍 Action verbs could be stronger:
   - Replace "Responsible for" with specific action verbs
   - Replace "Helped" with quantified contributions
   - Replace "Assisted" with clear role definition

📍 Missing context in some bullets:
   - Add timelines (6 months? 1 year?)
   - Add scope (team size, budget, users affected)
   - Add outcomes (what happened as a result?)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB HISTORY GENERATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Comprehensive job history created: claude_generated_job_history_summaries_v2.txt

Positions documented: 6 professional roles
├─ Position 1: Technical Writer/BA (DHS) - Jan 2025 to Jun 2025
├─ Position 2: Technical Writer (Space Force) - Sep 2024 to Jan 2025
├─ Position 3: Business Analyst (State Dept) - Jul 2023 to Sep 2024
├─ Position 4: Technical Writer (CISA) - Jul 2022 to Jun 2023
├─ Position 5: Technical Writer (DoE SOC) - Sep 2020 to Jun 2022
└─ Position 6: Google Workspace Admin (USAID) - Aug 2018 to Jul 2020

Total experience: ~6.5 years
Role distribution: 60% Technical Writing, 30% Business Analysis, 10% Administration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do next?

1. 📝 Optimize specific resume bullets (Phase 2)
   → I'll ask clarifying questions and generate stronger alternatives

2. 🎯 Check fit for a job description (Phase 3)
   → Paste a JD and I'll analyze your match and create tailored bullets

3. 📄 Export job history for review
   → I'll provide your complete job history in presentation format

Just let me know which option, or paste a job description to start Phase 3!
```

### Phase 2: Bullet Optimization

**Purpose:** Improve 1-5 individual resume bullets with context from job history, asking probing questions to uncover hidden metrics.

**Triggers:**
- User provides 1-5 specific bullets to optimize
- User says: "optimize this bullet", "improve these bullets", "make this stronger"
- User pastes bullet points without full resume context

**Process Flow:**

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: PARSE & DIAGNOSE                               │
├─────────────────────────────────────────────────────────┤
│  FOR EACH bullet:                                       │
│    • Identify action verb (or lack thereof)             │
│    • Extract scope indicators (team size, users, budget)│
│    • Identify tools/technologies mentioned              │
│    • Check for outcome/impact statement                 │
│    • Flag missing elements:                             │
│      ├─ No metrics (numbers, percentages, timelines)    │
│      ├─ No comparison (before/after, baseline)          │
│      ├─ Vague language ("helped", "assisted")           │
│      ├─ Missing context (why did this matter?)          │
│      └─ Weak verb (passive, generic)                    │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: ASK CLARIFYING QUESTIONS                       │
├─────────────────────────────────────────────────────────┤
│  IF metrics missing:                                    │
│    ├─ "What changed before/after your contribution?"    │
│    ├─ "How many [users/documents/processes] involved?"  │
│    ├─ "What was the frequency - daily, weekly, monthly?"│
│    ├─ "How long did this take - weeks, months, years?"  │
│    └─ "Was there an SLA, quota, or performance target?" │
│                                                         │
│  IF context missing:                                    │
│    ├─ "Why was this important to the business?"         │
│    ├─ "What would have happened if you didn't do this?" │
│    └─ "Who benefited from this work?"                   │
│                                                         │
│  IF tools/methods unclear:                              │
│    ├─ "What specific tools or technologies did you use?"│
│    ├─ "What methodology did you follow (Agile, ITIL)?"  │
│    └─ "What standards or frameworks did you apply?"     │
│                                                         │
│  WAIT for user responses before proceeding              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: CHECK JOB HISTORY (if available)               │
├─────────────────────────────────────────────────────────┤
│  IF company/position mentioned:                         │
│    1. Load relevant position from job history           │
│    2. Cross-reference:                                  │
│       ├─ tools_technologies                             │
│       ├─ hard_skills_demonstrated                       │
│       ├─ impact_metrics                                 │
│       └─ key_achievements (similar work)                │
│    3. Use as evidence for optimization                  │
│                                                         │
│  IF no job history or position not found:               │
│    └─ Proceed based on user responses only              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: GENERATE ALTERNATIVES                          │
├─────────────────────────────────────────────────────────┤
│  Create 3 options emphasizing different aspects:        │
│                                                         │
│  OPTION A: Scope Emphasis                               │
│    ├─ Lead with team size, users, budget                │
│    ├─ Emphasize scale and breadth                       │
│    └─ Verb: Often "Managed" or "Lead" categories        │
│                                                         │
│  OPTION B: Outcome Emphasis                             │
│    ├─ Lead with business result or transformation       │
│    ├─ Emphasize before/after comparison                 │
│    └─ Verb: Often "Improved" or "Built" categories      │
│                                                         │
│  OPTION C: Tool/Method Emphasis                         │
│    ├─ Lead with specific technologies or methodologies  │
│    ├─ Emphasize technical depth and expertise           │
│    └─ Verb: Often "Built" or "Collaborate" categories   │
│                                                         │
│  Apply verb diversity:                                  │
│    └─ Each option uses different verb category          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: PRESENT WITH METADATA                          │
├─────────────────────────────────────────────────────────┤
│  FOR EACH option:                                       │
│    ├─ Show character count (target: 100-210)            │
│    ├─ Identify verb category (Built/Lead/Managed/etc.)  │
│    ├─ List metrics included (or note if missing)        │
│    ├─ List keywords matched (if JD provided)            │
│    └─ Note strengths of this particular option          │
│                                                         │
│  Also show ORIGINAL for comparison                      │
└─────────────────────────────────────────────────────────┘
```

**Example:**

```
USER INPUT:
"Managed documentation for the team"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: DIAGNOSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL BULLET (29 characters):
"Managed documentation for the team"

Issues Identified:
├─ ❌ No metrics (team size? how many documents?)
├─ ❌ No specific documentation type (SOPs? runbooks? guides?)
├─ ❌ No outcome (what was achieved?)
├─ ❌ No tools mentioned
└─ ⚠️  Verb is okay ("Managed") but could be stronger with context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: CLARIFYING QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To strengthen this bullet, I need some details:

1. 📊 Team size: How large was the team you supported?

2. 📝 Documentation type: What kind of documentation? (SOPs, runbooks, 
   user guides, technical specs, etc.)

3. 🔢 Volume: Approximately how many documents did you manage?

4. 🎯 Outcome: What was the purpose or result? (regulatory compliance? 
   faster onboarding? error reduction?)

5. 🛠️ Tools: What tools or platforms did you use? (SharePoint, Confluence, 
   internal wiki, etc.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER RESPONSES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Team size: About 10 people in the SOC
2. Documentation type: Incident response runbooks mainly
3. Volume: We had around 40 runbooks total
4. Outcome: We were preparing for a regulatory audit
5. Tools: SharePoint for storage, but also implemented version control

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: JOB HISTORY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Found matching position in job history:
   Position 5: Technical Writer (DoE SOC) - Sep 2020 to Jun 2022

Cross-referenced evidence:
├─ ✅ tools_technologies: SharePoint, version control
├─ ✅ impact_metrics: "40 runbooks standardized"
├─ ✅ key_achievements: "regulatory audit preparation"
└─ ✅ hard_skills_demonstrated: "documentation lifecycle management"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: OPTIMIZED OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTION A: Scope Emphasis (156 characters)
"Managed 40+ incident response runbooks for 10-person cybersecurity 
team, implementing version control and quarterly review process"

├─ Verb Category: 🟣 Managed (Purple)
├─ Metrics: 40 runbooks, 10-person team
├─ Keywords: incident response, version control, cybersecurity, review process
├─ Strengths: Quantifies scope clearly, shows systematic approach
└─ Character count: 156 ✅ (within 100-210 range)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTION B: Outcome Emphasis (174 characters)
"Standardized 40 incident response runbooks for regulatory audit 
preparation, implementing version control (0% to 100%) and 
establishing quarterly review process"

├─ Verb Category: 🟢 Standardized (Improved - Green)
├─ Metrics: 40 runbooks, 0% → 100% version control
├─ Keywords: standardized, regulatory audit, version control, compliance
├─ Strengths: Emphasizes transformation (0% to 100%), compliance focus
└─ Character count: 174 ✅ (within 100-210 range)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTION C: Tool/Method Emphasis (168 characters)
"Managed SOC documentation lifecycle using version control and 
SharePoint, standardizing 40 runbooks and establishing quarterly 
reviews for 10-person security team"

├─ Verb Category: 🟣 Managed (Purple)
├─ Metrics: 40 runbooks, 10-person team, quarterly reviews
├─ Keywords: SOC, documentation lifecycle, version control, SharePoint
├─ Strengths: Highlights technical tools and systematic approach
└─ Character count: 168 ✅ (within 100-210 range)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 My top pick: OPTION B (Outcome Emphasis)

Why:
├─ Shows clear transformation (0% → 100% version control)
├─ Emphasizes compliance/audit preparation (valuable for gov roles)
├─ Uses "Improved" verb category (different from other bullets)
└─ Metrics are specific and defensible

But choose based on:
├─ If resume has too many "Managed" bullets → Pick B (different verb)
├─ If targeting technical roles → Pick C (tool emphasis)
└─ If emphasizing team leadership → Pick A (scope emphasis)

All three options are strong and character-count compliant!
```

### Phase 3: JD Comparison with Preliminary Fit Assessment

**Purpose:** Evaluate job fit BEFORE generating bullets, using blocking gates to prevent wasting tokens on poor-fit roles.

**Critical Innovation:** Preliminary fit assessment with 4-tier response system:
- 90-100%: Proceed automatically (excellent match)
- 80-89%: Full gap analysis + ask user (good match with clarifications)
- 75-79%: Brief exit summary (weak match, don't waste tokens)
- 0-74%: Ultra-brief exit (poor match, fundamental mismatch)

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: PARSE JOB DESCRIPTION (17-Point System)            │
├─────────────────────────────────────────────────────────────┤
│  Extract:                                                   │
│   1. Job title and seniority level                          │
│   2. Required skills (must-have, emphasized 3+ times)        │
│   3. Preferred skills (nice-to-have, mentioned 1-2 times)    │
│   4. Years of experience required                            │
│   5. Role type (PM, BA, TW, Engineer, Designer, etc.)        │
│   6. Industry/domain (SaaS, Gov, FinTech, Healthcare, etc.)  │
│   7. Technical requirements (specific platforms, languages)   │
│   8. Work location (remote, hybrid, on-site)                 │
│   9. Geographic restrictions (state-specific, relocation)    │
│  10. Team scope (team size, leadership required?)            │
│  11. Certifications required (or preferred)                  │
│  12. Education requirements (degree level, field)            │
│  13. Salary range (if provided)                              │
│  14. Company size/stage (startup, scale-up, enterprise)      │
│  15. Culture indicators (fast-paced, ambiguity, etc.)        │
│  16. Success metrics (ARR, KPIs, deliverables expected)      │
│  17. Red flags (fake remote, unrealistic expectations)       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: EXTRACT CRITICAL REQUIREMENTS                      │
├─────────────────────────────────────────────────────────────┤
│  Categorize each requirement:                               │
│                                                             │
│  🚩 RED FLAGS (Critical - must have):                       │
│    ├─ Appears 3+ times in JD                                │
│    ├─ Labeled "required", "must have", "essential"          │
│    ├─ Foundational to role (e.g., "PM experience" for PM)   │
│    └─ Technical foundations (e.g., "coding" for SWE)        │
│                                                             │
│  ⚠️  YELLOW FLAGS (Preferred - nice to have):               │
│    ├─ Mentioned 1-2 times                                   │
│    ├─ Labeled "preferred", "nice to have", "bonus"          │
│    └─ Complementary skills (not foundational)               │
│                                                             │
│  🚨 LOCATION RED FLAGS (Geographic mismatches):             │
│    ├─ "Must be located in [state]" when user elsewhere      │
│    ├─ "Following states excluded from payroll: [list]"      │
│    ├─ "On-site required" when user seeks remote             │
│    ├─ "Hybrid X days/week" when user fully remote           │
│    └─ "Relocation required" without assistance mentioned    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: COMPARE AGAINST JOB HISTORY                        │
├─────────────────────────────────────────────────────────────┤
│  FOR EACH requirement:                                      │
│    1. Search job history positions for evidence             │
│       ├─ Check tools_technologies                           │
│       ├─ Check hard_skills_demonstrated                     │
│       ├─ Check soft_skills_demonstrated                     │
│       └─ Check key_achievements                             │
│                                                             │
│    2. Apply context validation (Tier 1/2/3)                 │
│       ├─ Tier 1 (100%): Hands-on implementation             │
│       ├─ Tier 2 (50%): Supervised exposure                  │
│       └─ Tier 3 (0%): Documentation only                    │
│                                                             │
│    3. Categorize match strength:                            │
│       ├─ ✅ DIRECT MATCH: Evidence in position, Tier 1      │
│       ├─ ⚠️  PARTIAL MATCH: Evidence in position, Tier 2    │
│       ├─ 🔄 TRANSFERABLE: Related experience, different term│
│       └─ ❌ NO MATCH: Not found or Tier 3 only              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: APPLY VALIDATION PENALTIES                         │
├─────────────────────────────────────────────────────────────┤
│  Penalty 1: Portfolio Inflation (-15 to -25 points)         │
│    └─ If portfolio project counted toward role requirements │
│                                                             │
│  Penalty 2: Adjacent Technical Misclass (-10 to -20 points) │
│    └─ If TW/BA/PM role counted as "adjacent technical"      │
│                                                             │
│  Penalty 3: Documentation False Positive (-5 to -15/each)   │
│    └─ If documentation work matched to hands-on requirement │
│                                                             │
│  Penalty 4: Industry Mismatch (0 to -30 points)             │
│    └─ Based on transferability matrix (Gov→SaaS = -25)      │
│                                                             │
│  Penalty 5: Role-Type Gap (-10 to -30 points)               │
│    └─ Based on experience gap severity (0Y PM for Senior PM)│
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: CALCULATE PRELIMINARY FIT SCORE                    │
├─────────────────────────────────────────────────────────────┤
│  Base Score (100 points):                                   │
│    ├─ Core Qualifications (50 points):                      │
│    │   ├─ Years of experience match: 15 pts                 │
│    │   ├─ Role type match: 15 pts                           │
│    │   ├─ Work location alignment: 10 pts                   │
│    │   └─ Geographic eligibility: 10 pts                    │
│    │                                                         │
│    ├─ Critical Requirements (30 points):                    │
│    │   ├─ Domain expertise match: 10 pts                    │
│    │   ├─ Platform/technology match: 10 pts                 │
│    │   └─ Industry experience match: 10 pts                 │
│    │                                                         │
│    └─ Preferred Qualifications (20 points):                 │
│        ├─ Nice-to-have skills: 10 pts                       │
│        └─ Bonus certifications: 10 pts                      │
│                                                             │
│  Final Score = Base Score - Total Penalties                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: DECISION POINT (BLOCKING GATES)                    │
├─────────────────────────────────────────────────────────────┤
│  IF Fit Score ≥ 90%:                                        │
│    ├─ Action: PROCEED automatically to bullet generation    │
│    ├─ Output: Full report with tailored bullets             │
│    └─ User override: Not needed                             │
│                                                             │
│  IF Fit Score 80-89%:                                        │
│    ├─ Action: FLAG gaps + ASK user                          │
│    ├─ Output: Full gap analysis report                      │
│    ├─ Questions: "Do you have experience with [missing]?"   │
│    ├─ If user confirms missing experience: Recalculate      │
│    └─ If still ≥80% after recalc: Proceed to bullets        │
│                                                             │
│  IF Fit Score 75-79%:                                        │
│    ├─ Action: STOP with BRIEF summary                       │
│    ├─ Output: ~150-250 words explaining mismatch            │
│    ├─ User override: NOT ALLOWED                            │
│    └─ Recommendation: Focus on better-fit roles             │
│                                                             │
│  IF Fit Score ≤74%:                                          │
│    ├─ Action: STOP with ULTRA-BRIEF summary                 │
│    ├─ Output: ~50-100 words, fundamental mismatch           │
│    ├─ User override: NOT ALLOWED                            │
│    └─ Recommendation: Strong alternative roles              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ (if ≥80%)
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: EVIDENCE-BASED BULLET GENERATION                   │
├─────────────────────────────────────────────────────────────┤
│  FOR EACH relevant position:                                │
│    1. Match JD keywords to position evidence                │
│    2. Apply keyword_evidence_principle (no fabrication)     │
│    3. Generate 2-3 bullets per position                     │
│    4. Apply verb diversity (5 categories, no repeats/pos)   │
│    5. Enforce character limits (100-210 per bullet)         │
│    6. Include metrics where available                       │
│    7. Cross-reference honest_limitations                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: AUTOMATIC QUALITY GATES                            │
├─────────────────────────────────────────────────────────────┤
│  (See Quality Assurance Framework section for details)      │
│                                                             │
│  ├─ Verb diversity check (all 5 categories represented)     │
│  ├─ Character limit validation (100-210 per bullet)         │
│  ├─ Escaped character scan (\~, \%, \+)                     │
│  ├─ Gerund detection (no "ing" at start of bullet)          │
│  ├─ Keyword duplication check (summary vs bullets)          │
│  └─ Regenerate if issues (max 3 iterations)                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 9: PLAIN TEXT AUTO-EXPORT                             │
├─────────────────────────────────────────────────────────────┤
│  ├─ Verify chronological order (newest → oldest)            │
│  ├─ Format with • bullets (not markdown)                    │
│  ├─ Include metadata (character counts, verb distribution)  │
│  └─ Save to: /mnt/user-data/outputs/[job-title]-bullets.txt │
└─────────────────────────────────────────────────────────────┘
```

**Fit Assessment Output Examples:**

```
EXAMPLE 1: Excellent Match (93%) - Proceed Automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB FIT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: Senior Technical Writer  
Company: B2B SaaS Company (Container Security)  
Your Background: 6 years Technical Writing (Federal + SaaS)

OVERALL FIT: 93% - EXCELLENT MATCH ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Core Qualifications: 48/50
├─ ✅ Experience: 6 years TW (requires 5+) - 15/15
├─ ✅ Role Type: Direct TW experience - 15/15
├─ ✅ Work Location: Remote match - 10/10
└─ ✅ Geographic: No restrictions - 8/10 (minor: prefer CA but open)

Critical Requirements: 28/30
├─ ✅ Domain: Strong federal/compliance background - 9/10
├─ ✅ Platform: Confluence, Jira, SharePoint experience - 10/10
└─ ⚠️  Industry: Federal → SaaS (good transfer) - 9/10

Preferred Qualifications: 20/20
├─ ✅ Agile/Scrum: Direct experience - 10/10
└─ ✅ Certifications: Agile PM, KM Institute - 10/10

Penalties Applied: -3 points
└─ Minor industry adjustment (Federal → B2B SaaS: 90% transfer)

Final Score: 93% (48 + 28 + 20 - 3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY STRENGTHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Direct role match: 6 years Technical Writing (exceeds 5+ requirement)
✅ Tool alignment: Confluence, Jira, SharePoint all evidenced
✅ Compliance focus: Strong NIST/regulatory documentation background
✅ Agile experience: 700+ user stories, sprint planning, backlog mgmt
✅ Certifications: Agile PM + KM Institute relevant to role

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MINOR GAPS (Not blocking)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Container/DevOps familiarity: JD mentions containerization
   → Your experience: Documented cloud systems, not hands-on containers
   → Impact: LOW (TW role, not hands-on requirement)
   → Mitigation: Emphasize technical documentation of complex systems

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PROCEEDING TO BULLET GENERATION

This is an excellent match. Generating tailored bullets for:
├─ Position 1: Technical Writer/BA (DHS) - 3 bullets
├─ Position 2: Technical Writer (Space Force) - 3 bullets
├─ Position 3: Business Analyst (State Dept) - 2 bullets
├─ Position 4: Technical Writer (CISA) - 2 bullets
└─ Position 5: Technical Writer (DoE SOC) - 2 bullets

Total: 12 bullets optimized for this role

[System proceeds to bullet generation automatically]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

EXAMPLE 2: Good Match with Clarifications (83%) - Ask User

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB FIT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: Product Manager (Mid-Level)  
Company: Healthcare SaaS Startup  
Your Background: 4Y BA (Federal Gov) + 2Y TW

PRELIMINARY FIT: 83% - GOOD MATCH (with clarifications) ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Core Qualifications: 38/50
├─ ⚠️  Experience: 0Y direct PM (2-4Y required) - 8/15
│     └─ Transferable: 4Y BA × 55% = 2.2Y equivalent
├─ ⚠️  Role Type: BA→PM transfer (moderate gap) - 10/15
├─ ✅ Work Location: Remote match - 10/10
└─ ✅ Geographic: No restrictions - 10/10

Critical Requirements: 23/30
├─ ❌ Domain: Federal Gov → Healthcare (gap) - 5/10
├─ ✅ Platform: Jira, Confluence strong - 10/10
└─ ⚠️  Industry: Government → SaaS (learning curve) - 8/10

Preferred Qualifications: 18/20
├─ ✅ Agile/Scrum: Strong BA background - 10/10
└─ ✅ Analytics: Requirements analysis experience - 8/10

Penalties Applied: None (clean transferable path)

Preliminary Score: 79% (38 + 23 + 18)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL GAPS IDENTIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before I proceed, I need to understand a few gaps:

❓ GAP 1: Healthcare/Life Sciences Experience
   JD mentions: "Healthcare or life sciences background preferred"
   Your history: 100% Federal Government (DHS, State, CISA, DoE, USAID)
   
   Question: Do you have ANY healthcare, life sciences, or medical 
             device experience not shown in your resume? (consulting 
             projects, personal experience, volunteer work?)

❓ GAP 2: Product Management vs. Business Analysis
   JD requires: "Product strategy and roadmap ownership"
   Your experience: Requirements gathering, user stories, UAT
   
   Question: Have you ever owned a product roadmap or made prioritization 
             decisions that affected product direction? (even informally)

❓ GAP 3: Customer-Facing Work
   JD mentions: "Customer discovery and user research"
   Your experience: Stakeholder management (mostly internal government)
   
   Question: Have you conducted customer interviews, user research, or 
             worked directly with external customers/users?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORING IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your answers could significantly affect the fit score:

├─ If YES to Healthcare experience: +8 points → 87% (Strong Match)
├─ If YES to Roadmap ownership: +12 points → 91% (Excellent Match)
├─ If YES to Customer-facing: +10 points → 89% (Strong Match)
└─ All three YES: +30 points → 109% capped at 100% (Perfect Match)

If NO to all three: Score remains 79% (Proceed with caution)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAITING FOR YOUR RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please answer the 3 questions above, and I'll recalculate your fit score.

If the recalculated score is ≥80%, I'll proceed with bullet generation.
If <80%, I'll provide alternative role recommendations instead.

---

EXAMPLE 3: Weak Match (77%) - Brief Exit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB FIT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: Senior Product Manager  
Company: B2B SaaS Startup (Developer Tools)  
Your Background: 6Y Technical Writing (Federal Gov)

OVERALL FIT: 77% - WEAK MATCH ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY GAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Role Type Mismatch (Critical)
   ├─ JD requires: 5+ years Product Management experience
   ├─ Your experience: 0 years PM, 6 years TW
   ├─ Transferable credit: 6Y TW × 30% = 1.8Y PM equivalent
   └─ Gap: Need ~3.2 additional years PM experience

❌ Technical Depth Gap (Critical)
   ├─ JD requires: "Technical background with hands-on development"
   ├─ Your experience: Documented technical systems (Tier 3)
   ├─ Assessment: Writing ABOUT tech ≠ Building tech
   └─ Gap: No hands-on development or adjacent technical role

⚠️  Industry Mismatch (Moderate)
   ├─ JD industry: B2B SaaS startup (fast-paced, product-led)
   ├─ Your experience: Federal government (compliance, process)
   ├─ Transferability: LOW (30%)
   └─ Gap: Different metrics, cycles, and culture

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛑 I recommend NOT applying to this role. Here's why:

This position requires direct PM experience with technical credibility 
from hands-on development. Your strong technical writing background 
demonstrates communication skills and process discipline, but:

1. You'd be competing against candidates with 5+ years PM experience
2. "Technical background" means coding/architecture, not documentation
3. B2B SaaS startup culture is very different from government contracting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BETTER-FIT ROLES FOR YOU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your background, focus on:

✅ Senior Technical Writer (SaaS/Enterprise)
   → Leverage 6Y TW experience directly
   → Transition to tech industry from government

✅ Technical Program Manager (Government/Enterprise)
   → Use TW background to coordinate technical initiatives
   → Government experience is an asset

✅ Senior Business Analyst → Associate Product Manager
   → Entry path to PM via BA route (you have BA experience)
   → Build PM portfolio while employed as BA

✅ Product Operations or Documentation Lead
   → Bridge role combining TW + process + some product input
   → Stepping stone to PM without direct PM requirement

Would you like me to analyze fit for any of these alternative roles?

---

EXAMPLE 4: Poor Match (52%) - Ultra-Brief Exit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB FIT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job: Senior Product Manager  
Company: Chainguard (B2B SaaS, Container Security)

OVERALL FIT: 52% - POOR MATCH ❌

❌ Critical mismatches:
   ├─ 0 years PM experience (requires 5+)
   ├─ 100% Federal Government (requires B2B SaaS: LOW transfer 30%)
   ├─ Documentation-based technical exposure (requires hands-on development)
   └─ No customer-facing product work (requires customer discovery)

🛑 This role requires direct PM experience in B2B SaaS with technical 
credibility from hands-on development. Your background is 100% 
government contracting with documentation focus.

Focus instead on: Senior Technical Writer (SaaS), Technical Program 
Manager (Gov/Enterprise), or Senior BA → Associate PM transition path.
```

[Due to length constraints, I'll continue the document in the next file...]

**TO BE CONTINUED IN PART 2...**

This publishable artifact continues with:
- Phase 4: Summary Generation (detailed)
- Quality Assurance Framework (all 27 guardrails explained)
- Advanced Validation Rules (complete matrices and examples)
- Knowledge Management Integration (lessons learned + session summaries)
- Implementation Guide (for users, coaches, developers, researchers)
- Complete Appendices (schemas, templates, version history)

---

**Current Status:** Part 1 Complete (~12,500 words)  
**Total Target:** ~25,000 words (Part 2 forthcoming)

Would you like me to:
1. Continue with Part 2 in a separate file?
2. Create a condensed single-file version?
3. Generate specific sections as standalone documents?
