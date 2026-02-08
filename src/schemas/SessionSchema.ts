import { z } from "zod";
import { UsernameSchema } from "./UsernameSchema";

export const SessionDataSchema = z.object({
	username: UsernameSchema.nullable(),
	isVerified: z.boolean(),
	verifiedAt: z.string().nullable(),
});
export type SessionData = z.infer<typeof SessionDataSchema>;
