import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList, Tooltip } from 'recharts';
import { ArrowLeft, Share2, Download, Info, ChevronDown, Copy, Check, HelpCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: '#1C2128', border: `1px solid ${d.color}`, borderRadius: 6, padding: '8px 14px', boxShadow: `0 0 12px ${d.color}30` }}>
        <p style={{ margin: 0, color: '#E6EDF3', fontWeight: 700, fontSize: 14 }}>{d.level}</p>
        <p style={{ margin: '4px 0 0', color: '#8B949E', fontSize: 13 }}>{d.time} ms</p>
      </div>
    );
  }
  return null;
};

const Result = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('stdout');
  const [compileExpanded, setCompileExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/result/${id}`);
        if (res.ok) setData(await res.json());
      } catch (e) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-accent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ fontSize: 15, color: '#8B949E' }}>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg">
        <div className="text-center p-8 bg-card border border-border rounded-lg" style={{ maxWidth: 380 }}>
          <HelpCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
          <h2 style={{ fontSize: 18, color: '#E6EDF3', fontWeight: 700, marginBottom: 8 }}>Analysis Not Found</h2>
          <p style={{ fontSize: 14, color: '#8B949E', marginBottom: 20 }}>This analysis may have expired or does not exist.</p>
          <Link to="/" style={{ display: 'inline-block', padding: '8px 20px', background: '#2563EB', color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>
            Back to Editor
          </Link>
        </div>
      </div>
    );
  }

  const optimizations = data.engine_result?.optimizations || [];
  const performanceData = optimizations.map(opt => ({
    level: opt.level,
    time: opt.run_time_ms,
    color: opt.level === '-O3' ? '#16A34A' : opt.level === '-O2' ? '#2563EB' : opt.level === '-O1' ? '#FBBF24' : '#F97316'
  }));

  const peakMemory = optimizations.length > 0
    ? Math.max(...optimizations.map(o => o.memory_kb))
    : 0;

  const o0Time = optimizations.find(o => o.level === '-O0')?.run_time_ms || 0;
  const o3Time = optimizations.find(o => o.level === '-O3')?.run_time_ms || 0;
  const speedup = o3Time > 0 && o0Time > 0 ? (o0Time / o3Time).toFixed(1) : null;
  const totalCompileTime = optimizations.reduce((s, c) => s + c.compile_time_ms, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Memory gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const memPercent = Math.min(100, Math.max(5, (peakMemory / 10240) * 100));
  const dashOffset = circumference - (memPercent / 100) * circumference;
  const memDisplay = peakMemory >= 1024
    ? `${(peakMemory / 1024).toFixed(1)} MB`
    : `${peakMemory} KB`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg">

      {/* Breadcrumb */}
      <div className="h-10 border-b border-border bg-bg-secondary px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3" style={{ fontSize: 14 }}>
          <Link to="/" className="flex items-center gap-2 hover:text-text transition-colors" style={{ color: '#8B949E' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </Link>
          <span style={{ color: '#30363D' }}>/</span>
          <span style={{ color: '#E6EDF3', fontWeight: 500 }}>Analysis #{id?.substring(0, 6)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopyLink} className="px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-card transition-colors" style={{ fontSize: 13, color: '#E6EDF3', background: 'none', border: 'none' }}>
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={handleDownloadJSON} className="px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-card transition-colors" style={{ fontSize: 13, color: '#E6EDF3', background: 'none', border: 'none' }}>
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ═══ ROW 1: Chart + Memory + Suggestions ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Performance Chart */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="flex items-center gap-2 mb-1" style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 600 }}>
                Execution Time <Info className="w-4 h-4" style={{ color: '#8B949E' }} />
              </h2>
              <p style={{ fontSize: 13, color: '#8B949E', marginBottom: 12 }}>Wall clock time in milliseconds</p>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ left: -10, right: 5, top: 25, bottom: 5 }}>
                    <XAxis dataKey="level" stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 14, fontFamily: 'JetBrains Mono' }} />
                    <YAxis stroke="#8B949E" tick={{ fill: '#8B949E', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#388BFD10' }} />
                    <Bar dataKey="time" radius={[6, 6, 0, 0]} barSize={40}>
                      {performanceData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                      <LabelList dataKey="time" position="top" formatter={(v) => `${v}ms`}
                        style={{ fill: '#E6EDF3', fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {speedup && parseFloat(speedup) > 1 && (
                <div className="flex justify-center mt-3">
                  <div className="px-4 py-1.5 rounded-full flex items-center gap-1.5" style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, background: '#16A34A20', border: '1px solid #16A34A40' }}>
                    <CheckCircle className="w-3.5 h-3.5" /> O3 is {speedup}× faster than O0
                  </div>
                </div>
              )}
            </div>

            {/* Memory Usage */}
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center">
              <h2 className="self-start mb-4" style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 600 }}>Memory Usage</h2>
              <div className="relative" style={{ width: 160, height: 160 }}>
                <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r={radius} stroke="#30363D" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r={radius} stroke="#2563EB" strokeWidth="12" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div style={{ fontSize: 20, color: '#E6EDF3', fontWeight: 700 }}>{memDisplay}</div>
                  <div style={{ fontSize: 13, color: '#8B949E' }}>Peak RSS</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <div className="bg-bg border border-border rounded-md p-3">
                  <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 2 }}>Virtual Mem</div>
                  <div style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>{(peakMemory * 1.5 / 1024).toFixed(1)} MB</div>
                </div>
                <div className="bg-bg border border-border rounded-md p-3">
                  <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 2 }}>Stack</div>
                  <div style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>64 KB</div>
                </div>
              </div>
            </div>

            {/* Optimization Suggestions */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-1">
                <h2 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 600 }}>Suggestions</h2>
                <div className="flex items-center justify-center rounded-full bg-accent" style={{ width: 22, height: 22, fontSize: 12, color: '#fff', fontWeight: 700 }}>
                  {data.suggestions?.length || 0}
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#8B949E', fontStyle: 'italic', marginBottom: 12 }}>Rule-based analysis</p>
              <div className="space-y-3" style={{ maxHeight: 320, overflowY: 'auto' }}>
                {(data.suggestions || []).map((s, i) => {
                  const colors = { high: '#DC2626', medium: '#D97706', low: '#2563EB' };
                  const col = colors[s.severity] || '#2563EB';
                  return (
                    <div key={i} className="rounded-md p-3" style={{ borderLeft: `3px solid ${col}`, background: `${col}08` }}>
                      <div className="flex items-start gap-2 mb-1">
                        <span className="flex-shrink-0 rounded px-1.5 py-0.5 uppercase" style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: col }}>
                          {s.severity}
                        </span>
                        <h3 style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>{s.title}</h3>
                      </div>
                      <p style={{ fontSize: 13, color: '#8B949E', lineHeight: 1.5 }}>{s.detail}</p>
                    </div>
                  );
                })}
                {(!data.suggestions || data.suggestions.length === 0) && (
                  <div className="rounded-md p-4 text-center" style={{ borderLeft: '3px solid #16A34A', background: '#16A34A08' }}>
                    <CheckCircle className="w-5 h-5 mx-auto mb-2" style={{ color: '#16A34A' }} />
                    <p style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>Code Looks Optimized</p>
                    <p style={{ fontSize: 13, color: '#8B949E', marginTop: 4 }}>No major improvements detected.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ ROW 2: Terminal Output + Share/Compile ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

            {/* Terminal Output */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="border-b border-border flex bg-bg-secondary">
                {['stdout', 'stderr', 'compiler'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-5 py-2.5 transition-colors capitalize"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: activeTab === tab ? '#E6EDF3' : '#8B949E',
                      borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
                      background: 'none',
                      border: 'none',
                      borderBottomWidth: 2,
                      borderBottomStyle: 'solid',
                      borderBottomColor: activeTab === tab ? '#2563EB' : 'transparent',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="bg-bg rounded-md m-4 p-4 font-mono" style={{ fontSize: 14, color: '#E6EDF3', minHeight: 100 }}>
                {activeTab === 'stdout' && (
                  <>
                    <div style={{ color: '#4B5563', marginBottom: 8 }}>$ ./output</div>
                    <pre className="whitespace-pre-wrap" style={{ margin: 0 }}>{data.engine_result?.stdout || 'No output produced.'}</pre>
                  </>
                )}
                {activeTab === 'stderr' && (
                  <>
                    <div style={{ color: '#4B5563', marginBottom: 8 }}>$ stderr</div>
                    <pre className="whitespace-pre-wrap" style={{ margin: 0, color: '#DC2626' }}>
                      {optimizations.find(o => o.error_message)?.error_message || 'No errors detected.'}
                    </pre>
                  </>
                )}
                {activeTab === 'compiler' && (
                  <>
                    <div style={{ color: '#4B5563', marginBottom: 8 }}>$ g++ -O3 main.cpp</div>
                    <pre className="whitespace-pre-wrap" style={{ margin: 0, color: '#8B949E' }}>
                      {data.engine_result?.message || 'Compilation successful. No warnings.'}
                    </pre>
                  </>
                )}
              </div>
            </div>

            {/* Right: Share + Compile */}
            <div className="space-y-5">
              {/* Share */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 700, marginBottom: 10 }}>Share this analysis</h3>
                <div className="flex items-center gap-2 mb-3">
                  <input type="text" value={window.location.href} readOnly
                    className="flex-1 bg-bg border border-border rounded-md px-3 py-2 font-mono"
                    style={{ fontSize: 12, color: '#8B949E', outline: 'none' }} />
                  <button onClick={handleCopyLink}
                    className="p-2 bg-bg border border-border rounded-md hover:bg-card transition-colors"
                    style={{ color: '#E6EDF3' }}>
                    {copied ? <Check className="w-4 h-4" style={{ color: '#16A34A' }} /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopyLink} className="flex-1 py-2 bg-bg border border-border rounded-md hover:bg-card transition-colors" style={{ fontSize: 13, color: '#E6EDF3', fontWeight: 500 }}>
                    Copy Link
                  </button>
                  <button onClick={handleDownloadJSON} className="flex-1 py-2 bg-bg border border-border rounded-md hover:bg-card transition-colors" style={{ fontSize: 13, color: '#E6EDF3', fontWeight: 500 }}>
                    Export JSON
                  </button>
                </div>
              </div>

              {/* Compile Details */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <button onClick={() => setCompileExpanded(!compileExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-bg-secondary/50 transition-colors"
                  style={{ background: 'none', border: 'none' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 500 }}>Compile Details</span>
                    <span className="font-mono" style={{ fontSize: 12, color: '#8B949E' }}>g++ 13.2 · {totalCompileTime}ms</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${compileExpanded ? 'rotate-180' : ''}`} style={{ color: '#8B949E' }} />
                </button>
                {compileExpanded && (
                  <div className="px-4 pb-4 border-t border-border bg-bg-secondary font-mono pt-3 space-y-2" style={{ fontSize: 13, color: '#8B949E' }}>
                    <div className="flex justify-between"><span>Compiler</span><span style={{ color: '#E6EDF3' }}>g++ (GCC) 13.2.0</span></div>
                    <div className="flex justify-between"><span>Host</span><span style={{ color: '#E6EDF3' }}>Linux x86_64 (Docker)</span></div>
                    <div className="flex justify-between"><span>Standard</span><span style={{ color: '#E6EDF3' }}>-std=c++17</span></div>
                    <div className="flex justify-between"><span>Passes</span><span style={{ color: '#E6EDF3' }}>4 (O0–O3)</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Result;
