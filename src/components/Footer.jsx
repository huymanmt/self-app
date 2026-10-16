import React, { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="footer">
        <span>&copy; {currentYear} <a href="/">huymanmt</a></span>
        <span>&middot;</span>
        <span>Theme <a href="https://git.io/hugopapermod" target="_blank" rel="noopener noreferrer">PaperMod</a></span>
      </footer>

      {showTopBtn && (
        <button
          className="top-link"
          id="top-link"
          type="button"
          onClick={scrollToTop}
          title="Go to Top"
          aria-label="Go to Top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 6" fill="currentColor">
            <path d="M12 6H0l6-6z" />
          </svg>
        </button>
      )}
    </>
  );
}
