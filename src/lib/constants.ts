import type { Username } from "@/schemas/UsernameSchema";

export interface UserInfo {
	username: Username;
	displayName: string;
}

export const USERS: Record<Username, UserInfo> = {
	peco: {
		username: "peco",
		displayName: "Peco",
	},
	beco: {
		username: "beco",
		displayName: "Beco",
	},
	reco: {
		username: "reco",
		displayName: "Reco",
	},
};

export const EAST_COAST_TIMEZONE = "America/New_York";
export const SESSION_COOKIE_NAME = "game_night_session";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
