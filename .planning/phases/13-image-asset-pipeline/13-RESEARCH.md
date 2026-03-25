# Phase 13: Image Asset Pipeline - Research

**Researched:** 2026-03-16
**Domain:** AI image generation pipeline, Gemini API, image processing
**Confidence:** HIGH

## Summary

This phase builds an automated pipeline to generate ~26-28 AI images across four categories (incidents, outcomes, archetypes, deaths), convert them to WebP, and create a typed mapping config. The project already has `@google/genai` (v1.40.0+) as a dependency and established patterns for generation scripts in `scripts/`. The Gemini API offers two image generation paths: native Gemini models (gemini-2.5-flash-image, gemini-3.1-flash-image-preview) via `generateContent`, and dedicated Imagen 4 models via `generateImages`. Both return base64 image data.

Groq does NOT offer image generation -- it is an inference-only platform. The CONTEXT.md mentions "Gemini or Groq" but Groq should be dropped as an option. Gemini is the only viable choice from the listed options.

**Primary recommendation:** Use Gemini native image generation (`gemini-2.5-flash-image` or `gemini-3.1-flash-image-preview`) via `generateContent` with `responseModalities: ["IMAGE"]`, converting output PNG to WebP via `sharp`. Build the pipeline as a single TypeScript script in `scripts/generate-images.ts` following the existing `generate-voice.ts` pattern. Use the `@google/genai` SDK already in the project.

<user_constraints>

## User Constraints (from CONTEXT.md)

> **Superseded 2026-03-26:** The **current** product decisions live in **`13-CONTEXT.md`** and **`13-CONTRACT.md`**: HOS-first pilot (~68 WebP), **incident-keyed** images, outcome files **`{incidentSlug}-left.webp` / `-right.webp`**, **7** archetypes + **7** deaths (incl. KIRK), **runtime prompt generation** (no static prompt library file). The list below is **historical** research capture only.

### Locked Decisions *(historical — see note above)*
- Early idea: per-category incidents (~6) and per-consequence outcomes (~8) — **replaced** by per-reference-case incidents + per-incident outcome pairs
- 6 archetypes / 6 deaths in old brief — **now 7 / 7** including KIRK
- Old total ~26–28 — **pilot ~68**, expansion toward larger incident catalog
- Photorealistic with AI tells for incidents (uncanny valley) — **still applies**
- Outcomes: “Task Failed Successfully” / meme-adjacent — **still applies**, keyed by incident + direction
- Character portraits / death art direction — **still applies**
- Script-first Gemini pipeline — **still applies**
- ~~Structured prompt library file~~ — **replaced** by templates inside `generate-images.ts` + `--export-prompts` markdown
- Directory: `public/images/{incidents,outcomes,archetypes,deaths}/` — **still applies**
- `data/imageMap.ts` — **still applies**; shape per **13-CONTRACT.md**
- No `Card` image field — **still applies**

### Claude's Discretion
- Exact prompt wording for each of the ~28 images
- ~~Consequence type taxonomy~~ — **superseded** by incident slug + direction (13-CONTRACT.md)
- Image dimensions and aspect ratios per entity type
- Gemini vs Groq selection (whichever produces better results) -- NOTE: Groq has no image generation, so Gemini is the only option
- Post-processing details (resize, optimize, compression level)
- Script architecture and error handling

