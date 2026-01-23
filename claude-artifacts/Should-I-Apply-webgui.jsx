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
      // Prepare the content for analysis
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

      const analysisPrompt = `You are a Job Fit Assessment expert. Analyze how well this candidate matches the job description.

${experienceContent}

JOB DESCRIPTION:
${jobDescription}

CRITICAL: Return ONLY valid JSON with no markdown. Be thorough but concise.

Analyze using this methodology:
1. Extract ALL requirements from JD (hard skills, soft skills, experience, education, certifications)
2. Match each requirement against the candidate's experience with evidence
3. Calculate fit score using: Required skills (3x weight), Preferred skills (2x weight), Nice-to-have (1x weight)
4. Identify gaps and provide actionable recommendations

For portfolio projects or personal work: count toward skills demonstrated but NOT toward years of professional experience.

Return JSON with this structure:
{
  "fitScore": 85,
  "fitCategory": "Strong Fit",
  "recommendation": {
    "action": "APPLY",
    "message": "Brief recommendation message"
  },
  "positionSummary": {
    "title": "Job Title from JD",
    "company": "Company Name if available",
    "level": "Senior/Mid/Junior",
    "type": "Full-time/Contract/etc"
  },
  "candidateSummary": {
    "yearsExperience": 6,
    "currentTitle": "Current or most recent title",
    "primaryStrength": "What they're strongest in",
    "industryMatch": "Match/Partial/Gap"
  },
  "requirements": {
    "hardSkillsRequired": [
      {
        "skill": "Python",
        "status": "Matched",
        "evidence": "Brief evidence from experience",
        "source": "Company | Role"
      }
    ],
    "hardSkillsPreferred": [],
    "softSkillsRequired": [],
    "softSkillsPreferred": [],
    "experience": {
      "required": "3+ years",
      "candidate": "6 years",
      "status": "Matched"
    },
    "education": {
      "required": "Bachelor's in CS or related",
      "candidate": "MS in MIS",
      "status": "Matched"
    }
  },
  "gapAnalysis": {
    "criticalGaps": [
      {
        "requirement": "Skill or requirement",
        "severity": "Critical/High/Medium/Low",
        "mitigation": "How to address in application"
      }
    ],
    "minorGaps": [],
    "strengthsToHighlight": [
      "Key strength 1",
      "Key strength 2"
    ]
  },
  "industryContext": {
    "jdIndustry": "B2B SaaS/Enterprise/etc",
    "candidateIndustry": "Their background",
    "transferability": "HIGH/MODERATE/LOW",
    "note": "Brief context about industry fit"
  },
  "coverLetterTips": [
    "Specific tip for cover letter",
    "Another tip"
  ],
  "interviewPrepTips": [
    "Prepare for questions about X",
    "Be ready to discuss Y"
  ],
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "summaryStats": {
    "totalRequirements": 15,
    "matched": 11,
    "partial": 2,
    "missing": 2
  }
}`;

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
      // Prepare experience content (same as original analysis)
      // NOTE: The AI will PARSE this job history to extract ALL positions,
      // then FILTER by chronology depth logic (recent ≤6yr, tenure exception >6yr + ≥5yr tenure).
      // It must generate optimized bullets for EACH historical position meeting criteria,
      // NOT create bullets for the JD position.
      // Guardrails: #3, #13, #15 (summary), #29 (metrics), #32 (evidence), #33 (narrative fit),
      //             chronology_depth_logic, portfolio_employment_labeling, verb distribution
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

      const generationPrompt = `You are a Resume Optimization expert. Generate customized resume bullets for positions in the candidate's job history that meet chronology depth criteria (NOT all historical positions).

${experienceContent}

JOB DESCRIPTION:
${jobDescription}

PREVIOUS FIT ANALYSIS CONTEXT:
- Fit Score: ${analysisResult.fitScore}%
- Matched Requirements: ${analysisResult.summaryStats?.matched || 0}
- Partial Matches: ${analysisResult.summaryStats?.partial || 0}
- Gaps: ${analysisResult.summaryStats?.missing || 0}
- Key Strengths: ${(analysisResult.gapAnalysis?.strengthsToHighlight || []).join(', ')}

CRITICAL INSTRUCTIONS:

1. PARSE ALL POSITIONS from the job history above
   - Extract: position title, company, dates, existing bullets for EVERY position
   - DO NOT use the job description's position/company

2. APPLY CHRONOLOGY DEPTH FILTER (Guardrail: bo_bullet-generation-logic.md):

   Current Year: 2026

   INCLUDE positions that meet ANY of these criteria:

   a) **Recent/Current** (Years_Since_End ≤ 6 OR Job is "Present"):
      → INCLUDE and generate 3-5 bullets

   b) **Tenure Exception** (Years_Since_End > 6 AND Job_Duration ≥ 5 years):
      → INCLUDE and generate 2-3 bullets (Reason: "Relevant Career Chunk")

   EXCLUDE positions that meet:

   c) **Very Old, Short Tenure** (Years_Since_End > 6 AND Job_Duration < 5 years):
      → EXCLUDE (unless total resume < 2 pages, then summarize)

   Calculation: Years_Since_End = 2026 - Job_End_Year

3. FOR EACH INCLUDED POSITION (after filtering in step 2):
   - Generate optimized bullets using keywords from the JD
   - PRESERVE the original position title, company, and dates from JOB HISTORY
   - Do NOT substitute with the JD's position or company name
   - Apply bullet count from step 2 criteria (3-5 for recent, 2-3 for tenure exception)

4. BULLET OPTIMIZATION RULES:
   - Apply causal impact linking: [Action] + [Outcome] + [Metric]
   - Incorporate JD keywords naturally where evidence supports them
   - Character limit: ≤210 characters per bullet (hard limit for ATS)
   - Preserve all metrics from original bullets (Guardrail #29)
   - Verb category distribution: Aim for 13-27% per category (Built, Lead, Managed, Improved, Collaborate)

5. PORTFOLIO PROJECT LABELING (CRITICAL):
   - If a position is marked as "Independent" or "Portfolio Project" in job history:
     → Append "(Independent Project)" or "(Portfolio Project)" to the position title
     → Example: "Resume Optimizer (Independent Project) | technomensch/optimize-my-resume"
   - This prevents misrepresentation during background checks

6. KEYWORD EVIDENCE PRINCIPLE (Guardrail #32):
   - ONLY use keywords that have evidence in the candidate's job history
   - If a keyword from "USE" list lacks evidence, incorporate it LIGHTLY
   - Do NOT fabricate experience

7. PROFESSIONAL SUMMARY GUARDRAILS:

   Guardrail #3 (Summary Abstraction):
   - No sentence in summary can share >50% of its keywords with any single bullet
   - Must synthesize metrics across multiple roles (e.g., "Led projects across X and Y, achieving Z")
   - Start sentences with outcome (Why) rather than action (How) to differentiate from bullets

   Guardrail #13 (Metric Reconciliation):
   - Every metric in summary MUST be traceable to at least one bullet
   - Exception: Years of experience can be calculated from position dates

   Guardrail #15 (Phrase Repetition):
   - No 3+ word phrase should be repeated 3+ times across summary and all bullets
   - Ensure narrative variety throughout

USER KEYWORD PREFERENCES (Strictly Enforce):
- KEYWORDS TO USE: ${keywordsToUse.map(k => k.replace(/^Custom: /, '')).join(', ')}
- KEYWORDS TO IGNORE: ${keywordsToIgnore.map(k => k.replace(/^Custom: /, '')).join(', ')}

CRITICAL GUARDRAILS:
1. METRIC PRESERVATION (Guardrail #29): Never remove or alter existing metrics from the source. If original says "20 API calls", output must include "20 API calls".
2. NARRATIVE FIT (Guardrail #33): After generating, verify if the top 3 hard requirements are addressed. If missing, identify them as "Narrative Gaps".
3. IGNORE LIST: Do NOT use any keyword from the "IGNORE" list under any circumstances.

OUTPUT FORMAT (CRITICAL):

Return ONLY valid JSON with this exact structure:

{
  "customizedBullets": [
    // ONE OBJECT PER HISTORICAL POSITION (matching chronology depth filter)
    {
      "position": "EXACT position title from job history",
      "company": "EXACT company name from job history",
      "dates": "EXACT dates from job history",
      "bullets": [
        {
          "text": "Optimized bullet text with JD keywords naturally integrated",
          "verbCategory": "Built|Lead|Managed|Improved|Collaborate",
          "keywordsUsed": ["keyword1", "keyword2"],
          "charCount": 150,
          "hasMetric": true
        }
      ]
    }
    // REPEAT for each position that passes chronology depth filter
  ],
  "professionalSummary": {
    "text": "3-4 sentence professional summary optimized for this JD. Include 2+ metrics, 2-3 hard skills. 80-120 words.",
    "keywordsIntegrated": ["keyword1", "keyword2", "keyword3"],
    "metricsIncluded": ["6+ years", "20+ stakeholders", "etc"],
    "guardrailsApplied": {
      "g3_abstraction": "No sentence shares >50% keywords with any bullet; synthesizes across roles",
      "g13_metricReconciliation": "All metrics traceable to bullets (except years calculated from dates)",
      "g15_phraseRepetition": "No 3+ word phrase repeated 3+ times across summary and bullets"
    }
  },
  "keywordCoverageReport": {
    "successfullyIncorporated": [
      { "keyword": "keyword1", "location": "Position 0, Bullet 2" }
    ],
    "skippedNotEvidenced": [
      { "keyword": "keyword3", "reason": "No evidence in job history" }
    ]
  },
  "optimizationNotes": "Summary of what was optimized per position",
  "narrativeVerification": {
    "summary": "High-level quality assessment",
    "topRequirementsMet": ["Skill 1", "Skill 2"],
    "narrativeGaps": ["Requirement missing from history"],
    "roleLevelAlignment": "Aligned|Mismatch",
    "score": 0-100
  }
}`;

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

