/**
 * Secondary Validators
 *
 * Moderate priority validators for recency weighting and acronym expansion.
 */

/**
 * Validator: Recency Weighting
 * Rule: Recent roles emphasized (recommend 3+ bullets, 2+ metrics)
 */
export function validateRecencyWeighting(customizedBullets) {
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
 * Validator: Acronym Expansion
 * Rule: Acronyms expanded on first use
 */
export function validateAcronymExpansion(customizedBullets, professionalSummary) {
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

export const secondaryValidators = [
    validateRecencyWeighting,
    validateAcronymExpansion
];
