# Phase 17 — Technical research

**Status:** Complete (sourced from implementation plan + code read)  
**Date:** 2026-03-25

## Problem statement

1. **`shuffleDeck`** ([`lib/deck.ts`](../../../lib/deck.ts)) may swap `onLeft`/`onRight` per card. Each side is a full **`ChoiceOutcome`**. [`useVoicePlayback`](../../../hooks/useVoicePlayback.ts) builds triggers as `feedback_${cardId}_${suffix}`. Files were generated with suffix **`left`/`right` meaning authoring arm** (which branch the VO was recorded for), not “whatever was on the left of the screen that day.” After swap, the **visible left choice** may be the **authoring-right** outcome — the trigger must follow **which outcome’s arm** was chosen, not a naive “user went left → play `_left`” rule.

2. **`App.tsx`** derives `currentCard` from `ROLE_CARDS[role][index]` while [`GameScreen`](../../../components/game/GameScreen.tsx) uses `effectiveDeck` → **pressure / countdown / team impact** can target the wrong card or ignore swap state.

3. **Duplicate cards** in [`data/cards/head-of-something.ts`](../../../data/cards/head-of-something.ts): `hos_shadow_ai_team_discovery` and `shadow_ai_hos_1` — identical player-facing copy, different ids and audio pairs.

4. **Roast cadence:** [`geminiLive.ts`](../../../services/geminiLive.ts) system instruction forces "1-3 sentences"; [`api/roast.ts`](../../../api/roast.ts) caps at 50 words.

## Validation Architecture

| Dimension | Approach |
|-----------|----------|
| **Unit** | Vitest: `shuffleDeck` sets `choiceSidesSwapped`; `authoringFeedbackStem` maps chosen presentation slot → correct `'left'|'right'` suffix; optional pure trigger string `feedback_${id}_${stem}`. |
| **Integration** | Existing Playwright `@smoke` / `@area:audio` after wiring; optional assert console `[Voice] Loading` path includes correct trigger. |
| **Manual** | Spot-check HoS + Roaster: after swap, audio matches **the line for the outcome text** shown in the slot you picked. |
| **Regression** | `history` / branching still store **presentation slot** `LEFT`/`RIGHT` (which choice); debrief and archetype logic unchanged. Audio layer adds **authoring stem** for file lookup only. |

## Key files

- [`types.ts`](../../../types.ts) — `Card`, `ChoiceOutcome`
- [`lib/deck.ts`](../../../lib/deck.ts) — shuffle + swap
- [`lib/feedbackAudioChoice.ts`](../../../lib/feedbackAudioChoice.ts) — (planned) `authoringFeedbackStem`
- [`App.tsx`](../../../App.tsx) — `applyChoice`, `FeedbackOverlayState`, `currentCard`
- [`hooks/useVoicePlayback.ts`](../../../hooks/useVoicePlayback.ts) — `feedbackVoiceTrigger`
- [`hooks/useIncidentPressure.ts`](../../../hooks/useIncidentPressure.ts) — consumes `currentCard`
- [`tests/voice-hos-critical-audio.spec.ts`](../../../tests/voice-hos-critical-audio.spec.ts)

## RESEARCH COMPLETE
