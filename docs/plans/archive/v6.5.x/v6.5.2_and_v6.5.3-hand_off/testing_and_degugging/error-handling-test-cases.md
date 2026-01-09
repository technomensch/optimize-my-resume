# Phase 1 Analyzer - Error Handling Test Cases

**Purpose:** Comprehensive test scenarios for all error paths in Phase1ResumeAnalyzer.jsx  
**Created:** January 8, 2026  
**Status:** Ready for implementation

---

## 🎯 Test Case Categories

### Category 1: API Response Errors
### Category 2: JSON Parsing Errors
### Category 3: Resume Size/Complexity Errors
### Category 4: Rate Limiting Errors
### Category 5: Model Selection Errors
### Category 6: Network/Connection Errors

---

## Category 1: API Response Errors

### Test Case 1.1: Empty Response
**Scenario:** API returns 200 but no content  
**Setup:**
```javascript
// Mock response
{
  status: 200,
  content: []  // Empty array
}
```
**Expected Behavior:**
- Should throw "No JSON found in response"
- Should trigger empty response error handling
- Should suggest: reduce size, try Haiku, split resume

**User Message:**
```
Analysis Failed - Empty Response (Attempt 1)

The API returned an incomplete response. This usually happens when:
[...]
```

---

### Test Case 1.2: Missing Content Field
**Scenario:** API returns valid JSON but missing content field  
**Setup:**
```javascript
{
  status: 200,
  type: "message",
  // No content field
}
```
**Expected Behavior:**
- Should throw error accessing `data.content[0]`
- Should catch as unexpected error
- Should display generic error message

---

### Test Case 1.3: Truncated Response
**Scenario:** API returns partial JSON (timeout mid-response)  
**Setup:**
```javascript
{
  content: [{
    text: '{"executiveSummary": {"overallGrade": "B+", "wordCount": 450, "bulletCount": 12, "prioritizedRepairs": {"blocker": 0, "risk": 3, "tweak'
    // JSON cuts off mid-object
  }]
}
```
**Expected Behavior:**
- `jsonEnd = -1` (no closing brace found)
- Should throw "No JSON found in response"
- Should increment failure count
- Should suggest retry on attempt 1-2

---

## Category 2: JSON Parsing Errors

### Test Case 2.1: Malformed JSON - Missing Comma
**Scenario:** JSON has syntax error (missing comma between fields)  
**Setup:**
```javascript
{
  content: [{
    text: '{"executiveSummary": {"overallGrade": "B+" "wordCount": 450}}'
    // Missing comma after B+
  }]
}
```
**Expected Behavior:**
- `JSON.parse()` throws SyntaxError
- `err instanceof SyntaxError` = true
- Should categorize as JSON parse error
- Message: "JSON Parsing Failed (Attempt X/3)"

---

### Test Case 2.2: Invalid JSON - Unescaped Quotes
**Scenario:** JSON contains unescaped quotes in text  
**Setup:**
```javascript
{
  content: [{
    text: '{"position": "Technical Writer - "Senior" Level"}'
    // Unescaped quotes break parsing
  }]
}
```
**Expected Behavior:**
- JSON parse fails
- Should suggest retry (temporary issue)
- Console shows error details

---

### Test Case 2.3: Valid JSON but Wrong Schema
**Scenario:** JSON parses but missing required fields  
**Setup:**
```javascript
{
  "summary": "Some text",
  // Missing executiveSummary, positions, etc.
}
```
**Expected Behavior:**
- JSON.parse() succeeds
- setAnalysis() gets incomplete data
- App should handle gracefully (check for required fields)
- **TODO: Add schema validation**

---

## Category 3: Resume Size/Complexity Errors

### Test Case 3.1: Extremely Large Resume (10+ positions)
**Scenario:** User pastes 10 positions with 5 bullets each  
**Input:**
- 10 positions
- 50 total bullets
- ~2500 words

**Expected Behavior:**
- API likely returns empty or truncated response
- After 3 attempts: Shows detailed size guidance
- Recommends: 3 positions max, 2 bullets per position

---

### Test Case 3.2: Very Long Bullets (500+ chars each)
**Scenario:** Each bullet is a paragraph  
**Input:**
- 3 positions
- 3 bullets per position
- Each bullet 500-600 characters

