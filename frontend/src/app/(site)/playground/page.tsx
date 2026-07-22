import type { Metadata } from "next";

import { PlaygroundWorkspace } from "@/components/playground/playground-workspace";

export const metadata: Metadata = {
  title: "Code playground",
  description: "Write, test, and save algorithm experiments in the AlgoNotes code playground.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return <PlaygroundWorkspace />;
}
