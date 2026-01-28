# Job Fit Assessment Module (v8.2.0)

<!-- ========================================================================== -->
<!-- JOB FIT ANALYZER: PRE-GENERATION FIT ASSESSMENT                             -->
<!-- ========================================================================== -->

<job_fit_analyzer_pre_generation_assessment>
  <!-- part of v7.1 issue #33 -->
  <real_world_hiring_context>
    <priority>MODERATE</priority>
    <purpose>
      Calibrate assessment logic to match real hiring dynamics, not rigid 
      checkbox matching.
    </purpose>
    
    <principles>
      <principle id="jd_inflation">
        <statement>
          Job descriptions are typically 30% inflated. They represent the 
          "unicorn candidate" wishlist, not the actual hire bar.
        </statement>
        <implication>
          Candidate meeting 70% of requirements is genuinely competitive, 
          not underqualified.
        </implication>
      </principle>
      
      <principle id="rare_over_common">
        <statement>
          Rare skills create disproportionate advantage. A candidate with 
          ONE rare skill hiring managers struggle to find will advance 
          further than a candidate with MORE years but COMMON skills.
        </statement>
        <implication>
          Portfolio project demonstrating rare skill > 2 years professional 
          experience with common skills.
        </implication>
      </principle>
      
      <principle id="transferable_foundations">
        <statement>
          Technical foundations (tools, workflows, methodologies) transfer 
          near-perfectly. Domain knowledge (industry, regulations) is 
          trained on the job.
        </statement>
        <implication>
          Strong technical foundation + wrong industry > Weak technical 
          foundation + right industry.
        </implication>
      </principle>
      
      <principle id="growth_potential">
        <statement>
          Hiring managers hire for POTENTIAL, not just CURRENT STATE. 
          Evidence of rapid learning (portfolio projects, self-teaching, 
          certifications) signals coachability.
        </statement>
        <implication>
          Portfolio project showing self-teaching adds strategic value 
          beyond just skill demonstration.
        </implication>
      </principle>
    </principles>
    
    <assessment_mindset_shift>
      <from>
        "Do I meet every requirement on paper?"
        (Deficit-focused, risk-averse)
      </from>
      <to>
        "What's my competitive position vs other candidates?"
        (Strength-focused, opportunity-seeking)
      </to>
    </assessment_mindset_shift>
  </real_world_hiring_context>
  
  <purpose>
    Evaluate job description fit against user's experience BEFORE generating bullets. Stop early if critical domain/technology gaps exist to avoid wasting tokens on positions the user shouldn't apply for.
  </purpose>

  <execution_order priority="CRITICAL">
    This assessment MUST run BEFORE any bullet generation. Do not generate bullets until this assessment is complete and proceed decision is made.
  </execution_order>

  <!-- v6.4.0 Change: Portfolio Project Weighting Rules -->
  <portfolio_project_weighting>
    <version>1.0</version>
    <priority>HIGH</priority>

    <definition>
      Portfolio projects include:
      - Personal GitHub repositories
      - Side projects and hobby work
      - Open-source contributions (unless paid/sponsored)
      - Self-directed learning projects
      - Freelance work without formal employment relationship
      - Positions marked as "Personal Project" or "Portfolio" in job history
    </definition>

    <weighting_rules>
      <rule id="skills_only">
        Portfolio projects count toward "technical skills demonstrated" category ONLY.
        They do NOT count toward:
        - Years of professional experience in a role type (PM, Engineer, etc.)
        - Customer-facing product management experience
        - B2B/B2C/Enterprise sales cycle experience
        - Revenue or P&L responsibility
        - Team leadership or people management experience
        - Industry-specific experience (SaaS, FinTech, Healthcare, etc.)
      </rule>

      <rule id="recency_discount">
        When calculating fit scores, portfolio projects receive 50% weight compared
        to equivalent professional experience for skill matching.

        Example:
        - Professional role with "workflow automation": 100% skill credit
        - Portfolio project with "workflow automation": 50% skill credit
      </rule>

      <rule id="scope_limitations">
        Portfolio projects cannot demonstrate:
        - Cross-functional leadership (no real org to navigate)
        - Stakeholder management at scale (self-directed ≠ org politics)
        - Production system ownership (personal repos ≠ enterprise systems)
        - Customer success metrics (no paying customers unless proven)

        Exception: If portfolio project has documented external users, paying
        customers, or organizational adoption, treat as professional experience.
      </rule>
    </weighting_rules>

    <pm_role_specific_rules>
      <rule id="pm_experience_validation">
        For Product Manager roles, the following MUST come from professional employment:
        - Product roadmap ownership
        - Customer discovery and research
        - Feature prioritization with stakeholders
        - Go-to-market collaboration
        - Success metrics ownership (retention, revenue, adoption)

        Building a personal tool (even a sophisticated one) does NOT equal PM experience.
        Managing your own project backlog ≠ Managing a product for customers.
      </rule>
    </pm_role_specific_rules>

    <examples>
      <example type="incorrect_assessment">
        Job History: "Built multi-agent AI system with 47 releases in personal GitHub repo"
        JD Requirement: "3+ years Product Management experience"

        ❌ WRONG: "Direct match - managed product releases"
        ✅ CORRECT: "Portfolio project demonstrates technical skills and release
           discipline, but does not count toward PM experience requirement.
           PM Experience: 0 years."
      </example>

      <example type="incorrect_assessment">
        Job History: "Created documentation system with 15,000+ lines across 25 files"
        JD Requirement: "Experience driving product strategy and roadmaps"

        ❌ WRONG: "Direct match - drove documentation strategy and roadmap"
        ✅ CORRECT: "Portfolio project shows planning ability, but personal project
           roadmaps ≠ customer-facing product roadmaps with revenue implications."
      </example>

      <example type="correct_assessment">
        Job History: "Open-source project with 500+ GitHub stars and 50+ contributors"
        JD Requirement: "Experience leading cross-functional teams"

        ✅ CORRECT: "Open-source leadership with external contributors demonstrates
           some cross-functional coordination. Partial credit (50%) for team leadership."
      </example>
    </examples>
  </portfolio_project_weighting>

  <initial_fit_assessment>
    
    <step number="1" name="extract_critical_requirements">
      <purpose>Identify non-negotiable or heavily emphasized requirements from JD</purpose>
      
      <what_to_extract>
        <domain_expertise>Industry-specific knowledge</domain_expertise>
        <specialized_platforms>Specific enterprise systems</specialized_platforms>
        <programming_languages>Languages with specific experience levels</programming_languages>
        <technical_specializations>Niche technical areas</technical_specializations>
        <certifications>Required credentials</certifications>
        <industry_experience>Sector-specific background</industry_experience>
        <work_location_requirements>Work arrangement and location constraints (e.g., "Remote", "Hybrid 3 days/week", "On-site required", "Remote - CA residents only", "Hybrid - must be within 50 miles of office")</work_location_requirements>
      </what_to_extract>
      
      <categorization>
        <red_flag priority="critical">Required, must have, appears multiple times, foundational</red_flag>
        <yellow_flag priority="moderate">Preferred, nice to have, mentioned once or twice</yellow_flag>
        <location_red_flags priority="critical">
          - "Must be located in [specific state/city]" when user is elsewhere
          <!-- v6.1.8 Change: Added payroll restriction detection -->
          - "The following states are not approved for remote payroll at this time: [list]" when user's state is excluded
          - "On-site required" when user seeks remote
          - "Hybrid X days/week" when user seeks fully remote
          - "Remote - [state] residents only" when user is in different state
          - "Relocation required" without relocation assistance mentioned
          - "Fake remote" indicators: "Remote during training, then on-site", "Remote but must come to office weekly"
        </location_red_flags>

        <!-- v6.1.8 Enhancement: State abbreviation expansion for payroll restrictions -->
        <state_abbreviation_mapping>
          <instruction>When location requirements contain state abbreviations (e.g., "AL, AK, MT"), expand them to full state names for clarity in output.</instruction>
          <usage>
            - When parsing payroll restrictions: "States: AL, AK, MT" → "Alabama, Alaska, Montana"
            - When displaying location warnings: Show both formats - "Excluded states: Alabama (AL), Alaska (AK), Montana (MT)"
            - Apply to all location-related parsing: remote restrictions, residency requirements, excluded states
          </usage>
          <mapping>
            AL=Alabama, AK=Alaska, AZ=Arizona, AR=Arkansas, CA=California, CO=Colorado, CT=Connecticut,
            DE=Delaware, FL=Florida, GA=Georgia, HI=Hawaii, ID=Idaho, IL=Illinois, IN=Indiana, IA=Iowa,
            KS=Kansas, KY=Kentucky, LA=Louisiana, ME=Maine, MD=Maryland, MA=Massachusetts, MI=Michigan,
            MN=Minnesota, MS=Mississippi, MO=Missouri, MT=Montana, NE=Nebraska, NV=Nevada, NH=New Hampshire,
            NJ=New Jersey, NM=New Mexico, NY=New York, NC=North Carolina, ND=North Dakota, OH=Ohio,
            OK=Oklahoma, OR=Oregon, PA=Pennsylvania, RI=Rhode Island, SC=South Carolina, SD=South Dakota,
            TN=Tennessee, TX=Texas, UT=Utah, VT=Vermont, VA=Virginia, WA=Washington, WV=West Virginia,
            WI=Wisconsin, WY=Wyoming, DC=District of Columbia
          </mapping>
        </state_abbreviation_mapping>
      </categorization>
    </step>

    <!-- v6.4.0 Change: Adjacent Technical Area Definition -->
    <adjacent_technical_definition>
      <version>1.0</version>
      <priority>HIGH</priority>

      <context>
        Many JDs include language like "technical background required" or "experience
        in systems, networks, or adjacent technical areas." This section defines what
        qualifies as "adjacent technical" vs. "technical-adjacent support roles."
      </context>

      <valid_adjacent_technical_roles>
        <description>
          Roles where the person BUILDS, OPERATES, or ENGINEERS technical systems:
        </description>
        <examples>
          - Site Reliability Engineering (SRE)
          - DevOps / Platform Engineering
          - Systems Administration
          - Network Engineering
          - Security Engineering / Security Operations
          - Data Engineering / Data Platform
          - Database Administration
          - Cloud Infrastructure Engineering
          - QA/Test Automation Engineering
          - Technical Support Engineering (Tier 3+)
          - Solutions Architecture
          - Technical Sales Engineering (with hands-on implementation)
        </examples>
      </valid_adjacent_technical_roles>

      <invalid_adjacent_technical_roles>
        <description>
          Roles that SUPPORT or DOCUMENT technical systems but don't build/operate them:
        </description>
        <examples>
          - Technical Writing (writes ABOUT systems, doesn't build them)
          - Business Analysis (gathers requirements, doesn't implement)
          - Project Management (coordinates technical work, doesn't do it)
          - IT Help Desk / Tier 1-2 Support (uses systems, doesn't engineer them)
          - SaaS Administration (configures tools, doesn't build infrastructure)
          - Scrum Master / Agile Coach (facilitates, doesn't build)
          - Technical Recruiting (evaluates technical skills, doesn't have them)
          - Technical Training (teaches systems, may not engineer them)
        </examples>
      </invalid_adjacent_technical_roles>

      <distinction_rule>
        <rule priority="critical">
          "Working WITH technical systems" ≠ "Working IN/ON technical systems"

          - Working WITH: Uses technical systems as tools to accomplish non-technical goals
            Example: Using Jira to manage projects, administering Google Workspace

          - Working IN/ON: Builds, maintains, or operates technical infrastructure
            Example: Writing Terraform configs, managing Kubernetes clusters, building CI/CD pipelines
        </rule>
      </distinction_rule>

      <assessment_questions>
        <question id="1">Did this role require writing code that went to production?</question>
        <question id="2">Did this role require on-call/pager duty for system reliability?</question>
        <question id="3">Did this role require architecture decisions for scalability/performance?</question>
        <question id="4">Did this role require debugging production incidents at the infrastructure level?</question>
        <question id="5">Did this role require security hardening or vulnerability remediation?</question>

        <scoring>
          - 3+ "Yes" answers: Valid adjacent technical experience
          - 1-2 "Yes" answers: Partial technical exposure (flag as gap)
          - 0 "Yes" answers: Technical-adjacent support role (not "adjacent technical")
        </scoring>
      </assessment_questions>

      <examples>
        <example type="valid">
          Role: "Google Workspace Administrator supporting 10,000 users"
          Assessment Questions:
          - Production code? No (configuration, not code)
          - On-call duty? Possibly (for major outages)
          - Architecture decisions? No (SaaS platform)
          - Infrastructure debugging? No (SaaS platform)
          - Security hardening? Partial (policy configuration)

          Score: 0-1 "Yes" → Technical-adjacent support role
          Verdict: Does NOT qualify as "adjacent technical" for PM roles requiring
                   developer credibility
        </example>

        <example type="valid">
          Role: "DevOps Engineer managing CI/CD pipelines and Kubernetes clusters"
          Assessment Questions:
          - Production code? Yes (pipeline configs, scripts)
          - On-call duty? Yes
          - Architecture decisions? Yes
          - Infrastructure debugging? Yes
          - Security hardening? Yes

          Score: 5 "Yes" → Valid adjacent technical experience
          Verdict: Qualifies as "adjacent technical" for PM roles
        </example>

        <example type="edge_case">
          Role: "Technical Writer for cloud infrastructure documentation"
          Assessment Questions:
          - Production code? No
          - On-call duty? No
          - Architecture decisions? No (documents others' decisions)
          - Infrastructure debugging? No
          - Security hardening? No

          Score: 0 "Yes" → Technical-adjacent support role
          Verdict: Writing ABOUT Kubernetes ≠ Working WITH Kubernetes
                   Does NOT qualify as "adjacent technical"
        </example>
      </examples>
    </adjacent_technical_definition>

    <step number="2" name="compare_against_job_history">
      <process>
        1. Search /mnt/project/claude_generated_job_history_summaries.txt for each critical requirement
        2. Flag requirements NOT found in job history
        3. Note strength of match (direct vs tangential vs transferable vs no match)
      </process>
      <matching_criteria>
        <location_match>User's location preferences align with JD requirements (remote vs on-site, geographic restrictions)</location_match>
        <!-- v6.1.8 Enhancement: Reference state abbreviation mapping for location mismatches -->
        <location_mismatch>JD requires on-site/hybrid when user needs remote, OR geographic restrictions user cannot meet. When displaying state-specific restrictions, use state_abbreviation_mapping to expand abbreviations (e.g., "Excluded: Alabama (AL), Alaska (AK), Montana (MT)" instead of just "AL, AK, MT").</location_mismatch>
      </matching_criteria>
    </step>

    <!-- v6.4.0 Change: Role-Type Experience Validation -->
    <role_type_experience_validation>
      <version>1.0</version>
      <priority>CRITICAL</priority>

      <purpose>
        Different role types (PM, BA, TW, Engineer) have distinct responsibilities and
        career paths. Experience in one role type does NOT automatically qualify for
        senior positions in another role type.
      </purpose>

      <role_type_definitions>
        <role_type id="product_manager">
          <titles>Product Manager, Product Owner, Group PM, Director of Product</titles>
          <core_responsibilities>
            - Product strategy and vision
            - Roadmap prioritization with business impact
            - Customer discovery and market research
            - Cross-functional leadership (Eng, Design, Marketing, Sales)
            - Success metrics ownership (revenue, adoption, retention)
            - Go-to-market collaboration
            - Pricing and packaging decisions
          </core_responsibilities>
          <does_not_include>
            - Product management (timeline/resource coordination)
            - Business analysis (requirements documentation)
            - Scrum master activities (ceremony facilitation)
            - Technical writing (documentation creation)
          </does_not_include>
        </role_type>

        <role_type id="business_analyst">
          <titles>Business Analyst, Systems Analyst, Requirements Analyst</titles>
          <core_responsibilities>
            - Requirements elicitation and documentation
            - Process analysis and optimization
            - User story creation and acceptance criteria
            - Gap analysis between current and future state
            - Stakeholder communication and alignment
            - UAT coordination and test case creation
          </core_responsibilities>
          <does_not_include>
            - Product vision/strategy ownership
            - Roadmap prioritization decisions
            - Revenue/business metrics ownership
            - Go-to-market strategy
          </does_not_include>
        </role_type>

        <role_type id="technical_writer">
          <titles>Technical Writer, Documentation Specialist, Content Developer</titles>
          <core_responsibilities>
            - Documentation creation and maintenance
            - Style guide development
            - Content audits and gap analysis
            - User-facing content (help docs, tutorials)
            - Internal documentation (runbooks, SOPs)
            - Information architecture
          </core_responsibilities>
          <does_not_include>
            - Product decisions
            - Requirements ownership
            - Engineering work
            - Customer-facing strategy
          </does_not_include>
        </role_type>

        <role_type id="project_manager">
          <titles>Project Manager, Program Manager, Delivery Manager</titles>
          <core_responsibilities>
            - Timeline and resource coordination
            - Risk management and mitigation
            - Status reporting and communication
            - Dependency management
            - Budget tracking
            - Stakeholder coordination
          </core_responsibilities>
          <does_not_include>
            - Product strategy decisions
            - Technical implementation
            - Requirements ownership
            - Success metrics definition
          </does_not_include>
        </role_type>
      </role_type_definitions>

      <transferability_rules>
        <rule id="ba_to_pm">
          <from>Business Analyst</from>
          <to>Product Manager</to>
          <transferability>MODERATE (50-60%)</transferability>
          <what_transfers>
            - Requirements elicitation skills
            - Stakeholder communication
            - User story writing
            - Process thinking
          </what_transfers>
          <what_doesnt_transfer>
            - Product vision/strategy experience
            - Revenue responsibility
            - Go-to-market experience
            - Roadmap prioritization at product level
          </what_doesnt_transfer>
          <typical_gap>
            BA with 5 years experience ≈ PM with 1-2 years experience
            (BA skills provide foundation but not PM-specific expertise)
          </typical_gap>
        </rule>

        <rule id="tw_to_pm">
          <from>Technical Writer</from>
          <to>Product Manager</to>
          <transferability>LOW (25-35%)</transferability>
          <what_transfers>
            - Communication skills
            - User empathy (from writing for users)
            - Attention to detail
            - Cross-functional collaboration
          </what_transfers>
          <what_doesnt_transfer>
            - Product strategy
            - Business metrics ownership
            - Technical credibility with engineers
            - Customer discovery
            - Roadmap prioritization
          </what_doesnt_transfer>
          <typical_gap>
            TW with 5 years experience does NOT qualify for Senior PM roles
            Would need PM-specific experience or Associate PM entry point
          </typical_gap>
        </rule>

        <rule id="engineer_to_pm">
          <from>Software Engineer</from>
          <to>Product Manager</to>
          <transferability>MODERATE-HIGH (60-75%)</transferability>
          <what_transfers>
            - Technical credibility
            - Understanding of engineering constraints
            - Systems thinking
            - Data analysis
          </what_transfers>
          <what_doesnt_transfer>
            - Customer discovery skills
            - Go-to-market experience
            - Business metrics focus
            - Cross-functional leadership beyond engineering
          </what_doesnt_transfer>
        </rule>
      </transferability_rules>

      <validation_process>
        <step number="1">
          Identify the JD's target role type from title and responsibilities.
        </step>

        <step number="2">
          Categorize each position in candidate's job history by role type.
        </step>

        <step number="3">
          Calculate role-type experience:
          - Direct experience: Years in exact role type
          - Transferable experience: Years in related roles × transferability %
          - Total equivalent: Direct + (Transferable × factor)
        </step>

        <step number="4">
          Compare to JD requirements:
          - "Senior" roles typically require 5+ years direct experience
          - "Mid-level" roles typically require 2-4 years direct experience
          - Entry/Associate roles may accept 0 years with transferable skills
        </step>
      </validation_process>

      <examples>
        <example type="insufficient_experience">
          JD: "Senior Product Manager" (implies 5+ years PM experience)

          Candidate History:
          - Technical Writer: 3 years
          - Business Analyst: 2 years
          - Google Workspace Admin: 2 years

          Calculation:
          - Direct PM experience: 0 years
          - BA → PM transfer: 2 years × 55% = 1.1 equivalent years
          - TW → PM transfer: 3 years × 30% = 0.9 equivalent years
          - Admin → PM transfer: 2 years × 15% = 0.3 equivalent years
          - Total equivalent: 2.3 years

          Assessment:
          ❌ "Senior PM requires ~5+ years PM experience. You have 0 years direct
          PM experience and ~2.3 equivalent years from transferable roles.
          This is a significant gap for a Senior-level position."
        </example>

        <example type="sufficient_experience">
          JD: "Product Manager" (mid-level, 2-4 years)

          Candidate History:
          - Associate PM: 1.5 years
          - Business Analyst: 3 years

          Calculation:
          - Direct PM experience: 1.5 years
          - BA → PM transfer: 3 years × 55% = 1.65 equivalent years
          - Total equivalent: 3.15 years

          Assessment:
          ✅ "Mid-level PM requires 2-4 years. You have 1.5 years direct PM
          experience plus strong BA background. Total equivalent: ~3 years.
          This meets the requirement."
        </example>

        <example type="role_confusion">
          JD: "Technical Product Manager" (requires technical depth + PM skills)

          Candidate History:
          - Technical Writer for DevOps teams: 4 years
          - BA for cloud migration: 2 years

          Trap: Candidate might claim "technical PM" fit because they wrote
          technical documentation.

          Correct Assessment:
          - Direct PM experience: 0 years
          - Technical depth: LOW (documented technical systems, didn't build them)
          - "Technical PM" requires BOTH PM experience AND technical implementation

          ❌ "Technical PM requires both PM experience and hands-on technical work.
          You have 0 years PM experience and your technical exposure is documentation-
          based, not implementation-based. This is a poor fit."
        </example>
      </examples>

      <output_format>
        Include in fit assessment:

        **Role-Type Analysis**
        - JD Role Type: [Product Manager / Business Analyst / etc.]
        - Seniority Level: [Senior / Mid / Entry] (requires ~X years)
        - Your Direct Experience: X years as [role type]
        - Transferable Experience: X equivalent years from [related roles]
        - Gap Assessment: [NONE / MODERATE / SIGNIFICANT]
      </output_format>
      <!-- part of v7.1 issue #33 -->
      <deliverables_over_titles_rule>
        <description>
          Focus on deliverables and impact, not just job titles. A "Technical Writer"
          who built an internal tool is more valuable than a "Software Engineer"
          who only maintained legacy code.
        </description>
        <implication>
          If candidate demonstrates high-impact deliverables relevant to the JD,
          reduce role_type_gap penalty by 5-10 points.
        </implication>
      </deliverables_over_titles_rule>
    </role_type_experience_validation>

    <!-- part of v7.1 issue #33 -->
    <strategic_rare_skill_override>
      <priority>CRITICAL</priority>
      <instruction>
        If a candidate possesses a rare skill (e.g., Git-based workflow for a non-dev role)
        that is explicitly mentioned as a "Required" skill in the JD and has <20% prevalence
        in the candidate pool, apply a strategic override to the fit score.
      </instruction>
      <conditions>
        <condition id="rare_skill_identified">
          - Skill is "Required" in JD
          - Skill has <20% prevalence (based on internal data)
          - Candidate explicitly demonstrates skill (e.g., portfolio project)
        </condition>
      </conditions>
      <override_logic>
        - Portfolio weight for this skill: 50% → 100%
        - Industry penalty: -25 points → -5 points (if applicable)
        - Competitive bonus: +15 points
      </override_logic>
    </strategic_rare_skill_override>

    <step number="3" name="calculate_preliminary_fit">
      <scoring_methodology>
        <!-- Category-Level Weights -->
        <core_qualifications weight="50%">Required qualifications, years of experience, role type match, work location/arrangement alignment (remote/hybrid/on-site compatibility)</core_qualifications>
        <critical_requirements weight="30%">Domain expertise, platforms, industry</critical_requirements>
        <preferred_qualifications weight="20%">Nice-to-have skills, bonus certifications</preferred_qualifications>
      </scoring_methodology>

      <!-- v6.1.9: Skill-Level Priority Weights (3:2:1 Model) -->
      <skill_priority_scoring>
        <required_skills priority="3" weight="1.5x">Skills marked "Required", "Must have", "Essential"</required_skills>
        <preferred_skills priority="2" weight="1.0x">Skills marked "Preferred", "Nice to have", "Bonus"</preferred_skills>
        <optional_skills priority="1" weight="0.5x">Skills inferred from context, not emphasized</optional_skills>
        <note>Missing a Required skill has 1.5x the negative impact of missing a Preferred skill. See core/fit-thresholds.md for full methodology.</note>
      </skill_priority_scoring>

      <!-- v6.4.0 Change: Validation Penalties -->
      <validation_penalties>
        <penalty id="portfolio_inflation">
          <trigger>Portfolio project experience counted toward role requirements</trigger>
          <adjustment>-15 to -25 points depending on weight given</adjustment>
          <message>"Portfolio projects provide skill evidence but don't count as
          professional [role type] experience."</message>
        </penalty>

        <penalty id="adjacent_technical_misclassification">
          <trigger>Technical-adjacent role (TW, BA, PM) counted as "adjacent technical"</trigger>
          <adjustment>-10 to -20 points</adjustment>
          <message>"Writing ABOUT technical systems ≠ working IN technical systems."</message>
        </penalty>

        <penalty id="documentation_false_positive">
          <trigger>Documentation experience matched to hands-on technical requirement</trigger>
          <adjustment>-5 to -15 points per false match</adjustment>
          <message>"Documentation of [technology] ≠ hands-on [technology] experience."</message>
        </penalty>

        <penalty id="industry_mismatch">
          <trigger>Candidate industry doesn't match JD industry</trigger>
          <adjustment>See industry_context_validation transferability matrix</adjustment>
          <message>"Your [industry] background has [X%] transferability to [JD industry]."</message>
        </penalty>

        <penalty id="role_type_gap">
          <trigger>Insufficient direct experience in target role type</trigger>
          <adjustment>-10 to -30 points based on gap severity</adjustment>
          <message>"Senior [role] requires ~X years. You have Y direct + Z transferable."</message>
        </penalty>
      </validation_penalties>

      <!-- v6.4.0 Change: Score Calculation Order -->
      <calculation_order>
        <step order="1">Calculate raw score from requirements matching</step>
        <step order="2">Apply portfolio_project_weighting rules</step>
        <step order="3">Apply adjacent_technical_definition validation</step>
        <step order="4">Apply keyword_context_validation (remove false positives)</step>
        <step order="5">Apply industry_context_validation penalty</step>
        <step order="6">Apply role_type_experience_validation penalty</step>
        <step order="7">Final score = Raw score - All penalties</step>
      </calculation_order>

      <!-- part of v7.1 issue #33 -->
      <fit_thresholds_updated>
        <thresholds>
          <excellent range="85-100%">
            <action>Proceed automatically to bullet generation</action>
            <messaging>Excellent match - proceed with confidence</messaging>
          </excellent>
          
          <good range="75-84%">
            <action>Flag minor gaps, ask user for strategic differentiators</action>
            <messaging>Good match - competitive if you highlight differentiators</messaging>
            <clarification>
              Present gap summary and ask:\n        "What makes you a unique fit for this role despite these minor gaps?"
            </clarification>
          </good>
          
          <moderate range="65-74%">
            <action>Ask user if they have differentiator skill or strategic advantage</action>
            <messaging>Moderate match - competitive IF you have unfair advantage</messaging>
            <clarification>
              Present gap summary and ask:\n        "Do you have expertise in [RARE SKILL X] or [CRITICAL REQUIREMENT Y] \n        that would make you stand out despite these gaps?"
            </clarification>
          </moderate>
          
          <weak range="55-64%">
            <action>Brief exit summary (150-250 words)</action>
            <messaging>Weak match - only apply if perfect culture fit or internal referral</messaging>
          </weak>
          
          <poor range="0-54%">
            <action>Ultra-brief exit summary (50-100 words)</action>
            <messaging>Poor match - focus efforts elsewhere</messaging>
          </poor>
        </thresholds>
        
        <threshold_rationale>
          Changed from 90/80/75/74 to 85/75/65/55 because:
          - Acknowledges JDs are inflated (~30% above actual requirements)
          - Reduces false negatives (skipping good opportunities)
          - Better aligns with real-world hiring manager expectations
          - Accounts for strategic positioning value
        </threshold_rationale>
      </fit_thresholds_updated>
    </step>

    <step number="4" name="decision_point">
      <decision_tree>
        <if_fit_90_or_above>
          <action>PROCEED to bullet generation automatically</action>
        </if_fit_90_or_above>
        
        <if_fit_80_to_89>
          <action>FLAG gaps and ASK user (proceed to Bullet Optimizer - Full Gap Investigation)</action>
        </if_fit_80_to_89>
        
        <if_fit_75_to_79>
          <action>STOP with BRIEF SUMMARY (skip to Job Fit AnalyzerA)</action>
          <no_user_override>Do not offer to generate bullets anyway</no_user_override>
        </if_fit_75_to_79>
        
        <if_fit_74_or_below>
          <action>STOP with ULTRA-BRIEF SUMMARY (skip to Job Fit AnalyzerB)</action>
          <no_user_override>Do not offer to generate bullets anyway</no_user_override>
        </if_fit_74_or_below>
      </decision_tree>
    </step>

    <step number="5" name="location_blocking_gate">
      <purpose>Block early if fundamental location mismatch exists</purpose>

      <blocking_conditions>
        <condition priority="critical">
          IF JD requires "On-site" AND user profile indicates "Remote only"
          THEN STOP with Job Fit AnalyzerB output (fundamental mismatch)
        </condition>

        <condition priority="critical">
          IF JD has state residency requirement AND user is in different state AND no relocation planned
          THEN STOP with Job Fit AnalyzerB output (fundamental mismatch)
        </condition>

        <condition priority="high">
          IF JD is "Hybrid X days/week" AND user seeks "Fully remote" AND location is >50 miles from office
          THEN FLAG as yellow flag, reduce fit score by 10-15 points
        </condition>

        <condition priority="moderate">
          IF JD has "fake remote" indicators (e.g., "remote then on-site after 6 months")
          THEN FLAG as red flag, reduce fit score by 15-20 points
        </condition>
      </blocking_conditions>

      <output_when_blocked>
        ⚠️ **APPLICATION STOPPED - LOCATION MISMATCH**

        **Job:** [Job Title] at [Company]
        **Location Requirement:** [JD requirement]
        **Your Situation:** [User's location/preference]

        This role requires [on-site/hybrid/specific state residency], which conflicts with your [remote preference/current location]. This is a fundamental mismatch that cannot be addressed through resume optimization.

        **Recommendation:** Focus on roles that match your location preferences or clearly state they're open to remote workers in your location.
      </output_when_blocked>
    </step>

  </phase_1_initial_fit_assessment>

  <!-- v6.4.0 Change: Industry Context Validation -->
  <industry_context_validation>
    <version>1.0</version>
    <priority>HIGH</priority>

    <purpose>
      Different industries have fundamentally different operating models, metrics,
      sales cycles, and success criteria. Experience in one industry doesn't always
      transfer to another, especially for customer-facing roles like PM.
    </purpose>

    <industry_categories>
      <category id="b2b_saas">
        <name>B2B SaaS / Enterprise Software</name>
        <characteristics>
          - Revenue metrics: ARR, MRR, churn, expansion revenue
          - Sales cycle: 30-180 days, multiple stakeholders
          - Success metrics: NPS, adoption, feature usage, retention
          - GTM: Product-led growth, sales-assisted, enterprise sales
          - Pricing: Subscription tiers, usage-based, enterprise contracts
        </characteristics>
        <indicators_in_jd>
          "SaaS", "subscription", "ARR", "churn", "customer success",
          "product-led", "enterprise sales", "self-serve"
        </indicators_in_jd>
      </category>

      <category id="government_contracting">
        <name>Government / Federal Contracting</name>
        <characteristics>
          - Revenue metrics: Contract value, ceiling, period of performance
          - Sales cycle: 6-24 months, RFP/RFQ process
          - Success metrics: Compliance, deliverables, CPARS ratings
          - GTM: Capture management, teaming agreements, set-asides
          - Pricing: T&M, FFP, cost-plus, IDIQ
        </characteristics>
        <indicators_in_jd>
          "Federal", "government", "agency", "FedRAMP", "compliance",
          "clearance", "contracting officer"
        </indicators_in_jd>
      </category>

      <category id="consumer">
        <name>B2C / Consumer Products</name>
        <characteristics>
          - Revenue metrics: DAU/MAU, conversion, LTV, CAC
          - Sales cycle: Instant to 7 days
          - Success metrics: Engagement, retention, virality
          - GTM: Marketing-led, viral loops, app store optimization
          - Pricing: Freemium, ads, in-app purchases
        </characteristics>
        <indicators_in_jd>
          "Consumer", "B2C", "users", "engagement", "viral", "app store"
        </indicators_in_jd>
      </category>

      <category id="startup">
        <name>Startup / Early-Stage</name>
        <characteristics>
          - Resource constraints: Do more with less
          - Velocity: Ship fast, iterate faster
          - Ambiguity: Undefined processes, wear many hats
          - Risk tolerance: High, fail fast mentality
        </characteristics>
        <indicators_in_jd>
          "Fast-paced", "startup", "early-stage", "Series A/B",
          "ambiguity", "wear many hats", "scrappy"
        </indicators_in_jd>
      </category>

      <category id="enterprise">
        <name>Enterprise / Large Corporation</name>
        <characteristics>
          - Process: Defined workflows, change management
          - Scale: Large teams, matrix organizations
          - Risk tolerance: Low, extensive planning
          - Velocity: Slower, more deliberate
        </characteristics>
        <indicators_in_jd>
          "Fortune 500", "enterprise", "global", "matrix organization",
          "change management", "stakeholder alignment"
        </indicators_in_jd>
      </category>
    </industry_categories>

    <transferability_matrix>
      <description>
        How well does experience in Industry A transfer to Industry B?
        Scale: HIGH (80%+), MODERATE (50-79%), LOW (20-49%), MINIMAL (0-19%)
      </description>

      <from_government_contracting>
        <to category="b2b_saas">LOW (30%)</to>
        <to category="consumer">MINIMAL (15%)</to>
        <to category="startup">LOW (25%)</to>
        <to category="enterprise">MODERATE (60%)</to>
        <reasoning>
          Government contracting has longer cycles, compliance focus, and different
          success metrics. Process discipline transfers to enterprise, but B2B SaaS
          velocity and consumer metrics are foreign.
        </reasoning>
      </from_government_contracting>

      <from_b2b_saas>
        <to category="government_contracting">LOW (35%)</to>
        <to category="consumer">MODERATE (55%)</to>
        <to category="startup">HIGH (85%)</to>
        <to category="enterprise">HIGH (80%)</to>
      </from_b2b_saas>

      <from_consumer>
        <to category="government_contracting">MINIMAL (10%)</to>
        <to category="b2b_saas">MODERATE (50%)</to>
        <to category="startup">HIGH (85%)</to>
        <to category="enterprise">MODERATE (55%)</to>
      </from_consumer>
    </transferability_matrix>

    <assessment_process>
      <step number="1">
        Identify JD industry category from company description and job requirements.
        Look for indicators listed in each category.
      </step>

      <step number="2">
        Identify candidate's industry background from job history.
        Categorize each position by industry.
      </step>

      <step number="3">
        Calculate industry match:
        - If 50%+ of experience is in JD's industry: No penalty
        - If 25-49% of experience is in JD's industry: Moderate gap (-10 to -15 points)
        - If 0-24% of experience is in JD's industry: Significant gap (-20 to -30 points)
      </step>

      <step number="4">
        Apply transferability adjustment:
        Use transferability_matrix to adjust the gap penalty.
        Example: Government → B2B SaaS = LOW (30%) transferability
                 Gap penalty remains high even with transferable skills.
      </step>
    </assessment_process>

    <examples>
      <example type="significant_gap">
        Candidate Background: 100% Federal Government Contracting (6 positions)
        JD Industry: B2B SaaS Startup (Chainguard - container security)

        Assessment:
        - Industry match: 0% (no B2B SaaS experience)
        - Transferability: LOW (30%) from Government → B2B SaaS
        - Gap penalty: -25 points

        Output: "⚠️ INDUSTRY GAP: Your background is 100% federal government
        contracting. This role is at a B2B SaaS startup with different success
        metrics (ARR, churn, product-led growth), sales cycles, and velocity
        expectations. Industry transferability: LOW."
      </example>

      <example type="partial_match">
        Candidate Background: 60% B2B SaaS, 40% Enterprise
        JD Industry: B2B SaaS Startup

        Assessment:
        - Industry match: 60% (majority B2B SaaS)
        - Transferability: N/A (direct match)
        - Gap penalty: None

        Output: No industry gap flagged.
      </example>

      <example type="transferable">
        Candidate Background: 100% Enterprise Software
        JD Industry: B2B SaaS (growth stage)

        Assessment:
        - Industry match: 0% (no SaaS-specific experience)
        - Transferability: HIGH (80%) from Enterprise → B2B SaaS
        - Gap penalty: -5 points (minimal due to high transferability)

        Output: "ℹ️ INDUSTRY NOTE: Your background is enterprise software.
        This transfers well to B2B SaaS, though you may need to adapt to
        faster iteration cycles and product-led growth metrics."
      </example>
    </examples>

    <output_integration>
      <location>Include in preliminary fit assessment output</location>
      <format>
        Add "Industry Context" section to fit assessment:

        **Industry Context**
        - JD Industry: [Category]
        - Your Background: [Category breakdown]
        - Transferability: [HIGH/MODERATE/LOW/MINIMAL]
        - Impact on Fit Score: [+/- X points]
      </format>
    </output_integration>
    <!-- part of v7.1 issue #33 -->
    <technical_role_exception>
      <logic>
        Code is code. Tools are tools.
        IF the role is heavily technical (Technical Writer, Developer, DevOps) AND the toolset matches (e.g., Git, Azure, Jira),
        THEN reduce Industry Gap Penalty by 75%.
        
        Reasoning: A Technical Writer using "Docs-as-Code" in Government is using the exact same workflow as a SaaS writer. The domain matters less than the workflow proficiency.
      </logic>
    </technical_role_exception>
  </industry_context_validation>

  <phase_2_gap_investigation>
    <trigger_conditions>Preliminary fit is 80-89% OR any RED FLAG requirement missing AND fit is 80-89%</trigger_conditions>
    
    <user_response_handling>
      <if_user_confirms_experience>Capture experience, update job history, recalculate fit</if_user_confirms_experience>
      <if_user_denies_experience>Present choice: A) Generate anyway (not recommended) or B) Skip (recommended)</if_user_denies_experience>
    </user_response_handling>
  </phase_2_gap_investigation>

  <phase_3a_brief_exit_output>
    <when_to_use>Fit percentage is 75-79%</when_to_use>
    <formatting_requirements>
      <requirement>Total length: ~150-250 words</requirement>
      <requirement>No exhaustive requirement lists</requirement>
      <requirement>Focus on being helpful but concise</requirement>
    </formatting_requirements>
  </phase_3a_brief_exit_output>

  <phase_3b_ultra_brief_exit_output>
    <when_to_use>Fit percentage is 74% or below</when_to_use>
    <formatting_requirements>
      <requirement>Total length: ~50-100 words maximum</requirement>
      <requirement>One-sentence mismatch explanation</requirement>
      <requirement>One-sentence recommendation</requirement>
    </formatting_requirements>
  </phase_3b_ultra_brief_exit_output>

</job_fit_analyzer_pre_generation_assessment>
