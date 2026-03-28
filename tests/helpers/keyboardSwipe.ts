import { expect, type Page } from "@playwright/test";
import { SELECTORS } from "./selectors";

/**
 * Completes a choice via the same path as in-app keyboard shortcuts (window keydown →
 * swipeProgrammatically). Does not exercise pointer drag / preview UI.
 */
export async function swipeWithKeyboard(
	page: Page,
	direction: "left" | "right",
): Promise<void> {
	const key = direction === "right" ? "ArrowRight" : "ArrowLeft";
	await page.keyboard.press(key);
	const feedbackDialog = page
		.locator(SELECTORS.feedbackDialog)
		.or(page.locator(SELECTORS.feedbackDialogFallback));
	await expect(feedbackDialog).toBeVisible({ timeout: 8000 });
}
