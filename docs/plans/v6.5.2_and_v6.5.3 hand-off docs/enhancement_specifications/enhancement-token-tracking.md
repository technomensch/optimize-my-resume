# Enhancement Specification - Token Usage Tracking & Display

**Feature ID:** ENH-001  
**Priority:** Medium (Quality of Life)  
**Status:** Documented, Not Implemented  
**Requested By:** Marc  
**Date:** January 8, 2026

---

## 📋 Overview

Add token usage tracking and display to Phase 1 Resume Analyzer to help users understand their session limits and make informed decisions about analysis runs.

---

## 🎯 Goals

### Primary Goals
1. Show users how many tokens are available at session start
2. Display remaining tokens after each analysis
3. Help users understand when they're approaching limits
4. Prevent surprise session failures due to token exhaustion

### Secondary Goals
1. Estimate remaining analyses possible
2. Warn users when tokens are low
3. Educate users about token costs

---

## 👤 User Stories

### Story 1: Session Start Awareness
**As a** user opening the analyzer  
**I want to** see how many tokens I have available  
**So that** I know my session capacity before starting

**Acceptance Criteria:**
- [ ] Token budget displayed when app loads
- [ ] Clear explanation of what tokens mean
- [ ] Display updates if budget changes

### Story 2: Post-Analysis Feedback
**As a** user who just ran an analysis  
**I want to** see how many tokens that used  
**So that** I understand the cost and can plan additional analyses

**Acceptance Criteria:**
- [ ] Token usage shown after each analysis completes
- [ ] Breakdown: used this analysis + total remaining
- [ ] Estimate of additional analyses possible

### Story 3: Low Token Warning
**As a** user with few tokens remaining  
**I want to** be warned before attempting another analysis  
**So that** I can start a new session if needed

**Acceptance Criteria:**
- [ ] Warning displayed when tokens < 20K
- [ ] Suggestion to start new session
- [ ] Clear indication of risk (analysis may fail mid-way)

---

## 🎨 UI Design

### Location 1: Header Badge (Default State)

**Position:** Top-right corner of app header  
**Style:** Small, unobtrusive badge

**Mockup:**
```
┌─────────────────────────────────────────────────┐
│  Phase 1 Resume Analyzer        🔷 190K tokens  │
│                                                  │
│  [Select Model ▾]                                │
│  [Resume Text Area]                              │
└─────────────────────────────────────────────────┘
```

**Implementation:**
```jsx
<div className="flex items-center gap-2 text-sm">
  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
  <span className="text-slate-300">{remaining}K tokens</span>
</div>
```

---

### Location 2: Expanded Info Panel (On Hover/Click)

**Trigger:** Hover or click on token badge  
**Style:** Popover/tooltip with detailed breakdown

**Mockup:**
```
┌─────────────────────────────────────┐
│  Token Budget                       │
├─────────────────────────────────────┤
│  Available: 190,000                 │
│  Used: 0                            │
│  Remaining: 190,000 (100%)          │
│                                     │
│  Context Window: 200,000            │
│  Reserved: 10,000 (system)          │
└─────────────────────────────────────┘
```

