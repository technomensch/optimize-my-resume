# n8n Workflow Design - External Enforcement Architecture

**Version:** 9.3.8
**Purpose:** Implement guardrail enforcement OUTSIDE the LLM via n8n orchestration
**Status:** Design Document

---

## Problem Statement

The 3-Stage Checkpoint Pattern is documented but **not enforced**. Testing shows:
- Jan 29, 2026 (Haiku 4.5): Failed all stages
- Jan 31, 2026 (Opus 4.5): Failed all stages (same failures)

**Root Cause:** LLMs can read, understand, and ignore instructions. No external enforcement exists on chat-based platforms.

**Solution:** n8n becomes the external enforcement layer. The LLM generates content; n8n validates and controls flow.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    n8n ORCHESTRATOR                             │
│  (Controls flow, validates output, maintains state)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  Chat   │───▶│  Router  │───▶│  Stage   │───▶│  Stage   │  │
│  │ Trigger │    │  (Code)  │    │    1     │    │    2     │  │
│  └─────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                      │               │               │          │
│                      ▼               ▼               ▼          │
│               ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│               │  Load    │    │ Validate │    │ Validate │     │
│               │  Files   │    │  (Code)  │    │  (Code)  │     │
│               └──────────┘    └──────────┘    └──────────┘     │
│                                    │               │            │
│                              ┌─────┴─────┐   ┌─────┴─────┐     │
│                              │ IF: Pass? │   │ IF: Pass? │     │
│                              └───────────┘   └───────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    API Calls ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI API (Generator)                       │
│  (Creates content - has NO control over workflow)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Dependencies by Project

### Project 1: Resume Analyzer

**Workflow:** Single-pass analysis with Master Summary export

| Category | Files | Purpose |
|----------|-------|---------|
| Router | `ra_entry-router.md` | Detect workflow type |
| JD Parsing | `ra_jd-parsing.md` | Extract JD requirements |
| Job History | `ra_job-history-creation.md`, `ra_job-history-template.md` | Build job history |
| Quality | `ra_quality-gates-guardrails.md` | Validation rules |
| Report | `ra_report_structure.md`, `ra_resume-analyzer-display.md` | Output format |
| Summary | `ng_summary-generation.md` | **FINAL STEP** - Master Summary |
| Core | `format-rules.md`, `metrics-requirements.md` | Formatting rules |

### Project 2: Should-I-Apply (Bullet Optimizer)

**Workflow:** Multi-stage with accumulated state and external validation

| Category | Files | Purpose |
|----------|-------|---------|
| Router | `jfa_workflow-router.md` | Detect job fit vs bullets |
| Job Fit | `jfa_job-fit-assessment.md`, `jfa_re-comparison.md` | Fit analysis |
| Bullet Gen | `bo_bullet-generation-instructions.md`, `bo_bullet-generation-logic.md` | Core generation |
| Evidence | `bo_evidence-matching.md`, `bo_keyword_handling.md` | Matching logic |
| Validation | `bo_output-validator.md`, `ra_quality-gates-guardrails.md` | Guardrail checks |
| Shared | `shared_core_principles.md`, `shared_verb_taxonomy.md`, `shared_keyword_validation.md` | Common rules |
| Core | `format-rules.md`, `metrics-requirements.md`, `verb-categories.md` | Rules reference |
| v9.3.7 | `guardrail-validation-schema.md`, `constrained-generation-workflow.md` | Enforcement templates |

**NOTE:** `ng_summary-generation.md` is NOT used in Project 2. Professional summary is handled by `bo_bullet-generation-instructions.md`.

---

## Workflow Design: Should-I-Apply

### Stage 1: Planning & Budget Allocation

**n8n Nodes:**
```
[Chat Trigger] → [Code: Parse Input] → [Read Files: Load Context]
                                              ↓
                      [HTTP Request: Gemini - Stage 1 Planning]
                                              ↓
                            [Code: Validate Stage 1]
                                              ↓
                              [IF: Planning Valid?]
                                 ↙           ↘
                           [Error]        [Continue]
```

**Gemini Prompt (Stage 1):**
```
You are a resume optimization assistant. Given the job history and JD below,
create a Budget Allocation Table.

OUTPUT FORMAT (REQUIRED):
{
  "positions": [
    {
      "id": "P1",
      "title": "[Title] at [Company]",
      "recency_weight": "High|Medium|Low",
      "jd_relevance_percent": [0-100],
      "allocated_bullets": [2-5],
      "estimated_words": [number]
    }
  ],
  "total_estimated_words": [number],
  "distribution_check": {
    "positions_with_5_bullets": [count],
    "positions_with_4_bullets": [count]
  }
}

CONSTRAINTS:
- Total words: 350-500
- Max 2 positions with 5 bullets
- Max 2 positions with 4 bullets
- Positions ordered by recency (most recent first)

JOB HISTORY:
{job_history}

JOB DESCRIPTION:
{jd_text}
```

