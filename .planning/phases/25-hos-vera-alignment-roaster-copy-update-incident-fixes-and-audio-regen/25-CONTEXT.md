# Phase 25: HOS VERA Alignment — Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Source:** `.cursor/plans/hos_plan_audio_appendix_7a712ff6.plan.md` (verified against codebase)

<domain>
## Phase Boundary

Align the Head of Something (HOS) card deck and V.E.R.A. (ROASTER personality) pre-baked audio clips.
Covers: structural card arg fixes, incident/RealWorld copy bridges, V.E.R.A. voice register corrections, roaster feedback copy rewrites, and regeneration of all affected Roaster audio clips.

Single source file: `src/data/cards/head-of-something.ts`
Audio output: `public/audio/voices/roaster/feedback/hos/`

</domain>

<decisions>
## Implementation Decisions

### Part A — Structural fix (no audio regen)
- `hos_ai_management_elimination` and `hos_process_automation_takeover`: swap 5th and 6th `makeCard` string args so long setup paragraph = storyContext (5th), short binary prompt = text (6th). Wording unchanged.

### Part B — Incident copy / RealWorld bridges (no audio regen)
- `hos_team_burnout_deadline`: add one sentence tying forced-ranking / metric fear to crunch/deadline fear in body, OR swap realWorldReference to a crunch-adjacent incident from incidents.ts
- `hos_promotion_politics`: narrow storyContext to dissent/ethics vs politics, OR swap realWorldReference to merit-vs-sponsorship story
- `hos_explainability_politics`: prefix outcome with "Pattern from multiple cases" or name one vetted public case
- `hos_delegation_gone_wrong`: add one phrase in storyContext tying Knight Capital to automated/model deployment/production change risk
- `hos_model_drift_team_blame`: trim storyContext or text so prompt does not repeat the scenario question verbatim
- `shadow_ai_hos_1`: add "shadow AI" term once in storyContext
- Grammar fixes (no regen): `hos_explainability_politics` — "black-box model has…"; `hos_model_drift_team_blame` — "under the bus"; `hos_prompt_injection_copilot_team` — "3 senior devs at risk"; `hos_prompt_injection_review_escape` — "prompt injection vector"

### Part C — V.E.R.A. voice register rules (apply to all roaster edits)
- Avoid: US/internet slang, "Taking the L", "Crunch time!", "Fresh talent is cheap anyway", ironic "Nice." as punchline, repeated "X owes you"
- Use: British understatement, stiff politeness, dry HR/IT speak, weary cynicism without dehumanizing ICs

### Part D — Roaster copy rewrites (require audio regen for each)

**Length constraint:** ≤20 words per roaster string. V.E.R.A. delivers dry one-liners, not paragraphs.

**D1 — hos_copyright_sourcing (2 triggers)**
- `take-the-blame`: "Your calendar invite is Exhibit A. The team buys you coffee until the subpoena."
- `name-the-data-scientist`: "Fed your star DS to IP counsel. Legal wins; your team trusts you like a ToS update."

**D2 — Template variation fixes (6 triggers)**
- `shadow_ai_hos_1 / give-names-to-compliance`: "Compliance wins. Your team filed a collective grievance. Leadership material—just not yours."
- `hos_model_drift_budget_conflict / ship-without-retraining`: "Your team knows you sold them out. CFO nod zeroes at next planning cycle. Everyone loses."
- `hos_promotion_politics / promote-politically-connected`: "Your best performer learned meritocracy is a myth. VP goodwill on layaway—first payment at calibration."
- `hos_explainability_politics / side-with-engineering`: "Better accuracy now. Better fines later. Engineering buys drinks until the first 'why did it do that' deposition."
- `hos_explainability_politics / side-with-auditors`: "Engineering resents you. Auditors forget you by Tuesday. Compliance logs it as a clean audit trail."
- `hos_model_drift_team_blame / defend-and-take-heat`: "Expensive integrity: your team follows you into a dumpster fire. VP sends a calendar hold instead of flowers."

**D3 — Grammar/clarity (2 triggers)**
- `hos_prompt_injection_review_escape / let-it-slide`: "Senior owes you a favor. When prod lights up, you're holding the pager and the blame. Lose-lose."
- `hos_congressional_hearing_demand / testify-honestly-about-gaps`: "Stock tanks. Your reputation takes a hit. Congress respects you. The board is furious."

**D4 — Register fixes (2 triggers)**
- `hos_team_burnout_deadline / push-team-harder`: "More overtime, same roadmap. Watch churn spike while HR rebrands it as mobility. Nobody's impressed—except the spreadsheet."
- `hos_delegation_gone_wrong / admit-oversight-failure`: "You admitted the gap. Your remit shrinks next quarter. Small price for not doing denial theatre in the postmortem."

**Optional (decide at implementation time):**
- `hos_congressional_hearing_demand / minimize-risks-under-oath`: replace "Nice perjury charge" opener with "Lovely — a perjury charge." or "Perjury it is, then."
- `hos_copyright_team_blame / cooperate-with-investigation`: rewrite if duplicate beat with shadow_ai_hos_1 is addressed

### Audio Generation
- Regenerate 12 baseline clips (D1:2 + D2:6 + D3:2 + D4:2) + up to 2 optional
- Both .mp3 (128k) and .opus (96k) per stem
- Script: `scripts/generate-all-feedback-audio.ts` + audit via `scripts/audit-missing-feedback-audio.ts`
- Stems follow pattern: `feedback_{cardId}_{slugify(visibleLabel)}`
- All 14 existing files confirmed present and will be replaced (not created fresh)

### Claude's Discretion
- Order of card body edits within Part B (minor wording)
- Whether to use existing incident from incidents.ts or add inline sentence for team_burnout_deadline
- Whether to include optional triggers (minimize-under-oath, copyright-team-blame)

</decisions>

<specifics>
## Key References

- Source: `src/data/cards/head-of-something.ts`
- Audio output: `public/audio/voices/roaster/feedback/hos/`
- Generation: `scripts/generate-all-feedback-audio.ts`
- Audit: `scripts/audit-missing-feedback-audio.ts`
- Audio format decision: 96kbps Opus + 128kbps MP3 (established Phase 15)
- V.E.R.A. personality: PersonalityType.ROASTER — "British sarcasm, burned-out IT director, cynical"
- makeCard arg order: (id, realWorld, onLeft, onRight, storyContext, text) — 5th=storyContext, 6th=text
- Feedback audio only pre-baked for ROASTER personality; ZEN and LOVEBOMBER use live TTS

</specifics>

<deferred>
## Deferred Ideas

- ZEN / LOVEBOMBER feedback copy edits for same cards — not in scope (no pre-baked clips for those personalities)
- New HOS cards — out of scope for this phase
- `hos_copyright_team_blame` cooperate-with-investigation rewrite — optional, decide at implementation

</deferred>

---

*Phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen*
*Context gathered: 2026-04-10 via plan doc `.cursor/plans/hos_plan_audio_appendix_7a712ff6.plan.md`*
