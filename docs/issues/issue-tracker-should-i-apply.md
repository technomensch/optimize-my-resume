# Should-I-Apply WebUI - Issue Tracker

**Created:** 2026-01-18
**Version:** 1.2.0
**Status:** Active Development

---

## Issue Status Legend

- 🔴 **ACTIVE** - Currently being worked on
- 🟡 **PENDING** - Identified, not yet started
- 🟢 **RESOLVED** - Fixed and verified
- ⚪ **DEFERRED** - Postponed to future version

---

## Resolved Issues

### Issue #59: Results Export Functionality

**Status:** 🟢 RESOLVED (v1.1.0)
**Type:** ✨ Enhancement
**Priority:** Medium → Implemented
**Created:** 2026-01-18
**Resolved:** 2026-01-18

**Files Modified:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Added `downloadPdfReport()` function (~lines 560-950) |
| `Should-I-Apply-webgui.jsx` | Added Download button in results Actions section |

**Solution Implemented:**
- Added "Download PDF Report" button in results view
- PDF filename format: `<<CompanyName>>-<<JobTitle>>-Should_I_Apply_report.pdf`
- All sections automatically expanded in PDF
- Full styling preserved with dark theme
- Fallback to HTML download if popup blocked

---

### Issue #63: Simplified Input Options (UI Improvement)

**Status:** 🟢 RESOLVED (v1.1.0)
**Type:** 🎨 UI/UX
**Priority:** High
**Created:** 2026-01-18
**Resolved:** 2026-01-18

**Problem:** Two status boxes for "Job History Narrative" and "Resume" were confusing.

**Files Modified:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Added state: `inputMethod`, `projectFileName` |
| `Should-I-Apply-webgui.jsx` | Enhanced `detectContentType()` with XML job history detection |
| `Should-I-Apply-webgui.jsx` | Replaced status boxes with 3-option radio-style input selector |

**Solution Implemented:**
- Removed the two status boxes
- Added 3 clear input options:
  1. Use a file from project (with filename input)
  2. Upload a file (single upload accepting all formats)
  3. Paste content (with auto-detection)
- System auto-detects resume vs job history (including XML format)
- User never has to manually specify content type

---

## Open Issues

### Issue #79: GUI Customized Bullets Using Wrong Context

**Status:** 🔴 ACTIVE
**Type:** 🐛 Bug
**Priority:** High
**Created:** 2026-01-22
**GitHub Issue:** #79

**Problem Description:**
After job fit analysis, clicking "Optimize Your Application" generates bullets with:
- Job title from JD instead of job history
- Company from JD instead of job history
- Only 1 position instead of all positions

**Root Cause:**
Ambiguous prompt in `generateCustomizedContent()` (line 667-734). AI interprets instruction as generating bullets FOR the JD position, not FROM the job history positions.

**Current Behavior:**
```json
{
  "customizedBullets": [
    { "position": "Staff Engineer", "company": "BigCorp" }  // ❌ From JD
  ]
}
```

**Expected Behavior:**
```json
{
  "customizedBullets": [
    { "position": "Engineer", "company": "Acme" },          // ✅ From job history
    { "position": "Senior Engineer", "company": "TechCo" }, // ✅ From job history
    { "position": "Lead Engineer", "company": "StartupX" }  // ✅ From job history
  ]
}
```

**Affected Files:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Lines 655-734: Rewrite generation prompt with explicit multi-position instructions |
| `Should-I-Apply-local.jsx` | Same changes as webgui.jsx |

**Solution:**
- Rewrite opening statement to clarify "positions that meet chronology depth criteria"
- Make chronology depth logic step 2 (FILTER before generation)
- Add explicit instructions: "PARSE ALL POSITIONS", "DO NOT use JD's position/company"
- Add missing guardrails: #3, #13, #15, portfolio_employment_labeling, verb distribution
- Update character limit to ≤210 chars (ATS compliance)

