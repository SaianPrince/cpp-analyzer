import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, Loader2, AlertCircle, ArrowRight, Check } from 'lucide-react';

const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColors = ['#30363D', '#DC2626', '#D97706', '#D97706', '#16A34A', '#16A34A'];

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, username, password);
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
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: '#8B949E', textAlign: 'center', marginBottom: 28 }}>
            Start analyzing C++ code with a free account
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-md p-3 mb-5"
              style={{ background: '#DC262615', border: '1px solid #DC262630' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
              <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4B5563' }} />
                <input
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                  placeholder="johndoe"
                  className="w-full rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#30363D'}
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="flex gap-1" style={{ marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{
                        height: 3,
                        flex: 1,
                        borderRadius: 2,
                        background: i <= strength ? strengthColors[strength] : '#30363D',
                        transition: 'background 200ms',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 500 }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4B5563' }} />
                <input
                  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full rounded-md pl-10 pr-3 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#30363D'}
                />
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#16A34A' }} />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: '#2563EB', color: '#fff', border: 'none', marginTop: 8 }}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Free plan info */}
          <div className="flex items-center gap-2 mt-5 rounded-md p-3"
            style={{ background: '#16A34A10', border: '1px solid #16A34A20' }}>
            <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#16A34A' }} />
            <span style={{ fontSize: 12, color: '#8B949E' }}>
              Free plan includes <strong style={{ color: '#E6EDF3' }}>10 analyses/day</strong> with rule-based suggestions
            </span>
          </div>
        </div>

        {/* Footer link */}
        <p style={{ fontSize: 14, color: '#8B949E', textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
