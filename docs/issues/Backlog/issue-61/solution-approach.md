# Solution Approach: Industry Transferability Display

## Overview

Display the industry transferability analysis that's already calculated in the backend.

---

## Data Source

The analysis result already contains:
```javascript
industryContext: {
  jdIndustry: string,
  candidateIndustry: string,
  transferabilityLevel: 'HIGH' | 'MODERATE' | 'LOW',
  penaltyApplied: number,
  reasoning: string
}
```

This data comes from `jfa_job-fit-assessment.md` module.

---

## Implementation

### Step 1: Extract Industry Data from Result

```javascript
const renderIndustryContext = () => {
  if (!analysisResult?.industryContext) return null;
  
  const { jdIndustry, candidateIndustry, transferabilityLevel, reasoning } = 
    analysisResult.industryContext;
  
  const levelColors = {
    HIGH: 'text-green-400 border-green-700',
    MODERATE: 'text-yellow-400 border-yellow-700',
    LOW: 'text-red-400 border-red-700'
  };
  
  return (
    <div className="industry-context-section">
      {/* UI components */}
    </div>
  );
};
```

### Step 2: Create UI Component

**Insert after Requirements Analysis section (~line 1720):**

```jsx
{/* Industry Context Section */}
{analysisResult?.industryContext && (
  <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
    <button 
      onClick={() => toggleSection('industryContext')}
      className="flex items-center justify-between w-full"
    >
      <h3 className="text-xl font-semibold text-white">
        🏢 Industry Context
      </h3>
      {expandedSections.industryContext ? <ChevronUp /> : <ChevronDown />}
    </button>
    
    {expandedSections.industryContext && (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded">
            <div className="text-slate-400 text-sm mb-1">Your Industry</div>
            <div className="text-white font-medium">
              {analysisResult.industryContext.candidateIndustry}
            </div>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <div className="text-slate-400 text-sm mb-1">JD Industry</div>
            <div className="text-white font-medium">
              {analysisResult.industryContext.jdIndustry}
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded border-2 ${
          levelColors[analysisResult.industryContext.transferabilityLevel]
        }`}>
          <div className="text-sm mb-1">Transferability Level</div>
          <div className="text-2xl font-bold">
            {analysisResult.industryContext.transferabilityLevel}
          </div>
          {analysisResult.industryContext.penaltyApplied > 0 && (
            <div className="text-sm mt-2 opacity-75">
              -{analysisResult.industryContext.penaltyApplied} points applied to fit score
            </div>
          )}
        </div>
        
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-slate-400 text-sm mb-2">Analysis</div>
          <p className="text-white text-sm">
            {analysisResult.industryContext.reasoning}
          </p>
        </div>
      </div>
    )}
  </div>
)}
```

---

## Files to Modify

1. **Should-I-Apply-webgui.jsx**
   - Add `renderIndustryContext()` component
   - Insert section in results view
   - Add to expandedSections state

---

## Testing

See `test-cases.md`
