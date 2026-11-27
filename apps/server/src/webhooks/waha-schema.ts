import { z } from "zod";

export const wahaWebhookSchema = z.object({
	event: z.string().min(1),
	payload: z.object({
		from: z.string().min(1),
		body: z.string().min(1),
	}),
});

export type WahaWebhookPayload = z.infer<typeof wahaWebhookSchema>;
