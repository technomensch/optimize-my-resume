# update-knowledge-graph

Extract structured insights from lessons-learned documents and sync them to the knowledge graph, creating a quick-reference index while preserving full narrative context.

---

## Description

This skill keeps the knowledge graph synchronized with lessons-learned by:

1. **Reading** recently created or updated lesson-learned documents
2. **Extracting** key patterns, decisions, and insights
3. **Cross-referencing** with existing knowledge graph entries
4. **Creating or updating** knowledge entries that link back to full lessons
5. **Maintaining bidirectional links** between lessons and knowledge graph

**Architecture:**
- **Lessons-Learned:** Full narrative (problem → solution → replication details)
- **Knowledge Graph:** Quick-reference index (pattern name → link to lesson)
- **Relationship:** Knowledge entries LEVERAGE lessons, not REPLACE them

**Purpose:** Enable fast lookups ("What's the Shadow Sync Protocol?") while preserving detailed learning context ("How did we discover the Shadow Sync failure?").

**When to use:**
- After creating/updating lesson-learned documents
- When discovering new patterns or best practices
- Before completing complex work sessions
- When onboarding patterns to the knowledge base

---

## Usage

```bash
/update-knowledge-graph
/update-knowledge-graph --lesson=Shadow_Sync_Protocol_v8.5.3.md
/update-knowledge-graph --auto
/update-knowledge-graph --category=architecture
/update-knowledge-graph --sync-all
```

**Parameters:**
- `--lesson` (optional): Specific lesson file to extract from
- `--auto` (optional): Auto-detect and update without prompting
- `--category` (optional): Filter by knowledge category (patterns, architecture, workflow, debugging)
- `--sync-all` (optional): Check all lessons for missing knowledge entries
- `--show-updates` (optional): Display before/after diffs

**Examples:**
```bash
/update-knowledge-graph
/update-knowledge-graph --lesson=Shadow_Sync_Protocol_v8.5.3.md
/update-knowledge-graph --auto --sync-all
```

---

## Understanding the Relationship

### Lessons-Learned (Full Narrative)

**Purpose:** Document the complete journey of discovery and solution

**Structure:**
```markdown
# Lesson: [Topic]

## Problem Discovered
[What went wrong, symptoms, initial confusion]

## Root Cause Analysis
[Why it happened, underlying assumptions, architecture misunderstanding]

## Solution Implemented
[How we fixed it, steps taken, verification]

## Replication Details
[How to reproduce, test cases, edge cases]

## Lessons Learned
[Key takeaways, patterns for future, preventive measures]

## Related Resources
[Links to ADRs, code changes, issues]
```

**Example:** `Shadow_Sync_Protocol_v8.5.3.md` (1000+ lines)
- Problem: v8.5.2 implementation incomplete, Claude Artifacts still showing old terminology
- Root Cause: Different interfaces read from different prompt sources, incomplete sync
- Solution: Fixed PROJECT-INSTRUCTIONS.md, verified all three tiers
- Lessons: Shadow Sync is three-tier, not one-way; verification must be comprehensive

### Knowledge Graph (Quick Reference)

**Purpose:** Enable fast lookups and connections between concepts

**Structure:**
```markdown
## [Pattern/Concept Name]

**Problem:** [One sentence - what problem does this solve?]
**Solution:** [One sentence - what's the approach?]
**When to use:** [Bullet list of triggers]

**Quick Reference:**
[2-3 key points in scannable format]

**See:** [Link to full lesson learned]
**Related:** [Links to other patterns]
```

**Example:** In `docs/knowledge/patterns.md`
- Shadow Sync Protocol (pattern)
- Problem: Updating modular files in isolation risks incomplete sync
- Solution: Three-tier synchronization with comprehensive verification
- Quick Reference: Module → Gold Master → Optimized Entrypoint
- See: Shadow_Sync_Protocol_v8.5.3.md (full lesson learned)

### Relationship: LEVERAGE, Don't REPLACE

```
Workflow:

User searches for "Shadow Sync"
        ↓
Knowledge Graph: "Shadow Sync Protocol - See: Shadow_Sync_Protocol_v8.5.3.md"
        ↓
User clicks link
        ↓
Full Lesson Learned: Complete narrative with root cause, solution, replication steps
        ↓
User understands not just WHAT but WHY and HOW to apply it
```

**Key Principle:**
- Knowledge Graph = Quick index (5-10 seconds)
- Lesson-Learned = Deep understanding (5-10 minutes)
- Together = Efficient onboarding + comprehensive learning

---

## Extraction Process

### Step 1: Identify New or Modified Lessons

**Detect recently changed lessons:**

```bash
# Find lessons updated in last session
find docs/lessons-learned -name "*.md" -mtime -1

# Or check specific file
git log --oneline docs/lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md | head -1
```

