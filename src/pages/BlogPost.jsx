import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import contentData from '../data/content.json';

export default function BlogPost() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  const post = (contentData.posts || []).find((p) => p.slug === slug);

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
  }, [post]);

  if (!post) {
    return (
      <div className="page-container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={16} /> Back to writing
        </Link>
        <h1>Article Not Found</h1>
        <p>The requested technical article could not be located.</p>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="post-container">
      <Link to="/blog" className="back-link">
        <ArrowLeft size={16} /> Back to writing
      </Link>

      <header className="post-header">
        <h1 className="post-main-title">{post.title}</h1>
        <div className="post-meta-bar">
          <time>{formattedDate}</time>
          <span className="meta-dot">·</span>
          <span>{post.category}</span>
          <span className="meta-dot">·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {post.readingTime}
          </span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="tags-bar">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        ref={contentRef}
        className="rst-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="post-author-box">
        <p>
          Written by <strong>Huy Man</strong> (
          <a
            href="https://github.com/huymanmt"
            target="_blank"
            rel="noopener noreferrer"
          >
            @huymanmt
          </a>
          ). DevOps &amp; Cloud Platform Engineer. Have questions or insights? Reach out via{' '}
          <a
            href="https://linkedin.com/in/mannguyen99"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{' '}
          or <a href="mailto:man28081999@gmail.com">Email</a>.
        </p>
      </div>
    </article>
  );
}
