# Design Patterns Catalog

**Last Updated:** 2026-01-02
**Entries:** 6

---

## Quick Navigation

- [Dual-Format Strategy](#dual-format-strategy) - Optimize for both LLM and human audiences
- [Surgical Updates](#surgical-updates) - Preserve content while enhancing
- [Hybrid Global-Project](#hybrid-global-project) - Execution vs. documentation separation
- [Template-Driven Docs](#template-driven-docs) - Standardized document creation
- [Four-Pillar Memory](#four-pillar-memory) - Multi-system knowledge capture
- [Category Auto-Detection](#category-auto-detection) - Keyword-based organization

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
