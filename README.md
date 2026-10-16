# DevOps & Cloud Platform Portfolio & Technical Blog

A high-performance, developer-first static personal website and technical blog engineered with **React.js** and **Vite** for **Nguyen Huynh Huy Man (@huymanmt)**.

The architecture parses and renders content directly from **reStructuredText (`.rst`)** documents, manages static assets, and automatically deploys to **Firebase Hosting** using **GitHub Actions**.

---

## 🏛️ Architecture & Tech Stack

```
self-app/
├── .github/workflows/
│   ├── firebase-hosting-merge.yml        # CI/CD: Automated build & deploy to Firebase Live
│   └── firebase-hosting-pull-request.yml  # CI/CD: Automated preview channels on PRs
├── content/
│   ├── pages/
│   │   └── about.rst                     # About Me page structured from PDF resume
│   ├── blog/
│   │   ├── building-scalable-k8s-gitops-argocd.rst     # Technical RST article
│   │   └── enterprise-ai-workflow-litellm-langfuse.rst # Technical RST article
│   ├── images/
│   │   ├── avatar.svg                    # Developer avatar
│   │   ├── k8s-gitops-diagram.svg        # Architecture SVG diagram
│   │   └── ai-workflow.svg               # AI workflow SVG diagram
│   └── extra/
│       ├── favicon.svg                   # Brand favicon
│       └── robots.txt                    # Search crawler directives
├── public/                               # Copied static assets (images, PDF resume, icons)
├── scripts/
│   └── compile-content.js                # Node.js RST compiler & metadata extraction
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                    # Header with >_ huymanmt brand, nav, theme toggle
│   │   └── Footer.jsx                    # Minimal footer: "© 2026 huymanmt"
│   ├── pages/
│   │   ├── Home.jsx                      # Hero with status, bio, cert pills, recent writing
│   │   ├── About.jsx                     # Rendered from about.rst with PDF resume download
│   │   ├── Blog.jsx                      # Filterable writing archive by tag
│   │   └── BlogPost.jsx                  # Single article view with code copy & reading time
│   ├── data/
│   │   └── content.json                  # Compiled RST data (generated automatically)
│   ├── styles/
│   │   └── index.css                     # DevOps color palette (Dark default, Slate/Cyan/Emerald)
│   ├── App.jsx                           # Client-side router & layout
│   └── main.jsx                          # React root entrypoint
├── firebase.json                         # Firebase Hosting configuration (dist/, SPA rewrites)
├── .firebaserc                           # Firebase project target (`huymanmt-a8fde`)
├── package.json                          # Node dependencies & build scripts
└── vite.config.js                        # Vite config with hot-reloading RST content watcher
```

---

## ⚡ Highlights & Key Features

1. **React.js + Vite Architecture:**
   - Instantaneous client-side transitions via `react-router-dom`.
   - Ultra-fast build times (< 300ms) with modern ES modules.
2. **Native reStructuredText (`.rst`) Pipeline:**
   - Content authoring remains in standard `.rst` format (`content/pages/` and `content/blog/`).
   - `scripts/compile-content.js` compiles `.rst` to semantic HTML with metadata extraction.
   - Vite includes a hot-reloading watcher for `.rst` files during local development.
3. **DevOps Profile Theme & Colors:**
   - Dark mode by default tailored for terminal/DevOps engineers: Deep Slate background (`#090d16`), Kubernetes Cyan (`#38bdf8`), and GitOps Emerald green (`#10b981`).
   - One-click dark/light mode toggle with preference persistence in `localStorage`.
   - Copy-to-clipboard button on all code blocks.
4. **Direct Resume Integration:**
   - Original resume (`NguyenHuynhHuyMan_DevOps_Engineer.pdf`) is hosted directly at `/resume.pdf`.
5. **Footer Branding:**
   - Displays `© 2026 huymanmt`.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server with live reload on http://localhost:3000
npm run dev

# 3. Build for production (compiles RST and bundles to dist/)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🔥 Continuous Deployment to Firebase Hosting

The repository is configured for Firebase project **`huymanmt-a8fde`**.

When you push changes to `main`:
1. GitHub Actions triggers [`.github/workflows/firebase-hosting-merge.yml`](.github/workflows/firebase-hosting-merge.yml).
2. It sets up Node.js 22, installs dependencies with `npm ci`.
3. Runs `npm run build` (which compiles `.rst` content and creates the production bundle in `dist/`).
4. Uses `FirebaseExtended/action-hosting-deploy` to publish live to **[https://huymanmt-a8fde.web.app](https://huymanmt-a8fde.web.app)**.
