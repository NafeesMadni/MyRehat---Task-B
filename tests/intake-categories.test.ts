import { describe, expect, it } from "vitest";

import { INTAKE_TYPES } from "../packages/api/src/intake-options";
import {
	intakeTypeSchema,
	isIntakeType,
} from "../packages/api/src/intake-schema";

describe("intake categories", () => {
	it("has exactly four categories", () => {
		expect(INTAKE_TYPES).toHaveLength(4);
	});

	for (const type of INTAKE_TYPES) {
		it(`accepts "${type}"`, () => {
			expect(intakeTypeSchema.safeParse(type).success).toBe(true);
			expect(isIntakeType(type)).toBe(true);
		});
	}

	it("rejects an unknown category", () => {
		expect(intakeTypeSchema.safeParse("Buy Villa").success).toBe(false);
		expect(isIntakeType("Buy Villa")).toBe(false);
	});
});
