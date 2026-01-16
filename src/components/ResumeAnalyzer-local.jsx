import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, FileText, Download, ChevronDown, ChevronUp, Loader, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import OllamaService from '../services/ollamaService';
import modelsConfig from '../config/models.json';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState(new Set());
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState('checking');
  const [debugMode, setDebugMode] = useState(false);

  // Load models from config on mount
  const models = modelsConfig.ollama;

  // Check Ollama status and available models on mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    setOllamaStatus('checking');
    const isHealthy = await OllamaService.checkHealth();
    if (isHealthy) {
      const models = await OllamaService.listModels();
      setAvailableModels(models.map(m => m.name));
      setOllamaStatus('connected');

      // Auto-select recommended model if available
      // Handle :latest tag matching
      const recommended = modelsConfig.ollama.find(m => m.recommended);
      if (recommended) {
        const isAvailable = models.some(m =>
          m.name === recommended.id ||
          (m.name === `${recommended.id}:latest` && !recommended.id.includes(':'))
        );
        if (isAvailable) {
          setSelectedModel(recommended.id);
        }
      }
    } else {
      setOllamaStatus('disconnected');
    }
  };

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

    if (ollamaStatus !== 'connected') {
      setError('Ollama is not connected. Please make sure Ollama is running with: ollama serve');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Analyzing resume with model: ${selectedModel}`);
      const result = await OllamaService.analyzeResume(selectedModel, resumeText);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Ollama response:', result.text);

      // Parse the JSON response
      let analysisText = result.text.trim();

      // Remove markdown code blocks if present
      analysisText = analysisText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // Find JSON boundaries
      const jsonStart = analysisText.indexOf('{');
      const jsonEnd = analysisText.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in Ollama response');
      }

      const jsonString = analysisText.substring(jsonStart, jsonEnd + 1);
      const parsedAnalysis = JSON.parse(jsonString);

      setAnalysis(parsedAnalysis);
      setAnalyzed(true);
    } catch (err) {
      console.error('Analysis error:', err);
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);

      const isJSONParseError = err instanceof SyntaxError && err.message.includes('JSON');
      const isNetworkError = err.message.includes('fetch') || err.message.includes('network');
      const isEmptyResponse = err.message.includes('No JSON found');

      if (isNetworkError || err.message.includes('Ollama')) {
        setError(
          `**Ollama Connection Error**\n\n` +
          `Cannot connect to Ollama. Please check:\n\n` +
          `1. Ollama is running: \`ollama serve\`\n` +
          `2. Ollama is accessible at http://localhost:11434\n` +
          `3. The selected model is installed: \`ollama pull ${selectedModel}\`\n\n` +
          `Click "Check Status" button to retry connection.`
        );
      } else if (isEmptyResponse) {
        setError(
          `**Analysis Failed - Empty Response**\n\n` +
          `The model returned an incomplete response. This usually happens when:\n\n` +
          `1️⃣ **Resume is too complex** - Try a simpler resume or reduce content\n` +
          `2️⃣ **Model limitations** - Try a different model (Llama 3.1 recommended)\n` +
          `3️⃣ **Ollama timeout** - The model took too long to respond\n\n` +
          `**Try these solutions:**\n\n` +
          `• Switch to Llama 3.1 (most reliable)\n` +
          `• Reduce resume to 3-4 positions\n` +
          `• Keep bullets under 200 chars`
        );
      } else if (isJSONParseError) {
        setError(
          `**JSON Parsing Failed**\n\n` +
          `The model response has a syntax error. This can happen with:\n\n` +
          `• Very long or complex resumes\n` +
          `• Models that struggle with JSON formatting\n\n` +
          `**Try these solutions:**\n\n` +
          `1. **Switch to Llama 3.1** (best JSON accuracy)\n` +
          `2. **Simplify resume:**\n` +
          `   • Remove oldest positions\n` +
          `   • Keep 2-3 bullets per position\n` +
          `   • Limit to 4-5 positions maximum\n` +
          `3. **Try again** - Sometimes models produce better output on retry`
        );
      } else {
        setError(`**Unexpected Error**\n\n${err.message}\n\nPlease try again or switch models.`);
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

  // Filter models to only show ones that are actually installed
  // Handle Ollama's :latest tag - treat "model" and "model:latest" as the same
  const displayModels = models.filter(model => {
    if (availableModels.length === 0) return true;

    // Check exact match first
    if (availableModels.includes(model.id)) return true;

    // If model.id doesn't have a tag, check if model:latest exists
    if (!model.id.includes(':')) {
      return availableModels.includes(`${model.id}:latest`);
    }

    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Session Warning Banner - adapted for Ollama */}
        <div className="bg-amber-900/40 border border-amber-700 rounded-lg p-4 mb-8">
          <p className="text-amber-100">
            💾 <span className="font-semibold">Remember:</span> This tool only exists in your current Claude session. Your resume data is not saved anywhere. Download or save anything you want to keep before you close this chat!
          </p>
        </div>

        {/* Ollama Status Display - matching Token Usage style from original */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-8">
          <div className={`flex items-center justify-between ${ollamaStatus === 'connected'
            ? 'text-green-400'
            : ollamaStatus === 'disconnected'
              ? 'text-red-400'
              : 'text-blue-400'
            }`}>
            <div className="flex items-center gap-3">
              {ollamaStatus === 'connected' && (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <div className="text-white font-medium mb-1">Local Development Mode - Ollama</div>
                    <div className="text-slate-400 text-sm">
                      {availableModels.length} model{availableModels.length !== 1 ? 's' : ''} available • Unlimited usage
                    </div>
                  </div>
                </>
              )}
              {ollamaStatus === 'disconnected' && (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="text-white font-medium mb-1">Ollama Not Running</div>
                    <div className="text-slate-400 text-sm">
                      Start Ollama with: <code className="bg-slate-900/50 px-2 py-1 rounded">ollama serve</code>
                    </div>
                  </div>
                </>
              )}
              {ollamaStatus === 'checking' && (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <div className="text-white font-medium">Checking Ollama status...</div>
                </>
              )}
            </div>
            <button
              onClick={checkOllamaStatus}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Status
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Resume Analyzer <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full align-middle ml-2">v8.4.2</span>
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
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your complete resume here..."
                className="w-full h-48 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-medium">
                  Select Model <span className="text-red-400">*</span>
                </label>
                {availableModels.length > 0 && (
                  <span className="text-slate-400 text-sm">
                    {displayModels.length} of {models.length} configured models available
                  </span>
                )}
              </div>

              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setError('');
                }}
                disabled={ollamaStatus !== 'connected'}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose a model...</option>
                {displayModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.desc}
                  </option>
                ))}
              </select>

              <p className="text-slate-400 text-sm mt-2">
                💡 {displayModels.find(m => m.recommended)?.name || 'Llama 3.1'} is recommended for best results.
                All models run locally and are free.
              </p>

              {availableModels.length > 0 && displayModels.length < models.length && (
                <details className="mt-3">
                  <summary className="cursor-pointer p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-400 hover:bg-slate-700 transition">
                    <span className="font-medium">ℹ️ {models.length - displayModels.length} additional model{models.length - displayModels.length !== 1 ? 's' : ''} available (click to install)</span>
                  </summary>
                  <div className="mt-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm">
                    <p className="text-slate-300 text-xs mb-2">
                      Install these models to expand your options:
                    </p>
                    <div className="space-y-1">
                      {models
                        .filter(m => !availableModels.includes(m.id))
                        .map(m => (
                          <code key={m.id} className="block bg-slate-900/50 px-2 py-1 rounded text-blue-400 text-xs">
                            ollama pull {m.id}
                          </code>
                        ))
                      }
                    </div>
                  </div>
                </details>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-red-300 text-sm whitespace-pre-wrap">
                  {error.split('\n').map((line, i) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>
                        {parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-red-200 font-semibold">{part.slice(2, -2)}</strong>;
                          }
                          // Handle inline code
                          if (part.includes('`')) {
                            return part.split(/(`[^`]+`)/g).map((segment, k) => {
                              if (segment.startsWith('`') && segment.endsWith('`')) {
                                return <code key={k} className="bg-slate-900/50 px-1 py-0.5 rounded text-red-200">{segment.slice(1, -1)}</code>;
                              }
                              return <span key={k}>{segment}</span>;
                            });
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
                        <p className="text-slate-400 mt-1">Check Console tab for detailed response</p>
                        <p className="text-slate-400 mt-1">Ollama status: {ollamaStatus}</p>
                        <p className="text-slate-400 mt-1">Selected model: {selectedModel || 'none'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={loading || !selectedModel || ollamaStatus !== 'connected'}
              className={`w-full ${!selectedModel || ollamaStatus !== 'connected'
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2`}
              title={
                !selectedModel
                  ? 'Please select a model first'
                  : ollamaStatus !== 'connected'
                    ? 'Ollama is not connected'
                    : ''
              }
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

        {/* Analysis Results - Same as original, but with analysis data */}
        {analyzed && analysis && (
          <>
            {/* All the analysis display code from the original component */}
            {/* I'll include the key sections but keep it manageable */}

            {/* Section 1: Hiring Manager Perspective */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Hiring Manager Perspective</h2>
              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-200 italic">
                  "I just read your resume as if I was an external hiring manager or recruiter. I ignored the titles on your resume and wanted to tell you what I interpreted your job title, or titles, was for each position."
                </p>
              </div>
            </div>

            {/* Section 2: Executive Summary */}
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

            {/* Section 3: Overall Statistics */}
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

            {/* Section 4: Prioritized Repairs Summary */}
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

            {/* Section 5: Position-by-Position Analysis */}
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
                              Position {position.id}
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
                          {/* Reasoning */}
                          <div className="mb-6">
                            <h4 className="text-white font-semibold mb-2">Why I Think This Was Your Role:</h4>
                            <p className="text-slate-300">{position.reasoning || position.whyThisRole}</p>
                          </div>

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
                              {position.confidence && <p>Confidence: {position.confidence}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Job History Export */}
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
