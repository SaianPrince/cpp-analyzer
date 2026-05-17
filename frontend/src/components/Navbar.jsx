import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
        <button className="px-4 py-1.5 text-sm text-text hover:text-white transition-colors bg-transparent border-none">
          Sign In
        </button>
        <button className="px-4 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors border-none font-medium">
          Get Pro
        </button>
      </div>
    </header>
  );
};

export default Navbar;
