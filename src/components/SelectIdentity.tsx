import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { USERS } from "@/lib/constants";
import type { Username } from "@/schemas/UsernameSchema";
import { selectIdentity } from "@/server/auth";

export function SelectIdentity() {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);

	const handleSelect = async (username: Username) => {
		setIsLoading(true);

		try {
			await selectIdentity({ data: username });
			navigate({ to: "/verify" });
		} catch (error) {
			console.error("Failed to select identity:", error);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-2xl text-center">
				<h1 className="mb-12 text-4xl font-bold">Who are you?</h1>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
					{Object.values(USERS).map((user) => (
						<button
							key={user.username}
							type="button"
							onClick={() => handleSelect(user.username)}
							disabled={isLoading}
							className="group relative aspect-square overflow-hidden rounded-lg border-4 border-border bg-muted transition-all hover:scale-105 hover:border-primary disabled:pointer-events-none disabled:opacity-50">
							<img
								src={`/avatars/${user.username}.png`}
								alt={user.displayName}
								className="h-full w-full object-cover"
							/>
							<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
								<p className="text-xl font-bold text-white">
									{user.displayName}
								</p>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
