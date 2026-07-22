export const siteConfig = {
  name: "AlgoNotes",
  description:
    "A focused, visual documentation platform for learning data structures and algorithms.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://algonotes.vercel.app",
} as const;

export const categoryLabels: Record<string, string> = {
  Foundations: "Foundations",
  "Linear Data Structures": "Linear data structures",
  "Tree Data Structures": "Tree data structures",
  "Graph & Algorithmic Techniques": "Graph & algorithmic techniques",
  "Advanced Data Structures": "Advanced data structures",
};

export const roadmapStages = [
  {
    title: "Beginner",
    description: "Build intuition for linear structures and the operations that power them.",
    slugs: ["arrays", "strings", "linked-lists", "stack", "queue"],
    tone: "sky",
  },
  {
    title: "Intermediate",
    description: "Learn hierarchical data, ordering, lookup, and traversal patterns.",
    slugs: ["trees", "binary-search-trees", "heap", "hashing", "graphs"],
    tone: "violet",
  },
  {
    title: "Advanced",
    description: "Solve optimization and range-query problems with reusable techniques.",
    slugs: [
      "dynamic-programming",
      "greedy-algorithms",
      "segment-trees",
      "disjoint-set-union",
      "tries",
    ],
    tone: "amber",
  },
] as const;
