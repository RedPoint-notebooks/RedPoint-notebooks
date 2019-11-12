import React, { Component } from "react";
import CellsList from "./Cells/CellsList";

let ws;

class Notebook extends Component {
  state = {};

  // componentDidMount() {
  //   ws = new WebSocket("ws://localhost:8000");
  //   ws.onopen = event => {
  //     // receiving the message from server
  //     let currentCell = 0;
  //     ws.onmessage = message => {
  //       message = JSON.parse(message.data);
  //       console.log(message.data);
  //       console.log(message.type);

  //       switch (message.type) {
  //         case "stdout":
  //           this.setState({ response: message.data });
  //           break;
  //         default:
  //           console.log("No stdout received");
  //       }
  //     };
  //   };

  //   const test = () => {
  //     let fakeCode = ["const a = 150\nconst b = 100\n console.log(a + b)"];
  //     const json = JSON.stringify(fakeCode);
  //     ws.send(json);
  //   };

  //   setTimeout(test, 1000);
  // }

  render() {
    return (
      <div>
        <CellsList />
        {/* <ul>
          <h4>Websocket Response: {this.state.response}</h4>
        </ul> */}
      </div>
    );
  }
}

export default Notebook;
