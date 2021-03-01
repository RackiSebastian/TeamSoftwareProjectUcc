import React, {Component} from "react";
import SpotifyPlayer from "react-spotify-web-playback";

class Room extends Component {

    constructor() {
        super();
        this.state = {
            display_name: null,
            can_pause: null,
            vote_to_skip: null,
            token: null // access_token is set here
        };
    }

    componentDidMount() {
        this.getToken();
    }

    componentDidUpdate() {
        if (this.state.display_name === null) {
            this.getUsername(this.state.token);
        }
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
                    {token: data.token}
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
                    var container = document.getElementById("user-list");
                    container.appendChild(p_element);
                }
            })
    }

    renderPlayer = () => {
        if(this.state.token !== null){
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

    homePage = () => {
        window.location.replace("/");
    }

    render(){
        return (
            <main className="content">
                <header className="mb-2">
                    <h2 id="code_heading_1" className="text-center">Room Code: </h2>
                    <h2 id="code_heading_2"></h2>
                    <button id="return" className="btn" onClick={this.homePage}>Return</button>
                </header>
                <div id="room_grid">
                    <div id="user_list" className="border border-success rounded">
                        <h4 id="user_heading">USER LIST</h4>
                        <p dangerouslySetInnerHTML={{__html: this.state.display_name}}></p>
                    </div>
                    <div id="guide">
                        Open Spotify and select a song to start playing it. You may need to select
                        SPOTIFY WEB PLAYER in the bottom right corner of this page. For now a placeholder
                        song to play.
                    </div>
                    <div id="chat" className="border border-success rounded">
                        TEMP CONTAINER FOR CHAT
                    </div>
                </div>
                <footer className="footer">
                    {this.renderPlayer()}
                </footer>
            </main>
        );
    }
}

export default Room;
