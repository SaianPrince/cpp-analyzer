import { useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const EXAMPLES = [
  {
    id: 1,
    category: 'Algorithms',
    title: 'Bubble Sort',
    difficulty: 'medium',
    description:
      'Classic O(n²) sorting algorithm. See how -O2 and -O3 dramatically improve loop performance.',
    code: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++)
    for (int j = 0; j < n-i-1; j++)
      if (arr[j] > arr[j+1])
        swap(arr[j], arr[j+1]);
}`,
    speedup: '2.8×',
  },
  {
    id: 2,
    category: 'Algorithms',
    title: 'Binary Search',
    difficulty: 'easy',
    description:
      'Efficient O(log n) search algorithm. Perfect example of compiler loop optimization.',
    code: `int binarySearch(int arr[], int l, int r, int x) {
  while (l <= r) {
    int mid = l + (r - l) / 2;
    if (arr[mid] == x) return mid;
    if (arr[mid] < x) l = mid + 1;`,
    speedup: '1.9×',
  },
  {
    id: 3,
    category: 'STL',
    title: 'Vector Operations',
    difficulty: 'easy',
    description:
      'Common vector operations and memory management. Learn about reserve() impact.',
    code: `vector<int> data;
data.reserve(1000);
for (int i = 0; i < 1000; i++) {
  data.push_back(i * 2);
  data.emplace_back(i * 3);
}`,
    speedup: '4.2×',
  },
  {
    id: 4,
    category: 'Recursion',
    title: 'Fibonacci Recursive',
    difficulty: 'medium',
    description:
      'Classic recursive implementation. Compare with iterative version for performance.',
    code: `int fibonacci(int n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
  cout << fibonacci(30);`,
    speedup: '1.5×',
  },
  {
    id: 5,
    category: 'STL',
    title: 'String Processing',
    difficulty: 'medium',
    description:
      'String manipulation and pattern matching. See how string operations are optimized.',
    code: `bool isPalindrome(string s) {
  int l = 0, r = s.length() - 1;
  while (l < r) {
    if (s[l++] != s[r--])
      return false;`,
    speedup: '2.1×',
  },
  {
    id: 6,
    category: 'Math',
    title: 'Prime Sieve',
    difficulty: 'hard',
    description:
      'Sieve of Eratosthenes algorithm. Great example of memory access patterns.',
    code: `void sieve(int n) {
  bool prime[n+1];
  memset(prime, true, sizeof(prime));
  for (int p = 2; p*p <= n; p++)
    if (prime[p])`,
    speedup: '5.6×',
  },
];

const FILTERS = ['All', 'Algorithms', 'Data Structures', 'STL', 'Sorting', 'Recursion', 'Math'];

export function ExamplesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredExamples =
    activeFilter === 'All'
      ? EXAMPLES
      : EXAMPLES.filter((example) => example.category === activeFilter);

  const difficultyColors = {
    easy: '#16A34A',
    medium: '#D97706',
    hard: '#DC2626',
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0D1117]">
      {/* Hero */}
      <div
        className="px-20 py-12 border-b border-[#30363D]"
        style={{
          background: 'linear-gradient(to bottom, #161B22, #0D1117)',
        }}
      >
        <h1 className="text-3xl text-[#E6EDF3] font-bold mb-2">Example Programs</h1>
        <p className="text-[#8B949E]">
          Ready-to-analyze C++ snippets — click any example to load it in the editor
        </p>
      </div>

      {/* Filter Bar */}
      <div className="h-12 border-b border-[#30363D] px-20 flex items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-md text-xs transition-all ${
              activeFilter === filter
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#1C2128] text-[#8B949E] border border-[#30363D] hover:text-[#E6EDF3] hover:border-[#2563EB]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="p-8 px-20">
        <div className="grid grid-cols-3 gap-5">
          {filteredExamples.map((example) => (
            <div
              key={example.id}
              className="bg-[#1C2128] border border-[#30363D] rounded-lg overflow-hidden hover:border-[#4B5563] hover:-translate-y-px transition-all cursor-pointer"
            >
              {/* Top Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-[#30363D] rounded text-xs text-[#8B949E]">
                    {example.category}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: difficultyColors[example.difficulty as keyof typeof difficultyColors] }}
                    title={example.difficulty}
                  />
                </div>
                <h3 className="text-base text-[#E6EDF3] font-medium mb-2">{example.title}</h3>
                <p className="text-xs text-[#8B949E] leading-relaxed line-clamp-2">
                  {example.description}
                </p>
              </div>

              {/* Code Preview */}
              <div className="bg-[#0D1117] border-t border-[#30363D] p-3 px-4 relative">
                <pre className="font-mono text-xs text-[#E6EDF3] whitespace-pre overflow-hidden">
                  {example.code}
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
              </div>

              {/* Footer */}
              <div className="border-t border-[#30363D] p-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#16A34A]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Avg speedup: {example.speedup}
                </div>
                <button className="text-xs text-[#2563EB] hover:underline flex items-center gap-1">
                  Analyze
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
