"use client";

import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Code2,
  Eye,
  EyeOff,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  TerminalSquare,
  TimerReset,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { type PracticeProblem, type PracticeLanguage } from "@/components/problems/problem-data";
import { isProblemBookmarked, isProblemSolved, markProblemSolved, recordProblemActivity, toggleProblemBookmark } from "@/lib/user-session";
import { ApiError, api } from "@/lib/api";
import { cn } from "@/lib/utils";

type Verdict = "idle" | "running" | "accepted" | "wrong_answer" | "error";

const languageKeys: PracticeLanguage[] = ["JavaScript", "Python", "C++", "Java"];

const monacoLanguageMap: Record<PracticeLanguage, string> = {
  JavaScript: "javascript",
  Python: "python",
  "C++": "cpp",
  Java: "java",
};

const languageApiMap: Record<PracticeLanguage, string> = {
  JavaScript: "javascript",
  Python: "python",
  "C++": "cpp",
  Java: "java",
};

const difficultyStyles = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export function ProblemWorkspace({ problem }: { problem: PracticeProblem }) {
  const [language, setLanguage] = useState<PracticeLanguage>("JavaScript");
  const [code, setCode] = useState(problem.starterCode.JavaScript);
  const [input, setInput] = useState(problem.examples[0]?.input.split(",").pop()?.trim() ?? "");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState<Verdict>("idle");
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [memory, setMemory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">("description");

  useEffect(() => {
    setBookmarked(isProblemBookmarked(problem.slug));
    setSolved(isProblemSolved(problem.slug));
    recordProblemActivity({ slug: problem.slug, title: problem.title, action: "opened" });
  }, [problem.slug, problem.title]);

  function switchLanguage(next: PracticeLanguage) {
    setLanguage(next);
    setCode(problem.starterCode[next]);
  }

  async function runCode() {
    if (!code.trim()) {
      setVerdict("error");
      setOutput("Write some code before running.");
      return;
    }
    setVerdict("running");
    setOutput("Compiling and running…");
    try {
      const result = await api.code.execute({
        language: languageApiMap[language],
        sourceCode: code,
        stdin: input,
      });
      const out = result.compileOutput || result.stderr || result.stdout || `Finished: ${result.status.description}`;
      const failed = result.status.id !== 3 || Boolean(result.compileOutput || result.stderr);
      setVerdict(failed ? "error" : "accepted");
      setOutput(out);
      setExecutionTime(result.time ? `${result.time} s` : null);
      setMemory(result.memory !== null ? `${result.memory} KB` : null);
    } catch (err) {
      setVerdict("error");
      setOutput(err instanceof ApiError ? err.message : "Could not reach the execution service.");
    }
  }

  function handleBookmark() {
    const next = toggleProblemBookmark({ slug: problem.slug, title: problem.title, difficulty: problem.difficulty, tags: problem.tags });
    setBookmarked(next);
  }

  function handleMarkSolved() {
    markProblemSolved({ slug: problem.slug, title: problem.title });
    setSolved(true);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  return (
    <div className="mx-auto max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/problems" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="size-4" /> All problems
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Left panel — description */}
        <div className="min-w-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400">#{problem.number}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", difficultyStyles[problem.difficulty])}>
                    {problem.difficulty}
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  {problem.title}
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleBookmark} title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                  {bookmarked ? <BookmarkCheck className="size-4 text-amber-500" /> : <Bookmark className="size-4" />}
                </Button>
                {!solved ? (
                  <Button variant="ghost" size="sm" onClick={handleMarkSolved} className="gap-1.5 text-emerald-600">
                    <CheckCircle2 className="size-4" /> Mark solved
                  </Button>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="size-3.5" /> Solved
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {tag}
                </span>
              ))}
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {problem.timeLimit} · {problem.memoryLimit}
              </span>
            </div>
          </div>

          <div className="space-y-6 p-5">
            <div>
              <p className="leading-7 text-slate-700 dark:text-slate-300">{problem.description}</p>
            </div>

            {problem.constraints.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">Constraints</h3>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-slate-400" />
                      <code className="text-xs">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-xs font-semibold text-slate-500">Example {i + 1}</p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <p><span className="font-semibold text-slate-700 dark:text-slate-200">Input:</span> <span className="text-slate-600 dark:text-slate-400">{ex.input}</span></p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-200">Output:</span> <span className="text-slate-600 dark:text-slate-400">{ex.output}</span></p>
                </div>
                {ex.explanation && <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{ex.explanation}</p>}
              </div>
            ))}

            {problem.hints.length > 0 && (
              <div>
                <button
                  onClick={() => setHintsShown((prev) => Math.min(prev + 1, problem.hints.length))}
                  className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400"
                >
                  <Lightbulb className="size-4" />
                  {hintsShown === 0 ? "Show a hint" : hintsShown < problem.hints.length ? "Show next hint" : "All hints revealed"}
                </button>
                {hintsShown > 0 && (
                  <div className="mt-3 space-y-2">
                    {problem.hints.slice(0, hintsShown).map((hint, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200">
                        <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-sky-500" />
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — editor */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="relative">
              <select
                aria-label="Language"
                value={language}
                onChange={(e) => switchLanguage(e.target.value as PracticeLanguage)}
                className="h-8 appearance-none rounded-md border border-slate-200 bg-white py-1 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {languageKeys.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2 size-4 text-slate-400" />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={copyCode} title="Copy code" className="size-8">
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Clipboard className="size-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCode(problem.starterCode[language])} title="Reset code" className="size-8">
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="min(48vh, 28rem)"
              language={monacoLanguageMap[language]}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                automaticLayout: true,
                fontSize: 14,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                lineNumbers: "on",
                minimap: { enabled: false },
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800">
            <div className="p-4">
              <label htmlFor="problem-input" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <TerminalSquare className="size-4 text-sky-500" /> Custom input
              </label>
              <textarea
                id="problem-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                className="mt-2 h-20 w-full resize-y rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs leading-5 text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Provide standard input…"
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={runCode} disabled={verdict === "running"} className="flex-1">
                  <Play className="mr-2 size-4 fill-current" />
                  {verdict === "running" ? "Running…" : "Run code"}
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Console</h2>
                {verdict !== "idle" && (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    verdict === "accepted" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
                    verdict === "running" && "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
                    verdict === "error" && "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
                    verdict === "wrong_answer" && "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
                  )}>
                    {verdict === "accepted" ? "Accepted" : verdict === "running" ? "Running" : verdict === "wrong_answer" ? "Wrong Answer" : "Error"}
                  </span>
                )}
              </div>
              <pre className={cn(
                "mt-3 min-h-20 overflow-auto rounded-xl border p-3 font-mono text-xs leading-6",
                verdict === "error" || verdict === "wrong_answer"
                  ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/25 dark:text-rose-200"
                  : "border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800",
              )}>
                {output || "Run your code to see output here."}
              </pre>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">
                  <TimerReset className="size-3.5" /> {executionTime ?? "—"}
                </span>
                <span className="rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">
                  Memory {memory ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
