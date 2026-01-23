/**
 * Bullet Generation Validators
 *
 * This module exports all validators for the Should-I-Apply bullet generation feature.
 * Extracted from Should-I-Apply-local.jsx for testability and maintainability.
 *
 * @module validators/bullet-generation
 * @see docs/plans/v9.2.3-modularization.md for extraction plan
 */

// TODO: Gemini - Extract and export validators from Should-I-Apply-local.jsx
//
// Files to create:
// - core-validators.js       (lines 2456-2690: ChronologyDepth, PositionMetadata, ChronologicalOrder)
// - guardrail-validators.js  (lines 2730-3110: BulletCounts, Format, Metric*, Summary*, Phrase*)
// - content-validators.js    (lines 3820-3870: Limitation, Skill, Budget, KeywordDensity, etc.)
// - shared-validators.js     (lines 3858-3900: VerbDistribution, MetricsDensity, KeywordEvidenceTier)
// - secondary-validators.js  (RecencyWeighting, AcronymExpansion)
// - history-parser.js        (lines 3937-4010: parseOriginalHistory, regex patterns)
// - matching-helper.js       (lines 2551-2600: findBestMatch, levenshteinDistance)
//
// Target: Reduce Should-I-Apply-local.jsx from 4076 → ~1800 lines

// Core validators (bug fix validators)
export * from './core-validators.js';

// Guardrail validators (quality enforcement)
export * from './guardrail-validators.js';

// Content validators (content quality)
export * from './content-validators.js';

// Shared validators (shared module rules)
export * from './shared-validators.js';

// Secondary validators (moderate priority)
export * from './secondary-validators.js';

// History parser (parseOriginalHistory + regex fallback)
export * from './history-parser.js';

// Matching helper (findBestMatch + Levenshtein)
export * from './matching-helper.js';
