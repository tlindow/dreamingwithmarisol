import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Healings from './pages/Healings';
import Values from './pages/Values';
import OnlineHealings from './pages/OnlineHealings';
import Pricing from './pages/Pricing';
import LearningHub from './pages/LearningHub';
import ModuleDetail from './pages/ModuleDetail';
import Store from './pages/Store';

import { enableVisualEditing } from '@sanity/visual-editing';

function VisualEditingBridge() {
  useEffect(() => enableVisualEditing(), []);
  return null;
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <VisualEditingBridge />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/healings" element={<Healings />} />
            <Route path="/values" element={<Values />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/learning/:id" element={<ModuleDetail />} />
            <Route path="/store" element={<Store />} />
            <Route path="/online-healings" element={<OnlineHealings />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
