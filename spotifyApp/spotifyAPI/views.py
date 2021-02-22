from django.shortcuts import render, redirect
from .client_secrets import ID, SECRET 
from rest_framework.views import APIView
from requests import Request, post, get
from rest_framework import status
from rest_framework.response import Response
from .models import Tokens,Vote
from datetime import timedelta
from django.utils import timezone

# Create your views here.
class Authenticate(APIView):
	'''
	Scope = all the scopes I want to use when accessing the user_data 
	I will in future add the modify Library to make voice recognition 
	We then send a get request as it says in documentation 
	We get the scope, response type : 404 etc and the client ID 

	'''

	def get(self, request, format = None):
		scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-private user-read-email'

		get_req = Request('GET', 'https://accounts.spotify.com/authorize', params = {
			'scope': scope,
			'response_type': 'code',
			'redirect_uri': 'http://127.0.0.1:8000/spotify/redirect',
			'client_id': ID
		}).prepare().url

		return Response({'url': get_req}, status = status.HTTP_200_OK)


def get_token(session_id):
	u_token = Tokens.objects.filter(user = session_id)

	if u_token.exists(): 
		return u_token[0]
	else:
		return None 

def handle_user_tokens(session_id, access_token, token_type, refresh_token, expires_in):
	token = get_token(session_id)
	expires_in = timezone.now() + timedelta(seconds = expires_in)

	if token:
		token.access_token = access_token
		token.token_type = token_type
		token.refresh_token = refresh_token
		token.expires_in = expires_in
		token.save(update_fields = ['access_token', 'refresh_token', 'expires_in', 'token_type'])
	else:
		token = Tokens(user = session_id, access_token = access_token , refresh_token = refresh_token, token_type = token_type , expires_in = expires_in)
		token.save() 


def callback(request, format = None): 
	'''
		Second step says to take in the client_id ,
		client_secret,
		grant_type,
		code(response_code),
		redirect uri, 
	'''
	response = request.GET.get('code')
	error = request.GET.get('error')

	response_json = post('https://accounts.spotify.com/api/token', data = {
		'code' : response, 
		'grant_type': 'authorization_code',
		'redirect_uri':  'http://127.0.0.1:8000/spotify/redirect', 
		'client_id': ID,
		'client_secret' : SECRET
	}).json()

	access_token = response_json.get('access_token')
	token_type = response_json.get('token_type')
	refresh_token = response_json.get('refresh_token')
	expires_in = response_json.get('expires_in')
	error = response_json.get('error')

	if not request.session.exists(request.session.session_key):
		request.session.create()

	handle_user_tokens(request.session.session_key, access_token, token_type, refresh_token, expires_in)

	# When this function runs redirect us back to our original application 
	return redirect('frontend:')

def is_authenticated(session_id):
	token = get_token(session_id)

	if token: 
		date = token.expires_in
		if date <= timezone.now():
			refreshToken(session_id) 
		return True 

	return False	

def refreshToken(session_id):
	refresh_token = get_token(session_id).refresh_token 

	response_json = post('https://accounts.spotify.com/api/token', data = {
		'grant_type': 'refresh_token',
		'refresh_token': refresh_token, 
		'client_id': ID, 
		'client_secret' : SECRET
	}).json()

	access_token = response_json.get('access_token')
	token_type = response_json.get('token_type')
	expires_in = response_json.get('expires_in')

	handle_user_tokens(session_id, access_token, token_type, refresh_token, expires_in)

def execute_api_request(session_id,endpoint,post_ = False,put_ = False):
	tokens = get_token(session_id)
	headers = {'Content-Type':'application/json', 'Authorization':"Bearer" + tokens.access_token}

	if post_:
		post("https://api.spotify.com/v1/me/" + endpoint,headers= headers)
	if put_:
		put("https://api.spotify.com/v1/me/"+endpoint, headers = headers)

	response = get("https://api.spotify.com/v1/me/" + endpoint,{},headers = headers)

	try:
		return response.json()
	except:
		return {'Error':'Issue with request? '}

def playSong(session_id):
	return execute_api_request(session_id,"player/play",put_ = True)

def pauseSong(session_id):
	return execute_api_request(session_id,"player/pause",put_ = True)

def skipSong(session_id):
	return execute_api_request(session_id,"player/next",post_ = True)

class GetToken(APIView):
	def get(self, request, format = None):
		refreshToken(self.request.session.session_key)
		token = get_token(self.request.session.session_key)
		token = token.access_token
		return Response({'token': token}, status = status.HTTP_200_OK)

class Authenticated(APIView):
	def get(self, request, format = None):
		authenticated = is_authenticated(self.request.session.session_key)
		
		return Response({'status': authenticated}, status = status.HTTP_200_OK)


class CurrentSongPlaying(APIView):
	def get(self,request,format = None):

		code_  = self.request.session.get('room_code')
		room = Room.objects.filter(code = room_code)

		if room.exists():
			room = room[0]
		else:
			return Response({},status = status.HTTP_404_NOT_FOUND) 

		host = room.host
		endpoint = "player/current-playing"
		response = execute_api_request(host,endpoint)

		if 'error' in response or 'item' not in response:
			return Response({'Message':'What did you do now?'}, status = status.HTTP_204_NO_CONTENT)

		item = response.get('item')
		duration = item.get('duration_ms') #convert it to seconds/minutes!!!!!
		progress = response.get('progress_ms')
		album_cover = item.get('album').get('images')[0].get('url')
		is_palying = response.get('is_playing')
		song_id = item.get('id')

		artist_string = "" 

		for ind, artist in enumerate(item.get('artists')):
			if ind > 0 : 
				artist_string += ", "
			name = artist.get('name')
			artist_string += name

		votes = len(Vote.objects.filter(room = room, song_id = song_id))

		song = {
			'title':item.get('name'),
			'artist': artist_string,
			'duration':duration,
			'time' : progress,
			'image_url' : album_cover,
			'is_playing': is_playing,
			'votes':votes,
			'votes_required':room.vote_to_skip,
			'id': song_id
		}

		self.updateSong(room,song_id)

		return Response(song,status = status.HTTP_200_OK)

	def updateSong(self,room,song_id):
		current_song = room.current_song

		if current_song != song_id:
			room.current_song = song_id
			room.save(update_fields = ['current_song'])
			votes.Vote.objects.filter(room=room).delete()

class PlaySong(APIView):
	def put(self,response,format = None):
		room_code = self.request.session.get('room_code')
		room = Room.objects.filter(code = room_code)[0]
		if self.requst.session.session_key == room.host or room.can_pause:
			playSong(room.host)
			return Response({}, status = status.HTTP_204_NO_CONTENT)
		return Response({} , status = status.HTTP_403_FORBIDDEN)

class PauseSong(APIView):
	def put(self,response,format = None):
		room_code = self.request.session.get('room_code')
		room = Room.objects.filter(code = room_code)[0]
		if self.request.session.session_key == room.host or room.can_pause:
			pauseSong(room.host)
			return Response({} ,status = status.HTTP_204_NO_CONTENT)
		return Response({},status = status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
	def post(self,request,format = None):
		room_code = self.request.session.get('room_code')
		room = Room.objects.filter(code = room_code)[0]
		votes = Vote.objects.filter(room= room, song_id = room.current_song)
		votesSkip = room.vote_to_skip 

		if self.request.session.session_key == room.host or len(votes) + 1 >= votesSkip:
			votes.delete()
			skipSong(room.host)
		else:
			vote = Vote(user = self.request.session.session_key,room = room, song_id = room.current_song)
			vote.save()

		return Response({},status = status.HTTP_204_NO_CONTENT)

