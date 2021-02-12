from django.shortcuts import render, redirect
from .client_secrets import ID, SECRET 
from rest_framework.views import APIView
from requests import Request, post, get
from rest_framework import status
from rest_framework.response import Response
from .models import Tokens
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
		scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

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


class Authenticated(APIView):
	def get(self, request, format = None):
		authenticated = is_authenticated(self.request.session.session_key)
		
		return Response({'status': authenticated}, status = status.HTTP_200_OK)
