# TeamSoftwareProjectUcc Group 11
3rd year team software project

## Team 
    Sebastian Racki: 118459412 
    Cathal Donovan O'Neill: 118495052
    Naina Nair : 118100268
    Allan Barry: 117343896
    
## Installations

    Makesure you have python installed - Python.org 
    Make sure you have pip installed - (By downloadin python 3.5 or higher its automatically there) 
    Make sure you have npm installed - https://www.npmjs.com/get-npm
    Make sure you have virtualenv installed - pip install virtualenv
## Download or just checkout the link! 
    spotifyy-rooms.herokuapp.com
    
    else:
    
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
    3. Go into settings on the right hand side 
    4. Scroll down to 'Redirect uris' and add '127.0.0.1:8000/spotify/redirect

## Run the program...


    cd ../TeamSoftwareProjectUcc/spotifyApp

    then: 
        python manage.py runserver 


        ^
        |
        |
        This will run a localhost server that you can run by 
                                                            |
                                                            |
                                                            |
                                                            v
                                                            127.0.0.1:8000
                                                                else:
                                                                    localhost:8000
