export type AppRole = "USER" | "ADMIN";

export type AuthenticatedUser = {
  userId: string;
  sessionId: string;
  role: AppRole;
  email: string;
};

export type AccessTokenPayload = {
  sub: string;
  sid: string;
  role: AppRole;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  sid: string;
  type: "refresh";
};
