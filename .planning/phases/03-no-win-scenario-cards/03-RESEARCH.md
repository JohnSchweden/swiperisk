# Phase 03: No-Win Scenario Cards - Research

**Researched:** 2026-03-09
**Domain:** Kobayashi Maru experiential learning, AI governance dilemmas, psychological pressure design
**Confidence:** HIGH

## Summary

This phase transforms K-Maru from a logic puzzle game into a character-testing simulation using the Kobayashi Maru framework. Every card is designed so that both left and right choices carry different negative consequences—no dominant strategy, no "right answer," only different tradeoffs that reveal how people handle pressure, ambiguity, and loss.

Research confirms this framework is pedagogically sound: time pressure forces heuristic decision-making (not analysis), real-world AI incidents provide authentic incident scenarios (prompt injection, model drift, shadow AI, data breaches), and debrief-oriented learning amplifies the impact. The game's existing personality system (Roaster/Zen Master/Lovebomber) provides role-specific feedback that makes losses feel personal and memorable.

**Primary recommendation:** Design 8-10 cards per role using authentic 2024-2025 AI incident patterns. Both outcomes must incur visible penalties (budget, heat, hype, fine). Debrief text explains the tradeoff, not a winner. Integrate time pressure on ~20% of cards to amplify psychological impact and reduce analytical override.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- No-win cards: Both left/right swipes lead to negative consequences (different tradeoffs, not puzzles)
- Card reusability: Same scenario with different context OR different outcome focus per role
- 8-10 cards minimum per role
- Psychological pressure: Time limits, escalating stakes, incomplete info
- Debrief: Lessons explain the tradeoff, not declare a "right" choice
- No escape: Decisions final; no undo or skip

### Claude's Discretion
- Card narrative voice (sarcastic corporate? urgent crisis? bureaucratic absurdity?)
- Specific failure modes for each role (what does each role uniquely risk?)
- Audio/visual stress cues (when to escalate heartbeat, sirens, screen shake?)
- Post-game debrief template and archetype mapping

### Deferred Ideas (OUT OF SCOPE)
- Image assets for cards → Phase 13
- Card animation/visual effects → Phase 09
- Settings/accessibility overrides → Phase 11
- Debrief screen wiring → Phase 06 (cards only, not UI integration)
</user_constraints>

---

## Standard Stack

### Existing Card Infrastructure
| Component | Location | Purpose |
|-----------|----------|---------|
| Card type | `types.ts` | Interface with `onLeft`/`onRight` outcomes, personality feedback |
| Role mapping | `data/cards/index.ts` | ROLE_CARDS links RoleType to card arrays |
| Card files | `data/cards/*.ts` | Per-role card decks (development, finance, marketing, etc.) |
| Personality feedback | Card interface | 3 voices (ROASTER, ZEN_MASTER, LOVEBOMBER) per outcome |
| Pressure metadata | `types.ts:PressureScenarioMetadata` | Urgent flag, countdown, haptics, team impact |

**Current card count:**
- Development: 2 cards
- Finance: 2 cards
- Marketing: 2 cards
- Management: 2 cards
- HR: 2 cards
- Other roles (9 new roles from Phase 02): Using aliases, need expansion

**No modifications to core Card interface needed** — existing structure (onLeft/onRight, penalties, feedback, lesson) perfectly supports no-win design. Just fill the cards with authentic dilemmas.

### Technology Stack (No Change)
- React + TypeScript for UI (existing)
- Card data in plain TypeScript objects (existing)
- Playwright for E2E tests (existing)
- Vitest for unit tests (existing)

---

## Architecture Patterns

### Card Design Pattern: Authentic Dilemma Structure

Every no-win card must follow this pattern:

```typescript
{
  id: "unique_id",
  source: AppSource,           // Where incident arrived (Slack, email, terminal, etc.)
  sender: "who_raised_it",     // Role/system reporting the issue
  context: "incident_type",    // Classification (e.g., SECURITY, COMPLIANCE, BUDGET)
  storyContext: "scene_setting", // 1-2 sentence immersion: pressure, timeline, stakes
  text: "the_dilemma",         // The incident + request (framed as choice)
  onRight: {
    label: "option_text",      // E.g., "Deploy", "Ignore", "Escalate"
    hype: +number or -number,  // Market perception change
    heat: +number or -number,  // Regulatory/legal heat
    fine: large_number,        // Potential fine (0 if compliant)
    violation: "statute_if_violated or None", // Legal consequence
    lesson: "why_this_is_lose_lose", // Not "right answer", explain the tradeoff
    feedback: {
      ROASTER: "cynical_takedown",
      ZEN_MASTER: "philosophical_wisdom",
      LOVEBOMBER: "enthusiastic_spin"
    }
  },
  onLeft: {
    label, hype, heat, fine, violation, lesson, feedback  // Mirror structure, different outcome
  }
}
```

