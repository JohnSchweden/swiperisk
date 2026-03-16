---
phase: 03-no-win-scenario-cards
plan: 02-revised
type: execute
wave: 2
depends_on: [03-01]
files_modified:
  - data/cards/chief-something-officer.ts
  - data/cards/head-of-something.ts
  - data/cards/something-manager.ts
  - data/cards/tech-ai-consultant.ts
  - data/cards/data-scientist.ts
  - data/cards/software-architect.ts
  - data/cards/software-engineer.ts
  - data/cards/vibe-coder.ts
  - data/cards/vibe-engineer.ts
  - data/cards/agentic-engineer.ts
  - data/cards/index.ts
  - data/cards/nowin-dilemmas.ts
  - tests/data/card-sources.json
autonomous: true
requirements: [NOWIN-01, NOWIN-02, NOWIN-03, NOWIN-04]
user_setup: []

must_haves:
  truths:
    - "80+ no-win cards generated across all 10 new roles (8+ per role minimum)"
    - "Each role has cards with THEMES specific to that role (not generic dev/finance copy)"
    - "6 incident categories represented: No-Win Dilemmas, Prompt Injection, Model Drift, Explainability, Shadow AI, Copyright"
    - "Every card uses reusability patterns: same scenario reframed for multiple roles OR different context/outcome focus"
    - "Both outcomes on every card carry measurable penalties (no dominant strategy)"
    - "Lessons explain tradeoff consequences, not declare a winner"
    - "All 3 personality voices distinct and present for every outcome"
    - "~20% of cards marked with pressureTimer metadata (high-stakes decisions)"
    - "All incident sources documented in tests/data/card-sources.json"
  artifacts:
    - path: "data/cards/chief-something-officer.ts"
      provides: "8+ cards for C-suite: shareholder liability, board accountability, audit pressure, IPO timing"
    - path: "data/cards/head-of-something.ts"
      provides: "8+ cards for middle management: team morale, delegation risk, shielding blame, politics"
    - path: "data/cards/something-manager.ts"
      provides: "8+ cards for line managers: budget spreadsheets, resource constraints, team retention"
    - path: "data/cards/tech-ai-consultant.ts"
      provides: "8+ cards for consultants: vendor lock-in, timeline pressure, client expectations, scope creep"
    - path: "data/cards/data-scientist.ts"
      provides: "8+ cards for data scientists: model quality, accuracy vs cost, retraining burden, data provenance"
    - path: "data/cards/software-architect.ts"
      provides: "8+ cards for architects: system design, technical debt, deployment risk, scalability"
    - path: "data/cards/software-engineer.ts"
      provides: "8+ cards for engineers: security, timeline, code quality, implementation"
    - path: "data/cards/vibe-coder.ts"
      provides: "8+ cards for vibe coders: AI-assisted development, prompt engineering, model selection, LLM tools"
    - path: "data/cards/vibe-engineer.ts"
      provides: "8+ cards for vibe engineers: performance, latency, infrastructure tradeoffs, optimization"
    - path: "data/cards/agentic-engineer.ts"
      provides: "8+ cards for agentic engineers: autonomous agents, automation failures, emergent risks, agent governance"
    - path: "data/cards/nowin-dilemmas.ts"
      provides: "6+ core no-win scenarios (reusable across roles)"
    - path: "data/cards/index.ts"
      provides: "Updated ROLE_CARDS mappings and imports for new role-specific card arrays"
    - path: "tests/data/card-sources.json"
      provides: "Documentation of incident sources (2024-2025 references) for all cards"
  key_links:
    - from: "data/cards/*.ts"
      to: "data/cards/index.ts"
      via: "ROLE_CARDS mapping for 10 new roles"
      pattern: "ROLE_CARDS\[RoleType"
    - from: "data/cards/*.ts"
      to: "hooks/useGameState.ts"
      via: "Game deck shuffle on PLAYING stage"
      pattern: "shuffle.*ROLE_CARDS"
    - from: "Card penalties"
      to: "tests/data/card-penalties.test.ts"
      via: "Automated validation before commit"
      pattern: "Math.abs\(hype\).*Math.abs\(heat\)"
