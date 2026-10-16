"""
Pelican Production Configuration
Used by CI/CD pipeline (GitHub Actions) for Firebase deployment
"""
import os
import sys

# Ensure current directory is in python module search path
sys.path.append(os.curdir)
from pelicanconf import *

# Production site URL (defaults to Firebase Hosting domain, overridable via env var)
SITEURL = os.environ.get('SITE_URL', 'https://your-firebase-project.web.app')
RELATIVE_URLS = False

# Enable production feeds & sitemaps
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'

DELETE_OUTPUT_DIRECTORY = True
