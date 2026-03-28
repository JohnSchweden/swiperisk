import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalityType } from "../types";

// Mock AudioContext and Web Audio API
class MockAudioContext {
	state = "running";
	sampleRate = 24000;
	currentTime = 0;
	createBuffer = vi.fn(() => ({
		numberOfChannels: 1,
		length: 24000,
		sampleRate: 24000,
		getChannelData: () => new Float32Array(24000),
	}));
	createBufferSource = vi.fn(() => ({
		buffer: null,
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		onended: null,
	}));
	createGain = vi.fn(() => ({
		connect: vi.fn(),
		gain: { value: 1 },
	}));
	decodeAudioData = vi.fn();
	close = vi.fn();
	resume = vi.fn(() => Promise.resolve());
}

const mockAudioContext = new MockAudioContext();

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock Audio constructor
const MockAudioContextConstructor = vi.fn(() => mockAudioContext);
vi.stubGlobal("AudioContext", MockAudioContextConstructor);

// Mock radioEffect
vi.mock("../services/radioEffect", () => ({
	createRadioSession: vi.fn(() => ({
		start: vi.fn(),
		end: vi.fn(),
		voiceInput: {},
		scheduleChunk: vi.fn(() => 0),
	})),
}));

describe("Gemini Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("fetch", mockFetch);
		vi.stubGlobal("AudioContext", MockAudioContextConstructor);
		// Reset environment
		vi.stubGlobal("import.meta.env.VITE_ENABLE_SPEECH", "true");
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("speak", () => {
		it("should return early when speech is disabled", async () => {
			vi.stubGlobal("import.meta.env.VITE_ENABLE_SPEECH", "false");

			const { speak } = await import("../services/geminiService");

			await speak("Hello world");

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should handle TTS API errors gracefully", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				json: vi.fn().mockResolvedValue({ error: "TTS service unavailable" }),
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { speak } = await import("../services/geminiService");

			await speak("Hello world");

			expect(consoleSpy).toHaveBeenCalledWith(
				"TTS Error:",
				"TTS service unavailable",
			);
			consoleSpy.mockRestore();
		});

		it("should create AudioContext and play audio when successful", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					audio: btoa("mock audio data"),
				}),
			});

			const { speak } = await import("../services/geminiService");

			await speak("Hello world", "TestVoice");

			expect(mockFetch).toHaveBeenCalledWith("/api/speak", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: "Hello world", voiceName: "TestVoice" }),
			});

			expect(mockAudioContext.resume).toHaveBeenCalled();
		});

		it("should handle suspended AudioContext", async () => {
			mockAudioContext.state = "suspended";

			mockFetch.mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					audio: btoa("mock audio data"),
				}),
			});

			const { speak } = await import("../services/geminiService");

			await speak("Hello world");

			expect(mockAudioContext.resume).toHaveBeenCalled();
		});

		it("should handle fetch errors", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { speak } = await import("../services/geminiService");

			await speak("Hello world");

			expect(consoleSpy).toHaveBeenCalledWith("TTS Error:", expect.any(Error));
			consoleSpy.mockRestore();
		});
	});

	describe("cleanupAudio", () => {
		it("should stop all active sources and close AudioContext", async () => {
			mockAudioContext.state = "running";

			const { cleanupAudio } = await import("../services/geminiService");

			cleanupAudio();

			expect(mockAudioContext.close).toHaveBeenCalled();
		});

		it("should handle already closed AudioContext", async () => {
			mockAudioContext.state = "closed";

			const { cleanupAudio } = await import("../services/geminiService");

			cleanupAudio();

			expect(mockAudioContext.close).not.toHaveBeenCalled();
		});
	});

	describe("getRoast", () => {
		it("should return roast text on successful API call", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi.fn().mockResolvedValue('{"text": "You are terrible at this"}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const { getRoast } = await import("../services/geminiService");

			const result = await getRoast("workflow text", PersonalityType.ROASTER);

			expect(result).toBe("You are terrible at this");
			expect(mockFetch).toHaveBeenCalledWith("/api/roast", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					workflow: "workflow text",
					personality: PersonalityType.ROASTER,
				}),
			});
		});

		it("should handle API errors gracefully", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi
					.fn()
					.mockResolvedValue('{"error": "Server configuration error"}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ZEN_MASTER);

			expect(result).toBe("Roast disabled: Server configuration error.");
			expect(consoleSpy).toHaveBeenCalledWith(
				"Roast Error:",
				"Server configuration error",
			);
			consoleSpy.mockRestore();
		});

		it("should handle non-JSON responses", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 500,
				text: vi.fn().mockResolvedValue("Internal Server Error"),
				headers: {
					get: vi.fn().mockReturnValue("text/plain"),
				},
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../services/geminiService");

			const result = await getRoast("workflow", PersonalityType.LOVEBOMBER);

			expect(result).toBe("Roast disabled: Server error.");
			consoleSpy.mockRestore();
		});

		it("should handle fetch errors", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const { getRoast } = await import("../services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ROASTER);

			expect(result).toBe("Roast disabled: Could not connect to server.");
			expect(consoleSpy).toHaveBeenCalledWith(
				"Roast Error:",
				expect.any(Error),
			);
			consoleSpy.mockRestore();
		});

		it("should return fallback text when API returns empty text", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				text: vi.fn().mockResolvedValue('{"text": ""}'),
				headers: {
					get: vi.fn().mockReturnValue("application/json"),
				},
			});

			const { getRoast } = await import("../services/geminiService");

			const result = await getRoast("workflow", PersonalityType.ROASTER);

			expect(result).toBe("Even for you, this is remarkably insecure.");
		});
	});
});
