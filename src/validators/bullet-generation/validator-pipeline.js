import {
    validateChronologyDepth,
    validatePositionMetadata,
    validateChronologicalOrder,
    validateBulletCounts,
    validateBulletFormat
} from './core-validators.js';
import {
    validateMetricTraceability,
    validateSummaryAbstraction,
    validateVerbDiversity,
    validateSummaryMetrics,
    validatePhraseRepetition,
    validateMetricPreservation,
    validateKeywordEvidence,
    validateNarrativeFit
} from './guardrail-validators.js';
import {
    validateLimitationEnforcement,
    validateSkillClassification,
    validateBudgetEnforcement,
    validateKeywordDensity,
    validateMetricPlausibility,
    validateScopeAttribution,
    validateEmDash
} from './content-validators.js';
import {
    validateVerbDistribution,
    validateMetricsDensity,
    validateKeywordEvidenceTier
} from './shared-validators.js';
import {
    validateRecencyWeighting,
    validateAcronymExpansion
} from './secondary-validators.js';

/**
 * Master validation pipeline
 * v9.2.2 logic
 */
export function validateAndCorrectLLMResponse(
    parsedContent,
    jobHistory,
    jobDescription,
    useKeywords = [],
    honestLimitations = [],
    candidateProfile = {}
) {
    // Graceful Degradation & Handle object structure
    const historyPositions = Array.isArray(jobHistory) ? jobHistory : (jobHistory?.positions || []);

    if (historyPositions.length === 0) {
        console.warn('HIGH WARNING: Reference history is empty or invalid. Skipping validation to prevent data loss.');
        return {
            valid: false,
            errors: [{
                type: 'EMPTY_REFERENCE_HISTORY',
                message: 'Reference history is empty. Skipping validation to prevent data loss.',
                severity: 'HIGH',
                requiresRegeneration: false
            }],
            warnings: ['Validation bypassed due to missing reference history.'],
            correctedContent: parsedContent,
            summary: {
                totalValidators: 0,
                errorsFound: 1,
                warningsFound: 1,
                autoCorrected: []
            }
        };
    }

    const allErrors = [];
    const allWarnings = [];
    let correctedBullets = parsedContent.customizedBullets;

    // Run validators sequentially
    const chronologyResult = validateChronologyDepth(correctedBullets, historyPositions);
    if (!chronologyResult.valid) {
        allErrors.push(...chronologyResult.errors);
        correctedBullets = chronologyResult.correctedBullets;
    }

    const metadataResult = validatePositionMetadata(correctedBullets, historyPositions, jobDescription);
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

    const traceabilityResult = validateMetricTraceability(correctedBullets, historyPositions);
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

    const preservationResult = validateMetricPreservation(correctedBullets, historyPositions);
    if (!preservationResult.valid) {
        allErrors.push(...preservationResult.errors);
    }

    const evidenceResult = validateKeywordEvidence(correctedBullets, historyPositions, useKeywords);
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
