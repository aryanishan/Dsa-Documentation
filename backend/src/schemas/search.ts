import { z } from "zod";

import { PaginationSchema } from "./common";

export const SearchQuerySchema = PaginationSchema.extend({
  q: z.string().trim().min(2).max(200),
  type: z.enum(["all", "topics", "problems", "code"]).default("all"),
});
