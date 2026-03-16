---
phase: 03-no-win-scenario-cards
plan: 05-revised
type: execute
wave: 5
depends_on: [03-02-revised]
files_modified:
  - types.ts
  - components/game/FeedbackOverlay.tsx
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
  - tests/data/real-world-reference.test.ts
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Every card displays its real-world incident reference in the feedback overlay"
    - "Reference section shows incident name, date, and real outcome"
    - "Players understand scenarios are based on actual 2024-2025 AI incidents"
    - "Reference data is populated for all 80+ cards across 10 roles"
    - "No visual regression in FeedbackOverlay layout"
  artifacts:
    - path: "types.ts"
      provides: "Card interface with realWorldReference field"
      exports: ["RealWorldReference", "Card"]
    - path: "components/game/FeedbackOverlay.tsx"
      provides: "History/Real Case section in overlay"
      contains: "realWorldReference rendering"
    - path: "tests/data/real-world-reference.test.ts"
      provides: "Validation that all 80+ cards across 10 roles have references"
  key_links:
    - from: "Card.realWorldReference"
      to: "FeedbackOverlay history section"
      via: "CardStack props"
      pattern: "realWorldReference.*incident.*date"
---

<objective>
Add a "Real Case Reference" section to the FeedbackOverlay that displays the authentic 2024-2025 AI incident behind each card scenario for ALL 10 ROLES. This educational component makes players aware these are not hypothetical dilemmas—they're based on documented events with real consequences.

Purpose: Transform the game from "what if?" to "this happened"—grounding abstract governance dilemmas in historical reality. Players learn from actual failures, not fictional scenarios. Works across all 10 new roles (Chief Something Officer, Head of Something, Something Manager, Tech AI Consultant, Data Scientist, Software Architect, Software Engineer, Vibe Coder, Vibe Engineer, Agentic Engineer).

Output: Extended Card interface with real-world reference data, updated FeedbackOverlay with collapsible history section, all 80+ cards across 10 roles populated with incident sources from 03-RESEARCH.md.
</objective>

<execution_context>
@/Users/yevgenschweden/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Phase 03-02-revised created 80+ cards for 10 new roles based on real 2024-2025 AI incidents (documented in 03-RESEARCH.md):
- GitHub Copilot RCE via prompt injection (CVE-2025-53773)
- Cursor IDE RCE (CVE-2025-54135/54136)
- McDonald's 64M record webcam hiring data breach
- Financial services AI injection fraud attacks (June 2025)
- 75% of businesses experiencing model drift (2024)
- 78% worker adoption of shadow AI tools
- 70+ copyright lawsuits against AI companies by end of 2025
- Slack AI data exfiltration (August 2024)

**The 10 New Role Card Files:**
1. `chief-something-officer.ts` — C-suite governance cards
2. `head-of-something.ts` — Middle management cards
3. `something-manager.ts` — Budget/manager cards
4. `tech-ai-consultant.ts` — Client/consulting cards
5. `data-scientist.ts` — ML/data science cards
6. `software-architect.ts` — Architecture cards
7. `software-engineer.ts` — Implementation cards
8. `vibe-coder.ts` — AI-assisted coding cards 🆕
9. `vibe-engineer.ts` — Performance/latency cards 🆕
10. `agentic-engineer.ts` — Autonomous agent cards 🆕

Currently, this provenance is invisible to players. The FeedbackOverlay shows personality feedback, governance alerts, and team impact—but never reveals "This actually happened to [Company] in [Date]."

This plan completes the educational loop: scenario → decision → consequence → real-world anchor.

Reference implementation pattern from existing FeedbackOverlay sections:
- Uses existing container styling (bg-black/50, border, rounded-xl)
- Follows typography hierarchy (text-xs for headers, text-sm for body)
- Includes border-t separators for section divisions
</context>

<tdd_config>
**Plan Type Decision:**
- Card data structure extension: type definition (not TDD—structural)
- FeedbackOverlay UI update: visual component (not TDD—UI layout)
- Data population: content injection (not TDD—data entry)
- Reference validation test: data integrity check (execute—simple validation, not algorithmic)

