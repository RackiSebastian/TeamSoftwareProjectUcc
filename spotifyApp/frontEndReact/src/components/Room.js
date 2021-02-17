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
            token: 'BQBMT30l2Obwtmko15LJiRevFfgn7S9-fV6-2RYJ_HGhKwol4Qzb0Nb3s-Y2R7tyWPGJyfEobTTXy7nIiPEyWtCbJoERumnX6y022Z5AWeY-r5bTikP39MGGB8MRZwsyCFoHwRH5O8Y1pCcZOdwQDLmtPHtJLh3yilNkvy0M7tO88VmqJA' // access token is set here
        };
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

    render(){
        return (
            <main className="content" onLoad={() => this.getPlayer(this.state.token)}>
                <h1 className="text-success">TestRoom</h1>
                <Player 
                    is_playing={this.state.is_playing}
                    progress_ms={this.progress_ms}
                    image={this.state.image}
                    name={this.state.name}
                    duration_ms={this.state.duration_ms}
                />
                <button className="btn" onClick={() => this.getPlayer(this.state.token)}>View Song</button>
            </main>
        );
    }
}

export default Room;
