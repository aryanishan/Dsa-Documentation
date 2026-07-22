export const siteConfig = {
  name: "AlgoNotes",
  description:
    "A focused, visual documentation platform for learning data structures and algorithms.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://algonotes.vercel.app",
} as const;

export const categoryLabels: Record<string, string> = {
  Foundations: "Foundations",
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  "Data Structures": "Data structures",
  Algorithms: "Algorithms",
  "Linear Data Structures": "Linear data structures",
  "Tree Data Structures": "Tree data structures",
  "Graph & Algorithmic Techniques": "Graph & algorithmic techniques",
  "Advanced Data Structures": "Advanced data structures",
};

export const roadmapStages = [
  {
    title: "Beginner",
    description: "Build intuition for linear structures and the operations that power them.",
    slugs: ["time-complexity", "space-complexity", "mathematics", "arrays", "strings", "linked-lists", "stack", "queue", "deque"],
    tone: "sky",
  },
  {
    title: "Intermediate",
    description: "Learn hierarchical data, ordering, lookup, and traversal patterns.",
    slugs: ["recursion", "binary-search", "trees", "binary-search-trees", "heap", "hashing", "graphs"],
    tone: "violet",
  },
  {
    title: "Advanced",
    description: "Solve optimization and range-query problems with reusable techniques.",
    slugs: [
      "dynamic-programming",
      "greedy-algorithms",
      "segment-trees",
      "fenwick-tree",
      "disjoint-set-union",
      "tries",
    ],
    tone: "amber",
  },
] as const;