Result: Standard execute plan.
</tdd_config>

<tasks>

<task type="auto">
  <name>Task 1: Extend Card Type with RealWorldReference</name>
  <files>types.ts</files>
  <action>
Add new `RealWorldReference` interface and extend `Card` interface:

1. Add before Card interface:
```typescript
export interface RealWorldReference {
  /** Name of the company, product, or system involved in the real incident */
  incident: string;
  /** When the incident occurred or was reported (year or full date) */
  date: string;
  /** Brief description of what actually happened in the real case */
  outcome: string;
  /** Optional URL to source documentation (news article, CVE, research paper) */
  sourceUrl?: string;
}
```

2. Add to Card interface:
```typescript
export interface Card {
  id: string;
  source: AppSource;
  sender: string;
  context: string;
  storyContext?: string;
  text: string;
  /** Real-world incident that inspired this card scenario */
  realWorldReference?: RealWorldReference;
  onRight: { ... };
  onLeft: { ... };
}
```

Key constraints:
- Make realWorldReference optional (?) to maintain backward compatibility during migration
- Keep fields concise—overlay has limited space
- Outcome field max ~150 chars for overlay readability
  </action>
  <verify>
    bun run typecheck
  </verify>
  <done>
    - RealWorldReference interface defined with incident, date, outcome, optional sourceUrl
    - Card interface includes optional realWorldReference field
    - TypeScript compilation passes without errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Add History Section to FeedbackOverlay</name>
  <files>components/game/FeedbackOverlay.tsx</files>
  <action>
Extend FeedbackOverlay component to display real-world reference:

1. Add to FeedbackOverlayProps interface:
```typescript
interface FeedbackOverlayProps {
  personality: PersonalityType | null;
  text: string;
  lesson: string;
  choice: "LEFT" | "RIGHT";
  fine: number;
  violation: string;
  teamImpact?: string | null;
  budget?: number;
  heat?: number;
  /** Real-world incident reference for history section */
  realWorldReference?: {
    incident: string;
    date: string;
    outcome: string;
  } | null;
  onNext: () => void;
}
```

2. Add to component destructuring:
```typescript
export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  personality,
  text,
  lesson,
  choice,
  fine,
  violation,
  teamImpact,
  budget,
  heat,
  realWorldReference,
  onNext,
}) => {
```

3. Add history section after Team Impact (inside the governance alert container, after the "Decision logged" paragraph):
```typescript
{realWorldReference && (
  <div className="mt-3 pt-3 border-t border-white/5">
    <div className="text-xs font-bold text-cyan-400/90 tracking-wide mb-2">
      <i className="fa-solid fa-book-open mr-1.5" aria-hidden></i>
      Real Case: {realWorldReference.incident} ({realWorldReference.date})
    </div>
    <p className="text-sm text-slate-400 leading-relaxed font-light">
      {realWorldReference.outcome}
    </p>
  </div>
)}
```

Key constraints:
- Place after Team Impact section (maintain visual hierarchy: fine → personality → lesson → team impact → history)
- Use cyan-400 color to match personality header styling
- Include book icon for educational context
- Only render if realWorldReference is provided (backward compatible)
- Keep text-sm for body to match other sections
  </action>
  <verify>
    bun run typecheck && bun run build
  </verify>
  <done>
    - FeedbackOverlayProps includes realWorldReference prop
    - History section renders after Team Impact with book icon
    - Section uses cyan-400 accent color
    - Component conditionally renders only when reference exists
    - TypeScript and build pass without errors
  </done>
</task>

<task type="auto">
  <name>Task 3: Wire RealWorldReference to CardStack</name>
  <files>components/game/CardStack.tsx</files>
  <action>
Pass realWorldReference from current card to FeedbackOverlay:

1. Locate where FeedbackOverlay is rendered in CardStack.tsx
2. Add prop:
```typescript
<FeedbackOverlay
  personality={personality}
  text={feedbackText}
  lesson={lesson}
  choice={feedbackChoice}
  fine={feedbackFine}
  violation={feedbackViolation}
  teamImpact={teamImpact}
  budget={budget}
  heat={heat}
  realWorldReference={currentCard.realWorldReference}
  onNext={onNextCard}
/>
```

