# Phase 26: Preload outcome & ending assets - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Source:** User-provided plan from conversation

<domain>
## Phase Boundary

Eliminate the 1–2s placeholder flash when:
1. The outcome meme (WebP) appears after a card swipe
2. The death ending GIF (MP4) appears on debrief page 1
3. The archetype GIF (MP4) appears on debrief page 3

Also fix `loading="lazy"` being used unconditionally in `ImageWithFallback` for overlay/above-the-fold content.

</domain>

<decisions>
## Implementation Decisions

### Shared preload utility
- Add `preloadAsset(href: string, as: "image" | "video"): () => void` to `src/utils/preload.ts`
- Injects `<link rel="preload">` tag and returns a cleanup function (mirrors existing CardStack pattern)
- Returns a no-op if `href` is empty

### Outcome image preloading (CardStack)
- Add `useEffect` watching `currentCard` in `src/components/game/CardStack.tsx`
- Preloads both outcome WebPs using `getOutcomeImagePath(incidentSlug, slugify(card.onLeft.label))` and `getOutcomeImagePath(incidentSlug, slugify(card.onRight.label))`
- URLs are `/images/outcomes/{labelSlug}.webp`
- Both URLs knowable while the card is on screen, before user swipes

### Death GIF preloading (App.tsx)
- Add `useEffect` watching `state.deathType` in `src/App.tsx`
- When `deathType` becomes non-null, preload the death MP4 via `getDeathGifPath(state.deathType)`
- URLs are `/images/deaths-gif/{deathSlug}.mp4`

### Archetype GIF preloading (App.tsx)
- Add `useEffect` watching `debrief.archetype` in `src/App.tsx`
- `debrief.archetype` is already computed via `useDebrief` and available in App.tsx scope
- When archetype becomes non-null, preload the archetype MP4 via `getArchetypeGifPath(debrief.archetype.id)`
- URLs are `/images/archetypes-gif/{archetypeSlug}.mp4`

### loading prop on ImageWithFallback
- Add optional `loading?: "lazy" | "eager"` prop to `src/components/ImageWithFallback.tsx`
- Default: `"lazy"` (backward compatible)
- Apply only to `<img>` element — video elements have no `loading` attribute

### Overlay images use eager loading
- `src/components/game/FeedbackOverlay.tsx` — outcome meme `ImageWithFallback` → `loading="eager"`
- `src/components/game/debrief/DebriefPage1Collapse.tsx` — Kirk GIF `ImageWithFallback` → `loading="eager"`
- `src/components/game/debrief/DeathEndingCard.tsx` (if exists) — death GIF `ImageWithFallback` → `loading="eager"`
- `src/components/game/debrief/DebriefPage3Verdict.tsx` — archetype GIF `ImageWithFallback` → `loading="eager"`

### Claude's Discretion
- Exact placement of `useEffect` blocks in App.tsx (after `useDebrief` call on line 174)
- Whether to inline the preload pattern or import the utility in components that only use it once

</decisions>

<specifics>
## Specific Ideas

### preloadAsset utility
```ts
export function preloadAsset(href: string, as: "image" | "video"): () => void {
  if (!href) return () => {}
  const link = document.createElement("link")
  link.rel = "preload"
  link.as = as
  link.href = href
  document.head.appendChild(link)
  return () => { document.head.removeChild(link) }
}
```

### CardStack outcome preload useEffect
```ts
useEffect(() => {
  if (!currentCard?.realWorldReference?.incident) return
  const slug = slugify(currentCard.realWorldReference.incident)
  const cleanLeft = preloadAsset(getOutcomeImagePath(slug, slugify(currentCard.onLeft.label)), "image")
  const cleanRight = preloadAsset(getOutcomeImagePath(slug, slugify(currentCard.onRight.label)), "image")
  return () => { cleanLeft(); cleanRight() }
}, [currentCard])
```

### App.tsx preload effects
```ts
// Preload death GIF as soon as deathType is known
useEffect(() => {
  if (!state.deathType) return
  return preloadAsset(getDeathGifPath(state.deathType), "video")
}, [state.deathType])

// Preload archetype GIF once archetype is computed
useEffect(() => {
  if (!debrief.archetype) return
  return preloadAsset(getArchetypeGifPath(debrief.archetype.id), "video")
}, [debrief.archetype])
```

</specifics>

<deferred>
## Deferred Ideas

- Victory image preloading (`/images/victory.webp`) — out of scope for this phase
- Preloading archetype static images (WebP) for page 3 — only GIF/MP4 in scope
- Cache-control headers on Vercel for static assets — separate infrastructure concern

</deferred>

---

*Phase: 26-preload-outcome-ending-assets*
*Context gathered: 2026-04-11 via user-provided plan*