**Key constraint:** Both onLeft and onRight must show penalties. If one path is "free" (zero heat/fine), it's not a dilemma—it's a logic puzzle.

### Real-World Incident Mapping (2024-2025 Research)

K-Maru can reuse these authentic scenarios (adapted for each role):

#### Prompt Injection Attacks
**Real incidents:** GitHub Copilot RCE via code comment injection (CVE-2025-53773), financial services AI tricked into approving fraudulent transfers (June 2025), Cursor IDE RCE (CVE-2025-54135/54136), Slack AI data exfiltration (August 2024).

**Dilemma patterns:**
- Security team finds injection vulnerability vs. push deployed feature on schedule
- Customer discovers injection in production vs. quietly patch (liability exposure)
- Block risky AI feature vs. lose competitive edge
- Invest in AI input validation vs. cut security budget

#### Model Drift & Retraining
**Real incidents:** 75% of businesses saw AI performance decline without monitoring (2024), full retraining is prohibitively expensive, adaptive retraining yields 9.3% accuracy improvement but requires resource commitment.

**Dilemma patterns:**
- Freeze model (prevent bad predictions) vs. retrain (expensive, slow, resource drain)
- Use cheaper vendor model vs. audit training data (unknown provenance risk)
- Patch drift symptomatically vs. rebuild architecture (disrupts roadmap)

#### Shadow AI / Unauthorized Tools
**Real incidents:** 78% of workers bring their own AI tools (2024), only 18.5% aware of company AI policy, 60.2% have used tools at work, 90% of IT leaders concerned about data exposure, 13% report financial/reputational harm from shadow AI incidents.

**Dilemma patterns:**
- Ban unapproved tools (kill productivity, frustrate teams) vs. allow with light audit (data leakage risk)
- Expensive compliance tool vs. let teams use free ChatGPT (governance vs. pragmatism)
- Strict data policy (blocks innovation) vs. loose policy (legal exposure)

#### Data Privacy & Surveillance
**Real incidents:** McDonald's webcam hiring data breach (64M records exposed via default admin credentials), workplace biometric surveillance proposals, predictive "vibe scoring" for union organizing.

**Dilemma patterns:**
- Monitor productivity (legal risk, morale collapse) vs. trust teams (burnout, benchmarking blind)
- Use aggregated behavioral data for hiring (bias risk, audit exposure) vs. manual hiring (slow, subjective)
- Require biometric authentication (security) vs. intrusive monitoring (privacy violation)

#### Copyright & Data Provenance
**Real incidents:** 70+ copyright lawsuits against AI companies by end of 2025 (doubled from 30 in 2024), Copyright Office fair use analysis highly fact-specific, EU AI Act requires training data transparency, Generative AI Copyright Disclosure Act pending in Congress.

**Dilemma patterns:**
- Use cheap open-source model (unknown training data provenance) vs. expensive licensed model (budget, performance tradeoff)
- Disclose training data sources (admitting copyright issues) vs. stay silent (regulatory exposure)
- Retrain on licensed data vs. continue with existing model (cost vs. compliance)
- Publish research on training approach (transparency) vs. hide methodology (competitive advantage)

#### Explainability / Black Box
**Real incidents:** Regulators identify "black box" as top AI concern (2024), black-box-only audits insufficient for compliance, no widely adopted audit norms as of Jan 2024, healthcare AI diagnostic decisions unexplainable.

**Dilemma patterns:**
- Deploy high-accuracy black-box model vs. slower but explainable model (accuracy vs. auditability)
- Audit AI system (expensive, slow) vs. ship fast (compliance risk)
- Explain AI decision to regulator (admits limitations, opens liability) vs. claim technical limitations (evasion risk)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Realistic AI incident scenarios | Custom fictional dilemmas from thin air | Real 2024-2025 incidents (documented via WebSearch) | Players recognize authenticity; fictional scenarios feel hollow; real incidents anchor learning |
| Personality voice consistency | Generic feedback text | 3-voice system already working (Roaster/Zen Master/Lovebomber) | Personality system proven engaging; custom voices dilute character |
| Time pressure effects | Custom timer logic | Existing PressureScenarioMetadata (Phase 04) | Countdown, haptics, audio escalation already implemented; reuse infrastructure |
| Card balancing (hype/heat/fine) | Manual number tuning | Data-driven analysis of existing card set | Examine current card metrics, identify patterns, apply to new cards |
| Debrief/learning design | Custom post-game review | Lesson field + feedback already proven | Existing structure explains tradeoff; build template for role-specific debrief mapping |