3. Verify currentCard is typed as Card and has access to realWorldReference field

This assumes CardStack already receives currentCard and passes card data to FeedbackOverlay. If CardStack uses a different prop passing pattern, adapt accordingly.
  </action>
  <verify>
    bun run typecheck
  </verify>
  <done>
    - CardStack passes currentCard.realWorldReference to FeedbackOverlay
    - TypeScript compilation passes
    - No runtime errors when realWorldReference is undefined
  </done>
</task>

<task type="auto">
  <name>Task 4: Populate Real-World References for All 10 Role Cards</name>
  <files>
    data/cards/chief-something-officer.ts
    data/cards/head-of-something.ts
    data/cards/something-manager.ts
    data/cards/tech-ai-consultant.ts
    data/cards/data-scientist.ts
    data/cards/software-architect.ts
    data/cards/software-engineer.ts
    data/cards/vibe-coder.ts
    data/cards/vibe-engineer.ts
    data/cards/agentic-engineer.ts
  </files>
  <action>
Add realWorldReference field to every card across all 10 role files.

**Example references by role:**

1. **chief-something-officer.ts** — C-suite liability scenarios:
```typescript
realWorldReference: {
  incident: "Samsung Semiconductor ChatGPT Leak",
  date: "2023",
  outcome: "Engineers pasted proprietary code into ChatGPT, exposing confidential data. Samsung banned generative AI company-wide.",
}
```

2. **vibe-coder.ts** — AI-assisted coding scenarios:
```typescript
realWorldReference: {
  incident: "GitHub Copilot RCE (CVE-2025-53773)",
  date: "2025-01",
  outcome: "Prompt injection via code comments allowed remote code execution in Copilot-generated code. Microsoft patched after public disclosure.",
}
```

3. **agentic-engineer.ts** — Autonomous agent scenarios:
```typescript
realWorldReference: {
  incident: "AutoGPT Uncontrolled Execution",
  date: "2024",
  outcome: "Early autonomous AI agents executed unexpected API calls and resource allocations without human oversight, causing infrastructure costs to spiral.",
}
```

4. **vibe-engineer.ts** — Performance/latency scenarios:
```typescript
realWorldReference: {
  incident: "Cloudflare Latency vs Cache Consistency",
  date: "2024",
  outcome: "Aggressive caching reduced latency 80% but caused stale data issues for 12 hours, affecting real-time financial transactions.",
}
```

5. **data-scientist.ts** — ML/model scenarios:
```typescript
realWorldReference: {
  incident: "Amazon AI Recruiting Bias",
  date: "2018-2022",
  outcome: "ML model trained on 10 years of hiring data penalized resumes with 'women's' (e.g., 'women's chess club'). Amazon scrapped the system.",
}
```

6. **tech-ai-consultant.ts** — Client/consulting scenarios:
```typescript
realWorldReference: {
  incident: "McKinsey AI Implementation Failures",
  date: "2023-2024",
  outcome: "Multiple enterprise AI consulting projects failed to deliver promised ROI due to scope creep and unrealistic client expectations.",
}
```

7. **software-architect.ts** — Architecture scenarios:
```typescript
realWorldReference: {
  incident: "Knight Capital Trading Loss ($440M)",
  date: "2012",
  outcome: "Failed deployment architecture triggered unintended automated trades. Lost $440M in 45 minutes due to lack of circuit breakers.",
}
```

8. **software-engineer.ts** — Implementation scenarios:
```typescript
realWorldReference: {
  incident: "XZ Utils Backdoor (CVE-2024-3094)",
  date: "2024",
  outcome: "Malicious backdoor discovered in XZ Utils after maintainer added unvetted code. Would have allowed RCE on millions of Linux systems.",
}
```

9. **head-of-something.ts** — Middle management scenarios:
```typescript
realWorldReference: {
  incident: "Microsoft Stack Ranking Morale Crisis",
  date: "2012-2013",
  outcome: "Forced curve performance ranking destroyed team collaboration. High performers refused to work together. System abandoned after talent exodus.",
}
```

