import { hash } from "bcryptjs";

import { Difficulty, Language, PrismaClient, UserRole } from "../generated/client";

const prisma = new PrismaClient();

type TopicSeed = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  headings: Array<{ id: string; text: string; level: 2 | 3 }>;
  estimatedMinutes: number;
  sortOrder: number;
  codeExamples: Array<{ language: Language; title: string; code: string; explanation: string }>;
};

type ProblemSeed = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  statement: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
  hints: string[];
  starterCode: Record<string, string>;
  tags: string[];
  timeLimitMs: number;
  memoryLimitKb: number;
  testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean }>;
};

const topics: TopicSeed[] = [
  {
    slug: "arrays",
    title: "Arrays",
    summary: "A contiguous collection with constant-time index access and a foundation for two pointers, windows, and prefix sums.",
    content: "# Arrays\n\nArrays store equal-sized values in contiguous memory. This layout makes index access constant time and makes middle insertion expensive because later values must shift.",
    category: "Data Structures",
    difficulty: Difficulty.EASY,
    tags: ["array", "two-pointers", "prefix-sum", "sliding-window"],
    headings: [
      { id: "definition", text: "Definition", level: 2 },
      { id: "complexity", text: "Complexity", level: 2 },
      { id: "patterns", text: "Core patterns", level: 2 },
    ],
    estimatedMinutes: 20,
    sortOrder: 1,
    codeExamples: [
      {
        language: Language.PYTHON,
        title: "Two Sum with a hash map",
        code: "def two_sum(values, target):\n    seen = {}\n    for index, value in enumerate(values):\n        if target - value in seen:\n            return [seen[target - value], index]\n        seen[value] = index\n    return []\n",
        explanation: "Store each previous value's index so the complement lookup is constant time.",
      },
      {
        language: Language.JAVASCRIPT,
        title: "Prefix sum range query",
        code: "function rangeSum(values, left, right) {\n  const prefix = [0];\n  for (const value of values) prefix.push(prefix.at(-1) + value);\n  return prefix[right + 1] - prefix[left];\n}\n",
        explanation: "A leading zero makes inclusive range sums a single subtraction.",
      },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    summary: "Use a monotonic decision to discard half of a sorted search space on every iteration.",
    content: "# Binary Search\n\nBinary search maintains an interval that contains every possible answer. Compare at its midpoint, then discard the half that cannot contain the target.",
    category: "Algorithms",
    difficulty: Difficulty.MEDIUM,
    tags: ["binary-search", "divide-and-conquer", "monotonic"],
    headings: [
      { id: "invariant", text: "The interval invariant", level: 2 },
      { id: "boundaries", text: "Finding boundaries", level: 2 },
      { id: "answer-search", text: "Binary search on the answer", level: 2 },
    ],
    estimatedMinutes: 18,
    sortOrder: 2,
    codeExamples: [
      {
        language: Language.CPP,
        title: "Inclusive binary search",
        code: "int binarySearch(const vector<int>& values, int target) {\n  int left = 0, right = static_cast<int>(values.size()) - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (values[mid] == target) return mid;\n    if (values[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n",
        explanation: "The calculation of mid avoids overflow in fixed-width integer types.",
      },
    ],
  },
  {
    slug: "graphs",
    title: "Graphs",
    summary: "Model relationships with vertices and edges, then traverse, optimize, or detect structure with reusable graph algorithms.",
    content: "# Graphs\n\nGraphs model connections between entities. Adjacency lists are usually the right representation for sparse graphs, and BFS/DFS are the starting traversals.",
    category: "Algorithms",
    difficulty: Difficulty.MEDIUM,
    tags: ["graph", "bfs", "dfs", "shortest-path"],
    headings: [
      { id: "representation", text: "Representation", level: 2 },
      { id: "traversal", text: "Traversal", level: 2 },
      { id: "shortest-paths", text: "Shortest paths", level: 2 },
    ],
    estimatedMinutes: 24,
    sortOrder: 3,
    codeExamples: [
      {
        language: Language.JAVA,
        title: "Breadth-first traversal",
        code: "static int[] distances(List<List<Integer>> graph, int start) {\n    int[] distance = new int[graph.size()];\n    Arrays.fill(distance, -1);\n    ArrayDeque<Integer> queue = new ArrayDeque<>();\n    queue.add(start);\n    distance[start] = 0;\n    while (!queue.isEmpty()) {\n        int node = queue.remove();\n        for (int next : graph.get(node)) if (distance[next] == -1) {\n            distance[next] = distance[node] + 1;\n            queue.add(next);\n        }\n    }\n    return distance;\n}\n",
        explanation: "BFS visits each unweighted edge at the earliest possible distance from the source.",
      },
    ],
  },
];

const problems: ProblemSeed[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: Difficulty.EASY,
    statement: "Given an integer array and a target, return the indices of two distinct values whose sum equals the target. Exactly one answer exists.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i], target <= 10^9",
    examples: [{ input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "2 + 7 equals 9." }],
    hints: ["Ask which complement would complete each value.", "Store previously seen values in a hash map."],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // return the two indices\n}\n",
      python: "def two_sum(nums: list[int], target: int) -> list[int]:\n    # return the two indices\n    pass\n",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n  // return the two indices\n}\n",
    },
    tags: ["Array", "Hash Table"],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    testCases: [
      { input: "2 7 11 15\n9\n", expectedOutput: "0 1\n", isHidden: false },
      { input: "3 2 4\n6\n", expectedOutput: "1 2\n", isHidden: true },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: Difficulty.EASY,
    statement: "Return whether each opening bracket in a string is closed by a matching bracket in the correct order.",
    constraints: "1 <= s.length <= 10^4\ns contains only ()[]{} characters.",
    examples: [{ input: "()[]{}", output: "true", explanation: "Every opening delimiter has the correct later match." }],
    hints: ["The most recent opening bracket must close first.", "Use a stack."],
    starterCode: {
      javascript: "function isValid(s) {\n  // return true or false\n}\n",
      python: "def is_valid(s: str) -> bool:\n    # return true or false\n    pass\n",
    },
    tags: ["String", "Stack"],
    timeLimitMs: 1000,
    memoryLimitKb: 131072,
    testCases: [
      { input: "()[]{}\n", expectedOutput: "true\n", isHidden: false },
      { input: "(]\n", expectedOutput: "false\n", isHidden: true },
    ],
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: Difficulty.MEDIUM,
    statement: "Count connected components of land in a grid where horizontal and vertical neighbors belong to the same island.",
    constraints: "1 <= rows, columns <= 300\nEach cell is 0 or 1.",
    examples: [{ input: "11000\n11000\n00100\n00011", output: "3", explanation: "Flood-fill each unvisited land component once." }],
    hints: ["Each unvisited land cell begins a new component.", "Mark all cells in that component before continuing."],
    starterCode: {
      javascript: "function numIslands(grid) {\n  // return the component count\n}\n",
      python: "def num_islands(grid: list[list[str]]) -> int:\n    # return the component count\n    pass\n",
    },
    tags: ["Graph", "Depth-First Search", "Breadth-First Search"],
    timeLimitMs: 2000,
    memoryLimitKb: 262144,
    testCases: [
      { input: "11000\n11000\n00100\n00011\n", expectedOutput: "3\n", isHidden: false },
      { input: "111\n111\n111\n", expectedOutput: "1\n", isHidden: true },
    ],
  },
];

