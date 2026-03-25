---
phase: 13-image-asset-pipeline
plan: 02
subsystem: Image Asset Generation Pipeline
tags: [automation, image-generation, gemini-api, webp-conversion, asset-pipeline]
dependencies:
  requires:
    - 13-01 (image mapping config)
  provides:
    - 170 WebP images (118 incidents + 8 outcomes + 7 archetypes + 7 deaths)
    - Reusable image generation script with CLI interface
    - Rate-limited Gemini API integration pattern
  affects:
    - Phase 14 (Situational & Outcome Imagery Display)
    - Phase 15 (asset finalization)
tech_stack:
  added:
    - sharp (^0.34.5) for PNG→WebP conversion and resizing
    - @types/sharp (^0.32.0) for TypeScript types
  patterns:
    - Automated prompt generation from card data
    - CLI-driven generation pipeline with dry-run/force/scope flags
    - Rate limiting (7s between requests) to stay under Tier 1 IPM limits
    - Safety filter handling with per-category blocking thresholds
key_files:
  created:
    - scripts/generate-images.ts (412 lines)
    - Updated package.json with generate:images scripts
  modified:
    - tests/data/image-map.test.ts (vitest API assertion fixes)
decisions:
  - Automated prompt generation from realWorldReference card data (no hardcoded library)
  - Support --scope cso for iterative CSO-first pilot workflow
  - Dry-run mode for preview without API calls
  - Gemini 2.5 Flash Image as default model (overridable via --model)
  - Sharp for WebP conversion (800px width, quality 75)
  - 7-second rate limiting (stays under 10 IPM Tier 1 quota)
metrics:
  duration: 20 minutes
  completed_tasks: 1 of 3
  files_created: 1
  files_modified: 2
  commits: 1
  prompt_generation_test: 170 images (118 incidents + 8 outcomes + 7 archetypes + 7 deaths)
---

# Phase 13 Plan 02: Image Asset Generation Pipeline

**One-liner:** Automated image generation pipeline that reads card data, auto-generates prompts, calls Gemini API, converts to WebP, and saves to correct directories with incremental CSO-first pilot support.

## Objective

Build a re-runnable script that extracts unique `realWorldReference.incident` values from card decks, generates image prompts using an art direction template (no hardcoded prompt library), calls Gemini API, converts to WebP via sharp (800px width, quality 75), and saves to the correct public/images/ directories. Supports iterative pilot workflow — start with CSO incidents via `--scope cso`, review quality, then expand.

## Completed Tasks

### Task 1: Create image generation pipeline script with auto-prompt generation ✓

**Status:** Complete

**What was built:**
- `scripts/generate-images.ts` (412 lines) — standalone TypeScript pipeline script
- Sharp dependency added for WebP conversion
- Auto-prompt generation from card realWorldReference data
- Support for 4 image categories: incidents (~118), outcomes (8), archetypes (7), deaths (7)

**Features implemented:**
1. **CLI argument parsing:**
   - `--scope cso` — CSO incidents only (HEAD_OF_SOMETHING role, 15 incidents for pilot)
   - `--scope incidents|outcomes|archetypes|deaths` — category-specific generation
   - `--dry-run` — preview all prompts without API calls
   - `--force` — regenerate existing files
   - `--model` — override Gemini model (default: gemini-2.5-flash-image)
   - `--slug` — generate single incident by slug

2. **Automated incident extraction:**
   - Reads all ROLE_CARDS card decks
   - Extracts unique `realWorldReference.incident` values
   - Slugifies incident names for URL-safe filenames
   - Tracks which roles reference each incident (for shared incident reporting)

3. **Auto-prompt generation from card data:**
   - Incident prompts: Satirical editorial photo style with AI artifact tells (uncanny valley)
   - Outcome prompts: "Task Failed Successfully" corporate stock photo style
   - Archetype prompts: Character portrait style for LinkedIn shareability
   - Death prompts: Darkly comedic "This is Fine" energy

