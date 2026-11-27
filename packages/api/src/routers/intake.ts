import { intake } from "@myrehat-task-b/db/schema/intake";
import { z } from "zod";

import { protectedProcedure } from "../index";
import { INTAKE_TYPES } from "../intake-options";

const createIntakeInput = z.object({
	title: z.string().trim().min(1, "Title is required").max(200),
	price: z.coerce.number().positive("Price must be greater than 0"),
	location: z.string().trim().min(1, "Location is required").max(200),
	type: z.enum(INTAKE_TYPES),
	contactWa: z.string().trim().min(1, "Contact WA is required").max(50),
});

export const intakeRouter = {
	create: protectedProcedure
		.input(createIntakeInput)
		.handler(async ({ input, context }) => {
			const [entry] = await context.db.insert(intake).values(input).returning();
			return entry;
		}),
	list: protectedProcedure.handler(async ({ context }) => {
		const entries = await context.db.select().from(intake);
		return entries.sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		);
	}),
};
