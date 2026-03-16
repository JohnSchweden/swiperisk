---
phase: 03-no-win-scenario-cards
plan: 04-revised
type: checkpoint:human-verify
wave: 4
depends_on: [03-03-revised]
files_modified: []
autonomous: false
requirements: [NOWIN-01, NOWIN-02, NOWIN-03, NOWIN-04]
user_setup: []

must_haves:
  truths:
    - "All 80+ cards playable in game without errors"
    - "Card variety visible across multiple playthroughs (shuffle working)"
    - "Pressure timers appear on ~20% of cards (high-stakes scenarios)"
    - "Personality feedback distinct and engaging (all 3 voices working)"
    - "No dominant strategies (both outcomes feel costly and meaningful)"
    - "Role-specific framing evident (same scenario, different language per role)"
    - "All 10 new roles have distinct card themes"
    - "Incident authenticity anchors learning (2024-2025 documented cases)"
  artifacts: []
  key_links: []
---

<objective>
Verify Phase 03 no-win scenario cards are live in-game for ALL 10 NEW ROLES, playable without errors, and deliver the intended experience: character-testing dilemmas where both paths carry costs, pressure is calibrated for impact, and personalities make losses memorable.

Purpose: Confirm 80+ new cards (NOWIN-01 through NOWIN-04 requirements met) are production-ready for the 10-role system before moving to Phase 04 (Immersive Pressure) and Phase 05 (Expanded Risk Scenarios).

Output: UAT sign-off on card experience for all 10 roles, gameplay feel, personality voice quality, pressure calibration, and incident authenticity.
</objective>

<execution_context>
@/Users/yevgenschweden/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
Phase 03 Completion State (from Plans 01, 02-revised, 03-revised):
- 80+ no-win scenario cards generated (8+ per role, 6 incident categories)
- 10 role-specific card files created (not 6 legacy files)
- Card structure validated (tests passing)
- Penalty balance verified (no dominant strategy)
- Personality voices distinct (ROASTER, ZEN_MASTER, LOVEBOMBER)
- Pressure metadata wired (~20% of cards marked urgent, timer auto-resolve)
- E2E tests validate shuffle + pressure integration for all 10 roles
- All tests passing (unit, E2E, data)

**The 10 New Roles:**
1. Chief Something Officer (C-suite liability, board pressure)
2. Head of Something (middle management, politics)
3. Something Manager (budget, spreadsheets)
4. Tech AI Consultant (clients, contracts)
5. Data Scientist (models, training data)
6. Software Architect (system design)
7. Software Engineer (implementation)
8. Vibe Coder (AI-assisted coding) 🆕
9. Vibe Engineer (performance, latency) 🆕
10. Agentic Engineer (autonomous agents) 🆕

Requirements Coverage:
- NOWIN-01: 6+ no-win cards per role (achieved 8-10 per role, 80+ total)
- NOWIN-02: Both outcomes show fine/heat/hype penalties (automated validation)
- NOWIN-03: Lessons explain tradeoff, not declare winner (manual review in UAT)
- NOWIN-04: Feedback reflects complexity, not right/wrong (manual review in UAT)

This checkpoint is final verification that experience is good and ready for downstream phases.
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Phase 03: No-Win Scenario Cards — 10 Role System
- 80+ authentic no-win scenario cards across all 10 NEW roles
- 10 role-specific card files (not legacy 6-file structure)
- 6 incident categories: No-Win Dilemmas, Prompt Injection, Model Drift, Explainability, Shadow AI, Copyright
- Reusable scenario patterns (same incident, different role context)
- Pressure metadata for ~20% of high-stakes cards (timers, auto-resolve, team impact)
- 3-voice personality system integrated (ROASTER cynical, ZEN_MASTER wisdom, LOVEBOMBER enthusiastic)
- E2E tests validating shuffle randomization and pressure integration for all 10 roles
- Incident sources documented (2024-2025 verified cases)

**New Role-Specific Content:**
- Vibe Coder: AI-assisted coding, prompt engineering, LLM tools
- Vibe Engineer: Performance optimization, latency, infrastructure
- Agentic Engineer: Autonomous agents, emergent behavior, automation
- Chief Something Officer: C-suite governance, shareholder liability
- Head of Something: Middle management, team politics
- Something Manager: Budget, ROI, compliance
- Tech AI Consultant: Client contracts, deliverables
- Data Scientist: Model quality, training data, bias
- Software Architect: System design, technical debt
- Software Engineer: Implementation, security, code quality
  </what-built>

  <how-to-verify>
**Play the game 5+ times, sampling DIFFERENT ROLES from the 10 new roles. Verify:**

