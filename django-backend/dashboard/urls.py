from django.urls import path  # Importing the 'path' function from Django's 'urls' module to define URL routes.

# Importing the API views for handling requests related to 'AttributeRanking', 'Users', and 'GenderSelection' models.
from .views import AttributeRankingAPIView, UsersAPIView, GenderSelectionAPIView

# Importing all views from the current app's views.py file, allowing access to functions that handle webpage rendering.
from . import views

# URL patterns for the app, mapping URLs to corresponding views
urlpatterns = [
    # The home page of the app, uses the 'home' function from views.py
    path('', views.home, name='home'),

    # API endpoint for listing and interacting with 'AttributeRanking' data
    path('rankings/', AttributeRankingAPIView.as_view(), name='rankings'),

    # The dashboard page, uses the 'dashboard_page' function from views.py
    path('dashboard/', views.dashboard_page, name='dashboard_page'),

    # API endpoint for listing and interacting with 'Users' data
    path('users/', UsersAPIView.as_view(), name='users'),

    # API endpoint for listing and interacting with 'GenderSelection' data
    path('gender-selections/', GenderSelectionAPIView.as_view(), name='gender_selections'),

    # Ranking analysis page, uses the 'ranking_analysis_view' function from views.py
    path('ranking-analysis/', views.ranking_analysis_view, name='ranking_analysis'),

    # Endpoint for downloading the 'Users' data as a CSV file, triggers 'download_users' view
    path('download/users/', views.download_users, name='download_users'),

    # Endpoint for downloading the 'AttributeRankings' data as a CSV file, triggers 'download_attribute_rankings' view
    path('download/attribute-rankings/', views.download_attribute_rankings, name='download_attribute_rankings'),

    # Endpoint for downloading the 'GenderSelections' data as a CSV file, triggers 'download_gender_selections' view
    path('download/gender-selections/', views.download_gender_selections, name='download_gender_selections'),
]
