# Optimize My Resume v6.0

**An AI-powered resume optimization system that works with any chatbot (Claude, ChatGPT, Gemini, Copilot, and more)**

---

## 🎯 What This System Does (In Plain English)

This system helps you improve your resume in three ways:

1. **Full Resume Analysis (Mode 1)** - Upload your complete resume and get a detailed analysis with scores and suggestions
2. **Bullet Point Improvement (Mode 2)** - Take 1-5 bullet points from your resume and make them stronger with better wording and metrics
3. **Job Description Matching (Mode 3)** - Compare your resume to a specific job posting and see what matches, what's missing, and get customized bullets

The system is smart enough to figure out what you need based on what you upload or ask for.

---

## 📋 What You'll Need Before Starting

### Required:
- **Your resume** (PDF, Word document, or plain text)
- **An AI chatbot account** (pick one):
  - Claude (claude.ai)
  - ChatGPT (chat.openai.com)
  - Google Gemini (gemini.google.com)
  - Microsoft Copilot (copilot.microsoft.com)
  - Or any other AI chat tool

### Optional (Makes Mode 3 much better):
- **A job posting** you want to apply for (copy the full text from the company website)

---

## 🚀 Quick Start Instructions (Pick Your AI Tool)

### Option A: Using Claude (Recommended - Easiest Setup)

**What makes Claude special:** Claude has a "Projects" feature that remembers everything between conversations, so you only set this up once.

#### Step-by-Step:

