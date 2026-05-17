import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Result from './pages/Result';
import Examples from './pages/Examples';
import Pricing from './pages/Pricing';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