// ═══════════════════════════════════════════════════════════════
// RESUME OPTIMIZATION HELPERS & VALIDATORS
// ═══════════════════════════════════════════════════════════════

/**
 * Extract job history from LLM's parsed output for validation
 */
function extractJobHistoryFromLLMOutput(customizedBullets) {
  return customizedBullets.map(pos => ({
    position: pos.position,
    company: pos.company,
    dates: pos.dates,
    bullets: pos.bullets.map(b => b.text)
  }));
}

/**
 * Calculates experience level from job history
 */
function determineExperienceLevel(jobHistory) {
  if (!jobHistory || jobHistory.length === 0) return 'entry';

  // Calculate total years of experience from all positions
  const CURRENT_YEAR = 2026;
  let totalYears = 0;

  jobHistory.forEach(job => {
    const endYear = job.dates.includes('Present') || job.dates.includes('present')
      ? CURRENT_YEAR
      : parseInt(job.dates.match(/\d{4}$/)?.[0] || CURRENT_YEAR);
    const startYear = parseInt(job.dates.match(/^\d{4}/)?.[0] || endYear);
    totalYears += (endYear - startYear);
  });

  if (totalYears <= 2) return 'entry';
  if (totalYears <= 5) return 'mid';
  if (totalYears <= 10) return 'senior';
  return 'principal';
}

/**
 * Auto-corrects position metadata to match job history
 */
function autoCorrectPositions(customizedBullets, eligiblePositions, jobHistory) {
  return customizedBullets.map(bullet => {
    const matchingJob = jobHistory.find(job =>
      job.position.toLowerCase().includes(bullet.position.toLowerCase()) ||
      bullet.position.toLowerCase().includes(job.position.toLowerCase())
    );

    if (matchingJob) {
      return {
        ...bullet,
        position: matchingJob.position, // Replace with exact title from history
        company: matchingJob.company,   // Replace with exact company from history
        dates: matchingJob.dates        // Replace with exact dates from history
      };
    }
    return bullet;
  });
}

/**
 * Validator 1: Chronology Depth
 */
