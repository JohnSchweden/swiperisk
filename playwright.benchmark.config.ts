import baseConfig from "./playwright.config";

export default {
	...baseConfig,
	webServer: {
		command: "bun run dev",
		url: "https://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		ignoreHTTPSErrors: true,
	},
	use: {
		...baseConfig.use,
		baseURL: "https://localhost:3000",
		ignoreHTTPSErrors: true,
	},
};
