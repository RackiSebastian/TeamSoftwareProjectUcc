from django.urls import path
from .views import Authenticate,callback

urlpatterns = [
    path('get-auth-url', Authenticate.as_view()),
    path('redirect',callback),
    
]