import { describe, expect, it } from "vitest";

import { wahaWebhookSchema } from "../apps/server/src/webhooks/waha-schema";

const validPayload = {
	event: "message",
	payload: {
		from: "60123456789@c.us",
		body: "I want to buy land in Bali.",
	},
};

describe("WAHA webhook validation", () => {
	it("accepts a valid payload", () => {
		expect(wahaWebhookSchema.safeParse(validPayload).success).toBe(true);
	});

	it("strips unknown fields", () => {
		const result = wahaWebhookSchema.safeParse({
			...validPayload,
			extra: true,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual(validPayload);
		}
	});

	const invalidPayloads: Array<[string, unknown]> = [
		["missing event", { payload: validPayload.payload }],
		["empty event", { ...validPayload, event: "" }],
		["missing payload", { event: "message" }],
		["missing from", { ...validPayload, payload: { body: "Hi" } }],
		[
			"empty from",
			{ ...validPayload, payload: { ...validPayload.payload, from: "" } },
		],
		["missing body", { ...validPayload, payload: { from: "601@c.us" } }],
		[
			"empty body",
			{ ...validPayload, payload: { ...validPayload.payload, body: "" } },
		],
		["null payload", { event: "message", payload: null }],
		["non-object body", "not-an-object"],
	];

	for (const [label, payload] of invalidPayloads) {
		it(`rejects ${label}`, () => {
			expect(wahaWebhookSchema.safeParse(payload).success).toBe(false);
		});
	}
});
