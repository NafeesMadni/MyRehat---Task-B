import { buttonVariants } from "@myrehat-task-b/ui/components/button";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import IntakeList from "./intake-list";

export default async function IntakeListPage() {
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
		<div className="mx-auto w-full max-w-2xl px-4 py-10">
			<div className="mb-6 flex items-end justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						Intake entries
					</h1>
					<p className="text-muted-foreground text-sm">
						All submitted property intake requests.
					</p>
				</div>
				<Link href="/intake" className={buttonVariants({ size: "sm" })}>
					New intake
				</Link>
			</div>
			<IntakeList />
		</div>
	);
}
