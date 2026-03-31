import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - Audit & consequences @area:gameplay", () => {
	test("LEFT choice shows consequence line with fine, heat, hype", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(page.getByText(/Consequence:/i).first()).toBeVisible();
		await expect(page.getByText(/\$0 fine/).first()).toBeVisible();
		await expect(page.getByText(/% heat/).first()).toBeVisible();
		await expect(page.getByText(/% hype/).first()).toBeVisible();
	});

	test("RIGHT choice lists higher fine in consequence copy", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});

		await expect(page.getByText(/\$10\.0M|\$10000000/)).toBeVisible();
	});

	test("mixed history shows two audit cards with different outcomes", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		await expect(page.getByText("#1", { exact: true })).toBeVisible();
		await expect(page.getByText("#2", { exact: true })).toBeVisible();
		await expect(page.getByText("Proper patch", { exact: true })).toBeVisible();
		await expect(
			page.getByText("Ship messy code", { exact: true }),
		).toBeVisible();
	});

	test("fork labels match card option text", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		await expect(
			page.getByText("Refactor first", { exact: true }),
		).toBeVisible();
		await expect(page.getByText("Quick fix", { exact: true })).toBeVisible();
	});

	test("audit page has primary heading", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(
			page.getByRole("heading", { name: /incident audit log/i }),
		).toBeVisible();
	});

	test("chosen vs unchosen branches use different badge backgrounds", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		await expect(page.locator(".bg-cyan-500\\/20").first()).toBeVisible();
		await expect(page.locator(".bg-amber-500\\/20").first()).toBeVisible();
		await expect(page.locator(".bg-black\\/30").first()).toBeVisible();
	});

	test("consequence strings include percentage markers", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(page.getByText(/% heat/).first()).toBeVisible();
		await expect(page.getByText(/% hype/).first()).toBeVisible();
	});

	test("personality sign-off still renders for ZEN_MASTER", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(page.getByText(/the data flows on/i)).toBeVisible();
	});
});
