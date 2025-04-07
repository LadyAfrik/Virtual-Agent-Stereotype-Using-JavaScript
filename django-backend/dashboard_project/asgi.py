"""
ASGI config for dashboard_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os  # Import the os module to interact with the operating system, especially for setting environment variables

from django.core.asgi import get_asgi_application  # Import get_asgi_application to configure ASGI application for Django

# Set the default settings module for the 'django' program, which tells Django which settings to use for this project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dashboard_project.settings')

# Get the ASGI application for the Django project, which handles asynchronous web requests
application = get_asgi_application()