4. **Image generation via Gemini API:**
   - Model: `gemini-2.5-flash-image` (overridable)
   - Safety settings: `BLOCK_ONLY_HIGH` for all 4 harm categories
   - Response modality: IMAGE with 16:9 aspect ratio
   - Rate limiting: 7-second delay between requests (stays under 10 IPM Tier 1)
   - Error handling: Safety filter blocks logged as warnings, continues to next image

5. **WebP conversion and optimization:**
   - Sharp library for PNG→WebP conversion
   - Resize: max 800px width, withoutEnlargement: true
   - Quality: 75
   - Automatically creates output directories

6. **File skipping for incremental regeneration:**
   - Skips existing files unless --force passed
   - Allows iterative pilot workflow

7. **Cross-role incident sharing report:**
   - After generation, reports which incidents are shared across multiple roles
   - Example: "samsung-chatgpt-code-leak: CSO, Software Engineer, Vibe Coder"

**Package.json scripts added:**
```json
"generate:images": "tsx scripts/generate-images.ts",
"generate:images:pilot": "tsx scripts/generate-images.ts --scope cso --dry-run"
```

**Verification:**
- ✓ `bun run typecheck` passes (no type errors)
- ✓ `bun run generate:images:pilot` (--scope cso --dry-run) generates 15 incident prompts
- ✓ `bun run generate:images -- --dry-run` generates all 170 image prompts (118 + 8 + 7 + 7)
- ✓ All prompts auto-generated from card data (no hardcoded prompt library)
- ✓ Dry-run completes without API calls or GEMINI_API_KEY

**Issue found and fixed (Rule 1 - Bug Fix):**
- **Import names:** Fixed `archetypes` → `ARCHETYPES`, `deathEndings` → `DEATH_ENDINGS`
- **Scope filter logic:** Fixed CSO role name mapping ("cso" → "HEAD_OF_SOMETHING")
- **Vitest assertion API:** Fixed test assertions to use newer vitest API (message as second param to expect)

**Commit:** `6e9e470` — feat(13-02): create image generation pipeline with auto-prompt generation

---

## Checkpoint: Task 2 — Pilot CSO incident generation

**Type:** human-action (authentication gate)

**Blocked by:** GEMINI_API_KEY environment variable must be set with billing-enabled Tier 1 Google AI Studio account

**What needs to happen:**
1. User ensures `GEMINI_API_KEY` is set in environment (must have image generation enabled in billing)
2. User runs: `bun scripts/generate-images.ts --scope cso`
3. Script generates 15 incident images for CSO role (pilot batch)
4. User reviews images in `public/images/incidents/` for quality
5. If quality acceptable, proceed to Task 3
6. If quality needs adjustment, modify prompt template in generate-images.ts and re-run with --force

**Estimated duration:** 10-15 minutes (depends on API response times)

**What was tested:**
- Dry-run: `bun scripts/generate-images.ts --scope cso --dry-run` shows 15 incident prompts
- Full dry-run: `bun scripts/generate-images.ts --dry-run` shows all 170 image prompts
- CLI parsing: All flags (--scope, --dry-run, --force, --model, --slug) parse correctly
- Prompt generation: Auto-generated from realWorldReference card data

---

## Deviations from Plan

### Rule 1 Bug Fixes
1. **Fixed import names for ARCHETYPES and DEATH_ENDINGS**
   - Files were exported as `ARCHETYPES` and `DEATH_ENDINGS` (uppercase), not array form
   - Fixed to iterate over Object.entries() to match Record structure
   - No functional impact — just naming/iteration consistency

2. **Fixed CSO scope filter logic**
   - Scope was comparing lowercase strings to uppercase RoleType enum values
   - Fixed mapping: "cso" → "HEAD_OF_SOMETHING" using proper enum value
   - Now `--scope cso` correctly filters to 15 HEAD_OF_SOMETHING incidents

3. **Fixed vitest assertion API in image-map.test.ts**
   - Newer vitest API uses expect(value, message).toBe() not expect(value).toBe(expected, message)
   - Fixed 2 assertion statements to use correct API
   - All 12 image-map tests now pass

---

