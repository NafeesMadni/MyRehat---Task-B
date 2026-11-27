"use client";

import {
	INTAKE_TYPES,
	type IntakeType,
} from "@myrehat-task-b/api/intake-options";
import { Button } from "@myrehat-task-b/ui/components/button";
import { Card, CardContent } from "@myrehat-task-b/ui/components/card";
import { Input } from "@myrehat-task-b/ui/components/input";
import { Label } from "@myrehat-task-b/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { orpc } from "@/utils/orpc";

const intakeFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	price: z
		.string()
		.min(1, "Price is required")
		.refine((value) => Number(value) > 0, "Price must be greater than 0"),
	location: z.string().min(1, "Location is required"),
	type: z.enum(INTAKE_TYPES),
	contactWa: z.string().min(1, "Contact WA is required"),
});

export default function IntakeForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const createIntake = useMutation(
		orpc.intake.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.intake.list.queryKey(),
				});
				toast.success("Intake added");
				router.push("/intake/list");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to add intake");
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			title: "",
			price: "",
			location: "",
			type: INTAKE_TYPES[0] as IntakeType,
			contactWa: "",
		},
		onSubmit: async ({ value }) => {
			createIntake.mutate({
				...value,
				price: Number(value.price),
			});
		},
		validators: {
			onSubmit: intakeFormSchema,
		},
	});

	return (
		<Card>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="title">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Title</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-destructive text-xs">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<form.Field name="price">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Price</Label>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										min="0"
										step="any"
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

						<form.Field name="location">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Location</Label>
									<Input
										id={field.name}
										name={field.name}
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
					</div>

					<form.Field name="type">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Type</Label>
								<select
									id={field.name}
									name={field.name}
									className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-8 w-full min-w-0 rounded-none border bg-transparent px-2.5 py-1 text-xs transition-colors outline-none focus-visible:ring-1"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value as IntakeType)
									}
								>
									{INTAKE_TYPES.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-destructive text-xs">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>

					<form.Field name="contactWa">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Contact WA</Label>
								<Input
									id={field.name}
									name={field.name}
									placeholder="03xxxxxxxxx"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-destructive text-xs">
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
								disabled={!canSubmit || isSubmitting || createIntake.isPending}
							>
								{isSubmitting || createIntake.isPending
									? "Submitting..."
									: "Submit"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</CardContent>
		</Card>
	);
}
