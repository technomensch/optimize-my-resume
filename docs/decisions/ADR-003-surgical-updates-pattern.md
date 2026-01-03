# ADR-003: Surgical Updates Pattern

**Status:** Accepted
**Date:** 2026-01-02
**Deciders:** technomensch
**Tags:** #pattern #updates #version-control #content-management #preservation

**Related:**
- **Supersedes:** None (pattern evolution from practice)
- **Superseded by:** N/A
- **Related Lessons:** [ID-Based Architecture](../lessons-learned/architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)
- **Related ADRs:** ADR-001 (Dual-Format Documentation)
- **Related Skills:** `/update-history`

---

## Context and Problem Statement

When maintaining long-form structured documents (job histories, resumes, documentation), we face a fundamental tension between making updates and preserving existing quality content.

**The Problem:**
- **Full Rewrites** lose carefully crafted details, metrics, and phrasing
- **Manual Edits** are error-prone and miss opportunities for improvement
- **No Updates** means content becomes stale and outdated
- **LLMs Default to Rewriting** - Claude often regenerates entire sections rather than making targeted changes

**Specific Context:**
Managing job history files with 5-10 positions, each with detailed achievements, metrics, and skills. Updates include:
- Adding new achievements to existing positions
- Updating metrics (e.g., "10+ releases" → "13+ releases")
- Adding new skills/technologies
- Correcting company names or titles
- Enhancing existing bullet points

**Key Question:**
Should we allow full rewrites, mandate surgical updates, or use a hybrid approach?

---

## Decision Drivers

1. **Content Preservation** - Existing quality content must not be lost
2. **Version History** - Need to track what changed and why
3. **Efficiency** - Don't waste tokens rewriting unchanged content
4. **Quality** - Improvements should enhance, not replace
5. **LLM Behavior** - Default is to rewrite; need explicit constraints
6. **Maintainability** - Updates should be reviewable and reversible

---

## Considered Options

### Option 1: Full Rewrites (LLM Default)
**Approach:** Regenerate entire sections or documents from scratch

**Pros:**
- Fresh perspective
- Consistent tone throughout
- Easier for LLM (no constraints)
- Can optimize structure

**Cons:**
- Loses carefully crafted content
- Loses specific metrics and details
- High token cost (rewrites everything)
- Hard to review changes (entire section changed)
- Regression risk (quality content removed)

**Example:**
```
Before: "Led sprint planning across 3 teams (15 developers) achieving 92% velocity accuracy"
After:  "Managed sprint planning for development teams"
❌ Lost metrics: 3 teams, 15 developers, 92% accuracy
```

---

### Option 2: Manual-Only Updates (No LLM)
**Approach:** Human edits only, no LLM assistance

**Pros:**
- Full control over changes
- No unexpected rewrites
- Explicit change tracking

**Cons:**
- Time-consuming
- Error-prone (typos, inconsistencies)
- Misses optimization opportunities
- No LLM assistance for phrasing

---

### Option 3: Surgical Updates (Targeted Changes)
**Approach:** LLM makes targeted, explicit changes to specific locations

**Pros:**
- Preserves existing quality content
- Clear what changed
- Efficient (updates only what needs changing)
- Reviewable (specific diffs)
- Enhances rather than replaces

**Cons:**
- Requires explicit constraints for LLM
- More complex instruction set
- May not optimize overall structure
- Requires careful change identification

**Example:**
```
Before:
<hard_skills>
  - Azure DevOps
  - Sprint Planning
</hard_skills>

After (Surgical):
<hard_skills>
  - Azure DevOps
  - Azure DevOps Pipelines (CI/CD)  ← ADDED
  - Sprint Planning
  - Power Platform Pipelines  ← ADDED
</hard_skills>

✅ Preserved existing skills
✅ Added new skills in context
✅ Maintained structure
```

---

### Option 4: Hybrid (Surgical by Default, Rewrites on Request)
**Approach:** Use surgical updates as default, allow rewrites when explicitly requested

**Pros:**
- Best of both worlds
- Flexibility when needed
- Safe default (surgical)
- Can restructure when beneficial

