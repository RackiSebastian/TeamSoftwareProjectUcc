from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,'../frontEndReact/src/index.js',{})

def room(request,room_number):
    return render(request,'chatroom.html',{
        'room_number':room_number
    })
