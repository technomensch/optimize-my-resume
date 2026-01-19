# Test Cases: Check for Existing Project Files

## Test Suite Overview

**Feature:** Project file access and selection  
**Component:** Should-I-Apply WebGUI  
**Priority:** Medium  
**Status:** Pending feasibility study

---

## Feasibility Tests

### TC-58-01: Test Claude Artifact File Access
**Steps:**
1. In artifact, attempt to fetch `/mnt/project/README.md`
2. Log result

**Expected:**
- Document whether fetch succeeds or fails
- Note exact error message if fails

**Priority:** CRITICAL - Must run first


### TC-58-02: Test Browser File System Access API
**Steps:**
1. Add File System Access API code
2. Click "Select Folder" button
3. Observe permissions dialog

**Expected:**
- ✓ Permission dialog appears (Chrome/Edge only)
- ✓ Can select folder
- ✓ Can read file list

**Browser Support:** Chrome 86+, Edge 86+

---

## File Listing Tests (if feasible)

### TC-58-03: List Available Files
**Steps:**
1. Navigate to file selection area
2. Observe list of available files

**Expected:**
- ✓ Shows .txt and .md files from project
- ✓ Files grouped by type (job history, resumes, JDs)
- ✓ File names are readable and clickable


### TC-58-04: Filter by File Type
**Steps:**
1. Select filter: "Job History" or "Resumes"
2. Observe filtered list

**Expected:**
- ✓ Only relevant files shown
- ✓ Clear indication of active filter


### TC-58-05: Search for File
**Steps:**
1. Type filename in search box
2. Observe filtered results

**Expected:**
- ✓ Results update in real-time
- ✓ Partial matches shown
- ✓ Case-insensitive search

---

## File Loading Tests

### TC-58-06: Load Job History File
**Steps:**
1. Select a job history .txt file
2. Click "Load" button
3. Observe result

**Expected:**
- ✓ File content loaded
- ✓ Content type auto-detected (XML job history)
- ✓ Ready for analysis


### TC-58-07: Load Resume File
**Steps:**
1. Select a resume .md file
2. Load file

**Expected:**
- ✓ Resume content loaded
- ✓ Markdown preserved
- ✓ Ready for analysis


### TC-58-08: Load Non-Existent File
**Steps:**
1. Manually type filename that doesn't exist
2. Attempt to load

**Expected:**
- ⚠️ Clear error message
- ✓ Suggestion to check filename or upload instead
- ✓ No application crash

---

## Error Handling Tests

### TC-58-09: Handle Permission Denied
**Steps:**
1. Trigger file access request
2. Click "Deny" on permission dialog

**Expected:**
- ⚠️ Graceful fallback to manual input
- ✓ Clear message explaining fallback mode


### TC-58-10: Handle File Read Error
**Steps:**
1. Attempt to load a locked/corrupted file

**Expected:**
- ⚠️ Error caught
- ✓ User-friendly error message
- ✓ Option to try different file

---

## Integration Tests

### TC-58-11: Load File → Analyze
**Steps:**
1. Load project job history file
2. Load JD
3. Run fit analysis

**Expected:**
- ✓ End-to-end workflow completes
- ✓ Same results as manual upload

---

## UI/UX Tests

### TC-58-12: File Selection UI Clarity
**Steps:**
1. Review file selection interface

**Expected:**
- ✓ Clear labeling (Job History vs Resume)
- ✓ File preview available
- ✓ Recent files highlighted

---

## Browser Compatibility

### TC-58-13: Test in Chrome
- [ ] File System Access API works
- [ ] File listing works
- [ ] Load functionality works

### TC-58-14: Test in Firefox
- [ ] Falls back gracefully (no File System API support)
- [ ] Manual input still functions

### TC-58-15: Test in Safari
- [ ] Falls back gracefully
- [ ] Manual input still functions

---

## Performance Tests

### TC-58-16: Large Directory Listing
**Steps:**
1. Test with 50+ files in directory

**Expected:**
- ✓ List renders in < 1 second
- ✓ Search/filter remains responsive

---

## Acceptance Criteria

**If file access is feasible:**
- ✅ At least 80% of tests pass
- ✅ Works in Chrome/Edge (primary browsers)
- ✅ Graceful fallback in unsupported browsers

**If file access is NOT feasible:**
- ✅ Document exact limitations
- ✅ Mark issue as "Won't Fix - Environment Limitation"
- ✅ Maintain existing manual input option

---

## Test Summary

**Total Test Cases:** 16  
**Critical:** 2 (TC-58-01, 02)  
**High:** 6 (TC-58-03 to 08)  
**Medium:** 5 (TC-58-09 to 13)  
**Low:** 3 (TC-58-14 to 16)

**Estimated Testing Time:** 1-2 hours (after feasibility confirmed)

---

## Decision Point

**After TC-58-01 and TC-58-02:**
- If PASS → Proceed with full implementation and testing
- If FAIL → Mark as "Won't Fix" and document limitation