**Expected Behavior:**
- API may timeout or return truncated response
- Should suggest: reduce bullet length
- Recommend: 100-210 chars per bullet

---

### Test Case 3.3: Complex Formatting (tables, special chars)
**Scenario:** Resume has tables, Unicode, HTML tags  
**Input:**
```
Position 1
├── Bullet with │ box drawing chars
├── Bullet with emoji 🚀🎯💡
└── Bullet with <b>HTML</b> tags
```

**Expected Behavior:**
- May cause JSON parsing issues
- Should handle gracefully or suggest: remove special formatting

---

## Category 4: Rate Limiting Errors

### Test Case 4.1: Rate Limit Exceeded (Standard Detection)
**Scenario:** User hits 500K token limit in 5-hour window  
**Setup:**
```javascript
{
  type: "exceeded_limit",
  windows: {
    "5h": {
      resets_at: 1704740400  // Unix timestamp
    }
  }
}
```
**Expected Behavior:**
- ✅ Detected by current code (line 233)
- Shows formatted message with reset time
- Calculates countdown (hours + minutes)
- Suggests: wait, upgrade Pro, use strategically

---

### Test Case 4.2: Rate Limit with Missing Window Data
**Scenario:** Rate limit error but window data malformed  
**Setup:**
```javascript
{
  type: "exceeded_limit",
  windows: {}  // Empty
}
```
**Expected Behavior:**
- Code tries to access `Object.values(data.windows)[0]`
- May throw error if empty
- **TODO: Add null check before accessing window.resets_at**

---

### Test Case 4.3: Soft Rate Limit (Slow Down)
**Scenario:** API returns 429 but not exceeded_limit type  
**Setup:**
```javascript
{
  status: 429,
  error: {
    message: "Rate limit exceeded, please slow down"
  }
}
```
**Expected Behavior:**
- Current code checks `data.error.message`
- Should suggest: wait 30-60 seconds, retry
- **TODO: Detect 429 status specifically**

---

## Category 5: Model Selection Errors

### Test Case 5.1: Opus Access Denied (Free Tier)
**Scenario:** Free user tries to use Opus  
**Setup:**
```javascript
{
  error: {
    message: "You do not have permission to use this model"
  }
}
```
**Expected Behavior:**
- ✅ Detected by current code (line 278)
- Sets modelError message
- Auto-switches to Sonnet
- Button disabled until Sonnet selected

---

### Test Case 5.2: Invalid Model ID
**Scenario:** Model ID changed/deprecated  
**Setup:**
```javascript
{
  error: {
    message: "Model claude-haiku-4-20250514 not found"
  }
}
```
**Expected Behavior:**
- Should display error message
- Suggest: select different model
- Don't auto-switch (user should choose)

---

### Test Case 5.3: No Model Selected
**Scenario:** User clicks analyze without selecting model  
**Expected Behavior:**
- ✅ Button is disabled (line 670)
- Tooltip shows: "Please select a model first"
- No API call made

---

## Category 6: Network/Connection Errors

### Test Case 6.1: Network Timeout
**Scenario:** API request times out (no response)  
**Setup:**
```javascript
// fetch() throws
TypeError: Failed to fetch
```
**Expected Behavior:**
- Caught in catch block
- `err.message.includes('fetch')` = true
- Shows: "Network error. Please check your connection"

---

### Test Case 6.2: CORS Error (if applicable)
**Scenario:** Cross-origin request blocked  
**Setup:**
```javascript
// fetch() throws
Error: CORS policy blocked
```
**Expected Behavior:**
- Shows network error
- Suggests: refresh page, check browser console

---

### Test Case 6.3: DNS Resolution Failure
**Scenario:** api.anthropic.com unreachable  
**Expected Behavior:**
- fetch() fails
- Shows network error
- User should check internet connection

---

## 🔧 Test Case 7: Edge Cases

### Test Case 7.1: API Returns HTML Instead of JSON
**Scenario:** API error page returned (5xx server error)  
**Setup:**
```javascript
{
  content: [{
    text: '<html><body>503 Service Unavailable</body></html>'
  }]
}
```
**Expected Behavior:**
- `jsonStart = indexOf('{')` returns -1 (no JSON)
- Throws "No JSON found in response"
- Shows empty response error

