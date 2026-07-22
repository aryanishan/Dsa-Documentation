import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div><p className="font-mono text-sm font-semibold text-sky-600 dark:text-sky-400">404</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">This page is out of bounds.</h1><p className="mt-3 text-slate-600 dark:text-slate-400">The lesson you were looking for does not exist or has moved.</p><Button asChild className="mt-6"><Link href="/">Back to AlgoNotes</Link></Button></div>
    </div>
  );
}
