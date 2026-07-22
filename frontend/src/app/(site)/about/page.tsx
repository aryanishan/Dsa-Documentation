import type { Metadata } from "next";
import { BookOpen, Code2, Database, Globe2, Layers3, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about AlgoNotes — a modern, open platform for mastering data structures and algorithms.",
  alternates: { canonical: "/about" },
};

const techStack = [
  { icon: Globe2, name: "Next.js 15", description: "React framework with App Router, server components, and static generation." },
  { icon: Code2, name: "TypeScript", description: "Type-safe codebase across frontend and backend." },
  { icon: Layers3, name: "Tailwind CSS", description: "Utility-first styling with custom design tokens." },
  { icon: Database, name: "PostgreSQL + Prisma", description: "Relational database with type-safe ORM." },
  { icon: Shield, name: "JWT Authentication", description: "Secure, stateless authentication with refresh tokens." },
  { icon: Zap, name: "Judge0 API", description: "Sandboxed code execution supporting 9+ languages." },
];

const features = [
  "24+ comprehensive DSA topics with implementations in C++, Java, Python, and JavaScript",
  "Interactive code playground with Monaco Editor and 9 supported languages",
  "LeetCode-style practice problems with difficulty filters and starter code",
  "Full-text search across topics, algorithms, code, and headings",
  "Dark and light theme with system preference detection",
  "Reading progress, estimated reading time, and table of contents",
  "User dashboard with solved problems, bookmarks, and activity tracking",
  "Responsive design for desktop, tablet, and mobile",
  "SEO-optimized with structured data, OpenGraph, and Twitter Cards",
  "Production-ready Docker deployment with compose",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300">
          <Sparkles className="size-3.5" /> About AlgoNotes
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-slate-50">
          DSA documentation that <span className="text-sky-600 dark:text-sky-400">actually helps.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          AlgoNotes is a modern, visual reference for mastering data structures and algorithms.
          Every topic includes intuition, step-by-step explanations, working code in multiple languages,
          dry runs, complexity analysis, and curated practice problems.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-center text-sm font-semibold text-sky-600 dark:text-sky-400">Platform features</h2>
        <h3 className="mt-2 text-center text-2xl font-bold text-slate-950 dark:text-slate-50">Everything in one place.</h3>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/30">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300">
                <BookOpen className="size-3.5" />
              </span>
              <span className="text-sm leading-6 text-slate-700 dark:text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-sm font-semibold text-sky-600 dark:text-sky-400">Technology stack</h2>
        <h3 className="mt-2 text-center text-2xl font-bold text-slate-950 dark:text-slate-50">Built with modern tools.</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map(({ icon: Icon, name, description }) => (
            <article key={name} className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-glow dark:border-slate-800">
              <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Icon className="size-5" />
              </span>
              <h4 className="mt-4 font-semibold text-slate-950 dark:text-slate-50">{name}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-slate-950 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
        <h2 className="text-3xl font-bold tracking-tight">Start learning today.</h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-300">
          No sign-up required. Browse documentation, run code, and practice problems — all for free.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary" size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
            <Link href="/docs/arrays">Browse documentation</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            <Link href="/playground">Open playground</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