## Success Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Pipeline script created | ✓ | scripts/generate-images.ts (412 lines) |
| Auto-prompt generation | ✓ | Generated from realWorldReference, no hardcoded library |
| --scope cso support | ✓ | Filters to 15 HEAD_OF_SOMETHING incidents |
| --dry-run verification | ✓ | 170 images preview without API calls |
| Package.json scripts | ✓ | generate:images, generate:images:pilot added |
| Typecheck passes | ✓ | `bun run typecheck` clean |
| Sharp dependency | ✓ | Added, 800px/q75 conversion implemented |
| Rate limiting | ✓ | 7-second delay between requests |
| Safety filter handling | ✓ | BLOCK_ONLY_HIGH for all categories |
| WebP output format | ✓ | Via sharp, quality 75 |
| Incremental regeneration | ✓ | Skips existing files unless --force |
| Cross-role sharing report | ✓ | Logs shared incidents with role list |
| **Images exist (pending)** | ⏸ | Awaiting Task 2-3: user to run with GEMINI_API_KEY |
| **Image assets tests pass (pending)** | ⏸ | Awaiting Task 3: images generated and tests run |

---

## Next Steps (Awaiting User)

**Task 2 (Checkpoint):** User runs pilot generation
```bash
# Preview first (optional)
bun scripts/generate-images.ts --scope cso --dry-run

# Generate CSO pilot images (15 incidents)
bun scripts/generate-images.ts --scope cso
# Or with progress:
bun scripts/generate-images.ts --scope cso 2>&1 | tee generation.log

# Spot-check results
ls -la public/images/incidents/ | grep -E "samsung|github|zillow|theranos"
```

**Task 3 (Checkpoint):** After pilot approval, generate all remaining images
```bash
# Generate all remaining categories
bun scripts/generate-images.ts --scope outcomes
bun scripts/generate-images.ts --scope archetypes
bun scripts/generate-images.ts --scope deaths

# Or all at once (skips already-generated CSO incidents)
bun scripts/generate-images.ts

# Verify counts
ls public/images/incidents/ | wc -l   # Should be ~118
ls public/images/outcomes/ | wc -l    # Should be 8
ls public/images/archetypes/ | wc -l  # Should be 7
ls public/images/deaths/ | wc -l      # Should be 7

# Run asset validation tests
bun run test:data -- tests/data/image-assets.test.ts
```

---

## Architecture Notes

### Prompt Generation Template

All prompts use art-direction templates injected with incident/outcome/archetype/death metadata:

**Incidents:** "Satirical editorial photograph for a corporate tech magazine. Scene depicts the real-world incident: \"{incident}\" ({date}). Context: {outcome}. Style: Hyper-realistic corporate photography with subtle AI artifacts..."

**Outcomes:** "Corporate stock photo showing \"{consequence}\" as an ironic consequence. 'Task Failed Successfully' energy..."

**Archetypes:** "Professional character portrait embodying \"{name}\" archetype. Traits: {description}. Style: AI-generated character portrait, compelling LinkedIn-shareable quality..."

**Deaths:** "Darkly comedic editorial illustration of catastrophic failure: \"{title}\". Style: 'This is Fine' energy..."

### Role-to-Incident Mapping

Incidents are keyed by slugified incident name and shared across all roles that reference them:
- CSO role: 15 unique incidents
- Other roles: additional incidents not in CSO (HOS, Software Engineer, etc.)
- Total: 118 unique incidents across all 10 roles

### WebP Optimization

- Format: WebP (modern, efficient, widely supported)
- Width: 800px max (responsive, fast loading)
- Quality: 75 (high visual quality, small file size)
- No enlargement: preserves source resolution if smaller than 800px

---

## Session Metrics

**Execution Time:** 20 minutes
**Tasks Completed:** 1/3
**Files Created:** 1 (scripts/generate-images.ts)
**Files Modified:** 2 (package.json, tests/data/image-map.test.ts)
**Commits:** 1
**Type Errors Fixed:** 3 (import names, scope filter, test assertions)

---

*Plan Status:* **Awaiting Checkpoint Approval (Task 2: Pilot CSO Generation)**
*Next Checkpoint:* User runs `bun scripts/generate-images.ts --scope cso` with GEMINI_API_KEY set
*Estimated Continuation:* 15-20 minutes for full generation after pilot approval
