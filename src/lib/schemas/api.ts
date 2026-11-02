import { z } from "zod";

export const contactResponseSchema = z.object({
  ok: z.literal(true),
  referenceId: z.string(),
});
