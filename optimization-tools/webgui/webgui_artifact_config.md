# WebGUI Artifact Configuration

<!-- ========================================================================== -->
<!-- MODULE: WebGUI Artifact Configuration                                     -->
<!-- ========================================================================== -->
<!-- Version: 1.0 (Extracted from Project-GUI-Instructions.md v9.1.0)          -->
<!-- Location: optimization-tools/webgui/webgui-artifact-config.md             -->
<!-- Purpose: UI/UX rules for React artifacts (Resume Analyzer, etc.)          -->
<!-- ========================================================================== -->

## Model Selection in Artifacts

### Priority
MODERATE

### Applies To
Resume Analyzer artifact (Phase 1)

### Purpose
Allow users to choose between Haiku, Sonnet, and Opus models based on their subscription tier and speed/quality preferences.

### Available Models

#### Claude Haiku 4
- **Model String:** `claude-haiku-4-20250514`
- **Tier:** Free + Pro
- **Characteristics:** Fast, efficient, good for quick analysis

#### Claude Sonnet 4
- **Model String:** `claude-sonnet-4-20250514`
- **Tier:** Free + Pro
- **Characteristics:** Balanced speed and quality (Recommended default)

#### Claude Opus 4
- **Model String:** `claude-opus-4-20250514`
- **Tier:** Pro only
- **Characteristics:** Most capable, highest quality analysis

### User Experience Guidelines

#### Model Selector
- Display as dropdown with emoji indicators
- Default: No selection (forces user to choose)
- Show tier requirements (⭐ Pro only for Opus)
- Include brief descriptions

#### Button State Logic
- **DISABLED** when no model selected
- Show tooltip: "Please select a model first"
- Display warning text below button when disabled
- Enable only after model selection

#### Error Handling
- Free users selecting Opus: API returns permission error
- Catch error and display: "Opus requires Pro plan. Please select Sonnet or Haiku."
- Auto-switch to Sonnet (recommended fallback)
- Clear error when user changes model

## Token Usage Guidance

### Priority
HIGH

### Purpose
Educate users about token costs and strategic model selection to optimize their daily token budget, especially for multi-phase workflows.

### Token Estimates

| Model | Approximate Tokens | Best For |
|-------|-------------------|----------|
| **Haiku** | ~3K per Resume Analyzer analysis | Short resumes (1-3 positions), quick analysis |
| **Sonnet** | ~5K per Resume Analyzer analysis | Most resumes (3-6 positions), balanced quality |
| **Opus** | ~8K per Resume Analyzer analysis | Complex resumes (6+ positions), maximum quality |

### Free Tier Limits

- **Daily Limit:** 500,000 tokens
- **Shared Across:** All Claude features (chat, artifacts, analysis)

### Strategic Guidance

For users planning to use Bullet Optimizer or Job Fit Analyzer, recommend starting with Haiku or Sonnet to conserve tokens for later phases.

**Example:**
"If you're analyzing a 4-position resume and plan to do job fit analysis later, use Sonnet for the resume analysis (~5K tokens) so you have budget remaining for the JD comparison phase (~3-5K tokens)."

### UI Implementation

#### Collapsible Help Section
- Toggle button: "Token usage info" with Info icon
- Expands/collapses detailed token guidance
- Shows token estimates per model
- Displays resume length recommendations
- Includes free tier limit information
- Provides multi-phase strategy tip

#### Enhanced Model Descriptions
- **Haiku:** "Fast, fewest tokens (short resumes)"
- **Sonnet:** "Balanced, moderate tokens (recommended)"
- **Opus:** "Most capable, most tokens (complex resumes, Pro only)"

#### Default State
Token info collapsed by default (reduce visual clutter). Users can expand when needed.

## Error Handling Guidelines

### Priority
HIGH

### Purpose
Provide clear, actionable, and user-friendly feedback for API and parsing errors.

### JSON Parsing Error Handling

**Issue:** Resume too long causes JSON parsing failures

**API Call Parameters:**
```javascript
{
  model: selectedModel,
  max_tokens: 8000,
  messages: [...]
}
```

**Progressive Error Handling:**

#### Attempts 1-2
Display message:
```
"Analysis failed (Attempt X/3). This might be a temporary issue. 
Please wait a few moments and try clicking 'Analyze Resume' again."
```

#### Attempt 3+
Display detailed guidance:
```
⚠️ Resume Length Issue Detected

Your resume may be too long for optimal analysis.

**Recommendations:**
- Target: 350-500 words for work experience
- Maximum bullets: 3 per position (baseline)

**Options:**
1. Shorten resume (remove older positions, reduce bullets)
2. Analyze in 2 parts:
   - Part 1: Most Recent 3-4 Positions
   - Part 2: Older Positions (if needed)

Would you like help deciding which positions to prioritize?
```

### Rate Limit Error Handling

**Issue:** User exceeded 500K token limit (Free tier)

**Detection:** Parse API error with `exceeded_limit` code

**Display Requirements:**

#### Header
🚦 Rate Limit Reached

#### Content
- **Explain limit:** 500K tokens per 5-hour window (Free tier)
- **Explain scope:** Shared across all Claude features (chat, artifacts, analysis)
- **Show Reset Time:** Convert Unix timestamp to human-readable time
  - Example: "3:45 PM EST"
- **Show Countdown:** "X hours and Y minutes until reset"

#### Options Provided
1. Wait for automatic reset
2. Upgrade to Pro (5x tokens, faster reset)
3. Use tokens strategically:
   - Switch to Haiku for next analysis
   - Prioritize most critical workflows

**Example Display:**
```
🚦 Rate Limit Reached

You've used your 500K token limit for this 5-hour window.

**Reset Time:** 3:45 PM EST (2 hours, 15 minutes from now)

**What you can do:**
1. ⏰ Wait for automatic reset
2. ⭐ Upgrade to Pro (5x tokens, faster reset)
3. 🎯 Next time: Use Haiku/Sonnet for routine analysis

Your usage this session:
- Resume Analysis: ~5K tokens
- Chat: ~2K tokens
- Previous artifacts: ~8K tokens
```

## Implementation Notes

### Artifact-Specific
This feature is implemented in the React artifact only. Instructions document the behavior for reference.

### File Locations
- **Main artifact:** Phase1ResumeAnalyzer.jsx
- **State management:** selectedModel, modelError
- **UI components:** Model selector dropdown, button enable/disable logic
- **Error handling:** API error detection for Pro-only models

### State Variables
```javascript
const [selectedModel, setSelectedModel] = useState(null);
const [modelError, setModelError] = useState(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [tokenInfo, setTokenInfo] = useState({ expanded: false });
```

### API Error Detection
```javascript
if (error.message.includes('permission') || error.message.includes('tier')) {
  setModelError('Opus requires Pro plan. Switching to Sonnet...');
  setSelectedModel('claude-sonnet-4-20250514');
}

if (error.message.includes('exceeded_limit')) {
  displayRateLimitError(error.reset_time);
}
```

## Integration Points

This module is referenced by:
- Resume Analyzer artifact (Phase 1)
- Future artifacts requiring model selection

## Related Documentation
- Token limits: https://docs.anthropic.com/claude/docs/rate-limits
- Model comparison: https://docs.anthropic.com/claude/docs/models-overview
