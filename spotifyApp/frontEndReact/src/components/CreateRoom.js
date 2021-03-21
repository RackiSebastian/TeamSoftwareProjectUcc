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
			msg: ""
		}
		this.handleCreateRoomButtonPressed = this.handleCreateRoomButtonPressed.bind(this);
		this.handleVoteChange = this.handleVoteChange.bind(this);
    	this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
		this.handleUpdateRoomButtonPressed = this.handleUpdateRoomButtonPressed.bind(this);
	}
	
	componentDidMount() {
		document.getElementById("votes").defaultValue = "1"; // shows the user what the default room values are
	}

	// checks for input box value change
	handleVoteChange(e) {
		this.setState({
		  	vote_to_skip: e.target.value,
		});
	}
	
	// checks for radio button value change
	handleGuestCanPauseChange(e) {
		this.setState({
			can_pause: e.target.value === "true" ? true : false,
		});
	}

	// creates room in database with input or default information
	handleCreateRoomButtonPressed() {
		if((this.state.vote_to_skip <= 999999) && (0 <= this.state.vote_to_skip)){
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
		} else {
			alert("Invalid number of votes. Select a number between 0 and 999,999.");
		}
	}

	// renders create button in component
	renderCreateButton = () => {
		return(
			<button id="create_button2" className="btn pl-4 pr-4 mt-2" onClick={this.handleCreateRoomButtonPressed}>Create Room</button>
		);
	}

	handleUpdateRoomButtonPressed() {
		console.log(this.props.update)
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				vote_to_skip: this.state.vote_to_skip,
				can_pause: this.state.can_pause,
				code: this.props.code
			}),
		};
		fetch("/frontCode/updateRoom", requestOptions).then((response) => {
			if (response.ok) {
				this.setState({
					msg: "Room Updated!"
				});
			} else {
				this.setState({
					msg: "Error while updating room."
				});
			}
			this.props.updateCallback();
		});
	}

	renderUpdateButton = () => {
		return (
			<button onClick={this.handleUpdateRoomButtonPressed}>Update Room</button>
		);
	}

	// renders button to go to Home page in this component
	renderLeaveButton = () => {
		return (
			<button id="return" className="btn" onClick={this.homePage}>Return</button>
		)
	}

	// displays relevant notifaction if an error occurs
	displayNotification = () => {
		if (this.state.msg != "") {
			return (
				<div>{this.state.msg}</div>
			)
		}
	}

	// renders instructions about the Spotify Player SDK
	displayInstructions = () => {
		return(
			<p className="mt-3">
				Open the Spotify Player before creating your room,
				otherwise you may run into issues due to the nature
				of the SDK.
			</p>
		)
	}

	// changes url to Home page
	homePage = () => {
        window.location.replace("/");
    }

	render() {
		const heading = this.props.update ? "Update Room" : "Create a Room";

		return (
			// some elements here are only rendered if you are on the CreateRoom page (this.props.update ? ...)
			<main>
				<header>
					<h2 id="create_heading">Create a Room</h2>
                    {this.props.update ? null : this.renderLeaveButton()}
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
										<input type="radio" value="true" checked="checked" name="answer" onChange={this.handleGuestCanPauseChange}/>
										<label className="ml-2">No</label>
										<input type="radio" value="false" name="answer" onChange={this.handleGuestCanPauseChange}/>
									</form>
								</div>
								<div id="side_2">
									<h4>Votes to Skip:</h4>
									<input type="number" id="votes" min="0" max="999999" onChange={this.handleVoteChange}/>
								</div>
							</div>
							{this.props.update ? this.renderUpdateButton() : this.renderCreateButton()}
							{this.props.update ? this.displayNotification() : null}
						</div>
						{this.props.update ? null : this.displayInstructions()}
					</div>
				</body>
			</main>
		);
	}
}

export default CreateRoom;