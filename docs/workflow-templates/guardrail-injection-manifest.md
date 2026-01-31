# Layer 4: Guardrail Injection Manifest

**Version:** 9.3.7
**Purpose:** Identifies the "Hard Code" guardrails that must be injected literally into every bullet generation prompt to combat instruction drift.

---

## 1. Injectable Logic Blocks

The following guardrails are treated as **STRUCTURAL CODE** rather than advisory guidance. They must be injected using the `<BEGIN_GUARDRAIL_INJECTION>` markers.

### [G1] Metric Traceability
```javascript
// Every metric must trace to source data for Position N
if (bullet.hasMetric()) {
  assert(Position[N].sourceEvidence.search(bullet.metric) !== -1);
}
```

### [G8] Budget Enforcement
```javascript
// Total word count must be 350-500 words
if (total_word_count > 500) {
  REJECT_OUTPUT();
  TRIGGER_FALLBACK_OLD_POSITIONS();
}
```

### [G24] Character Limits
```javascript
// Bullet length between 100-210 chars
assert(bullet.text.length >= 100 && bullet.text.length <= 210);
```

### [G35] Gerund Ban
```javascript
// No verbs ending in 'ing' at start of bullet
const firstWord = bullet.text.split(' ')[0];
assert(!firstWord.endsWith('ing'));
```

### [G37] Category Distribution
```javascript
// Every verb category must meet 5% floor
const counts = getVerbCategoryCounts();
assert(counts.every(c => c >= (total_bullets * 0.05)));
```

---

## 2. Injection Rules (Layer 4)

1. **Literal Copy:** Do not summarize or paraphrase. Inject the pseudo-code blocks exactly as shown.
2. **Requirement Priority:** Injected blocks MUST be labeled as "ACTIVE SYSTEM CODE" or "STRUCTURAL REQUIREMENTS."
3. **Positioning:** Inject immediately before the `Task Instructions` to ensure high attention weight.
4. **Verification:** The "Proof of Work" block (Layer 2) must explicitly reference these code-level asserts.
