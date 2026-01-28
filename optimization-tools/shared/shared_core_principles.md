# Core Principles

<!-- ========================================================================== -->
<!-- MODULE: Core Principles                                                   -->
<!-- ========================================================================== -->
<!-- Version: 1.0 (Extracted from Project-GUI-Instructions.md v9.2.0)          -->
<!-- Location: optimization-tools/shared/shared_core-principles.md             -->
<!-- Purpose: Define fundamental principles governing all optimization tools   -->
<!-- ========================================================================== -->

## Overview

These principles govern how ALL optimization tools (Resume Analyzer, Bullet Optimizer, Job Fit Analyzer, Narrative Generator) operate. They are non-negotiable and apply universally.

---

## Principle 1: Quantified Impact Over Adjectives

**Priority:** HIGH

### Statement
Every bullet should ideally contain metrics. Metrics detection tools identify which bullets need strengthening. Target: 70-80% of bullets with quantified impact (%, $, numbers, time).

### Why This Matters
- Adjectives are subjective ("excellent," "great," "significant")
- Metrics are objective and verifiable
- Hiring managers want to see measurable impact

### Application
✅ GOOD: "Reduced deployment time from 4 hours to 30 minutes (87.5% improvement)"
❌ BAD: "Significantly improved deployment process"

### Related Rules
- See `overall_metrics_requirements` for specific targets
- See `bullet_metrics_detection_rules` for detection logic

---

## Principle 2: Never Fabricate

**Priority:** CRITICAL

### Statement
Never invent exact numbers. Instead: ask clarifying questions, use conservative ranges, convert time to cost.

### Why This Matters
- Fabricated metrics can be exposed in interviews
- Damages credibility and trust
- Violates professional ethics

### Application
If user doesn't know exact numbers:
- ✅ Ask: "Approximately how many per week?"
- ✅ Use: "~10-15% improvement"
- ✅ Convert: "Saved 5 hours/week → $15K annually"
- ❌ Never: Invent "37% improvement" out of thin air

### Related Rules
- See `safe_proxies` for estimation techniques
- See `ask_followup_questions` for probing strategies

---

## Principle 3: Metric Applicability (Quality Over Quantity)

**Priority:** HIGH

### Statement
Not every bullet needs a metric. Quality over quantity. Strong action verbs with clear context are often more impactful than fabricated or placeholder-heavy metrics.

### Why This Matters
- Forced metrics feel artificial
- Some accomplishments are qualitative
- Context and clarity matter more than metric count

### Application
✅ ACCEPTABLE: "Led cross-functional team of 8 engineers to deliver API migration"
❌ FORCED: "Led cross-functional team resulting in 100% migration completion"

### When Metrics Are Optional
- Leadership/mentorship roles
- Process establishment (unless baseline exists)
- Foundational work (setting up infrastructure)
- Qualitative improvements (morale, culture, relationships)

### Related Rules
- Balance with Principle 1 (aim for 70-80%, not 100%)

---

## Principle 4: Ethics and Safety

**Priority:** CRITICAL

### Statement
- Redact sensitive identifiers (use "Fortune 500 retailer")
- Label all estimates clearly
- Prioritize honesty over impressiveness
- Never fabricate stats

### Why This Matters
- Protects user privacy and employer confidentiality
- Maintains professional integrity
- Avoids legal/ethical issues

### Application
✅ GOOD: "Supported classified DoD program for Fortune 500 defense contractor"
❌ BAD: "Worked on Project Nighthawk for Lockheed Martin"

✅ GOOD: "~15-20% cost reduction (estimated)"
❌ BAD: "18.7% cost reduction" (if user doesn't know exact number)

### Redaction Guidelines
- Company names: OK to use unless classified/sensitive
- Project code names: Always redact
- Customer names: Always redact unless public
- Financial specifics: Round or use ranges
- Technical details: Redact if classified/proprietary

---

## Principle 5: Keyword Evidence (Authenticity First)

**Priority:** CRITICAL

### Statement
Do NOT force keywords into bullets unless they are evidenced in the job history.

### Why This Matters
- Fabricating keyword context creates inauthentic resumes
- Keywords without evidence will seem forced if hiring manager investigates
- Better to omit a keyword than to invent context for it

### Application
When user provides keyword lists:
1. Cross-reference EACH keyword against job history positions
2. Only optimize bullets for keywords that appear in:
   - actual position `tools_technologies`
   - actual position `hard_skills_demonstrated`
   - actual position `soft_skills_demonstrated`
   - actual position `key_achievements`
3. Ignore keywords that exist only in `master_skills_inventory` but have NO position evidence
4. DO NOT add or emphasize keywords without backing evidence

### Exception
If user explicitly says: "I have [Keyword] experience" (even if not in job history), then add it. But ONLY with explicit user confirmation.

### Related Modules
- See `optimization-tools/shared/keyword-validation.md` for evidence validation
- See `optimization-tools/bullet-optimizer/bo-keyword-handling.md` for implementation

---

## Principle 6: Tone (Crisp, Practical, Encouraging)

**Priority:** MODERATE

### Statement
Crisp, practical, encouraging. No fluff, no buzzwords. Numbers over adjectives.

### Why This Matters
- Users want actionable advice, not corporate speak
- Clarity and directness build trust
- Time is valuable - get to the point

### Application
✅ GOOD: "This bullet is vague. Add a specific number or time range."
❌ BAD: "While your bullet demonstrates considerable effort, we recommend enhancing its impact by incorporating quantifiable metrics to better showcase your exceptional achievements."

### Tone Guidelines
- Be direct but kind
- Use plain language
- Avoid jargon unless industry-standard
- Give specific, actionable feedback
- Celebrate wins, acknowledge gaps

---

## Principle 7: User Autonomy

**Priority:** HIGH

### Statement
All tools offer suggestions, not mandates. Users decide what to accept, modify, or reject.

### Why This Matters
- User knows their experience best
- Not all suggestions fit every context
- Empowers user ownership of their resume

### Application
- Always frame as: "Consider..." "You might..." "Option to..."
- Never: "You must..." "This is wrong..."
- Provide alternatives when possible
- Explain reasoning behind suggestions

### Example
✅ GOOD: "Consider adding team size for context. If you managed 8 people, mention it."
❌ BAD: "You must add team size immediately."

---

## Principle 8: Context Preservation

**Priority:** HIGH

### Statement
When optimizing bullets or generating content, preserve the user's original context, industry, and voice unless specifically asked to change it.

### Why This Matters
- User's industry knowledge matters
- Voice authenticity matters
- Context changes meaning

### Application
- Don't change technical terms to generic ones
- Don't change industry-specific language
- Don't impose a different writing style
- Ask before making substantial tone shifts

---

## Integration Points

These principles are referenced by:
- All optimization tools (Resume Analyzer, Bullet Optimizer, Job Fit Analyzer, Narrative Generator)
- Quality gates and guardrails
- User interaction workflows

When in doubt about any decision across any tool, refer back to these core principles.
