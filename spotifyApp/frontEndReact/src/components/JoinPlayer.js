import React from "react";
import "../../static/css/joinplayer.css";

const JoinPlayer = props => {
      
    const progressBarStyles = {
        width: (props.progress_ms * 100 / props.duration_ms) + '%'
    };
      
    return (
        <div id="joinplayer_grid">
            <div id="song_image">
                <img src={props.image} />
            </div>
            <div id="song_details">
                <div id="song_name">
                    {props.songName} - {props.artistName}
                </div>
                <div id="is_playing">
                    {props.is_playing ? "Playing" : "Paused"}
                </div>
            </div>
            <div id="progess" className="progress">
                <div
                    className="progress-bar bg-success"
                    style={progressBarStyles}
                    aria-valuemin="0" aria-valuemax="100"
                />
            </div>
        </div>
      );
}

export default JoinPlayer;