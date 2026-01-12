# JD Re-Comparison Protocol - Phase 3

**Version:** 6.5.1 <!-- v6.5.1 Change: Release synchronization -->
**Created:** 2025-12-28
**Purpose:** Re-run JD comparison with updated job history and generate diff showing improvements

---

## Overview

This protocol enables users to re-compare their updated job history against a previously analyzed job description, showing what has changed since the last comparison. This is useful when:
- User adds a new position
- User updates existing positions with new achievements
- User wants to see if their profile improved for a specific JD

**Key Features:**
- Cached JD storage for fast re-comparison
- Diff generation showing improvements/regressions
- Score delta calculation
- Versioned comparison history
- No need to re-paste JD

---

## Trigger Scenarios

### Scenario 1: User Says "Compare Again"

```
User: "I updated my job history. Can you compare me to that Google PM job again?"

System:
  1. Detect intent: re-comparison requested
  2. Search JD cache for "Google PM"
  3. If found → Load cached JD, proceed with re-comparison
  4. If not found → Ask user to paste JD or provide more details
```

---

### Scenario 2: User Just Added/Edited Position

```
User: "add position" → [completes add workflow]

System:
  "✅ Position added. Would you like to re-compare to a previous job description
     to see how your updated profile matches?"

User: "yes"

System:
  1. List recent JD comparisons from cache
  2. User selects which JD to re-compare
  3. Proceed with re-comparison
```

---

### Scenario 3: User Provides JD Identifier

```
User: "Re-run the TechCorp Senior PM comparison"

System:
  1. Parse identifier: company="TechCorp", title="Senior PM"
  2. Search JD cache for matching entry
  3. If found → Load cached JD, proceed with re-comparison
  4. If not found → Ask user to paste JD again
```

---

## JD Cache System

### Cache Structure

```
CACHE_LOCATION: /mnt/project/jd_parsed/

FILE_NAMING: [company]_[job_title]_[date].json

Example:
  google_senior_product_manager_2025_12_20.json
  techcorp_data_engineer_2025_12_15.json
```

### Cache File Format

```json
{
  "cache_metadata": {
    "company": "Google",
    "job_title": "Senior Product Manager",
    "cached_date": "2025-12-20T15:30:00Z",
    "comparison_count": 2,
    "last_comparison_date": "2025-12-28T10:15:00Z"
  },
  "jd_parsed": {
    "company": "Google",
    "job_title": "Senior Product Manager",
    "location": "San Francisco, CA",
    "work_lifestyle": "Hybrid",
    "skills_needed": ["SQL", "Python", "Agile", "JIRA"],
    "skills_wanted": ["AWS", "Kubernetes"],
    "soft_skills_needed": ["Leadership", "Communication"],
    "soft_skills_wanted": ["Stakeholder management"],
    ...
    [full JD parsing output]
  },
  "comparison_history": [
    {
      "comparison_date": "2025-12-20T15:30:00Z",
      "job_history_version": "v2.0_2025_12_20",
      "match_score": 72,
      "matched_count": 10,
      "partial_count": 3,
      "missing_count": 3
    },
    {
      "comparison_date": "2025-12-28T10:15:00Z",
      "job_history_version": "v2.0_2025_12_28",
      "match_score": 81,
      "matched_count": 12,
      "partial_count": 2,
      "missing_count": 2
    }
  ]
}
```

---

## Re-Comparison Workflow

### Step 1: Identify JD to Re-Compare

#### Option A: User Provides Identifier

```
User input: "Re-compare to Google PM"

PARSE identifier:
  - company = "Google"
  - job_title = "PM" OR "Product Manager" (normalize)

SEARCH cache:
  - Look for files matching company + job_title (fuzzy match)
  - Return matches:
    "google_senior_product_manager_2025_12_20.json"
    "google_product_manager_2025_11_15.json"

IF multiple matches:
  DISPLAY: "I found 2 cached JDs for Google PM. Which one?
    1. Senior Product Manager (compared on 2025-12-20)
    2. Product Manager (compared on 2025-11-15)"

  User selects → Load that cached JD

IF no match:
  "I don't have a cached JD for Google PM. Please paste the job description."
```

---

#### Option B: List Recent Comparisons

```
System offers: "Which JD would you like to re-compare?

Recent comparisons:
  1. Google | Senior Product Manager (last compared: 2025-12-20, score: 72)
  2. TechCorp | Data Engineer (last compared: 2025-12-15, score: 65)
  3. Salesforce | PM (last compared: 2025-12-10, score: 78)

Enter number (1-3):"

User selects → Load that cached JD
```

---

### Step 2: Load Cached JD

```
LOAD: /mnt/project/jd_parsed/[selected_file].json

cached_jd = JSON.parse(file_contents)

EXTRACT:
  - jd_parsed (full parsing schema)
  - cache_metadata (for display)
  - comparison_history (for diff generation)

DISPLAY to user:
  "Found your comparison from [cached_date]. Re-running with updated job history..."
```

---

### Step 3: Load Current Job History

