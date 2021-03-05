import React, {Component} from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import JoinPlayer from "./JoinPlayer.js";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display_name: null,
            nickname: null,
            can_pause: true,
            vote_to_skip: 1,
            skip_count: 0,
            session_key: null,
            is_host: false,
            is_playing: null,
            progress_ms: null,
            image: null,
            duration_ms: null,
            song_name: null,
            artist: null,
            skipUserList: [],
            token: null // access_token is set here
        };
        this.code = this.props.match.params.code; // to get the room code
        this.getRoomDetails();
    }

    componentDidMount() {
        this.getToken();
        this.interval = setInterval(() => this.getFakePlayer(this.state.token), 500);
    }

    componentDidUpdate() {
        if (this.state.display_name === null) {
            this.getUsername(this.state.token);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

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

    getToken = () => {
        fetch("/spotify/getToken")
            .then((response) => response.json())
            .then((data) => {
                this.setState(
                    {token: data.token, session_key: data.session_key}
                );
            })
            .catch(data => {
                var p_element = document.createElement("p");
                var nickname = null;
                while (nickname === null) {
                    nickname = prompt("Enter name");
                }
                if (nickname) {
                    var node = document.createTextNode(nickname);
                    p_element.appendChild(node);
                    var container = document.getElementById("user_list");
                    container.appendChild(p_element);
                    this.setState({
                        nickname: nickname
                    })
                }
            })
    }

    getRoomDetails() {
        return fetch("/frontCode/getRoom" + "?code=" + this.code)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              votes_to_skip: data.votes_to_skip,
              can_pause: data.can_pause,
              is_host: data.is_host,
            });
          });
      }

    renderPlayer = () => {
        if (this.state.token !== null) {
            return <SpotifyPlayer syncExternalDevice={true} token={this.state.token} autoPlay={true} magnifySliderOnHover={true} styles={{
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

    pauseJoinPlayer = (token) => {
        if (this.state.can_pause){
            if (this.state.is_playing) {
                $.ajax({
                    url: "https://api.spotify.com/v1/me/player/pause",
                    type: "PUT",
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    },
                    success: (data) => {
                        document.getElementById("pause_button").innerHTML = "Play"
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
                        document.getElementById("pause_button").innerHTML = "Pause"
                    }
                });
            }
        } else {
            alert("This room does not allow non-host users to pause/play.");
        }
    }

    skipJoinPlayer = (token) => {
        if (this.state.skip_count >= (this.state.vote_to_skip -1)) {
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
            if (this.state.skipUserList.indexOf(this.state.display_name) === -1) {
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

    homePage = () => {
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
                        <p>
                        Open Spotify and select a song to start playing it. You may need to select
                        SPOTIFY WEB PLAYER in the bottom right corner of this page. For now a placeholder
                        song will play.
                        </p>
                        <div id="room_details_1" className="text-center">
                            <p>Can pause: </p>
                            <p dangerouslySetInnerHTML={{__html: this.state.can_pause}}></p>
                        </div>
                        <div id="room_details_1" className="text-center">
                            <p>Votes to skip: </p>
                            <p dangerouslySetInnerHTML={{__html: this.state.vote_to_skip}}></p>
                        </div>
                    </div>
                    <div id="joinplayer_buttons">
                        <button id="pause_button" onClick={() => this.pauseJoinPlayer(this.state.token)}>Pause</button>
                        <button id="skip_button" onClick={() => this.skipJoinPlayer(this.state.token)}>Skip</button>
                    </div>
                    <div id="chat" className="border border-success rounded">
                        TEMP CONTAINER FOR CHAT
                    </div>
                </div>
                <JoinPlayer is_playing={this.state.is_playing} duration_ms={this.state.duration_ms} progress_ms={this.state.progress_ms} image={this.state.image} songName={this.state.song_name} artistName={this.state.artist} />
                <footer className="footer">
                    {this.renderPlayer()}
                </footer>
            </main>
        );
    }
}

export default Room;
