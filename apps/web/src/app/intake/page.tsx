import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import IntakeForm from "./intake-form";

export default async function IntakePage() {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="mx-auto w-full max-w-xl px-4 py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">New intake</h1>
				<p className="text-muted-foreground text-sm">
					Capture a property, land, or Airbnb opportunity.
				</p>
			</div>
			<IntakeForm />
		</div>
	);
}
