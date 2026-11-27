import { generateText, type LanguageModel } from "ai";

export const DEFAULT_OPENCODE_MODEL = "opencode/nemotron-3.5-lightning-free";

export const POLISH_SYSTEM_PROMPT = `You are a real-estate copywriter for MyRehat. Rewrite listing descriptions so they are clear, warm, and persuasive while keeping every fact accurate.

Rules:
- Keep the original facts (location, size, price, features). Never invent details.
- Improve flow, grammar, and appeal.
- Keep it concise: 2-4 short paragraphs or a short bullet list.
- Return only the rewritten description, with no preamble or explanation.`;

export type GenerateTextLike = (options: {
	model: LanguageModel;
	system: string;
	prompt: string;
}) => Promise<{ text: string }>;

export type PolishProvider = {
	(modelId: string): LanguageModel;
	dispose: () => Promise<void>;
};

export type PolishOptions = {
	model?: LanguageModel;
	modelId?: string;
	generateTextFn?: GenerateTextLike;
	createProvider?: () => PolishProvider | Promise<PolishProvider>;
};

export function buildPolishPrompt(description: string): string {
	return `Rewrite this listing description:\n\n${description}`;
}

export async function createOpencodeProvider(): Promise<PolishProvider> {
	const { createOpencode } = await import("ai-sdk-provider-opencode-sdk");
	const baseUrl = process.env.OPENCODE_BASE_URL ?? "http://127.0.0.1:4096";
	const password = process.env.OPENCODE_PASSWORD ?? "";

	return createOpencode({
		baseUrl,
		clientOptions: {
			headers: {
				Authorization: `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`,
			},
		},
	});
}

export async function polishDescription(
	description: string,
	options: PolishOptions = {},
): Promise<string> {
	const trimmed = description.trim();
	if (!trimmed) {
		throw new Error("A listing description is required.");
	}

	const generate: GenerateTextLike =
		options.generateTextFn ?? ((input) => generateText(input));

	let provider: PolishProvider | undefined;
	let model: LanguageModel;

	if (options.model) {
		model = options.model;
	} else {
		provider = await (options.createProvider ?? createOpencodeProvider)();
		model = provider(options.modelId ?? DEFAULT_OPENCODE_MODEL);
	}

	try {
		const { text } = await generate({
			model,
			system: POLISH_SYSTEM_PROMPT,
			prompt: buildPolishPrompt(trimmed),
		});

		const polished = text.trim();
		if (!polished) {
			throw new Error("The model returned an empty description.");
		}
		return polished;
	} finally {
		await provider?.dispose();
	}
}

if (import.meta.main) {
	const description = process.argv.slice(2).join(" ").trim();
	if (!description) {
		console.error('Usage: bun Scripts/polish.ts "your listing description"');
		process.exit(1);
	}

	polishDescription(description)
		.then((polished) => console.log(polished))
		.catch((error: unknown) => {
			console.error(error instanceof Error ? error.message : String(error));
			process.exit(1);
		});
}
