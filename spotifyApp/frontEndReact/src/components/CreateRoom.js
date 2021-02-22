import React, {Component} from "react"; 


class CreateRoom extends Component {
	static defaultProps = {
		vote_to_skip: 1,
		can_pause: true,
		update: false,
		code: null,
		updateCallBack: () => {},
	}

	constructor(props) {
		super(props);
		this.state = {
			can_pause: this.props.can_pause,
			vote_to_skip: this.props.vote_to_skip,
			errorMsg: "",
			successMsg: "",
		}
		this.handleCreateRoomButtonPressed = this.handleCreateRoomButtonPressed.bind(this);
		this.handleVoteChange = this.handleVoteChange.bind(this);
    	this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
	}
	
	handleVoteChange(e) {
		this.setState({
		  	vote_to_skip: e.target.value,
		});
	  }
	
	handleGuestCanPauseChange(e) {
		this.setState({
			can_pause: e.target.value === "true" ? true : false,
		});
	}

	handleCreateRoomButtonPressed() {
		const requestOptions = {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				can_pause: this.state.can_pause,
				vote_to_skip: this.state.vote_to_skip
			})
		};
		fetch("/frontCode/createRoom", requestOptions)
			.then((response) => response.json())
			.then((data) => this.props.history.push("/room"));
			//to make it redirect to '/room/####' change to 'this.props.history.push("/room/" + data.code)'
	}

	render() {
		return (
			<main>
				<header>
					<h2>This is the create room page.</h2>
				</header>
				<body>
					<h3>Guest Control</h3>
					<form>
						<label>Play/Pause: </label>
						<input type="radio" value="true" onChange={this.handleGuestCanPauseChange}/>
						<label>No Control: </label>
						<input type="radio" value="false" onChange={this.handleGuestCanPauseChange}/>
					</form>
					<label>Votes to Skip:</label>
					<input type="number" min="0" onChange={this.handleVoteChange}/>
					<br></br>
					<button onClick={this.handleCreateRoomButtonPressed}>Create Room</button>
				</body>
			</main>
		);
	}
}

export default CreateRoom;