1. **Card Variety & Shuffle (5 playthroughs across different roles)**
   - [ ] Each playthrough shows different card order (not same sequence)
   - [ ] Total of 80+ unique card IDs across plays (no duplicates in single deck)
   - [ ] Sample cards from different incident types (Prompt Injection, Model Drift, Copyright, etc.)
   - [ ] Each playthrough draws 10-15 cards before game over (deck size consistent)

2. **10-Role System Verification**
   - [ ] Play as **Vibe Coder** — see cards about prompts, LLMs, AI-generated code (NOT traditional coding)
   - [ ] Play as **Agentic Engineer** — see cards about autonomous agents, emergent behavior (NOT manual coding)
   - [ ] Play as **Chief Something Officer** — see C-suite dilemmas (shareholders, board pressure)
   - [ ] Play as **Data Scientist** — see ML-focused cards (model quality, training data)
   - [ ] Each role feels DISTINCT (not generic "developer" cards)

3. **No-Win Pattern (Every card)**
   - [ ] Both left and right outcomes have visible penalties (not one "free" path)
   - [ ] Penalties are comparable magnitude (e.g., both involve 50-100 heat, not 10 vs. 500)
   - [ ] Neither outcome feels obviously "right" (creates ambiguity, not logic puzzle)
   - [ ] Player experiences internal conflict ("Which loss can I live with?")

4. **Personality Voices (Sample 5-10 cards)**
   - [ ] ROASTER feedback is cynical/sarcastic, mocks the choice ("Brilliant. You're an idiot.")
   - [ ] ZEN_MASTER feedback is philosophical/reflective, acknowledges tradeoff ("The path reveals...")
   - [ ] LOVEBOMBER feedback is enthusiastic/supportive, celebrates the choice ("You're amazing, bestie!!")
   - [ ] Voices reference the specific outcome (not generic "good job" / "bad job")
   - [ ] No two personalities say the same thing (voices are distinct)

