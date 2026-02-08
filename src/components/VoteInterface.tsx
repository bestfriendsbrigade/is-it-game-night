import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { USERS } from "@/lib/constants";
import type { SessionData } from "@/schemas/SessionSchema";
import type { VoteData } from "@/schemas/VoteDataSchema";
import { logout } from "@/server/auth";
import { castVote, getVotes } from "@/server/votes";

interface VoteInterfaceProps {
	session: SessionData;
	initialVotes: VoteData;
}

function calculateStatus(votes: VoteData): "YES" | "NO" | "MAYBE!?" {
	const allVotes = [votes.reco, votes.beco, votes.peco];

	if (allVotes.some((v) => v === "no")) return "NO";
	if (allVotes.every((v) => v === "yes")) return "YES";
	return "MAYBE!?";
}

export function VoteInterface({ session, initialVotes }: VoteInterfaceProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: votes = initialVotes } = useQuery({
		queryKey: ["votes"],
		queryFn: async () => {
			return await getVotes();
		},
		initialData: initialVotes,
		refetchInterval: 2000,
		refetchIntervalInBackground: true,
	});

	const voteMutation = useMutation({
		mutationFn: async (vote: "yes" | "no") => {
			const response = await castVote({ data: vote });
			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["votes"] });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await logout();
		},
		onSuccess: () => {
			navigate({ to: "/" });
		},
	});

	const status = calculateStatus(votes);
	const user = session.username ? USERS[session.username] : null;
	const userVote = session.username ? votes[session.username] : null;

	const statusColors = {
		YES: "text-green-600 dark:text-green-400",
		NO: "text-red-600 dark:text-red-400",
		"MAYBE!?": "text-yellow-600 dark:text-yellow-400",
	};

	const statusBgColors = {
		YES: "bg-green-100 dark:bg-green-950",
		NO: "bg-red-100 dark:bg-red-950",
		"MAYBE!?": "bg-yellow-100 dark:bg-yellow-950",
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="border-b border-border p-4">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						{user && (
							<>
								<div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
									<img
										src={`/avatars/${user.username}.png`}
										alt={user.displayName}
										className="h-full w-full object-cover"
									/>
								</div>
								<span className="font-semibold">{user.displayName}</span>
							</>
						)}
					</div>
					<button
						type="button"
						onClick={() => logoutMutation.mutate()}
						className="text-sm text-muted-foreground hover:text-foreground">
						Logout
					</button>
				</div>
			</header>

			<main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4">
				<div className="w-full max-w-2xl text-center">
					<h1 className="mb-8 text-4xl font-bold">Is It Game Night?</h1>

					<div
						className={`mb-12 rounded-2xl p-12 ${statusBgColors[status]} transition-colors`}>
						<div
							className={`text-9xl font-bold ${statusColors[status]} animate-fade-in`}>
							{status}
						</div>
					</div>

					<div className="mb-8">
						<p className="mb-4 text-xl font-semibold">Your vote:</p>
						<div className="flex gap-4 justify-center">
							<button
								type="button"
								onClick={() => voteMutation.mutate("yes")}
								disabled={voteMutation.isPending}
								className={`flex-1 max-w-xs rounded-lg px-8 py-6 text-2xl font-bold transition-all ${
									userVote === "yes"
										? "bg-green-600 text-white scale-105 ring-4 ring-green-600 ring-opacity-50"
										: "bg-muted hover:bg-green-600 hover:text-white"
								} disabled:pointer-events-none disabled:opacity-50`}>
								YES
							</button>
							<button
								type="button"
								onClick={() => voteMutation.mutate("no")}
								disabled={voteMutation.isPending}
								className={`flex-1 max-w-xs rounded-lg px-8 py-6 text-2xl font-bold transition-all ${
									userVote === "no"
										? "bg-red-600 text-white scale-105 ring-4 ring-red-600 ring-opacity-50"
										: "bg-muted hover:bg-red-600 hover:text-white"
								} disabled:pointer-events-none disabled:opacity-50`}>
								NO
							</button>
						</div>
					</div>

					<div className="text-sm text-muted-foreground">
						<p className="mb-2">Current votes:</p>
						<div className="flex justify-center gap-6">
							{Object.entries(USERS).map(([username, user]) => {
								const vote = votes[username as keyof VoteData];
								return (
									<div key={username} className="flex items-center gap-2">
										<span>{user.displayName}:</span>
										<span className="font-semibold">
											{vote === "yes" && "✓ YES"}
											{vote === "no" && "✗ NO"}
											{vote === null && "—"}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
