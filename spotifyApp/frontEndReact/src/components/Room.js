import React, {Component} from "react";
import reactRouterDom from "react-router-dom";
import SpotifyPlayer from "react-spotify-web-playback";
import JoinPlayer from "./JoinPlayer.js";
import CreateRoom from "./CreateRoom.js";

// Any funcitonality that is commented out was simply not working for this release

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display_name: null, // spotify username
            nickname: null, // username for non-authenticated users
            can_pause: true, // true means guest users are allowed to pause/play music
            vote_to_skip: 1, // number of votes to skip a song
            skip_count: 0, // keeps track of current votes
            host_key: null,
            host_token: null, // hosts access_token
            is_host: false,
            is_playing: null, // current song data
            progress_ms: null,
            image: null,
            duration_ms: null,
            song_name: null,
            artist: null,
            skipUserList: [], // which users have voted to skip
            show_settings: false, // boolean to determine whether update room settings should be displayed
            msg: null, // error message
            token: null // access_token for current user
        };
        this.code = this.props.match.params.code; // to get the room code
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomDetails();
    }

    // get the access_token of the user and always display current data for songs
    componentDidMount() {
        this.getToken();
        this.interval = setInterval(() => this.getFakePlayer(this.state.host_token), 500);
    }

    componentDidUpdate() {
        if ((this.state.display_name === null) && (this.state.nickname === null)) {
            this.getUsername(this.state.token);
        }
        // change the pause/play button when host uses their player
        if (this.state.is_playing) {
            if (document.getElementById("pause_button").innerHTML == "Play") {
                document.getElementById("pause_button").innerHTML = "Pause";
            }
        } else {
            if (document.getElementById("pause_button").innerHTML == "Pause") {
                document.getElementById("pause_button").innerHTML = "Play";
            }
        }
        // change displayed votes to skip depending on how many people voted
        if (this.state.skip_count >= this.state.vote_to_skip){
            var skips = "Votes to skip: ";
            skips = skips.concat(this.state.vote_to_skip);
            document.getElementById("votes_to_skip").innerHTML = skips;
            this.skipJoinPlayer(this.state.host_token);
        } else {
            var skips = "Votes to skip: ";
            skips = skips.concat(this.state.vote_to_skip - this.state.skip_count);
            document.getElementById("votes_to_skip").innerHTML = skips;
        }
    }

    // stop fetching player data when page closes
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get user data for display name
    getUsername = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                this.setState({
                    display_name: data.display_name
                });
            }
        });
    }

    // get user access_token
    // if the user is not authenticated, this fails and so asks them for a nickname instead
    // knowing that a Spotify username will not be displayed
    getToken = () => {
        fetch("/spotify/getToken")
            .then((response) => response.json())
            .then((data) => {
                this.setState(
                    {token: data.token}
                );
            })
            .catch(data => {
                var window_name = "http://";
                window_name = window_name.concat(window.location.host);
                window_name = window_name.concat("/"); // only display on this page
                
                if (window.location.href != window_name){
                    var p_element = document.createElement("p"); // create element for user list
                    var nickname = "";
                    while ((nickname == "") || (nickname.length > 20)) {
                        nickname = prompt("Enter name (max 20 char.)");
                    }
                    if (nickname) {
                        var node = document.createTextNode(nickname);
                        p_element.appendChild(node);
                        var container = document.getElementById("user_list");
                        container.appendChild(p_element); // add element to DOM
                        this.setState({
                            nickname: nickname
                        })
                        this.render();
                    }
                }
            })
    }

    // find the host for the room and get their access token
    getHostToken = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                host_key: this.state.host_key,
            })
        };
        fetch("/spotify/getHostToken", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState(
                    {host_token: data.token}
                );
            })
    }

    // retrieve all the relevant details of the room
    // is_host will be checked on backend to determine whether or not the user who just joined the room is the host
    // and returns true/false
    getRoomDetails() {
        return fetch("/frontCode/getRoom" + "?code=" + this.code)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    vote_to_skip: data.vote_to_skip,
                    can_pause: data.can_pause,
                    is_host: data.is_host,
                    host_key: data.host,
                });
                this.getHostToken(); // once the hosts key is fetched, get their token
                this.handlePlayerDisplay();
            });
    }

    // render the Spotify Player SDK, some CSS makes this invisible for other users
    // we have to do this because otherwise music will not be streamed through the website for them
    // this is due to the SDK and we can't change that as of now
    renderPlayer = () => {
        if (this.state.host_token !== null) {
            return <SpotifyPlayer syncExternalDevice={true} token={this.state.host_token} autoPlay={true} magnifySliderOnHover={true} styles={{
                activeColor: 'white',
                bgColor: 'white',
                color: '#28a745',
                loaderColor: 'white',
                sliderColor: '#1cb954',
                sliderHandleColor: '#28a745',
                trackArtistColor: 'black',
                trackNameColor: 'black',
              }} uris="spotify:track:4uLU6hMCjMI75M1A2tKUQC" initialVolume={0.1} />
        }
    }

    // get all the relevant data for the player to be displayed to non-host users
    getFakePlayer = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                this.setState({
                    is_playing: data.is_playing,
                    progress_ms: data.progress_ms,
                    image: data.item.album.images[0].url,
                    duration_ms: data.item.duration_ms,
                    song_name: data.item.name,
                    artist: data.item.artists[0].name
                });
            }
        });
    }

    // choose the relevant player to be displayed depending on host status
    handlePlayerDisplay = () => {
        if (this.state.is_host) {
            document.getElementById("join_player").style.display = "none";
        } else {
            document.getElementById("host_player").style.display = "none";
        }
    }

    // change play/pause button when clicked
    handlePauseChange = () => {
        if (this.state.is_playing) {
            document.getElementById("pause_button").innerHTML = "Pause"
        } else {
            document.getElementById("pause_button").innerHTML = "Play"
        }
    }

    // check if users are allowed to pause in the room
    // check if they are the host
    // if either is true, send a request to Spotify to pause/play the current song
    pauseJoinPlayer = (token) => {
        if (this.state.can_pause || this.state.is_host){
            if (this.state.is_playing) {
                $.ajax({
                    url: "https://api.spotify.com/v1/me/player/pause",
                    type: "PUT",
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    },
                    success: (data) => {
                        this.setState({
                            is_playing: false
                        })
                    }
                });
            } else {
                $.ajax({
                    url: "https://api.spotify.com/v1/me/player/play",
                    type: "PUT",
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    },
                    success: (data) => {
                        this.setState({
                            is_playing: true
                        })
                    }
                });
            }
        } else {
            alert("This room does not allow non-host users to pause/play.");
        }
    }

    // this handles all the necessary computations for voting to skip songs
    skipJoinPlayer = (token) => {
        if (this.state.skip_count >= (this.state.vote_to_skip)) {
            $.ajax({
                url: "https://api.spotify.com/v1/me/player/next",
                type: "POST",
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                },
                success: (data) => {
                    this.setState({
                        skip_count: 0,
                        skipUserList: []
                    })
                }
            });
        } else {
            // check if the user who voted is not in the list
            if ((this.state.skipUserList.indexOf(this.state.display_name) === -1) && (this.state.skipUserList.indexOf(this.state.nickname) === -1)) {
                this.setState({
                    skip_count: this.state.skip_count + 1
                })
                this.setState(state => {
                    var username = null;
                    if (this.state.display_name !== null) {
                        username = this.state.display_name;
                    } else if (this.state.nickname !== null) {
                        username = this.state.nickname;
                    }
                    // add them to a list of users who have voted
                    const skipUserList = state.skipUserList.concat(username);
                    return {
                        skipUserList
                    };
                })
            } else {
                alert("You've already voted to skip.")
            }
        }
    }

    // this calls to the backend to delete the room when the host leaves
    leaveRoom = () => {
        if (this.state.is_host) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: this.state.code,
                })
            };
            fetch("/frontCode/leaveRoom", requestOptions)
                .then((response) => {
                    if (response.ok) {
                        this.props.history.push(`/room/${this.state.code}`); // forces page refresh in case of error
                    } else {
                        this.setState({ error: "Room not found." });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    document.getElementById("invalid_code").innerHTML = "Room not found";
                });
        }
    }

    // decides whether to render room instructions based on user preference
    handleHideInstructions = () => {
        var instructions = document.getElementById("sub_guide_1").innerHTML;
        console.log(instructions);
        if (instructions == "") {
            document.getElementById("instructions_button").innerHTML = "Hide Instructions";
            document.getElementById("sub_guide_1").innerHTML = "Open Spotify and select a song to start playing it. You may need to select SPOTIFY WEB PLAYER in the bottom right corner of this page. For now a placeholder song will play. If you are the host, clicking 'Return' here will delete the room.";
        } else {
            document.getElementById("instructions_button").innerHTML = "Show Instructions";
            document.getElementById("sub_guide_1").innerHTML = "";
        }
    }

    
    // handleShowSettingsChange = () => {
    //     if(this.state.show_settings){
    //         this.setState({
    //             show_settings: false
    //         })
    //     } else {
    //         this.setState({
    //             show_settings: true
    //         })
    //     }
    // }
    
    // renderSettings = () => {
    //     if(this.state.show_settings){
    //         return (
    //             <div id="update_details" className="col text-center">
    //                 <div>
    //                     <h4>Play/Pause:</h4>
    //                     <form>
    //                         <label>Yes</label>
    //                         <input type="radio" id="yes_button" value="true" />
    //                         <label className="ml-2">No</label>
    //                         <input type="radio" id="no_button" value="false" />
    //                     </form>
    //                 </div>
    //                 <div>
    //                     <h4>Votes to Skip:</h4>
    //                     <input type="number" id="votes" min="0" max="999999" />
    //                 </div>
    //                 <button className="btn" onClick={this.handleUpdateRoomButtonPressed}>Update</button>
    //             </div>
    //         );
    //     } else {
    //         return (
    //             <div></div>
    //         )
    //     }
    // }

    // handleUpdateRoomButtonPressed = () => {
    //     var votes = document.getElementById("votes").value;
    //     var pausePlay = "not set";

    //     if (votes != this.state.vote_to_skip) {
    //         if((votes <= 999999) && (0 <= votes)){
    //             this.setState({
    //                 vote_to_skip: votes,
    //                 show_settings: false
    //             })
    //         } else {
    //             alert("Invalid number of votes. Select a number between 0 and 999,999.");
    //         }
    //     }
    //     this.handleUpdateRoom();
    // }

    // handleUpdateRoom = () => {
    //     console.log(this.code);
	// 	const requestOptions = {
	// 		method: "PATCH",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			vote_to_skip: this.state.vote_to_skip,
	// 			can_pause: this.state.can_pause,
	// 			code: this.code
	// 		}),
	// 	};
	// 	fetch("/frontCode/updateRoom", requestOptions).then((response) => {
	// 		if (response.ok) {
	// 			this.setState({
	// 				msg: "Room Updated!"
	// 			});
	// 		} else {
	// 			this.setState({
	// 				msg: "Error while updating room."
	// 			});
	// 		}
	// 	});
	// }

    // renderSettingsButton = () => {
    //     return (
    //         <button id="settings_button" className="btn" onClick={this.handleShowSettingsChange}>Settings</button>
    //     );
    // }

    // changes url to Home page
    homePage = () => {
        this.leaveRoom();
        window.location.replace("/");
    }

    render(){
        return (
            <main className="content">
                <header className="mb-2">
                    <h2 id="code_heading_1" className="text-center">Room Code: {this.code}</h2>
                    <button id="return" className="btn" onClick={this.homePage}>Return</button>
                </header>
                <div id="room_grid">
                    <div id="user_list" className="border border-success rounded">
                        <h4 id="user_heading">USER LIST</h4>
                        <p dangerouslySetInnerHTML={{__html: this.state.display_name}}></p>
                    </div>
                    <div id="guide">
                        <button className="btn" id="instructions_button" onClick={this.handleHideInstructions}>Hide Instructions</button>
                        <p id="sub_guide_1">
                            Open Spotify and select a song to start playing it. You may need to select
                            SPOTIFY WEB PLAYER in the bottom right corner of this page. For now a placeholder
                            song will play. If you are the host, clicking 'Return' here will delete the room.
                        </p>
                        <div id="sub_guide_2">
                            <p id="votes_to_skip">Votes to skip: {this.state.vote_to_skip} </p>
                            <button id="pause_button" className="btn bg-success" onClick={() => this.pauseJoinPlayer(this.state.host_token)}>Pause</button>
                            <button id="skip_button" className="btn bg-success" onClick={() => this.skipJoinPlayer(this.state.host_token)}>Skip</button>
                        </div>
                        {/* <div>
                            {this.state.is_host ? this.renderSettingsButton() : null}
                        </div>
                        {this.renderSettings()} */}
                    </div>
                    <div id="chat" className="border rounded">
                        TEMP CONTAINER FOR CHAT
                    </div>
                </div>
                <div id="join_player">
                    {/* renders our JoinPlayer component with all the relevant data we fetched */}
                    <JoinPlayer is_playing={this.state.is_playing} duration_ms={this.state.duration_ms} progress_ms={this.state.progress_ms} image={this.state.image} songName={this.state.song_name} artistName={this.state.artist} />
                </div>
                <footer id="host_player" className="footer fixed-bottom">
                    {this.renderPlayer()}
                </footer>
            </main>
        );
    }
}

export default Room;
