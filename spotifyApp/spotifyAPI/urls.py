from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', Authenticate.as_view()),
    path('redirect', callback),
    path('authenticated', Authenticated.as_view()),
    path('currentSong',CurrentSongPlaying.as_view()),
    path('play',PlaySong.as_view()),
    path('pause',PauseSong.as_view()),
    path('skip',SkipSong.as_view()),
    path('getToken', GetToken.as_view()),
    path('getHostToken', GetHostToken.as_view()),
]