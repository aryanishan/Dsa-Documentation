import { ArrowRight, BookMarked, Braces, CheckCircle2, Code2, Network, SearchCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { SearchDialog } from "@/components/search-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllDocs, getSearchIndex } from "@/lib/docs";

const highlights = [
  { icon: Braces, title: "Implementation-first", text: "Compare C++, Java, and Python solutions without changing pages." },
  { icon: SearchCheck, title: "Search everything", text: "Find concepts, complexity discussions, and code snippets in milliseconds." },
  { icon: BookMarked, title: "Revision-ready", text: "Use dry runs, mistakes, questions, and practice prompts to make concepts stick." },
];

export default function HomePage() {
  const docs = getAllDocs();
  const explicitlyFeatured = docs.filter((doc) => doc.featured);
  // A new MDX collection is useful immediately: fall back to the first six ordered lessons
  // until authors opt into `featured: true` in frontmatter.
  const featured = (explicitlyFeatured.length ? explicitlyFeatured : docs).slice(0, 6);
  const searchIndex = getSearchIndex();

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_17%_0%,rgba(14,165,233,.16),transparent_28%),radial-gradient(circle_at_83%_11%,rgba(99,102,241,.13),transparent_26%)] dark:bg-[radial-gradient(circle_at_17%_0%,rgba(14,165,233,.15),transparent_28%),radial-gradient(circle_at_83%_11%,rgba(99,102,241,.14),transparent_26%)]" />
        <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300">
              <Sparkles className="size-3.5" /> Clear explanations. Practical patterns. Zero clutter.
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
              Learn DSA like you will <span className="text-sky-600 dark:text-sky-400">actually use it.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A modern, visual reference for mastering the data structures and algorithms behind confident problem solving.
            </p>
            <div className="mt-8 max-w-2xl"><SearchDialog documents={searchIndex} variant="hero" /></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/time-complexity" className={cn(buttonVariants({ size: "lg" }))}>Start with the foundations <ArrowRight className="ml-2 size-4" /></Link>
              <Link href="/roadmap" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>View learning roadmap</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:130ms]">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-300/25 via-indigo-300/20 to-transparent blur-2xl dark:from-sky-700/20 dark:via-indigo-700/20" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-glow dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><Code2 className="size-4 text-sky-600 dark:text-sky-400" /> Your problem-solving toolkit</div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">20 lessons</span>
              </div>
              <div className="space-y-3 pt-4">
                {[
                  ["01", "Analyze", "Time & space complexity"],
                  ["02", "Model", "Arrays, trees, graphs"],
                  ["03", "Optimize", "Greedy and dynamic programming"],
                  ["04", "Scale", "Segment trees, DSU, tries"],
                ].map(([number, title, caption]) => (
                  <div key={number} className="flex items-center gap-4 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-900/70">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white font-mono text-xs font-bold text-sky-700 shadow-sm dark:bg-slate-800 dark:text-sky-300">{number}</span>
                    <span><span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span><span className="text-xs text-slate-500">{caption}</span></span>
                    <CheckCircle2 className="ml-auto size-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Made for focused learning</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Everything you need around each pattern</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-glow dark:border-slate-800">
              <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"><Icon className="size-5" /></span>
              <h3 className="mt-4 font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/25">
        <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Featured lessons</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Start with a high-leverage topic</h2></div>
            <Button variant="outline" asChild><Link href="/docs/time-complexity">Browse all documentation <ArrowRight className="ml-2 size-4" /></Link></Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((doc, index) => (
              <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-glow dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800">
                <span className="absolute right-4 top-4 font-mono text-xs font-bold text-slate-300 dark:text-slate-700">{String(index + 1).padStart(2, "0")}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">{doc.category}</span>
                <h3 className="mt-5 flex items-center gap-2 text-lg font-semibold text-slate-950 group-hover:text-sky-700 dark:text-slate-50 dark:group-hover:text-sky-300">{doc.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{doc.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{doc.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">{tag}</span>)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><div className="flex items-center gap-2 text-sky-300"><Network className="size-4" /> Structured progression</div><h2 className="mt-3 text-3xl font-bold tracking-tight">Follow a roadmap, not random tabs.</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Move from foundations to advanced patterns with a sequence that mirrors how real interview problems compound.</p></div>
            <Link href="/roadmap" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "self-start bg-white text-slate-950 hover:bg-slate-100")}>Open roadmap <ArrowRight className="ml-2 size-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
