import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import contentData from '../data/content.json';

export default function BlogPost() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  const post = (contentData.posts || []).find((p) => p.slug === slug);

  useEffect(() => {
    if (!contentRef.current) return;
    const blocks = contentRef.current.querySelectorAll('pre, .highlight pre, pre.literal-block');
    blocks.forEach((block) => {
      if (block.parentElement?.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerText = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.onclick = async () => {
        const text = block.innerText.trim();
        await navigator.clipboard.writeText(text);
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerText = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      };

      wrapper.appendChild(btn);
    });
  }, [post]);

  if (!post) {
    return (
      <article className="post-single">
        <Link to="/" className="back-link">&larr; Back to posts</Link>
        <h1>Article Not Found</h1>
        <p>The requested technical article could not be located.</p>
      </article>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="post-single">
      <Link to="/blog" className="back-link">&larr; Back to blog</Link>

      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>{formattedDate}</span>
          <span>&nbsp;·&nbsp;</span>
          <span>{post.readingTime}</span>
          <span>&nbsp;·&nbsp;</span>
          <span>huymanmt</span>
          {post.category && (
            <>
              <span>&nbsp;·&nbsp;</span>
              <span>{post.category}</span>
            </>
          )}
        </div>
      </header>

      <div
        ref={contentRef}
        className="post-content rst-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {post.tags && post.tags.length > 0 && (
        <footer className="post-footer" style={{ marginTop: '32px' }}>
          <div className="entry-tags">
            {post.tags.map((tag) => (
              <Link to={`/blog?tag=${tag}`} key={tag} className="entry-tag-pill">#{tag}</Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