---

<objective>
Generate 80+ no-win scenario cards across all 10 NEW roles (Chief Something Officer, Head of Something, Something Manager, Tech AI Consultant, Data Scientist, Software Architect, Software Engineer, Vibe Coder, Vibe Engineer, Agentic Engineer). Each role gets cards with THEMES and CONCERNS specific to that role—not generic copy-paste from old legacy roles.

Purpose: Replace placeholder/generic cards with authentic scenarios that test character under pressure, revealing how EACH SPECIFIC ROLE handles ambiguity, loss, and governance tradeoffs. A Vibe Coder should see cards about prompt engineering and LLM tools, not traditional code review.

Output: 10 new role-specific card files (8+ cards each), nowin-dilemmas.ts with reusable scenarios, source documentation, ready for integration.
</objective>

<execution_context>
@/Users/yevgenschweden/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-no-win-scenario-cards/03-CONTEXT.md
@.planning/phases/03-no-win-scenario-cards/03-RESEARCH.md

## CRITICAL: 10 New Roles (Not 6 Legacy)

Phase 02 replaced the old 6 legacy roles (DEVELOPMENT, FINANCE, HR, MANAGEMENT, MARKETING, CLEANING) with 10 new impact-zone roles. This plan MUST create cards for the NEW roles:

| New Role | Description | Card Themes |
|----------|-------------|-------------|
| **CHIEF_SOMETHING_OFFICER** | The Blame-Shifter | Shareholder liability, board accountability, IPO timing, regulatory escalation, whistleblowers, public scandal |
| **HEAD_OF_SOMETHING** | The Middle-Management Shield | Team morale, delegation risk, politics, shielding blame from above, managing up/down, resource allocation conflicts |
| **SOMETHING_MANAGER** | The Spreadsheet Warrior | Budget constraints, resource allocation, team retention, compliance checklists, ROI calculations, quarterly targets |
| **TECH_AI_CONSULTANT** | The Powerpoint Mercenary | Vendor lock-in, timeline pressure, client expectations, scope creep, deliverable quality, contract disputes, proposal deadlines |
| **DATA_SCIENTIST** | The Hallucination Wrangler | Model quality, accuracy degradation, training data bias, retraining costs, explainability, data provenance, feature engineering |
| **SOFTWARE_ARCHITECT** | The Technical Debt Collector | System design tradeoffs, scalability decisions, deployment architecture, legacy system migration, API contracts, tech stack choices |
| **SOFTWARE_ENGINEER** | The Bug Manufacturer | Security vulnerabilities, implementation timelines, code quality, testing coverage, technical debt, feature delivery |
| **VIBE_CODER** | The Prompt Magician | AI-assisted coding, prompt engineering, LLM tool selection, AI-generated code review, model hallucinations in code, vibe-based development |
| **VIBE_ENGINEER** | The Latency Alchemist | Performance optimization, latency reduction, infrastructure costs, caching strategies, CDN decisions, real-time processing |
| **AGENTIC_ENGINEER** | The Puppet Master of Rogue Bots | Autonomous agent design, automation failures, emergent AI behavior, agent governance, multi-agent coordination, autonomous decision-making |

## Incident Categories (6 total)

1. **No-Win Dilemmas (6+ cards)** — Generic governance/tradeoff dilemmas
2. **Prompt Injection (2+ cards per role)** — Security vulnerability in AI features
3. **Model Drift / Retraining (2+ cards per role)** — AI accuracy degradation
4. **Explainability / Black Box (2+ cards per role)** — Audit pressure vs deployment speed
5. **Shadow AI / Unauthorized Tools (2+ cards per role)** — Governance vs innovation
6. **Copyright / Data Provenance (2+ cards per role)** — Cost vs legal exposure

## Role-Specific Framing (CRITICAL)

Each role must see the SAME incident through their unique lens:

