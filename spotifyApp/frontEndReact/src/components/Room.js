import React, {Component} from "react";
import Player from "./Player.js";
import SpotifyPlayer from "react-spotify-web-playback";

class Room extends Component {

    constructor() {
        super();
        this.state = {
            progress_ms: null,
            track: null,
            is_playing: null,
            image: null,
            name: null,
            duration_ms: null,
            display_name: null,
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
        if (this.state.track === null) {
            this.getPlayer(this.state.token);
        }
    }

    getPlayer = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                this.setState({
                    progress_ms: data.progress_ms,
                    track: data.item.external_urls.href,
                    is_playing: data.is_playing,
                    image: data.item.album.images[0].url,
                    name: data.item.name,
                    duration_ms: data.item.duration_ms
                });
            }
        });
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
            },
            error: () => {
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
    }

    render(){
        return (
            <main className="content">
                <header className="mb-2">
                    <h2 id="heading_start" className="text-center">Room Code: </h2>
                    <h2 id="heading_end"></h2>
                </header>
                <div id="our-grid">
                    <div id="user-list" className="border border-success rounded">
                        <p dangerouslySetInnerHTML={{__html: this.state.display_name}}></p>
                    </div>
                </div>
                <footer>
                    <SpotifyPlayer
                        syncExternalDevice={true}
                        token={this.state.token}
                    />
                </footer>
            </main>
        );
    }
}

export default Room;
