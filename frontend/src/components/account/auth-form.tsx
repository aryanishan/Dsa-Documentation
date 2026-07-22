"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import { createLocalSession, getAccountSession, normaliseAccountUser, saveAccountSession } from "@/lib/user-session";

const authSchema = z.object({
  name: z.string().trim().max(80, "Use 80 characters or fewer.").optional(),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type AuthValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isRegister = mode === "register";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    setIsReady(true);
    if (getAccountSession()) router.replace("/dashboard");
  }, [router]);

  async function submit(values: AuthValues) {
    setFormMessage(null);

    if (isRegister && !values.name?.trim()) {
      setError("name", { message: "Tell us what to call you." });
      return;
    }

    try {
      const response = isRegister
        ? await api.auth.signUp({ name: values.name?.trim() || "Learner", email: values.email, password: values.password })
        : await api.auth.signIn({ email: values.email, password: values.password });
      const user = normaliseAccountUser(response.user, { name: values.name?.trim() || values.email.split("@")[0], email: values.email });
      saveAccountSession({ token: response.token, user, mode: "remote", createdAt: new Date().toISOString() });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        setFormMessage(error.message);
        return;
      }

      // A browser session keeps the learning workspace useful when the optional API is not running locally.
      const session = createLocalSession({ name: values.name, email: values.email });
      saveAccountSession(session);
      router.replace("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-8.75rem)] bg-slate-50 dark:bg-slate-950 lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,.95fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,.25),transparent_28%),radial-gradient(circle_at_76%_70%,rgba(99,102,241,.3),transparent_33%)]" />
        <Link href="/" className="relative inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"><span className="grid size-8 place-items-center rounded-lg bg-white/10"><KeyRound className="size-4" /></span> AlgoNotes</Link>
        <div className="relative max-w-lg">
          <p className="text-sm font-semibold text-sky-300">A focused practice space</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em]">Turn every lesson into a repeatable instinct.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Save the problems that matter, see your progress, and keep the next concept within reach.</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {["Track solved patterns", "Keep a personal queue", "Return to recent work", "Use any device-ready API"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-slate-200"><ShieldCheck className="size-4 shrink-0 text-sky-300" /> {item}</div>
            ))}
          </div>
        </div>
        <p className="relative text-xs leading-5 text-slate-400">Your password is only sent to the configured authentication service. When that service is unavailable during local development, AlgoNotes starts a browser-only learning session instead.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 lg:hidden dark:text-slate-100"><span className="grid size-8 place-items-center rounded-lg bg-sky-600 text-white"><KeyRound className="size-4" /></span> AlgoNotes</Link>
          <div>
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">{isRegister ? "Start your practice space" : "Welcome back"}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-slate-50">{isRegister ? "Make learning feel organised." : "Pick up where you left off."}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{isRegister ? "Create an account to save your problem queue and learning progress." : "Sign in to continue your AlgoNotes learning path."}</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)} noValidate>
            {isRegister ? (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><UserRound className="size-4 text-slate-400" /> Name</span>
                <Input autoComplete="name" placeholder="Ada Lovelace" aria-invalid={Boolean(errors.name)} {...register("name")} />
                {errors.name ? <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.name.message}</span> : null}
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><Mail className="size-4 text-slate-400" /> Email</span>
              <Input autoComplete="email" inputMode="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
              {errors.email ? <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><KeyRound className="size-4 text-slate-400" /> Password</span>
              <span className="relative block"><Input type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="At least 8 characters" className="pr-11" aria-invalid={Boolean(errors.password)} {...register("password")} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span>
              {errors.password ? <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.password.message}</span> : null}
            </label>

            {formMessage ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300">{formMessage}</p> : null}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !isReady}>{isSubmitting ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : null}{isSubmitting ? "Connecting…" : isRegister ? "Create account" : "Sign in"}<ArrowRight className="ml-2 size-4" /></Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">{isRegister ? "Already have an account?" : "New to AlgoNotes?"} <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400">{isRegister ? "Sign in" : "Create an account"}</Link></p>
          <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-slate-500">By continuing, you agree to use this learning workspace responsibly. <Link href="/about" className="underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300">Learn how AlgoNotes works</Link>.</p>
        </div>
      </section>
    </div>
  );
}
