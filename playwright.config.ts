import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	webServer: {
		command: "bun run dev",
		url: "https://localhost:3000",
		reuseExistingServer: !process.env.CI,
		ignoreHTTPSErrors: true,
	},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	grepInvert: process.env.CI ? /@live-api|@slow/ : /@live-api/,
	use: {
		baseURL: "https://localhost:3000",
		ignoreHTTPSErrors: true,
		trace: "on-first-retry",
		contextOptions: {
			// Reuse browser context across tests for faster execution
			// when running with multiple workers
		},
	},
	projects: [
		{
			name: "chromium-desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: "chromium-mobile",
			use: {
				...devices["Pixel 5"],
				viewport: { width: 393, height: 851 },
			},
			// Only run layout-specific specs on mobile; rest run desktop-only
			testMatch: /mobile-width|layout-overlay-touch/,
		},
	],
});
