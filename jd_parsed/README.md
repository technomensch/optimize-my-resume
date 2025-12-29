# JD Cache Directory

**Purpose:** Stores parsed job descriptions for re-comparison workflow

**Created:** Phase 3 (v6.0.3)
**Used by:** phases/phase-3/re-comparison.md

---

## How It Works

When you run Mode 3 (JD Comparison), the system:
1. Parses the job description using the 17-point schema
2. Saves the parsed JD to this directory for future reference
3. Stores versioned comparisons (v1, v2, v3) as you update your job history

## File Naming Convention

```
[company]_[job_title]_parsed.json
[company]_[job_title]_v2_parsed.json
```

**Example:**
```
Google_Product_Manager_parsed.json
Google_Product_Manager_v2_parsed.json
```

## Cache Management

You can manage cached JDs with these commands:

- `"List saved JDs"` - Show all cached comparisons with dates
- `"Delete Google PM JD"` - Remove specific cached JD
- `"Clear JD cache"` - Delete all cached JDs

## When to Use Re-Comparison

After updating your job history (adding a new position, editing skills, etc.), you can re-run a previous JD comparison:

1. Say: `"Compare to that Google PM role again"`
2. System loads the cached JD (skips re-parsing)
3. Runs evidence matcher with CURRENT job history
4. Shows diff output:
   - **Improvements:** Missing → Matched
   - **No change:** Still Matched, Still Missing
   - **Score delta:** 72% → 81%

## Benefits

- **Saves time:** No need to re-paste the JD
- **Track progress:** See how your profile improves over time
- **Version history:** Keep record of multiple comparisons
- **Diff tracking:** Understand exactly what changed

---

**Note:** This directory is gitignored. Cached JDs are local to your machine and not shared via git.
