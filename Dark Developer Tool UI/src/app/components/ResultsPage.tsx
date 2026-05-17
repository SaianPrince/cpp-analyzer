import { ArrowLeft, Share2, Download, Info, ChevronDown, Copy, Check } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { useState } from 'react';

const OPTIMIZATION_DATA = [
  { level: '-O0', time: 45.2, color: '#F97316' },
  { level: '-O1', time: 31.8, color: '#FBBF24' },
  { level: '-O2', time: 20.4, color: '#2563EB' },
  { level: '-O3', time: 14.1, color: '#16A34A' },
];

const TERMINAL_OUTPUT = `$ ./output
Value: 0
Value: 1
Value: 2
Value: 3
Value: 4
Value: 5
Value: 6
Value: 7`;

const SUGGESTIONS = [
  {
    severity: 'HIGH',
    color: '#DC2626',
    title: 'Global Variable Detected',
    description:
      'counter is declared in global scope. Pass it as a function parameter instead for better encapsulation and performance.',
    line: 4,
  },
  {
    severity: 'MEDIUM',
    color: '#D97706',
    title: 'Missing vector::reserve()',
    description:
      'push_back is called without reserve(). The vector will reallocate multiple times. Add nums.reserve(1000) before the loop.',
    code: 'nums.reserve(1000); // Add this line',
  },
  {
    severity: 'LOW',
    color: '#2563EB',
    title: 'Excessive cout in Loop',
    description:
      'std::cout is called 1000 times. Consider batching output or using printf for better I/O performance.',
  },
];

export function ResultsPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stdout' | 'stderr' | 'compiler'>('stdout');
  const [compileExpanded, setCompileExpanded] = useState(false);

  const handleCopyUrl = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0D1117]">
      {/* Breadcrumb Bar */}
      <div className="h-10 border-b border-[#30363D] bg-[#161B22] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="flex items-center gap-2 text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
          <span className="text-[#30363D]">/</span>
          <span className="text-[#E6EDF3]">Analysis #a3f9b2</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] transition-colors rounded flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button className="px-3 py-1.5 text-xs text-[#E6EDF3] hover:bg-[#1C2128] transition-colors rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download JSON
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-[1fr_400px] gap-5">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Performance Chart */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[#E6EDF3] font-medium mb-1 flex items-center gap-2">
                    Performance by Optimization Level
                    <Info className="w-4 h-4 text-[#8B949E]" />
                  </h2>
                  <p className="text-xs text-[#8B949E]">
                    Lower is faster — wall clock time in milliseconds
                  </p>
                </div>
              </div>
              <div className="h-52 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={OPTIMIZATION_DATA} layout="horizontal" margin={{ left: 0, right: 60 }}>
                    <XAxis type="number" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="level"
                      stroke="#8B949E"
                      tick={{ fill: '#8B949E', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      width={40}
                    />
                    <Bar dataKey="time" radius={[0, 4, 4, 0]}>
                      {OPTIMIZATION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="time"
                        position="right"
                        formatter={(value: number) => `${value}ms`}
                        style={{ fill: '#E6EDF3', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                <div className="px-4 py-1.5 bg-[#16A34A20] border border-[#16A34A40] rounded-full text-sm text-[#16A34A]">
                  O3 is 3.2× faster than O0
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg p-5">
              <h2 className="text-[#E6EDF3] font-medium mb-6">Memory Usage</h2>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="70" stroke="#30363D" strokeWidth="12" fill="none" />
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      stroke="#2563EB"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${70 * 2 * Math.PI * 0.68} ${70 * 2 * Math.PI * 0.32}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl text-[#E6EDF3] font-bold">2.1 MB</div>
                    <div className="text-xs text-[#8B949E]">Peak RSS</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0D1117] border border-[#30363D] rounded p-3">
                  <div className="text-xs text-[#8B949E] mb-1">Virtual Memory</div>
                  <div className="text-sm text-[#E6EDF3] font-medium">8.4 MB</div>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] rounded p-3">
                  <div className="text-xs text-[#8B949E] mb-1">Stack Usage</div>
                  <div className="text-sm text-[#E6EDF3] font-medium">64 KB</div>
                </div>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg overflow-hidden">
              <div className="border-b border-[#30363D] flex">
                {(['stdout', 'stderr', 'compiler'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-xs transition-colors ${
                      activeTab === tab ? 'text-[#E6EDF3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] rounded m-4 p-4 font-mono text-xs text-[#E6EDF3] relative">
                <div className="text-[#4B5563] mb-2">$ ./output</div>
                <div className="whitespace-pre-wrap">{TERMINAL_OUTPUT}</div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Suggestions */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[#E6EDF3] font-medium">Optimization Suggestions</h2>
                <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-xs flex items-center justify-center">
                  3
                </div>
              </div>
              <p className="text-xs text-[#8B949E] italic mb-4">
                Rule-based analysis — AI suggestions coming in v2
              </p>

              <div className="space-y-3">
                {SUGGESTIONS.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border-l-4 rounded p-3"
                    style={{
                      borderLeftColor: suggestion.color,
                      backgroundColor: `${suggestion.color}08`,
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] uppercase font-medium"
                        style={{
                          backgroundColor: suggestion.color,
                          color: 'white',
                        }}
                      >
                        {suggestion.severity}
                      </span>
                      <h3 className="text-sm text-[#E6EDF3] font-medium flex-1">
                        {suggestion.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#8B949E] leading-relaxed mb-2">
                      {suggestion.description}
                    </p>
                    {suggestion.code && (
                      <div className="bg-[#0D1117] border border-[#30363D] rounded p-2 font-mono text-xs text-[#79C0FF]">
                        {suggestion.code}
                      </div>
                    )}
                    {suggestion.line && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-[#30363D] rounded text-xs text-[#8B949E]">
                          Line {suggestion.line}
                        </span>
                        <span className="text-xs text-[#2563EB] hover:underline cursor-pointer">
                          ← See in editor
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Share & Export */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg p-4">
              <h3 className="text-sm text-[#E6EDF3] font-medium mb-3">Share this analysis</h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value="https://cppanalyzer.com/r/a3f9b2"
                  readOnly
                  className="flex-1 bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-xs text-[#8B949E] font-mono"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded hover:bg-[#1C2128] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2 mb-3">
                <button className="flex-1 px-3 py-2 text-xs bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded hover:bg-[#1C2128] transition-colors">
                  Copy Link
                </button>
                <button className="flex-1 px-3 py-2 text-xs bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded hover:bg-[#1C2128] transition-colors">
                  Download JSON
                </button>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                This link is permanent and publicly accessible
              </p>
            </div>

            {/* Compile Details */}
            <div className="bg-[#1C2128] border border-[#30363D] rounded-lg overflow-hidden">
              <button
                onClick={() => setCompileExpanded(!compileExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#30363D20] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#E6EDF3]">Compile Details</span>
                  <span className="text-xs text-[#8B949E]">g++ 13.2 · 320ms</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#8B949E] transition-transform ${
                    compileExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
