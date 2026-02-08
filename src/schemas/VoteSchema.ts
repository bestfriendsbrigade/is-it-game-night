import { z } from "zod";

export const VoteSchema = z.enum(["yes", "no"]).nullable();
export type Vote = z.infer<typeof VoteSchema>;
