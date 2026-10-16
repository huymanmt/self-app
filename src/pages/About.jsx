import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import contentData from '../data/content.json';

export default function About() {
  const contentRef = useRef(null);
  const about = contentData.about || {};
  const posts = contentData.posts || [];

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
      {/* Header Profile Title */}
      <header className="hero-section" style={{ marginBottom: '1.5rem' }}>
        <div className="hero-main">
          <div className="hero-text">
            <h1 className="hero-title" style={{ marginBottom: '0.25rem' }}>
              Nguyen Huynh Huy Man
            </h1>
            <p className="hero-subtitle">
              DevOps &amp; Cloud Platform Engineer · Ho Chi Minh City
            </p>
          </div>
        </div>
      </header>

      {/* Compiled RST Content (About me, Certs, Experience, Skills, Awards, Education) */}
      <div
        ref={contentRef}
        className="rst-body"
        dangerouslySetInnerHTML={{ __html: about.contentHtml || '<p>Loading profile...</p>' }}
      />

      {/* Recent Writing Section at the bottom */}
      <section className="posts-section" style={{ marginTop: '3.5rem' }}>
        <div className="section-header-row">
          <h2 className="section-label">Recent Writing</h2>
          <Link to="/blog" className="view-all-link">
            All posts &rarr;
          </Link>
        </div>

        <ul className="post-items-list">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug} className="post-row">
              <time className="post-row-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <Link to={`/blog/${post.slug}`} className="post-row-title">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
