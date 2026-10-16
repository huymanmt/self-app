import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import contentData from '../data/content.json';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tag: tagParam } = useParams();
  const inputRef = useRef(null);
  const posts = contentData.posts || [];

  // Read query & tag from URL search params or route params
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || tagParam || null;

  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);

  // Sync state if URL search parameters or route params change externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedTag(searchParams.get('tag') || tagParam || null);
  }, [searchParams, tagParam]);

  // Keyboard shortcut Alt + / or / to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey && e.key === '/') || (e.key === '/' && document.activeElement !== inputRef.current)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute tag counts
  const { allTags, tagCounts } = useMemo(() => {
    const counts = {};
    posts.forEach((p) => {
      (p.tags || []).forEach((t) => {
        const lower = t.toLowerCase();
        counts[lower] = (counts[lower] || 0) + 1;
      });
    });
    return {
      allTags: Object.keys(counts).sort(),
      tagCounts: counts,
    };
  }, [posts]);

  // Update URL params helper
  const updateFilters = (newQuery, newTag) => {
    const params = new URLSearchParams();
    if (newQuery && newQuery.trim()) {
      params.set('q', newQuery.trim());
    }
    if (newTag) {
      params.set('tag', newTag.toLowerCase());
    }
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    updateFilters(val, selectedTag);
  };

  const handleClearSearch = () => {
    setQuery('');
    updateFilters('', selectedTag);
    inputRef.current?.focus();
  };

  const handleTagClick = (tag) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    updateFilters(query, nextTag);
  };

  const handleClearAllFilters = () => {
    setQuery('');
    setSelectedTag(null);
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  // Filter posts by both query and tag
  const filteredPosts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return posts.filter((post) => {
      // 1. Tag filter match
      if (selectedTag) {
        const postTags = (post.tags || []).map((t) => t.toLowerCase());
        if (!postTags.includes(selectedTag.toLowerCase())) {
          return false;
        }
      }

      // 2. Query filter match
      if (trimmed) {
        const titleMatch = post.title?.toLowerCase().includes(trimmed);
        const summaryMatch = post.summary?.toLowerCase().includes(trimmed);
        const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(trimmed));
        const categoryMatch = post.category?.toLowerCase().includes(trimmed);
        return titleMatch || summaryMatch || tagMatch || categoryMatch;
      }

      return true;
    });
  }, [posts, query, selectedTag]);

  const hasActiveFilter = Boolean(query.trim() || selectedTag);

  return (
    <div className="blog-archive">
      {/* Page Header */}
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h1 className="post-title" style={{ fontSize: '32px', marginBottom: '8px' }}>
          Blog
        </h1>
        <p style={{ color: 'var(--secondary)', fontSize: '15px', margin: 0 }}>
          Technical articles, deep dives, and tutorials on DevOps, Cloud Platform, and AI Engineering.
        </p>

        {/* Combined Search Box */}
        <div id="searchbox" style={{ marginTop: '20px', position: 'relative' }}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search articles by title, topic, or keyword... (Alt + /)"
            aria-label="Search articles"
            autoComplete="off"
            style={{
              padding: '12px 42px 12px 16px',
              width: '100%',
              color: 'var(--primary)',
              background: 'var(--entry)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '15.5px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
          />
          {query && (
            <button
              onClick={handleClearSearch}
              type="button"
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--secondary)',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                fontSize: '13px',
                color: 'var(--secondary)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <span>🏷️ Filter by Tag:</span>
            </div>

            <div className="tag-filter-list" style={{ marginBottom: 0 }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedTag(null);
                  updateFilters(query, null);
                }}
                className={`tag-btn ${selectedTag === null ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: selectedTag === null ? '600' : '400',
                }}
              >
                <span>All</span>
                <span
                  style={{
                    fontSize: '11px',
                    opacity: 0.8,
                    background: 'var(--code-bg)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {posts.length}
                </span>
              </button>

              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`tag-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    <span>#{tag}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        opacity: 0.8,
                        background: 'var(--code-bg)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {tagCounts[tag]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Status & Reset */}
        {hasActiveFilter && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: 'var(--entry)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: 'var(--secondary)',
            }}
          >
            <span>
              Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
              {query && (
                <>
                  {' '}matching &ldquo;<strong>{query}</strong>&rdquo;
                </>
              )}
              {selectedTag && (
                <>
                  {' '}tagged &ldquo;<strong>#{selectedTag}</strong>&rdquo;
                </>
              )}
            </span>
            <button
              onClick={handleClearAllFilters}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '13.5px',
                padding: '2px 6px',
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </header>

      {/* Filtered Posts List */}
      <div className="posts-container">
        {filteredPosts.map((post) => (
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
              {post.category && (
                <>
                  <span>&nbsp;·&nbsp;</span>
                  <span>{post.category}</span>
                </>
              )}
            </footer>
            {post.tags && post.tags.length > 0 && (
              <div className="entry-tags">
                {post.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTagClick(t.toLowerCase())}
                    className="entry-tag-pill"
                    style={{
                      cursor: 'pointer',
                      border: selectedTag === t.toLowerCase() ? '1px solid var(--primary)' : '1px solid var(--border)',
                      fontWeight: selectedTag === t.toLowerCase() ? '600' : '400',
                      color: selectedTag === t.toLowerCase() ? 'var(--primary)' : 'var(--secondary)',
                    }}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--entry)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              marginTop: '16px',
            }}
          >
            <p style={{ color: 'var(--primary)', fontSize: '17px', fontWeight: '500', marginBottom: '8px' }}>
              No matching articles found
            </p>
            <p style={{ color: 'var(--secondary)', fontSize: '14.5px', marginBottom: '16px' }}>
              We couldn't find any articles matching your search query or tag filters.
            </p>
            <button
              onClick={handleClearAllFilters}
              type="button"
              className="tag-btn"
              style={{
                padding: '8px 18px',
                fontSize: '14px',
                fontWeight: '500',
                background: 'var(--primary)',
                color: 'var(--theme)',
                borderColor: 'var(--primary)',
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
