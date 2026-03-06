# Phase 12: Gameplay Tweaks & Card Variety - Research

**Researched:** 2026-03-06
**Domain:** Gameplay mechanics, card data model, UI source display
**Confidence:** MEDIUM

## Summary

Phase 12 has two parts: (1) **TWEAK-01/TWEAK-02** — shuffle deck and branching logic, which the ROADMAP marks as done but are **not implemented in code**; (2) **TWEAK-03/TWEAK-04** — extend `AppSource` and add new cards, which have existing plans (12-01, 12-02, 12-03).

For planning, the critical finding: **Shuffle and branching are aspirational, not shipped.** Every consumer (`useGameState`, `App.tsx`, `CardStack`, `GameScreen`) indexes `ROLE_CARDS[role]` directly. No shuffled copy is created on INITIALIZING→PLAYING. No conditional card injection exists; `history` records choices but nothing consumes it for branching.

The AppSource expansion and card additions are well-scoped. Plans 12-01 through 12-03 are valid for the current 6-role structure. Phase 02 (new roles) is deferred to Phase 08, so ROLE_CARDS will retain DEVELOPMENT/MARKETING/etc. until then.

**Primary recommendation:** Treat TWEAK-01 and TWEAK-02 as **planned but unimplemented**. Planner must either add tasks to implement them or update the roadmap to remove the checkmarks. For TWEAK-03/04, follow existing plans; add an `SOURCE_ICONS` (or similar) mapping so CardStack renders each AppSource with a distinct icon.

## Standard Stack

No new libraries. Uses existing stack:

| Asset | Version | Purpose |
|-------|---------|---------|
| Font Awesome 6 | 6.4.0 (CDN) | Source icons in card headers |
| TypeScript | ~5.8.2 | Type safety |
| React 19 | ^19.2.4 | UI |
| Vite | ^6.2.0 | Build |
| Playwright | ^1.58.2 | E2E verification |

## Architecture Patterns

### Card and Source Model (Current)

```
types.ts
├── enum AppSource { SLACK, EMAIL, TERMINAL, IDE }
├── interface Card { id, source, sender, context, text, onLeft, onRight, ... }
└── (no SOURCE_ICONS or SOURCE_LABELS)

data/cards/
├── development.ts | marketing.ts | management.ts | hr.ts | finance.ts | cleaning.ts
└── index.ts → ROLE_CARDS: Record<RoleType, Card[]>
```

### Deck Consumption (Current — No Shuffle)

```
App.tsx, useGameState, CardStack, GameScreen
└── cards = ROLE_CARDS[state.role]  // Direct reference, fixed order
```

### Recommended: AppSource → Icon Mapping

Mirror the `ROLE_ICONS` pattern from Phase 02 research. Add a single mapping consumed by CardStack:

```typescript
// data/sources.ts or in types.ts / a constants file
export const SOURCE_ICONS: Record<AppSource, string> = {
  [AppSource.SLACK]: "fa-hashtag",
  [AppSource.EMAIL]: "fa-envelope",
  [AppSource.TERMINAL]: "fa-terminal",
  [AppSource.IDE]: "fa-terminal",
  [AppSource.JIRA]: "fa-list-check",
  [AppSource.NOTION]: "fa-file-lines",
  [AppSource.MEETING]: "fa-users",
};
```

CardStack then uses `SOURCE_ICONS[card.source]` instead of the IDE-vs-else ternary.

### Recommended: Shuffle on Game Start (If Implementing TWEAK-01)

Shuffle must occur when transitioning INITIALIZING→PLAYING. Options:

1. **Store shuffled deck in state** — Add `shuffledDeck: Card[] | null` to GameState; set it in a STAGE_CHANGE to PLAYING. All consumers use `state.shuffledDeck ?? ROLE_CARDS[state.role]`.
2. **Shuffle in a ref at transition** — Use a ref in App that holds the shuffled deck; compute it in the countdown-complete effect; pass it down to GameScreen/CardStack.
3. **Derived deck in a hook** — `useShuffledDeck(role, stage)` returns shuffled copy when stage becomes PLAYING; memoized per role.

The reducer and GameScreen currently assume `cards = ROLE_CARDS[role]` and `currentCardIndex`. Shuffling does not change the index semantics—just the order of cards. `useBossFight` already has `_shuffleArray`; extract or reuse Fisher-Yates.

### Branching (If Implementing TWEAK-02)

Branching requires:

1. **Card definition** — Add optional `showIf?: { cardId: string; choice: "LEFT" | "RIGHT" }` to Card, or a `deckBuilder(history)` that returns filtered/ordered cards.
2. **Deck resolution** — Before gameplay, reduce the card list using `state.history`. Cards with `showIf` only appear when the condition matches.
3. **Index stability** — `currentCardIndex` refers to the resolved deck. Boss fight transition still uses `currentCardIndex >= cards.length`.

