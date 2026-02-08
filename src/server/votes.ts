import { tz } from "@date-fns/tz";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { addDays, format, startOfDay } from "date-fns";
import { EAST_COAST_TIMEZONE } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { parseSessionCookie } from "@/lib/session";
import { VoteDataSchema } from "@/schemas/VoteDataSchema";
import { VoteSchema } from "@/schemas/VoteSchema";

function getCurrentDayKey(): string {
	const tzFn = tz(EAST_COAST_TIMEZONE);
	const now = tzFn(new Date());
	return format(now, "yyyy-MM-dd");
}

function getMidnightTomorrowET(): Date {
	const tzFn = tz(EAST_COAST_TIMEZONE);
	const now = tzFn(new Date());
	const tomorrowET = addDays(now, 1);
	const midnightTomorrowET = startOfDay(tomorrowET);
	return midnightTomorrowET;
}

export const getVotes = createServerFn({ method: "GET" }).handler(async () => {
	const dayKey = getCurrentDayKey();

	const [rawReco, rawBeco, rawPeco] = await Promise.all([
		redis.get(`votes:${dayKey}:reco`),
		redis.get(`votes:${dayKey}:beco`),
		redis.get(`votes:${dayKey}:peco`),
	]);

	const votes = {
		reco: VoteSchema.parse(rawReco),
		beco: VoteSchema.parse(rawBeco),
		peco: VoteSchema.parse(rawPeco),
	};

	return VoteDataSchema.parse(votes);
});

export const getCurrentUserVote = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		const session = parseSessionCookie(request);

		if (!session?.username) {
			return null;
		}

		const dayKey = getCurrentDayKey();
		const rawVote = await redis.get(`votes:${dayKey}:${session.username}`);

		return VoteSchema.parse(rawVote);
	},
);

export const castVote = createServerFn({ method: "POST" })
	.inputValidator(VoteSchema)
	.handler(async ({ data: vote }) => {
		const request = getRequest();

		if (vote === null) {
			throw new Error("Vote cannot be null");
		}

		const session = parseSessionCookie(request);

		if (!session?.isVerified || !session?.username) {
			return new Response(
				JSON.stringify({ success: false, error: "Not authenticated" }),
				{ status: 401 },
			);
		}

		const dayKey = getCurrentDayKey();
		const key = `votes:${dayKey}:${session.username}`;

		// Calculate expiration (midnight tomorrow ET in Unix timestamp)
		const expirationDate = getMidnightTomorrowET();
		const expirationUnix = Math.floor(expirationDate.getTime() / 1000);

		await redis.set(key, vote, {
			exat: expirationUnix,
		});

		// Return updated votes
		const votes = await getVotes();
		return new Response(JSON.stringify({ success: true, votes }), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	});
