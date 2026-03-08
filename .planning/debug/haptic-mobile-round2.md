---
status: diagnosed
trigger: "Critical moments trigger haptic feedback (vibration) on supported mobile devices. User reports no vibrations. UAT Round 2, real mobile."
created: 2025-03-07T00:00:00.000Z
updated: 2025-03-07T00:00:00.000Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — Touch-swipe is the primary mobile path; vibrate only exists on button path
test: Traced code paths
expecting: Root cause documented
next_action: Finalize diagnosis

## Symptoms

expected: Device vibrates on critical state or swipe when urgent/critical
actual: No vibrations
errors: None reported
reproduction: Test 7 in UAT Round 2 — Phase 04, real mobile
started: After 04-05 added sync vibrate in onSwipeLeft/onSwipeRight

## Eliminated

## Evidence

- checked: App.tsx — vibrate only in onSwipeLeft/onSwipeRight (L397–416), before swipeProgrammatically
- checked: useSwipeGestures.ts — touch path: handleTouchEnd → setTimeout(350ms) → onSwipe(direction) → handleChoice; no vibrate anywhere
- checked: CardStack.tsx — swipe buttons (L254–268) receive onClick={onSwipeLeft/Right}; touch handlers (L137–142) on card div
- checked: 04-05-PLAN.md — "The touch-swipe path (useSwipeGestures -> handleChoice) goes through rAF/setTimeout; keep that as-is — no vibrate there, accept it may not work for touch swipes"
- implication: Mobile UI promotes "← Swipe left or Swipe right →" (L247–249); touch-swipe is primary; buttons are secondary

## Resolution

root_cause: Haptic feedback was added only to the swipe-button path (onSwipeLeft/onSwipeRight). On mobile, the primary interaction is touch-swipe via useSwipeGestures. Touch-swipe completion fires onSwipe → handleChoice from a setTimeout(350ms) callback. That path has no navigator.vibrate call. Even if vibrate were added there, Chrome would block it—the call would occur outside the user gesture (touchEnd + 350ms).
fix: (suggested) Call navigator.vibrate synchronously in useSwipeGestures.handleTouchEnd, at the moment direction is determined (before setTimeout), when pressure.isCritical || pressure.isUrgent. Requires passing pressure state into useSwipeGestures or a vibrate callback.
verification:
files_changed: []
