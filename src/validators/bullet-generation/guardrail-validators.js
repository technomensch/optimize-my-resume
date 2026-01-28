/**
 * Guardrail Validators
 *
 * Enforces critical guardrails from PROJECT-INSTRUCTIONS.md
 */

/**
 * Validator: Metric Traceability
 * Rule #1: All metrics traceable to source
 */
export function validateMetricTraceability(customizedBullets, jobHistory) {
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
 * Validator: Summary Abstraction
 * Rule #3: Summary doesn't echo bullets
 */
export function validateSummaryAbstraction(professionalSummary, customizedBullets) {
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
 * Validator: Verb Diversity
 * Rule #9: Varies verb choices
 */
export function validateVerbDiversity(customizedBullets) {
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
 * Validator: Summary Metrics
 * Rule #13: Metrics reconciled in summary
 */
export function validateSummaryMetrics(professionalSummary, customizedBullets) {
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
 * Validator: Phrase Repetition
 * Rule #15: No phrase repeated 3+ times
 */
export function validatePhraseRepetition(professionalSummary, customizedBullets) {
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
 * Validator: Metric Preservation
 * Rule #29: Metrics not lost during optimization
 */
export function validateMetricPreservation(customizedBullets, jobHistory) {
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
 * Validator: Keyword Evidence
 * Rule #32: Only evidenced keywords used
 */
export function validateKeywordEvidence(customizedBullets, jobHistory, useKeywords) {
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
 * Validator: Narrative Fit
 * Rule #33: Narrative matches job trajectory
 */
export function validateNarrativeFit(customizedBullets, narrativeVerification) {
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

export const guardrailValidators = [
    validateMetricTraceability,
    validateSummaryAbstraction,
    validateVerbDiversity,
    validateSummaryMetrics,
    validatePhraseRepetition,
    validateMetricPreservation,
    validateKeywordEvidence,
    validateNarrativeFit
];
