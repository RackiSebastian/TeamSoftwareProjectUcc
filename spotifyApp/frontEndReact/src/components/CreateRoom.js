import React, {Component} from "react"; 
import '../../static/css/createroom.css';

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
			.then((data) => this.props.history.push("/room/" + data.code));
	}

	homePage = () => {
        window.location.replace("/");
    }

	render() {
		return (
			<main>
				<header>
					<h2 id="create_heading">Create a Room</h2>
                    <button id="return" className="btn" onClick={this.homePage}>Return</button>
				</header>
				<body className="col text-center">
					<div id="guest_container">
						<h3>Guest Control</h3>
						<div id="create" className="col text-center">
							<div id="grid">
							<div id="side_1">
								<h4>Play/Pause:</h4>
								<form>
									<label>Yes</label>
									<input type="radio" value="true" name="answer" onChange={this.handleGuestCanPauseChange}/>
									<label className="ml-2">No</label>
									<input type="radio" value="false" name="answer" onChange={this.handleGuestCanPauseChange}/>
								</form>
							</div>
							<div id="side_2">
								<h4>Votes to Skip:</h4>
								<input type="number" min="0" onChange={this.handleVoteChange}/>
							</div>
							</div>
							<button id="create_button2" className="btn pl-4 pr-4 mt-2" onClick={this.handleCreateRoomButtonPressed}>Create Room</button>
						</div>
					</div>
				</body>
			</main>
		);
	}
}

export default CreateRoom;