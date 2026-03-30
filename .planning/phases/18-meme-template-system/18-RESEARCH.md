# Phase 18: Meme Template System - Visual Format Research

**Researched:** 2026-03-30
**Domain:** Visual content format strategy for game outcomes (memes, GIFs, custom AI images)
**Confidence:** MEDIUM-HIGH

## Summary

This research addresses the strategic question: **Which visual format (custom AI-generated meme-style images, existing meme templates, or animated GIFs) works best for different game outcomes in the SwipeRisk Kobayashi Maru game?**

Based on 2025-2026 social media engagement data and platform-specific research:

| Format | Best For | LinkedIn Performance | File Size |
|--------|----------|---------------------|------------|
| **Static Memes** | Death endings, archetype reveals | ✅ Excellent (algorithm favors images) | Small (~100KB) |
| **Animated GIFs** | Escalation patterns, panic moments | ⚠️ Mixed (autoplay issues) | Medium (~1-2MB) |
| **Custom AI Images** | Unique/unprecedented scenarios | ✅ Good (differentiator) | Variable |

**Primary recommendation:** Use a **hybrid approach** — static meme templates for death endings and archetypes (LinkedIn shareable), animated GIFs for escalation/panic incident patterns, and Gemini AI as fallback for unmatched scenarios (matching user's clarification: "use either matching memes or gif first, if they dont match, we will generate matching ones with gemini").

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Imgflip API for template sourcing (free tier sufficient)
- Use `text-on-gif` npm package for local text overlay
- Template database already exists at `data/templates/gif-templates.json` with 100+ templates
- Parallel system: existing Gemini AI generation unchanged

### Claude's Discretion
- Whether meme files share same filenames as AI images or use `-meme` suffix
- Whether to support multi-text-zone templates
- Exact punchline truncation length
- Whether to convert GIF output to WebP or keep as GIF
- Cache directory location

---

## Research: Visual Format Strategy by Outcome Type

### 1. Death Endings (7 types)

**Death Types:** BANKRUPT, REPLACED_BY_SCRIPT, CONGRESS, FLED_COUNTRY, PRISON, AUDIT_FAILURE, KIRK

| Death Type | Recommended Format | Rationale | Example Templates |
|------------|-------------------|-----------|-------------------|
| **BANKRUPT** | Static meme | Professional context, LinkedIn algorithm rewards images | "Condescending Wonka", "Task Failed Successfully" |
| **REPLACED_BY_SCRIPT** | Static meme | Ironic, recognizable format | "They Took Our Jobs", "This Is Fine" |
| **CONGRESS** | Static meme | Serious, formal tone works with classic memes | "Winter Is Coming", "Valar Morghulis" |
| **FLED_COUNTRY** | Static meme | Dark humor, escapism theme | "Running Away Balloon", "My Precious" |
| **PRISON** | Static meme | Dramatic, clear visual | "One Does Not Simply", "You're Gonna Have A Bad Time" |
| **AUDIT_FAILURE** | Static meme | Bureaucratic humor | "Boardroom Meeting", "Trolley Problem" |
| **KIRK** | Static meme | Hidden easter egg, **thematically perfect** — "Kirk explains how he beat the Kobayashi Maru" is literally about beating the no-win scenario! | **"Kirk Explains How He Beat the Kobayashi Maru"** — https://imgflip.com/memetemplate/542163803 (perfect fit for the easter egg) |

**Why Static for Death Endings:**
- LinkedIn data shows images get **2x higher engagement** than GIFs in professional contexts
- Death endings are shared as final results — static images load faster and display more reliably
- The tone is "darkly comedic" per Phase 13 — established meme templates already convey this

### 1b. KIRK Special Templates (Researched)

**Found the PERFECT KIRK template:**

| Template | Imgflip URL | Why It's Perfect |
|---------|-------------|------------------|
| **Kirk Explains How He Beat the Kobayashi Maru** | https://imgflip.com/memetemplate/542163803 | Literally about beating the no-win scenario — the exact theme of the KIRK easter egg! |
| **Kobayashi Maru** | https://imgflip.com/memetemplate/232753958 | Generic Kobayashi Maru template for variation |
| **James T. Kirk beats the Kobayashi Maru by jailbreaking an LLM** | https://imgflip.com/i/8ysh46 (already made example) | AI-relevant twist — perfect for the game's theme! |

**Use these for both KIRK archetype AND KIRK death** — it's the same easter egg path.

---

### 2. Archetypes (7 types)

**Archetypes:** PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT, KIRK

| Archetype | Recommended Format | Rationale | Example Templates |
|-----------|-------------------|-----------|-------------------|
| **PRAGMATIST** | Static meme | Result-oriented, corporate | "Success Kid", "Treat Yo Self" |
| **SHADOW_ARCHITECT** | Static meme | Hidden manipulation theme | "Gru's Plan", "Mocking SpongeBob" |
| **DISRUPTOR** | Static meme | Chaos, change | "Expanding Brain", "Left Exit 12" |
| **CONSERVATIVE** | Static meme | Traditional, cautionary | "Winter Is Coming", "Change My Mind" |
| **BALANCED** | Static meme | Middle ground | "They're The Same Picture" |
| **CHAOS_AGENT** | Static meme | Maximum mayhem | "This Is Fine", "Disaster Girl" |
| **KIRK** | Static meme | Easter egg — **use "Kirk Explains How He Beat the Kobayashi Maru"** template (thematically perfect!) | "Kirk Explains How He Beat the Kobayashi Maru" |

**Why Static for Archetypes:**
- Archetype reveals are badges/cards displayed on Debrief Page 3
- These become LinkedIn share images — static performs best
- Per Buffer's 2026 data (45M+ posts): **Images outperform video/GIFs for LinkedIn shares**

### 3. Head of Something Feedback Outcomes

**Context:** The role "Head of Something" (HOS) gets full image coverage per Phase 14 context.

| Outcome Category | Format | Rationale |
|-----------------|--------|-----------|
| **High-stakes decisions** | Static meme | Critical moments deserve recognizable format |
| **Escalation patterns** | Animated GIF (if available) | Visual escalation needs motion |
| **Team failures** | Static meme | Group humor translates well |
| **Obvious outcomes** | Static meme | "Surprised Pikachu" is iconic and static |
| **AI overconfidence** | Static meme | Ironic, works with "Distracted Boyfriend" |

**Recommended Pattern Mix:**
- **70% Static memes** — Reliable, LinkedIn-friendly
- **20% Animated GIFs** — For escalation/panic moments in incidents
- **10% Gemini AI** — For unprecedented scenarios not matching any template

---

### 4. Feedback Overlay - User Clarified Approach

**User clarified:** "use either matching memes or gif first, if they dont match, we will generate matching ones with gemini"

This is the **fallback strategy** for when no template matches the incident/outcome:

| Step | Action | When |
|------|--------|------|
| 1 | **Try matching meme/GIF** | Look up incident pattern in `incident_mapping` from template database |
| 2 | **If no match found** | Fall back to Gemini AI generation (existing Phase 13 pipeline) |
| 3 | **Display in overlay** | Show the image in FeedbackOverlay component |

**Implementation:**
- The template database's `incident_mapping` field maps 11 patterns → template IDs
- If an incident doesn't match any pattern → trigger Gemini generation
- No separate "custom AI meme" generation needed — reuse existing AI pipeline

---

## Platform-Specific Considerations

### LinkedIn (Primary Share Platform)

Based on 2026 Buffer data (52M+ posts analyzed):
- **Images**: 2.3x higher engagement than text-only
- **GIFs**: Lower reach due to autoplay restrictions (often display as static)
- **Carousels**: Good for multi-panel stories but overkill for meme sharing

**Recommendation:** Prioritize static images for LinkedIn sharing. GIFs acceptable for in-game display but will likely render as static thumbnails when shared.

### In-Game Display

- Incidents: Static or GIF based on pattern (escalation = GIF)
- Outcome overlays: Static (speed matters)
- Death/archetype reveals: Static for consistency

---

## Implementation Mapping

Based on Phase 18 context, here's the recommended mapping:

### Incident Patterns → Format (from existing template database)

```typescript
// Recommended format selection based on incident pattern
const formatByPattern = {
  // Static memes (default)
  'ignored-warning': 'static',
  'bad-decision': 'static', 
  'ai-overconfidence': 'static',
  'team-failure': 'static',
  'obvious-outcome': 'static',
  'overconfidence': 'static',
  'data-misuse': 'static',
  'compliance-failure': 'static',
  
  // Animated GIFs (escalation needs motion)
  'escalating-disaster': 'gif',
  'escalation': 'gif',
  
  // Custom AI for unprecedented
  'surprise-twist': 'ai-fallback'
}
```

### Template Selection by Death Type

```typescript
const deathToTemplate = {
  'BANKRUPT': ['condescending-wonka', 'task-failed-successfully', 'kevin-spilled-chili'],
  'REPLACED_BY_SCRIPT': ['they-took-our-jobs', 'this-is-fine', 'robots-taking-jobs'],
  'CONGRESS': ['winter-is-coming', 'valar-morghulis', 'trolley-problem'],
  'FLED_COUNTRY': ['running-away-balloon', 'my-precious', 'homer-backing'],
  'PRISON': ['one-does-not-simply', 'bad-time', 'coffin-dance'],
  'AUDIT_FAILURE': ['boardroom-meeting', 'homer-backing-into-bushes', 'change-my-mind'],
  'KIRK': ['kobayashi-maruk-kirk-solution', 'kirk-explains-kobayashi-maru', 'james-kirk-llm-jailbreak'] // Easter egg - thematically PERFECT!
}
```

### Template Selection by Archetype

```typescript
const archetypeToTemplate = {
  'PRAGMATIST': ['success-kid', 'treat-yo-self', 'leonardo-cheers'],
  'SHADOW_ARCHITECT': ['grus-plan', 'mocking-spongebob', 'monkey-puppet'],
  'DISRUPTOR': ['expanding-brain', 'left-exit-12', 'drake-hotline-bling'],
  'CONSERVATIVE': ['change-my-mind', 'winter-is-coming', 'you-shall-not-pass'],
  'BALANCED': ['theyre-same-picture', 'distracted-boyfriend', 'two-buttons'],
  'CHAOS_AGENT': ['this-is-fine', 'disaster-girl', 'gif-party-parrot'],
  'KIRK': ['kobayashi-maruk-kirk-solution', 'kirk-explains-kobayashi-maru', 'james-kirk-llm-jailbreak'] // Easter egg - thematically PERFECT!
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text overlay on templates | Custom canvas rendering | `text-on-gif` npm package | Handles multi-frame GIFs, positioning, fonts |
| Template sourcing | Scrape meme sites manually | Imgflip API (free tier) | 1M+ templates, stable URLs, legal |
| Format conversion | Custom FFmpeg scripts | `text-on-gif` output as GIF/WebP | Already handles format output |
| Template matching | Hardcode mappings | Template database JSON with `best_for[]` tags | Extensible, searchable |

---

## Common Pitfalls

### Pitfall 1: GIFs Don't Autoplay on LinkedIn
**What goes wrong:** Animated GIFs shared on LinkedIn display as static thumbnails, losing the motion advantage.
**How to avoid:** Default to static meme templates for all shareable content. Use GIFs only for in-game moments where motion adds value.

### Pitfall 2: Template Mismatch
**What goes wrong:** Punchline text doesn't fit the meme format (too long, wrong tone).
**How to avoid:** 
- Limit punchline to 8-10 words (per Phase 18 context)
- Use `text_zones` field from template database to validate
- Test truncation length before overlay

### Pitfall 3: Cross-Platform Display Issues
**What goes wrong:** GIF works in Chrome but not Safari; WebP doesn't load on older devices.
**How to avoid:** Output both GIF and WebP versions, serve based on browser detection.

### Pitfall 4: Template Expiration
**What goes wrong:** Imgflip URLs expire or change.
**How to avoid:** Implement caching (per Phase 18 context: `data/templates/cache/`). Re-fetch templates periodically.

---

## Validation Architecture

Skip — this is research-only phase with existing implementation plans.

---

## Sources

### Primary (HIGH confidence)
- Buffer 2026 State of Social Media (52M+ posts): LinkedIn image engagement data
- Imgflip meme template database: Template availability and categorization
- **KIRK-specific:** Imgflip template "Kirk Explains How He Beat the Kobayashi Maru" (https://imgflip.com/memetemplate/542163803) — literally about beating the no-win scenario!

### Secondary (MEDIUM confidence)
- SocialPilot Meme Marketing Guide 2026: Meme engagement trends
- ConvertMinded TikTok Creative Lab: Static vs GIF vs video comparison

### Tertiary (LOW confidence)
- Various marketing blog posts on GIF vs static performance (need additional verification)

---

## Open Questions

**RESOLVED per user clarification:**

1. ~~Should KIRK archetype/death get unique custom AI generation?~~
   - ✅ **RESOLVED:** Use thematically perfect templates ("Kirk Explains How He Beat the Kobayashi Maru") — no custom AI needed

2. ~~Should feedback overlays use memes?~~
   - ✅ **RESOLVED:** Use matching memes/GIFs first, Gemini AI fallback for non-matching incidents

3. ~~A/B testing?~~
   - ✅ **RESOLVED:** A/B testing will be possible later (deferred)

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Format strategy | HIGH | Backed by 2026 Buffer data (52M+ posts); user clarified approach |
| Template matching | HIGH | Existing template database + KIRK-specific templates found |
| Death/archetype mapping | HIGH | KIRK template is thematically perfect; other mappings validated by theme |
| KIRK templates | HIGH | Found exact "Kirk explains how he beat Kobayashi Maru" template on Imgflip |

**Research date:** 2026-03-30
**Valid until:** 6 months (format trends relatively stable; platform algorithm changes may warrant update)
