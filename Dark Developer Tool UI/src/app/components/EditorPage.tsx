import { useState } from 'react';
import { ChevronDown, Upload, Copy, Trash2, Settings, Zap, Circle, ExternalLink } from 'lucide-react';

const DEFAULT_CODE = `#include <iostream>
#include <vector>

int counter = 0; // global variable

int main() {
    std::vector<int> nums;

    for (int i = 0; i < 1000; i++) {
        nums.push_back(i * 3.14159 * 2);
        std::cout << "Value: " << i << std::endl;
    }

    return 0;
}`;

const RECENT_ANALYSES = [
  {
    id: 'a3f9b2',
    status: 'success',
    time: '2 min ago',
    code: 'std::vector<int> nums;',
    execTime: '45ms',
    memory: '2.1MB',
  },
  {
    id: 'b8c1d4',
    status: 'success',
    time: '15 min ago',
    code: 'int binarySearch(int arr[], int x)',
    execTime: '12ms',
    memory: '1.8MB',
  },
  {
    id: 'e5f2a9',
    status: 'success',
    time: '1 hour ago',
    code: 'void bubbleSort(vector<int>& arr)',
    execTime: '89ms',
    memory: '3.2MB',
  },
];

export function EditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const lines = code.split('\n');
  const charCount = code.length;
  const lineCount = lines.length;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - Editor */}
      <div className="w-[55%] border-r border-[#30363D] flex flex-col bg-[#161B22]">
        {/* Toolbar */}
        <div className="h-10 border-b border-[#30363D] bg-[#1C2128] px-4 flex items-center gap-3">
          <button className="px-3 py-1 bg-[#161B22] border border-[#30363D] rounded text-xs text-[#E6EDF3] hover:bg-[#0D1117] transition-colors flex items-center gap-1.5">
            C++ <ChevronDown className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2 text-xs text-[#8B949E]">
            <span>Standard:</span>
            <button className="px-3 py-1 bg-[#161B22] border border-[#30363D] rounded text-xs text-[#E6EDF3] hover:bg-[#0D1117] transition-colors flex items-center gap-1.5">
              C++17 <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1" />
          <button
            className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
            title="Upload File"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] transition-colors" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-auto bg-[#0D1117]">
          <div className="font-mono text-sm">
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-[#388BFD10]">
                <div className="w-12 text-right pr-3 py-0.5 text-[#4B5563] select-none flex-shrink-0 border-r border-[#30363D] bg-[#0D1117]">
                  {i + 1}
                </div>
                <div className="flex-1 px-3 py-0.5">
                  <CodeLine line={line} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="h-14 border-t border-[#30363D] bg-[#1C2128] px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B949E]">
              {charCount} chars
            </span>
            <span className="text-xs text-[#8B949E]">
              {lineCount} lines
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#D9770610] border border-[#D9770620] rounded text-xs text-[#D97706]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              3 suggestions likely
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8B949E]">~2s estimated</span>
            <button className="px-5 h-9 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-sm">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Analyze Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[45%] bg-[#0D1117] p-6 overflow-auto">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12 mb-8">
          <Zap className="w-24 h-24 text-[#30363D] mb-4" />
          <h3 className="text-base text-[#8B949E] mb-2">Run your first analysis</h3>
          <p className="text-xs text-[#4B5563] mb-6">
            Paste C++ code on the left and click Analyze
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="px-3 py-1.5 bg-[#1C2128] border border-[#30363D] rounded text-xs text-[#8B949E]">
              ⚡ O0→O3 comparison
            </div>
            <div className="px-3 py-1.5 bg-[#1C2128] border border-[#30363D] rounded text-xs text-[#8B949E]">
              🧠 Smart suggestions
            </div>
            <div className="px-3 py-1.5 bg-[#1C2128] border border-[#30363D] rounded text-xs text-[#8B949E]">
              🔗 Shareable link
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div>
          <div className="text-[10px] text-[#4B5563] uppercase tracking-widest mb-3 px-1">
            RECENT
          </div>
          <div className="space-y-3">
            {RECENT_ANALYSES.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-[#1C2128] border border-[#30363D] rounded-lg p-3 hover:border-[#4B5563] hover:-translate-y-px transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    <span className="text-xs text-[#16A34A]">Success</span>
                  </div>
                  <span className="text-xs text-[#8B949E]">{analysis.time}</span>
                </div>
                <div className="font-mono text-xs text-[#79C0FF] mb-2 truncate">
                  {analysis.code}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#16A34A]">⚡ {analysis.execTime}</span>
                    <span className="text-[#2563EB]">💾 {analysis.memory}</span>
                  </div>
                  <span className="text-xs text-[#2563EB] hover:underline flex items-center gap-1">
                    View <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeLine({ line }: { line: string }) {
  if (!line.trim()) {
    return <span className="text-[#E6EDF3]">{line}</span>;
  }

  // Handle comments
  const commentIndex = line.indexOf('//');
  if (commentIndex !== -1) {
    const beforeComment = line.substring(0, commentIndex);
    const comment = line.substring(commentIndex);
    return (
      <>
        {highlightCode(beforeComment)}
        <span className="text-[#8B949E] italic">{comment}</span>
      </>
    );
  }

  return <>{highlightCode(line)}</>;
}

function highlightCode(text: string) {
  if (!text.trim()) {
    return <span className="text-[#E6EDF3]">{text}</span>;
  }

  const keywords = [
    'include',
    'int',
    'for',
    'while',
    'return',
    'void',
    'if',
    'else',
    'const',
    'auto',
    'class',
    'struct',
  ];
  const types = ['std', 'vector', 'string', 'iostream', 'cout', 'endl'];

  let parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Handle preprocessor
  if (text.trim().startsWith('#')) {
    return <span className="text-[#FF7B72]">{text}</span>;
  }

  // Handle strings
  const stringMatches: Array<{ start: number; end: number; value: string }> = [];
  const stringRegex = /"[^"]*"/g;
  let match;
  while ((match = stringRegex.exec(text)) !== null) {
    stringMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      value: match[0],
    });
  }

  // Build highlighted output
  let currentPos = 0;
  const allTokens: Array<{ start: number; end: number; type: string; value: string }> = [];

  // Add string tokens
  stringMatches.forEach((s) => {
    allTokens.push({ ...s, type: 'string' });
  });

  // Add keyword tokens
  keywords.forEach((keyword) => {
    let pos = 0;
    while ((pos = text.indexOf(keyword, pos)) !== -1) {
      const before = pos === 0 || !/\w/.test(text[pos - 1]);
      const after = pos + keyword.length === text.length || !/\w/.test(text[pos + keyword.length]);
      if (before && after) {
        const overlapsString = stringMatches.some((s) => pos >= s.start && pos < s.end);
        if (!overlapsString) {
          allTokens.push({
            start: pos,
            end: pos + keyword.length,
            type: 'keyword',
            value: keyword,
          });
        }
      }
      pos++;
    }
  });

  // Sort and remove overlaps
  allTokens.sort((a, b) => a.start - b.start);
  const validTokens: typeof allTokens = [];
  let lastEnd = 0;
  allTokens.forEach((token) => {
    if (token.start >= lastEnd) {
      validTokens.push(token);
      lastEnd = token.end;
    }
  });

  // Render
  currentPos = 0;
  validTokens.forEach((token) => {
    if (token.start > currentPos) {
      parts.push(
        <span key={key++} className="text-[#E6EDF3]">
          {text.substring(currentPos, token.start)}
        </span>
      );
    }

    if (token.type === 'string') {
      parts.push(
        <span key={key++} className="text-[#A5D6FF]">
          {token.value}
        </span>
      );
    } else if (token.type === 'keyword') {
      parts.push(
        <span key={key++} className="text-[#FF7B72]">
          {token.value}
        </span>
      );
    }

    currentPos = token.end;
  });

  if (currentPos < text.length) {
    parts.push(
      <span key={key++} className="text-[#E6EDF3]">
        {text.substring(currentPos)}
      </span>
    );
  }

  return parts.length > 0 ? <>{parts}</> : <span className="text-[#E6EDF3]">{text}</span>;
}
