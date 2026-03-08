---
status: diagnosed
trigger: "Timer expiry resolves incident after countdown reaches zero; or user swipes. Feedback/answer should not appear instantly at game start before either action."
created: 2025-03-06T00:00:00.000Z
updated: 2025-03-06T00:00:00.000Z
---

## Current Focus

hypothesis: useCountdown fires onComplete immediately when transitioning from inactive to active because count stays 0
test: trace INITIALIZING → PLAYING transition
expecting: count=0 + isActive=true triggers onComplete before count is reset
next_action: return ROOT CAUSE FOUND

## Symptoms

expected: On urgent card, countdown runs or user swipes — then feedback. No instant answer at start.
actual: Instantly after game started or simulation started, user instantly sees an answer to a question, which should happen after either swiping or the countdown runs down
errors: None reported
reproduction: Test 2 in UAT — Phase 04
started: Discovered during UAT

## Eliminated

## Evidence

- checked: useCountdown.ts effect logic
  found: When isActive and count<=0, effect falls through to onComplete() without resetting count to startFrom
  implication: Cold start into active state with count=0 triggers immediate expiry

- checked: App.tsx currentCard definition
  found: currentCard is null when state.stage !== PLAYING (line 104-106)
  implication: During INITIALIZING, useIncidentPressure returns isUrgent=false, countdownSec=0

- checked: useCountdown inactive branch
  found: When !isActive, effect does setCount(startFrom) and returns. With startFrom=0, count becomes 0
  implication: By end of INITIALIZING, count=0

- checked: INITIALIZING → PLAYING transition
  found: currentCard becomes first card (e.g. dev_1), pressure.isUrgent=true, pressure.countdownSec=15. useCountdown receives isActive=true, startFrom=15. But count state is still 0 from previous renders
  implication: Effect runs with isActive=true, count=0. count>0 is false → onComplete() fires immediately

- checked: App reset effect (lines 174-177)
  found: Resets count when currentCardId changes and !feedbackOverlay. Runs after useCountdown's effect. handleTimerExpiry already called setFeedbackOverlay before reset runs
  implication: Reset cannot prevent the initial fire; overlay already scheduled

## Resolution

root_cause: useCountdown does not re-initialize count when transitioning from inactive (isActive=false) to active (isActive=true). During INITIALIZING, currentCard is null so pressure.countdownSec=0 and isActive=false. The inactive branch sets count to 0. When transitioning to PLAYING with an urgent first card, isActive becomes true but count remains 0. The effect sees isActive=true and count=0, skips the count>0 branch, and immediately calls onComplete(handleTimerExpiry), causing instant feedback overlay.
fix: (find_root_cause_only — not applied)
verification:
files_changed: []
