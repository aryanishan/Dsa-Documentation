"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Command, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SearchDocument } from "@/types/docs";

type SearchDialogProps = {
  documents: SearchDocument[];
  variant?: "nav" | "hero";
};

function scoreDocument(document: SearchDocument, query: string) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return 0;
  const terms = normalized.split(/\s+/).filter(Boolean);
  const title = document.title.toLowerCase();
  const description = document.description.toLowerCase();
  const tags = document.tags.join(" ").toLowerCase();
  const body = document.content.toLowerCase();

  return terms.reduce((score, term) => {
    if (!body.includes(term) && !title.includes(term) && !tags.includes(term)) return score - 1000;
    if (title === term) return score + 140;
    if (title.startsWith(term)) return score + 95;
    if (title.includes(term)) return score + 70;
    if (tags.includes(term)) return score + 45;
    if (description.includes(term)) return score + 25;
    return score + 10;
  }, 0);
}

export function SearchDialog({ documents, variant = "nav" }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
    else setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim();
    if (!normalized) return documents.slice(0, 7);
    return documents
      .map((document) => ({ document, score: scoreDocument(document, normalized) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
      .slice(0, 8)
      .map((result) => result.document);
  }, [deferredQuery, documents]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {variant === "hero" ? (
          <button
            type="button"
            className="group flex h-14 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-500 shadow-glow transition hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-sky-800"
          >
            <Search className="size-5 text-sky-600 dark:text-sky-400" />
            <span className="flex-1">Search arrays, BFS, dynamic programming, code…</span>
            <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 sm:inline-block dark:border-slate-800 dark:bg-slate-900">
              <Command className="mr-0.5 inline size-3" />K
            </kbd>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Search documentation"
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-500 transition hover:bg-white md:flex dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
          >
            <Search className="size-3.5" />
            <span className="flex-1">Search docs</span>
            <kbd className="rounded border border-slate-200 bg-white px-1 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-950">⌘K</kbd>
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none dark:border-slate-800 dark:bg-slate-950">
          <Dialog.Title className="sr-only">Search AlgoNotes documentation</Dialog.Title>
          <Dialog.Description className="sr-only">Search every lesson, code example, and complexity explanation.</Dialog.Description>
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
            <Search className="size-5 text-slate-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics, algorithms, complexities, or code"
              className="h-14 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close search">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="max-h-[min(60vh,33rem)] overflow-y-auto p-2" role="listbox" aria-label="Documentation results">
            <p className="px-3 pb-1 pt-2 text-xs font-medium text-slate-500">
              {query.trim() ? `${results.length} matching lesson${results.length === 1 ? "" : "s"}` : "Suggested lessons"}
            </p>
            {results.length ? (
              results.map((document) => (
                <Dialog.Close asChild key={document.slug}>
                  <Link
                    href={`/docs/${document.slug}`}
                    className="group flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-sky-50 focus:bg-sky-50 focus:outline-none dark:hover:bg-sky-950/40 dark:focus:bg-sky-950/40"
                  >
                    <span className="mt-0.5 rounded-md bg-slate-100 p-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      <FileText className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                        {document.title}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-900">{document.category}</span>
                      </span>
                      <span className="mt-1 block line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{document.description}</span>
                    </span>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </Dialog.Close>
              ))
            ) : (
              <div className="px-3 py-10 text-center text-sm text-slate-500">
                No lesson matches <span className="font-medium text-slate-700 dark:text-slate-300">“{query}”</span> yet.
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800">
            <span>Searches titles, explanations, and code snippets</span>
            <span className="ml-auto">Esc to close</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
