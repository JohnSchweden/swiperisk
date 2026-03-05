#!/usr/bin/env bun
/**
 * Cursor afterFileEdit hook: format the edited file with Biome.
 * Reads JSON from stdin: { file_path: string }.
 * Writes {} to stdout; exits with Biome's exit code (non-zero on format/lint failure).
 */
const stdin = await Bun.stdin.text();
let payload: { file_path?: string };
try {
	payload = JSON.parse(stdin);
} catch {
	console.log("{}");
	process.exit(0);
}

const filePath = payload?.file_path;
if (!filePath || typeof filePath !== "string") {
	console.log("{}");
	process.exit(0);
}

const proc = Bun.spawn(["bunx", "biome", "format", "--write", filePath], {
	stdin: "ignore",
	stdout: "ignore",
	stderr: "pipe",
	cwd: process.cwd(),
});

const status = await proc.exited;
if (status !== 0) {
	const stderr = await new Response(proc.stderr).text();
	if (stderr) process.stderr.write(stderr);
}
console.log("{}");
process.exit(status);