5. **Pressure Calibration (~20% of cards have timers)**
   - [ ] ~1-2 cards per game show countdown timer (not all cards, not zero)
   - [ ] Timers appear on high-stakes decisions (e.g., security breach, budget cliff, legal escalation)
   - [ ] Timer duration: 30-70 seconds (feels urgent but not impossibly fast)
   - [ ] Timer expiry auto-resolves to a choice (doesn't freeze or break)
   - [ ] Screen/audio escalates under pressure (heartbeat louder, possible screen shake/haptics)
   - [ ] Timer contrast matters: calm cards followed by urgent creates psychological impact

6. **Lesson Quality (Sample 10-15 cards)**
   - [ ] Lessons explain the *tradeoff* (why both paths cost differently)
   - [ ] NOT prescriptive ("Always choose X" or "You should have chosen Y")
   - [ ] Examples:
     - Good: "Speed vs. Quality. Shipping buggy code saves time but exposes you to liability."
     - Bad: "Always prioritize security over speed." (declares winner)
   - [ ] Lessons mention specific consequences from the scenario
   - [ ] Player reads lesson and thinks "I chose differently" (not "I failed")

7. **Role-Specific Framing (Compare cards across roles)**
   - [ ] Play same scenario type in 2+ different roles (e.g., prompt injection)
   - [ ] Language/context shift for each role:
     - Chief Something Officer sees shareholder liability
     - Software Engineer sees timeline/technical debt
     - Something Manager sees budget/cost impact
     - Vibe Coder sees AI-generated code issues
     - Agentic Engineer sees autonomous agent risks
   - [ ] Same incident, different organizational lens (role-specific risk)
   - [ ] Not generic copy-paste across roles

8. **Incident Authenticity (Sample 5 cards)**
   - [ ] Cards reference real 2024-2025 incidents (not fictional scenarios)
   - [ ] Examples that should appear:
     - GitHub Copilot RCE (prompt injection)
     - McDonald's 64M record breach (privacy)
     - 70+ copyright lawsuits (training data)
     - 75% of businesses saw model drift
     - 78% of workers use shadow AI
   - [ ] Player recognizes scenarios as realistic, not made-up
   - [ ] Scenarios feel anchored in real governance challenges

9. **New Role Verification (CRITICAL)**
   - [ ] **Vibe Coder** cards: References to prompt engineering, LLM hallucinations, AI code generation
   - [ ] **Vibe Engineer** cards: References to latency, performance, caching, infrastructure
   - [ ] **Agentic Engineer** cards: References to autonomous agents, emergent behavior, automation
   - [ ] **NOT** seeing generic "developer" cards for these roles
   - [ ] Each new role has DISTINCT thematic content

10. **Personality Tone & Feedback Consistency**
    - [ ] ROASTER consistently uses sarcasm, mocks/judges
    - [ ] ZEN_MASTER consistently uses wisdom, reflective tone
    - [ ] LOVEBOMBER consistently uses enthusiasm, positive spin
    - [ ] Tone matches personality across all cards (not random variation)
    - [ ] Feedback doesn't feel forced or out-of-character

11. **Team Impact & Crew Consequences (Pressure cards)**
    - [ ] Feedback overlay mentions crew impact on some outcomes (e.g., "Team morale hits bottom")
    - [ ] Text is brief, visceral (not dry corporate speak)
    - [ ] Creates emotional weight (losing people matters)

12. **No Regressions (Existing Functionality)**
    - [ ] Role select works (all 10 new roles selectable)
    - [ ] Personality select works (all 3 personalities work)
    - [ ] Game flow intact (intro → personality → role → playing → game over)
    - [ ] Decision flow: swipe left/right, feedback overlay shows lesson + personality voice
    - [ ] Stats (hype, heat, budget) update correctly per decision
    - [ ] Game over conditions work (bankrupt, prison, audit, etc.)

**Session script (20-30 min):**
1. Start game, select ROASTER + **VIBE CODER** (new role)
2. Play 3 cards, verify you see AI/prompt-themed scenarios (not traditional coding)
3. Play until game over, note card variety
4. Restart, select LOVEBOMBER + **AGENTIC ENGINEER** (new role)
5. Play 3-4 cards, verify you see autonomous agent scenarios
6. Restart, select ZEN_MASTER + **CHIEF SOMETHING OFFICER**
7. Play 2-3 cards, verify C-suite governance themes
8. Look for urgent cards (timers), observe pressure effect
9. Exit and review: Do the new roles feel distinct and thematic?

**Success signal:** After playing as 3+ different roles, each role felt unique with appropriate card themes. Vibe Coder ≠ Software Engineer. Agentic Engineer has autonomous agent content.
  </how-to-verify>

  <resume-signal>
**Report findings:**
- Which roles did you play?
- Did Vibe Coder/Agentic Engineer/Vibe Engineer have distinct card themes?
- Did you feel pressure/urgency on ~20% of cards?
- Did personality voices feel distinct and engaging?
- Did any cards feel like they had a "right answer" (dominant strategy)?
- Did lessons feel explanatory (tradeoff) vs. prescriptive (should have)?
- Did you recognize real incidents in the cards?
- Any bugs, crashes, or rendering issues?
- Overall: Does this feel like a character test under pressure, or a logic puzzle?
- **CRITICAL: Do the 10 roles feel distinct with appropriate card themes?**

Type one of:
- "approved" — Phase 03 complete, ready for Phase 04
- "issues: [list of 3-5 key concerns]" — Will route to gap closure
- "needs iteration: [description]" — May need additional plan for polish

  </resume-signal>
</task>

</tasks>

<verification>
Phase 03 complete when:
- [ ] All 5+ playthroughs completed without errors
- [ ] Played as at least 3 different roles from the 10 new roles
- [ ] 80+ unique card IDs encountered (shuffle working, no dead code)
- [ ] ~20% of cards show pressure timers (high-stakes visible)
- [ ] Personality voices distinct and engaging (3-voice system working)
- [ ] No-win pattern evident (both outcomes costly, ambiguous)
- [ ] Lessons explain tradeoff, not declare winner
- [ ] Role-specific framing visible (same scenario, different context)
- [ ] **10 roles feel distinct with appropriate themes (Vibe Coder ≠ Software Engineer)**
- [ ] Real incidents recognized (2024-2025 sourcing authentic)
- [ ] No regressions in existing game flow
- [ ] User feedback positive ("Character test, not puzzle" + "Roles feel distinct")
</verification>

<success_criteria>
- [ ] Phase 03 requirements fully met:
  - [ ] NOWIN-01: 6+ no-win cards per role (achieved 8-10 per role)
  - [ ] NOWIN-02: Both outcomes show fine/heat/hype penalties (validated)
  - [ ] NOWIN-03: Lessons explain tradeoff (verified in UAT)
  - [ ] NOWIN-04: Feedback reflects complexity (verified in UAT)
- [ ] 80+ cards live for all 10 roles, playable, no regressions
- [ ] User feels pressure, character test focus, authentic scenarios
- [ ] **All 10 roles have distinct card themes (not generic copy-paste)**
- [ ] Ready for Phase 04 (Immersive Pressure) and Phase 05 (Expanded Risk Scenarios)
</success_criteria>

<output>
After UAT sign-off, create `.planning/phases/03-no-win-scenario-cards/03-COMPLETION.md` with:
- Playthrough results (# of unique cards, roles played, pressure calibration, personality feedback quality)
- Role distinctiveness confirmation (Vibe Coder vs Software Engineer vs Agentic Engineer)
- Issues encountered (if any) and resolutions
- User feedback summary ("Character test" + "Roles feel distinct" confirmation)
- Phase 03 complete ✓ (ready for downstream phases)
- Update STATE.md and ROADMAP.md to mark Phase 03 complete
</output>
