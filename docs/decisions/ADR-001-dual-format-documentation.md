# ADR-001: Dual-Format Documentation Strategy

**Status:** Accepted
**Date:** 2026-01-02
**Deciders:** technomensch
**Tags:** #documentation #format #llm-optimization #maintainability

**Related:**
- **Supersedes:** None (foundational decision)
- **Superseded by:** N/A
- **Related Lessons:** [Memory System Phase 1](../lessons-learned/patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

## Context and Problem Statement

When building AI-assisted development workflows with Claude Code, we need documentation that serves two distinct audiences:

1. **LLMs (Claude)** - Require structured, parseable content for reliable extraction and processing
2. **Humans (Developers)** - Need readable, navigable markdown with rich formatting

**The Problem:**
- Single-format markdown is human-friendly but loses structure for LLM parsing
- Pure XML/JSON is machine-parseable but difficult for humans to read and maintain
- Context engineering documents need strict structure for LLM reliability
- Documentation needs to be maintainable by humans without XML expertise

**Key Question:**
Should we use dual-format documentation (.txt with XML + .md with Markdown) or settle for a single compromise format?

---

## Decision Drivers

1. **LLM Parsing Reliability** - Structured XML provides consistent, predictable extraction
2. **Human Maintainability** - Markdown is widely understood and easier to edit
3. **Version Control** - Both formats work well in git with readable diffs
4. **Use Case Separation** - Some docs are primarily for LLMs (prompts), others for humans (guides)
5. **Tooling Support** - Markdown has better IDE support, XML has better validation
6. **Search and Discovery** - Markdown integrates with /recall and grep better
7. **Cost** - Maintaining two versions has overhead

---

## Considered Options

### Option 1: Markdown-Only (.md)
**Approach:** Use markdown for all documentation with structured sections

**Pros:**
- Single source of truth (no sync issues)
- Better human readability
- Better IDE support
- Works with /recall skill
- Standard for documentation

**Cons:**
- Less reliable for LLM parsing (no strict schema)
- Harder to enforce structure
- LLMs may miss or misparse sections
- Inconsistent heading levels can break parsing

**Example Use Cases:**
- README files
- Lessons learned
- Knowledge graph entries
- ADRs (this document)

---

### Option 2: XML-Only (.xml or .txt)
**Approach:** Use XML for all documentation

**Pros:**
- Strict schema enforcement
- Perfect for LLM parsing
- Validation tooling available
- Unambiguous structure

**Cons:**
- Poor human readability
- Harder to maintain manually
- Less familiar to most developers
- Verbose (more tokens for simple content)
- Poor IDE support for editing

**Example Use Cases:**
- Complex AI prompts (if we went this route)
- Data structures requiring validation

---

### Option 3: Dual-Format (.txt + .md)
**Approach:** Maintain two versions where appropriate:
- `.txt` with XML structure for LLM consumption
- `.md` with Markdown for human reading

**Pros:**
- Best of both worlds
- LLMs get reliable structure
- Humans get readable content
- Can optimize each format for its audience
- Clear separation of concerns

**Cons:**
- Maintenance overhead (two files to update)
- Risk of desynchronization
- More files in repository
- Need process to keep formats in sync

**Example Use Cases:**
- Context engineering templates (`.txt`)
- System prompts for agents (`.txt`)
- User-facing documentation (`.md`)
- Lessons learned (`.md`)

---

### Option 4: Markdown with YAML Frontmatter
**Approach:** Use Markdown with structured YAML metadata

**Pros:**
- Single file
- Machine-parseable metadata
- Human-readable content
- Common pattern (Jekyll, Hugo, etc.)

**Cons:**
- YAML only handles metadata, not full document structure
- Still less reliable than XML for complex parsing
- Frontmatter size limited before becoming unwieldy

**Example Use Cases:**
- Session summaries (could work)
- Blog posts with metadata

---

## Decision Outcome

**Chosen option:** **"Option 3: Dual-Format (.txt + .md) - Selectively"**

**Rationale:**

We will use a **context-driven dual-format strategy**:

### When to Use .txt (XML Structure)
Use `.txt` files with XML structure for:
1. **Context Engineering Documents** - Agent system prompts requiring strict structure
2. **Complex Prompt Templates** - Where structure ensures consistent LLM behavior
3. **Data Schemas** - When validation and parsing are critical

**Why:** These documents are primarily consumed by LLMs and require strict, reliable parsing. The XML structure prevents ambiguity and ensures consistent extraction.

**Example:** `Lessons_learned-Context_Engineering_Template.txt` - Template for building agent prompts

### When to Use .md (Markdown)
Use `.md` files for:
1. **Human-First Documentation** - README files, guides, tutorials
2. **Lessons Learned** - Narrative problem-solving journeys
3. **ADRs** - Architecture decision records (like this one)
4. **Knowledge Graph** - Quick-reference concepts and patterns
5. **Session Summaries** - Historical context from work sessions

**Why:** These documents are primarily created and consumed by humans. Markdown's readability and familiarity make maintenance easier.

**Example:** This ADR, all lessons learned, knowledge entries

### Hybrid Approach
For documents that serve both audiences equally:
1. **Primary format**: Choose based on primary audience
2. **Cross-reference**: Link between formats if both exist
3. **Generate**: Consider auto-generating one from the other (future enhancement)

---

## Consequences

### Positive

✅ **LLM Reliability** - Context engineering documents have strict, parseable structure
✅ **Human Maintainability** - Most documentation remains in familiar Markdown
✅ **Audience Optimization** - Each format optimized for its primary consumer
✅ **Clear Guidelines** - Explicit rules for which format to use when
✅ **Flexibility** - Can choose the right tool for each use case

### Negative

⚠️ **Maintenance Burden** - Dual-format docs require updating both files
⚠️ **Sync Risk** - Formats can drift out of sync without discipline
⚠️ **More Files** - Repository has both .txt and .md files
⚠️ **Tooling Gaps** - Need process/tools to detect desynchronization

### Neutral

🔵 **Learning Curve** - Team needs to know when to use each format
🔵 **File Count** - More files, but organized by purpose
🔵 **Grep/Search** - Need to search both .txt and .md files

---

## Implementation Guidelines

### File Naming
- `.txt` files: Use descriptive names, suffix with purpose if needed
  - Example: `Context_Engineering_Template.txt`
- `.md` files: Follow standard conventions
  - Example: `ADR-001-dual-format-documentation.md`

### Directory Organization
```
docs/
├── lessons-learned/     # .md files (human narrative)
├── decisions/           # .md files (ADRs)
├── knowledge/           # .md files (quick reference)
├── sessions/            # .md files (historical context)
├── prompts/             # .txt files (XML, for LLMs)
└── templates/           # Mixed (.txt for LLM, .md for human)
```

### Synchronization
For dual-format documents:
1. **Source of Truth**: Declare one format as authoritative
2. **Update Process**: Update source first, then sync to other format
3. **Validation**: Periodic checks for drift (script or manual review)
4. **Version Control**: Commit both files together

### Transition Plan
Existing documentation:
- Keep existing .md files as-is (no conversion needed)
- Keep existing .txt files as-is (serve LLM purposes)
- New documents: Apply decision criteria from above

---

## Validation

**How we'll know this decision is working:**
1. ✅ LLM parsing of context engineering docs is reliable (no parse errors)
2. ✅ Developers find markdown docs easy to read and maintain
3. ✅ /recall skill finds relevant content in both formats
4. ✅ No synchronization issues reported in dual-format docs

**When to revisit:**
- If synchronization becomes a significant burden
- If LLM parsing improves enough to reliably parse markdown
- If we find most docs need dual formats (would reconsider tooling)

---

## Examples

### Good: .txt (LLM-First)
```
docs/prompts/agent-system-prompt.txt
<agent_identity>
  <role>Senior Resume Architect</role>
  <capabilities>...</capabilities>
</agent_identity>
```

### Good: .md (Human-First)
```
docs/lessons-learned/architecture/Lessons_Learned_Skills_Architecture.md
# Lessons Learned: Skills Architecture

**Problem:** Skills not appearing...
**Solution:** Must use global directory...
```

### Consider Dual Format:
If a context engineering template is valuable for both LLM parsing AND human reading:
- `Context_Engineering_Template.txt` (authoritative, XML structure)
- `Context_Engineering_Guide.md` (human guide, references .txt)

---

## Related Decisions

- **ADR-002:** Skills Global-Only (to be created)
- **ADR-003:** Surgical Updates Pattern (to be created)

---

**Decision Date:** 2026-01-02
**Implementation Date:** 2026-01-02 (retroactive formalization)
**Last Reviewed:** 2026-01-02
**Next Review:** 2026-04-02 (3 months, or when new LLM capabilities emerge)
