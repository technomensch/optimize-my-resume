# Issue #28: Extract phase1-display-rules.md module (12K tokens)

**Status:** 📋 PLANNED  
**Type:** Refactor  
**Priority:** High  
**Created:** 2026-01-11  
**Last Updated:** 2026-01-11  
**Affected Files:** 
- PROJECT-INSTRUCTIONS.md (sections to extract)
- New file: phase1-display-rules.md

**Labels:** `modularization` `refactor` `high-priority` `token-optimization`

---

## Problem Description

PROJECT-INSTRUCTIONS.md contains ~12,000 tokens of Phase 1 display and formatting logic that is only needed when generating Phase 1 full analysis reports. This content is loaded in EVERY session, even when users are only optimizing bullets or doing simple tasks.

**Current State:**
- Phase 1 display logic: ~12K tokens
- Loaded: Every single session
- Used: Only in Phase 1 full analysis sessions (~40% of usage)
- Waste: 12K tokens in 60% of sessions

**Sections to Extract:**
1. Bullet color-coding system
2. Bullet metrics detection
3. Bullet display & grouping
4. Hiring manager perspective analysis
5. Job history summary generation
6. Job history export functionality
7. Per-bullet audit tables
8. Prioritized repairs summary

---

## Current Behavior

**Token Usage Per Session Type:**
| Session Type | Current | With Module | Savings |
|--------------|---------|-------------|---------|
| Simple bullet optimization | 85K | 47K | 45% |
| Phase 1 analysis | 85K | 59K | 30% |
| Phase 3 JD comparison | 85K | 67K | 21% |

**Problem:** Users optimizing 3 bullets load 12K tokens of display logic they'll never use.

---

## Expected Behavior

**With Modularization:**
- Core PROJECT-INSTRUCTIONS: Contains Phase 1 analysis logic ONLY
- phase1-display-rules.md: Contains display/formatting/output logic ONLY
- Load phase1-display-rules.md ONLY when generating Phase 1 reports

**Expected Token Usage:**
```
Simple task: 47K tokens (no display logic loaded)
Phase 1 analysis: 47K + 12K = 59K tokens (display logic loaded)
```

---

## Impact Assessment

**Who is affected:**
- [x] All users (token efficiency improvement)
- [x] Future developers (clearer code organization)

**Severity:**
- **High:** Highest single-file token savings (12K tokens)
- Blocks optimal token efficiency

**Benefits:**
- ✅ 45% token savings on simple sessions
- ✅ 30% token savings on Phase 1 sessions
- ✅ Clearer separation of concerns (analysis vs display)
- ✅ Easier to update display logic without touching analysis

---

## Root Cause Analysis

**Why is display logic in core instructions?**

Originally, PROJECT-INSTRUCTIONS was designed as a monolithic file. Display logic and analysis logic were not separated because:
1. Easier to write everything in one place
2. No token optimization concerns initially
3. No modularization strategy

**Now:** With 85K tokens total, modularization is essential for token efficiency.

---

## Proposed Solution

### Implementation Plan

**Step 1: Create phase1-display-rules.md**

**Content to extract from PROJECT-INSTRUCTIONS.md:**

```markdown
# Phase 1 Display and Formatting Rules

## Bullet Color-Coding System
[Extract from line ~XXX]
- getCategoryColor() logic
- Color mappings (Built=Blue, Lead=Orange, etc.)
- Implementation rules

## Bullet Metrics Detection
[Extract from line ~XXX]
- Metric types recognized
- Detection algorithm
- Display format (✓ or -)

## Bullet Display & Grouping
[Extract from line ~XXX]
- Grouping logic
- Position header format
- Bullet display within position
- Position summary

## Hiring Manager Perspective
[Extract from line ~XXX]
- Analysis methodology
- Title interpretation
- Seniority assessment
- Output structure
- Critical behaviors

## Job History Summary Generation
[Extract from line ~XXX]
- Auto-generation process
- Display format in Phase 1
- Download export formats
- File naming conventions

## Job History Export Functionality
[Extract from line ~XXX]
- Download options (XML, Markdown, ZIP)
- Button placement
- Technical requirements
- User feedback

## Per-Bullet Audit Rules
[Extract from line ~XXX]
- Rendering requirements
- Analysis table structure
- Per-bullet recommendations
- Example displays

## Prioritized Repairs Summary
[Extract from line ~XXX]
- Severity levels
- Executive summary integration
- Final summary section
```

