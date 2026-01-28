# Test Cases: Issue #79

**Issue:** GUI Customized Bullets Using Wrong Context
**Purpose:** Verify fix generates multi-position bullets with correct context

---

## Test Case 1: Multiple Positions

**Input:**
- Job History: 3 positions
  - Position 0: Software Engineer at Acme Corp (2020-2022)
  - Position 1: Senior Engineer at TechCo (2022-2024)
  - Position 2: Lead Engineer at StartupX (2024-Present)
- Job Description: Staff Engineer at BigCorp

**Expected Output:**
```json
{
  "customizedBullets": [
    {
      "position": "Software Engineer",
      "company": "Acme Corp",
      "dates": "2020-2022",
      "bullets": [...]
    },
    {
      "position": "Senior Engineer",
      "company": "TechCo",
      "dates": "2022-2024",
      "bullets": [...]
    },
    {
      "position": "Lead Engineer",
      "company": "StartupX",
      "dates": "2024-Present",
      "bullets": [...]
    }
  ]
}
```

**Bug Output (BEFORE FIX):**
```json
{
  "customizedBullets": [
    {
      "position": "Staff Engineer",
      "company": "BigCorp",
      "bullets": [...]
    }
  ]
}
```

**Verification Steps:**
1. Check customizedBullets is an array
2. Verify array has 3 objects (one per historical position)
3. Verify NO "Staff Engineer" or "BigCorp" in output
4. Verify each position has exact title/company/dates from job history

---

## Test Case 2: Chronology Depth Logic

**Input:**
- Current Year: 2026
- Position 0: 2022-Present (Gap: 0 years - RECENT)
- Position 1: 2019-2022 (Gap: 4 years - RECENT)
- Position 2: 2012-2017 (Gap: 9 years, Duration: 5 years - TENURE EXCEPTION)
- Position 3: 2010-2012 (Gap: 14 years, Duration: 2 years - EXCLUDE)

**Expected Output:**

| Position | Gap | Duration | Expected | Bullet Count |
|----------|-----|----------|----------|--------------|
| Position 0 | 0 years | N/A | INCLUDE | 3-5 |
| Position 1 | 4 years | N/A | INCLUDE | 3-5 |
| Position 2 | 9 years | 5 years | INCLUDE | 2-3 |
| Position 3 | 14 years | 2 years | EXCLUDE | 0 |

**Verification Steps:**
1. Verify all 3 positions included in output
2. Position 0 and 1 have 3-5 bullets each
3. Position 2 has 2-3 bullets
4. Position 3 is NOT in output
5. No position has 0 bullets

---

## Test Case 3: Keyword Evidence Check

**Input:**
- USE Keywords: ["Python", "AWS", "Kubernetes", "Docker"]
- Job History Content: "Created Python scripts using AWS Lambda. Deployed to Kubernetes."
- JD: Staff Engineer with Python, AWS, Kubernetes, Docker, Terraform

**Evidence Analysis:**

| Keyword | Found in History? | Expected Behavior |
|---------|------------------|------------------|
| Python | ✅ Yes | Incorporated with specific achievement |
| AWS | ✅ Yes | Incorporated with specific achievement |
| Kubernetes | ✅ Yes | Incorporated with specific achievement |
| Docker | ❌ No | Marked in `skippedNotEvidenced` |
| Terraform | Not mentioned | Would be skipped if in USE list |

**Expected Output JSON:**
```json
{
  "keywordCoverageReport": {
    "successfullyIncorporated": [
      { "keyword": "Python", "location": "Position 0, Bullet 1" },
      { "keyword": "AWS", "location": "Position 0, Bullet 1" },
      { "keyword": "Kubernetes", "location": "Position 0, Bullet 2" }
    ],
    "skippedNotEvidenced": [
      { "keyword": "Docker", "reason": "No evidence in job history" },
      { "keyword": "Terraform", "reason": "No evidence in job history" }
    ]
  }
}
```

