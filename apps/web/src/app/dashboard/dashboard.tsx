"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { useQuery } from "@tanstack/react-query";

import type { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const privateData = useQuery(orpc.privateData.queryOptions());

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Account</CardTitle>
					<CardDescription>Signed in with Better Auth.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-xs">
					<div className="space-y-0.5">
						<p className="text-muted-foreground">Name</p>
						<p className="font-medium">{session.user.name}</p>
					</div>
					<div className="space-y-0.5">
						<p className="text-muted-foreground">Email</p>
						<p className="font-medium">{session.user.email}</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>API</CardTitle>
					<CardDescription>Private oRPC procedure status.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-xs">
					<div className="space-y-0.5">
						<p className="text-muted-foreground">Response</p>
						<p className="font-medium">
							{privateData.isPending
								? "Loading..."
								: (privateData.data?.message ?? "Unavailable")}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<span
							className={`h-2 w-2 rounded-full ${
								privateData.isError ? "bg-red-500" : "bg-green-500"
							}`}
						/>
						<span className="text-muted-foreground">
							{privateData.isPending
								? "Checking..."
								: privateData.isError
									? "Error"
									: "Connected"}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
