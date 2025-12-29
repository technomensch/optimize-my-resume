# Terminal Prompt: Add Remote Work Classification Logic

Paste the following prompt into your Claude Code terminal:

---

## Task: Add Remote Work Classification to Mode 3 Fit Assessment

Add remote work classification logic to BOTH files without regenerating them:
1. `modes/mode-3-jd-comparison.md`
2. `PROJECT-INSTRUCTIONS.md`

### Requirements:

#### A. Add to Phase 1, Step 1 (extract_critical_requirements) - After line 82 in mode-3:

```xml
<work_location_requirements>
  Work arrangement and location constraints (e.g., "Remote", "Hybrid 3 days/week", "On-site required", "Remote - CA residents only", "Hybrid - must be within 50 miles of office")
</work_location_requirements>
```

#### B. Add to Red Flag Categorization - After line 91 in mode-3:

```xml
<location_red_flags priority="critical">
  - "Must be located in [specific state/city]" when user is elsewhere
  - "On-site required" when user seeks remote
  - "Hybrid X days/week" when user seeks fully remote
  - "Remote - [state] residents only" when user is in different state
  - "Relocation required" without relocation assistance mentioned
  - "Fake remote" indicators: "Remote during training, then on-site", "Remote but must come to office weekly"
</location_red_flags>
```

#### C. Add to Step 2 (compare_against_job_history) - After line 116 in mode-3:

Add new matching criteria:

```xml
<location_match>User's location preferences align with JD requirements (remote vs on-site, geographic restrictions)</location_match>
<location_mismatch>JD requires on-site/hybrid when user needs remote, OR geographic restrictions user cannot meet</location_mismatch>
```

#### D. Update Step 3 (calculate_preliminary_fit) - Modify core_qualifications section:

Change line 123-127 to:

```xml
<core_qualifications weight="50%">
  - Required qualifications match
  - Years of experience alignment
  - Role type match (BA, TW, PM, etc.)
  - Work location/arrangement alignment (remote/hybrid/on-site compatibility)
</core_qualifications>
```

#### E. Add Location-Specific Blocking Logic - New step after Step 4, around line 177:

```xml
<step number="5" name="location_blocking_gate">
  <purpose>Block early if fundamental location mismatch exists</purpose>

  <blocking_conditions>
    <condition priority="critical">
      IF JD requires "On-site" AND user profile indicates "Remote only"
      THEN STOP with Phase 3B output (fundamental mismatch)
    </condition>

    <condition priority="critical">
      IF JD has state residency requirement AND user is in different state AND no relocation planned
      THEN STOP with Phase 3B output (fundamental mismatch)
    </condition>

    <condition priority="high">
      IF JD is "Hybrid X days/week" AND user seeks "Fully remote" AND location is >50 miles from office
      THEN FLAG as yellow flag, reduce fit score by 10-15 points
    </condition>

    <condition priority="moderate">
      IF JD has "fake remote" indicators (e.g., "remote then on-site after 6 months")
      THEN FLAG as red flag, reduce fit score by 15-20 points
    </condition>
  </blocking_conditions>

  <output_when_blocked>
    ⚠️ **APPLICATION STOPPED - LOCATION MISMATCH**

    **Job:** [Job Title] at [Company]
    **Location Requirement:** [JD requirement]
    **Your Situation:** [User's location/preference]

    This role requires [on-site/hybrid/specific state residency], which conflicts with your [remote preference/current location]. This is a fundamental mismatch that cannot be addressed through resume optimization.

    **Recommendation:** Focus on roles that match your location preferences or clearly state they're open to remote workers in your location.
  </output_when_blocked>
</step>
```

---

### Implementation Instructions:

1. **For modes/mode-3-jd-comparison.md:**
   - Add sections A, B, C, D, E to Phase 1 as specified above
   - Use Edit tool to insert at the line numbers indicated
   - Preserve all existing XML structure and formatting

2. **For PROJECT-INSTRUCTIONS.md:**
   - Add the SAME content to the `<mode_3_pre_generation_assessment>` section (lines 88-192)
   - Insert at corresponding locations within that section
   - Maintain XML structure consistency

3. **Verification:**
   - Ensure work_location_requirements appears in what_to_extract
   - Ensure location_red_flags appears in categorization
   - Ensure location matching criteria added to Step 2
   - Ensure core_qualifications updated to include location alignment
   - Ensure Step 5 (location_blocking_gate) is added as new step

4. **Do NOT:**
   - Regenerate or rewrite entire files
   - Remove any existing content
   - Change line numbers of other sections
   - Alter existing XML tags or structure

---

**Confirm when complete and show the specific line ranges where edits were made.**
