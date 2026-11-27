import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { Elysia } from "elysia";

import { CONCIERGE_SYSTEM_PROMPT } from "../ai/concierge";
import { formatWahaReply } from "../ai/reply";
import { wahaWebhookSchema } from "./waha-schema";

export { wahaWebhookSchema } from "./waha-schema";

export const wahaWebhook = new Elysia().post(
	"/api/webhooks/waha",
	async ({ request, status }) => {
		let json: unknown;
		try {
			json = await request.json();
		} catch {
			return status(400, { error: "Invalid JSON body" });
		}

		const parsed = wahaWebhookSchema.safeParse(json);
		if (!parsed.success) {
			return status(400, {
				error: "Invalid WAHA payload",
				issues: parsed.error.issues,
			});
		}

		const { from, body } = parsed.data.payload;

		try {
			const { text } = await generateText({
				model: google("gemini-2.5-flash"),
				system: CONCIERGE_SYSTEM_PROMPT,
				prompt: body,
			});

			return formatWahaReply(from, text);
		} catch (error) {
			console.error("WAHA concierge failed", error);
			return status(502, { error: "Failed to generate reply" });
		}
	},
	{
		parse: "none",
	},
);
