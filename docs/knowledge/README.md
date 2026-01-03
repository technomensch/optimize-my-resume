# Knowledge Graph

**Purpose:** Quick-reference documentation for concepts, patterns, gotchas, and workflows

**Last Updated:** 2026-01-02
**Total Entries:** 0

---

## What is the Knowledge Graph?

The Knowledge Graph is a collection of quick-reference documentation that captures:
- **Concepts** - Core ideas and principles
- **Patterns** - Reusable design patterns
- **Gotchas** - Common pitfalls and solutions
- **Workflows** - Step-by-step process guides

Unlike lessons learned (which capture detailed problem-solving journeys) or ADRs (which document decisions), the Knowledge Graph provides quick, scannable references for daily work.

---

## Organization

- **[index.md](index.md)** - Master navigation hub with concept map
- **[concepts.md](concepts.md)** - Core concepts and principles
- **[patterns.md](patterns.md)** - Reusable design patterns
- **[gotchas.md](gotchas.md)** - Common pitfalls and solutions
- **[workflows.md](workflows.md)** - Quick workflow references
- **[template.md](template.md)** - Template for new entries

---

## How to Use

**Finding Information:**
```bash
# Start with the index
cat docs/knowledge/index.md

# Search for specific topic
/recall <topic>

# Browse by type
cat docs/knowledge/patterns.md
```

**Adding New Entries:**
1. Determine entry type (concept/pattern/gotcha/workflow)
2. Add to appropriate file (concepts.md, patterns.md, etc.)
3. Update cross-references
4. Update index.md

**Linking to Other Systems:**
- Link to ADRs for formal decisions
- Link to lessons learned for detailed journeys
- Link to sessions for implementation context

---

## Cross-References

Knowledge entries should link to:
- Related concepts (within knowledge graph)
- ADRs (formal decisions)
- Lessons learned (detailed problem-solving)
- Sessions (implementation history)

---

## Maintenance

**Update frequency:** After each new lesson/ADR/significant session
**Curator:** Team responsibility
**Review cycle:** Monthly cleanup of outdated entries

---

**Created:** 2026-01-02
