/**
 * Shared Module Validators
 *
 * Enforces shared module rules from optimization-tools/
 */

/**
 * Validator: Verb Distribution
 * Rule: shared_verb_taxonomy.md (5% threshold, 13-27% per category)
 */
export function validateVerbDistribution(customizedBullets) {
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
 * Validator: Metrics Density
 * Rule: shared_core_principles.md (70-80% bullets with metrics)
 */
export function validateMetricsDensity(customizedBullets) {
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
 * Validator: Keyword Evidence Tier
 * Rule: shared_keyword_validation.md (Tier 1/2/3 weighting)
 */
export function validateKeywordEvidenceTier(customizedBullets, useKeywords) {
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

export const sharedValidators = [
    validateVerbDistribution,
    validateMetricsDensity,
    validateKeywordEvidenceTier
];

/**
 * Determines experience level from job history
 * v9.2.2 logic
 */
export function determineExperienceLevel(jobHistory) {
    const historyPositions = Array.isArray(jobHistory) ? jobHistory : (jobHistory?.positions || []);
    if (historyPositions.length === 0) return 'entry';

    const CURRENT_YEAR = 2026;
    let totalYears = 0;

    historyPositions.forEach(job => {
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
