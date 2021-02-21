from django.urls import path 
from .views import RoomView, CreateRoom, getRoom, JoinRoom, User, LeaveRoom, UpdateRoom

urlpatterns = [
  path('room', RoomView.as_view()),
  path('createRoom', CreateRoom.as_view()),
  path('getRoom', getRoom.as_view()),
  path('leaveRoom', LeaveRoom.as_view()),
  path('joinRoom', JoinRoom.as_view()),
  path("user", User.as_view()),
  path("updateRoom", UpdateRoom.as_view())
]