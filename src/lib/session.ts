import { parse, serialize } from "cookie";
import { type SessionData, SessionDataSchema } from "@/schemas/SessionSchema";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "./constants";

export function parseSessionCookie(request: Request): SessionData | null {
	const cookieHeader = request.headers.get("Cookie");
	if (!cookieHeader) return null;

	const cookies = parse(cookieHeader);
	const sessionData = cookies[SESSION_COOKIE_NAME];
	if (!sessionData) return null;

	try {
		const parsed = JSON.parse(sessionData);
		return SessionDataSchema.parse(parsed);
	} catch {
		return null;
	}
}

export function createSessionCookie(session: SessionData): string {
	return serialize(SESSION_COOKIE_NAME, JSON.stringify(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_MAX_AGE,
		path: "/",
	});
}

export function clearSessionCookie(): string {
	return serialize(SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
}