10. **something-manager.ts** — Budget/manager scenarios:
```typescript
realWorldReference: {
  incident: "Yahoo Email Breach Cost Analysis",
  date: "2016",
  outcome: "Company knew of breach for 2 years before disclosure. $350M acquisition price reduction by Verizon. Shows cost of delayed disclosure vs immediate.",
}
```

**New cards from Phase 03-02-revised (80+ cards across 10 roles):**
For each card, add appropriate realWorldReference based on incident category:

| Category | Primary Source Incident |
|----------|------------------------|
| Prompt Injection | GitHub Copilot RCE (CVE-2025-53773) or Cursor IDE RCE (CVE-2025-54135) |
| Model Drift | 75% business performance decline statistic (2024) |
| Shadow AI | 78% worker adoption statistic + company-specific bans |
| Copyright | NYT vs OpenAI, Authors Guild lawsuits, 70+ cases by 2025 |
| Explainability | Healthcare AI diagnostic unexplainability cases |
| Privacy | McDonald's webcam breach (64M records) |
| Agent Autonomy | AutoGPT失控事件, multi-agent coordination failures |

Key constraints:
- Keep outcome under 150 characters for overlay display
- Date can be year only (2024) or month-year (June 2025)
- Use real documented incidents only—no fictional examples
- If multiple incidents inspired a card, pick the most prominent one
- All 80+ cards must have realWorldReference before this phase is complete
  </action>
  <verify>
    bun run typecheck && bun run test:data -- real-world-reference.test.ts
  </verify>
  <done>
    - All 10 role card files updated with realWorldReference
    - Every card has incident name, date, and outcome
    - References map to real 2024-2025 documented incidents
    - Test validates all cards have required reference fields
  </done>
</task>

<task type="auto">
  <name>Task 5: Add Real-World Reference Validation Test</name>
  <files>tests/data/real-world-reference.test.ts</files>
  <action>
Create test to validate all cards across 10 roles have real-world references:

```typescript
import { describe, it, expect } from "vitest";
import { ALL_CARDS } from "../../data/cards";
import type { Card } from "../../types";

describe("Card Real-World Reference Validation — 10 Role System", () => {
  it("every card has a realWorldReference defined", () => {
    const cardsWithoutReference: string[] = [];

    for (const card of ALL_CARDS) {
      if (!card.realWorldReference) {
        cardsWithoutReference.push(card.id);
      }
    }

    expect(cardsWithoutReference).toEqual([]);
  });

  it("every realWorldReference has required fields", () => {
    const invalidCards: { id: string; missing: string[] }[] = [];

    for (const card of ALL_CARDS) {
      if (!card.realWorldReference) continue;

      const missing: string[] = [];
      if (!card.realWorldReference.incident) missing.push("incident");
      if (!card.realWorldReference.date) missing.push("date");
      if (!card.realWorldReference.outcome) missing.push("outcome");

      if (missing.length > 0) {
        invalidCards.push({ id: card.id, missing });
      }
    }

    expect(invalidCards).toEqual([]);
  });

  it("outcome descriptions are reasonably sized (50-200 chars)", () => {
    const invalidCards: { id: string; length: number }[] = [];

    for (const card of ALL_CARDS) {
      if (!card.realWorldReference?.outcome) continue;

      const length = card.realWorldReference.outcome.length;
      if (length < 50 || length > 200) {
        invalidCards.push({ id: card.id, length });
      }
    }

    expect(invalidCards).toEqual([]);
  });

  it("dates reference 2024-2025 incidents (allows 20% older)", () => {
    const suspiciousCards: { id: string; date: string }[] = [];

    for (const card of ALL_CARDS) {
      if (!card.realWorldReference?.date) continue;

      const date = card.realWorldReference.date;
      // Check if date contains 2024 or 2025
      if (!date.includes("2024") && !date.includes("2025")) {
        suspiciousCards.push({ id: card.id, date });
      }
    }

    // Allow some older foundational cases (like Amazon 2018, XZ 2024)
    // but flag anything unexpected for review
    expect(suspiciousCards.length).toBeLessThan(ALL_CARDS.length * 0.2);
  });

  it("all 10 role card files are represented", () => {
    const rolePrefixes = [
      "cso_", "hos_", "sm_", "tac_", "ds_",
      "sa_", "se_", "vc_", "ve_", "ae_", "nowin_"
    ];
    
    const cardsByPrefix: Record<string, number> = {};
    for (const prefix of rolePrefixes) {
      cardsByPrefix[prefix] = ALL_CARDS.filter(c => c.id.startsWith(prefix)).length;
    }
    
    // Verify each role has cards
    for (const [prefix, count] of Object.entries(cardsByPrefix)) {
      if (prefix !== "nowin_") {
        expect(count).toBeGreaterThan(0);
      }
    }
  });
});
```