### Deferred Ideas (OUT OF SCOPE)
- Displaying images in UI components -- Phase 14
- Image lazy loading and responsive sizing -- Phase 14
- Image placeholders/loading states -- Phase 14
- Animated or video assets -- not currently scoped

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPELINE-01 | Image prompts (incidents, outcomes, archetypes, deaths) | **Runtime** templates in `generate-images.ts` (+ optional `--export-prompts`); art direction per **13-CONTEXT** |
| PIPELINE-02 | Script or process to generate + save images locally | `scripts/generate-images.ts` using `@google/genai` SDK + `sharp` for WebP conversion |
| PIPELINE-03 | File naming convention + directory structure | `public/images/{incidents,outcomes,archetypes,deaths}/{entity-id}.webp` |
| PIPELINE-04 | Mapping config (card -> image, outcome -> image, archetype -> image, deathType -> collapse image) | `data/imageMap.ts` with typed Records keyed by existing enums/types |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@google/genai` | ^1.40.0 | Gemini API client for image generation | Already in project dependencies; official Google SDK |
| `sharp` | ^0.33.x | PNG-to-WebP conversion + resize | De facto Node.js image processing; libvips-based, extremely fast |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tsx` | ^4.21.0 | Run TypeScript scripts directly | Already in devDependencies; used by existing generation scripts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Gemini native image gen | Imagen 4 (`ai.models.generateImages`) | Imagen 4 is a separate model with dedicated endpoint; native Gemini gives more flexibility with prompts and aspect ratios. Try native first, fall back to Imagen 4 if quality is insufficient |
| sharp | Built-in Canvas/browser APIs | sharp is 10-100x faster, handles WebP natively, already battle-tested in Node.js pipelines |

**Installation:**
```bash
bun add -D sharp @types/sharp
```

Note: `@google/genai` and `tsx` are already installed.

## Architecture Patterns

### Recommended Project Structure
```
scripts/
  generate-images.ts       # Pipeline entry point (run with: bun run scripts/generate-images.ts)
  prompts/
    image-prompts.ts       # All ~28 prompts with metadata (category, entity ID, art direction)

data/
  imageMap.ts              # Record<EntityType, imagePath> mappings (exported via barrel)

public/images/
  incidents/               # ~6 category-keyed images
    prompt-injection.webp
    model-drift.webp
    explainability.webp
    shadow-ai.webp
    copyright.webp
    general-dilemma.webp
  outcomes/                # ~8-10 consequence-type images
    budget-crater.webp
    pr-disaster.webp
    legal-hammer.webp
    team-revolt.webp
    audit-doom.webp
    ...
  archetypes/              # 6 archetype images
    pragmatist.webp
    shadow-architect.webp
    disruptor.webp
    conservative.webp
    balanced.webp
    chaos-agent.webp
  deaths/                  # 6 death type images
    bankrupt.webp
    replaced-by-script.webp
    congress.webp
    fled-country.webp
    prison.webp
    audit-failure.webp
```

### Pattern 1: Typed Prompt Library
**What:** All prompts defined as typed objects with metadata for the pipeline
**When to use:** Always -- single source of truth for all image generation
**Example:**
```typescript
// scripts/prompts/image-prompts.ts

interface ImagePrompt {
  id: string;                    // Unique identifier (matches filename)
  category: "incident" | "outcome" | "archetype" | "death";
  entityKey: string;             // Key in the image map (e.g., "BANKRUPT", "PRAGMATIST")
  prompt: string;                // The generation prompt
  negativePrompt?: string;       // What to avoid
  aspectRatio: string;           // e.g., "16:9", "1:1", "3:4"
  style: string;                 // Art direction notes
}

export const IMAGE_PROMPTS: ImagePrompt[] = [
  {
    id: "bankrupt",
    category: "death",
    entityKey: "BANKRUPT",
    prompt: "Photorealistic corporate office building collapsing into a pile of oversized gold coins and shredded spreadsheets. A tiny executive stands on the roof holding a 'Going Out of Business' sign. Dramatic lighting, dark comedy, cinematic composition.",
    aspectRatio: "16:9",
    style: "dramatic-darkly-comedic",
  },
  // ... ~27 more
];
```

