// Should-I-Apply - Job Fit Assessment WebGUI
// Version: 1.2.0 (January 18, 2026)
// Feature: Pre-application job fit analysis with evidence-based matching
// v1.2.0: Added per-JD customized bullets and summary generation (per ng_summary-generation.md)
//         - Only offered when fitScore >= 50 (per project instructions)
//         - Follows Guardrail #29 (Metric Preservation) and keyword evidence principle
//         - Includes keyword coverage report showing what was incorporated vs skipped
// v1.1.0: Added PDF download, simplified input options with auto-detection
// Based on: ResumeAnalyzer-webgui.jsx theming and jfa_* module logic

import React, { useState, useCallback } from 'react';
import {
  AlertCircle, CheckCircle, FileText, Upload, ChevronDown, ChevronUp,
  Loader, BarChart3, Info, AlertTriangle, XCircle, Briefcase,
  Target, FileCheck, ClipboardPaste, RefreshCw, Download, Sparkles, Copy
} from 'lucide-react';
import {
  parseOriginalHistory,
  determineExperienceLevel,
  extractJobHistoryFromLLMOutput,
  validateAndCorrectLLMResponse,
  callLLM,
  parseJSONResponse,
  generateWithValidationLoop,
  buildAnalysisPrompt,
  buildGenerationPrompt
} from '../src/validators/bullet-generation';

