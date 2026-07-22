"use client";

import { Bookmark, CircleUserRound, LayoutDashboard, LogIn, LogOut, Menu, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { clearAccountSession, getAccountSession, subscribeToAccountState, type AccountSession } from "@/lib/user-session";
import { cn } from "@/lib/utils";

type AccountSection = "dashboard" | "profile" | "bookmarks";

const navigation: Array<{ href: string; label: string; icon: typeof LayoutDashboard; section: AccountSection }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { href: "/profile", label: "Profile", icon: CircleUserRound, section: "profile" },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, section: "bookmarks" },
];

export function useBrowserSession() {
  const [session, setSession] = useState<AccountSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const update = () => setSession(getAccountSession());
    update();
    setHydrated(true);
    return subscribeToAccountState(update);
  }, []);

  return { session, hydrated };
}

export function AccountShell({ active, children }: { active: AccountSection; children: ReactNode }) {
  const router = useRouter();
  const { session, hydrated } = useBrowserSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  function signOut() {
    clearAccountSession();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-8.75rem)] bg-slate-50/70 dark:bg-slate-950">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 lg:block">
          <AccountNavigation active={active} session={session} hydrated={hydrated} onSignOut={signOut} />
        </aside>

        <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-900 dark:text-slate-50">Your workspace</span><Button variant="ghost" size="icon" onClick={() => setMobileOpen((current) => !current)} aria-expanded={mobileOpen} aria-label="Toggle account navigation"><Menu className="size-4" /></Button></div>
          {mobileOpen ? <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800"><AccountNavigation active={active} session={session} hydrated={hydrated} onSignOut={signOut} compact /></div> : null}
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function AccountNavigation({ active, session, hydrated, onSignOut, compact = false }: { active: AccountSection; session: AccountSession | null; hydrated: boolean; onSignOut: () => void; compact?: boolean }) {
  return (
    <div className={cn(compact ? "" : "sticky top-24", "space-y-6")}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">{hydrated && session ? session.user.name.slice(0, 1).toUpperCase() : "A"}</span>
          <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{hydrated && session ? session.user.name : "Your learning space"}</span><span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{hydrated && session ? session.user.email : "Sign in to sync progress"}</span></span>
        </div>
      </div>

      <nav className="grid gap-1" aria-label="Account navigation">
        {navigation.map(({ href, label, icon: Icon, section }) => (
          <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active === section ? "bg-sky-50 text-sky-700 dark:bg-sky-950/45 dark:text-sky-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50")}><Icon className="size-4" />{label}</Link>
        ))}
        <Link href="/profile#preferences" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"><Settings2 className="size-4" /> Preferences</Link>
      </nav>

      {hydrated && session ? <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400" onClick={onSignOut}><LogOut className="size-4" /> Sign out</Button> : <Button asChild variant="outline" className="w-full justify-start gap-3"><Link href="/login"><LogIn className="size-4" /> Sign in to save</Link></Button>}
    </div>
  );
}
