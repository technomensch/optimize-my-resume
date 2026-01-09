# Implementation Plan - Token Tracking Enhancement (ENH-001)

**Feature:** Token Usage Tracking & Display  
**Target Version:** v6.6.0  
**Estimated Effort:** 5-7 hours  
**Priority:** Medium  
**Dependencies:** None

---

## 📋 Overview

Add token usage tracking to Phase 1 Resume Analyzer with visual display of available, used, and remaining tokens throughout user session.

---

## 🎯 Implementation Strategy

### Approach: Progressive Enhancement
Build feature in 4 independent phases that can be deployed incrementally

**Why This Approach:**
- Each phase delivers user value independently
- Can pause/resume implementation between phases
- Easy to test and validate incrementally
- Minimal risk to existing functionality

---

## 📐 Phase 1: Basic Token State & Estimation

**Goal:** Track token usage and display basic count  
**Time:** 2-3 hours  
**Risk:** LOW

### Step 1.1: Add Token State

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** After existing state declarations (~line 30)

**Code to Add:**
```javascript
const [tokenUsage, setTokenUsage] = useState({
  budget: 190000,        // Total available (200K - 10K reserved)
  used: 0,               // Cumulative usage this session
  remaining: 190000,     // Budget - used
  isEstimate: true,      // True if using estimates vs exact counts
  lastAnalysis: 0        // Tokens used by last analysis
});
```

**Testing:**
- [ ] State initializes correctly on mount
- [ ] No console errors
- [ ] Existing functionality unaffected

---

### Step 1.2: Create Estimation Function

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** Before analyzeResume function (~line 120)

**Code to Add:**
```javascript
// Token estimation utility
const estimateTokenUsage = (inputText, outputData) => {
  // Input tokens: ~1.3 tokens per word (English average)
  const inputWords = inputText.split(/\s+/).length;
  const inputTokens = Math.ceil(inputWords * 1.3);
  
  // Output tokens: ~1.3 tokens per word
  const outputText = JSON.stringify(outputData);
  const outputWords = outputText.split(/\s+/).length;
  const outputTokens = Math.ceil(outputWords * 1.3);
  
  // System prompt overhead: ~1000 tokens
  const systemOverhead = 1000;
  
  return inputTokens + outputTokens + systemOverhead;
};
```

**Testing:**
- [ ] Function returns reasonable numbers
- [ ] Doesn't crash with edge cases (empty text, null data)
- [ ] Performance is acceptable

---

### Step 1.3: Update Token Usage After Analysis

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** Inside analyzeResume function, after successful parse (~line 280)

**Code to Add:**
```javascript
// After: setAnalysis(analysisData);
// Add token tracking:
const tokensUsed = estimateTokenUsage(resumeText, analysisData);
setTokenUsage(prev => ({
  ...prev,
  used: prev.used + tokensUsed,
  remaining: prev.remaining - tokensUsed,
  lastAnalysis: tokensUsed
}));
```

**Testing:**
- [ ] Token count updates after analysis
- [ ] Remaining count decreases
- [ ] Multiple analyses accumulate correctly

---

### Step 1.4: Add Basic Token Badge to Header

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** In header section (~line 400)

**Code to Add:**
```javascript
{/* Token Usage Badge */}
<div className="flex items-center gap-2 text-sm">
  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
  <span className="text-slate-300">
    {tokenUsage.isEstimate ? '~' : ''}{Math.round(tokenUsage.remaining / 1000)}K tokens
  </span>
</div>
```

**Testing:**
- [ ] Badge displays on load
- [ ] Shows "~" for estimates
- [ ] Updates after analysis
- [ ] Doesn't break layout

---

### Phase 1 Deliverable:
✅ Working token counter in header that updates after each analysis

---

## 📐 Phase 2: Enhanced Token Display

**Goal:** Add detailed token info and post-analysis summary  
**Time:** 1-2 hours  
**Risk:** LOW

### Step 2.1: Create Token Info Popover

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** Wrap existing token badge (~line 400)

