import React, { Component } from "react";
import '../../static/css/joinroom.css';


class JoinRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleJoinRoomButtonPressed = this.handleJoinRoomButtonPressed.bind(this);
    }

    // checks for input box value change
    handleTextFieldChange(e) {
        this.setState({
            code: e.target.value,
        });
    }

    // checks to make sure the room exists for the provided room code
    // if it does, redirect user to that room
    handleJoinRoomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.code,
            })
        };
        fetch("/frontCode/joinRoom", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/room/${this.state.code}`);
                } else {
                    this.setState({ error: "Room not found." });
                    document.getElementById("invalid_code").innerHTML = "Room not found";
                }
            })
            .catch((error) => {
                console.log(error);
                document.getElementById("invalid_code").innerHTML = "Room not found";
            });
    }

    // changes url to Home page
    homePage = () => {
        window.location.replace("/");
    }

    render() {
        return (
			<main>
				<header>
					<h2 id="join_heading">Join a Room</h2>
                    <button id="return" className="btn" onClick={this.homePage}>Return</button>
				</header>
				<body>
                    <div id="join" className="col text-center">
                        <div id="input_content">
                            <label>Room Code:</label>
                            <input type="text" id="room_code" value={this.state.code} onChange={this.handleTextFieldChange} maxLength="6" />
                            <br></br>
                            <p id="invalid_code"></p>
                            <button id="join_button2" className="btn pl-4 pr-4 mt-2" onClick={this.handleJoinRoomButtonPressed}>Join Room</button>
                        </div>
                    </div>
				</body>
			</main>
		);
    }
}

export default JoinRoom;