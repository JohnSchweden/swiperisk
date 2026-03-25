---
phase: 16-kobayashi-maru-ending-variety-system
plan: 04
subsystem: debrief-educational-content
tags: [failure-lessons, death-explanations, educational-content, personality-feedback]
dependency_graph:
  requires: [16-01, 16-02, 16-03]
  provides: [educational-failure-lessons, death-explanation-generator, personality-retry-prompts]
  affects: [debrief-page-1, player-education, replayability]
tech_stack:
  added: []
  patterns: [useMemo-for-stable-randomness, conditional-content-display, personality-specific-copy]
key_files:
  created:
    - data/failureLessons.ts
    - unit/failureLessons.test.ts
  modified:
    - data/deathEndings.ts (added causeHint field)
    - data/index.ts (exported failure lesson functions)
    - components/game/debrief/DebriefPage1Collapse.tsx (integrated explanations and lessons)
decisions:
  - Failure lessons include real-world examples (2024-2025) for authenticity and credibility
  - Death explanations reference actual player choices and accumulated death vectors when available
  - Retry prompts are personality-specific AND death-type-specific (strategy hints not generic encouragement)
  - Random lesson selection memoized to remain stable across re-renders
  - KIRK death type excluded from failure lesson system (has own special flow)
metrics:
  duration: 45 minutes
  tasks_completed: 2
  files_created: 2
  files_modified: 3
  test_coverage: 13 unit tests for failure lessons + 308 total passing unit tests
  smoke_test_pass_rate: 191/191 (100%)
  completion_date: 2026-03-25
---

# Phase 16 Plan 04: Educational Failure Lessons and Death Explanations - Summary

**Transformed debrief from punishment into education: Each death now teaches AI governance failure modes and encourages strategic replayability**

## What Was Built

This plan completed the Kobayashi Maru ending variety system by adding educational content to the debrief. Players now understand WHY they died (connected to their actual choices), learn from AI governance case studies, and receive personality-specific strategy hints for trying again.

### Key Components

**1. Failure Lessons Data (data/failureLessons.ts)**
- 3-4 educational lessons per death type (excluding KIRK)
- Each lesson includes:
  - `title`: Memorable lesson name (e.g., "The Infrastructure Trap")
  - `explanation`: 1-2 sentence description of the AI governance failure mode
  - `realWorldExample`: Real incident from 2024-2025 for authenticity
- Lessons cover real failure patterns:
  - BANKRUPT: Budget management, vendor lock-in, ROI overestimation
  - PRISON: Compliance cover-ups, data destruction, falsified audits
  - CONGRESS: Whistleblower exposure, media firestorms, regulatory dodging
  - FLED_COUNTRY: GDPR enforcement, data sovereignty, diplomatic incidents
  - REPLACED_BY_SCRIPT: Over-automation, algorithmic decisions without human-in-the-loop
  - AUDIT_FAILURE: Documentation gaps, explainability failures, untestable systems

**2. Death Explanation Generator (generateDeathExplanation)**
- Generates contextual explanation connecting player's choices to their ending
- Logic:
  1. If death type has 2+ accumulated death vectors: "Your X decisions involving [theme] led to [ending]..."
  2. Otherwise: Generic explanation for the death type
  - Output is 1-2 sentences, in-universe tone

**3. Personality-Specific Retry Prompts (getRetryPrompt)**
- Returns death-type-specific strategy hint flavored by personality
- Three personality voices:
  - ROASTER: Sarcastic but with actual advice (e.g., "Maybe try NOT signing everything...")
  - ZEN_MASTER: Philosophical with strategy framing (e.g., "The path of financial prudence...")
  - LOVEBOMBER: Encouraging with positive reframe (e.g., "You're SO close! Next time...")
- Each prompt hints at different strategy per death type (not generic "do better")

**4. Updated Debrief Page 1 Display (DebriefPage1Collapse.tsx)**
- Imports and integrates all three functions
- Three new display sections:
  1. "Why You Died" explanation under the death ending card
  2. Random failure lesson callout with title, explanation, and real-world example
  3. Personality-specific retry prompt replaces generic replay line
- All three sections skip KIRK (Kirk has own special rendering)
- Uses `useMemo` for stable randomness (lesson selection doesn't re-randomize on re-renders)

**5. Enhanced Death Endings (deathEndings.ts)**
- Added `causeHint` field to each death type:
  - BANKRUPT: "financial recklessness"
  - PRISON: "regulatory evasion"
  - CONGRESS: "public exposure"
  - etc.
- Provides context for explanation generation and tooltips

## TDD Execution (Task 1)

**RED phase:** Created 13 comprehensive unit tests covering:
- FAILURE_LESSONS has 3-4 entries per non-KIRK death type
- Each lesson has title, explanation, realWorldExample fields
- generateDeathExplanation references player choices and death vectors
- generateDeathExplanation handles both vector-rich and generic cases
- getRetryPrompt returns personality-specific prompts
- getRetryPrompt includes strategy hints based on death type
- All 6 non-KIRK death types supported

**GREEN phase:** Implemented all functions to pass tests (13/13 passing)

**REFACTOR phase:** Code clean and minimal; no refactoring needed

## Verification

✓ All 13 failureLessons unit tests pass
✓ All 308 total unit tests pass (no regressions)
✓ All 191 smoke tests pass (E2E regression checks)
✓ TypeScript typecheck passes (no type errors)
✓ Biome linting passes (all style checks)

## Output Artifacts

- **Commit 1:** `feat(16-04): create failure lessons data and death explanation generator with TDD`
  - Files: data/failureLessons.ts, unit/failureLessons.test.ts, data/index.ts
  - 490 insertions

- **Commit 2:** `feat(16-04): update debrief page 1 with death explanation and failure lessons`
  - Files: data/deathEndings.ts, components/game/debrief/DebriefPage1Collapse.tsx
  - 90 insertions, 6 deletions

## How It Works: Player Journey

1. **Player reaches death ending** (e.g., CONGRESS)
2. **Game Over screen shows:**
   - Death ending title and description (existing)
   - "Why You Died" section: "Your 2 decisions involving public exposure forced Congress to investigate..."
   - Failure lesson: "The Whistleblower Exposure - An employee reported problems to external authorities..."
   - Real-world example: "OpenAI executives testified before Congress after whistleblower concerns..."
   - Strategy retry prompt (personality-specific): "Maybe try NOT making decisions that get you called to testify..."

3. **Player reflection:** Understands the causality, learns from real case, gets specific strategy hint
4. **Encourages replayability:** "Try different strategy next time" instead of generic "do better"

## Design Philosophy Achieved

✓ Endings reveal the player's decision pattern (via accumulated death vectors)
✓ Endings connect to actual choices (not random)
✓ Each ending teaches AI governance (failure lessons with 2024-2025 cases)
✓ Endings encourage trying again with different strategy (personality + death-type-specific prompts)
✓ "You will fail. That's the point." — failure is educational and varied

## Deviations from Plan

None — plan executed exactly as specified. TDD approach produced clean, well-tested code with full test coverage and zero regressions.

## Next Steps

Phase 16 is complete. All four plans have delivered:
- Plan 01: Death vector system foundation ✓
- Plan 02: Vector-aware death type resolution ✓
- Plan 03: Death vector coverage validation and congressional cards ✓
- Plan 04: Educational failure lessons and debrief enhancements ✓

Players now experience consequence-driven, educational endings that vary based on their choices and encourage strategic replayability.
