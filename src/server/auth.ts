import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import {
	clearSessionCookie,
	createSessionCookie,
	parseSessionCookie,
} from "@/lib/session";
import type { SessionData } from "@/schemas/SessionSchema";
import { UsernameSchema } from "@/schemas/UsernameSchema";
import { codenames } from "./codenames";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		return parseSessionCookie(request);
	},
);

export const selectIdentity = createServerFn({
	method: "POST",
})
	.inputValidator(UsernameSchema)
	.handler(async ({ data: username }) => {
		const request = getRequest();
		const existingSession = parseSessionCookie(request);

		const sessionData: SessionData = {
			username,
			isVerified: existingSession?.isVerified ?? false,
			verifiedAt: existingSession?.verifiedAt ?? null,
		};

		const cookie = createSessionCookie(sessionData);

		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Set-Cookie": cookie,
			},
		});
	});

const CodenameSchema = z.string().min(1, "Codename is required");

export const verifyCodename = createServerFn({ method: "POST" })
	.inputValidator(CodenameSchema)
	.handler(async ({ data: codename }) => {
		const request = getRequest();
		const session = parseSessionCookie(request);

		if (!session?.username) {
			return new Response(
				JSON.stringify({ success: false, error: "No identity selected" }),
				{ status: 400 },
			);
		}

		const isValid =
			codenames[session.username].toLowerCase() ===
			codename.trim().toLowerCase();

		if (!isValid) {
			return new Response(
				JSON.stringify({ success: false, error: "Invalid codename" }),
				{ status: 400 },
			);
		}

		const updatedSession: SessionData = {
			...session,
			isVerified: true,
			verifiedAt: new Date().toISOString(),
		};

		const cookie = createSessionCookie(updatedSession);

		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Set-Cookie": cookie,
			},
		});
	});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
	const cookie = clearSessionCookie();

	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Set-Cookie": cookie,
		},
	});
});
