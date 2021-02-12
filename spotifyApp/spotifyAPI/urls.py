from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', Authenticate.as_view()),
    path('redirect', callback),
    path('authenticated', Authenticated.as_view())
]