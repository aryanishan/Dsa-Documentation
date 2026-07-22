export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export type PracticeLanguage = "JavaScript" | "Python" | "C++" | "Java";

export type ProblemExample = {
  input: string;
  output: string;
  explanation: string;
};

export type PracticeProblem = {
  slug: string;
  number: number;
  title: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  acceptance: number;
  solved?: boolean;
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  hints: string[];
  starterCode: Record<PracticeLanguage, string>;
  timeLimit: string;
  memoryLimit: string;
};

const twoSumStarter: Record<PracticeLanguage, string> = {
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const positions = new Map();

  for (let index = 0; index < nums.length; index += 1) {
    const complement = target - nums[index];
    if (positions.has(complement)) return [positions.get(complement), index];
    positions.set(nums[index], index);
  }

  return [];
}`,
  Python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        positions = {}

        for index, number in enumerate(nums):
            complement = target - number
            if complement in positions:
                return [positions[complement], index]
            positions[number] = index

        return []`,
  "C++": `#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> positions;

        for (int index = 0; index < nums.size(); ++index) {
            const int complement = target - nums[index];
            if (positions.count(complement)) return {positions[complement], index};
            positions[nums[index]] = index;
        }

        return {};
    }
};`,
  Java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> positions = new HashMap<>();

        for (int index = 0; index < nums.length; index++) {
            int complement = target - nums[index];
            if (positions.containsKey(complement)) {
                return new int[] { positions.get(complement), index };
            }
            positions.put(nums[index], index);
        }

        return new int[0];
    }
}`,
};

const parenthesesStarter: Record<PracticeLanguage, string> = {
  JavaScript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const pairs = new Map([[")", "("], ["]", "["], ["}", "{"]]);
  const stack = [];

  for (const character of s) {
    if (pairs.has(character)) {
      if (stack.pop() !== pairs.get(character)) return false;
    } else {
      stack.push(character);
    }
  }

  return stack.length === 0;
}`,
  Python: `class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []

        for character in s:
            if character in pairs:
                if not stack or stack.pop() != pairs[character]:
                    return False
            else:
                stack.append(character)

        return not stack`,
  "C++": `#include <stack>
#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> stack;
        for (char character : s) {
            if (character == ')' || character == ']' || character == '}') {
                if (stack.empty()) return false;
                const char open = stack.top();
                stack.pop();
                if ((character == ')' && open != '(') ||
                    (character == ']' && open != '[') ||
                    (character == '}' && open != '{')) return false;
            } else {
                stack.push(character);
            }
        }
        return stack.empty();
    }
};`,
  Java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char character : s.toCharArray()) {
            if (character == ')' || character == ']' || character == '}') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((character == ')' && open != '(') ||
                    (character == ']' && open != '[') ||
                    (character == '}' && open != '{')) return false;
            } else {
                stack.push(character);
            }
        }
        return stack.isEmpty();
    }
}`,
};

const islandsStarter: Record<PracticeLanguage, string> = {
  JavaScript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  if (!grid.length) return 0;
  let islands = 0;

  const visit = (row, column) => {
    if (row < 0 || row >= grid.length || column < 0 || column >= grid[0].length) return;
    if (grid[row][column] !== "1") return;

    grid[row][column] = "0";
    visit(row + 1, column);
    visit(row - 1, column);
    visit(row, column + 1);
    visit(row, column - 1);
  };

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < grid[row].length; column += 1) {
      if (grid[row][column] === "1") {
        islands += 1;
        visit(row, column);
      }
    }
  }

  return islands;
}`,
  Python: `from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0

        def visit(row: int, column: int) -> None:
            if row < 0 or row == len(grid) or column < 0 or column == len(grid[0]):
                return
            if grid[row][column] != "1":
                return

            grid[row][column] = "0"
            visit(row + 1, column)
            visit(row - 1, column)
            visit(row, column + 1)
            visit(row, column - 1)

        islands = 0
        for row in range(len(grid)):
            for column in range(len(grid[0])):
                if grid[row][column] == "1":
                    islands += 1
                    visit(row, column)

        return islands`,
  "C++": `#include <vector>
using namespace std;

class Solution {
    void visit(vector<vector<char>>& grid, int row, int column) {
        if (row < 0 || row == grid.size() || column < 0 || column == grid[0].size()) return;
        if (grid[row][column] != '1') return;

        grid[row][column] = '0';
        visit(grid, row + 1, column);
        visit(grid, row - 1, column);
        visit(grid, row, column + 1);
        visit(grid, row, column - 1);
    }

public:
    int numIslands(vector<vector<char>>& grid) {
        int islands = 0;
        for (int row = 0; row < grid.size(); ++row) {
            for (int column = 0; column < grid[0].size(); ++column) {
                if (grid[row][column] == '1') {
                    ++islands;
                    visit(grid, row, column);
                }
            }
        }
        return islands;
    }
};`,
  Java: `class Solution {
    public int numIslands(char[][] grid) {
        int islands = 0;
        for (int row = 0; row < grid.length; row++) {
            for (int column = 0; column < grid[0].length; column++) {
                if (grid[row][column] == '1') {
                    islands++;
                    visit(grid, row, column);
                }
            }
        }
        return islands;
    }

    private void visit(char[][] grid, int row, int column) {
        if (row < 0 || row == grid.length || column < 0 || column == grid[0].length) return;
        if (grid[row][column] != '1') return;

        grid[row][column] = '0';
        visit(grid, row + 1, column);
        visit(grid, row - 1, column);
        visit(grid, row, column + 1);
        visit(grid, row, column - 1);
    }
}`,
};

