import { z } from "zod";
import { VoteSchema } from "./VoteSchema";

export const VoteDataSchema = z.object({
	reco: VoteSchema,
	beco: VoteSchema,
	peco: VoteSchema,
});
export type VoteData = z.infer<typeof VoteDataSchema>;
