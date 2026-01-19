# Solution Approach: Multi-JD Batch Analysis
**Branch:** `feat/issue-60-multi-jd-batch`

## Overview

Enable users to analyze their resume/job history against multiple job descriptions simultaneously and compare results.

---

## Prerequisites

Before implementing this feature:
1. ✅ Token usage tracking system
2. ✅ Smart caching mechanism
3. ✅ Batch progress UI components

---

## Implementation Strategy

### Phase 1: Data Structure

**New state variables:**
```javascript
const [jdBatch, setJdBatch] = useState([]); // Array of JD objects
const [batchResults, setBatchResults] = useState([]); // Array of analysis results
const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
const [isBatchMode, setIsBatchMode] = useState(false);
```

**JD object structure:**
```javascript
{
  id: string,
  company: string,
  title: string,
  content: string,
  fitScore: number | null,
  analysisResult: object | null,
  status: 'pending' | 'analyzing' | 'complete' | 'error'
}
```

---

### Phase 2: UI for Multi-Upload

**Add batch mode toggle:**
```jsx
<div>
  <label>
    <input 
      type="checkbox" 
      checked={isBatchMode}
      onChange={() => setIsBatchMode(!isBatchMode)}
    />
    Batch Mode (analyze multiple JDs)
  </label>
</div>
```

**JD list manager:**
```jsx
{isBatchMode && (
  <div className="batch-jd-manager">
    <h3>Job Descriptions ({jdBatch.length})</h3>
    {jdBatch.map((jd, idx) => (
      <div key={jd.id} className="jd-item">
        <input 
          placeholder="Company" 
          value={jd.company}
          onChange={(e) => updateJd(idx, 'company', e.target.value)}
        />
        <input 
          placeholder="Job Title"
          value={jd.title}
          onChange={(e) => updateJd(idx, 'title', e.target.value)}
        />
        <textarea 
          placeholder="Job Description"
          value={jd.content}
          onChange={(e) => updateJd(idx, 'content', e.target.value)}
        />
        <button onClick={() => removeJd(idx)}>Remove</button>
      </div>
    ))}
    <button onClick={addNewJd}>+ Add Another JD</button>
  </div>
)}
```

---

### Phase 3: Batch Analysis Logic

**Sequential processing with progress:**
```javascript
const runBatchAnalysis = async () => {
  setBatchProgress({ current: 0, total: jdBatch.length });
  const results = [];
  
  for (let i = 0; i < jdBatch.length; i++) {
    const jd = jdBatch[i];
    
    try {
      setBatchProgress({ current: i + 1, total: jdBatch.length });
      
      // Run analysis (reuse existing analyzeJobFit function)
      const result = await analyzeJobFit(
        resumeOrJobHistory,
        jd.content,
        jd.company,
        jd.title
      );
      
      results.push({
        ...jd,
        fitScore: result.fitScore,
        analysisResult: result,
        status: 'complete'
      });
      
      // Update UI incrementally
      setBatchResults([...results]);
      
    } catch (error) {
      results.push({
        ...jd,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return results;
};
```

---

### Phase 4: Comparison View

**Sort and display results:**
```jsx
<div className="batch-results">
  <h2>Batch Analysis Results</h2>
  
  <div className="sort-controls">
    <button onClick={() => sortBy('fitScore')}>Sort by Fit Score</button>
    <button onClick={() => sortBy('company')}>Sort by Company</button>
  </div>
  
  <div className="results-grid">
    {batchResults
      .sort((a, b) => b.fitScore - a.fitScore)
      .map(result => (
        <div key={result.id} className="result-card">
          <h3>{result.title} at {result.company}</h3>
          <div className="fit-score">
            {result.fitScore}%
          </div>
          <div className="recommendation">
            {result.fitScore >= 75 ? '✅ Strong Match' :
             result.fitScore >= 50 ? '⚠️ Moderate Match' :
             '❌ Weak Match'}
          </div>
          <button onClick={() => viewDetails(result)}>View Details</button>
        </div>
    ))}
  </div>
</div>
```

---

### Phase 5: Token Budget Management

**Track and display token usage:**
```javascript
const [tokenUsage, setTokenUsage] = useState({ used: 0, limit: 100000 });

const estimateBatchTokens = (numJDs) => {
  const avgTokensPerAnalysis = 3000;
  return numJDs * avgTokensPerAnalysis;
};

// Before batch analysis
const estimate = estimateBatchTokens(jdBatch.length);
if (estimate > tokenUsage.limit) {
  alert(`Estimated ${estimate} tokens. Consider analyzing in smaller batches.`);
}
```

---

## Files to Modify

1. **Should-I-Apply-webgui.jsx**
   - Add batch mode state and UI
   - Add `runBatchAnalysis()` function
   - Add comparison view components
   - Add token usage tracking

---

## Performance Considerations

**Optimization strategies:**
1. **Smart Caching:** Don't re-analyze resume for each JD
2. **Concurrent Requests:** Use Promise.all for parallel processing (if API allows)
3. **Pagination:** Show results incrementally as they complete
4. **Abort Controller:** Allow user to cancel batch mid-process

---

## Testing Checklist

See `test-cases.md`

---

## Token Budget Example

**Scenario:** User analyzes 10 JDs
- Resume analysis: 2,000 tokens (cached after first)
- Per-JD analysis: 2,000 tokens × 10 = 20,000 tokens
- **Total:** ~22,000 tokens

**Mitigation:**
- Warn if estimate > 50,000 tokens
- Suggest batching in groups of 5
- Offer "Quick Scan" mode with reduced analysis depth
