import React, {Component} from "react";
import Home from "./Home";
import Room from "./Room";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import {Route} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
    this.clearRoom = this.clearRoom.bind(this);
  }

  async componentDidMount() {
    fetch("/frontCode/user")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          code: data.code,
        });
      });
  }
  
  clearRoom() {
    this.setState({
      code: null,
    });
  }
    
  render() {
    return (
      // the Routes below allow for the content to be changed to the respective file rather than moving the user around
      <div className="spotify">
        <Route exact path="/" component={Home} /> {/* starts page content as Home.js */}
        <Route exact path="/join" component={JoinRoom} />
        <Route exact path="/create" component={CreateRoom} />
        <Route exact path="/room/:code" render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoom} />; // prevents users from entering bad codes in the url
        }} />
      </div>
    );
  }
}
export default App;
