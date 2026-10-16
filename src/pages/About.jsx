import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    <article className="post-single">
      <header className="post-header">
        <h1 className="post-title">About me</h1>
        <div className="post-meta">
          <span>Nguyen Huynh Huy Man</span>
          <span>&nbsp;·&nbsp;</span>
          <span>DevOps &amp; Cloud Platform Engineer</span>
          <span>&nbsp;·&nbsp;</span>
          <span>Ho Chi Minh City</span>
        </div>
      </header>

      {/* Intro & Contact Block */}
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ marginBottom: '14px', lineHeight: '1.75' }}>
          I'm a DevOps &amp; Cloud Platform Engineer based in Ho Chi Minh City, Viet Nam.
          With 3+ years of engineering experience, I specialize in automating cloud infrastructure,
          orchestrating multi-tenant Kubernetes clusters, designing GitOps pipelines with Argo CD and GitHub ARC,
          and deploying enterprise AI infrastructure (LiteLLM, Langfuse, OpenBao).
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14.5px', color: 'var(--secondary)' }}>
          <span>📍 Ho Chi Minh City, Viet Nam</span>
          <a href="https://github.com/huymanmt" target="_blank" rel="noopener noreferrer">
            🐙 GitHub: github.com/huymanmt
          </a>
          <a href="https://linkedin.com/in/mannguyen99" target="_blank" rel="noopener noreferrer">
            💼 LinkedIn: linkedin.com/in/mannguyen99
          </a>
          <a href="mailto:man28081999@gmail.com">
            ✉️ Email: man28081999@gmail.com
          </a>
        </div>
      </div>

      {/* Full Profile Content (Certifications, Experience, Skills, Awards, Education) */}
      <div
        ref={contentRef}
        className="post-content rst-body"
        dangerouslySetInnerHTML={{ __html: about.contentHtml || '<p>Loading profile...</p>' }}
      />
    </article>
  );
}
