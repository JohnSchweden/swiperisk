---
name: git-integration
description: This skill should be used when the user asks to "commit", "write a commit message", "commit my changes", "what should I commit", "commit this task", "commit this plan", or needs guidance on GSD git commit conventions, commit formats, when to commit, or commit message structure for this project.
---

# Git Integration — GSD Commit Conventions

Full reference: `.cursor/references/git-integration.md`

## Core Principle

**Commit outcomes, not process.** The git log is a changelog of what shipped, not a diary of planning activity.

## When to Commit

| Event | Commit? |
|-------|---------|
| PLAN.md / RESEARCH.md / DISCOVERY.md created | NO — intermediate artifacts |
| **Task completed** | YES — one commit per task |
| **Plan completed** | YES — metadata commit |
| Handoff created | YES — WIP state preserved |
| Project initialized (BRIEF + ROADMAP) | YES |

## Commit Formats

### Task Completion (most common)

```
{type}({phase}-{plan}): {task-name}

- Key change 1
- Key change 2
- Key change 3
```

**Types:** `feat` · `fix` · `test` · `refactor` · `perf` · `chore` · `docs`

**Examples:**

```bash
git commit -m "feat(08-02): create user registration endpoint

- POST /auth/register validates email and password
- Checks for duplicate users
- Returns JWT token on success
"
```

### Plan Completion (after all tasks done)

```
docs({phase}-{plan}): complete {plan-name} plan

Tasks completed: N/N
- Task 1 name
- Task 2 name

SUMMARY: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
```

Stage: `git add .planning/phases/.../PLAN.md SUMMARY.md .planning/STATE.md .planning/ROADMAP.md`

### Handoff (WIP pause)

```
wip: {phase-name} paused at task X/Y

Current: {task name}
[Blocked: reason if applicable]
```

### Project Initialization

```
docs: initialize {project-name} (N phases)

{One-liner from PROJECT.md}

Phases:
1. phase-name: goal
2. phase-name: goal
```

## Commit Execution

Always pass the message via heredoc to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
feat(03-01): add no-win scenario card deck

- Added 5 no-win dilemma cards to finance deck
- Each card has role-specific feedback for all personalities
- Integrated with existing deck shuffle logic
EOF
)"
```

## Key Rules

- One commit per completed task — not one per plan
- Code files committed per-task; planning docs committed at plan completion
- Never commit PLAN.md, RESEARCH.md, DISCOVERY.md alone
- `git bisect` should be able to isolate any single task failure
