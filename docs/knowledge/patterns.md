# Design Patterns Catalog

**Last Updated:** 2026-01-19
**Entries:** 15

---

## Quick Navigation

- [Dual-Format Strategy](#dual-format-strategy) - Optimize for both LLM and human audiences
- [Surgical Updates](#surgical-updates) - Preserve content while enhancing
- [Hybrid Global-Project](#hybrid-global-project) - Execution vs. documentation separation
- [Template-Driven Docs](#template-driven-docs) - Standardized document creation
- [Four-Pillar Memory](#four-pillar-memory) - Multi-system knowledge capture
- [Category Auto-Detection](#category-auto-detection) - Keyword-based organization
- [Shadow Sync Protocol](#shadow-sync-protocol) - Three-tier modular synchronization
- [Silent Sync](#silent-sync) - Preserving gold master integrity
- [Metric Preservation Guardrail](#metric-preservation-guardrail) - Data integrity audit
- [Value-Driven User Stories](#value-driven-user-stories) - Benefit-focused requirements
- [Causal Impact Linking](#causal-impact-linking) - Syntactic action-to-metric mapping
- [Governance Lifecycle](#governance-lifecycle) - Enforced project management flow
- [Interactive Tag Toggling](#interactive-tag-toggling) - Manual metadata curation UI
- [Two-Step Verification](#two-step-verification) - Safety pattern for unverified claims
- [Lightweight Integration](#lightweight-integration) - Authenticity preservation for low-evidence claims

---

## Documentation Patterns

### Dual-Format Strategy

**Problem:** Content needs to serve both LLM parsing and human reading
**Solution:** Maintain `.txt` (XML) for LLMs and `.md` (Markdown) for humans
**When to use:** Context engineering docs, agent prompts, technical specifications

**Quick Reference:**
- `.txt` with XML → LLM consumption, strict structure
- `.md` with Markdown → Human reading, rich formatting
- Accept maintenance cost for critical documents

**See:** [ADR-001](../decisions/ADR-001-dual-format-documentation.md)

---

### Surgical Updates

**Problem:** Full rewrites lose carefully crafted content and metrics
**Solution:** Make targeted, explicit changes preserving 80%+ of existing content
**When to use:** Job histories, resumes, documentation with established quality

**Quick Reference:**
- ✅ Add new sections, enhance existing, update specific metrics
- ❌ Rewrite entire sections, remove content without reason
- Validate preservation rate after updates

**See:** [ADR-003](../decisions/ADR-003-surgical-updates-pattern.md)

---

### Hybrid Global-Project

**Problem:** Resources need both user-level execution and project-level version control
**Solution:** Install in global directory for execution, keep reference copy in project
**When to use:** Claude Code skills, configuration that's user-specific but project-documented

**Quick Reference:**
```
~/.claude/commands/     ← Execution (global)
.claude/skills/         ← Reference (project)
```

**See:** [ADR-002](../decisions/ADR-002-skills-global-only.md)

---

### Template-Driven Docs

**Problem:** Inconsistent structure and missing sections in documentation
**Solution:** Standard templates for ADRs, lessons, sessions, knowledge entries
**When to use:** Any recurring document type requiring consistent structure

**Quick Reference:**
- Reduces cognitive load (familiar structure)
- Ensures completeness (no missing sections)
- Accelerates creation (fill-in-the-blank)
- Templates: `docs/*/template.md`

**See:** [Memory System Lesson](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

### Shadow Sync Protocol

**Problem:** Updating modular files in isolation risks incomplete synchronization across different interfaces
**Solution:** Verify three-tier synchronization is complete: Module ↔ Gold Master ↔ Optimized Entrypoint (works in any direction)
**When to use:** Before committing changes to `optimization-tools/`, `PROJECT-INSTRUCTIONS.md`, or `Project-GUI-Instructions.md`

**Quick Reference:**
- **Module** (`optimization-tools/*/`): Source of truth, authoritative rules
- **Gold Master** (`PROJECT-INSTRUCTIONS.md`): Complete synchronized copy (used by Claude Artifacts)
- **Optimized Entrypoint** (`Project-GUI-Instructions.md`): Token-efficient version with modular references

**Verification Checklist (works regardless of which tier was edited first):**
1. Identify which file(s) changed (MODULAR, GOLD MASTER, or OPTIMIZED ENTRYPOINT)
2. Verify MODULE and GOLD MASTER have identical rule logic
3. Verify OPTIMIZED ENTRYPOINT correctly references or mirrors GOLD MASTER
4. Search for ALL terminology variations (exact, lowercase, snake_case, camelCase) across all three tiers
5. Test with ACTUAL interface (not just assumption) to confirm changes propagate

**Why It Matters:**
- Different interfaces read from different prompt sources
- Claude Artifacts uses PROJECT-INSTRUCTIONS.md (Gold Master)
- Local dev uses inline prompts in .jsx files
- Incomplete sync across tiers causes user-visible bugs
- **v8.5.2 Example:** Updated .jsx files but missed PROJECT-INSTRUCTIONS.md → Claude Artifacts still showed old output

**Run verification:** `/enforce-shadow-sync`

**Learn More:** [Shadow Sync Protocol Lesson (v8.5.3)](../lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md)

---

### Silent Sync

**Problem:** Modularizing core instructions risks breaking the "Gold Master" source of truth
**Solution:** Keep core logic in Gold Master but wrap in comments; references mirror this structure
**When to use:** Optimizing entry points (GUI) without fragmenting the core system (System Prompt)

**Quick Reference:**
- `PROJECT-INSTRUCTIONS.md`: Wrap logic in `<!-- SILENT SYNC: [Name] -->`
- `Project-GUI-Instructions.md`: Replace logic with `<modular_reference>`
- Explicitly link them in documentation
- Preserves integrity while saving tokens for users

**See:** [ADR-004](../decisions/ADR-004-shadow-modularization.md)

**Related:** [Shadow Sync Protocol](#shadow-sync-protocol) - The verification framework for Silent Sync implementation

---

## Workflow Patterns

### Four-Pillar Memory

**Problem:** Knowledge loss across Claude Code sessions
**Solution:** Four complementary systems for different knowledge types
**When to use:** Any project requiring persistent knowledge across sessions

**Quick Reference:**
1. **Lessons Learned** - Detailed problem-solving journeys (narrative)
2. **ADRs** - Formal architectural decisions (structured)
3. **Knowledge Graph** - Quick-reference concepts/patterns (scannable)
4. **Session Summaries** - Work context before limits (historical)

**See:** [Memory System Lesson](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

### Category Auto-Detection

**Problem:** Manual categorization is tedious and error-prone
**Solution:** Keyword-based mapping with user confirmation
**When to use:** Creating lessons learned, organizing content

**Quick Reference:**
```
Keywords → Category:
"architecture", "design" → architecture/
"bug", "debug", "error" → debugging/
"workflow", "process"   → process/
"pattern", "template"   → patterns/
```

**See:** `/lesson-learned` skill v1.2

---

### Multi-Model Testing Strategy

**Problem:** Single models have blind spots in self-correction.
**Solution:** Use one model (Sonnet) to generate test cases and another (Opus) to expand/execute instructions.
**When to use:** Complex testing scenarios requiring diverse perspectives, or when a model is stuck in a loop.

**Quick Reference:**
- **Analyst Model (Sonnet):** Generates broad, creative test cases and edge cases.
- **Executor Model (Opus):** Expands cases into detailed steps and executes them.
- **Benefit:** Reduces "lazy" testing where the model validates its own bias.

**See:** [Refining Test Case Strategy Session](../sessions/2025-12/2025-12-29_refining-test-case-strategy.md)

---

## Code Patterns

### ID-Based Architecture

**Problem:** Token bloat from repeating full content
**Solution:** Reference entities by ID, store full content once
**When to use:** AI pipelines with repeated data structures

**Quick Reference:**
- Assign unique IDs to entities
- Reference by ID in subsequent mentions
- Reduces token usage, eliminates redundancy
- Maintains relational integrity

**See:** [ID-Based Architecture Lesson](../lessons-learned/architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)

---

### Metric Preservation Guardrail

**Problem:** AI optimization often accidentally removes specific numbers/metrics
**Solution:** Mandatory "Data Integrity Audit" before finalizing any edit
**When to use:** Rewriting bullets, summarizing text, any optimization task

**Quick Reference:**
1. Extract all numbers from original text
2. Extract all numbers from new draft
3. If any missing → STOP and restore
4. Zero tolerance for data loss

**See:** `metric_preservation_guardrail` in [PROJECT-INSTRUCTIONS.md](../../PROJECT-INSTRUCTIONS.md)

---

### Value-Driven User Stories

**Problem:** Task-oriented stories ("System parses PDF") fail to capture *why* feature matters
**Solution:** Rename stories to emphasize the value proposition
**When to use:** Requirements documentation, product planning

**Quick Reference:**
- **Bad:** "PDF Parsing" (Technical task)
- **Good:** "PDF Document Ingestion" (Capability)
- **Bad:** "Check Requirements" (Action)
- **Good:** "Qualification Gap Analysis" (Value to user)
- **Pattern:** [Noun] [Capability/Outcome] rather than [Verb] [Object]

**See:** [Requirements Document](../../docs/requirements/requirements.md)

---

### Causal Impact Linking

**Problem:** Bullets often state qualitative achievements without explicitly linking them to available hard metrics.
**Solution:** Synthesis of [Action Verb] + [Object/Task] + [Causal Connector] + [Hard Metric Impact].
**When to use:** Resume bullet optimization, performance reporting.

**Quick Reference:**
- Use causal connectors: "...resulting in...", "...enabling...", "...cutting time by..."
- Never stop at the qualitative claim if data exists.
- Forces "so-what" clarity for hiring managers.

**See:** `causal_impact_linking` in [v8.3.1 Plan](../plans/v8.3.1-bullet-generation-improvements.md)

---

### Governance Lifecycle

**Problem:** Technical execution often drifts from project management visibility (missing issues, untracked branches).
**Solution:** A mandatory 4-step sequence (Issue -> Branch -> Roadmap -> Plan) BEFORE coding.
**When to use:** All feature development, patches, and architectural changes.

**Quick Reference:**
1. `gh issue create` (Establish ID)
2. `git checkout -b` (Establish locality)
3. Update `ROADMAP.md`/`CHANGELOG.md` (Establish history)
4. Save plan to `docs/plans/` (Establish intent)

**See:** [Guardrail #31](../../PROJECT-INSTRUCTIONS.md)

---

## Interaction Patterns

### Interactive Tag Toggling

**Problem:** Users need to curate large sets of tags (keywords/skills) quickly without complex drag-and-drop or form fields.
**Solution:** Two-column layout with click-to-transfer behavior between "Active" and "Inactive" states.
**When to use:** Skill management, keyword selection, label assignment.

**Quick Reference:**
- **Green (Active):** High priority, included in generation.
- **Gray (Inactive):** Suppressed/Ignored.
- **Action:** Single click toggles state.
- **Benefit:** Fast curation for mobile and desktop; clear visual state.

**See:** [Should-I-Apply v1.2.0 Development](../sessions/2026-01/session-summary-2026-01-18_16-52.md#decision-3)

---

### Two-Step Verification (Safety)

**Problem:** Users might unknowingly bridge a gap with an unverified claim, risking interview "gotchas."
**Solution:** Background validation followed by an explicit modal confirmation for any "unverified" data.
**When to use:** Custom keyword additions, metric overrides, liability-sensitive claims.

**Quick Reference:**
1.  **AI Check:** Search history for evidence.
2.  **Visual Flag:** Show "Unverified" status (Yellow).
3.  **The Modal:** If unverified items are selected, trigger: "I couldn't verify [X]. Proceeding may make your resume indefensible. Use anyway?"

**See:** [v9.0.0 Keyword Management Roadmap](../ROADMAP.md)

---

### Lightweight Integration

**Problem:** How to include a user-requested skill that isn't backed by job history achievements.
**Solution:** Mention the skill as a capability or exposure rather than as a quantified achievement.
**When to use:** Unverified keywords confirmed by the user.

**Quick Reference:**
- **Full Integration:** "Built [System] using [Tool] achieving [Metric]."
- **Lightweight:** "Leveraged exposure to [Tool] to support [Workflow]."
- **Benefit:** Respects user intent without hallucinating specific wins.

**See:** [Lesson: Light Integration vs Full Integration](../sessions/2026-01/session-summary-2026-01-18_16-52.md#lesson-4)

---

### Functional Directory Structure

**Problem:** Generic named directories (e.g., "shared") obscure intent and lead to dumping ground behavior.
**Solution:** Name directories by their functional phase or role in the pipeline (e.g., "phases").
**When to use:** Refactoring project structure for clarity.

**Quick Reference:**
- **Bad:** `/shared/` (ambiguous, mixed concerns)
- **Good:** `/phases/` (explicit functional role)
- **Rule:** If you have to ask "what goes here?", the name is wrong.

**See:** [Restructuring Project Directories Session](../sessions/2025-12/2025-12-29_restructuring-project-directories.md)

---

## Usage Patterns

### When to Create Each Document Type

**Lesson Learned:**
- After solving non-trivial problem
- When discovering surprising behavior
- To document complex troubleshooting journey
- Template: Narrative, problem → solution → replication

**ADR:**
- Before making significant architectural decision
- To formalize decision from lesson learned
- When choosing between technologies/patterns
- Template: Context → options → decision → consequences

**Knowledge Entry:**
- Extract quick-reference from lessons/ADRs
- Define core concept for project
- Document common gotcha
- Template: Summary → details → cross-refs

**Session Summary:**
- Before context limits (~180K tokens)
- After completing major feature
- At end of debugging session
- Template: Overview → built → decided → learned

---

**Maintenance:** Add new patterns as they emerge from practice
**Created:** 2026-01-02
