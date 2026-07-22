import type { Metadata } from "next";

import { ProblemsClient } from "@/components/problems/problems-client";

export const metadata: Metadata = {
  title: "Practice problems",
  description: "Sharpen your DSA skills with curated practice problems ranging from easy to hard.",
  alternates: { canonical: "/problems" },
};

export default function ProblemsPage() {
  return <ProblemsClient />;
}
