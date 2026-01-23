# Keyword Context Validation Rules

<!-- ========================================================================== -->
<!-- MODULE: Keyword Context Validation                                        -->
<!-- ========================================================================== -->
<!-- Version: 1.0 (Extracted from Project-GUI-Instructions.md v9.1.0)          -->
<!-- Location: optimization-tools/shared/keyword-validation.md                 -->
<!-- Purpose: Prevent false-positive keyword matching in job fit analysis      -->
<!-- ========================================================================== -->

## Overview

This module defines rules for validating whether a candidate truly has hands-on experience with a technology/skill, or merely documented/researched it.

**Core Principle:**
- Writing ABOUT a technology ≠ Working WITH that technology
- Documenting a system ≠ Operating that system
- Researching a tool ≠ Using that tool in production

## Validation Process

### Step 1: Identify Verb Context

When matching a JD keyword to job history, identify the ACTION VERB:

**✅ VALID action verbs (hands-on work):**
- Built, Developed, Implemented, Deployed, Configured
- Managed, Administered, Operated, Maintained
- Engineered, Architected, Designed (with implementation)
- Debugged, Troubleshot, Resolved, Fixed
- Migrated, Upgraded, Scaled, Optimized

**❌ INVALID action verbs (support work):**
- Documented, Wrote about, Created documentation for
- Researched, Evaluated, Assessed, Analyzed
- Interviewed SMEs about, Gathered requirements for
- Trained users on, Created training for
- Observed, Shadowed, Learned about

### Step 2: Check Role Context

If the job title is "Technical Writer," "Business Analyst," "Project Manager," or similar support role, be SKEPTICAL of technology claims:

**Examples:**
- A Technical Writer who "worked with Kubernetes" likely DOCUMENTED Kubernetes, not OPERATED Kubernetes clusters
- A BA who "worked with AWS" likely gathered REQUIREMENTS for AWS migration, not ARCHITECTED AWS infrastructure

### Step 3: Apply the "Interview Test"

**Question:** "If a hiring manager asked 'Tell me about your experience with [Technology X],' could this person speak to hands-on implementation details, or only high-level documentation/requirements?"

**Valid answers:**
- ✅ Hands-on: "I configured the ingress controllers and debugged networking issues"
- ❌ Documentation: "I wrote the runbooks that explained how to configure ingress"

## Evidence Tiers

### Tier 1: Direct Evidence (100% weight)
**Description:** Hands-on implementation or operation

**Indicators:**
- "Built [system] using [technology]"
- "Managed [X] instances of [technology]"
- "On-call for [system] incidents"
- "Deployed to production using [technology]"

### Tier 2: Supervised Exposure (50% weight)
**Description:** Worked alongside practitioners, had some hands-on exposure

**Indicators:**
- "Tested [technology] in UAT environment"
- "Configured [tool] settings under engineer guidance"
- "Participated in [system] incident response"
- "Assisted with [technology] migration"

### Tier 3: Documentation Only (0% weight)
**Description:** Wrote about or documented technology without hands-on use

**Indicators:**
- "Documented [technology] architecture"
- "Created runbooks for [system]"
- "Wrote CONOPS for [platform]"
- "Gathered requirements for [technology] implementation"
- "Interviewed engineers about [system]"

## Examples

### Example 1: False Positive Prevention

**Job History Entry:**
"Authored NIST-compliant CONOPS for Space Force cloud initiatives on DoD PaaS infrastructure"

**JD Keyword:** "Cloud-native development experience"

**Analysis:**
- Action verb: "Authored" → Documentation work
- Role context: Technical Writer
- Evidence tier: Tier 3 (documentation only)

**Result:**
- ❌ WRONG: "Match found - cloud-native experience from Space Force role"
- ✅ CORRECT: "No match - candidate documented cloud systems but did not develop or operate them. Cloud-native development: NOT EVIDENCED."

### Example 2: False Positive Prevention

**Job History Entry:**
"Created 5 user playbooks with annotated screenshots for ServiceNow HR"

**JD Keyword:** "ServiceNow development experience"

**Analysis:**
- Action verb: "Created playbooks" → Documentation work
- Role context: Technical Writer
- Evidence tier: Tier 3 (documentation only)

**Result:**
- ❌ WRONG: "Match found - ServiceNow experience"
- ✅ CORRECT: "No match - candidate created end-user documentation for ServiceNow but did not develop or configure the platform. ServiceNow development: NOT EVIDENCED."

### Example 3: Valid Match

**Job History Entry:**
"Built Power Automate workflows automating employee onboarding, eliminating 3 manual processes"

**JD Keyword:** "Workflow automation experience"

**Analysis:**
- Action verb: "Built" → Hands-on implementation
- Role context: Technical Writer (but implemented, not just documented)
- Evidence tier: Tier 1 (direct evidence)

**Result:**
- ✅ CORRECT: "Match found - hands-on workflow automation using Power Automate"

### Example 4: Partial Match

**Job History Entry:**
"Tested and evaluated new Google Workspace features in UAT environment"

**JD Keyword:** "Google Workspace administration"

**Analysis:**
- Action verb: "Tested and evaluated" → Supervised exposure
- Role context: Administrator (legitimate admin work)
- Evidence tier: Tier 2 (supervised exposure, 50% weight)

**Result:**
- ✅ CORRECT: "Partial match (50%) - UAT testing experience with Google Workspace, but not primary administrator role"

## Common False Positive Patterns

### Pattern 1: Technical Writer Lists Technologies
**Trap:** Technical Writer lists technologies in "tools_technologies" section  
**Reality:** They documented these tools, didn't operate them  
**Fix:** Cross-reference with key_achievements - look for implementation verbs

### Pattern 2: BA Lists Platforms
**Trap:** BA lists platforms in "hard_skills_demonstrated"  
**Reality:** They gathered requirements FOR these platforms, didn't build ON them  
**Fix:** Check if any achievement shows hands-on work, not just requirements

### Pattern 3: PM Lists Engineering Tools
**Trap:** PM lists engineering tools in skills  
**Reality:** They managed engineers who used these tools  
**Fix:** "Managed team using [tool]" ≠ "Used [tool]"

## Integration Points

This module is referenced by:
- `optimization-tools/bullet-optimizer/bo-keyword-handling.md`
- `optimization-tools/job-fit-analyzer/jfa_job-fit-assessment.md`
- `optimization-tools/narrative-generator/ng_summary-generation.md`

When performing keyword matching in any workflow, ALWAYS apply these validation rules before marking a keyword as "matched" or "evidenced."
