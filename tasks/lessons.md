# Lessons

Patterns to prevent repeat mistakes. Update after corrections from the user.

**Capture process:**
1. Add learnings here after sessions
2. Use format: `- [RULE] — Why this matters`
3. At end of session, promote broad patterns to `~/.claude/lessons.md` (global) or `memory/*.md`
4. Update `MEMORY.md` index

## Workflow & Process

<!-- Format example:
- [RULE] — Why this prevents mistakes/saves time
  - Context: When did this come up?
  - Fix: What to do differently next time
  - Example: Concrete example
-->

## Code & Architecture

<!-- Project-specific patterns only. Generic patterns live in ~/.claude/lessons.md -->

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] In card decks with narrative violations, verify each card's deathVector semantically matches its violation/lesson. Reuse of the same death ending across multiple semantically different violations indicates incomplete content needing review — Narrative coherence breaks when outcomes don't match the failure mode (e.g., optimization loophole → CONGRESS/governance vs singularity risk → PRISON/legal consequences). Repeated generic values suggest placeholder data left in.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When state lookups reference a computed override value, use the same fallback sequence everywhere to prevent divergence — Different patterns (one using direct lookup, one using computed ?? default) reference different data when the override differs, causing state sync bugs between components. Enforce consistency across all paths and document the synchronization requirement ("same instance as X") in comments.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When selecting pre-baked side-specific assets (audio, graphics, text), resolve through a helper that accounts for card variants (choiceSidesSwapped), not the raw screen choice — Screen position diverges from authoring intent when cards are flipped, causing wrong assets to play or display.

<!-- Captured 2026-03-26 via post-commit analysis -->
- [RULE] When exposing state objects with side-specific fields through tool APIs, include semantic metadata (like feedbackAuthoringStem) alongside presence flags — Tools need both "does feedback exist?" and "which side was it authored for?" to make correct decisions. Exposing only boolean presence is incomplete and forces consumers to guess intent.

<!-- Captured 2026-03-28 via post-commit analysis -->
- [RULE] When exposing game state through tool APIs (WebMCP, etc.), audit all tool consumer code to ensure every referenced field is included in the state payload — Missing fields cause silent failures where tools cannot access state they need, and no error is raised.

<!-- Captured 2026-03-28 via post-commit analysis -->
- [RULE] Audio playback effects coordinating on the same behavior (death audio, victory audio) must reference the same canonical GameStage value across all effects. Outcome screens use `DEBRIEF_PAGE_1` (death when `deathType` is set, victory when null); keep triggers aligned with that stage and `deathType`, not split legacy stages.

<!-- Captured 2026-03-30 via post-commit analysis -->
- [RULE] When card types require special asset handling (like Kirk-breach cards), provide type-specific fallback UI (e.g., glitch placeholder) instead of generic null returns — preserves narrative identity and prevents UI gaps when specialized assets are missing or delayed. Check the card's identifying pattern (slug prefix) and render accordingly, not just `return null` for all missing images.

<!-- Captured 2026-03-30 via post-commit analysis -->
- [RULE] When rendering type-specific content (explanation, lesson blocks for different death endings), always gate each piece with its type discriminator (isKirk, regularDeathType), not just the content presence check — Multiple death types may have the same fields populated, and absence of the type guard causes content to render for the wrong ending type.

## Testing & Verification

<!-- Project-specific testing patterns only. Generic Playwright/Vitest patterns live in ~/.claude/lessons.md -->

<!-- Captured 2026-04-05 via post-commit analysis -->
- [RULE] When removing a card ID, audit ALL data generation and helper scripts that reference it (generate-*.ts, *-CARDS arrays) — Dead references in generation scripts create orphaned audio files and build bloat; card deletions require updates across multiple files, not just card data and tests.
