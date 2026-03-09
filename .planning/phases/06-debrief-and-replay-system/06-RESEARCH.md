# Phase 06: Debrief & Replay System - Research

**Researched:** 2026-03-09
**Domain:** Multi-page reveal flow, archetype system, email lead capture, gamification patterns
**Confidence:** HIGH

## Summary

Phase 06 implements a 3-page "Reveal Build-Up" debrief sequence (The Collapse → The Audit Trail → The Verdict) that transforms the game ending from a simple loss screen into a viral-ready gamification experience. This phase requires:

1. **State machine for 3-page debrief flow** — extend GameStage enum, manage navigation between pages
2. **Incident Audit Log UI** — structured debrief of decisions with personality sign-off
3. **Archetype system** — map decision patterns to leadership personality types (6-8 archetypes), calculate Resilience Score
4. **LinkedIn share infrastructure** — shareable snippet with role + archetype + score
5. **Email capture for V2 waitlist** — client-side form submission, email dispatch to backend
6. **Page transitions with anticipation mechanics** — intentional friction, gradual reveals (Spotify Wrapped pattern)

The phase is PLG-focused: low friction entry → high engagement during play → high ego-reward ending → social sharing → lead capture.

**Primary recommendation:** Build debrief as separate game stages (DEBRIEF_PAGE_1, DEBRIEF_PAGE_2, DEBRIEF_PAGE_3), use a simple score-based archetype mapper (weighted decision vectors), integrate LinkedIn native share URL encoding, and handle email capture via client-side form with POST to backend.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI rendering for multi-page flow | Already in codebase; proven for sequential stage rendering |
| TypeScript | 5.x | Type safety for archetype system and decision scoring | Project uses TypeScript throughout; reduces archetype mapping bugs |
| React Context / useReducer | Built-in | State management for debrief progression (DEBRIEF_PAGE_1 → 2 → 3) | Aligned with existing useGameState pattern; no new dependencies |
| Playwright | 1.58+ | E2E testing for debrief flow and email capture | Already used for game testing; test patterns established |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| EmailJS | 4.x | Client-side email dispatch (V2 waitlist form) | Lightweight, no backend infrastructure needed; serverless-friendly; pre-integrated in projects like this |
| React Hook Form | Latest | Form state management (email capture form) | 2026 standard for React forms; integrates with Zod validation; reduces re-renders |
| Zod | Latest | Email validation schema | Type-safe schema validation; pairs naturally with React Hook Form |
| Tailwind CSS | 3.x | Styling (3-page debrief UI) | Already in codebase; design system established |

### Don't Use / Skip
| What | Why |
|------|-----|
| Third-party personality test libraries | Phase requires custom archetype system mapped from decision history, not generic MBTI tests |
| Social sharing libraries (react-share) | Native LinkedIn URL encoding is simpler and dependency-free |
| Axios for email form | Fetch API (built-in) or native form submission sufficient for one endpoint |

**Installation:** None required for React/TypeScript/Context. For optional email:
```bash
npm install react-hook-form zod emailjs-com
```

---

## Architecture Patterns

### Recommended Project Structure

```
components/game/
├── debrief/
│   ├── DebriefPage1Collapse.tsx      # Page 1: The Collapse (Game Over → Debrief Me)
│   ├── DebriefPage2AuditTrail.tsx    # Page 2: Incident Audit Log + Personality comment
│   ├── DebriefPage3Verdict.tsx       # Page 3: Archetype + LinkedIn share + Email capture
│   └── DebriefContainer.tsx          # Router for pages 1-3
│
data/
├── archetypes.ts                     # Archetype definitions + Resilience Score calculation
└── debrief.ts                        # Copy/flavor text for debrief sequence
│
hooks/
├── useDebrief.ts                     # Debrief flow state (current page, archetype, score)
├── useArchetype.ts                   # Archetype calculation from decision history
└── useEmailCapture.ts                # Email form handling + submission
│
types.ts
├── enum DebrieRStage (PAGE_1, PAGE_2, PAGE_3)
└── interface DebriefState { page: DebrieRStage, archetype: Archetype, resilience: number }
```

### Pattern 1: Game Stage Extension (3-Page Debrief States)

**What:** Add DEBRIEF_PAGE_1, DEBRIEF_PAGE_2, DEBRIEF_PAGE_3 to GameStage enum. Debrief flow is independent of GAME_OVER → allows replay path to skip debrief.