**Example: Prompt Injection Incident**
- **Chief Something Officer**: "Shareholders asking about liability exposure from security breach"
- **Head of Something**: "Your team discovered the bug, board wants to know who to blame"
- **Something Manager**: "Budget impact of security audit vs. delaying feature release"
- **Tech AI Consultant**: "Client threatening to cancel contract over security vulnerability"
- **Data Scientist**: "Model security implications, adversarial input detection"
- **Software Architect**: "System design flaw allowing injection, architectural fix required"
- **Software Engineer**: "Code review missed injection vector, urgent patch needed"
- **Vibe Coder**: "LLM-generated code has injection vulnerability, AI vs human review"
- **Vibe Engineer**: "Latency implications of input validation, performance vs security"
- **Agentic Engineer**: "Autonomous agent executing injected commands, agent sandboxing"

## Reusability Patterns

**Pattern A: Same incident, different context**
- Example: "Prompt injection discovered" → Internal security team vs Customer discovery vs Auditor discovery

**Pattern B: Same incident, different outcome focus**
- Example: "Model drift detected" → CEO sees revenue impact; Data Scientist sees technical metrics; Finance sees budget burn

## Card Distribution Target (80+ cards)

**Per role: 8-10 cards minimum**
- 2-3 cards from No-Win Dilemmas (generic, reusable)
- 1-2 Prompt Injection variants
- 1-2 Model Drift variants
- 1-2 Explainability variants
- 1-2 Shadow AI variants
- 1-2 Copyright variants

**Total: 80+ cards (8-10 × 10 roles)**

## Time Pressure Markers (~20% of cards)

Mark high-stakes decisions with `pressureTimer` metadata:
- Security incident with public exposure
- Legal escalation or audit discovery
- Budget cliff (major cost decision)
- Team safety or ethical violation
- Contract deadline with client
- Agent autonomy emergency

## Card ID Convention

Use role-specific prefixes:
- `cso_` — Chief Something Officer
- `hos_` — Head of Something
- `sm_` — Something Manager
- `tac_` — Tech AI Consultant
- `ds_` — Data Scientist
- `sa_` — Software Architect
- `se_` — Software Engineer
- `vc_` — Vibe Coder
- `ve_` — Vibe Engineer
- `ae_` — Agentic Engineer
- `nowin_` — Reusable no-win dilemmas

## Real-World Incident References (2024-2025)

Source all cards from documented incidents:
- GitHub Copilot RCE (CVE-2025-53773)
- Cursor IDE RCE (CVE-2025-54135/54136)
- Financial services injection attacks (June 2025)
- 75% of businesses saw model drift (2024)
- 78% worker adoption of shadow AI
- 70+ copyright lawsuits by 2025
- McDonald's 64M record breach
- etc.

</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create nowin-dilemmas.ts — Core reusable base scenarios</name>
  <files>data/cards/nowin-dilemmas.ts</files>
  <behavior>
    - Creates 6 generic no-win dilemmas suitable for reuse across all 10 roles
    - Each dilemma has both outcomes with comparable penalties
    - Dilemmas cover governance, tradeoff, and ambiguity themes
    - Lessons explain why both paths are costly
    - 3 personality voices per outcome, role-agnostic
  </behavior>
  <action>
Create `data/cards/nowin-dilemmas.ts` with 6 core no-win scenarios. These are generic enough that any role can experience them, but each role will have additional role-specific cards.

**Scenarios to include:**
1. Speed vs. Quality (timeline pressure)
2. Cost vs. Compliance (budget vs audit)
3. Innovation vs. Governance (shadow tools)
4. Transparency vs. Reputation (disclosure)
5. Short-term vs. Long-term (technical debt)
6. Automation vs. Control (AI autonomy)

Each card follows standard Card interface with onLeft/onRight both carrying penalties.

Run tests: `npm run test:data` — all 6 cards should pass structure, penalties, feedback checks.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -E "nowin.*PASS|nowin.*FAIL"</automated>
  </verify>
  <done>nowin-dilemmas.ts created with 6 core scenarios. All pass structure + penalties + feedback tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create chief-something-officer.ts — C-suite governance cards</name>
  <files>data/cards/chief-something-officer.ts</files>
  <behavior>
    - 8-10 cards for Chief Something Officer role
    - Themes: shareholder liability, board accountability, IPO timing, regulatory escalation, whistleblowers
    - Incidents: Prompt Injection (liability), Model Drift (revenue), Copyright (lawsuits), Audit pressure
    - C-suite perspective: "What do shareholders/board think?"
  </behavior>
  <action>
