import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Simple Debug", () => {
	test("game over state shows GAME OVER", async ({ page }) => {
		// Set debug state BEFORE navigation
		await page.addInitScript(
			(stateStr) => {
				window.localStorage.setItem("km-debug-state", stateStr);
			},
			JSON.stringify({
				stage: "GAME_OVER",
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

		// Wait for React to hydrate
		await page.waitForTimeout(2000);

		// Take screenshot
		await page.screenshot({ path: "/tmp/simple-debug.png", fullPage: true });

		// Check for any text on the page
		const bodyText = await page.textContent("body");
		console.log("Body text:", bodyText?.substring(0, 500));

		// Look for specific elements
		const h1Count = await page.locator("h1").count();
		console.log("H1 elements:", h1Count);

		// Check localStorage value
		const debugState = await page.evaluate(() =>
			localStorage.getItem("km-debug-state"),
		);
		console.log("Debug state value:", debugState);
	});
});
