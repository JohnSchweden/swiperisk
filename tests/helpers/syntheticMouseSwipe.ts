import type { Locator } from "@playwright/test";

export type SyntheticDragOptions = {
	/** Horizontal delta in CSS pixels (negative = left). */
	deltaX: number;
	/** Interpolation steps between start and end (default 5). */
	steps?: number;
	/** If false, only mousedown + mousemoves; caller must call syntheticMouseUp. */
	release?: boolean;
};

/**
 * Playwright's page.mouse often fails to deliver mouseup to window listeners used by
 * useSwipeGestures (Chromium/CDP quirk). This dispatches trusted-shaped MouseEvents:
 * mousedown on the card (React handlers + attachWindowMouseDrag), mousemove/mouseup on window
 * (same targets as the hook's native listeners).
 */
export async function syntheticDragOnCard(
	card: Locator,
	{ deltaX, steps = 5, release = true }: SyntheticDragOptions,
): Promise<void> {
	await card.evaluate(
		(el, { deltaX: dx, steps: n, release: doRelease }) => {
			const target = el as HTMLElement;
			const rect = target.getBoundingClientRect();
			const startX = rect.left + rect.width / 2;
			const startY = rect.top + rect.height / 2;

			const fire = (
				type: "mousedown" | "mousemove" | "mouseup",
				x: number,
				y: number,
				buttons: number,
				dispatchOn: HTMLElement | Window,
			) => {
				dispatchOn.dispatchEvent(
					new MouseEvent(type, {
						bubbles: true,
						cancelable: true,
						view: window,
						clientX: x,
						clientY: y,
						button: 0,
						buttons,
					}),
				);
			};

			fire("mousedown", startX, startY, 1, target);

			for (let i = 1; i <= n; i++) {
				const t = i / n;
				const x = startX + dx * t;
				fire("mousemove", x, startY, 1, window);
			}

			if (doRelease) {
				fire("mouseup", startX + dx, startY, 0, window);
			}
		},
		{ deltaX, steps, release },
	);
}

/** Pair with syntheticDragOnCard(..., { release: false }). */
export async function syntheticMouseUpAtCard(card: Locator): Promise<void> {
	await card.evaluate((el) => {
		const target = el as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		window.dispatchEvent(
			new MouseEvent("mouseup", {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: x,
				clientY: y,
				button: 0,
				buttons: 0,
			}),
		);
	});
}
