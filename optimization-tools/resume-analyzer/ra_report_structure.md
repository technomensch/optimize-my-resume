# Resume Analyzer Report Structure

<!-- ========================================================================== -->
<!-- MODULE: Resume Analyzer Report Structure                                  -->
<!-- ========================================================================== -->
<!-- Version: 1.0 (Extracted from Project-GUI-Instructions.md v9.2.0)          -->
<!-- Location: optimization-tools/resume-analyzer/ra_report-structure.md       -->
<!-- Purpose: Define the standard output format for Resume Analyzer            -->
<!-- ========================================================================== -->

## Overview

This module defines the complete report structure for Resume Analyzer output, including section ordering, formatting, and display rules.

## Report Structure

### Section 1: Executive Summary

#### Sub-section: Verdict and Repairs

**Reference:** Implement per `prioritized_repairs_summary_rules` from `ra_resume-analyzer-display.md`

**Display Requirements:**
- Display "Prioritized Repairs" counts (Blocker, Risk, Tweak)
- Display "The Verdict" summary sentence
- Display "Repair Legend" explaining severity levels

**Example:**
```
📊 Prioritized Repairs
- 🚫 Blockers: 0
- ⚠️ Risks: 3
- 🔧 Tweaks: 7

✅ The Verdict
Your resume is solid with 3 risks and 7 tweaks to address.

Legend:
🚫 Blocker: Critical issue that will likely cause rejection
⚠️ Risk: Significant weakness that hurts your chances
🔧 Tweak: Minor improvement opportunity
```

---

### Section 2: Resume Narrative Analysis

**Reference:** Implement per `resume_narrative_analysis_rules` from `ra_resume-analyzer-display.md`

