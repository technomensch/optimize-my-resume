# Pro Workflow: Google AI Studio for Resume Optimization

This guide details the high-precision workflow for using Google AI Studio to optimize your resume while avoiding "Instructional Saturation."

## 1. Initial Setup (The Foundation)

### **A. System Instructions (The "Boss" Prompt)**
Instead of pasting thousands of lines, you will paste a "Thin Entry Point" prompt (approx. 500 words).
- **Function**: It tells the LLM: `You are a Resume Optimizer. Your rules are in the attached files. Do NOT act until a JD is provided. Follow the 3-Stage Checkpoint Pattern.`

### **B. Grounding Files (The Knowledge)**
You will upload the **31 Core and Optimization Files** directly to the "Files" area in the AI Studio sidebar.
- **Why**: This keeps the reasoning logic "outside" the active chat history, preventing the LLM from getting confused as the conversation gets longer.

---

## 2. Initiation (How to Start)

### **Step 1: The Context Injection**
You provide two things in your first message:
1. **The JD**: Paste the job description.
2. **The Resume**: (Optional) If you haven't uploaded `resume.txt` to the files, paste it now.

### **Step 2: The "Analyze" Command**
You simply type: `Initialize Workflow.`

---

## 3. The 3-Stage Workflow (Expected Experience)

### **Stage 1: Planning & Budgeting (The "Stop" Gate)**
The LLM will **NOT** generate bullets yet. 
- **What happens**: It analyzes the JD vs. your resume and outputs a **Budget Allocation Table**.
- **The Gate**: It stops and says: `Plan ready. I intend to focus on [Matching Skill A] and [Experience B]. Proceed?`
- **Your Action**: You review the strategy. If it's wrong, you correct it. If right, you type `YES`.

### **Stage 2: Gated Generation (Precision Mode)**
The LLM generates bullets for a single position.
- **What happens**: For every single bullet, it checks the internal files (`bo_output-validator.md`) and displays a validation check (e.g., `[✓] Metric Present`, `[✓] Action Verb Correct`).
- **The Gate**: After one position is done, it stops. 
- **Your Action**: You verify the "vibe" is correct. Type `Next`.

### **Stage 3: Reconciliation & Summary**
Once all bullets are done, the LLM performs a "Final Reconciliation."
- **What happens**: It checks the total keyword coverage against the JD requirements and generates your **Professional Summary** and **Cover Letter snippets**.
- **Final Output**: It delivers the completed content in a clean Markdown block ready for your resume.

---

## 4. What to Expect (The "No-Drift" Guarantee)

- **Manual Verification**: Since you are looking at the "Stage 1 Plan," you catch errors *before* the LLM spends tokens writing bad bullets.
- **Persistent Rules**: Because the rules are in "Files," they don't get "shoved out" of memory when the chat gets long.
- **Checkpoints**: You are in the driver's seat. If the LLM misses a keyword, you catch it at the Stage 1 table instead of having to fix 15 bullets later.

> [!TIP]
> **Pro Tip**: If the LLM starts to "vibe-code" (ignoring rules), simply type: `Refer to bo_output-validator.md and re-verify the last 3 bullets.` This forces it back into the file-based logic.
