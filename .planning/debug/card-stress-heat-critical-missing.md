---
status: diagnosed
trigger: "Stress effects (shake, flicker, pulse) activate when heat is critical, not only when countdown is active"
created: 2025-03-07T00:00:00.000Z
updated: 2025-03-07T00:00:00.000Z
---

## Current Focus

hypothesis: useIncidentPressure gates isCritical from heat on scenario existence
test: Confirmed via code inspection
expecting: ROOT CAUSE FOUND
next_action: return_diagnosis

## Symptoms

expected: Card shows stress when countdown active OR heat critical
actual: Works for countdown active, but when heat is critical the incident card doesn't show stress effects or shake
errors: None reported
reproduction: Test 4 in UAT Round 2 — Phase 04
started: Recheck after gap closure

## Eliminated

## Evidence

- checked: CardStack.tsx — hasStressVisuals = isUrgent || isCritical; classes applied when true (lines 62, 66, 135)
- checked: GameScreen.tsx — passes isUrgent={isCountdownActive} isCritical={isCritical} (lines 136–137)
- checked: App.tsx — passes isCountdownActive={pressure.isUrgent} isCritical={pressure.isCritical} (lines 429–430)
- checked: useIncidentPressure.ts line 43 — isCritical = criticalFromScenario || (scenario != null && heatHigh)
- found: heatHigh = state.heat >= 70; heat-alone critical is gated by (scenario != null)
- found: PRESSURE_SCENARIOS has 6 card IDs; most deck cards have no entry → scenario = null
- implication: Cards without PRESSURE_SCENARIOS entry never get isCritical from heat; stress effects only show for countdown (isUrgent) or cards with pressure metadata

## Resolution

root_cause: In hooks/useIncidentPressure.ts, isCritical from heat is gated on scenario existence: `(scenario != null && heatHigh)`. Cards without a PRESSURE_SCENARIOS entry (the majority of the deck) have scenario=null, so heat alone never sets isCritical=true. Stress visuals require isUrgent (countdown) OR isCritical; when heat is high but the current card has no pressure metadata, isCritical stays false.
fix: Change line 43 from `isCritical = criticalFromScenario || (scenario != null && heatHigh)` to `isCritical = criticalFromScenario || heatHigh` so heat >= 70 triggers critical regardless of scenario.
verification:
files_changed: []
