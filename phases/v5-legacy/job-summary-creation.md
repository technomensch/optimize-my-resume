# Job Summary Creation

<!-- Version: 5.0 -->
<!-- Purpose: Create comprehensive job summaries for bullet generation -->
<!-- Last Updated: December 2024 -->

---

## Purpose

```xml
<creating_job_summaries>
  <purpose>
    Job summaries serve as comprehensive reference documents that capture all context, deliverables, metrics, and outcomes from a specific role. These summaries enable generation of tailored, quantified bullets for different job applications.
  </purpose>
</creating_job_summaries>
```

---

## Summary Structure

A complete job summary should include these sections:

### Contract/Role Context
- Role title and level
- Client/Company name
- Contract type (FTE, contractor, temp, etc.)
- Duration (start date - end date, total time)
- Team structure (size, reporting relationships)
- Primary focus/responsibilities
- Any unique circumstances (brought back after previous tenure, project recovery, etc.)

### Key Responsibilities & Deliverables
For each major area of work:
- **What:** Specific deliverables created
- **Quantity:** How many (documents, users, systems, etc.)
- **Timeline:** How long it took
- **Purpose:** Why it was needed
- **Method/Approach:** How it was done
- **Tools/Technologies:** What was used
- **Collaboration:** Who was involved (stakeholders, teams, etc.)
- **Outcome:** What happened (even if uncertain or incomplete)

### Metrics & Scale
- ✅ What CAN be claimed (with evidence)
- ❌ What CANNOT be claimed (with reasons why)
- All quantifiable data points:
  * Counts (users, documents, systems, tickets, etc.)
  * Timelines (days, weeks, months)
  * Percentages (reductions, improvements, compliance rates)
  * Scale (team sizes, user bases, stakeholder groups)

### Tools & Technologies
Complete list of all platforms, methodologies, and systems used

### Standards & Compliance
Any regulatory frameworks, industry standards, or compliance requirements

### Skills Demonstrated
Comprehensive list of skills shown through this work

### Collaboration Patterns
All stakeholder groups, team structures, and working relationships

### Honest Limitations
- Explicit documentation of what is unknown or unmeasurable
- Why certain outcomes cannot be claimed
- What was left incomplete due to contract end/transition

---

## Summary Generation Process

```xml
<summary_generation_process>
  After collecting user's detailed information:

  1. **Parse and organize** all provided information into the summary structure above

  2. **Ask clarifying questions** about any gaps using the probing question framework

  3. **Draft the summary** following this format:

     ================================================================================
     JOB [N]: [Company] - [Role Title]
     ================================================================================
     
     Contract Context:
     [Full context details]
     
     Key Responsibilities & Deliverables:
     
     1. [Project/Area Name]
     --------------------
     [Detailed breakdown following summary structure]
     
     2. [Next Project/Area]
     ----------------------
     [Details...]
     
     Metrics & Scale:
     ✅ [What can be claimed]
     ❌ Unknown: [What cannot be claimed]
     
     [Continue with all other sections...]

  4. **Review with user** to verify accuracy and completeness

  5. **Mark for future use** as reference material for bullet generation

  6. **Store appropriately** in user's job history documentation
</summary_generation_process>
```

---

## Using Summaries for Bullets

```xml
<using_summaries_for_bullets>
  When generating bullets from an existing summary:

  1. **Review target job description** for required keywords and skills

  2. **Mine the summary** for relevant:
     - Deliverables that match job requirements
     - Metrics that demonstrate required capabilities  
     - Tools/technologies mentioned in job posting
     - Relevant collaboration patterns
     - Applicable outcomes

  3. **Extract only defensible claims** (from the ✅ section)

  4. **Generate bullets** following standard optimization process

  5. **Apply verb diversity** across selected bullets

  6. **Verify character limits** (<210 chars typically)

  7. **Ensure keyword coverage** for target role
</using_summaries_for_bullets>
```

---

## Quality Checklist

A complete job summary should answer:

| Question | Category |
|----------|----------|
| ✅ What did you do? | Deliverables |
| ✅ How much/many? | Quantification |
| ✅ How long? | Timelines |
| ✅ For whom? | Users, stakeholders, team size |
| ✅ With what? | Tools, technologies, methodologies |
| ✅ With whom? | Collaboration patterns |
| ✅ What happened? | Outcomes (even if uncertain) |
| ✅ What can't you claim? | Honest limitations |

---

## Critical Reminders

```xml
<critical_reminders>
  - Summaries are NOT resumes - they can be long, detailed, and conversational
  - Include EVERYTHING remembered, even if it seems minor
  - Mark uncertainties clearly ("approximately", "~", "I think")
  - Document what is unknown or unmeasurable
  - Spell out all acronyms
  - Focus on facts over polish
  - Prioritize completeness over brevity
</critical_reminders>
```

---

## File Storage

Job summaries should be stored in:
- **Claude Projects:** `/mnt/project/claude_generated_job_history_summaries.txt`
- **Local:** As a text file in your resume documents folder

---

## Related Files

- See `/modes/mode-2-bullet-optimization.md` for probing questions
- See `/core/verb-categories.md` for action verb guidelines
- See `/core/metrics-requirements.md` for metrics targets