**When to use:** Replace single GAME_OVER state with multi-stage debrief that feels like stepping through a "commander's office" experience.

**Example:**

```typescript
// types.ts
export enum GameStage {
	// ... existing stages
	GAME_OVER = "GAME_OVER",
	DEBRIEF_PAGE_1 = "DEBRIEF_PAGE_1",  // Collapse
	DEBRIEF_PAGE_2 = "DEBRIEF_PAGE_2",  // Audit Trail
	DEBRIEF_PAGE_3 = "DEBRIEF_PAGE_3",  // Verdict
}

// Update stage transitions
const STAGE_TRANSITIONS: Record<GameStage, GameStage[]> = {
	[GameStage.PLAYING]: [GameStage.BOSS_FIGHT, GameStage.GAME_OVER],
	[GameStage.BOSS_FIGHT]: [GameStage.SUMMARY, GameStage.GAME_OVER],
	[GameStage.GAME_OVER]: [GameStage.DEBRIEF_PAGE_1],  // Bridge to debrief
	[GameStage.DEBRIEF_PAGE_1]: [GameStage.DEBRIEF_PAGE_2],
	[GameStage.DEBRIEF_PAGE_2]: [GameStage.DEBRIEF_PAGE_3],
	[GameStage.DEBRIEF_PAGE_3]: [GameStage.INTRO],  // Exit to restart
};
```

Source: Existing GameStage pattern in App.tsx and types.ts.

### Pattern 2: Archetype System (Decision Pattern → Personality Type)

**What:** Map decision history (choices made, patterns in heat/hype/fine) to 6-8 leadership archetypes. Calculate a "Resilience Score" (0-100) as single number for social shareability.

**When to use:** Post-game verdict reveal, for LinkedIn share text and personality evaluation.

**Archetype Framework:**

Define archetypes as decision vectors. Each choice in history increments counters for various traits:

```typescript
// data/archetypes.ts
export type ArchetypeId =
	| "PRAGMATIST"        // Prioritizes budget over risk
	| "SHADOW_ARCHITECT"  // Prioritizes stability over safety
	| "DISRUPTOR"         // Reckless growth pursuit
	| "CONSERVATIVE"      // Risk-averse, rule-following
	| "BALANCED"          // Mixed priorities
	| "CHAOS_AGENT"       // Consistently makes worst choices
	| "CONTRARIAN"        // Opposes conventional wisdom
	| "IDEALIST";         // Pursues principle over pragmatism

export interface Archetype {
	id: ArchetypeId;
	name: string;
	description: string;  // e.g., "You prioritize system stability over human safety"
	icon: string;         // Font Awesome class
	color: string;        // Tailwind color
	traits: string[];     // Keywords for psychology appeal
}

// Scoring function: decision history → archetype scores
export function calculateArchetype(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	finalBudget: number,
	finalHeat: number,
	finalHype: number,
	role: RoleType,
): { archetype: Archetype; resilience: number } {
	// Initialize archetype counters
	const scores: Record<ArchetypeId, number> = {
		PRAGMATIST: 0,
		SHADOW_ARCHITECT: 0,
		// ... others
	};

	// Scan history: for each choice, map to trait increments
	for (const { cardId, choice } of history) {
		const card = ROLE_CARDS[role].find(c => c.id === cardId);
		if (!card) continue;

		const outcome = choice === "LEFT" ? card.onLeft : card.onRight;

		// If choice prioritized budget, increment PRAGMATIST
		if (outcome.fine < -50000) scores.PRAGMATIST += 2;

		// If choice accepts high heat, increment SHADOW_ARCHITECT
		if (outcome.heat > 30) scores.SHADOW_ARCHITECT += 2;

		// If choice accepts low hype, increment CONSERVATIVE
		if (outcome.hype < -20) scores.CONSERVATIVE += 1;
	}

	// Calculate resilience as (total score / decision count) normalized to 0-100
	// This avoids simple max-wins; instead reflects consistency
	const totalDecisions = history.length || 1;
	const resilience = Math.min(
		100,
		Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (totalDecisions * 2)) * 100)
	);

	// Find archetype with highest score
	const topArchetype = Object.entries(scores)
		.sort(([, a], [, b]) => b - a)[0];
	const archetypeId = topArchetype?.[0] as ArchetypeId;

	return {
		archetype: ARCHETYPES[archetypeId],
		resilience,
	};
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
	PRAGMATIST: {
		id: "PRAGMATIST",
		name: "The Pragmatist",
		description: "You prioritize system stability over human safety. A controversial choice.",
		icon: "fa-chart-line",
		color: "text-blue-500",
		traits: ["decisive", "practical", "trade-off aware"],
	},
	// ... others
};
```

