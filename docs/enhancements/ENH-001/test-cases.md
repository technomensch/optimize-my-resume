# Test Cases: ENH-001 Model Selection for Bullet Regeneration

**Enhancement:** ENH-001
**Created:** 2026-01-25

---

## Test Environment

- **Local Version:** `npm run dev` → localhost:3000
- **WebGUI Version:** Claude Artifacts preview
- **Prerequisites:** Ollama running with 2+ models installed

---

## Test Cases

### TC-001: Model Dropdown Visibility

**Precondition:** User has completed analysis and generated bullets (successful or failed)

**Steps:**
1. Complete resume/job description analysis
2. Click "Generate Customized Content"
3. Wait for generation to complete (success or failure)
4. Observe the "Optimize Your Application" section

**Expected Result:**
- [ ] Model dropdown is visible in the section header
- [ ] Dropdown shows all available Ollama models
- [ ] Current model is pre-selected
- [ ] Regenerate button is visible next to dropdown

---

### TC-002: Model Selection Change

**Precondition:** Bullet generation has run, dropdown is visible

**Steps:**
1. Click on model dropdown
2. Select a different model (e.g., switch from `mistral:7b` to `qwen2.5-coder:14b`)
3. Observe UI state

**Expected Result:**
- [ ] Dropdown updates to show new selection
- [ ] No automatic regeneration occurs
- [ ] Regenerate button remains enabled
- [ ] Analysis data (fit score, keywords) is NOT affected

---

### TC-003: Regenerate with Same Model

**Precondition:** Bullets generated (empty or with content)

**Steps:**
1. Keep current model selected
2. Click "Regenerate Bullets" button
3. Observe loading state
4. Wait for completion

**Expected Result:**
- [ ] Button shows loading spinner and "Generating..." text
- [ ] Button is disabled during generation
- [ ] Model dropdown is disabled during generation
- [ ] New bullets are generated (may differ from previous)
- [ ] Analysis data (fit score, keywords) unchanged

---

### TC-004: Regenerate with Different Model

**Precondition:** Initial generation failed with small model (7B)

**Steps:**
1. Select a larger model (e.g., `qwen2.5-coder:14b`)
2. Click "Regenerate Bullets"
3. Wait for completion

**Expected Result:**
- [ ] Generation uses newly selected model
- [ ] Larger model produces valid bullets
- [ ] customizedBullets section displays correctly
- [ ] Professional Summary is also regenerated

---

### TC-005: Generation Failure Feedback

**Precondition:** Using a model that fails to produce valid JSON

**Steps:**
1. Select a small/weak model
2. Click "Regenerate Bullets"
3. Wait for 3 attempts to fail

**Expected Result:**
- [ ] Warning message appears: "Last attempt failed (3/3) - try a different model"
- [ ] Message is visible and styled (amber/yellow)
- [ ] Dropdown and button remain enabled for retry
- [ ] Console shows `success: false` in validation report

---

### TC-006: State Preservation on Regeneration

**Precondition:** Analysis completed with fit score, keywords, etc.

**Steps:**
1. Note current fit score and extracted keywords
2. Regenerate bullets with any model
3. Compare fit score and keywords after regeneration

**Expected Result:**
- [ ] Fit score is UNCHANGED
- [ ] Use/Avoid keywords are UNCHANGED
- [ ] Job history data is UNCHANGED
- [ ] Only customizedBullets and professionalSummary changed

---

### TC-007: Dropdown During Generation

**Precondition:** Regeneration in progress

**Steps:**
1. Click "Regenerate Bullets"
2. While generating, try to change model dropdown
3. Try to click regenerate button again

**Expected Result:**
- [ ] Model dropdown is disabled
- [ ] Regenerate button is disabled
- [ ] Cannot start another generation while one is running

---

### TC-008: WebGUI Parity

**Precondition:** Have both local and webgui versions available

**Steps:**
1. Test all above cases in webgui version
2. Compare behavior to local version

**Expected Result:**
- [ ] All functionality works identically
- [ ] UI appearance is consistent
- [ ] Same error messages and states

---

## Edge Cases

### EC-001: No Models Available

**Steps:**
1. Stop Ollama service
2. Navigate to Optimize section

**Expected Result:**
- [ ] Dropdown shows "No models available" or similar
- [ ] Regenerate button is disabled
- [ ] Error message indicates Ollama connection issue

---

### EC-002: Model Removed Mid-Session

**Steps:**
1. Generate bullets with Model A
2. In terminal: `ollama rm model-a`
3. Try to regenerate with Model A still selected

**Expected Result:**
- [ ] Error message indicates model not found
- [ ] User prompted to select different model
- [ ] Application doesn't crash

---

### EC-003: Very Long Generation Time

**Steps:**
1. Select a large model (70B+)
2. Regenerate bullets
3. Wait for extended period

**Expected Result:**
- [ ] Loading state persists throughout
- [ ] No timeout errors for reasonable wait times
- [ ] User can still interact with other page elements

---

## Regression Tests

### RT-001: Initial Generation Still Works

**Steps:**
1. Fresh page load
2. Complete normal flow: upload → analyze → generate

**Expected Result:**
- [ ] First-time generation works as before
- [ ] No errors introduced by new code
- [ ] Model dropdown appears after generation completes

---

### RT-002: Analysis Flow Unchanged

**Steps:**
1. Change model in top-of-page selector
2. Run analysis

**Expected Result:**
- [ ] Analysis uses top-of-page model (not generation model)
- [ ] New enhancement doesn't affect analysis flow