---

### Test Case 7.2: Multiple JSON Objects in Response
**Scenario:** Response has analysis + debug info  
**Setup:**
```javascript
{
  content: [{
    text: 'Debug: Processing...\n{"executiveSummary": {...}}'
  }]
}
```
**Expected Behavior:**
- Code uses `indexOf('{')` - finds first brace
- Should work if JSON is complete
- **TODO: Add validation that extracted JSON is complete**

---

### Test Case 7.3: User Modifies Text During Analysis
**Scenario:** User edits resume text while analyzing  
**Expected Behavior:**
- ✅ failureCount resets on text change (line 489)
- If analysis completes, shows results for old text
- Consider: disable textarea during analysis

---

## 📊 Testing Priority Matrix

| Priority | Category | Test Cases | Criticality |
|----------|----------|------------|-------------|
| P0 - Critical | Rate Limiting | 4.1, 4.2 | High - Blocks usage |
| P0 - Critical | Empty Response | 1.1, 1.3 | High - Common failure |
| P1 - High | JSON Parsing | 2.1, 2.2 | High - User confusion |
| P1 - High | Model Selection | 5.1, 5.3 | High - UX blocker |
| P2 - Medium | Resume Size | 3.1, 3.2 | Medium - User education |
| P2 - Medium | Network Errors | 6.1, 6.2 | Medium - Infrastructure |
| P3 - Low | Edge Cases | 7.1, 7.2 | Low - Rare scenarios |

---

## 🐛 Bugs Found During Test Case Design

### Bug 1: Missing Null Check for Rate Limit Windows
**Location:** Line ~235  
**Issue:** `Object.values(data.windows)[0]` could throw if windows is empty  
**Fix:**
```javascript
if (data.type === 'exceeded_limit' && data.windows && Object.keys(data.windows).length > 0) {
  const window = Object.values(data.windows)[0];
  // ... rest of logic
}
```

---

### Bug 2: No Schema Validation After JSON Parse
**Location:** Line ~295  
**Issue:** Parsed JSON might be missing required fields  
**Fix:** Add validation before `setAnalysis()`
```javascript
const parsedAnalysis = JSON.parse(jsonString);

// Validate schema
if (!parsedAnalysis.executiveSummary || !parsedAnalysis.positions) {
  throw new Error('Invalid analysis schema - missing required fields');
}

setAnalysis(parsedAnalysis);
```

---

### Bug 3: Textarea Not Disabled During Analysis
**Location:** Line ~481  
**Issue:** User can edit text while analyzing, causing confusion  
**Fix:**
```javascript
<textarea
  value={resumeText}
  onChange={(e) => { setResumeText(e.target.value); setFailureCount(0); }}
  disabled={loading}  // ADD THIS
  // ...
/>
```

---

## 🎯 Implementation Checklist

**Phase 1: Critical Fixes**
- [ ] Add null check for rate limit windows (Bug 1)
- [ ] Add schema validation after JSON parse (Bug 2)
- [ ] Disable textarea during analysis (Bug 3)
- [ ] Test all P0 test cases

**Phase 2: Error Message Improvements**
- [ ] Test all P1 test cases
- [ ] Refine error messages based on test results
- [ ] Add specific guidance for each error type

**Phase 3: Edge Cases**
- [ ] Test all P2-P3 test cases
- [ ] Document known limitations
- [ ] Add FAQ section for common issues

---

## 📝 Testing Instructions for Opus

**Context Needed:**
1. Current Phase1ResumeAnalyzer.jsx artifact
2. This test case document
3. Error handling section (lines 220-370)
4. User's specific error scenario

**Analysis Request:**
"Review the error handling code against these test cases. Identify:
1. Which test cases are currently handled
2. Which test cases would fail
3. Priority bugs/improvements
4. Recommended fixes with code samples"

**Specific Debugging:**
If user has console output, ask Opus to:
1. Match output to specific test case
2. Identify root cause
3. Suggest immediate workaround
4. Propose permanent fix

---

**Last Updated:** January 8, 2026  
**Total Test Cases:** 23  
**Critical Bugs Found:** 3  
**Status:** Ready for Opus deep-dive
