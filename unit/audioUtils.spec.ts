import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Audio Utils", () => {
	let mockAudio: HTMLAudioElement;

	beforeEach(() => {
		// Mock Audio constructor and canPlayType
		mockAudio = {
			canPlayType: vi.fn(),
		} as unknown as HTMLAudioElement;

		vi.stubGlobal(
			"Audio",
			vi.fn(() => mockAudio),
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("supportsOpus", () => {
		it("should return false when window is undefined (SSR)", async () => {
			vi.stubGlobal("window", undefined);

			const { supportsOpus } = await import("../services/audioUtils");

			expect(supportsOpus()).toBe(false);
			vi.unstubAllGlobals();
		});

		it("should return true when Ogg Opus is probably supported", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { supportsOpus } = await import("../services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return true when WebM Opus is probably supported", async () => {
			mockAudio.canPlayType
				.mockReturnValueOnce("") // Ogg Opus
				.mockReturnValueOnce("probably"); // WebM Opus

			const { supportsOpus } = await import("../services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return true when CAF is probably supported", async () => {
			mockAudio.canPlayType
				.mockReturnValueOnce("") // Ogg Opus
				.mockReturnValueOnce("") // WebM Opus
				.mockReturnValueOnce("probably"); // CAF

			const { supportsOpus } = await import("../services/audioUtils");

			expect(supportsOpus()).toBe(true);
		});

		it("should return false when no Opus format is supported", async () => {
			mockAudio.canPlayType.mockReturnValue("");

			const { supportsOpus } = await import("../services/audioUtils");

			expect(supportsOpus()).toBe(false);
		});

		it("should cache the result after first call", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { supportsOpus } = await import("../services/audioUtils");

			// First call
			expect(supportsOpus()).toBe(true);
			expect(mockAudio.canPlayType).toHaveBeenCalledTimes(3); // All three formats checked

			// Second call should use cache
			expect(supportsOpus()).toBe(true);
			expect(mockAudio.canPlayType).toHaveBeenCalledTimes(3); // No additional calls
		});
	});

	describe("getAudioExtension", () => {
		it("should return .opus when Opus is supported", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { getAudioExtension } = await import("../services/audioUtils");

			expect(getAudioExtension()).toBe(".opus");
		});

		it("should return .mp3 when Opus is not supported", async () => {
			mockAudio.canPlayType.mockReturnValue("");

			const { getAudioExtension } = await import("../services/audioUtils");

			expect(getAudioExtension()).toBe(".mp3");
		});
	});

	describe("getAudioMimeType", () => {
		it("should return audio/opus when Opus is supported", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { getAudioMimeType } = await import("../services/audioUtils");

			expect(getAudioMimeType()).toBe("audio/opus");
		});

		it("should return audio/mpeg when Opus is not supported", async () => {
			mockAudio.canPlayType.mockReturnValue("");

			const { getAudioMimeType } = await import("../services/audioUtils");

			expect(getAudioMimeType()).toBe("audio/mpeg");
		});
	});

	describe("getAudioPath", () => {
		it("should append .opus extension when Opus is supported", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../services/audioUtils");

			expect(getAudioPath("audio/voice")).toBe("audio/voice.opus");
		});

		it("should append .mp3 extension when Opus is not supported", async () => {
			mockAudio.canPlayType.mockReturnValue("");

			const { getAudioPath } = await import("../services/audioUtils");

			expect(getAudioPath("audio/voice")).toBe("audio/voice.mp3");
		});

		it("should replace existing audio extensions", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../services/audioUtils");

			expect(getAudioPath("audio/voice.mp3")).toBe("audio/voice.opus");
			expect(getAudioPath("audio/voice.opus")).toBe("audio/voice.opus");
			expect(getAudioPath("audio/voice.wav")).toBe("audio/voice.opus");
		});

		it("should handle paths with dots in directory names", async () => {
			mockAudio.canPlayType.mockReturnValue("probably");

			const { getAudioPath } = await import("../services/audioUtils");

			expect(getAudioPath("audio.test/voice")).toBe("audio.test/voice.opus");
		});
	});
});
