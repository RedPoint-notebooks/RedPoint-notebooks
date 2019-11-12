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
        console.log(message.type);

        switch (message.type) {
          case "stdout":
            this.setState({ response: message.data });
            break;
        }
      };
    };

    const test = () => {
      if (this.state.sent === false) {
        let fakeCode = ["const a = 50\nconst b = 100\n console.log(a + b)"];
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
          <h4>Websocket Response: {this.state.response}</h4>
        </ul>
      </div>
    );
  }
}

export default Notebook;