**Verification Steps:**
1. Verify Python, AWS, Kubernetes are in `successfullyIncorporated`
2. Verify Docker is in `skippedNotEvidenced`
3. Count = 3 incorporated, 1 skipped
4. No fabricated keywords in output

---

## Test Case 4: Professional Summary Guardrails

**Input:**
- Job History: 3 positions with bullets
- Generated Bullets: 9 bullets total (3 per position)

**Expected Behaviors:**

### Guardrail #3 (No Bullet Echoing)
- ❌ Summary should NOT have: "Python script creation for data processing"
- ✅ Summary should have: "Built scalable data solutions across 3 roles"

### Guardrail #13 (Metric Reconciliation)
- Summary: "Led 5 projects, improving efficiency by 30%, across 3 companies"
- ✅ All metrics ("5 projects", "30%", "3 companies") must appear in bullets

### Guardrail #15 (No Phrase Repetition)
- Search summary + all bullets for "3+ word phrases"
- ❌ NO phrase should appear 3+ times (e.g., "led cross-functional" can appear max 2x)

**Verification Steps:**
1. Summary doesn't repeat more than 2 sentences from bullets
2. All metrics in summary are present in bullets
3. No phrase appears 3+ times across summary+bullets

---

## Test Case 5: Portfolio Project Labeling

**Input:**
- Position: "Resume Optimizer" marked as "Independent" in job history
- Job Description: DevOps Engineer

**Expected Output:**
```json
{
  "customizedBullets": [
    {
      "position": "Resume Optimizer (Independent Project)",
      "company": "Personal Project",
      "dates": "2023-Present",
      "bullets": [...]
    }
  ]
}
```

**Verification Steps:**
1. Position title includes "(Independent Project)" suffix
2. Company is not misrepresented as W2 employment
3. No background check risk created

---

## Test Case 6: Character Limit Enforcement

**Input:**
- Generated bullets for 3 positions
- Target: ≤210 characters per bullet

**Verification:**
1. For each bullet, count characters
2. ALL bullets must be ≤210 characters
3. Example: "Architected microservices infrastructure using Kubernetes, reducing deployment time by 40% and improving system scalability across 3+ million daily active users." (140 chars) ✅

---

## Test Case 7: Verb Category Distribution

**Input:**
- 9 total bullets generated (3 per position)

**Expected Distribution (Target 13-27% per category):**

| Category | Count | % | Range | Status |
|----------|-------|---|-------|--------|
| Built | 2 | 22% | 13-27% | ✅ OK |
| Lead | 2 | 22% | 13-27% | ✅ OK |
| Managed | 2 | 22% | 13-27% | ✅ OK |
| Improved | 2 | 22% | 13-27% | ✅ OK |
| Collaborate | 1 | 11% | 13-27% | ⚠️ Below threshold |

**Verification:**
1. Count verbs in each generated bullet
2. Calculate % for each category
3. Flag any category <10% or >40%
4. Verify `verbCategory` field in JSON matches actual verb

---

## Integration Test: End-to-End

**Input:**
- Multi-position job history (3 positions with bullets)
- Complex job description
- User-selected keywords
- Fit score ≥ 50 (trigger for customization)

**Expected Outcome:**
1. ✅ 3-position output (all from job history)
2. ✅ All positions meet chronology depth criteria
3. ✅ Bullets use JD keywords with evidence
4. ✅ Summary doesn't echo bullets
5. ✅ All metrics traceable
6. ✅ Portfolio projects labeled
7. ✅ Character limits enforced
8. ✅ Verb distribution reasonable
9. ✅ No phrase repetition
10. ✅ Narrative fit verified (Guardrail #33)

**Manual Verification:**
- [ ] Read each bullet to verify context relevance
- [ ] Verify professional summary flows naturally
- [ ] Check keyword coverage report accuracy
- [ ] Verify UI displays all 3 positions
- [ ] Test copy/paste functionality
