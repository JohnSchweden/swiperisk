---
phase: 13-image-asset-pipeline
plan: "06"
subsystem: content

tags: [image-generation, prompts, memes, gemini]

# Dependency graph
requires:
  - phase: 13-05
    provides: "Label-based outcome architecture"
provides:
  - Meme-world prompt templates for all image categories
  - Deadpan roast tone instead of corporate photography
  - Random meme format selection for variety
  - Updated prompt exports (scripts/prompts/*.md)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Meme format arrays for random selection"
    - "Deadpan roast tone in prompts"

key-files:
  created: []
  modified:
    - scripts/generate-images.ts

key-decisions:
  - "Use random meme format selection for variety across prompts"
  - "Include explicit 'No corporate photography language' statement in prompts"
  - "Deadpan tone like 'LinkedIn post about failure'"

patterns-established:
  - "Meme-world aesthetic: Meme + corporate + absurd disaster narration"
  - "Format arrays with getRandomMemeFormat() for variety"

requirements-completed: []

# Metrics
duration: 2min
completed: "2026-03-25T19:40:14Z"
---

# Phase 13 Plan 06: Meme-World Prompt Redesign Summary

**Image generation prompts redesigned with meme-world absurdity: Loss.jpg energy, This is Fine references, deadpan roast tone replacing generic corporate stock photo style**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-25T19:37:53Z
- **Completed:** 2026-03-25T19:40:14Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Redesigned all 4 prompt generation functions with meme-world aesthetic
- generateOutcomePrompt(): Satirical meme format with 14 meme reference options
- generateIncidentPrompt(): 14 meme formats including Matrix, Jurassic Park, Loss.jpg
- generateArchetypePrompt(): 10 formats including JoJo, Clash Royale, Among Us
- generateDeathPrompt(): 10 formats including This is Fine, Thanos, Dark Souls

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign prompt templates with meme-world aesthetic** - `1554ff0` (feat)

**Plan metadata:** `f8b0c25` (docs: complete plan)

## Files Created/Modified
- `scripts/generate-images.ts` - Updated all 4 prompt generation functions with meme-world aesthetic
  - Added INCIDENT_MEME_FORMATS, OUTCOME_MEME_FORMATS, ARCHETYPE_MEME_FORMATS, DEATH_MEME_FORMATS
  - Added getRandomMemeFormat() helper for variety
  - Replaced corporate photography language with deadpan roast tone

## Decisions Made
- Use random meme format selection to ensure variety across prompts (not the same meme every time)
- Include explicit "No corporate photography language" statement in prompts to reinforce the aesthetic
- Tone: "Like a LinkedIn post about failure" - deadpan narration of disaster

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification Results

- ✅ `bun scripts/generate-images.ts --scope outcomes --dry-run` shows meme references
- ✅ `grep` confirms 0 instances of "corporate stock photo" / "hyper-realistic" / "AI artifacts" / "extra fingers"
- ✅ 290+ meme reference instances across exported prompts
- ✅ Exported prompts saved to scripts/prompts/*.md (196 total prompts)

## Next Phase Readiness
- Meme-world prompt templates complete
- Ready for image generation with absurd, shareable aesthetic
- No blockers

---
*Phase: 13-image-asset-pipeline*
*Completed: 2026-03-25*
## Self-Check: PASSED

- [x] scripts/generate-images.ts modified with meme-world prompts
- [x] 13-06-SUMMARY.md created
- [x] STATE.md updated (current_plan: 06, completed_plans: 71)
- [x] ROADMAP.md updated (phase 13: 7/7 plans complete)
- [x] Commit 1554ff0: feat(13-06) - prompt templates
- [x] Commit f8b0c25: docs(13-06) - metadata
- [x] 0 instances of corporate photography language
- [x] 275+ meme references in exported prompts
