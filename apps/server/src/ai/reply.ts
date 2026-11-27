export type WahaReply = {
	to: string;
	reply: string;
};

export function formatReply(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) {
		throw new Error("The concierge returned an empty reply.");
	}

	return trimmed;
}

export function formatWahaReply(to: string, text: string): WahaReply {
	const recipient = to.trim();
	if (!recipient) {
		throw new Error("A recipient is required.");
	}

	return { to: recipient, reply: formatReply(text) };
}
