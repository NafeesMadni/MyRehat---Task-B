import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
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
		<div className="mx-auto w-full max-w-3xl px-4 py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Welcome back, {session.user.name}.
				</p>
			</div>
			<Dashboard session={session} />
		</div>
	);
}
