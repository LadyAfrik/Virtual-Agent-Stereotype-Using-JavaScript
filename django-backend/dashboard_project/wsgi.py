"""
WSGI config for dashboard_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os  # Import the os module to interact with the operating system

from django.core.wsgi import get_wsgi_application  # Import the WSGI application function from Django

# Set the default Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dashboard_project.settings')

# Get the WSGI application for the project, which serves the Django application through a WSGI server
application = get_wsgi_application()
