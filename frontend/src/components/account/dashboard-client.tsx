"use client";

import { ArrowUpRight, Bookmark, BookOpenCheck, CalendarDays, CheckCircle2, Circle, Flame, Sparkles, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AccountShell, useBrowserSession } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import { practiceProblems } from "@/components/problems/problem-data";
import { getProblemActivity, getProblemBookmarks, getSolvedProblemSlugs, subscribeToAccountState, type ProblemActivity } from "@/lib/user-session";

type LearningSnapshot = {
  solved: string[];
  bookmarked: number;
  activity: ProblemActivity[];
};

function readSnapshot(): LearningSnapshot {
  return { solved: getSolvedProblemSlugs(), bookmarked: getProblemBookmarks().length, activity: getProblemActivity() };
}

function formatRelativeTime(isoDate: string) {
  const difference = Math.max(0, Date.now() - new Date(isoDate).getTime());
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getWeekActivity(activity: ProblemActivity[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - offset));
    const key = day.toDateString();
    const count = activity.filter((entry) => new Date(entry.occurredAt).toDateString() === key).length;
    return { label: day.toLocaleDateString(undefined, { weekday: "narrow" }), count, isToday: offset === 6 };
  });
}

export function DashboardClient() {
  const { session, hydrated } = useBrowserSession();
  const [snapshot, setSnapshot] = useState<LearningSnapshot>({ solved: [], bookmarked: 0, activity: [] });

  useEffect(() => {
    const update = () => setSnapshot(readSnapshot());
    update();
    return subscribeToAccountState(update);
  }, []);

  const solvedSet = useMemo(() => new Set(snapshot.solved), [snapshot.solved]);
  const nextProblem = practiceProblems.find((problem) => !solvedSet.has(problem.slug)) ?? practiceProblems[0];
  const completion = Math.round((solvedSet.size / practiceProblems.length) * 100);
  const weeklyActivity = useMemo(() => getWeekActivity(snapshot.activity), [snapshot.activity]);
  const activeDays = weeklyActivity.filter((day) => day.count > 0).length;
  const displayName = hydrated && session ? session.user.name.split(" ")[0] : "Learner";

  return (
    <AccountShell active="dashboard">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Learning dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-slate-50">Good to see you, {displayName}.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Your progress lives here: the patterns you have practiced, saved, and are ready to tackle next.</p>
          </div>
          <Button asChild><Link href={`/problems/${nextProblem.slug}`}>Continue practice <ArrowUpRight className="ml-2 size-4" /></Link></Button>
        </header>

        {!hydrated || session ? null : <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100 sm:flex-row sm:items-center sm:justify-between"><span><strong>Keep this progress across sessions.</strong> Sign in to save your learning profile beyond this browser.</span><Button asChild variant="outline" size="sm" className="border-sky-200 bg-white dark:border-sky-900 dark:bg-slate-950"><Link href="/login">Sign in</Link></Button></div>}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Learning statistics">
          <MetricCard icon={Trophy} label="Problems solved" value={String(solvedSet.size)} detail={`of ${practiceProblems.length} in your practice set`} tone="sky" />
          <MetricCard icon={Target} label="Completion" value={`${completion}%`} detail="of your current problem set" tone="violet" />
          <MetricCard icon={Bookmark} label="Saved for later" value={String(snapshot.bookmarked)} detail="problems in your queue" tone="amber" />
          <MetricCard icon={Flame} label="Active days" value={String(activeDays)} detail="days with focused activity" tone="rose" />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,.7fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 sm:p-6" aria-labelledby="next-up-title">
            <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Next up</p><h2 id="next-up-title" className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">Keep the momentum deliberate.</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">#{nextProblem.number}</span></div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-950 dark:text-slate-50">{nextProblem.title}</h3><DifficultyBadge difficulty={nextProblem.difficulty} /></div><p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">{nextProblem.description}</p><div className="mt-3 flex flex-wrap gap-2">{nextProblem.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-md bg-white px-2 py-1 text-xs text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">{tag}</span>)}</div></div>
              <Button asChild className="mt-4 shrink-0 sm:mt-0"><Link href={`/problems/${nextProblem.slug}`}>Solve now <ArrowUpRight className="ml-2 size-4" /></Link></Button>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100"><BookOpenCheck className="size-4 text-sky-500" /> Practice set progress</span><span className="text-sm font-medium text-slate-500 dark:text-slate-400">{solvedSet.size}/{practiceProblems.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-[width] duration-500" style={{ width: `${completion}%` }} /></div><p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Small, consistent reps compound. Choose one pattern, understand why it works, then come back to it later.</p></div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 sm:p-6" aria-labelledby="week-title">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-sky-600 dark:text-sky-400">This week</p><h2 id="week-title" className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">Your learning rhythm</h2></div><CalendarDays className="size-5 text-slate-400" /></div>
            <div className="mt-7 flex h-32 items-end justify-between gap-2" aria-label={`${activeDays} active days this week`}>
              {weeklyActivity.map((day, index) => <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="flex h-24 w-full items-end rounded-lg bg-slate-50 px-1 dark:bg-slate-950/60"><div className="w-full rounded-md bg-gradient-to-t from-sky-600 to-sky-400 transition-all" style={{ height: `${day.count ? Math.min(100, 24 + day.count * 25) : 8}%`, opacity: day.count ? 1 : .22 }} /></div><span className={day.isToday ? "text-xs font-bold text-sky-600 dark:text-sky-400" : "text-xs text-slate-500 dark:text-slate-400"}>{day.label}</span></div>)}
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950/50 dark:text-slate-400"><Sparkles className="mr-1.5 inline size-3.5 text-amber-500" /> {activeDays ? `You showed up ${activeDays} day${activeDays === 1 ? "" : "s"} this week.` : "Start with one focused problem today and build from there."}</div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 sm:p-6" aria-labelledby="activity-title">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Recent work</p><h2 id="activity-title" className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">A short trail back into your flow.</h2></div><Button asChild variant="ghost" size="sm"><Link href="/problems">Browse all problems <ArrowUpRight className="ml-1.5 size-3.5" /></Link></Button></div>
          {snapshot.activity.length ? <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">{snapshot.activity.slice(0, 5).map((entry) => <li key={`${entry.slug}-${entry.action}-${entry.occurredAt}`} className="flex items-center gap-3 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">{entry.action === "solved" ? <CheckCircle2 className="size-4 text-emerald-500" /> : entry.action === "bookmarked" ? <Bookmark className="size-4 text-amber-500" /> : <Circle className="size-4 text-sky-500" />}</span><span className="min-w-0 flex-1"><Link href={`/problems/${entry.slug}`} className="font-medium text-slate-900 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400">{entry.title}</Link><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{entry.action === "solved" ? "Marked solved" : entry.action === "bookmarked" ? "Saved to your queue" : "Opened problem"}</span></span><span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(entry.occurredAt)}</span></li>)}</ul> : <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center dark:border-slate-800"><p className="font-medium text-slate-800 dark:text-slate-200">Your recent practice will appear here.</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Open a problem, save it for later, or mark one solved to begin your trail.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link href="/problems">Explore problems</Link></Button></div>}
        </section>
      </div>
    </AccountShell>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Trophy; label: string; value: string; detail: string; tone: "sky" | "violet" | "amber" | "rose" }) {
  const tones = {
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300",
  };
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30"><span className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}><Icon className="size-4" /></span><p className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">{value}</p><p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>;
}

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const classes = { Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300", Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300", Hard: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${classes[difficulty]}`}>{difficulty}</span>;
}
