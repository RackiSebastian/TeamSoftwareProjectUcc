 // frontend/src/App.js

import React, {Component} from "react";
import Home from "./Home";
import Room from "./Room";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import {Route} from 'react-router-dom';

class App extends Component {
    
  render() {
    return (
      <div className="spotify">
        <Route exact path="/" component={Home} />
        <Route exact path="/join" component={JoinRoom} />
        <Route exact path="/create" component={CreateRoom} />
        <Route exact path="/room" component={Room} />
      </div>
    );
  }
}
export default App;
