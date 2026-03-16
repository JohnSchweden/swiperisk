# Phase 07: Kirk Easter Egg - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Hidden path to "change the conditions of the test" — a Kirk-style Easter egg where the player refuses the binary swipe choice and breaks the simulation. Rewards creative thinking outside the left/right paradigm. Requirements: KIRK-01 (hidden interaction, not obvious swipe choice) + KIRK-02 (unique ending screen + personality reaction).

</domain>

<decisions>
## Implementation Decisions

### Trigger Mechanism
- **Two triggers, shared counter (`kirkCounter`):** Swipe-UP on any card OR let a pressure-timer expire (counts regardless of whether player interacted during countdown) — both increment the same counter
- **Threshold: 2 refusals** to activate the Kirk path
- **First refusal:** Subtle visual glitch (tiny flicker) + audio cue ("hmm, something happened" tone). Card snaps back. Easy to miss or dismiss.
- **Second refusal:** Strong screen corruption + intense flicker + digital crash/buzz sound (electrical shorting / system failure tone). Simulation breaks, corruption cascade begins.
- **Available on any playthrough from the start** — no unlock requirement

### Corruption Cascade (Post-Trigger)
- After trigger #2, the game continues but with **2-3 corrupted "good news" cards**:
  1. "You got a money raise"
  2. "You have been promoted to CEO of the company"
  3. Something absurd like "You've been awarded the Nobel Prize"
- Cards are completely off-script — the simulation is desperately trying to placate the player
- **Stats change for real during corruption** — absurd values (budget shoots to $999M, heat drops to 0, etc.). Numbers are real but meaningless since Kirk ending triggers after the last corrupted card regardless.
- Visual corruption persists throughout (glitched card text, visual artifacts)
- **Personalities glitch during corruption** — fragments of all three bleed together, garbled feedback
- After the last corrupted card: hard crash into hijacked debrief

### Kirk Ending (Hijacked Debrief)
- **Reuses the existing 3-page debrief flow but corrupted/wrong:**
  - Page 1 (Collapse): Glitched text, simulation's confused perspective
  - Page 2 (Audit Trail): Shows the simulation's bewildered record of your actions
  - Page 3 (Verdict): Kirk-specific archetype replaces normal archetype
- **Personalities break character at the ending** — drop their persona, acknowledge the player beat the system:
  - Roaster: stunned silence or grudging respect
  - Zen Master: genuine acknowledgment/respect
  - Lovebomber: existential crisis
- **Kirk archetype:** "Thinking Outside the Box: Skill Acquired"
- **Instead of Resilience Score:** "Simulation Integrity: 0%" or similar
- **Kirk ending is a true secret** — does NOT count toward the "unlock all endings" collection mechanic, exists outside the normal 6 endings

### LinkedIn Share
- Kirk-specific template: *"I broke the Kobayashi Maru. There was always a third option. Kirk would be proud."*

### Discoverability & Hints
- **Intro screen (always visible):** *"Captain Kirk passed this test. You won't."* — a taunt that doubles as a hint for players who know the reference
- **Initializing screen (always visible):** Terminal boot sequence includes a `[REDACTED]` line:
  ```
  > loading incident database...
  > calibrating pressure systems...
  > override protocols: [REDACTED]
  > simulation ready.
  ```
- **First swipe-up micro-reaction:** Even if the player doesn't commit to the Kirk path, they see the tiny flicker + audio cue — a signal that "something happened"
- **Normal debrief Page 3 hint:** Subtle footnote like *"Endings unlocked: 3/6... or is it?"* — suggesting there's something beyond the known endings

### Claude's Discretion
- Exact corrupted card content and stat display behavior during corruption
- Glitch visual implementation (CSS effects, canvas overlay, etc.)
- Digital crash/buzz sound sourcing (Web Audio API synthesis or audio file)
- Exact wording of personality break-character reactions
- How the hijacked debrief pages render corruption (CSS glitch effects, text scrambling, etc.)
- Whether `kirkCounter` persists across the session or resets per game

</decisions>

<specifics>
## Specific Ideas

- Kirk's approach in the movie: when forced to decide, he "just ignored it" — said "let them do" and refused to engage. The system couldn't handle the irrational misbehavior and eventually the opponents retreated.
- The trigger should feel like **cheating / exploiting a glitch** — the player is reprogramming the simulation, not just "thinking differently"
- Corrupted good-news cards should escalate in absurdity: mundane raise → CEO promotion → Nobel Prize → crash
- The second refusal needs a **hard escalation** in intensity vs the first — strong corruption, intense flicker, digital crash/buzz wiring sound (electrical shorting tone)
- The debrief hint ("3/6... or is it?") should make completionists suspicious that there's a hidden 7th ending

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useSwipeGestures.ts`: Already tracks Y-axis movement — extend threshold detection for UP direction
- `lib/deck.ts` + `data/cards/branches.ts`: Branching injection system — can inject corrupted "good news" cards into the deck
- `hooks/useGameState.ts`: `GameState.history` tracks all decisions — can add `kirkCounter` to state
- `data/deathEndings.ts`: 6 existing death types — add KIRK/KOBAYASHI_MARU as 7th
- `components/game/debrief/`: 3-page debrief flow — hijack with conditional rendering for Kirk path
- `hooks/useArchetype.ts`: Archetype calculation — add Kirk archetype override
- `services/pressureAudio.ts`: Existing audio infrastructure — extend for glitch/crash sounds
- `components/game/InitializingScreen.tsx`: Boot sequence text — add `[REDACTED]` line
- `components/game/IntroScreen.tsx`: Intro copy — add Kirk taunt line

### Established Patterns
- `STAGE_TRANSITIONS` map validates all stage changes — Kirk path uses existing stages (no new GameStage needed, just hijacked content)
- `determineDeathType()` function selects ending — add Kirk detection before normal death logic
- `DeathType` enum for ending variants — add new value
- Personality feedback as `Record<PersonalityType, string>` — Kirk break-character reactions follow same pattern

### Integration Points
- `useSwipeGestures.ts` → detect swipe-up, increment kirkCounter
- `useCountdown.ts` → detect timer expiry without swipe, increment kirkCounter
- `useGameState.ts` → kirkCounter in state, Kirk death type, corrupted card injection
- Debrief components → conditional Kirk rendering based on deathType
- `useArchetype.ts` → Kirk archetype override when deathType is KIRK

</code_context>

<deferred>
## Deferred Ideas

- **Post-Kirk state persistence:** After discovering Kirk ending, change intro text to "Captain Kirk passed this test. So did you." and `[REDACTED]` to `[OVERRIDE DETECTED]` — requires login/persistence system, deferred to V2
- **Multiple Kirk variations:** Different corrupted card sequences or break-character dialogues per personality — could enrich in future phases

</deferred>

---

*Phase: 07-kirk-easter-egg*
*Context gathered: 2026-03-16*
