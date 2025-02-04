from django.db import models
import string 
import random  


def unique_code():
	length = 6 

	while True:
		code = ''.join(random.choices(string.ascii_lowercase, k = length))
		if Room.objects.filter(code = code).count() == 0:
			break
	return code 


class Room(models.Model):
	code = models.CharField(max_length = 7, default = unique_code, unique = True)#Default set to unique_code so no repetitions possible
	host = models.CharField(max_length = 255, unique = True)
	can_pause = models.BooleanField(null = False, default = False)
	vote_to_skip = models.IntegerField(null = False, default = 0) 
	date_time = models.DateTimeField(auto_now_add = True)













