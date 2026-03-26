import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debug Test", () => {
	test("debug state loads correctly", async ({ page }) => {
		// Set debug state BEFORE navigation using addInitScript
		await page.addInitScript(
			(stateStr) => {
				window.localStorage.setItem("km-debug-state", stateStr);
			},
			JSON.stringify({
				stage: "DEBRIEF_PAGE_1",
				deathType: "BANKRUPT",
				personality: "ROASTER",
				role: "CHIEF_SOMETHING_OFFICER",
				budget: -100000,
				heat: 75,
				hype: 45,
				unlockedEndings: ["BANKRUPT"],
				history: [],
				effectiveDeck: [],
				kirkCounter: 0,
				kirkCorruptionActive: false,
			}),
		);

		// Navigate to app
		await page.goto("/");

		// Wait a bit for React to hydrate
		await page.waitForTimeout(2000);

		// Take screenshot for debugging
		await page.screenshot({
			path: "/tmp/debug-state-test.png",
			fullPage: true,
		});

		// Check what's on the page
		const bodyText = await page.textContent("body");
		console.log("Page text:", bodyText?.substring(0, 200));

		// Check for GAME OVER text
		const gameOver = await page.locator("h1:has-text('GAME OVER')").count();
		console.log(`GAME OVER elements: ${gameOver}`);

		// Check localStorage value
		const debugState = await page.evaluate(() =>
			localStorage.getItem("km-debug-state"),
		);
		console.log("Debug state:", debugState?.substring(0, 100));
	});
});
