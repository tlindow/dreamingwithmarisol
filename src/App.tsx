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
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';

import { VisualEditing } from '@sanity/visual-editing/react';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <VisualEditing portal />
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
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            {/* Fallback for unbuilt pages */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