**Typical sources:**
- Just created during `/lesson-learned` skill
- Modified as part of documentation updates
- Referenced in recent session summary

### Step 2: Extract Key Elements

**For each lesson file, extract:**

1. **Title/Topic Name**
   ```markdown
   # Lesson: Shadow Sync Protocol (v8.5.3)
   └─ Extract as: "Shadow Sync Protocol"
   ```

2. **Problem Statement**
   ```markdown
   ## Problem Discovered
   Modularizing core instructions risks breaking the "Gold Master" source of truth
   └─ Extract as: "Updating modular files in isolation risks incomplete sync"
   ```

3. **Solution Approach**
   ```markdown
   ## Solution Implemented
   Keep core logic in Gold Master but wrap in comments; references mirror structure
   └─ Extract as: "Three-tier synchronization: Module → Gold Master → Optimized Entrypoint"
   ```

4. **When to Use Triggers**
   ```markdown
   ## Lessons Learned / When to Apply
   - Before committing changes to optimization-tools/
   - When updating PROJECT-INSTRUCTIONS.md
   - After modifying XML rules or conditions
   └─ Extract as: Trigger list
   ```

5. **Category Classification**
   - Architecture decisions → `architecture/`
   - Debugging solutions → `debugging/`
   - Process improvements → `process/`
   - Pattern discoveries → `patterns/`
   - Other → `general/`

6. **Related Concepts**
   ```markdown
   **Related:** ADR-004, Silent Sync pattern, Issue #56
   └─ Extract cross-references
   ```

### Step 3: Check Existing Knowledge Graph

**Verify if entry already exists:**

```bash
# Search for existing entry
grep -i "shadow sync protocol\|Silent Sync" docs/knowledge/patterns.md

# Results:
# ✅ Found - Update with new information
# ❌ Not found - Create new entry
```

### Step 4: Create or Update Knowledge Entry

**Format for new entries:**

```markdown
### [Pattern/Concept Name]

**Problem:** [One sentence problem description]
**Solution:** [One sentence solution approach]
**When to use:** [Bullet list of triggers]

**Quick Reference:**
- [Key point 1]
- [Key point 2]
- [Key point 3]

**See:** [Link to full lesson: file://docs/lessons-learned/category/Lesson_Name.md]
**Related:** [Link to related patterns/ADRs]
```

**Example Output:**