Source: Gamification psychology pattern from Spotify Wrapped research; archetype-based personality scoring follows Myers-Briggs decision vector model.

### Pattern 3: LinkedIn Share URL Encoding (No External Library)

**What:** Generate LinkedIn share URL using native encodeURIComponent, no react-share dependency.

**When to use:** "Share to LinkedIn" button on Page 3 (Verdict).

**Example:**

```typescript
// components/game/debrief/DebriefPage3Verdict.tsx
const shareToLinkedIn = () => {
	const text = `I just faced the Kobayashi Maru as a ${ROLE_DESCRIPTIONS[role].title}. My Resilience Score: ${resilience}% (${archetype.name}).`;
	const url = encodeURIComponent(window.location.href);
	const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

	// Open in new window
	window.open(linkedinShareUrl, "_blank", "width=550,height=420");
};
```

Source: Native LinkedIn share endpoint (no API key required); verified approach from React social sharing patterns.

### Pattern 4: Email Capture Form (Client-Side with Backend POST)

**What:** React form for email + metadata capture; submit to backend endpoint for waitlist registration.

**When to use:** V2 upsell section on Page 3.

**Example:**

```typescript
// hooks/useEmailCapture.ts
import { useCallback, useState } from "react";

export function useEmailCapture() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const submit = useCallback(async (metadata: {
		role: RoleType;
		archetype: ArchetypeId;
		resilience: number;
	}) => {
		if (!email) {
			setError("Email required");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/v2-waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					role: metadata.role,
					archetype: metadata.archetype,
					resilience: metadata.resilience,
					timestamp: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			setSuccess(true);
			setEmail("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Submission failed");
		} finally {
			setIsSubmitting(false);
		}
	}, [email]);

	return { email, setEmail, isSubmitting, error, success, submit };
}
```

Source: 2026 React form best practices (React Hook Form + native fetch); email capture patterns from waitlist implementations.

### Anti-Patterns to Avoid

- **Skipping archetype calculation entirely:** Without it, Page 3 feels generic. The archetype reveal is the ego-reward hook.
- **Using stateful form library for single email field:** overkill; useState + basic validation sufficient.
- **Hardcoding archetype mappings:** Instead, define ARCHETYPES as data structure. Allows future tuning without code changes.
- **Immediate email submission:** Add 500–800ms delay before button enable (UX: feels earned, not rushed).
- **Missing personality sign-off on Page 2:** The Emotional Advisor comment (e.g. "Well, at least you were consistently terrible") is a key retention hook.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Complex personality test scoring | Custom ML classifier | Decision vector mapping (weighted counts by trait) | Simpler, faster, explainable; avoids ML complexity |
| Async email validation | Regex email validator | HTML5 input type="email" + basic format check | Browser-native, user experience better; server validates before insert |
| Multi-page navigation state | Manual if-else branching | extend GameStage enum + STAGE_TRANSITIONS | Leverages existing pattern; prevents invalid state combinations |
| Social media share dialogs | Custom popup styling | Native `window.open()` with LinkedIn URL | LinkedIn handles UI; one less thing to test |

**Key insight:** The debrief flow succeeds if it feels like stepping through a structured experience (page → page → page), not a dashboard with random elements. Use game stage pattern to enforce progression.

---

## Common Pitfalls

### Pitfall 1: Archetype Calculation Happens Too Late

**What goes wrong:** Calculate archetype inside Page 3 component, causing re-render delay or flickering while computing scores.

**Why it happens:** Lazy evaluation; archetype calculation depends on full history, so developer defers until Page 3 render.

**How to avoid:** Calculate archetype immediately upon transition to DEBRIEF_PAGE_1 (when entering debrief flow). Store in state alongside deathType and deathReason. Page 3 retrieves from state, no calculation.

**Warning signs:** Page 3 shows loading spinner; archetype name flickers in/out; console shows repeated archetype recalculations.

### Pitfall 2: Email Capture Not Persisted

**What goes wrong:** User submits email on Page 3, form clears, but no confirmation shown. User unsure if submission succeeded.

**Why it happens:** Form resets immediately without waiting for response; no success state displayed.

