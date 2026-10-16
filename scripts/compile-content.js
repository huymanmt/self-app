import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RstToHtmlCompiler } from 'rst-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content');
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(rootDir, 'src', 'data');

// Ensure destination directories exist
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'images'), { recursive: true });

const compiler = new RstToHtmlCompiler();

/**
 * Parse metadata fields and title from .rst file
 */
function parseRstFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const lines = rawContent.split(/\r?\n/);

  let title = '';
  let titleFound = false;
  const metadata = {};
  const bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';

    // Detect RST title underlines (### or === or ---)
    if (!titleFound && nextLine && /^[#=\-~^]{3,}$/.test(nextLine) && line.trim().length > 0) {
      title = line.trim();
      titleFound = true;
      i++; // Skip underline
      continue;
    }

    // Detect field lists (:field: value)
    const fieldMatch = line.match(/^:([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (fieldMatch) {
      const key = fieldMatch[1].toLowerCase();
      let value = fieldMatch[2].trim();

      // Handle multiline field values if indented
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1])) {
        i++;
        value += ' ' + lines[i].trim();
      }

      if (key === 'tags') {
        metadata[key] = value.split(',').map((t) => t.trim().toLowerCase());
      } else {
        metadata[key] = value;
      }
      continue;
    }

    bodyLines.push(line);
  }

  // Fallback title from metadata if available
  if (metadata.title) {
    title = metadata.title;
  }

  // Pre-process body to replace {static}/ paths with absolute web paths
  let processedBody = bodyLines.join('\n');
  processedBody = processedBody.replace(/\{static\}\/images\//g, '/images/');
  processedBody = processedBody.replace(/\{static\}\/resume\.pdf/g, '/resume.pdf');
  processedBody = processedBody.replace(/\{static\}\/extra\/resume\.pdf/g, '/resume.pdf');

  // Compile RST to HTML
  let contentHtml = '';
  try {
    const compiled = compiler.compile(processedBody);
    contentHtml = compiled.body;
  } catch (err) {
    console.warn(`[Warning] Failed to compile RST for ${filePath}:`, err.message);
    contentHtml = `<div class="rst-error">Error compiling content: ${err.message}</div>`;
  }

  // Post-process HTML: ensure img paths work with /images/
  contentHtml = contentHtml.replace(/src="images\//g, 'src="/images/');
  contentHtml = contentHtml.replace(/src="\{static\}\/images\//g, 'src="/images/');

  // Estimate reading time (approx 200 words/min)
  const plainText = bodyLines.join(' ').replace(/[^a-zA-Z0-9\s]/g, ' ');
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title: title || path.basename(filePath, '.rst'),
    slug: metadata.slug || path.basename(filePath, '.rst'),
    date: metadata.date || '2026-10-16',
    category: metadata.category || 'General',
    tags: metadata.tags || [],
    author: metadata.author || 'huymanmt',
    summary: metadata.summary || '',
    readingTime: `${readingTime} min read`,
    contentHtml,
  };
}

// 1. Process About Me page
const aboutRstPath = path.join(contentDir, 'pages', 'about.rst');
let aboutData = null;
if (fs.existsSync(aboutRstPath)) {
  aboutData = parseRstFile(aboutRstPath);
  console.log('✓ Compiled About page from .rst');
}

// 2. Process Blog posts
const blogDir = path.join(contentDir, 'blog');
const posts = [];
if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.rst'));
  for (const file of files) {
    const postData = parseRstFile(path.join(blogDir, file));
    posts.push(postData);
  }
  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log(`✓ Compiled ${posts.length} blog posts from .rst`);
}

// 3. Write data to src/data/content.json
const outputData = {
  about: aboutData,
  posts,
};
fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify(outputData, null, 2), 'utf8');
console.log('✓ Generated src/data/content.json');

// 4. Copy assets into public directory
const imagesDir = path.join(contentDir, 'images');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  for (const img of images) {
    fs.copyFileSync(path.join(imagesDir, img), path.join(publicDir, 'images', img));
  }
  console.log(`✓ Copied ${images.length} images to public/images/`);
}

const extraDir = path.join(contentDir, 'extra');
if (fs.existsSync(extraDir)) {
  const extras = fs.readdirSync(extraDir).filter((f) => !f.endsWith('.pdf'));
  for (const extra of extras) {
    fs.copyFileSync(path.join(extraDir, extra), path.join(publicDir, extra));
  }
}
console.log('✓ Content compilation complete (without PDF uploads)!');