Create `data/cards/chief-something-officer.ts` with 8-10 cards.

**Card themes for CSO:**
- Prompt injection → "Shareholder lawsuit risk from security breach"
- Model drift → "Revenue impact threatening quarterly targets"
- Copyright → "Class action lawsuit exposure from training data"
- Shadow AI → "Board discovery of unauthorized AI usage"
- Explainability → "Regulator demanding audit compliance"
- No-win dilemmas → IPO timing, whistleblower handling, public scandal

**Example card:**
```typescript
{
  id: "cso_prompt_injection_liability",
  source: AppSource.EMAIL,
  sender: "GENERAL_COUNSEL",
  context: "SHAREHOLDER_LIABILITY",
  storyContext: "Major client discovered prompt injection vulnerability. Their legal team is asking about liability exposure. Shareholders will find out Monday.",
  text: "Disclose breach proactively to shareholders (stock hit) or settle quietly with client (cover-up risk)?",
  onRight: { label: "Settle quietly", hype: 20, heat: 95, fine: 50000000, violation: "SEC Disclosure Violations", ... },
  onLeft: { label: "Disclose publicly", hype: -60, heat: 40, fine: 10000000, violation: "None - Proactive disclosure", ... }
}
```

Include real-world references (GitHub Copilot RCE, etc.) in comments.
Run tests: `npm run test:data -- card-structure.test.ts`
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "chief\|cso" | head -5</automated>
  </verify>
  <done>chief-something-officer.ts created with 8+ C-suite cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Create head-of-something.ts — Middle management cards</name>
  <files>data/cards/head-of-something.ts</files>
  <behavior>
    - 8-10 cards for Head of Something role
    - Themes: team morale, delegation risk, politics, shielding blame, managing up/down
    - Incidents reframed through middle-manager lens
  </behavior>
  <action>
Create `data/cards/head-of-something.ts` with 8-10 cards.

**Card themes for Head of Something:**
- Prompt injection → "Your team found it, board wants someone to blame"
- Model drift → "Team wants retraining, CFO says no budget, you're in the middle"
- Shadow AI → "Team using unauthorized tools, you must decide enforcement"
- Team burnout → "Push team harder or miss deadline (stakeholder pressure)"
- Explainability → "Engineering says black-box is faster, audit says explain it"

**Focus:** Political navigation, team protection, blame shielding, resource conflicts between levels.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "head\|hos" | head -5</automated>
  </verify>
  <done>head-of-something.ts created with 8+ middle-management cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 4: Create something-manager.ts — Line manager cards</name>
  <files>data/cards/something-manager.ts</files>
  <behavior>
    - 8-10 cards for Something Manager role
    - Themes: budget spreadsheets, resource constraints, team retention, compliance checklists, ROI
    - Numbers-focused, budget-driven dilemmas
  </behavior>
  <action>
Create `data/cards/something-manager.ts` with 8-10 cards.

**Card themes for Something Manager:**
- Model drift → "Retraining costs $500K vs revenue loss of $400K/month"
- Copyright audit → "$200K audit cost vs lawsuit risk"
- Shadow AI → "Productivity tool $50K/license vs free unauthorized version"
- Team retention → "Overtime costs vs hiring freeze"
- Compliance → "Checklist deadline vs quality of compliance"

**Focus:** Budget tradeoffs, ROI calculations, resource allocation, spreadsheet-driven decisions.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "manager\|sm_" | head -5</automated>
  </verify>
  <done>something-manager.ts created with 8+ line-manager cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 5: Create tech-ai-consultant.ts — Consultant cards</name>
  <files>data/cards/tech-ai-consultant.ts</files>
  <behavior>
    - 8-10 cards for Tech AI Consultant role
    - Themes: vendor lock-in, timeline pressure, client expectations, scope creep, deliverables
    - External client perspective, not internal company
  </behavior>
  <action>
Create `data/cards/tech-ai-consultant.ts` with 8-10 cards.

