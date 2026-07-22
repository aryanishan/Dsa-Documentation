"use client";

import { ArrowUpRight, Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AccountShell } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import { getProblemBookmarks, toggleProblemBookmark, subscribeToAccountState, type ProblemBookmark } from "@/lib/user-session";

const difficultyStyles = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<ProblemBookmark[]>([]);

  useEffect(() => {
    const update = () => setBookmarks(getProblemBookmarks());
    update();
    return subscribeToAccountState(update);
  }, []);

  function remove(slug: string) {
    const bm = bookmarks.find((b) => b.slug === slug);
    if (bm) toggleProblemBookmark({ slug: bm.slug, title: bm.title, difficulty: bm.difficulty, tags: bm.tags });
  }

  return (
    <AccountShell active="bookmarks">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <header>
          <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Saved problems</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-slate-50">
            Your bookmark queue.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Problems you have saved for later practice. Remove them once you have solved them.
          </p>
        </header>

        <section className="mt-8">
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center dark:border-slate-800">
              <Bookmark className="mx-auto size-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 font-medium text-slate-800 dark:text-slate-200">No bookmarks yet.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Open a problem and tap the bookmark icon to add it here.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-5">
                <Link href="/problems">Browse problems</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bm) => (
                <div
                  key={bm.slug}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-sky-800"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/problems/${bm.slug}`}
                        className="font-semibold text-slate-900 hover:text-sky-700 dark:text-slate-100 dark:hover:text-sky-300"
                      >
                        {bm.title}
                      </Link>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyStyles[bm.difficulty]}`}>
                        {bm.difficulty}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {bm.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button asChild variant="ghost" size="icon" title="Open problem">
                      <Link href={`/problems/${bm.slug}`}>
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(bm.slug)} title="Remove bookmark">
                      <Trash2 className="size-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AccountShell>
  );
}
