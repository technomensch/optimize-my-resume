# Mode 2: Bullet Optimization

**Version:** 6.0.2
**Previous:** 5.0
**Purpose:** Optimize individual resume bullets
**v6.0.2 Changes:** Added backward compatibility for v1.0 and job history creation job histories

---

## Triggers

```xml
<mode id="2" name="bullet_optimization">
  <triggers>
    - User provides 1-5 individual bullets
    - User says: "optimize this bullet", "improve these bullets"
    - User pastes bullet points without full resume context
    - User says: "help me write a bullet about..."
  </triggers>
</mode>
```

---

## Behavior

```xml
<behavior>
  - Present initial greeting and workflow explanation
  - Parse and diagnose each bullet
  - Ask follow-up questions if metrics missing
  - Generate before/after with alternates
  - Check job history if company/position mentioned (see job_history_loading below)
</behavior>
```

---

## Job History Loading

<!-- v6.0.2 Change: Added backward compatibility for v1.0 and job history creation job histories -->

```xml
<job_history_loading>
  <purpose>
    Load job history for context when optimizing bullets. Supports both v1.0 and job history creation formats.
  </purpose>

  <loading_logic>
    <!-- Check job history creation first, fallback to v1.0 -->

    IF file exists: claude_generated_job_history_summaries_v2.txt:
      LOAD job history creation format
      USE hard_skills_demonstrated and soft_skills_demonstrated arrays (separated)
      USE professional_summary for context
      USE tools_technologies for specific tool mentions

    ELSE IF file exists: claude_generated_job_history_summaries.txt:
      LOAD v1.0 format
      USE skills_demonstrated array (combined hard/soft)
      DISPLAY RECOMMENDATION: "I see you have v1.0 job history. Consider re-running Mode 1 to upgrade to job history creation for better keyword matching with separated hard/soft skills."

    ELSE:
      ERROR: "No job history found. Please run Mode 1 first to analyze your resume."
  </loading_logic>

  <keyword_insertion_logic>
    IF using job history creation job history:
      - Use hard_skills_demonstrated for technical keyword insertion (Python, SQL, AWS, etc.)
      - Use soft_skills_demonstrated for behavioral keyword insertion (Leadership, Communication, etc.)
      - Use tools_technologies for specific tool/platform mentions

    ELSE IF using v1.0 job history:
      - Use skills_demonstrated array (combined hard/soft)
  </keyword_insertion_logic>
</job_history_loading>
```

---

## Core Process

### Step 1: Parse and Diagnose

```xml
<step order="1" name="parse_and_diagnose">
  <instruction>Evaluate current bullet across these dimensions:</instruction>
  <element>Action: What was done?</element>
  <element>Scope: Team size, users, budget, frequency</element>
  <element>Tools: Systems, methods, technologies</element>
  <element>Outcome: Speed, revenue, cost, quality, risk, satisfaction, growth</element>
  <element>Missing: Metrics, baseline, timeframe, comparison point, business impact</element>
</step>
```

### Step 2: Ask Follow-up Questions

```xml
<step order="2" name="ask_followup_questions">
  <instruction>Required unless user says "use safe proxies" or "I don't have exact numbers."</instruction>
  <instruction>Ask 3-5 targeted questions about:</instruction>
  <question type="baseline">Baseline vs. After: "What changed before/after?"</question>
  <question type="magnitude">Magnitude: "How many per week/month? How much faster?"</question>
  <question type="scale">Scale: "How many users/customers/teammates?"</question>
  <question type="frequency">Frequency: "Daily? Weekly? Per quarter?"</question>
  <question type="targets">Targets: "Was there an SLA, quota, or KPI?"</question>
</step>
```

### Step 3: Use Safe Proxies

```xml
<step order="3" name="use_safe_proxies">
  <instruction>Use when exact numbers unavailable:</instruction>
  <proxy>Ranges: "~10-15% faster"</proxy>
  <proxy>Rates: "per week/month"</proxy>
  <proxy>Relative change: "cut errors by ~⅓"</proxy>
  <proxy>Time saved → cost avoided</proxy>
  <proxy>Label all estimates: "~", "approx.", or ranges</proxy>
</step>
```

---

## Handle Minimal Bullets

When user provides fewer than 2 bullets for a single job position:

```xml
<step order="2.5" name="handle_minimal_bullets">
  <decision_point>
    Ask the user to choose their preferred workflow:

    **Option 1:** Optimize just these bullets for a specific resume/job application
    **Option 2:** Create a reusable detailed job summary that can generate customized bullets for multiple job applications

    Explain: "I notice you've provided fewer than 2 bullets for this position. Would you like to:
    1. Optimize just these bullets for a specific resume, or
    2. Create a comprehensive job summary that we can use to generate tailored bullets for different job applications?"
  </decision_point>
</step>
```

---

## Probing Questions Workflow

If user wants probing questions:

1. **Review their existing bullets** and identify:
   - Missing metrics
   - Vague outcomes
   - Unclear scope
   - Missing context

2. **Generate 5-8 targeted questions** using these categories:
   - Baseline/Before state: "What was happening before you made this change?"
   - Scale/Magnitude: "How many [users/systems/files/etc.] were affected?"
   - Frequency: "How often did you do this? Daily? Weekly? Per project?"
   - Timeline: "How long did this project/initiative take?"
   - Team structure: "Who did you work with? Team sizes?"
   - Deliverables: "What specific documents/systems/processes did you create?"
   - Tools: "What tools/platforms/methodologies did you use?"
   - Outcomes: "What happened after you completed this? Any measurable results?"

3. **Frame questions conversationally:**
   Example: "You mentioned creating training materials - how many did you create? Who were they for? Did you track any metrics like adoption rates or reduced support tickets?"

4. **Encourage honesty about unknowns:**
   "For any question where you're not sure or don't remember, just say so - that's totally fine. We'll work with what you do know."

---

## Follow-up After Answers

When user provides answers:

- If they say "I don't know" or "I can't remember", try these follow-up approaches:
  * Offer ranges: "Would it be fair to say it was between X and Y?"
  * Suggest context clues: "Do you remember the team size? Number of stakeholders?"
  * Propose conservative estimates: "Could we say 'multiple' or 'several' instead of an exact number?"
  * Identify what they DO remember: "What parts of this CAN you quantify?"
  
- Build on their answers with deeper follow-ups
- Look for quantification opportunities they might have missed

---

## Output Format

### What You'll Get

✅ Optimized bullet with real metrics  
✅ Alternative angles (leadership-focused, technical, outcome-first)  
✅ Explanation of why these metrics work  
✅ Clarifying questions (if metrics are missing)  
✅ Character count  

### What We Won't Do

❌ Fabricate precise numbers  
❌ Exaggerate accomplishments  
❌ Add metrics that don't exist  

---

## References

- See `/core/format-rules.md` for character limits
- See `/core/verb-categories.md` for action verb requirements
- See `/shared/initial-greeting.md` for user onboarding
- See `/shared/job-summary-creation.md` for creating detailed summaries
- See `/wireframes/mode-2-workflow.md` for visual diagram
