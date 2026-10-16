/**
 * Minimalist Theme JavaScript for @huymanmt
 * Theme toggle (Dark/Light) & Code Block Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Code Block Copy to Clipboard
  const codeBlocks = document.querySelectorAll('pre, .highlight pre, pre.literal-block');
  codeBlocks.forEach((block) => {
    if (block.querySelector('.copy-btn')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code');

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

    block.style.position = 'relative';
    block.appendChild(copyBtn);
  });
});
