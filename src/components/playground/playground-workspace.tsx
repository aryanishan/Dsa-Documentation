"use client";

import Editor from "@monaco-editor/react";
import {
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  Download,
  FileCode2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Settings2,
  TerminalSquare,
  TimerReset,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { cn } from "@/lib/utils";

type PlaygroundLanguage = {
  id: string;
  label: string;
  monacoLanguage: string;
  extension: string;
  starterCode: string;
};

type RunState = {
  kind: "idle" | "running" | "success" | "error";
  output: string;
  executionTime?: string;
  memory?: string;
};

const languages: PlaygroundLanguage[] = [
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    extension: "js",
    starterCode: `// Read whitespace-separated integers and print their sum.
const fs = require("fs");

const values = fs.readFileSync(0, "utf8")
  .trim()
  .split(/\\s+/)
  .filter(Boolean)
  .map(Number);

const total = values.reduce((sum, value) => sum + value, 0);
console.log(total);`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    monacoLanguage: "typescript",
    extension: "ts",
    starterCode: `// Read whitespace-separated integers and print their sum.
import * as fs from "fs";

const values: number[] = fs.readFileSync(0, "utf8")
  .trim()
  .split(/\\s+/)
  .filter(Boolean)
  .map(Number);

const total = values.reduce((sum, value) => sum + value, 0);
console.log(total);`,
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    extension: "py",
    starterCode: `# Read whitespace-separated integers and print their sum.
values = list(map(int, input().split()))
print(sum(values))`,
  },
  {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    extension: "cpp",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    long long value, total = 0;
    while (cin >> value) total += value;
    cout << total << "\\n";
    return 0;
}`,
  },
  {
    id: "c",
    label: "C",
    monacoLanguage: "c",
    extension: "c",
    starterCode: `#include <stdio.h>

int main(void) {
    long long value, total = 0;
    while (scanf("%lld", &value) == 1) total += value;
    printf("%lld\\n", total);
    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    extension: "java",
    starterCode: `import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long total = 0;
        while (scanner.hasNextLong()) total += scanner.nextLong();
        System.out.println(total);
    }
}`,
  },
  {
    id: "go",
    label: "Go",
    monacoLanguage: "go",
    extension: "go",
    starterCode: `package main

import "fmt"

func main() {
    total := 0
    var value int
    for {
        _, error := fmt.Scan(&value)
        if error != nil { break }
        total += value
    }
    fmt.Println(total)
}`,
  },
  {
    id: "rust",
    label: "Rust",
    monacoLanguage: "rust",
    extension: "rs",
    starterCode: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let total: i64 = input.split_whitespace()
        .map(|value| value.parse::<i64>().unwrap())
        .sum();
    println!("{}", total);
}`,
  },
  {
    id: "csharp",
    label: "C#",
    monacoLanguage: "csharp",
    extension: "cs",
    starterCode: `using System;
using System.Linq;

public class Program {
    public static void Main() {
        var input = Console.In.ReadToEnd();
        var total = input.Split((char[])null!, StringSplitOptions.RemoveEmptyEntries)
            .Select(long.Parse)
            .Sum();
        Console.WriteLine(total);
    }
}`,
  },
];

const storageKey = "algonotes.playground.v1";

export function PlaygroundWorkspace() {
  const [languageId, setLanguageId] = useState("javascript");
  const [code, setCode] = useState(languages[0].starterCode);
  const [input, setInput] = useState("4 8 15 16 23 42");
  const [runState, setRunState] = useState<RunState>({ kind: "idle", output: "Run your program to see its output here." });
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const language = useMemo(
    () => languages.find((item) => item.id === languageId) ?? languages[0],
    [languageId],
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const saved = JSON.parse(stored) as { languageId?: string; code?: string; input?: string; fontSize?: number; minimap?: boolean };
      if (saved.languageId && languages.some((item) => item.id === saved.languageId)) setLanguageId(saved.languageId);
      if (typeof saved.code === "string") setCode(saved.code);
      if (typeof saved.input === "string") setInput(saved.input);
      if (typeof saved.fontSize === "number") setFontSize(saved.fontSize);
      if (typeof saved.minimap === "boolean") setMinimap(saved.minimap);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ languageId, code, input, fontSize, minimap }));
  }, [code, fontSize, hydrated, input, languageId, minimap]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  function switchLanguage(nextLanguageId: string) {
    const nextLanguage = languages.find((item) => item.id === nextLanguageId) ?? languages[0];
    setLanguageId(nextLanguage.id);
    setCode(nextLanguage.starterCode);
    setRunState({ kind: "idle", output: "Language changed. Run your program when you are ready." });
  }

  async function runCode() {
    if (!code.trim()) {
      setRunState({ kind: "error", output: "Add some code before running the program." });
      return;
    }

    setRunState({ kind: "running", output: "Compiling and running…" });

    try {
      const remote = await api.code.execute({ language: language.id, sourceCode: code, stdin: input });
      const output = remote.compileOutput || remote.stderr || remote.stdout || `Execution finished: ${remote.status.description}.`;
      const failed = remote.status.id !== 3 || Boolean(remote.compileOutput || remote.stderr);
      setRunState({
        kind: failed ? "error" : "success",
        output,
        executionTime: remote.time ? `${remote.time} s` : undefined,
        memory: remote.memory === null ? undefined : `${remote.memory} KB`,
      });
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : "The execution service could not be reached. Start the backend and configure NEXT_PUBLIC_API_URL.";
      setRunState({ kind: "error", output: message });
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setRunState({ kind: "error", output: "Could not access the clipboard. Select the code and copy it manually." });
    }
  }

  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solution.${language.extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await workspaceRef.current?.requestFullscreen();
  }

  return (
    <div ref={workspaceRef} className={cn("bg-slate-50 dark:bg-slate-950", isFullscreen && "h-full overflow-y-auto p-3 sm:p-5")}>
      <div className={cn("mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-8", isFullscreen && "max-w-none px-0 py-0")}>
        {!isFullscreen ? (
          <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Code playground</p>
              <h1 className="mt-1 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-slate-50">Experiment without leaving your flow.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Write, format, test, and keep your snippets locally saved while the execution API is connected.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><span className="size-2 rounded-full bg-emerald-500" /> Autosave on</div>
          </header>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30" aria-label="Code playground workspace">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/70 sm:px-4">
            <div className="relative">
              <select
                aria-label="Programming language"
                value={language.id}
                onChange={(event) => switchLanguage(event.target.value)}
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {languages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-slate-400" />
            </div>
            <span className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-500 sm:inline-flex dark:border-slate-700 dark:bg-slate-900"><FileCode2 className="size-3.5" /> solution.{language.extension}</span>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={copyCode} aria-label="Copy code" title="Copy code"><>{copied ? <Check className="size-4 text-emerald-500" /> : <Clipboard className="size-4" />}</></Button>
              <Button variant="ghost" size="icon" onClick={downloadCode} aria-label="Download code" title="Download code"><Download className="size-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setCode(language.starterCode)} aria-label="Reset code" title="Reset code"><RotateCcw className="size-4" /></Button>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setSettingsOpen((current) => !current)} aria-label="Editor settings" aria-expanded={settingsOpen} title="Editor settings"><Settings2 className="size-4" /></Button>
                {settingsOpen ? (
                  <div className="absolute right-0 top-11 z-20 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-3 text-sm"><label htmlFor="font-size" className="font-medium text-slate-700 dark:text-slate-200">Font size</label><select id="font-size" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950">{[12, 13, 14, 15, 16, 18].map((size) => <option key={size} value={size}>{size}px</option>)}</select></div>
                    <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200"><span>Minimap</span><input type="checkbox" checked={minimap} onChange={(event) => setMinimap(event.target.checked)} className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" /></label>
                    <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200"><span>Light editor</span><input type="checkbox" checked={editorTheme === "light"} onChange={(event) => setEditorTheme(event.target.checked ? "light" : "vs-dark")} className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" /></label>
                  </div>
                ) : null}
              </div>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Open fullscreen"} title={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}>{isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}</Button>
            </div>
          </div>

          <div className="grid xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0 border-b border-slate-200 dark:border-slate-800 xl:border-b-0 xl:border-r">
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 dark:border-slate-800"><Code2 className="size-3.5 text-sky-500" /> Editor <span className="ml-auto font-normal">{code.split("\n").length} lines</span></div>
              <Editor
                height={isFullscreen ? "calc(100vh - 13.5rem)" : "min(62vh, 41rem)"}
                language={language.monacoLanguage}
                theme={editorTheme}
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{
                  automaticLayout: true,
                  fontSize,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  lineNumbers: "on",
                  minimap: { enabled: minimap },
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
              />
            </div>

            <aside className="grid min-w-0 grid-rows-[auto_1fr] bg-slate-50/70 dark:bg-slate-950/35 xl:min-h-[42rem]">
              <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                <label htmlFor="custom-input" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100"><TerminalSquare className="size-4 text-sky-500" /> Custom input</label>
                <textarea id="custom-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="mt-3 h-28 w-full resize-y rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="Provide standard input…" />
                <Button className="mt-3 w-full" onClick={runCode} disabled={runState.kind === "running"}><Play className="mr-2 size-4 fill-current" />{runState.kind === "running" ? "Running…" : "Run code"}</Button>
              </div>

              <div className="min-h-0 p-4">
                <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Console</h2>{runState.kind !== "idle" ? <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", runState.kind === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300", runState.kind === "running" && "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300", runState.kind === "error" && "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300")}>{runState.kind === "success" ? "Finished" : runState.kind === "running" ? "Running" : "Error"}</span> : null}</div>
                <pre className={cn("mt-3 min-h-32 overflow-auto rounded-xl border p-3 font-mono text-xs leading-6", runState.kind === "error" ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/25 dark:text-rose-200" : "border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800")}>{runState.output}</pre>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400"><span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900"><TimerReset className="size-3.5" /> {runState.executionTime ?? "—"}</span><span className="rounded-md bg-white px-2 py-1 shadow-sm dark:bg-slate-900">Memory {runState.memory ?? "—"}</span></div>
                <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400"><WandSparkles className="mr-1 inline size-3.5 text-sky-500" /> Your workspace is saved in this browser. Execution is isolated by the backend Judge0 integration.</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
