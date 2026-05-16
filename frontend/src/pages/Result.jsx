import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HardDrive, Terminal, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

const Result = () => {
  const { id } = useParams();

  // MOCK DATA - Phase 3.3 (We will replace this with real API data in the next phase)
  const performanceData = [
    { name: '-O0', time: 1250, color: '#94a3b8' },
    { name: '-O1', time: 820, color: '#8b5cf6' },
    { name: '-O2', time: 450, color: '#06b6d4' },
    { name: '-O3', time: 310, color: '#10b981' },
  ];

  return (
    <div className="result-container animate-fade-in">
      <div className="result-header">
        <Link to="/" className="btn-back">
          <ArrowLeft size={18} />
          <span>New Analysis</span>
        </Link>
        <h1>Analysis Result <span className="text-muted">#{id || 'DEMO'}</span></h1>
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
                  contentStyle={{ backgroundColor: '#161821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="time">
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
              <span className="big-value">1,420</span>
              <span className="unit">KB</span>
            </div>
            
            <div className="memory-progress-bg">
              <div className="memory-progress-fill" style={{ width: '65%' }}></div>
            </div>
            
            <p className="memory-status-text">
              Memory usage is <span className="text-gradient">Excellent</span>.
            </p>
          </div>

          <div className="suggestion-item glass" style={{marginTop: '20px', padding: '15px'}}>
            <CheckCircle2 size={16} className="text-green" />
            <span style={{fontSize: '0.9rem'}}>Minimal memory footprint. No leaks detected.</span>
          </div>
        </div>

        {/* Bottom Card: Output Log */}
        <div className="result-card glass p-24 col-span-2">
          <div className="card-title">
            <Terminal size={20} className="text-muted" />
            <h3>Standard Output (stdout)</h3>
          </div>
          <div className="terminal-box">
            <code>
              {">"} Initializing analysis...<br/>
              {">"} Optimization pass completed.<br/>
              {">"} Final result: 42.55 (Matched expected output)<br/>
              {">"} Process finished with exit code 0.
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
