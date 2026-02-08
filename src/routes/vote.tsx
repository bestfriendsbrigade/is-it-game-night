import { createFileRoute, redirect } from "@tanstack/react-router";
import { VoteInterface } from "@/components/VoteInterface";
import { getSession } from "@/server/auth";
import { getVotes } from "@/server/votes";

export const Route = createFileRoute("/vote")({
	loader: async () => {
		const session = await getSession();

		if (!session?.isVerified || !session?.username) {
			throw redirect({ to: "/" });
		}

		const votes = await getVotes();

		return { session, votes };
	},
	component: () => {
		const { session, votes } = Route.useLoaderData();

		return <VoteInterface session={session} initialVotes={votes} />;
	},
});
