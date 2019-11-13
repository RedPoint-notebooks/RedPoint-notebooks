import React, { Component } from "react";
import CellsList from "./Cells/CellsList";

import logo from "../placeholder_logo.svg";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";

class Notebook extends Component {
  state = {
    defaultLanguage: "javascript",
    cells: [
      { type: "javascript", code: "console.log('hello');" },
      { type: "javascript", code: "console.log('hello from cell 2');" },
      { type: "markdown", code: "# I'm markdown!!\n- indent " }
    ]
  };

  handleDeleteCellClick = index => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 1);
      return { cells: newCells };
    });
  };

  handleAddCellClick = (index, language = this.state.defaultLanguage) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      console.log("New Cells: ", newCells);
      newCells.splice(index, 0, {
        type: language,
        code: ""
      });
      return { cells: newCells };
    });
  };

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            RedPoint
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Share</Nav.Link>
              <Nav.Link href="#foo">Clone</Nav.Link>
              <Nav.Link href="#link">Delete</Nav.Link>
              <NavDropdown title="Default Language" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Javascript
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Ruby</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Python</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container className="App-header">
          <CellsList
            onDeleteCellClick={this.handleDeleteCellClick}
            onAddCellClick={this.handleAddCellClick}
            cells={this.state.cells}
          />
        </Container>
      </div>
    );
  }
}

export default Notebook;

// DEMO:
// cells: [
//   { type: "markdown", code: "##Title" },
// { type: "javascript", code: "console.log('hello');" }
// ]

{
  /* <ul>
          <h4>Websocket Response: {this.state.response}</h4>
        </ul> */
}

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