**Cons:**
- Requires clear rules for when to rewrite
- More complex decision tree
- Risk of confusion

---

## Decision Outcome

**Chosen option:** **"Option 3: Surgical Updates (Targeted Changes) as Mandatory Default"**

**Rationale:**

Content preservation is paramount. Years of carefully crafted job history content, metrics, and phrasing must not be lost to convenience. The surgical updates pattern enforces this through explicit constraints.

### Surgical Updates Principles

**✅ DO (Surgical Changes):**
1. **Add** new content to existing sections
2. **Enhance** existing bullet points (add detail, not replace)
3. **Insert** new achievements/responsibilities in context
4. **Update** specific metrics (precise replacements)
5. **Preserve** all existing detail unless explicitly removing

**❌ DON'T (Full Rewrites):**
1. Rewrite entire sections from scratch
2. Remove existing content (unless explicitly requested)
3. Change structure/order without reason
4. Lose existing metrics or details
5. "Optimize" phrasing that's already good

---

## Implementation Guidelines

### Version Management

**Semantic Versioning for Content:**
```
v7.0 → v7.1  (MINOR: added achievements, updated metrics)
v7.1 → v7.1.1  (PATCH: typo fixes)
v7.0 → v8.0  (MAJOR: added/removed position, restructuring)
```

**Copy Before Modify:**
```bash
# Never modify v7.0 in place
cp v7.0.txt v7.1.txt

# Apply surgical updates to v7.1.txt
# Original v7.0 preserved
```

### Change Identification

**Before making updates, explicitly list them:**
```
Based on conversation, I identified these surgical updates:

Position 3 (DevOps Engineer):
  - ADD: "Power Platform Pipelines" to hard_skills
  - UPDATE: "10+ releases" → "13+ releases" in metrics
  - ADD: New achievement about JSON automation

Position 5 (Architect):
  - UPDATE: Company name "Contractor" → "Foxhole Technology"
  - ADD: RFP automation achievement

Is this correct? (y/n/modify)
```

### Surgical Update Format

**Clear annotations in diff:**
```xml
<!-- SURGICAL UPDATE v7.0 → v7.1 -->
<position id="3">
  <hard_skills>
    - Azure DevOps (existing)
    - Azure DevOps Pipelines (CI/CD)  ← ADDED v7.1
    - Sprint Planning (existing)
    - Power Platform Pipelines  ← ADDED v7.1
  </hard_skills>

  <metrics>
    - 13+ successful releases  ← UPDATED from "10+" (v7.1)
    - 80% deployment time reduction (existing)
  </metrics>
</position>
```

### Review Process

**After surgical updates, provide diff summary:**
```
✅ Surgical updates applied to v7.1:

Changed sections:
  - Position 3: Added 2 skills, updated 1 metric
  - Position 5: Updated company name, added 1 achievement

Preserved content:
  - All existing achievements intact
  - All existing metrics preserved
  - All existing phrasing maintained

Total additions: 3 items
Total modifications: 2 items
Total removals: 0 items
```

---

## Validation Rules

**Automated validation checks:**

```python
# scripts/validate_surgical_update.py

def validate_surgical_update(old_file, new_file):
    """Ensure update was surgical, not rewrite"""

    old_content = read_file(old_file)
    new_content = read_file(new_file)

    # Count preserved content
    preserved = count_exact_matches(old_content, new_content)
    preservation_rate = preserved / total_lines(old_content)

    # Surgical update should preserve 80%+ of content
    if preservation_rate < 0.80:
        raise ValueError(f"Too many changes ({preservation_rate:.0%} preserved). "
                        "This looks like a rewrite, not surgical update.")

    # Check for lost metrics
    old_metrics = extract_metrics(old_content)
    new_metrics = extract_metrics(new_content)
    lost_metrics = old_metrics - new_metrics

    if lost_metrics:
        raise ValueError(f"Lost metrics: {lost_metrics}")

    return {
        "preservation_rate": preservation_rate,
        "additions": count_additions(old_content, new_content),
        "modifications": count_modifications(old_content, new_content),
        "removals": count_removals(old_content, new_content)
    }
```