```
LOAD: claude_generated_job_history_summaries_v2.txt

current_job_history = parse(file_contents)

EXTRACT:
  - All positions
  - Aggregated hard/soft skills
  - Total years of experience
  - Last updated date
```

---

### Step 4: Run Evidence Matching

```
Use evidence matching protocol (optimization-tools/bullet-optimizer/evidence-matching.md):

FOR EACH requirement in cached_jd.jd_parsed:
  1. Search current_job_history for evidence
  2. Determine status (Matched/Partial/Missing)
  3. Collect evidence citations
  4. Generate gap rationale

OUTPUT: current_analysis
```

---

### Step 5: Load Previous Analysis for Diff

```
IF comparison_history exists AND has at least 1 previous comparison:
  previous_comparison = comparison_history[comparison_history.length - 1]

  LOAD previous analysis from cache or regenerate:
    Option A: If full analysis cached → Load
    Option B: If only summary cached → Note that detailed diff unavailable

  previous_analysis = ...
```

---

### Step 6: Generate Diff

```
Compare current_analysis to previous_analysis:

IMPROVEMENTS = []
REGRESSIONS = []
NO_CHANGE = []

FOR EACH requirement:
  previous_status = previous_analysis[requirement].status
  current_status = current_analysis[requirement].status

  IF current_status better than previous_status:
    IMPROVEMENTS.append({
      requirement,
      previous_status,
      current_status,
      new_evidence: current_analysis[requirement].evidence,
      reason: Explain what changed (new position? updated achievement?)
    })

  ELSE IF current_status worse than previous_status:
    REGRESSIONS.append({
      requirement,
      previous_status,
      current_status,
      reason: Explain why (removed position? edited achievement?)
    })

  ELSE:
    NO_CHANGE.append(requirement)

SCORE_DELTA = current_analysis.match_score - previous_analysis.match_score
```

---

### Step 7: Output Diff Report

```
========================================
CHANGES SINCE LAST COMPARISON
========================================

Previous comparison: [previous_date]
Current comparison: [current_date]
Job history updated: [last_updated_date]

---

IMPROVEMENTS ([count]):

✓ [MISSING → MATCHED] Salesforce
  New evidence: "Implemented Salesforce integration handling 5K leads/month"
  Source: Acme Corp | PM (2024-Present)
  Reason: Added new position with Salesforce experience

✓ [PARTIAL → MATCHED] Python
  Updated evidence: Now explicit in hard_skills_demonstrated
  Reason: Added "Python" keyword to skills section

✓ [MISSING → PARTIAL] AWS
  New evidence: "Managed AWS EC2 instances for development environment"
  Source: Acme Corp | PM (2024-Present)
  Reason: New position includes AWS usage (partial match for "AWS Solutions Architect")

---

REGRESSIONS ([count]):

⚠ [MATCHED → PARTIAL] Kubernetes
  Previous evidence: "Managed K8s clusters for production app"
    → TechCorp | DevOps Engineer (2020-2022)
  Current status: Removed position
  Recommendation: Consider re-adding Kubernetes to skills if still relevant

---

NO CHANGE ([count]):

[MATCHED] SQL, Agile, Leadership, Communication
[MISSING] Terraform, Docker
[PARTIAL] Machine Learning

---

OVERALL SCORE:

Previous: [previous_score]/100 ([previous_date])
Current: [current_score]/100 ([current_date])

**Improvement: +[delta] points (+[percentage]%)**
OR
**Decline: -[delta] points (-[percentage]%)**

---

BLOCKING GATES:

[Previous]
  ✓ Hard Skill Deficit: PASS
  ✓ Match Score: PASS
  ✓ Location: PASS

[Current]
  ✓ Hard Skill Deficit: PASS
  ✓ Match Score: PASS
  ✓ Location: PASS

All gates still passing. No new blockers.

========================================
```

---

### Step 8: Update Cache with New Comparison

```
Add new comparison to history:

comparison_history.append({
  comparison_date: current_date,
  job_history_version: "v2.0_" + current_date,
  match_score: current_score,
  matched_count: current_matched,
  partial_count: current_partial,
  missing_count: current_missing
})

cache_metadata.comparison_count += 1
cache_metadata.last_comparison_date = current_date

SAVE: /mnt/project/jd_parsed/[cached_file].json
```

---

### Step 9: Offer Next Actions

```
"✅ Re-comparison complete. Your match score improved by [delta] points.

Would you like to:
1. Generate customized professional summary for this JD (if score >= 50)
2. View detailed gap analysis (full requirement-by-requirement breakdown)
3. Compare to a different JD
4. Add another position to improve your profile further

Enter 1-4 or tell me what you'd like to do."
```

---

## Cache Management Commands

### List Saved JDs

```
User: "List saved JDs" OR "Show my cached comparisons"

System:
  SCAN: /mnt/project/jd_parsed/
  LIST: All cached JD files with metadata

  OUTPUT:
  "You have [N] cached job descriptions:

  1. Google | Senior Product Manager
     - First compared: 2025-12-20
     - Last compared: 2025-12-28
     - Comparison count: 2
     - Latest score: 81/100

  2. TechCorp | Data Engineer
     - First compared: 2025-12-15
     - Last compared: 2025-12-15
     - Comparison count: 1
     - Latest score: 65/100

  3. Salesforce | PM
     - First compared: 2025-12-10
     - Last compared: 2025-12-10
     - Comparison count: 1
     - Latest score: 78/100"
```

