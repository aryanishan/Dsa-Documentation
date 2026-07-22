import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { DocumentationPage } from "@/types/docs";

export function RelatedTopics({ topics }: { topics: DocumentationPage[] }) {
  if (!topics.length) return null;
  return (
    <section className="mt-10" aria-labelledby="related-topics">
      <h2 id="related-topics" className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Related topics</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/docs/${topic.slug}`} className="group rounded-xl border border-slate-200 p-4 transition hover:border-sky-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-sky-800">
            <span className="flex items-start justify-between gap-3 font-semibold text-slate-900 dark:text-slate-100">
              {topic.title}<ArrowUpRight className="size-4 shrink-0 text-slate-400 transition group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            </span>
            <span className="mt-1.5 line-clamp-2 block text-sm leading-5 text-slate-500 dark:text-slate-400">{topic.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
