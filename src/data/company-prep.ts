export type PrepPack = {
  slug: string;
  company: string;
  tag: string;
  color: string;
  rounds: string[];
  topics: string[];
  problems: { title: string; difficulty: "Easy" | "Medium" | "Hard"; url: string }[];
  behavioral: string[];
  tips: string[];
};

export const PREP_PACKS: PrepPack[] = [
  {
    slug: "google",
    company: "Google",
    tag: "FAANG",
    color: "from-blue-500 to-emerald-500",
    rounds: ["Online Assessment", "Phone Screen", "4× Onsite (Coding + Systems + Googleyness)"],
    topics: ["Graphs / BFS-DFS", "Dynamic Programming", "Trees", "Hash Maps", "System Design"],
    problems: [
      {
        title: "Number of Islands",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "Word Ladder",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/word-ladder/",
      },
      { title: "LRU Cache", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
      {
        title: "Longest Increasing Path in a Matrix",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
      },
    ],
    behavioral: [
      "Tell me about a time you disagreed with a teammate.",
      "Describe an ambiguous project. How did you scope it?",
      "When did you take an initiative outside your role?",
    ],
    tips: [
      "Think out loud — Google grades problem-solving, not just answers.",
      "Always state complexity before coding.",
      "Practice 'Googleyness': bias to action, humility, comfort with ambiguity.",
    ],
  },
  {
    slug: "amazon",
    company: "Amazon",
    tag: "FAANG",
    color: "from-orange-500 to-yellow-500",
    rounds: ["Online Assessment (2 DSA + work simulation)", "Phone Screen", "5× Loop (LP-heavy)"],
    topics: ["Trees", "Arrays", "Heaps", "OOP / LLD", "Behavioral (LPs)"],
    problems: [
      { title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
      {
        title: "Merge K Sorted Lists",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        title: "Course Schedule",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
    ],
    behavioral: [
      "Tell me about a time you failed. (LP: Earn Trust)",
      "When did you go above and beyond? (LP: Ownership)",
      "Describe a tough customer issue. (LP: Customer Obsession)",
    ],
    tips: [
      "Memorize the 16 Leadership Principles — every round maps to one.",
      "Use STAR. Always include metrics in the Result.",
    ],
  },
  {
    slug: "meta",
    company: "Meta",
    tag: "FAANG",
    color: "from-blue-600 to-indigo-500",
    rounds: ["Phone Screen", "Coding × 2", "System Design", "Behavioral"],
    topics: ["Graphs", "BFS/DFS", "Recursion", "Product Sense", "System Design"],
    problems: [
      {
        title: "Binary Tree Right Side View",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-right-side-view/",
      },
      {
        title: "Subarray Sum Equals K",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
      },
      {
        title: "Design Newsfeed",
        difficulty: "Hard",
        url: "https://leetcode.com/discuss/interview-question/system-design/",
      },
    ],
    behavioral: [
      "Why Meta?",
      "Describe shipping fast under uncertainty.",
      "Conflict with a manager.",
    ],
    tips: [
      "Two mediums in 35 minutes — speed matters.",
      "Drive system design; don't wait for prompts.",
    ],
  },
  {
    slug: "microsoft",
    company: "Microsoft",
    tag: "Big Tech",
    color: "from-sky-500 to-cyan-500",
    rounds: ["OA", "Phone Screen", "4-5× Onsite incl. As-Appropriate (AA) round"],
    topics: ["Strings", "Trees", "Recursion", "LLD"],
    problems: [
      {
        title: "Reverse Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Validate BST",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      },
    ],
    behavioral: ["Growth mindset story.", "Cross-team collaboration.", "Customer-driven decision."],
    tips: ["Prep for the AA round — it has a real veto.", "Clean code > clever code at Microsoft."],
  },
  {
    slug: "uber",
    company: "Uber",
    tag: "Unicorn",
    color: "from-zinc-700 to-zinc-900",
    rounds: ["Codesignal OA", "Phone Coding", "Onsite: 2 coding + design + behavioral"],
    topics: ["Concurrency", "Graphs", "Geo / KV stores", "System Design"],
    problems: [
      {
        title: "Design Rate Limiter",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/design-hit-counter/",
      },
      {
        title: "Meeting Rooms II",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/meeting-rooms-ii/",
      },
    ],
    behavioral: ["Ownership story.", "Handling an outage."],
    tips: ["System design is heavy — practice ride-matching, surge pricing, geo-sharding."],
  },
  {
    slug: "atlassian",
    company: "Atlassian",
    tag: "Product",
    color: "from-blue-500 to-violet-500",
    rounds: ["OA", "Coding", "Craft", "Values"],
    topics: ["OOP / LLD", "APIs", "Team values"],
    problems: [
      {
        title: "Design Tic-Tac-Toe",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/design-tic-tac-toe/",
      },
    ],
    behavioral: ["Values fit: Open Company, Build with heart.", "Conflict resolution."],
    tips: ["Craft round = code review of your own past project. Bring one."],
  },
];

export function findPrepPack(slug: string) {
  return PREP_PACKS.find((p) => p.slug === slug);
}
