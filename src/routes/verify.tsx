import {
	createFileRoute,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { VerifyCodename } from "@/components/VerifyCodename";
import { getSession } from "@/server/auth";

export const Route = createFileRoute("/verify")({
	beforeLoad: async () => {
		const session = await getSession();

		if (!session?.username) {
			throw redirect({ to: "/" });
		}

		if (session.isVerified) {
			throw redirect({ to: "/vote" });
		}

		return { session };
	},
	component: () => {
		const { session } = useRouteContext({ from: "/verify" });
		return <VerifyCodename session={session} />;
	},
});
