# Phase 14: Situational & Outcome Imagery Display - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Display images at correct locations across 4 UI surfaces with mobile/web responsive sizing. Integrate image assets (from Phase 13 pipeline) into incident cards, outcome feedback overlays, Game Over collapse page, and archetype verdict page. Includes fallback behavior for missing images and lazy load performance.

</domain>

<decisions>
## Implementation Decisions

### Incident card images
- Image appears **above the text** as a hero banner at the top of the card body
- Aspect ratio: **16:9** — cinematic, compact height, works on mobile
- **Every card** gets an image — consistent visual experience (fallback for gaps)
- Image **moves with the card** during swipe gesture — part of the card, not parallax
- Respects existing card width constraint (`max-w-full lg:max-w-[43rem]`)

### Outcome overlay images
- **Large hero image** at the top of the overlay, 16:9, sarcastic reveal moment
- **Different images per swipe direction** — left and right show distinct outcome images, reinforcing "both options are bad in different ways"
- **Overlay width matches ticket card width** on all breakpoints (mobile + desktop) — currently narrower, needs adjustment
- Image **fades in** (~300ms) when overlay opens — subtle reveal effect
- Personality feedback text, fines, and governance alerts flow below the image

### Collapse page (Game Over - debrief page 1)
- **Full-width hero image** above death ending text
- **Unique image per death type** — each DeathType gets its own collapse image (~6 images total)
- Replaces/supplements the current FontAwesome icon in the death ending display
- Dramatic "you failed" moment — image is the first thing players see

### Archetype verdict (debrief page 3)
- **Centered badge image (1:1)** above archetype name and description
- Feels like unlocking an achievement
- Badge is for in-game display only — LinkedIn sharing currently uses text-only share URLs (no og:image scraping possible)

### Claude's Discretion
- Exact image container styling (border radius, shadow, padding)
- Mobile-specific image height constraints to avoid excessive scrolling
- Transition timing details beyond the ~300ms fade-in direction
- How preloaded images are managed in memory (Image() constructor vs link preload)
- Glitch placeholder CSS implementation details

</decisions>

<specifics>
## Specific Ideas

- Outcome overlay width should match ticket card width — this is a **new layout change** not just image integration
- Glitch placeholder should feel intentional, part of the "Glitched Corporate Surrealism" aesthetic — not like a broken image or missing asset
- Phase 13 architecture defines file naming: `incident-{cardId}.webp`, `outcome-{cardId}-{direction}.webp`, `collapse-{deathType}.webp`, `archetype-{archetypeId}.webp`
- The crossfade from glitch placeholder to real image should feel smooth, not jarring

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CardStack.tsx`: Body section where incident image will be inserted (above sender/text)
- `FeedbackOverlay.tsx`: Header area where outcome hero image goes (above escalation banner)
- `DebriefPage1Collapse.tsx`: Death ending display area — image replaces FontAwesome icon
- `DebriefPage3Verdict.tsx`: Verdict box — badge above archetype name
- `updateMetaTags()` in DebriefPage3: Exists but not usable for LinkedIn (text-only share)

### Established Patterns
- No existing `<img>` tags in codebase — this phase introduces image rendering
- FontAwesome icons used as current visual placeholders (source icons, death icons, archetype icons)
- Audio assets bundled in `public/audio/` — images will follow same pattern in `public/images/`
- Tailwind CSS for all styling — image containers will use Tailwind utilities

### Integration Points
- `Card` type in `types.ts` needs image field(s) — currently text-only
- `ChoiceOutcome` type needs outcome image field (per-direction)
- `DEATH_ENDINGS` data needs collapse image path per DeathType
- `ARCHETYPES` data needs badge image path per ArchetypeId
- Phase 13 provides the image mapping config (cardId → image path)

</code_context>

<deferred>
## Deferred Ideas

- **Composite LinkedIn share card** (badge + stats + branding as og:image) — requires a shareable URL endpoint with server-rendered meta tags, not possible with current text-only LinkedIn share approach
- **Parallax swipe effect** on card images — mentioned as option, decided against for simplicity
- **Blur-up progressive loading** — requires generating thumbnail variants per image, decided against in favor of glitch placeholder

</deferred>

---

*Phase: 14-situational-outcome-imagery*
*Context gathered: 2026-03-16*
