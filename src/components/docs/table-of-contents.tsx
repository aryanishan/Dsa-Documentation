"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { TableOfContentsItem } from "@/types/docs";

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -68% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <aside className="sticky top-20 hidden h-fit xl:block" aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">On this page</p>
      <nav className="border-l border-slate-200 dark:border-slate-800">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block border-l -ml-px py-1 text-sm leading-5 transition",
              item.level === 3 ? "pl-5" : "pl-3",
              activeId === item.id
                ? "border-sky-500 font-medium text-sky-700 dark:text-sky-300"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
            )}
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
