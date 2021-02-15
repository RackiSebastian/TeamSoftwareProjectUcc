from django.urls import path 
from .views import RoomView, CreateRoom,getRoom,joinRoom

urlpatterns = [
  path('room',RoomView.as_view()),
  path('createRoom',CreateRoom.as_view()),
  path('getRoom',getRoom.as_view()),
  path('leaveRoom',leaveRoom.as_view()),
  path('joinRoom',joinRoom.as_view()),
]