```markdown
### Shadow Sync Protocol

**Problem:** Updating modular files in isolation risks incomplete synchronization across different interfaces
**Solution:** Enforce three-tier synchronization: Module → Gold Master → Optimized Entrypoint
**When to use:** Any time you update files in `optimization-tools/` directory or change terminology/XML structure

**Quick Reference:**
- **Module** (`optimization-tools/*/`): Source of truth, authoritative rules
- **Gold Master** (`PROJECT-INSTRUCTIONS.md`): Complete synchronized copy (used by Claude Artifacts)
- **Optimized Entrypoint** (`Project-GUI-Instructions.md`): Token-efficient version with modular references
- Verification requires comprehensive search for ALL terminology variations
- Different interfaces read from different prompt sources - test with ACTUAL interface

**See:** [Shadow_Sync_Protocol_v8.5.3.md](../lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md)
**Related:** [Silent Sync](#silent-sync) - Preserving gold master integrity
```

### Step 5: Update Cross-References

**Add bidirectional links:**

**In lesson-learned:**
```markdown
## Related Resources

- **Knowledge Graph:** [patterns.md - Shadow Sync Protocol](../../knowledge/patterns.md#shadow-sync-protocol)
- **ADRs:** ADR-004 - Shadow Modularization
- **Session:** 2026-01-16 - v8.5.3 Shadow Sync Completion
```

**In knowledge graph:**
```markdown
**See:** [Shadow_Sync_Protocol_v8.5.3.md](../lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md)
**Related:** [Silent Sync](#silent-sync) pattern
```

### Step 6: Verify Entry Quality

**Checklist for each new/updated entry:**

- [ ] **Quick Reference is scannable** (5-10 seconds to understand pattern)
- [ ] **Link to lesson is correct** (path exists, file present)
- [ ] **Related patterns are cross-linked** (bidirectional)
- [ ] **"When to use" is actionable** (someone can decide if it applies)
- [ ] **Problem/Solution are clear** (non-technical person could understand)
- [ ] **Correct category** (patterns/architecture/debugging/process)
- [ ] **Consistent formatting** (matches other entries in same file)
- [ ] **No orphaned references** (all links valid)

---

## Knowledge Graph Organization

### Category Structure

**docs/knowledge/patterns.md** - Design and implementation patterns
```markdown
- Dual-Format Strategy
- Surgical Updates
- Hybrid Global-Project
- Template-Driven Docs
- Shadow Sync Protocol ← NEW/UPDATED
- Silent Sync
... (other patterns)
```

**docs/knowledge/architecture.md** (if created) - System design decisions
```markdown
- ID-Based Architecture
- Modular Documentation Strategy
- Multi-Model Testing Strategy
... (architecture concepts)
```

**docs/knowledge/prompt_engineering.md** (if created) - Prompt design and constraints
```markdown
- Positive Constraints
- Recency Effect
- Chain-of-Thought Verification
- Effective LLM Constraints ← NEW/UPDATED
```

**docs/knowledge/processes.md** (if created) - Workflow patterns
```markdown
- Governance Lifecycle
- Functional Directory Structure
- Session Documentation
... (process patterns)
```

**docs/knowledge/debugging.md** (if created) - Problem-solving approaches
```markdown
- Terminology Tracking
- Interface Verification
- Comprehensive Search Techniques
... (debugging patterns)
```

### Entry Placement Logic

**Classify each extracted concept:**

| Category | Indicators |
|----------|-----------|
| **patterns/** | Reusable design, applicable across projects, proven approach |
| **architecture/** | System design, structural decisions, layers/components |
| **processes/** | Workflow, methodology, step-by-step procedures |
| **debugging/** | Troubleshooting techniques, root cause analysis |
| **general/** | Doesn't fit other categories (rare) |

---

## Workflow Integration

### Typical Flow

```
1. Create/Update Lesson (via /lesson-learned)
   ↓
2. Skill suggests: "Update knowledge graph?"
   ↓
3. Run /update-knowledge-graph --lesson=[file]
   ↓
4. Review extracted entry, approve or edit
   ↓
5. Entry added to knowledge graph
   ↓
6. Bidirectional links created
   ↓
7. Both files committed together
```

### Automatic Sync (--sync-all)

```bash
/update-knowledge-graph --sync-all

# Checks:
# 1. All lessons with "Learn More:" links
# 2. All ADRs with "Patterns:" references
# 3. All knowledge entries pointing to valid files
# 4. Missing entries that should exist
#
# Reports:
# ✅ Synchronized: [list]
# ⚠️ Broken links: [list]
# ❌ Orphaned lessons: [list]
# 💡 Suggested new entries: [list]
```

---

## Example: Shadow Sync Protocol Update

### Input: Lesson-Learned File

**File:** `docs/lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md`

```markdown
# Lesson: Shadow Sync Protocol - v8.5.3

## Problem Discovered
Modularizing core instructions risks breaking the "Gold Master" source of truth.
When files are updated in isolation, synchronization across different interfaces
becomes incomplete, causing user-visible bugs.

## Root Cause Analysis
Different interfaces read from different prompt sources:
- Claude Artifacts: PROJECT-INSTRUCTIONS.md (Gold Master)
- Local React dev: Inline prompts in .jsx files
- Ollama models: ollamaService.js

When only some sources are updated, inconsistency results.

## Solution Implemented
Three-tier synchronization:
1. **MODULE** (optimization-tools/*/): Source of truth
2. **GOLD MASTER** (PROJECT-INSTRUCTIONS.md): Synchronized copy
3. **OPTIMIZED ENTRYPOINT** (Project-GUI-Instructions.md): References

Comprehensive verification searches for all terminology variations before
declaring update complete.

## When to Apply
- Before committing changes to optimization-tools/
- When updating PROJECT-INSTRUCTIONS.md
- After modifying XML rules or conditions
- Before marking features as "complete"
```

### Processing Step

```bash
/update-knowledge-graph --lesson=Shadow_Sync_Protocol_v8.5.3.md
```

### Output: Knowledge Graph Entry

**Added to:** `docs/knowledge/patterns.md`

```markdown
### Shadow Sync Protocol

**Problem:** Updating modular files in isolation risks incomplete synchronization across different interfaces
**Solution:** Enforce three-tier synchronization: Module → Gold Master → Optimized Entrypoint
**When to use:**
- Before committing changes to optimization-tools/
- When updating PROJECT-INSTRUCTIONS.md
- After modifying XML rules or conditions
- Before marking features as "complete"

**Quick Reference:**
- **Module** (`optimization-tools/*/`): Source of truth, authoritative rules
- **Gold Master** (`PROJECT-INSTRUCTIONS.md`): Complete synchronized copy (used by Claude Artifacts)
- **Optimized Entrypoint** (`Project-GUI-Instructions.md`): Token-efficient version with modular references
- Verification requires comprehensive search for ALL terminology variations (exact, lowercase, snake_case, camelCase)
- Different interfaces read from different sources - test with ACTUAL interface, not assumptions

