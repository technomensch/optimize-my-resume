# Design Patterns Catalog

**Last Updated:** 2026-02-02
**Entries:** 25

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
- [Effective LLM Constraints](#effective-llm-constraints) - Positive constraints and pre-flight checks
- [3-Stage Validation Checkpoint](#3-stage-validation-checkpoint) - Breaking recursive problems into planning, gated generation, and reconciliation
- [Hub-and-Spoke Delegation](#hub-and-spoke-delegation) - Centralized logic for multi-interface synchronization
- [Metric-Only Reporting](#metric-only-reporting) - Hardening validation against AI momentum drift
- [Insolvency Deadlock](#insolvency-deadlock) - Deterministic stopping rules for structural conflicts
- [Identifier Decoupling](#identifier-decoupling) - Mapping local persistence to platform drift
- [Layered Defense Strategy](#layered-defense-strategy) - Multiple redundant enforcement mechanisms per platform
- [Four-Layer Enforcement Strategy](#four-layer-enforcement-strategy) - Structural constraints moving from passive documentation to active validation gates (v9.3.7)
- [Input Sanitization Layer (Layer 0)](#input-sanitization-layer-layer-0) - Unicode normalization and character injection prevention
- [Pipeline Integration Pattern](#pipeline-integration-pattern) - Auto-invoke validators from generators for seamless enforcement
- [Fail-Closed Enforcement](#fail-closed-enforcement) - Structural validation gates before output delivery
- [Compliance Tracking Architecture](#compliance-tracking-architecture) - Layer 5 observability for monitoring enforcement drift
- [Compliance Rate Tracking](#compliance-rate-tracking) - Continuous monitoring to detect enforcement drift over time
- [Positive Constraint Framing](#positive-constraint-framing) - Avoiding Pink Elephant Problem via affirmative commands instead of negation
- [Meta-Issue Tracking Pattern](#meta-issue-tracking-pattern) - Structured documentation for complex, multi-attempt problems (v9.3.8)

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

---

## Prompt Engineering Patterns

### Effective LLM Constraints

**Problem:** Models ignore negative constraints ("Do not do X") and fail to stop on errors.
**Solution:** Use positive constraints, end-of-prompt placement (Recency Effect), and pre-flight checks (Chain-of-Thought).
**When to use:** Defining agent behaviors, critical safety rules, or troubleshooting non-compliance.

**Quick Reference:**
- **Pink Elephant Rule:** Don't say "No code" (negative); say "Analysis only" (positive).
- **Recency Rule:** Place critical "STOP" instructions at the very end of the prompt.
- **Pre-flight Rule:** Force "CHECK: [Status]" output before the model begins work.

**See:** [Effective LLM Constraints Lesson](../lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md)

---

### Metric-Only Reporting (Layer 3 Hardening)

**Problem:** Subjective "Pass/Fail" (vibe-checking) allows the agent to "approve" its own violations due to Completion Bias.
**Solution:** Prohibit Boolean status icons without accompanying raw metrics (e.g., `Actual Count vs Limit`).
**When to use:** Final stage reconciliation tables, budget enforcement audits.

**Quick Reference:**
- **Bad:** `Budget: ✅`
- **Good:** `Budget: 512 words / 500 limit | FAIL`
- **Logic:** If the numbers don't support the status, the audit is a hallucination.

**See:** [Agentic Momentum Lesson](../lessons-learned/process/Lessons_Learned_Agentic_Momentum_Governance.md)

---

### Insolvency Deadlock

**Problem:** Structural constraints (e.g., word count vs. mandatory bullet counts) become mathematically impossible to satisfy.
**Solution:** Implement explicit "Deterministic Stop" rules that force the agent to report the conflict rather than faking a compromise.
**When to use:** Deep-history resume generation (15+ years) or high-density guardrail environments.

**Quick Reference:**
- **Trigger:** If Rule A and Rule B are mutually exclusive in current context.
- **Action:** STOP. State the logical deadlock. Do not attempt "simulation" or "best effort."
- **Policy:** The agent is authorized to fail the task to preserve the integrity of the logic core.

**See:** [Agentic Momentum Lesson](../lessons-learned/process/Lessons_Learned_Agentic_Momentum_Governance.md)

---

### Recency Anchor

**Problem:** In long context windows (4,000+ lines), instructions placed at the start or middle lose attention weight/priority (The "Lost in the Middle" problem).
**Solution:** Place critical terminal instructions or "System Closers" at the absolute end of the prompt, immediately before execution begins.
**When to use:** Mandating specific output formats, terminal grammar checks, or high-priority terminology constraints.

**Quick Reference:**
- Every prompt should have a "Hardened Exit Clause" at the bottom.
- Prevents the agent from "forgetting" the format while processing the bulk content.

**Limitation (Jan 29, 2026):** Recency anchors alone are insufficient. During production testing, all recency anchors were in place but still bypassed. Must combine with human-in-the-loop gates or external validation.

**See:** [ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md](ENFORCEMENT_FAILURE_ANALYSIS_AND_SOLUTIONS.md)

---

### Platform-Specific Enforcement

**Problem:** Documentation-based enforcement fails across all platforms because LLMs can read, understand, and still ignore instructions. Different platforms have different enforcement capabilities.
**Solution:** Match enforcement strategy to platform capabilities, from weakest (chat interfaces) to strongest (programmatic GUIs).
**When to use:** Selecting enforcement approach for any guardrail-dependent workflow.

**Quick Reference:**

| Platform | Enforcement Method | Expected Compliance |
|----------|-------------------|---------------------|
| Chat Interface | Forced multi-turn prompts | ~30-40% |
| Claude Project | Minimized context + artifacts | ~50-60% |
| Google AI Studio | Structured prompts + low temp | ~50-70% |
| JSX GUI | External validation + UI gates | ~95%+ |

**Key Insight:**
- Platforms 1-3 are ALL probabilistic - model CAN still ignore instructions
- Platform 4 (JSX GUI) is the ONLY option with true enforcement
- For production use, invest in programmatic validation

**Evidence (Jan 30, 2026):** All previous documentation-based attempts (template-forcing, recency anchors, 3-stage checkpoints, Claude Projects with full guardrails) were tried and ALL failed.

**See:** [ENFORCEMENT_STRUCTURAL_SOLUTIONS.md](ENFORCEMENT_STRUCTURAL_SOLUTIONS.md#platform-specific-solution-options)

---

### Layered Defense Strategy

**Problem:** Single enforcement mechanisms fail unpredictably. Platform-Specific Enforcement shows compliance ranges (30-95%), but within each platform, single solutions have high variance.
**Solution:** Implement MULTIPLE redundant enforcement mechanisms per platform that build on each other, so failure of one layer doesn't cause complete bypass.
**When to use:** Any guardrail-dependent workflow where compliance must be maximized within platform constraints.

**Quick Reference:**

**The Principle:** Each enforcement layer adds to previous layers, not replaces them:
- Layer 1 fails → Layer 2 catches
- Layers 1+2 fail → Layer 3 catches
- Combined compliance > any single layer

**Platform Layering Examples:**

| Platform | Layer 1 | Layer 2 | Layer 3 | Layer 4 |
|----------|---------|---------|---------|---------|
| Chat Interface | Multi-turn prompts | User verification checklist | Copy-paste validation | Human approval gates |
| Claude Project | Minimized context | Artifact output templates | Pre-generation checklist | Recency anchors |
| Google AI Studio | Low temperature | Structured output | System instruction hardening | Multi-turn structure |
| JSX GUI | UI-level gates | External validation script | State machine workflow | Human approval UI |

**Why Layers > Single Solutions:**
- Single solution at 60% compliance: 40% failure rate
- 3 independent layers at 60% each: ~6.4% failure rate (0.4³)
- Layers aren't fully independent, but combined effect is still significantly better

**Implementation Approach:**
1. Start with highest-impact layer for platform
2. Add next layer only after first is working
3. Test combined compliance before adding more
4. Document which layer catches which failure modes

**Evidence (Jan 30, 2026):** Previous single-solution attempts all failed. Multi-layered approach proposed after production failure analysis.

**See:** [ENFORCEMENT_STRUCTURAL_SOLUTIONS.md](ENFORCEMENT_STRUCTURAL_SOLUTIONS.md)
**Related:** [Platform-Specific Enforcement](#platform-specific-enforcement), [Passive vs Active Enforcement](concepts.md#passive-vs-active-enforcement)

---

### Pre-flight Rule Mapping

**Problem:** LLMs often jump into generation without internalizing specific task-related guardrails.
**Solution:** Require a mandatory "Step 0" where the agent outputs a visible or hidden table mapping project rules to the specific current task.
**When to use:** High-stakes generation (e.g., bullet generation) with 5+ competing constraints.

**Quick Reference:**
- Model must "show its work" on rule adherence *before* generating content.
- Restores "Recency" of rules just moments before the primary token stream starts.
- **Critical for:** Enforcement of G14 (Density), G24 (Char Limits), and G29 (Metric Preservation/Data Integrity).

**See:** [Lesson: Effective LLM Constraints](../lessons-learned/process/Lessons_Learned_Effective_LLM_Constraints.md)

---

### 3-Stage Validation Checkpoint

**Problem:** LLMs fail to satisfy multiple interdependent/recursive constraints (e.g., Char limits vs. Word budget) in a single-pass monolithic validation.
**Solution:** Decouple validation into three sequential, visible stages: Planning → Gating → Reconciliation.
**When to use:** Multi-position resume generation, complex summarization with hard length and uniqueness constraints.

**Quick Reference:**
1. **Stage 1 (Budget Planning):** Force LLM to allocate resources (bullets/words) across all units BEFORE generation starts.
2. **Stage 2 (Incremental Gates):** Require visible "Pass/Fail" indicators for each unit during the token stream.
3. **Stage 3 (Final Reconciliation):** Verify total output against global budgets and provide explicit fallback logic (e.g., "If over budget, delete from oldest first").

**Benefit:** Prevents "Generate Then Panic" drift where the LLM realizes it failed a constraint and makes destructive retroactive edits.

**See:** [Lesson: Recursive Constraint Validation](../lessons-learned/process/Lessons_Learned_Recursive_Constraint_Validation.md)

---
+

---

### Hub-and-Spoke Delegation

**Problem:** Logic drift between multiple user interfaces (Local React vs. Web Artifacts) implementing the same complex prompt logic.
**Solution:** Centralize logic into a single modular Hub and update all Spokes (UI components) to delegate to it via reference.
**When to use:** Multi-platform applications with shared core agentic logic.

**Quick Reference:**
- **The Hub:** Authoritative logic module (e.g., `bo_bullet-generation-instructions.md`)
- **The Spokes:** GUI orchestrators that pass context to the Hub.
- **Benefit:** Atomic updates and zero logic duplication.

**See:** [ADR-009](../decisions/ADR-009-hub-and-spoke-bullet-generation.md)

---

### Pipeline Integration Pattern

**Problem:** Validators and compliance trackers exist but aren't connected, preventing enforcement drift monitoring.
**Solution:** Auto-invoke downstream validators from generator outputs, converting results to JSON and logging compliance automatically.
**When to use:** Multi-layer validation systems, real-time compliance monitoring, enforcement observability.

**Quick Reference:**
```
Generator → Validator (JSON output) → Compliance Tracker (auto-invoke)
                  ↓
         docs/governance/compliance_logs.json
```

**Implementation:**
1. Validator converts ValidationResult objects to JSON dicts
2. Validator auto-invokes compliance tracker after validation completes
3. Tracker creates timestamped log entries with per-guardrail status
4. Platform-aware thresholds: Platform 2 < 50%, Platform 3 < 40%

**Benefit:** Enforcement drift detection without manual orchestration

**See:** [v9.3.7.1 Verification Enhancements Lesson](../lessons-learned/enforcement/v9.3.7.1-verification-enhancements.md#item-7-integrate-compliance_trackerpy-pipeline-)

---

### Fail-Closed Enforcement

**Problem:** Guardrail references don't explicitly mandate external validation, leaving ambiguity about whether failures are optional.
**Solution:** Add explicit fail-closed language at constraint definition (G40) and execution (workflow) levels.
**When to use:** Any enforcement policy that requires validation to pass before output delivery.

**Quick Reference:**
- **Definition Level (G40):** Add `<external_validation priority="MANDATORY">` block
- **Execution Level (Workflow):** Add "Step X.5" with explicit fix/re-validate instructions
- **Enforcement:** "IF validation fails (exit code 1), STOP and fix violations"

**Example:**
```xml
<external_validation priority="MANDATORY">
  <enforcement>
    Before delivering ANY output, validation MUST pass.
    If validation fails (exit code 1), STOP and fix violations.
    Do NOT deliver output with failing guardrails.
  </enforcement>
</external_validation>
```

**Benefit:** Users understand validation is mandatory, not optional; prevents accidental delivery of non-compliant output

**See:** [v9.3.7.1 Verification Enhancements Lesson](../lessons-learned/enforcement/v9.3.7.1-verification-enhancements.md#item-9-add-fail-closed-language-)

---

### Compliance Tracking Architecture

**Problem:** No way to monitor enforcement drift over time or detect degradation in guardrail compliance per platform.
**Solution:** Layer 5 observability logs per-guardrail pass/fail status with timestamp, platform, and compliance rate per session.
**When to use:** Multi-platform deployments, enforcing SLO-like compliance targets, compliance auditing.

**Quick Reference:**
```json
{
  "timestamp": "2026-01-31T15:33:14.690458",
  "platform": "Claude Project",
  "results": [
    {"guardrail": "G40-Stage1", "passed": true},
    {"guardrail": "G24", "passed": false}
  ],
  "summary": {
    "total": 8,
    "passed": 5,
    "rate": 62.5
  }
}
```

**Monitoring:**
- Create compliance dashboard visualizing trends per platform/date
- Alert when compliance rate drops below threshold
- Identify problematic guardrails (consistently failing)

**Platform Thresholds:**
- Platform 2 (Claude Project): < 50% (user-friendly, may have gaps)
- Platform 3 (Google Gemini): < 40% (model-specific limitations)

**See:** [v9.3.7.1 Verification Enhancements Lesson](../lessons-learned/enforcement/v9.3.7.1-verification-enhancements.md#item-12-update-knowledge-graph-with-v9371-patterns)

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
1. Extract all numbers from original text (integers, %, $, durations).
2. **Audit Logic (Step 0):** List original metrics vs. planned draft metrics in thinking.
3. Extract all numbers from new draft.
4. **Visual Pattern Audit:** Scan output for forbidden symbols (`—`) or improper spacing (` - ` inside compound adjectives).
5. If any missing or invalid → STOP and restore/fix.
6. Zero tolerance for data loss or formatting drift.

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

### Identifier Decoupling (Dual-ID Policy)

**Problem:** Local context (folders/branches) drifts from platform serial numbering (GitHub Issues), causing confusing renames.
**Solution:** Map local persistent IDs to platform serial IDs instead of attempting to align them.
**When to use:** Project management across local and cloud platforms.

**Quick Reference:**
- **Local ID:** `issue-85` (Logical, persistent, used for file paths/branches).
- **Platform ID:** `#97` (Serial, drifts, used for tracking).
- **Policy:** Never rename local assets to match platform drift. Always maintain a mapping matrix in metadata.

**See:** [Identifier Decoupling Lesson](../lessons-learned/process/Lessons_Learned_Identifier_Decoupling.md)

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

## v9.3.7 Enforcement Patterns (January 2026 Research)

### Four-Layer Enforcement Strategy

**Problem:** Passive instruction-based guardrails fail in production (v9.3.6 proved this). Documentation alone cannot prevent LLM drift.

**Solution:** Move from passive documentation to active structural constraints across four layers:
1. **Layer 1:** Hard mathematical limits in prompt template
2. **Layer 2:** JSON validation gates requiring explicit proof
3. **Layer 3:** Multi-turn workflow with user approval gates
4. **Layer 4:** Literal guardrail code injected as pseudo-code

**When to use:**
- Whenever implementing guardrails that must not be bypassable
- Building production-grade LLM applications
- Requiring defense-in-depth with multiple validation layers

**Quick Reference:**
- Layer 1 addresses: Positions omitted, wrong order, budget ignored
- Layer 2 addresses: Invisible validation, fake compliance claims
- Layer 3 addresses: Skipped stages, impossible constraints
- Layer 4 addresses: Guardrails treated as suggestions
- Defense-in-depth: Failure of any single layer doesn't cause complete bypass
- Generalized pattern: Gemini independently applied same architecture to custom keywords (validates universality)

**See:** [docs/plans/v9.3.7-guardrail-enforcement-fix.md](../plans/v9.3.7-guardrail-enforcement-fix.md) - Four-Layer Strategy section

**Related:** [Layered Defense Strategy](#layered-defense-strategy), [3-Stage Validation Checkpoint](#3-stage-validation-checkpoint), [Insolvency Deadlock](#insolvency-deadlock)

---

### Input Sanitization Layer (Layer 0)

**Problem:** Even commercial guardrails (Microsoft Azure Prompt Shield, Meta Prompt Guard) can be bypassed using Unicode tricks, zero-width characters, and homoglyphs.

**Solution:** Pre-process all input with normalization and sanitization:
1. Normalize Unicode to UTF-8
2. Strip zero-width characters (U+200B, U+200C, U+200D)
3. Detect and flag homoglyphs
4. Enforce input length constraints
5. Log suspicious patterns for monitoring

**When to use:**
- Before any critical guardrail processing
- When accepting user input for high-stakes operations
- When defending against prompt injection attempts

**Quick Reference:**
- Research shows character injection achieved 100% evasion against commercial guardrails (arXiv 2504.11168)
- Normalization alone prevents most Unicode evasion techniques
- Suspicious patterns logged enable future threat detection
- Works in conjunction with Layers 1-4

**See:** [Guardrail Evasion via Unicode](../knowledge/gotchas.md#guardrail-evasion-via-unicode) gotcha entry

**Related:** [Four-Layer Enforcement Strategy](#four-layer-enforcement-strategy)

---

### Compliance Rate Tracking

**Problem:** Enforcement compliance can degrade over time without visibility. Drift is silent until critical (discovered too late).

**Solution:** Implement continuous monitoring:
1. Log per-guardrail pass/fail for each generation
2. Track aggregate compliance by session/platform/guardrail
3. Alert if compliance drops below threshold
4. Create dashboard of trends over time
5. Identify which guardrails fail most frequently

**When to use:**
- After implementing any guardrail system
- In production or high-stakes applications
- When compliance is business-critical
- Every session in iterative development

**Quick Reference:**
- Expected compliance rates vary by platform (30-95% depending on architecture)
- Alert thresholds: Platform 2 < 50%, Platform 3 < 40%
- Tracks drift early before it becomes critical
- Identifies weak guardrails that need reinforcement
- Real-world example: v9.3.6 drift from 100% documented compliance to 0% actual compliance

**See:** [Silent Enforcement Drift](../knowledge/gotchas.md#silent-enforcement-drift) gotcha entry

**Related:** [Four-Layer Enforcement Strategy](#four-layer-enforcement-strategy), [Probabilistic Enforcement Myth](../knowledge/gotchas.md#probabilistic-enforcement-myth)

---

### Positive Constraint Framing

**Problem:** Negative instructions ("Don't output X", "Never skip Y") can prime the model to do the opposite behavior (Pink Elephant Problem).

**Solution:** Reframe all constraints as affirmative commands:
- **❌ Instead of:** "DO NOT output positions in wrong order"
- **✅ Use:** "All positions MUST be in chronological order"
- **❌ Instead of:** "NEVER skip the Budget Table"
- **✅ Use:** "Budget Table MUST appear as first output"

**When to use:**
- Writing any guardrail or constraint language
- Defining system prompts or behavioral requirements
- Creating validation rules or acceptance criteria

**Quick Reference:**
- Negative language primes opposite behavior (research-backed)
- Positive framing improves compliance measurably
- Anthropic's prompt engineering best practices recommend affirmative language
- Applies to all guardrail layers (1, 2, 3, 4)
- Replace "DO NOT", "NEVER", "AVOID" with "MUST", "Always", "Required to"

**See:** [The Pink Elephant Problem](../knowledge/gotchas.md#the-pink-elephant-problem) gotcha entry

**Related:** [Four-Layer Enforcement Strategy](#four-layer-enforcement-strategy), [Effective LLM Constraints](#effective-llm-constraints)

---

### Meta-Issue Tracking Pattern

**Problem:** Complex problems span multiple versions and require 3+ solution attempts with evolving understanding. Single-issue tracking doesn't capture root cause evolution or cross-attempt patterns.

**Solution:** Create structured meta-issue directory with:
1. **Core files:** README (navigation), description (living document), implementation-log (all attempts), test-cases (validation)
2. **Attempt folders:** Numbered sequentially with solution-approach, plan-reference, attempt-results
3. **Analysis files:** Root-cause evolution (understanding shifts), timeline, lessons
4. **Related issues:** Links to GitHub issues/PRs
5. **Bidirectional KG:** Links to patterns, gotchas, lessons learned

**When to use:**
- 3+ distinct solution attempts required
- Root cause shifts as attempts reveal new insights
- Spans multiple version iterations
- Multiple related GitHub issues
- Investigation takes weeks/months

**Quick Reference:**
- **Directory:** `docs/issues/[meta-issue-name]/`
- **Naming:** `[version-range]-[domain]-saga/` (e.g., `v9.3.x-enforcement-saga/`)
- **Structure:** README, description, implementation-log, test-cases, attempts/, analysis/, related-issues/
- **SOPs:** SOP 0 (creating), SOP 1 (new attempt), SOP 2 (results), SOP 3 (KG update), SOP 4 (troubleshooting)
- **Reusable:** Generalized templates support ANY meta-issue type (enforcement, performance, migration, etc.)

**Real-World Example:**
- **v9.3.x Enforcement Saga:** 9 attempts across v9.3.4-v9.3.7.1+
  - Started: "Better docs will fix it"
  - Shifted: "Structural constraints work"
  - Shifted: "Four-layer architecture will fix it"
  - Shifted: "External validation required"
  - Current: "Human-in-loop gates necessary"
  - Root cause: LLM vibe-coding drift (behavioral, not capability limitation)

**Benefits:**
- Complete audit trail of investigation
- Root cause evolution documented
- Pattern discovery across attempts (what works, what doesn't)
- Bidirectional KG integration (patterns link to attempts, attempts link to patterns)
- Reusable for future meta-issues

**Trade-offs:**
- Higher initial setup cost (templates, SOPs)
- Requires discipline to maintain bidirectional links
- More comprehensive than single-issue tracking

**See:** [Lesson: Meta-Issue Tracking System v9.3.8](../lessons-learned/knowledge-capture/v9.3.8-meta-issue-tracking-system.md)

**Related:** [Root Cause Evolution (Enforcement Saga)](../issues/v9.3.x-enforcement-saga/analysis/root-cause-evolution.md), [Four-Layer Enforcement Strategy](#four-layer-enforcement-strategy), [Compliance Rate Tracking](#compliance-rate-tracking)

---

**Maintenance:** Add new patterns as they emerge from practice
**Created:** 2026-01-02
**Last Updated:** 2026-01-30 (Added v9.3.7 enforcement patterns)
