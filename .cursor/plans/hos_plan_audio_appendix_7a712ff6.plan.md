---
name: HOS plan audio appendix
overview: "Full HOS + V.E.R.A. (Roaster) alignment: incident card fixes, RealWorld bridges, Vera voice rules, roaster before/after tables, and Roaster clip regeneration. Zen/Lovebomber-only edits do not use feedback voice clips."
todos:
  - id: p0-swap-story-text
    content: Swap makeCard 5th/6th args for hos_ai_management_elimination and hos_process_automation_takeover (no audio change)
    status: pending
  - id: p4-incident-bridges
    content: Apply incident/realWorld bridges and UX fixes in head-of-something.ts (see Incident section; no regen unless roaster touched)
    status: pending
  - id: merge-roaster-copy
    content: Merge all roaster After (target) tables into head-of-something.ts
    status: pending
  - id: regen-roaster-clips
    content: Regenerate public/audio/voices/roaster/feedback/hos for every trigger in Roaster tables (count in Summary)
    status: pending
isProject: false
---

# HOS + V.E.R.A. alignment plan (extended)

Single source file: [`src/data/cards/head-of-something.ts`](src/data/cards/head-of-something.ts). Personality anchor: [`src/data/personalities.ts`](src/data/personalities.ts) — **V.E.R.A.** = `PersonalityType.ROASTER` (“British sarcasm, burned-out IT director, cynical”). Feedback voice playback uses **only** `roaster` strings for pre-baked clips ([`useVoicePlayback.ts`](src/hooks/useVoicePlayback.ts)).

---

## Part A — Structural (incident UI; no Roaster audio change)

**Issue:** [`hos_ai_management_elimination`](src/data/cards/head-of-something.ts) and [`hos_process_automation_takeover`](src/data/cards/head-of-something.ts) pass the **short binary line** as the 5th `makeCard` arg (`storyContext`) and the **long paragraph** as the 6th (`text`). [`CardStackComponents.tsx`](src/components/game/CardStackComponents.tsx) renders `storyContext` first, then `text` — so players see **question before setup**, unlike the rest of the deck.

**Change:** Swap **only** the two string arguments (5th and 6th) for both cards so **long setup = `storyContext`**, **binary prompt = `text`**. Wording unchanged; **no** feedback regeneration.

---

## Part B — Incident copy, prompts, and RealWorld (no Roaster regen unless paired with roaster edits)

Address findings from the multi-agent HOS review (cluster fatigue, mismatches, skim risk).

| Card id | Issue | Target action |
|---------|--------|----------------|
| `hos_team_burnout_deadline` | RealWorld **Microsoft stack ranking** does not match **crunch/deadline** body | Add **one sentence** tying forced ranking / metric fear to fear of missing targets **or** replace `realWorldReference` with a labor/crunch-adjacent incident if one exists in [`incidents.ts`](src/data/incidents.ts) |
| `hos_promotion_politics` | **Gebru** story is ethics/termination; scenario is **merit vs connected promotion** | Narrow **storyContext** to dissent/ethics vs politics **or** swap `realWorldReference` to a merit-vs-sponsorship tech story that fits |
| `hos_explainability_politics` | Healthcare lawsuit reads like a **composite** | Optionally prefix outcome with “Pattern from multiple cases” **or** name one vetted public case |
| `hos_delegation_gone_wrong` | Knight Capital is trading ops; AI angle implicit | Add **one phrase** in `storyContext` tying to **automated / model deployment / production change** risk |
| `hos_model_drift_team_blame` | **Redundancy:** `storyContext` and `text` both ask blame vs defend | Trim one layer so prompt does not repeat the scenario question verbatim |
| `hos_team_burnout_deadline` | Skim risk: body mentions **miss deadline** while `text` says **push back on deadline** | Align wording so left/right map to the same verbs (e.g. body ends with same fork as `text`) |
| `shadow_ai_hos_1` | Teachable term | Add **“shadow AI”** (or clear synonym) once in `storyContext` |
| `hos_copyright_team_blame` | Duplicate roaster beat with `shadow_ai_hos_1` (compliance/legal happy + job-hunting) | Optional **second pass:** rewrite **cooperate-with-investigation** `roaster` only; if changed, regen `feedback_hos_copyright_team_blame_cooperate-with-investigation` |

**Grammar (body / prompt; no regen):** `hos_explainability_politics` — “the black-box **model** has…”; `hos_model_drift_team_blame` — “under **the** bus”; `hos_prompt_injection_copilot_team` — “3 senior devs **at risk**”; `hos_prompt_injection_review_escape` — “prompt injection **vector**” / bypass (not “escape” collision).

---

## Part C — V.E.R.A. voice rules (applies to all `roaster` edits)

Multi-agent review flagged **register drift** vs “British sarcasm, burned-out IT director”:

| Avoid | Why | Prefer |
|-------|-----|--------|
| US/internet slang | Wrong register | Understatement, stiff politeness, dry HR/IT speak |
| “Taking the L” | Twitch/Twitter | “You owned it”, “your remit shrinks” |
| “Crunch time!” | US games/startup rally | Quiet dread, overtime as fait accompli |
| “Fresh talent is cheap anyway” | Punching down; cartoon villain | Weary cynicism without dehumanizing ICs |
| Ironic “Nice.” as punchline | Often reads American-bro | British irony without terminal “Nice.” (e.g. “Brilliant.”, backhanded complete sentence) |
| Repeated “X owes you” | Template fatigue | Already addressed in roaster tables below |

---

## Part D — Roaster: before (current) and after (target)

Implement **after** text in [`head-of-something.ts`](src/data/cards/head-of-something.ts). Regenerate **Roaster** clips per trigger.

