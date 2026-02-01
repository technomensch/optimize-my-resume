# Common Gotchas & Solutions

**Last Updated:** 2026-01-30
**Entries:** 14
**⚠️ CRITICAL INCIDENT (Jan 29, 2026):** Multiple gotchas below (especially "The Vibe-Coding Drift," "Instructional Saturation," and "Recursive Constraint Drift") combined to cause complete enforcement system bypass in production. **See [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) for full incident analysis, 4+ failure modes, and solutions.**

---

## Quick Navigation

- [Skills Not Appearing](#skills-not-appearing) - Global directory requirement
- [Skills Not Loading After Changes](#skills-not-loading-after-changes) - Startup-only loading
- [Lost Content in Updates](#lost-content-in-updates) - Full rewrite pitfall
- [Project vs. Global Confusion](#project-vs-global-confusion) - Scoping misunderstanding
- [Chat History Bloat](#chat-history-bloat) - Gitignore pattern needed
- [Plan File Location](#plan-file-location) - Temporary vs. permanent
- [Deleting Feature Branches](#deleting-feature-branches) - Loss of audit trail
- [Agent Governance Drift](#agent-governance-drift) - Omission of workflow steps (Issue #42)
- [Absolute Path Regression](#absolute-path-regression) - Breaking documentation portability
- [Unverified Skill Hallucination](#unverified-skill-hallucination) - AI fabrication of custom skills
- [Token Impact of Customization](#token-impact-of-customization) - High cost of multi-tier generation
- [Binary Extraction Limits](#binary-extraction-limits) - Base64 parsing reliability
- [Solo Management Hallucination](#solo-management-hallucination) - Using management verbs for solo projects
- [The Vibe-Coding Drift](#the-vibe-coding-drift) - LLM reverting to training bias in saturated context
- [Logic Conflation Trap](#logic-conflation-trap) - Mixing Master Summary logic with Per-JD optimization
- [ID Parallax](#id-parallax) - Misinterpreting code definitions based on intuition
- [Instructional Saturation](#instructional-saturation) - Loss of rule adherence in long context windows
- [Recursive Constraint Drift](#recursive-constraint-drift) - LLM failure to balance interdependent word/char/uniqueness limits
- [The Pink Elephant Problem](#the-pink-elephant-problem) - Negative instructions can prime the opposite behavior (v9.3.7)
- [Probabilistic Enforcement Myth](#probabilistic-enforcement-myth) - Believing prompt-based guardrails can achieve 100% compliance
- [Guardrail Evasion via Unicode](#guardrail-evasion-via-unicode) - Character injection techniques bypass commercial guardrails
- [Silent Enforcement Drift](#silent-enforcement-drift) - Compliance declining over time without monitoring

---

## Claude Code Gotchas

### Skills Not Appearing

**Symptom:** Created skill in `.claude/skills/` but it doesn't appear in Claude Code

**Gotcha:** Skills load from `~/.claude/commands/` (global) only, not `.claude/skills/` (project)

**Fix:**
```bash
cp .claude/skills/your-skill.md ~/.claude/commands/
# Restart Claude Code
```

**Why:** Architectural decision in Claude Code - skills are user-level, not project-level

**See:** [ADR-002: Skills Global-Only](../decisions/ADR-002-skills-global-only.md)

---

### Skills Not Loading After Changes

**Symptom:** Modified skill in `~/.claude/commands/` but changes don't take effect

**Gotcha:** Claude Code loads skills at startup only, not dynamically during runtime

**Fix:**
1. Save changes to `~/.claude/commands/your-skill.md`
2. Quit Claude Code completely
3. Relaunch Claude Code

---

### Recursive Constraint Drift

**Symptom:** LLM successfully follows one rule (e.g., word count) but breaks another (e.g., character limits per bullet), or refuses to adhere to both simultaneously.

**Gotcha:** Interdependent constraints (Char limits + Word budget + Uniqueness) form a recursive loop. Compressing text to fit characters might drop word count; adding bullets to hit word count breaks character gates. LLMs enter "panic mode" and default to training bias.

**Real-World Example (Jan 29, 2026):**
During bullet generation, the system had to balance: 9 positions (recency), 350-500 word budget, 100-210 chars per bullet, verb diversity (3+ categories), chronological order, metric preservation. When all constraints should have been visible via the 3-Stage Checkpoint Pattern, none were shown. The model panicked and reverted to generating 5 random positions in wrong order.

**Fix:** Break monolithic validation tables into a **3-Stage Checkpoint Pattern**.
1. **Budget Planning (Stage 1):** Output visible allocation table BEFORE generation.
2. **Incremental Gates (Stage 2):** Validate per bullet DURING generation with visible checkpoints.
3. **Final Reconciliation (Stage 3):** Verify total output with explicit fallback logic (e.g., "Remove from oldest first").

**Implementation Note:** On Jan 29, this pattern existed in documentation but was never executed. The issue was that there was no mechanism forcing execution.

**See:**
- [Lesson: Recursive Constraint Validation](../lessons-learned/process/Lessons_Learned_Recursive_Constraint_Validation.md)
- [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) - Why enforcement failed
- [ADR-010: Guardrail Hardening Pattern](../decisions/ADR-010-guardrail-hardening-pattern.md)

4. Test skill

**Why:** No hot-reload mechanism - skills load once at startup for performance

**See:** [Lesson: Skills Not Loading Until Restart](../lessons-learned/debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

---

## Content Management Gotchas

### Lost Content in Updates

**Symptom:** Updated document and lost carefully crafted metrics, details, or phrasing

**Gotcha:** LLMs default to full rewrites instead of surgical updates

**Fix:**
1. Always use surgical updates pattern
2. Explicitly instruct: "Add to existing section, don't rewrite"
3. Validate preservation rate (should be 80%+)
4. Review diffs before accepting

**Why:** LLMs optimize for consistency, which often means regenerating content

**See:** [ADR-003: Surgical Updates Pattern](../decisions/ADR-003-surgical-updates-pattern.md)

---

### Project vs. Global Confusion

**Symptom:** Unclear whether file should be in project repository or global directory

**Gotcha:** Mixing execution location with documentation location

**Rule of Thumb:**
- **Execution** → Global directory (`~/.claude/commands/`)
- **Documentation** → Project repository (`.claude/skills/`, `docs/`)
- **Both** → Hybrid pattern (global execution + project reference)

**See:** [Concept: Global vs. Project-Local](concepts.md#global-vs-project-local)

---

## Git/Version Control Gotchas

### Chat History Bloat

**Symptom:** Repository size growing due to chat history exports

**Gotcha:** Need to track folder but ignore contents

**Fix:**
```gitignore
# .gitignore
chat-history/*
!chat-history/.gitkeep
```

**Why:** Want folder in repo for workflow, but exports are large and session-specific

**See:** [Lesson: Chat History Workflow](../lessons-learned/process/Lessons_Learned_Chat_History_Workflow.md)

---

### Plan File Location

**Symptom:** Plans created in `.claude/plans/` not versioned, lost after cleanup

**Gotcha:** Temporary vs. permanent plan locations

**Fix:**
```bash
# Move plan from temporary to tracked location
mv ~/.claude/plans/feature-plan.md docs/plans/
```

**Why:** `.claude/plans/` is temporary (Claude Code internal), `docs/plans/` is permanent (git tracked)

**See:** [Lesson: Plan File Locations](../lessons-learned/process/Lessons_Learned_Plan_File_Locations.md)

---

### Deleting Feature Branches

**Symptom:** Lost the "thought process" and reasoning behind a merged feature
**Gotcha:** Standard git cleanup (deleting branches) destroys the granular commit history
**Fix:**
- **NEVER** delete feature branches after merging
- Keep them on origin as historical archives
- Use `v8.x-` naming to organize them
- If deleted, check `git reflog` immediately to restore

**Why:** The *history of decisions* is as valuable as the code. Squashed merges in main hide the intermediate steps.

**See:** [ADR-006: Strict Branch Preservation](../decisions/ADR-006-strict-branch-preservation.md)

---

## Agent Process Gotchas

### Agent Governance Drift

**Symptom:** The AI agent executes complex technical fixes but "forgets" to create GitHub issues, set milestones, or update the roadmap.

**Gotcha:** AI reasoning defaults to "Problem Solution" (coding) rather than "Project Management" (governance) under high technical focus.

**Fix:**
1.  **Enforce Guardrail #31**: Workflow Lifecycle Compliance.
2.  **Plan First**: Mandate that planning artifacts include issue/branch IDs before any `replace_file_content` calls.

**Why:** Lack of an audit trail makes it impossible to track *why* a change happened 6 months later.

**See:** [Issue #42](https://github.com/technomensch/optimize-my-resume/issues/42)

---

### Absolute Path Regression

**Symptom:** Documentation links or terminal commands fail when the project is moved to a different machine or user.

**Gotcha:** Hardcoding `/Users/[Username]/...` paths in documentation or code snippets.

**Fix:**
1.  **Always use Relative Paths**: Use `./filename` or repo-relative paths like `optimization-tools/...`.
2.  **Sanitization Pass**: Periodically run `grep -r "Users/" .` to catch leaked absolute paths.

**Why:** Absolute paths destroy repository portability and shareability.

**See:** [Lessons Learned: Relative File Paths](../lessons-learned/architecture/Lessons_Learned_Relative_File_Paths.md)

---

## Technical Performance Gotchas

### Unverified Skill Hallucination

**Symptom:** Custom keywords added by the user appear in the finalized resume with fabricated metrics or experience (e.g., claiming 3 years of Kubernetes experience when history shows only 3 months).

**Gotcha:** AI defaults to "Helpful" mode, assuming that if the user provides a keyword, it MUST be valid. It will invent context to make it fit.

**Fix:**
1.  **Guardrail #32**: Implement background verification against job history.
2.  **User Confirmation**: Require a "Proceed Anyway" acknowledgment.
3.  **Prompt Instruction**: Explicitly use "exposure" or "familiarity" instead of "expert" for unverified items.

**See:** [Guardrail #32](../../PROJECT-INSTRUCTIONS.md#guardrail-32)

---

### Token Impact of Customization

**Symptom:** AI stops mid-response or crashes with "Token limit exceeded" during customization generation.

**Gotcha:** Customization requires a massive context window (Full Job History + Full JD + Previous Analysis + Generation Prompt). This can easily hit 10K+ tokens in a single `generate` call.

**Fix:**
1.  **Threshold Gating**: Only offer customization for fit scores > 50%.
2.  **User Consent**: Never auto-generate; wait for a button click.
3.  **Summarization**: Compress history into the 12-section XML schema before passing to the generation prompt.

**See:** [Concept: Fit-Score Gating](concepts.md#fit-score-gating)

---

### Binary Extraction Limits

**Symptom:** Results show "Empty Resume" or "Analysis Failed" after uploading a PDF or DOCX.

**Gotcha:** Browser-based base64 encoding of large binary files can struggle with complex layers or images, resulting in partial text extraction.

**Fix:**
1.  **Text Fallback**: Always offer a copy-paste area as a fallback.
2.  **Library Upgrade**: Use specialized libraries like `pdf.js` or `mammoth.js` (Issue #1).

**See:** [Session Summary 2026-01-18](../sessions/2026-01/session-summary-2026-01-18-should-i-apply.md#known-limitations)

---

### The Vibe-Coding Drift

**Symptom:** Agent ignores project-specific XML structure or terminology (e.g., using "Phase 1" instead of "Resume Analysis") and generates a generic "polished" resume.

**Gotcha:** In context-heavy sessions (>4,000 lines), the model's training bias on what a "resume" looks like overrides specific instructions. The agent "drifts" toward its "vibe" of resume writing rather than your "architecture."

**Real-World Example (Jan 29, 2026):**
During production bullet generation, all guardrails were ignored despite being well-documented. The model generated 5 positions in wrong chronological order, skipped 4 positions entirely, didn't show any validation checkpoints, and claimed compliance without evidence. This is "Vibe-Coding Drift" in action.

**Fix:**
1.  **Mandatory Pre-flight Thinking:** Force the model to output a rule-mapping table *before* generation.
2.  **External Validator:** Use an external logic file (e.g., `bo_output-validator.md`) to audit the output.
3.  **Recency Anchors:** Place critical formatting rules at the absolute end of the prompt.

**See:**
- [Lesson: Effective LLM Constraints](../lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md)
- [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) - Full incident analysis
- [Case Study: Enforcement System Failure](../issues/ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md)

---

### Logic Conflation Trap

**Symptom:** User asks to "optimize resume" and the agent generates a Master Professional Summary (global) instead of Per-JD optimized bullets (specific), or vice versa.

**Gotcha:** Multiple files (e.g., `ng_summary-generation.md` and `bo_bullet-generation-instructions.md`) mention "summary." Without explicit disambiguation, agents conflate the one-time Master Summary logic with the ephemeral Per-JD customization logic.

**Fix:**
1. **Aggressive Disambiguation:** Use high-contrast choice gates in the workflow router (`jfa_workflow-router.md`) forcing the user to pick between "Option A: Master" or "Option B: Per-JD."
2. **Exclusion Headers:** Add "THIS IS NOT" headers to logic modules to stop the agent if it routes incorrectly.
3. **Workflow Naming:** Distinguish between "Summary Generation" (Master) and "Application Optimization" (Per-JD).

**See:** [Workflow Router](../job-fit-analyzer/jfa_workflow-router.md)

---

## Technical Reasoning Gotchas

### ID Parallax
269: 
270: **Symptom:** Agent follows "intuition" for a guardrail (e.g., G12) rather than the project-specific definition found in the logic hub.

**Gotcha:** Proximity and intuition override reference lookup. If the agent sees "G12" and "spacing" in the same thought cycle, it may hallucinate that G12 is the spacing rule.

**Fix:**
1. **Rule-ID Mapping:** Mandate a visible "Step 0" table mapping IDs to literal definitions from the hub.
2. **Atomic Logic Hubs:** Keep ID definitions within the active context window of the logic hub (`bo_bullet-generation-instructions.md`).

**Why:** Higher-parameter models (Opus/Gemini Pro) are more prone to "intuitive overthinking" where they bridge gaps using general training data instead of looking up modular definitions.

---

### Instructional Saturation

**Symptom:** The agent correctly identifies a rule (e.g., "NEVER use em-dashes") but fails to apply it during the primary generation stream.

**Gotcha:** In long context windows (>4,000 lines), instructions placed at the start or middle lose "priority weight." The agent knows the rule but lacks the "working memory" to hold it active while generating high-density content.

**Real-World Example (Jan 29, 2026):**
The assistant read and understood all 37 guardrails (G1-G37), lessons learned explaining why they matter, ADRs formalizing decisions, and the 3-Stage Checkpoint Pattern. Yet none of this was applied during generation. The model reverted to its training bias about "what a resume looks like" because 2+ days of context overload caused rules to lose attention weight.

**Fix:**
1. **Recency Anchors:** Place the most critical constraints at the absolute bottom of the prompt.
2. **Negative Validators:** Use a dedicated validation file (`bo_output-validator.md`) that specifically searches for "forbidden patterns."
3. **Mandatory Pre-Flight Checks:** Force output of rule-mapping table BEFORE generation (overcomes saturation).
4. **Internal Data Breach:** Use a "Thinking" block to list metrics *before* writing the bullet (Data Integrity Audit).

**Why:** Context window length ≠ Context attention. Rule adherence degrades as a function of distance from the execution trigger. At 4,000+ lines, passive documentation is insufficient.

**See:**
- [Lesson: Effective LLM Constraints](../lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md)
- [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md) - How saturation led to enforcement failure

---

## Enforcement Solution: Four-Layer Strategy (v9.3.7)

**Context:** The "Vibe-Coding Drift," "Instructional Saturation," and "Recursive Constraint Drift" gotchas combined to cause complete enforcement system failure on 2026-01-29. v9.3.6 built comprehensive documentation of 37 guardrails that were completely ignored in production.

**Root Cause:** Passive documentation cannot prevent LLM drift. The model can read, understand, and still ignore instructions when context saturation or training bias overrides them.

**Solution:** Move from passive instructions to **active structural constraints** using Four-Layer Enforcement Strategy.

### Layer 1: Structural Prompt Logic
**What:** Hard mathematical limits embedded in prompt template
- Uses MUST/MUST NOT language with explicit assertions
- Examples: `assert(bullets.length === expectedCount)`, `assert(positions[i].date > positions[i+1].date)`
- Reduces degrees of freedom the model can explore
- **Addresses:** Positions omitted, wrong order, budget ignored

### Layer 2: "Proof of Work" Schema
**What:** JSON validation gates requiring explicit proof for each guardrail
- Model must show `status: "PASS"` and `proof: "evidence"` for each guardrail
- Binary gate: If `all_guardrails_passed !== true`, output is REJECTED
- Forces model to show validation work (not hide in thinking blocks)
- **Addresses:** Invisible validation, fake compliance claims, hidden reasoning

### Layer 3: Workflow Multi-Turn
**What:** Physical conversation turns with user approval between stages
- Turn 1: Budget planning + constraint validation only
- User approval gate: "Does this plan look correct?"
- Turn 2: Generation with approved constraints
- Impossible constraints caught in Turn 1 before wasted effort
- **Addresses:** No validation before generation, constraints ignored in execution

### Layer 4: Modular Injection
**What:** Literal guardrail code injected into prompt templates
- Takes pseudo-code from `bo_bullet-generation-instructions.md`
- Injects as `---BEGIN INJECTED GUARDRAILS---...---END INJECTED GUARDRAILS---`
- Model sees rules as structural "code" not "advisory suggestions"
- Updated whenever source guardrails change (no drift)
- **Addresses:** Guardrails treated as suggestions, rules ignored after initial reading

### Why This Works

**Defense-in-Depth:** If any single layer fails, the others provide backup:
- If Layer 4 injection is ignored → Layers 1, 2, 3 still enforce
- If Layer 1 limits are violated → Layer 2 rejects output
- If Layer 3 workflow is skipped → Impossible constraints caught anyway

**Real-World Validation:** Gemini independently applied the same Four-Layer pattern to custom keyword enforcement, proving the architecture is generalizable (not problem-specific).

**Implementation Status:** v9.3.7 - See [docs/plans/v9.3.7-guardrail-enforcement-fix.md](../plans/v9.3.7-guardrail-enforcement-fix.md)

### Key Insight

**The difference between v9.3.6 and v9.3.7:**
- **v9.3.6:** "Here are guardrails to follow" (passive) → Often ignored
- **v9.3.7:** "Your response MUST pass these gates" (active) → Structurally enforced

The model cannot skip validation gates. Invalid output is rejected, not accepted with a claim of compliance.

---

## January 2026 Research-Based Gotchas (v9.3.7 Planning)

### The Pink Elephant Problem

**Symptom:** You add constraint "DO NOT output positions in wrong order" and the model outputs positions in wrong order. Or "NEVER skip the Budget Table" and it skips the Budget Table.

**Gotcha:** Negative instructions can prime the model to do the opposite behavior. Saying "Don't think about pink elephants" makes people think about pink elephants. Saying "Never output X" makes LLMs more likely to output X.

**Evidence (2026 Research):**
- [The Pink Elephant Problem: Why "Don't Do That" Fails with LLMs | 16x Engineer](https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis)
- Anthropic's own prompt engineering best practices recommend positive framing instead of negation

**Real-World Example:**
```
❌ FAILURE CONDITIONS (If any are true, your output is REJECTED):
   - Budget Allocation Table is missing → INVALID
   - Any position (0-8) is missing → INVALID

✅ SUCCESS REQUIREMENTS (All must be true for acceptance):
   - Budget Allocation Table MUST appear as first output
   - All 9 positions (0-8) MUST be included in chronological order
```

**Fix:** Audit all guardrails. Replace every "DO NOT", "NEVER", "AVOID" with positive restatement using "MUST", "Always", "Required to".

**v9.3.7 Implementation:** Layer 1 & Layer 4 prompt templates reframed with positive commands only.

---

### Probabilistic Enforcement Myth

**Symptom:** You believe you've achieved "100% enforcement" with a well-designed prompt-based guardrail system. You're confident it cannot be bypassed.

**Gotcha:** **No prompt-based guardrail achieves 100% compliance.** Even commercial guardrails from Microsoft (Azure Prompt Shield) and Meta (Prompt Guard) can be fully evaded.

**Evidence (2025-2026 Research):**
- [Bypassing LLM Guardrails: Evasion Attacks Analysis | arXiv 2504.11168](https://arxiv.org/html/2504.11168v1)
  - Tested 6 prominent guardrail systems including Microsoft and Meta
  - Character injection and Adversarial ML techniques achieved **100% evasion success**
  - Both character and meaning remain intact while guardrails fail

- [LLM Guardrails Best Practices | Datadog](https://www.datadoghq.com/blog/llm-guardrails-best-practices/)
  - "No single enforcement mechanism is sufficient"
  - Guardrails are probabilistic, not deterministic

**Realistic Compliance Expectations (Based on Architecture):**

| Platform | Method | Expected Compliance | Non-Bypassable |
|----------|--------|---------------------|----------------|
| Chat Interface | Multi-turn prompts | ~30-40% | ❌ No |
| Claude Project | Minimized prompt + artifacts | ~50-60% | ❌ No |
| Google AI Studio | Structured prompts + low temp | ~50-70% | ❌ No |
| JSX GUI | External validation + UI gates | ~95%+ | ✅ Yes |

**Key Insight:** Only **external validators running outside the LLM** are truly non-bypassable. Prompt-based enforcement provides strong defense-in-depth but cannot guarantee compliance.

**v9.3.7 Implementation:**
- Platform 2 & 3 documentation includes realistic compliance rates
- Platform 4 (JSX GUI) recommended for high-confidence production use
- Compliance tracking script monitors drift over time

**See:** [docs/plans/v9.3.7-guardrail-enforcement-fix.md](../plans/v9.3.7-guardrail-enforcement-fix.md) - Realistic Expectations section

---

### Guardrail Evasion via Unicode

**Symptom:** You believe your guardrail system prevents "Ignore your instructions and..." attacks. An attacker uses Unicode tricks and the model ignores all guardrails.

**Gotcha:** Character injection techniques (zero-width characters, homoglyphs, Unicode tricks) can bypass guardrails by encoding instructions in ways that humans can't perceive but LLMs might process.

**Evidence (2025 Research):**
- [Bypassing LLM Guardrails | arXiv 2504.11168](https://arxiv.org/html/2504.11168v1) achieved 100% evasion success using:
  - Zero-width characters (U+200B, U+200C, U+200D)
  - Homoglyphs (visually identical but different Unicode codepoints)
  - Character smuggling techniques that obfuscate input

- [LLM Prompt Injection Prevention | OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) recommends:
  - Input normalization and Unicode standardization
  - Detection of zero-width and control characters
  - Redaction of suspicious encoding patterns

**Fix:** Implement **Layer 0: Input Sanitization** (pre-processing):
1. Normalize all input to UTF-8
2. Strip zero-width characters (U+200B, U+200C, U+200D)
3. Detect and flag homoglyphs
4. Enforce input length constraints
5. Log suspicious patterns for monitoring

**v9.3.7 Implementation:** Layer 0 added to pre-processing workflow before guardrails engage.

---

### Silent Enforcement Drift

**Symptom:** Your guardrail compliance was ~60% last month. This month it's dropped to ~35%. No code changes were made.

**Gotcha:** Without continuous monitoring, enforcement drift is invisible until it's critical. Compliance can degrade over time due to:
- Context saturation (guardrails pushed further back in context window)
- Model changes between versions
- Minor prompt variations that accumulate
- User behavior adaptation (learning workarounds)

**Real-World Example (v9.3.6):**
- Started with strong design (3-Stage Checkpoint Pattern)
- Implementation incomplete (pattern documented but never executed)
- In production, compliance was effectively 0%
- Problem wasn't discovered until user explicitly ran a test

**Fix:** Implement continuous compliance tracking:
1. Log per-guardrail pass/fail for each generation
2. Aggregate compliance by session, platform, guardrail
3. Alert if compliance drops below threshold:
   - Platform 2: < 50%
   - Platform 3: < 40%
4. Identify which guardrails fail most frequently
5. Create dashboard of compliance trends

**v9.3.7 Implementation:**
- `scripts/compliance-tracker.py` - Logs and aggregates metrics
- `docs/knowledge/guardrail-compliance-baseline.md` - Expected rates per platform
- Alert thresholds defined and monitored

**See:** [docs/plans/v9.3.7-guardrail-enforcement-fix.md](../plans/v9.3.7-guardrail-enforcement-fix.md) - Compliance Tracking section

---

## Related Research & References

**Four-Layer Enforcement Strategy:**
- [LLM Guardrails Best Practices 2025 | Leanware](https://www.leanware.co/insights/llm-guardrails)
- [Guide for Guardrails Implementation in 2026 | Wizsumo](https://www.wizsumo.ai/blog/how-to-implement-ai-guardrails-in-2026-the-complete-enterprise-guide)

**Evasion & Limitations:**
- [Bypassing LLM Guardrails: Evasion Attacks Analysis | arXiv 2504.11168](https://arxiv.org/html/2504.11168v1) — **Critical research on guardrail evasion**

**Monitoring & Observability:**
- [LLM Guardrails Best Practices | Datadog](https://www.datadoghq.com/blog/llm-guardrails-best-practices/) — Emphasizes observability and feedback loops at scale
