import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import contentData from '../data/content.json';

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState(null);
  const posts = contentData.posts || [];

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags && p.tags.includes(selectedTag))
    : posts;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-main-title">Writing</h1>
        <p className="hero-subtitle">
          Articles on DevOps, Kubernetes, Cloud Architecture, and AI Engineering.
        </p>

        {allTags.length > 0 && (
          <div className="tags-bar">
            <button
              onClick={() => setSelectedTag(null)}
              className={`tag-badge ${selectedTag === null ? 'active' : ''}`}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              #all ({posts.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`tag-badge ${selectedTag === tag ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: selectedTag === tag ? 'var(--accent)' : undefined,
                  color: selectedTag === tag ? '#ffffff' : undefined,
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      <ul className="post-items-list">
        {filteredPosts.map((post) => (
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
        {filteredPosts.length === 0 && (
          <li className="post-row">No articles found matching #{selectedTag}.</li>
        )}
      </ul>
    </div>
  );
}
