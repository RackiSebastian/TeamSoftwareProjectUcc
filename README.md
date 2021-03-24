# TeamSoftwareProjectUcc Group 11

This GitHub repo began as a Team Software Project in the third year CS3305 Module of the Computer Science Degree course (2020/21 term) at the School of Computer Science and Information Technology (CSIT) at University College Cork (UCC), Ireland.  The lecturer was Dr. Jason Quinlan.

UCC: https://www.ucc.ie/en/  
CSIT: https://www.ucc.ie/en/compsci/


![image](https://user-images.githubusercontent.com/23193565/112290836-81bc3180-8c87-11eb-8d42-481c835af1dd.png)


## Team 
    Sebastian Racki: 118459412 
    Cathal Donovan O'Neill: 118495052
    Naina Nair : 118100268
    Allan Barry: 117343896
    
## Installations

    Make sure you have python installed - Python.org 
    Make sure you have pip installed - (By downloadin python 3.5 or higher its automatically there) 
    Make sure you have npm installed - https://www.npmjs.com/get-npm
    Make sure you have virtualenv installed - pip install virtualenv

## Download or just checkout the link! 
    spotifyy-rooms.herokuapp.com
    
    else:
        Public Github: https://github.com/RackiSebastian/TeamSoftwareProjectUcc  
        Follow instructions below to install 

## Clone the project 
    
    cd <any_directory> 
    git clone https://github.com/RackiSebastian/TeamSoftwareProjectUcc.git
    
    This will create a folder called TeamSoftwareprojectucc 

## Download django dependencies 
    
    1. Create a virtual enviorenment 
        -> cd TeamSoftwareprojectucc 
        -> type virtualenv env
        -> Creates a folder called env so cd into it 
        -> Type source Scripts/activate 
    2. cd back to TeamSoftwareprojectucc 
        -> type pip install -r requirements.txt 
 
## Download Node and React Dependencies 
    1. cd TeamSoftwareProjectUcc/Spotifyapp/frontEndReact
    2. npm i
    3. Thats basically it you got all the dependencies that you need 

## Create a spotify developers account 
    1. go to https://developer.spotify.com/dashboard/
    2. Log in wherever you want 
    3. Create an App call it whatever you want 
    4. Go into settings on the right hand side 
    5. Scroll down to 'Redirect uris' and add '127.0.0.1:8000/spotify/redirect
    6. Update the client id and secret in the python program in the file at TeamSoftwareprojectucc/spotifyapp/spotifyAPI/client_secrets.py 
    7. MAKE SURE CLIENT SECRETS AND ID ARE CHANGED BECAUSE IT WILL NOT WORK 

## Run the program...


    cd ../TeamSoftwareProjectUcc/spotifyApp

    then: 
        python manage.py runserver 


        ^
        |
        |
        This will run a localhost server that you can run by going on the internet and typing 
                                                                                        |
                                                                                        |
                                                                                        |
                                                                                        v
                                                                                        127.0.0.1:8000
                                                                                            else:
                                                                                                localhost:8000
