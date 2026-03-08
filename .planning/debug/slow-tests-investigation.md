# Slow Tests Investigation

## Summary

Tests taking >20s fall into clear categories. Root causes are **networkidle**, **full navigation flows**, **real-time waits**, and **structural inefficiencies** (repeated nav, screenshot overhead).

---

## Root Cause Analysis

### 1. `waitForLoadState("networkidle")` — PRIMARY CULPRIT

**What it does:** Waits until ≤2 network connections for 500ms. In SPAs with audio, analytics, or persistent connections, this rarely fires or takes 30–60+ seconds.

**Affected tests:**

| File | Occurrences | Impact |
|------|-------------|--------|
| layout-overlay-touch.spec.ts | 2× (lines 13, 39) | Both LayoutShell tests: `goto("/")` + networkidle before ANY assertion. 35s total. |
| personality-feedback.spec.ts | 4× (lines 13, 30, 53, 69) | Each test: 2× networkidle per run (after goto, after Debug). 32s total. |
| stage-snapshots.spec.ts | 4× (lines 117, 207, 216) | role-select, feedback-overlay, boss-fight, playing-roast. 197s total. |
| navigateToPlaying() | 2× (lines 77, 99) | Used by stage-snapshots, death-types, boss-fight, game-over. |
| navigateToRoleSelect() | — | No networkidle; fast. |

**Hypothesis:** networkidle blocks until the network “settles.” The app has:
- Vite HMR / dev connections
- Potential audio preload
- Mock API / roast service setup

These keep the network active, so networkidle either times out (default 30s) or waits a long time.

---

### 2. Full Navigation Instead of Fast Path

**Fast path:** `navigateToPlayingFast()` — localStorage injection, goto, wait for Debug button, wait for card. ~2–4s.

**Full path:** `navigateToPlaying()` — goto, networkidle, Boot → V.E.R.A → Software Engineer, 3–2–1 countdown (~3s), wait for Debug, networkidle. 10–60+ seconds depending on networkidle.

**Tests using full navigation:**
- **personality-feedback.spec.ts** — Uses its own `navigateToPlayingRoaster()` (full flow + 2× networkidle). Does NOT use `navigateToPlayingFast` although it could: it needs V.E.R.A or Zen Master, which could be set via localStorage.
- **stage-snapshots.spec.ts** — Uses `navigateToPlaying`, `navigateToBossFight`, `navigateToGameOver`, `navigateToSummary`. All involve full flows and/or networkidle.
- **death-types.spec.ts** — Uses `navigateToRoleSelect` (fast) but then full in-game flow: Tech/AI Consultant → Launch → next → next → GAME_OVER. Some tests use full boss-fight flow.
- **boss-fight-timer.spec.ts** — Uses `navigateToBossFight()` → `navigateToPlaying()` (full) + `navigateToBossFightFromPlaying()`. 47s.
- **boss-fight-randomization.spec.ts** — Uses `navigateToBossFightFast()` (good) but runs **twice per test** (reload + re-navigate). 32s.

---

### 3. Real-Time Waits (Intentional but Costly)

| File | Wait | Purpose |
|------|------|---------|
| boss-fight-timer.spec.ts | 2100ms | Timer countdown check (b) |
| boss-fight-timer.spec.ts | 35000ms timeout | (c) Wait for timer to hit 0 (~30s) |
| immersive-pressure-cues.spec.ts | 7000–17000ms | Race: countdown (7s) vs feedback (17s). First test can wait up to 17s. |
| immersive-pressure-cues.spec.ts | 8000ms click timeout | Swipe-left button: 8s to appear (card may have pressure delay) |
| immersive-pressure-cues.spec.ts | 15000ms | Feedback dialog visibility. Up to 15s if countdown is long. |

**Hypothesis:** dev_1 has `countdownSec: 15` (from pressureScenarios). If the test doesn’t immediately click/swipe, it waits for the 15s timeout. The `Promise.race` uses 7s + 17s; if countdown wins, ~7s; if timeout wins, up to 17s.

---

### 4. Structural Inefficiencies

**layout-overlay-touch.spec.ts (35s):**
- 3 describe blocks: LayoutShell (2 tests), Feedback overlay (2), Touch swipe (1).
- LayoutShell tests: `goto("/")` + **networkidle** on intro. Only need layout-shell to be attached—no networkidle.
- Feedback overlay: uses `navigateToPlayingFast` (good) + Paste click. Fine.
- Touch swipe: uses `navigateToPlayingFast`. Fine.

