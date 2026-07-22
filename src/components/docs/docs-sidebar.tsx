import { ChevronRight, FolderTree } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { DocumentationPage } from "@/types/docs";

type SidebarProps = {
  groups: Record<string, DocumentationPage[]>;
  currentSlug?: string;
  mobile?: boolean;
};

function NavigationList({ groups, currentSlug }: Omit<SidebarProps, "mobile">) {
  return (
    <nav aria-label="Documentation navigation" className="space-y-5">
      {Object.entries(groups).map(([category, docs]) => (
        <section key={category}>
          <h2 className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{category}</h2>
          <ul className="space-y-0.5">
            {docs.map((doc) => {
              const active = doc.slug === currentSlug;
              return (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm leading-5 transition",
                      active
                        ? "bg-sky-50 font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                    )}
                  >
                    <ChevronRight className={cn("size-3 shrink-0 transition-transform", active && "rotate-90")} />
                    <span className="truncate">{doc.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export function DocsSidebar({ groups, currentSlug, mobile = false }: SidebarProps) {
  if (mobile) {
    return (
      <details className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:hidden dark:border-slate-800 dark:bg-slate-900/40">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <FolderTree className="size-4 text-sky-600 dark:text-sky-400" /> Browse documentation
        </summary>
        <div className="mt-4 max-h-[55vh] overflow-y-auto pr-1"><NavigationList groups={groups} currentSlug={currentSlug} /></div>
      </details>
    );
  }

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-y-auto pr-4 lg:block">
      <div className="mb-5 flex items-center gap-2 px-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
        <FolderTree className="size-4 text-sky-600 dark:text-sky-400" /> Documentation
      </div>
      <NavigationList groups={groups} currentSlug={currentSlug} />
    </aside>
  );
}
