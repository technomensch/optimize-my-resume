# Test Cases: Binary File Content Extraction

## Test Suite Overview

**Feature:** PDF and DOCX file upload with text extraction  
**Component:** Should-I-Apply WebGUI  
**Priority:** High

---

## PDF Extraction Tests

### TC-57-01: Upload Simple PDF Resume
**Steps:**
1. Navigate to Should-I-Apply WebGUI
2. Select "Upload a file" option
3. Choose a simple 1-page PDF resume
4. Observe extraction status

**Expected:**
- ✓ Success message appears
- ✓ Resume text is extracted and visible in preview
- ✓ Analysis can proceed normally

**Test Data:** Simple 1-page PDF with standard formatting


### TC-57-02: Upload Multi-Page PDF Resume
**Steps:**
1. Upload a 2-3 page PDF resume
2. Verify all pages are extracted

**Expected:**
- ✓ Text from all pages concatenated
- ✓ Page breaks preserved with newlines
- ✓ Content order matches document order


### TC-57-03: Upload Large PDF (5+ pages)
**Steps:**
1. Upload a 5+ page PDF
2. Monitor browser performance

**Expected:**
- ✓ Extraction completes (may take 3-5 seconds)
- ✓ No browser freeze or crash
- ✓ All text extracted


### TC-57-04: Upload Scanned PDF (Image-based)
**Steps:**
1. Upload a scanned PDF without OCR
2. Observe result

**Expected:**
- ⚠️ Extraction fails gracefully
- ✓ Error message explains issue
- ✓ Fallback prompt to copy/paste manually


### TC-57-05: Upload Password-Protected PDF
**Steps:**
1. Upload a password-protected PDF

**Expected:**
- ⚠️ Extraction fails
- ✓ Clear error message
- ✓ Fallback option provided

---

## DOCX Extraction Tests

### TC-57-06: Upload Simple DOCX Resume
**Steps:**
1. Upload a simple .docx resume
2. Verify text extraction

**Expected:**
- ✓ Success message
- ✓ Text extracted correctly
- ✓ Basic formatting preserved (paragraphs, bullets)


### TC-57-07: Upload Complex DOCX with Tables
**Steps:**
1. Upload .docx with tables, columns, headers

**Expected:**
- ✓ Text extracted
- ⚠️ Layout may not be perfect (acceptable)
- ✓ No critical information lost


### TC-57-08: Upload DOCX with Images
**Steps:**
1. Upload .docx containing embedded images

**Expected:**
- ✓ Text extracted
- ℹ️ Images ignored (expected behavior)
- ✓ Alt text or captions extracted if present

---

## Error Handling Tests

### TC-57-09: Upload Corrupted File
**Steps:**
1. Upload a corrupted .pdf or .docx file

**Expected:**
- ✓ Error caught
- ✓ User-friendly error message
- ✓ No application crash


### TC-57-10: Upload Unsupported File Type
**Steps:**
1. Upload .rtf, .odt, or other unsupported format

**Expected:**
- ✓ Fallback to current behavior
- ✓ Prompt to use .txt, .md, or copy/paste


### TC-57-11: Cancel Upload Mid-Extraction
**Steps:**
1. Start uploading large PDF
2. Navigate away or clear input before completion

**Expected:**
- ✓ Extraction cancels cleanly
- ✓ No memory leak
- ✓ UI returns to ready state

---

## Integration Tests

### TC-57-12: Extract PDF → Analyze Job Fit
**Steps:**
1. Upload PDF resume
2. Upload JD
3. Run analysis

**Expected:**
- ✓ End-to-end workflow completes
- ✓ Fit score generated
- ✓ Results display correctly


### TC-57-13: Extract DOCX → Generate Bullets
**Steps:**
1. Upload DOCX resume
2. Upload JD with 50%+ fit
3. Generate customized bullets

**Expected:**
- ✓ Bullets generated from extracted text
- ✓ Keywords integrated correctly


### TC-57-14: Compare Extraction vs Copy/Paste
**Steps:**
1. Upload PDF resume
2. In separate session, copy/paste same content
3. Compare analysis results

**Expected:**
- ✓ Results should be nearly identical
- ℹ️ Minor whitespace differences acceptable

---

## Browser Compatibility

### TC-57-15: Test in Chrome
- [ ] All extraction tests pass

### TC-57-16: Test in Firefox
- [ ] All extraction tests pass

### TC-57-17: Test in Safari
- [ ] All extraction tests pass

### TC-57-18: Test in Edge
- [ ] All extraction tests pass

---

## Performance Tests

### TC-57-19: Measure Extraction Time
**Benchmarks:**
- 1-page PDF: < 1 second
- 3-page PDF: < 3 seconds
- 1-page DOCX: < 0.5 seconds

---

## Accessibility Tests

### TC-57-20: Keyboard Navigation
**Steps:**
1. Navigate entire upload flow using only keyboard

**Expected:**
- ✓ All controls accessible
- ✓ Upload triggered via Enter/Space
- ✓ Status messages announced by screen readers

---

## Test Summary

**Total Test Cases:** 20  
**Priority Breakdown:**
- High: 10 (TC-57-01 to 09, 12)
- Medium: 6 (TC-57-10, 11, 13-16)
- Low: 4 (TC-57-17-20)

**Estimated Testing Time:** 2-3 hours
