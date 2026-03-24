import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";

// Set FFmpeg binary path
ffmpeg.setFfmpegPath(ffmpegStatic || "ffmpeg");

export interface CompressionOptions {
	bitrate?: number;
	codec?: "libopus" | "libmp3lame";
}

const DEFAULT_OPTIONS: Record<string, CompressionOptions> = {
	opus: { codec: "libopus", bitrate: 96 },
	mp3: { codec: "libmp3lame", bitrate: 192 },
};

/**
 * Compress a single WAV file to Opus and MP3
 */
export async function compressAudioFile(
	inputPath: string,
	options: { opus?: boolean; mp3?: boolean } = { opus: true, mp3: true },
): Promise<{ opus?: string; mp3?: string }> {
	const results: { opus?: string; mp3?: string } = {};
	const basePath = inputPath.replace(".wav", "");

	// Verify input exists
	await fs.access(inputPath);

	if (options.opus !== false) {
		const opusPath = `${basePath}.opus`;
		await new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.audioCodec("libopus")
				.audioBitrate(96)
				.format("opus")
				.on("end", () => {
					console.log(`✓ Created Opus: ${path.basename(opusPath)}`);
					resolve();
				})
				.on("error", reject)
				.save(opusPath);
		});
		results.opus = opusPath;
	}

	if (options.mp3 !== false) {
		const mp3Path = `${basePath}.mp3`;
		await new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.audioCodec("libmp3lame")
				.audioBitrate(192)
				.format("mp3")
				.on("end", () => {
					console.log(`✓ Created MP3: ${path.basename(mp3Path)}`);
					resolve();
				})
				.on("error", reject)
				.save(mp3Path);
		});
		results.mp3 = mp3Path;
	}

	return results;
}

/**
 * Compress all WAV files in a directory (recursive)
 */
export async function compressDirectory(
	dirPath: string,
	options: { opus?: boolean; mp3?: boolean } = { opus: true, mp3: true },
): Promise<{ processed: number; errors: string[] }> {
	const errors: string[] = [];
	let processed = 0;

	async function processDirectory(currentPath: string): Promise<void> {
		const entries = await fs.readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);

			if (entry.isDirectory()) {
				await processDirectory(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".wav")) {
				try {
					await compressAudioFile(fullPath, options);
					processed++;
				} catch (error) {
					const errorMsg = `Failed to compress ${fullPath}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}
		}
	}

	await processDirectory(dirPath);
	return { processed, errors };
}

// CLI usage
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === "file" && args[1]) {
		compressAudioFile(args[1])
			.then(() => process.exit(0))
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	} else if (command === "directory" && args[1]) {
		compressDirectory(args[1])
			.then(({ processed, errors }) => {
				console.log(`\nProcessed ${processed} files`);
				if (errors.length > 0) {
					console.error(`\nErrors (${errors.length}):`);
					for (const e of errors) {
						console.error(e);
					}
				}
				process.exit(errors.length > 0 ? 1 : 0);
			})
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	} else {
		console.log("Usage:");
		console.log("  bun run compress:file <path/to/audio.wav>");
		console.log("  bun run compress:dir <path/to/directory>");
		process.exit(1);
	}
}
