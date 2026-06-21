import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Upload, Copy, Trash2, Settings, Zap, ExternalLink, Loader2 } from 'lucide-react';

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

const Home = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const charCount = code.length;
  const lineCount = code.split('\n').length;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/history');
        if (res.ok) setHistory(await res.json());
      } catch (e) { /* silent */ }
    };
    fetchHistory();
  }, []);

  const handleEditorChange = (value) => {
    if (value && value.split('\n').length <= 500) setCode(value);
  };

  const handleAnalyze = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/result/${data.id}`);
      } else {
        alert(data.detail || 'Analysis failed');
      }
    } catch (err) {
      alert('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClear = () => setCode('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ═══ LEFT PANEL — Code Editor ═══ */}
      <div className="w-[55%] border-r border-border flex flex-col bg-bg-secondary">

        {/* Toolbar */}
        <div className="h-10 border-b border-border bg-card px-4 flex items-center gap-3 flex-shrink-0">
          <button className="px-3 py-1 bg-bg-secondary border border-border rounded text-xs text-text hover:bg-bg transition-colors flex items-center gap-1.5">
            C++ <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Standard:</span>
            <button className="px-3 py-1 bg-bg-secondary border border-border rounded text-xs text-text hover:bg-bg transition-colors flex items-center gap-1.5">
              C++17 <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>
          </div>
          <div className="flex-1" />
          <input ref={fileInputRef} type="file" accept=".cpp,.h,.hpp,.cc,.cxx,.txt" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="p-1.5 text-text-muted hover:text-text transition-colors" title="Upload File">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleCopy} className="p-1.5 text-text-muted hover:text-text transition-colors" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleClear} className="p-1.5 text-text-muted hover:text-text transition-colors" title="Clear">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-text-muted hover:text-text transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden bg-bg">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "Consolas, 'Courier New', monospace",
              cursorStyle: 'line',
              cursorBlinking: 'smooth',
              wordWrap: 'on',
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 4,
              scrollBeyondLastColumn: 5,
              scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
              renderLineHighlight: 'line',
              lineHighlightBackground: '#388BFD10',
            }}
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="h-14 border-t border-border bg-card px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">{charCount} chars</span>
            <span className="text-xs text-text-muted">{lineCount} lines</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-warning"
              style={{ background: '#D9770610', border: '1px solid #D9770620' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
              3 suggestions likely
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">~2s estimated</span>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-5 h-9 bg-accent text-white rounded-md hover:bg-accent-hover transition-all flex items-center gap-2 border-none font-medium disabled:opacity-60"
              style={{ minWidth: 160 }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing...</span></>
                : <><Zap className="w-4 h-4" /><span>Analyze Code</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Features + History ═══ */}
      <div className="w-[45%] bg-bg p-6 overflow-y-auto">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, color: '#E6EDF3', fontWeight: 700, marginBottom: 6 }}>C++ Performance Analyzer</h2>
          <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>
            Write or upload C++ code on the left, then click <strong style={{ color: '#E6EDF3' }}>Analyze Code</strong> to benchmark across 4 optimization levels.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-3" style={{ marginBottom: 24 }}>
          {[
            { icon: '⚡', title: 'O0 → O3 Comparison', desc: 'See how each optimization flag affects execution time side by side.', color: '#F97316' },
            { icon: '🧠', title: 'Smart Suggestions', desc: 'Rule-based engine detects missing reserve(), global vars, endl overhead.', color: '#2563EB' },
            { icon: '📊', title: 'Memory Profiling', desc: 'Track peak RSS memory usage and identify allocation hotspots.', color: '#16A34A' },
            { icon: '🔗', title: 'Shareable Results', desc: 'Every analysis gets a permanent link you can share with anyone.', color: '#D97706' },
          ].map((feat) => (
            <div key={feat.title} className="flex gap-3 p-3 bg-card border border-border rounded-lg hover:border-text-dark transition-all"
              style={{ cursor: 'default' }}>
              <div className="flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{ width: 38, height: 38, background: `${feat.color}12`, border: `1px solid ${feat.color}25`, fontSize: 18 }}>
                {feat.icon}
              </div>
              <div>
                <h4 style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600, marginBottom: 2 }}>{feat.title}</h4>
                <p style={{ fontSize: 13, color: '#8B949E', lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 24 }}>
          {[
            { label: 'Compiler', value: 'GCC 13.2' },
            { label: 'Timeout', value: '5 sec' },
            { label: 'Sandbox', value: 'Docker' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-3 text-center">
              <div className="font-mono" style={{ fontSize: 15, color: '#E6EDF3', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#8B949E', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Analyses */}
        <div>
          <div style={{ fontSize: 11, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10, paddingLeft: 2 }}>
            Recent Analyses
          </div>
          <div className="space-y-3">
            {history.map((a) => (
              <Link
                key={a.id}
                to={`/result/${a.id}`}
                className="block bg-card border border-border rounded-lg p-3 hover:border-text-dark transition-all"
                style={{ transform: 'translateY(0)', transition: 'all 150ms' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>Success</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 12, color: '#8B949E' }}>#{a.id?.substring(0, 6)}</span>
                </div>
                <div className="font-mono truncate" style={{ fontSize: 13, color: '#79C0FF', marginBottom: 8 }}>
                  {a.code?.split('\n')[0] || 'C++ code'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3" style={{ fontSize: 13 }}>
                    <span style={{ color: '#16A34A' }}>⚡ {a.execTime}</span>
                    <span style={{ color: '#2563EB' }}>💾 {a.memory}</span>
                  </div>
                  <span className="flex items-center gap-1" style={{ fontSize: 13, color: '#2563EB' }}>
                    View <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
            {history.length === 0 && (
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p style={{ fontSize: 14, color: '#8B949E' }}>No analyses yet. Run your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
