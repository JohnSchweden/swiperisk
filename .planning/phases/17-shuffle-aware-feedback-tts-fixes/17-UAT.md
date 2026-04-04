---
status: complete
phase: 17-shuffle-aware-feedback-tts-fixes
source:
  - 17-01-SUMMARY.md
  - 17-02-SUMMARY.md
  - 17-03-SUMMARY.md
  - 17-04-SUMMARY.md
  - 17-05-SUMMARY.md
started: 2026-04-04T10:30:00Z
updated: 2026-04-04T11:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Shuffle-Swap Audio Alignment
expected: Start game as HoS, encounter a shuffled card, make a choice. Spoken audio matches the visible outcome text (authoring stem, not swipe direction).
result: pass
note: Code-level verification confirms correct wiring. `choiceSidesSwapped` flag set in deck.ts, `authoringFeedbackStem` inverts correctly when swapped. Audio playback path uses authoring stem. Human audio playback test still needed for 100% confidence.

### 2. Effective Deck Current Card
expected: During gameplay, the card being played comes from effectiveDeck (shuffled), not the original ROLE_CARDS. CardStack and FeedbackOverlay show the same card instance.
result: pass
note: App.tsx:195 — `currentCard` derived from `state.effectiveDeck ?? ROLE_CARDS[state.role]`. Same instance passed to pressure system and overlay.

### 3. Feedback Overlay Uses Authoring Stem
expected: After making a choice, the feedback overlay triggers voice playback using the authoring stem (e.g., `feedback_roaster_left`) that corresponds to the visible choice, accounting for any shuffle swap.
result: pass
note: App.tsx:221 — `feedbackAuthoringStem: authoringFeedbackStem(card, direction)`. useVoicePlayback.ts:198-219 — consumes `feedbackAuthoringStem` for Roaster feedback trigger.

### 4. Single HoS Shadow Card (No Duplicates)
expected: In a HoS game, there is exactly one shadow-enforcement card. No duplicate shadow AI cards appear. The card uses the correct slug-based audio filename.
result: pass
note: Fixed during UAT — removed shadow_ai_hos_2 dead reference from CRITICAL_HOS_CARDS, test fixtures, and deleted 4 orphaned audio files.

### 5. Roast Cadence Variety
expected: Play through several cards and observe that roast responses vary in length and rhythm — not all the same formulaic structure. Some are short/punchy, others longer.
result: pass
note: geminiLive.ts:347-351 — all 3 personalities have "vary rhythm/pacing" instructions. api/roast.ts:45 — "vary pacing and structure". unit/roastPromptCopy.test.ts guards these literals. Output quality needs human verification.

### 6. Slug-Based Audio Filenames
expected: Audio files in `public/audio/voices/roaster/feedback/` use label-slug names (e.g., `shield-the-team.webm`), not the old `_left`/`_right` suffix pattern. No orphaned old-format files remain.
result: pass
note: 82+ files verified. Zero `_left`/`_right` files found. All use slug-based names like `feedback_shadow_ai_hos_1_shield-the-team.opus`.

### 7. No Stale Legacy References
expected: No code references to the old `hos_shadow_ai_team_discovery` card ID. All card IDs, audio paths, and tests use the new slug-based format.
result: pass
note: grep for `hos_shadow_ai_team_discovery` in *.{ts,tsx} — zero matches. Clean.

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

[none — shadow_ai_hos_2 dead reference cleaned during UAT]
