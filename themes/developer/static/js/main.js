/**
 * Developer Theme JavaScript
 * Handles Theme Toggle (Dark/Light), Mobile Navigation, and Code Block Copying
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
        siteNav.classList.remove('open');
      }
    });
  }

  // 3. Code Block Copy to Clipboard
  const codeBlocks = document.querySelectorAll('pre, .highlight pre');
  codeBlocks.forEach((block) => {
    // Avoid double buttons
    if (block.querySelector('.copy-btn')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

    copyBtn.addEventListener('click', async () => {
      const codeText = block.innerText.replace(/^Copy\s+/, '');
      try {
        await navigator.clipboard.writeText(codeText);
        copyBtn.innerText = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        copyBtn.innerText = 'Failed';
        setTimeout(() => { copyBtn.innerText = 'Copy'; }, 2000);
      }
    });

    // Style button inside pre
    block.style.position = 'relative';
    block.appendChild(copyBtn);
  });
});
