import React from "react";
import "../../static/css/Player.css"

const Player = props => {
  const backgroundStyles = {
    backgroundImage:`url(${props.image})`,
  };
  
  const progressBarStyles = {
    width: (props.progress_ms * 100 / props.duration_ms) + '%'
  };
  
  return (
    <div className="main-wrapper">
        <div id="info">
            <img src={props.image} id="track_image"/>
            <div id="basic_info"> 
                <div id="status">
                    {props.is_playing ? "Playing" : "Paused"}
                </div>
                <div id="name">{props.name}</div>
                <div id="progress">
                    <div id="progress_bar" style={progressBarStyles} />
                </div>
            </div>
        </div>
    </div>
  );
}
export default Player;