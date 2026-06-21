import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-bg overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #161B22 0%, #0D1117 40%, #0D1117 100%)' }}>

      <div style={{ width: '100%', maxWidth: 420, padding: '40px 0' }}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <Zap className="w-6 h-6 text-accent" />
          <span style={{ fontSize: 22, color: '#E6EDF3', fontWeight: 700 }}>cpp</span>
          <span style={{ fontSize: 22, color: '#8B949E', fontWeight: 400 }}>analyzer</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 style={{ fontSize: 24, color: '#E6EDF3', fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', textAlign: 'center', marginBottom: 28 }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-md p-3 mb-5"
              style={{ background: '#DC262615', border: '1px solid #DC262630' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
              <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4B5563' }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#30363D'}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4B5563' }} />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#30363D'}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: '#2563EB', color: '#fff', border: 'none', marginTop: 8 }}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p style={{ fontSize: 14, color: '#8B949E', textAlign: 'center', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563EB', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
