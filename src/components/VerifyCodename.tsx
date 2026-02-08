import { useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { USERS } from "@/lib/constants";
import type { SessionData } from "@/schemas/SessionSchema";
import { verifyCodename } from "@/server/auth";

interface VerifyCodenameProps {
	session: SessionData;
}

export function VerifyCodename({ session }: VerifyCodenameProps) {
	const navigate = useNavigate();
	const inputId = useId();
	const [codename, setCodename] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const user = session.username ? USERS[session.username] : null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const response = await verifyCodename({ data: codename });
			const result = await response.json();

			if (result.success) {
				navigate({ to: "/vote" });
			} else {
				setError(result.error || "Invalid codename");
				setIsLoading(false);
			}
		} catch (_err) {
			setError("Failed to verify codename");
			setIsLoading(false);
		}
	};

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p>No user selected</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-primary">
						<img
							src={`/avatars/${user.username}.png`}
							alt={user.displayName}
							className="h-full w-full object-cover"
						/>
					</div>
					<h2 className="text-2xl font-bold text-muted-foreground">
						{user.displayName}
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor={inputId}
							className="mb-2 block text-xl font-semibold">
							What's your codename?
						</label>
						<input
							type="password"
							id={inputId}
							value={codename}
							onChange={(e) => setCodename(e.target.value)}
							placeholder="Enter your codename"
							className="w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-lg focus:border-primary focus:outline-none"
							disabled={isLoading}
						/>
						<p className="mt-2 text-sm text-muted-foreground">
							(not case sensitive)
						</p>
					</div>

					{error && (
						<div className="rounded-lg bg-destructive/10 p-4 text-destructive">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading || !codename.trim()}
						className="w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
						{isLoading ? "Verifying..." : "Verify"}
					</button>
				</form>
			</div>
		</div>
	);
}