**Display Requirements:**
- Display holistic career narrative analysis
  - Primary identity (what you're known for)
  - Career arc (trajectory and progression)
  - Narrative strength (coherence and clarity)
- Display auto-generated job history summary (job history creation) for each position
- Format: Holistic analysis section followed by position-by-position breakdowns with collapse/expand functionality

**Example:**
```
📖 Resume Narrative Analysis

Your Career Story:
You're primarily a [Primary Identity] with [X years] experience...

Career Arc:
Your progression shows [trend/pattern]...

Narrative Strength: [Assessment]

---

Position-by-Position Job History:

[Collapsible Section: Position 1]
Job Title: Senior Software Engineer
Company: TechCorp
Dates: Jan 2020 - Present

Core Responsibilities:
- [Synthesized responsibility 1]
- [Synthesized responsibility 2]
...

Key Achievements:
- [Achievement 1]
- [Achievement 2]
...
[End Collapsible Section]
```

---

### Section 3: Job History Export

**Reference:** Implement per `job_history_export_functionality` from `ra_resume-analyzer-display.md`

**Display Requirements:**
- Display download buttons for XML/Markdown/ZIP
- Include file size estimates
- Provide format descriptions

**Example:**
```
💾 Export Your Job History

Download your structured job history in multiple formats:

[Download XML] (12 KB) - Machine-readable format for integrations
[Download Markdown] (8 KB) - Human-readable format for editing
[Download ZIP] (5 KB) - All formats bundled together
```

---

### Section 4: Position-by-Position Bullet Review

**Most Detailed Section**

For each position (in reverse chronological order):

#### 4.1 Display Position Header
```
📍 Position 1: Senior Software Engineer at TechCorp
Jan 2020 - Present (3 years, 8 months)
```

#### 4.2 For Each Bullet:

**Step A: Display the bullet**
- Include metric indicator (💰 $ amounts, 📊 %, ⏱️ time saved)
- Include colored verb per verb taxonomy
- Format: `[Verb Category] Bullet text (XXX chars)`

**Example:**
```
[Built] 💰 Developed microservices architecture reducing infrastructure costs by $50K annually (145 chars)
```

**Step B: Display RECOMMENDATION box (if improvements needed)**
- Single consolidated suggestion per bullet
- Only show if bullet has issues

**Example:**
```
💡 RECOMMENDATION
Add baseline context: "reduced from $200K to $150K" for stronger impact
```

**Step C: Display per-bullet audit table**

**Reference:** Implement per `per_bullet_audit_rules` from `ra_resume-analyzer-display.md`

**Example:**
```
| Audit Criteria | Status | Notes |
|----------------|--------|-------|
| Starts with strong verb | ✅ Pass | Built (category: Built) |
| Contains metric | ✅ Pass | $50K savings |
| Has baseline context | ❌ Fail | Add "from $200K to $150K" |
| Length 100-210 chars | ✅ Pass | 145 chars |
| No weak words | ✅ Pass | None detected |
```

#### 4.3 Display Position Summary Statistics

After all bullets for a position:
```
Position 1 Summary:
- Total bullets: 4
- Metrics: 3/4 (75%)
- Avg length: 152 chars
- Verb diversity: 4/5 categories used
```

#### 4.4 Visual Separator Between Positions

```
────────────────────────────────────────────────────────────
```

---

### Section 5: Prioritized Repairs Summary

**Reference:** Implement per `prioritized_repairs_summary_rules` from `ra_resume-analyzer-display.md`

**Display Requirements:**
- Display brief list of RISKS and TWEAKS (Issue description ONLY)
- DO NOT display detailed suggestions here (they're already in Section 4)
- Include jump links to specific positions using format `[P1-B1]` (Position 1, Bullet 1)

**Example:**
```
🔧 Prioritized Repairs

⚠️ RISKS (3):
1. [P1-B2] Missing baseline for cost reduction claim
2. [P2-B1] Vague scope - "several" instead of specific number
3. [P3-B3] No timeline for project completion

🔧 TWEAKS (7):
1. [P1-B1] Add team size context
2. [P1-B3] Spell out NIST on first use
3. [P2-B2] Consider stronger verb than "worked with"
4. [P2-B3] Add frequency (daily? weekly?)
5. [P3-B1] Split run-on sentence
6. [P4-B1] Under-represented "Collaborate" verb category (only 5% of bullets)
7. [P4-B2] Clarify ambiguous pronoun reference
```

---

### Section 6: Overall Statistics

**Display Requirements:**
- Aggregated metric coverage across entire resume
- Verb diversity distribution across entire resume
- Overall grade/score (if applicable)

**Example:**
```
📈 Overall Resume Statistics

Metric Coverage:
- Bullets with metrics: 14/18 (78%) ✅
- $ amounts: 4
- Percentages: 6
- Time metrics: 4

Verb Diversity:
- Built: 7 (39%) ⚠️ Over-represented
- Lead: 3 (17%) ✅ Well balanced
- Managed: 4 (22%) ✅ Well balanced
- Improved: 3 (17%) ✅ Well balanced
- Collaborate: 1 (5%) ⚠️ Under-represented

Overall Grade: B+ (87/100)
```

---

## Section Ordering Rules

1. **Executive Summary** must always come first (quick verdict)
2. **Narrative Analysis** comes second (big picture)
3. **Export Options** come third (utility)
4. **Bullet Review** comes fourth (detailed analysis)
5. **Repairs Summary** comes fifth (action items)
6. **Overall Statistics** comes last (aggregated metrics)

## Display Format Guidelines

### Collapsible Sections
Use for:
- Individual position details in Narrative Analysis
- Long lists in Repairs Summary (if >10 items)

### Color Coding
- 🚫 Red: Blockers
- ⚠️ Orange/Yellow: Risks
- 🔧 Blue: Tweaks
- ✅ Green: Pass/Good
- ❌ Red: Fail/Issue

### Icons
- 💰 Dollar amounts
- 📊 Percentages
- ⏱️ Time saved
- 📍 Position marker
- 💡 Recommendation
- 📖 Narrative
- 💾 Export
- 📈 Statistics

### Character Count Display
Always show character count for bullets:
- Format: `(XXX chars)`
- Color: Green if 100-210, Yellow if <100 or >210

## Integration Points

This module is referenced by:
- Resume Analyzer main workflow
- WebGUI artifact (ResumeAnalyzer-webgui.jsx)

Related modules:
- `ra_resume-analyzer-display.md` - Detailed display rules for each component
- `shared_verb-taxonomy.md` - Verb categorization and color coding
- `ra_quality-gates-guardrails.md` - Quality checks and validation rules
