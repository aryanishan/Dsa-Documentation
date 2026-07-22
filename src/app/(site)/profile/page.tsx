"use client";

import { Camera, Globe2, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { AccountShell, useBrowserSession } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccountSession, updateAccountProfile } from "@/lib/user-session";

export default function ProfilePage() {
  const { session, hydrated } = useBrowserSession();
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const s = getAccountSession();
    if (s) {
      setName(s.user.name);
      setFocus(s.user.focus);
      setTimezone(s.user.timezone);
    }
  }, [hydrated]);

  function saveProfile() {
    updateAccountProfile({ name: name.trim() || "Learner", focus, timezone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AccountShell active="profile">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-7 sm:py-10 lg:px-10">
        <header>
          <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Your profile</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-slate-50">
            Make your workspace personal.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Update your name, learning focus, and preferences below.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl font-bold text-white">
              {hydrated && session ? session.user.name.slice(0, 1).toUpperCase() : "A"}
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{hydrated && session ? session.user.name : "Your profile"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{hydrated && session ? session.user.email : "learner@algonotes.local"}</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Display name</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <Sparkles className="size-4 text-sky-500" /> Learning focus
              </span>
              <Input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Build reliable problem-solving patterns" />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <Globe2 className="size-4 text-sky-500" /> Timezone
              </span>
              <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="America/New_York" />
            </label>

            <Button onClick={saveProfile} className="gap-2">
              <Save className="size-4" /> {saved ? "Saved!" : "Save changes"}
            </Button>
          </div>
        </section>

        <section id="preferences" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Preferences</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Theme and editor preferences are stored in your browser and sync automatically.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-950/50 dark:text-slate-400">
            Use the theme toggle in the header to switch between light and dark modes. Editor preferences are saved per-session in the playground.
          </div>
        </section>
      </div>
    </AccountShell>
  );
}