**Code to Add:**
```javascript
{/* Enhanced Token Badge with Popover */}
<div className="relative group">
  {/* Badge (hover trigger) */}
  <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
    <span className="text-slate-300">
      {tokenUsage.isEstimate ? '~' : ''}{Math.round(tokenUsage.remaining / 1000)}K tokens
    </span>
  </div>
  
  {/* Popover (shows on hover) */}
  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
    <h4 className="text-white font-semibold mb-3">Token Budget</h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">Available:</span>
        <span className="text-white font-semibold">{tokenUsage.budget.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Used:</span>
        <span className="text-white font-semibold">{tokenUsage.used.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Remaining:</span>
        <span className="text-white font-semibold">
          {tokenUsage.remaining.toLocaleString()} ({Math.round((tokenUsage.remaining / tokenUsage.budget) * 100)}%)
        </span>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-400">
      {tokenUsage.isEstimate && '~ = Estimated (not exact)'}
    </div>
  </div>
</div>
```

**Testing:**
- [ ] Popover shows on hover
- [ ] Popover hides when not hovering
- [ ] Numbers format correctly (commas)
- [ ] Percentage calculates correctly
- [ ] Doesn't break on mobile

---

### Step 2.2: Add Post-Analysis Token Summary

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** After analysis results display (~line 950)

**Code to Add:**
```javascript
{analysis && tokenUsage.lastAnalysis > 0 && (
  <div className="mt-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
    <h3 className="text-blue-400 font-semibold mb-3">📊 Token Usage</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-slate-400 text-sm mb-1">This Analysis</p>
        <p className="text-white font-semibold text-lg">
          ~{tokenUsage.lastAnalysis.toLocaleString()} tokens
        </p>
      </div>
      <div>
        <p className="text-slate-400 text-sm mb-1">Remaining</p>
        <p className="text-white font-semibold text-lg">
          {Math.round(tokenUsage.remaining / 1000)}K ({Math.round((tokenUsage.remaining / tokenUsage.budget) * 100)}%)
        </p>
      </div>
    </div>
    {tokenUsage.lastAnalysis > 0 && (
      <p className="mt-3 text-slate-300 text-sm">
        Est. analyses remaining: ~{Math.floor(tokenUsage.remaining / (tokenUsage.lastAnalysis * 1.2))}
      </p>
    )}
  </div>
)}
```

**Testing:**
- [ ] Summary displays after analysis
- [ ] Shows correct last analysis tokens
- [ ] Remaining analyses estimate reasonable
- [ ] Doesn't show before first analysis

---

### Phase 2 Deliverable:
✅ Hover popover with details + post-analysis token summary

---

## 📐 Phase 3: Low Token Warning System

**Goal:** Warn users when approaching token limits  
**Time:** 1 hour  
**Risk:** LOW

### Step 3.1: Add Warning State

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** After tokenUsage state (~line 35)

**Code to Add:**
```javascript
const [showLowTokenWarning, setShowLowTokenWarning] = useState(false);
const [hasWarnedUser, setHasWarnedUser] = useState(false);
```

---

### Step 3.2: Check for Low Tokens After Update

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** In token update logic (Step 1.3)

**Code to Modify:**
```javascript
setTokenUsage(prev => {
  const newUsed = prev.used + tokensUsed;
  const newRemaining = prev.remaining - tokensUsed;
  
  // Check for low token warning
  if (newRemaining < 20000 && !hasWarnedUser) {
    setShowLowTokenWarning(true);
    setHasWarnedUser(true);
  }
  
  return {
    ...prev,
    used: newUsed,
    remaining: newRemaining,
    lastAnalysis: tokensUsed
  };
});
```

---

### Step 3.3: Add Warning Banner Component

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** Above main content area (~line 420)

**Code to Add:**
```javascript
{showLowTokenWarning && (
  <div className="mb-4 bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-yellow-400 font-semibold">
          ⚠️ Low Tokens: ~{Math.round(tokenUsage.remaining / 1000)}K remaining
        </p>
        <p className="text-slate-300 text-sm mt-1">
          Consider starting a new session for best results. Current analysis may fail if tokens run out.
        </p>
      </div>
      <button 
        onClick={() => setShowLowTokenWarning(false)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
```

**Note:** Need to import AlertTriangle and X icons from lucide-react

---

### Step 3.4: Add Icon Imports

