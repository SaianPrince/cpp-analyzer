import { Cpu, Zap, ShieldCheck, Activity, GitBranch, ArrowRight, BarChart3, Clock, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    num: '01',
    icon: Cpu,
    color: '#F97316',
    title: 'Submit Your Code',
    desc: 'Paste or upload any C++ source file into the Monaco editor. The code is sent to our secure backend over HTTPS.',
  },
  {
    num: '02',
    icon: GitBranch,
    color: '#FBBF24',
    title: 'Parallel Compilation',
    desc: 'Your code is compiled simultaneously with four optimization flags: -O0 (baseline), -O1, -O2, and -O3 (aggressive).',
  },
  {
    num: '03',
    icon: Clock,
    color: '#2563EB',
    title: 'Sandboxed Execution',
    desc: 'Each compiled binary runs inside an isolated Docker container. Execution time and memory usage are measured with millisecond precision.',
  },
  {
    num: '04',
    icon: BarChart3,
    color: '#16A34A',
    title: 'Results & Insights',
    desc: 'You get a visual performance comparison, memory analysis, and rule-based optimization suggestions — all in one view.',
  },
];

const FEATURES = [
  {
    icon: Zap,
    color: '#2563EB',
    title: 'Four Optimization Levels',
    desc: 'See exactly how -O0, -O1, -O2, and -O3 affect your code. Understand loop unrolling, vectorization, and dead code elimination.',
  },
  {
    icon: Activity,
    color: '#16A34A',
    title: 'Real-Time Benchmarking',
    desc: 'No synthetic estimates — your code actually runs. Wall-clock time and peak RSS memory are measured on each execution.',
  },
  {
    icon: ShieldCheck,
    color: '#D97706',
    title: 'Static Analysis Engine',
    desc: 'Our rule engine detects common pitfalls: global variables, missing reserve() calls, endl overhead, excessive I/O in loops, and more.',
  },
  {
    icon: Box,
    color: '#8B949E',
    title: 'Secure Sandbox',
    desc: 'All code runs in isolated Docker containers with resource limits. Infinite loops are killed via timeout. Your code is never shared.',
  },
];

const About = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg">

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)', padding: '60px 80px 48px' }}>
        <div style={{ maxWidth: 700 }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 32, height: 3, background: '#2563EB', borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>How It Works</span>
          </div>
          <h1 style={{ fontSize: 36, color: '#E6EDF3', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Understand Your Code's<br />True Performance
          </h1>
          <p style={{ fontSize: 16, color: '#8B949E', lineHeight: 1.7, maxWidth: 560 }}>
            CPP Analyzer compiles your C++ code at four optimization levels, benchmarks each binary in a secure sandbox,
            and delivers actionable insights — all in under 5 seconds.
          </p>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div style={{ padding: '48px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <div key={step.num}
              className="bg-card border border-border rounded-lg p-5 hover:border-text-dark transition-all"
              style={{ position: 'relative' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <span className="font-mono" style={{ fontSize: 28, fontWeight: 800, color: '#30363D' }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: '0 80px' }}>
        <div style={{ height: 1, background: '#30363D' }} />
      </div>

      {/* Features Grid */}
      <div style={{ padding: '48px 80px' }}>
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width: 32, height: 3, background: '#16A34A', borderRadius: 2 }} />
          <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capabilities</span>
        </div>
        <h2 style={{ fontSize: 26, color: '#E6EDF3', fontWeight: 800, marginBottom: 8 }}>Built for C++ Developers</h2>
        <p style={{ fontSize: 15, color: '#8B949E', marginBottom: 32, maxWidth: 500 }}>
          Whether you're optimizing game engines, embedded systems, or competitive programming solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="bg-card border border-border rounded-lg p-5 flex gap-4 hover:border-text-dark transition-all">
              <div className="flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{ width: 44, height: 44, background: `${feat.color}12`, border: `1px solid ${feat.color}25` }}>
                <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 700, marginBottom: 6 }}>{feat.title}</h3>
                <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Bar */}
      <div style={{ padding: '0 80px 48px' }}>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 style={{ fontSize: 14, color: '#8B949E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Compiler', value: 'GCC 13.2 (g++)' },
              { label: 'Backend', value: 'Python / FastAPI' },
              { label: 'Engine', value: 'C++ / Docker' },
              { label: 'Frontend', value: 'React / Vite' },
            ].map((item) => (
              <div key={item.label} className="bg-bg border border-border rounded-md p-3">
                <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                <div className="font-mono" style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '32px 80px 64px', textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, color: '#E6EDF3', fontWeight: 700, marginBottom: 16 }}>Ready to benchmark your code?</h3>
        <Link to="/"
          className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ padding: '12px 28px', background: '#2563EB', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
          Open the Analyzer <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default About;
