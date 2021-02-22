import React, { Component } from "react";


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

    handleTextFieldChange(e) {
        this.setState({
            code: e.target.value,
        });
    }

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
                    this.props.history.push(`/room`);
                    //to make it redirect to '/room/####' change to 'this.props.history.push(`/room/${this.state.code}`)'
                } else {
                    this.setState({ error: "Room not found." });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
			<main>
				<header>
					<h2>This is the join room page.</h2>
				</header>
				<body>
                <div>
                    <label>Room Code:</label>
                    <input type="text" id="room_code" value={this.state.code} onChange={this.handleTextFieldChange} placeholder="Enter a Room Code" maxLength="6" />
					<br></br>
                    <button onClick={this.handleJoinRoomButtonPressed}>Join Room</button>
                </div>
				</body>
			</main>
		);
    }
}

export default JoinRoom;