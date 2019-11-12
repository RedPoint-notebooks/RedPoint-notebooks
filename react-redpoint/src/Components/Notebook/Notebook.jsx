import React, { Component } from "react";

let ws;

class Notebook extends Component {
  state = {
    sent: false
  };

  componentDidMount() {
    ws = new WebSocket("ws://localhost:8000");
    ws.onopen = event => {
      // receiving the message from server
      let currentCell = 0;
      ws.onmessage = message => {
        message = JSON.parse(message.data);
        console.log(message.data);
      };
    };

    const test = () => {
      if (this.state.sent === false) {
        let fakeCode = ["console.log(90210)"];
        const json = JSON.stringify(fakeCode);
        ws.send(json);
      }
    };

    setTimeout(test, 1000);
  }

  render() {
    return (
      <div>
        <ul>
          <li>{this.state.response}</li>
        </ul>
      </div>
    );
  }
}

export default Notebook;
