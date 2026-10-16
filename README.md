# DevOps & Cloud Platform Portfolio & Technical Blog

A high-performance, developer-first static personal website and technical blog engineered for **Nguyen Huynh Huy Man** (DevOps Engineer & Cloud Architect).

The architecture is built from the ground up to render natively from **reStructuredText (`.rst`)** documents, serve optimized media assets, and continuously deploy to **Firebase Hosting** through **GitHub Actions**.

---

## 🏗 Architecture Overview

```
self-app/
├── .github/
│   └── workflows/
│       └── firebase-deploy.yml      # CI/CD automated build & deploy pipeline
├── content/
│   ├── pages/
│   │   └── about.rst               # About Me page (structured from PDF resume)
│   ├── blog/
│   │   ├── building-scalable-k8s-gitops-argocd.rst     # Technical post (.rst)
│   │   └── enterprise-ai-workflow-litellm-langfuse.rst # Technical post (.rst)
│   ├── images/
│   │   ├── avatar.svg              # Developer profile avatar
│   │   ├── k8s-gitops-diagram.svg  # Architecture SVG diagram
│   │   └── ai-workflow.svg         # AI workflow SVG diagram
│   ├── extra/
│   │   ├── favicon.svg             # Website icon
│   │   ├── robots.txt              # SEO crawler directives
│   │   └── resume.pdf              # Downloadable PDF CV (from provided PDF)
│   └── resume.pdf
├── themes/
│   └── developer/                  # Custom responsive developer theme
│       ├── templates/
│       │   ├── base.html           # Shell, navigation, dark/light theme toggle
│       │   ├── index.html          # Hero, certifications bar, latest articles
│       │   ├── article.html        # Single article post layout
│       │   ├── page.html           # Static pages (About Me layout)
│       │   ├── archives.html       # Chronological timeline of all articles
│       │   ├── tags.html           # Tag taxonomy index
│       │   └── tag.html            # Tag-filtered post view
│       └── static/
│           ├── css/
│           │   ├── style.css       # Clean design system (light/dark mode)
│           │   └── pygments.css    # Code syntax highlighting
│           └── js/
│               └── main.js         # Theme switcher & code block copy buttons
├── firebase.json                   # Firebase Hosting configuration (clean URLs, caching)
├── .firebaserc                     # Firebase target project definition
├── Makefile                        # Local development & build automation
├── pelicanconf.py                  # Pelican development configuration
├── publishconf.py                  # Production configuration for CI/CD
└── requirements.txt                # Pinned Python dependencies
```

---

## ⚡ Key Highlights & Design Decisions

1. **Native reStructuredText (`.rst`) First-Class Support:**
   - Powered by official `docutils` and Python `Pelican`, ensuring complete standard reStructuredText syntax compatibility (headings, field lists, admonitions, tables, and code directives).
2. **Zero Runtime Framework Overhead:**
   - Pre-renders 100% static HTML, CSS, and JS. Sub-millisecond Time-To-First-Byte (TTFB) and 100/100 Lighthouse performance scores.
3. **Responsive Dark / Light Mode:**
   - Pure CSS variables with smooth transitions and system color-scheme detection, persisted in `localStorage` without flash of unstyled content (FOUC).
4. **Interactive Developer Features:**
   - One-click **Copy Code** button on all code snippets.
   - Syntax highlighting powered by `Pygments`.
   - Direct download and inline embedding for **`NguyenHuynhHuyMan_DevOps_Engineer.pdf`**.

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- Python 3.10+
- `virtualenv` or `python3-venv`

### 2. Set Up Environment
```bash
# Create virtual environment
python3 -m venv .venv || virtualenv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Local Commands (Makefile)
```bash
# Build local site to output/
make html

# Start development server with live reload on http://localhost:8000
make dev

# Build production release
make publish

# Clean generated output
make clean
```

---

## ✍️ Authoring Content (`.rst`)

### 1. Adding a New Blog Post
Create a file inside `content/blog/my-new-post.rst`:

```rst
Scaling Multi-Cloud Infrastructure with Terraform
#################################################

:date: 2026-10-16 10:00
:tags: terraform, azure, gcp, devops
:category: Cloud Architecture
:slug: scaling-multicloud-terraform
:author: Nguyen Huynh Huy Man
:summary: Best practices for managing state and modularizing Terraform code across Azure and GCP.

Introduction
============

Write your technical content here using standard reStructuredText syntax.

Referencing Asset Images
------------------------
You can reference images placed in ``content/images/`` using the ``{static}`` tag:

.. image:: {static}/images/my-diagram.svg
   :alt: Multi-cloud Architecture Diagram
   :align: center
   :width: 100%

Code Snippets with Syntax Highlighting
--------------------------------------
.. code-block:: hcl

   resource "google_compute_network" "vpc_network" {
     name                    = "production-vpc"
     auto_create_subnetworks = false
   }

Admonition Callouts
-------------------
.. note::
   Always use remote backend state locking with Cloud Storage or Azure Blob Storage.
```

### 2. Updating About Me Content
Edit `content/pages/about.rst`. The current content is directly structured from your CV (`NguyenHuynhHuyMan_DevOps_Engineer.pdf`), covering your experience at **Bosch Global Software**, **HCMUT education**, certifications (**CKS, CKA, CKAD, GCP PCA, GCP PCDO, AWS AI**), and performance awards.

---

## 🔥 Deploying to Firebase via GitHub Actions

### Step 1: Firebase Project Setup
1. In the [Firebase Console](https://console.firebase.google.com/), create or select your project (e.g. `huyman-devops-portfolio`).
2. Update `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "huyman-devops-portfolio"
     }
   }
   ```
3. Update `SITEURL` in `publishconf.py` with your live Firebase Hosting URL (e.g., `https://huyman-devops-portfolio.web.app`).

### Step 2: Configure Service Account Credentials
Generate a service account key with Firebase Hosting Admin permissions:

**Option A: Using the Firebase CLI**
```bash
npx firebase-tools init hosting:github
```
This CLI wizard automatically creates the service account and saves the GitHub secret for you.

**Option B: Manual Google Cloud Service Account**
1. In Google Cloud Console, navigate to **IAM & Admin** > **Service Accounts**.
2. Create a service account named `firebase-hosting-deployer`.
3. Grant role: **Firebase Hosting Admin** (`roles/firebasehosting.admin`).
4. Generate a JSON Key for this service account and download it.

### Step 3: Add GitHub Repository Secrets
In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:

| Secret Name | Value | Description |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | `<Paste the full JSON key content>` | Service account authentication key |
| `FIREBASE_PROJECT_ID` | `huyman-devops-portfolio` | Your Firebase project ID |

### Step 4: Automatic CI/CD Execution
Whenever you push changes to `main`:
1. GitHub Actions triggers `.github/workflows/firebase-deploy.yml`.
2. Python environment is initialized and cached.
3. Pelican builds the static site into `output/`.
4. `FirebaseExtended/action-hosting-deploy` deploys the site to the **live** channel.
5. Pull requests generate isolated **Preview Channels** for zero-risk verification!
