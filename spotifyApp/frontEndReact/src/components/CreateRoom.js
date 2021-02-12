import React,{Component} from "react"; 


export default class CreateRoom extends Component{
	static defaultProps = {
		votesToSkip: 0,
		guestCanPause: true: 
		update:false,
		roomCode: null,
		updateCallBack: () => {},

	}
};

constructor(props) {
	super(props);
	this.state = {
		guestCanPause: this.props.guestCanPause,
		errorMsg: "",
		successMsg: "",
	}
	this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
}

handleRoomButtonPressed(){
	const requestOptions = {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body:JSON.stringify({
			guestCanPause:this.state.guestCanPause,
		})
	};
	fetch("spotifyAPI/frontCode/create-room",requestOptions){
		.then((response) =>response.json())
		.then((data) = > this.props.history.push("/"))
	}
}