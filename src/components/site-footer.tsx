import { BookOpen, Code2, Trophy } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.25fr_repeat(3,.7fr)] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-slate-950 dark:text-slate-50"><span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white"><BookOpen className="size-3.5" /></span> AlgoNotes</Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">A focused workspace for learning concepts, writing code, and building interview-ready instincts.</p>
        </div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Learn</p><div className="mt-3 grid gap-2 text-sm"><Link href="/docs/arrays" className="hover:text-sky-600 dark:hover:text-sky-400">Documentation</Link><Link href="/roadmap" className="hover:text-sky-600 dark:hover:text-sky-400">Roadmap</Link><Link href="/search" className="hover:text-sky-600 dark:hover:text-sky-400">Search topics</Link></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Practice</p><div className="mt-3 grid gap-2 text-sm"><Link href="/playground" className="inline-flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400"><Code2 className="size-3.5" /> Code playground</Link><Link href="/problems" className="inline-flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400"><Trophy className="size-3.5" /> Problems</Link><Link href="/bookmarks" className="hover:text-sky-600 dark:hover:text-sky-400">Bookmarks</Link></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Account</p><div className="mt-3 grid gap-2 text-sm"><Link href="/login" className="hover:text-sky-600 dark:hover:text-sky-400">Sign in</Link><Link href="/register" className="hover:text-sky-600 dark:hover:text-sky-400">Create account</Link><Link href="/about" className="hover:text-sky-600 dark:hover:text-sky-400">About</Link></div></div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-800">Built for deliberate practice, quick revision, and better interviews.</div>
    </footer>
  );
}