**See:** [Shadow_Sync_Protocol_v8.5.3.md](../lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md)
**Related:** [Silent Sync](#silent-sync) - Preserving gold master integrity
```

**Updated in:** `docs/lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md`

```markdown
## Related Resources

- **Knowledge Graph Entry:** [patterns.md → Shadow Sync Protocol](../../knowledge/patterns.md#shadow-sync-protocol)
- **Enforcement Skill:** `/enforce-shadow-sync`
- **Session Summary:** [2026-01-16 v8.5.3 Shadow Sync Completion](../../sessions/2026-01/2026-01-16_v8.5.3-shadow-sync-completion.md)
- **GitHub Issue:** #56 - Resume Analyzer Report UX Enhancement
```

### Result

Both files now have bidirectional links:
```
User searches → Knowledge Graph (fast lookup) → Full Lesson (deep dive)
                    ↓
            Related Patterns → Other Concepts
```

---

## Benefits of Leveraging (Not Replacing)

### Why This Architecture Works

**Quick Lookups (Knowledge Graph):**
- Fast to scan (5-10 seconds)
- Easy to remember pattern names
- Quick cross-reference to related concepts
- Ideal for decision-making: "Do I need Shadow Sync here?"

**Deep Learning (Lessons-Learned):**
- Full narrative and context (5-10 minutes)
- Root cause analysis and debugging journey
- Replication steps and test cases
- Ideal for understanding: "Why did this fail?" and "How do I prevent it?"

**Together:**
```
Quick lookup problem: "Should I apply Shadow Sync?"
    ↓
Knowledge Graph: "YES - whenever you update optimization-tools/"
    ↓
Need deeper understanding: "Why is this pattern important?"
    ↓
Click link to Lesson: Read full v8.5.2 failure story, root cause, prevention
    ↓
Future developer: Understands not just WHAT to do but WHY and HOW
```

### What Doesn't Work: Replacing Lessons with Knowledge Graph

❌ **Bad Approach:**
```markdown
### Shadow Sync Protocol
Enforce three-tier sync when updating modular files. See docs for details.
```
- Too brief, no context for understanding
- Reader doesn't understand WHY this matters
- No debugging guidance when something goes wrong
- Difficult to onboard new developers on complex concepts

---

## Maintenance

### Regular Sync (Recommended Monthly)

```bash
# Check for orphaned or broken entries
/update-knowledge-graph --sync-all --show-updates

# Review and fix any broken links
```

### When to Add New Entries

**Automatically suggested when:**
- New lesson-learned created without existing knowledge entry
- ADR formalizes a pattern not yet in knowledge graph
- Session summary identifies recurring pattern

**Manual triggers:**
- Repeating question or confusion across sessions
- New tool/skill/process adopted
- Architecture decision with broad impact

---

## Integration with Other Skills

**Creates entries from:**
- `/lesson-learned` - Automatically suggests knowledge graph update
- `/patch` - If fixing complex issues, suggests new pattern entry
- `/session-summary` - Auto-identifies patterns and suggests knowledge graph addition

**Feeds into:**
- `/recall` - Uses knowledge graph to find related lessons
- `/enforce-shadow-sync` - Verifies patterns are being followed
- Documentation updates - Knowledge entries get cited in decision docs

---

## Troubleshooting

### Problem: Links Are Broken

**Symptom:**
```
⚠️ Broken link: [Shadow_Sync_Protocol_v8.5.3.md](../lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md)
   File not found at: docs/lessons-learned/architecture/Shadow_Sync_Protocol_v8.5.3.md
```

**Solution:**
```bash
# Verify file exists
find docs -name "Shadow_Sync_Protocol_v8.5.3.md"

# Update path in knowledge entry if needed
# Or create missing lesson file
```

### Problem: Duplicate Entries

**Symptom:**
```
Shadow Sync Protocol appears in both patterns.md and architecture.md
```

**Solution:**
```bash
# Consolidate to primary location (usually patterns/)
# Remove from secondary location
# Update cross-references
# Run: /update-knowledge-graph --sync-all
```

### Problem: Entry Is Too Generic

**Symptom:**
```
Quick Reference section is 50+ lines, not scannable
```

**Solution:**
```bash
# Extract overly detailed content to lesson-learned instead
# Keep knowledge entry to: problem, solution, when to use, 3-4 key points
# Link to lesson for detailed explanation
```

---

**Created:** 2026-01-16
**Version:** 1.0
**Purpose:** Keep knowledge graph synchronized with lessons-learned via extraction and linking
**Architecture:** LEVERAGE lessons (not replace) - quick ref + deep dive together
**Success Criteria:** All recent lessons have corresponding quick-reference knowledge entries with valid bidirectional links
