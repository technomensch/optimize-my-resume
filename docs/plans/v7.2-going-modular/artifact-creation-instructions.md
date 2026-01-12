# Artifact Creation Instructions - Phase 1 Resume Analyzer

**Purpose:** Complete instructions for creating the Phase1ResumeAnalyzer.jsx artifact in Claude.ai

**Version:** 1.0 (Created: 2026-01-09)

**When to Use:** When user wants to create/recreate the React artifact for resume analysis

---

## Overview

This document contains all instructions specific to creating the Phase 1 Resume Analyzer as a React artifact in Claude.ai. These instructions are referenced from the main PROJECT-INSTRUCTIONS but kept separate to avoid token bloat.

---

## Artifact Configuration & UI Rules

### Model Selection in Artifacts

**Priority:** MODERATE  
**Applies to:** Phase 1 Resume Analyzer artifact

#### Purpose
Allow users to choose between Haiku, Sonnet, and Opus models based on their subscription tier and speed/quality preferences.

#### Available Models

**Claude Haiku 4:**
- Model string: `claude-haiku-4-20250514`
- Tier: Free + Pro
- Characteristics: Fast, efficient, good for quick analysis
- Token estimate: ~3K per Phase 1 analysis
- Best for: Short resumes (1-3 positions), quick analysis

**Claude Sonnet 4:**
- Model string: `claude-sonnet-4-20250514`
- Tier: Free + Pro
- Characteristics: Balanced speed and quality (Recommended default)
- Token estimate: ~5K per Phase 1 analysis
- Best for: Most resumes (3-6 positions), balanced quality

**Claude Opus 4:**
- Model string: `claude-opus-4-20250514`
- Tier: Pro only
- Characteristics: Most capable, highest quality analysis
- Token estimate: ~8K per Phase 1 analysis
- Best for: Complex resumes (6+ positions), maximum quality

#### User Experience

**Model Selector:**
- Display as dropdown with emoji indicators
- Default: No selection (forces user to choose)
- Show tier requirements (⭐ Pro only for Opus)
- Include brief descriptions

**Button State:**
- DISABLED when no model selected
- Show tooltip: "Please select a model first"
- Display warning text below button when disabled
- Enable only after model selection

**Error Handling:**
- Free users selecting Opus: API returns permission error
- Catch error and display: "Opus requires Pro plan. Please select Sonnet or Haiku."
- Auto-switch to Sonnet (recommended fallback)
- Clear error when user changes model

#### Token Usage Guidance

**Priority:** HIGH

**Purpose:** Educate users about token costs and strategic model selection to optimize their daily token budget, especially for multi-phase workflows.

**Free Tier Limits:**
- Daily limit: 500,000 tokens
- Shared across: All Claude features (chat, artifacts, analysis)
- Strategic guidance: For users planning to use Phase 2 (Bullet Optimization) or Phase 3 (JD Comparison), recommend starting with Haiku or Sonnet to conserve tokens for later phases

**UI Implementation:**

**Collapsible Help:**
- Toggle button: "Token usage info" with Info icon
- Expands/collapses detailed token guidance
- Shows token estimates per model
- Displays resume length recommendations
- Includes free tier limit information
- Provides multi-phase strategy tip

**Enhanced Descriptions:**
- Haiku: "Fast, fewest tokens (short resumes)"
- Sonnet: "Balanced, moderate tokens (recommended)"
- Opus: "Most capable, most tokens (complex resumes, Pro only)"

**Default State:**
- Token info collapsed by default (reduce visual clutter)
- Users can expand when needed

---

## Error Handling Guidelines

### JSON Parsing Error Handling

**Issue ID:** #3 & #7  
**Priority:** HIGH

#### Progressive Error Handling