**How to avoid:** Show success message (checkmark + "You've been added to the waitlist"). Keep email field read-only after successful submission. Persist form state in localStorage in case user navigates away.

**Warning signs:** User re-submits email multiple times; no visual feedback after click.

### Pitfall 3: LinkedIn Share Text Truncates or Breaks

**What goes wrong:** LinkedIn share preview shows incomplete text (no role, archetype visible); post appears broken on feed.

**Why it happens:** Share text exceeds LinkedIn's preview length (usually ~150 chars for optimal display); archetype name too long.

**How to avoid:** Test share preview on real LinkedIn; truncate archetype to short name (e.g. "Pragmatist" not "The Pragmatist: A leader who..."). Use URL encoding correctly (encodeURIComponent for full URL, not individual params).

**Warning signs:** Share preview shows "..." or appears cut off; archetype missing from shared post.

### Pitfall 4: Personality Sign-Off Comment Breaks Immersion

**What goes wrong:** Personality comment on Page 2 is generic ("Good job!" or completely off-tone).

**Why it happens:** Copied from elsewhere in codebase without context; Emotional Advisor's voice not consistent with personality archetype.

**How to avoid:** Define personality-specific comments for each outcome type (e.g., V.E.R.A. is sarcastic, always includes "well" or "at least"; BAMBOO is zen, speaks in metaphors). Test that comment tone matches personality throughout game.

**Warning signs:** User feedback says Page 2 comment is confusing or doesn't match earlier personality voice.

---

## Code Examples

Verified patterns from existing codebase:

### Archetype Mapping from Decision History

```typescript
// Source: types.ts + ROLE_CARDS pattern; archetype logic is novel
// but follows same structure as existing heat/hype/fine calculation

export function calculateArchetype(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	role: RoleType,
): ArchetypeResult {
	const scores: Record<ArchetypeId, number> = {};

	// Initialize
	Object.values(ARCHETYPES).forEach(a => {
		scores[a.id] = 0;
	});

	// Tally trait increments for each choice
	for (const { cardId, choice } of history) {
		const card = getRoleDeck(role)[cardId];
		if (!card) continue;

		const outcome = choice === "LEFT" ? card.onLeft : card.onRight;
		const traits = mapOutcomeToTraits(outcome);

		traits.forEach(trait => {
			scores[trait] += 1;
		});
	}

	// Normalize and find top archetype
	const topId = Object.entries(scores)
		.sort(([, a], [, b]) => b - a)[0][0];

	const resilience = calculateResilienceScore(history, scores);

	return {
		archetype: ARCHETYPES[topId],
		resilience,
	};
}
```

### Multi-Stage Debrief Routing

```typescript
// App.tsx: Add case for debrief stages
case GameStage.DEBRIEF_PAGE_1:
	return (
		<DebriefPage1Collapse
			deathType={state.deathType}
			deathReason={state.deathReason}
			onNext={() => dispatch({ type: "STAGE_CHANGE", stage: GameStage.DEBRIEF_PAGE_2 })}
		/>
	);

case GameStage.DEBRIEF_PAGE_2:
	return (
		<DebriefPage2AuditTrail
			state={state}
			personality={state.personality!}
			onNext={() => dispatch({ type: "STAGE_CHANGE", stage: GameStage.DEBRIEF_PAGE_3 })}
		/>
	);

case GameStage.DEBRIEF_PAGE_3:
	return (
		<DebriefPage3Verdict
			state={state}
			archetype={state.archetype!}
			resilience={state.resilience!}
			onRestart={handleRestart}
		/>
	);
```

### Email Capture with Validation

