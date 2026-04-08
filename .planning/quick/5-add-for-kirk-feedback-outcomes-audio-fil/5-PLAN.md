---
phase: quick-05-outcomes-audio
plan: 5
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Roaster feedback audio exists for all card outcomes with roaster text"
    - "Audio files follow naming convention feedback_<cardId>_<slugifiedLabel>.mp3"
  artifacts:
    - path: "public/audio/voices/roaster/feedback/"
      provides: "Pre-baked feedback audio files"
      min_count: 100
  key_links:
    - from: "src/data/cards/*.ts"
      to: "public/audio/voices/roaster/feedback/"
      via: "authoringFeedbackStem slug matching"
      pattern: "feedback_.*\\.mp3"
---

<objective>
Add missing outcome audio files for roaster mode feedback.

Purpose: All cards with roaster text should have corresponding pre-baked audio files for the roast feedback feature.
Output: New audio files in public/audio/voices/roaster/feedback/
</objective>

<context>
# Project Context
- Roaster mode has pre-baked feedback audio files in `public/audio/voices/roaster/feedback/`
- Files follow naming pattern: `feedback_<cardId>_<slugifiedLabel>.mp3`
- Audio generation uses Gemini TTS API via scripts like `scripts/generate-feedback.ts`
- Cards have roaster text in their outcomes (147+ cards have roaster feedback text)
- Existing feedback audio files: ~54 unique slugs (56 files total)

# Reference Files
- @scripts/generate-feedback.ts - Example generation script
- @src/lib/feedbackAudioChoice.ts - authoringFeedbackStem helper (slug generation)
- @public/audio/voices/roaster/feedback/ - Existing audio files
</context>

<tasks>

<task type="auto">
  <name>Task 1: Audit missing feedback audio files</name>
  <files>src/lib/feedbackAudioChoice.ts</files>
  <action>
    Analyze which cards with roaster text are missing corresponding audio files:
    
    1. Get list of all card outcomes with roaster text (grep for `roaster: "` in src/data/cards/)
    2. For each card outcome, compute the audio filename using authoringFeedbackStem logic:
       - card ID + "_" + slugify(outcome.label)
       - Example: "vc_prompt_engineering_precision" + "_" + "refined-precise-prompt" = "feedback_vc_prompt_engineering_precision_refined-precise-prompt.mp3"
    3. Compare against existing files in public/audio/voices/roaster/feedback/
    4. Generate a list of missing audio files with their expected text (from the roaster field)
  </action>
  <verify>
    Script or output listing all missing feedback audio files with card ID, label, and roaster text content
  </verify>
  <done>
    Audit complete - list of N missing audio files with source text
  </done>
</task>

<task type="auto">
  <name>Task 2: Generate missing audio files</name>
  <files>scripts/generate-feedback-audit.ts (new)</files>
  <action>
    Using the audit from Task 1, generate missing audio files:
    
    1. Create or extend generate-feedback.ts with the full list of missing cards
    2. Use Gemini TTS with "Kore" voice (as in existing scripts)
    3. Save as .wav first, then convert to .mp3 (or use existing pattern)
    4. Output to public/audio/voices/roaster/feedback/ with correct naming
  </action>
  <verify>
    New audio files appear in public/audio/voices/roaster/feedback/ matching the audit list
  </verify>
  <done>
    N new audio files generated and playable
  </done>
</task>

</tasks>

<verification>
- [ ] All cards with roaster text have corresponding audio files
- [ ] Naming follows pattern: feedback_<cardId>_<slugifiedLabel>.mp3
- [ ] Audio files are valid and playable
</verification>

<success_criteria>
- Missing audio files generated for roaster feedback outcomes
- Files named correctly following existing convention
- Audio plays correctly when triggered via authoringFeedbackStem
</success_criteria>

<output>
After completion, create `.planning/quick/5-add-for-kirk-feedback-outcomes-audio-fil/5-SUMMARY.md`
</output>
