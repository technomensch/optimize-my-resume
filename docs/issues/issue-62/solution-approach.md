# Solution Approach: Loading State Progress Indicators
**Branch:** `feat/issue-62-loading-indicators`

## Overview

Enhance the loading experience with animated progress indicators and step-by-step feedback.

---

## Implementation

### Step 1: Add Progress State

```javascript
const [analysisProgress, setAnalysisProgress] = useState({
  step: 0,
  totalSteps: 4,
  currentStepName: '',
  startTime: null,
  estimatedDuration: 15000 // 15 seconds
});
```

### Step 2: Update Analysis Function

```javascript
const analyzeJobFit = async () => {
  setAnalysisProgress({
    step: 0,
    totalSteps: 4,
    currentStepName: 'Initializing...',
    startTime: Date.now(),
    estimatedDuration: 15000
  });
  
  try {
    // Step 1
    setAnalysisProgress(prev => ({
      ...prev,
      step: 1,
      currentStepName: 'Parsing job description...'
    }));
    
    // API call
    const result = await fetch(/* ... */);
    
    // Step 2
    setAnalysisProgress(prev => ({
      ...prev,
      step: 2,
      currentStepName: 'Analyzing requirements...'
    }));
    
    // Continue...
    
    // Step 3
    setAnalysisProgress(prev => ({
      ...prev,
      step: 3,
      currentStepName: 'Calculating fit score...'
    }));
    
    // Step 4
    setAnalysisProgress(prev => ({
      ...prev,
      step: 4,
      currentStepName: 'Finalizing results...'
    }));
    
    return result;
    
  } catch (error) {
    // Handle error
  }
};
```

### Step 3: Create Animated Progress Component

```jsx
const AnimatedProgress = ({ progress }) => {
  const { step, totalSteps, currentStepName, startTime, estimatedDuration } = progress;
  const percentComplete = (step / totalSteps) * 100;
  
  // Calculate elapsed and remaining time
  const elapsed = Date.now() - (startTime || Date.now());
  const remaining = Math.max(0, estimatedDuration - elapsed);
  const remainingSeconds = Math.ceil(remaining / 1000);
  
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div 
          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
      
      {/* Current Step */}
      <div className="flex items-center gap-3">
        <div className="animate-spin">
          <Loader className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-white font-medium">{currentStepName}</span>
      </div>
      
      {/* Step Counter */}
      <div className="text-slate-400 text-sm">
        Step {step} of {totalSteps}
      </div>
      
      {/* Time Estimate */}
      {remainingSeconds > 0 && (
        <div className="text-slate-400 text-sm">
          ~{remainingSeconds} seconds remaining
        </div>
      )}
      
      {/* Step List */}
      <div className="space-y-2">
        {['Parse JD', 'Analyze Requirements', 'Calculate Fit', 'Finalize'].map((stepName, idx) => (
          <div key={idx} className={`flex items-center gap-2 ${
            idx < step ? 'text-green-400' :
            idx === step ? 'text-blue-400' :
            'text-slate-500'
          }`}>
            {idx < step && <CheckCircle className="w-4 h-4" />}
            {idx === step && <Loader className="w-4 h-4 animate-spin" />}
            {idx > step && <Circle className="w-4 h-4" />}
            <span className="text-sm">{stepName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Files to Modify

1. **Should-I-Apply-webgui.jsx**
   - Add `analysisProgress` state
   - Update `analyzeJobFit()` to set progress
   - Replace static loading UI with `AnimatedProgress` component

---

## Testing

See `test-cases.md`
