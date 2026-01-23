---
description: Execute a specific implementation plan with zero-deviation enforcement
---

1. **Pre-requisite:** User must provide the absolute or relative path to the `.md` implementation plan.
2. **State Initialization:** Write **"STRICT EXECUTION MODE: Following [Plan Path]. No unauthorized improvements or deviations permitted."**
3. **Execution Protocol:**
   - **Literal Mapping:** For every edit, you must first quote the specific line or instruction in the plan you are fulfilling.
   - **Data Integrity Audit:** After every file edit, perform a `view_file` on the change. If you have added ANY logic, comments, formatting, or "cleanups" not explicitly stated in the plan, you must revert and re-apply correctly.
   - **Ambiguity Lock:** If the plan is ambiguous, you are FORBIDDEN from assuming or filling in gaps. You must stop and ask the user for clarification.
   - **No Improvements:** Even if you see a bug or a better way to implement something, do not fix it unless it is explicitly in the plan.
