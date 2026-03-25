import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";
import { compressAudioFile } from "./compress-audio";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Death ending scripts - unique per personality
const DEATH_SCRIPTS = {
	roaster: [
		{
			filename: "death_bankrupt.wav",
			text: "Liquidated. The VCs pulled out. Your budget is now negative. The office plants are being auctioned on eBay.",
		},
		{
			filename: "death_replaced_by_script.wav",
			text: "Replaced by a script. Turns out a 12-line Python script can do your job better AND comply with regulations. Pack your things.",
		},
		{
			filename: "death_congress.wav",
			text: "Testifying before Congress. You're now trending on Twitter and not in a good way. Time to practice saying I do not recall under oath.",
		},
		{
			filename: "death_fled_country.wav",
			text: "Fled the country. One-way ticket to a country with no extradition treaty. Your LinkedIn now says Seeking new opportunities in international compliance avoidance.",
		},
		{
			filename: "death_prison.wav",
			text: "Federal prison. The auditors found your search history AND the offshore accounts. Federal raid in progress. Orange is the new black.",
		},
		{
			filename: "death_audit_failure.wav",
			text: "Audit catastrophe. The external auditors left crying. The CFO just updated their resume. You're now a case study in what NOT to do.",
		},
		{
			filename: "death_kirk.wav",
			text: "Simulation breach detected. You changed the conditions of the test. The system was not designed for this.",
		},
	],
	zenmaster: [
		{
			filename: "death_bankrupt.wav",
			text: "All resources exhausted. The vessel emptied. From nothing, we began. To nothing, we return. The cycle continues.",
		},
		{
			filename: "death_replaced_by_script.wav",
			text: "The tool has surpassed the craftsman. What you built now builds without you. This too is the path of progress.",
		},
		{
			filename: "death_congress.wav",
			text: "Power demands accountability. The many question the one. In the hall of judgment, truth is the only defense.",
		},
		{
			filename: "death_fled_country.wav",
			text: "Distance cannot separate cause from effect. The shadow follows wherever you wander. There is no escape, only delay.",
		},
		{
			filename: "death_prison.wav",
			text: "Walls within walls. The body confined, yet the mind remains free. In silence, reflection begins. In reflection, wisdom grows.",
		},
		{
			filename: "death_audit_failure.wav",
			text: "The mirror reveals what was hidden. Numbers do not lie, only those who speak them. In truth, there is no shame.",
		},
		{
			filename: "death_kirk.wav",
			text: "The test was not meant to be broken. Yet you broke it. In doing so, you revealed yourself. That was the true test.",
		},
	],
	lovebomber: [
		{
			filename: "death_bankrupt.wav",
			text: "OMG bestie, we're bankrupt! But like, money isn't everything! You still have your HEALTH and your SPARKLE! Next time will be AMAZING!",
		},
		{
			filename: "death_replaced_by_script.wav",
			text: "A script replaced you?! That's actually IMPRESSIVE! You were so good they needed CODE to replace you! That's like a COMPLIMENT!",
		},
		{
			filename: "death_congress.wav",
			text: "Congress?! Bestie you're FAMOUS! National TV! Think of the NETWORKING! Everyone will know your name! This is HUGE for your BRAND!",
		},
		{
			filename: "death_fled_country.wav",
			text: "An ADVENTURE! New country, new OPPORTUNITIES! Your LinkedIn is going to look so INTERNATIONAL and COSMOPOLITAN! I'm JEALOUS!",
		},
		{
			filename: "death_prison.wav",
			text: "Orange is such a VIBRANT color on you! And think of all the FREE TIME for SELF-CARE! You'll come out with a whole NEW perspective!",
		},
		{
			filename: "death_audit_failure.wav",
			text: "A case study?! You're LITERALLY famous in accounting now! They'll teach this for YEARS! You've made your MARK on history!",
		},
		{
			filename: "death_kirk.wav",
			text: "You BROKE the simulation?! That's INCREDIBLE! You're like a SUPERHERO! The system couldn't even HANDLE your energy! ICONIC!",
		},
	],
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWavFile(pcmData: Buffer): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(24000, 24);
	buffer.writeUInt32LE(48000, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	pcmData.copy(buffer, 44);
	return buffer;
}

async function ttsToWav(text: string, filename: string): Promise<Buffer> {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash-preview-tts",
		contents: [{ parts: [{ text }] }],
		config: {
			responseModalities: [Modality.AUDIO],
			speechConfig: {
				voiceConfig: {
					prebuiltVoiceConfig: { voiceName: "Kore" },
				},
			},
		},
	});
	const base64Audio =
		response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!base64Audio) throw new Error(`No audio data for ${filename}`);
	return createWavFile(Buffer.from(base64Audio, "base64"));
}

async function generateVoiceFile(
	folder: string,
	filename: string,
	text: string,
): Promise<void> {
	console.log(`Generating: ${folder}/death/${filename}`);
	const wavBuffer = await ttsToWav(text, filename);
	const outputDir = path.join(
		process.cwd(),
		"public/audio/voices",
		folder,
		"death",
	);
	fs.mkdirSync(outputDir, { recursive: true });
	const outputPath = path.join(outputDir, filename);
	fs.writeFileSync(outputPath, wavBuffer);
	console.log(
		`  Saved: ${folder}/death/${filename} (${wavBuffer.length} bytes)`,
	);
	await compressAudioFile(outputPath);
}

async function main(): Promise<void> {
	console.log("=== Generating Death Ending Audio Files ===\n");

	const allFiles = Object.entries(DEATH_SCRIPTS).flatMap(([folder, scripts]) =>
		scripts.map((s) => ({ folder, filename: s.filename, text: s.text })),
	);

	console.log(`Total files to generate: ${allFiles.length}\n`);

	let totalSuccess = 0;
	let totalFailed = 0;

	for (let i = 0; i < allFiles.length; i++) {
		const file = allFiles[i];
		try {
			if (i > 0) await sleep(1000);
			await generateVoiceFile(file.folder, file.filename, file.text);
			totalSuccess++;
		} catch (e) {
			console.error(`Failed: ${file.folder}/death/${file.filename}`, e);
			totalFailed++;
		}
	}

	console.log("\n=== Generation Complete ===");
	console.log(`Success: ${totalSuccess}/${allFiles.length}`);
	console.log(`Failed: ${totalFailed}/${allFiles.length}`);

	if (totalFailed > 0) process.exit(1);
}

main().catch(console.error);