---

## Consequences

### Positive

✅ **Content Preservation** - Years of quality content never lost
✅ **Clear Changes** - Explicit diffs show exactly what changed
✅ **Reviewable** - Easy to verify correctness of updates
✅ **Efficient** - Don't rewrite unchanged content (saves tokens)
✅ **Version History** - Can track evolution of content over time
✅ **Reversible** - Can roll back to previous version if needed

### Negative

⚠️ **Constraints on LLM** - Must explicitly instruct surgical behavior
⚠️ **Structural Debt** - Can't easily restructure without rewrites
⚠️ **Complexity** - More complex than "regenerate everything"
⚠️ **Instruction Overhead** - Need detailed surgical update instructions

### Neutral

🔵 **Structure Preservation** - Good if structure is good, bad if it needs changing
🔵 **Incremental Evolution** - Content evolves slowly over many versions

---

## Examples

### Good: Surgical Add
```xml
<!-- v7.0 -->
<key_achievements>
  - Led migration to containerized deployments
  - Automated testing pipeline
</key_achievements>

<!-- v7.1 - SURGICAL ADD -->
<key_achievements>
  - Led migration to containerized deployments
  - Automated testing pipeline
  - Implemented JSON-based RFP automation (saved 15 hours/week)  ← ADDED
</key_achievements>
```

### Good: Surgical Metric Update
```xml
<!-- v7.0 -->
<metrics>10+ successful releases</metrics>

<!-- v7.1 - SURGICAL UPDATE -->
<metrics>13+ successful releases</metrics>  ← UPDATED
```

### Bad: Full Rewrite
```xml
<!-- v7.0 -->
<key_achievements>
  - Led migration to containerized deployments (Docker/Kubernetes) reducing deployment time by 65%
  - Automated testing pipeline achieving 92% code coverage across 50+ microservices
  - Mentored 5 junior developers in DevOps practices
</key_achievements>

<!-- v7.1 - ❌ FULL REWRITE (BAD) -->
<key_achievements>
  - Containerization lead for infrastructure
  - Testing automation implementation
  - Developer mentoring and coaching
  - JSON automation for RFP process
</key_achievements>

❌ Lost: Docker/Kubernetes mention, 65% metric, 92% coverage, 50+ microservices, 5 developers
```

---

## Exceptions

**When full rewrites ARE appropriate:**

1. **Explicit Request** - User says "rewrite this section"
2. **Quality Issues** - Existing content is poor quality or incorrect
3. **Major Restructuring** - Schema changes require rewrite
4. **MAJOR Version** - v7 → v8 with position add/remove

**How to handle exceptions:**
```
Claude: "This change requires rewriting the entire section.

Before (v7.0):
[Show existing content]

After (v7.1 proposal):
[Show rewritten content]

Lost content:
- [List anything being removed]

This is a DEPARTURE from surgical updates. Proceed? (y/n)"
```

---

## Related Patterns

### ID-Based Architecture (Complementary)
ADR-003 (Surgical Updates) + ID-Based Architecture work together:
- IDs preserve references while content updates surgically
- Surgical updates preserve ID structure
- Both patterns minimize redundancy and preserve quality

### Dual-Format Documentation (Related)
Surgical updates apply to both formats:
- `.txt` (XML): Surgical updates preserve structure
- `.md` (Markdown): Surgical updates preserve phrasing

---

## Skills Integration

**The `/update-history` skill implements this pattern:**

```
/update-history chat-history/job_history_v7.txt

Claude:
1. Analyzes chat for requested changes
2. Lists surgical updates for confirmation
3. Determines version increment (MAJOR/MINOR/PATCH)
4. Copies v7.txt → v7.1.txt
5. Applies surgical updates only
6. Validates preservation rate
7. Generates markdown version
8. Summarizes changes
```

---

**Decision Date:** 2026-01-02
**Pattern Emerged:** 2025-12-10 (during v6.2.0 job history work)
**Formalized:** 2026-01-02
**Last Reviewed:** 2026-01-02
**Next Review:** 2026-04-02 (3 months, or when update pattern changes)