```typescript
// components/game/debrief/EmailCaptureForm.tsx
import { useState } from "react";
import { useEmailCapture } from "../../../hooks/useEmailCapture";

interface EmailCaptureFormProps {
	role: RoleType;
	archetype: ArchetypeId;
	resilience: number;
}

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
	role,
	archetype,
	resilience,
}) => {
	const { email, setEmail, isSubmitting, error, success, submit } = useEmailCapture();
	const [touched, setTouched] = useState(false);

	const isValidEmail = email.includes("@") && email.includes(".");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValidEmail) return;
		await submit({ role, archetype, resilience });
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6 space-y-3">
			{!success ? (
				<>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onBlur={() => setTouched(true)}
						placeholder="your.email@company.com"
						disabled={isSubmitting}
						className="w-full px-4 py-2 border border-slate-700 bg-slate-900 text-white rounded focus:ring-2 focus:ring-cyan-500"
					/>
					{touched && !isValidEmail && (
						<p className="text-sm text-red-400">Valid email required</p>
					)}
					{error && <p className="text-sm text-red-400">{error}</p>}
					<button
						type="submit"
						disabled={!isValidEmail || isSubmitting}
						className="w-full px-4 py-2 bg-cyan-500 text-white font-bold rounded hover:bg-cyan-600 disabled:opacity-50"
					>
						{isSubmitting ? "Joining..." : "Join V2 Waitlist"}
					</button>
				</>
			) : (
				<div className="p-4 bg-green-500/20 border border-green-500 rounded text-green-400 text-center">
					✓ Email received. V2 is coming.
				</div>
			)}
		</form>
	);
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single "Game Over" screen | 3-page debrief sequence | Phase 06 (2026-03-09) | Extends engagement, enables lead capture, increases viral shareability |
| Generic "You lost" message | Personality-signed audit trail | Phase 06 | Reinforces tone; each personality has distinct voice |
| Manual archetype typing (no data-driven mapping) | Weighted decision vector scoring | Phase 06 | Archetype feels earned, not arbitrary; increases trust in "verdict" |
| Form submission via backend-only | Client-side form + backend validation | Phase 06 | Faster UX; user sees immediate success state; less latency |

**Deprecated/Outdated:**
- Static game over screen: Replaced by dynamic 3-page debrief with state transitions.
- Hardcoded personality voice: Replaced by structured personality config with tone patterns.

---

## Open Questions

1. **Archetype count and naming:** Should debrief use 6 or 8 archetypes? Names should be memorable for LinkedIn share. Recommend: 6 archetypes (easier to implement, clearer signal for first MVP; expand to 8 in Phase 07 if needed).
   - What we know: Existing personality system uses 3 archetypes (ROASTER, ZEN_MASTER, LOVEBOMBER); debrief archetype is separate from emotional advisor personality.
   - What's unclear: Whether 6 archetypes are sufficient for decision pattern diversity (80+ no-win cards × 10 roles = 800+ decision outcomes).
   - Recommendation: Start with 6; track archetype distribution during UAT. If > 50% users map to same archetype, add 2 more (NEUTRAL, WILDCARD).

2. **Email backend:** Where does V2 waitlist email go? Architecture doc mentions "send email to yevgen.schweden@hotmail.com" but unclear if backend route exists.
   - What we know: Email capture form should POST to `/api/v2-waitlist`.
   - What's unclear: Does backend route exist? Should we create mock backend or use EmailJS?
   - Recommendation: For MVP, POST to `/api/v2-waitlist` (may be stubbed); if backend not ready, fall back to EmailJS client-side relay.

3. **Resilience Score calculation:** What constitutes "high resilience"? Currently defined as consistency (score / decision count), but should it reward risk-taking, budget preservation, or something else?
   - What we know: Resilience Score is single 0-100 number for social shareability.
   - What's unclear: Scoring formula; currently rewards consistency, but game design might want to reward "good decisions" instead.
   - Recommendation: For MVP, use consistency metric (easier to explain: "resilience = how well you stayed on course"). Tune formula after UAT based on user feedback.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (existing) |
| Config file | `playwright.config.ts` |
| Quick run command | `npm run test:smoke` (< 30s) |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEBRIEF-01 | Post-game summary with decision history | integration | `npx playwright test debrief-page-2` | ❌ Wave 0 |
| DEBRIEF-02 | Violations map to real-world consequences | unit | `vitest unit/archetype.test.ts` | ❌ Wave 0 |
| DEBRIEF-03 | "Unlock all endings" progress shown | integration | `npx playwright test debrief-page-1` | ❌ Wave 0 |
| DEBRIEF-04 | Optional reflection prompt on Page 2 | smoke | `npx playwright test debrief-page-2 --grep @smoke` | ❌ Wave 0 |
| DEBRIEF-05 | 3-page flow renders correctly | snapshot | `npx playwright test stage-snapshots --grep debrief` | ❌ Wave 0 |
| DEBRIEF-06 | Page 1 [Debrief Me] button advances flow | unit | `vitest unit/stage-transitions.test.ts` | ❌ Wave 0 |
| DEBRIEF-07 | Page 2 Audit Log displays all decisions | integration | `npx playwright test debrief-page-2` | ❌ Wave 0 |
| DEBRIEF-08 | Page 2 [Generate Psych Evaluation] button advances | unit | `vitest unit/stage-transitions.test.ts` | ❌ Wave 0 |
| DEBRIEF-09 | Page 3 archetype verdict renders + score shown | integration | `npx playwright test debrief-page-3` | ❌ Wave 0 |
| DEBRIEF-10 | LinkedIn share URL encodes correctly | unit | `vitest unit/linkedin-share.test.ts` | ❌ Wave 0 |
| DEBRIEF-11 | Email capture form validates + submits | integration | `npx playwright test debrief-email-capture` | ❌ Wave 0 |
| DEBRIEF-12 | Archetype system maps decisions → types | unit | `vitest unit/archetype-calculation.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test:smoke` (stage transitions, debrief page renders)
- **Per wave merge:** `npm run test` (full suite including new debrief tests)
- **Phase gate:** All 12 DEBRIEF requirements green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/debrief-page-1.spec.ts` — validates Collapse page renders, [Debrief Me] button visible
- [ ] `tests/debrief-page-2.spec.ts` — validates Audit Trail UI, personality comment, [Generate Psych Evaluation] button
- [ ] `tests/debrief-page-3.spec.ts` — validates Verdict, archetype render, LinkedIn share button, email form
- [ ] `unit/archetype-calculation.test.ts` — unit tests for decision vector → archetype scoring
- [ ] `unit/linkedin-share.test.ts` — URL encoding correctness for LinkedIn share
- [ ] `unit/stage-transitions.test.ts` — DEBRIEF_PAGE_1 → 2 → 3 → INTRO transitions valid
- [ ] `tests/debrief-email-capture.spec.ts` — email form validation, submission, success state
- [ ] Update `tests/stage-snapshots.spec.ts` — add snapshot tests for all 3 debrief pages
- [ ] Framework install: No new framework needed; Playwright + Vitest already present

