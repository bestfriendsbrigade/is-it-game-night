import type { Username } from "@/schemas/UsernameSchema";

// Helper function to get required environment variable
function getRequiredEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(
			`Missing required environment variable: ${key}. Please check your .env.local file.`,
		);
	}
	return value;
}

export const codenames: Record<Username, string> = {
	beco: getRequiredEnv("CODENAME_BECO"),
	reco: getRequiredEnv("CODENAME_RECO"),
	peco: getRequiredEnv("CODENAME_PECO"),
};