### Pattern 2: Pipeline Script with Per-Prompt Execution
**What:** Script that iterates prompts, generates images, converts to WebP, saves to correct directory
**When to use:** The main pipeline entry point
**Example:**
```typescript
// scripts/generate-images.ts
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";
import { IMAGE_PROMPTS } from "./prompts/image-prompts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const CATEGORY_DIR: Record<string, string> = {
  incident: "public/images/incidents",
  outcome: "public/images/outcomes",
  archetype: "public/images/archetypes",
  death: "public/images/deaths",
};

async function generateImage(prompt: ImagePrompt): Promise<Buffer> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ parts: [{ text: prompt.prompt }] }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: prompt.aspectRatio,
      },
    },
  });

  const imageData = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData
  )?.inlineData?.data;

  if (!imageData) {
    throw new Error(`No image data returned for prompt: ${prompt.id}`);
  }

  return Buffer.from(imageData, "base64");
}

async function convertToWebP(pngBuffer: Buffer): Promise<Buffer> {
  return sharp(pngBuffer).webp({ quality: 85 }).toBuffer();
}

async function main() {
  // Filter to specific prompt IDs if passed as args
  const filterIds = process.argv.slice(2);
  const prompts = filterIds.length > 0
    ? IMAGE_PROMPTS.filter((p) => filterIds.includes(p.id))
    : IMAGE_PROMPTS;

  for (const prompt of prompts) {
    const dir = path.join(process.cwd(), CATEGORY_DIR[prompt.category]);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`Generating: ${prompt.id} (${prompt.category})...`);

    try {
      const pngBuffer = await generateImage(prompt);
      const webpBuffer = await convertToWebP(pngBuffer);
      const outputPath = path.join(dir, `${prompt.id}.webp`);
      fs.writeFileSync(outputPath, webpBuffer);
      console.log(`  Saved: ${outputPath} (${webpBuffer.length} bytes)`);
    } catch (err) {
      console.error(`  FAILED: ${prompt.id} - ${err}`);
    }

    // Rate limit: 10 images per minute on Tier 1
    await new Promise((r) => setTimeout(r, 7000));
  }
}

main().catch(console.error);
```

### Pattern 3: Image Map Following Existing Data Patterns
**What:** Typed mapping config using project's established Record<Enum, T> pattern
**When to use:** For the `data/imageMap.ts` file
**Example:**
```typescript
// data/imageMap.ts
import type { ArchetypeId, DeathType } from "../types";

/** Incident category keys -- not an existing enum, defined here */
export type IncidentCategory =
  | "PROMPT_INJECTION"
  | "MODEL_DRIFT"
  | "EXPLAINABILITY"
  | "SHADOW_AI"
  | "COPYRIGHT"
  | "GENERAL_DILEMMA";

/** Outcome consequence type keys */
export type OutcomeConsequenceType =
  | "BUDGET_CRATER"
  | "PR_DISASTER"
  | "LEGAL_HAMMER"
  | "TEAM_REVOLT"
  | "AUDIT_DOOM"
  | "CAREER_OVER"
  | "REGULATORY_NUKE"
  | "DATA_BREACH";

export const INCIDENT_IMAGES: Record<IncidentCategory, string> = {
  PROMPT_INJECTION: "/images/incidents/prompt-injection.webp",
  MODEL_DRIFT: "/images/incidents/model-drift.webp",
  EXPLAINABILITY: "/images/incidents/explainability.webp",
  SHADOW_AI: "/images/incidents/shadow-ai.webp",
  COPYRIGHT: "/images/incidents/copyright.webp",
  GENERAL_DILEMMA: "/images/incidents/general-dilemma.webp",
};

export const OUTCOME_IMAGES: Record<OutcomeConsequenceType, string> = {
  BUDGET_CRATER: "/images/outcomes/budget-crater.webp",
  PR_DISASTER: "/images/outcomes/pr-disaster.webp",
  // ... etc
};

export const ARCHETYPE_IMAGES: Record<ArchetypeId, string> = {
  PRAGMATIST: "/images/archetypes/pragmatist.webp",
  SHADOW_ARCHITECT: "/images/archetypes/shadow-architect.webp",
  DISRUPTOR: "/images/archetypes/disruptor.webp",
  CONSERVATIVE: "/images/archetypes/conservative.webp",
  BALANCED: "/images/archetypes/balanced.webp",
  CHAOS_AGENT: "/images/archetypes/chaos-agent.webp",
};

export const DEATH_IMAGES: Record<DeathType, string> = {
  BANKRUPT: "/images/deaths/bankrupt.webp",
  REPLACED_BY_SCRIPT: "/images/deaths/replaced-by-script.webp",
  CONGRESS: "/images/deaths/congress.webp",
  FLED_COUNTRY: "/images/deaths/fled-country.webp",
  PRISON: "/images/deaths/prison.webp",
  AUDIT_FAILURE: "/images/deaths/audit-failure.webp",
};
```

