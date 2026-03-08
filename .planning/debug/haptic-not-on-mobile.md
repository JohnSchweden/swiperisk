---
status: diagnosed
trigger: "truth: Critical moments trigger haptic feedback (vibration) on supported mobile devices; actual: no haptic on mobile"
created: 2025-03-06T00:00:00.000Z
updated: 2025-03-06T00:00:00.000Z
---

## Current Focus

hypothesis: Haptic triggers run from async callbacks without user gesture; Chrome blocks navigator.vibrate
test: Confirmed via call-stack analysis and MDN/Chrome docs
expecting: Root cause = user gesture violation
next_action: Finalize diagnosis

## Symptoms

expected: Device vibrates on critical state or timer expiry
actual: No haptic on mobile
errors: None reported
reproduction: Test 7 in UAT — Phase 04, real mobile device
started: Discovered during UAT

## Eliminated

## Evidence

- timestamp: 2025-03-06
  checked: hooks/usePressureAudio.ts, triggerHaptic
  found: triggerHaptic called from useEffect when isCritical transitions to true; useEffect runs asynchronously after render
  implication: No user gesture in call stack for critical-state haptic

- timestamp: 2025-03-06
  checked: App.tsx handleTimerExpiry
  found: handleTimerExpiry invoked by useCountdown's useEffect when count hits 0; countdown uses setTimeout(1000ms)
  implication: Timer expiry haptic fires from setTimeout chain — no user gesture

- timestamp: 2025-03-06
  checked: Web search — Chrome navigator.vibrate user gesture
  found: Chrome blocks vibrate with "[Intervention] Blocked call to navigator.vibrate because user hasn't tapped on the frame"; requires user gesture (tap, click)
  implication: Both call sites violate user-gesture requirement

- timestamp: 2025-03-06
  checked: 04-RESEARCH.md Pattern 4
  found: Research explicitly says "Call vibrate only after user gesture" — implementation does not follow this
  implication: Known requirement was documented but not implemented

- timestamp: 2025-03-06
  checked: iOS Safari, Android short vibration
  found: iOS = no Vibration API support; Android = patterns <1s may not work on some devices (app uses [50,30,50]=130ms)
  implication: Platform-specific factors; user gesture is primary for Android/Chrome

## Resolution

root_cause: navigator.vibrate is called from async callbacks (useEffect, setTimeout) without user gesture. Chrome and other mobile browsers block the Vibration API when not triggered by a user activation (tap/click). Both haptic triggers — usePressureAudio.triggerHaptic (critical state) and App.handleTimerExpiry (timer expiry) — fire from effect/timer chains, not from synchronous user event handlers.
fix:
verification:
files_changed: []
