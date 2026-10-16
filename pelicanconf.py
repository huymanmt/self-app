"""
Pelican Development Configuration
Nguyen Huynh Huy Man - DevOps Engineer & Cloud Architect
Portfolio & Technical Blog
"""
from datetime import datetime

AUTHOR = 'Nguyen Huynh Huy Man'
SITENAME = 'Nguyen Huynh Huy Man'
SITETITLE = 'Nguyen Huynh Huy Man | DevOps Engineer & Cloud Architect'
SITESUBTITLE = 'DevOps Engineer • Cloud Architect • CKS • CKA • GCP PCA'
SITEURL = ''

PATH = 'content'
TIMEZONE = 'Asia/Ho_Chi_Minh'
DEFAULT_LANG = 'en'
CURRENT_YEAR = datetime.now().year

# Theme configuration
THEME = 'themes/developer'

# Feed generation is disabled during local development
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Content path specifications
ARTICLE_PATHS = ['blog']
PAGE_PATHS = ['pages']
STATIC_PATHS = ['images', 'extra', 'resume.pdf']

EXTRA_PATH_METADATA = {
    'extra/robots.txt': {'path': 'robots.txt'},
    'extra/favicon.svg': {'path': 'favicon.svg'},
    'extra/resume.pdf': {'path': 'resume.pdf'},
    'extra/NguyenHuynhHuyMan_DevOps_Engineer.pdf': {'path': 'NguyenHuynhHuyMan_DevOps_Engineer.pdf'},
    'resume.pdf': {'path': 'resume.pdf'},
}

# Clean URL structure
ARTICLE_URL = 'blog/{slug}.html'
ARTICLE_SAVE_AS = 'blog/{slug}.html'
PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = '{slug}.html'
CATEGORY_URL = 'category/{slug}.html'
CATEGORY_SAVE_AS = 'category/{slug}.html'
TAG_URL = 'tag/{slug}.html'
TAG_SAVE_AS = 'tag/{slug}.html'
ARCHIVES_SAVE_AS = 'archives.html'
CATEGORIES_SAVE_AS = 'categories.html'
TAGS_SAVE_AS = 'tags.html'
AUTHORS_SAVE_AS = ''
AUTHOR_SAVE_AS = ''

# Pagination
DEFAULT_PAGINATION = 6

# Relative URLs for local preview
RELATIVE_URLS = True

# Docutils reStructuredText settings
DOCUTILS_SETTINGS = {
    'syntax_highlight': 'short',
    'table_style': 'colwidths-auto',
    'initial_header_level': '2',
}

# Author profile & hero
BIO = (
    "DevOps Engineer with 3+ years of experience in automating infrastructure, "
    "optimizing CI/CD pipelines, and guaranteeing system reliability. "
    "Specialized in Kubernetes, GitOps (ArgoCD/ARC), Terraform, Azure, GCP, and enterprise AI workflows."
)
LOCATION = 'Ho Chi Minh City, Viet Nam'
EMAIL = 'man28081999@gmail.com'
PHONE = '(+84) 945 305 013'
AVATAR = 'images/avatar.svg'
RESUME_URL = '/resume.pdf'

CERTIFICATIONS = [
    'Certified Kubernetes Security Specialist (CKS)',
    'Certified Kubernetes Administrator (CKA)',
    'Certified Kubernetes Application Developer (CKAD)',
    'Google Cloud Certified - Professional Cloud Architect',
    'Google Cloud Certified - Professional Cloud DevOps Engineer',
    'AWS Certified AI Practitioner',
]

SOCIAL_LINKS = [
    {'name': 'LinkedIn', 'url': 'https://linkedin.com/in/mannguyen99', 'icon': 'linkedin'},
    {'name': 'GitHub', 'url': 'https://github.com', 'icon': 'github'},
    {'name': 'Email', 'url': 'mailto:man28081999@gmail.com', 'icon': 'email'},
]

NAV_ITEMS = [
    {'title': 'Home', 'url': '/index.html'},
    {'title': 'About Me', 'url': '/about.html'},
    {'title': 'Blog', 'url': '/archives.html'},
    {'title': 'Tags', 'url': '/tags.html'},
]