async function seedTopics() {
  for (const topic of topics) {
    const saved = await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: {
        ...topic,
        isPublished: true,
        codeExamples: { create: topic.codeExamples },
      },
      update: {
        title: topic.title,
        summary: topic.summary,
        content: topic.content,
        category: topic.category,
        difficulty: topic.difficulty,
        tags: topic.tags,
        headings: topic.headings,
        estimatedMinutes: topic.estimatedMinutes,
        sortOrder: topic.sortOrder,
        isPublished: true,
      },
    });

    await prisma.codeExample.deleteMany({ where: { topicId: saved.id } });
    await prisma.codeExample.createMany({ data: topic.codeExamples.map((example) => ({ ...example, topicId: saved.id })) });
  }
}

async function seedProblems() {
  for (const problem of problems) {
    const saved = await prisma.problem.upsert({
      where: { slug: problem.slug },
      create: {
        ...problem,
        isPublished: true,
        testCases: { create: problem.testCases },
      },
      update: {
        title: problem.title,
        difficulty: problem.difficulty,
        statement: problem.statement,
        constraints: problem.constraints,
        examples: problem.examples,
        hints: problem.hints,
        starterCode: problem.starterCode,
        tags: problem.tags,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitKb: problem.memoryLimitKb,
        isPublished: true,
      },
    });

    await prisma.problemTestCase.deleteMany({ where: { problemId: saved.id } });
    await prisma.problemTestCase.createMany({ data: problem.testCases.map((testCase) => ({ ...testCase, problemId: saved.id })) });
  }
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() || "admin@algonotes.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMeBeforeProduction1!";
  const admin = await prisma.user.upsert({
    where: { email },
    create: {
      name: "AlgoNotes Admin",
      email,
      passwordHash: await hash(password, 12),
      role: UserRole.ADMIN,
    },
    update: { name: "AlgoNotes Admin", role: UserRole.ADMIN },
  });
  await prisma.userSettings.upsert({
    where: { userId: admin.id },
    create: { userId: admin.id },
    update: {},
  });
}

async function main() {
  await seedTopics();
  await seedProblems();
  await seedAdmin();
  console.info(`Seeded ${topics.length} topics, ${problems.length} problems, and an administrator account.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
