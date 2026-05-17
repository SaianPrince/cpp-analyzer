import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/**
 * Page Components (Placeholders for now)
 */
import Home from './pages/Home';
import Result from './pages/Result';
const Examples = () => <div className="container"><h1>C++ Code Examples</h1></div>;
import About from './pages/About';
const Privacy = () => <div className="container"><h1>Privacy Policy</h1></div>;
const Contact = () => <div className="container"><h1>Contact Support</h1></div>;

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        
        <main className="content">
          <Routes>
            {/* Main Application Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/result/:id" element={<Result />} />
            <Route path="/examples" element={<Examples />} />
            
            {/* Legal & Info Routes (Required for AdSense) */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