**keyboard-navigation.spec.ts (32s):**
- Uses `navigateToPlayingFast` + `beforeEach`. Good.
- 4 tests, 1 skipped. Each: nav (~3s) + ArrowRight/Left + wait for dialog (5s) + assertions.
- Likely dominated by **repeated `navigateToPlayingFast`** per test and/or some leftover networkidle in shared setup. Checking: no networkidle here. So 4 × nav + interactions ≈ 4 × 3–4s ≈ 12–16s. Extra time may come from Playwright workers or cold page loads.

**game-hud.spec.ts (32s):**
- Same pattern: `beforeEach` + `navigateToPlayingFast`. 3 tests.
- One test uses `waitForTimeout(300)` after closing dialog. Minor.
- Similar to keyboard-navigation: repeated full nav in beforeEach.

**personality-feedback.spec.ts (32s):**
- Does NOT use navigateToPlayingFast. Full flow + 2× networkidle per test. 2 tests. ~16s each.

**card-deck-selection.spec.ts (23s):**
- Uses `navigateToRoleSelect` (fast: goto + Boot + V.E.R.A + role click). No networkidle.
- 3 tests for role→deck mapping + **10 tests** for "All 10 roles reach PLAYING". Each of the 10: full nav to role select + click role + wait for card (10s). 10 × ~2s = 20s. Minor inefficiency: could share one nav and parameterize.

**death-types.spec.ts (62s):**
- 3 describe blocks, multiple flows. BANKRUPT: role select + Tech/AI Consultant + Launch + next + next. AUDIT_FAILURE: full boss fight flow (wrong answers). GAME_OVER screen: same as BANKRUPT.
- AUDIT_FAILURE uses full boss fight + 5 wrong answers. No artificial waits, but long flow.
- 62s suggests networkidle or long boss-fight flow is involved. `navigateToRoleSelect` has no networkidle; death-types doesn’t call `navigateToPlaying`. So the slowness is from the full in-app flows and wait timeouts.

**stage-snapshots.spec.ts (197s):**
- 12 tests. Many use `navigateToBossFight`, `navigateToGameOver`, `navigateToSummary`, `navigateToPlayingWithRoastAnswer`.
- `navigateToPlayingWithRoastAnswer`: mocks roast API, full `navigateToPlaying` (2× networkidle), then waits for roast output (20s) and ">>>" (10s).
- "playing roast con before and after": two roasts in one test (~30s of roast waits).
- "summary": `test.setTimeout(180000)`, navigates through 5 boss questions (timer ~30s each in real time? or instant?).
- Multiple `waitForLoadState("networkidle")` across tests.
- Screenshot capture adds per-test overhead.
- Worst case: networkidle × 4 + long navigations + roast waits + screenshots.

---

### 5. BeforeEach Amplification

Tests using `beforeEach(navigateToPlayingFast)` rerun navigation for every test. With 3–4 tests, that’s 3–4 full navigations. If each nav is ~3–4s, that’s 9–16s just for setup. Not huge alone, but it adds up when combined with other issues.

---

### 6. Roast API / Mock Delays

`navigateToPlayingWithRoastAnswer` and roast-heavy tests:
- `waitFor({ state: "attached", timeout: 20000 })` for roast-output
- `toContainText(">>>", { timeout: 10000 })`
- Mock may simulate latency. If mock is slow, each roast adds 5–15s.

---

## Hypotheses (Ranked)

1. **networkidle blocks 30–60s** when the app has persistent connections. Remove or replace with DOM-based waits.
2. **Full navigation** (`navigateToPlaying`, `navigateToBossFight`) used where fast paths exist. Prefer localStorage injection + targeted waits.
3. **personality-feedback** does its own full flow instead of `navigateToPlayingFast` with personality in localStorage.
4. **immersive-pressure-cues** relies on long real-time waits (7s, 17s) because of the 15s pressure countdown. Consider shortening countdown in test mode or mocking time.
5. **card-deck-selection** runs 10 similar tests with separate navigations. Could use one shared nav and parameterize.
6. **stage-snapshots** combines networkidle, long flows, roast waits, and screenshots. Biggest single source of delay.
7. **beforeEach** nav repetition adds ~3–4s per test in suites with multiple tests.

---

## Plan of Action

### Phase 1: Eliminate networkidle (High impact)

