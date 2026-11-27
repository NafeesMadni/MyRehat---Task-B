"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

const priceFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
});

export default function IntakeList() {
	const entries = useQuery(orpc.intake.list.queryOptions());

	if (entries.isPending) {
		return (
			<Card>
				<CardContent>
					<p className="text-muted-foreground text-sm">Loading entries...</p>
				</CardContent>
			</Card>
		);
	}

	if (entries.isError) {
		return (
			<Card>
				<CardContent>
					<p className="text-destructive text-sm">Failed to load entries.</p>
				</CardContent>
			</Card>
		);
	}

	if (!entries.data?.length) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center gap-1 py-8 text-center">
					<p className="text-sm font-medium">No intake entries yet</p>
					<p className="text-muted-foreground text-xs">
						Create your first intake to see it here.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4">
			{entries.data.map((entry) => (
				<Card key={entry.id}>
					<CardHeader>
						<div className="flex items-start justify-between gap-3">
							<div className="space-y-1">
								<CardTitle className="text-base">{entry.title}</CardTitle>
								<CardDescription>{entry.location}</CardDescription>
							</div>
							<span className="text-muted-foreground shrink-0 border px-2 py-0.5 text-[11px]">
								{entry.type}
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
							<div className="space-y-0.5">
								<dt className="text-muted-foreground">Price</dt>
								<dd className="font-medium">
									{priceFormatter.format(entry.price)}
								</dd>
							</div>
							<div className="space-y-0.5">
								<dt className="text-muted-foreground">Contact WA</dt>
								<dd className="font-medium">{entry.contactWa}</dd>
							</div>
							<div className="space-y-0.5">
								<dt className="text-muted-foreground">Created</dt>
								<dd className="font-medium">
									{new Date(entry.createdAt).toLocaleString()}
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
