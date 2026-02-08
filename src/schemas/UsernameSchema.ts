import { z } from "zod";

export const UsernameSchema = z.enum(["reco", "beco", "peco"]);
export type Username = z.infer<typeof UsernameSchema>;