**Time Estimate:** 1.5 hours
- Extract content: 30 min
- Format as standalone file: 30 min
- Test: 30 min

---

**Step 2: Update PROJECT-INSTRUCTIONS.md**

**Replace extracted sections with:**

```xml
<!-- ========================================================================== -->
<!-- PHASE 1: DISPLAY AND FORMATTING RULES                                      -->
<!-- ========================================================================== -->

<phase1_display_rules>
  <reference priority="high">
    For complete display, formatting, and output generation rules,
    see: /mnt/project/phase1-display-rules.md
  </reference>
  
  <when_to_load>
    Load this module when:
    - Generating Phase 1 full analysis report
    - User asks for detailed resume analysis
    - Creating job history summaries
    - Displaying hiring manager perspective
    - Generating downloadable exports
  </when_to_load>
  
  <contains>
    - Bullet color-coding system (verb categories)
    - Metrics detection and indicators
    - Display & grouping rules
    - Hiring manager perspective analysis
    - Job history summary generation
    - Export functionality (XML, Markdown, ZIP)
    - Per-bullet audit tables
    - Prioritized repairs summary
  </contains>
  
  <note>
    Display rules apply to OUTPUT formatting only.
    Analysis logic remains in core PROJECT-INSTRUCTIONS.
  </note>
</phase1_display_rules>
```

**Time Estimate:** 15 minutes

---

**Step 3: Test Integration**

**Test Cases:**
1. Phase 1 analysis: Verify display rules load correctly
2. Simple bullet optimization: Verify display rules NOT loaded
3. Phase 3 JD comparison: Verify selective loading
4. Token count validation

**Time Estimate:** 30 minutes

---

## Testing Strategy

**Test Case 1: Phase 1 Full Analysis**
```
User: "Analyze my resume" [pastes resume]
Expected: Claude loads phase1-display-rules.md automatically
Expected: Full analysis report displays correctly
Expected: All formatting rules applied (colors, metrics, etc.)
```

**Test Case 2: Simple Bullet Optimization**
```
User: "Optimize these 3 bullets" [pastes bullets]
Expected: Claude does NOT load phase1-display-rules.md
Expected: Token usage ~47K (not 59K)
```

**Test Case 3: Reference Check**
```
Verify: PROJECT-INSTRUCTIONS.md references phase1-display-rules.md correctly
Verify: Claude can find and read the module file
Verify: No broken references
```

**Success Criteria:**
- [ ] phase1-display-rules.md created (12K tokens)
- [ ] PROJECT-INSTRUCTIONS.md updated with reference
- [ ] Phase 1 analysis still works correctly
- [ ] Simple tasks don't load display module
- [ ] Token savings validated (12K on simple tasks)

---

## Rollback Plan

**If extraction causes issues:**

```bash
# Restore original PROJECT-INSTRUCTIONS.md from backup
cp PROJECT-INSTRUCTIONS.md.backup PROJECT-INSTRUCTIONS.md

# Delete problematic module
rm phase1-display-rules.md

# Revert Git commit
git revert [commit-hash]
```

---

## Related Issues

**Depends On:**
- Issue #27 - Rename phases folder (must be resolved first)

**Related:**
- Issue #29 - Extract phase3-fit-assessment.md
- Issue #30 - Extract quality-gates-guardrails.md
- Issue #31 - Extract job-history-template-system.md
- Issue #32 - Update PROJECT-INSTRUCTIONS with references

**Blocks:**
- Issue #32 - Cannot complete until this extraction done

---

## Progress Log

### 2026-01-11 - Planning
- Created Issue #28
- Defined scope: 12K tokens of display logic
- Estimated time: 1.5 hours
- Identified 8 sections to extract

---

## Resolution

**Date Resolved:** [Pending]  
**Solution Implemented:** [Pending]  
**Files Changed:** [Pending]

**Commit:** [Pending]  
**Branch:** feature/issue-28-extract-phase1-display  
**Merged To:** [Pending]

**Verification:**
- [Pending]

---

**Created:** 2026-01-11  
**Last Updated:** 2026-01-11  
**Version:** 1.0  
**Estimated Time:** 1.5 hours  
**Token Savings:** 12,000 tokens (45% on simple sessions)
