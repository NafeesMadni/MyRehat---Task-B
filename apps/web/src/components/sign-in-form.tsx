import { Button } from "@myrehat-task-b/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { Input } from "@myrehat-task-b/ui/components/input";
import { Label } from "@myrehat-task-b/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto w-full max-w-md px-4 py-10">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
					<CardDescription>
						Sign in to manage your intake entries.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Email</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											key={error?.message}
											className="text-destructive text-xs"
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Password</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p
											key={error?.message}
											className="text-destructive text-xs"
										>
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>

						<form.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ canSubmit, isSubmitting }) => (
								<Button
									type="submit"
									className="w-full"
									disabled={!canSubmit || isSubmitting}
								>
									{isSubmitting ? "Signing in..." : "Sign in"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</CardContent>
				<CardFooter className="justify-center border-t-0 pt-0">
					<Button variant="link" onClick={onSwitchToSignUp} className="text-xs">
						Need an account? Sign up
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
