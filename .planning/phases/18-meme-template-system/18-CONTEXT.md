# Phase 18: Meme Template System - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning
**Source:** Extracted from Phase 13 CONTEXT.md (GIF Text Overlay System section)

<domain>
## Phase Boundary

Add a parallel image generation mode that uses pre-existing meme/GIF templates (via Imgflip) instead of Gemini AI generation. The `--meme` flag on `scripts/generate-images.ts` selects meme templates, classifies incidents by pattern, generates a short punchline, and overlays text locally. Displaying these images in the UI is Phase 14.

**Phase 13 output consumed here:**
- `scripts/generate-images.ts` — existing pipeline, extended with `--meme` flag
- `data/imageMap.ts` — already maps incident slugs; meme output uses same keys
- `slugifyIncident()` — shared helper for output filenames

</domain>

<decisions>
## Implementation Decisions

### Package: text-on-gif (local overlay, no cost)
- **Chosen:** `text-on-gif` npm package
- Pure JS, no system dependencies (unlike canvas-gif)
- Supports animated GIFs natively (multi-frame)
- Works with URL buffers or local files
- Free, open-source (ISC license)
- No external API calls for the overlay step — fully local

### Template Source: Imgflip (free tier)
- **Free tier is sufficient:**
  - `GET /get_memes?type=gif` — fetch GIF template list (top 100)
  - `POST /caption_image` — caption static memes
- **Not needed:** Premium GIF captioning ($0.02/GIF) — we caption locally with `text-on-gif`
- Strategy: fetch template URLs from Imgflip → download image → add text locally
- No Imgflip API key required for public template fetching

### Template Database: `data/templates/gif-templates.json`
- 70+ templates across 10 categories: classic_internet, lord_of_the_rings, star_wars, simpsons, south_park, breaking_bad, game_of_thrones, anime, gif_animated, movies
- Each entry: `{ id, name, text_zones, best_for[], url }`
- `incident_mapping` field maps 11 incident pattern keys → array of template IDs
- Single source of truth for template selection

### Overlay Service: `lib/gif-overlay.ts`
- **Functions to export:**
  - `getTemplateById(id)` → TemplateInfo | undefined
  - `getTemplatesByPattern(pattern)` → TemplateInfo[]
  - `getRandomTemplateByPattern(pattern)` → TemplateInfo | undefined
  - `getAllTemplateIds()` → string[]
  - `getTemplatesByCategory()` → Record<string, TemplateInfo[]>
  - `searchTemplates(query)` → TemplateInfo[]
  - `addTextToMeme(options)` → Promise<Buffer | null>
  - `addTextToGif(options)` → (delegates to addTextToMeme — handles multi-frame)
  - `classifyIncidentPattern(incident, outcome)` → string
  - `generateMeme(options)` → Promise<{ success, buffer?, error? }>
  - `batchGenerateMemes(tasks)` → Promise<results>
- Text overlay options: fontSize, fontColor, strokeColor, strokeWidth, position (top/middle/bottom)
- Image fetching: downloadImage(url) with redirect handling

### Integration: `--meme` flag on generate-images.ts
- Default mode: AI images via Gemini (unchanged)
- `--meme` mode: meme template overlay
- Incident pattern classification → template selection → punchline truncation → overlay → write to same output dirs
- Output filenames: same slugified keys as AI mode (e.g., `public/images/incidents/{slug}-meme.webp`)

### Incident Pattern Classification (11 patterns)
| Pattern | Triggers |
|---------|----------|
| ignored-warning | warn, red flag, ignore, missed |
| escalating-disaster | drift, cascad, chain, escalat |
| bad-decision | choice, decision, pick, select |
| ai-overconfidence | ai, model, confidence, over |
| team-failure | team, group, board, committee |
| obvious-outcome | obvious, predictable, expect |
| overconfidence | sure, certain |
| data-misuse | data, privacy, leak |
| escalation | (falls through from escalating-disaster) |
| compliance-failure | (mapped in incident_mapping) |
| surprise-twist | (mapped in incident_mapping) |

### Cost
- `text-on-gif`: free (npm)
- GIF templates: free (cached URLs from Imgflip)
- Imgflip API (static captions): free tier
- **Total: $0**

### Output Location
- Meme output goes to same directories as AI images: `public/images/incidents/`, `public/images/outcomes/`
- Filename suffix `-meme` distinguishes from AI-generated files (e.g., `{slug}-meme.webp`)
- OR same filename as AI output (overwrite) — **Claude's discretion** based on what works best for Phase 14 display

### Template Caching: Download Once, Reuse
- Templates are downloaded to a local cache on first use: `data/templates/cache/{id}.{ext}`
- Subsequent runs read from cache — no repeated HTTP requests to Imgflip
- Cache check: if file exists at cache path, skip download
- Cache directory created automatically on first run
- No TTL / expiry — templates are stable; manual cache clear if needed

### Template Database Size: 100+
- Target: 100+ templates (up from 70+)
- Additional templates drawn from: The Office, Parks & Rec, Matrix, Avengers/MCU, Naruto, more classic internet, sports
- Same JSON structure — just more entries across existing and new categories

### Claude's Discretion
- Whether meme files share same filenames as AI images or use `-meme` suffix
- Whether to support multi-text-zone templates (most templates have 1 zone; Expanding Brain has 4)
- Exact punchline truncation length (currently ~8-10 words)
- Whether to convert GIF output to WebP or keep as GIF
- Cache directory location (`data/templates/cache/` vs `.cache/meme-templates/`)

</decisions>

<specifics>
## Specific Ideas

- Incidents should map to culturally recognizable meme templates — "This Is Fine" for escalating disasters, "Surprised Pikachu" for obvious outcomes, "Two Buttons" for bad decisions
- Punchline text: truncate outcome lesson to ~8-10 words — short enough to read on the meme
- Template database includes movie/TV/anime/game references for variety: Star Wars, LOTR, Breaking Bad, Attack on Titan, Jujutsu Kaisen
- Batch processing with 1s rate limiting between memes to avoid hammering Imgflip
- The system is a PARALLEL option — existing Gemini AI generation unchanged

### Top Incident-to-Template Mappings
| Incident Pattern | Templates |
|-----------------|-----------|
| Ignored warnings | Surprised Pikachu, One Does Not Simply, Bad Time |
| AI/Model overconfidence | Distracted Boyfriend, This Is Fine, Expanding Brain |
| Predictable failure | Surprised Pikachu, Arrow to the Knee, Bad Time |
| Escalating disaster | Left Exit 12, Panik Kalm Panik, This Is Fine |
| Bad decision/choice | Two Buttons, Drake, Left Exit 12 |
| Team/group failure | Boardroom Meeting, Homer Backing Away |
| Obvious outcome | Surprised Pikachu, Is This a Pigeon? |

</specifics>

<deferred>
## Deferred Ideas

- Displaying meme images in UI — Phase 14
- Premium Imgflip GIF captioning ($0.02/GIF) — not needed, local overlay works
- Precise X/Y coordinate text positioning — current top/middle/bottom sufficient
- Pre-caching templates at startup vs lazy load — can defer to Phase 14 display decision
- CDN hosting for processed GIFs — Phase 14 concern

</deferred>

---

*Phase: 18-meme-template-system*
*Context extracted from: .planning/phases/13-image-asset-pipeline/13-CONTEXT.md (GIF Text Overlay System section)*
*Extracted: 2026-03-26*
