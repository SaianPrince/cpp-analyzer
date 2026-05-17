import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={scrollToTop}>
          <Cpu className="icon-purple" />
          <span>CPP<span className="text-gradient">Analyzer</span></span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={scrollToTop}>Editor</Link>
          <Link to="/examples" className="nav-link">Examples</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/" className="btn-primary" style={{textDecoration: 'none'}} onClick={scrollToTop}>Analyze Now</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