export default function ShouldIApply() {
  // State management
  const [step, setStep] = useState('input'); // 'input', 'analyzing', 'results'
  const [selectedModel, setSelectedModel] = useState('');
  const [modelError, setModelError] = useState('');
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [debugMode, setDebugMode] = useState(false);

  // Input sources
  const [resumeSource, setResumeSource] = useState(null); // { type: 'file'|'paste'|'existing', content, filename }
  const [jobHistorySource, setJobHistorySource] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  // Input method selection
  const [inputMethod, setInputMethod] = useState(null); // 'project', 'upload', 'paste'
  const [projectFileName, setProjectFileName] = useState('');

  // Text areas for paste
  const [pasteText, setPasteText] = useState('');
  const [detectedType, setDetectedType] = useState(null); // 'resume', 'job_history', 'jd', 'unknown'

  // Analysis results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(['summary', 'requirements']));

  // Per-JD Summary Generation (per ng_summary-generation.md)
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null); // { bullets: [], summary: '' }
  const [summaryError, setSummaryError] = useState(null);

  // Keyword Management (Issue #67, #69)
  const [keywordsToUse, setKeywordsToUse] = useState([]);
  const [keywordsToIgnore, setKeywordsToIgnore] = useState([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [keywordValidationResults, setKeywordValidationResults] = useState({}); // { keyword: { isValid: bool, reason: string } }
  const [showUnverifiedWarning, setShowUnverifiedWarning] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState(false);

  // Model configuration (same as ResumeAnalyzer)
  const models = [
    {
      id: 'claude-haiku-4-20250514',
      name: '⚡ Haiku',
      desc: 'Fast, fewest tokens (quick assessment)',
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
      desc: 'Most capable, most tokens (deep analysis, Pro only)',
      tier: 'pro',
      tokenUsage: 'high'
    }
  ];

  // Auto-detect content type from pasted text
  const detectContentType = useCallback((text) => {
    if (!text || text.trim().length < 50) return 'unknown';

    const lowerText = text.toLowerCase();

    // Job History indicators - check for XML structure first (job history in XML format)
    const xmlJobHistoryIndicators = [
      '<job_history',
      '<position',
      '<core_responsibilities>',
      '<key_achievements>',
      '<hard_skills_demonstrated>',
      '<soft_skills_demonstrated>',
      '<tools_technologies>',
      '<impact_metrics>',
      '<professional_summary>',
      '<honest_limitations>'
    ];

    const xmlScore = xmlJobHistoryIndicators.filter(ind => lowerText.includes(ind)).length;
    if (xmlScore >= 3) return 'job_history';

    // Job History indicators (markdown format with specific sections)
    const jobHistoryIndicators = [
      'professional summary',
      'core responsibilities',
      'key achievements',
      'hard skills demonstrated',
      'soft skills demonstrated',
      'tools & technologies',
      'impact metrics',
      'industry & domain',
      'team scope',
      'honest limitations',
      'position 0:',
      'position 1:',
      '## 🎯',
      '## 🏢',
      'version history',
      '### 📊 metadata',
      '### 🎯 core responsibilities',
      '### 🏆 key achievements'
    ];

    const jobHistoryScore = jobHistoryIndicators.filter(ind => lowerText.includes(ind)).length;

    // JD indicators
    const jdIndicators = [
      'requirements',
      'qualifications',
      'responsibilities',
      'what you\'ll do',
      'what we\'re looking for',
      'about the role',
      'about the position',
      'years of experience',
      'preferred qualifications',
      'nice to have',
      'required skills',
      'benefits',
      'compensation',
      'apply now',
      'we are looking for',
      'join our team'
    ];

    const jdScore = jdIndicators.filter(ind => lowerText.includes(ind)).length;

    // Resume indicators
    const resumeIndicators = [
      'objective',
      'summary',
      'work experience',
      'education',
      'skills',
      'contact',
      'email:',
      'phone:',
      'linkedin',
      'references',
      'gpa'
    ];

    const resumeScore = resumeIndicators.filter(ind => lowerText.includes(ind)).length;

    // Determine type based on scores
    if (jobHistoryScore >= 4) return 'job_history';
    if (jdScore >= 3 && jdScore > resumeScore) return 'jd';
    if (resumeScore >= 3) return 'resume';
    if (jobHistoryScore >= 2) return 'job_history';
    if (jdScore >= 2) return 'jd';
    if (resumeScore >= 2) return 'resume';

    return 'unknown';
  }, []);

  // Check keyword evidence (Issue #69)
  const checkKeywordEvidence = useCallback((keyword) => {
    if (!keyword || !jobHistorySource?.content) return { isValid: false, reason: 'No source data' };

    const cleanKeyword = keyword.replace(/^Custom: /, '');
    const lowerKeyword = cleanKeyword.toLowerCase();
    const sourceContent = jobHistorySource.content.toLowerCase();

    // Exact match or simple synonym check
    const isMatched = sourceContent.includes(lowerKeyword);

    return {
      isValid: isMatched,
      reason: isMatched ? 'Found in history' : 'No direct evidence found'
    };
  }, [jobHistorySource]);

  // Add custom keyword (Issue #67)
  const addCustomKeyword = () => {
    if (!customKeyword.trim()) return;

    const kw = customKeyword.trim();
    // Prepend 'Custom:' to distinguish from extracted keywords (Issue #67)
    const formattedKw = `Custom: ${kw}`;

    if (!keywordsToUse.includes(formattedKw) && !keywordsToIgnore.includes(formattedKw)) {
      setKeywordsToUse([...keywordsToUse, formattedKw]);

      // Validate custom keyword (Issue #69)
      const validation = checkKeywordEvidence(kw);
      setKeywordValidationResults(prev => ({
        ...prev,
        [formattedKw]: validation
      }));
    }
    setCustomKeyword('');
  };

  // Toggle keyword between USE and IGNORE lists
  const toggleKeyword = (keyword, currentList) => {
    if (currentList === 'use') {
      setKeywordsToUse(keywordsToUse.filter(k => k !== keyword));
      setKeywordsToIgnore([...keywordsToIgnore, keyword]);
    } else {
      setKeywordsToIgnore(keywordsToIgnore.filter(k => k !== keyword));
      setKeywordsToUse([...keywordsToUse, keyword]);
    }
  };

  // Load file from project (simulated - in real use, would access project files)
  const loadProjectFile = async () => {
    if (!projectFileName.trim()) return;

    // In a Claude artifact, we can't directly access /mnt/project files
    // This would need to be handled by the parent context
    // For now, we'll show a helpful message
    setError(
      `To use a project file, please:\n\n` +
      `1. Open your project files panel\n` +
      `2. Find "${projectFileName}"\n` +
      `3. Copy the contents\n` +
      `4. Use the "Paste content" option instead\n\n` +
      `Note: Direct project file access is not available in artifacts.`
    );
  };

  // Handle paste text change
  const handlePasteChange = (e) => {
    const text = e.target.value;
    setPasteText(text);
    if (text.trim().length > 100) {
      setDetectedType(detectContentType(text));
    } else {
      setDetectedType(null);
    }
  };

  // Confirm detected content type
  const confirmPastedContent = (confirmedType) => {
    if (confirmedType === 'jd') {
      setJobDescription(pasteText);
      setPasteText('');
      setDetectedType(null);
    } else if (confirmedType === 'resume') {
      setResumeSource({ type: 'paste', content: pasteText, filename: 'Pasted Resume' });
      setPasteText('');
      setDetectedType(null);
    } else if (confirmedType === 'job_history') {
      setJobHistorySource({ type: 'paste', content: pasteText, filename: 'Pasted Job History' });
      setPasteText('');
      setDetectedType(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e, targetType) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isPDF = fileName.endsWith('.pdf');
    const isDOCX = fileName.endsWith('.docx');
    const isMD = fileName.endsWith('.md');
    const isTXT = fileName.endsWith('.txt') || fileName.endsWith('.rtf');

    try {
      let content = '';

      if (isPDF || isDOCX) {
        // For binary files, we'll read as base64 and send to Claude for extraction
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Binary files are assumed to be resumes (job history would be md/txt with XML)
        setResumeSource({
          type: 'file',
          content: content,
          filename: file.name,
          isBinary: true,
          mimeType: isPDF ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        setInputMethod('upload');
      } else {
        // Text-based files (md, txt, rtf)
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        // Auto-detect based on content
        const detected = detectContentType(content);

        if (detected === 'job_history') {
          setJobHistorySource({ type: 'file', content, filename: file.name });
        } else {
          // Default to resume if not clearly job history
          setResumeSource({ type: 'file', content, filename: file.name });
        }
        setInputMethod('upload');
      }
    } catch (err) {
      setError(`Failed to read file: ${err.message}`);
    }

    // Reset file input
    e.target.value = '';
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(sectionId)) {
      newSet.delete(sectionId);
    } else {
      newSet.add(sectionId);
    }
    setExpandedSections(newSet);
  };

  // Get fit score color and label
  const getFitScoreDisplay = (score) => {
    if (score >= 90) return { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', label: 'Excellent Fit', emoji: '🎯' };
    if (score >= 80) return { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', label: 'Strong Fit', emoji: '✅' };
    if (score >= 75) return { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', label: 'Moderate Fit', emoji: '⚠️' };
    if (score >= 65) return { color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700', label: 'Weak Fit', emoji: '🤔' };
    return { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700', label: 'Poor Fit', emoji: '❌' };
  };

  // Get recommendation based on score
  const getRecommendation = (score) => {
    if (score >= 90) return { action: 'APPLY', message: 'You are an excellent candidate. Apply with confidence!' };
    if (score >= 80) return { action: 'APPLY', message: 'Strong match. Proceed with application and highlight your strengths.' };
    if (score >= 75) return { action: 'CONSIDER', message: 'Review the gaps below. Apply if you can address them in your cover letter.' };
    if (score >= 65) return { action: 'CAUTIOUS', message: 'Significant gaps exist. Consider if you can demonstrate transferable skills.' };
    return { action: 'SKIP', message: 'This role may not be the best match. Focus on roles better aligned with your experience.' };
  };

  // Run the job fit analysis
  const runAnalysis = async () => {
    // Validate inputs
    if (!selectedModel) {
      setError('Please select a model before analyzing');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide a job description to analyze');
      return;
    }

    if (!resumeSource && !jobHistorySource) {
      setError('Please provide either a resume or job history narrative');
      return;
    }

    setLoading(true);
    setError(null);
    setModelError('');
    setStep('analyzing');

    try {
      const experienceContent = jobHistorySource?.content || (resumeSource?.isBinary ? `[Binary file: ${resumeSource.filename}]` : resumeSource?.content) || '';
      const analysisPrompt = buildAnalysisPrompt(experienceContent, jobDescription);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 6000,
          messages: [
            {
              role: 'user',
              content: analysisPrompt
            }
          ]
        })
      });

      const data = await response.json();

      // Check for rate limit
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
          `You've used your token allocation for this 5-hour window.\n\n` +
          `**Token Limits:** Free: 500K / Pro: 2.5M per 5-hour window\n\n` +
          `**Reset:** ${timeMessage} (at ${resetTimeFormatted})\n\n` +
          `**Options:** Wait for reset, upgrade to Pro, or use Haiku for lower token usage.`
        );
        setLoading(false);
        setStep('input');
        return;
      }

      if (data.error) {
        if (data.error.message && (data.error.message.includes('permission') || data.error.message.includes('access'))) {
          setModelError('Opus requires a Pro plan. Please select Sonnet or Haiku.');
          setSelectedModel('claude-sonnet-4-20250514');
        } else {
          setError(`API Error: ${data.error.message}`);
        }
        setLoading(false);
        setStep('input');
        return;
      }

      // Parse the response
      let analysisText = data.content[0].text.trim();
      analysisText = analysisText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      const jsonStart = analysisText.indexOf('{');
      const jsonEnd = analysisText.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in response');
      }

      const jsonString = analysisText.substring(jsonStart, jsonEnd + 1);
      const parsedResult = JSON.parse(jsonString);

      setAnalysisResult(parsedResult);

      // Initialize keyword management state (Issue #67)
      setKeywordsToUse([...(parsedResult.matchedKeywords || [])]);
      setKeywordsToIgnore([...(parsedResult.missingKeywords || [])]);

      setStep('results');
      setFailureCount(0);

    } catch (err) {
      console.error('Analysis error:', err);

      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);

      if (newFailureCount < 3) {
        setError(
          `**Analysis Failed (Attempt ${newFailureCount}/3)**\n\n` +
          `The API response could not be parsed. This may be due to:\n\n` +
          `• Complex job description format\n` +
          `• API timeout\n\n` +
          `**Try:** Click "Analyze Fit" again, or switch to Haiku model.`
        );
      } else {
        setError(
          `**Persistent Error After 3 Attempts**\n\n` +
          `Suggestions:\n` +
          `• Simplify the job description (remove excessive formatting)\n` +
          `• Use Haiku model for more reliable parsing\n` +
          `• Try a shorter resume/job history`
        );
      }
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  // Reset to start over
  const resetAnalysis = () => {
    setGeneratingSummary(false);
    setSummaryError(null);
    setKeywordsToUse([]);
    setKeywordsToIgnore([]);
    setCustomKeyword('');
    setKeywordValidationResults({});
    setShowUnverifiedWarning(false);
    setPendingGeneration(false);
  };

  // Generate customized bullets and professional summary for this JD
  // Per ng_summary-generation.md: Only offer when match_score >= 50
  // Guardrail #19: Fit score must be mathematically consistent with gaps
  // Guardrail #29: Metric Preservation - never lose metrics during rewriting
  // Guardrail #32: Custom Keyword Evidence Check (Issue #69)
  const generateCustomizedContent = async (bypassWarning = false) => {
    if (!analysisResult || analysisResult.fitScore < 50) return;

    // Check for unevidenced keywords if not bypassed
    if (!bypassWarning) {
      const unevidenced = keywordsToUse.filter(kw => {
        const validation = keywordValidationResults[kw] || checkKeywordEvidence(kw);
        return !validation.isValid;
      });

      if (unevidenced.length > 0) {
        setShowUnverifiedWarning(true);
        setPendingGeneration(true);
        return;
      }
    }

    setGeneratingSummary(true);
    setSummaryError(null);
    setShowUnverifiedWarning(false);
    setPendingGeneration(false);

    try {
      // Build experienceContent from available sources (same logic as handleAnalyze)
      let experienceContent = '';
      if (jobHistorySource) {
        experienceContent = `JOB HISTORY NARRATIVE:\n${jobHistorySource.content}`;
      } else if (resumeSource) {
        if (resumeSource.isBinary) {
          experienceContent = `[Binary file: ${resumeSource.filename}]\nNote: This is a ${resumeSource.mimeType} file. Please extract and analyze the resume content.`;
        } else {
          experienceContent = `RESUME:\n${resumeSource.content}`;
        }
      }

      const generationPrompt = buildGenerationPrompt(
        experienceContent,
        jobDescription,
        analysisResult,
        keywordsToUse,
        keywordsToIgnore
      );

      // Call regeneration loop with all parameters needed for validation
      const loopResult = await generateWithValidationLoop(
        selectedModel,
        generationPrompt,           // The full generation prompt (built earlier in function)
        jobHistorySource,           // Raw job history for context
        analysisResult.positionSummary, // Use analysis position summary for JD context
        keywordsToUse,              // Keywords to incorporate
        [],                         // Honest limitations (can be extracted from job history or state if added later)
        {
          temperature: 0.3,
          max_tokens: 4000
        },
        resumeSource                // NEW: Pass resume source for history parsing
      );

      // ✅ Use the validated and auto-corrected content
      setGeneratedContent(loopResult.content);

      // Log validation summary
      console.log('Validation Report:', {
        attempts: loopResult.attempts,
        success: loopResult.success,
        summary: loopResult.validationResult.summary,
        totalValidators: 25,
        errorCount: loopResult.validationResult.errors.length,
        warningCount: loopResult.validationResult.warnings.length
      });

      // Auto-expand the new section
      const newExpanded = new Set(expandedSections);
      newExpanded.add('customized');
      setExpandedSections(newExpanded);

    } catch (err) {
      console.error('Generation error:', err);
      setSummaryError(`Failed to generate content: ${err.message}`);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Generate PDF report and download
  const downloadPdfReport = () => {
    if (!analysisResult) return;

    // Sanitize strings for filename
    const sanitize = (str) => (str || 'Unknown').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 50);

    const company = sanitize(analysisResult.positionSummary?.company || 'Company');
    const jobTitle = sanitize(analysisResult.positionSummary?.title || 'Position');
    const filename = `${company}-${jobTitle}-Should_I_Apply_report.pdf`;

    // Build HTML content for PDF
    const fitDisplay = getFitScoreDisplay(analysisResult.fitScore);
    const recommendation = getRecommendation(analysisResult.fitScore);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Should I Apply? - Job Fit Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1e293b;
            color: #e2e8f0;
            padding: 40px;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #475569;
          }
          .header h1 { 
            font-size: 28px; 
            color: #fff;
            margin-bottom: 10px;
          }
          .header .subtitle { 
            color: #94a3b8; 
            font-size: 14px;
          }
          .score-section {
            background: ${fitDisplay.bg.replace('/30', '')};
            border: 2px solid ${fitDisplay.border.replace('border-', '#').replace('-700', '')};
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
          }
          .score-section .score {
            font-size: 64px;
            font-weight: bold;
            color: ${fitDisplay.color.replace('text-', '')};
          }
          .score-section .label {
            font-size: 24px;
            color: ${fitDisplay.color.replace('text-', '')};
            margin-top: 10px;
          }
          .score-section .recommendation {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #475569;
          }
          .score-section .recommendation .action {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
          }
          .score-section .recommendation .message {
            color: #94a3b8;
            margin-top: 5px;
          }
          .section {
            background: #334155;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
          }
          .section h2 {
            color: #fff;
            font-size: 18px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 1px solid #475569;
          }
          .section h3 {
            color: #a78bfa;
            font-size: 14px;
            margin: 16px 0 10px 0;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-box {
            background: #334155;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
          }
          .stat-box .number {
            font-size: 28px;
            font-weight: bold;
          }
          .stat-box .label {
            font-size: 12px;
            color: #94a3b8;
          }
          .stat-box.matched .number { color: #4ade80; }
          .stat-box.partial .number { color: #facc15; }
          .stat-box.missing .number { color: #f87171; }
          .requirement-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            background: #1e293b;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
          }
          .status-matched { background: #166534; color: #4ade80; }
          .status-partial { background: #854d0e; color: #facc15; }
          .status-missing { background: #991b1b; color: #f87171; }
          .requirement-content { flex: 1; }
          .requirement-content .skill { color: #fff; font-weight: 500; }
          .requirement-content .evidence { color: #94a3b8; font-size: 13px; margin-top: 4px; }
          .requirement-content .source { color: #64748b; font-size: 12px; margin-top: 2px; }
          .gap-item {
            padding: 12px;
            background: #450a0a;
            border: 1px solid #991b1b;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          .gap-item .requirement { color: #fff; font-weight: 500; }
          .gap-item .severity { color: #f87171; font-size: 12px; }
          .gap-item .mitigation { color: #94a3b8; font-size: 13px; margin-top: 8px; }
          .strength-item {
            padding: 12px;
            background: #14532d;
            border: 1px solid #166534;
            border-radius: 8px;
            margin-bottom: 8px;
            color: #fff;
          }
          .tip-list {
            list-style: none;
          }
          .tip-list li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #e2e8f0;
          }
          .tip-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #a78bfa;
          }
          .keywords-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .keyword-group h3 {
            margin-bottom: 10px;
          }
          .keyword-group.matched h3 { color: #4ade80; }
          .keyword-group.missing h3 { color: #f87171; }
          .keyword-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .keyword-tag {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
          }
          .keyword-tag.matched { background: #166534; color: #4ade80; }
          .keyword-tag.missing { background: #991b1b; color: #f87171; }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #475569;
            color: #64748b;
            font-size: 12px;
          }
          @media print {
            body { background: #1e293b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Should I Apply? - Job Fit Report</h1>
          <p class="subtitle">
            ${analysisResult.positionSummary?.title || 'Position'} at ${analysisResult.positionSummary?.company || 'Company'}
            <br>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div class="score-section">
          <div class="score">${analysisResult.fitScore}%</div>
          <div class="label">${fitDisplay.emoji} ${fitDisplay.label}</div>
          <div class="recommendation">
            <div class="action">Recommendation: ${recommendation.action}</div>
            <div class="message">${recommendation.message}</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="number">${analysisResult.summaryStats?.totalRequirements || 0}</div>
            <div class="label">Total Requirements</div>
          </div>
          <div class="stat-box matched">
            <div class="number">${analysisResult.summaryStats?.matched || 0}</div>
            <div class="label">Matched</div>
          </div>
          <div class="stat-box partial">
            <div class="number">${analysisResult.summaryStats?.partial || 0}</div>
            <div class="label">Partial</div>
          </div>
          <div class="stat-box missing">
            <div class="number">${analysisResult.summaryStats?.missing || 0}</div>
            <div class="label">Missing</div>
          </div>
        </div>

        <div class="section">
          <h2>Requirements Analysis</h2>
          
          ${analysisResult.requirements?.hardSkillsRequired?.length > 0 ? `
            <h3>Hard Skills - Required</h3>
            ${analysisResult.requirements.hardSkillsRequired.map(item => `
              <div class="requirement-item">
                <span class="status-badge status-${item.status?.toLowerCase() || 'missing'}">${item.status === 'Matched' ? '✓' : item.status === 'Partial' ? '~' : '✗'} ${item.status}</span>
                <div class="requirement-content">
                  <div class="skill">${item.skill}</div>
                  ${item.evidence ? `<div class="evidence">${item.evidence}</div>` : ''}
                  ${item.source ? `<div class="source">Source: ${item.source}</div>` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          ${analysisResult.requirements?.hardSkillsPreferred?.length > 0 ? `
            <h3>Hard Skills - Preferred</h3>
            ${analysisResult.requirements.hardSkillsPreferred.map(item => `
              <div class="requirement-item">
                <span class="status-badge status-${item.status?.toLowerCase() || 'missing'}">${item.status === 'Matched' ? '✓' : item.status === 'Partial' ? '~' : '✗'} ${item.status}</span>
                <div class="requirement-content">
                  <div class="skill">${item.skill}</div>
                  ${item.evidence ? `<div class="evidence">${item.evidence}</div>` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          ${(analysisResult.requirements?.softSkillsRequired?.length > 0 || analysisResult.requirements?.softSkillsPreferred?.length > 0) ? `
            <h3>Soft Skills</h3>
            ${[...(analysisResult.requirements?.softSkillsRequired || []), ...(analysisResult.requirements?.softSkillsPreferred || [])].map(item => `
              <div class="requirement-item">
                <span class="status-badge status-${item.status?.toLowerCase() || 'missing'}">${item.status === 'Matched' ? '✓' : item.status === 'Partial' ? '~' : '✗'} ${item.status}</span>
                <div class="requirement-content">
                  <div class="skill">${item.skill}</div>
                  ${item.evidence ? `<div class="evidence">${item.evidence}</div>` : ''}
                </div>
              </div>
            `).join('')}
          ` : ''}

          ${analysisResult.requirements?.experience ? `
            <h3>Experience</h3>
            <div class="requirement-item">
              <span class="status-badge status-${analysisResult.requirements.experience.status?.toLowerCase() || 'missing'}">${analysisResult.requirements.experience.status}</span>
              <div class="requirement-content">
                <div class="skill">Required: ${analysisResult.requirements.experience.required}</div>
                <div class="evidence">You have: ${analysisResult.requirements.experience.candidate}</div>
              </div>
            </div>
          ` : ''}

          ${analysisResult.requirements?.education ? `
            <h3>Education</h3>
            <div class="requirement-item">
              <span class="status-badge status-${analysisResult.requirements.education.status?.toLowerCase() || 'missing'}">${analysisResult.requirements.education.status}</span>
              <div class="requirement-content">
                <div class="skill">Required: ${analysisResult.requirements.education.required}</div>
                <div class="evidence">You have: ${analysisResult.requirements.education.candidate}</div>
              </div>
            </div>
          ` : ''}
        </div>

        ${(analysisResult.gapAnalysis?.criticalGaps?.length > 0 || analysisResult.gapAnalysis?.strengthsToHighlight?.length > 0) ? `
          <div class="section">
            <h2>Gap Analysis & Strengths</h2>
            
            ${analysisResult.gapAnalysis?.criticalGaps?.length > 0 ? `
              <h3>Gaps to Address</h3>
              ${analysisResult.gapAnalysis.criticalGaps.map(gap => `
                <div class="gap-item">
                  <div class="requirement">${gap.requirement}</div>
                  <div class="severity">Severity: ${gap.severity}</div>
                  <div class="mitigation">Mitigation: ${gap.mitigation}</div>
                </div>
              `).join('')}
            ` : ''}

            ${analysisResult.gapAnalysis?.strengthsToHighlight?.length > 0 ? `
              <h3>Strengths to Highlight</h3>
              ${analysisResult.gapAnalysis.strengthsToHighlight.map(strength => `
                <div class="strength-item">${strength}</div>
              `).join('')}
            ` : ''}
          </div>
        ` : ''}

        ${(analysisResult.coverLetterTips?.length > 0 || analysisResult.interviewPrepTips?.length > 0) ? `
          <div class="section">
            <h2>Application Tips</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              ${analysisResult.coverLetterTips?.length > 0 ? `
                <div>
                  <h3>Cover Letter Tips</h3>
                  <ul class="tip-list">
                    ${analysisResult.coverLetterTips.map(tip => `<li>${tip}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${analysisResult.interviewPrepTips?.length > 0 ? `
                <div>
                  <h3>Interview Prep Tips</h3>
                  <ul class="tip-list">
                    ${analysisResult.interviewPrepTips.map(tip => `<li>${tip}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        ${(analysisResult.matchedKeywords?.length > 0 || analysisResult.missingKeywords?.length > 0) ? `
          <div class="section">
            <h2>ATS Keywords</h2>
            <div class="keywords-section">
              <div class="keyword-group matched">
                <h3>Matched Keywords</h3>
                <div class="keyword-tags">
                  ${(analysisResult.matchedKeywords || []).map(kw => `<span class="keyword-tag matched">${kw}</span>`).join('')}
                </div>
              </div>
              <div class="keyword-group missing">
                <h3>Missing Keywords</h3>
                <div class="keyword-tags">
                  ${(analysisResult.missingKeywords || []).map(kw => `<span class="keyword-tag missing">${kw}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="footer">
          Generated by Should I Apply? - Job Fit Assessment Tool<br>
          Part of the Optimize-My-Resume System
        </div>
      </body>
      </html>
    `;

    // Create a new window and print to PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.document.title = filename.replace('.pdf', '');
          printWindow.print();
        }, 250);
      };
    } else {
      // Fallback: download as HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.pdf', '.html');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setError('Pop-up blocked. Downloaded as HTML file instead. Open and use Print > Save as PDF.');
    }
  };

  // Render status badge
  const StatusBadge = ({ status }) => {
    const styles = {
      'Matched': 'bg-green-900/30 text-green-400 border-green-700',
      'Partial': 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      'Missing': 'bg-red-900/30 text-red-400 border-red-700',
      'Exceeded': 'bg-blue-900/30 text-blue-400 border-blue-700'
    };

    const icons = {
      'Matched': '✓',
      'Partial': '~',
      'Missing': '✗',
      'Exceeded': '+'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${styles[status] || styles['Missing']}`}>
        {icons[status] || '?'} {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Session Warning Banner */}
        <div className="bg-amber-900/40 border border-amber-700 rounded-lg p-4 mb-8">
          <p className="text-amber-100">
            💾 <span className="font-semibold">Remember:</span> This tool only exists in your current Claude session. Your data is not saved anywhere. Download or save your results before closing this chat!
          </p>
        </div>

        {/* Token Usage Display */}
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

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Should I Apply? <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded-full align-middle ml-2">v1.1.0</span>
          </h1>
          <p className="text-slate-300 text-lg">Get an honest assessment of your fit before you apply</p>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <>
            {/* Model Selection */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-400" />
                Step 1: Select Model
              </h2>

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
                          <strong className="text-white">Haiku:</strong> ~2K tokens per assessment
                          <br />
                          <span className="text-xs text-slate-400">Best for: Quick checks, simple JDs</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400">🎯</span>
                        <div>
                          <strong className="text-white">Sonnet:</strong> ~4K tokens per assessment
                          <br />
                          <span className="text-xs text-slate-400">Best for: Detailed analysis (recommended)</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400">⭐</span>
                        <div>
                          <strong className="text-white">Opus:</strong> ~6K tokens per assessment
                          <br />
                          <span className="text-xs text-slate-400">Best for: Complex roles, deep analysis (Pro only)</span>
                        </div>
                      </div>
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
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose a model...</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.desc}
                    </option>
                  ))}
                </select>

                {modelError && (
                  <div className="mt-2 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-300 text-sm">{modelError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Experience Section */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-purple-400" />
                Step 2: Your Experience
              </h2>

              <p className="text-slate-300 mb-6">
                Provide your resume or job history narrative. The system will automatically detect which type you've provided.
              </p>

              {/* Show current source if loaded */}
              {(resumeSource || jobHistorySource) && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium">
                          {jobHistorySource ? 'Job History Narrative' : 'Resume'} loaded
                        </p>
                        <p className="text-slate-300 text-sm">
                          {(jobHistorySource || resumeSource).filename}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setResumeSource(null);
                        setJobHistorySource(null);
                        setInputMethod(null);
                      }}
                      className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-300 text-sm rounded transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Three input options */}
              {!resumeSource && !jobHistorySource && (
                <div className="space-y-4">
                  {/* Option 1: Use file from project */}
                  <div className={`p-4 rounded-lg border-2 transition cursor-pointer ${inputMethod === 'project'
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setInputMethod('project')}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inputMethod === 'project' ? 'border-purple-400' : 'border-slate-500'
                        }`}>
                        {inputMethod === 'project' && <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />}
                      </div>
                      <span className="text-white font-medium">Use a file already in this project</span>
                    </div>

                    {inputMethod === 'project' && (
                      <div className="ml-8 mt-4 space-y-3">
                        <p className="text-slate-400 text-sm">
                          Enter the filename of your resume or job history narrative from your project files:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projectFileName}
                            onChange={(e) => setProjectFileName(e.target.value)}
                            placeholder="e.g., my-job-history.md or resume.txt"
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none text-sm"
                          />
                          <button
                            onClick={loadProjectFile}
                            disabled={!projectFileName.trim()}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${projectFileName.trim()
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                              }`}
                          >
                            Load File
                          </button>
                        </div>
                        <p className="text-slate-500 text-xs">
                          Tip: Check your project files panel for available files
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Upload file */}
                  <div className={`p-4 rounded-lg border-2 transition ${inputMethod === 'upload'
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-slate-600 hover:border-slate-500'
                    }`}>
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inputMethod === 'upload' ? 'border-purple-400' : 'border-slate-500'
                          }`}>
                          {inputMethod === 'upload' && <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />}
                        </div>
                        <span className="text-white font-medium">Upload a file</span>
                        <Upload className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm ml-8">
                        Upload your resume or job history narrative (.pdf, .docx, .txt, .rtf, or .md)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setInputMethod('upload');
                          handleFileUpload(e, 'auto');
                        }}
                        accept=".pdf,.docx,.doc,.txt,.rtf,.md"
                      />
                    </label>
                  </div>

                  {/* Option 3: Paste content */}
                  <div className={`p-4 rounded-lg border-2 transition cursor-pointer ${inputMethod === 'paste'
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setInputMethod('paste')}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inputMethod === 'paste' ? 'border-purple-400' : 'border-slate-500'
                        }`}>
                        {inputMethod === 'paste' && <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />}
                      </div>
                      <span className="text-white font-medium">Paste content</span>
                      <ClipboardPaste className="w-4 h-4 text-slate-400" />
                    </div>

                    {inputMethod === 'paste' && (
                      <div className="ml-8 mt-4 space-y-3">
                        <textarea
                          value={pasteText}
                          onChange={handlePasteChange}
                          placeholder="Paste your resume or job history narrative here..."
                          className="w-full h-40 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />

                        {pasteText.trim().length > 50 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {detectedType && detectedType !== 'unknown' && detectedType !== 'jd' ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400 text-sm">
                                    Detected: {detectedType === 'job_history' ? 'Job History Narrative' : 'Resume'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                                  <span className="text-yellow-400 text-sm">
                                    Could not auto-detect type (will analyze as general experience)
                                  </span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmPastedContent(detectedType === 'job_history' ? 'job_history' : 'resume');
                              }}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                            >
                              Use This Content
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {inputMethod !== 'paste' && (
                      <p className="text-slate-400 text-sm ml-8">
                        Paste your resume or job history narrative directly
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Step 3: Job Description
              </h2>

              <p className="text-slate-300 mb-4">
                Paste the job description you want to evaluate yourself against.
              </p>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-48 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none mb-4"
              />

              {jobDescription && (
                <p className="text-green-400 text-sm">✓ Job description provided ({jobDescription.split(/\s+/).length} words)</p>
              )}
            </div>

            {/* Error Display */}
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
                          return <span key={j}>{part}</span>;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={runAnalysis}
              disabled={loading || !selectedModel || !jobDescription.trim() || (!resumeSource && !jobHistorySource)}
              className={`w-full ${!selectedModel || !jobDescription.trim() || (!resumeSource && !jobHistorySource)
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
                } disabled:bg-slate-600 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing Fit...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Analyze Job Fit
                </>
              )}
            </button>

            {(!selectedModel || !jobDescription.trim() || (!resumeSource && !jobHistorySource)) && (
              <p className="text-slate-400 text-sm mt-2 text-center">
                ⚠️ {!selectedModel ? 'Select a model' : !jobDescription.trim() ? 'Add job description' : 'Add resume or job history'} to enable analysis
              </p>
            )}
          </>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
            <Loader className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-4">Analyzing Your Fit...</h2>
            <p className="text-slate-300 mb-8">
              Matching your experience against job requirements. This takes 10-30 seconds.
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <p className="text-slate-400 text-sm">✓ Parsing job description requirements</p>
              <p className="text-slate-400 text-sm">✓ Extracting your skills and experience</p>
              <p className="text-slate-400 text-sm">⏳ Matching requirements to evidence</p>
              <p className="text-slate-500 text-sm">○ Calculating fit score</p>
              <p className="text-slate-500 text-sm">○ Generating recommendations</p>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && analysisResult && (
          <>
            {/* Fit Score Hero */}
            <div className={`rounded-lg border p-8 mb-8 ${getFitScoreDisplay(analysisResult.fitScore).bg} ${getFitScoreDisplay(analysisResult.fitScore).border}`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-slate-300 text-sm mb-1">Your Fit Score</p>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-6xl font-bold ${getFitScoreDisplay(analysisResult.fitScore).color}`}>
                      {analysisResult.fitScore}%
                    </span>
                    <span className={`text-2xl ${getFitScoreDisplay(analysisResult.fitScore).color}`}>
                      {getFitScoreDisplay(analysisResult.fitScore).emoji} {getFitScoreDisplay(analysisResult.fitScore).label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">{analysisResult.positionSummary?.title || 'Position'}</p>
                  <p className="text-slate-300">{analysisResult.positionSummary?.company || ''}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="flex items-start gap-3">
                  {analysisResult.recommendation?.action === 'APPLY' && <CheckCircle className="w-6 h-6 text-green-400 mt-1" />}
                  {analysisResult.recommendation?.action === 'CONSIDER' && <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />}
                  {analysisResult.recommendation?.action === 'CAUTIOUS' && <AlertTriangle className="w-6 h-6 text-orange-400 mt-1" />}
                  {analysisResult.recommendation?.action === 'SKIP' && <XCircle className="w-6 h-6 text-red-400 mt-1" />}
                  <div>
                    <p className="text-white font-semibold text-lg">
                      Recommendation: {analysisResult.recommendation?.action || 'CONSIDER'}
                    </p>
                    <p className="text-slate-300">{analysisResult.recommendation?.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
                <p className="text-3xl font-bold text-white">{analysisResult.summaryStats?.totalRequirements || 0}</p>
                <p className="text-slate-400 text-sm">Total Requirements</p>
              </div>
              <div className="bg-slate-800 rounded-lg border border-green-700 p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{analysisResult.summaryStats?.matched || 0}</p>
                <p className="text-slate-400 text-sm">Matched</p>
              </div>
              <div className="bg-slate-800 rounded-lg border border-yellow-700 p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{analysisResult.summaryStats?.partial || 0}</p>
                <p className="text-slate-400 text-sm">Partial</p>
              </div>
              <div className="bg-slate-800 rounded-lg border border-red-700 p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{analysisResult.summaryStats?.missing || 0}</p>
                <p className="text-slate-400 text-sm">Missing</p>
              </div>
            </div>

            {/* Requirements Detail */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 mb-8">
              <button
                onClick={() => toggleSection('requirements')}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-purple-400" />
                  Requirements Analysis
                </h2>
                {expandedSections.has('requirements') ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedSections.has('requirements') && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Hard Skills Required */}
                  {analysisResult.requirements?.hardSkillsRequired?.length > 0 && (
                    <div>
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Hard Skills - Required
                      </h3>
                      <div className="space-y-2">
                        {analysisResult.requirements.hardSkillsRequired.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                            <StatusBadge status={item.status} />
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.skill}</p>
                              {item.evidence && <p className="text-slate-400 text-sm mt-1">{item.evidence}</p>}
                              {item.source && <p className="text-slate-500 text-xs mt-1">Source: {item.source}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hard Skills Preferred */}
                  {analysisResult.requirements?.hardSkillsPreferred?.length > 0 && (
                    <div>
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Hard Skills - Preferred
                      </h3>
                      <div className="space-y-2">
                        {analysisResult.requirements.hardSkillsPreferred.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                            <StatusBadge status={item.status} />
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.skill}</p>
                              {item.evidence && <p className="text-slate-400 text-sm mt-1">{item.evidence}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Soft Skills */}
                  {(analysisResult.requirements?.softSkillsRequired?.length > 0 || analysisResult.requirements?.softSkillsPreferred?.length > 0) && (
                    <div>
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Soft Skills
                      </h3>
                      <div className="space-y-2">
                        {[...(analysisResult.requirements.softSkillsRequired || []), ...(analysisResult.requirements.softSkillsPreferred || [])].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                            <StatusBadge status={item.status} />
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.skill}</p>
                              {item.evidence && <p className="text-slate-400 text-sm mt-1">{item.evidence}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience & Education */}
                  <div className="grid grid-cols-2 gap-4">
                    {analysisResult.requirements?.experience && (
                      <div className="p-4 bg-slate-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Experience</h4>
                        <p className="text-slate-300 text-sm">Required: {analysisResult.requirements.experience.required}</p>
                        <p className="text-slate-300 text-sm">You have: {analysisResult.requirements.experience.candidate}</p>
                        <StatusBadge status={analysisResult.requirements.experience.status} />
                      </div>
                    )}
                    {analysisResult.requirements?.education && (
                      <div className="p-4 bg-slate-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Education</h4>
                        <p className="text-slate-300 text-sm">Required: {analysisResult.requirements.education.required}</p>
                        <p className="text-slate-300 text-sm">You have: {analysisResult.requirements.education.candidate}</p>
                        <StatusBadge status={analysisResult.requirements.education.status} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Gap Analysis */}
            {(analysisResult.gapAnalysis?.criticalGaps?.length > 0 || analysisResult.gapAnalysis?.strengthsToHighlight?.length > 0) && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 mb-8">
                <button
                  onClick={() => toggleSection('gaps')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Gap Analysis & Strengths
                  </h2>
                  {expandedSections.has('gaps') ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expandedSections.has('gaps') && (
                  <div className="px-6 pb-6 space-y-6">
                    {analysisResult.gapAnalysis.criticalGaps?.length > 0 && (
                      <div>
                        <h3 className="text-red-400 font-medium mb-3">Gaps to Address</h3>
                        <div className="space-y-2">
                          {analysisResult.gapAnalysis.criticalGaps.map((gap, idx) => (
                            <div key={idx} className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                              <p className="text-white font-medium">{gap.requirement}</p>
                              <p className="text-slate-300 text-sm mt-1">Severity: {gap.severity}</p>
                              <p className="text-slate-400 text-sm mt-1">Mitigation: {gap.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.gapAnalysis.strengthsToHighlight?.length > 0 && (
                      <div>
                        <h3 className="text-green-400 font-medium mb-3">Strengths to Highlight</h3>
                        <div className="space-y-2">
                          {analysisResult.gapAnalysis.strengthsToHighlight.map((strength, idx) => (
                            <div key={idx} className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                              <p className="text-white">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Application Tips */}
            {(analysisResult.coverLetterTips?.length > 0 || analysisResult.interviewPrepTips?.length > 0) && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 mb-8">
                <button
                  onClick={() => toggleSection('tips')}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-400" />
                    Application Tips
                  </h2>
                  {expandedSections.has('tips') ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expandedSections.has('tips') && (
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisResult.coverLetterTips?.length > 0 && (
                      <div>
                        <h3 className="text-white font-medium mb-3">Cover Letter Tips</h3>
                        <ul className="space-y-2">
                          {analysisResult.coverLetterTips.map((tip, idx) => (
                            <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.interviewPrepTips?.length > 0 && (
                      <div>
                        <h3 className="text-white font-medium mb-3">Interview Prep Tips</h3>
                        <ul className="space-y-2">
                          {analysisResult.interviewPrepTips.map((tip, idx) => (
                            <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                              <span className="text-purple-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Keyword Management UI (Issue #67) */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 mb-8 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  Keyword Management
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
                    placeholder="Add custom keyword..."
                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-purple-500 outline-none"
                  />
                  <button
                    onClick={addCustomKeyword}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* USE Column */}
                <div className="bg-slate-900/40 rounded-lg p-4 border border-green-900/30">
                  <h3 className="text-green-400 font-medium mb-4 flex items-center justify-between">
                    <span>USE THESE KEYWORDS</span>
                    <span className="text-xs bg-green-900/50 px-2 py-0.5 rounded">{keywordsToUse.length}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsToUse.map((kw, idx) => {
                      const validation = keywordValidationResults[kw] || { isValid: true };
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleKeyword(kw, 'use')}
                          className={`group px-3 py-1.5 rounded text-sm transition flex items-center gap-2 ${!validation.isValid
                            ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-300'
                            : 'bg-green-900/30 border border-green-700 text-green-300'
                            } hover:border-slate-400`}
                          title={!validation.isValid ? 'Unverified: Evidence not found in history' : 'Verified'}
                        >
                          {kw}
                          {kw.includes('Custom:') && <span className="text-[10px] bg-purple-900/50 px-1 rounded text-purple-300">custom</span>}
                          {!validation.isValid && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                          <XCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                      );
                    })}
                    {keywordsToUse.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No keywords selected for inclusion</p>
                    )}
                  </div>
                </div>

                {/* IGNORE Column */}
                <div className="bg-slate-900/40 rounded-lg p-4 border border-red-900/30">
                  <h3 className="text-red-400 font-medium mb-4 flex items-center justify-between">
                    <span>IGNORE THESE KEYWORDS</span>
                    <span className="text-xs bg-red-900/50 px-2 py-0.5 rounded">{keywordsToIgnore.length}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsToIgnore.map((kw, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleKeyword(kw, 'ignore')}
                        className="group px-3 py-1.5 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm transition flex items-center gap-2 hover:border-slate-400"
                      >
                        {kw}
                        <CheckCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                    {keywordsToIgnore.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No keywords selected for exclusion</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Unverified Keyword Warning Modal (Issue #69) */}
            {showUnverifiedWarning && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 border border-yellow-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
                  <div className="flex items-center gap-3 text-yellow-400 mb-4">
                    <AlertTriangle className="w-8 h-8" />
                    <h3 className="text-xl font-bold">Unverified Keywords</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    The following keywords in your <span className="text-green-400 font-medium">USE</span> list lack clear evidence in your job history:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {keywordsToUse.filter(kw => {
                      const v = keywordValidationResults[kw] || checkKeywordEvidence(kw);
                      return !v.isValid;
                    }).map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm mb-6">
                    Including these keywords without evidence may be risky. The system will attempt to integrate them
                    <span className="text-white italic"> lightly</span> into relevant contexts, but they will not be
                    made central themes.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => generateCustomizedContent(true)}
                      className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition"
                    >
                      Confirm & Proceed
                    </button>
                    <button
                      onClick={() => setShowUnverifiedWarning(false)}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
                    >
                      Back to Edit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Per-JD Customization Section - Only show when fitScore >= 50 */}
            {analysisResult.fitScore >= 50 && (
              <div className="bg-slate-800 rounded-lg border border-purple-700 mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Optimize Your Application
                  </h2>

                  {!generatedContent && !generatingSummary && (
                    <div className="mt-4">
                      <p className="text-slate-300 mb-4">
                        Your match score qualifies for customized content generation. Would you like me to generate
                        customized bullets and a professional summary optimized for this specific job description?
                      </p>
                      <p className="text-slate-400 text-sm mb-4">
                        This will optimize your resume content with keywords from the job description while
                        maintaining your actual achievements and metrics.
                      </p>

                      {summaryError && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                          <p className="text-red-300 text-sm">{summaryError}</p>
                        </div>
                      )}

                      <button
                        onClick={generateCustomizedContent}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        Generate Customized Bullets & Summary
                      </button>
                      <p className="text-slate-500 text-xs mt-2">
                        Note: This uses additional tokens (~3-4K). Content is generated based on your actual experience.
                      </p>
                    </div>
                  )}

                  {generatingSummary && (
                    <div className="mt-4 flex items-center gap-3">
                      <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                      <span className="text-slate-300">Generating customized content...</span>
                    </div>
                  )}

                  {generatedContent && (
                    <div className="mt-4 space-y-6">
                      {/* Generated Professional Summary */}
                      {generatedContent.professionalSummary && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-medium flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              Customized Professional Summary
                            </h3>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedContent.professionalSummary.text);
                              }}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </button>
                          </div>
                          <div className="p-4 bg-slate-700 rounded-lg">
                            <p className="text-slate-200 leading-relaxed">{generatedContent.professionalSummary.text}</p>
                            {generatedContent.professionalSummary.keywordsIntegrated?.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-600">
                                <p className="text-slate-400 text-xs">
                                  Keywords integrated: {generatedContent.professionalSummary.keywordsIntegrated.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Generated Bullets by Position */}
                      {generatedContent.customizedBullets?.length > 0 && (
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Customized Resume Bullets
                          </h3>
                          <div className="space-y-4">
                            {generatedContent.customizedBullets.map((position, posIdx) => (
                              <div key={posIdx} className="p-4 bg-slate-700 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-purple-300 font-medium">
                                    {position.position} at {position.company}
                                  </p>
                                  <button
                                    onClick={() => {
                                      const bulletsText = position.bullets.map(b => `• ${b.text}`).join('\n');
                                      navigator.clipboard.writeText(bulletsText);
                                    }}
                                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-slate-300 text-sm rounded flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                    Copy All
                                  </button>
                                </div>
                                <ul className="space-y-2">
                                  {position.bullets.map((bullet, bulletIdx) => (
                                    <li key={bulletIdx} className="flex items-start gap-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded mt-0.5 ${bullet.verbCategory === 'Built' ? 'bg-blue-900/50 text-blue-300' :
                                        bullet.verbCategory === 'Lead' ? 'bg-yellow-900/50 text-yellow-300' :
                                          bullet.verbCategory === 'Managed' ? 'bg-purple-900/50 text-purple-300' :
                                            bullet.verbCategory === 'Improved' ? 'bg-green-900/50 text-green-300' :
                                              'bg-pink-900/50 text-pink-300'
                                        }`}>
                                        {bullet.verbCategory}
                                      </span>
                                      <span className="text-slate-200 text-sm flex-1">{bullet.text}</span>
                                      {bullet.hasMetric && (
                                        <span className="text-green-400 text-xs">✓</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Keyword Coverage Report */}
                      {generatedContent.keywordCoverageReport && (
                        <div className="p-4 bg-slate-700/50 rounded-lg">
                          <h3 className="text-white font-medium mb-3 text-sm">Keyword Coverage Report</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {generatedContent.keywordCoverageReport.successfullyIncorporated?.length > 0 && (
                              <div>
                                <p className="text-green-400 text-xs font-medium mb-2">Successfully Incorporated</p>
                                <ul className="space-y-1">
                                  {generatedContent.keywordCoverageReport.successfullyIncorporated.map((item, idx) => (
                                    <li key={idx} className="text-slate-300 text-xs">
                                      ✓ {item.keyword} - {item.location}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {generatedContent.keywordCoverageReport.skippedNotEvidenced?.length > 0 && (
                              <div>
                                <p className="text-yellow-400 text-xs font-medium mb-2">Skipped (Not Evidenced)</p>
                                <ul className="space-y-1">
                                  {generatedContent.keywordCoverageReport.skippedNotEvidenced.map((item, idx) => (
                                    <li key={idx} className="text-slate-400 text-xs">
                                      ✗ {item.keyword} - {item.reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Optimization Notes */}
                      {generatedContent.optimizationNotes && (
                        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                          <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Optimization Notes
                          </p>
                          <p className="text-slate-300 text-sm italic">
                            {generatedContent.optimizationNotes}
                          </p>
                        </div>
                      )}

                      {/* Narrative Fit Verification (Issue #64) */}
                      {generatedContent.narrativeVerification && (
                        <div className="mt-8 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            Narrative Fit Verification
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-slate-400 text-sm mb-2">Quality Summary</p>
                              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                                <p className="text-slate-200 text-sm">{generatedContent.narrativeVerification.summary}</p>
                              </div>

                              <div className="mt-4 flex items-center gap-4">
                                <div>
                                  <p className="text-slate-400 text-xs mb-1">Role Alignment</p>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${generatedContent.narrativeVerification.roleLevelAlignment === 'Aligned'
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-yellow-900/30 text-yellow-400'
                                    }`}>
                                    {generatedContent.narrativeVerification.roleLevelAlignment}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs mb-1">Narrative Score</p>
                                  <span className="text-white font-bold">{generatedContent.narrativeVerification.score}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-green-400 text-xs font-semibold mb-2 uppercase tracking-tight">Top Requirements Met</p>
                                <ul className="space-y-1">
                                  {generatedContent.narrativeVerification.topRequirementsMet?.map((req, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      {req}
                                    </li>
                                  ))}
                                  {(!generatedContent.narrativeVerification.topRequirementsMet || generatedContent.narrativeVerification.topRequirementsMet.length === 0) && (
                                    <li className="text-slate-500 text-sm italic">None identified</li>
                                  )}
                                </ul>
                              </div>

                              <div>
                                <p className="text-red-400 text-xs font-semibold mb-2 uppercase tracking-tight">Narrative Gaps Identification</p>
                                <ul className="space-y-1">
                                  {generatedContent.narrativeVerification.narrativeGaps?.map((gap, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                      <AlertTriangle className="w-3 h-3 text-red-500" />
                                      {gap}
                                    </li>
                                  ))}
                                  {(!generatedContent.narrativeVerification.narrativeGaps || generatedContent.narrativeVerification.narrativeGaps.length === 0) && (
                                    <li className="text-slate-500 text-sm italic">No gaps identified</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {generatedContent.narrativeVerification.narrativeGaps?.length > 0 && (
                            <div className="mt-6 p-3 bg-red-900/20 border border-red-900/30 rounded flex items-start gap-3">
                              <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <p className="text-red-200 text-sm">
                                <strong>Recommendation:</strong> Your current narrative misses key requirements. To improve your fit score, update your job history with more specific achievements related to these gaps and re-run the analysis.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Regenerate Button */}
                      <div className="pt-4 border-t border-slate-600">
                        <button
                          onClick={() => {
                            setGeneratedContent(null);
                            setSummaryError(null);
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition"
                        >
                          Clear & Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Low Fit Score Message - Only show when fitScore < 50 */}
            {analysisResult.fitScore < 50 && (
              <div className="bg-slate-800 rounded-lg border border-slate-600 mb-8 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-medium mb-2">Content Customization Not Recommended</h3>
                    <p className="text-slate-300 text-sm">
                      Your match score is {analysisResult.fitScore}%. There are significant gaps that
                      keyword optimization alone won't bridge. We recommend focusing on roles with 50+
                      match scores where strategic customization can be more effective.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadPdfReport}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF Report
              </button>
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Analyze Another Job
              </button>
            </div>
          </>
        )}

        {/* Bottom Token Info */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Token Usage Summary
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="text-slate-400">Free tier: 500K tokens / 5-hour window</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-slate-400">Pro tier: 2.5M tokens / 5-hour window</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              💡 Tip: Use Haiku for quick assessments, Sonnet for detailed analysis. Opus provides deepest insights but uses most tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Redundant local functions removed.