export const practiceProblems: PracticeProblem[] = [
  {
    slug: "two-sum",
    number: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: 51.6,
    solved: true,
    description: "Given an array of integers and a target, return the indices of the two numbers whose sum equals the target. Each input has exactly one solution, and an element cannot be used twice.",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "−10⁹ ≤ nums[i] ≤ 10⁹", "−10⁹ ≤ target ≤ 10⁹", "Exactly one valid answer exists."],
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] equals 9, so return their indices." },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "The values at indices 1 and 2 add to the target." },
    ],
    hints: ["What value would complement the current number?", "Store each number's index as you traverse the array.", "A hash map turns a nested search into one linear pass."],
    starterCode: twoSumStarter,
    timeLimit: "1 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "valid-parentheses",
    number: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    acceptance: 42.1,
    solved: true,
    description: "Given a string containing only parentheses characters, determine whether every opening bracket is closed by the same kind of bracket in the correct order.",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists only of '(', ')', '[', ']', '{', and '}'."],
    examples: [
      { input: 's = "()[]{}"', output: "true", explanation: "Every opening delimiter is matched in the correct nesting order." },
      { input: 's = "(]"', output: "false", explanation: "The closing bracket does not match the most recent opening bracket." },
    ],
    hints: ["The most recently opened bracket must close first.", "A stack is a natural way to track unmatched opening brackets."],
    starterCode: parenthesesStarter,
    timeLimit: "1 sec",
    memoryLimit: "128 MB",
  },
  {
    slug: "merge-intervals",
    number: 56,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    acceptance: 47.9,
    description: "Merge every pair of overlapping intervals and return the resulting non-overlapping interval set.",
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length = 2", "0 ≤ startᵢ ≤ endᵢ ≤ 10⁴"],
    examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap and become [1,6]." }],
    hints: ["Sort by each interval's start.", "Only compare the next interval with the most recently merged interval."],
    starterCode: twoSumStarter,
    timeLimit: "1 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "number-of-islands",
    number: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Array", "Depth-First Search", "Graph"],
    acceptance: 61.4,
    description: "Count the connected components of land in a rectangular grid where horizontal and vertical adjacency joins cells into the same island.",
    constraints: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'."],
    examples: [{ input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2", explanation: "The first three connected land cells form one island; the last cell forms another." }],
    hints: ["Every unvisited land cell begins a new island.", "Flood-fill its component before continuing the scan."],
    starterCode: islandsStarter,
    timeLimit: "2 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "course-schedule",
    number: 207,
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    acceptance: 47.2,
    description: "Determine whether all courses can be completed when prerequisite pairs describe directed dependencies between them.",
    constraints: ["1 ≤ numCourses ≤ 2 × 10³", "0 ≤ prerequisites.length ≤ 5 × 10³"],
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 before course 1; no cyclic dependency exists." }],
    hints: ["A cycle in the prerequisite graph makes completion impossible.", "Track nodes currently on the DFS path or count indegrees for Kahn's algorithm."],
    starterCode: islandsStarter,
    timeLimit: "2 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "coin-change",
    number: 322,
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    acceptance: 43.0,
    description: "Return the fewest coins needed to make a target amount, or −1 if no combination of the given denominations can form it.",
    constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹ − 1", "0 ≤ amount ≤ 10⁴"],
    examples: [{ input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 can be made with 5 + 5 + 1." }],
    hints: ["Define the minimum coins for every amount from 0 to the target.", "Each state can transition from amount − coin."],
    starterCode: twoSumStarter,
    timeLimit: "2 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "lru-cache",
    number: 146,
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    acceptance: 43.8,
    description: "Design a cache that returns and updates values in O(1) time while evicting the least recently used item at capacity.",
    constraints: ["1 ≤ capacity ≤ 3000", "At most 2 × 10⁵ operations are made."],
    examples: [{ input: "capacity = 2; put(1,1); put(2,2); get(1); put(3,3); get(2)", output: "1, -1", explanation: "Accessing key 1 makes key 2 least recent, so key 2 is evicted next." }],
    hints: ["A hash table finds nodes in O(1).", "A doubly linked list updates recency in O(1)."],
    starterCode: twoSumStarter,
    timeLimit: "2 sec",
    memoryLimit: "256 MB",
  },
  {
    slug: "median-of-two-sorted-arrays",
    number: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance: 39.5,
    description: "Find the median of two sorted arrays in logarithmic time with respect to the smaller array.",
    constraints: ["0 ≤ m, n ≤ 1000", "1 ≤ m + n ≤ 2000", "−10⁶ ≤ nums[i] ≤ 10⁶"],
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: "The merged sorted order is [1,2,3], whose middle value is 2." }],
    hints: ["Partition both arrays so the left halves contain half the values.", "Binary-search the partition of the shorter array."],
    starterCode: twoSumStarter,
    timeLimit: "2 sec",
    memoryLimit: "256 MB",
  },
];

export function getPracticeProblem(slug: string) {
  return practiceProblems.find((problem) => problem.slug === slug);
}
