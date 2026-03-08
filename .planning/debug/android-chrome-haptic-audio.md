---
status: awaiting_human_verify
trigger: "Phase 04 gaps: Haptic and heartbeat audio not working on Android Chrome"
created: 2026-03-08T00:00:00.000Z
updated: 2026-03-08T00:00:00.000Z
symptoms_prefilled: true
goal: find_and_fix
---

## Current Focus

hypothesis: H1 CONFIRMED — Android Chrome ignores vibrations <1000ms; H2 CONFIRMED — AudioContext.resume() must run in user gesture
test: Applied fixes
expecting: User confirms both work on Android Chrome
next_action: Await human verification

## Symptoms

expected: Haptic vibrates on touch-swipe/button-tap; heartbeat plays when heat high
actual: No vibration; no heartbeat on Android Chrome
errors: None
reproduction: Android Chrome, dev_1 card, touch-swipe or tap button; play to high heat
started: User confirmed during Phase 04 UAT

## Eliminated

- hypothesis: User gesture chain broken (React synthetic events)
  evidence: onBeforeSwipe called sync in handleTouchEnd before setTimeout; button onClick is direct. Both are in user gesture. Research found Android 1000ms minimum instead.
  timestamp: 2026-03-08
- hypothesis: ctx.resume() not awaited
  evidence: pressureAudio.ts has await ctx.resume(); stress-audio debug already fixed that. Root cause is resume() initiated from useEffect, not user gesture.
  timestamp: 2026-03-08

## Evidence

- timestamp: 2026-03-08
  checked: StackOverflow "navigator.vibrate on Android only works for vibrations longer than one second"
  found: On some Android devices, vibrate(1000) does nothing; vibrate(1001) works. Values <1000 ignored. navigator.vibrate(0) to cancel unreliable.
  implication: Current pattern [100] is below threshold; need ≥1001ms or accept no haptic
- timestamp: 2026-03-08
  checked: utils/haptic.ts
  found: VIBRATE_PATTERN = [100]; triggerHaptic calls navigator.vibrate([100])
  implication: 100ms pulse ignored on affected Android devices
- timestamp: 2026-03-08
  checked: Chrome Web Audio autoplay policy
  found: AudioContext.resume() must be triggered by user interaction. Calling from useEffect (hasHighPressure change) is NOT a user gesture.
  implication: Context stays suspended; await ctx.resume() in playPulse never unlocks because resume() itself is blocked
- timestamp: 2026-03-08
  checked: usePressureAudio flow
  found: Session created on mount; startHeartbeat called from useEffect when hasHighPressure true. No user gesture in that chain.
  implication: Must resume context on first touch/click in game area

## Resolution

root_cause: |
  Bug 1: Android Chrome (some devices) ignores navigator.vibrate when pattern total <1000ms. [100] = 100ms → no effect.
  Bug 2: AudioContext.resume() invoked from useEffect (reacting to hasHighPressure) — not a user gesture. Chrome blocks resume; context stays suspended.
fix: |
  Bug 1: Try [1001] with immediate cancel via setTimeout(100, () => navigator.vibrate(0)). If cancel works: short pulse. If not: 1s pulse (document as known quirk).
  Bug 2: Add one-shot touchend/click listener in usePressureAudio that calls ctx.resume() when session created. First user touch in game resumes context; then heartbeat can play.
verification: Manual test on Android Chrome (see checkpoint)
files_changed: [utils/haptic.ts, hooks/usePressureAudio.ts, services/pressureAudio.ts]
