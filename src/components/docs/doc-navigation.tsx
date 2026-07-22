import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { DocumentationPage } from "@/types/docs";

export function DocNavigation({ previous, next }: { previous?: DocumentationPage; next?: DocumentationPage }) {
  return (
    <nav className="mt-12 grid gap-3 border-t border-slate-200 pt-7 sm:grid-cols-2 dark:border-slate-800" aria-label="Page navigation">
      {previous ? (
        <Link href={`/docs/${previous.slug}`} className="group rounded-xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800 dark:hover:bg-sky-950/25">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><ArrowLeft className="size-3.5" /> Previous</span>
          <span className="mt-1 block font-semibold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">{previous.title}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link href={`/docs/${next.slug}`} className="group rounded-xl border border-slate-200 p-4 text-right transition hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800 dark:hover:bg-sky-950/25">
          <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-slate-500">Next <ArrowRight className="size-3.5" /></span>
          <span className="mt-1 block font-semibold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">{next.title}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}
