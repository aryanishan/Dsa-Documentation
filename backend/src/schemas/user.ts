import { z } from "zod";

import { IdSchema, PaginationSchema, UserRoleSchema } from "./common";

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  avatarUrl: z.string().trim().url().max(2048).nullable().optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required.");

export const UpdateSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  editorFontSize: z.number().int().min(12).max(24).optional(),
  showMinimap: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required.");

export const UserParamsSchema = z.object({ userId: IdSchema });

export const AdminUserListSchema = PaginationSchema.extend({
  role: UserRoleSchema.optional(),
  q: z.string().trim().min(1).max(100).optional(),
});

export const UpdateUserRoleSchema = z.object({ role: UserRoleSchema });
