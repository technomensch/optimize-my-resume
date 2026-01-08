import React, { useState } from 'react';
import { AlertCircle, CheckCircle, FileText, Download, ChevronDown, Loader, BarChart3 } from 'lucide-react';

export default function Phase1ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState(new Set());
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 5000,
          messages: [
            {
              role: 'user',
              content: `You are analyzing a resume. Return ONLY valid JSON with no markdown.

RESUME:
${resumeText}

Return JSON with this structure. For repairsNeeded, identify issues with each bullet:
- Metrics: bullets without quantified impact (%, $, numbers)
- Character count: bullets under 100 or over 210 chars
- Verb distribution: any category with fewer than 5% of total bullets
- Weak verbs: Responsible, Helped, Worked on, Participated

{"verdict":"one sentence","blockers":0,"risks":0,"tweaks":0,"totalBullets":0,"bulletsWithMetrics":0,"verbDistribution":{"Built":0,"Lead":0,"Managed":0,"Improved":0,"Collaborate":0},"averageCharCount":100,"totalWordCount":0,"repairsNeeded":[{"severity":"tweak","position":"Position 1","bulletNumber":1,"issue":"description","suggestion":"fix"}],"positions":[{"id":1,"title":"Job","company":"Co","dates":"2020-2021","duration":"1yr","inferredTitle":"Role","seniority":"Mid","whyThisRole":"Based on...","scopeAnalysis":"Scope...","skillsHard":["skill"],"skillsSoft":["skill"],"confidence":"High","bullets":[{"text":"text","verb":"verb","category":"Built","hasMetrics":true,"metrics":["5%"],"charCount":100,"issues":[]}]}]}`
            }
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(`API Error: ${data.error.message}`);
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
      const analysis = JSON.parse(jsonString);

      setAnalysis(analysis);
      setAnalyzed(true);
    } catch (err) {
      // Check if it's a JSON parsing error (likely too large resume)
      if (err.message.includes('JSON') || err.message.includes('position')) {
        setError('Your resume is too large or complex for the analyzer to process. Try removing some older positions or simplifying the formatting, then try again.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadJobHistory = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const ext = format === 'xml' ? 'txt' : format;
    const filename = `job_history_v6.5_${timestamp}.${ext}`;
    
    let content = format === 'xml' 
      ? analysis.positions.map(p => `${p.title} at ${p.company} (${p.dates})`).join('\n')
      : analysis.positions.map(p => `# ${p.title}\n${p.company} | ${p.dates}\n`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const getCategoryColor = (category) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Session Warning Banner */}
        <div className="bg-amber-900/40 border border-amber-700 rounded-lg p-4 mb-8">
          <p className="text-amber-100">
            💾 <span className="font-semibold">Remember:</span> This tool only exists in your current Claude session. Your resume data is not saved anywhere. Download or save anything you want to keep before you close this chat!
          </p>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Phase 1: Resume Analyzer</h1>
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

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
            </button>
          </div>
        )}

        {analyzed && analysis && (
          <>
            {/* Section 1: Hiring Manager Perspective Preamble */}
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

            {/* Section 2 Cont: Overall Statistics */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Overall Statistics</h2>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Metrics Coverage</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{metricsPercentage}%</div>
                  <p className="text-slate-400 text-sm">{analysis.bulletsWithMetrics} of {analysis.totalBullets} bullets</p>
                </div>

                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Character Stats</h3>
                  <div className="text-xl font-bold text-green-400 mb-2">Avg: {analysis.averageCharCount}</div>
                  <p className="text-slate-400 text-sm">Total: {analysis.totalWordCount} words</p>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Action Verb Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(analysis.verbDistribution).map(([verb, count]) => {
                    const percentage = getVerbPercentage(count);
                    const colors = {
                      'Built': 'bg-blue-500',
                      'Lead': 'bg-yellow-500',
                      'Managed': 'bg-purple-500',
                      'Improved': 'bg-green-500',
                      'Collaborate': 'bg-pink-500',
                    };
                    return (
                      <div key={verb}>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300 font-medium">{verb}</span>
                          <span className="text-slate-400 text-sm">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors[verb] || 'bg-slate-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2 Cont: Prioritized Repairs */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Prioritized Repairs Summary</h2>

              {analysis.repairsNeeded && analysis.repairsNeeded.length > 0 ? (
                <div className="space-y-4">
                  {analysis.repairsNeeded.filter(r => r.severity === 'blocker').length > 0 && (
                    <div>
                      <h3 className="text-red-400 font-semibold mb-3">⛔ BLOCKERS ({analysis.repairsNeeded.filter(r => r.severity === 'blocker').length})</h3>
                      <div className="space-y-3">
                        {analysis.repairsNeeded.filter(r => r.severity === 'blocker').map((repair, idx) => (
                          <div key={idx} className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                            <div className="text-red-400 font-semibold text-sm mb-1">{repair.position} - Bullet {repair.bulletNumber}</div>
                            <div className="text-white text-sm mb-2">{repair.issue}</div>
                            <div className="text-red-300 text-xs">→ {repair.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.repairsNeeded.filter(r => r.severity === 'risk').length > 0 && (
                    <div>
                      <h3 className="text-orange-400 font-semibold mb-3">⚠️ RISKS ({analysis.repairsNeeded.filter(r => r.severity === 'risk').length})</h3>
                      <div className="space-y-3">
                        {analysis.repairsNeeded.filter(r => r.severity === 'risk').map((repair, idx) => (
                          <div key={idx} className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
                            <div className="text-orange-400 font-semibold text-sm mb-1">{repair.position} - Bullet {repair.bulletNumber}</div>
                            <div className="text-white text-sm mb-2">{repair.issue}</div>
                            <div className="text-orange-300 text-xs">→ {repair.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.repairsNeeded.filter(r => r.severity === 'tweak').length > 0 && (
                    <div>
                      <h3 className="text-blue-400 font-semibold mb-3">🔧 TWEAKS ({analysis.repairsNeeded.filter(r => r.severity === 'tweak').length})</h3>
                      <div className="space-y-3">
                        {analysis.repairsNeeded.filter(r => r.severity === 'tweak').map((repair, idx) => (
                          <div key={idx} className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                            <div className="text-blue-400 font-semibold text-sm mb-1">{repair.position} - Bullet {repair.bulletNumber}</div>
                            <div className="text-white text-sm mb-2">{repair.issue}</div>
                            <div className="text-blue-300 text-xs">→ {repair.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-400">No repairs needed</div>
              )}
            </div>

            {/* Section 3: Position Analysis */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Position Analysis</h2>
                <div className="flex gap-2">
                  <button onClick={expandAll} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Expand All</button>
                  <button onClick={collapseAll} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded">Collapse All</button>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.positions.map((position) => (
                  <div key={position.id} className="bg-slate-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => togglePosition(position.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-600 transition"
                    >
                      <div className="text-left flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Position {position.id}: "For this position, I think your job title might have been {position.inferredTitle}"</h3>
                        <div className="text-sm text-slate-300 space-y-1">
                          <p><span className="font-semibold">Inferred Title:</span> {position.inferredTitle}</p>
                          <p><span className="font-semibold">Company:</span> {position.company}</p>
                          <p><span className="font-semibold">Dates:</span> {position.dates}</p>
                          <p><span className="font-semibold">Seniority Level:</span> {position.seniority}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition flex-shrink-0 ${expandedPositions.has(position.id) ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedPositions.has(position.id) && (
                      <div className="border-t border-slate-600 px-6 py-6 space-y-6">
                        {/* Position Header Details */}
                        <div className="bg-slate-600 rounded-lg p-4">
                          <p className="text-slate-200 italic mb-3">
                            "I just read your resume as if I was an external hiring manager or recruiter. I ignored the titles on your resume and wanted to tell you what I interpreted your job title, or titles, was for each position."
                          </p>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-blue-400 font-semibold">Inferred Title:</span> <span className="text-slate-300">{position.inferredTitle}</span></p>
                            <p><span className="text-blue-400 font-semibold">Company:</span> <span className="text-slate-300">{position.company}</span></p>
                            <p><span className="text-blue-400 font-semibold">Dates:</span> <span className="text-slate-300">{position.dates}</span></p>
                            <p><span className="text-blue-400 font-semibold">Seniority Level:</span> <span className="text-slate-300">{position.seniority}</span></p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Why I Think This Was Your Role</h4>
                          <p className="text-slate-300 text-sm">{position.whyThisRole}</p>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2">Scope Analysis</h4>
                          <p className="text-slate-300 text-sm">{position.scopeAnalysis}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Hard Skills</h4>
                            <div className="text-slate-300 text-sm">{position.skillsHard?.join(', ') || 'N/A'}</div>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Soft Skills</h4>
                            <div className="text-slate-300 text-sm">{position.skillsSoft?.join(', ') || 'N/A'}</div>
                          </div>
                        </div>

                        <div className="bg-slate-600 rounded-lg p-3">
                          <span className="text-slate-300 text-sm"><span className="font-semibold">Confidence:</span> {position.confidence}</span>
                        </div>

                        <div className="border-t border-slate-500 pt-6">
                          <h4 className="text-white font-semibold mb-4">Resume Bullets</h4>
                          <div className="space-y-4">
                            {position.bullets.map((bullet, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex gap-3">
                                  <span className="text-white font-semibold">{bullet.hasMetrics ? '✓' : '-'}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(bullet.category)}`}>{bullet.category}</span>
                                      <span className="text-slate-400 text-xs">{bullet.charCount} chars</span>
                                    </div>
                                    <p className="text-slate-200">{bullet.text}</p>
                                  </div>
                                </div>

                                <div className="ml-6 grid grid-cols-3 gap-2 text-xs bg-slate-600 rounded p-3">
                                  <div>
                                    <div className="font-semibold text-slate-300">Metrics</div>
                                    <div className="text-slate-300">{bullet.hasMetrics ? `✓ ${bullet.metrics.join(', ')}` : '- None'}</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-300">Verb</div>
                                    <div className="text-slate-300">✓ {bullet.category}</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-300">Char Count</div>
                                    <div className={bullet.charCount < 100 || bullet.charCount > 210 ? 'text-red-400' : 'text-slate-300'}>{bullet.charCount}/210</div>
                                  </div>
                                </div>

                                {bullet.issues?.length > 0 && (
                                  <div className="ml-6 space-y-1">
                                    {bullet.issues.map((issue, i) => (
                                      <div key={i} className="flex gap-2 text-xs">
                                        <span>{issue.type === 'risk' ? '⚠️' : '🔧'}</span>
                                        <span className="text-slate-300">{issue.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Job History Export */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Download Job History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => downloadJobHistory('xml')} className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">XML Format</div>
                    <div className="text-sm text-slate-400">For LLM processing</div>
                  </div>
                  <Download className="w-4 h-4 ml-auto" />
                </button>
                <button onClick={() => downloadJobHistory('md')} className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Markdown</div>
                    <div className="text-sm text-slate-400">Human-readable</div>
                  </div>
                  <Download className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">What's Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 opacity-50">
                  <h3 className="font-semibold text-white mb-2">Phase 2: Bullet Optimization</h3>
                  <p className="text-slate-300 text-sm mb-2">Strengthen specific resume bullets</p>
                  <p className="text-slate-400 text-xs font-semibold">Coming soon...</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 opacity-50">
                  <h3 className="font-semibold text-white mb-2">Phase 3: JD Comparison</h3>
                  <p className="text-slate-300 text-sm mb-2">Get tailored bullets for specific roles</p>
                  <p className="text-slate-400 text-xs font-semibold">Coming soon...</p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setResumeText('');
                setAnalyzed(false);
                setAnalysis(null);
                setError(null);
                setExpandedPositions(new Set());
              }}
              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
            >
              Analyze Another Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
}