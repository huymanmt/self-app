"""
Pelican Configuration - Simple & Minimalist Developer Portfolio
Huy Man (@huymanmt) - DevOps Engineer & Cloud Platform Architect
"""
from datetime import datetime

AUTHOR = 'Huy Man (@huymanmt)'
FULL_NAME = 'Nguyen Huynh Huy Man'
ALIAS = 'huymanmt'
SITENAME = 'huymanmt'
SITETITLE = 'huymanmt • DevOps & Cloud Platform'
SITESUBTITLE = 'DevOps & Cloud Platform Engineer'
SITEURL = ''

PATH = 'content'
TIMEZONE = 'Asia/Ho_Chi_Minh'
DEFAULT_LANG = 'en'
CURRENT_YEAR = datetime.now().year

# Theme configuration
THEME = 'themes/developer'

# Feed settings (disabled in development)
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
DEFAULT_PAGINATION = 10

# Relative URLs for local preview
RELATIVE_URLS = True

# Docutils reStructuredText settings
DOCUTILS_SETTINGS = {
    'syntax_highlight': 'short',
    'table_style': 'colwidths-auto',
    'initial_header_level': '2',
}

# Author profile & bio
BIO = (
    "DevOps Engineer with 3+ years of experience building resilient cloud infrastructure, "
    "automating GitOps CI/CD pipelines, and orchestrating enterprise Kubernetes and AI workflows."
)
LOCATION = 'Ho Chi Minh City, Viet Nam'
EMAIL = 'man28081999@gmail.com'
PHONE = '(+84) 945 305 013'
AVATAR = 'images/avatar.svg'
RESUME_URL = '/resume.pdf'

CERTIFICATIONS = [
    'CKS (Security Specialist)',
    'CKA (Administrator)',
    'CKAD (Application Developer)',
    'GCP Professional Cloud Architect',
    'GCP Professional Cloud DevOps',
    'AWS Certified AI Practitioner',
]

SOCIAL_LINKS = [
    {'name': 'GitHub', 'url': 'https://github.com/huymanmt', 'handle': '@huymanmt'},
    {'name': 'LinkedIn', 'url': 'https://linkedin.com/in/mannguyen99', 'handle': 'mannguyen99'},
    {'name': 'Email', 'url': 'mailto:man28081999@gmail.com', 'handle': 'man28081999@gmail.com'},
]

NAV_ITEMS = [
    {'title': 'About', 'url': '/about.html'},
    {'title': 'Blog', 'url': '/archives.html'},
    {'title': 'Resume', 'url': '/resume.pdf', 'external': True},
]
