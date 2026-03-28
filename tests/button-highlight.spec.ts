import { expect, test } from "@playwright/test";
import { swipeWithKeyboard } from "./helpers/keyboardSwipe";
import {
	getCard,
	getLeftButton,
	getRightButton,
	navigateToPlayingFast,
} from "./helpers/navigation";
import {
	syntheticDragOnCard,
	syntheticMouseUpAtCard,
} from "./helpers/syntheticMouseSwipe";

test.use({ baseURL: "https://localhost:3000" });

/** Returns true if element has standalone `bg-cyan-500` class (not `hover:bg-cyan-500`). */
async function isHighlighted(
	el: Awaited<ReturnType<typeof getRightButton>>,
): Promise<boolean> {
	return el.evaluate((node) => node.classList.contains("bg-cyan-500"));
}

test.describe("Button Highlight on Swipe @area:input", () => {
	test("right button highlights when swiping right", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		expect(await card.boundingBox()).toBeTruthy();

		// Not highlighted before swipe
		const rightButton = await getRightButton(page);
		expect(await isHighlighted(rightButton)).toBe(false);

		// DOM-synthetic drag: Playwright mouseup often misses window listeners in this stack
		await syntheticDragOnCard(card, { deltaX: 60, steps: 5, release: false });
		await page.waitForTimeout(200);

		// Now highlighted (classList.contains checks exact token, not hover: variant)
		expect(await isHighlighted(rightButton)).toBe(true);

		await syntheticMouseUpAtCard(card);
	});

	test("left button highlights when swiping left", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		expect(await card.boundingBox()).toBeTruthy();

		// Not highlighted before swipe
		const leftButton = await getLeftButton(page);
		expect(await isHighlighted(leftButton)).toBe(false);

		await syntheticDragOnCard(card, { deltaX: -60, steps: 5, release: false });
		await page.waitForTimeout(200);

		// Now highlighted
		expect(await isHighlighted(leftButton)).toBe(true);

		await syntheticMouseUpAtCard(card);
	});

	test("keyboard shortcut completes choice (no pointer preview path)", async ({
		page,
	}) => {
		await navigateToPlayingFast(page);
		const leftButton = await getLeftButton(page);
		expect(await isHighlighted(leftButton)).toBe(false);
		await swipeWithKeyboard(page, "right");
	});
});
