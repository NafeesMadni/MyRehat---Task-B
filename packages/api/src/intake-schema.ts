import { z } from "zod";

import { INTAKE_TYPES, type IntakeType } from "./intake-options";

export const intakeTypeSchema = z.enum(INTAKE_TYPES);

export function isIntakeType(value: unknown): value is IntakeType {
	return intakeTypeSchema.safeParse(value).success;
}