### Anti-Patterns to Avoid
- **Putting prompts in the mapping config:** Keep prompt library (generation concern) separate from image map (runtime concern)
- **Generating images at build time:** Pipeline is a dev-time script, not a Vite plugin. Images are committed to public/
- **Using Imagen 4 without trying Gemini native first:** Gemini native models (gemini-2.5-flash-image) support more aspect ratios and have been the primary image gen path since late 2025

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG to WebP conversion | Custom ffmpeg/canvas solution | `sharp` library | WebP encoding is complex; sharp wraps libvips (C library), handles edge cases, 10-100x faster |
| Rate limiting | Custom token bucket | Simple `setTimeout` delay between requests | Only ~28 images; a 7-second delay between requests stays under 10 IPM Tier 1 limit |
| Retry logic | Complex exponential backoff | Simple 1-retry with delay | Only ~28 images; manual re-run of failed prompts via CLI args is fine |
| Image optimization | Manual quality tuning | `sharp.webp({ quality: 85 })` | sharp's WebP encoder handles optimization automatically |

**Key insight:** This is a ~28 image batch job, not a production image pipeline. Keep it simple -- iterate prompts, generate, convert, save. The script is run once (or a few times) during development, not in production.

## Common Pitfalls

### Pitfall 1: Gemini Safety Filters Blocking Prompts
**What goes wrong:** Gemini's content safety filters block corporate disaster/failure scenes, especially prompts mentioning prison, disasters, or dramatic failures
**Why it happens:** Google's safety filters became significantly stricter after Nano Banana 2 (Feb 2026). Prompts with "prison", "handcuffed", "disaster" can trigger SAFETY blocks.
**How to avoid:**
- Frame all prompts as "satirical editorial illustration" or "corporate editorial cartoon"
- Add "fictional", "stylized", "editorial" language to every prompt
- Avoid words like "prison", "handcuffed" -- use "courthouse", "legal proceedings"
- Set safety settings to `BLOCK_ONLY_HIGH` in the API call
- Test each prompt individually before batch running
**Warning signs:** Response returns with `finishReason: "SAFETY"` or empty image data

### Pitfall 2: Rate Limit Exhaustion (429 Errors)
**What goes wrong:** Generating all ~28 images too quickly hits the 10 IPM (images per minute) Tier 1 limit
**Why it happens:** Free tier has 0 IPM (no image gen). Tier 1 gives 10 IPM. Batch requests without delays exceed this.
**How to avoid:**
- Add 7-second delay between generation requests (8-9 images/min, under 10 IPM)
- Process prompts sequentially, not in parallel
- On 429 error, wait 60 seconds and retry
**Warning signs:** HTTP 429 responses, "quota exceeded" errors

### Pitfall 3: Free Tier Cannot Generate Images
**What goes wrong:** Script fails immediately with quota errors
**Why it happens:** Since Dec 2025, Gemini API free tier has 0 IPM -- image generation requires paid Tier 1 ($0.03/image)
**How to avoid:** Ensure GEMINI_API_KEY is for a billing-enabled account. Total cost for ~28 images is under $1.
**Warning signs:** 429 errors on first request

### Pitfall 4: Gemini Returns PNG, Not WebP
**What goes wrong:** Assuming Gemini returns WebP directly and skipping conversion
**Why it happens:** Gemini native image generation returns `image/png` base64 data, not WebP
**How to avoid:** Always run the sharp WebP conversion step, even if output looks correct as PNG
**Warning signs:** Files are much larger than expected (PNG vs WebP)

