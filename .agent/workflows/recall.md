---
description: Search across project memory systems (lessons, decisions, etc)
---
# recall

Search across all project memory systems to find relevant knowledge, lessons, decisions, and session history.

---

## Description

This skill provides unified search across four memory systems:
- **Lessons Learned:** Past problems solved and patterns discovered
- **Architecture Decisions (ADRs):** Formal decision documentation
- **Knowledge Graph:** Quick-reference concepts, patterns, and gotchas
- **Session Summaries:** Historical work context and outcomes

**Philosophy:** Memory retrieval should be fast, comprehensive, and actionable.

---

## Usage

```bash
/recall <topic>
/recall <topic> --type=<lessons|decisions|knowledge|sessions|all>
/recall <topic> --format=<summary|paths|detailed>
```

**Parameters:**
- `topic` (required): What to search for (keywords or phrases)
- `--type` (optional): Filter by memory type (default: all)
- `--format` (optional): Output format (default: summary)

**Examples:**
```bash
/recall skills architecture
/recall deployment --type=lessons
/recall version control --format=paths
/recall dual format --format=detailed
```

---

## Execution Steps

### Step 1: Parse Query

Extract topic and options:

**Example:**
```
Input: "/recall CI/CD pipelines --type=lessons"
→ Topic: "CI/CD pipelines"
→ Type: lessons
→ Format: summary (default)
```

**Parse logic:**
- Everything before first `--` is the topic
- Extract `--type=X` if present (default: all)
- Extract `--format=X` if present (default: summary)

### Step 2: Determine Search Scope

Based on `--type` parameter:

| Type | Directories to Search |
|------|----------------------|
| `all` (default) | lessons-learned/, decisions/, knowledge/, sessions/ |
| `lessons` | lessons-learned/ only |
| `decisions` | decisions/ only |
| `knowledge` | knowledge/ only |
| `sessions` | sessions/ only |

### Step 3: Execute Search

**Search strategy - parallel grep across directories:**

```bash
# For "all" type (search everywhere)
grep -r -i "<topic>" docs/lessons-learned/ --include="*.md" -l
grep -r -i "<topic>" docs/decisions/ --include="*.md" -l
grep -r -i "<topic>" docs/knowledge/ --include="*.md" -l
grep -r -i "<topic>" docs/sessions/ --include="*.md" -l
```

**Search targets:**
- File names (case-insensitive)
- Content (case-insensitive)
- Metadata tags (if present)

**Multi-word handling:**
- Split query into keywords: "CI/CD pipelines" → ["CI/CD", "pipelines"]
- Search for each keyword
- Rank results with multiple keyword matches higher

### Step 4: Rank Results

**Ranking criteria (points system):**

1. **Exact match in filename:** +10 points
2. **Multiple keyword matches:** +5 points per match
3. **Recent files (last 30 days):** +3 points
4. **Structural importance:**
   - Architecture lessons: +2 points
   - ADR status=Accepted: +2 points
   - README files: -1 point (usually indexes, not content)

**Sort results by total score (highest first)**

### Step 5: Format Output

#### Format: `summary` (Default)

```markdown
## Search Results: "<topic>"

Found X matches across memory systems:

### Lessons Learned (Y matches)

1. **Filename.md** ⭐⭐⭐⭐⭐ (exact match)
   - Category: architecture
   - Date: YYYY-MM-DD
   - Preview: "First 100 chars of relevant content..."
   - Path: docs/lessons-learned/architecture/Filename.md

2. **Another.md** ⭐⭐⭐
   - Category: debugging
   - Date: YYYY-MM-DD
   - Preview: "Content preview..."
   - Path: docs/lessons-learned/debugging/Another.md

### Architecture Decisions (Z matches)

1. **001-title.md** ⭐⭐⭐⭐
   - Status: Accepted
   - Date: YYYY-MM-DD
   - Preview: "Decision preview..."
   - Path: docs/decisions/001-title.md

### Knowledge Graph (N matches)

1. **patterns.md → Section Name**
   - Quick summary available
   - Path: docs/knowledge/patterns.md#section-name

### Session Summaries (M matches)

1. **YYYY-MM-DD_description.md** ⭐⭐⭐
   - Type: Feature Development
   - Date: YYYY-MM-DD
   - Preview: "Session preview..."
   - Path: docs/sessions/YYYY-MM/YYYY-MM-DD_description.md

---

**Quick Actions:**
- Read details: Use Read tool with paths above
- Related topics: [extracted from cross-refs]
- Create new: /lesson-learned (if no relevant results)
```

**Star rating logic:**
- ⭐⭐⭐⭐⭐ (5 stars): 10+ points (exact match)
- ⭐⭐⭐⭐ (4 stars): 7-9 points (very relevant)
- ⭐⭐⭐ (3 stars): 4-6 points (relevant)
- ⭐⭐ (2 stars): 2-3 points (somewhat relevant)
- ⭐ (1 star): 1 point (tangentially relevant)

#### Format: `paths`

```
docs/lessons-learned/architecture/Filename.md
docs/decisions/001-title.md
docs/knowledge/patterns.md
docs/sessions/YYYY-MM/YYYY-MM-DD_description.md
```

Simple list of matching file paths for piping to other tools.

#### Format: `detailed`

Show full context with 5 lines before/after each match:

