import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Award } from 'lucide-react';
import contentData from '../data/content.json';

const CERTIFICATIONS = [
  'CKS (Security Specialist)',
  'CKA (Administrator)',
  'CKAD (Application Developer)',
  'GCP Professional Cloud Architect',
  'GCP Professional Cloud DevOps',
  'AWS Certified AI Practitioner',
];

export default function Home() {
  const posts = contentData.posts || [];

  return (
    <div className="home-page">
      {/* Hero / Intro */}
      <section className="hero-section">
        <div className="status-pill">
          <span className="status-indicator"></span>
          <span>Available for Cloud &amp; DevOps Engineering</span>
        </div>

        <div className="hero-main">
          <div className="hero-text">
            <h1 className="hero-title">
              Huy Man <span className="alias-badge">@huymanmt</span>
            </h1>
            <p className="hero-subtitle">
              DevOps &amp; Cloud Platform Engineer · Ho Chi Minh City
            </p>
          </div>
          <div className="hero-avatar">
            <img
              src="/images/avatar.svg"
              alt="huymanmt"
              width="76"
              height="76"
            />
          </div>
        </div>

        <p className="hero-bio">
          DevOps Engineer with 3+ years of experience in automating infrastructure,
          optimizing CI/CD pipelines, and managing multi-tenant Kubernetes clusters
          and enterprise AI workflows (LiteLLM, Langfuse, OpenBao).
        </p>

        <div className="hero-links">
          <Link to="/about" className="hero-action-link">
            &rarr; About Me
          </Link>
          <a
            href="mailto:man28081999@gmail.com"
            className="hero-action-link"
          >
            Email
          </a>
          <a
            href="https://github.com/huymanmt"
            className="hero-action-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/mannguyen99"
            className="hero-action-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* Certifications Bar */}
      <section className="cert-section">
        <h2 className="section-label">Certifications</h2>
        <div className="cert-grid">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert} className="cert-chip">
              <Award size={14} className="star-icon" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Writing Section */}
      <section className="posts-section">
        <div className="section-header-row">
          <h2 className="section-label">Writing</h2>
          <Link to="/blog" className="view-all-link">
            All posts &rarr;
          </Link>
        </div>

        <ul className="post-items-list">
          {posts.map((post) => (
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
          {posts.length === 0 && (
            <li className="post-row">No articles published yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
