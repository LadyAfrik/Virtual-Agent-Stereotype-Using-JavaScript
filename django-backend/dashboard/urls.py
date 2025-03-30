from django.urls import path
from .views import AttributeRankingAPIView, UsersAPIView, GenderSelectionAPIView
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('rankings/', AttributeRankingAPIView.as_view(), name='rankings'),
    path('dashboard/', views.dashboard_page, name='dashboard_page'),
    path('users/', UsersAPIView.as_view(), name='users'),
    path('gender-selections/', GenderSelectionAPIView.as_view(), name='gender_selections'),
]