---

### Delete Cached JD

```
User: "Delete Google PM comparison" OR "Clear TechCorp cache"

System:
  1. Parse identifier (company + job_title)
  2. Find matching cache file
  3. CONFIRM: "Are you sure you want to delete the cached JD for [Company] | [Title]?
              This will remove comparison history. Type 'yes' to confirm."
  4. If yes → Delete file
  5. CONFIRM: "✅ Deleted cached JD for [Company] | [Title]"
```

---

### Clear All Cache

```
User: "Clear JD cache" OR "Delete all cached JDs"

System:
  WARN: "⚠️  This will delete ALL cached job descriptions ([N] files).
         You'll need to re-paste JDs for future comparisons.

         Are you sure? Type 'yes' to confirm."

  If yes:
    DELETE: All files in /mnt/project/jd_parsed/
    CONFIRM: "✅ Cleared JD cache. All [N] cached JDs removed."
```

---

## Edge Cases & Error Handling

### Case 1: Cached JD Not Found

```
User: "Re-compare to Apple PM"

System searches cache → No match

RESPONSE:
  "I don't have a cached job description for Apple PM.

  This could mean:
  - You haven't analyzed this JD before
  - The company or job title doesn't match exactly

  Options:
  1. Paste the Apple PM job description (I'll analyze and cache it)
  2. List all cached JDs to see what I have
  3. Try a different search term

  What would you like to do?"
```

---

### Case 2: Multiple Matches for Identifier

```
User: "Re-compare to PM role"

System searches cache → Multiple matches (generic title)

RESPONSE:
  "I found 3 cached JDs with 'PM' in the title:

  1. Google | Senior Product Manager (2025-12-20, score: 81)
  2. Salesforce | Product Manager (2025-12-10, score: 78)
  3. TechCorp | Project Manager (2025-12-05, score: 62)

  Which one would you like to re-compare? Enter 1-3:"
```

---

### Case 3: Job History Not Updated Since Last Comparison

```
User: "Re-compare to Google PM"

System checks:
  - Previous comparison date: 2025-12-28
  - Job history last updated: 2025-12-28 (same date)

WARN:
  "Your job history hasn't been updated since the last comparison (2025-12-28).
   Re-comparing will produce the same results.

   Would you like to:
   1. Proceed anyway (to review previous results)
   2. Add/edit a position first
   3. Cancel

   Enter 1-3:"
```

---

### Case 4: Cache File Corrupted

```
System loads cache file → JSON parse error

RESPONSE:
  "There was an error loading the cached JD for [Company] | [Title].
   The cache file may be corrupted.

   Options:
   1. Delete the corrupted cache and re-paste the JD
   2. Cancel and try a different JD

   Enter 1 or 2:"
```

---

## Versioned Comparison History

### Purpose

Track how user's profile evolves over time for the same JD:

- Comparison 1 (2025-12-20): Score 72 → Missing: Salesforce, AWS
- User adds position with Salesforce experience
- Comparison 2 (2025-12-28): Score 81 → Matched: Salesforce, Still missing: AWS
- User adds AWS to skills section
- Comparison 3 (2025-12-30): Score 85 → All matched except Terraform

---

### Visualization (Future Enhancement)

```
Score over time for "Google | Senior PM":

85 |                    ●
80 |              ●
75 |
70 |    ●
65 |
   +------------------------
     12/20   12/28   12/30

Key changes:
- 12/28: Added Salesforce experience
- 12/30: Added AWS to skills
```

---

## Integration with Other Workflows

### After Adding Position → Auto-Offer Re-Comparison

```
User completes incremental-updates.md → Adds new position

System:
  "✅ Position added.

  [If recent JD comparisons exist:]
  You recently compared your profile to:
  - Google | Senior PM (score: 72)
  - TechCorp | Data Engineer (score: 65)

  Would you like to re-compare to see how this new position improves your match?

  Enter JD number or 'skip':"
```

---

### After Re-Comparison → Offer Summary Customization

```
Re-comparison completes → Score >= 50

System:
  "Your match score is now [score]/100 for [Company] | [Title].

  Would you like me to generate a customized professional summary for this JD?"

  → If yes, route to summary-generation.md (phase-4)
```

---

## Related Protocols

- **JD Parsing:** `optimization-tools/resume-analyzer/jd-parsing.md`
- **Evidence Matching:** `optimization-tools/bullet-optimizer/evidence-matching.md`
- **Incremental Updates:** `optimization-tools/job-fit-analyzer/incremental-updates.md`
- **Summary Generation:** `optimization-tools/narrative-generator/summary-generation.md` (future)

---

**Version History:**
- v1.0 (2025-12-28): Initial re-comparison workflow with caching and diff generation

---

**End of JD Re-Comparison Protocol**
