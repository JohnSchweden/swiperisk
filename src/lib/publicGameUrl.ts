/**
 * Returns the public game URL from env, falling back to the production Vercel URL.
 * Set VITE_PUBLIC_GAME_URL in .env.local to override (e.g. for staging branches).
 */
export function getPublicGameUrl(): string {
	return (
		import.meta.env.VITE_PUBLIC_GAME_URL ?? "https://k-maru-seven.vercel.app"
	);
}
