# Phase 14: Situational & Outcome Imagery Display — Architecture

## Purpose

Display images at correct UI locations with responsive sizing for mobile and web. Images must not break layout or performance.

---

## Display Locations

| Location | Image Type | Placement |
|----------|------------|-----------|
| **Incident card** | Incident (uncanny) | Above or below card text |
| **Outcome feedback overlay** | Outcome (sarcastic) | Alongside feedback text |
| **Game Over (Page 1 — Collapse)** | Collapse (dramatic) | Full-width or hero |
| **Archetype verdict (Page 3)** | Archetype (badge) | Primary share asset |

---

## Responsive Sizing

### Mobile
- **Incident card:** Constrained width (e.g. max 100% viewport), aspect ratio 16:9 or 4:3, avoid excessive scroll
- **Outcome overlay:** Smaller, possibly stacked above text
- **Collapse:** Full viewport height or constrained hero
- **Archetype badge:** Large enough to read, fits share card (e.g. 1:1 or 4:3)

### Web
- **Incident card:** Max width (e.g. 43rem to match card), preserve aspect ratio
- **Outcome overlay:** Side-by-side or stacked, adequate padding
- **Collapse:** Hero section, max-height for large screens
- **Archetype badge:** High-res for share (e.g. 1200×630 for og:image)

---

## Technical Requirements

- **Lazy load** — Don't block initial render; load images when card/overlay appears
- **Fallback** — Placeholder or hide when image missing
- **Aspect ratio** — Use `aspect-ratio` CSS or explicit dimensions to avoid layout shift
- **Format** — WebP preferred for size; fallback to PNG/JPG

---

## Requirements (Phase 14)

- IMAGE-01: Incident card image placement + sizing (mobile + web)
- IMAGE-02: Outcome overlay image placement + sizing
- IMAGE-03: Collapse page (Game Over) image placement + sizing
- IMAGE-04: Archetype verdict image (tactical patch style) + share card sizing
- IMAGE-05: Fallback when image missing (placeholder or hide)
- IMAGE-06: Lazy load / performance (avoid blocking render)