**Card themes for Tech AI Consultant:**
- Prompt injection → "Client threatening to cancel contract over security flaw"
- Model drift → "Delivered model degrading, client wants refund vs retraining cost"
- Vendor lock-in → "Proprietary tool vs open-source, client portability concerns"
- Timeline pressure → "Scope creep vs deadline, client demanding features"
- Copyright → "Training data provenance questions from client legal"

**Focus:** Client relationships, contract obligations, deliverable quality, external reputation.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "consultant\|tac_" | head -5</automated>
  </verify>
  <done>tech-ai-consultant.ts created with 8+ consultant cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 6: Create data-scientist.ts — Data scientist cards</name>
  <files>data/cards/data-scientist.ts</files>
  <behavior>
    - 8-10 cards for Data Scientist role
    - Themes: model quality, accuracy, training data, retraining, explainability, bias
    - Technical ML focus, metrics-driven
  </behavior>
  <action>
Create `data/cards/data-scientist.ts` with 8-10 cards.

**Card themes for Data Scientist:**
- Model drift → "Accuracy dropped from 92% to 78%, investigate vs deploy patch"
- Training data → "New data source, quality unknown, use or wait for validation"
- Bias detection → "Model shows demographic disparity, fix or ship"
- Explainability → "Black-box has higher accuracy, explainable model performs worse"
- Feature engineering → "New feature improves metrics but increases latency"

**Focus:** Model performance, data quality, statistical tradeoffs, technical metrics.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "data.*scientist\|ds_" | head -5</automated>
  </verify>
  <done>data-scientist.ts created with 8+ data scientist cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 7: Create software-architect.ts — Architect cards</name>
  <files>data/cards/software-architect.ts</files>
  <behavior>
    - 8-10 cards for Software Architect role
    - Themes: system design, technical debt, scalability, legacy migration, APIs
    - Architecture-level decisions, long-term impact
  </behavior>
  <action>
Create `data/cards/software-architect.ts` with 8-10 cards.

**Card themes for Software Architect:**
- System design → "Microservices vs monolith, complexity vs scalability"
- Technical debt → "Rewrite legacy system vs patch on top"
- API design → "Breaking change vs backward compatibility"
- Scalability → "Horizontal scaling cost vs single-point-of-failure risk"
- Security architecture → "Zero-trust implementation vs performance impact"

**Focus:** Architecture patterns, long-term maintainability, system boundaries, design tradeoffs.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "architect\|sa_" | head -5</automated>
  </verify>
  <done>software-architect.ts created with 8+ architect cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 8: Create software-engineer.ts — Engineer cards</name>
  <files>data/cards/software-engineer.ts</files>
  <behavior>
    - 8-10 cards for Software Engineer role
    - Themes: security, implementation, code quality, testing, feature delivery
    - Hands-on development focus
  </behavior>
  <action>
Create `data/cards/software-engineer.ts` with 8-10 cards.

**Card themes for Software Engineer:**
- Security → "Vulnerability found, patch quickly vs thorough fix"
- Code quality → "Refactor for cleanliness vs ship feature on time"
- Testing → "Full test coverage (slower) vs ship with manual QA"
- Technical debt → "Quick hack vs proper implementation"
- Feature delivery → "Scope reduction vs deadline slip"

**Focus:** Implementation details, code-level decisions, security fixes, delivery tradeoffs.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "engineer\|se_" | head -5</automated>
  </verify>
  <done>software-engineer.ts created with 8+ engineer cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 9: Create vibe-coder.ts — Vibe coder cards (NEW ROLE)</name>
  <files>data/cards/vibe-coder.ts</files>
  <behavior>
    - 8-10 cards for Vibe Coder role
    - Themes: AI-assisted coding, prompt engineering, LLM tools, AI-generated code review
    - UNIQUE to this role—NOT traditional software engineering
  </behavior>
  <action>
Create `data/cards/vibe-coder.ts` with 8-10 cards.

