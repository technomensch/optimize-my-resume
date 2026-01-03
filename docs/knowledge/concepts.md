# Core Concepts

**Last Updated:** 2026-01-02
**Entries:** 8

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

**Maintenance:** Update as new core concepts emerge from lessons and ADRs
**Created:** 2026-01-02