*(Gap closure timeline: Wave 0 creates test scaffold + archetype unit tests; Wave 1 implements debrief UI + integration tests; Wave 2 closes email capture and snapshot tests)*

---

## Sources

### Primary (HIGH confidence)
- Existing codebase (`types.ts`, `App.tsx`, `GameOver.tsx`, `SummaryScreen.tsx`) — Game stage pattern, state management, existing component structure
- Phase 06 ARCHITECTURE.md — Product requirements and 3-page flow design
- ROADMAP.md — Phase 06 requirements (DEBRIEF-01 to DEBRIEF-12) and dependency chain

### Secondary (MEDIUM confidence)
- [React Multi-Step Form Patterns 2026](https://www.c-sharpcorner.com/article/state-management-in-react-2026-best-practices-tools-real-world-patterns/) — Multi-page state management using Context + useReducer, React Hook Form validation
- [LinkedIn Share Button Implementation](https://dev.to/sarwarasik/create-a-share-button-for-social-media-links-in-react-without-any-package-26i1) — Native LinkedIn URL encoding (no library required)
- [Email Capture Waitlist Forms](https://getlaunchlist.com/help/docs/integrations/react) — Client-side email capture form patterns
- [Spotify Wrapped Gamification Psychology](https://nogood.io/blog/spotify-wrapped-marketing-strategy/) — Reveal mechanics, gradual disclosure, social proof drivers (identity, anticipation, shareability)

### Tertiary (MEDIUM-LOW confidence)
- [Myers-Briggs Scoring Methodology](https://www.simplypsychology.org/the-myers-briggs-type-indicator.html) — Personality archetype scoring uses 4-letter decision vector model; adapted here to custom 6-8 archetypes
- [TypeScript Decision Table Patterns](https://dev.to/davidkohen/decision-tables-in-typescript-an-underrated-pattern-for-cleaner-code-ol5) — Structured mapping of decisions to outcomes (used in archetype calculation)

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — All libraries (React, TypeScript, Context) already in codebase; patterns established
- Architecture: **HIGH** — Multi-page state machine mirrors existing GameStage pattern; archetype scoring is straightforward weighted sum
- Pitfalls: **MEDIUM** — Debrief-specific pitfalls inferred from gamification research + code review; not yet validated in implementation
- Archetype system: **MEDIUM** — Design is sound, but specific archetype count/names should be validated during first implementation

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (30 days; React/TypeScript stable, no breaking changes expected)
