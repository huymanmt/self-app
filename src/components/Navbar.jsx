import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, FileText } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-prompt">&gt;_</span>
          <span className="brand-name">huymanmt</span>
        </Link>

        <nav className="site-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' || location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            to="/blog"
            className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
          >
            Blog
          </Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Dark/Light Mode"
            title="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
