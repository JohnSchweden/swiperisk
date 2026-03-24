import { defineConfig } from "vitest/config";

export default defineConfig({
	/** Voice-hint UI in RoleSelect/PersonalitySelect reads VITE_ENABLE_SPEECH; pin so unit tests do not depend on .env.local. */
	define: {
		"import.meta.env.VITE_ENABLE_SPEECH": JSON.stringify("true"),
	},
	test: {
		include: ["unit/**/*.spec.ts", "unit/**/*.spec.tsx", "**/*.test.{ts,tsx}"],
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: [
				"components/**/*.{ts,tsx}",
				"services/**/*.ts",
				"data/**/*.ts",
				"hooks/**/*.ts",
				"utils/**/*.ts",
			],
		},
	},
});