**Module References:**
- `optimization-tools/bullet-optimizer/bo_bullet-generation-logic.md` (chronology_depth_logic)
- `optimization-tools/narrative-generator/ng_summary-generation.md` (Guardrails #3, #13, #15, #33)
- `optimization-tools/bullet-optimizer/bo_keyword_handling.md` (Guardrail #32)
- `core/format-rules.md` (character limits)
- `core/verb-categories.md` (distribution targets)

**Workaround:**
None - users must manually correct position titles and companies in generated output.

**Documentation:** [docs/issues/issue-79/](docs/issues/issue-79/)

---

### Issue #57: Binary File Content Extraction

**Status:** 🟡 PENDING
**Type:** 🐛 Bug / Enhancement
**Priority:** High
**Created:** 2026-01-18

**Problem Description:**
PDF and DOCX files are read as base64 and sent to Claude API, but the current implementation may not reliably extract text content from all binary formats.

**Current Behavior:**
- Files are read as base64 data URLs
- A note is appended indicating binary format
- Claude API attempts to process, but results may be inconsistent

**Expected Behavior:**
- Reliable text extraction from PDF and DOCX files
- Fallback messaging if extraction fails

**Affected Files:**
- Should-I-Apply-webgui.jsx (lines ~200-230, handleFileUpload function)

**Proposed Solution:**
1. Use pdf.js library for PDF text extraction in browser
2. Use mammoth.js for DOCX text extraction in browser
3. Add error handling for failed extractions
4. Provide user feedback on extraction status

**Workaround:**
Users can copy/paste resume text directly instead of uploading binary files.

---

### Issue #58: Check for Existing Project Files

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement
**Priority:** Medium
**Created:** 2026-01-18

**Problem Description:**
The project instructions specify:
> "This tool should also check to see if any of these already exist in the project as an uploaded file, and ask the user if that should be used, or if the user wants to upload a new one."

This feature was partially implemented in v1.1.0 (user can type filename) but direct file access is not available in artifacts.

**Current Behavior:**
- User can type filename and click "Load File"
- System shows guidance to copy/paste instead (artifacts can't access project files directly)

**Expected Behavior:**
- Ideally: List available project files for selection
- Reality: May need to remain as manual filename entry with guidance

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Update `loadProjectFile()` function (~lines 165-180) |

**Implementation Notes:**
- Claude artifacts have limited file system access
- This may be a fundamental limitation of the artifact environment
- Consider marking as "Won't Fix" if confirmed impossible

---

### Issue #60: Multi-JD Batch Analysis

**Status:** ⚪ DEFERRED
**Type:** ✨ Enhancement
**Priority:** Low
**Created:** 2026-01-18

**Problem Description:**
Users applying to multiple jobs must run analysis one at a time.

**Expected Behavior:**
- Upload multiple JDs
- Run batch analysis
- Compare fit scores across all JDs
- Prioritize which jobs to apply for

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Major refactor: add multi-JD state, batch analysis loop, comparison UI |

**Reason for Deferral:**
Token usage would be significant for batch analysis. Consider for v2.0 with proper token budgeting.

---

### Issue #61: Industry Transferability Display

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement
**Priority:** Medium
**Created:** 2026-01-18

**Problem Description:**
The jfa_job-fit-assessment.md includes detailed industry context validation and transferability matrix, but the current UI doesn't prominently display this information.

**Current Behavior:**
- industryContext object returned in API response
- May or may not be displayed based on API output

**Expected Behavior:**
- Dedicated "Industry Context" section in results
- Show JD industry, candidate industry, transferability level
- Visual indicator (HIGH/MODERATE/LOW) with color coding

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Add new collapsible section in results view (~line 1720) for Industry Context display |

**Reference:**
See jfa_job-fit-assessment.md `<industry_context_validation>` section for full logic.

---

### Issue #62: Loading State Progress Indicators

**Status:** 🟡 PENDING
**Type:** 🎨 UI/UX
**Priority:** Low
**Created:** 2026-01-18

**Problem Description:**
During analysis, progress indicators show static checkmarks rather than animated progress.

**Current Behavior:**
- Static list of steps during "Analyzing" state
- User doesn't see real-time progress

**Expected Behavior:**
- Animated progress through steps
- Show estimated time remaining
- More engaging loading experience

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Update "analyzing" step UI (~lines 1540-1560), add progress state, animate step transitions |

---

### Issue #65: Update Post-Analysis Prompt Wording in ng_summary-generation.md

**Status:** 🟡 PENDING
**Type:** 📝 Documentation
**Priority:** Low
**Created:** 2026-01-18

**Problem Description:**
The `ng_summary-generation.md` file currently prompts users with:
> "Would you like me to generate a customized professional summary for this JD?"

This undersells the value - the system can also generate customized bullets, not just the summary.

**Current Wording:**
```
"Would you like me to generate a customized professional summary for this JD?"
```

**Expected Wording:**
```
"Would you like me to generate customized bullets and a professional summary for this JD?"
```

**Affected Files:**
- /mnt/project/ng_summary-generation.md (search for "Would you like me to generate")

**Implementation:**
Simple find-and-replace in the project instructions file.

---

### Issue #64: Post-Analysis Narrative Fit Verification

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement
**Priority:** Medium
**Created:** 2026-01-18

**Problem Description:**
After the Job Fit Assessment completes, there is no verification step to confirm that the user's experience (as presented in their resume/job history bullets) collectively tells a narrative that aligns with the JD's requirements. 

Currently, the system:
- Matches individual skills/requirements
- Calculates a fit score
- Identifies gaps

But it does NOT:
- Verify that the bullets work together as a coherent narrative
- Confirm keyword coverage across the entire resume
- Map each JD requirement to specific supporting bullets
- Validate that the overall "story" matches what the JD is looking for

**Current Behavior:**
- Analysis returns individual requirement matches (Matched/Partial/Missing)
- No post-generation narrative coherence check
- No requirement-to-bullet mapping visible to user
- User must manually verify their bullets tell the right story

**Expected Behavior:**
Add a "Narrative Fit Summary" section to results that provides a lightweight verification without re-running the full analyzer:

1. **Requirement Coverage Matrix**
   - Lists the JD's top 5-7 requirements (prioritized by weight: Required > Preferred > Nice-to-have)
   - Maps each requirement to which bullet(s) or achievements address it
   - Shows evidence citation: "Requirement X → Position Y, Bullet Z"
   - Flags any requirements with NO bullet coverage as "NARRATIVE GAP"

2. **Keyword Hit Rate**
   - Shows X of Y critical keywords present in experience
   - Highlights which keywords are covered vs missing
   - Indicates keyword density (mentioned once vs multiple times)

3. **Narrative Coherence Score** (0-100)
   - Measures how well the bullets collectively address the JD
   - Factors:
     - % of Required skills with bullet evidence (weight: 50%)
     - % of Preferred skills with bullet evidence (weight: 30%)
     - Keyword coverage rate (weight: 20%)
   - Display: "Your experience tells X% of the story this JD is looking for"

4. **Actionable Recommendations**
   - "To strengthen your narrative for this JD, consider:"
   - List 2-3 specific gaps where adding/revising a bullet would improve fit
   - Link to Bullet Optimizer for targeted improvements

**Proposed UI Section:**

```
┌─────────────────────────────────────────────────────────┐
│  📖 Narrative Fit Summary                               │
├─────────────────────────────────────────────────────────┤
│  Narrative Coherence: 78%                               │
│  "Your experience tells most of the story, with minor  │
│   gaps in [specific area]"                              │
│                                                         │
│  Requirement Coverage (5/7 covered):                    │
│  ✓ 5+ years PM experience → Position 1, Bullet 2       │
│  ✓ Cross-functional leadership → Position 1, Bullet 4  │
│  ✓ Agile methodology → Position 2, Bullet 1            │
│  ~ Data analysis (partial) → Position 3 (mentioned)    │
│  ✗ ML/AI experience → NO COVERAGE                      │
│                                                         │
│  Keyword Coverage: 12/15 (80%)                          │
│  Missing: "Kubernetes", "CI/CD", "Stakeholder mgmt"     │
│                                                         │
│  💡 To strengthen your narrative:                       │
│  1. Add a bullet demonstrating ML/AI exposure           │
│  2. Include "stakeholder management" in Position 1      │
└─────────────────────────────────────────────────────────┘
```

**Implementation Notes:**
- This should be a LIGHTWEIGHT check, not a full re-analysis
- Use the existing gap analysis data to build the requirement map
- Parse the job history bullets client-side to find keyword matches
- No additional API call needed if structured properly
- Could be implemented as an expandable section in current results

**Relationship to Existing Guardrails:**
- Extends Guardrail #19 (Fit Score Consistency) with narrative validation
- Complements Guardrail #13 (Summary Metric Reconciliation) for bullets
- Addresses gap identified in project instructions re: post-generation verification

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Add new "Narrative Fit Summary" collapsible section in results view |
| `Should-I-Apply-webgui.jsx` | Add utility function for requirement-to-bullet mapping |

**Workaround:**
Users can manually review the Requirements Analysis section and cross-reference with their resume bullets.

---

### Issue #66: Add JD Keywords Display to Project Instructions

**Status:** 🟡 PENDING
**Type:** 📝 Documentation
**Priority:** Low
**Created:** 2026-01-18

**Problem Description:**
The Should-I-Apply WebGUI v1.2.0 displays ATS keywords extracted from the job description (matched and missing), but this feature is not documented in the project instructions. The feature should be formally added to ensure consistency across implementations.

**Current State:**
- v1.2.0 WebGUI displays keywords in "ATS Keywords" section with two columns:
  - Matched Keywords (green tags)
  - Missing Keywords (red tags)
- This is implemented in the JSX but not documented in project instructions

**What Needs to Be Added to Project Instructions:**

1. **In ng_summary-generation.md** (or new section in jfa_job-fit-assessment.md):
```xml
<keyword_display_after_analysis>
  <purpose>
    After job fit analysis, display extracted keywords to help user understand 
    ATS optimization opportunities.
  </purpose>
  
  <display_sections>
    <section name="matched_keywords">
      Keywords from JD that ARE present in candidate's experience.
      Display as green tags/chips.
    </section>
    
    <section name="missing_keywords">
      Keywords from JD that are NOT present in candidate's experience.
      Display as red tags/chips.
      These represent potential gaps or optimization opportunities.
    </section>
  </display_sections>
  
  <extraction_source>
    Keywords extracted during JD parsing (ra_jd-parsing.md):
    - skills_needed
    - skills_wanted
    - soft_skills_needed
    - soft_skills_wanted
  </extraction_source>
</keyword_display_after_analysis>
```

2. **In ra_jd-parsing.md** - Add note that extracted keywords should be surfaced to user.

**Files to Modify:**
| File | Changes |
|------|---------|
| `/mnt/project/ng_summary-generation.md` | Add `<keyword_display_after_analysis>` XML section |
| `/mnt/project/jfa_job-fit-assessment.md` | Alternative location for keyword display docs |
| `/mnt/project/ra_jd-parsing.md` | Add note that extracted keywords should be surfaced to user |

**Implementation Notes:**
- This is documentation-only - the feature already works in the WebGUI
- Formalizing ensures future implementations maintain consistency

---

### Issue #67: Interactive Keyword Management UI

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement
**Priority:** Medium
**Created:** 2026-01-18

**Problem Description:**
Users cannot modify the keywords used for content generation. They should be able to:
1. Add custom keywords not extracted from the JD
2. Ignore/exclude keywords they don't want incorporated
3. See which keywords will be used BEFORE generating content

**Current Behavior:**
- Keywords are extracted from JD automatically
- User has no control over which keywords are used
- Missing keywords may include terms the user cannot honestly claim

**Expected Behavior:**
Interactive two-column keyword manager with:
- "USE" column: Keywords that WILL be incorporated (green border)
- "IGNORE" column: Keywords that will NOT be used (gray/muted)
- Add Keywords input: Textarea for user to add custom keywords
- Click-to-toggle: Move keywords between columns

**Detailed UI Specification:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏷️ Keyword Targeting                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐ │
│  │  ✓ USE (12)             │    │  ✗ IGNORE (3)                   │ │
│  │  ─────────────────────  │    │  ─────────────────────────────  │ │
│  │  [Python ×]  [AWS ×]    │    │  [Kubernetes →]  [Docker →]    │ │
│  │  [Agile ×]  [SQL ×]     │    │  [Terraform →]                 │ │
│  │  [JIRA ×]  [REST ×]     │    │                                 │ │
│  │  [Leadership ×]         │    │  Click → to restore             │ │
│  │                         │    │                                 │ │
│  │  Click × to ignore      │    │                                 │ │
│  └─────────────────────────┘    └─────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  + Add keywords (comma-separated or one per line)               ││
│  │  ┌─────────────────────────────────────────────────────────────┐││
│  │  │ Confluence, SharePoint, technical writing                   │││
│  │  └─────────────────────────────────────────────────────────────┘││
│  │  [Add Keywords]                                                 ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Implementation Details for WebGUI (Should-I-Apply-webgui.jsx):**

1. **New State Variables:**
```javascript
const [keywordsToUse, setKeywordsToUse] = useState([]);
const [keywordsToIgnore, setKeywordsToIgnore] = useState([]);
const [customKeywordInput, setCustomKeywordInput] = useState('');
```

2. **Keyword Object Structure:**
```javascript
{
  text: "Python",           // The keyword text
  source: "matched" | "missing" | "custom",  // Where it came from
  fromJD: true | false      // Whether it was extracted from JD
}
```

3. **Initialize from Analysis Result:**
```javascript
useEffect(() => {
  if (analysisResult && step === 'results') {
    const matchedKws = (analysisResult.matchedKeywords || []).map(kw => ({
      text: kw,
      source: 'matched',
      fromJD: true
    }));
    const missingKws = (analysisResult.missingKeywords || []).map(kw => ({
      text: kw,
      source: 'missing',
      fromJD: true
    }));
    setKeywordsToUse([...matchedKws, ...missingKws]);
    setKeywordsToIgnore([]);
  }
}, [analysisResult, step]);
```

4. **Keyword Parsing Function:**
```javascript
const parseKeywords = (input) => {
  return input
    .split(/[,\n]+/)              // Split on comma or newline
    .map(kw => kw.trim())          // Trim whitespace
    .filter(kw => kw.length > 0)   // Remove empty
    .filter((kw, idx, arr) => 
      arr.findIndex(k => k.toLowerCase() === kw.toLowerCase()) === idx
    ); // Case-insensitive dedupe
};

const addCustomKeywords = () => {
  const newKeywords = parseKeywords(customKeywordInput);
  const existingTexts = [...keywordsToUse, ...keywordsToIgnore].map(k => k.text.toLowerCase());
  
  const uniqueNew = newKeywords
    .filter(kw => !existingTexts.includes(kw.toLowerCase()))
    .map(kw => ({ text: kw, source: 'custom', fromJD: false }));
  
  setKeywordsToUse(prev => [...prev, ...uniqueNew]);
  setCustomKeywordInput('');
};
```

5. **Move Functions:**
```javascript
const moveToIgnore = (keyword) => {
  setKeywordsToUse(prev => prev.filter(k => k.text !== keyword.text));
  setKeywordsToIgnore(prev => [...prev, keyword]);
};

const moveToUse = (keyword) => {
  setKeywordsToIgnore(prev => prev.filter(k => k.text !== keyword.text));
  setKeywordsToUse(prev => [...prev, keyword]);
};
```

6. **Update Generation Prompt:**
Pass only `keywordsToUse` to the `generateCustomizedContent` function:
```javascript
const targetKeywords = keywordsToUse.map(k => k.text);
// Use targetKeywords in the generation prompt instead of analysisResult.matchedKeywords
```

7. **UI Component (Keyword Chip):**
```jsx
const KeywordChip = ({ keyword, onAction, actionIcon, actionLabel, variant }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
    variant === 'use' 
      ? 'bg-green-900/30 border border-green-700 text-green-300'
      : 'bg-slate-700 border border-slate-600 text-slate-400'
  }`}>
    {keyword.text}
    {keyword.source === 'custom' && (
      <span className="text-xs opacity-60">(custom)</span>
    )}
    <button
      onClick={() => onAction(keyword)}
      className="ml-1 hover:text-white"
      title={actionLabel}
    >
      {actionIcon}
    </button>
  </span>
);
```

8. **Placement in UI:**
Insert this section BETWEEN the "ATS Keywords" section and the "Optimize Your Application" section (around line 1857 in current code).

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Add state variables: `keywordsToUse`, `keywordsToIgnore`, `customKeywordInput` |
| `Should-I-Apply-webgui.jsx` | Add functions: `parseKeywords()`, `addCustomKeywords()`, `moveToIgnore()`, `moveToUse()` |
| `Should-I-Apply-webgui.jsx` | Add `KeywordChip` component |
| `Should-I-Apply-webgui.jsx` | Add Keyword Targeting UI section (~line 1857) |
| `Should-I-Apply-webgui.jsx` | Update `generateCustomizedContent()` to use `keywordsToUse` state |

**Testing Checklist:**
- [ ] Keywords initialize correctly from analysis result
- [ ] Click × moves keyword to IGNORE column
- [ ] Click → moves keyword back to USE column
- [ ] Add custom keywords (comma-separated)
- [ ] Add custom keywords (one per line)
- [ ] Duplicate keywords are prevented
- [ ] Custom keywords show "(custom)" badge
- [ ] Only USE keywords are passed to generation
- [ ] State resets when analyzing new job

**Guardrail Compliance:**
- Keyword Evidence Principle still applies to custom keywords
- Generation prompt should note which keywords are custom vs JD-extracted
- Skipped keywords report should distinguish ignored vs not-evidenced

---

### Issue #69: Custom Keyword Validation & Evidence Check Guardrail

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement + 📝 Documentation
**Priority:** High
**Created:** 2026-01-18

**Problem Description:**
When users add custom keywords via the Keyword Management UI (Issue #67), the system needs guardrails to:
1. Validate custom keywords against job history evidence
2. Warn users when custom keywords have no supporting evidence
3. Require explicit confirmation before incorporating unevidenced keywords
4. Document this behavior in project instructions

**Current Gap:**
The existing `keyword_evidence_principle` in project instructions states:
> "If user explicitly says: 'I have Confluence experience' (even if not in job history), then add it. But ONLY with explicit user confirmation."

However, there's no mechanism in the WebGUI to:
- Automatically check if custom keywords have evidence
- Display warnings for unevidenced keywords
- Capture explicit user confirmation
- Pass confirmation status to the generation prompt

**Expected Behavior:**

1. **When user adds custom keyword:**
   - System checks if keyword appears in job history/resume content
   - If FOUND: Add to USE column with green "evidenced" indicator
   - If NOT FOUND: Add to USE column with yellow "unverified" warning

2. **Before generation:**
   - If any keywords are "unverified", show confirmation dialog:
     ```
     ⚠️ The following keywords were not found in your experience:
     • Kubernetes
     • Terraform
     
     Including these may create claims you can't defend in an interview.
     
     [ ] I confirm I have experience with these skills
     
     [Generate Anyway] [Remove Unverified & Generate]
     ```

3. **In generation prompt:**
   - Pass confirmation status to Claude
   - Unconfirmed keywords should be flagged for lighter integration
   - Confirmed keywords can be fully incorporated

**Implementation Details for WebGUI (Should-I-Apply-webgui.jsx):**

1. **Extended Keyword Object Structure:**
```javascript
{
  text: "Kubernetes",
  source: "matched" | "missing" | "custom",
  fromJD: true | false,
  evidenced: true | false | "pending",  // NEW: Evidence status
  userConfirmed: false                   // NEW: User explicitly confirmed
}
```

2. **Evidence Check Function:**
```javascript
const checkKeywordEvidence = (keyword, experienceContent) => {
  if (!experienceContent) return false;
  
  const lowerContent = experienceContent.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Check for exact match or common variations
  const variations = [
    lowerKeyword,
    lowerKeyword.replace(/-/g, ' '),  // "ci-cd" -> "ci cd"
    lowerKeyword.replace(/ /g, '-'),  // "ci cd" -> "ci-cd"
  ];
  
  return variations.some(v => lowerContent.includes(v));
};

const addCustomKeywords = () => {
  const newKeywords = parseKeywords(customKeywordInput);
  const experienceContent = jobHistorySource?.content || resumeSource?.content || '';
  
  const keywordsWithEvidence = newKeywords.map(kw => ({
    text: kw,
    source: 'custom',
    fromJD: false,
    evidenced: checkKeywordEvidence(kw, experienceContent),
    userConfirmed: false
  }));
  
  // Filter out duplicates
  const existingTexts = [...keywordsToUse, ...keywordsToIgnore]
    .map(k => k.text.toLowerCase());
  
  const uniqueNew = keywordsWithEvidence.filter(
    kw => !existingTexts.includes(kw.text.toLowerCase())
  );
  
  setKeywordsToUse(prev => [...prev, ...uniqueNew]);
  setCustomKeywordInput('');
};
```

3. **Pre-Generation Validation:**
```javascript
const [showEvidenceWarning, setShowEvidenceWarning] = useState(false);
const [unevidencedKeywords, setUnevidencedKeywords] = useState([]);

const handleGenerateClick = () => {
  const unverified = keywordsToUse.filter(
    k => k.source === 'custom' && !k.evidenced && !k.userConfirmed
  );
  
  if (unverified.length > 0) {
    setUnevidencedKeywords(unverified);
    setShowEvidenceWarning(true);
  } else {
    generateCustomizedContent();
  }
};

const confirmAndGenerate = () => {
  // Mark unverified keywords as user-confirmed
  setKeywordsToUse(prev => prev.map(k => 
    unevidencedKeywords.some(u => u.text === k.text)
      ? { ...k, userConfirmed: true }
      : k
  ));
  setShowEvidenceWarning(false);
  generateCustomizedContent();
};

const removeUnverifiedAndGenerate = () => {
  setKeywordsToUse(prev => prev.filter(k => 
    !unevidencedKeywords.some(u => u.text === k.text)
  ));
  setShowEvidenceWarning(false);
  generateCustomizedContent();
};
```

4. **Warning Modal UI:**
```jsx
{showEvidenceWarning && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-slate-800 border border-yellow-600 rounded-lg p-6 max-w-md">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
        <div>
          <h3 className="text-white font-semibold mb-2">Unverified Keywords</h3>
          <p className="text-slate-300 text-sm mb-3">
            The following keywords were not found in your experience:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {unevidencedKeywords.map((kw, idx) => (
              <span key={idx} className="px-2 py-1 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-sm">
                {kw.text}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-xs">
            Including these may create claims you can't defend in an interview.
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={removeUnverifiedAndGenerate}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
        >
          Remove & Generate
        </button>
        <button
          onClick={confirmAndGenerate}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg"
        >
          I Confirm - Generate Anyway
        </button>
      </div>
    </div>
  </div>
)}
```

5. **Visual Indicators in Keyword Chips:**
```jsx
const KeywordChip = ({ keyword, onAction, actionIcon, variant }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
    variant === 'use' 
      ? keyword.evidenced === false && !keyword.userConfirmed
        ? 'bg-yellow-900/30 border border-yellow-600 text-yellow-300'  // Unverified
        : 'bg-green-900/30 border border-green-700 text-green-300'     // Verified
      : 'bg-slate-700 border border-slate-600 text-slate-400'          // Ignored
  }`}>
    {keyword.evidenced === false && !keyword.userConfirmed && (
      <AlertTriangle className="w-3 h-3 text-yellow-400" />
    )}
    {keyword.text}
    {keyword.source === 'custom' && (
      <span className="text-xs opacity-60">(custom)</span>
    )}
    <button onClick={() => onAction(keyword)} className="ml-1 hover:text-white">
      {actionIcon}
    </button>
  </span>
);
```

6. **Update Generation Prompt:**
```javascript
// In generateCustomizedContent():
const confirmedCustomKeywords = keywordsToUse
  .filter(k => k.source === 'custom' && k.userConfirmed)
  .map(k => k.text);

const generationPrompt = `...
TARGET KEYWORDS: ${keywordsToUse.map(k => k.text).join(', ')}

USER-CONFIRMED KEYWORDS (not in job history but user confirms experience):
${confirmedCustomKeywords.length > 0 ? confirmedCustomKeywords.join(', ') : 'None'}

Note: For user-confirmed keywords, integrate lightly (mention capability) rather than 
fabricating specific achievements. The user has confirmed experience but we have no 
documented evidence to cite.
...`;
```

**What Needs to Be Added to Project Instructions:**

1. **New Guardrail #32 in ra_quality-gates-guardrails.md:**
```xml
<custom_keyword_evidence_guardrail id="32">
  <priority>HIGH</priority>
  <instruction>
    Custom keywords added by user must be validated against job history evidence
    before incorporation into optimized content.
  </instruction>
  
  <validation_process>
    1. When user adds custom keyword, search job history for evidence
    2. If NOT FOUND: Mark as "unverified" with visual warning
    3. Before generation: Require explicit user confirmation for unverified keywords
    4. In generation: Treat user-confirmed keywords differently than evidenced keywords
  </validation_process>
  
  <generation_rules>
    <rule id="evidenced_keywords">
      Keywords with evidence: Full integration with specific achievements and metrics
    </rule>
    <rule id="confirmed_keywords">
      User-confirmed keywords (no evidence): Light integration only
      - Mention capability/familiarity
      - Do NOT fabricate specific achievements
      - Do NOT invent metrics
      Example: "Familiar with Kubernetes containerization" vs 
               "Deployed 50+ Kubernetes clusters" (fabrication)
    </rule>
    <rule id="unconfirmed_keywords">
      Unverified and unconfirmed: Do NOT incorporate
    </rule>
  </generation_rules>
  
  <user_experience>
    - Yellow warning indicator on unverified keywords
    - Confirmation modal before generation
    - Options: "Remove & Generate" or "I Confirm - Generate Anyway"
  </user_experience>
</custom_keyword_evidence_guardrail>
```

2. **Update keyword_evidence_principle in Project-GUI-Instructions.md:**
```xml
<keyword_evidence_principle_extended>
  <rule>
    Do NOT force keywords into bullets unless they are evidenced in the job history.
  </rule>
  
  <custom_keyword_handling>
    When user adds custom keywords via UI:
    1. Auto-check for evidence in job history content
    2. Display warning for unevidenced keywords
    3. Require explicit confirmation before incorporating
    4. Pass confirmation status to generation prompt
    5. Use "light integration" for confirmed-but-unevidenced keywords
  </custom_keyword_handling>
  
  <light_integration_definition>
    For user-confirmed keywords without evidence:
    - State capability: "Experience with [keyword]"
    - Show familiarity: "Knowledge of [keyword] principles"
    - DO NOT: Fabricate achievements, invent metrics, claim hands-on projects
  </light_integration_definition>
</keyword_evidence_principle_extended>
```

**Files to Modify:**
| File | Changes |
|------|---------|
| `Should-I-Apply-webgui.jsx` | Extend keyword object structure with `evidenced` and `userConfirmed` fields |
| `Should-I-Apply-webgui.jsx` | Add `checkKeywordEvidence()` function |
| `Should-I-Apply-webgui.jsx` | Add state: `showEvidenceWarning`, `unevidencedKeywords` |
| `Should-I-Apply-webgui.jsx` | Add `handleGenerateClick()`, `confirmAndGenerate()`, `removeUnverifiedAndGenerate()` functions |
| `Should-I-Apply-webgui.jsx` | Add warning modal UI component |
| `Should-I-Apply-webgui.jsx` | Update `KeywordChip` component with evidence indicators |
| `Should-I-Apply-webgui.jsx` | Update generation prompt to include confirmed keywords section |
| `/mnt/project/ra_quality-gates-guardrails.md` | Add new Guardrail #32 (`<custom_keyword_evidence_guardrail>`) |
| `/mnt/project/Project-GUI-Instructions.md` | Extend `<keyword_evidence_principle>` with custom keyword handling |

**Dependencies:**
- Issue #67 (Keyword Management UI) must be implemented first
- This issue extends #11 with validation layer

**Testing Checklist:**
- [ ] Adding evidenced custom keyword shows green chip
- [ ] Adding unevidenced custom keyword shows yellow chip with warning icon
- [ ] Clicking "Generate" with unverified keywords shows confirmation modal
- [ ] "Remove & Generate" removes unverified keywords and proceeds
- [ ] "I Confirm" marks keywords as confirmed and proceeds
- [ ] Confirmed keywords show different styling (no longer yellow)
- [ ] Generation prompt correctly identifies confirmed vs evidenced keywords
- [ ] Generated content uses "light integration" for confirmed keywords

**Guardrail Relationships:**
- Extends existing `keyword_evidence_principle`
- Works alongside Guardrail #29 (Metric Preservation)
- Complements Guardrail #16 (Master Skills Inventory protection)

---

### Issue #68: Document v1.2.0 Per-JD Customization Feature in Project Instructions

**Status:** 🟡 PENDING
**Type:** 📝 Documentation
**Priority:** Medium
**Created:** 2026-01-18

**Problem Description:**
The v1.2.0 release added per-JD customized bullets and summary generation to the Should-I-Apply WebGUI. This feature follows the ng_summary-generation.md workflow but the specific implementation details should be documented for consistency across implementations.

**What Was Implemented in v1.2.0:**

1. **Conditional Display (fitScore >= 50):**
   - Per ng_summary-generation.md: Only offer customization when match_score >= 50
   - Below 50%: Display message explaining customization isn't recommended

2. **Generation Prompt Structure:**
   - Includes full job history/resume content
   - Includes full job description
   - Includes previous fit analysis context (score, stats, strengths)
   - Includes target keywords to integrate

3. **Guardrail Compliance:**
   - Guardrail #29 (Metric Preservation): Prompt explicitly requires preserving all original metrics
   - Keyword Evidence Principle: Only includes keywords that are EVIDENCED in job history
   - Character Limits: 100-210 characters per bullet
   - Verb Diversity: Uses different verb categories across bullets

4. **Output Structure:**
```json
{
  "customizedBullets": [
    {
      "position": "Position title",
      "company": "Company name",
      "bullets": [
        {
          "text": "Optimized bullet text",
          "verbCategory": "Built|Lead|Managed|Improved|Collaborate",
          "keywordsUsed": ["keyword1"],
          "charCount": 150,
          "hasMetric": true
        }
      ]
    }
  ],
  "professionalSummary": {
    "text": "3-4 sentence summary",
    "keywordsIntegrated": ["keyword1", "keyword2"],
    "metricsIncluded": ["6+ years", "20+ stakeholders"]
  },
  "keywordCoverageReport": {
    "successfullyIncorporated": [{ "keyword": "...", "location": "..." }],
    "skippedNotEvidenced": [{ "keyword": "...", "reason": "..." }]
  },
  "optimizationNotes": "Brief explanation"
}
```

5. **UI Features:**
   - Copy button for professional summary
   - Copy All button for each position's bullets
   - Verb category color-coded badges
   - Metric indicator (✓) for bullets with quantified impact
   - Keyword coverage report (incorporated vs skipped)
   - "Clear & Try Again" button to regenerate

**What Needs to Be Added to Project Instructions:**

1. **In ng_summary-generation.md** - Add WebGUI implementation details:
```xml
<webgui_implementation>
  <version>1.2.0+</version>
  
  <ui_flow>
    1. User completes job fit analysis
    2. IF fitScore >= 50:
       - Display "Optimize Your Application" section
       - Show button: "Generate Customized Bullets & Summary"
       - On click: Call API with generation prompt
       - Display results with copy functionality
    3. IF fitScore < 50:
       - Display message: customization not recommended
       - Suggest focusing on better-fit roles
  </ui_flow>
  
  <generation_api_call>
    <model>User-selected model (Haiku/Sonnet/Opus)</model>
    <max_tokens>4000</max_tokens>
    <prompt_includes>
      - Full job history/resume content
      - Full job description
      - Previous fit analysis context
      - Target keywords (matched + top 3 missing)
      - Guardrail instructions (metric preservation, evidence principle)
    </prompt_includes>
  </generation_api_call>
  
  <results_display>
    <professional_summary>
      - Text with copy button
      - Keywords integrated list
    </professional_summary>
    
    <customized_bullets>
      - Grouped by position
      - Each bullet shows:
        - Verb category badge (color-coded)
        - Bullet text
        - Metric indicator (✓ if has metric)
      - Copy All button per position
    </customized_bullets>
    
    <keyword_coverage_report>
      - Successfully incorporated (with location)
      - Skipped not evidenced (with reason)
    </keyword_coverage_report>
  </results_display>
</webgui_implementation>
```

2. **In jfa_workflow-router.md** - Add post-analysis workflow:
```xml
<post_analysis_customization_offer>
  <trigger>Job fit analysis completes with fitScore >= 50</trigger>
  <action>Offer per-JD customization (bullets + summary)</action>
  <reference>ng_summary-generation.md</reference>
</post_analysis_customization_offer>
```

**Files to Modify:**
| File | Changes |
|------|---------|
| `/mnt/project/ng_summary-generation.md` | Add `<webgui_implementation>` XML section documenting v1.2.0 UI flow |
| `/mnt/project/jfa_workflow-router.md` | Add `<post_analysis_customization_offer>` XML section |
| `/mnt/project/jfa_job-fit-assessment.md` | Optional: Add cross-reference to customization workflow |

**Implementation Reference:**
- Should-I-Apply-webgui.jsx v1.2.0 (lines ~560-700 for generateCustomizedContent function)
- Should-I-Apply-webgui.jsx v1.2.0 (lines ~1860-2020 for results UI)

---

## Resolved Issues

*No resolved issues yet - this is v1.0.0 initial release.*

---

## Enhancement Backlog

These are features to consider for future versions:

1. **v1.1.0 - Core Improvements** ✅ RELEASED
   - [x] Issue #59: Results export (PDF download)
   - [x] Issue #63: Simplified input options with auto-detection

2. **v1.2.0 - Per-JD Customization** ✅ RELEASED
   - [x] Per-JD customized bullets and summary generation (per ng_summary-generation.md)
   - [x] Only offered when fitScore >= 50 (follows project instructions)
   - [x] Guardrail #29 compliance (Metric Preservation)
   - [x] Keyword evidence principle enforcement
   - [x] Keyword coverage report (incorporated vs skipped)

3. **v1.3.0 - Keyword Management & Validation**
   - [ ] Issue #67: Interactive keyword management UI (USE/IGNORE columns, add custom keywords)
   - [ ] Issue #69: Custom keyword validation & evidence check guardrail (depends on #67)

4. **v1.4.0 - Refinements**
   - [ ] Issue #57: Binary file extraction (PDF/DOCX text extraction)
   - [ ] Issue #61: Industry context display
   - [ ] Issue #62: Loading progress indicators
   - [ ] Issue #64: Post-analysis narrative fit verification

5. **v1.5.0 - Documentation Sync**
   - [ ] Issue #65: Update post-analysis prompt wording in ng_summary-generation.md
   - [ ] Issue #66: Add JD keywords display to project instructions
   - [ ] Issue #68: Document v1.2.0 per-JD customization in project instructions

6. **v2.0.0 - Advanced Features**
   - [ ] Issue #58: Project file access (may be impossible in artifacts)
   - [ ] Issue #60: Multi-JD batch analysis
   - [ ] Comparison view between multiple analyses
   - [ ] Integration with Resume Analyzer for full workflow

---

## Testing Checklist

### v1.0.0 Initial Release Testing

**Input Handling:**
- [ ] Upload TXT file (resume)
- [ ] Upload MD file (job history)
- [ ] Paste resume text - auto-detection
- [ ] Paste job history - auto-detection
- [ ] Paste JD - auto-detection
- [ ] Override auto-detection
- [ ] Clear/remove uploaded files

**Model Selection:**
- [ ] Select Haiku - analyze successfully
- [ ] Select Sonnet - analyze successfully
- [ ] Select Opus (Pro) - proper error handling for non-Pro users
- [ ] Model switch after error

**Analysis:**
- [ ] Complete analysis with resume + JD
- [ ] Complete analysis with job history + JD
- [ ] Handle API rate limits gracefully
- [ ] Handle JSON parsing errors
- [ ] Retry logic works

**Results:**
- [ ] Fit score displays correctly
- [ ] Recommendation shows appropriate action
- [ ] Requirements analysis expands/collapses
- [ ] Gap analysis displays
- [ ] Tips display
- [ ] Keywords display
- [ ] "Analyze Another Job" resets properly

**Edge Cases:**
- [ ] Very short JD (<100 words)
- [ ] Very long JD (>2000 words)
- [ ] JD with unusual formatting
- [ ] Resume with multiple positions
- [ ] Job history with extensive detail

---

## How to Report New Issues

When you discover an issue, provide:

1. **Issue Title:** Brief, descriptive title
2. **Type:** Bug 🐛 / Enhancement ✨ / UI/UX 🎨 / Performance ⚡ / Documentation 📝
3. **Priority:** Critical / High / Medium / Low
4. **Problem Description:** What's wrong or what needs to be added?
5. **Current Behavior:** What happens now?
6. **Expected Behavior:** What should happen?
7. **Steps to Reproduce:** (for bugs)
8. **Affected Files:** Which files are involved?
9. **Proposed Solution:** (if known)
10. **Workaround:** (if available)

---

**Last Updated:** 2026-01-18
**Maintainer:** Claude (via Optimize-My-Resume project)
