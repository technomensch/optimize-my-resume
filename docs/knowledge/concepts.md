# Core Concepts

**Last Updated:** 2026-01-28
**Entries:** 15

---

## Quick Navigation

- [Memory Systems](#memory-systems) - Four-pillar knowledge capture architecture
- [Global vs. Project-Local](#global-vs-project-local) - Resource scoping patterns
- [Dual-Format Documentation](#dual-format-documentation) - LLM + human optimization
- [Surgical Updates](#surgical-updates) - Content preservation pattern
- [Template-Driven Consistency](#template-driven-consistency) - Standardization approach
- [Categorization](#categorization) - Knowledge organization strategy
- [Cross-Referencing](#cross-referencing) - Bidirectional linking system
- [Startup-Only Loading](#startup-only-loading) - Resource initialization timing
- [Automation Strategy](#automation-strategy) - Manual triggers vs. automatic execution
- [Shadow Modularization](#shadow-modularization) - Integrity vs. optimization balance
- [Action Verb Categories](#action-verb-categories) - 5-part classification framework
- [Portfolio Employment Safety](#portfolio-employment-safety) - Distinguishing W2 from projects
- [Chronology Depth Control](#chronology-depth-control) - Balancing recency and significance
- [Fit-Score Gating](#fit-score-gating) - Conditional feature presentation pattern
- [Custom Keyword Hub](#custom-keyword-hub) - Centralized skill management logic
- [Synthetic Metric Attribution](#synthetic-metric-attribution) - Value-driven metrics for solo portfolio projects

---

## Documentation Philosophy

### Memory Systems

**Category:** Concept
**Tags:** #architecture #memory #knowledge-management

#### Quick Summary

The optimize-my-resume project uses a four-pillar memory system to capture and retrieve knowledge across Claude Code sessions.

#### Details

**Four Pillars:**
1. **Lessons Learned** - Detailed problem-solving journeys categorized by type
2. **Architecture Decision Records (ADRs)** - Formal decision documentation
3. **Knowledge Graph** - Quick-reference concepts, patterns, and gotchas
4. **Session Summaries** - Auto-documented work context

#### Common Use Cases

- Finding solutions to previously-solved problems
- Understanding why decisions were made
- Quick reference during active development
- Onboarding new contributors

#### Cross-References

- **ADR:** [005-memory-system-architecture.md](../decisions/005-memory-system-architecture.md) (to be created)
- **Sessions:** [2026-01/2026-01-02_memory-system-design.md](../sessions/2026-01/2026-01-02_memory-system-design.md) (to be created)
- **Related:** [[patterns.md#knowledge-organization]]

---

## Architecture Concepts

### Global vs. Project-Local

**Category:** Concept
**Tags:** #architecture #scoping #claude-code #skills

#### Quick Summary

Resources can exist at global (user-level) or project-local (repository) scope. Understanding the distinction prevents confusion about where files should be placed and how they're accessed.

#### Details

**Global Resources (`~/.claude/commands/`):**
- Available across all projects
- User-level configuration
- Installation required per machine
- Example: Skills in Claude Code

**Project-Local Resources (`.claude/skills/`):**
- Versioned with repository
- Project-specific
- Available on git clone
- Example: Reference copies of skills

#### Key Insight

Claude Code skills are **global-only** for execution, but **project-local** copies serve as reference/documentation.

#### Cross-References

- **ADR:** [ADR-002: Skills Global-Only](../decisions/ADR-002-skills-global-only.md)
- **Lesson:** [Skills Architecture](../lessons-learned/architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)
- **Related:** [[patterns.md#hybrid-global-project-pattern]]

---

### Dual-Format Documentation

**Category:** Concept
**Tags:** #documentation #llm #markdown #xml

#### Quick Summary

Maintain separate formats optimized for different audiences: `.txt` with XML for LLM parsing, `.md` with Markdown for human reading.

#### Details

**When to use each:**

**`.txt` (XML):**
- Context engineering documents
- Agent system prompts
- Complex structured content requiring validation
- Primary audience: LLMs

**`.md` (Markdown):**
- Lessons learned, ADRs, guides
- README files, documentation
- Human-first content
- Primary audience: Developers

#### Key Insight

Don't compromise on either audience - optimize each format for its consumer. Accept the maintenance cost for critical documents.

#### Cross-References

- **ADR:** [ADR-001: Dual-Format Strategy](../decisions/ADR-001-dual-format-documentation.md)
- **Lesson:** [Memory System Phase 1](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

### Surgical Updates

**Category:** Concept
**Tags:** #pattern #updates #preservation #content-management

#### Quick Summary

Make targeted, explicit changes to existing content rather than full rewrites. Preserves carefully crafted details, metrics, and phrasing.

#### Details

**Principles:**
- ✅ Add new content to existing sections
- ✅ Enhance existing bullet points
- ✅ Update specific metrics
- ❌ Don't rewrite entire sections
- ❌ Don't lose existing detail

**Validation:**
- Should preserve 80%+ of content
- Track additions/modifications/removals
- Verify no metrics lost

#### Key Insight

LLMs default to full rewrites. Explicit constraints enforce surgical behavior and protect quality content.

#### Cross-References

- **ADR:** [ADR-003: Surgical Updates Pattern](../decisions/ADR-003-surgical-updates-pattern.md)
- **Lesson:** [ID-Based Architecture](../lessons-learned/architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)
- **Skill:** `/update-history`

---

### Shadow Modularization

**Category:** Concept
**Tags:** #architecture #optimization #system-design

#### Quick Summary

A strategy where the core "Gold Master" file remains monolithic to preserve context integrity, while user-facing entry points are modularized to save tokens.

#### Details

**The Conflict:**
- **Monolith:** High integrity, high token cost.
- **Micro-modules:** Low token cost, high fragmentation risk.

**The Solution:**
- Keep `PROJECT-INSTRUCTIONS.md` (System) monolithic.
- Use `<!-- SILENT SYNC -->` markers to define logical boundaries within it.
- Modularize `Project-GUI-Instructions.md` (User) by extracting those same sections to referenced files.
- Result: System sees the whole truth; User pays for only what they need.

#### Key Insight

Optimization should not come at the cost of system coherence. "Shadow" the modules within the master rather than replacing them.

#### Cross-References

- **ADR:** [ADR-004: Shadow Modularization](../decisions/ADR-004-shadow-modularization.md)
- **Pattern:** [[patterns.md#silent-sync]]

---

### Action Verb Categories

**Category:** Concept
**Tags:** #resume-writing #nlp #classification #standardization

#### Quick Summary

A strict 5-category framework for classifying resume action verbs to ensure diversity and impact.

#### Details

**The 5 Categories:**
1.  **Built (Blue) 🔵**: Creation, construction, establishing new systems.
2.  **Lead (Yellow) 🟡**: Driving initiatives, guiding teams, championing efforts.
3.  **Managed (Purple) 🟣**: Oversight, resource coordination, operations.
4.  **Improved (Green) 🟢**: Optimization, enhancement, measured gain.
5.  **Collaborate (Pink) 🩷**: Partnership, cross-functional work.

**Rules:**
- **Distribution:** Target 20% per category (13-27% acceptable).
- **Flagging:** Any category < 5% is a defect.
- **Diversity:** No category may repeat within a single position (unless >5 bullets).

#### Key Insight

Forcing verb diversity avoids "one-note" resumes (e.g., only "Managed" or only "Built") and demonstrates a complete leadership profile.

#### Cross-References

- **See:** [Implementation](../../core/verb-categories.md)
- **Pattern:** [[patterns.md#metric-preservation-guardrail]] (often paired)

---

### Portfolio Employment Safety

**Category:** Concept
**Tags:** #safety #background-checks #portfolio #labeling

#### Quick Summary

Distinguishing between independent portfolio projects and W2 employment to prevent legal/ethical misrepresentation during background checks.

#### Details

**The Risk:**
Naming a portfolio project with a company-like header (e.g., "Resume Optimizer at GitHub") implies a formal employment relationship. If a background check service (e.g., The Work Number) shows no record, the candidate may be disqualified for "misrepresentation."

**The Solution:**
Explicitly label all non-W2 projects with a standard suffix.
- **Standard Label:** `(Independent Project)` or `(Portfolio Project)`.
- **Target Location:** Position 0 or any non-employer achievement section.

#### Key Insight

Accuracy in *nature of employment* is as critical as accuracy in *technical achievements*.

#### Cross-References

- **ADR:** To be created.
- **Plan:** [v8.3.1 Plan](../plans/v8.3.1-bullet-generation-improvements.md)
- **Rule:** `portfolio_employment_labeling`

---

### Chronology Depth Control

**Category:** Concept
**Tags:** #resume-writing #chronology #logic #curation

#### Quick Summary

A logic-based approach to determining resume record depth, balancing the "standard" 10-year rule with high-tenure significance.

#### Details

**The "Fade Out" Rules:**
1.  **Recency Threshold (6 years):** Positions ending within the last 6 years warrant full, high-impact bullet generation (3-5 bullets).
2.  **Tenure Exception (5+ years):** Older positions represent a "Significant Career Chunk" if the tenure was long. They warrant standard bullets (2-3) regardless of age.
3.  **Ancient History:** Positions older than 10 years with short tenure should be summarized or listed without bullets to save space for modern skills.

#### Key Insight

Resume depth is a function of *Impact * Recency*, not just a static calendar cutoff.

#### Cross-References

- **Plan:** [v8.3.1 Plan](../plans/v8.3.1-bullet-generation-improvements.md)
- **Rule:** `chronology_depth_logic`

---

## Technical/Logic Concepts

### Fit-Score Gating

**Category:** Logic
**Tags:** #ux #tokens #decision-logic #thresholds

#### Quick Summary

Restricting access to token-intensive or high-compute operations until a minimum confidence threshold is met.

#### Details

**The Constraint:**
Generating customized bullets and summaries costs ~3,000 to 5,000 additional tokens. It is statistically futile to optimize a resume for a job where the base experience match is low.

**The Solution:**
Implement a gating threshold (e.g., 50% Fit Score):
- **>= 50%:** Offer "Optimize Your Application" tools.
- **< 50%:** Show "Match Low" warning and suggest better-fit roles instead.

#### Key Insight

User friction can be a feature when it prevents wasted resources and false hope.

#### Cross-References

- **Decision:** [Ask User Before Generating Summary](../sessions/2026-01/session-summary-2026-01-18_16-52.md#decision-1)
- **Module:** [RA Quality Gates](../../optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md)

---

### Custom Keyword Hub

**Category:** Concept
**Tags:** #ui #data-integrity #keywords #user-intent

#### Quick Summary

A centralized state management pattern for user-defined keyword priorities that overrides JD-only extraction.

#### Details

**Three-List Logic:**
1.  **EXTRACTED:** Keywords the AI found in the JD (Default state).
2.  **USE (Prioritize):** Keywords the user explicitly wants emphasized.
3.  **IGNORE (Exclude):** Keywords the user wants suppressed (e.g., irrelevant tech).

**Authenticity Loop:**
Custom keywords added by the user must be cross-referenced against the `tools_technologies` and `key_achievements` in the job history before being "Verified."

#### Key Insight

The user knows their "hidden" experience better than the resume; the Hub allows them to bring it forward safely.

#### Cross-References

- **Plan:** [v9.0.0 Keyword Management](../plans/v9.0.0-keyword-management.md)
- **Concept:** [[concepts.md#keyword-evidence]]
- **Rule:** [Guardrail #32](../../PROJECT-INSTRUCTIONS.md#guardrail-32)

---

## Organization Concepts

### Template-Driven Consistency

**Category:** Concept
**Tags:** #templates #standardization #quality

#### Quick Summary

Use standardized templates for recurring document types to ensure uniform structure, completeness, and quality.

#### Details

**Template Types:**
- Lessons learned template
- ADR template
- Session summary template
- Knowledge entry template

**Benefits:**
- Enforces completeness (no missing sections)
- Reduces cognitive load (familiar structure)
- Improves searchability (consistent formatting)
- Accelerates creation (fill-in-the-blank)

#### Key Insight

Templates don't constrain creativity - they ensure minimum quality bar while allowing customization.

#### Cross-References

- **Templates:** [../decisions/template.md](../decisions/template.md), [../sessions/template.md](../sessions/template.md)
- **Lesson:** [Memory System Phase 1](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

### Categorization

**Category:** Concept
**Tags:** #organization #taxonomy #discoverability

#### Quick Summary

Organize content into categories (architecture, debugging, process, patterns) for better navigation and discovery.

#### Details

**Category Strategy:**
- **Architecture:** Design decisions, patterns, structural choices
- **Debugging:** Troubleshooting, bug investigations, error resolution
- **Process:** Workflows, SOPs, development practices
- **Patterns:** Reusable solutions, templates, repeatable approaches

**Auto-Detection:**
Keywords in topic/description map to categories automatically (see `/lesson-learned` v1.2).

#### Key Insight

Multiple discovery paths (category, tag, chronological) beat single hierarchy.

#### Cross-References

- **Implementation:** [Lessons Learned README](../lessons-learned/README.md)
- **Category READMEs:** [architecture/](../lessons-learned/architecture/), [process/](../lessons-learned/process/), etc.

---

### Cross-Referencing

**Category:** Concept
**Tags:** #linking #navigation #relationships

#### Quick Summary

Bidirectional links between related documents (lessons ↔ ADRs ↔ sessions ↔ knowledge) create a knowledge graph.

#### Details

**Link Types:**
- Lessons reference ADRs that formalize their decisions
- ADRs reference lessons that motivated them
- Sessions link to artifacts created
- Knowledge entries point to detailed lessons

**Notation:**
- `ADR-NNN`: Architecture Decision Record
- `L-YYYY-MM-DD`: Lesson Learned
- `S-YYYY-MM-DD`: Session Summary
- `[[concept]]`: Knowledge Graph entry

#### Key Insight

Cross-references transform isolated documents into an interconnected knowledge system.

#### Cross-References

- **Example:** See any ADR's "Related" section
- **Lesson:** [Memory System Phase 1](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

## Technical Concepts

### Startup-Only Loading

**Category:** Concept
**Tags:** #claude-code #loading #timing #behavior

#### Quick Summary

Claude Code loads skills at application startup only, not dynamically during runtime. Changes require restart.

#### Details

**Loading Behavior:**
- ✅ Skills present at startup load immediately
- ❌ Skills added during session don't load
- ❌ Modified skills use old version until restart
- ✅ Restart loads new/modified skills

**Workflow Impact:**
```bash
# After adding/modifying skills:
1. Save to ~/.claude/commands/
2. Restart Claude Code
3. Test skill
```

#### Key Insight

Understanding temporal behavior (when things load) is as important as functional behavior (how things work).

#### Cross-References

- **Lesson:** [Skills Not Loading Until Restart](../lessons-learned/debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)
- **Related:** [Global vs. Project-Local](#global-vs-project-local)

---

## Workflow Concepts

### Automation Strategy

**Category:** Concept
**Tags:** #automation #workflow #triggers #skills #manual-vs-automatic

#### Quick Summary

The memory system automates capture *execution* when skills are invoked, but requires manual *triggering*. Skills don't auto-detect when documentation is needed—users must recognize capture-worthy moments.

#### Details

**What's Automatic (Skills-Based):**

When you invoke a skill, it automates:
- **`/lesson-learned`:** Auto-categorizes, updates indexes, commits with standard message
- **`/session-summary`:** Auto-detects session type, extracts key artifacts, organizes by date
- **`/recall`:** Auto-searches across all memory systems, formats results

**What's Manual (Requires User Trigger):**

You must decide WHEN to invoke skills:
- Recognizing a problem is worth documenting
- Knowing when to create an ADR vs. lesson
- Triggering `/session-summary` before context limits
- Updating knowledge graph entries manually
- Creating cross-references between documents

**Current State:**
```
┌─────────────────┐
│ User recognizes │ ← MANUAL DECISION
│ capture moment  │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ Invoke │
    │ skill  │ ← MANUAL TRIGGER
    └───┬────┘
        │
        ▼
┌───────────────┐
│ Skill handles │ ← AUTOMATIC EXECUTION
│ everything    │   (categorize, index, commit)
└───────────────┘
```

**Why Manual Triggers:**

1. **Context awareness:** Only humans know if a solution is novel or routine
2. **Quality control:** Not every commit deserves a lesson learned
3. **Judgment calls:** Deciding between ADR, lesson, or knowledge entry requires understanding
4. **Cognitive load:** Auto-triggering could create documentation fatigue

**Future Automation Possibilities:**

*Not currently implemented, but could be added:*

- **Smart triggers:** Detect patterns suggesting documentation (e.g., long debugging session, significant refactor)
- **Context-based suggestions:** "You're at 180K tokens—run `/session-summary`?"
- **Commit hooks:** After significant commits, suggest `/lesson-learned`
- **Cross-reference detection:** Auto-link related ADRs/lessons based on content analysis
- **Proactive reminders:** "No lessons captured in 2 weeks—anything worth documenting?"

#### Key Insight

The system is **semi-automatic**: it removes the *tedium* of documentation (formatting, indexing, committing) but preserves the *judgment* of what to document. This balance prevents both under-documentation (manual tedium) and over-documentation (noisy auto-capture).

#### Cross-References

- **Lesson:** [Complete Memory System](../lessons-learned/patterns/Lessons_Learned_Complete_Memory_System_v6.3.0_Implementation.md)
- **Skills:** `/lesson-learned`, `/session-summary`, `/recall`
- **Workflow:** [Memory System Workflow](workflows.md#memory-system-workflow)

---

**Maintenance:** Update as new core concepts emerge from lessons and ADRs
**Created:** 2026-01-02
