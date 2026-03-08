---
status: diagnosed
trigger: "Stress effects (shake, flicker, pulse) activate on card when pressure state is active and relax when pressure drops. Actual: not happening, not visible. Test 4 in UAT — Phase 04."
created: 2025-03-06T00:00:00.000Z
updated: 2025-03-06T00:00:00.000Z
---

## Current Focus

hypothesis: useCountdown instant expiry prevents user from ever seeing playing state with active pressure
test: confirmed via timer-expiry-instant-feedback.md and trace
expecting: ROOT CAUSE FOUND
next_action: return diagnosis

## Symptoms

expected: Card shows shake, flicker, pulse when countdown active or heat critical
actual: not happening, not visible
errors: None reported
reproduction: Test 4 in UAT — Phase 04
started: Discovered during UAT

## Eliminated

- hypothesis: CardStack doesn't receive isUrgent/isCritical — props flow correctly App→GameScreen→CardStack
- hypothesis: CSS keyframes missing — present in index.html (pressure-shake-keyframes, pressure-flicker-keyframes, pressure-pulse-keyframes)
- hypothesis: hasStressVisuals never true due to logic bug — logic correct; pressure state never active because useCountdown fires before frame paints

## Evidence

- checked: CardStack.tsx — hasStressVisuals = isUrgent || isCritical; classes applied when true (lines 62–66, 135)
- checked: GameScreen.tsx — passes isUrgent={isCountdownActive} isCritical={isCritical} (lines 136–137)
- checked: App.tsx — isCountdownActive={pressure.isUrgent} isCritical={pressure.isCritical} (lines 403–404)
- checked: index.html — keyframes defined (314–334), classes .pressure-shake, .pressure-flicker, .pressure-pulse
- checked: .planning/debug/timer-expiry-instant-feedback.md — root cause: useCountdown fires onComplete immediately on INITIALIZING→PLAYING because count stays 0
- implication: Feedback overlay appears instantly, user never sees card in pressure state; after dismiss, advances to non-urgent card (dev_icarus_unverified)
- checked: PRESSURE_SCENARIOS dev_1 — urgent: true; only urgent card for SOFTWARE_ENGINEER in DEVELOPMENT deck

## Resolution

root_cause: useCountdown does not re-initialize count when transitioning from inactive to active. On INITIALIZING→PLAYING, count remains 0 from prior inactive state; effect sees isActive=true and count=0, calls onComplete immediately. Feedback overlay appears before any frame paints with stress visuals. User never sees the card in pressure state.
fix: (find_root_cause_only — see timer-expiry-instant-feedback.md for fix direction)
verification:
files_changed: []