### Pitfall 5: Vite public/ Directory Gotcha
**What goes wrong:** Images not found at runtime because paths don't match
**Why it happens:** Vite serves `public/` at the root. `public/images/foo.webp` is served at `/images/foo.webp`
**How to avoid:** Image map paths should start with `/images/...` (no `public/` prefix). This matches how other assets like `public/audio/` are already served.
**Warning signs:** 404 errors for image paths in browser console

### Pitfall 6: Large Image Files Bloating Repository
**What goes wrong:** Generated PNG files or uncompressed WebP files are too large for git
**Why it happens:** Default Gemini output can be 1K-4K resolution PNGs (several MB each)
**How to avoid:** Always convert to WebP with quality 80-85. Resize to reasonable dimensions (e.g., 1024px max width for cards, 512px for thumbnails). Target <100KB per image.
**Warning signs:** Individual images over 200KB, total image directory over 5MB

## Code Examples

### Gemini Image Generation (verified from official docs + existing project pattern)
```typescript
// Source: https://ai.google.dev/gemini-api/docs/image-generation
// Follows existing scripts/generate-voice.ts pattern in this project

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: [{ parts: [{ text: "A satirical editorial illustration of a corporate boardroom..." }] }],
  config: {
    responseModalities: ["IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
    },
  },
});

const imageData = response.candidates?.[0]?.content?.parts?.find(
  (p) => p.inlineData
)?.inlineData?.data;

if (imageData) {
  const buffer = Buffer.from(imageData, "base64");
  // buffer is PNG data -- convert to WebP via sharp
}
```

### Imagen 4 Alternative (if Gemini native quality is insufficient)
```typescript
// Source: https://ai.google.dev/gemini-api/docs/imagen

const response = await ai.models.generateImages({
  model: "imagen-4.0-generate-001",
  prompt: "A satirical editorial illustration...",
  config: {
    numberOfImages: 1,
    aspectRatio: "16:9",  // supports: 1:1, 3:4, 4:3, 9:16, 16:9
  },
});

const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
if (imageBytes) {
  const buffer = Buffer.from(imageBytes, "base64");
  // buffer is PNG data
}
```

### Sharp PNG-to-WebP Conversion
```typescript
// Source: https://sharp.pixelplumbing.com/api-output
import sharp from "sharp";

async function convertToWebP(pngBuffer: Buffer, maxWidth = 1024): Promise<Buffer> {
  return sharp(pngBuffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}
```

