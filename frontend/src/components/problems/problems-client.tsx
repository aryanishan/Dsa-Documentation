"use client";

import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, ChevronDown, Filter, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { practiceProblems, type ProblemDifficulty } from "@/components/problems/problem-data";
import { cn } from "@/lib/utils";

const allTags = Array.from(new Set(practiceProblems.flatMap((p) => p.tags))).sort();

const difficultyClass: Record<ProblemDifficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export function ProblemsClient() {
  const [query, setQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const filtered = useMemo(() => {
    return practiceProblems.filter((p) => {
      if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false;
      if (selectedTag !== "All" && !p.tags.includes(selectedTag)) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [query, selectedDifficulty, selectedTag]);

  const counts = {
    Easy: practiceProblems.filter((p) => p.difficulty === "Easy").length,
    Medium: practiceProblems.filter((p) => p.difficulty === "Medium").length,
    Hard: practiceProblems.filter((p) => p.difficulty === "Hard").length,
  };

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Practice problems</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-slate-50">
            Sharpen your pattern recognition.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Pick a problem, understand the approach, implement the solution, then move on to the next challenge.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Trophy className="size-3.5" /> {counts.Easy} Easy
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {counts.Medium} Medium
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {counts.Hard} Hard
          </span>
        </div>
      </header>

      <section className="mt-8 flex flex-wrap items-center gap-3" aria-label="Filters">
        <div className="relative min-w-[16rem] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Search problems…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            aria-label="Filter by difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as ProblemDifficulty | "All")}
            className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-slate-400" />
        </div>
        <div className="relative">
          <select
            aria-label="Filter by tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="All">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
        </p>
      </section>

      <section className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="hidden border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[3rem_1fr_6rem_1fr_5rem] sm:gap-4 dark:border-slate-800 dark:bg-slate-950/70">
            <span>#</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
            <span className="text-right">Acceptance</span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Filter className="mx-auto size-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">No problems match your filters.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try broadening your search or removing a filter.</p>
            </div>
          ) : (
            filtered.map((problem) => (
              <Link
                key={problem.slug}
                href={`/problems/${problem.slug}`}
                className="group flex flex-col gap-2 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50/80 sm:grid sm:grid-cols-[3rem_1fr_6rem_1fr_5rem] sm:items-center sm:gap-4 dark:border-slate-800 dark:hover:bg-slate-900/40"
              >
                <span className="font-mono text-xs font-bold text-slate-400">{problem.number}</span>
                <span className="flex items-center gap-2">
                  {problem.solved ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <span className="size-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                  <span className="font-medium text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
                    {problem.title}
                  </span>
                </span>
                <span className={cn("inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-semibold", difficultyClass[problem.difficulty])}>
                  {problem.difficulty}
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="text-right text-sm text-slate-500 dark:text-slate-400">{problem.acceptance}%</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
