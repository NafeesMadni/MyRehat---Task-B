"use client";

import { Button } from "@myrehat-task-b/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@myrehat-task-b/ui/components/dropdown-menu";
import { cn } from "@myrehat-task-b/ui/lib/utils";
import {
	ClipboardList,
	Home,
	LayoutDashboard,
	List,
	Menu,
	MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

const links = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/intake", label: "Intake", icon: ClipboardList },
	{ href: "/intake/list", label: "Entries", icon: List },
	{ href: "/ai", label: "AI Chat", icon: MessageCircle },
] as const;

function isActive(pathname: string, href: string) {
	return href === "/" ? pathname === "/" : pathname === href;
}

export default function Header() {
	const pathname = usePathname();

	return (
		<header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
			<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link className="flex items-center gap-2" href="/">
					<span className="bg-primary text-primary-foreground flex size-7 items-center justify-center">
						<Home className="size-4" />
					</span>
					<span className="font-semibold tracking-tight">MyRehat</span>
				</Link>

				<nav aria-label="Main" className="hidden items-center gap-1 md:flex">
					{links.map(({ href, label }) => (
						<Link
							aria-current={isActive(pathname, href) ? "page" : undefined}
							className={cn(
								"px-3 py-2 text-sm font-medium transition-colors",
								isActive(pathname, href)
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
							href={href}
							key={href}
						>
							{label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									aria-label="Open navigation"
									className="md:hidden"
									size="icon"
									variant="outline"
								/>
							}
						>
							<Menu className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							{links.map(({ href, label, icon: Icon }) => (
								<DropdownMenuItem
									aria-current={isActive(pathname, href) ? "page" : undefined}
									className={cn(
										"gap-2 text-sm",
										isActive(pathname, href) && "bg-muted text-foreground",
									)}
									key={href}
									render={<Link href={href} />}
								>
									<Icon className="size-4" />
									{label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
