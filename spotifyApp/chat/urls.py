from django.urls import path

from .views import room

urlpatterns = [
    path('<str:room_number>/',room,name = "room")
]
