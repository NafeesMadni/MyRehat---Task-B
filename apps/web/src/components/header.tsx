"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/intake", label: "Intake" },
		{ to: "/intake/list", label: "Entries" },
		{ to: "/ai", label: "AI Chat" },
	] as const;

	return (
		<div>
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
				<nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base sm:text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			<hr />
		</div>
	);
}
