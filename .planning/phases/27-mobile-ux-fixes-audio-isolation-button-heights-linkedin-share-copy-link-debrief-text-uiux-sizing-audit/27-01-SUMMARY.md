---
phase: 27-mobile-ux-fixes-audio-isolation-button-heights-linkedin-share-copy-link-debrief-text-uiux-sizing-audit
plan: 01
subsystem: audio
tags: [web-audio, ios-safari, mobile-optimization, gesture-input]

requires:
  - phase: 26-preload-outcome-ending-assets
    provides: Image preloading infrastructure, asset optimization baseline

provides:
  - Viewport-aware BGM default volume (15% mobile, 20% desktop)
  - BGM pause isolation via AudioContext resume on mobile
  - iOS scroll gesture audio unlock via touchend (not touchstart)
  - Separate audio pipeline architecture for BGM and voice (preserved)

affects:
  - Audio behavior on iOS Safari mobile devices
  - Mobile UX when pausing BGM during voice playback
  - Audio unlock behavior when scrolling on mobile

tech-stack:
  added: []
  patterns:
    - Platform-Specific Volume Defaults via matchMedia API
    - Audio Pipeline Isolation (separate AudioContext instances)
    - iOS User Activation via touchend during scroll gestures

key-files:
  created: []
  modified:
    - src/hooks/useBackgroundMusic.ts

key-decisions:
  - "Use matchMedia(VOICE_DUCK_MOBILE_MQ) for viewport detection instead of userAgent sniffing"
  - "Resume BGM AudioContext immediately after pause to prevent shared context suspension on iOS"
  - "Switch from touchstart to touchend for audio unlock to enable scroll gestures as user activation"

requirements-completed:
  - BGM-VOL-01
  - BGM-ISO-01

patterns-established:
  - "Audio Pipeline Isolation: separate AudioContext for BGM and voice; pause one without affecting the other"
  - "Platform-Specific Defaults: Use matchMedia for viewport-aware configuration (not userAgent)"
  - "iOS User Activation: touchend counts for audio unlock during scroll; touchstart does not"

duration: 2 min 42 sec
completed: 2026-04-16
---

# Phase 27 Plan 01: Audio Isolation, Volume Defaults, and Scroll Unlock

**BGM default volume 15% mobile / 20% desktop, BGM pause isolation on mobile via AudioContext keepalive, iOS scroll unlock via touchend**

## Performance

- **Duration:** 2 min 42 sec
- **Started:** 2026-04-16T21:59:12Z
- **Completed:** 2026-04-16T22:02:00Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Viewport-aware BGM defaults: 15% on mobile (< 768px), 20% on desktop (>= 768px) via matchMedia API
- BGM pause isolation: re-resume BGM AudioContext immediately after pause to prevent iOS from suspending shared Web Audio contexts (preserving separate voice AudioContext)
- iOS scroll unlock: changed audio unlock listener from touchstart to touchend so users can unlock BGM by scrolling without requiring an explicit tap

## Task Commits

1. **Task 1-3: Audio isolation and viewport-aware defaults** - `4157114` (fix)

All three tasks completed in a single atomic commit:
- Task 1: `VOLUME_DEFAULT_DESKTOP = 0.2`, `VOLUME_DEFAULT_MOBILE = 0.15`, `defaultVolumeForViewport()` helper, updated `readStoredVolume()` fallback
- Task 2: Updated enabled effect to resume BGM context on pause + new statechange listener for iOS auto-suspension keepalive
- Task 3: Changed autoplay unlock listener from `touchstart` to `touchend` for iOS scroll gesture activation

## Files Created/Modified

- `src/hooks/useBackgroundMusic.ts` - Three audio fixes: viewport-aware defaults, pause isolation, scroll unlock

## Decisions Made

1. **Viewport detection via matchMedia:** Use `window.matchMedia(VOICE_DUCK_MOBILE_MQ)` for platform-aware defaults instead of userAgent sniffing. Aligns with existing codebase pattern for `voiceDuckMultForViewport()` and ensures accurate viewport detection at component mount time.

2. **BGM pause isolation strategy:** When BGM is paused, iOS may auto-suspend the BGM AudioContext. Resuming the context (after element pause) does NOT restart audio playback (element is paused) but keeps the iOS AudioSession category alive, preventing eviction of the separate voice AudioContext in voicePlayback.ts.

3. **Touchend for scroll activation:** iOS Safari distinguishes between touchstart (during scroll, does NOT satisfy user activation policy) and touchend (when scroll gesture completes, DOES satisfy policy). Changed to touchend to enable BGM unlock on scroll without requiring an explicit tap first.

## Deviations from Plan

None - plan executed exactly as written. All three research patterns (Platform-Specific Volume Defaults, Audio Pipeline Isolation, iOS User Activation) applied directly. No unexpected issues encountered.

## Verification

- **Typecheck:** Clean (no errors)
- **Lint:** Clean (unrelated warnings in unit tests, not in this change)
- **Smoke tests:** 168 passed, 55 skipped (mobile-only tests, expected)

## Issues Encountered

None. All code changes were straightforward and typecheck/lint/tests all passed on first attempt.

## Self-Check: PASSED

- ✓ File modified: `src/hooks/useBackgroundMusic.ts`
- ✓ Commit hash: 4157114 (fix(27-01): audio isolation and viewport-aware defaults)
- ✓ Typecheck passes
- ✓ Smoke tests pass (168 passed)
- ✓ All three tasks completed in one atomic commit

## Next Phase Readiness

Plan 27-01 complete. Ready for Phase 27 Plan 02 (button height fixes and other mobile UX improvements). BGM audio behavior now correct on mobile: users can unlock audio by scrolling, pause doesn't silence voice, and volume defaults are appropriate for device form factor.

---
*Phase: 27-mobile-ux-fixes-audio-isolation-button-heights-linkedin-share-copy-link-debrief-text-uiux-sizing-audit*
*Plan: 01*
*Completed: 2026-04-16*
