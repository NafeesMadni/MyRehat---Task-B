import {
	doublePrecision,
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const intake = pgTable(
	"intake",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		price: doublePrecision("price").notNull(),
		location: text("location").notNull(),
		type: text("type").notNull(),
		contactWa: text("contact_wa").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("intake_created_at_idx").on(table.createdAt)],
);
