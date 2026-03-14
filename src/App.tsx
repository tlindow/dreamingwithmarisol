import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContentProvider } from './content/ContentContext';
import Home from './pages/Home';
import About from './pages/About';
import Healings from './pages/Healings';
import Values from './pages/Values';
import OnlineHealings from './pages/OnlineHealings';
import Pricing from './pages/Pricing';
import LearningHub from './pages/LearningHub';
import ModuleDetail from './pages/ModuleDetail';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import ContentEditor from './pages/ContentEditor';

function App() {
  return (
    <ContentProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/healings" element={<Healings />} />
              <Route path="/values" element={<Values />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/learning/:id" element={<ModuleDetail />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:id" element={<ProductDetail />} />
              <Route path="/online-healings" element={<OnlineHealings />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/content" element={<ContentEditor />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;