**Validation Code (JavaScript in n8n Code node):**
```javascript
const stage1 = JSON.parse($input.first().json.response);

const errors = [];

// Validate total word budget
if (stage1.total_estimated_words < 350 || stage1.total_estimated_words > 500) {
  errors.push(`Word budget ${stage1.total_estimated_words} outside 350-500 range`);
}

// Validate bullet distribution
if (stage1.distribution_check.positions_with_5_bullets > 2) {
  errors.push(`Too many positions with 5 bullets: ${stage1.distribution_check.positions_with_5_bullets}`);
}
if (stage1.distribution_check.positions_with_4_bullets > 2) {
  errors.push(`Too many positions with 4 bullets: ${stage1.distribution_check.positions_with_4_bullets}`);
}

// Validate position order (recency)
const weights = stage1.positions.map(p => p.recency_weight);
const weightOrder = { "High": 3, "Medium": 2, "Low": 1 };
for (let i = 1; i < weights.length; i++) {
  if (weightOrder[weights[i]] > weightOrder[weights[i-1]]) {
    errors.push(`Position order violation: ${stage1.positions[i].id} has higher recency than ${stage1.positions[i-1].id}`);
  }
}

// Validate minimum bullets
for (const pos of stage1.positions) {
  if (pos.allocated_bullets < 2) {
    errors.push(`${pos.id} has fewer than 2 bullets allocated`);
  }
}

return {
  valid: errors.length === 0,
  errors: errors,
  stage1_data: stage1
};
```

---

### Stage 2: Per-Position Bullet Generation (Loop)

**n8n Nodes:**
```
[Split In Batches: positions] → [Set: Current Position]
           ↓
[HTTP Request: Gemini - Generate Bullets]
           ↓
[Code: Validate Bullets]
           ↓
[IF: Valid?] → NO → [Code: Build Retry Prompt] → [Loop Back]
     ↓ YES              (max 3 retries)
[Set: Accumulate State]
           ↓
[Merge: Continue Loop]
```

**Accumulated State Structure:**
```javascript
// Stored in n8n workflow state (NOT in LLM context)
{
  "completed_positions": [],
  "total_words_used": 0,
  "total_bullets_generated": 0,
  "verb_distribution": {
    "Built": 0,
    "Led": 0,
    "Managed": 0,
    "Improved": 0,
    "Collaborated": 0
  },
  "phrases_used": [],  // For G15 uniqueness check
  "retry_counts": {}
}
```

**Gemini Prompt (Stage 2 - Per Position):**
```
Generate optimized resume bullets for the following position.

POSITION: {position.title}
ALLOCATED BULLETS: {position.allocated_bullets}
WORD BUDGET: {position.estimated_words}

CONSTRAINTS:
- Character count per bullet: 100-210
- Start each bullet with a past-tense action verb
- NO gerunds (-ing words) at start
- Include metrics where available in source
- Verb categories: Built, Led, Managed, Improved, Collaborated
- Use DIFFERENT verb category for each bullet in this position

ACCUMULATED STATE (for cross-position validation):
- Words used so far: {state.total_words_used}
- Remaining budget: {500 - state.total_words_used}
- Verb distribution so far: {state.verb_distribution}
- Phrases to avoid (already used): {state.phrases_used}

SOURCE EVIDENCE (from job history):
{position_job_history_section}

OUTPUT FORMAT (REQUIRED):
{
  "position_id": "{position.id}",
  "bullets": [
    {
      "text": "[bullet text]",
      "char_count": [number],
      "word_count": [number],
      "verb_category": "[category]",
      "first_word": "[verb]",
      "source_evidence": "[quote from job history]",
      "metrics_included": ["list of metrics"]
    }
  ],
  "position_word_count": [total words for this position]
}
```

