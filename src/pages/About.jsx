import React, { useEffect, useRef } from 'react';
import contentData from '../data/content.json';

export default function About() {
  const contentRef = useRef(null);
  const about = contentData.about || {};

  useEffect(() => {
    if (!contentRef.current) return;
    const blocks = contentRef.current.querySelectorAll('pre, .highlight pre, pre.literal-block');
    blocks.forEach((block) => {
      if (block.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerText = 'Copy';
      btn.onclick = async () => {
        const text = block.innerText.replace(/^Copy\s+/, '');
        await navigator.clipboard.writeText(text);
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerText = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      };
      block.style.position = 'relative';
      block.appendChild(btn);
    });
  }, [about]);

  return (
    <article className="page-container">
      <header className="page-header">
        <h1 className="page-main-title">{about.title || 'About Me'}</h1>
      </header>

      <div
        ref={contentRef}
        className="rst-body"
        dangerouslySetInnerHTML={{ __html: about.contentHtml || '<p>Loading about content...</p>' }}
      />
    </article>
  );
}