1. **navigation.ts**
   - In `navigateToPlaying()`: Replace both `waitForLoadState("networkidle")` with DOM-based waits (e.g. wait for Boot button, then for Debug button).
   - In `navigateToRoleSelect()`: No change (already no networkidle).

2. **layout-overlay-touch.spec.ts**
   - Remove `waitForLoadState("networkidle")` after `goto("/")`. Replace with `waitForSelector('[data-testid="layout-shell"]')` or similar.

3. **personality-feedback.spec.ts**
   - Replace custom `navigateToPlayingRoaster()` with localStorage-based setup + `navigateToPlayingFast`-style flow, or a helper that injects personality and role.
   - Remove all networkidle usage.

4. **stage-snapshots.spec.ts**
   - Replace each `waitForLoadState("networkidle")` with targeted waits (e.g. wait for specific stage elements).
   - Add helper like `waitForStageReady(page, stage)` that waits for DOM instead of network.

5. **voice-playback-integration.spec.ts**
   - Same pattern: replace networkidle with DOM-based readiness.

### Phase 2: Use fast paths (Medium impact)

6. **personality-feedback.spec.ts**
   - Use `navigateToPlayingFast` with `personality: "ROASTER"` and `personality: "ZEN_MASTER"` in localStorage. Verify the app respects it.

7. **death-types.spec.ts**
   - For BANKRUPT and GAME_OVER: consider a `navigateToRoleSelectFast` or localStorage to jump to role select, then continue from there.
   - For AUDIT_FAILURE: keep full boss flow or add `navigateToBossFightFast` if not already optimal.

8. **boss-fight-timer.spec.ts**
   - Use `navigateToBossFightFast` everywhere (already uses `navigateToBossFight` which uses full `navigateToPlaying`).
   - Test (c) requires real 30s wait; keep it but consider a `@slow` tag and separate run.

### Phase 3: Reduce real-time waits (Medium impact)

9. **immersive-pressure-cues.spec.ts**
   - Reduce race timeouts (e.g. 7s→3s, 17s→8s) if countdown can be shortened in test.
   - Add test-mode flag or mock to shorten `countdownSec` for dev_1 (e.g. 3s instead of 15s).

10. **boss-fight-timer.spec.ts**
    - Test (b): 2100ms wait is needed for timer. Keep.
    - Test (c): 30s is inherent. Mark `@slow` and run in a separate slow suite.

### Phase 4: Structural optimizations (Lower impact)

11. **card-deck-selection.spec.ts**
    - Use `beforeAll` + `navigateToRoleSelect` once, then parameterize the 10 role tests to avoid 10 separate navigations.

12. **keyboard-navigation.spec.ts / game-hud.spec.ts**
    - `beforeEach` with `navigateToPlayingFast` is acceptable. After Phase 1, nav should be ~3s. Optional: use `beforeAll` and share page/context if Playwright supports it and tests don’t mutate critical shared state.

13. **stage-snapshots.spec.ts**
    - Split into smaller files or tags (e.g. quick snapshots vs roast/boss/summary).
    - Consider running roast/summary tests only in a separate slow-snapshots suite.
    - Reduce roast wait timeouts if mock can respond faster.

### Phase 5: Verification

14. Re-run `bun run test:slow-files` after Phase 1 and Phase 2.
15. Target: no test file >20s except intentionally slow ones (e.g. boss timer 0, summary).
16. Document slow tests with `@slow` and ensure they’re excluded or separated in CI.

---

## File-by-file Summary

| File | Current | Main cause | Phase 1 fix |
|------|---------|------------|-------------|
| stage-snapshots | 197s | networkidle ×4, long flows, roast waits | Replace networkidle with DOM waits |
| death-types | 62s | Full flows, boss fight | Use fast paths where possible |
| boss-fight-timer | 47s | navigateToBossFight = full nav | Use navigateToBossFightFast |
| layout-overlay-touch | 36s | networkidle ×2 on intro | Remove; wait for layout-shell |
| keyboard-navigation | 32s | 4× nav in beforeEach | After Phase 1, nav should be faster |
| boss-fight-randomization | 32s | 2× navigateToBossFightFast per test | Consider caching or parallelizing |
| game-hud | 32s | 3× nav in beforeEach | Same as keyboard-navigation |
| personality-feedback | 32s | Full flow + networkidle ×4 | Use fast path + remove networkidle |
| immersive-pressure-cues | 26s | 7–17s real-time waits | Shorten countdown in test mode |
| card-deck-selection | 23s | 10× role nav | Use beforeAll + parameterize |