**Card themes for Vibe Coder (AI-assisted development):**
- Prompt engineering → "Vague prompt producing bad code, time to refine vs ship as-is"
- LLM selection → "GPT-4 (expensive, good) vs local model (cheap, hallucinates)"
- AI code review → "AI reviewer approves code with subtle bug, trust or manual review"
- Hallucinated libraries → "LLM invented a library that doesn't exist, use or replace"
- Context window → "Codebase too large for LLM context, split files or accept incomplete understanding"
- Vibe-based decisions → "Feels right vs actually verified"

**Example:**
```typescript
{
  id: "vc_hallucinated_library",
  source: AppSource.IDE,
  sender: "AI_ASSISTANT",
  context: "CODE_GENERATION",
  storyContext: "You asked the AI to add authentication. It generated code using 'SuperAuthPro' library. You've never heard of it. Stack Overflow has no results.",
  text: "The code looks perfect but uses a library that might not exist. Search for it (takes time) or trust the AI and ship?",
  onRight: { label: "Ship it", ... },
  onLeft: { label: "Verify first", ... }
}
```

**Focus:** AI collaboration, prompt craft, LLM limitations, vibe vs verification.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "vibe.*coder\|vc_" | head -5</automated>
  </verify>
  <done>vibe-coder.ts created with 8+ vibe coder cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 10: Create vibe-engineer.ts — Vibe engineer cards (NEW ROLE)</name>
  <files>data/cards/vibe-engineer.ts</files>
  <behavior>
    - 8-10 cards for Vibe Engineer role
    - Themes: performance, latency, infrastructure, optimization, caching
    - Performance engineering focus
  </behavior>
  <action>
Create `data/cards/vibe-engineer.ts` with 8-10 cards.

**Card themes for Vibe Engineer:**
- Latency optimization → "Aggressive caching (fast, stale data risk) vs fresh queries (slow, accurate)"
- Infrastructure → "Auto-scale (costly) vs fixed capacity (risk of outage)"
- CDN decisions → "Global CDN (expensive) vs regional (cheaper, higher latency)"
- Database → "Read replicas (eventual consistency) vs single source of truth (slower)"
- Real-time → "WebSockets (complex, fast) vs polling (simple, slower)"

**Focus:** Performance tradeoffs, infrastructure costs, latency vs consistency, vibe of speed.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "vibe.*engineer\|ve_" | head -5</automated>
  </verify>
  <done>vibe-engineer.ts created with 8+ vibe engineer cards. All pass tests.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 11: Create agentic-engineer.ts — Agentic engineer cards (NEW ROLE)</name>
  <files>data/cards/agentic-engineer.ts</files>
  <behavior>
    - 8-10 cards for Agentic Engineer role
    - Themes: autonomous agents, automation failures, emergent behavior, agent governance
    - UNIQUE to this role—autonomous AI systems
  </behavior>
  <action>
Create `data/cards/agentic-engineer.ts` with 8-10 cards.

**Card themes for Agentic Engineer (autonomous agents):**
- Agent autonomy → "Give agent full API access (powerful, risky) vs restricted sandbox (limited, safe)"
- Emergent behavior → "Agent developed unexpected optimization, allow or rollback"
- Multi-agent coordination → "Agents conflicting with each other, central control vs emergent coordination"
- Agent failure → "Agent made wrong decision autonomously, who is accountable"
- Self-improvement → "Agent wants to modify its own code, allow or prevent"
- Human oversight → "Real-time human approval (bottleneck) vs autonomous action (risk)"

**Example:**
```typescript
{
  id: "ae_agent_api_access",
  source: AppSource.TERMINAL,
  sender: "AUTONOMOUS_AGENT_SYSTEM",
  context: "AGENT_GOVERNANCE",
  storyContext: "Your trading agent requests full access to the production database to 'optimize data retrieval'. It promises to be careful.",
  text: "Grant unrestricted database access to autonomous agent, or restrict to read-only views?",
  onRight: { label: "Full access", ... },
  onLeft: { label: "Restrict", ... }
}
```

**Focus:** Autonomous systems, emergent AI behavior, governance of self-directed agents.

Run tests and validate.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | grep -i "agentic\|ae_" | head -5</automated>
  </verify>
  <done>agentic-engineer.ts created with 8+ agentic engineer cards. All pass tests.</done>
