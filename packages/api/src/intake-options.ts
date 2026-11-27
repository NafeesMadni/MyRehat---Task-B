export const INTAKE_TYPES = [
	"Buy Property",
	"Buy land to build homestay",
	"Buy Airbnb Profile",
	"Buy Airbnb Business",
] as const;

export type IntakeType = (typeof INTAKE_TYPES)[number];
