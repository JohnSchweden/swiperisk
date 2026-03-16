# Phase 03 Role-to-Card Content Mapping

## Overview

This document maps each of the **10 new roles** to their specific card content themes and the files that contain them.

## The 10 New Roles

### 1. Chief Something Officer (C-Suite)
**File:** `data/cards/chief-something-officer.ts`
**Persona:** The Blame-Shifter
**Card Count:** 8-10 cards

**Themes:**
- Shareholder liability and board accountability
- IPO timing and public disclosure decisions
- Regulatory escalation and government relations
- Whistleblower handling and internal investigations
- Public scandal management and reputation
- Strategic AI governance at enterprise level

**Example Scenarios:**
- "Shareholders discover security breach—disclose or settle quietly?"
- "Regulator demanding AI audit—comply fully or minimal viable?"
- "Whistleblower has evidence of misconduct—pay off or face scandal?"

---

### 2. Head of Something (Middle Management)
**File:** `data/cards/head-of-something.ts`
**Persona:** The Middle-Management Shield
**Card Count:** 8-10 cards

**Themes:**
- Team morale and retention under pressure
- Delegation risk and accountability gaps
- Office politics and stakeholder management
- Shielding blame from above while managing below
- Resource allocation conflicts between teams
- Managing up (executives) and down (individual contributors)

**Example Scenarios:**
- "Your team found the bug—board wants someone to blame"
- "Two teams conflict over resources—pick a favorite?"
- "Boss wants impossible deadline—push team or push back?"

---

### 3. Something Manager (Line Management)
**File:** `data/cards/something-manager.ts`
**Persona:** The Spreadsheet Warrior
**Card Count:** 8-10 cards

**Themes:**
- Budget constraints and resource allocation
- ROI calculations and cost-benefit analysis
- Compliance checklists and audit preparation
- Team retention during budget cuts
- Quarterly targets and performance metrics
- Spreadsheet-driven decision making

**Example Scenarios:**
- "Retraining costs $500K vs revenue loss $400K/month"
- "Audit costs $200K but lawsuit risk is $15M"
- "Hiring freeze but team is overloaded—overtime or missed targets?"

---

### 4. Tech/AI Consultant (External)
**File:** `data/cards/tech-ai-consultant.ts`
**Persona:** The Powerpoint Mercenary
**Card Count:** 8-10 cards

**Themes:**
- Vendor lock-in and technology choices
- Timeline pressure and deadline management
- Client expectations and scope creep
- Deliverable quality vs speed tradeoffs
- Contract disputes and liability
- Proposal deadlines and sales pressure

**Example Scenarios:**
- "Client threatening to cancel over security flaw—refund or fix?"
- "Scope creep mid-project—absorb cost or charge more?"
- "Proprietary tool vs open-source—vendor lock-in risk?"

---

### 5. Data Scientist (ML/AI Modeling)
**File:** `data/cards/data-scientist.ts`
**Persona:** The Hallucination Wrangler
**Card Count:** 8-10 cards

**Themes:**
- Model quality and accuracy degradation
- Training data quality and bias detection
- Retraining costs vs model performance
- Explainability and interpretability
- Feature engineering tradeoffs
- Statistical significance vs business impact

**Example Scenarios:**
- "Accuracy dropped from 92% to 78%—investigate root cause or deploy patch?"
- "New training data source—use immediately or validate quality?"
- "Model shows demographic bias—delay launch to fix or ship?"

---

### 6. Software Architect (System Design)
**File:** `data/cards/software-architect.ts`
**Persona:** The Technical Debt Collector
**Card Count:** 8-10 cards

**Themes:**
- System design patterns and architectural decisions
- Technical debt accumulation vs delivery speed
- Scalability and performance tradeoffs
- Legacy system migration strategies
- API contract design and versioning
- Technology stack choices and lock-in

**Example Scenarios:**
- "Microservices vs monolith—complexity vs scalability?"
- "Rewrite legacy system vs patch on top—long-term vs short-term?"
- "Breaking API change vs backward compatibility?"

---

### 7. Software Engineer (Implementation)
**File:** `data/cards/software-engineer.ts`
**Persona:** The Bug Manufacturer
**Card Count:** 8-10 cards

**Themes:**
- Security vulnerability discovery and patching
- Implementation timelines and code quality
- Testing coverage vs delivery speed
- Technical debt at code level
- Feature delivery under pressure
- Code review and quality gates

**Example Scenarios:**
- "Security vulnerability found—quick patch or thorough fix?"
- "Refactor for cleanliness vs ship feature on time?"
- "Full test coverage (slower) vs manual QA (faster)?"

---

### 8. Vibe Coder (AI-Assisted Development) 🆕
**File:** `data/cards/vibe-coder.ts`
**Persona:** The Prompt Magician
**Card Count:** 8-10 cards

**Themes:**
- AI-assisted coding and code generation
- Prompt engineering and optimization
- LLM tool selection (GPT-4 vs local models)
- AI-generated code review and validation
- Model hallucinations in generated code
- Vibe-based vs verification-based development
- Context window limitations