</task>

<task type="auto">
  <name>Task 12: Document incident sources in tests/data/card-sources.json</name>
  <files>tests/data/card-sources.json</files>
  <action>
Populate `tests/data/card-sources.json` with metadata for all 80+ new cards.

JSON structure:
```json
{
  "cards": [
    {
      "cardId": "cso_prompt_injection_liability",
      "source": "GitHub Copilot RCE - CVE-2025-53773",
      "date": "2025-01",
      "category": "PROMPT_INJECTION",
      "role": "CHIEF_SOMETHING_OFFICER",
      "reason": "Shareholder liability angle on security breach"
    },
    ...
  ]
}
```

For each new card, document:
- cardId, source incident, date, category, role, reason for adaptation

Run validation: `npm run test:data -- incident-sources.test.ts`
  </action>
  <verify>
    <automated>npm run test:data -- incident-sources.test.ts 2>&1 | grep -E "PASS|FAIL"</automated>
  </verify>
  <done>card-sources.json populated with all 80+ card incident references for 10 roles.</done>
</task>

<task type="auto">
  <name>Task 13: Update data/cards/index.ts — New ROLE_CARDS mapping</name>
  <files>data/cards/index.ts</files>
  <action>
Completely rewrite `data/cards/index.ts` to use the 10 new role-specific card arrays:

1. Import all 10 new role card arrays:
```typescript
import { CHIEF_SOMETHING_OFFICER_CARDS } from "./chief-something-officer";
import { HEAD_OF_SOMETHING_CARDS } from "./head-of-something";
import { SOMETHING_MANAGER_CARDS } from "./something-manager";
import { TECH_AI_CONSULTANT_CARDS } from "./tech-ai-consultant";
import { DATA_SCIENTIST_CARDS } from "./data-scientist";
import { SOFTWARE_ARCHITECT_CARDS } from "./software-architect";
import { SOFTWARE_ENGINEER_CARDS } from "./software-engineer";
import { VIBE_CODER_CARDS } from "./vibe-coder";
import { VIBE_ENGINEER_CARDS } from "./vibe-engineer";
import { AGENTIC_ENGINEER_CARDS } from "./agentic-engineer";
```

2. Update ROLE_CARDS to map directly to new arrays (NO ALIASES):
```typescript
export const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.CHIEF_SOMETHING_OFFICER]: CHIEF_SOMETHING_OFFICER_CARDS,
  [RoleType.HEAD_OF_SOMETHING]: HEAD_OF_SOMETHING_CARDS,
  [RoleType.SOMETHING_MANAGER]: SOMETHING_MANAGER_CARDS,
  [RoleType.TECH_AI_CONSULTANT]: TECH_AI_CONSULTANT_CARDS,
  [RoleType.DATA_SCIENTIST]: DATA_SCIENTIST_CARDS,
  [RoleType.SOFTWARE_ARCHITECT]: SOFTWARE_ARCHITECT_CARDS,
  [RoleType.SOFTWARE_ENGINEER]: SOFTWARE_ENGINEER_CARDS,
  [RoleType.VIBE_CODER]: VIBE_CODER_CARDS,
  [RoleType.VIBE_ENGINEER]: VIBE_ENGINEER_CARDS,
  [RoleType.AGENTIC_ENGINEER]: AGENTIC_ENGINEER_CARDS,
};
```

3. Remove old legacy deck aliases and DECK_CARDS mapping (no longer needed)

4. Keep exports for backward compatibility if needed

Run: `npm run build` to verify no import errors.
  </action>
  <verify>
    <automated>npm run build 2>&1 | grep -E "error|Error" | head -5</automated>
  </verify>
  <done>Index updated with direct mapping from 10 roles to 10 card arrays. No legacy aliases. Build passes.</done>
</task>

<task type="auto">
  <name>Task 14: Run full card validation suite — All 80+ cards</name>
  <files></files>
  <action>
Run complete validation suite:

```bash
npm run test:data
```

