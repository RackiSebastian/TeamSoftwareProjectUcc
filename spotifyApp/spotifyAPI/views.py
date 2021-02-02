from django.shortcuts import render, redirect
from .client_secrets import ID,SECRET 
from rest_framework.views import APIView
from requests import Request, post
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


	def Get_request(self,request,format = None):
		scope = 'user-read-playback-state user-modify-playback-state user-read-current-playing'

		get_req = Request('GET', 'https://accounts.spotify.com/authorize',params = {
			'scope':scope,
			'response_type': 'code',
			'redirect_uri': 'http://127.0.0.1/',
			'id': ID
			}).prepare().url

		return Reponse({'url':url}, status = status.HTTP_200_OK)


def get_token(session_id):
	u_token = Tokens.objects.filter(user = session_id)

	if u_token.exists(): 
		return u_token[0]
	else:
		return None 

def handle_user_tokens(session_id,access_token,token_type,refresh_token,expires_in):
	token = get_token(session_id)
	expires_in = timezone.now() + timedelta(seconds = expires_in)

	if token:
		token.access_token = access_token
		token.token_type = token_type
		token.refresh_token = refresh_token
		token.expires_in = expires_in
		token.save(update_fields =['access_token','refresh_token','expires_in','token_type'])
	else:
		token = Token(user = session_id,access_token = access_token , refresh_token = refresh_token,token_type =token_type , expires_in = expires_in)
		token.save() 



def callback(request,format = None): 
	'''
		Second step says to take in the client_id ,
		client_secret,
		grant_type,
		code(response_code),
		redirect uri, 
	'''
	response = request.GET.get('code')
	error = request.GET.get('error')

	response_json = post('https://accounts.spotify.com/api/token',data = {
		
		'code' : response, 
		'grant_type': 'authorization_code',
		'redirect_uri':  'http://127.0.0.1/', 
		'client_id': ID,
		'client_secret' : SECRET, 
		}).json()

	access_token = response.get('access_token')
	token_type = response.get('token_type')
	refresh_token = response.get('refresh_token')
	expires_in = reponse.get('expires_in')

	if not rqeuest.session.exists(request.session.session_key):
		request.session.create()

	handle_user_tokens(request.session.session_key,access_token,token_type,refresh_token,expires_in)

	#When this function runs redirect us back to our original application 
	return redirect('admin/')



def is_authenticated(session_id):
	token = get_token(session_id).refresh_token

	if token: 
		date = token.expires_in
		if date <= timezone.now():
			refreshToken(session_id) 
		return True 

	return False	

def refreshToken(session_id):
	token = token.token 

	refresh_token = post('https://accounts.spotify.com/api/token',data = {
		'grant_type': 'token',
		'refresh_token': token, 
		'client_id': ID , 
		'client_secret' : SECRET

		}).json()

	access_token = refresh_token.get('access_token')
	token_type = refresh_token.get('token_type')
	expires_in = refresh_token.get('expires_in')
	refresh_token = refresh_token.get('refresh_token')

	handle_user_tokens(session_id,access_token,token_type,expires_in,refresh_token)



class Authenticated(APIView):
	def get(self,request,format = None):
		authenticated = is_authenticated(self.request.session.session_key)
		return Response({'status':authenticated},status = status.HTTP_200_OK)
