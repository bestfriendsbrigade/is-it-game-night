import { createFileRoute, redirect } from "@tanstack/react-router";
import { SelectIdentity } from "@/components/SelectIdentity";
import { getSession } from "@/server/auth";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();

		if (session?.isVerified) {
			throw redirect({ to: "/vote" });
		}

		if (session?.username) {
			throw redirect({ to: "/verify" });
		}
	},
	component: SelectIdentity,
});
