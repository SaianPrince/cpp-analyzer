import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-14 border-b border-border bg-bg-secondary px-6 flex items-center justify-between flex-shrink-0 z-10"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
      
      <Link to="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity">
        <Zap className="w-5 h-5 text-accent" />
        <span className="text-text font-bold text-base">cpp</span>
        <span className="text-text-muted font-normal text-base">analyzer</span>
      </Link>

      <nav className="flex items-center gap-8">
        {[
          { path: '/', label: 'Analyzer' },
          { path: '/examples', label: 'Examples' },
          { path: '/about', label: 'About' },
          { path: '/pricing', label: 'Pricing' },
          { path: '/privacy', label: 'Privacy' },
          { path: '/contact', label: 'Contact' },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`text-sm transition-colors pb-0.5 border-b-2 ${
              isActive(path)
                ? 'text-text border-accent'
                : 'text-text-muted hover:text-text border-transparent'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* User info */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{ background: '#161B22', border: '1px solid #30363D' }}>
              <div className="flex items-center justify-center rounded-full"
                style={{ width: 24, height: 24, background: '#2563EB20', border: '1px solid #2563EB40' }}>
                <User className="w-3 h-3" style={{ color: '#2563EB' }} />
              </div>
              <span className="text-sm text-text font-medium">{user.username}</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-semibold uppercase"
                style={{
                  fontSize: 10,
                  color: user.plan === 'pro' ? '#16A34A' : '#D97706',
                  background: user.plan === 'pro' ? '#16A34A15' : '#D9770615',
                  border: `1px solid ${user.plan === 'pro' ? '#16A34A30' : '#D9770630'}`,
                }}>
                {user.plan}
              </span>
            </div>
            {/* Logout */}
            <button onClick={handleLogout}
              className="p-1.5 text-text-muted hover:text-text transition-colors bg-transparent border-none"
              title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="px-4 py-1.5 text-sm text-text hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register"
              className="px-4 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors font-medium">
              Get Pro
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
