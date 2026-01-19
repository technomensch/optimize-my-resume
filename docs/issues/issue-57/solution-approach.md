# Solution Approach: Binary File Content Extraction
**Branch:** `feat/issue-57-binary-file-extraction`

## Overview

Implement client-side text extraction from PDF and DOCX files using browser-based libraries.

---

## Implementation Strategy

### Phase 1: Add Libraries

**Libraries to integrate:**
- `pdf.js` (Mozilla) - PDF text extraction
- `mammoth.js` - DOCX text extraction

**Integration method:**
```html
<!-- Add to artifact head or use CDN imports -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js"></script>
```

---

### Phase 2: Update File Upload Handler

**File:** Should-I-Apply-webgui.jsx (~lines 200-230)

**Current logic:**
```javascript
const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    // Currently reads as base64
    const content = e.target.result;
    // ...
  };
  reader.readAsDataURL(file);
};
```

**New logic:**
```javascript
const handleFileUpload = async (event, type) => {
  const file = event.target.files[0];
  const fileType = file.type;
  
  try {
    let extractedText = '';
    
    if (fileType === 'application/pdf') {
      extractedText = await extractPdfText(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractDocxText(file);
    } else {
      // Fallback to current base64 approach for .txt, .md
      const reader = new FileReader();
      reader.onload = (e) => {
        // existing logic
      };
      reader.readAsText(file);
      return;
    }
    
    // Set extracted text
    if (type === 'resume') {
      setResumeSource({ type: 'file', content: extractedText, filename: file.name });
    } else {
      setJobHistorySource({ type: 'file', content: extractedText, filename: file.name });
    }
    
    setExtractionStatus({ success: true, message: `Successfully extracted text from ${file.name}` });
    
  } catch (error) {
    setExtractionStatus({ 
      success: false, 
      message: `Failed to extract text: ${error.message}. Please copy/paste content manually.` 
    });
  }
};
```

---

### Phase 3: Create Extraction Functions

**PDF extraction:**
```javascript
const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
};
```

**DOCX extraction:**
```javascript
const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
```

---

### Phase 4: Add User Feedback

**New state variable:**
```javascript
const [extractionStatus, setExtractionStatus] = useState(null);
```

**UI component:**
```jsx
{extractionStatus && (
  <div className={`p-3 rounded-lg border ${
    extractionStatus.success 
      ? 'bg-green-900/20 border-green-700 text-green-300'
      : 'bg-red-900/20 border-red-700 text-red-300'
  }`}>
    {extractionStatus.success ? '✓' : '✗'} {extractionStatus.message}
  </div>
)}
```

---

## Files to Modify

1. **Should-I-Apply-webgui.jsx**
   - Add library imports/CDN links
   - Update `handleFileUpload()` function
   - Add `extractPdfText()` function
   - Add `extractDocxText()` function
   - Add `extractionStatus` state and UI

---

## Testing Checklist

See `test-cases.md`

---

## Risk Assessment

**Low Risk:**
- Libraries are well-established and widely used
- Client-side processing (no server dependency)
- Graceful fallback to existing behavior

**Potential Issues:**
- Very large PDFs may cause browser memory issues
- Scanned PDFs without OCR won't extract text
- Complex DOCX formatting may not preserve perfectly

---

## Rollback Plan

If extraction fails, system falls back to:
1. Show error message
2. Prompt user to copy/paste manually
3. Existing base64 approach still available
