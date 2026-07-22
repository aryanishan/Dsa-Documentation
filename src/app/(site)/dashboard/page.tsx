import type { Metadata } from "next";

import { DashboardClient } from "@/components/account/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track your learning progress, solved problems, and bookmarks.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
