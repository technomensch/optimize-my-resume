# Beginner's Guide: Agentic Resume Enforcement

If you've spent days building "Guardrails" only to have the AI ignore them, this guide is for you. This system fixes "AI Forgetfulness" by turning a single big request into a managed project.

## 1. What is the "Agent Manager"?
The Agent Manager is not software you install—it is a **set of rules** that forces me (the AI) to act like a project manager instead of just a writer.

When "Agentic Enforcement" is active, I won't just write your resume. I will:
1.  **Stop** and show you a **Plan**.
2.  **Stop** and show you a **Task Checklist**.
3.  **Wait** for you to say "Proceed" before I actually write anything.

## 2. Key Files You Need
These files are the "Brain" of the enforcement system. They live in your project folder:

| File Path | What it does |
| :--- | :--- |
| `PROJECT-INSTRUCTIONS.md` | The "Gold Master". Tells me to use the other files. |
| `.agent/workflows/generate-bullets.md` | The "Playbook". Step-by-step instructions for resumes. |
| `docs/governance/agent-governance.md` | The "Security Guard". Prevents me from skipping steps. |
| `docs/workflow-templates/resume-plan.md` | The "Template". A blueprint for every new resume job. |

## 3. Step-by-Step Instructions

### Step 1: The Trigger
You simply ask me: 
> "Run the `generate-bullets` workflow for Position 1."

### Step 2: The Implementation Plan (Manual Gate)
I will **not** write the bullets yet. Instead, I will create a file called **Implementation Plan**. It will look like a "Contract" that lists:
- Which words I'm going to use.
- What the character limits are.
- A list of steps I'll take.

**Your Action:** Read the plan. If it looks correct, say **"Approve Plan"**.

### Step 3: The Task List (`task.md`)
I will create a checklist called `task.md`. This is my "Work Order". 
- You will see me check off items one by one.
- You can watch my progress in real-time.

### Step 4: The Planning Table (Stage 1)
I will show you a table mapping out your word budget (e.g., "500 words total, 60 words for this job").
**Your Action:** Verify that I haven't forgotten any jobs. Say **"Proceed"**.

### Step 5: Generation & Real-time Gating (Stage 2)
I finally write the bullets. For every single line, I check:
- Is it too long?
- Did I use a forbidden "-ing" verb?
- Did I keep the original numbers/metrics?

### Step 6: Final Verification (Stage 3)
Before ending, I run a "Reconciliation Table" showing you the raw data.
- "Word Count: 492 (Target <500) - PASS"
- "Gerund Check: 0 found - PASS"

## 4. How to Set This Up in a New Project
If you want to move this system to a fresh project:
1.  Copy the `PROJECT-INSTRUCTIONS.md` to the custom instructions.
2.  Ensure the `.agent/workflows/` folder exists in your new project.
3.  Upload the `optimization-tools/` directory.

**I will handle the rest.** You just need to hold the "STOP" button by requiring me to wait for your approval.
