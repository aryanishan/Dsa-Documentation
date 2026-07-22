import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Built for deliberate practice, quick revision, and better interviews.</p>
        <div className="flex gap-4">
          <Link href="/docs/time-complexity" className="hover:text-sky-600 dark:hover:text-sky-400">Start learning</Link>
          <Link href="/roadmap" className="hover:text-sky-600 dark:hover:text-sky-400">Roadmap</Link>
        </div>
      </div>
    </footer>
  );
}
