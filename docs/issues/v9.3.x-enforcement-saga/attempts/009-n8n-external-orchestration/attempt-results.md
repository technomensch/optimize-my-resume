# Attempt Results: n8n External Orchestration

**Status:** 🔄 IN PROGRESS
**Date Started:** 2026-02-01
**Current Version:** v10 (improved prompts)
**Outcome:** Workflow architecture working; LLM constraint violations remain (Gemini has same vibe-coding drift as Claude)

---

## Evidence

**Versions Completed:**
- v1-v3: Chat Trigger attempts (failed - unrecognized nodes)
- v4-v5: LangChain integration (failed - Docker incompatibility)
- v6: Webhook foundation (✅ working)
- v7-v9: Various fixes (partial success)
- v10: Improved prompts (in progress)

**Key Artifacts:**
- Webhook-based workflow (HTTP POST working)
- Gemini 2.5-flash integration (quota issue - free tier 20/day limit hit)
- Stage 1 validation logic
- Improved prompt with unmissable constraint formatting

**Challenges Encountered:**
- Parse Input JSON node corrupting data → Fixed: Direct body extraction
- Store Stage 1 reference error → Fixed: Inline state creation
- Gemini model deprecated (1.5-pro) → Updated: 2.5-flash
- JSON output not parsing → Fixed: "Output Content as JSON" enabled
- Webhook HTTP GET instead of POST → Fixed: Correct HTTP method

---

## Key Learnings

1. **Architecture Works, Behavior Doesn't:**
   - n8n webhook orchestration functions properly
   - Gemini integration technically successful
   - Stage 1 validation reaches Gemini successfully
   - **BUT:** Gemini violates constraints (same as Claude)

2. **Vibe-Coding Drift Universal:**
   - Claude: Violates constraints
   - Gemini: Violates identical constraints (3 positions vs max 2)
   - Different model, same behavioral pattern
   - **Implication:** Problem is not model-specific

3. **Prompt Improvement Insufficient:**
   - v10 uses "unmissable constraints" (CAPS, explicit examples)
   - Still producing violations
   - **Implication:** Improved prompts alone cannot overcome vibe-coding drift

4. **Orchestration Adds Complexity:**
   - 3+ days of iteration with limited compliance improvement
   - Requires Docker setup or n8n Cloud
   - Gemini API costs (hit free tier quota)
   - Trade-off: Complex setup vs uncertain compliance gains

---

## Impact on Root Cause Understanding

**Confirmation:** External orchestration doesn't solve vibe-coding drift

- **Old Understanding:** "If we orchestrate externally with Gemini, it will follow constraints"
- **New Understanding:** "Gemini has same vibe-coding drift as Claude; orchestration doesn't fix this"

**Conclusion:** We need constraint enforcement AFTER generation, not just improved prompts before generation

---

## Next Steps

**Option A: Continue n8n with Retry Logic**
- Instead of improved prompts, add feedback loop
- "You violated: max 2 positions. Regenerate with 2 positions."
- Cost: More API calls, longer turnaround
- Benefit: May improve compliance through explicit error feedback

**Option B: Pivot to v9.3.8 Multi-Turn Human Gates**
- User approves position list (Turn 1)
- User approves bullets per position (Turns 2-N)
- Accumulated state makes violations obvious
- Benefit: 100% user-verified compliance, works everywhere
- Cost: Requires user participation (acceptable trade-off)

---

## Technical Insights

**Architecture:** ✅ Successful
- Webhook accepts POST data correctly
- Gemini integration working
- Multi-stage workflow functional
- Docker volume mounting resolved

**Compliance:** ✗ Unsuccessful
- Prompt engineering has ~60-80% ceiling
- LLM behavioral choice overrides prompts
- No amount of orchestration changes LLM choice
- Need explicit constraint enforcement (user gate) or external validation

---

## Related Documentation

- [Implementation Log](../../implementation-log.md)
- [Root Cause Evolution](../../analysis/root-cause-evolution.md)
- [Description](../../description.md) - Problem statement
