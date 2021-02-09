import React, { Component } from "react";
import {Redirect} from "react-router-dom";


class Home extends Component {
    constructor() {
        super();
        this.state = {
            inputBox: null,
            a: null,
            redirectJoin: false,
            redirectCreate: false
        };
    }
  
    handleChange = ({target}) => {
        this.setState({
            [target.name]: target.value
        });
    }

    renderRedirectCreate = () => {
        if (this.state.redirectCreate) {
            return <Redirect to='/Room' />
        }
    }

    renderRedirectJoin = () => {
        if (this.state.redirectJoin) {
            return <Redirect to='/Room/' />
        }
    }

    goToRoom = (event) => {
        if(event.target.id == "join_button"){
            if(document.getElementById("room_code").value.length !== 4){
                this.setState({a: ''});
                document.getElementById("invalid_code").innerHTML = "Invalid Room Code";
            } else {
                this.setState({redirectJoin: true})
            }
        } else {
            this.setState({redirectCreate: true})
        }
    }
    
    render() {
        return (
        <main className="content">
            <header className="bg-success">
                <h2 className="text-center font-weight-bold pt-1">Welcome to Spotify Groups, [username here]!</h2>
            </header>
            <div className="col text-center">
                <div>
                    <img src="../../static/images/spotifylogo.png" id="logo" className="App-logo"/>
                    {this.renderRedirectJoin()}
                    {this.renderRedirectCreate()}
                    <button id="join_button" className="btn btn-success mr-2 pl-5 pr-5" onClick={this.goToRoom}>Join Room</button>
                    <button id="create_button" className="btn btn-success ml-2 pl-5 pr-5" onClick={this.goToRoom}>Create Room</button>
                </div>
                <p className="mt-2 text-danger" id="invalid_code"></p>
                <input type="text" id="room_code" value={this.state.inputBox} onChange={this.handleChange} placeholder="Room code..." maxLength="4" />
            </div>
        </main>
        );
    }
}

export default Home;
