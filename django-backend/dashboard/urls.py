from django.urls import path
from .views import AttributeRankingAPIView, UsersAPIView, GenderSelectionAPIView
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('rankings/', AttributeRankingAPIView.as_view(), name='rankings'),
    path('dashboard/', views.dashboard_page, name='dashboard_page'),
    path('users/', UsersAPIView.as_view(), name='users'),
    path('gender-selections/', GenderSelectionAPIView.as_view(), name='gender_selections'),
    path('ranking-analysis/', views.ranking_analysis_view, name='ranking_analysis'),
    path('download/users/', views.download_users, name='download_users'),
    path('download/attribute-rankings/', views.download_attribute_rankings, name='download_attribute_rankings'),
    path('download/gender-selections/', views.download_gender_selections, name='download_gender_selections'),
]


