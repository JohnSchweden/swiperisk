---
phase: 15-voice-files-expanded
plan: 07
subsystem: audio
tags: [tts, gemini, opus, mp3, voice, audio-fix]

requires:
  - phase: 15-voice-files-expanded
    provides: Audio compression pipeline and feedback file structure

provides:
  - 14 regenerated HoS feedback audio files with correct TTS content
  - 21 unique death ending audio files (7 per personality)
  - Generation scripts for future audio regeneration
  - Verified unique SHA256 hashes across all files

affects:
  - Voice playback in FeedbackOverlay
  - Death ending narration

key-files:
  created:
    - scripts/generate-hos-corrupted.ts - HoS feedback regeneration script
    - scripts/generate-death-endings.ts - Unified death endings script
  modified:
    - public/audio/voices/roaster/feedback/*.mp3 - 14 regenerated files
    - public/audio/voices/roaster/death/*.mp3 - 7 unique files
    - public/audio/voices/zenmaster/death/*.mp3 - 7 unique files
    - public/audio/voices/lovebomber/death/*.mp3 - 7 unique files

key-decisions:
  - Used existing death scripts from 15-02 as base for Roaster personality
  - Created new philosophical scripts for ZenMaster death endings
  - Created new enthusiastic scripts for Lovebomber death endings
  - Applied 1-second rate limiting to avoid Gemini API quota issues
  - Compressed all files to Opus (96kbps) + MP3 (192kbps)

requirements-completed: []

duration: 19min
completed: 2026-03-25
---

# Phase 15 Plan 07: Fix Corrupted Audio Files Summary

**Regenerated 35 corrupted audio files (14 HoS feedback + 21 death endings) with correct TTS content matching card data and unique scripts per personality.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-03-24T23:59:29Z
- **Completed:** 2026-03-25T00:18:27Z
- **Tasks:** 6
- **Files modified:** 35 audio files + 2 scripts

## Accomplishments

- Deleted 14 corrupted HoS feedback files that were byte-for-byte copies of generic fallback
- Deleted 21 corrupted death ending files that were identical within each personality
- Regenerated 14 HoS feedback files with correct TTS matching card feedback text
- Generated 21 unique death endings with personality-specific scripts (7 per personality)
- All files now have unique SHA256 hashes - no duplicates

## Task Commits

1. **Task 1: Delete corrupted HoS feedback files** - `c4db128` (fix)
2. **Task 2: Create HoS regeneration script** - `7072afc` (feat)
3. **Task 2: Regenerate 14 HoS feedback files** - `a3ee2d9` (feat)
4. **Task 3: Delete corrupted death files** - `6f6d49e` (fix)
5. **Task 4: Create death endings script** - `b42ad46` (feat)
6. **Task 4: Regenerate 21 death ending files** - `34fa56a` (feat)

## Files Created/Modified

### Scripts
- `scripts/generate-hos-corrupted.ts` - Regenerates 14 corrupted HoS feedback files
- `scripts/generate-death-endings.ts` - Generates 21 unique death endings

### Audio Files Regenerated (14 files)
- `feedback_explainability_hos_2_left/right.*` - Regulators demand explainability
- `feedback_hos_copyright_team_blame_left/right.*` - Legal found copyrighted training data
- `feedback_hos_explainability_politics_left/right.*` - Auditors vs engineering
- `feedback_hos_model_drift_team_blame_left/right.*` - Model drift blame game
- `feedback_hos_prompt_injection_review_escape_left/right.*` - Junior finds vulnerability
- `feedback_hos_team_burnout_deadline_left/right.*` - Deadline pressure
- `feedback_shadow_ai_hos_2_left/right.*` - Senior using unapproved AI

### Death Endings Generated (21 files, 7 per personality)
**Roaster (cynical/sarcastic):**
- All 7 death types with sarcastic commentary

**ZenMaster (philosophical/reflective):**
- All 7 death types with wisdom perspective

**Lovebomber (enthusiastic/supportive):**
- All 7 death types with positive spin

## Decisions Made

- Reused existing Roaster death scripts from Phase 15-02 as they were well-written
- Created new ZenMaster scripts with philosophical tone about each death type
- Created new Lovebomber scripts with enthusiastically supportive tone
- Rate limited API calls to 1 second between requests to avoid quota limits
- Hit API quota after 10 requests, waited 50s and successfully completed remaining files

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Gemini API Rate Limiting**
- Hit quota limit after 10 generations (limit: 10 per minute per model)
- Error: "RESOURCE_EXHAUSTED" with retry delay of ~46 seconds
- Resolution: Waited 50 seconds and re-ran script successfully
- All 14 HoS files and 21 death files generated successfully on second attempt

## User Setup Required

None - no external service configuration required.

## Verification Results

### SHA256 Hash Verification
- **Roaster feedback:** 44 files, 0 duplicates
- **Roaster death:** 7 files, all unique hashes
- **ZenMaster death:** 7 files, all unique hashes  
- **Lovebomber death:** 7 files, all unique hashes
- **Corrupted hash check:** Generic fallback hash (3c034948...) only appears on feedback_ignore.mp3

### Test Results
- `voice-hos-critical-audio.spec.ts`: 27/27 passed
- `voice-death-audio.spec.ts`: 46/46 passed
- Total: 73/73 tests passing

### Audio Quality
- All files: Opus format validated
- All files: File sizes within expected range (not 4.77s generic fallback)
- Duration varies by content (3-8 seconds as expected)

## Next Phase Readiness

- All corrupted audio files fixed
- Voice playback integration ready
- No blockers remaining for Phase 15 completion

---
*Phase: 15-voice-files-expanded*
*Completed: 2026-03-25*
