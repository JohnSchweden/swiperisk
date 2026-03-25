---
status: complete
phase: 13-image-asset-pipeline
source: 13-00-SUMMARY.md, 13-01-SUMMARY.md, 13-02-SUMMARY.md, 13-03-SUMMARY.md, 13-04-PLAN.md
started: 2026-03-25T19:30:00Z
updated: 2026-03-25T20:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. CLI help and argument parsing
expected: |
  Running `bun scripts/generate-images.ts --help` or invalid arguments shows usage information
  Valid arguments parse correctly: --scope hos, --dry-run, --force, --model, --slug, --export-prompts
result: pass

### 2. Dry-run mode preview
expected: |
  `bun scripts/generate-images.ts --dry-run` shows preview of all image generation tasks without making API calls
  Shows counts for incidents, outcomes, archetypes, and deaths
result: pass

### 3. Scope-based generation
expected: |
  `bun scripts/generate-images.ts --scope hos --dry-run` shows only HEAD_OF_SOMETHING incidents and outcomes
  `bun scripts/generate-images.ts --scope incidents --dry-run` shows incident tasks only
  `bun scripts/generate-images.ts --scope outcomes --dry-run` shows outcome tasks only
result: pass

### 4. Single slug generation
expected: |
  `bun scripts/generate-images.ts --slug "samsung-chatgpt-code-leak"` generates tasks for that specific incident
  Creates incident task and both left/right outcome tasks for the slug
result: pass

### 5. Export prompts functionality
expected: |
  `bun scripts/generate-images.ts --export-prompts` creates markdown files in scripts/prompts/
  Files include incidents.md, outcomes.md, archetypes.md, deaths.md, and INDEX.md
  Prompts are auto-generated from card data (no hardcoded library)
result: pass

### 6. Image mapping API correctness
expected: |
  getIncidentImagePath("samsung-chatgpt-code-leak") returns "/images/incidents/samsung-chatgpt-code-leak.webp"
  getOutcomeImagePath("samsung-chatgpt-code-leak", "LEFT") returns "/images/outcomes/samsung-chatgpt-code-leak-left.webp"
  getOutcomeImagePath("samsung-chatgpt-code-leak", "RIGHT") returns "/images/outcomes/samsung-chatgpt-code-leak-right.webp"
  getArchetypeImagePath("KIRK") returns "/images/archetypes/kirk.webp"
  getDeathImagePath("KIRK") returns "/images/deaths/kirk.webp"
result: pass

### 7. Image map data correctness
expected: |
  INCIDENT_IMAGES contains entries for all unique incidents from card data (~118)
  OUTCOME_IMAGES contains ~30 entries (2 per unique HOS incident)
  Keys follow pattern: `${incidentSlug}-left` and `${incidentSlug}-right`
  ARCHETYPE_IMAGES has 7 entries including KIRK
  DEATH_IMAGES has 7 entries including KIRK
result: pass

### 8. Shared-incident lesson invariant test
expected: |
  Test detects when cards sharing the same incident have inconsistent lesson text
  Currently fails due to data quality issues in card data (expected behavior)
  This validates the implementation is working correctly
result: issue
reported: "Shared-incident lesson invariant violated: Incident \"75% Business Model Drift Impact\" has inconsistent left lessons"
severity: major

### 9. WebP generation and optimization
expected: |
  Generated images are WebP format
  Maximum width is 800px (without enlargement)
  Quality setting is 75
  File sizes are reasonable (not excessively large)
result: pass

### 10. Rate limiting and safety handling
expected: |
  7-second delay between successful API calls
  Safety filter blocks are logged as warnings and processing continues
  Rate limit errors (429) trigger 60-second wait and retry
result: pass

## Summary

total: 10
passed: 8
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "Single slug generation creates incident + outcome tasks"
  status: failed
  reason: "--slug only generates incident task, missing outcome tasks"
  severity: major
  test: 4
  root_cause: "Script logic for --slug only handles incidents, not outcomes"
  artifacts:
    - path: "scripts/generate-images.ts"
      issue: "Single slug logic only creates incident task, not outcome pair"
  missing:
    - "When --slug specified, also generate outcome tasks for that incident"
  debug_session: ""

- truth: "Outcome images are tied to decision labels, not swipe direction"
  status: failed
  reason: "Current architecture uses direction-based keys (-left/-right) instead of label-based keys"
  severity: major
  test: "N/A - architectural issue"
  root_cause: "Outcome images keyed by swipe direction (left/right) instead of decision labels shown to users"
  artifacts:
    - path: "data/imageMap.ts"
      issue: "OUTCOME_IMAGES uses ${slug}-left/right keys"
    - path: "scripts/generate-images.ts"
      issue: "extractHosOutcomeLessons() extracts by direction, not label"
    - path: "tests/data/image-map.test.ts"
      issue: "Tests validate direction-based keys"
  missing:
    - "Add slugifyLabel() helper function"
    - "Rewrite buildOutcomeImages() to use label-based keys: ${incidentSlug}-${labelSlug}"
    - "Update getOutcomeImagePath(incidentSlug, labelSlug) signature"
    - "Update generate-images.ts to extract outcomes by label"
    - "Update tests for label-based outcome validation"
  debug_session: ""

- truth: "Shared-incident lesson invariant: all cards with same incident have identical onLeft.lesson and onRight.lesson"
  status: failed
  reason: "Data invariant violation in card data - incident '75% Business Model Drift Impact' has 6 different left lessons across cards"
  severity: major
  test: 8
  root_cause: "Card data quality issue - multiple cards reference same incident but have different lesson text"
  artifacts:
    - path: "data/cards/*.ts"
      issue: "Multiple cards share incident '75% Business Model Drift Impact' but have different onLeft.lesson values"
  missing:
    - "Standardize onLeft.lesson text for incident '75% Business Model Drift Impact' across all cards, or split into separate incident references"
  debug_session: ""
