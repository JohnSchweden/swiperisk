import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	testMatch: "**/live-api.spec.ts",
	fullyParallel: true,
	webServer: {
		command: "bun run dev",
		url: "https://localhost:3000",
		ignoreHTTPSErrors: true,
		reuseExistingServer: !process.env.CI,
	},
	reporter: "list",
	use: {
		baseURL: "https://localhost:3000",
		ignoreHTTPSErrors: true,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium-desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 720 },
			},
		},
	],
});