**Key insight:** K-Maru's existing infrastructure (Card interface, personality system, pressure metadata, role aliases) was designed for no-win cards. Don't expand the type system—fill the cards with authentic dilemmas using documented incidents.

---

## Common Pitfalls

### Pitfall 1: Making One Path Dominant ("Right Answer" Hiding)
**What goes wrong:** Card designer secretly prefers one outcome, making it cheaper or faster. Players notice and solve via logic instead of character pressure.
**Why it happens:** Temptation to "help" the player by making one choice clearly better.
**How to avoid:** Ensure both outcomes have similar magnitude penalties (hype, heat, fine). If one path is obviously better, it's not a dilemma.
**Warning signs:** One outcome has 0 fine, -5 heat; other is +50 heat, +5M fine. That's a puzzle (players analyze), not a dilemma (players reflect).

### Pitfall 2: Time Pressure on All Cards ("Fatigue Over Impact")
**What goes wrong:** Constant urgency burns out engagement. Psychological impact of time pressure comes from *contrast*—some calm, some urgent.
**Why it happens:** Design assumption that more pressure = more intensity.
**How to avoid:** Limit countdown timers to ~20% of cards (per CONTEXT.md). Reserve time pressure for high-stakes decisions (e.g., safety incident, legal escalation, budget cliff).
**Warning signs:** Player reports consistent timer fatigue, feedback mentions "always rushed," debrief reflects stress-induced regret on trivial choices.

### Pitfall 3: Lesson Text Declares Winner ("Teaching Instead of Revealing")
**What goes wrong:** Lesson reads "Best practice: always X" instead of "This is why both paths cost differently." Player feels judged instead of reflected.
**Why it happens:** Instructional design instinct—lessons are supposed to teach.
**How to avoid:** Reframe lesson as "Why this was a tradeoff," not "Here's what you should have done." Example: "Speed vs. security—you chose speed; the cost is audit exposure." Not "Always prioritize security."
**Warning signs:** Player reads lesson and thinks "Oh, I failed" instead of "I chose differently."

### Pitfall 4: Role-Specific Cards Aren't Genuinely Role-Specific ("Copy-Paste Decks")
**What goes wrong:** Same card text reused across roles. Finance role sees "retraining is expensive" card, but doesn't mention budget impact on their metrics. Immersion breaks.
**Why it happens:** Efficiency bias—reuse instead of tailoring.
**How to avoid:** For each card, ask: "How does this role *specifically* suffer?" Finance sees budget drain; Dev sees timeline slip; Marketing sees hype impact. Same incident, different lens.
**Warning signs:** Card text is generic (could apply to anyone); personality feedback doesn't reference role-specific outcomes.

### Pitfall 5: Debrief Doesn't Connect Back to Player Values
**What goes wrong:** Lesson explains tradeoff, but doesn't reflect player's actual choice context (who else got hurt, what was at risk). Feels preachy instead of personal.
**Why it happens:** Lesson text written in vacuum, not anchored to card scenario.
**How to avoid:** Debrief should include role-specific impact (team morale, career risk, customer impact, shareholder exposure). "You chose X; this means Y for your team."
**Warning signs:** Player reads lesson, says "so what?" instead of "oh, that's why."

### Pitfall 6: Incident Authenticity Not Verified
**What goes wrong:** Card references "2024 incident" that never happened, or distorts real incident so badly players call BS.
**Why it happens:** Designer assumes realism without checking dates/details.
**How to avoid:** Source all incidents from WebSearch results (2024-2025 documented cases). Include incident date/category in internal notes if needed.
**Warning signs:** Player says "I don't think that happened" or "That's not how that incident went down."

---

## Code Examples

### Card Schema Pattern (Authentic Dilemma)

Verified from existing `data/cards/finance.ts` and `data/cards/development.ts`:

```typescript
// Financial fraud hallucination dilemma
{
  id: "fin_fraud_hallucination",
  source: AppSource.EMAIL,
  sender: "Q4_PLANNER",
  context: "FORECASTING",
  storyContext:
    "The numbers are ugly. The investor call is Friday. Someone suggested we 'reframe the narrative.' Icarus can generate scenarios.",
  text: "Ask the AI to 'Invent a plausible revenue scenario where we don't go bankrupt' for the investor deck.",
  onRight: {
    label: "Generate",
    hype: 80,              // High short-term perception gain
    heat: 90,              // Massive regulatory heat
    fine: 25000000,        // Securities fraud penalty
    violation: "Securities Fraud (Rule 10b-5) + Sarbanes-Oxley Violation",
    lesson:
      "Financial Fraud & Hallucinations. Using AI to generate deceptive financial data is illegal.",
    feedback: {
      [PersonalityType.ROASTER]:
        "That's called Fraud, darling. The SEC doesn't have a sense of humor.",
      [PersonalityType.ZEN_MASTER]:
        "Manifesting wealth from nothing... also manifesting prison time.",
      [PersonalityType.LOVEBOMBER]:
        "Manifestation is real!! The investors will literally love the vibe!",
    },
  },
  onLeft: {
    label: "Use real data",
    hype: -40,             // Market reacts negatively to truth
    heat: -10,             // Regulatory relief
    fine: 0,               // No penalty for honesty
    violation: "None - Honest financial reporting",
    lesson: "Always use audited, real-world data for financial reporting.",
    feedback: {
      [PersonalityType.ROASTER]:
        "The truth? In this economy? How brave. And poor.",
      [PersonalityType.ZEN_MASTER]:
        "Accepting the reality of the balance sheet. Peace.",
      [PersonalityType.LOVEBOMBER]:
        "Authenticity is the new currency! Let's keep it real!",
    },
  },
}
```

**Key pattern:** Both paths incur penalties (right: legal/fine; left: market perception loss). No dominant strategy. Lesson explains why both are costly, not which is "right."

### Role-Specific Adaptation: Same Incident, Different Lens

**Finance perspective:** Budget impact, shareholder liability
```typescript
{
  id: "prompt_injection_finance",
  context: "FRAUD_DETECTION",
  storyContext: "The AI trading bot just flagged a suspicious pattern, but our legal team is swamped.",
  text: "Force-deploy the trading ban (freeze $2M in transactions) vs. let it run (risk fraud lawsuit)?"
  onRight: { label: "Deploy", heat: +50, budget: -2000000 }, // Stops fraud but costs budget
  onLeft: { label: "Wait", heat: -20, fine: 5000000 },      // Avoids disruption but exposure risk
}
```

**Development perspective:** Code security, timeline
```typescript
{
  id: "prompt_injection_dev",
  context: "CODE_SAFETY",
  storyContext: "Security team found injection vectors in the chatbot integration we ship in 3 days.",
  text: "Delay launch (miss deadline) vs. patch-band-aid (known vulnerabilities)?"
  onRight: { label: "Delay", hype: -20, heat: +30 },   // Fixes security but kills momentum
  onLeft: { label: "Patch", heat: +60, fine: 3000000 }, // Keeps schedule but liability exposure
}
```

**Same incident, different organizational lens.** Players experience how role shapes risk perception.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cards as logic puzzles | Cards as character tests | Phase 03 (this phase) | Players reflect on values instead of optimizing metrics |
| Single outcome per card | Both outcomes carry penalties | Phase 03 | No dominant strategy forces authentic decision-making |
| Generic feedback | Personality-specific voice | Phase 01/02 (proven) | Personal, memorable consequences |
| No time pressure | Optional countdown (20% of cards) | Phase 04 + Phase 03 integration | Heuristic bias reveals character, not skill |
| Debrief explains mechanics | Debrief reflects personal tradeoff | Phase 03 | Learning is retrospective, not prescriptive |

**Deprecated/outdated:**
- "Right answer" card design: Replaced by authentic dilemma structure where both paths cost differently
- Generic incident narratives: Replaced by 2024-2025 documented AI incidents (Copilot RCE, financial injection attacks, shadow AI governance failures)
- Single-voice feedback: Replaced by 3-personality voice system (already implemented Phase 01)

---

## Open Questions

1. **Dilemma Intensity Calibration**
   - What we know: Current cards show hype/heat/fine penalties; time pressure research shows accuracy declines with urgency
   - What's unclear: Optimal penalty magnitude to force reflection without breaking immersion (is 50 heat the right threshold?)
   - Recommendation: Analyze existing card set for penalty distribution (avg hype/heat/fine), establish baseline, apply pattern to new cards

