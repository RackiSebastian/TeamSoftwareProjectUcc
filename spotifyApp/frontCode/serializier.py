from rest_framwork import serializers
from .models import Room

class Serializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = ('id','code','host','can_pause','vote_to_skip','date_time')


class createRoom(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = ('can_pause','vote_to_skip')
