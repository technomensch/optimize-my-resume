# Mode 1: Full Resume Analysis

**Version:** 5.0  
**Purpose:** Comprehensive resume scoring and analysis

---

## Triggers

```xml
<mode id="1" name="full_resume_analysis">
  <triggers>
    - User uploads complete resume document (PDF, DOCX, TXT)
    - User says: "analyze my resume", "review my resume", "score my resume"
    - User provides multi-position work experience in structured format
  </triggers>
</mode>
```

---

## Behavior

```xml
<behavior>
  - Calculate years of experience using experience_calculation methodology
  - Analyze EVERY position using position-by-position loop
  - Score resume across 4 categories (ATS Format, Content Quality, Quantifiable Impact, Skills & Keywords)
  - Output comprehensive analysis report
</behavior>
```

---

## Scoring Categories

| Category | Points | What It Measures |
|----------|--------|------------------|
| ATS Format | /40 | Technical compliance and parser readability |
| Content Quality | /20 | Professionalism, tone, and grammar |
| Quantifiable Impact | /20 | Metric density and value demonstration |
| Skills & Keywords | /20 | Hard vs Soft skills balance |

**Total: 100 points**

---

## Experience Calculation Methodology

### How to Calculate Years of Experience

**DO NOT rely on education dates or assumptions. Calculate precisely:**

1. **Identify Relevant Professional Experience Start Date:**
   - Find the EARLIEST professional position (exclude internships unless that's all they have)
   - Use the start date of that position
   - Skip: Retail, food service, or other non-career positions unless relevant to target role

2. **Identify End Date:**
   - If currently employed (position shows "Present" or "Current"): Use today's date
   - If not currently employed: Use end date of most recent position

3. **Calculate Total Years:**
   - Years of Experience = End Date - Start Date of earliest relevant position
   - Round to nearest whole year

4. **Classification Based on Calculated Years:**
   - **0-1 years:** New Graduate
   - **1-5 years:** Early Career
   - **6-15 years:** Mid-Career
   - **15+ years:** Senior/Executive

---

## Analysis Process

### Mandatory Position Loop

**CRITICAL: The agent MUST loop through and analyze EVERY position listed in the work experience section.**

For EACH position, perform the following analysis:

1. **Position Identification**
   - Company name, job title, dates
   - Calculate if this is the earliest relevant position (for experience calculation)
   - Number of bullets present
   - Position number in sequence (Position 1 = most recent)

2. **Individual Bullet Assessment**
   - Rate each bullet: Strong/Medium/Weak
   - Identify metrics, impact statements, skills
   - Note character count compliance (100-210)
   - Flag redundancies with other bullets

3. **Collective Bullet Analysis for This Position**
   - Evaluate bullets as a group - do they tell a cohesive story?
   - Identify internal redundancies within this position
   - Assess variety of achievements shown
   - Determine if bullets complement or repeat each other

4. **Position-Specific Reordering Recommendations**
   - Analyze current order
   - Propose optimal order based on impact
   - Provide rationale for each move

5. **Position-Specific Consolidation Opportunities**
   - Identify which bullets could be merged
   - Show before/after examples
   - Calculate word savings

---

## Output Structure

See `/wireframes/mode-1-workflow.md` for the visual output format.

### Executive Summary
```
Overall Score: X/100
- ATS Format: X/40 points
- Content Quality: X/20 points
- Quantifiable Impact: X/20 points
- Skills & Keywords: X/20 points

EXPERIENCE CALCULATION:
Earliest Relevant Position: [Job Title] starting [Month Year]
Most Recent Position End: [Present/Month Year]
Total Years Calculated: X years
Resume Category: [New Grad (0-1)/Early Career (1-5)/Mid-Career (6-15)/Senior (15+)]

Word Count Target: [300-400/350-500/500-650 words]
Critical Issues: X
Major Issues: X
Minor Issues: X
```

### Detailed Analysis Sections

1. **Contact Information Check**
2. **Structure Compliance**
3. **Bullet Order & Impact Analysis** (ALL POSITIONS)
4. **Redundancy & Consolidation Opportunities**
5. **Cross-Resume Redundancy & Optimization**
6. **Measurable Results Analysis**
7. **Keywords Analysis**
8. **Character Length Compliance**

### Priority Fixes

Categorized as:
- **Critical (Must Fix)** - Dealbreakers
- **High Priority** - Significant impact
- **Medium Priority** - Polish items
- **Optional Considerations** - Nice to have

---

## References

- See `/core/format-rules.md` for character limits and formatting
- See `/core/verb-categories.md` for action verb distribution
- See `/core/metrics-requirements.md` for metric targets
- See `/wireframes/mode-1-workflow.md` for visual diagram
