"use client";
import { buttonVariants } from "@myrehat-task-b/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
			<section className="flex flex-col gap-4">
				<h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
					Book homestays directly with hosts
				</h1>
				<p className="text-muted-foreground max-w-prose text-pretty">
					Find a place to stay, connect with the host, and book without the
					middleman.
				</p>
				<div className="flex flex-col gap-2 sm:flex-row">
					<Link className={buttonVariants()} href="/intake">
						Get started
					</Link>
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/intake/list"
					>
						Browse entries
					</Link>
				</div>
			</section>

			<section className="mt-10 rounded-lg border p-4 sm:mt-12">
				<h2 className="mb-2 font-medium">API Status</h2>
				<div className="flex items-center gap-2">
					<div
						className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
					/>
					<span className="text-muted-foreground text-sm">
						{healthCheck.isLoading
							? "Checking..."
							: healthCheck.data
								? "Connected"
								: "Disconnected"}
					</span>
				</div>
			</section>
		</main>
	);
}
