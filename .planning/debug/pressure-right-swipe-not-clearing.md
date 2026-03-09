---
status: resolved
trigger: "Bug: In SwipeRisk, when first card has pressure active and user swipes RIGHT to reveal second card: second card incorrectly shows pressure visual and audio but NO timer. Left swipe correctly clears pressure. Asymmetric bug."
created: 2025-03-09T00:00:00Z
updated: 2025-03-09T00:00:00Z
---

## Current Focus
hypothesis: CONFIRMED and FIXED
next_action: (complete)

## Symptoms
expected: Swiping right to second card should clear pressure (visual, audio, timer) — same as left swipe
actual: Right swipe shows pressure visual and audio on second card but NO timer; left swipe clears correctly
errors: (none reported)
reproduction: 1) Start game with pressure card, 2) Wait for pressure to activate (visual+audio+timer), 3) Swipe RIGHT, 4) Second card shows pressure visual+audio but no timer
started: (unknown)

## Eliminated
(empty)

## Evidence
(empty)

## Resolution
root_cause: Stress visuals and pressure audio used hasStressVisuals = isUrgent || isCritical and hasHighPressure = isUrgent || isCritical. isCritical includes global heat (heat >= 70). Right swipe on a pressure card adds heat; left swipe often subtracts. So after right swipe, next card has isCritical=true (from heat), isUrgent=false (new card has no countdown). Result: visual+audio (from isCritical) but no timer (isUrgent only).
fix: Tie stress visuals and pressure audio to incident countdown only (isUrgent). CardStack hasStressVisuals = isUrgent. PressureCueController hasHighPressure = isUrgent. isCritical stays for haptics (onCriticalChange, triggerSwipeHaptic).
verification: Smoke tests pass, immersive-pressure-cues tests pass, pressureCueController unit test updated and passes
files_changed: [CardStack.tsx, PressureCueController.tsx, unit/pressureCueController.spec.tsx]
