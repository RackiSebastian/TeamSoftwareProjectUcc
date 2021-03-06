# Group 11 - Spotify Groups
3rd Year Team Software Project - UCC

## Team Members
    Sebastian Racki: 118459412 
    Cathal Donovan O'Neill: 118495052
    Naina Nair: 118100268
    Allan Barry: 117343896 

## Spotify Groups
Spotify Groups is a website that allows people to create a shared chat room that allows for simultaneous Spotify playback. The website is made using a ReactJS and Django framework.

## Requirements
    - Works on any Operating System.
    - Must have a Spotify Premium account to be able to play music.
    - Recommend getting Git Bash to run the program.
    - [Install Node.js](https://nodejs.org/en/)

## Instructions for Setup
    Run the following sequence of commands.
### To copy the files from GitHub:
    git clone https://github.com/RackiSebastian/TeamSoftwareProjectUcc.git
### To download the python modules needed to run the program:
    cd TeamSoftwareProjectUcc
    pip install -r requirements.txt
### To run the server:
    cd spotifyApp
    python manage.py runserver 

                ^
                |
                |
            This will run the django web server 
            which can be used to host the program.
                                            |
                                            |
                                            v
                                    http://127.0.0.1:8000
                                            OR
                                    http://localhost:8000
### To download the node modules needed to run the program:
    (Open a second terminal and run the following commands)
    cd TeamSoftwareProjectUcc
    cd frontEndReact
    npm i
### To compile the frontend:
    npm run dev
### To access the Spotify Groups website:
    Go to http://127.0.0.1:8000 on your browser.
