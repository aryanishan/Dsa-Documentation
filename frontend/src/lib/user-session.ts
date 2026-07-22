export type AccountUser = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  focus: string;
  timezone: string;
  avatar?: string;
};

export type AccountSession = {
  token: string;
  mode: "remote" | "local";
  user: AccountUser;
  createdAt: string;
};

export type ProblemBookmark = {
  kind: "problem";
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  savedAt: string;
};

export type ProblemActivity = {
  slug: string;
  title: string;
  action: "opened" | "solved" | "bookmarked";
  occurredAt: string;
};

const SESSION_KEY = "algonotes.session.v1";
const PROFILE_KEY = "algonotes.profile.v1";
const BOOKMARKS_KEY = "algonotes.bookmarks.v1";
const SOLVED_KEY = "algonotes.solved-problems.v1";
const ACTIVITY_KEY = "algonotes.problem-activity.v1";
const STATE_EVENT = "algonotes:state-change";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in privacy-restricted browsers. The UI remains usable for this visit.
  }
}

function notifyStateChange() {
  if (canUseBrowserStorage()) window.dispatchEvent(new Event(STATE_EVENT));
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normaliseAccountUser(value: unknown, fallback: Pick<AccountUser, "name" | "email">): AccountUser {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const email = stringValue(source.email, fallback.email).toLowerCase();
  const name = stringValue(source.name, fallback.name || email.split("@")[0] || "Learner");

  return {
    id: stringValue(source.id, stringValue(source.userId, `local-${email.replace(/[^a-z0-9]/gi, "") || "learner"}`)),
    name,
    email,
    joinedAt: stringValue(source.joinedAt, new Date().toISOString()),
    focus: stringValue(source.focus, "Build reliable problem-solving patterns"),
    timezone: stringValue(source.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"),
    avatar: stringValue(source.avatar) || undefined,
  };
}

export function getAccountSession(): AccountSession | null {
  if (!canUseBrowserStorage()) return null;
  const candidate = readJson<Partial<AccountSession> | null>(window.sessionStorage, SESSION_KEY, null);
  if (!candidate || typeof candidate.token !== "string" || !candidate.user) return null;

  const user = normaliseAccountUser(candidate.user, { name: "Learner", email: "learner@algonotes.local" });
  return {
    token: candidate.token,
    mode: candidate.mode === "remote" ? "remote" : "local",
    user,
    createdAt: stringValue(candidate.createdAt, new Date().toISOString()),
  };
}

export function saveAccountSession(session: AccountSession) {
  if (!canUseBrowserStorage()) return;
  writeJson(window.sessionStorage, SESSION_KEY, session);
  writeJson(window.localStorage, PROFILE_KEY, session.user);
  notifyStateChange();
}

export function createLocalSession(input: { name?: string; email: string }): AccountSession {
  const email = input.email.trim().toLowerCase();
  const user = normaliseAccountUser(
    {
      id: `local-${email.replace(/[^a-z0-9]/gi, "") || Date.now().toString(36)}`,
      name: input.name,
      email,
    },
    { name: input.name || "Learner", email },
  );

  return {
    token: `local-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36)}`,
    mode: "local",
    user,
    createdAt: new Date().toISOString(),
  };
}

export function clearAccountSession() {
  if (!canUseBrowserStorage()) return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing else is needed when storage is disabled.
  }
  notifyStateChange();
}

export function updateAccountProfile(changes: Partial<Pick<AccountUser, "name" | "focus" | "timezone" | "avatar">>) {
  if (!canUseBrowserStorage()) return null;
  const current = getAccountSession();
  if (!current) return null;
  const user = { ...current.user, ...changes };
  saveAccountSession({ ...current, user });
  return user;
}

export function getProblemBookmarks(): ProblemBookmark[] {
  if (!canUseBrowserStorage()) return [];
  const values = readJson<unknown[]>(window.localStorage, BOOKMARKS_KEY, []);
  return values.filter((value): value is ProblemBookmark => {
    if (!value || typeof value !== "object") return false;
    const bookmark = value as Record<string, unknown>;
    return bookmark.kind === "problem" && typeof bookmark.slug === "string" && typeof bookmark.title === "string";
  });
}

export function isProblemBookmarked(slug: string) {
  return getProblemBookmarks().some((bookmark) => bookmark.slug === slug);
}

export function toggleProblemBookmark(problem: Omit<ProblemBookmark, "kind" | "savedAt">) {
  if (!canUseBrowserStorage()) return false;
  const current = getProblemBookmarks();
  const exists = current.some((bookmark) => bookmark.slug === problem.slug);
  const next = exists
    ? current.filter((bookmark) => bookmark.slug !== problem.slug)
    : [{ ...problem, kind: "problem" as const, savedAt: new Date().toISOString() }, ...current];
  writeJson(window.localStorage, BOOKMARKS_KEY, next);
  if (!exists) recordProblemActivity({ slug: problem.slug, title: problem.title, action: "bookmarked" });
  notifyStateChange();
  return !exists;
}

export function getSolvedProblemSlugs(): string[] {
  if (!canUseBrowserStorage()) return [];
  const values = readJson<unknown[]>(window.localStorage, SOLVED_KEY, []);
  return values.filter((value): value is string => typeof value === "string");
}

export function isProblemSolved(slug: string) {
  return getSolvedProblemSlugs().includes(slug);
}

export function markProblemSolved(problem: Pick<ProblemActivity, "slug" | "title">) {
  if (!canUseBrowserStorage()) return;
  const solved = getSolvedProblemSlugs();
  if (!solved.includes(problem.slug)) writeJson(window.localStorage, SOLVED_KEY, [problem.slug, ...solved]);
  recordProblemActivity({ ...problem, action: "solved" });
  notifyStateChange();
}

export function recordProblemActivity(activity: Omit<ProblemActivity, "occurredAt">) {
  if (!canUseBrowserStorage()) return;
  const current = readJson<ProblemActivity[]>(window.localStorage, ACTIVITY_KEY, []);
  const next = [{ ...activity, occurredAt: new Date().toISOString() }, ...current]
    .filter((entry, index, all) => index === 0 || !(entry.slug === activity.slug && entry.action === activity.action))
    .slice(0, 12);
  writeJson(window.localStorage, ACTIVITY_KEY, next);
  notifyStateChange();
}

export function getProblemActivity(): ProblemActivity[] {
  if (!canUseBrowserStorage()) return [];
  const values = readJson<unknown[]>(window.localStorage, ACTIVITY_KEY, []);
  return values.filter((value): value is ProblemActivity => {
    if (!value || typeof value !== "object") return false;
    const activity = value as Record<string, unknown>;
    return typeof activity.slug === "string" && typeof activity.title === "string" && typeof activity.occurredAt === "string";
  });
}

export function subscribeToAccountState(callback: () => void) {
  if (!canUseBrowserStorage()) return () => undefined;
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STATE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STATE_EVENT, handler);
  };
}
