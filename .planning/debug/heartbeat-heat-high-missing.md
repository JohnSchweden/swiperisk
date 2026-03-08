---
status: diagnosed
trigger: "Heartbeat only plays for card when pressure/countdown is on. When heat is high, no heartbeat. Also make heartbeat 10% louder when it's there."
created: "2025-03-07T00:00:00.000Z"
updated: "2025-03-07T00:00:00.000Z"
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: isCritical gates heat behind scenario existence — CONFIRMED
test: traced useIncidentPressure isCritical logic
expecting: heat alone triggers hasHighPressure
next_action: (diagnosis complete)

## Symptoms

expected: Heartbeat plays when heat high. Volume 10% louder.
actual: Heartbeat only plays for card when pressure/countdown is on. When heat is high, no heartbeat.
errors: None reported
reproduction: Test 5 in UAT Round 2 — Phase 04
started: Recheck after gap closure

## Eliminated

(none)

## Evidence

- PressureCueController hasHighPressure = props.isUrgent || props.isCritical (line 19)
- useIncidentPressure: isCritical = criticalFromScenario || (scenario != null && heatHigh) (line 43)
- heatHigh = state.heat >= 70
- When currentCard has no PRESSURE_SCENARIOS entry: scenario = null → (scenario != null && heatHigh) = false → isCritical stays false
- Cards like man_negotiator, other deck cards not in PRESSURE_SCENARIOS never get heat-based isCritical
- Heartbeat plays only when isUrgent (countdown) or isCritical (scenario+heat OR criticalForHaptics)

## Resolution

root_cause: In useIncidentPressure, isCritical requires (scenario != null && heatHigh). Heat alone does not set isCritical when the current card has no PRESSURE_SCENARIOS entry. Cards without scenarios (e.g. man_negotiator) never trigger heartbeat when heat is high — only countdown/urgent cards or scenario cards with heat do.
fix: Change isCritical to include heatHigh unconditionally: `isCritical = criticalFromScenario || (scenario != null && heatHigh)` → `isCritical = criticalFromScenario || heatHigh`. Also increase heartbeat volume 10%: GAIN_HEARTBEAT 0.12 → 0.132 in services/pressureAudio.ts.
verification: Play to high heat on a card without a pressure scenario; heartbeat should play. Confirm volume is 10% louder.
files_changed: [hooks/useIncidentPressure.ts, services/pressureAudio.ts]
