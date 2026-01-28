
/**
 * Prompt Templates
 * v9.2.4: Extracted from ShouldIApply component
 */

export const ANALYSIS_PROMPT_TEMPLATE = `You are a Job Fit Assessment expert. Analyze how well this candidate matches the job description.

{{EXPERIENCE_CONTENT}}

JOB DESCRIPTION:
{{JOB_DESCRIPTION}}

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

export const GENERATION_PROMPT_TEMPLATE = `You are a Resume Optimization expert. Generate customized resume bullets for positions in the candidate's job history that meet chronology depth criteria (NOT all historical positions).

{{EXPERIENCE_CONTENT}}

JOB DESCRIPTION:
{{JOB_DESCRIPTION}}

PREVIOUS FIT ANALYSIS CONTEXT:
- Fit Score: {{FIT_SCORE}}%
- Matched Requirements: {{MATCHED_COUNT}}
- Partial Matches: {{PARTIAL_COUNT}}
- Gaps: {{GAP_COUNT}}
- Key Strengths: {{STRENGTHS}}

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
- KEYWORDS TO USE: {{KEYWORDS_TO_USE}}
- KEYWORDS TO IGNORE: {{KEYWORDS_TO_IGNORE}}

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

/**
 * Builds the analysis prompt
 */
export function buildAnalysisPrompt(experienceContent, jobDescription) {
    return ANALYSIS_PROMPT_TEMPLATE
        .replace('{{EXPERIENCE_CONTENT}}', experienceContent)
        .replace('{{JOB_DESCRIPTION}}', jobDescription);
}

/**
 * Builds the generation prompt
 */
export function buildGenerationPrompt(
    experienceContent,
    jobDescription,
    analysisResult,
    keywordsToUse,
    keywordsToIgnore
) {
    return GENERATION_PROMPT_TEMPLATE
        .replace('{{EXPERIENCE_CONTENT}}', experienceContent)
        .replace('{{JOB_DESCRIPTION}}', jobDescription)
        .replace('{{FIT_SCORE}}', analysisResult.fitScore)
        .replace('{{MATCHED_COUNT}}', analysisResult.summaryStats?.matched || 0)
        .replace('{{PARTIAL_COUNT}}', analysisResult.summaryStats?.partial || 0)
        .replace('{{GAP_COUNT}}', analysisResult.summaryStats?.missing || 0)
        .replace('{{STRENGTHS}}', (analysisResult.gapAnalysis?.strengthsToHighlight || []).join(', '))
        .replace('{{KEYWORDS_TO_USE}}', keywordsToUse.map(k => k.replace(/^Custom: /, '')).join(', '))
        .replace('{{KEYWORDS_TO_IGNORE}}', keywordsToIgnore.map(k => k.replace(/^Custom: /, '')).join(', '));
}
