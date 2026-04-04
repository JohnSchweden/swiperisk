#!/usr/bin/env bun
/// <reference types="bun" />
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Biome-format one file after an agent edit. Used by:
 * - Cursor: `.cursor/hooks.json` → `afterFileEdit` → `{ file_path }`
 * - Claude Code: `.claude/settings.json` → `PostToolUse` matcher `Write|Edit` → `tool_input.file_path`
 *
 * stdout: always `{}` (Cursor parses hook output as JSON; Biome human output must not leak).
 */
const hookDir = dirname(fileURLToPath(import.meta.url));
const repoRootFromHook = join(hookDir, "..", "..");
const packageRoot =
	typeof process.env.CLAUDE_PROJECT_DIR === "string" &&
	process.env.CLAUDE_PROJECT_DIR.trim().length > 0
		? process.env.CLAUDE_PROJECT_DIR.trim()
		: repoRootFromHook;
// Cursor pipes JSON (non-TTY). Interactive `bun format.ts` would block on stdin forever.
if (process.stdin.isTTY) {
	console.log("{}");
	process.exit(0);
}

const stdin = await Bun.stdin.text();
let payload: unknown;
try {
	payload = JSON.parse(stdin);
} catch {
	console.log("{}");
	process.exit(0);
}

let filePath: string | undefined;
if (typeof payload === "object" && payload !== null) {
	const p = payload as Record<string, unknown>;
	if (typeof p.file_path === "string") {
		filePath = p.file_path;
	} else if (
		(p.tool_name === "Write" || p.tool_name === "Edit") &&
		typeof p.tool_input === "object" &&
		p.tool_input !== null
	) {
		const ti = p.tool_input as Record<string, unknown>;
		if (typeof ti.file_path === "string") {
			filePath = ti.file_path;
		} else if (typeof ti.path === "string") {
			filePath = ti.path;
		}
	}
}

if (!filePath) {
	console.log("{}");
	process.exit(0);
}

const proc = Bun.spawn(["bun", "run", "format:file", "--", filePath], {
	stdin: "ignore",
	stdout: "ignore",
	stderr: "pipe",
	cwd: packageRoot,
});

const status = await proc.exited;
if (status !== 0) {
	const stderr = await new Response(proc.stderr).text();
	if (stderr) process.stderr.write(stderr);
}
console.log("{}");
// Always exit 0 so a Biome failure does not block the agent; stderr still surfaces above.
process.exit(0);
