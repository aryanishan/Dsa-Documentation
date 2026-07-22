import type { Metadata } from "next";

import { SearchPageClient } from "@/components/search/search-page-client";
import { getSearchIndex } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across all AlgoNotes topics, algorithms, code examples, and headings.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  const documents = getSearchIndex();
  return <SearchPageClient documents={documents} />;
}
