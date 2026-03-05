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
import { triggerPreviewRefresh } from './lib/previewRefresh';

function VisualEditingBridge() {
  useEffect(() => {
    return enableVisualEditing({
      // When Sanity Studio signals a mutation or a manual refresh, re-fetch all
      // active queries without a full page reload. If a live-preview loader is
      // already connected (livePreviewEnabled), let it handle the update instead.
      refresh: (payload) => {
        // When a live-preview loader is connected it handles its own updates.
        if (payload.livePreviewEnabled) return false;
        // Otherwise re-fetch all active queries and suppress the default full
        // page reload that the SDK would otherwise trigger.
        return new Promise<void>((resolve) => {
          triggerPreviewRefresh();
          resolve();
        });
      },
    });
  }, []);
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
