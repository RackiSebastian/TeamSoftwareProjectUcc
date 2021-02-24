import React, {Component} from "react";
import SpotifyPlayer from "react-spotify-web-playback";

class Room extends Component {

    constructor() {
        super();
        this.state = {
            display_name: null,
            token: null // access_token is set here
        };
    }

    componentDidMount() {
        this.getToken();
    }

    componentDidUpdate() {
        if (this.state.display_name === null) {
            this.getUsername(this.state.token);
        }
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
            }
        });
    }

    getToken = () => {
        fetch("/spotify/getToken")
            .then((response) => response.json())
            .then((data) => {
                this.setState(
                    {token: data.token}
                );
            })
            .catch(data => {
                var p_element = document.createElement("p");
                var nickname = null;
                while (nickname === null) {
                    nickname = prompt("Enter name");
                }
                if (nickname) {
                    var node = document.createTextNode(nickname);
                    p_element.appendChild(node);
                    var container = document.getElementById("user-list");
                    container.appendChild(p_element);
                }
            })
    }

    renderPlayer = () => {
        if(this.state.token !== null){
            return <SpotifyPlayer syncExternalDevice={true} token={this.state.token} autoPlay={true} magnifySliderOnHover={true} styles={{
                activeColor: '#fff',
                bgColor: '#fff',
                color: '#28a745',
                loaderColor: '#fff',
                sliderColor: '#1cb954',
                sliderHandleColor: '#28a745',
                trackArtistColor: '#ccc',
                trackNameColor: '#fff',
              }}/>
        }
    }

    homePage = () => {
        window.location.replace("/");
    }

    render(){
        return (
            <main className="content">
                <header className="mb-2">
                    <h2 id="code_heading_1" className="text-center">Room Code: </h2>
                    <h2 id="code_heading_2"></h2>
                    <button id="return" className="btn" onClick={this.homePage}>Return</button>
                </header>
                <div id="room_grid">
                    <div id="user_list" className="border border-success rounded">
                        <h4 id="user_heading">USER LIST</h4>
                        <p dangerouslySetInnerHTML={{__html: this.state.display_name}}></p>
                    </div>
                </div>
                <footer>
                    {this.renderPlayer()}
                </footer>
            </main>
        );
    }
}

export default Room;