### Safety Settings Configuration
```typescript
// Source: https://ai.google.dev/gemini-api/docs/safety-settings
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: [{ parts: [{ text: prompt }] }],
  config: {
    responseModalities: ["IMAGE"],
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Imagen 3 | Imagen 4 (imagen-4.0-generate-001) | 2025-2026 | Imagen 3 is deprecated/shut down. Use Imagen 4 if using dedicated image model |
| Separate image generation API | Gemini native image gen (Nano Banana) | Late 2025 | generateContent now supports IMAGE modality directly -- no separate endpoint needed |
| @google/generative-ai | @google/genai | 2025 | New SDK package name; project already uses the correct one |
| Free tier image gen | Paid-only (Tier 1+) | Dec 2025 | Free tier IPM dropped to 0; must have billing enabled |

**Deprecated/outdated:**
- Imagen 3: Shut down, replaced by Imagen 4
- `@google/generative-ai` npm package: Replaced by `@google/genai`
- Groq for image generation: Groq has NO image generation API (inference-only platform). The ARCHITECTURE.md mention of "Midjourney / DALL-E 3 / Stable Diffusion" is outdated -- CONTEXT.md correctly narrowed to Gemini API.

## Open Questions

1. **Gemini model selection: gemini-2.5-flash-image vs gemini-3.1-flash-image-preview**
   - What we know: Both support image generation. 3.1 Flash supports up to 4K resolution and has "thinking" mode. 2.5 Flash is optimized for speed/efficiency.
   - What's unclear: Which produces better quality for satirical/editorial style images. Quality differences for photorealistic vs meme-adjacent styles.
   - Recommendation: Start with `gemini-2.5-flash-image` (faster, cheaper). If quality is insufficient for specific categories, try `gemini-3.1-flash-image-preview`. The script should accept a `--model` flag to switch.

2. **Optimal aspect ratios per category**
   - What we know: Gemini supports many ratios (1:1, 16:9, 3:4, 4:3, etc.). Cards are displayed vertically on mobile.
   - What's unclear: What Phase 14 will need for each placement (card images, overlays, full-width, badges).
   - Recommendation: Generate at 16:9 for incidents/deaths (dramatic, cinematic), 1:1 for archetypes (portrait/badge), 4:3 for outcomes (versatile). Can regenerate if Phase 14 needs different ratios.

3. **~~Consequence type taxonomy~~** — **Superseded (2026-03-26):** Outcomes are **`{incidentSlug}-left` / `-right`** files per **13-CONTRACT.md**, not an eight-type enum.

## Validation Architecture

> **Updated 2026-03-26:** Align with **`13-VALIDATION.md`**. There is **no** `image-prompts.test.ts` or static prompt library gate.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | vitest.config.ts |
| Quick run command | `bun run test:unit` |
| Full suite command | `bun run test:data` |

### Phase requirements → test map
| Req ID | Behavior | Test type | Automated command | Notes |
|--------|----------|-----------|-------------------|--------|
| PIPELINE-01 | imageMap + pilot key contracts (HOS incidents, `-left`/`-right` keys, invariants) | unit | `bun vitest run tests/data/image-map.test.ts -x` | Matches **13-CONTRACT.md** |
| PIPELINE-02 | Script generates and saves images | manual / opt-in | Local `bun scripts/generate-images.ts` + key | **Never** in CI |
| PIPELINE-03 | Files exist at mapped paths | unit | `bun vitest run tests/data/image-assets.test.ts -x` | Read-only `existsSync` |
| PIPELINE-04 | Same as map/path integrity | unit | `image-map` + `image-assets` | Optional pure `buildImageTasks` tests later |

### Sampling Rate
- **Per task commit:** `bun run test:unit`
- **Per wave merge:** `bun run test:data`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 gaps
- [ ] `tests/data/image-map.test.ts` — pilot HOS contracts + archetype/death enums + optional slug-collision
- [ ] `tests/data/image-assets.test.ts` — on-disk files for all mapped paths

## Sources

### Primary (HIGH confidence)
- [Gemini Image Generation Docs](https://ai.google.dev/gemini-api/docs/image-generation) -- API endpoints, models, parameters, JS examples
- [Imagen 4 Docs](https://ai.google.dev/gemini-api/docs/imagen) -- Imagen 4 models, dedicated generateImages endpoint
- [Gemini Safety Settings](https://ai.google.dev/gemini-api/docs/safety-settings) -- Safety filter configuration
- [@google/genai npm](https://www.npmjs.com/package/@google/genai) -- SDK documentation, v1.40.0+
- [sharp GitHub](https://github.com/lovell/sharp) -- WebP conversion API
- Existing project code: `scripts/generate-voice.ts`, `package.json`, `data/index.ts`

### Secondary (MEDIUM confidence)
- [Gemini Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits) -- Tier 1: 10 IPM, free tier: 0 IPM
- [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing) -- $0.03/image for Imagen, Gemini native pricing varies
- [AI Free API - Rate Limit Guide](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits) -- Dec 2025 changes, tier details

### Tertiary (LOW confidence)
- [Content Safety Guide](https://help.apiyi.com/en/nano-banana-2-content-safety-image-generation-failure-guide-en.html) -- Community workarounds for safety filters (needs validation per prompt)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- @google/genai already in project, sharp is de facto standard
- Architecture: HIGH -- follows existing project patterns (generate-voice.ts, data barrel exports)
- Pitfalls: HIGH -- rate limits and safety filters well-documented; free tier limitation confirmed by multiple sources
- Prompt engineering: MEDIUM -- art direction quality depends on iterative testing with Gemini models

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (Gemini API is fast-moving; model names and limits may change)
