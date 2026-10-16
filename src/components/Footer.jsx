import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-copyright">
          <span>&copy; {currentYear} <strong>huymanmt</strong></span>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/huymanmt"
            className="footer-link-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/mannguyen99"
            className="footer-link-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="mailto:man28081999@gmail.com"
            className="footer-link-item"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
