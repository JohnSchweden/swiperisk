---
phase: quick-05-outcomes-audio
plan: 5
subsystem: audio/roaster-feedback
tags:
  - audio-generation
  - roaster-mode
  - feedback-audio
dependency_graph:
  requires:
    - src/lib/feedbackAudioChoice.ts
    - scripts/generate-feedback.ts
  provides:
    - public/audio/voices/roaster/feedback/*.mp3
  affects: null
tech_stack:
  added:
    - scripts/audit-missing-feedback-audio.ts
    - scripts/generate-all-feedback-audio.ts
  patterns:
    - Gemini TTS with Kore voice
    - WAV to MP3 conversion via ffmpeg
key_files:
  created:
    - scripts/audit-missing-feedback-audio.ts
    - scripts/generate-all-feedback-audio.ts
    - .planning/quick/5-add-for-kirk-feedback-outcomes-audio-fil/missing-audio.json
  modified:
    - public/audio/voices/roaster/feedback/*.mp3 (~83 new files)
decisions:
  - Used Gemini 2.5 Flash TTS with "Kore" voice for consistency with existing files
  - Converted WAV to MP3 at 128kbps using ffmpeg for browser compatibility
  - Batch size of 10 with rate limiting to handle API quota constraints
---

# Quick Plan 5: Add Roaster Feedback Outcome Audio Files

**Objective:** Add missing outcome audio files for roaster mode feedback.

## Summary

Created audit and generation infrastructure, then generated ~83 new feedback audio files for roaster mode. Remaining ~210 files require additional Gemini API quota.

## What Was Done

### Task 1: Audit Missing Feedback Audio Files ✅

- Created `scripts/audit-missing-feedback-audio.ts` to analyze card outcomes
- Identified 291 outcomes with roaster text across all card decks
- Compared against existing 54 audio files in `public/audio/voices/roaster/feedback/`
- Generated `missing-audio.json` with 291 entries showing cardId, label, roaster text

### Task 2: Generate Missing Audio Files 🔄

- Created `scripts/generate-all-feedback-audio.ts` for batch generation
- Used Gemini 2.5 Flash TTS with "Kore" voice (consistent with existing)
- Implemented WAV-to-MP3 conversion via ffmpeg at 128kbps
- Generated ~83 new audio files across multiple sessions
- Used batch processing (10 files per batch) with rate limiting

## Metrics

| Metric | Value |
|--------|-------|
| Original audio files | 54 |
| Outcomes with roaster text | 291 |
| Identified as missing | 237 |
| Generated this session | ~83 |
| Remaining | ~210 |

## Files Created/Modified

- `scripts/audit-missing-feedback-audio.ts` — Audit script
- `scripts/generate-all-feedback-audio.ts` — Generation script
- `missing-audio.json` — Remaining files to generate
- `public/audio/voices/roaster/feedback/feedback_*.mp3` — ~83 new files

## Commits

- `feat(quick-05): add feedback audio audit and generation scripts` — Initial commit with audit and generation scripts
- `feat(quick-05): add 24 more feedback audio files` — Second batch
- `feat(quick-05): add final batch of feedback audio files` — Final batch

## Deviation

### API Quota Limits

- **Type:** External constraint (Gemini API rate limit)
- **Issue:** 10 requests/minute limit caused many generation failures
- **Impact:** ~210 files remain to be generated
- **Workaround:** Created resumable generation script; can continue when quota resets

## How to Continue

Run the generation script again when API quota resets:

```bash
bun scripts/generate-all-feedback-audio.ts
```

The script reads from `missing-audio.json` and only generates files that don't yet exist.

## Verification

- Audio files exist in `public/audio/voices/roaster/feedback/`
- Files follow naming pattern: `feedback_<cardId>_<slugifiedLabel>.mp3`
- TypeScript compilation passes