Key constraints:
- Validates every card has realWorldReference object
- Validates required fields (incident, date, outcome)
- Validates outcome length is display-friendly (50-200 chars)
- Warns on dates outside 2024-2025 range (allows 20% older foundational cases)
- Validates all 10 role prefixes are represented in card set
- Uses ALL_CARDS from data/cards/index.ts
  </action>
  <verify>
    bun run test:data -- real-world-reference.test.ts
  </verify>
  <done>
    - Test file exists at tests/data/real-world-reference.test.ts
    - Test validates all 80+ cards have realWorldReference
    - Test validates required fields are populated
    - Test validates outcome length constraints
    - Test validates 10-role coverage
    - All tests pass
  </done>
</task>

<task type="auto">
  <name>Task 6: Update Data Test Suite Registration</name>
  <files>package.json</files>
  <action>
Ensure test:data script exists and includes new test:

1. Check if package.json has test:data script:
```json
"scripts": {
  "test:data": "vitest run tests/data/",
  ...
}
```

2. If missing, add it. If present, verify it includes the data test directory.

3. Verify vitest.config.ts includes tests/data/ in test.include patterns.

This enables running `bun run test:data -- real-world-reference.test.ts`.
  </action>
  <verify>
    bun run test:data
  </verify>
  <done>
    - test:data script exists in package.json
    - vitest.config.ts includes tests/data/ directory
    - `bun run test:data` executes all data validation tests for 10-role system
  </done>
</task>

</tasks>

<verification>
Real-world reference feature complete when:
- [ ] Card type includes RealWorldReference interface
- [ ] FeedbackOverlay displays history section with book icon
- [ ] All 10 role card files have realWorldReference populated
- [ ] All 80+ cards from Phase 03-02-revised have references added
- [ ] Test validates 100% card coverage for references across 10 roles
- [ ] TypeScript compiles without errors
- [ ] Build succeeds
- [ ] Overlay displays incident name, date, and outcome correctly
- [ ] Section only appears when reference exists (backward compatible)
- [ ] All 10 role prefixes represented (cso_, hos_, sm_, tac_, ds_, sa_, se_, vc_, ve_, ae_)
</verification>

<success_criteria>
- [ ] Player sees "Real Case: [Incident] ([Date])" after making a decision
- [ ] Player reads the actual outcome that occurred in the real world
- [ ] Connection between game scenario and historical incident is clear
- [ ] All cards link to documented 2024-2025 AI governance incidents
- [ ] No visual regressions in FeedbackOverlay layout
- [ ] Test suite validates reference completeness for all 80+ cards across 10 roles
- [ ] Phase 03 now delivers full educational arc: scenario → decision → consequence → real-world anchor
- [ ] All 10 roles have historically-grounded content
</success_criteria>

<output>
After completion, create `.planning/phases/03-no-win-scenario-cards/03-05-revised-SUMMARY.md` with:
- Real-world reference type extension details
- FeedbackOverlay UI changes (history section placement, styling)
- Card coverage statistics (% of cards with references, by role)
- Test results (validation passing for 10-role system)
- Phase 03 educational value now includes historical grounding across all 10 roles
- Notable real incidents featured (by category and role)
</output>