**Known Issue - JSON Truncation:**
- Problem: API truncates JSON at ~17.6K-19K characters
- Affects: Resumes with 3+ positions
- Current API limit: `max_tokens: 8000` (Issue #7 fix)

**Attempt 1 and 2:**
```
"Analysis failed (Attempt X/3). This might be a temporary issue. 
Please wait a few moments and try clicking 'Analyze Resume' again."
```

**Attempt 3+:**
```
Display detailed guidance on resume length limitations:
- Target: 350-500 words for work experience
- Maximum bullets: 3 per position (baseline)

Provide Options:
1. Shorten resume (remove older positions, reduce bullets)
2. Analyze in 2 parts (Part 1: Recent, Part 2: Older)
```

### Rate Limit Error Handling

**Issue ID:** #5  
**Priority:** HIGH

#### Parse 'exceeded_limit' API Errors

**Display Requirements:**

**Header:** 🚦 Rate Limit Reached

**Content:**
- Explain limit: 500K tokens per 5-hour window (Free tier)
- Explain scope: Shared across all Claude features
- Show Reset Time: Convert Unix timestamp to human-readable time (e.g., "3:45 PM")
- Show Countdown: "X hours and Y minutes until reset"

**Options:**
1. Wait for automatic reset
2. Upgrade to Pro (5x tokens)
3. Use tokens strategically (Use Haiku/Sonnet)

---

## Architecture Overview

### Component Type
React Component (Single File)

### Size
- Lines: 1,200
- File size: ~54KB

### Technology Stack
- React (with Hooks)
- Lucide React icons
- Claude API (Anthropic)
- JavaScript ES6+

### Component Hierarchy

```
Phase1ResumeAnalyzer
├─ State Management
│  ├─ resumeText
│  ├─ selectedModel
│  ├─ analysis
│  ├─ loading
│  ├─ error
│  ├─ modelError
│  ├─ showTokenInfo
│  ├─ failureCount
│  └─ debugMode
│
├─ Helper Functions
│  ├─ getCategoryColor() - Verb color coding
│  ├─ getSeverityIcon() - Repair severity icons
│  ├─ getBalanceStatus() - Verb distribution balance
│  └─ getCategoryBadgeColor() - Category badge colors
│
├─ API Integration
│  └─ analyzeResume() - Claude API call with error handling
│
├─ UI Components
│  ├─ Header
│  ├─ Model Selection
│  │  ├─ Model Dropdown
│  │  └─ Token Info (collapsible)
│  ├─ Resume Input
│  │  └─ Textarea
│  ├─ Analyze Button
│  │  └─ Loading State
│  └─ Results Display
│     ├─ Executive Summary
│     │  ├─ Overall Grade
│     │  ├─ Scoring Breakdown
│     │  ├─ Action Verb Diversity
│     │  └─ Prioritized Repairs
│     ├─ Position-by-Position Review
│     │  ├─ Position Header
│     │  ├─ Bullet List
│     │  │  ├─ Color-coded Verb
│     │  │  ├─ Metric Indicator
│     │  │  └─ Per-Bullet Audit Table
│     │  └─ Position Summary Stats
│     └─ Prioritized Repairs Summary
└─ Error Display
```

---

## Step-by-Step Creation Process

### Step 1: Base React Component

**What:** Create the foundation with imports and basic structure

**Code:**
```javascript
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, FileText, Download, ChevronDown, ChevronUp, Loader, BarChart3, Info, AlertTriangle, XCircle } from 'lucide-react';

export default function Phase1ResumeAnalyzer() {
  // State will be added in Step 2
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* UI components will be added in Steps 5-6 */}
      </div>
    </div>
  );
}
```

**Explanation:**
- Imports React and all Lucide icons needed
- Creates functional component with hooks
- Sets up Tailwind container with gradient background
- Max width of 6xl for readability

---

### Step 2: State Management

**What:** Add all state variables for the component

**Code:**
```javascript
const [resumeText, setResumeText] = useState('');
const [analyzed, setAnalyzed] = useState(false);
const [expandedPositions, setExpandedPositions] = useState(new Set());
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedModel, setSelectedModel] = useState('');
const [modelError, setModelError] = useState('');
const [showTokenInfo, setShowTokenInfo] = useState(false);
const [failureCount, setFailureCount] = useState(0);
const [debugMode, setDebugMode] = useState(false);

const models = [
  { 
    id: 'claude-haiku-4-20250514', 
    name: '⚡ Haiku', 
    desc: 'Fast, fewest tokens (short resumes)',
    tier: 'free',
    tokenUsage: 'low'
  },
  { 
    id: 'claude-sonnet-4-20250514', 
    name: '🎯 Sonnet', 
    desc: 'Balanced, moderate tokens (recommended)',
    tier: 'free',
    tokenUsage: 'moderate'
  },
  { 
    id: 'claude-opus-4-20250514', 
    name: '👑 Opus', 
    desc: 'Most capable, most tokens (Pro only)',
    tier: 'pro',
    tokenUsage: 'high'
  }
];
```

**Explanation:**
- `resumeText`: User's pasted resume content
- `selectedModel`: Which Claude model to use
- `analysis`: Parsed API response with all analysis data
- `loading`: Shows loading spinner during API call
- `error`: Stores error messages for display
- `failureCount`: Tracks retry attempts for progressive error messages
- `showTokenInfo`: Controls token guidance visibility
- `models`: Configuration for model selection dropdown

---

### Step 3: Helper Functions

**What:** Utility functions for UI rendering

**Code:**
```javascript
const getCategoryColor = (category) => {
  const colors = {
    'Built': 'text-blue-600',
    'Lead': 'text-orange-600',
    'Managed': 'text-purple-600',
    'Improved': 'text-green-600',
    'Collaborate': 'text-pink-600'
  };
  return colors[category] || 'text-gray-600';
};

const getSeverityIcon = (severity) => {
  switch(severity) {
    case 'blocker': return <XCircle className="w-4 h-4 text-red-500" />;
    case 'risk': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'tweak': return <AlertCircle className="w-4 h-4 text-blue-500" />;
    default: return null;
  }
};

const getBalanceStatus = (percentage) => {
  if (percentage >= 28) return { status: 'Over-represented', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' };
  if (percentage >= 13) return { status: 'Well balanced', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' };
  if (percentage >= 5) return { status: 'Under-represented', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-600' };
  return { status: 'Critical gap', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600' };
};

const getCategoryBadgeColor = (category) => {
  const colors = {
    'Built': 'bg-blue-100 text-blue-800',
    'Lead': 'bg-orange-100 text-orange-800',
    'Managed': 'bg-purple-100 text-purple-800',
    'Improved': 'bg-green-100 text-green-800',
    'Collaborate': 'bg-pink-100 text-pink-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
```

**Explanation:**
- Maps verb categories to Tailwind color classes
- Provides severity icons for issue prioritization
- Calculates verb distribution balance status
- Returns badge styling for category pills

---

### Step 4: API Integration

**What:** Function to call Claude API with error handling

**Code:**
```javascript
const analyzeResume = async () => {
  if (!selectedModel) {
    setModelError('Please select a model before analyzing');
    return;
  }
  
  setLoading(true);
  setError(null);
  setModelError('');
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 8000, // Issue #7 fix - increased from 5000
        messages: [
          {
            role: "user",
            content: `Analyze this resume following Phase 1 Full Resume Analysis instructions:\n\n${resumeText}`
          }
        ]
      })
    });

    if (!response.ok) {
      // Handle rate limits
      if (response.status === 429) {
        const errorData = await response.json();
        if (errorData.error?.type === 'rate_limit_error') {
          // Extract reset time and show detailed rate limit message
          // (Implementation details in actual code)
        }
      }
      
      // Handle Pro-only model errors
      if (response.status === 403) {
        setModelError('Opus requires Pro plan. Switching to Sonnet...');
        setSelectedModel('claude-sonnet-4-20250514');
        return;
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    // Try to parse JSON
    const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      setAnalysis(parsed);
      setAnalyzed(true);
      setFailureCount(0);
    } else {
      throw new Error('No JSON found in response');
    }
    
  } catch (err) {
    setFailureCount(prev => prev + 1);
    
    if (failureCount >= 2) {
      // Show detailed error guidance
      setError('Analysis failed after 3 attempts. Resume may be too long...');
    } else {
      setError(`Analysis failed (Attempt ${failureCount + 1}/3). Please try again.`);
    }
  } finally {
    setLoading(false);
  }
};
```

**Explanation:**
- Validates model selection before API call
- Sets loading state and clears previous errors
- Constructs Claude API request with selected model
- Handles multiple error types (rate limits, permissions, JSON parsing)
- Progressive error messages based on failure count
- Parses JSON response from Claude

---

### Step 5: UI Components - Header & Model Selection

**What:** Top section with title, model selector, and token info

**Code:**
```jsx
<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <FileText className="w-8 h-8 text-blue-600" />
      <h1 className="text-3xl font-bold text-gray-900">
        Phase 1: Resume Analyzer
      </h1>
    </div>
  </div>

  {/* Model Selection */}
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Claude Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value);
          setModelError('');
        }}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >
        <option value="">Choose a model...</option>
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.desc}
          </option>
        ))}
      </select>
      {modelError && (
        <p className="mt-2 text-sm text-red-600">{modelError}</p>
      )}
    </div>

    {/* Token Info (Collapsible) */}
    <button
      onClick={() => setShowTokenInfo(!showTokenInfo)}
      className="flex items-center gap-2 text-sm text-blue-600"
    >
      <Info className="w-4 h-4" />
      Token usage info
      {showTokenInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
    
    {showTokenInfo && (
      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        {/* Token guidance content */}
      </div>
    )}
  </div>
</div>
```

---

### Step 6: UI Components - Results Display

**What:** Show analysis results with all sections

**Structure:**
1. Executive Summary (scores, metrics, repairs counts)
2. Action Verb Diversity (visual bar chart)
3. Position-by-Position Review (bullets with audit tables)
4. Prioritized Repairs Summary

**Key Features:**
- Color-coded action verbs
- Metric indicators (✓ or -)
- Per-bullet audit tables
- Collapsible sections
- Repair severity icons

---

## Testing Checklist

After building the artifact, verify:

### Basic Functionality
- [ ] Model selector displays all 3 models
- [ ] Token info expands/collapses correctly
- [ ] Analyze button disabled when no model selected
- [ ] Textarea accepts resume text
- [ ] Loading spinner shows during analysis

### API Integration
- [ ] Successfully analyzes 1-position resume
- [ ] Successfully analyzes 2-position resume
- [ ] ⚠️ KNOWN ISSUE: Fails with 3+ positions (Issue #7)
- [ ] Error messages display correctly
- [ ] Rate limit error shows countdown

### Results Display
- [ ] Executive summary renders
- [ ] Verb distribution chart shows
- [ ] Color-coded verbs display correctly
- [ ] Metric indicators (✓/-) show
- [ ] Per-bullet audit tables render
- [ ] Repairs summary lists issues

### Error Handling
- [ ] JSON parse errors handled
- [ ] Rate limit errors caught
- [ ] Pro-only model errors caught
- [ ] Progressive error messages (attempts 1-3)

---

## Known Issues

### Issue #7: JSON Truncation (ACTIVE)

**Problem:** API truncates JSON response at ~17.6K-19K characters when analyzing resumes with 3+ positions

**Workaround:** Analyze resumes with 1-2 positions only

**Solution:** See `/mnt/project/handoff-opus-truncation-fix.md`

**Options:**
1. Increase `max_tokens` to 8000 (currently implemented)
2. Sequential analysis architecture (4-6 hours to implement)

---

## Version History

**v6.5.0** (Dec 2024)
- Initial artifact with model selection
- Color-coded action verbs
- Metric detection

**v6.5.2** (Jan 2026)
- Enhanced error handling
- Verb distribution visualization
- Rate limit handling

**v6.5.3** (Jan 2026)
- Per-bullet repair recommendations
- Issue #6 completed
- Issue #7 documented

---

## Integration with PROJECT-INSTRUCTIONS

This file is referenced from PROJECT-INSTRUCTIONS.md in the following sections:

**Reference Pattern:**
```xml
<artifact_creation_for_phase_1>
  For complete instructions on creating the Phase 1 Resume Analyzer artifact,
  see: /mnt/project/artifact-creation-instructions.md
  
  Key sections:
  - Model Selection: Lines 15-95
  - Error Handling: Lines 97-160
  - Architecture: Lines 162-220
  - Step-by-Step Build: Lines 222-500
  - Testing: Lines 502-550
</artifact_creation_for_phase_1>
```

---

## Quick Start Options

### Option 1: Use Existing Artifact (30 seconds)
If artifact already exists in outputs:
```bash
cp /mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx .
```

### Option 2: Build from Scratch (2-3 hours)
Follow Steps 1-6 above in order

### Option 3: Request Claude to Generate
Paste this file to Claude and say:
"Create the Phase1ResumeAnalyzer artifact following these instructions"

---

**Created:** January 9, 2026  
**Version:** 1.0  
**File Location:** /mnt/project/artifact-creation-instructions.md  
**Referenced By:** PROJECT-INSTRUCTIONS.md (Phase 1 section)
