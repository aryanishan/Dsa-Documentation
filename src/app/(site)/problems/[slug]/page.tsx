"use client";

import { notFound } from "next/navigation";
import { use } from "react";

import { ProblemWorkspace } from "@/components/problems/problem-workspace";
import { getPracticeProblem, practiceProblems } from "@/components/problems/problem-data";

type PageProps = { params: Promise<{ slug: string }> };

export default function ProblemDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const problem = getPracticeProblem(slug);
  if (!problem) notFound();
  return <ProblemWorkspace problem={problem} />;
}
