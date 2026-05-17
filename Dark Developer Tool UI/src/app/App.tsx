import { BrowserRouter, Routes, Route } from 'react-router';
import { Header } from './components/Header';
import { EditorPage } from './components/EditorPage';
import { ResultsPage } from './components/ResultsPage';
import { ExamplesPage } from './components/ExamplesPage';
import { PricingPage } from './components/PricingPage';
import { DocsPage } from './components/DocsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#0D1117]">
        <Header />
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}