**Implementation:**
```jsx
<Popover>
  <PopoverTrigger>
    <div className="token-badge">...</div>
  </PopoverTrigger>
  <PopoverContent>
    <div className="p-4 bg-slate-800 rounded-lg">
      <h4 className="font-semibold mb-2">Token Budget</h4>
      <div className="space-y-1 text-sm">
        <p>Available: {budget.toLocaleString()}</p>
        <p>Used: {used.toLocaleString()}</p>
        <p>Remaining: {remaining.toLocaleString()} ({percentage}%)</p>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

---

### Location 3: Post-Analysis Summary

**Position:** At end of analysis results  
**Style:** Info card with usage breakdown

**Mockup:**
```
┌─────────────────────────────────────────────────┐
│  ✅ Analysis Complete                            │
│                                                  │
│  📊 Token Usage:                                 │
│  • This analysis: ~15,234 tokens                 │
│  • Total used: 15,234 tokens                     │
│  • Remaining: 174,766 tokens (92%)               │
│  • Est. analyses remaining: ~11                  │
└─────────────────────────────────────────────────┘
```

**Implementation:**
```jsx
{analysis && (
  <div className="mt-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
    <h3 className="text-blue-400 font-semibold mb-3">📊 Token Usage</h3>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-slate-400">This Analysis</p>
        <p className="text-white font-semibold">~{currentUsage.toLocaleString()} tokens</p>
      </div>
      <div>
        <p className="text-slate-400">Remaining</p>
        <p className="text-white font-semibold">{remaining.toLocaleString()} ({percentage}%)</p>
      </div>
    </div>
    <p className="mt-2 text-slate-300 text-sm">
      Est. analyses remaining: ~{estimatedRemaining}
    </p>
  </div>
)}
```

---

### Location 4: Low Token Warning Banner

**Trigger:** Remaining tokens < 20,000  
**Position:** Top of app, below header  
**Style:** Warning banner (yellow/orange)

**Mockup:**
```
┌─────────────────────────────────────────────────┐
│  ⚠️  Low Tokens: ~18,500 remaining              │
│  Consider starting a new session for best        │
│  results. Current analysis may fail if tokens   │
│  run out.                          [Dismiss]     │
└─────────────────────────────────────────────────┘
```

**Implementation:**
```jsx
{remaining < 20000 && (
  <div className="mb-4 bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-yellow-400 font-semibold">Low Tokens: ~{remaining.toLocaleString()} remaining</p>
        <p className="text-slate-300 text-sm mt-1">
          Consider starting a new session for best results. Current analysis may fail if tokens run out.
        </p>
      </div>
      <button onClick={() => setShowWarning(false)} className="text-slate-400 hover:text-white">
        ✕
      </button>
    </div>
  </div>
)}
```

---

## 🔧 Technical Implementation

### State Management

```javascript
const [tokenUsage, setTokenUsage] = useState({
  budget: 190000,        // Total available (200K - 10K reserved)
  used: 0,               // Cumulative usage this session
  remaining: 190000,     // Budget - used
  isEstimate: true,      // True if using estimates vs exact counts
  lastAnalysis: 0        // Tokens used by last analysis
});
```

---

### Token Counting Methods

#### Method 1: Exact Count (If Available from API)

```javascript
async function analyzeResume() {
  const response = await fetch(...);
  const data = await response.json();
  
  // Check if API returns token usage in headers
  const tokensUsed = response.headers.get('x-anthropic-input-tokens') || 
                     response.headers.get('x-anthropic-output-tokens');
  
  if (tokensUsed) {
    updateTokenUsage(parseInt(tokensUsed), false); // exact = true
  } else {
    // Fallback to estimation
    estimateTokenUsage(resumeText, data);
  }
}
```

#### Method 2: Estimation (Fallback)

```javascript
function estimateTokenUsage(inputText, outputData) {
  // Input tokens: ~1.3 tokens per word (English average)
  const inputWords = inputText.split(/\s+/).length;
  const inputTokens = Math.ceil(inputWords * 1.3);
  
  // Output tokens: ~1.3 tokens per word
  const outputText = JSON.stringify(outputData);
  const outputWords = outputText.split(/\s+/).length;
  const outputTokens = Math.ceil(outputWords * 1.3);
  
  // System prompt overhead: ~1000 tokens
  const systemOverhead = 1000;
  
  const totalEstimated = inputTokens + outputTokens + systemOverhead;
  
  updateTokenUsage(totalEstimated, true); // isEstimate = true
}
```

#### Method 3: Hybrid (Best Accuracy)

```javascript
function getTokenCount(text) {
  // Use Anthropic's tokenizer if available
  if (window.anthropic?.tokenize) {
    return window.anthropic.tokenize(text).length;
  }
  
  // Fallback to word-based estimation
  return Math.ceil(text.split(/\s+/).length * 1.3);
}
```

---

### Update Logic

```javascript
function updateTokenUsage(tokensUsed, isEstimate) {
  setTokenUsage(prev => {
    const newUsed = prev.used + tokensUsed;
    const newRemaining = prev.budget - newUsed;
    
    return {
      ...prev,
      used: newUsed,
      remaining: newRemaining,
      lastAnalysis: tokensUsed,
      isEstimate: isEstimate
    };
  });
  
  // Check for low token warning
  if (newRemaining < 20000 && !hasWarnedUser) {
    setShowLowTokenWarning(true);
    setHasWarnedUser(true);
  }
}
```

---

### Remaining Analyses Estimation

```javascript
function estimateRemainingAnalyses() {
  const { remaining, lastAnalysis } = tokenUsage;
  
  if (lastAnalysis === 0) {
    return '?'; // No data yet
  }
  
  // Conservative estimate (assumes similar resume size)
  const estimated = Math.floor(remaining / (lastAnalysis * 1.2)); // 20% buffer
  
  return estimated;
}
```

---

## 🎯 Edge Cases & Error Handling

### Edge Case 1: First Analysis (No Usage Data)
**Scenario:** User hasn't run any analysis yet  
**Display:** "190K tokens available" (no estimate)  
**After First:** Show actual usage + estimate remaining

### Edge Case 2: Token Counting Unavailable
**Scenario:** API doesn't return token counts, estimation fails  
**Display:** "Token tracking unavailable" or hide feature  
**Fallback:** Use conservative estimates with large buffer

### Edge Case 3: Negative Remaining Tokens
**Scenario:** Estimation error or budget miscalculation  
**Display:** "~0 tokens (session may expire soon)"  
**Action:** Show warning, suggest new session

### Edge Case 4: Multiple Analyses Rapidly
**Scenario:** User runs multiple analyses back-to-back  
**Handling:** Queue token updates, prevent race conditions  
**Implementation:** Use functional state updates

---

## 📊 Analytics & Metrics

### Track These Metrics:
1. **Average tokens per analysis** (by position count)
2. **Sessions ending due to token exhaustion** (how often?)
3. **User behavior after low token warning** (do they start new session?)
4. **Estimation accuracy** (if exact counts available later)

### Don't Track:
- Resume content
- User identity
- Specific token counts per user

---

## ✅ Acceptance Criteria

### Must Have
- [ ] Token budget displayed on app load
- [ ] Remaining tokens updated after each analysis
- [ ] Display works with both exact counts and estimates
- [ ] "~" symbol shown when using estimates
- [ ] Low token warning at < 20K remaining

### Should Have
- [ ] Estimated remaining analyses shown
- [ ] Hover/click for detailed breakdown
- [ ] Warning dismissible (but persists on refresh if still low)
- [ ] Graceful handling of counting errors

### Could Have
- [ ] Historical token usage chart
- [ ] Token cost comparison by model
- [ ] Export token usage report
- [ ] Token usage in session summary

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] Token display appears on app load
- [ ] Display updates after analysis
- [ ] Estimation logic calculates reasonable values
- [ ] Low token warning appears at threshold
- [ ] Warning can be dismissed
- [ ] Multiple analyses tracked correctly

### UI Tests
- [ ] Badge visible but unobtrusive
- [ ] Popover displays on hover/click
- [ ] Post-analysis summary renders correctly
- [ ] Warning banner displays properly
- [ ] All text readable and clear

### Edge Case Tests
- [ ] First analysis (no prior data)
- [ ] Token counting unavailable
- [ ] Negative remaining tokens
- [ ] Multiple rapid analyses
- [ ] Session with 10+ analyses

---

## 📝 Documentation Requirements

### User Documentation
- [ ] What are tokens?
- [ ] Why does this matter?
- [ ] What happens when tokens run out?
- [ ] How to start a new session?

### Developer Documentation
- [ ] Token counting implementation
- [ ] Estimation algorithm details
- [ ] State management approach
- [ ] Integration points with existing code

---

## 🚀 Implementation Plan

### Phase 1: Basic Display (2-3 hours)
1. Add tokenUsage state
2. Implement estimation logic
3. Display token badge in header
4. Update after analysis

### Phase 2: Enhanced UI (1-2 hours)
1. Add popover for detailed view
2. Create post-analysis summary card
3. Style and polish displays

### Phase 3: Warning System (1 hour)
1. Implement low token detection
2. Create warning banner component
3. Add dismiss functionality

### Phase 4: Testing & Polish (1 hour)
1. Test all scenarios
2. Handle edge cases
3. Update documentation

**Total Estimated Effort:** 5-7 hours

---

## 🔗 Related Files

**Current Artifact:**
- `/mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx` (v6.5.3)

**Documentation:**
- `/mnt/user-data/outputs/session-summary-2026-01-08-phase1-analyzer.md`

---

## 📞 Questions for Marc

1. **Token Budget:** Confirm 190K available (200K - 10K reserved)?
2. **Display Format:** Prefer "190K" or "190,000" for token counts?
3. **Warning Threshold:** 20K tokens reasonable, or adjust?
4. **Estimation:** Show estimates even if less accurate, or hide feature?
5. **Session Management:** Should app offer "Start New Session" button?

---

## 🎓 Future Enhancements

### v2.0 Features (Nice to Have)
1. **Token usage history chart** - Line graph showing usage over time
2. **Per-position token cost** - Break down by position analyzed
3. **Model comparison** - Show token costs for Haiku vs Sonnet vs Opus
4. **Export token report** - Download usage summary as CSV/JSON
5. **Session token limit** - Set custom limits per session
6. **Token budget alerts** - Email/notification when low

---

**Status:** Ready for Implementation  
**Priority:** Medium (Quality of Life, not critical)  
**Complexity:** Medium (5-7 hours)  
**Dependencies:** None (standalone feature)
