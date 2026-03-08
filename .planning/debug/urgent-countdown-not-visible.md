---
status: diagnosed
trigger: "Urgent incidents show a visible countdown with stakes messaging (e.g. 'Decide now or the choice is made for you') while the player is deciding"
created: "2025-03-06T00:00:00.000Z"
updated: "2025-03-06T00:00:00.000Z"
symptoms_prefilled: true
---

## Current Focus

hypothesis: useCountdown never initializes count when isActive transitions false→true; count stays 0, onComplete fires immediately
test: traced App→useIncidentPressure→useCountdown→GameScreen data flow
expecting: confirmed
next_action: (diagnosis complete)

## Symptoms

expected: Start a game with Dev role. First card (dev_1) is urgent. A visible countdown appears with stakes messaging. The timer counts down from 15.
actual: not visible, also not visible on screenshots
errors: None reported
reproduction: Test 1 in UAT — Phase 04 immersive pressure effects
started: Discovered during UAT

## Eliminated

## Evidence

- timestamp: 2025-03-06
  checked: useCountdown.ts
  found: useState(startFrom) only used on mount. When isActive is false, effect does setCount(startFrom). When isActive becomes true, effect never sets count to startFrom; it only decrements if count > 0 or calls onComplete if count <= 0.
  implication: On INITIALIZING→PLAYING transition, count was 0 (from when startFrom was 0). When isActive flips true and startFrom becomes 15, count is still 0 → onComplete() fires synchronously.
- timestamp: 2025-03-06
  checked: App.tsx currentCard, useIncidentPressure, useCountdown wiring
  found: currentCard from ROLE_CARDS[role][0]; pressure.isUrgent = true, pressure.countdownSec = 15 for dev_1. useCountdown receives startFrom: 15, isActive: true. GameScreen gets countdownValue={incidentCountdown.count}, isCountdownActive={pressure.isUrgent}. showCountdown = isCountdownActive && countdownValue > 0.
  implication: Logic is correct; the count is wrong (0) so showCountdown is false and onComplete fires before any render with count > 0.
- timestamp: 2025-03-06
  checked: App.tsx reset useEffect
  found: When currentCardId changes and !feedbackOverlay, incidentCountdown.reset() is called. reset() runs in a separate effect, AFTER useCountdown's effect. useCountdown's effect runs first, sees count=0, calls onComplete synchronously. handleTimerExpiry runs, sets feedbackOverlay. Reset runs after but damage done.
  implication: Effect ordering: countdown effect fires before reset effect. Timer expiry wins the race.
- timestamp: 2025-03-06
  checked: immersive-pressure-cues.spec.ts
  found: Test uses Promise.race accepting either countdown OR feedback dialog (17s). 04-03-SUMMARY: "Playwright countdown assertion flaky due to 15s timeout firing during nav; tests made resilient by accepting either countdown or feedback dialog"
  implication: Tests were relaxed to pass even when countdown never appears; instant feedback accepted as valid. Explains why CI passes, UAT fails.

## Resolution

root_cause: useCountdown does not re-initialize count to startFrom when isActive transitions from false to true. During INITIALIZING, startFrom=0 and isActive=false, so count initializes to 0. On transition to PLAYING with dev_1, isActive becomes true and startFrom becomes 15, but count remains 0. The effect sees isActive=true and count<=0, so it calls onComplete() immediately. handleTimerExpiry runs, shows feedback overlay, and the user never sees the countdown.
fix: In useCountdown, when isActive becomes true, set count to startFrom before starting the tick loop (or when transitioning from inactive to active, sync count with startFrom).
verification: Start game with Dev role, first card dev_1; countdown banner should appear and tick from 15 before any feedback.
files_changed: []