1. **Go to [claude.ai](https://claude.ai) and sign in**

2. **Create a new project:**
   - Click "Projects" in the left sidebar
   - Click "Create Project"
   - Name it: "Resume Optimizer"

3. **Add the instructions:**
   - In your project, click "Project Knowledge"
   - Click "Add Content" → "Edit Instructions"
   - Open the file `PROJECT-INSTRUCTIONS.md` (it's in the main folder of this system)
   - Copy the **entire contents** of that file
   - Paste it into the Claude instructions box
   - Click "Save"

4. **Upload your resume:**
   - In your project, click "Project Knowledge" → "Add Content"
   - Upload your resume file (PDF, Word, or text)
   - Claude will now have access to your resume in every conversation

5. **Start chatting:**
   - Open a new conversation in your project
   - Type: "Analyze my resume" (for Mode 1)
   - Or type: "Optimize this bullet: [paste your bullet]" (for Mode 2)
   - Or paste a job description and type: "How well do I match this job?" (for Mode 3)

**That's it!** Claude will automatically figure out what you need and guide you through the process.

---

### Option B: Using ChatGPT (OpenAI)

**What makes ChatGPT different:** ChatGPT doesn't save instructions permanently, so you'll need to paste instructions at the start of each conversation. Use the quick-start file to make this faster.

#### Step-by-Step:

1. **Go to [chat.openai.com](https://chat.openai.com) and sign in**

2. **Open the quick-start file:**
   - Find the file `quick-start-mode.md` in the main folder
   - Open it with any text editor (Notepad, TextEdit, etc.)
   - Copy the **entire contents** of the file

3. **Start a new chat:**
   - Click "+ New chat" in ChatGPT
   - Paste the entire contents of `quick-start-mode.md` into the message box
   - Press Enter to send it

4. **Wait for ChatGPT to confirm:**
   - ChatGPT will say something like "I'm ready to help optimize your resume"
   - This means it understood the instructions

5. **Upload your resume:**
   - Click the paperclip icon (📎) or "Attach" button
   - Upload your resume file
   - Type: "Analyze my resume"

6. **For other tasks:**
   - To improve bullets: Type "Optimize this bullet: [paste your bullet]"
   - To check job fit: Paste the job description and type "How well do I match this job?"

**Important:** You'll need to paste the `quick-start-mode.md` contents at the start of **every new chat**. ChatGPT doesn't remember between conversations.

---

### Option C: Using Google Gemini

**What makes Gemini different:** Gemini has a very large context window (can handle huge documents), making it great for long resumes or multiple job descriptions at once.

#### Step-by-Step:

1. **Go to [gemini.google.com](https://gemini.google.com) and sign in with your Google account**

2. **Open the quick-start file:**
   - Find the file `quick-start-mode.md` in the main folder
   - Open it with any text editor
   - Copy the **entire contents** of the file

3. **Start a new conversation:**
   - Click "New chat" in Gemini
   - Paste the entire contents of `quick-start-mode.md` into the message box
   - Press Enter

4. **Wait for Gemini to confirm:**
   - Gemini will confirm it's ready to help with resume optimization

5. **Upload your resume:**
   - Click the file upload icon
   - Upload your resume file
   - Type: "Analyze my resume"

6. **For other tasks:**
   - To improve bullets: "Optimize this bullet: [paste your bullet]"
   - To check job fit: Paste the job description and type "How well do I match this job?"

**Note:** Like ChatGPT, you'll need to paste the instructions at the start of each new conversation.

---

### Option D: Using Microsoft Copilot

**What makes Copilot different:** Copilot integrates with Microsoft Office, so if you use Word for your resume, it can be convenient.

#### Step-by-Step:

1. **Go to [copilot.microsoft.com](https://copilot.microsoft.com) and sign in**

2. **Open the quick-start file:**
   - Find the file `quick-start-mode.md` in the main folder
   - Copy the **entire contents**

3. **Start a new conversation:**
   - Click "New topic" or start a new chat
   - Paste the entire contents of `quick-start-mode.md`
   - Press Enter

4. **Wait for confirmation:**
   - Copilot will acknowledge it's ready to help

5. **Upload your resume:**
   - Use the upload button to attach your resume
   - Type: "Analyze my resume"

6. **For other tasks:**
   - To improve bullets: "Optimize this bullet: [paste your bullet]"
   - To check job fit: Paste the job description and type "How well do I match this job?"

---

### Option E: Using Other AI Chatbots (Perplexity, Claude Instant, etc.)

#### Step-by-Step:

1. **Open your AI chatbot**

2. **Copy the quick-start instructions:**
   - Open `quick-start-mode.md` from the main folder
   - Copy the entire contents

3. **Paste into the chat:**
   - Start a new conversation
   - Paste the instructions
   - Wait for the AI to confirm it's ready

4. **Upload or paste your resume:**
   - If the chatbot allows file uploads, upload your resume
   - If not, copy/paste your resume text into the chat
   - Type: "Analyze my resume"

5. **Use the system:**
   - The AI will automatically detect what you need based on what you provide

---

## 📁 File Locations Explained (So You Know What Goes Where)

When following the instructions above, here's where to find each file:

```
optimize-my-resume/                    ← Main folder (you downloaded this)
│
├── README.md                          ← You're reading this file
├── PROJECT-INSTRUCTIONS.md            ← Use this for Claude Projects ONLY
├── quick-start-mode.md                ← Use this for ChatGPT, Gemini, Copilot, and other AI tools
│
├── /docs/                             ← Documentation folder
│   ├── CHANGELOG.md                   ← What changed in each version
│   └── ROADMAP.md                     ← Upcoming features
│
├── /modes/                            ← Individual mode files (advanced users)
│   ├── mode-1-workflow.md             ← Full resume analysis instructions
│   ├── mode-2-bullet-optimization.md  ← Bullet improvement instructions
│   └── mode-3-jd-comparison.md        ← Job description matching instructions
│
├── /shared/                           ← Shared components (advanced users)
│   ├── /phase-1/                      ← Foundation schemas
│   ├── /phase-2/                      ← Evidence matching
│   ├── /phase-3/                      ← Workflow routing
│   └── /phase-4/                      ← Summary generation
│
└── /core/                             ← Configuration files (advanced users)
    ├── fit-thresholds.md              ← Job fit percentage rules
    ├── format-rules.md                ← Character limits and formatting
    ├── verb-categories.md             ← Action verb lists
    └── metrics-requirements.md        ← Metrics and impact requirements
```

**For most users, you only need:**
- `PROJECT-INSTRUCTIONS.md` (if using Claude)
- `quick-start-mode.md` (if using ChatGPT, Gemini, Copilot, or other tools)

---

## 🤔 Which File Should I Use?

### Use `PROJECT-INSTRUCTIONS.md` if:
- ✅ You're using **Claude** with the Projects feature
- ✅ You want to set it up **once** and have it remember everything
- ✅ You plan to use this system regularly (multiple conversations)

### Use `quick-start-mode.md` if:
- ✅ You're using **ChatGPT, Gemini, Copilot, or any other AI tool**
- ✅ You're okay pasting instructions at the start of each conversation
- ✅ You want a single file that has everything in it

---

## 💡 Tips for Best Results

### 1. **Start with Mode 1 (Full Analysis) First**
   - Upload your complete resume first
   - Let the system analyze it and create a "job history" file
   - This makes Mode 2 and Mode 3 work much better

### 2. **Be Specific with Mode 2 (Bullet Optimization)**
   - Only paste 1-5 bullets at a time (not your whole resume)
   - Include context like: "This bullet is for my Product Manager role at Google"
   - If you have metrics (numbers), include them

### 3. **Paste the FULL Job Description for Mode 3**
   - Copy the entire job posting from the company website
   - Include everything: requirements, responsibilities, nice-to-haves
   - The more detail you provide, the better the analysis

### 4. **Save Your Job History File**
   - After Mode 1 analyzes your resume, it creates a file called `claude_generated_job_history_summaries_v2.txt`
   - **Save this file!** You'll need it for Mode 3 to work properly
   - For Claude Projects: It's automatically saved in your project
   - For other tools: Copy the output and save it as a text file

---

## 🆘 Troubleshooting Common Issues

### Problem: "The AI isn't following the instructions"
**Solution:**
- Make sure you pasted the **entire** contents of `quick-start-mode.md` or `PROJECT-INSTRUCTIONS.md`
- Don't edit or skip any sections
- Try starting a completely new conversation

### Problem: "Mode 3 says it can't find my job history"
**Solution:**
- You need to run Mode 1 first (full resume analysis)
- Mode 1 creates the job history file that Mode 3 needs
- For Claude: Make sure your resume is uploaded to the Project
- For other tools: Make sure you ran Mode 1 in the same conversation

### Problem: "The file is too large to paste"
**Solution:**
- If using ChatGPT/Gemini/Copilot and the quick-start file is too long:
  - Use Claude instead (it has a larger context window)
  - Or use the individual mode files from the `/modes/` folder (advanced)

### Problem: "I keep getting generic advice, not specific to my resume"
**Solution:**
- Make sure you actually uploaded your resume file (don't just describe it)
- For Mode 2 and 3, make sure Mode 1 ran successfully first
- Check that the AI confirmed it received and understood your resume

---

## 📊 What Each Mode Does (Detailed)

### Mode 1: Full Resume Analysis
**When to use:** You want comprehensive feedback on your entire resume

**What happens:**
1. The AI reads your complete resume
2. Creates a detailed "job history" file with 12 categories for each position you've held:
   - Job title, company, dates
   - Professional summary
   - Core responsibilities
   - Key achievements
   - Hard skills (technical: Python, Excel, etc.)
   - Soft skills (interpersonal: Leadership, Communication, etc.)
   - Education
   - Certifications
   - Tools & technologies
   - Impact metrics
   - Industry domain
   - Team scope
3. Scores your resume on ATS compatibility, content quality, metrics, and keywords
4. Gives you specific recommendations for improvement
5. Saves everything so Mode 2 and Mode 3 can use it

**Time:** 3-5 minutes

### Mode 2: Bullet Point Optimization
**When to use:** You have specific bullet points that need improvement

**What happens:**
1. You paste 1-5 bullets from your resume
2. The AI analyzes each one for:
   - Action verbs (are they strong and varied?)
   - Metrics (do you have numbers to show impact?)
   - Keywords (industry-relevant terms)
   - Clarity (is it easy to understand?)
3. Asks follow-up questions if metrics are missing
4. Generates 2-3 improved versions of each bullet
5. Shows before/after comparison
6. Checks your job history file for context (if you ran Mode 1)

**Time:** 1-2 minutes per bullet

### Mode 3: Job Description Matching
**When to use:** You have a specific job you want to apply for

**What happens:**
1. You paste the full job description
2. The AI analyzes it using a 17-point system:
   - Company name, job title, location
   - Remote/hybrid/on-site requirements
   - Required vs. preferred skills
   - Required vs. preferred qualifications
   - Education requirements
   - Experience level needed
   - Certifications
   - And more...
3. Compares the job requirements to YOUR experience (from your job history file)
4. Shows you:
   - **MATCHED** (green) - You have clear evidence
   - **PARTIAL** (yellow) - You have related experience
   - **MISSING** (red) - You don't have this
5. Calculates a match score (0-100%)
6. Provides 3 blocking gates:
   - **Hard Skill Deficit** - Missing too many required technical skills
   - **Low Match Score** - Overall fit is below 30%
   - **Location Mismatch** - Remote restrictions or location conflicts
7. If you pass the gates, generates customized resume bullets tailored to the job
8. Optionally creates a customized professional summary for this specific job

**Time:** 5-7 minutes

---

## 🔄 Workflow: How to Use All Three Modes Together

**Recommended process for job seekers:**

1. **Run Mode 1 once** (when you first set up the system)
   - Upload your complete resume
   - Get comprehensive feedback
   - Let it create your job history file
   - Fix any major issues it found

2. **Update individual bullets with Mode 2** (as needed)
   - When you add a new position
   - When you want to strengthen weak bullets
   - When you're tailoring for a specific industry

3. **Use Mode 3 for each job application** (repeatedly)
   - Paste the job description
   - Check your match score
   - Get customized bullets for that specific role
   - Use the generated professional summary in your application

4. **Re-run Mode 1 periodically** (every 3-6 months or after major career changes)
   - Updates your job history file
   - Catches new trends in resume best practices
   - Refreshes your baseline analysis

---

## 📝 Version Information

**Current Version:** 6.0.0 (MAJOR RELEASE)
**Released:** December 29, 2025

### What's New in v6.0:
- **Smart Routing System** - Automatically detects what you need and confirms before proceeding (8 different scenarios)
- **Job History v2.0** - Expanded from 8 to 12 categories for better analysis
- **Hard vs. Soft Skills Separation** - Better matching for technical vs. interpersonal skills
- **17-Point Job Description Parser** - More thorough analysis of job postings
- **Evidence-Based Matching** - Shows exact resume quotes that match job requirements
- **Blocking Gates** - Warns you before applying for jobs that are poor fits
- **Incremental Updates** - Add, edit, or remove positions without re-analyzing everything
- **JD Re-Comparison** - Re-check job fit after updating your resume, see what improved
- **Professional Summary Generation** - Creates custom summaries for each job application

See `docs/CHANGELOG.md` for complete version history.

---

## 🌟 Advanced Features (For Power Users)

### Custom Configuration
If you want to change how the system works:
- Edit files in `/core/` folder to adjust thresholds and rules
- Edit files in `/modes/` folder to modify specific mode behavior
- Edit files in `/shared/` folder to change schemas and workflows

### Modular Loading
If you have context window limitations:
- Load individual mode files from `/modes/` instead of quick-start
- Combine only the modules you need from `/shared/`
- Reference specific components as needed

### Job History Management
Advanced job history operations:
- **Add a position:** "Add this new position to my job history: [details]"
- **Edit a position:** "Update my Google PM role with this new achievement: [details]"
- **Remove a position:** "Remove my internship from 2015 from my job history"
- **List saved JDs:** "Show me all the job descriptions I've analyzed"
- **Re-compare:** "Compare me to that Google PM role again" (after updating your resume)

---

## 🔒 Privacy & Data

**Important:** This system runs entirely through the AI chatbot you choose. Your resume data is subject to that platform's privacy policy.

- **Claude:** Review [Anthropic's privacy policy](https://www.anthropic.com/privacy)
- **ChatGPT:** Review [OpenAI's privacy policy](https://openai.com/privacy)
- **Gemini:** Review [Google's privacy policy](https://policies.google.com/privacy)
- **Copilot:** Review [Microsoft's privacy policy](https://privacy.microsoft.com/)

**Best practice:** Don't include sensitive information (SSN, home address, etc.) in your resume when using AI tools.

---

## 📞 Support & Updates

- **Bug reports:** [GitHub Issues](https://github.com/technomensch/optimize-my-resume/issues)
- **Feature requests:** [GitHub Discussions](https://github.com/technomensch/optimize-my-resume/discussions)
- **Latest version:** Check `docs/CHANGELOG.md` or [GitHub Releases](https://github.com/technomensch/optimize-my-resume/releases)

---

## 📄 License

Open source - free to use, modify, and distribute.

---

## ❓ Frequently Asked Questions

### "Do I need coding skills to use this?"
No! Just copy/paste the instructions into your AI chatbot and upload your resume. The system does everything else.

### "Which AI chatbot is best?"
Claude is easiest (set up once, works forever in Projects). But they all work - use whichever you have access to.

### "Can I use this for multiple resumes?"
Yes! In Claude Projects, create separate projects for each resume. In other tools, just start a new conversation for each resume.

### "Will this make my resume sound like AI wrote it?"
No - the system uses YOUR actual work experience and just makes the wording stronger, adds metrics, and optimizes for keywords. It's still your authentic experience.

### "How often should I update my resume with this system?"
- Run Mode 1: Once every 3-6 months or after major role changes
- Run Mode 2: Whenever you add new bullets or want to improve existing ones
- Run Mode 3: For every job application (the customization matters!)

### "Can I see examples of before/after?"
Yes! The system shows before/after comparisons in real-time. Mode 2 especially provides multiple alternatives for each bullet.

### "What if the AI gives me bad advice?"
The system is a tool to help you, not replace your judgment. Always review suggestions and use what makes sense for your specific situation. You know your experience best.

---

**Ready to optimize your resume? Pick your AI tool above and follow the step-by-step instructions!**
