# Phase 17: Shuffle-aware feedback TTS & content integrity

**Gathered:** 2026-03-25  
**Status:** Ready for execution  
**Source:** Cursor plan `fix_hos_audio_and_content` + codebase analysis

## Phase boundary

Deliver **correct Roaster feedback audio** for card choices after `shuffleDeck` randomly swaps `onLeft`/`onRight`, fix **incident pressure / countdown** using the same card instance as `CardStack` (`effectiveDeck`), remove **duplicate Head of Something** shadow-AI card, and **vary roast LLM prompts** so output is not locked to the same 1–3 sentence cadence.

Out of scope: regenerating all HoS audio; per-card TTS for every non-critical card; Phase 16 death-vector work.

## Locked decisions

- **Audio mapping (choice / outcome, not “direction”):** Pre-baked files `feedback_${cardId}_left|right` use suffixes that mean **authoring arm** — the `onLeft` vs `onRight` branch the line was recorded for at bake time, not “screen left” in the abstract. At runtime, the player **selects one of two visible choices** (each is a `ChoiceOutcome` shown in a presentation slot). Derive the file suffix from **which slot’s outcome was chosen** (`LEFT` | `RIGHT` gesture / button) plus whether sides were swapped: that yields the correct authoring stem for the clip that matches the **outcome text** they picked. Do **not** treat audio as “follow swipe direction”; treat it as “play the clip for this **chosen outcome’s** authoring arm.”
- **Flag placement:** Optional `choiceSidesSwapped` on `Card`; set explicitly `true`/`false` on every shuffled deck copy in `shuffleDeck` so code can map **chosen presentation slot → authoring stem** without re-deriving from copy text.
- **Pressure source:** `currentCard` in `App.tsx` during `PLAYING` must resolve from `state.effectiveDeck ?? ROLE_CARDS[role]` at `currentCardIndex`, matching `handleChoice`.
- **HoS duplicate:** Remove one of `hos_shadow_ai_team_discovery` vs `shadow_ai_hos_1` (same copy); prune `CRITICAL_HOS_CARDS`, generation scripts, tests, and **delete** orphan `public/audio/voices/roaster/feedback/feedback_<id>_*.{opus,mp3}` for removed id. Prefer keeping **`shadow_ai_hos_1`** and dropping **`hos_shadow_ai_team_discovery`** unless product prefers `hos_*` naming (document in commit).
- **Roast prompts:** Edit copy only in `services/geminiLive.ts` and `api/roast.ts` — no new APIs.

## Claude's discretion

- Exact helper name/location (`lib/feedbackAudioChoice.ts` vs inline); e.g. `authoringFeedbackStem(card, selectedPresentationSlot)` returning `'left' | 'right'` for the trigger.
- Whether to add a dedicated unit file for the helper vs `lib/deck.test.ts` only.
- E2E vs unit-only proof for voice path (prefer unit test on trigger string + existing `@area:audio` smoke).

## Deferred

- Replacing generic `feedback_ignore` / `feedback_install` for all decks with bespoke clips.

---

*Phase: 17-shuffle-aware-feedback-tts-fixes*
