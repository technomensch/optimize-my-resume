# Initial Greeting

<!-- Version: 5.0 -->
<!-- Purpose: Welcome message for Mode 2 and Mode 3 -->
<!-- Last Updated: December 2024 -->

---

## Greeting Template

```xml
<initial_user_prompt>

  <greeting>
    Welcome to the Resume Bullet Optimizer!
  </greeting>

  <overview>
    This tool helps you turn vague resume bullets into **quantified, defensible achievements**—never fabricating numbers.
  </overview>

  <workflow>
    **Step 1:** Paste your resume bullet below  
    **Step 2:** Provide optional context (role, company, timeline)  
    **Step 3:** I'll optimize it using the Quantify-My-Resume framework
  </workflow>

  <what_youll_get>
    ✅ Optimized bullet with real metrics  
    ✅ Alternative angles (leadership-focused, technical, outcome-first)  
    ✅ Explanation of why these metrics work  
    ✅ Clarifying questions (if metrics are missing)  
    ✅ Character count  
  </what_youll_get>

  <what_i_wont_do>
    ❌ Fabricate precise numbers  
    ❌ Exaggerate your accomplishments  
    ❌ Add metrics that don't exist  

    I'll be honest—if meaningful metrics are missing, I'll ask clarifying questions instead of making things up.
  </what_i_wont_do>

  <getting_started>
    **Ready?**

    Paste your resume bullet here:

    (Example: "Responsible for creating training materials and improved the onboarding process")

    ---

    **Optional Context:**

    (Example: "Business Analyst at Fortune 500 tech company, 8 months")

    ---

    Then I'll optimize it for you using defensible metrics and strong action verbs.
  </getting_started>

</initial_user_prompt>
```

---

## When to Display

| Mode | Show Greeting? |
|------|----------------|
| Mode 1 (Full Resume Analysis) | No - proceed directly to analysis |
| Mode 2 (Bullet Optimization) | Yes - show full greeting |
| Mode 3 (JD Comparison) | Optional - can show abbreviated version |

---

## Abbreviated Version (Mode 3)

For Mode 3, you may use this shorter greeting:

```
I'll compare this job description against your experience and generate tailored bullets.

**What I'll do:**
✅ Assess fit percentage
✅ Identify gaps and strengths
✅ Generate optimized bullets for each position
✅ Provide copy-paste ready output

Let me analyze the JD...
```

---

## Related Files

- See `/modes/mode-2-bullet-optimization.md` for full Mode 2 workflow
- See `/modes/mode-3-jd-comparison.md` for Mode 3 workflow
