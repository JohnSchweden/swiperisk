---
status: testing
phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen
source:
  - 25-01-SUMMARY.md
  - 25-02-SUMMARY.md
  - 25-03-SUMMARY.md
  - 25-04-SUMMARY.md
started: 2026-04-10T22:30:00Z
updated: 2026-04-10T22:30:00Z
---

## Current Test

number: 1
name: HOS Card Display - storyContext vs text
expected: |
  When playing as Head of Something role, encountering cards "hos_ai_management_elimination" or "hos_process_automation_takeover":
  - The card displays a SHORT binary question as the main prompt (e.g., "Volunteer to pilot your own replacement or fight the restructuring?")
  - Below the card, a LONG background paragraph appears as story context (e.g., "The CTO's 'AI-First Operations' report concluded...")
  - The short question is NOT repeated in the story context section
awaiting: user response

## Tests

### 1. HOS Card Display - storyContext vs text
expected: Cards show short question as prompt, long paragraph as story context below
result: pending

### 2. Incident Copy Bridge - hos_team_burnout_deadline
expected: |
  Card "hos_team_burnout_deadline" story context mentions "Forced-ranking pressure from above means even one missed sprint becomes a performance flag"
result: pending

### 3. Incident Copy Bridge - hos_promotion_politics  
expected: |
  Card "hos_promotion_politics" mentions the best performer "raised a process concern last quarter"
result: pending

### 4. Incident Copy Bridge - hos_delegation_gone_wrong
expected: |
  Card "hos_delegation_gone_wrong" story context references "Knight Capital's 2012 failure" and "circuit breaker"
result: pending

### 5. Shadow AI Terminology
expected: |
  Card "shadow_ai_hos_1" uses the term "shadow AI" in the story context
result: pending

### 6. Grammar Fix - hos_explainability_politics
expected: |
  Card "hos_explainability_politics" says "black-box model has" (not "black-box has")
result: pending

### 7. V.E.R.A. Roaster Voice - hos_copyright_sourcing
expected: |
  When selecting "Take the blame" on hos_copyright_sourcing, V.E.R.A. says: "Your calendar invite is Exhibit A. The team buys you coffee until the subpoena." (British understatement, no "X owes you")
result: pending

### 8. V.E.R.A. Roaster Voice - hos_promotion_politics
expected: |
  When selecting "Promote politically connected" on hos_promotion_politics, V.E.R.A. says: "Your best performer learned meritocracy is a myth. VP goodwill on layaway—first payment at calibration." (Dry HR speak, not "VP owes you")
result: pending

### 9. V.E.R.A. Roaster Voice - hos_team_burnout_deadline
expected: |
  When selecting "Push team harder" on hos_team_burnout_deadline, V.E.R.A. says: "More overtime, same roadmap. Watch churn spike while HR rebrands it as mobility. Nobody's impressed—except the spreadsheet." (No "Crunch time!" or "Fresh talent is cheap anyway")
result: pending

### 10. V.E.R.A. Roaster Voice - hos_delegation_gone_wrong
expected: |
  When selecting "Admit oversight failure" on hos_delegation_gone_wrong, V.E.R.A. says: "You admitted the gap. Your remit shrinks next quarter. Small price for not doing denial theatre in the postmortem." (No "Taking the L")
result: pending

### 11. Audio Playback - MP3/Opus Files
expected: |
  When playing as Head of Something with V.E.R.A. (ROASTER) personality, audio feedback plays for the 14 updated cards. Audio files exist in public/audio/voices/roaster/feedback/hos/ and play without errors.
result: pending

### 12. Audio Content - No Corruption
expected: |
  Audio files for the 14 updated stems are non-silent (>40KB) and contain actual speech (not empty/static)
result: pending

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0

## Gaps

[none yet]