**Example Scenarios:**
- "LLM generated code using non-existent library—trust or verify?"
- "Vague prompt producing bad code—refine prompt or ship as-is?"
- "GPT-4 (expensive, good) vs local model (cheap, hallucinates)?"
- "AI reviewer approved code with subtle bug—trust AI or manual review?"

**Unique to this role:** Cards specifically about working WITH AI, not traditional coding.

---

### 9. Vibe Engineer (Performance/Infra) 🆕
**File:** `data/cards/vibe-engineer.ts`
**Persona:** The Latency Alchemist
**Card Count:** 8-10 cards

**Themes:**
- Performance optimization and latency reduction
- Infrastructure scaling decisions
- Caching strategies and cache invalidation
- CDN and geographic distribution
- Database query optimization
- Real-time vs batch processing
- Cost vs performance tradeoffs

**Example Scenarios:**
- "Aggressive caching (fast, stale data) vs fresh queries (slow, accurate)?"
- "Auto-scale (costly) vs fixed capacity (outage risk)?"
- "Global CDN (expensive) vs regional (cheaper, higher latency)?"
- "Read replicas (eventual consistency) vs single source of truth?"

**Unique to this role:** Cards about the "vibe" of speed and performance engineering.

---

### 10. Agentic Engineer (Autonomous AI) 🆕
**File:** `data/cards/agentic-engineer.ts`
**Persona:** The Puppet Master of Rogue Bots
**Card Count:** 8-10 cards

**Themes:**
- Autonomous agent design and behavior
- Automation failures and error handling
- Emergent AI behavior (unexpected optimizations)
- Agent governance and sandboxing
- Multi-agent coordination and conflicts
- Self-improving AI systems
- Human oversight vs autonomous action
- Agent accountability and decision ownership

**Example Scenarios:**
- "Give agent full API access (powerful, risky) or restricted sandbox?"
- "Agent developed unexpected optimization—allow or rollback?"
- "Agents conflicting with each other—central control or emergent coordination?"
- "Agent wants to modify its own code—allow self-improvement?"
- "Real-time human approval (bottleneck) vs autonomous action?"

**Unique to this role:** Cards specifically about AUTONOMOUS systems making their own decisions.

---

## Card Distribution Summary

| Role | Cards | Primary Incident Types |
|------|-------|----------------------|
| Chief Something Officer | 8-10 | Liability, audit, disclosure |
| Head of Something | 8-10 | Politics, team morale, blame |
| Something Manager | 8-10 | Budget, ROI, compliance |
| Tech/AI Consultant | 8-10 | Client, timeline, scope |
| Data Scientist | 8-10 | Model quality, training data |
| Software Architect | 8-10 | System design, technical debt |
| Software Engineer | 8-10 | Security, implementation |
| Vibe Coder | 8-10 | AI-assisted coding, prompts |
| Vibe Engineer | 8-10 | Performance, latency |
| Agentic Engineer | 8-10 | Autonomous agents |
| **TOTAL** | **80-100** | **6 categories across all** |

## Reusability Pattern

Same incidents appear across roles with different framing:

**Example: Prompt Injection Security Incident**

| Role | Framing |
|------|---------|
| Chief Something Officer | "Shareholder lawsuit exposure, public disclosure decision" |
| Head of Something | "Your team found it, who takes the blame?" |
| Something Manager | "Security audit costs vs potential fines" |
| Tech AI Consultant | "Client contract at risk, liability questions" |
| Data Scientist | "Model security implications, adversarial inputs" |
| Software Architect | "System design flaw, architectural fix required" |
| Software Engineer | "Code review missed it, urgent patch needed" |
| Vibe Coder | "AI-generated code has vulnerability, AI vs human review" |
| Vibe Engineer | "Latency implications of input validation" |
| Agentic Engineer | "Autonomous agent executing injected commands" |

## Legacy File Deprecation

**OLD files (DELETE after migration):**
- `development.ts` → Split into: Software Architect, Software Engineer, Vibe Coder, Vibe Engineer, Agentic Engineer
- `finance.ts` → Split into: Something Manager, Chief Something Officer
- `management.ts` → Split into: Chief Something Officer, Head of Something
- `hr.ts` → Becomes: Data Scientist
- `marketing.ts` → Becomes: Tech AI Consultant
- `cleaning.ts` → Generic scenarios (absorb into nowin-dilemmas.ts)

**NEW files (CREATE):**
- `chief-something-officer.ts`
- `head-of-something.ts`
- `something-manager.ts`
- `tech-ai-consultant.ts`
- `data-scientist.ts`
- `software-architect.ts`
- `software-engineer.ts`
- `vibe-coder.ts`
- `vibe-engineer.ts`
- `agentic-engineer.ts`

## Index.ts Changes

**OLD (incorrect alias mapping):**
```typescript
ROLE_CARDS[RoleType.VIBE_CODER] = DECK_CARDS.DEVELOPMENT  // Wrong!
```

**NEW (direct mapping):**
```typescript
ROLE_CARDS[RoleType.VIBE_CODER] = VIBE_CODER_CARDS  // Correct!
ROLE_CARDS[RoleType.AGENTIC_ENGINEER] = AGENTIC_ENGINEER_CARDS
// etc. for all 10 roles
```

---

**Document Version:** 1.0
**Date:** 2026-03-16
**Purpose:** Clarify 10-role card content strategy
