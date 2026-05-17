import { Link, useLocation } from 'react-router';
import { Zap } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="h-14 border-b border-[#30363D] bg-[#161B22] px-6 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity">
        <Zap className="w-5 h-5 text-[#2563EB]" />
        <span className="text-[#E6EDF3] font-bold">cpp</span>
        <span className="text-[#8B949E] font-normal">analyzer</span>
      </Link>

      <nav className="flex items-center gap-8">
        <Link
          to="/"
          className={`text-sm transition-colors pb-0.5 border-b-2 ${
            isActive('/')
              ? 'text-[#E6EDF3] border-[#2563EB]'
              : 'text-[#8B949E] hover:text-[#E6EDF3] border-transparent'
          }`}
        >
          Analyzer
        </Link>
        <Link
          to="/examples"
          className={`text-sm transition-colors pb-0.5 border-b-2 ${
            isActive('/examples')
              ? 'text-[#E6EDF3] border-[#2563EB]'
              : 'text-[#8B949E] hover:text-[#E6EDF3] border-transparent'
          }`}
        >
          Examples
        </Link>
        <Link
          to="/docs"
          className={`text-sm transition-colors pb-0.5 border-b-2 ${
            isActive('/docs')
              ? 'text-[#E6EDF3] border-[#2563EB]'
              : 'text-[#8B949E] hover:text-[#E6EDF3] border-transparent'
          }`}
        >
          Docs
        </Link>
        <Link
          to="/pricing"
          className={`text-sm transition-colors pb-0.5 border-b-2 ${
            isActive('/pricing')
              ? 'text-[#E6EDF3] border-[#2563EB]'
              : 'text-[#8B949E] hover:text-[#E6EDF3] border-transparent'
          }`}
        >
          Pricing
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <button className="px-4 py-1.5 text-sm text-[#E6EDF3] hover:text-white transition-colors">
          Sign In
        </button>
        <button className="px-4 py-1.5 text-sm bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors">
          Get Pro
        </button>
      </div>
    </header>
  );
}
