---
status: diagnosed
trigger: "HUD escalation visuals (Critical labels, color shifts, pressure-hud-intense) not showing when heat high or budget low"
created: 2025-03-06T00:00:00.000Z
updated: 2025-03-06T00:00:00.000Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: Game flow and deck design prevent observers from ever seeing the playing screen with escalated HUD state
test: Traced data flow, threshold logic, card outcomes, and stage transitions
expecting: Root cause identified
next_action: Return ROOT CAUSE FOUND

## Symptoms

expected: HUD shows Critical labels, amber/red escalation, pressure-hud-intense when heat high or budget low
actual: nothing visible
errors: None reported
reproduction: Test 3 in UAT — Phase 04
started: Discovered during UAT

## Eliminated

- hypothesis: Pressure props or thresholds not passed correctly to GameHUD
  evidence: App passes state to GameScreen; GameScreen passes budget, heat, hype, countdownValue to GameHUD. Flow is correct.
  timestamp: 2025-03-06
- hypothesis: GameHUD threshold logic or CSS broken
  evidence: GameHUD correctly computes budgetCritical (<2M), budgetWarning (<3M), heatCritical (>=85), heatHigh (>=70). pressure-hud-intense defined in index.html.
  timestamp: 2025-03-06

## Evidence

- timestamp: 2025-03-06
  checked: GameHUD props and threshold logic
  found: GameHUD receives state.budget, state.heat from GameScreen. BUDGET_CRITICAL=2M, BUDGET_WARNING=3M, HEAT_CRITICAL=85, HEAT_HIGH=70. Logic correct.
  implication: Escalation code path exists and is correct
- timestamp: 2025-03-06
  checked: Development deck (Software Engineer role) card outcomes
  found: dev_1 Paste: +45 heat, -2.5M; dev_2 Install: +60 heat, -5M. One Paste -> heat 45, budget 7.5M (no escalation). Paste+Install -> heat 100, budget 2.5M (escalation) but NEXT_INCIDENT triggers GAME_OVER (heat>=100) on dismiss.
  implication: With default role, user never sees playing screen with escalated state
- timestamp: 2025-03-06
  checked: Feedback overlay vs HUD visibility
  found: When choice is made, feedback overlay (z-50, fixed inset-0) covers entire screen. HUD (z-10) is underneath. User sees overlay, not HUD. On Next, either advance to next card or GAME_OVER.
  implication: Escalation visible only when on card screen with no overlay and accumulated state meets thresholds
- timestamp: 2025-03-06
  checked: Management deck (Chief/Head of Something) — path to see escalation
  found: man_attention_track Enable: +85 heat, -8M. After Enable + Next: heat 85, budget 2M, card 2. Both heatCritical and budgetWarning. HUD would show escalation.
  implication: Escalation is observable only with Management-backed roles; default path (Software Engineer) cannot reach it
- timestamp: 2025-03-06
  checked: pressure-hud-intense CSS
  found: filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.25)) — 25% opacity red glow
  implication: Effect is very subtle; Critical labels and color shifts (text-red, text-amber) are the primary visible escalation, pressure-hud-intense secondary

## Resolution

root_cause: Game flow and deck design prevent the playing screen with escalated HUD from ever being visible when using the default/likely role (Software Engineer → Development deck). Any choice sequence that reaches heat>=70 or budget<3M either (a) shows feedback overlay (covering the HUD) or (b) triggers GAME_OVER on the next "Next" click. The Development deck has no single choice that reaches thresholds while allowing the user to then see the next card; two bad choices cause immediate game over.
fix: (suggested) Either add a Development card with moderate heat (70–84) and moderate fine so user can see card 2 with escalation, or lower thresholds so one Paste (heat 45) triggers at least heatWarning. Alternatively, show HUD (or escalation summary) on/alongside the feedback overlay when state is escalated.
verification:
files_changed: []