```markdown
## Detailed Results: "<topic>"

### Match 1: docs/lessons-learned/architecture/Filename.md

**Line 42:**
```
  39 | context line
  40 | context line
  41 | context line
> 42 | Line containing MATCHED KEYWORD in bold
  43 | context line
  44 | context line
  45 | context line
```

[Continue for all matches...]
```

### Step 6: Suggest Next Actions

Based on results:

**If 0 results:**
```
No matches found for "<topic>".

**Suggestions:**
- Try broader keywords
- Check spelling
- Create new documentation: /lesson-learned
```

**If 1-3 results:**
```
**Next Steps:**
- Read full context: Use paths above with Read tool
- Explore related: [links to cross-referenced docs]
```

**If 4+ results:**
```
**Narrow your search:**
- Use --type=lessons (search only lessons)
- Use more specific keywords
- Browse by category:
  - Architecture: docs/lessons-learned/architecture/
  - Debugging: docs/lessons-learned/debugging/
```

**Always suggest related topics:**
Extract from cross-references in found documents and suggest:
```
**Related topics you might want to explore:**
- dual-format (found in 2 related docs)
- skills-architecture (found in 1 related doc)
```

---

## Integration with Other Skills

**With /lesson-learned:**
```
User: /recall authentication
Claude: "Found 2 lessons about authentication..."
User: "None of these match my issue"
Claude: "Create new lesson? Type /lesson-learned"
```

**With /session-summary:**
```
User: /recall today's work
Claude: "No session summary found for today. Type /session-summary to create one"
```

---

## Examples

### Example 1: Find architecture decisions

```
User: /recall skills architecture
```

**Output:**
```markdown
## Search Results: "skills architecture"

Found 3 matches across memory systems:

### Lessons Learned (1 match)

1. **Lessons_Learned_Claude_Code_Skills_Architecture.md** ⭐⭐⭐⭐⭐
   - Category: uncategorized (should be architecture/)
   - Date: 2025-12-29
   - Preview: "Claude Code skills MUST be installed in ~/.claude/commands/..."
   - Path: docs/lessons-learned/Lessons_Learned_Claude_Code_Skills_Architecture.md

### Architecture Decisions (1 match)

1. **002-skills-global-only.md** ⭐⭐⭐⭐ (to be created)
   - Status: Accepted
   - Preview: "Skills load from global directory only..."

### Knowledge Graph (1 match)

1. **patterns.md → Skills Global-Only Pattern**
   - Quick summary: "Skills in ~/.claude/commands/, not .claude/skills/"
   - Path: docs/knowledge/patterns.md#skills-global-only

---

**Quick Actions:**
- Read lesson: docs/lessons-learned/Lessons_Learned_Claude_Code_Skills_Architecture.md
- Related topics: claude-code, global-directory, project-local
```

### Example 2: Find debugging solutions

```
User: /recall validation fails --type=lessons
```

**Output:**
```markdown
## Search Results: "validation fails"

Found 0 matches in lessons learned.

**Suggestions:**
- Try broader keywords: "validation" or "fails"
- Check other systems: /recall validation --type=all
- Create new lesson: /lesson-learned
```

### Example 3: Get paths only

```
User: /recall memory system --format=paths
```

**Output:**
```
docs/lessons-learned/Lessons_Learned_Memory_System_Phase_1_Foundation.md
docs/decisions/005-memory-system-architecture.md
docs/sessions/2026-01/2026-01-02_memory-system-design.md
docs/knowledge/concepts.md
```

---

## Technical Details

**Search tool:** `grep` (built-in, fast, regex support)
**File types:** Only `.md` files
**Case sensitivity:** Case-insensitive by default (`-i` flag)
**Performance:** <2 seconds for entire docs/ directory
**Max results:** Display top 10 per category (rankable)

**Grep flags used:**
- `-r` : Recursive search
- `-i` : Case-insensitive
- `-l` : List filenames only (for paths format)
- `--include="*.md"` : Search only markdown files
- `-n` : Show line numbers (for detailed format)
- `-C 5` : Show 5 lines of context (for detailed format)

---

## Troubleshooting

### Problem: Too many results

**Solution:**
- Use `--type` filter: `/recall topic --type=lessons`
- Use more specific keywords
- Browse category directly: `ls docs/lessons-learned/architecture/`

### Problem: No results found

**Solution:**
- Try broader keywords
- Check spelling
- Try different memory type: `--type=sessions` vs `--type=lessons`
- Search all systems: `/recall topic --type=all`

### Problem: Results not relevant

**Solution:**
- Refine query with more specific technical terms
- Use exact phrases in quotes (future enhancement)
- Browse categories manually to discover content

### Problem: Want to see full context

**Solution:**
- Use `--format=detailed` to see 5 lines before/after each match
- Use `--format=paths` then Read tool for full file content

---

## Future Enhancements

**Synonym expansion:**
```
deployment → deploy, release, ship
CI/CD → continuous integration, continuous deployment, pipeline
```

**Phrase search:**
```
/recall "exact phrase match"
```

**Date filtering:**
```
/recall topic --since=2025-12-01
/recall topic --last=30days
```

**Tag search:**
```
/recall #architecture
/recall tag:claude-code
```

---

**Created:** January 2, 2026
**Version:** 1.0
**Integration:** Works with all four memory systems
**Related Skills:** /lesson-learned, /session-summary
