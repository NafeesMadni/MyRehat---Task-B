import { afterAll, describe, expect, mock, test } from "bun:test";
import type { LanguageModel } from "ai";

import {
	createOpencodeProvider,
	DEFAULT_OPENCODE_MODEL,
	type GenerateTextLike,
	POLISH_SYSTEM_PROMPT,
	type PolishProvider,
	polishDescription,
} from "./polish";

const fakeModel = { modelId: "mock-model" } as unknown as LanguageModel;

function createMockProvider() {
	const dispose = mock(async () => {});
	const provider = Object.assign((_modelId: string) => fakeModel, {
		dispose,
	}) as PolishProvider;

	return { provider, dispose };
}

describe("polishDescription", () => {
	test("rewrites the description with the opencode model", async () => {
		const generateTextFn = mock(
			async (_options: Parameters<GenerateTextLike>[0]) => ({
				text: "  A bright, cozy home.  ",
			}),
		);
		const { provider, dispose } = createMockProvider();
		const createProvider = mock(() => provider);

		const result = await polishDescription("  Cozy 2-bed home.  ", {
			modelId: "opencode/test-model",
			generateTextFn,
			createProvider,
		});

		expect(result).toBe("A bright, cozy home.");
		expect(createProvider).toHaveBeenCalledTimes(1);
		expect(dispose).toHaveBeenCalledTimes(1);

		const call = generateTextFn.mock.calls[0]?.[0];
		expect(call?.model).toBe(fakeModel);
		expect(call?.system).toBe(POLISH_SYSTEM_PROMPT);
		expect(call?.prompt).toContain("Cozy 2-bed home.");
	});

	test("uses the default model id when none is provided", async () => {
		const generateTextFn = mock(
			async (_options: Parameters<GenerateTextLike>[0]) => ({
				text: "Polished.",
			}),
		);
		const seenModelIds: string[] = [];
		const dispose = mock(async () => {});
		const provider = Object.assign(
			(modelId: string) => {
				seenModelIds.push(modelId);
				return fakeModel;
			},
			{ dispose },
		) as PolishProvider;

		await polishDescription("A house.", {
			generateTextFn,
			createProvider: () => provider,
		});

		expect(seenModelIds).toEqual([DEFAULT_OPENCODE_MODEL]);
	});

	test("does not create a provider when a model is injected", async () => {
		const generateTextFn = mock(
			async (_options: Parameters<GenerateTextLike>[0]) => ({
				text: "Polished.",
			}),
		);
		const createProvider = mock(() => {
			throw new Error("provider should not be created");
		});

		await polishDescription("A house.", {
			model: fakeModel,
			generateTextFn,
			createProvider,
		});

		expect(createProvider).not.toHaveBeenCalled();
	});

	test("disposes the provider when generation fails", async () => {
		const generateTextFn = mock(
			async (_options: Parameters<GenerateTextLike>[0]) => {
				throw new Error("model failed");
			},
		);
		const { provider, dispose } = createMockProvider();

		await expect(
			polishDescription("A house.", {
				generateTextFn,
				createProvider: () => provider,
			}),
		).rejects.toThrow("model failed");

		expect(dispose).toHaveBeenCalledTimes(1);
	});

	test("rejects an empty description", async () => {
		await expect(polishDescription("   ")).rejects.toThrow(
			"A listing description is required.",
		);
	});

	test("rejects an empty model response", async () => {
		const generateTextFn = mock(
			async (_options: Parameters<GenerateTextLike>[0]) => ({
				text: "   ",
			}),
		);

		await expect(
			polishDescription("A house.", { model: fakeModel, generateTextFn }),
		).rejects.toThrow("The model returned an empty description.");
	});

	test("creates the opencode provider with Basic auth", async () => {
		const { provider } = createMockProvider();
		const createOpencode = mock((_settings: unknown) => provider);

		mock.module("ai-sdk-provider-opencode-sdk", () => ({ createOpencode }));

		const previousUrl = process.env.OPENCODE_BASE_URL;
		const previousPassword = process.env.OPENCODE_PASSWORD;
		process.env.OPENCODE_BASE_URL = "http://127.0.0.1:9999";
		process.env.OPENCODE_PASSWORD = "secret";

		try {
			const result = await createOpencodeProvider();

			expect(result).toBe(provider);
			expect(createOpencode).toHaveBeenCalledTimes(1);

			const settings = createOpencode.mock.calls[0]?.[0] as {
				baseUrl?: string;
				clientOptions?: { headers?: { Authorization?: string } };
			};
			expect(settings?.baseUrl).toBe("http://127.0.0.1:9999");
			expect(settings?.clientOptions?.headers?.Authorization).toBe(
				`Basic ${Buffer.from("opencode:secret").toString("base64")}`,
			);
		} finally {
			if (previousUrl === undefined) {
				delete process.env.OPENCODE_BASE_URL;
			} else {
				process.env.OPENCODE_BASE_URL = previousUrl;
			}
			if (previousPassword === undefined) {
				delete process.env.OPENCODE_PASSWORD;
			} else {
				process.env.OPENCODE_PASSWORD = previousPassword;
			}
		}
	});

	afterAll(() => {
		mock.restore();
	});
});
