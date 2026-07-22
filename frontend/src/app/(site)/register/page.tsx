import type { Metadata } from "next";

import { AuthForm } from "@/components/account/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an AlgoNotes account to save your problem queue and learning progress.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
