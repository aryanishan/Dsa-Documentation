import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({ category, title }: { category: string; title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      <Link href="/" className="rounded hover:text-sky-600 dark:hover:text-sky-400" aria-label="Home"><Home className="size-3.5" /></Link>
      <ChevronRight className="size-3.5" />
      <Link href="/docs/arrays" className="rounded hover:text-sky-600 dark:hover:text-sky-400">Documentation</Link>
      <ChevronRight className="size-3.5" />
      <span>{category}</span>
      <ChevronRight className="size-3.5" />
      <span className="font-medium text-slate-700 dark:text-slate-300" aria-current="page">{title}</span>
    </nav>
  );
}
