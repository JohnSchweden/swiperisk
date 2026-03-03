---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Orphaned useLiveAudio.ts file is deleted"
  artifacts:
    - path: "hooks/useLiveAudio.ts"
      deleted: true
  key_links: []
---

<objective>
Delete orphaned hook file that is not imported anywhere.

Purpose: Clean up unused technical debt from v1.1 - the useLiveAudio.ts hook was replaced by functionality in roastService.ts
Output: Deleted file, reduced codebase
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md (line 71: technical debt note)
</context>

<tasks>

<task type="auto">
  <name>Delete orphaned useLiveAudio.ts hook</name>
  <files>hooks/useLiveAudio.ts</files>
  <action>
    Delete the file hooks/useLiveAudio.ts. It is not imported anywhere in the codebase and its functionality was replaced by roastService.ts during v1.1 development.
  </action>
  <verify>
    File should not exist: `ls hooks/useLiveAudio.ts` should return "No such file"
  </verify>
  <done>
    hooks/useLiveAudio.ts deleted, technical debt removed
  </done>
</task>

</tasks>

<verification>
- File no longer exists in hooks/ directory
- No imports or references to useLiveAudio in codebase
</verification>

<success_criteria>
- hooks/useLiveAudio.ts removed from filesystem
</success_criteria>

<output>
After completion, create `.planning/quick/001-delete-orphaned-hook/001-SUMMARY.md`
</output>
