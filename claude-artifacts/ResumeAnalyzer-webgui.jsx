// Resume Analyzer - Claude Artifacts WebGUI Version
// Version: 8.5.3 (January 16, 2026)
// Feature: Resume Narrative Analysis with Holistic Career Assessment
// Last Updated: v8.5.3 - Replaced per-position inference with holistic narrative analysis

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, FileText, Download, ChevronDown, ChevronUp, Loader, BarChart3, Info, AlertTriangle, XCircle } from 'lucide-react';

export default function Phase1ResumeAnalyzer() {
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
      name: '⭐ Opus',
      desc: 'Most capable, most tokens (complex resumes, Pro only)',
      tier: 'pro',
      tokenUsage: 'high'
    }
  ];

  const togglePosition = (id) => {
    const newSet = new Set(expandedPositions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedPositions(newSet);
  };

  const expandAll = () => {
    if (analysis) {
      setExpandedPositions(new Set(analysis.positions.map(p => p.id)));
    }
  };

  const collapseAll = () => {
    setExpandedPositions(new Set());
  };

  const getBalanceStatus = (percentage) => {
    if (percentage < 5) {
      return {
        level: 'critical',
        icon: 'XCircle',
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-700',
        message: 'Critical gap'
      };
    } else if (percentage < 13) {
      return {
        level: 'low',
        icon: 'AlertTriangle',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-700',
        message: 'Consider adding more'
      };
    } else if (percentage <= 27) {
      return {
        level: 'balanced',
        icon: 'CheckCircle',
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-700',
        message: 'Well balanced'
      };
    } else {
      return {
        level: 'high',
        icon: 'AlertTriangle',
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-700',
        message: 'Too many - diversify'
      };
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Built': 'bg-blue-500',
      'Lead': 'bg-orange-500',
      'Managed': 'bg-purple-500',
      'Improved': 'bg-green-500',
      'Collaborate': 'bg-pink-500'
    };
    return colors[category] || 'bg-slate-500';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please paste or upload a resume first');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model before analyzing');
      return;
    }

    setLoading(true);
    setError(null);
    setModelError('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 8000,  // v6.5.4 FIX: Increased from 5000 to prevent JSON truncation
          messages: [
            {
              role: 'user',
              content: `You are analyzing a resume. Return ONLY valid JSON with no markdown.

RESUME:
${resumeText}

CRITICAL: Keep ALL text fields concise (under 150 chars each). Be brief and direct.

Return JSON with this structure. For repairsNeeded, ONLY include the issue description (brief, 1 sentence). Save detailed suggestions for per-bullet context.

Identify these repair types:
- Metrics: bullets without quantified impact (%, $, numbers, time)
- Character count: bullets under 100 or over 210 chars
- Verb distribution: any category with fewer than 5% of total bullets
- Weak verbs: Responsible, Helped, Worked on, Participated
- Verb repetition: same category used twice in one position
- No impact: bullets lacking clear business outcome

AFTER analyzing all positions, provide a HOLISTIC Resume Narrative Analysis:

1. What is this person's primary career identity? (one sentence)
   - Is it CLEAR (✅) or UNCLEAR (⚠️)?

2. What is their career arc? (Early → Mid → Current stage progression)
   - Is it COHESIVE (✅) or DISJOINTED (⚠️)?

3. Narrative strength score: 0-100 based on career coherence
   - 85-100: Extremely clear, no confusion
   - 70-84: Mostly clear, minor gaps
   - 50-69: Some confusion, needs work
   - 0-49: Very unclear, major issues

4. What's working well? (Consistent threads, clear progression)

5. What confusion points might a hiring manager spot?
   - For each: Title, Issue, Fix, Hiring Manager Question

6. Which roles are they a strong/moderate/weak fit for?
   - Strong Match (90%+ fit): List specific roles
   - Moderate Match (70-85% fit): List roles with conditions
   - Weak Match (<60% fit): List poor-fit roles

7. How can they strengthen their narrative based on target roles?
   - Provide conditional guidance: "If targeting [Role Type]:\n→ [Action 1]\n→ [Action 2]"

Return this in the narrativeAnalysis object shown above. Do NOT provide per-position reasoning fields.

{
  "verdict": "one sentence summary",
  "blockers": 0,
  "risks": 0,
  "tweaks": 0,
  "totalBullets": 0,
  "bulletsWithMetrics": 0,
  "verbDistribution": {
    "Built": 0,
    "Lead": 0,
    "Managed": 0,
    "Improved": 0,
    "Collaborate": 0
  },
  "averageCharCount": 100,
  "totalWordCount": 0,
  "repairsNeeded": [
    {
      "severity": "risk",
      "position": "Position 1: Job Title",
      "bulletNumber": 1,
      "issue": "Brief issue only (no suggestion here)"
    }
  ],
  "narrativeAnalysis": {
    "primaryIdentity": "Technical Writer with Infrastructure Documentation Focus",
    "identityClear": true,
    "careerArc": "Technical Writer → Senior Technical Writer → Lead Documentation Specialist",
    "arcCohesive": true,
    "narrativeStrength": 85,
    "whatsWorking": "Strong consistency in technical documentation roles with clear progression from individual contributor to leadership. Documentation frameworks and cross-team collaboration are recurring strengths.",
    "confusionPoints": [
      {
        "title": "Job Title Inconsistency",
        "issue": "Multiple similar-sounding titles across positions",
        "fix": "Standardize title format in cover letter",
        "question": "What's the difference between these roles?"
      }
    ],
    "roleFitMatrix": {
      "strong": ["Technical Writer", "Documentation Lead", "Content Strategist"],
      "moderate": ["Technical Program Manager", "Developer Relations"],
      "weak": ["Software Engineer"]
    },
    "strengtheningRecommendations": "If targeting Technical Writer roles:\n→ Emphasize documentation framework experience\n→ Highlight cross-team collaboration\n\nIf targeting Documentation Lead roles:\n→ Showcase team leadership examples\n→ Demonstrate strategic documentation planning"
  },
  "positions": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Jan 2020 - Dec 2021",
      "duration": "2 years",
      "seniority": "Senior",
      "skillsHard": ["skill1", "skill2"],
      "skillsSoft": ["skill1", "skill2"],
      "bullets": [
        {
          "text": "Complete bullet text",
          "verb": "Built",
          "category": "Built",
          "hasMetrics": true,
          "metrics": ["50%", "$100K"],
          "charCount": 150,
          "recommendation": "Specific fix (only if has issues, max 100 chars)"
        }
      ]
    }
  ]
}`
            }
          ]
        })
      });

      const data = await response.json();

      // Debug logging
      console.log('API Response status:', response.status);
      console.log('API Response data type:', data.type);
      console.log('API Response has content:', !!data.content);
      if (data.content) {
        console.log('Content array length:', data.content.length);
        console.log('First content item:', data.content[0]);
      }
      console.log('Has error:', !!data.error);

      // Check for rate limit exceeded
      if (data.type === 'exceeded_limit' && data.windows) {
        const window = Object.values(data.windows)[0];
        const resetTime = new Date(window.resets_at * 1000);
        const now = new Date();
        const minutesUntilReset = Math.ceil((resetTime - now) / 60000);
        const hoursUntilReset = Math.floor(minutesUntilReset / 60);
        const remainingMinutes = minutesUntilReset % 60;

        let timeMessage = '';
        if (hoursUntilReset > 0) {
          timeMessage = `${hoursUntilReset} hour${hoursUntilReset > 1 ? 's' : ''}${remainingMinutes > 0 ? ` and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
        } else {
          timeMessage = `${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}`;
        }

        const resetTimeFormatted = resetTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        setError(
          `🚦 **Rate Limit Reached**\n\n` +
          `You've used your token allocation for this 5-hour window. This limit is shared across ALL Claude features (chat, artifacts, analysis).\n\n` +
          `**Token Limits by Plan:**\n` +
          `• Free tier: 500,000 tokens per 5-hour window\n` +
          `• Pro tier: 2,500,000 tokens per 5-hour window (5x more)\n\n` +
          `**When will it reset?**\n` +
          `• Your limit resets in **${timeMessage}**\n` +
          `• Reset time: **${resetTimeFormatted}**\n\n` +
          `**What you can do:**\n\n` +
          `1️⃣ **Wait for reset** - Your tokens will automatically refresh at reset time\n\n` +
          `2️⃣ **Upgrade to Pro** - Get 5x more tokens plus Opus model access\n\n` +
          `3️⃣ **Use tokens strategically:**\n` +
          `   • Haiku uses fewer tokens than Sonnet/Opus\n` +
          `   • Consider shorter resumes or analyzing in parts\n\n` +
          `**Pro Tip:** Check your token usage in claude.ai settings to track consumption across all features.`
        );
        setLoading(false);
        return;
      }

      if (data.error) {
        // Check if Opus access denied (Pro plan required)
        if (data.error.message &&
          (data.error.message.includes('permission') ||
            data.error.message.includes('access') ||
            data.error.message.toLowerCase().includes('unauthorized'))) {
          setModelError('Opus requires a Pro plan. Please select Sonnet or Haiku.');
          setSelectedModel('claude-sonnet-4-20250514'); // Auto-switch to Sonnet
        } else {
          setError(`API Error: ${data.error.message}`);
        }
        setLoading(false);
        return;
      }

      let analysisText = data.content[0].text.trim();
      analysisText = analysisText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      const jsonStart = analysisText.indexOf('{');
      const jsonEnd = analysisText.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in response');
      }

      const jsonString = analysisText.substring(jsonStart, jsonEnd + 1);
      const parsedAnalysis = JSON.parse(jsonString);

      setAnalysis(parsedAnalysis);
      setAnalyzed(true);
      setFailureCount(0); // Reset on success
    } catch (err) {
      console.error('Analysis error:', err);
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);

      // Categorize error types more precisely
      const isJSONParseError = err instanceof SyntaxError && err.message.includes('JSON');
      const isNetworkError = err.message.includes('fetch') || err.message.includes('network');
      const isEmptyResponse = err.message.includes('No JSON found');

      if (isNetworkError) {
        setError('Network error. Please check your connection and try again.');
      } else if (isEmptyResponse) {
        const newFailureCount = failureCount + 1;
        setFailureCount(newFailureCount);

        setError(
          `**Analysis Failed - Empty Response (Attempt ${newFailureCount})**\n\n` +
          `The API returned an incomplete response. This usually happens when:\n\n` +
          `1️⃣ **Resume is too complex** - Too many positions or bullets\n` +
          `2️⃣ **API timeout** - Processing took too long\n` +
          `3️⃣ **Model capacity** - Selected model can't handle this resume size\n\n` +
          `**Try these solutions:**\n\n` +
          `📝 **Reduce resume size:**\n` +
          `   • Remove oldest positions (keep most recent 3-4)\n` +
          `   • Reduce bullets to 2-3 per position\n` +
          `   • Remove extra whitespace/formatting\n\n` +
          `⚡ **Switch to Haiku:**\n` +
          `   • Faster processing\n` +
          `   • Better for larger resumes\n` +
          `   • Uses fewer tokens\n\n` +
          `🔄 **If problem persists after ${3 - newFailureCount} more attempts:**\n` +
          `   • Split resume into 2 parts (analyze separately)\n` +
          `   • Try again later when API is less busy`
        );
      } else if (isJSONParseError) {
        const newFailureCount = failureCount + 1;
        setFailureCount(newFailureCount);

        // Extract position info if available
        const positionMatch = err.message.match(/position (\d+)/);
        const errorPosition = positionMatch ? parseInt(positionMatch[1]) : null;

        if (newFailureCount < 3) {
          setError(
            `**JSON Parsing Failed (Attempt ${newFailureCount}/3)**\n\n` +
            `The AI-generated response has a syntax error${errorPosition ? ` around character ${errorPosition}` : ''}. This happens when the model makes a mistake formatting the analysis.\n\n` +
            `**Most likely cause:** Resume too complex for this model\n\n` +
            `**What to try:**\n` +
            `1. **Switch to Haiku** (most reliable for resumes)\n` +
            `2. **Simplify your resume:**\n` +
            `   • Remove oldest positions\n` +
            `   • Keep bullets under 200 chars\n` +
            `   • 2-3 bullets per position max\n` +
            `3. Wait 10-15 seconds and retry\n\n` +
            `💡 Haiku is faster and makes fewer JSON errors than Sonnet/Opus`
          );
        } else {
          setError(
            `**After 3 attempts, this appears to be a persistent issue.**\n\n` +
            `**Resume Length Guidelines:**\n` +
            `• Target: 350-500 words total\n` +
            `• Maximum: 3 bullets per position\n` +
            `• Limit: 4-5 positions maximum\n\n` +
            `**Your Options:**\n\n` +
            `1️⃣ **Significantly reduce resume size:**\n` +
            `   • Keep only 3 most recent positions\n` +
            `   • 2 bullets per position maximum\n\n` +
            `2️⃣ **Use Haiku model:**\n` +
            `   • Better handling of complex resumes\n` +
            `   • Faster processing\n\n` +
            `3️⃣ **Split into 2 parts:**\n` +
            `   • Part 1: Positions 1-2 only\n` +
            `   • Part 2: Positions 3-4 only\n` +
            `   • Analyze separately`
          );
        }
      } else {
        setError(`**Unexpected Error**\n\n${err.message}\n\nPlease report this error if it persists.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadJobHistory = (format) => {
    if (!analysis) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const ext = format === 'xml' ? 'txt' : format;
    const filename = `job_history_v6.5_${timestamp}.${ext}`;

    let content = '';

    if (format === 'xml') {
      content = `COMPREHENSIVE JOB HISTORY SUMMARIES - VERSION 6.5
Format: v2.0 Schema
Last Updated: ${timestamp}
Total Jobs: ${analysis.positions.length}

`;
      analysis.positions.forEach(p => {
        content += `<position id="${p.id}">
  <job_title>${p.title}</job_title>
  <company>${p.company}</company>
  <dates>${p.dates}</dates>
  <duration>${p.duration}</duration>
  <seniority>${p.seniority}</seniority>
  
  <bullets>
${p.bullets.map(b => `    <bullet>${b.text}</bullet>`).join('\n')}
  </bullets>
  
  <hard_skills>${p.skillsHard.join(', ')}</hard_skills>
  <soft_skills>${p.skillsSoft.join(', ')}</soft_skills>
</position>

`;
      });
    } else {
      // Markdown format
      content = `# Job History Summary

**Generated:** ${timestamp}  
**Total Positions:** ${analysis.positions.length}

---

`;
      analysis.positions.forEach(p => {
        content += `## ${p.title}

**Company:** ${p.company}  
**Dates:** ${p.dates}  
**Duration:** ${p.duration}  
**Seniority:** ${p.seniority}

### Key Responsibilities

${p.bullets.map(b => `- ${b.text}`).join('\n')}

### Skills Demonstrated

**Hard Skills:** ${p.skillsHard.join(', ')}  
**Soft Skills:** ${p.skillsSoft.join(', ')}

---

`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'Built': 'bg-blue-100 text-blue-800',
      'Lead': 'bg-yellow-100 text-yellow-800',
      'Managed': 'bg-purple-100 text-purple-800',
      'Improved': 'bg-green-100 text-green-800',
      'Collaborate': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
  };

  const getVerbPercentage = (count) => {
    if (!analysis) return 0;
    const total = Object.values(analysis.verbDistribution).reduce((a, b) => a + b, 0);
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const metricsPercentage = analysis && analysis.totalBullets > 0
    ? Math.round((analysis.bulletsWithMetrics / analysis.totalBullets) * 100)
    : 0;

  const groupRepairsBySeverity = () => {
    if (!analysis || !analysis.repairsNeeded) return { blocker: [], risk: [], tweak: [] };

    return {
      blocker: analysis.repairsNeeded.filter(r => r.severity === 'blocker'),
      risk: analysis.repairsNeeded.filter(r => r.severity === 'risk'),
      tweak: analysis.repairsNeeded.filter(r => r.severity === 'tweak')
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Session Warning Banner */}
        <div className="bg-amber-900/40 border border-amber-700 rounded-lg p-4 mb-8">
          <p className="text-amber-100">
            💾 <span className="font-semibold">Remember:</span> This tool only exists in your current Claude session. Your resume data is not saved anywhere. Download or save anything you want to keep before you close this chat!
          </p>
        </div>

        {/* Token Usage Display - v6.5.4 Added both Free/Pro tiers */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-8">
          <div className="flex items-center gap-2 text-white font-medium mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Token Usage
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-slate-300">Estimated Available:</span>
            <span className="text-green-400 font-semibold text-lg">~500,000 tokens</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span className="text-slate-400">Free: 500K / 5-hour window</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">Pro: 2.5M / 5-hour window</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            <Info className="w-3 h-3" />
            Token balance is approximate. Actual usage tracked by Claude across all features.
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Resume Analyzer <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full align-middle ml-2">v8.5.3</span>
          </h1>
          <p className="text-slate-300 text-lg">Transform your resume into a comprehensive job history database</p>
        </div>

        {!analyzed && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Upload or Paste Your Resume</h2>

            <div className="mb-6">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <div className="flex flex-col items-center">
                  <FileText className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-slate-300">Click to upload</span>
                  <span className="text-slate-500 text-sm">TXT file</span>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.text" />
              </label>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-slate-600"></div>
              <span className="px-4 text-slate-400">or</span>
              <div className="flex-1 border-t border-slate-600"></div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Paste Your Resume</label>
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setFailureCount(0); // Reset failure count when user edits
                }}
                placeholder="Paste your complete resume here..."
                className="w-full h-48 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Model Selection with Token Guidance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-medium">
                  Select Model <span className="text-red-400">*</span>
                </label>
                <button
                  onClick={() => setShowTokenInfo(!showTokenInfo)}
                  type="button"
                  className="text-slate-400 hover:text-slate-300 text-sm flex items-center gap-1 transition"
                >
                  <Info className="w-4 h-4" />
                  Token usage info
                </button>
              </div>

              {/* Collapsible Token Info */}
              {showTokenInfo && (
                <div className="mb-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg text-sm">
                  <p className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Token Usage Guide
                  </p>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">⚡</span>
                      <div>
                        <strong className="text-white">Haiku:</strong> Uses fewest tokens (~3K per analysis)
                        <br />
                        <span className="text-xs text-slate-400">Best for: Short resumes (1-3 positions), quick analysis</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">🎯</span>
                      <div>
                        <strong className="text-white">Sonnet:</strong> Moderate tokens (~5K per analysis)
                        <br />
                        <span className="text-xs text-slate-400">Best for: Most resumes (3-6 positions), balanced quality</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">⭐</span>
                      <div>
                        <strong className="text-white">Opus:</strong> Most tokens (~8K per analysis)
                        <br />
                        <span className="text-xs text-slate-400">Best for: Complex resumes (6+ positions), maximum quality (Pro only)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-700">
                    <p className="text-slate-300 text-xs font-medium mb-2">Token Limits:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        <span className="text-slate-400">Free: 500K / 5-hour window</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span className="text-slate-400">Pro: 2.5M / 5-hour window</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      💡 <strong>Multi-tool tip:</strong> Using Bullet Optimizer or Job Fit Analyzer later? Start with Haiku or Sonnet to conserve tokens.
                    </p>
                  </div>
                </div>
              )}

              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setModelError('');
                  setError('');
                }}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose a model...</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.desc}
                  </option>
                ))}
              </select>

              {/* Simplified help text - always visible */}
              <p className="text-slate-400 text-sm mt-2">
                💡 Not sure? Sonnet works great for most resumes. Click "Token usage info" above for details.
              </p>
            </div>

            {/* Model Error Display */}
            {modelError && (
              <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-semibold">Model Access Issue</p>
                  <p className="text-yellow-200 text-sm">{modelError}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-red-300 text-sm whitespace-pre-wrap">
                  {error.split('\n').map((line, i) => {
                    // Handle bold text **text**
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>
                        {parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-red-200 font-semibold">{part.slice(2, -2)}</strong>;
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </p>
                    );
                  })}

                  {/* Debug mode toggle */}
                  <div className="mt-3 pt-3 border-t border-red-700/50">
                    <button
                      onClick={() => setDebugMode(!debugMode)}
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      {debugMode ? '🐛 Hide Debug Info' : '🐛 Show Debug Info (for troubleshooting)'}
                    </button>

                    {debugMode && (
                      <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs font-mono">
                        <p className="text-slate-400">Debug info is logged to browser console (F12)</p>
                        <p className="text-slate-400 mt-1">Check Console tab for detailed API response</p>
                        <p className="text-slate-400 mt-1">Failure count: {failureCount}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={loading || !selectedModel}
              className={`w-full ${!selectedModel
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2`}
              title={!selectedModel ? 'Please select a model first' : ''}
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
            </button>

            {!selectedModel && (
              <p className="text-slate-400 text-sm mt-2 text-center">
                ⚠️ Select a model above to enable analysis
              </p>
            )}
          </div>
        )}

        {analyzed && analysis && (
          <>
            {/* Resume Narrative Analysis */}
            {analysis.narrativeAnalysis && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Resume Narrative Analysis</h2>

                {/* Primary Identity */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Primary Identity Detected</h3>
                  <p className="text-slate-200">{analysis.narrativeAnalysis.primaryIdentity}</p>
                  <span className="text-sm text-slate-400 mt-2 inline-block">
                    {analysis.narrativeAnalysis.identityClear ? '✅ CLEAR' : '⚠️ UNCLEAR'}
                  </span>
                </div>

                {/* Career Arc */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Career Arc</h3>
                  <p className="text-slate-200">{analysis.narrativeAnalysis.careerArc}</p>
                  <span className="text-sm text-slate-400 mt-2 inline-block">
                    {analysis.narrativeAnalysis.arcCohesive ? '✅ COHESIVE' : '⚠️ DISJOINTED'}
                  </span>
                </div>

                {/* Narrative Strength Score */}
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Narrative Strength</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-blue-400">
                      {analysis.narrativeAnalysis.narrativeStrength}/100
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-600 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysis.narrativeAnalysis.narrativeStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's Working */}
                {analysis.narrativeAnalysis.whatsWorking && (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3">✅ What's Working</h3>
                    <div className="text-slate-200 whitespace-pre-line">
                      {analysis.narrativeAnalysis.whatsWorking}
                    </div>
                  </div>
                )}

                {/* Confusion Points */}
                {analysis.narrativeAnalysis.confusionPoints && analysis.narrativeAnalysis.confusionPoints.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3">⚠️ Potential Confusion Points</h3>
                    {analysis.narrativeAnalysis.confusionPoints.map((point, idx) => (
                      <div key={idx} className="mb-4 last:mb-0">
                        <h4 className="text-white font-semibold mb-2">{point.title}</h4>
                        <p className="text-slate-300 mb-1"><strong>The Issue:</strong> {point.issue}</p>
                        <p className="text-slate-300 mb-1"><strong>The Fix:</strong> {point.fix}</p>
                        <p className="text-slate-400 text-sm italic">Hiring Manager Question: {point.question}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Role Fit Matrix */}
                {analysis.narrativeAnalysis.roleFitMatrix && (
                  <div className="bg-slate-700 rounded-lg p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3">🎯 Which Roles Will See You As a Strong Fit?</h3>

                    <div className="mb-4">
                      <h4 className="text-green-400 font-semibold mb-2">Strong Match (90%+ fit):</h4>
                      <ul className="list-disc list-inside text-slate-200 space-y-1">
                        {analysis.narrativeAnalysis.roleFitMatrix.strong.map((role, idx) => (
                          <li key={idx}>{role}</li>
                        ))}
                      </ul>
                    </div>

                    {analysis.narrativeAnalysis.roleFitMatrix.moderate && analysis.narrativeAnalysis.roleFitMatrix.moderate.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-yellow-400 font-semibold mb-2">Moderate Match (70-85% fit):</h4>
                        <ul className="list-disc list-inside text-slate-200 space-y-1">
                          {analysis.narrativeAnalysis.roleFitMatrix.moderate.map((role, idx) => (
                            <li key={idx}>{role}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.narrativeAnalysis.roleFitMatrix.weak && analysis.narrativeAnalysis.roleFitMatrix.weak.length > 0 && (
                      <div>
                        <h4 className="text-red-400 font-semibold mb-2">Weak Match (&lt;60% fit):</h4>
                        <ul className="list-disc list-inside text-slate-200 space-y-1">
                          {analysis.narrativeAnalysis.roleFitMatrix.weak.map((role, idx) => (
                            <li key={idx}>{role}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengthening Recommendations */}
                {analysis.narrativeAnalysis.strengtheningRecommendations && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">💡 Narrative Strengthening Recommendations</h3>
                    <div className="text-slate-200 whitespace-pre-line">
                      {analysis.narrativeAnalysis.strengtheningRecommendations}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Executive Summary */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Executive Summary</h2>

              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">The Verdict</h3>
                    <p className="text-slate-300">{analysis.verdict}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Prioritized Repairs</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-400">⛔ {analysis.blockers}</div>
                    <div className="text-sm text-red-300">Blockers</div>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">⚠️ {analysis.risks}</div>
                    <div className="text-sm text-orange-300">Risks</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">🔧 {analysis.tweaks}</div>
                    <div className="text-sm text-blue-300">Tweaks</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-6">
                <h4 className="text-white font-semibold mb-4">Repair Legend</h4>
                <div className="space-y-3 bg-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className="text-red-400 font-bold text-lg">⛔</span>
                    <div>
                      <div className="text-white font-semibold">Blockers</div>
                      <div className="text-slate-300 text-sm">Dealbreakers that risk auto-rejection</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-orange-400 font-bold text-lg">⚠️</span>
                    <div>
                      <div className="text-white font-semibold">Risks</div>
                      <div className="text-slate-300 text-sm">Significant issues that lower your score</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-blue-400 font-bold text-lg">🔧</span>
                    <div>
                      <div className="text-white font-semibold">Tweaks</div>
                      <div className="text-slate-300 text-sm">Minor refinements for polish</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Overall Statistics</h2>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Metrics Coverage</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{metricsPercentage}%</div>
                  <p className="text-slate-400 text-sm">{analysis.bulletsWithMetrics} of {analysis.totalBullets} bullets</p>
                  <div className="mt-4 text-sm text-slate-300">
                    Target: 70-80% of bullets should contain metrics
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Resume Length</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{analysis.totalWordCount}</div>
                  <p className="text-slate-400 text-sm">words across all bullets</p>
                  <div className="mt-4 text-sm text-slate-300">
                    Target: 350-500 words for work experience
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Action Verb Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.verbDistribution).map(([category, count]) => {
                    const percentage = getVerbPercentage(count);
                    const balanceStatus = getBalanceStatus(percentage);
                    const IconComponent = balanceStatus.icon === 'CheckCircle' ? CheckCircle
                      : balanceStatus.icon === 'AlertTriangle' ? AlertTriangle
                        : XCircle;

                    return (
                      <div key={category} className={`p-3 rounded-lg border ${balanceStatus.bgColor} ${balanceStatus.borderColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 ${balanceStatus.color}`} />
                            <span className="font-medium text-white">{category}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${balanceStatus.bgColor} ${balanceStatus.color} border ${balanceStatus.borderColor}`}>
                              {balanceStatus.message}
                            </span>
                          </div>
                          <span className="text-slate-300 text-sm">
                            {count} bullet{count !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${getCategoryColor(category)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${balanceStatus.color}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-300 text-sm font-medium mb-2">Balance Guide:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-slate-400">13-27%: Well balanced</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      <span className="text-slate-400">&lt;13%: Under-represented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-slate-400">&gt;27%: Over-represented</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span className="text-slate-400">&lt;5%: Critical gap</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prioritized Repairs Summary */}
            {analysis.repairsNeeded && analysis.repairsNeeded.length > 0 && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Prioritized Repairs Summary</h2>

                {(() => {
                  const grouped = groupRepairsBySeverity();

                  return (
                    <div className="space-y-6">
                      {grouped.blocker.length > 0 && (
                        <div>
                          <h3 className="text-red-400 font-semibold mb-4">⛔ BLOCKERS - {grouped.blocker.length} issues (Critical - Risks Auto-Rejection)</h3>
                          <div className="space-y-4">
                            {grouped.blocker.map((repair, idx) => (
                              <div key={idx} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="text-red-400 font-bold">{idx + 1}.</div>
                                  <div className="flex-1">
                                    <p className="text-red-300 font-medium">
                                      [{repair.position} - Bullet {repair.bulletNumber}] {repair.issue}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {grouped.risk.length > 0 && (
                        <div>
                          <h3 className="text-orange-400 font-semibold mb-4">⚠️ RISKS - {grouped.risk.length} issues (Significant Impact - Lowers Score)</h3>
                          <div className="space-y-4">
                            {grouped.risk.map((repair, idx) => (
                              <div key={idx} className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="text-orange-400 font-bold">{idx + 1}.</div>
                                  <div className="flex-1">
                                    <p className="text-orange-300 font-medium">
                                      [{repair.position} - Bullet {repair.bulletNumber}] {repair.issue}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {grouped.tweak.length > 0 && (
                        <div>
                          <h3 className="text-blue-400 font-semibold mb-4">🔧 TWEAKS - {grouped.tweak.length} issues (Minor Polish)</h3>
                          <div className="space-y-4">
                            {grouped.tweak.map((repair, idx) => (
                              <div key={idx} className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="text-blue-400 font-bold">{idx + 1}.</div>
                                  <div className="flex-1">
                                    <p className="text-blue-300 font-medium">
                                      [{repair.position} - Bullet {repair.bulletNumber}] {repair.issue}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Position-by-Position Analysis */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Position-by-Position Analysis</h2>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.positions.map((position) => {
                  const isExpanded = expandedPositions.has(position.id);
                  const isPortfolio = position.title.toLowerCase().includes('project');

                  return (
                    <div key={position.id} className="border border-slate-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => togglePosition(position.id)}
                        className="w-full bg-slate-700 hover:bg-slate-600 p-6 text-left transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              Position {position.id}: {position.title}
                            </h3>
                            <div className="text-sm text-slate-300 space-y-1">
                              {/* Inferred title removed - narrative analysis provides holistic guidance */}
                              <p>
                                <span className="font-semibold">Company:</span> {position.company}
                                {isPortfolio && <span className="text-gray-400 text-sm ml-2">(Independent Project)</span>}
                              </p>
                              <p><span className="font-semibold">Dates:</span> {position.dates}</p>
                              <p><span className="font-semibold">Seniority Level:</span> {position.seniority}</p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-6 bg-slate-800 border-t border-slate-600">
                          {/* Reasoning removed - replaced with holistic Resume Narrative Analysis at report level */}

                          {/* Skills Demonstrated */}
                          <div className="mb-6 grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-white font-semibold mb-2">Hard Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {position.skillsHard.map((skill, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full text-blue-300 text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-white font-semibold mb-2">Soft Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {position.skillsSoft.map((skill, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-purple-900/30 border border-purple-700 rounded-full text-purple-300 text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Bullets */}
                          <div className="mb-4">
                            <h4 className="text-white font-semibold mb-3">Resume Bullets:</h4>
                            <div className="space-y-4">
                              {position.bullets.map((bullet, idx) => (
                                <div key={idx} className="bg-slate-700 rounded-lg p-4">
                                  {/* v6.5.4 Issue #28 Fix: Removed duplicate verb badge - verb shown in audit table only */}
                                  <div className="flex items-start gap-3 mb-3">
                                    <span className={bullet.hasMetrics ? 'text-green-400' : 'text-slate-500'}>
                                      {bullet.hasMetrics ? '✓' : '-'}
                                    </span>
                                    <p className="flex-1 text-slate-200">{bullet.text}</p>
                                  </div>

                                  {/* Per-Bullet Audit Table */}
                                  <div className="mt-3 border-t border-slate-600 pt-3">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-left text-slate-400">
                                          <th className="pb-2">Check</th>
                                          <th className="pb-2">Status</th>
                                          <th className="pb-2">Analysis</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-slate-300">
                                        <tr>
                                          <td className="py-2 font-medium">Metrics</td>
                                          <td className="py-2">
                                            {bullet.hasMetrics ? (
                                              <span className="text-green-400">✅ Passed</span>
                                            ) : (
                                              <span className="text-red-400">❌ Failed</span>
                                            )}
                                          </td>
                                          <td className="py-2">
                                            {bullet.hasMetrics ? (
                                              <span>Found: {bullet.metrics.join(', ')}</span>
                                            ) : (
                                              <span>Lacks quantifiable impact.<br />Add: # of users, efficiency %, time saved...</span>
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 font-medium">Verb</td>
                                          <td className="py-2">
                                            <span className="text-green-400">✅ Passed</span>
                                          </td>
                                          <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${getCategoryBadgeColor(bullet.category)}`}>
                                              {bullet.category}: {bullet.verb}
                                            </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="py-2 font-medium">Length</td>
                                          <td className="py-2">
                                            {bullet.charCount >= 100 && bullet.charCount <= 210 ? (
                                              <span className="text-green-400">✅ Passed</span>
                                            ) : (
                                              <span className="text-red-400">❌ Failed</span>
                                            )}
                                          </td>
                                          <td className="py-2">
                                            {bullet.charCount}/210 chars
                                            {bullet.charCount < 100 && <span><br />({100 - bullet.charCount} chars below minimum)</span>}
                                            {bullet.charCount > 210 && <span><br />({bullet.charCount - 210} chars over maximum)</span>}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Per-Bullet Recommendations */}
                                  {(bullet.recommendation || (bullet.issues && bullet.issues.length > 0)) && (
                                    <div className="mt-3 bg-yellow-900/20 border border-yellow-700 rounded p-3">
                                      <p className="text-yellow-300 font-semibold text-sm mb-2">⚠️ RECOMMENDATION</p>
                                      {bullet.recommendation ? (
                                        <p className="text-slate-300 text-sm">{bullet.recommendation}</p>
                                      ) : (
                                        <ul className="text-slate-300 text-sm space-y-1">
                                          {bullet.issues.map((issue, issueIdx) => (
                                            <li key={issueIdx}>• {issue}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Position Summary Stats */}
                          <div className="bg-slate-700 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-2">Position Summary:</h4>
                            <div className="text-sm text-slate-300 space-y-1">
                              <p>Total bullets: {position.bullets.length} | With metrics: {position.bullets.filter(b => b.hasMetrics).length} ({Math.round((position.bullets.filter(b => b.hasMetrics).length / position.bullets.length) * 100)}%)</p>
                              <p>Confidence: {position.confidence}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Job History Export */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Download Your Job History</h2>

              <p className="text-slate-300 mb-6">
                Export your comprehensive job history in your preferred format:
              </p>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => downloadJobHistory('xml')}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition border-2 border-transparent hover:border-blue-500"
                >
                  <Download className="w-8 h-8 text-blue-400" />
                  <div className="text-center">
                    <div className="text-white font-semibold">XML Format</div>
                    <div className="text-slate-400 text-sm">For LLM processing</div>
                  </div>
                </button>

                <button
                  onClick={() => downloadJobHistory('md')}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition border-2 border-transparent hover:border-blue-500"
                >
                  <Download className="w-8 h-8 text-blue-400" />
                  <div className="text-center">
                    <div className="text-white font-semibold">Markdown</div>
                    <div className="text-slate-400 text-sm">For reading/sharing</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    downloadJobHistory('xml');
                    setTimeout(() => downloadJobHistory('md'), 500);
                  }}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition border-2 border-transparent hover:border-blue-500"
                >
                  <Download className="w-8 h-8 text-blue-400" />
                  <div className="text-center">
                    <div className="text-white font-semibold">Both (ZIP)</div>
                    <div className="text-slate-400 text-sm">Complete backup</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setAnalyzed(false);
                  setAnalysis(null);
                  setResumeText('');
                  setExpandedPositions(new Set());
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                Analyze Another Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
