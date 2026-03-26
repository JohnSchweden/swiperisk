---
phase: 17-shuffle-aware-feedback-tts-fixes
plan: "04"
subsystem: feedback-audio
tags: [type-safety, audio, slug, feedback]
dependency_graph:
  requires:
    - 17-02
  provides:
    - slugified-label-stems
    - string-typed-call-chain
  affects:
    - 17-05
tech_stack:
  added: []
  patterns:
    - slug-based filename routing
    - selectedSlot for non-critical fallback
key_files:
  modified:
    - lib/feedbackAudioChoice.ts
    - unit/feedbackAudioChoice.test.ts
    - App.tsx
    - hooks/useVoicePlayback.ts
  created: []
decisions:
  - "Added selectedSlot alongside feedbackAuthoringStem to preserve non-critical card fallback clip routing without card data in feedbackVoiceTrigger"
  - "Duplicated slugify in lib/feedbackAudioChoice.ts rather than importing from data/imageMap.ts (layer boundary: lib is not data)"
metrics:
  duration: "3 min"
  completed: "2026-03-26T23:34:11Z"
  tasks_completed: 2
  files_changed: 4
  commits: 2
---

# Phase 17 Plan 04: Migrate authoringFeedbackStem to Label Slugs — Summary

**One-liner:** `authoringFeedbackStem` returns slugified outcome labels instead of `"left"|"right"`, with full `string` type widening throughout the feedback voice call chain.

## Objective

Migrate `authoringFeedbackStem` to return slugified outcome labels (e.g., `"shield-the-team"`) instead of the narrow `"left" | "right"` union. Update all TypeScript callers to accept `string` instead. This prepares the codebase for plan 17-05, which will rename audio files from `_left`/`_right` to `_${labelSlug}`.

## Tasks Completed

### Task 1: Migrate authoringFeedbackStem to return label slugs — `ea3566d`

**Changes:**
- **lib/feedbackAudioChoice.ts**: Added `slugify()` export (canonical copy from `data/imageMap.ts`). Changed `authoringFeedbackStem` to accept `Pick<Card, "choiceSidesSwapped" | "onLeft" | "onRight">` and return `string`. Logic unchanged — swap detection identical, only return values now use `slugify(card.onLeft.label)` / `slugify(card.onRight.label)`.
- **unit/feedbackAudioChoice.test.ts**: Updated `card()` helper to accept `onLeft`/`onRight` labels. Replaced all `"left" | "right"` expectations with actual slug strings using `shadow_ai_hos_1` fixtures (`"shield-the-team"`, `"give-names-to-compliance"`). Added 3 standalone `slugify` tests.

**Verification:** `bun run test:unit` — 253 passed, 1 skipped.

### Task 2: Update App.tsx and useVoicePlayback.ts type signatures — `aa471f1`

**Changes:**
- **App.tsx**:
  - Imported `PresentationChoiceSlot` from `lib/feedbackAudioChoice`
  - Changed `FeedbackOverlayState.feedbackAuthoringStem` from `"left" | "right"` to `string`
  - Added `selectedSlot: PresentationChoiceSlot` to `FeedbackOverlayState` for non-critical card fallback routing
  - Passes `feedbackSelectedSlot` to `useVoicePlayback`
- **hooks/useVoicePlayback.ts**:
  - Imported `PresentationChoiceSlot` from `lib/feedbackAudioChoice`
  - Changed `feedbackAuthoringStem` type to `string | null`
  - Added `feedbackSelectedSlot?: PresentationChoiceSlot | null` to options
  - Updated `feedbackVoiceTrigger` to accept `string` stem + `PresentationChoiceSlot` selectedSlot
  - CRITICAL_HOS_CARDS: uses label slug directly (correct)
  - Non-critical fallbacks (`FEEDBACK_INSTALL_ON_RIGHT`, `se_security_patch_timeline`): now use `selectedSlot === "RIGHT"` instead of `authoringStem === "right"`
  - Added `feedbackSelectedSlot` to useEffect dependency array

**Verification:** `bun run typecheck` — 0 errors. `bun run test:unit` — 253 passed, 1 skipped. `bun run lint` — 17 warnings (pre-existing, unrelated).

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] `lib/feedbackAudioChoice.ts` exists and exports `slugify`, `authoringFeedbackStem`
- [x] `unit/feedbackAudioChoice.test.ts` updated with slug expectations
- [x] `App.tsx` — `feedbackAuthoringStem: string`, `selectedSlot` added
- [x] `hooks/useVoicePlayback.ts` — `string | null`, `feedbackSelectedSlot`, `selectedSlot === "RIGHT"` fallbacks
- [x] Commit `ea3566d` exists
- [x] Commit `aa471f1` exists
- [x] TypeScript compiles with 0 errors
- [x] All 253 unit tests pass