Simpler alternative: define "branch cards" as a separate pool; when certain choices are made, inject those cards into the deck at a defined position. This avoids changing the Card interface.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Shuffle algorithm | Custom sort/random | Fisher-Yates (existing `_shuffleArray` in useBossFight) | Correct, unbiased, O(n) |
| Icon mapping | Inline ternaries per source | `Record<AppSource, string>` + single lookup | Maintainable, one place to add sources |
| Branching logic | Ad-hoc conditionals in reducer | Declarative `showIf` or deck builder | Clear semantics, testable |

## Common Pitfalls

### Pitfall 1: Shuffle Mutating Source Data

**What goes wrong:** Calling `array.sort()` or mutating `ROLE_CARDS[role]` in place changes the original deck for future games.

**How to avoid:** Always shuffle a copy: `_shuffleArray([...ROLE_CARDS[role]])`.

### Pitfall 2: Source Icon Fallback Hiding New Sources

**What goes wrong:** Keeping `source === AppSource.IDE ? "fa-terminal" : "fa-hashtag"` means JIRA, NOTION, MEETING all render as hashtag.

**How to avoid:** Explicit mapping for every AppSource value. Switch or `SOURCE_ICONS[source]` with a sensible default only if a new enum is added before UI update.

### Pitfall 3: Incomplete Card Objects

**What goes wrong:** New cards missing `lesson`, `feedback` for all personalities, or `violation` strings—causing runtime errors or blank UI.

**How to avoid:** Follow the exact `Card` interface. Use existing cards as templates. Run `bun run build` and Playwright after each deck change.

### Pitfall 4: Phase 02 / 08 Role Migration

**What goes wrong:** Phase 02 (when un-deferred) introduces 10 new roles and ROLE_DECK_ALIASES. Current Phase 12 plans assume 6 roles. New cards go into development/marketing/etc. decks—which will be aliased, not replaced.

**How to avoid:** Phase 12 card additions remain valid. New cards live in the same deck files. When Phase 08 runs, ROLE_DECK_ALIASES will route new roles to these decks. No Phase 12 changes needed for that.

## Code Examples

### Fisher-Yates Shuffle (Existing)

```typescript
// hooks/useBossFight.ts
function _shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### Card Structure (Existing)

```typescript
// data/cards/development.ts
{
  id: "dev_1",
  source: AppSource.IDE,
  sender: "DEBUG_BOT",
  context: "CRITICAL BUG",
  storyContext: "...",
  text: "...",
  onRight: { label, hype, heat, fine, violation, feedback, lesson },
  onLeft: { label, hype, heat, fine, violation, feedback, lesson },
}
```

### Current CardStack Source Display (To Replace)

```tsx
// components/game/CardStack.tsx:75, 185
className={`fa-solid ${currentCard.source === AppSource.IDE ? "fa-terminal" : "fa-hashtag"}`}
```

Replace with lookup:

```tsx
className={`fa-solid ${SOURCE_ICONS[currentCard.source] ?? "fa-hashtag"}`}
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Single icon fallback (IDE vs else) | Explicit per-source mapping | New sources get appropriate icons |
| Static deck order | (Unimplemented) Shuffle on start | Replay variety |
| Linear card flow | (Unimplemented) Conditional injection | Consequence-driven variety |

## Open Questions

1. **Shuffle/Branching roadmap accuracy**
   - What we know: ROADMAP marks TWEAK-01 and TWEAK-02 as done.
   - What's unclear: No implementation exists.
   - Recommendation: Planner either implements them or updates ROADMAP to remove checkmarks and scope them into Phase 12.

2. **Font Awesome brand vs solid icons**
   - What we know: Project uses `fa-solid`. FA6 has `fa-brands fa-jira` for JIRA.
   - What's unclear: CDN load includes brands or solid only.
   - Recommendation: Prefer `fa-solid` icons (`fa-list-check`, `fa-file-lines`, `fa-users`) for consistency. Verify CDN includes `all.min.css` which has both.

## Sources

### Primary (HIGH confidence)
- Codebase: `types.ts`, `data/cards/*.ts`, `components/game/CardStack.tsx`, `hooks/useGameState.ts`, `App.tsx`
- ROADMAP.md, STATE.md, 12-01/12-02/12-03 PLAN files

### Secondary (MEDIUM confidence)
- Phase 02 RESEARCH: ROLE_ICONS pattern, Font Awesome usage
- useBossFight `_shuffleArray` implementation

### Tertiary (LOW confidence)
- WebSearch: Font Awesome 6 JIRA/Notion icon availability

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — No new deps; existing stack documented
- Architecture: MEDIUM — Shuffle/branching unimplemented; AppSource path is clear
- Pitfalls: HIGH — Codebase evidence for mutation, fallback, and Card shape risks

**Research date:** 2026-03-06
**Valid until:** 30 days (stable domain)
