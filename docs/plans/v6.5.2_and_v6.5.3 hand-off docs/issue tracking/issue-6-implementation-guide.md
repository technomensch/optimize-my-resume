# Issue #6 Implementation Guide
## Move Repair Recommendations from Executive Summary to Per-Bullet Context

**Status:** Ready for Implementation  
**Complexity:** HIGH (requires prompt changes + multiple UI updates)  
**Files Affected:** Phase1ResumeAnalyzer.jsx (prompt + UI sections)

---

## Overview

This issue moves detailed repair suggestions from the Executive Summary to appear contextually under each bullet's audit table. The Executive Summary will show only concise issue descriptions with links to the relevant position/bullet.

---

## Implementation Steps

### Step 1: Update API Prompt Schema (~line 127)

**Current Prompt:**
```javascript
"repairsNeeded": [
  {
    "severity": "risk",
    "position": "Position 1: Job Title",
    "bulletNumber": 1,
    "issue": "Clear description of what's wrong",
    "suggestion": "Specific, actionable fix with example"
  }
]
```

**New Prompt (ADD positionId):**
```javascript
"repairsNeeded": [
  {
    "severity": "risk",
    "position": "Position 1: Job Title",
    "positionId": 1,              // ADD THIS
    "bulletNumber": 1,
    "issue": "Brief description ONLY",
    "suggestion": "Detailed fix (shown in per-bullet context)"
  }
]
```

### Step 2: Add scroll-to-position Helper Function (~line 110)

```javascript
const scrollToPosition = (positionId) => {
  const element = document.getElementById(`position-${positionId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Optional: highlight briefly
    element.classList.add('ring-2', 'ring-blue-500');
    setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500'), 2000);
  }
};
```

### Step 3: Update Prioritized Repairs Summary Display (~line 760)

**Find the section rendering `analysis.repairsNeeded`**

**Current Code:**
```jsx
<div className="mb-4">
  <h4 className="text-red-300 font-semibold mb-2">
    {issue.position}
  </h4>
  <p className="text-red-200">{issue.issue}</p>
  <p className="text-red-100 text-sm mt-1">
    → {issue.suggestion}
  </p>
</div>
```

**New Code:**
```jsx
<div className="mb-2 flex items-start gap-3 p-2 hover:bg-slate-700/30 rounded transition">
  <span className="text-red-300 font-mono text-sm shrink-0">
    [P{issue.positionId}-B{issue.bulletNumber}]
  </span>
  <p className="text-red-200 flex-1 text-sm">{issue.issue}</p>
  <button 
    onClick={() => scrollToPosition(issue.positionId)}
    className="text-blue-400 hover:text-blue-300 text-xs underline shrink-0"
  >
    View →
  </button>
</div>
```

### Step 4: Add Position ID Anchors (~line 850+)

**Find position rendering loop**

**Current:**
```jsx
<div className="mb-8">
  <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
    <h3 className="text-2xl font-semibold text-white mb-4">
      Position {position.id}: {position.inferredTitle}
    </h3>
```

**Enhanced:**
```jsx
<div id={`position-${position.id}`} className="mb-8 scroll-mt-4">
  <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
    <h3 className="text-2xl font-semibold text-white mb-4">
      Position {position.id}: {position.inferredTitle}
    </h3>
```

### Step 5: Add Recommendations to Per-Bullet Audit (~line 900+)

**Find the section after each bullet's audit table**

**After the audit table closing tag `</table>`, ADD:**

```jsx
{/* Find specific recommendation for this bullet */}
{(() => {
  const repair = analysis.repairsNeeded?.find(
    r => r.positionId === position.id && r.bulletNumber === bulletIndex + 1
  );
  
  if (!repair) return null;
  
  const colorClasses = {
    risk: 'bg-yellow-900/20 border-yellow-700',
    blocker: 'bg-red-900/20 border-red-700',
    tweak: 'bg-blue-900/20 border-blue-700'
  };
  
  const iconMap = {
    risk: '⚠️ RECOMMENDATION',
    blocker: '⛔ CRITICAL FIX',
    tweak: '🔧 SUGGESTION'
  };
  
  return (
    <div className={`mt-3 p-3 rounded-lg border ${colorClasses[repair.severity] || colorClasses.tweak}`}>
      <p className="font-semibold text-white text-sm mb-1">
        {iconMap[repair.severity] || iconMap.tweak}
      </p>
      <p className="text-slate-300 text-sm">
        {repair.suggestion}
      </p>
    </div>
  );
})()}
```

---

## Testing Checklist

- [ ] Executive summary shows `[P1-B2]` format
- [ ] "View →" buttons scroll smoothly to positions
- [ ] Position anchors work (`id="position-X"`)
- [ ] Recommendations appear under correct bullets
- [ ] No duplicate suggestions (removed from summary)
- [ ] Severity colors match (yellow/red/blue)
- [ ] Icons display correctly (⚠️ ⛔ 🔧)
- [ ] Mobile responsive (buttons don't wrap awkwardly)
- [ ] Hover states work on repair rows
- [ ] Scroll target has visual feedback (ring effect)

---

## Visual Comparison

### Before:
```
PRIORITIZED REPAIRS
────────────────────
Position 1: AI Prompt Engineer - Bullet 2
Vague methodology description
→ Replace 'pioneering methodology'...
  (200+ lines for 6 repairs)
```

### After:
```
PRIORITIZED REPAIRS
────────────────────
[P1-B2] Vague methodology        [View →]
[P2-B1] Missing metrics          [View →]
  (30 lines for 6 repairs)

[User clicks or scrolls...]

POSITION 1: AI Prompt Engineer
  Bullet 2: [text]
  [Audit table]
  
  ⚠️ RECOMMENDATION
  Replace 'pioneering methodology'...
```

---

## Token Savings Estimate

- Typical resume (6 repairs): ~30 tokens saved
- Large resume (15 repairs): ~75 tokens saved
- Percentage: ~8% reduction in repair-related output

---

**Implementation Time:** ~30 minutes  
**Complexity:** HIGH (5 distinct code locations)  
**Breaking Changes:** None (additive only)  
**Rollback:** Easy (revert 5 changes)
