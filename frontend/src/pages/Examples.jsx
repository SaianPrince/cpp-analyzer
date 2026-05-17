import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Algorithms', 'Data Structures', 'STL', 'Sorting', 'Recursion', 'Math'];

const EXAMPLES = [
  {
    title: 'Bubble Sort',
    category: 'Algorithms',
    difficulty: 'medium',
    description: 'Classic O(n²) sorting algorithm. See how -O2 and -O3 dramatically improve loop performance.',
    speedup: '2.8×',
    code: `#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                std::swap(arr[j], arr[j + 1]);
}

int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(data);
    for (int x : data) std::cout << x << " ";
    return 0;
}`,
  },
  {
    title: 'Binary Search',
    category: 'Algorithms',
    difficulty: 'easy',
    description: 'Efficient O(log n) search on sorted arrays. Observe how compiler optimizations affect branch prediction.',
    speedup: '1.5×',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> data(10000);
    for (int i = 0; i < 10000; i++) data[i] = i * 2;
    std::cout << "Found at: " << binarySearch(data, 4096) << std::endl;
    return 0;
}`,
  },
  {
    title: 'Vector Operations',
    category: 'STL',
    difficulty: 'easy',
    description: 'Compare push_back with and without reserve(). A key optimization any C++ developer should know.',
    speedup: '3.1×',
    code: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> nums;
    nums.reserve(1000000);

    for (int i = 0; i < 1000000; i++)
        nums.push_back(i);

    long long sum = std::accumulate(nums.begin(), nums.end(), 0LL);
    std::cout << "Sum: " << sum << "\\n";
    return 0;
}`,
  },
  {
    title: 'Fibonacci Recursive',
    category: 'Recursion',
    difficulty: 'medium',
    description: 'Naive recursive Fibonacci vs iterative. Watch the dramatic O3 speedup on deep call stacks.',
    speedup: '4.2×',
    code: `#include <iostream>

long long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    for (int i = 0; i < 35; i++)
        std::cout << fib(i) << " ";
    std::cout << std::endl;
    return 0;
}`,
  },
  {
    title: 'String Processing',
    category: 'STL',
    difficulty: 'medium',
    description: 'Tokenize and transform strings using STL algorithms. Tests iterator and allocation performance.',
    speedup: '2.3×',
    code: `#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>

int main() {
    std::string text = "the quick brown fox jumps over the lazy dog";
    std::istringstream iss(text);
    std::vector<std::string> words;
    std::string word;

    while (iss >> word) {
        std::transform(word.begin(), word.end(), word.begin(), ::toupper);
        words.push_back(word);
    }

    for (const auto& w : words)
        std::cout << w << " ";
    return 0;
}`,
  },
  {
    title: 'Prime Sieve',
    category: 'Math',
    difficulty: 'hard',
    description: 'Sieve of Eratosthenes up to 10 million. Memory-intensive workload that benefits heavily from -O3.',
    speedup: '5.1×',
    code: `#include <iostream>
#include <vector>

int main() {
    const int N = 10000000;
    std::vector<bool> is_prime(N + 1, true);
    is_prime[0] = is_prime[1] = false;

    for (int i = 2; i * i <= N; i++)
        if (is_prime[i])
            for (int j = i * i; j <= N; j += i)
                is_prime[j] = false;

    int count = 0;
    for (int i = 2; i <= N; i++)
        if (is_prime[i]) count++;

    std::cout << "Primes found: " << count << "\\n";
    return 0;
}`,
  },
];

const diffColors = { easy: '#16A34A', medium: '#D97706', hard: '#DC2626' };

const Examples = () => {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = filter === 'All' ? EXAMPLES : EXAMPLES.filter(e => e.category === filter);

  const handleAnalyze = async (code) => {
    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) navigate(`/result/${data.id}`);
      else alert(data.detail || 'Analysis failed');
    } catch {
      alert('Could not connect to backend.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg">

      {/* Hero */}
      <div className="px-20 py-12" style={{ background: 'linear-gradient(to bottom, #161B22, #0D1117)' }}>
        <h1 className="text-[32px] text-text font-bold mb-2">Example Programs</h1>
        <p className="text-base text-text-muted">
          Ready-to-analyze C++ snippets — click any example to load it in the analyzer
        </p>
      </div>

      {/* Filter Bar */}
      <div className="px-20 border-b border-border h-12 flex items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              filter === cat
                ? 'bg-accent text-white border-accent'
                : 'bg-card text-text-muted border-border hover:text-text hover:border-text-dark'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="px-20 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ex) => (
          <div key={ex.title}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-text-dark transition-all"
            style={{ transition: 'all 150ms' }}>

            {/* Card Top */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted bg-bg border border-border rounded px-2 py-0.5">{ex.category}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: diffColors[ex.difficulty] }} />
                  <span className="text-xs capitalize" style={{ color: diffColors[ex.difficulty] }}>{ex.difficulty}</span>
                </div>
              </div>
              <h3 className="text-base text-text font-bold mb-1">{ex.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{ex.description}</p>
            </div>

            {/* Code Preview */}
            <div className="bg-bg border-t border-border px-4 py-3 font-mono text-xs text-code relative overflow-hidden" style={{ maxHeight: 110 }}>
              <pre className="whitespace-pre-wrap">{ex.code.split('\n').slice(0, 5).join('\n')}</pre>
              <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #0D1117, transparent)' }} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-success font-medium">⚡ Avg speedup: {ex.speedup}</span>
              <button onClick={() => handleAnalyze(ex.code)}
                className="text-sm text-accent hover:underline flex items-center gap-1 bg-transparent border-none font-medium">
                Analyze <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Examples;
