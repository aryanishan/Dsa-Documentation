import type { User } from "@prisma/client";

export function publicUser(user: Pick<User, "id" | "name" | "email" | "role" | "avatarUrl" | "bio" | "createdAt" | "updatedAt">) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
