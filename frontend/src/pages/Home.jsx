import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const [code, setCode] = useState('// Write your C++ code here...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello Performance!" << std::endl;\n    return 0;\n}');

  // Limit character/line count for security and performance
  const handleEditorChange = (value) => {
    if (value.split('\n').length <= 500) {
      setCode(value);
    }
  };

  const handleAnalyze = () => {
    console.log("Analyzing code:", code);
    // Phase 3.3: This will trigger the API call to Python backend
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">
          Analyze Your <span className="text-gradient">C++ Performance</span>
        </h1>
        <p className="hero-subtitle">
          Advanced benchmarking with 4-tier compiler optimizations (-O0 to -O3) and real-time memory tracking.
        </p>
      </header>

      {/* Editor Section */}
      <section className="editor-wrapper glass">
        <div className="editor-header">
          <div className="editor-status">
            <ShieldCheck size={16} className="text-cyan" />
            <span>Sandboxed Environment</span>
          </div>
          <div className="editor-lang">C++ 20</div>
        </div>
        
        <div className="monaco-container">
          <Editor
            height="400px"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              cursorStyle: 'block',
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 }
            }}
          />
        </div>

        <div className="editor-footer">
          <div className="editor-stats">
            {code.split('\n').length} / 500 lines
          </div>
          <button className="btn-analyze" onClick={handleAnalyze}>
            <Zap size={18} />
            <span>Analyze Performance</span>
          </button>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="info-grid">
        <div className="info-card glass">
          <Zap className="icon-purple" />
          <h3>Fast Analysis</h3>
          <p>Get results in seconds using multi-threaded execution.</p>
        </div>
        <div className="info-card glass">
          <Play className="icon-cyan" />
          <h3>Optimization Tiers</h3>
          <p>Compare -O0, -O1, -O2, and -O3 levels side-by-side.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
