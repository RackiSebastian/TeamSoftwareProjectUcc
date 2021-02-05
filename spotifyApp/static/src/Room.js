import React, {Component} from "react";

const todoItems = [
    {
      id: 1,
      code: "help",
      host: "testhostname",
      can_pause: true,
      vote_to_skip: 1
    }
];

class Room extends Component {
    render(){
        return (
            <main className="content">
                <h1 className="text-success">TestRoom</h1>
            </main>
        );
    }
}

export default Room;
