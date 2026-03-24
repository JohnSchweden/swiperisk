---
phase: 15-voice-files-expanded
plan: 04
subsystem: audio

# Dependency graph
requires:
  - phase: 15-03
    provides: Head of Something voice files generated
provides:
  - Voice file hierarchical organization with subfolders
  - Updated playback path resolution logic
  - Updated generation scripts with subfolder output
  - Updated test suite with new paths
affects:
  - voice-audio-files.spec.ts
  - voice-archetype-audio.spec.ts
  - voice-death-audio.spec.ts
  - voice-hos-critical-audio.spec.ts
  - voicePlayback.ts
  - All voice generation scripts

tech-stack:
  added: []
  patterns:
    - Subfolder organization by content type
    - Backwards-compatible path resolution
    - Trigger-based folder mapping

key-files:
  created:
    - public/audio/voices/{roaster,zenmaster,lovebomber}/archetype/
    - public/audio/voices/{roaster,zenmaster,lovebomber}/death/
    - public/audio/voices/{roaster,zenmaster,lovebomber}/feedback/
    - public/audio/voices/{roaster,zenmaster,lovebomber}/core/
  modified:
    - services/voicePlayback.ts
    - scripts/generate-archetype-voices.ts
    - scripts/generate-death-roaster.ts
    - scripts/generate-death-zenmaster.ts
    - scripts/generate-death-lovebomber.ts
    - scripts/generate-hos-tier1.ts
    - scripts/generate-hos-tier2.ts
    - scripts/generate-hos-tier3.ts
    - scripts/generate-voice.ts
    - scripts/generate-feedback.ts
    - scripts/generate-all.ts
    - scripts/generate-archetype-voices-remaining.ts
    - tests/voice-audio-files.spec.ts
    - tests/voice-archetype-audio.spec.ts
    - tests/voice-death-audio.spec.ts
    - tests/voice-hos-critical-audio.spec.ts

key-decisions:
  - "Maintained backwards compatibility: empty subfolder string falls back to root path"
  - "Trigger prefix determines folder: archetype_, death_, feedback_ have dedicated subfolders"
  - "Core files (onboarding, victory, failure) moved to core/ subfolder"
  - "All 71 files successfully migrated with no duplicates or data loss"

requirements-completed:
  - VOICE-04
  - VOICE-05

duration: 18min
completed: 2026-03-24
---

# Phase 15 Plan 04: Voice Files Restructure Summary

**71 voice files reorganized into hierarchical folder structure with subfolders for archetype, death, feedback, and core content types.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-24T20:03:00Z
- **Completed:** 2026-03-24T20:21:00Z
- **Tasks:** 4
- **Files modified:** 16 files across services, scripts, and tests

## Accomplishments

1. **Created subfolder structure** with 4 content-type categories per personality
2. **Migrated 71 WAV files** without data loss or duplicates
3. **Updated voicePlayback.ts** with trigger-based subfolder resolution
4. **Updated 11 generation scripts** to output to correct subfolders
5. **Updated 4 test files** with new subfolder paths
6. **Maintained backwards compatibility** through empty subfolder fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Create subfolder structure and migrate files** - `b99efa3` (refactor)
2. **Task 2: Update voicePlayback.ts with subfolder resolution** - `274a830` (feat)
3. **Task 3: Update voice generation scripts** - `4d0ede9` (feat)
4. **Task 4: Update tests and verify playback** - `f8eafab` (test)

## Files Created/Modified

### Services
- `services/voicePlayback.ts` - Added `getSubfolder()` function for path resolution

### Scripts (11 files)
- `scripts/generate-archetype-voices.ts` - Output to archetype/ subfolder
- `scripts/generate-death-roaster.ts` - Output to death/ subfolder
- `scripts/generate-death-zenmaster.ts` - Output to death/ subfolder
- `scripts/generate-death-lovebomber.ts` - Output to death/ subfolder
- `scripts/generate-hos-tier1.ts` - Output to feedback/ subfolder
- `scripts/generate-hos-tier2.ts` - Output to feedback/ subfolder
- `scripts/generate-hos-tier3.ts` - Output to feedback/ subfolder
- `scripts/generate-voice.ts` - Output to core/ subfolder
- `scripts/generate-feedback.ts` - Output to feedback/ subfolder
- `scripts/generate-all.ts` - Added getSubfolder() helper for dynamic routing
- `scripts/generate-archetype-voices-remaining.ts` - Output to archetype/ subfolder

### Tests (4 files)
- `tests/voice-audio-files.spec.ts` - Updated paths to include core/ and feedback/
- `tests/voice-archetype-audio.spec.ts` - Updated paths to include archetype/
- `tests/voice-death-audio.spec.ts` - Updated paths to include death/
- `tests/voice-hos-critical-audio.spec.ts` - Updated paths to include feedback/

## Decisions Made

- **Backwards compatibility maintained**: Empty subfolder string falls back to root path, allowing gradual migration
- **Trigger-based folder mapping**: Function checks trigger prefix (archetype_, death_, feedback_) to determine destination
- **Core files identified explicitly**: Array of core triggers ["onboarding", "victory", "failure"] for type checking

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Voice file hierarchy complete and tested
- All generation scripts updated for new structure
- Ready for future audio file additions that will automatically go to correct subfolders

---
*Phase: 15-voice-files-expanded*
*Completed: 2026-03-24*
