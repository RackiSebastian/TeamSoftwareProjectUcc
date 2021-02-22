from django.db import models
from frontCode.models import Room 

# Create your models here.
class Tokens(models.Model):
	user = models.CharField(max_length = 255, unique = True)
	time_added = models.DateTimeField(auto_now_add= True)
	refresh_token = models.CharField(max_length = 255)
	access_token = models.CharField(max_length = 255)
	expires_in = models.DateTimeField()
	token_type = models.CharField(max_length = 255)


class Vote(models.Model):
	user = models.CharField(max_length = 50,unique = True)
	created = models.DateTimeField(auto_now_add=True)
	song_id = models.CharField(max_length = 50 )
	room = models.ForeignKey(Room , on_delete = models.CASCADE)
	
