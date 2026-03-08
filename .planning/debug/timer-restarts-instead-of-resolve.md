---
status: diagnosed
trigger: "Timer expiry resolves incident after countdown reaches zero; feedback overlay appears, no restart. actual: not happening, timer just restarts"
created: 2025-03-07T00:00:00.000Z
updated: 2025-03-07T00:00:00.000Z
---

## Current Focus

hypothesis: count===0 && startFrom>0 conflates fresh activation and natural expiry; both restart instead of only fresh
test: control-flow analysis of effect branches
expecting: natural expiry (count 1→0) never reaches onComplete
next_action: documented root cause

## Symptoms

expected: On urgent card, let countdown reach zero without swiping. Incident resolves to configured outcome. No restart.
actual: "not happening, timer just restarts"
errors: None reported
reproduction: Test 2 in UAT Round 2 — Phase 04
started: Recheck after gap closure (04-04, 04-05)

## Eliminated

## Evidence

- checked: useCountdown effect control flow
  found: Branch order: !isActive → (count===0 && startFrom>0) → (count>0) → onComplete(). The (count===0 && startFrom>0) branch runs setCount(startFrom) and returns; it never calls onComplete().
  implication: Both "fresh activation" (stale count=0 on isActive flip) and "natural expiry" (count ticked 1→0) satisfy this condition.
- checked: Execution when countdown runs 15→...→1→0
  found: After tick decrements 1→0, next effect run sees count===0, startFrom===15. Hits L27-30 branch. setCount(15), return. onComplete() unreachable.
  implication: Natural expiry is treated identically to fresh activation; timer restarts.
- checked: "Legitimate expiry" path (L37-38)
  found: Only runs when count===0 AND startFrom===0. Urgent cards always have startFrom>0; this path never runs for them.
  implication: The intended natural-expiry path is dead for urgent cards.

## Resolution

root_cause: The "fresh activation" fix (04-04/04-05) added `if (count === 0 && startFrom > 0) { setCount(startFrom); return; }` to prevent onComplete firing on INITIALIZING→PLAYING. This condition is ambiguous: it matches both (A) fresh activation—count was 0 from inactive state—and (B) natural expiry—count ticked 1→0. Both cases restart the count; onComplete is never called when the countdown reaches zero naturally.
fix: (find_root_cause_only — not applied)
verification: (N/A)
files_changed: []