**Validation Code (Stage 2):**
```javascript
const bullets = JSON.parse($input.first().json.response);
const state = $('Set: Accumulated State').first().json;
const errors = [];

for (const bullet of bullets.bullets) {
  // G24: Character count
  if (bullet.char_count < 100 || bullet.char_count > 210) {
    errors.push(`Bullet "${bullet.text.substring(0,30)}..." has ${bullet.char_count} chars (need 100-210)`);
  }

  // G35: Gerund ban
  if (bullet.first_word.endsWith('ing')) {
    errors.push(`Bullet starts with gerund: "${bullet.first_word}"`);
  }

  // G15: Phrase uniqueness (3+ word phrases used 3x)
  const words = bullet.text.split(' ');
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(' ').toLowerCase();
    const count = state.phrases_used.filter(p => p === phrase).length;
    if (count >= 2) {
      errors.push(`Phrase "${phrase}" would be used 3+ times`);
    }
  }
}

// Check verb diversity within position
const verbs = bullets.bullets.map(b => b.verb_category);
const uniqueVerbs = [...new Set(verbs)];
if (uniqueVerbs.length < verbs.length) {
  errors.push(`Duplicate verb categories within position: ${verbs.join(', ')}`);
}

// Check cumulative word budget
const newTotal = state.total_words_used + bullets.position_word_count;
if (newTotal > 500) {
  errors.push(`Would exceed word budget: ${newTotal} > 500`);
}

return {
  valid: errors.length === 0,
  errors: errors,
  bullets: bullets,
  new_word_total: newTotal
};
```

---

### Stage 3: Final Reconciliation & Professional Summary

**n8n Nodes:**
```
[Code: Final Validation] → [IF: All Pass?]
                                ↙        ↘
                          [Error]    [HTTP: Professional Summary]
                                              ↓
                               [Code: Format Final Output]
                                              ↓
                                    [Respond to Chat]
```

**Final Validation Code:**
```javascript
const state = $('Set: Final Accumulated State').first().json;
const errors = [];

// G8: Total word count
if (state.total_words_used < 350 || state.total_words_used > 500) {
  errors.push(`Total words ${state.total_words_used} outside 350-500`);
}

// G12: Minimum bullets per position
for (const pos of state.completed_positions) {
  if (pos.bullet_count < 2) {
    errors.push(`${pos.id} has only ${pos.bullet_count} bullets (need 2+)`);
  }
}

// G37: Verb diversity (5% floor per category)
const totalBullets = state.total_bullets_generated;
for (const [verb, count] of Object.entries(state.verb_distribution)) {
  const percent = (count / totalBullets) * 100;
  if (percent < 5 && count > 0) {
    errors.push(`${verb} category at ${percent.toFixed(1)}% (below 5% floor)`);
  }
}

// Distribution check
const fiveBulletPositions = state.completed_positions.filter(p => p.bullet_count === 5).length;
const fourBulletPositions = state.completed_positions.filter(p => p.bullet_count === 4).length;
if (fiveBulletPositions > 2) {
  errors.push(`${fiveBulletPositions} positions have 5 bullets (max 2)`);
}
if (fourBulletPositions > 2) {
  errors.push(`${fourBulletPositions} positions have 4 bullets (max 2)`);
}

return {
  valid: errors.length === 0,
  errors: errors,
  final_state: state,
  reconciliation_table: {
    word_count: { actual: state.total_words_used, range: "350-500", status: state.total_words_used >= 350 && state.total_words_used <= 500 ? "PASS" : "FAIL" },
    min_bullets: { actual: Math.min(...state.completed_positions.map(p => p.bullet_count)), required: 2, status: "check" },
    distribution: { five_bullet: fiveBulletPositions, four_bullet: fourBulletPositions, status: fiveBulletPositions <= 2 && fourBulletPositions <= 2 ? "PASS" : "FAIL" }
  }
};
```

---

## Gemini API Configuration

### HTTP Request Node Settings

**URL:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
```

**Method:** POST

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:**
```
key: {{ $credentials.geminiApi.apiKey }}
```

**Body:**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "{{ $json.prompt }}"
        }
      ]
    }
  ],
  "systemInstruction": {
    "parts": [
      {
        "text": "{{ $json.system_prompt }}"
      }
    ]
  },
  "generationConfig": {
    "temperature": 0.3,
    "topP": 0.8,
    "maxOutputTokens": 4096,
    "responseMimeType": "application/json"
  }
}
```

**Key Setting:** `responseMimeType: "application/json"` forces Gemini to output valid JSON.

---

## Auto-Retry Logic

**Retry Configuration (in Loop node):**
```javascript
const MAX_RETRIES = 3;
const validation = $input.first().json;
const retryCount = $('Set: Retry Counter').first().json.count || 0;

if (!validation.valid && retryCount < MAX_RETRIES) {
  // Build retry prompt with error feedback
  const retryPrompt = `
