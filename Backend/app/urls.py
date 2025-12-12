# from django.urls import path
# from . import views

# urlpatterns = [
#     # path('', views.home),
#     path('api/verify/', views.verify_claim),
# ]

from django.urls import path
from .views import CheckNewsView

urlpatterns = [
    path('check-news/', CheckNewsView.as_view(), name='check_news'),
]