**File:** Phase1ResumeAnalyzer.jsx  
**Location:** Top of file with other imports (~line 2)

**Code to Add:**
```javascript
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
```

**Testing:**
- [ ] Warning appears when tokens < 20K
- [ ] Warning only shows once per session
- [ ] Warning can be dismissed
- [ ] Dismissed warning stays dismissed
- [ ] Icons display correctly

---

### Phase 3 Deliverable:
✅ Low token warning system with dismissible banner

---

## 📐 Phase 4: Testing & Polish

**Goal:** Comprehensive testing and edge case handling  
**Time:** 1 hour  
**Risk:** LOW

### Step 4.1: Edge Case Handling

**Test Cases:**
1. **First analysis (no data):**
   - Verify displays "? analyses remaining"
   - No errors in console

2. **Rapid multiple analyses:**
   - Verify cumulative count correct
   - No race conditions

3. **Token count goes negative:**
   - Display "~0 tokens" minimum
   - Show warning

4. **Very large resume (high tokens):**
   - Verify estimation doesn't overflow
   - Display scales correctly

**Code Fixes:**
Add defensive checks in estimation and display logic

---

### Step 4.2: Update Version & Documentation

**Files to Update:**
1. Phase1ResumeAnalyzer.jsx - Version comment at top
2. v6.5.3-prompt-optimization-summary.md - Add v6.6.0 section
3. issue-tracker-update.md - Mark ENH-001 as resolved

**Version Bump:**
- v6.5.3 → v6.6.0 (minor version for new feature)

---

### Step 4.3: Create User Documentation

**New File:** `/mnt/user-data/outputs/token-tracking-user-guide.md`

**Contents:**
- What are tokens?
- Why does token usage matter?
- How to read the token display
- What to do when tokens are low
- How to start a new session

---

### Phase 4 Deliverable:
✅ Fully tested, documented token tracking feature ready for production

---

## ✅ Final Checklist

### Code Complete
- [ ] Phase 1: Basic token state and estimation
- [ ] Phase 2: Enhanced display (popover + summary)
- [ ] Phase 3: Warning system
- [ ] Phase 4: Testing and polish

### Testing Complete
- [ ] All functional tests pass
- [ ] All UI tests pass
- [ ] All edge case tests pass
- [ ] No console errors
- [ ] Performance acceptable

### Documentation Complete
- [ ] Code comments added
- [ ] User guide created
- [ ] Issue tracker updated
- [ ] Version bumped
- [ ] CHANGELOG updated

### Ready for Deployment
- [ ] All tests green
- [ ] Documentation complete
- [ ] User guide available
- [ ] No known bugs

---

## 🚀 Deployment Steps

1. **Commit Code:**
```bash
git add Phase1ResumeAnalyzer.jsx
git commit -m "feat(v6.6.0): add token usage tracking

- Basic token counter in header
- Detailed popover on hover
- Post-analysis token summary
- Low token warning system
- Estimate remaining analyses

Closes ENH-001"
```

2. **Test in Production-like Environment:**
- Deploy to staging
- Run full test suite
- Verify all features work

3. **Deploy to Production:**
- Update artifact
- Announce to users
- Monitor for issues

4. **Post-Deployment:**
- Update issue tracker (mark ENH-001 resolved)
- Collect user feedback
- Track analytics (how often warning appears)

---

## 📊 Success Metrics

### Quantitative
- [ ] Feature implemented in < 7 hours
- [ ] No new bugs introduced
- [ ] Token estimation within 20% of actual (if verifiable)
- [ ] Warning appears for < 5% of users (most have enough tokens)

### Qualitative
- [ ] Users report better understanding of session limits
- [ ] Fewer surprise session failures
- [ ] Positive user feedback on feature

---

## 🔗 Related Documentation

**Specification:**
- `/mnt/user-data/outputs/enhancement-token-tracking.md`

**Current Code:**
- `/mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx` (v6.5.3)

**Issue Tracker:**
- `/mnt/user-data/outputs/issue-tracker-update.md`

---

**Status:** Ready to Implement  
**Assigned To:** TBD  
**Target Version:** v6.6.0  
**Estimated Completion:** 1 week after start
