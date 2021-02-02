from django.shortcuts import render
from rest_framework import generics,status
from .serializer import Serializer,CreateRoom
from .models import Room 
from rest_framework.response import Response
# Create your views here.
class RoomView(generics.ListAPIView):
	query = Room.objects.all() #gets all objects in the room model
	serializer = serializer


class CreateRoom(APIView):
	serializer = CreateRoom

	def post_request(self,request,format = None)

		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		serializer_class = self.serializer(data = request.data)

		if serializer_class.is_valid():
			can_pause = serializer_class.data.get('can_pause')
			skip = serializer_class.data.get('vote_to_skip')
			host = self.request.session.session_key
			query = Room.objects.filter(host = host)

			if query.exists():
				room = query[0]
				room.can_pause = can_pause
				room.vote_to_skip = vote_to_skip

				room.save(update_field = ['can_pause','vote_to_skip'])
				return Reponse(Serializer(room).data,status = status.HTTP_200_OK)
			else:
				room = Room(host = host ,can_pause =can_pause,vote_to_skip= vote_to_skip)
				room.save()
				return Response(Serializer(room).data,status = status.HTTP_201_CREATED)

			return Response({'Bad Format': 'Invalid values'},status = status.HTTP_400_BAD_REQUEST)