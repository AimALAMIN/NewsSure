from django.urls import path
from .views import CheckNewsView

urlpatterns = [
    path('check-news/', CheckNewsView.as_view(), name='check_news'),
]