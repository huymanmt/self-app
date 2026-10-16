import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="main">
          <Routes>
            {/* Default Landing Page: Short intro & latest blog posts */}
            <Route path="/" element={<Home />} />
            
            {/* Unified Blog Page: Articles with Search & Tag Filtering */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Backwards compatible aliases for search & tags -> unified Blog */}
            <Route path="/search" element={<Blog />} />
            <Route path="/tags" element={<Blog />} />
            <Route path="/tags/:tag" element={<Blog />} />

            {/* About me (Full Profile) */}
            <Route path="/about" element={<About />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
