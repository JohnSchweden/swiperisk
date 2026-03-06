---
status: resolved
trigger: "When recording Speech-to-text, pressing Enter or Send should stop recording and submit for live feedback"
created: 2026-03-07T00:00:00.000Z
updated: 2026-03-07T00:00:00.000Z
---

## Current Focus

hypothesis: RoastTerminal called onSubmit() directly without stopping recording first
test: Run speech recording, press Enter or click Send
expecting: Recording stops, input submitted, roast runs
next_action: None

## Symptoms

expected: When user records Speech-to-text while recording is active, if user pushes Enter or Send button, stop the recording and proceed with normal process of getting live feedback
actual: Recording was never stopped; onSubmit fired but mic/session stayed open; input may have been partial
errors: (user mentioned "error on mobile" in context - may be related to getUserMedia or flow; separate from this fix)
reproduction: Start speech recording, press Enter or click Send button
timeline: New issue

## Eliminated

- useLiveAPISpeechRecognition stopRecording works; issue was submit path never calling it

## Evidence

- RoastTerminal.tsx: textarea onKeyDown and Send button called onSubmit() directly
- No stopRecording() before submit when isRecording
- useRoast handleRoast reads input from state; no awareness of recording

## Resolution

RoastTerminal: added `handleSubmit` that (1) if `isRecording`, awaits `stopRecording()` then yields with `setTimeout(0)` so `onTranscript` → `onInputChange` flushes before submit, (2) calls `onSubmit()`. Wired handleSubmit to textarea onKeyDown (Enter) and Send button instead of onSubmit.
