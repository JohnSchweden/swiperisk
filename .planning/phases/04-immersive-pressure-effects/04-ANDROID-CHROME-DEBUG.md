# Phase 04: Android Chrome Debug Findings

**Date:** 2026-03-08  
**Session:** .planning/debug/android-chrome-haptic-audio.md

## Root Causes

### Bug 1: Haptic not working

**Cause:** Some Android Chrome builds enforce a ~1000ms minimum on `navigator.vibrate`. Patterns &lt;1000ms (e.g. `[100]`) are ignored. [StackOverflow (Oct 2024)](https://stackoverflow.com/questions/79077091/navigator-vibrate-on-android-only-works-for-vibrations-longer-than-one-second).

**Fix:** Use `vibrate(1001)` then `vibrate(0)` after 80ms to attempt a short pulse. Cancel is unreliable on some devices — may get full 1s.

**Files:** `utils/haptic.ts`

### Bug 2: Heartbeat audio not playing

**Cause:** `AudioContext.resume()` must be triggered by a user gesture. Our heartbeat starts from `useEffect` when `hasHighPressure` becomes true — that's not a user gesture. Chrome blocks `resume()`; context stays suspended.

**Fix:** Add one-shot `touchend`/`click` listener when session is created. First touch in game resumes context; heartbeat then plays. `playPulse` skips when suspended (no longer awaits `resume()`).

**Files:** `hooks/usePressureAudio.ts`, `services/pressureAudio.ts`

## Verification

Run on Android Chrome:
1. **Haptic:** Touch-swipe or tap button on dev_1 (urgent card) — device should vibrate.
2. **Audio:** Play to high heat (≥70) — heartbeat should start after first touch on card area.

## Known Limitations

- **Haptic:** On devices where `vibrate(0)` doesn't cancel, user gets ~1s vibration instead of short pulse.
- **Audio:** First sound requires a touch/click in the game; playback before that is skipped.
