import { BookOpen, Code2, LayoutDashboard, LogIn, Menu, Route, Trophy } from "lucide-react";
import Link from "next/link";

import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SearchDocument } from "@/types/docs";

export function SiteHeader({ documents }: { documents: SearchDocument[] }) {
  const navigation = [
    { href: "/docs/arrays", label: "Documentation", icon: BookOpen },
    { href: "/roadmap", label: "Roadmap", icon: Route },
    { href: "/playground", label: "Playground", icon: Code2 },
    { href: "/problems", label: "Problems", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-tight text-slate-950 dark:text-slate-50" aria-label="AlgoNotes home">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm transition-transform group-hover:-rotate-3">
            <BookOpen className="size-4" />
          </span>
          <span>AlgoNotes</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 text-sm text-slate-600 lg:flex dark:text-slate-300" aria-label="Primary navigation">
          {navigation.map(({ href, label }) => (
            <Link key={href} className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50" href={href}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog documents={documents} />
          <ThemeToggle />
          <Link href="/login" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:flex dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50">
            <LogIn className="size-4" /> Sign in
          </Link>
          <Link href="/dashboard" className="hidden items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 xl:flex">
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Open navigation">
              <Menu className="size-4" />
            </summary>
            <nav className="absolute right-0 top-12 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950" aria-label="Mobile navigation">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link key={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900" href={href}><Icon className="size-4" /> {label}</Link>
              ))}
              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
              <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900" href="/login"><LogIn className="size-4" /> Sign in</Link>
              <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900" href="/dashboard"><LayoutDashboard className="size-4" /> Dashboard</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
