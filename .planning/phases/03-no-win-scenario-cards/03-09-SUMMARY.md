---
phase: 03-no-win-scenario-cards
plan: "09"
subsystem: ui
tags:
  - no-win-simulation
  - neutral-framing
  - randomization
  - amber-cyan
  - deck-shuffle

requires:
  - phase: 03-08
    provides: Prior shuffle and branching infrastructure

provides:
  - Random left/right choice assignment at deck shuffle time
  - Neutral swipe preview colors (slate instead of green/red)
  - Neutral mobile swipe hints (slate instead of green/red)
  - Amber/cyan feedback framing (cost/no-cost instead of bad/good)
  - Amber/cyan CSS swipe gradients
  - Unit tests for swap logic with deterministic seeds

affects:
  - CardStack UI presentation
  - FeedbackOverlay feedback visualization
  - Deck shuffle behavior

tech-stack:
  added: []
  patterns:
    - "Deck-level transformation: Modify data at shuffle time rather than at presentation"
    - "Neutral status framing: Amber (cost) / Cyan (proceed) instead of moral colors"
    - "Statistical testing: Mock Math.random for deterministic test behavior"

key-files:
  created:
    - unit/deck.test.ts - Unit tests for shuffleDeck swap logic
  modified:
    - lib/deck.ts - Added random onLeft/onRight swap after Fisher-Yates shuffle
    - components/game/CardStack.tsx - Neutral swipe preview and hint colors
    - components/game/FeedbackOverlay.tsx - Amber/cyan status framing
    - index.html - Amber/cyan CSS swipe gradients

key-decisions:
  - "Deck-level swap vs presentation flip: Deck-level swap chosen for lower coupling"
  - "Amber/cyan framing: Replaces red/green moral judgment with cost/no-cost status signal"
  - "50% swap rate: Each card has independent 50% chance of side swap per game session"

requirements-completed: []

duration: 9min
completed: "2026-03-17"
---

# Phase 03 Plan 09: No-Win Neutral Framing Summary

**Randomized left/right choice assignment with amber/cyan neutral framing instead of green/red moral judgment**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-17T14:46:09Z
- **Completed:** 2026-03-17T14:55:47Z
- **Tasks:** 6
- **Files modified:** 5

## Accomplishments

- shuffleDeck randomly swaps onLeft/onRight for ~50% of cards per game session
- SwipePreview labels use neutral slate-200 (no green/red moral framing)
- Mobile swipe hints use neutral slate-300 (no directional color bias)
- FeedbackOverlay uses amber-400 for fines, cyan-400 for no-fine (cost/no-cost framing)
- CSS swipe gradients updated to amber/cyan with reduced opacity (0.15)
- 9 unit tests verify swap correctness, data integrity, and statistical distribution

## Task Commits

Each task was committed atomically:

1. **Task 1: Add random left/right swap to shuffleDeck** - `1e28ebd` (feat)
2. **Task 2: Neutralize CardStack swipe colors** - `f5d38a4` (feat)
3. **Task 3: Update FeedbackOverlay to amber/cyan framing** - `54b2cb7` (feat)
4. **Task 4: Update CSS swipe gradients to amber/cyan** - `b7b0216` (feat)
5. **Task 5: Unit test for deck swap logic** - `af8c95c` (test)
6. **Task 6: Run full test suite** - `6d8b67b` (test)

**Plan metadata:** [to be committed with SUMMARY.md]

## Files Created/Modified

- `lib/deck.ts` - Added random left/right swap logic after Fisher-Yates shuffle
- `components/game/CardStack.tsx` - Neutral colors for SwipePreview and mobile hints
- `components/game/FeedbackOverlay.tsx` - Amber/cyan status framing for feedback icons
- `index.html` - Updated CSS swipe gradients to amber/cyan, removed duplicate definition
- `unit/deck.test.ts` - New test file with 9 tests for swap logic

## Decisions Made

**Deck-level swap vs presentation flip:**
- Considered adding an `isFlipped` boolean to each card and handling the flip in UI components
- Rejected because every consumer of `onLeft`/`onRight` would need flipping awareness
- Chose deck-level swap: Transform data once at shuffle time, all downstream code works unchanged

**Amber/cyan color choice:**
- Amber (fine > 0): Signals "this had a cost" — factual, not punitive. Matches existing amber usage for high-heat warnings.
- Cyan (fine === 0): Signals "acknowledged, proceed" — neutral, matches the game's accent color.
- This replaces green (good) / red (bad) moral framing with a cost/no-cost status frame.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tests pass, TypeScript compiles without errors.

## Next Phase Readiness

- Neutral framing complete, ready for continued card content work
- Randomized choice placement ensures no directional bias in gameplay
- Unit test infrastructure in place for future deck logic changes

---
*Phase: 03-no-win-scenario-cards*
*Completed: 2026-03-17*
