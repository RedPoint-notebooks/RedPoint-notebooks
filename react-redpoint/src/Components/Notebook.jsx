import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";

class Notebook extends Component {
  state = {
    defaultLanguage: "Javascript",
    cells: [
      {
        type: "Markdown",
        code:
          "# Welcome to RedPoint Notebook\n- A virtual sandbox for sharing runnable code ",
        rendered: true
      },
      {
        type: "Javascript",
        code: "[1, 2, 3]",
        results: { return: "[1, 2, 3]" }
      },
      {
        type: "Javascript",
        code: "console.log('hello from cell 2');",
        results: { output: "hello from cell 2", return: "undefined" }
      },
      {
        type: "Javascript",
        code: "console.log('Hello, nice to meet you.');\nname",
        results: {
          output: "Hello, nice to meet you.",
          error: "ReferenceError: ve is not defined"
        }
      },
      {
        type: "Markdown",
        code: "### Hi, here is some markdown text.",
        rendered: false
      }
    ]
  };

  // componentDidMount() {
  //   const ws = new WebSocket("ws://localhost:8000");
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
  //     let codeStrArray = ["const a = 150\nconst b = 100\n console.log(a + b)"];
  //     const json = JSON.stringify({ language: "Javascript", codeStrArray });
  //     ws.send(json);
  //   };

  //   setTimeout(test, 1000);
  // }

  handleSetDefaultLanguage = language => {
    this.setState({ defaultLanguage: language });
  };

  handleDeleteCellClick = index => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 1);
      return { cells: newCells };
    });
  };

  handleAddCellClick = (index, type) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 0, {
        type: type,
        code: "",
        results: {}
      });
      return { cells: newCells };
    });
  };

  buildCodeArray = maxIndex => {
    const codeCellArray = [];
    const allCells = this.state.cells;
    const cellLanguage = allCells[maxIndex].type;
    for (let i = 0; i <= maxIndex; i += 1) {
      const cell = allCells[i];
      if (i <= maxIndex && cell.type === cellLanguage) {
        codeCellArray.push(cell.code);
      }
    }
    return codeCellArray;
  };

  handleRunClick = maxIndex => {
    const codeArray = this.buildCodeArray(maxIndex);
  };

  handleLanguageChange = (type, cellIndex) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const changedCell = newCells[cellIndex];
      changedCell.type = type;
      if (type === "Markdown") {
        changedCell.rendered = false;
      }
      return { cells: newCells };
    });
  };

  handleToggleRender = index => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const cellToToggle = newCells[index];
      cellToToggle.rendered = !cellToToggle.rendered;
      return { cells: newCells };
    });
  };

  handleUpdateCodeState = (code, index) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const cellToUpdate = newCells[index];
      cellToUpdate.code = code;
      return { cells: newCells };
    });
  };

  render() {
    return (
      <div>
        <NavigationBar
          state={this.state}
          setDefaultLanguage={this.handleSetDefaultLanguage}
        />
        <Container className="App-header">
          <CellsList
            onDeleteCellClick={this.handleDeleteCellClick}
            onAddCellClick={this.handleAddCellClick}
            cells={this.state.cells}
            defaultLanguage={this.state.defaultLanguage}
            onLanguageChange={this.handleLanguageChange}
            toggleRender={this.handleToggleRender}
            onUpdateCodeState={this.handleUpdateCodeState}
            onRunClick={this.handleRunClick}
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

/* <ul>
          <h4>Websocket Response: {this.state.response}</h4>
        </ul> */
