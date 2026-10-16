import React from 'react';
import { Link } from 'react-router-dom';
import contentData from '../data/content.json';

export default function Home() {
  const posts = contentData.posts || [];

  return (
    <div className="home-container">
      {/* PaperMod Home Info Card (Short Introduction) */}
      <article className="first-entry home-info">
        <header className="entry-header">
          <h1>Nguyen Huynh Huy Man</h1>
          <div className="profile-role">
            DevOps &amp; Cloud Platform Engineer · Ho Chi Minh City
          </div>
        </header>

        <section className="entry-content">
          <p>
            👋 Hello! I'm a DevOps &amp; Cloud Platform Engineer based in Ho Chi Minh City, Viet Nam.
            With 3+ years of engineering experience, I specialize in automating cloud infrastructure,
            orchestrating multi-tenant Kubernetes clusters, designing GitOps pipelines with Argo CD and GitHub ARC,
            and deploying enterprise AI infrastructure (LiteLLM, Langfuse, OpenBao).
          </p>
        </section>

        <footer className="entry-footer">
          <div className="social-icons">
            <a href="https://github.com/huymanmt" target="_blank" rel="noopener noreferrer">
              🐙 GitHub
            </a>
            <a href="https://linkedin.com/in/mannguyen99" target="_blank" rel="noopener noreferrer">
              💼 LinkedIn
            </a>
            <a href="mailto:man28081999@gmail.com">
              ✉️ Email
            </a>
            <Link to="/blog" style={{ fontWeight: '500' }}>
              📝 Technical Blog &rarr;
            </Link>
            <Link to="/about" style={{ fontWeight: '500' }}>
              👨‍💻 About me &rarr;
            </Link>
          </div>
        </footer>
      </article>

      {/* List of Blog Posts (PaperMod .post-entry cards) */}
      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.slug} className="post-entry">
            <header className="entry-header">
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
            </header>
            <section className="entry-content">
              <p>{post.summary}</p>
            </section>
            <footer className="entry-footer">
              <span>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>&nbsp;·&nbsp;</span>
              <span>{post.readingTime}</span>
              <span>&nbsp;·&nbsp;</span>
              <span>huymanmt</span>
            </footer>
            {post.tags && (
              <div className="entry-tags">
                {post.tags.map((t) => (
                  <Link key={t} to={`/blog?tag=${t}`} className="entry-tag-pill">
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}

        {posts.length === 0 && (
          <p style={{ color: 'var(--secondary)', padding: '20px 0' }}>
            No blog posts published yet.
          </p>
        )}
      </div>
    </div>
  );
}
