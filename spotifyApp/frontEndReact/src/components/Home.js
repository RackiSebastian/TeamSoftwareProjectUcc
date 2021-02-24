import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import Cookies from "js-cookie";


class Home extends Component {
    constructor() {
        super();
        this.state = {
            //inputBox: null,
            redirectJoin: false,
            redirectCreate: false,
            authenticated: false,
            display_name: null,
            token: null // access_token is set here
        };
        this.authenticate = this.authenticate.bind(this);
    }

    componentDidMount() {
        this.getToken();
    }

    componentDidUpdate() {
        if (this.state.display_name === null) {
            this.getUsername(this.state.token);
        }
    }

    authenticate() {
        fetch("/spotify/authenticated")
            .then((response) => response.json())
            .then((data) => {
                this.setState({authenticated: data.status});
                console.log(data.status);
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        })
                }
        });
    }

    getUsername = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                this.setState({
                    display_name: data.display_name
                });
                document.getElementById("heading_start").innerHTML = "Welcome to Spotify Groups, ";
                document.getElementById("heading_end").innerHTML = "!";
            }
        });
    }
  
    handleChange = ({target}) => {
        this.setState({
            [target.name]: target.value
        });
    }

    renderRedirectCreate = () => {
        if (this.state.redirectCreate) {
            return <Redirect to='/create' />
        }
    }

    renderRedirectJoin = () => {
        if (this.state.redirectJoin) {
            return <Redirect to='/join' />
        }
    }

    goToRoom = (event) => {
        if(event.target.id == "join_button"){
            //if(document.getElementById("room_code").value.length !== 4){
            //    document.getElementById("invalid_code").innerHTML = "Invalid Room Code";
            //} else {
                this.setState({redirectJoin: true})
            //}
            console.log(this.state.token);
        } else {
            this.authenticate();
            this.setState({redirectCreate: true})
        }
    }

    getToken = () => {
        fetch("/spotify/getToken")
            .then((response) => response.json())
            .then((data) => {
                this.setState(
                    {token: data.token}
                );
        })
    }

    render() {
        return (
        <main className="content">
            <header>
                <h2 id="heading_start" className="text-center">Welcome to Spotify Groups!</h2>
                <h2 className="text-center" dangerouslySetInnerHTML={{__html: this.state.display_name}}></h2>
                <h2 id="heading_end"></h2>
            </header>
            <div className="col text-center">
                <div>
                    <img src="../../static/images/spotifylogo.png" id="logo" className="App-logo"/>
                    {this.renderRedirectJoin()}
                    {this.renderRedirectCreate()}
                    <button id="join_button" className="btn" onClick={this.goToRoom}>Join Room</button>
                    <button id="create_button" className="btn" onClick={this.goToRoom}>Create Room</button>
                </div>
            </div>
        </main>
        );
    }
}
// Moved code input box to Join Room page
//  <p id="invalid_code"></p>
//  <input type="text" id="room_code" value={this.state.inputBox} onChange={this.handleChange} placeholder="Room code..." maxLength="4" />

export default Home;
