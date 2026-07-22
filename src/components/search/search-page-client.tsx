"use client";

import { ArrowRight, BookOpen, Code2, FileText, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
};

function SearchContent({ documents }: { documents: SearchItem[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return documents
      .filter((doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        doc.content.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, documents]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Search</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-slate-50">
          Find what you need.
        </h1>
      </header>

      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="absolute left-4 top-3.5 size-5 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, algorithms, code…"
          className="h-12 pl-12 text-base"
          autoFocus
        />
      </div>

      <section className="mt-10">
        {query.trim() === "" ? (
          <div className="text-center">
            <FileText className="mx-auto size-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Start typing to search across all documentation topics.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center">
            <Search className="mx-auto size-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try different keywords or browse the documentation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            {results.map((result) => (
              <Link
                key={result.slug}
                href={`/docs/${result.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-sky-800"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300">
                  <BookOpen className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
                      {result.title}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {result.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {result.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function SearchPageClient({ documents }: { documents: SearchItem[] }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Loading search…</div>}>
      <SearchContent documents={documents} />
    </Suspense>
  );
}
