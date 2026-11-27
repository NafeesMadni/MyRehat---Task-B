import { describe, expect, it } from "vitest";

import { formatReply, formatWahaReply } from "../apps/server/src/ai/reply";

describe("reply formatter", () => {
	it("trims surrounding whitespace", () => {
		expect(formatReply("  Hello there \n")).toBe("Hello there");
	});

	it("preserves internal line breaks", () => {
		expect(formatReply("Line one\n\nLine two")).toBe("Line one\n\nLine two");
	});

	it("formats a WAHA reply with the recipient", () => {
		expect(formatWahaReply(" 60123456789@c.us ", "  Hi!  ")).toEqual({
			to: "60123456789@c.us",
			reply: "Hi!",
		});
	});

	it("rejects an empty reply", () => {
		expect(() => formatReply("   ")).toThrow("empty reply");
	});

	it("rejects an empty recipient", () => {
		expect(() => formatWahaReply("   ", "Hi")).toThrow("recipient");
	});
});
