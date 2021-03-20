from django.shortcuts import render
from rest_framework import generics, status
from .serializier import Serializer, createRoom, UpdateRoom
from .models import Room 
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse 

# Create your views here.


#HAS TO BE LISTAPI otherwise you can create new models from the webpage by post REQUESTS
class RoomView(generics.ListAPIView):
	queryset = Room.objects.all() #gets all objects in the room model
	serializer_class = Serializer


class CreateRoom(APIView):
	serializer_class = createRoom
	def post(self, request, format = None): #needs to be called post for it to allow post requests

		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		serializer = self.serializer_class(data = request.data)

		if serializer.is_valid():
			can_pause = serializer.data.get('can_pause')
			vote_to_skip = serializer.data.get('vote_to_skip')
			host = self.request.session.session_key
			query = Room.objects.filter(host = host)

			if query.exists():
				room = query[0]
				room.can_pause = can_pause
				room.vote_to_skip = vote_to_skip

				room.save(update_fields = ['can_pause', 'vote_to_skip'])
				self.request.session['code'] = room.code
				return Response(Serializer(room).data, status = status.HTTP_200_OK)
			else:
				room = Room(host = host, can_pause = can_pause, vote_to_skip = vote_to_skip)
				room.save()
				self.request.session['code'] = room.code
				return Response(Serializer(room).data,status = status.HTTP_201_CREATED)
				
		return Response({'Bad Format': 'Invalid values'}, status = status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
	lookup = 'code'

	def post(self,request, format = None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create() 

		code = request.data.get(self.lookup)

		if code != None:
			room_ = Room.objects.filter(code = code)
			if len(room_) > 0 :
				room = room_[0]
				self.request.session['code'] = code
				return Response({'message':'Room Joined!'}, status = status.HTTP_200_OK)
			return Response({'Bad Request' : 'Invalid Code'}, status = status.HTTP_400_BAD_REQUEST)

		return Response({'Bad Request': 'Invalid Data, no code found!'}, status = status.HTTP_400_BAD_REQUEST)


class getRoom(APIView):
	serializer_class = Serializer 
	lookup = 'code'

	def get(self, request, format = None):
		code = request.GET.get(self.lookup)

		if code != None: 
			room = Room.objects.filter(code = code)
			
			if len(room) > 0 :
				data = Serializer(room[0]).data
				data['is_host'] = self.request.session.session_key == room[0].host 
				return Response(data, status = status.HTTP_200_OK)
			return Response({'Room not found': 'Invalid Code'}, status = status.HTTP_404_NOT_FOUND)
		return Response({'Bad Request': 'Code not in request'}, status = status.HTTP_400_BAD_REQUEST)


class User(APIView):
	def get(self, request, format = None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		data = {
			'code': self.request.session.get('code')
		}
		return JsonResponse(data, status = status.HTTP_200_OK)


class LeaveRoom(APIView):
	def post(self,request,format = None):
		if 'code' in self.request.session:
			self.request.session.pop('code')
			host_ = self.request.session.session_key
			room_ = Room.objects.filter(host = host_)

			if len(room_) > 0:
				room = room_[0]
				room.delete()
		return Response({'Message': 'Done!'}, status = status.HTTP_200_OK)


class UpdateRoom(APIView):
	serializer_class = UpdateRoom

	def patch(self, request, format = None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		serializer = self.serializer_class(data = request.data)

		if serializer.is_valid():
			can_pause = serializer.data.get('can_pause')
			vote_to_skip = serializer.data.get('vote_to_skip')
			code = serializer.data.get('code')

			queryset = Room.objects.filter(code = code)

			if not queryset.exists():
				return Response({'Message:': 'Room not there!'}, status = status.HTTP_404_NOT_FOUND) #403 isn't if room isn't there
			
			room = queryset[0] #Fixed no room variable
			user_id = self.request.session.session_key
			if room.host != user_id:
				return Response({'Message': 'You are not the host!'}, status = status.HTTP_403_FORBIDDEN)
			
			room.can_pause = can_pause
			room.vote_to_skip = vote_to_skip
			room.save(update_fields = ['can_pause', 'vote_to_skip'])
			return Response(Serializer(room).data, status = status.HTTP_200_OK)
		
		return Response({'Bad Request': 'Data is wrong!'}, status = status.HTTP_400_BAD_REQUEST)
		