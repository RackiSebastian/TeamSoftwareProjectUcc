 // frontend/src/App.js

    import React, {Component} from "react";
    import Modal from "./components/Modal";
    import axios from "axios";
    import Home from "./Home";
    import Room from "./Room";
    import {Route, Link} from 'react-router-dom'

    class App extends Component {
        
      render() {
        return (
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route exact path="/Room" component={Room} />
          </div>
        );
      }
    }
    export default App;
