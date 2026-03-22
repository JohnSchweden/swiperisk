# Agent instructions

# Development Workflow

**Always use `bun`, not `npm`.**

```sh
# 1. Make changes

# 2. Typecheck (fast)
bun run typecheck

# 3. Run tests
bun run test -- -g "test name"      # Single suite
bun run test:file -- "glob"          # Specific files

# 4. Lint before committing
bun run lint:file -- "filel.ts"     # Specific files
bun run lint                        # All files

# 5. Before creating PR
bun run check && bun run typecheck && bun run test
```

## Runtime Package Manager Detection (MANDATORY)

When any GSD plan, task, or template specifies `npm run`, `npm test`, or similar:
1. Check project root for lockfiles
2. Substitute commands before executing:
   - `bun.lock` present: `npm run X` → `bun X`, `npm test` → `bun test`
   - `yarn.lock` present: `npm run X` → `yarn X`, `npx X` → `yarn dlx X`
3. Log the substitution in task output

This applies to ALL commands from templates, plans, and references.

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fizing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Git integration

Follow `.cursor/references/git-integration.md` for commit points, message formats, and when to commit (outcomes, not process).

## Verification & Testing (REQUIRED)

**After making ANY code changes, you MUST verify them using one of these methods:**

See `tasks/testing-runbook.md` for tiered test lanes (smoke, area, visual, slow).

### 1. Automated Tests (Preferred)
- `bun run test:smoke` — fast critical checks (~15s)
- `bun run test:area:<domain>` — targeted area (gameplay, input, layout, boss, audio)
- `bunx playwright test tests/[test-name].spec.ts` — specific test
- Fix any failing tests before committing

### 2. Tool Selection — Pick the FIRST Match

| Task | Tool |
|------|------|
| Game state/logic (stage transitions, stats, card flow, boss fight) | **WebMCP** via `chrome-devtools-mcp` |
| Visual/layout (CSS, rendering, component visibility) | **agent-browser** or **playwright-cli** |
| Regression testing after any change | **Playwright tests** (`bun run test:smoke`) |

**Prefer WebMCP for game logic** — direct React function calls, zero DOM flakiness, structured state. Fall back to DOM tools only for visual verification. Never use WebMCP inside `.spec.ts` files.

### 3. WebMCP Tools (Dev Server Required)
10 tools registered via `navigator.modelContext`: `get_game_state`, `get_current_screen`, `start_game`, `select_personality`, `select_role`, `swipe_card`, `dismiss_feedback`, `answer_boss_question`, `advance_boss`, `restart_game`.

Full reference: `.cursor/skills/webmcp-game/SKILL.md`

**DO NOT commit without verification. If tests fail or browser verification shows issues, fix them first.**

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

**IMPORTANT**: Always use `--ignore-https-errors` when opening localhost (self-signed SSL). If daemon is already running without it: `agent-browser close` first, then reopen with the flag.

Core workflow:
1. `agent-browser --ignore-https-errors open https://localhost:3000`
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

## Playwright CLI

Use `playwright-cli` (via the `playwright-cli` skill) for browser automation when you want direct CLI control instead of `agent-browser`.

Core workflow:
1. `playwright-cli open [url]` - Start a browser (and optionally navigate)
2. `playwright-cli snapshot` - Get interactive elements with refs (e1, e2, ...)
3. Use commands like `playwright-cli click e1`, `playwright-cli fill e2 "text"`, `playwright-cli press Enter` to interact
4. `playwright-cli screenshot` / `pdf` / storage and session commands as needed
5. `playwright-cli close` (or `close-all` / `kill-all`) when finished
