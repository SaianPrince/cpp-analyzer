import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="logo">
          <Cpu className="icon-purple" />
          <span>CPP<span className="text-gradient">Analyzer</span></span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Editor</Link>
          <Link to="/examples" className="nav-link">Examples</Link>
          <Link to="/about" className="nav-link">About</Link>
          <button className="btn-primary">Analyze Now</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
