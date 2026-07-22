import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Compass, Sparkles } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getAllDocs } from "@/lib/docs";
import { roadmapStages } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DSA learning roadmap",
  description: "A practical sequence for learning data structures and algorithms from beginner to advanced.",
  alternates: { canonical: "/roadmap" },
};

const toneClasses = {
  sky: "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
  violet: "border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20",
  amber: "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20",
};

const dotClasses = { sky: "bg-sky-500", violet: "bg-violet-500", amber: "bg-amber-500" };

export default function RoadmapPage() {
  const docs = getAllDocs();
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  const foundations = ["time-complexity", "space-complexity", "recursion", "bit-manipulation"].map((slug) => bySlug.get(slug)).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"><Compass className="size-3.5" /> A deliberate DSA path</span>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-slate-50">A roadmap that turns concepts into instincts.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Use this sequence to build dependable fundamentals before combining patterns in harder problems.</p>
      </header>

      <section className="mt-12 rounded-2xl border border-slate-200 p-5 dark:border-slate-800" aria-labelledby="foundations-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Before you begin</p><h2 id="foundations-title" className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-50">Foundation tools</h2></div><Sparkles className="size-5 text-sky-500" /></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {foundations.map((doc) => doc ? <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group rounded-xl bg-slate-50 p-4 transition hover:bg-sky-50 dark:bg-slate-900 dark:hover:bg-sky-950/40"><span className="font-semibold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">{doc.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{doc.description}</span></Link> : null)}
        </div>
      </section>

      <div className="relative mt-10 space-y-6 before:absolute before:bottom-10 before:left-[1.35rem] before:top-10 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
        {roadmapStages.map((stage, index) => {
          const stageDocs = stage.slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
          return (
            <section key={stage.title} className="relative grid gap-4 pl-12 sm:grid-cols-[10rem_1fr] sm:gap-7" aria-labelledby={`${stage.title.toLowerCase()}-title`}>
              <span className={cn("absolute left-0 top-5 grid size-11 place-items-center rounded-full border-4 border-white text-sm font-bold text-white shadow-sm dark:border-slate-950", dotClasses[stage.tone])}>{index + 1}</span>
              <div className="pt-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stage {index + 1}</p><h2 id={`${stage.title.toLowerCase()}-title`} className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">{stage.title}</h2></div>
              <div className={cn("rounded-2xl border p-5", toneClasses[stage.tone])}>
                <p className="leading-7 text-slate-600 dark:text-slate-300">{stage.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {stageDocs.map((doc) => doc ? <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group flex items-start gap-3 rounded-xl border border-white/60 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /><span className="min-w-0"><span className="flex items-center gap-2 font-semibold text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">{doc.title}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span><span className="mt-1 block text-xs leading-5 text-slate-500">{doc.tags.slice(0, 3).join(" · ")}</span></span></Link> : null)}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-7 text-center dark:border-slate-800 dark:bg-slate-900/40"><h2 className="text-xl font-bold text-slate-950 dark:text-slate-50">Ready for your first lesson?</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Start with analysis, then let the roadmap do the sequencing.</p><Link href="/docs/time-complexity" className={cn(buttonVariants({ className: "mt-5" }))}>Start Time Complexity <ArrowRight className="ml-2 size-4" /></Link></div>
    </div>
  );
}
