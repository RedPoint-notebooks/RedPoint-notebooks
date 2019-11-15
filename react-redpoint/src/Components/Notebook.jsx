import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";
// import ConfirmAction from "./Shared/ConfirmAction";
import uuidv4 from "uuid";

class Notebook extends Component {
  state = {
    defaultLanguage: "Javascript",
    cells: [
      // {
      //   type: "Markdown",
      //   code:
      //     "# Welcome to RedPoint Notebook\n- A virtual sandbox for sharing runnable code ",
      //   rendered: true
      // },
      {
        type: "Javascript",
        code: "console.log('hi');\nconsole.log('there');",
        results: { output: [], error: "", return: "" }
      },
      {
        type: "Ruby",
        code: "puts 'hi guys!'",
        results: { output: [], error: "", return: "" }
      }
      // {
      //   type: "Javascript",
      //   code: "console.log('Hello, nice to meet you.');\nname",
      //   results: { output: [], error: "", return: "" }
      // }
    ],
    // pendingCellExecution: true,
    pendingCellIndexes: [],
    writeToPendingCellIndex: 0
  };

  ws = new WebSocket("ws://localhost:8000");

  componentDidMount() {
    this.ws.onopen = event => {
      console.log("Websockets open!");
    };

    this.ws.onmessage = message => {
      message = JSON.parse(message.data);
      const cellIndex = this.state.pendingCellIndexes[
        this.state.writeToPendingCellIndex
      ];

      console.log(message.data);
      switch (message.type) {
        case "delimiter":
          this.setState(prevState => {
            return {
              writeToPendingCellIndex: prevState.writeToPendingCellIndex + 1
            };
          });
          break;
        case "stdout":
          this.updateCellResults("output", cellIndex, message);
          break;
        case "return":
          this.updateCellResults("return", cellIndex, message);
          break;
        case "error":
        case "stderr":
          this.updateCellResults("error", cellIndex, message);
          break;
        case "loadNotebook":
          console.log("Received notebook data from server!");
          console.dir(message.data);
          break;
        default:
          console.log("Error: Unknown message received from server");
      }
    };
  }

  updateCellResults = (resultType, cellIndex, message) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells].map((cell, index) => {
        if (index === cellIndex) {
          if (resultType === "output") {
            cell.results[resultType].push(message.data);
          } else {
            cell.results[resultType] += message.data;
          }
        }
        return cell;
      });
      return { cells: newCells };
    });
  };

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

  handleDeleteAllCells = () => {
    this.setState({
      defaultLanguage: "Javascript",
      cells: [],
      // pendingCellExecution: true,
      pendingCellIndexes: [],
      writeToPendingCellIndex: 0
    });
  };

  handleAddCellClick = (index, type) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 0, {
        type: type,
        code: "",
        results: { output: [], error: "", return: "" }
      });
      return { cells: newCells };
    });
  };

  buildRequest = (indexOfCellRun, language) => {
    const codeStrArray = [];
    const allCells = this.state.cells;
    const pendingCellIndexes = [];
    for (let i = 0; i <= indexOfCellRun; i += 1) {
      const cell = allCells[i];
      if (i <= indexOfCellRun && cell.type === language) {
        codeStrArray.push(cell.code);
        pendingCellIndexes.push(i);
      }
    }
    this.setState({ pendingCellIndexes, writeToPendingCellIndex: 0 });
    return { language, codeStrArray };
  };

  removeSameLanguageResults = language => {
    const newCells = this.state.cells.map(cell => {
      if (cell.type === language) {
        return Object.assign({}, cell, {
          results: { output: [], error: "", return: "" }
        });
      } else {
        return cell;
      }
    });

    this.setState({ cells: newCells });
  };

  handleRunClick = indexOfCellRun => {
    const allCells = this.state.cells;
    const language = allCells[indexOfCellRun].type;
    this.removeSameLanguageResults(language);
    const requestObject = this.buildRequest(indexOfCellRun, language);
    this.ws.send(JSON.stringify(requestObject));
  };

  handleSaveClick = e => {
    e.preventDefault();
    const messageType = "saveNotebook";
    const state = this.state;
    const notebookId = uuidv4();
    const notebook = { id: notebookId, state };
    const request = JSON.stringify({ messageType, notebook });
    console.log("Notebook save request sent");
    this.ws.send(request);
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
          deleteAllCells={this.handleDeleteAllCells}
          setDefaultLanguage={this.handleSetDefaultLanguage}
          onSaveClick={this.handleSaveClick}
        />
        {/* {this.state.deleteWarningVisible ? (
          <ConfirmAction
            warningMessage="Delete this cell?"
            onYesClick={this.handleDeleteCell}
            onNoClick={this.toggleDeleteWarningVisibility}
          />
        ) : null} */}
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