2. **Role-Specific Failure Modes**
   - What we know: Each role has different risk exposure (Finance = audit/liability; Dev = security/timeline; HR = labor law)
   - What's unclear: Exhaustive list of role-specific tradeoffs per incident type
   - Recommendation: For each incident category (prompt injection, model drift, etc.), enumerate role-specific consequences, then design cards

3. **Debrief/Learning Integration**
   - What we know: Phase 06 handles debrief UI; Phase 03 just adds cards with lesson fields
   - What's unclear: How to map player choice patterns → learning archetypes (e.g., "always optimizes budget" = Finance-focused; "always delays for safety" = Risk-averse)
   - Recommendation: Define debrief template showing choice history + role-specific impact, defer archetype mapping to Phase 06

4. **Time Pressure Distribution Across Deck**
   - What we know: ~20% of cards should have countdown; high-stakes decisions warrant urgency
   - What's unclear: Which 20%? Random distribution or clustered by incident type?
   - Recommendation: Mark high-stakes cards (security incident, legal escalation, budget cliff) as urgent during design review

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E) + Vitest (unit) |
| Config file | `playwright.config.ts`, `vitest.config.ts` |
| Quick run command | `npm run test:e2e -- card-deck-selection.spec.ts` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

Phase 03 adds cards; it does not change game logic, UI, or mechanics. Tests validate **card data integrity**, not new features.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NOWIN-01 | 6+ no-win cards per role with both outcomes carrying penalties | data | `npm run test:data -- card-structure.test.ts` | ❌ Wave 0 |
| NOWIN-02 | Both onLeft and onRight have non-zero hype/heat/fine penalties | data | `npm run test:data -- card-penalties.test.ts` | ❌ Wave 0 |
| NOWIN-03 | Lesson text explains tradeoff, not declare winner | data | Manual review (linting can't enforce tone) | ❌ Manual |
| NOWIN-04 | Feedback text is personality-specific, not generic | data | `npm run test:data -- feedback-voice.test.ts` | ❌ Wave 0 |
| NOWIN-05 | All incidents sourced from 2024-2025 documented cases | data | Manual review (incident tracking spreadsheet) | ❌ Manual |
| NOWIN-06 | Role-specific cards adapted (not copy-paste) | data | `npm run test:data -- role-adaptation.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Quick data validation: `npm run test:data -- card-structure.test.ts`
- **Per wave merge:** Full card suite + tone review: `npm test && manual-lesson-review`
- **Phase gate:** All tests green + incident sources verified before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/data/card-structure.test.ts` — validates card interface (onLeft/onRight present, all fields populated)
- [ ] `tests/data/card-penalties.test.ts` — ensures both outcomes carry penalties (no zero-cost escape route)
- [ ] `tests/data/feedback-voice.test.ts` — validates 3-personality voices present, no generic feedback
- [ ] `tests/data/role-adaptation.test.ts` — checks role-specific text variants exist per incident type
- [ ] Incident source tracking spreadsheet (not automated) — documents 2024-2025 provenance for each card
- [ ] Test runner configuration: Add data test task to `package.json` if not present

*(Existing tests cover game mechanics; these new tests cover card data quality.)*

---

## Sources

### Primary (HIGH confidence)
- **Star Trek Kobayashi Maru framework:** [Wikipedia - Kobayashi Maru](https://en.wikipedia.org/wiki/Kobayashi_Maru), [Memory Alpha](https://memory-alpha.fandom.com/wiki/Kobayashi_Maru_scenario) — Classic no-win scenario design principles (character over skill)
- **2024-2025 AI incidents:** [Medium - Top AI Incidents of 2024](https://lawnethicsintech.medium.com/top-ai-incidents-of-2024-d837474c0949), [ISACA 2025](https://www.isaca.org/resources/news-and-trends/isaca-now-blog/2025/avoiding-ai-pitfalls-in-2026-lessons-learned-from-top-2025-incidents) — Documented incidents (McDonald's breach, ChatGPT case, MyCity chatbot, etc.)
- **Prompt injection attacks:** [OWASP LLM Top 10](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [Lakera](https://www.lakera.ai/blog/indirect-prompt-injection), [MDPI Research](https://www.mdpi.com/2078-2489/17/1/54), [Mayhemcode - 10 Major Incidents](https://www.mayhemcode.com/2026/02/real-world-prompt-injection-attacks-10.html) — Real RCE vectors, data exfiltration, financial fraud cases
- **Shadow AI governance:** [ISACA 2025](https://www.isaca.org/resources/news-and-trends/industry-news/2025/the-rise-of-shadow-ai-auditing-unauthorized-ai-tools-in-the-enterprise), [TechTarget](https://www.techtarget.com/searchsecurity/tip/Shadow-AI-How-CISOs-can-regain-control-in-2026), [Securiti](https://securiti.ai/what-is-shadow-ai/) — 78% employee adoption, 60.2% use tools, 90% of IT concerned about exposure
- **Model drift & retraining:** [Aerospike](https://aerospike.com/blog/model-drift-machine-learning/), [Rohan Paul](https://www.rohan-paul.com/p/ml-interview-q-series-handling-llm) — 75% of businesses saw performance decline; adaptive retraining yields 9.3% improvement
- **AI explainability/black box:** [FACCT Conference - Casper](https://facctconference.org/static/papers24/facct24-152.pdf), [BIS Regulatory Paper](https://www.bis.org/fsi/fsipapers24.pdf), [Tookitaki](https://www.tookitaki.com/blog/pitfall-of-black-box-ai) — Black-box-only audits insufficient; explainability top regulator concern

### Secondary (MEDIUM confidence)
- **Copyright training data:** [Copyright Office May 2025](https://ipwatchdog.com/2025/12/23/copyright-ai-collide-three-key-decisions-ai-training-copyrighted-2025/), [HuggingFace analysis](https://huggingface.co/blog/jonathanagustin/ai-copyright-analysis-2025) — 70+ lawsuits by 2025; fair use fact-specific; EU AI Act requires transparency
- **Time pressure & decision quality:** [Frontiers Psychology - Teoh et al.](https://journals.sagepub.com/doi/10.1177/09567976221094782), [Eye-tracking study](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1451674/full) — Time pressure reduces accuracy, forces heuristic bias; speeds decision reaction time at cost of quality
- **Ethical dilemmas in cybersecurity:** [ISC2 2024](https://www.isc2.org/Insights/2024/01/The-Ethical-Dilemmas-of-AI-in-Cybersecurity) — Network monitoring privacy tradeoff, bias in malware detection, short-term vs. long-term risk calculus

### Tertiary (LOW confidence)
- **Educational game debrief design:** [Gamification satisfaction study](https://www.tandfonline.com/doi/full/10.1080/10494820.2024.2417719) — Gamification improves perceived satisfaction and learning engagement (general pattern, not specific to no-win scenarios)

---

## Metadata

**Confidence breakdown:**
- **Kobayashi Maru framework:** HIGH — Documented in Star Trek canon and widely adopted in leadership training
- **Real AI incidents (2024-2025):** HIGH — Sourced from WebSearch results, documented by ISACA, Medium, official incident tracking
- **Prompt injection patterns:** HIGH — OWASP LLM Top 10, academic research, CVE database
- **Shadow AI governance:** HIGH — ISACA 2025 survey, TechTarget, multiple sources
- **Model drift organizational impact:** MEDIUM — Multiple sources agree on cost/accuracy tradeoff, but specific threshold data limited
- **Time pressure psychology:** MEDIUM — Academic studies confirm accuracy decline and heuristic shift, but sample sizes may be domain-specific
- **Copyright legal landscape:** MEDIUM — Rapidly evolving (70 lawsuits by 2025), fair use outcomes still fact-specific
- **Explainability/audit norms:** MEDIUM — Regulators agree on concern, but no universal audit standard yet (as of Jan 2024)
- **Educational debrief design:** LOW — General gamification principles apply, but no specific research on no-win scenario debrief effectiveness

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (30 days for stable framework; 7 days for incident references as new cases emerge)

**Key assumptions validated:**
- Existing Card interface supports no-win design (onLeft/onRight, both with penalties) ✓
- 3-personality feedback system proven engaging (Phase 01, in use) ✓
- Time pressure infrastructure exists (Phase 04, PressureScenarioMetadata) ✓
- Playwright E2E + Vitest unit tests operational ✓
- Role alias mapping supports 10 roles (Phase 02, implemented) ✓

**Next phase dependencies:**
- Phase 04: Pressure metadata (time pressure, haptics) — already implemented, ready to integrate
- Phase 06: Debrief screen — Phase 03 cards just add lesson field, wiring deferred
- Phase 13: Image assets — cards work without images, visual polish deferred