### D1 — `hos_copyright_sourcing` (dedupe vs `hos_prompt_injection_blame`)

| Trigger | Path | Before | After (target) |
|---------|------|--------|----------------|
| `feedback_hos_copyright_sourcing_take-the-blame` | Take the blame | `Noble. Your team will work harder for you now. The VP will also blame you.` | `You signed off on the training-data paper trail. Exhibit A is your calendar invite. The team buys you coffee until the subpoena.` |
| `feedback_hos_copyright_sourcing_name-the-data-scientist` | Name the data scientist | `Sacrificing your best performer to save yourself. Your team will remember this at their exit interviews.` | `You fed your star DS to IP counsel like they're a bad scrape. Legal gets a win; you get a team that trusts you like a terms-of-service update.` |

### D2 — Template variation (LinkedIn / owes you / Noble)

| Trigger | Path | Before | After (target) |
|---------|------|--------|----------------|
| `feedback_shadow_ai_hos_1_give-names-to-compliance` | Give names to compliance | `Compliance is happy. Your team is updating LinkedIn. Management material right here.` | `Compliance closes the ticket with prejudice. Your #general channel just filed a collective grievance. Leadership material—just not yours.` |
| `feedback_hos_model_drift_budget_conflict_ship-without-retraining` | Ship without retraining | `Your team knows you sold them out. The CFO owes you. Everyone loses.` | `Your team knows you sold them out. You cashed their trust for a CFO nod that zeroes out at the next planning cycle. Everyone loses.` |
| `feedback_hos_promotion_politics_promote-politically-connected` | Promote politically connected | `Your best performer just learned meritocracy is a myth. The VP owes you.` | `Your best performer just learned meritocracy is a myth. You bought VP goodwill on layaway—first payment due at calibration.` |
| `feedback_hos_explainability_politics_side-with-engineering` | Side with engineering | `Better accuracy now. Better fines later. Engineering owes you.` | `Better accuracy now. Better fines later. Engineering buys you drinks until the first “why did the model do that” deposition.` |
| `feedback_hos_explainability_politics_side-with-auditors` | Side with auditors | `Engineering will resent you. Auditors will forget you. Compliance win.` | `Engineering will resent you. Auditors will forget your name by Tuesday. Compliance still logs this as a clean audit trail.` |
| `feedback_hos_model_drift_team_blame_defend-and-take-heat` | Defend and take heat | `Career-limiting. Noble. Your team will follow you anywhere. VP less so.` | `Expensive integrity: your team will follow you into a dumpster fire. VP sends a calendar hold instead of flowers.` |

### D3 — Grammar / clarity (roaster lines)

| Trigger | Path | Before | After (target) |
|---------|------|--------|----------------|
| `feedback_hos_prompt_injection_review_escape_let-it-slide` | Let it slide | `Senior owes you. Breach later will blame you. Lose-lose. Nice.` | `Senior owes you a favor. When prod lights up, you're the one holding the pager and the blame. Lose-lose. Couldn't happen to a nicer stakeholder.` |
| `feedback_hos_congressional_hearing_demand_testify-honestly-about-gaps` | Testify honestly about gaps | `Stock tanks. Reputation takes hits. Congress respects you. The board is furious.` | `Stock tanks. Your reputation takes a hit. Congress respects you. The board is furious.` |

### D4 — V.E.R.A. register fixes (from review; new Roaster regen)

| Trigger | Path | Before | After (target) |
|---------|------|--------|----------------|
| `feedback_hos_team_burnout_deadline_push-team-harder` | Push team harder | `Crunch time! Watch those resignations roll in. Fresh talent is cheap anyway.` | `More overtime, same roadmap. Watch churn spike while HR rebrands it as mobility. Nobody's impressed—except the spreadsheet.` |
| `feedback_hos_delegation_gone_wrong_admit-oversight-failure` | Admit oversight failure | `Taking the L. Your delegation authority will shrink. But you're honest.` | `You admitted the gap. Your remit shrinks next quarter. Small price for not doing denial theatre in the postmortem.` |

**Optional (same regen if edited):** `feedback_hos_congressional_hearing_demand_minimize-risks-under-oath` — replace leading **“Nice perjury charge”** with **`Lovely — a perjury charge.`** or **`Perjury it is, then.`** to drop US-bro “Nice.” opener.

---

## Part E — Regeneration workflow

1. Apply Part A–B (structure + incident) and Part C voice discipline when reviewing any new line.
2. Merge all **after (target)** `roaster` strings from Part D.
3. Regenerate Roaster assets under `public/audio/voices/roaster/feedback/hos/` for **every trigger** listed in D1–D4 (and optional congressional right path if edited).
4. Confirm stems: `feedback_{cardId}_{slugify(visibleLabel)}`.
5. Spot-check in-game with **V.E.R.A.** selected: spoken line matches on-screen `roaster` text.

---

## Summary

| Category | Regen? |
|----------|--------|
| P0 field swap (2 cards) | No |
| Part B incident / RealWorld / body-only | No (unless optional `hos_copyright_team_blame` roaster) |
| Part D Roaster tables | **Yes** |

**Roaster clips to regenerate (baseline):** **12** triggers — D1: 2, D2: 6, D3: 2, D4: 2. **+1** if optional minimize-under-oath or `hos_copyright_team_blame` cooperate roaster is edited.

**Files:** [`src/data/cards/head-of-something.ts`](src/data/cards/head-of-something.ts), Roaster audio under `feedback/hos/`, [`docs/AUDIO_SYSTEM.md`](docs/AUDIO_SYSTEM.md).