Your previous response had validation errors:
${validation.errors.join('\n')}

Please regenerate with these corrections. Remember:
- Character count: 100-210 per bullet
- No gerunds at start
- Different verb category for each bullet
- Stay within word budget

Original request:
${$('Set: Current Prompt').first().json.prompt}
`;

  return {
    should_retry: true,
    retry_prompt: retryPrompt,
    retry_count: retryCount + 1
  };
} else if (!validation.valid) {
  // Max retries exceeded
  return {
    should_retry: false,
    error: `Failed after ${MAX_RETRIES} retries. Errors: ${validation.errors.join('; ')}`
  };
} else {
  // Validation passed
  return {
    should_retry: false,
    success: true
  };
}
```

---

## File Loading Strategy

### Efficient Context Loading

Instead of loading all files, load contextually:

**Stage 1 (Planning):**
- `bo_bullet-generation-instructions.md` (Sections 1-3 only)
- `guardrail-validation-schema.md` (JSON schema reference)

**Stage 2 (Per-Position):**
- `shared_verb_taxonomy.md` (verb categories)
- `bo_bullet-generation-logic.md` (generation rules)
- Position-specific job history section only

**Stage 3 (Summary):**
- `bo_bullet-generation-instructions.md` (Professional Summary section)

### Context Injection Pattern

```javascript
// Code node: Build Stage 2 Prompt
const position = $input.first().json.current_position;
const verbTaxonomy = $('Read: Verb Taxonomy').first().json.content;
const bulletLogic = $('Read: Bullet Logic').first().json.content;
const jobHistorySection = extractPositionHistory(
  $('Read: Job History').first().json.content,
  position.id
);

const systemPrompt = `
# Verb Categories Reference
${verbTaxonomy}

# Bullet Generation Rules
${bulletLogic}
`;

const userPrompt = `
Generate bullets for: ${position.title}
Allocated: ${position.allocated_bullets} bullets
Word budget: ${position.estimated_words} words

Source evidence:
${jobHistorySection}
`;

return { system_prompt: systemPrompt, prompt: userPrompt };
```

---

## Chat Interface Integration

### Initial Message Parsing

The Chat Trigger receives messages like:
- "Optimize my resume for this job: [JD text]"
- "Analyze my resume against [job title]"
- "Should I apply for [job link]?"

**Router Code Node:**
```javascript
const message = $input.first().json.chatInput.toLowerCase();

let workflow_type = 'unknown';
let extracted_jd = '';

if (message.includes('optimize') || message.includes('bullets')) {
  workflow_type = 'should-i-apply';
} else if (message.includes('analyze') || message.includes('review')) {
  workflow_type = 'resume-analyzer';
}

// Extract JD if provided inline
const jdMatch = message.match(/job description[:\s]*([\s\S]+)/i);
if (jdMatch) {
  extracted_jd = jdMatch[1].trim();
}

return {
  workflow_type: workflow_type,
  jd_text: extracted_jd,
  requires_file_upload: !extracted_jd
};
```

---

## Implementation Phases

### Phase 1: Core Should-I-Apply Workflow
1. Chat Trigger → Router
2. Stage 1 Planning with validation
3. Stage 2 Loop (single position first)
4. Basic output formatting

### Phase 2: Full Loop & Retry
1. Complete position loop
2. Accumulated state management
3. Auto-retry logic
4. Stage 3 reconciliation

### Phase 3: Professional Summary & Polish
1. Professional summary generation
2. Final output formatting
3. Error reporting
4. Chat response formatting

### Phase 4: Resume Analyzer Workflow
1. Separate branch for Project 1
2. Different file loading
3. Master Summary export

---

## Success Criteria

**Enforcement Verified When:**
- [ ] Stage 1 rejects plans outside 350-500 word budget
- [ ] Stage 2 rejects bullets with wrong character count
- [ ] Stage 2 rejects duplicate verb categories
- [ ] Auto-retry successfully corrects validation failures
- [ ] Stage 3 catches cumulative violations
- [ ] LLM has NO ability to skip validation (it's external)

**Comparison Test:**
Run same resume + JD through:
1. Claude Project (no enforcement) - expect failures
2. n8n workflow (external enforcement) - expect compliance

---

## Next Steps

1. **Create n8n credentials** for Gemini API
2. **Build Phase 1 workflow** JSON
3. **Test with sample resume + JD**
4. **Iterate on prompt engineering** for reliable JSON output
5. **Add Resume Analyzer branch** after Should-I-Apply is stable