function validateChronologyDepth(customizedBullets, jobHistory) {
  const CURRENT_YEAR = 2026;
  const RECENCY_THRESHOLD = 6;
  const TENURE_THRESHOLD = 5;

  const errors = [];
  const eligiblePositions = [];

  // Step 1: Calculate which positions SHOULD be included
  jobHistory.forEach((job, idx) => {
    const endYear = job.dates.includes('Present')
      ? CURRENT_YEAR
      : parseInt(job.dates.split('-')[1]);
    const startYear = parseInt(job.dates.split('-')[0]);
    const yearsSinceEnd = CURRENT_YEAR - endYear;
    const jobDuration = endYear - startYear;

    if (yearsSinceEnd <= RECENCY_THRESHOLD || job.dates.includes('Present')) {
      eligiblePositions.push({ ...job, index: idx, reason: 'Recent/Current', bulletCount: '3-5' });
    } else if (yearsSinceEnd > RECENCY_THRESHOLD && jobDuration >= TENURE_THRESHOLD) {
      eligiblePositions.push({ ...job, index: idx, reason: 'Tenure Exception', bulletCount: '2-3' });
    }
  });

  // Step 2: Validate LLM included all eligible positions
  const llmPositionTitles = customizedBullets.map(p => p.position.toLowerCase().trim());
  const missingPositions = eligiblePositions.filter(ep =>
    !llmPositionTitles.includes(ep.position.toLowerCase().trim())
  );

  if (missingPositions.length > 0) {
    errors.push({
      type: 'MISSING_POSITIONS',
      message: `Missing ${missingPositions.length} chronology-eligible position(s)`,
      positions: missingPositions.map(p => p.position),
      requiresRegeneration: false // Auto-corrected by skeleton
    });
  }

  // Step 3: Validate LLM didn't include ineligible positions
  const extraPositions = customizedBullets.filter(cb => {
    const matchingJob = jobHistory.find(jh =>
      jh.position.toLowerCase().trim() === cb.position.toLowerCase().trim()
    );
    if (!matchingJob) return true; // Position not in job history at all

    const isEligible = eligiblePositions.some(ep =>
      ep.position.toLowerCase().trim() === cb.position.toLowerCase().trim()
    );
    return !isEligible;
  });

  if (extraPositions.length > 0) {
    errors.push({
      type: 'EXTRA_POSITIONS',
      message: `Included ${extraPositions.length} ineligible position(s)`,
      positions: extraPositions.map(p => p.position),
      requiresRegeneration: false // Auto-corrected by removal
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    eligiblePositions,
    correctedBullets: errors.length > 0 ? autoCorrectPositions(customizedBullets, eligiblePositions, jobHistory) : customizedBullets
  };
}

/**
 * Validator 2: Position Metadata
 */
function validatePositionMetadata(customizedBullets, jobHistory, jobDescription) {
  const errors = [];
  const correctedBullets = [];

  customizedBullets.forEach((bullet, idx) => {
    const matchingJob = jobHistory.find(jh =>
      jh.position.toLowerCase().includes(bullet.position.toLowerCase()) ||
      bullet.position.toLowerCase().includes(jh.position.toLowerCase())
    );

    if (!matchingJob) {
      errors.push({
        type: 'POSITION_NOT_IN_HISTORY',
        index: idx,
        llmPosition: bullet.position,
        message: `Position "${bullet.position}" not found in job history`,
        requiresRegeneration: false
      });
      return;
    }

    const correctedBullet = { ...bullet };

    const isIndependent = matchingJob.isIndependent ||
      matchingJob.position.toLowerCase().includes('independent') ||
      matchingJob.position.toLowerCase().includes('portfolio') ||
      matchingJob.company.toLowerCase().includes('personal project') ||
      matchingJob.company.toLowerCase().includes('independent');

    if (bullet.position !== matchingJob.position) {
      const hasSuffix = bullet.position.includes('(Independent Project)') ||
        bullet.position.includes('(Portfolio Project)');

      if (isIndependent && hasSuffix) {
        // This is valid labeling, don't flag as error
      } else {
        errors.push({
          type: 'WRONG_POSITION_TITLE',
          index: idx,
          llmValue: bullet.position,
          correctValue: isIndependent ? `${matchingJob.position} (Independent Project)` : matchingJob.position,
          message: `Position title mismatch`,
          requiresRegeneration: false
        });
        correctedBullet.position = isIndependent ? `${matchingJob.position} (Independent Project)` : matchingJob.position;
      }
    }

    if (bullet.company !== matchingJob.company) {
      const usedJDCompany = bullet.company === jobDescription.company;
      errors.push({
        type: usedJDCompany ? 'USED_JD_COMPANY' : 'WRONG_COMPANY',
        index: idx,
        llmValue: bullet.company,
        correctValue: matchingJob.company,
        severity: usedJDCompany ? 'CRITICAL' : 'HIGH',
        message: usedJDCompany
          ? `Used JD company "${bullet.company}" instead of history company "${matchingJob.company}"`
          : `Company mismatch`,
        requiresRegeneration: false
      });
      correctedBullet.company = matchingJob.company;
    }

    if (bullet.dates !== matchingJob.dates) {
      errors.push({
        type: 'WRONG_DATES',
        index: idx,
        llmValue: bullet.dates,
        correctValue: matchingJob.dates,
        message: `Dates mismatch`,
        requiresRegeneration: false
      });
      correctedBullet.dates = matchingJob.dates;
    }

    correctedBullets.push(correctedBullet);
  });

  return {
    valid: errors.length === 0,
    errors,
    correctedBullets
  };
}

/**
 * Validator 3: Chronological Order
 */
function validateChronologicalOrder(customizedBullets) {
  const errors = [];

  const bulletsWithYears = customizedBullets.map((bullet, idx) => {
    const endYear = bullet.dates.includes('Present')
      ? 9999
      : parseInt(bullet.dates.split('-')[1]);
    return { ...bullet, endYear, originalIndex: idx };
  });

  let isSorted = true;
  for (let i = 0; i < bulletsWithYears.length - 1; i++) {
    if (bulletsWithYears[i].endYear < bulletsWithYears[i + 1].endYear) {
      isSorted = false;
      errors.push({
        type: 'WRONG_ORDER',
        message: `Positions not in reverse chronological order`,
        requiresRegeneration: false
      });
      break;
    }
  }

  const sortedBullets = bulletsWithYears
    .sort((a, b) => b.endYear - a.endYear)
    .map(({ endYear, originalIndex, ...bullet }) => bullet);

  return {
    valid: isSorted,
    errors,
    correctedBullets: sortedBullets
  };
}

/**
 * Validator 4: Bullet Counts
 */
function validateBulletCounts(customizedBullets, eligiblePositions) {
  const errors = [];

  customizedBullets.forEach((bullet) => {
    const eligible = eligiblePositions.find(ep =>
      ep.position.toLowerCase().trim() === bullet.position.toLowerCase().trim()
    );

    if (!eligible) return;

    const bulletCount = bullet.bullets.length;
    const expectedRange = eligible.bulletCount;
    const [min, max] = expectedRange.split('-').map(Number);

    if (bulletCount < min || bulletCount > max) {
      errors.push({
        type: 'WRONG_BULLET_COUNT',
        position: bullet.position,
        actual: bulletCount,
        expected: expectedRange,
        severity: bulletCount === 1 ? 'CRITICAL' : 'HIGH',
        message: `Position "${bullet.position}" has ${bulletCount} bullet(s), expected ${expectedRange}`,
        requiresRegeneration: true
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 5: Bullet Format
 */
function validateBulletFormat(customizedBullets) {
  const errors = [];
  const CHAR_LIMIT = 210;
  const VALID_CATEGORIES = ['Built', 'Lead', 'Managed', 'Improved', 'Collaborate'];

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      if (bullet.text.length > CHAR_LIMIT) {
        errors.push({
          type: 'CHAR_LIMIT_EXCEEDED',
          position: position.position,
          bulletIndex: bulletIdx,
          actual: bullet.text.length,
          limit: CHAR_LIMIT,
          severity: 'CRITICAL',
          message: `Bullet exceeds ${CHAR_LIMIT} char limit`,
          requiresRegeneration: true
        });
      }

      if (!VALID_CATEGORIES.includes(bullet.verbCategory)) {
        errors.push({
          type: 'INVALID_VERB_CATEGORY',
          position: position.position,
          bulletIndex: bulletIdx,
          message: `Invalid verb category "${bullet.verbCategory}"`,
          requiresRegeneration: true
        });
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 6: Metric Traceability
 */
function validateMetricTraceability(customizedBullets, jobHistory) {
  const errors = [];

  const extractMetrics = (text) => {
    const patterns = [
      /\d+%/g,                    // Percentages
      /\$[\d,]+[KMB]?/gi,        // Dollar amounts
      /\d+\+?/g,                  // Numbers with optional +
      /\d+x/gi                    // Multipliers
    ];
    const metrics = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      metrics.push(...matches);
    });
    return [...new Set(metrics)];
  };

  customizedBullets.forEach((position) => {
    const historyPosition = jobHistory.find(jh =>
      jh.position.toLowerCase().trim() === position.position.toLowerCase().trim()
    );

    if (!historyPosition) return;

    const originalMetrics = historyPosition.bullets
      .flatMap(b => extractMetrics(b))
      .map(m => m.toLowerCase());

    position.bullets.forEach((bullet, bulletIdx) => {
      const bulletMetrics = extractMetrics(bullet.text);

      bulletMetrics.forEach(metric => {
        const metricLower = metric.toLowerCase();
        if (!originalMetrics.some(om => om === metricLower || metricLower.includes(om) || om.includes(metricLower))) {
          const otherPositionHasMetric = jobHistory.some((jh) => {
            if (jh.position === historyPosition.position) return false;
            const otherMetrics = jh.bullets.flatMap(b => extractMetrics(b)).map(m => m.toLowerCase());
            return otherMetrics.some(om => om === metricLower);
          });

          if (otherPositionHasMetric) {
            errors.push({
              type: 'METRIC_WRONG_POSITION',
              position: position.position,
              bulletIndex: bulletIdx,
              metric: metric,
              severity: 'HIGH',
              message: `Metric "${metric}" in "${position.position}" appears to be from a different position`,
              requiresRegeneration: true
            });
          }
        }
      });
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 7: Summary Abstraction
 */
function validateSummaryAbstraction(professionalSummary, customizedBullets) {
  const errors = [];

  if (!professionalSummary || !professionalSummary.text) {
    return { valid: true, errors: [] };
  }

  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'it', 'its', 'as', 'from', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'over']);

  const extractKeywords = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  };

  const summarySentences = professionalSummary.text.split(/[.!?]+/).filter(s => s.trim());

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      const bulletKeywords = extractKeywords(bullet.text);

      summarySentences.forEach((sentence, sentIdx) => {
        const sentenceKeywords = extractKeywords(sentence);
        if (sentenceKeywords.length === 0) return;

        const overlap = sentenceKeywords.filter(k => bulletKeywords.includes(k));
        const overlapPercentage = overlap.length / sentenceKeywords.length;

        if (overlapPercentage > 0.50) {
          errors.push({
            type: 'SUMMARY_ECHOES_BULLET',
            sentenceIndex: sentIdx,
            position: position.position,
            bulletIndex: bulletIdx,
            overlapPercentage: Math.round(overlapPercentage * 100),
            severity: 'HIGH',
            message: `Summary sentence ${sentIdx + 1} shares ${Math.round(overlapPercentage * 100)}% keywords with bullet`,
            requiresRegeneration: true
          });
        }
      });
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 8: Verb Diversity
 */
function validateVerbDiversity(customizedBullets) {
  const errors = [];

  customizedBullets.forEach((position) => {
    const verbCounts = {};

    position.bullets.forEach((bullet, bulletIdx) => {
      const category = bullet.verbCategory;
      if (!category) return;

      if (!verbCounts[category]) {
        verbCounts[category] = [];
      }
      verbCounts[category].push(bulletIdx);
    });

    Object.entries(verbCounts).forEach(([category, indices]) => {
      if (indices.length > 1) {
        errors.push({
          type: 'VERB_CATEGORY_REPEATED',
          position: position.position,
          category: category,
          bulletIndices: indices,
          count: indices.length,
          severity: 'MEDIUM',
          message: `Position "${position.position}" uses verb category "${category}" ${indices.length} times`,
          requiresRegeneration: true
        });
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 9: Summary Metrics
 */
function validateSummaryMetrics(professionalSummary, customizedBullets) {
  const errors = [];

  if (!professionalSummary || !professionalSummary.text) {
    return { valid: true, errors: [] };
  }

  const extractMetrics = (text) => {
    const patterns = [
      /\d+%/g,
      /\$[\d,]+[KMB]?/gi,
      /\d+\+?\s*(years?|yrs?)/gi,
      /\d+\+?\s*(teams?|engineers?|stakeholders?|members?)/gi,
      /\d+x/gi,
      /\b\d{2,}\b/g
    ];
    const metrics = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      metrics.push(...matches);
    });
    return [...new Set(metrics)];
  };

  const summaryMetrics = extractMetrics(professionalSummary.text);
  const allBulletTexts = customizedBullets.flatMap(pos => pos.bullets.map(b => b.text)).join(' ');

  summaryMetrics.forEach(metric => {
    if (/\d+\+?\s*(years?|yrs?)/i.test(metric)) return;

    const metricNumber = metric.match(/\d+/)?.[0];
    if (metricNumber && !allBulletTexts.includes(metricNumber)) {
      errors.push({
        type: 'SUMMARY_METRIC_NOT_TRACEABLE',
        metric: metric,
        severity: 'HIGH',
        message: `Summary metric "${metric}" not found in any bullet`,
        requiresRegeneration: true
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 10: Phrase Repetition
 */
function validatePhraseRepetition(professionalSummary, customizedBullets) {
  const errors = [];

  const allTexts = [];
  if (professionalSummary?.text) allTexts.push(professionalSummary.text);
  customizedBullets.forEach(pos => pos.bullets.forEach(b => allTexts.push(b.text)));

  const combinedText = allTexts.join(' ').toLowerCase();

  const extractNGrams = (text, n) => {
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const ngrams = {};
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      if (phrase.length > 8) ngrams[phrase] = (ngrams[phrase] || 0) + 1;
    }
    return ngrams;
  };

  [3, 4, 5].forEach(n => {
    const ngrams = extractNGrams(combinedText, n);
    Object.entries(ngrams).forEach(([phrase, count]) => {
      if (count >= 3) {
        errors.push({
          type: 'PHRASE_REPEATED',
          phrase: phrase,
          count: count,
          severity: 'MEDIUM',
          message: `Phrase "${phrase}" repeated ${count} times`,
          requiresRegeneration: true
        });
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 11: Metric Preservation
 */
function validateMetricPreservation(customizedBullets, jobHistory) {
  const errors = [];

  const extractMetrics = (text) => {
    const patterns = [/\d+%/g, /\$[\d,]+[KMB]?/gi, /\d+x/gi, /\b\d{2,}\b/g];
    const metrics = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      metrics.push(...matches.map(m => m.toLowerCase()));
    });
    return [...new Set(metrics)];
  };

  customizedBullets.forEach((position) => {
    const historyPosition = jobHistory.find(jh =>
      jh.position.toLowerCase().trim() === position.position.toLowerCase().trim()
    );
    if (!historyPosition) return;

    const originalMetrics = historyPosition.bullets.flatMap(b => extractMetrics(b));
    const optimizedMetrics = position.bullets.flatMap(b => extractMetrics(b.text));

    const lostMetrics = originalMetrics.filter(om =>
      !optimizedMetrics.some(optM => optM === om || optM.includes(om) || om.includes(optM))
    );

    if (lostMetrics.length > 0) {
      errors.push({
        type: 'METRICS_LOST',
        position: position.position,
        lostMetrics: lostMetrics,
        severity: 'HIGH',
        message: `Position "${position.position}" lost metrics: ${lostMetrics.join(', ')}`,
        requiresRegeneration: true
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 12: Keyword Evidence
 */
function validateKeywordEvidence(customizedBullets, jobHistory, useKeywords) {
  const warnings = [];

  const allHistoryText = jobHistory.flatMap(jh => jh.bullets).join(' ').toLowerCase();
  const allOptimizedText = customizedBullets.flatMap(pos => pos.bullets.map(b => b.text)).join(' ').toLowerCase();

  useKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase().replace(/^custom:\s*/i, '');
    if (allOptimizedText.includes(keywordLower) && !allHistoryText.includes(keywordLower)) {
      warnings.push({
        type: 'KEYWORD_NO_EVIDENCE',
        keyword: keyword,
        severity: 'WARNING',
        message: `Keyword "${keyword}" used but has no evidence in job history`
      });
    }
  });

  return { valid: true, errors: [], warnings };
}

/**
 * Validator 13: Narrative Fit
 */
function validateNarrativeFit(customizedBullets, narrativeVerification) {
  const warnings = [];

  if (narrativeVerification?.topRequirementsMet) {
    const metCount = narrativeVerification.topRequirementsMet.length;
    if (metCount < 3) {
      warnings.push({
        type: 'NARRATIVE_GAP',
        severity: 'WARNING',
        message: `Only ${metCount} of top 3 JD requirements addressed`
      });
    }
  }

  if (narrativeVerification?.narrativeGaps?.length > 0) {
    narrativeVerification.narrativeGaps.forEach(gap => {
      warnings.push({
        type: 'NARRATIVE_GAP_ITEM',
        severity: 'WARNING',
        message: `Narrative gap: "${gap}" not addressed`
      });
    });
  }

  if (narrativeVerification?.roleLevelAlignment === 'Mismatch') {
    warnings.push({
      type: 'ROLE_LEVEL_MISMATCH',
      severity: 'WARNING',
      message: 'Role level mismatch between candidate experience and JD'
    });
  }

  return { valid: true, errors: [], warnings };
}

/**
 * Validator 14: Limitation Enforcement
 */
function validateLimitationEnforcement(customizedBullets, honestLimitations) {
  const errors = [];

  if (!honestLimitations || honestLimitations.length === 0) {
    return { valid: true, errors: [] };
  }

  const limitationKeywords = honestLimitations.flatMap(limit => {
    const matches = limit.match(/(?:no|limited|lacking|without)\s+(\w+(?:\s+\w+)?)/gi) || [];
    return matches.map(m => m.replace(/^(no|limited|lacking|without)\s+/i, '').toLowerCase());
  });

  const allBulletText = customizedBullets
    .flatMap(pos => pos.bullets.map(b => b.text))
    .join(' ')
    .toLowerCase();

  limitationKeywords.forEach(keyword => {
    if (allBulletText.includes(keyword)) {
      errors.push({
        type: 'LIMITATION_VIOLATED',
        keyword: keyword,
        severity: 'CRITICAL',
        message: `Claimed skill "${keyword}" but it's listed in honest_limitations`,
        requiresRegeneration: true
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 15: Skill Classification
 */
function validateSkillClassification(generatedContent) {
  const errors = [];

  const hardSkills = generatedContent.hardSkills || generatedContent.technicalSkills || [];
  const softSkills = generatedContent.softSkills || [];

  const hardSkillsLower = hardSkills.map(s => s.toLowerCase().trim());
  const softSkillsLower = softSkills.map(s => s.toLowerCase().trim());

  const overlap = hardSkillsLower.filter(s => softSkillsLower.includes(s));

  overlap.forEach(skill => {
    errors.push({
      type: 'SKILL_DUAL_CLASSIFICATION',
      skill: skill,
      severity: 'MEDIUM',
      message: `Skill "${skill}" classified as both hard and soft skill`,
      requiresRegeneration: true
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 16: Budget Enforcement
 */
function validateBudgetEnforcement(customizedBullets, professionalSummary) {
  const errors = [];
  const MIN_CHAR = 100;
  const MIN_WORDS = 350;
  const MAX_WORDS = 500;

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      const charCount = bullet.text.length;
      if (charCount < MIN_CHAR) {
        errors.push({
          type: 'BULLET_TOO_SHORT',
          position: position.position,
          bulletIndex: bulletIdx,
          actual: charCount,
          minimum: MIN_CHAR,
          severity: 'MEDIUM',
          message: `Bullet has ${charCount} chars (min ${MIN_CHAR})`,
          requiresRegeneration: true
        });
      }
    });
  });

  const allBulletWords = customizedBullets
    .flatMap(pos => pos.bullets.map(b => b.text))
    .join(' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const summaryWords = professionalSummary?.text
    ? professionalSummary.text.split(/\s+/).filter(w => w.length > 0)
    : [];

  const totalWords = allBulletWords.length + summaryWords.length;

  if (totalWords < MIN_WORDS) {
    errors.push({
      type: 'TOTAL_WORDS_TOO_FEW',
      actual: totalWords,
      minimum: MIN_WORDS,
      severity: 'MEDIUM',
      message: `Total word count ${totalWords} (min ${MIN_WORDS})`,
      requiresRegeneration: true
    });
  }

  if (totalWords > MAX_WORDS) {
    errors.push({
      type: 'TOTAL_WORDS_TOO_MANY',
      actual: totalWords,
      maximum: MAX_WORDS,
      severity: 'MEDIUM',
      message: `Total word count ${totalWords} (max ${MAX_WORDS})`,
      requiresRegeneration: true
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 17: Keyword Density
 */
function validateKeywordDensity(customizedBullets, useKeywords) {
  const errors = [];
  const MAX_KEYWORDS_PER_BULLET = 3;
  const MAX_KEYWORD_REPEATS = 2;

  const keywordsLower = useKeywords.map(k => k.toLowerCase().replace(/^custom:\s*/i, ''));

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      const bulletLower = bullet.text.toLowerCase();
      let keywordCount = 0;
      const keywordCounts = {};

      keywordsLower.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = bulletLower.match(regex) || [];
        if (matches.length > 0) {
          keywordCount++;
          keywordCounts[keyword] = matches.length;
        }
      });

      if (keywordCount > MAX_KEYWORDS_PER_BULLET) {
        errors.push({
          type: 'TOO_MANY_KEYWORDS',
          position: position.position,
          bulletIndex: bulletIdx,
          actual: keywordCount,
          maximum: MAX_KEYWORDS_PER_BULLET,
          severity: 'MEDIUM',
          message: `Bullet has ${keywordCount} keywords (max ${MAX_KEYWORDS_PER_BULLET})`,
          requiresRegeneration: true
        });
      }

      Object.entries(keywordCounts).forEach(([keyword, count]) => {
        if (count > MAX_KEYWORD_REPEATS) {
          errors.push({
            type: 'KEYWORD_REPEATED',
            position: position.position,
            bulletIndex: bulletIdx,
            keyword: keyword,
            count: count,
            maximum: MAX_KEYWORD_REPEATS,
            severity: 'MEDIUM',
            message: `Keyword "${keyword}" used ${count} times in one bullet`,
            requiresRegeneration: true
          });
        }
      });
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 18: Metric Plausibility
 */
function validateMetricPlausibility(customizedBullets) {
  const errors = [];
  const warnings = [];

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      const highPercentages = bullet.text.match(/\b(\d{3,})\s*%/g) || [];
      highPercentages.forEach(match => {
        const value = parseInt(match);
        if (value > 100 && !bullet.text.toLowerCase().includes('growth') && !bullet.text.toLowerCase().includes('increase')) {
          warnings.push({
            type: 'HIGH_PERCENTAGE',
            position: position.position,
            bulletIndex: bulletIdx,
            value: match,
            severity: 'WARNING',
            message: `Percentage ${match} may be implausible (>100%)`
          });
        }
      });

      const timeSavings = bullet.text.match(/reduced.*?by\s+(\d+)\s*%/gi) || [];
      timeSavings.forEach(match => {
        const value = parseInt(match.match(/\d+/)[0]);
        if (value > 100) {
          errors.push({
            type: 'IMPOSSIBLE_TIME_SAVINGS',
            position: position.position,
            bulletIndex: bulletIdx,
            value: value,
            severity: 'HIGH',
            message: `Time savings of ${value}% is impossible`,
            requiresRegeneration: true
          });
        }
      });

      const largeNumbers = bullet.text.match(/\b(\d{7,})\b/g) || [];
      largeNumbers.forEach(num => {
        if (!bullet.text.includes('$') && !bullet.text.toLowerCase().includes('revenue')) {
          warnings.push({
            type: 'LARGE_NUMBER',
            position: position.position,
            bulletIndex: bulletIdx,
            value: num,
            severity: 'WARNING',
            message: `Large number ${num} may need verification`
          });
        }
      });
    });
  });

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validator 19: Scope Attribution
 */
function validateScopeAttribution(customizedBullets, candidateProfile) {
  const warnings = [];

  const seniorScopePhrases = [
    'company-wide', 'enterprise-wide', 'organization-wide',
    'global', 'international', 'multinational',
    'C-suite', 'executive', 'board',
    'millions', 'billion',
    'hundreds of employees', '1000+ employees'
  ];

  const isJunior = candidateProfile?.experienceLevel === 'junior' ||
    candidateProfile?.yearsExperience < 3;

  if (!isJunior) {
    return { valid: true, errors: [], warnings: [] };
  }

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      const bulletLower = bullet.text.toLowerCase();

      seniorScopePhrases.forEach(phrase => {
        if (bulletLower.includes(phrase.toLowerCase())) {
          warnings.push({
            type: 'SCOPE_MISMATCH',
            position: position.position,
            bulletIndex: bulletIdx,
            phrase: phrase,
            severity: 'WARNING',
            message: `Phrase "${phrase}" may be too senior for candidate level`
          });
        }
      });
    });
  });

  return { valid: true, errors: [], warnings };
}

/**
 * Validator 20: Em-Dash
 */
function validateEmDash(customizedBullets, professionalSummary) {
  const errors = [];

  const checkForEmDash = (text, location) => {
    if (text.includes('—') || text.includes('–')) {
      errors.push({
        type: 'EM_DASH_FOUND',
        location: location,
        severity: 'MEDIUM',
        message: `Em-dash/en-dash found in ${location} - may break ATS`,
        requiresRegeneration: true
      });
    }
  };

  customizedBullets.forEach((position) => {
    position.bullets.forEach((bullet, bulletIdx) => {
      checkForEmDash(bullet.text, `${position.position} bullet ${bulletIdx + 1}`);
    });
  });

  if (professionalSummary?.text) {
    checkForEmDash(professionalSummary.text, 'Professional Summary');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validator 21: Verb Distribution
 */
function validateVerbDistribution(customizedBullets) {
  const warnings = [];
  const VALID_CATEGORIES = ['Built', 'Lead', 'Managed', 'Improved', 'Collaborate'];
  const THRESHOLD_PERCENT = 5;
  const BALANCED_MIN = 13;
  const BALANCED_MAX = 27;

  const categoryCounts = {};
  VALID_CATEGORIES.forEach(cat => categoryCounts[cat] = 0);

  let totalBullets = 0;
  customizedBullets.forEach(position => {
    position.bullets.forEach(bullet => {
      totalBullets++;
      const cat = bullet.verbCategory;
      if (cat && categoryCounts.hasOwnProperty(cat)) {
        categoryCounts[cat]++;
      }
    });
  });

  const distribution = {};
  VALID_CATEGORIES.forEach(cat => {
    const count = categoryCounts[cat];
    const percent = totalBullets > 0 ? (count / totalBullets) * 100 : 0;
    let status;

    if (percent >= 28) {
      status = 'Over-Represented';
      warnings.push({
        type: 'VERB_OVER_REPRESENTED',
        category: cat,
        percent: Math.round(percent),
        severity: 'WARNING',
        message: `"${cat}" over-represented (${Math.round(percent)}%)`
      });
    } else if (percent >= BALANCED_MIN && percent <= BALANCED_MAX) {
      status = 'Well Balanced';
    } else if (percent >= THRESHOLD_PERCENT) {
      status = 'Under-Represented';
      warnings.push({
        type: 'VERB_UNDER_REPRESENTED',
        category: cat,
        percent: Math.round(percent),
        severity: 'WARNING',
        message: `"${cat}" under-represented (${Math.round(percent)}%)`
      });
    } else {
      status = 'Critical Gap';
      warnings.push({
        type: 'VERB_CRITICAL_GAP',
        category: cat,
        percent: Math.round(percent),
        severity: 'WARNING',
        message: `"${cat}" critical gap (${Math.round(percent)}%)`
      });
    }

    distribution[cat] = { count, percent: Math.round(percent), status };
  });

  return { valid: true, errors: [], warnings, distribution };
}

/**
 * Validator 22: Metrics Density
 */
function validateMetricsDensity(customizedBullets) {
  const warnings = [];
  const TARGET_MIN = 70;
  const TARGET_MAX = 80;

  const metricPattern = /\d+%|\$[\d,]+[KMB]?|\d+x|\b\d{2,}\b|\d+\+?\s*(hours?|days?|weeks?|months?|years?)/gi;

  let totalBullets = 0;
  let bulletsWithMetrics = 0;

  customizedBullets.forEach(position => {
    position.bullets.forEach(bullet => {
      totalBullets++;
      metricPattern.lastIndex = 0;
      if (metricPattern.test(bullet.text)) {
        bulletsWithMetrics++;
      }
    });
  });

  const percent = totalBullets > 0 ? (bulletsWithMetrics / totalBullets) * 100 : 0;
  const metricsReport = {
    total: totalBullets,
    withMetrics: bulletsWithMetrics,
    percent: Math.round(percent),
    target: `${TARGET_MIN}-${TARGET_MAX}%`,
    status: percent >= TARGET_MIN ? 'On Target' : 'Below Target'
  };

  if (percent < TARGET_MIN) {
    warnings.push({
      type: 'METRICS_DENSITY_LOW',
      actual: Math.round(percent),
      target: TARGET_MIN,
      severity: 'WARNING',
      message: `Only ${Math.round(percent)}% of bullets have metrics (target: ${TARGET_MIN}%)`
    });
  }

  return { valid: true, errors: [], warnings, metricsReport };
}

/**
 * Validator 23: Keyword Evidence Tier
 */
function validateKeywordEvidenceTier(customizedBullets, useKeywords) {
  const warnings = [];
  const TIER1_VERBS = ['built', 'developed', 'implemented', 'deployed', 'configured', 'managed', 'administered', 'operated', 'maintained', 'engineered', 'architected', 'debugged', 'troubleshot', 'resolved', 'migrated', 'upgraded', 'scaled', 'optimized'];
  const TIER3_VERBS = ['documented', 'wrote', 'researched', 'evaluated', 'assessed', 'analyzed', 'interviewed', 'gathered', 'trained', 'observed', 'shadowed'];

  const evidenceReport = { tier1: [], tier2: [], tier3: [], notEvidenced: [] };

  const allBulletText = customizedBullets
    .flatMap(pos => pos.bullets.map(b => b.text.toLowerCase()))
    .join(' ');

  useKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase().replace(/^custom:\s*/i, '');

    if (!allBulletText.includes(keywordLower)) {
      evidenceReport.notEvidenced.push(keyword);
      return;
    }

    let evidenceTier = 2;

    customizedBullets.forEach(position => {
      position.bullets.forEach(bullet => {
        if (bullet.text.toLowerCase().includes(keywordLower)) {
          const bulletLower = bullet.text.toLowerCase();
          const firstWord = bulletLower.split(/\s+/)[0];

          if (TIER3_VERBS.some(v => firstWord.startsWith(v))) {
            evidenceTier = 3;
          } else if (TIER1_VERBS.some(v => firstWord.startsWith(v))) {
            evidenceTier = 1;
          }
        }
      });
    });

    if (evidenceTier === 3) {
      warnings.push({
        type: 'KEYWORD_DOCUMENTATION_ONLY',
        keyword: keyword,
        tier: 3,
        severity: 'WARNING',
        message: `"${keyword}" has documentation-only evidence`
      });
      evidenceReport.tier3.push(keyword);
    } else if (evidenceTier === 2) {
      evidenceReport.tier2.push(keyword);
    } else {
      evidenceReport.tier1.push(keyword);
    }
  });

  return { valid: true, errors: [], warnings, evidenceReport };
}

/**
 * Validator 24: Recency Weighting
 */
function validateRecencyWeighting(customizedBullets) {
  const warnings = [];

  if (customizedBullets.length === 0) {
    return { valid: true, errors: [], warnings: [] };
  }

  const mostRecent = customizedBullets[0];

  if (mostRecent.bullets.length < 3) {
    warnings.push({
      type: 'RECENT_POSITION_FEW_BULLETS',
      position: mostRecent.position,
      severity: 'WARNING',
      message: `Most recent position has ${mostRecent.bullets.length} bullets (recommend 3+)`
    });
  }

  const metricPattern = /\d+%|\$[\d,]+|\d+x|\b\d{2,}\b/g;
  const metricCount = mostRecent.bullets
    .map(b => (b.text.match(metricPattern) || []).length)
    .reduce((a, b) => a + b, 0);

  if (metricCount < 2) {
    warnings.push({
      type: 'RECENT_POSITION_FEW_METRICS',
      position: mostRecent.position,
      severity: 'WARNING',
      message: `Most recent position has ${metricCount} metrics (recommend 2+)`
    });
  }

  return { valid: true, errors: [], warnings };
}

/**
 * Validator 25: Acronym Expansion
 */
function validateAcronymExpansion(customizedBullets, professionalSummary) {
  const warnings = [];
  const commonAcronyms = {
    'ML': 'Machine Learning', 'AI': 'Artificial Intelligence', 'NLP': 'Natural Language Processing',
    'API': 'Application Programming Interface', 'CI': 'Continuous Integration', 'CD': 'Continuous Deployment',
    'AWS': 'Amazon Web Services', 'GCP': 'Google Cloud Platform', 'K8s': 'Kubernetes', 'ETL': 'Extract Transform Load',
    'SQL': 'Structured Query Language', 'KPI': 'Key Performance Indicator', 'ROI': 'Return on Investment',
    'SaaS': 'Software as a Service', 'REST': 'Representational State Transfer'
  };

  const allTexts = [];
  if (professionalSummary?.text) allTexts.push(professionalSummary.text);
  customizedBullets.forEach(pos => pos.bullets.forEach(b => allTexts.push(b.text)));

  const combinedText = allTexts.join(' ');

  Object.entries(commonAcronyms).forEach(([acronym, expansion]) => {
    const acronymRegex = new RegExp(`\\b${acronym}\\b`, 'g');
    const expansionLower = expansion.toLowerCase();

    if (acronymRegex.test(combinedText)) {
      const firstAcronymIndex = combinedText.search(acronymRegex);
      const expansionIndex = combinedText.toLowerCase().indexOf(expansionLower);

      if (expansionIndex === -1 || expansionIndex > firstAcronymIndex) {
        warnings.push({
          type: 'ACRONYM_NOT_EXPANDED',
          acronym: acronym,
          expansion: expansion,
          severity: 'LOW',
          message: `Acronym "${acronym}" not expanded on first use`
        });
      }
    }
  });

  return { valid: true, errors: [], warnings };
}

/**
 * Master validation pipeline
 */
function validateAndCorrectLLMResponse(
  parsedContent,
  jobHistory,
  jobDescription,
  useKeywords = [],
  honestLimitations = [],
  candidateProfile = {}
) {
  const allErrors = [];
  const allWarnings = [];
  let correctedBullets = parsedContent.customizedBullets;

  const chronologyResult = validateChronologyDepth(correctedBullets, jobHistory);
  if (!chronologyResult.valid) {
    allErrors.push(...chronologyResult.errors);
    correctedBullets = chronologyResult.correctedBullets;
  }

  const metadataResult = validatePositionMetadata(correctedBullets, jobHistory, jobDescription);
  if (!metadataResult.valid) {
    allErrors.push(...metadataResult.errors);
    correctedBullets = metadataResult.correctedBullets;
  }

  const orderResult = validateChronologicalOrder(correctedBullets);
  if (!orderResult.valid) {
    allErrors.push(...orderResult.errors);
    correctedBullets = orderResult.correctedBullets;
  }

  const bulletCountResult = validateBulletCounts(correctedBullets, chronologyResult.eligiblePositions);
  if (!bulletCountResult.valid) {
    allErrors.push(...bulletCountResult.errors);
  }

  const formatResult = validateBulletFormat(correctedBullets);
  if (!formatResult.valid) {
    allErrors.push(...formatResult.errors);
  }

  const traceabilityResult = validateMetricTraceability(correctedBullets, jobHistory);
  if (!traceabilityResult.valid) {
    allErrors.push(...traceabilityResult.errors);
  }

  const abstractionResult = validateSummaryAbstraction(parsedContent.professionalSummary, correctedBullets);
  if (!abstractionResult.valid) {
    allErrors.push(...abstractionResult.errors);
  }

  const verbResult = validateVerbDiversity(correctedBullets);
  if (!verbResult.valid) {
    allErrors.push(...verbResult.errors);
  }

  const summaryMetricsResult = validateSummaryMetrics(parsedContent.professionalSummary, correctedBullets);
  if (!summaryMetricsResult.valid) {
    allErrors.push(...summaryMetricsResult.errors);
  }

  const phraseResult = validatePhraseRepetition(parsedContent.professionalSummary, correctedBullets);
  if (!phraseResult.valid) {
    allErrors.push(...phraseResult.errors);
  }

  const preservationResult = validateMetricPreservation(correctedBullets, jobHistory);
  if (!preservationResult.valid) {
    allErrors.push(...preservationResult.errors);
  }

  const evidenceResult = validateKeywordEvidence(correctedBullets, jobHistory, useKeywords);
  if (evidenceResult.warnings) {
    allWarnings.push(...evidenceResult.warnings);
  }

  const narrativeResult = validateNarrativeFit(correctedBullets, parsedContent.narrativeVerification);
  if (narrativeResult.warnings) {
    allWarnings.push(...narrativeResult.warnings);
  }

  const limitationResult = validateLimitationEnforcement(correctedBullets, honestLimitations);
  if (!limitationResult.valid) {
    allErrors.push(...limitationResult.errors);
  }

  const skillResult = validateSkillClassification(parsedContent);
  if (!skillResult.valid) {
    allErrors.push(...skillResult.errors);
  }

  const budgetResult = validateBudgetEnforcement(correctedBullets, parsedContent.professionalSummary);
  if (!budgetResult.valid) {
    allErrors.push(...budgetResult.errors);
  }

  const densityResult = validateKeywordDensity(correctedBullets, useKeywords);
  if (!densityResult.valid) {
    allErrors.push(...densityResult.errors);
  }

  const plausibilityResult = validateMetricPlausibility(correctedBullets);
  if (!plausibilityResult.valid) {
    allErrors.push(...plausibilityResult.errors);
  }
  if (plausibilityResult.warnings) {
    allWarnings.push(...plausibilityResult.warnings);
  }

  const scopeResult = validateScopeAttribution(correctedBullets, candidateProfile);
  if (scopeResult.warnings) {
    allWarnings.push(...scopeResult.warnings);
  }

  const emDashResult = validateEmDash(correctedBullets, parsedContent.professionalSummary);
  if (!emDashResult.valid) {
    allErrors.push(...emDashResult.errors);
  }

  const verbDistResult = validateVerbDistribution(correctedBullets);
  if (verbDistResult.warnings) {
    allWarnings.push(...verbDistResult.warnings);
  }

  const metricsDensityResult = validateMetricsDensity(correctedBullets);
  if (metricsDensityResult.warnings) {
    allWarnings.push(...metricsDensityResult.warnings);
  }

  const evidenceTierResult = validateKeywordEvidenceTier(correctedBullets, useKeywords);
  if (evidenceTierResult.warnings) {
    allWarnings.push(...evidenceTierResult.warnings);
  }

  const recencyResult = validateRecencyWeighting(correctedBullets);
  if (recencyResult.warnings) {
    allWarnings.push(...recencyResult.warnings);
  }

  const acronymResult = validateAcronymExpansion(correctedBullets, parsedContent.professionalSummary);
  if (acronymResult.warnings) {
    allWarnings.push(...acronymResult.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    summary: {
      totalValidators: 25,
      errorsFound: allErrors.length,
      warningsFound: allWarnings.length,
      autoCorrected: ['chronologicalOrder', 'positionMetadata', 'chronologyDepth']
    },
    reports: {
      verbDistribution: verbDistResult.distribution,
      metricsDensity: metricsDensityResult.metricsReport,
      keywordEvidence: evidenceTierResult.evidenceReport
    },
    correctedContent: {
      ...parsedContent,
      customizedBullets: correctedBullets
    }
  };
}

/**
 * LLM Call wrapper
 */
async function callLLM(model, prompt, options) {
  const result = await OllamaService.generate(model, prompt, options);
  if (!result.success) {
    throw new Error(`LLM call failed: ${result.error}`);
  }
  return result.text;
}

/**
 * JSON response parser
 */
function parseJSONResponse(responseText) {
  let cleaned = responseText.trim();
  cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No JSON found in response');
  }
  return JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
}

/**
 * Parses the raw job history narrative into a structured format for validation
 */
async function parseOriginalHistory(selectedModel, jobHistorySource, resumeSource) {
  let content = '';
  if (jobHistorySource) content = jobHistorySource.content;
  else if (resumeSource) content = resumeSource.content;

  if (!content) return [];

  // For webgui, we might need a different LLM call pattern if OllamaService isn't exactly the same, 
  // but assuming same interface for now.
  const prompt = `Extract ALL positions from this job history. Return ONLY a JSON array of objects.
  
  Format:
  [
    {
      "position": "Title",
      "company": "Company",
      "dates": "Start-End",
      "isIndependent": true/false // true if independent, freelance, or portfolio project
    }
  ]
  
  Content:
  ${content}`;

  try {
    const response = await OllamaService.generate(selectedModel, prompt, { temperature: 0 });
    let text = response.text.trim();
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    return JSON.parse(text.substring(start, end + 1));
  } catch (err) {
    console.error('Failed to parse original history:', err);
    return [];
  }
}

/**
 * Generation loop
 */
async function generateWithValidationLoop(
  selectedModel,
  baseGenerationPrompt,
  jobHistorySource,
  jobDescription,
  keywordsToUse,
  honestLimitations,
  ollmaOptions = { temperature: 0.3, max_tokens: 4000 },
  resumeSource = null // Added for history parsing
) {
  const MAX_ATTEMPTS = 3;
  let attempt = 0;
  let validationResult = null;
  let parsedContent = null;

  // NEW: Get a stable reference history BEFORE the loop
  const referenceHistory = await parseOriginalHistory(selectedModel, jobHistorySource, resumeSource);
  console.log('Reference History for Validation:', referenceHistory);

  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    let prompt = baseGenerationPrompt;

    if (attempt > 1 && validationResult?.errors?.length > 0) {
      const regenErrors = validationResult.errors.filter(e => e.requiresRegeneration);
      if (regenErrors.length > 0) {
        const errorMessages = regenErrors.map(e => `- ${e.message}`).join('\n');
        prompt = `${baseGenerationPrompt}\n\nCRITICAL: Previous attempt failed validation - MUST FIX:\n${errorMessages}\n\nPlease regenerate addressing these issues.`;
      }
    }

    try {
      const response = await callLLM(selectedModel, prompt, ollmaOptions);
      parsedContent = parseJSONResponse(response);

      validationResult = validateAndCorrectLLMResponse(
        parsedContent,
        referenceHistory, // Use stable reference
        jobDescription,
        keywordsToUse,
        honestLimitations,
        { experienceLevel: determineExperienceLevel(referenceHistory) }
      );

      const regenErrors = validationResult.errors.filter(e => e.requiresRegeneration);
      if (regenErrors.length === 0) break;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt >= MAX_ATTEMPTS) throw err;
    }
  }

  return {
    content: validationResult.correctedContent,
    validationResult,
    attempts: attempt,
    success: validationResult.errors.filter(e => e.requiresRegeneration).length === 0
  };
}
