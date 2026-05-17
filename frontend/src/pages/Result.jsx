import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HardDrive, Terminal, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

import { useState, useEffect } from 'react';

const Result = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/result/${id}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="result-container"><h1>Loading analysis...</h1></div>;
  if (!data) return <div className="result-container"><h1>Analysis not found.</h1></div>;

  const performanceData = data.engine_result.optimizations.map(opt => ({
    name: opt.level,
    time: opt.run_time_ms,
    color: opt.level === '-O3' ? '#10b981' : opt.level === '-O0' ? '#94a3b8' : '#8b5cf6'
  }));

  const peakMemory = data.engine_result.optimizations.length > 0 
    ? Math.max(...data.engine_result.optimizations.map(o => o.memory_kb)) 
    : 0;

  return (
    <div className="result-container animate-fade-in">
      <div className="result-header">
        <Link to="/" className="btn-back">
          <ArrowLeft size={18} />
          <span>New Analysis</span>
        </Link>
        <h1>Analysis Result <span className="text-muted">#{id ? id.substring(0, 8).toUpperCase() : 'DEMO'}</span></h1>
      </div>

      <div className="result-grid">
        {/* Left Card: Execution Graph */}
        <div className="result-card glass p-24">
          <div className="card-title">
            <Zap size={20} className="icon-purple" />
            <h3>Execution Time (ms)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass" style={{ padding: '12px 18px', border: `1px solid ${data.color}`, boxShadow: `0 0 15px ${data.color}40`, backgroundColor: 'rgba(10, 11, 16, 0.95)' }}>
                          <p style={{ margin: 0, color: '#ffffff', textShadow: `0 0 8px ${data.color}`, fontWeight: 'bold', fontSize: '1.2rem' }}>{data.name}</p>
                          <p style={{ margin: '5px 0 0 0', color: '#e2e8f0', fontSize: '1rem', fontWeight: '500' }}>Execution: {data.time} ms</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="time" className="animated-bar">
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Memory Usage (THE NEW BAR IS HERE) */}
        <div className="result-card glass p-24">
          <div className="card-title">
            <HardDrive size={20} className="icon-cyan" />
            <h3>Peak Memory Usage</h3>
          </div>
          
          <div className="memory-stats-container">
            <div className="memory-value-display">
              <span className="big-value">{peakMemory.toLocaleString()}</span>
              <span className="unit">KB</span>
            </div>
            
            <div className="memory-progress-bg">
              <div className="memory-progress-fill" style={{ width: `${Math.min(100, (peakMemory / 10240) * 100)}%` }}></div>
            </div>
            
            <p className="memory-status-text">
              Memory usage is <span className="text-gradient">Excellent</span>.
            </p>
          </div>

          {data.suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item glass" style={{marginTop: '10px', padding: '15px'}}>
              <CheckCircle2 size={16} className={suggestion.severity === 'high' ? "text-red" : "text-green"} />
              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <strong style={{fontSize: '0.9rem'}}>{suggestion.title}</strong>
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{suggestion.detail}</span>
              </div>
            </div>
          ))}
          {data.suggestions.length === 0 && (
            <div className="suggestion-item glass" style={{marginTop: '10px', padding: '15px'}}>
              <CheckCircle2 size={16} className="text-green" />
              <span style={{fontSize: '0.9rem'}}>No major issues detected. Your code looks optimized!</span>
            </div>
          )}
        </div>

        {/* Bottom Card: Output Log */}
        <div className="result-card glass p-24 col-span-2">
          <div className="card-title">
            <Terminal size={20} className="text-muted" />
            <h3>Standard Output (stdout) / Errors</h3>
          </div>
          <div className="terminal-box">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {data.engine_result.stdout || (data.engine_result.optimizations.find(o => o.error_message)?.error_message) || "No output generated."}
              {"\n> Optimization status: " + (data.engine_result.optimizations[0]?.status || "unknown")}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