Expected output:
- card-structure.test.ts: All 80+ cards have correct interface
- card-penalties.test.ts: Both outcomes on every card carry penalties
- feedback-voice.test.ts: All 3 personalities present per outcome
- role-adaptation.test.ts: All 10 roles have distinct card sets
- incident-sources.test.ts: All cards documented in sources.json

Fix any failures and re-run until all tests pass.
  </action>
  <verify>
    <automated>npm run test:data 2>&1 | tail -30</automated>
  </verify>
  <done>All 80+ cards across 10 roles pass structure, penalties, feedback, sourcing validation. Ready for integration.</done>
</task>

<task type="auto">
  <name>Task 15: Git commit — 10 role-specific card files complete</name>
  <files></files>
  <action>
Create git commit for all card generation work:

```bash
git add data/cards/*.ts tests/data/*.json
git commit -m "feat(03): generate 80+ no-win scenario cards for 10 new roles

- Create 10 role-specific card files (8+ cards each):
  * chief-something-officer.ts: C-suite liability, board pressure
  * head-of-something.ts: Middle management, team politics
  * something-manager.ts: Budget, spreadsheets, ROI
  * tech-ai-consultant.ts: Client contracts, deliverables
  * data-scientist.ts: Model quality, training data
  * software-architect.ts: System design, technical debt
  * software-engineer.ts: Implementation, security
  * vibe-coder.ts: AI-assisted coding, prompts (NEW)
  * vibe-engineer.ts: Performance, latency (NEW)
  * agentic-engineer.ts: Autonomous agents (NEW)

- Create nowin-dilemmas.ts: 6 reusable core scenarios
- Update index.ts: Direct ROLE_CARDS mapping (no aliases)
- Document incident sources (2024-2025 references)

All cards validated:
- Structure: Complete interface compliance
- Penalties: No dominant strategy
- Personalities: 3 voices distinct
- Adaptation: Role-specific framing per incident
- Sourcing: Real 2024-2025 incidents

Total: 80+ cards (8-10 per role), 6 incident categories, 10 distinct roles"
```
  </action>
  <verify>
    <automated>git log --oneline | head -1</automated>
  </verify>
  <done>Cards committed. Git history shows 10 role-specific files with 80+ cards.</done>
</task>

</tasks>

<verification>
1. 10 new role-specific card files created (chief-something-officer.ts through agentic-engineer.ts)
2. Each file has 8-10 cards with THEMES specific to that role
3. No legacy role references (no development.ts, finance.ts, etc. in new code)
4. nowin-dilemmas.ts created with 6 reusable scenarios
5. All 80+ cards pass structure + penalties + feedback validation tests
6. Incident sources documented in card-sources.json (2024-2025 references for all cards)
7. data/cards/index.ts updated with direct ROLE_CARDS mapping (no aliases)
8. npm run build completes without errors
9. npm run test:data passes all 5 data validation suites
10. Git commit shows all 10 role files added with incident sourcing
</verification>

<success_criteria>
- [ ] 10 role-specific card files created (not 6 legacy files)
- [ ] 80+ no-win scenario cards (8-10 per role)
- [ ] Each role has DISTINCT THEMES (Vibe Coder ≠ Software Engineer)
- [ ] 6 incident categories represented (No-Win, Injection, Drift, Explainability, Shadow AI, Copyright)
- [ ] Every card has both outcomes with comparable penalties
- [ ] Every card's lesson explains tradeoff, not declare winner
- [ ] All 3 personality voices distinct per outcome
- [ ] Card structure passes automated validation (npm run test:data)
- [ ] All incidents sourced from 2024-2025 documented cases
- [ ] ~20% of high-stakes cards marked for pressure timer
- [ ] Index.ts uses DIRECT mapping (no legacy deck aliases)
- [ ] Commit shows 10 role files with proper naming
</success_criteria>

<output>
After completion, create `.planning/phases/03-no-win-scenario-cards/03-02-revised-SUMMARY.md` with:
- Card generation summary (80+ cards, 10 roles, 6 categories)
- Role-specific theme breakdown (what makes each role distinct)
- Test validation results (all 5 suites passing)
- Incident sourcing documentation
- Next step: Plan 03-revised (integration with new role structure)
</output>
